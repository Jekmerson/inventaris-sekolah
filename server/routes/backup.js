const express = require('express');
const router = express.Router();
const {
  handleCreateBackup,
  handleListBackups,
  handleRestoreBackup,
  handleDownloadBackup
} = require('../controllers/backupController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.post('/create', handleCreateBackup);
router.get('/list', handleListBackups);
router.post('/restore', handleRestoreBackup);
router.get('/download/:filename', handleDownloadBackup);

module.exports = router;
