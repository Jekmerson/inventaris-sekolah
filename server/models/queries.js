// server/models/queries.js
// Centralized SQL statements / helper queries for better-sqlite3

module.exports = {
  // License
  getLicenseByKey: 'SELECT * FROM licenses WHERE license_key = ?',
  getLicenseByDeviceId: 'SELECT * FROM licenses WHERE device_id = ?',
  activateLicense: `
    UPDATE licenses 
    SET is_activated = 1, 
        activation_date = date('now'), 
        device_id = ?, 
        school_name = COALESCE(?, school_name) 
    WHERE license_key = ?
  `,
  getAppConfig: 'SELECT * FROM app_config WHERE id = 1',
  updateAppConfig: `
    INSERT INTO app_config (id, device_id, license_key, is_activated, activation_date, school_name)
    VALUES (1, ?, ?, 1, date('now'), ?)
    ON CONFLICT(id) DO UPDATE SET
      device_id = excluded.device_id,
      license_key = excluded.license_key,
      is_activated = 1,
      activation_date = date('now'),
      school_name = excluded.school_name
  `,

  // Users & Auth
  getUserByUsername: 'SELECT * FROM users WHERE username = ?',
  getUserById: 'SELECT id, username, created_at FROM users WHERE id = ?',
  updateUserPassword: 'UPDATE users SET password_hash = ? WHERE id = ?',

  // Categories
  getAllCategories: 'SELECT * FROM kategori ORDER BY nama_kategori ASC',
  createCategory: 'INSERT OR IGNORE INTO kategori (nama_kategori) VALUES (?)',

  // Inventory
  countInventory: `
    SELECT COUNT(*) as total 
    FROM inventory 
    WHERE (? IS NULL OR kategori = ?)
      AND (? IS NULL OR nama_barang LIKE ?)
  `,
  getInventoryPaginated: `
    SELECT id, nama_barang, kategori, satuan, stok, harga_satuan, min_stok, deskripsi, created_at, updated_at
    FROM inventory
    WHERE (? IS NULL OR kategori = ?)
      AND (? IS NULL OR nama_barang LIKE ?)
    ORDER BY nama_barang ASC
    LIMIT ? OFFSET ?
  `,
  getAllInventory: `
    SELECT id, nama_barang, kategori, satuan, stok, harga_satuan, min_stok, deskripsi
    FROM inventory
    WHERE (? IS NULL OR kategori = ?)
    ORDER BY nama_barang ASC
  `,
  getInventoryById: 'SELECT * FROM inventory WHERE id = ?',
  insertInventory: `
    INSERT INTO inventory (nama_barang, kategori, satuan, harga_satuan, min_stok, deskripsi)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
  updateInventory: `
    UPDATE inventory
    SET nama_barang = ?, kategori = ?, satuan = ?, harga_satuan = ?, min_stok = ?, deskripsi = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `,
  deleteInventory: 'DELETE FROM inventory WHERE id = ?',
  getWarningInventory: `
    SELECT id, nama_barang, kategori, satuan, stok, min_stok, (min_stok - stok) as selisih
    FROM inventory
    WHERE stok < min_stok
    ORDER BY (min_stok - stok) DESC
  `,

  // Stok History
  insertStokHistory: `
    INSERT INTO stok_history (barang_id, tipe, jumlah, keterangan, tanggal, created_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
  getStokHistoryById: 'SELECT * FROM stok_history WHERE id = ?',
  deleteStokHistory: 'DELETE FROM stok_history WHERE id = ?',
  countStokHistory: `
    SELECT COUNT(*) as total
    FROM stok_history sh
    JOIN inventory i ON sh.barang_id = i.id
    WHERE (? IS NULL OR sh.barang_id = ?)
      AND (? IS NULL OR sh.tipe = ?)
      AND (? IS NULL OR sh.tanggal >= ?)
      AND (? IS NULL OR sh.tanggal <= ?)
  `,
  getStokHistoryPaginated: `
    SELECT sh.id, sh.barang_id, i.nama_barang, i.satuan, sh.tipe, sh.jumlah, sh.keterangan, sh.tanggal, sh.created_by, sh.created_at
    FROM stok_history sh
    JOIN inventory i ON sh.barang_id = i.id
    WHERE (? IS NULL OR sh.barang_id = ?)
      AND (? IS NULL OR sh.tipe = ?)
      AND (? IS NULL OR sh.tanggal >= ?)
      AND (? IS NULL OR sh.tanggal <= ?)
    ORDER BY sh.tanggal DESC, sh.id DESC
    LIMIT ? OFFSET ?
  `,
  getRecentTransactions: `
    SELECT sh.id, sh.barang_id, i.nama_barang, i.satuan, sh.tipe, sh.jumlah, sh.keterangan, sh.tanggal, sh.created_at
    FROM stok_history sh
    JOIN inventory i ON sh.barang_id = i.id
    ORDER BY sh.tanggal DESC, sh.id DESC
    LIMIT ?
  `,

  // Reports
  getDashboardStats: `
    SELECT 
      (SELECT COUNT(*) FROM inventory) as total_barang,
      (SELECT COALESCE(SUM(stok * harga_satuan), 0) FROM inventory) as total_value,
      (SELECT COUNT(*) FROM inventory WHERE stok < min_stok) as warning_count,
      (SELECT COUNT(*) FROM stok_history sh JOIN inventory i ON sh.barang_id = i.id WHERE strftime('%Y-%m', sh.tanggal) = strftime('%Y-%m', 'now')) as monthly_transactions
  `,
  getMasukKeluarReport: `
    SELECT 
      sh.id, sh.barang_id, i.nama_barang, i.kategori, i.satuan,
      sh.tipe, sh.jumlah, sh.keterangan, sh.tanggal
    FROM stok_history sh
    JOIN inventory i ON sh.barang_id = i.id
    WHERE (? IS NULL OR sh.tanggal >= ?)
      AND (? IS NULL OR sh.tanggal <= ?)
      AND (? IS NULL OR i.kategori = ?)
    ORDER BY sh.tanggal ASC, sh.id ASC
  `
};
