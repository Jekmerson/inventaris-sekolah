const { getDb } = require('../config/db');
const queries = require('../models/queries');
const { PAGINATION } = require('../config/constants');

async function stokMasuk(req, res, next) {
  try {
    const db = getDb();
    const { barang_id, jumlah, keterangan = '', tanggal } = req.body;
    const createdBy = req.user?.username || 'admin';

    const item = db.prepare(queries.getInventoryById).get(barang_id);
    if (!item) {
      return res.status(404).json({ error: 'Barang tidak ditemukan' });
    }

    const qty = parseInt(jumlah, 10);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ error: 'Jumlah harus lebih besar dari 0' });
    }

    // Insert history (trigger `update_stok_masuk` updates inventory.stok automatically)
    const result = db.prepare(queries.insertStokHistory).run(
      barang_id,
      'masuk',
      qty,
      keterangan ? keterangan.trim() : '',
      tanggal,
      createdBy
    );

    const updatedItem = db.prepare(queries.getInventoryById).get(barang_id);

    return res.status(201).json({
      id: result.lastInsertRowid,
      message: 'Stok masuk berhasil dicatat',
      stok_baru: updatedItem.stok,
      item: updatedItem
    });
  } catch (err) {
    next(err);
  }
}

async function stokKeluar(req, res, next) {
  try {
    const db = getDb();
    const { barang_id, jumlah, keterangan = '', tanggal } = req.body;
    const createdBy = req.user?.username || 'admin';

    const item = db.prepare(queries.getInventoryById).get(barang_id);
    if (!item) {
      return res.status(404).json({ error: 'Barang tidak ditemukan' });
    }

    const qty = parseInt(jumlah, 10);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ error: 'Jumlah harus lebih besar dari 0' });
    }

    // Strict validation: jumlah keluar cannot exceed current stock
    if (qty > item.stok) {
      return res.status(400).json({
        error: `Stok tidak mencukupi. Stok saat ini: ${item.stok} ${item.satuan}, jumlah keluar: ${qty} ${item.satuan}`
      });
    }

    // Insert history (trigger `update_stok_keluar` updates inventory.stok automatically)
    const result = db.prepare(queries.insertStokHistory).run(
      barang_id,
      'keluar',
      qty,
      keterangan ? keterangan.trim() : '',
      tanggal,
      createdBy
    );

    const updatedItem = db.prepare(queries.getInventoryById).get(barang_id);

    return res.status(201).json({
      id: result.lastInsertRowid,
      message: 'Stok keluar berhasil dicatat',
      stok_baru: updatedItem.stok,
      item: updatedItem
    });
  } catch (err) {
    next(err);
  }
}

async function getStokHistory(req, res, next) {
  try {
    const db = getDb();
    const barang_id = req.query.barang_id ? parseInt(req.query.barang_id, 10) : null;
    const tipe = req.query.tipe && ['masuk', 'keluar'].includes(req.query.tipe.toLowerCase()) 
      ? req.query.tipe.toLowerCase() 
      : null;
    const start_date = req.query.start_date || null;
    const end_date = req.query.end_date || null;

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(
      PAGINATION.MAX_LIMIT,
      Math.max(1, parseInt(req.query.limit) || 100)
    );
    const offset = (page - 1) * limit;

    const countResult = db.prepare(queries.countStokHistory).get(
      barang_id, barang_id,
      tipe, tipe,
      start_date, start_date,
      end_date, end_date
    );
    const total = countResult ? countResult.total : 0;

    const data = db.prepare(queries.getStokHistoryPaginated).all(
      barang_id, barang_id,
      tipe, tipe,
      start_date, start_date,
      end_date, end_date,
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

async function getStokHistoryById(req, res, next) {
  try {
    const db = getDb();
    const { id } = req.params;
    const history = db.prepare(queries.getStokHistoryById).get(id);

    if (!history) {
      return res.status(404).json({ error: 'Riwayat transaksi tidak ditemukan' });
    }

    return res.json(history);
  } catch (err) {
    next(err);
  }
}

async function undoStokHistory(req, res, next) {
  try {
    const db = getDb();
    const { id } = req.params;

    const history = db.prepare(queries.getStokHistoryById).get(id);
    if (!history) {
      return res.status(404).json({ error: 'Riwayat transaksi tidak ditemukan' });
    }

    // If undoing 'masuk', current stock will decrease. Make sure it doesn't drop below 0
    if (history.tipe === 'masuk') {
      const item = db.prepare(queries.getInventoryById).get(history.barang_id);
      if (item && item.stok < history.jumlah) {
        return res.status(400).json({
          error: `Tidak bisa membatalkan transaksi ini: stok saat ini (${item.stok}) lebih kecil dari jumlah yang akan ditarik (${history.jumlah}).`
        });
      }
    }

    // Delete record (trigger `undo_stok_masuk` or `undo_stok_keluar` automatically restores stock)
    db.prepare(queries.deleteStokHistory).run(id);

    const updatedItem = db.prepare(queries.getInventoryById).get(history.barang_id);

    return res.json({
      message: 'Transaksi berhasil dibatalkan (undo)',
      stok_baru: updatedItem ? updatedItem.stok : null
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  stokMasuk,
  stokKeluar,
  getStokHistory,
  getStokHistoryById,
  undoStokHistory
};
