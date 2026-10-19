const fs = require('fs');
const { initDatabase, closeDb, getDbPath } = require('../server/config/db');

const isReset = process.argv.includes('--reset');

async function main() {
  console.log('=== Inisialisasi Database Inventaris Sekolah ===');

  if (isReset) {
    const dbPath = getDbPath();
    closeDb();
    if (fs.existsSync(dbPath)) {
      console.log(`[Reset] Menghapus database lama: ${dbPath}`);
      fs.unlinkSync(dbPath);
    }
  }

  try {
    await initDatabase();
    console.log('✓ Database dan Seed data berhasil diinisialisasi!');
    console.log(`Lokasi file: ${getDbPath()}`);
  } catch (err) {
    console.error('✗ Gagal inisialisasi database:', err.message);
    process.exit(1);
  } finally {
    closeDb();
  }
}

main();
