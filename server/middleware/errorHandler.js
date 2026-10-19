function errorHandler(err, req, res, next) {
  console.error(`[Error] ${req.method} ${req.path}:`, err.message);
  
  // Don't expose stack trace in production
  const isDev = process.env.NODE_ENV === 'development';

  if (err.type === 'validation') {
    return res.status(400).json({
      error: err.message,
      field: err.field || null
    });
  }

  if (err.type === 'not_found') {
    return res.status(404).json({
      error: err.message || 'Data tidak ditemukan'
    });
  }

  if (err.type === 'conflict') {
    return res.status(409).json({
      error: err.message || 'Data sudah ada'
    });
  }

  if (err.type === 'unauthorized') {
    return res.status(401).json({
      error: err.message || 'Tidak memiliki akses'
    });
  }

  // Default: Internal Server Error
  res.status(err.status || 500).json({
    error: isDev ? err.message : 'Terjadi kesalahan pada server',
    ...(isDev && { stack: err.stack })
  });
}

module.exports = { errorHandler };
