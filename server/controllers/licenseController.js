const { getDb } = require('../config/db');
const queries = require('../models/queries');

async function activateLicense(req, res, next) {
  try {
    const { license_key, school_name } = req.body;
    const db = getDb();
    const cleanKey = license_key.trim();
    const cleanSchool = school_name.trim();

    const license = db.prepare(queries.getLicenseByKey).get(cleanKey);

    if (!license) {
      return res.status(400).json({ error: 'License key tidak terdaftar atau tidak valid.' });
    }

    if (license.status === 'revoked') {
      return res.status(403).json({ error: 'License key telah dicabut/revoked.' });
    }

    // Activate license without hardware lock
    const activateTx = db.transaction(() => {
      db.prepare(`
        UPDATE licenses 
        SET is_activated = 1, 
            activation_date = COALESCE(activation_date, date('now')), 
            school_name = COALESCE(?, school_name) 
        WHERE license_key = ?
      `).run(cleanSchool, cleanKey);

      db.prepare(`
        INSERT INTO app_config (id, license_key, is_activated, activation_date, school_name)
        VALUES (1, ?, 1, date('now'), ?)
        ON CONFLICT(id) DO UPDATE SET
          license_key = excluded.license_key,
          is_activated = 1,
          activation_date = date('now'),
          school_name = excluded.school_name
      `).run(cleanKey, cleanSchool);
    });

    activateTx();

    const updatedLicense = db.prepare(queries.getLicenseByKey).get(cleanKey);

    return res.json({
      success: true,
      message: 'Aktivasi lisensi berhasil!',
      school_name: cleanSchool,
      activation_date: updatedLicense.activation_date,
      license_key: cleanKey
    });
  } catch (err) {
    next(err);
  }
}

async function getLicenseStatus(req, res, next) {
  try {
    // Web Demo Mode bypass
    if (process.env.DEMO_MODE === 'true') {
      return res.json({
        is_activated: true,
        school_name: process.env.DEMO_SCHOOL_NAME || 'Demo Sekolah (Presentasi)',
        activation_date: '2026-01-01',
        license_key: 'INV-DEMO-PREVIEW'
      });
    }

    const db = getDb();
    const config = db.prepare(queries.getAppConfig).get();

    if (!config || !config.is_activated) {
      return res.json({
        is_activated: false
      });
    }

    const license = db.prepare(queries.getLicenseByKey).get(config.license_key);

    if (!license || license.status === 'revoked') {
      return res.json({
        is_activated: false,
        message: 'Lisensi tidak valid atau telah dicabut'
      });
    }

    return res.json({
      is_activated: true,
      school_name: config.school_name || license.school_name,
      activation_date: config.activation_date || license.activation_date,
      license_key: license.license_key
    });
  } catch (err) {
    next(err);
  }
}

async function resetLicense(req, res, next) {
  try {
    const db = getDb();
    db.prepare(`
      UPDATE app_config 
      SET is_activated = 0, license_key = NULL, school_name = NULL, activation_date = NULL 
      WHERE id = 1
    `).run();

    db.prepare(`
      UPDATE licenses 
      SET is_activated = 0, activation_date = NULL, device_id = NULL
    `).run();

    return res.json({
      success: true,
      message: 'Lisensi berhasil direset. Silakan lakukan aktivasi kembali.'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  activateLicense,
  getLicenseStatus,
  resetLicense
};
