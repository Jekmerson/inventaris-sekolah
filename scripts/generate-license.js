const fs = require('fs');
const path = require('path');
const { insertLicenseKeys } = require('../server/utils/licenseManager');
const { initDatabase, closeDb } = require('../server/config/db');

function parseArgs() {
  const args = process.argv.slice(2);
  let count = 1;
  let school = 'Unassigned';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--count' && args[i + 1]) {
      count = parseInt(args[i + 1], 10) || 1;
      i++;
    } else if (args[i] === '--school' && args[i + 1]) {
      school = args[i + 1];
      i++;
    }
  }

  return { count, school };
}

async function main() {
  try {
    await initDatabase();
    const { count, school } = parseArgs();
    console.log(`\n=== Generating ${count} License Key(s) ===`);
    console.log(`Untuk Sekolah: ${school}\n`);

    const keys = insertLicenseKeys(count, school);

    console.log('Generated License Keys:');
    keys.forEach((key, index) => {
      console.log(`${index + 1}. ${key}`);
    });

    const licensesFile = path.join(__dirname, '..', 'database', 'licenses.txt');
    const lines = keys.map(k => `${k} | ${school} | ${new Date().toISOString()}`).join('\n') + '\n';
    fs.appendFileSync(licensesFile, lines);

    console.log(`\nDisimpan ke: ${licensesFile}`);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    closeDb();
  }
}

main();
