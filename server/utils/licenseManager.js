const { getDb, getDbPath } = require('../config/db');
const { generateMultipleLicenseKeys } = require('./licenseGenerator');

/**
 * List all licenses
 */
function listLicenses() {
  const db = getDb();
  return db.prepare('SELECT * FROM licenses ORDER BY created_at DESC').all();
}

/**
 * Check license status
 */
function checkLicense(licenseKey) {
  const db = getDb();
  return db.prepare('SELECT * FROM licenses WHERE license_key = ?').get(licenseKey);
}

/**
 * Revoke a license
 */
function revokeLicense(licenseKey) {
  const db = getDb();
  const result = db.prepare(
    "UPDATE licenses SET status = 'revoked' WHERE license_key = ?"
  ).run(licenseKey);
  return result.changes > 0;
}

/**
 * Insert new license keys into database
 */
function insertLicenseKeys(count, schoolName = 'Unassigned') {
  const db = getDb();
  const keys = generateMultipleLicenseKeys(count);
  const stmt = db.prepare(
    'INSERT INTO licenses (license_key, school_name, status) VALUES (?, ?, ?)'
  );
  
  const insertMany = db.transaction((keys) => {
    for (const key of keys) {
      stmt.run(key, schoolName, 'valid');
    }
  });
  
  insertMany(keys);
  return keys;
}

module.exports = { listLicenses, checkLicense, revokeLicense, insertLicenseKeys };
