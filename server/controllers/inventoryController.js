const { getDb } = require('../config/db');
const queries = require('../models/queries');
const { PAGINATION } = require('../config/constants');

async function getInventory(req, res, next) {
  try {
    const db = getDb();
    const kategori = req.query.kategori && req.query.kategori.trim() !== '' ? req.query.kategori.trim() : null;
    const search = req.query.search && req.query.search.trim() !== '' ? `%${req.query.search.trim()}%` : null;

    const page = Math.max(1, parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE);
    const limit = Math.min(
      PAGINATION.MAX_LIMIT,
      Math.max(1, parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT)
    );
    const offset = (page - 1) * limit;

    const countResult = db.prepare(queries.countInventory).get(
      kategori, kategori,
      search, search
    );
    const total = countResult ? countResult.total : 0;

    const data = db.prepare(queries.getInventoryPaginated).all(
      kategori, kategori,
      search, search,
      limit, offset
    );

    return res.json({
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    next(err);
  }
}

async function getInventoryById(req, res, next) {
  try {
    const db = getDb();
    const { id } = req.params;
    const item = db.prepare(queries.getInventoryById).get(id);

    if (!item) {
      return res.status(404).json({ error: 'Barang tidak ditemukan' });
    }

    return res.json(item);
  } catch (err) {
    next(err);
  }
}

async function createInventory(req, res, next) {
  try {
    const db = getDb();
    const {
      nama_barang,
      kategori = 'Lainnya',
      satuan = 'pcs',
      harga_satuan = 0,
      min_stok = 10,
      deskripsi = ''
    } = req.body;

    const result = db.prepare(queries.insertInventory).run(
      nama_barang.trim(),
      kategori ? kategori.trim() : 'Lainnya',
      satuan.trim(),
      parseFloat(harga_satuan) || 0,
      parseInt(min_stok) || 0,
      deskripsi ? deskripsi.trim() : ''
    );

    // Also auto-add category to kategori master if not exists
    if (kategori && kategori.trim()) {
      db.prepare(queries.createCategory).run(kategori.trim());
    }

    const newItem = db.prepare(queries.getInventoryById).get(result.lastInsertRowid);
    return res.status(201).json(newItem);
  } catch (err) {
    next(err);
  }
}

async function updateInventory(req, res, next) {
  try {
    const db = getDb();
    const { id } = req.params;
    const {
      nama_barang,
      kategori = 'Lainnya',
      satuan = 'pcs',
      harga_satuan = 0,
      min_stok = 10,
      deskripsi = ''
    } = req.body;

    const existing = db.prepare(queries.getInventoryById).get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Barang tidak ditemukan' });
    }

    db.prepare(queries.updateInventory).run(
      nama_barang.trim(),
      kategori ? kategori.trim() : 'Lainnya',
      satuan.trim(),
      parseFloat(harga_satuan) || 0,
      parseInt(min_stok) || 0,
      deskripsi ? deskripsi.trim() : '',
      id
    );

    if (kategori && kategori.trim()) {
      db.prepare(queries.createCategory).run(kategori.trim());
    }

    const updated = db.prepare(queries.getInventoryById).get(id);
    return res.json({ message: 'Barang berhasil diperbarui', data: updated });
  } catch (err) {
    next(err);
  }
}

async function deleteInventory(req, res, next) {
  try {
    const db = getDb();
    const { id } = req.params;

    const existing = db.prepare(queries.getInventoryById).get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Barang tidak ditemukan' });
    }

    // Hapus riwayat mutasi terkait secara eksplisit agar tidak tertinggal data yatim (orphaned)
    db.prepare('DELETE FROM stok_history WHERE barang_id = ?').run(id);
    db.prepare(queries.deleteInventory).run(id);
    return res.json({ message: 'Barang dan riwayat terkait berhasil dihapus' });
  } catch (err) {
    next(err);
  }
}

async function getCategories(req, res, next) {
  try {
    const db = getDb();
    const categories = db.prepare(queries.getAllCategories).all();
    return res.json({ data: categories.map(c => c.nama_kategori) });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
  getCategories
};
