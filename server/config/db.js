const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH 
  ? path.resolve(process.env.DB_PATH) 
  : path.join(__dirname, '..', '..', 'database', 'inventaris.db');

let dbInstance = null;
let sqlEngine = null;
let rawSqlJsDb = null;

// Synchronous saver for sql.js changes to file
function persistSqlJs() {
  if (rawSqlJsDb) {
    try {
      const data = rawSqlJsDb.export();
      const buffer = Buffer.from(data);
      const dbDir = path.dirname(DB_PATH);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, buffer);
    } catch (err) {
      console.error('[DB] Persist error:', err.message);
    }
  }
}

function createSqlJsWrapper(sqlDb) {
  rawSqlJsDb = sqlDb;

  return {
    prepare(sql) {
      return {
        all(...params) {
          const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
          const stmt = sqlDb.prepare(sql);
          try {
            if (flatParams.length > 0) {
              stmt.bind(flatParams);
            }
            const results = [];
            while (stmt.step()) {
              results.push(stmt.getAsObject());
            }
            return results;
          } finally {
            stmt.free();
          }
        },
        get(...params) {
          const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
          const stmt = sqlDb.prepare(sql);
          try {
            if (flatParams.length > 0) {
              stmt.bind(flatParams);
            }
            if (stmt.step()) {
              return stmt.getAsObject();
            }
            return undefined;
          } finally {
            stmt.free();
          }
        },
        run(...params) {
          const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
          sqlDb.run(sql, flatParams);
          
          let lastInsertRowid = 0;
          let changes = 0;
          try {
            const lastIdRes = sqlDb.exec('SELECT last_insert_rowid() as id');
            lastInsertRowid = lastIdRes[0]?.values[0]?.[0] || 0;
            const changesRes = sqlDb.exec('SELECT changes() as c');
            changes = changesRes[0]?.values[0]?.[0] || 0;
          } catch (e) {}

          persistSqlJs();

          return { lastInsertRowid, changes };
        }
      };
    },
    exec(sql) {
      sqlDb.exec(sql);
      persistSqlJs();
    },
    transaction(fn) {
      return function (...args) {
        try {
          const res = fn(...args);
          persistSqlJs();
          return res;
        } catch (err) {
          throw err;
        }
      };
    },
    pragma(str) {
      try {
        sqlDb.exec(`PRAGMA ${str};`);
      } catch (e) {}
    }
  };
}

async function initDatabase() {
  if (dbInstance) return dbInstance;

  const dbDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // 1. Try better-sqlite3 first if installed
  try {
    const BetterSqlite3 = require('better-sqlite3');
    const bDb = new BetterSqlite3(DB_PATH);
    bDb.pragma('journal_mode = WAL');
    bDb.pragma('foreign_keys = ON');
    sqlEngine = 'better-sqlite3';
    dbInstance = bDb;
    console.log('[DB] Using better-sqlite3 engine');
  } catch (err) {
    // 2. Fallback to sql.js (WebAssembly)
    const initSqlJs = require('sql.js');
    const SQL = await initSqlJs();
    let buffer = null;
    if (fs.existsSync(DB_PATH)) {
      buffer = fs.readFileSync(DB_PATH);
    }
    const sqlDb = buffer ? new SQL.Database(buffer) : new SQL.Database();
    sqlEngine = 'sql.js';
    dbInstance = createSqlJsWrapper(sqlDb);
    dbInstance.pragma('foreign_keys = ON');
    console.log('[DB] Using sql.js WebAssembly engine');
  }

  // Run schema
  const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    dbInstance.exec(schema);
  }

  // Run seeds
  const seedsPath = path.join(__dirname, '..', '..', 'database', 'seeds.sql');
  if (fs.existsSync(seedsPath)) {
    const seeds = fs.readFileSync(seedsPath, 'utf-8');
    try {
      dbInstance.exec(seeds);
    } catch (e) {
      // Ignore unique constraint
    }
  }

  // Ensure default admin user has valid admin123 password if using corrupted seed hash
  try {
    const adminUser = dbInstance.prepare("SELECT * FROM users WHERE username = 'admin'").get();
    if (adminUser && adminUser.password_hash === '$2a$10$8KzaNdKIMyOkASCOQsBk2OHH9RWmVOFPIez8G8.FjLylyO8Mghte6') {
      const bcrypt = require('bcryptjs');
      const validAdminHash = bcrypt.hashSync('admin123', 10);
      dbInstance.prepare("UPDATE users SET password_hash = ? WHERE username = 'admin'").run(validAdminHash);
    }
  } catch (e) {}

  persistSqlJs();
  console.log('[DB] Database initialized successfully at:', DB_PATH);
  return dbInstance;
}

function getDb() {
  if (!dbInstance) {
    throw new Error('Database belum diinisialisasi. Panggil await initDatabase() terlebih dahulu.');
  }
  return dbInstance;
}

function closeDb() {
  if (sqlEngine === 'better-sqlite3' && dbInstance) {
    dbInstance.close();
  } else if (sqlEngine === 'sql.js') {
    persistSqlJs();
    if (rawSqlJsDb) {
      rawSqlJsDb.close();
      rawSqlJsDb = null;
    }
  }
  dbInstance = null;
}

function getDbPath() {
  return DB_PATH;
}

module.exports = { getDb, initDatabase, closeDb, getDbPath, persistSqlJs };
