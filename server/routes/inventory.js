const express = require('express');
const router = express.Router();
const {
  getInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
  getCategories
} = require('../controllers/inventoryController');
const { authMiddleware } = require('../middleware/auth');
const { validateInventory } = require('../middleware/validation');

router.use(authMiddleware);

router.get('/kategori', getCategories);
router.get('/', getInventory);
router.post('/', validateInventory, createInventory);
router.get('/:id', getInventoryById);
router.put('/:id', validateInventory, updateInventory);
router.delete('/:id', deleteInventory);

module.exports = router;
