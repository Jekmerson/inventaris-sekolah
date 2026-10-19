const { listLicenses, checkLicense, revokeLicense } = require('../server/utils/licenseManager');
const { initDatabase, closeDb } = require('../server/config/db');

const args = process.argv.slice(2);

function showHelp() {
  console.log(`
Penggunaan License Manager:
  node scripts/license-manager.js --list
  node scripts/license-manager.js --check <INV-XXXX-XXXX-XXXX>
  node scripts/license-manager.js --revoke <INV-XXXX-XXXX-XXXX>
  `);
}

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  showHelp();
  process.exit(0);
}

async function main() {
  try {
    await initDatabase();

    if (args.includes('--list')) {
      console.log('=== DAFTAR SEMUA LISENSI ===\n');
      const licenses = listLicenses();
      if (licenses.length === 0) {
        console.log('Belum ada lisensi di database.');
      } else {
        console.table(licenses.map(l => ({
          ID: l.id,
          Key: l.license_key,
          Sekolah: l.school_name,
          Status: l.status,
          Aktif: l.is_activated ? 'YA' : 'TIDAK',
          DeviceId: l.device_id || '-',
          TglAktivasi: l.activation_date || '-'
        })));
      }
    } else if (args.includes('--check')) {
      const keyIndex = args.indexOf('--check') + 1;
      const key = args[keyIndex];
      if (!key) {
        console.error('Harap masukkan license key yang ingin dicek.');
        process.exit(1);
      }
      const info = checkLicense(key);
      if (!info) {
        console.log(`License key ${key} TIDAK DITEMUKAN.`);
      } else {
        console.log('Detail Lisensi:');
        console.log(info);
      }
    } else if (args.includes('--revoke')) {
      const keyIndex = args.indexOf('--revoke') + 1;
      const key = args[keyIndex];
      if (!key) {
        console.error('Harap masukkan license key yang ingin dicabut.');
        process.exit(1);
      }
      const success = revokeLicense(key);
      if (success) {
        console.log(`✓ Lisensi ${key} berhasil dicabut (status: revoked).`);
      } else {
        console.log(`✗ Gagal mencabut lisensi: key ${key} tidak ditemukan.`);
      }
    } else {
      showHelp();
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    closeDb();
  }
}

main();
