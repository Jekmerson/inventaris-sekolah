const express = require('express');
const router = express.Router();
const {
  getDashboardData,
  getStokSummary,
  getMasukKeluarReport,
  getWarningStok,
  exportCsv,
  exportPdf
} = require('../controllers/reportController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/dashboard', getDashboardData);
router.get('/stok-summary', getStokSummary);
router.get('/masuk-keluar', getMasukKeluarReport);
router.get('/warning-stok', getWarningStok);
router.get('/export/csv', exportCsv);
router.get('/export/pdf', exportPdf);

module.exports = router;
