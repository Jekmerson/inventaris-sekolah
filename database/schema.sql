-- =============================================
-- LICENSE TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS licenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  license_key TEXT UNIQUE NOT NULL,
  school_name TEXT NOT NULL,
  activation_date DATE,
  device_id TEXT UNIQUE,
  is_activated INTEGER DEFAULT 0,
  status TEXT DEFAULT 'valid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_license_key ON licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_device_id ON licenses(device_id);

-- =============================================
-- APP CONFIG (LOCAL CACHE)
-- =============================================
CREATE TABLE IF NOT EXISTS app_config (
  id INTEGER PRIMARY KEY,
  device_id TEXT UNIQUE,
  license_key TEXT,
  is_activated INTEGER DEFAULT 0,
  activation_date DATE,
  school_name TEXT
);

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- INVENTORY MASTER
-- =============================================
CREATE TABLE IF NOT EXISTS inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nama_barang TEXT NOT NULL,
  kategori TEXT,
  satuan TEXT,
  stok INTEGER DEFAULT 0,
  harga_satuan REAL DEFAULT 0,
  min_stok INTEGER DEFAULT 10,
  deskripsi TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inventory_kategori ON inventory(kategori);
CREATE INDEX IF NOT EXISTS idx_inventory_nama ON inventory(nama_barang);

-- =============================================
-- STOK HISTORY (TRANSAKSI)
-- =============================================
CREATE TABLE IF NOT EXISTS stok_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  barang_id INTEGER NOT NULL,
  tipe TEXT NOT NULL CHECK(tipe IN ('masuk', 'keluar')),
  jumlah INTEGER NOT NULL,
  keterangan TEXT,
  tanggal DATE NOT NULL,
  created_by TEXT DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(barang_id) REFERENCES inventory(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_stok_history_barang_id ON stok_history(barang_id);
CREATE INDEX IF NOT EXISTS idx_stok_history_tanggal ON stok_history(tanggal);
CREATE INDEX IF NOT EXISTS idx_stok_history_tipe ON stok_history(tipe);

-- =============================================
-- KATEGORI MASTER
-- =============================================
CREATE TABLE IF NOT EXISTS kategori (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nama_kategori TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TRIGGERS: AUTO-UPDATE STOK
-- =============================================

-- Trigger: Stok Masuk
CREATE TRIGGER IF NOT EXISTS update_stok_masuk
AFTER INSERT ON stok_history
WHEN NEW.tipe = 'masuk'
BEGIN
  UPDATE inventory 
  SET stok = stok + NEW.jumlah, 
      updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.barang_id;
END;

-- Trigger: Stok Keluar
CREATE TRIGGER IF NOT EXISTS update_stok_keluar
AFTER INSERT ON stok_history
WHEN NEW.tipe = 'keluar'
BEGIN
  UPDATE inventory 
  SET stok = stok - NEW.jumlah, 
      updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.barang_id;
END;

-- Trigger: Undo Stok Masuk
CREATE TRIGGER IF NOT EXISTS undo_stok_masuk
AFTER DELETE ON stok_history
WHEN OLD.tipe = 'masuk'
BEGIN
  UPDATE inventory 
  SET stok = stok - OLD.jumlah, 
      updated_at = CURRENT_TIMESTAMP
  WHERE id = OLD.barang_id;
END;

-- Trigger: Undo Stok Keluar
CREATE TRIGGER IF NOT EXISTS undo_stok_keluar
AFTER DELETE ON stok_history
WHEN OLD.tipe = 'keluar'
BEGIN
  UPDATE inventory 
  SET stok = stok + OLD.jumlah, 
      updated_at = CURRENT_TIMESTAMP
  WHERE id = OLD.barang_id;
END;
