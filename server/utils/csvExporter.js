const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');
const os = require('os');

/**
 * Export data to CSV file
 * @param {string} filename - Output filename
 * @param {Array} headers - Column headers [{id, title}]
 * @param {Array} records - Data records
 * @returns {string} - File path
 */
async function exportToCsv(filename, headers, records) {
  const filePath = path.join(os.tmpdir(), filename);
  
  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: headers,
    encoding: 'utf-8'
  });

  await csvWriter.writeRecords(records);
  return filePath;
}

/**
 * Export stok summary to CSV
 */
async function exportStokSummaryCsv(data) {
  const headers = [
    { id: 'nama_barang', title: 'Nama Barang' },
    { id: 'kategori', title: 'Kategori' },
    { id: 'stok', title: 'Stok' },
    { id: 'satuan', title: 'Satuan' },
    { id: 'harga_satuan', title: 'Harga Satuan' },
    { id: 'total_value', title: 'Total Nilai' }
  ];
  
  const records = data.map(item => ({
    ...item,
    total_value: item.stok * item.harga_satuan
  }));
  
  return exportToCsv('stok-summary.csv', headers, records);
}

/**
 * Export history to CSV
 */
async function exportHistoryCsv(data) {
  const headers = [
    { id: 'tanggal', title: 'Tanggal' },
    { id: 'nama_barang', title: 'Nama Barang' },
    { id: 'tipe', title: 'Tipe' },
    { id: 'jumlah', title: 'Jumlah' },
    { id: 'keterangan', title: 'Keterangan' },
    { id: 'created_by', title: 'Dibuat Oleh' }
  ];
  
  return exportToCsv('history.csv', headers, data);
}

module.exports = { exportToCsv, exportStokSummaryCsv, exportHistoryCsv };
