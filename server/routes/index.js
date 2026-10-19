const express = require('express');
const router = express.Router();

const licenseRoutes = require('./license');
const authRoutes = require('./auth');
const inventoryRoutes = require('./inventory');
const stokHistoryRoutes = require('./stokHistory');
const reportRoutes = require('./reports');
const backupRoutes = require('./backup');

router.use('/license', licenseRoutes);
router.use('/auth', authRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/stok-history', stokHistoryRoutes);
router.use('/reports', reportRoutes);
router.use('/backup', backupRoutes);

module.exports = router;
