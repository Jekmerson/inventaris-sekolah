const path = require('path');
const fs = require('fs');
const { createBackup, listBackups, restoreBackup } = require('../utils/backup');
const { BACKUP_PATH } = require('../config/constants');

async function handleCreateBackup(req, res, next) {
  try {
    const backupInfo = createBackup();
    return res.status(201).json({
      message: 'Backup database berhasil dibuat',
      ...backupInfo
    });
  } catch (err) {
    next(err);
  }
}

async function handleListBackups(req, res, next) {
  try {
    const backups = listBackups();
    return res.json({ backups });
  } catch (err) {
    next(err);
  }
}

async function handleRestoreBackup(req, res, next) {
  try {
    const { filename } = req.body;
    if (!filename) {
      return res.status(400).json({ error: 'Nama file backup harus disertakan' });
    }

    const result = restoreBackup(filename);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}

async function handleDownloadBackup(req, res, next) {
  try {
    const { filename } = req.params;
    const backupDir = path.resolve(BACKUP_PATH);
    const safeFilename = path.basename(filename);
    const fullPath = path.join(backupDir, safeFilename);

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'File backup tidak ditemukan' });
    }

    return res.download(fullPath, safeFilename);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleCreateBackup,
  handleListBackups,
  handleRestoreBackup,
  handleDownloadBackup
};
