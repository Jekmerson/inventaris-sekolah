const express = require('express');
const router = express.Router();
const {
  stokMasuk,
  stokKeluar,
  getStokHistory,
  getStokHistoryById,
  undoStokHistory
} = require('../controllers/stokHistoryController');
const { authMiddleware } = require('../middleware/auth');
const { validateStokMasuk, validateStokKeluar } = require('../middleware/validation');

router.use(authMiddleware);

router.post('/masuk', validateStokMasuk, stokMasuk);
router.post('/keluar', validateStokKeluar, stokKeluar);
router.get('/', getStokHistory);
router.get('/:id', getStokHistoryById);
router.delete('/:id', undoStokHistory);

module.exports = router;
