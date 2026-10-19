function validateInventory(req, res, next) {
  const { nama_barang, satuan, harga_satuan, min_stok } = req.body;
  const errors = [];

  if (!nama_barang || !nama_barang.trim()) {
    errors.push('Nama barang harus diisi');
  }
  if (!satuan || !satuan.trim()) {
    errors.push('Satuan harus diisi');
  }
  if (harga_satuan !== undefined && harga_satuan < 0) {
    errors.push('Harga satuan tidak boleh negatif');
  }
  if (min_stok !== undefined && min_stok < 0) {
    errors.push('Minimum stok tidak boleh negatif');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', '), errors });
  }
  next();
}

function validateStokMasuk(req, res, next) {
  const { barang_id, jumlah, tanggal } = req.body;
  const errors = [];

  if (!barang_id) errors.push('Barang harus dipilih');
  if (!jumlah || jumlah <= 0) errors.push('Jumlah harus lebih dari 0');
  if (!tanggal) errors.push('Tanggal harus diisi');

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', '), errors });
  }
  next();
}

function validateStokKeluar(req, res, next) {
  const { barang_id, jumlah, tanggal } = req.body;
  const errors = [];

  if (!barang_id) errors.push('Barang harus dipilih');
  if (!jumlah || jumlah <= 0) errors.push('Jumlah harus lebih dari 0');
  if (!tanggal) errors.push('Tanggal harus diisi');

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', '), errors });
  }
  next();
}

function validateLicense(req, res, next) {
  const { license_key, school_name } = req.body;
  const errors = [];

  if (!license_key || !license_key.trim()) {
    errors.push('License key harus diisi');
  } else if (!/^INV-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(license_key.trim())) {
    errors.push('Format license key tidak valid (INV-XXXX-XXXX-XXXX)');
  }

  if (!school_name || !school_name.trim()) {
    errors.push('Nama sekolah harus diisi');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', '), errors });
  }
  next();
}

function validateLogin(req, res, next) {
  const { username, password } = req.body;
  const errors = [];

  if (!username || !username.trim()) errors.push('Username harus diisi');
  if (!password || !password.trim()) errors.push('Password harus diisi');

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', '), errors });
  }
  next();
}

function validateChangePassword(req, res, next) {
  const { old_password, new_password } = req.body;
  const errors = [];

  if (!old_password) errors.push('Password lama harus diisi');
  if (!new_password) errors.push('Password baru harus diisi');
  if (new_password && new_password.length < 6) {
    errors.push('Password baru minimal 6 karakter');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', '), errors });
  }
  next();
}

module.exports = {
  validateInventory,
  validateStokMasuk,
  validateStokKeluar,
  validateLicense,
  validateLogin,
  validateChangePassword
};
