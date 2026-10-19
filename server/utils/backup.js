const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const { getDbPath } = require('../config/db');
const { BACKUP_PATH, BACKUP_RETENTION_DAYS, AUTO_BACKUP_TIME } = require('../config/constants');

/**
 * Create a backup of the database
 */
function createBackup() {
  const dbPath = getDbPath();
  const backupDir = path.resolve(BACKUP_PATH);
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
  const filename = `inventaris-${dateStr}_${timeStr}.db`;
  const backupPath = path.join(backupDir, filename);

  fs.copyFileSync(dbPath, backupPath);
  
  const stats = fs.statSync(backupPath);
  console.log(`[Backup] Created: ${filename} (${(stats.size / 1024).toFixed(1)}KB)`);
  
  return {
    filename,
    path: backupPath,
    size: stats.size,
    date: now.toISOString()
  };
}

/**
 * List all backups
 */
function listBackups() {
  const backupDir = path.resolve(BACKUP_PATH);
  
  if (!fs.existsSync(backupDir)) {
    return [];
  }

  const files = fs.readdirSync(backupDir)
    .filter(f => f.endsWith('.db') && f.startsWith('inventaris-'))
    .map(filename => {
      const filePath = path.join(backupDir, filename);
      const stats = fs.statSync(filePath);
      return {
        filename,
        path: filePath,
        size: stats.size,
        date: stats.mtime.toISOString()
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return files;
}

/**
 * Restore a backup
 */
function restoreBackup(filename) {
  const backupDir = path.resolve(BACKUP_PATH);
  const backupPath = path.join(backupDir, filename);
  const dbPath = getDbPath();

  if (!fs.existsSync(backupPath)) {
    throw new Error('Backup file tidak ditemukan');
  }

  // Close current DB connection first
  const { closeDb } = require('../config/db');
  closeDb();

  // Create a backup of current database before restore
  const currentBackup = `inventaris-pre-restore-${Date.now()}.db`;
  fs.copyFileSync(dbPath, path.join(backupDir, currentBackup));

  // Restore
  fs.copyFileSync(backupPath, dbPath);
  console.log(`[Backup] Restored from: ${filename}`);
  
  return { message: 'Backup berhasil di-restore', filename };
}

/**
 * Cleanup old backups
 */
function cleanupOldBackups() {
  const backups = listBackups();
  const maxAge = BACKUP_RETENTION_DAYS * 24 * 60 * 60 * 1000;
  const now = Date.now();
  let cleaned = 0;

  for (const backup of backups) {
    const age = now - new Date(backup.date).getTime();
    if (age > maxAge) {
      try {
        fs.unlinkSync(backup.path);
        cleaned++;
      } catch (err) {
        console.error(`[Backup] Failed to delete ${backup.filename}:`, err.message);
      }
    }
  }

  if (cleaned > 0) {
    console.log(`[Backup] Cleaned up ${cleaned} old backup(s)`);
  }
}

/**
 * Start auto backup cron job
 */
function startAutoBackup() {
  const [hour, minute] = AUTO_BACKUP_TIME.split(':');
  const cronExpression = `${minute || '0'} ${hour || '0'} * * *`;
  
  cron.schedule(cronExpression, () => {
    try {
      console.log('[Backup] Running auto backup...');
      createBackup();
      cleanupOldBackups();
    } catch (err) {
      console.error('[Backup] Auto backup failed:', err.message);
    }
  });
  
  console.log(`[Backup] Auto backup scheduled at ${AUTO_BACKUP_TIME}`);
}

module.exports = { createBackup, listBackups, restoreBackup, cleanupOldBackups, startAutoBackup };
