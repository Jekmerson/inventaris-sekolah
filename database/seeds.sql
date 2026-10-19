-- =============================================
-- SEED DATA: KATEGORI
-- =============================================
INSERT OR IGNORE INTO kategori (nama_kategori) VALUES 
('Alat Tulis'),
('Elektronik'),
('Furniture'),
('Buku'),
('Perlengkapan Kelas'),
('Kebersihan'),
('Lainnya');

-- =============================================
-- SEED DATA: DEFAULT ADMIN USER
-- password: admin123 (bcrypt hash)
-- =============================================
INSERT OR IGNORE INTO users (username, password_hash) VALUES 
('admin', '$2a$10$BAD//y.JgVmj5.uCH.LJlu2UDSZ/7s0rWuBzt17MjrRFNZuv3zz92');

-- =============================================
-- SEED DATA: APP CONFIG (empty, will be filled on activation)
-- =============================================
INSERT OR IGNORE INTO app_config (id, is_activated) VALUES (1, 0);

-- =============================================
-- SEED DATA: SAMPLE LICENSE KEYS
-- =============================================
INSERT OR IGNORE INTO licenses (license_key, school_name, status) VALUES 
('INV-DEMO-0001-ABCD', 'Demo School', 'valid'),
('INV-TEST-0002-EFGH', 'Test School', 'valid'),
('INV-PROD-0003-IJKL', 'Production School', 'valid');
