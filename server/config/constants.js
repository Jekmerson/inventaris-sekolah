module.exports = {
  APP_NAME: process.env.APP_NAME || 'Inventaris Sekolah',
  JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret_change_this',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '24h',
  LICENSE_SECRET: process.env.LICENSE_SECRET || 'default_license_secret_change_this',
  BACKUP_PATH: process.env.BACKUP_PATH || './database/backups',
  BACKUP_RETENTION_DAYS: parseInt(process.env.BACKUP_RETENTION_DAYS || '30'),
  AUTO_BACKUP_TIME: process.env.AUTO_BACKUP_TIME || '00:00',
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 50,
    MAX_LIMIT: 500
  }
};
