const crypto = require('crypto');

/**
 * Generate a license key in format INV-XXXX-XXXX-XXXX
 */
function generateLicenseKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments = [];
  
  for (let s = 0; s < 3; s++) {
    let segment = '';
    for (let i = 0; i < 4; i++) {
      segment += chars.charAt(crypto.randomInt(chars.length));
    }
    segments.push(segment);
  }
  
  return `INV-${segments.join('-')}`;
}

/**
 * Generate multiple license keys
 */
function generateMultipleLicenseKeys(count = 1) {
  const keys = new Set();
  while (keys.size < count) {
    keys.add(generateLicenseKey());
  }
  return Array.from(keys);
}

/**
 * Validate license key format
 */
function isValidLicenseFormat(key) {
  return /^INV-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(key);
}

module.exports = { generateLicenseKey, generateMultipleLicenseKeys, isValidLicenseFormat };
