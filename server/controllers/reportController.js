const fs = require('fs');
const { getDb } = require('../config/db');
const queries = require('../models/queries');
const { exportStokSummaryCsv, exportHistoryCsv, exportToCsv } = require('../utils/csvExporter');
const { createPdfReport } = require('../utils/pdfExporter');

async function getDashboardData(req, res, next) {
  try {
    const db = getDb();

    const stats = db.prepare(queries.getDashboardStats).get();
    const recentTransactions = db.prepare(queries.getRecentTransactions).all(10);
    const warningList = db.prepare(queries.getWarningInventory).all();

    return res.json({
      total_barang: stats.total_barang || 0,
      total_value: stats.total_value || 0,
      warning_count: stats.warning_count || 0,
      monthly_transactions: stats.monthly_transactions || 0,
      recent_transactions: recentTransactions,
      warning_items: warningList
    });
  } catch (err) {
    next(err);
  }
}

async function getStokSummary(req, res, next) {
  try {
    const db = getDb();
    const kategori = req.query.kategori && req.query.kategori.trim() !== '' ? req.query.kategori.trim() : null;

    const data = db.prepare(queries.getAllInventory).all(kategori, kategori);
    let totalValue = 0;
    let totalItems = 0;

    const formatted = data.map(item => {
      const val = (item.stok || 0) * (item.harga_satuan || 0);
      totalValue += val;
      totalItems += (item.stok || 0);
      return {
        ...item,
        total_value: val
      };
    });

    return res.json({
      data: formatted,
      total_barang: data.length,
      total_unit: totalItems,
      total_value: totalValue
    });
  } catch (err) {
    next(err);
  }
}

async function getMasukKeluarReport(req, res, next) {
  try {
    const db = getDb();
    const start_date = req.query.start_date || null;
    const end_date = req.query.end_date || null;
    const kategori = req.query.kategori && req.query.kategori.trim() !== '' ? req.query.kategori.trim() : null;

    const records = db.prepare(queries.getMasukKeluarReport).all(
      start_date, start_date,
      end_date, end_date,
      kategori, kategori
    );

    const masuk = records.filter(r => r.tipe === 'masuk');
    const keluar = records.filter(r => r.tipe === 'keluar');

    const totalMasuk = masuk.reduce((acc, curr) => acc + curr.jumlah, 0);
    const totalKeluar = keluar.reduce((acc, curr) => acc + curr.jumlah, 0);

    return res.json({
      masuk,
      keluar,
      summary: {
        total_masuk: totalMasuk,
        total_keluar: totalKeluar,
        net_change: totalMasuk - totalKeluar
      }
    });
  } catch (err) {
    next(err);
  }
}

async function getWarningStok(req, res, next) {
  try {
    const db = getDb();
    const data = db.prepare(queries.getWarningInventory).all();
    return res.json({ data });
  } catch (err) {
    next(err);
  }
}

async function exportCsv(req, res, next) {
  try {
    const db = getDb();
    const type = req.query.type || 'stok-summary';
    let filePath;

    if (type === 'stok-summary') {
      const kategori = req.query.kategori && req.query.kategori.trim() !== '' ? req.query.kategori.trim() : null;
      const data = db.prepare(queries.getAllInventory).all(kategori, kategori);
      filePath = await exportStokSummaryCsv(data);
      res.download(filePath, 'laporan-stok-summary.csv', () => {
        try { fs.unlinkSync(filePath); } catch(e){}
      });
    } else if (type === 'masuk-keluar') {
      const start_date = req.query.start_date || null;
      const end_date = req.query.end_date || null;
      const records = db.prepare(queries.getMasukKeluarReport).all(
        start_date, start_date,
        end_date, end_date,
        null, null
      );
      const headers = [
        { id: 'tanggal', title: 'Tanggal' },
        { id: 'nama_barang', title: 'Nama Barang' },
        { id: 'kategori', title: 'Kategori' },
        { id: 'tipe', title: 'Tipe' },
        { id: 'jumlah', title: 'Jumlah' },
        { id: 'satuan', title: 'Satuan' },
        { id: 'keterangan', title: 'Keterangan' }
      ];
      filePath = await exportToCsv('laporan-masuk-keluar.csv', headers, records);
      res.download(filePath, 'laporan-masuk-keluar.csv', () => {
        try { fs.unlinkSync(filePath); } catch(e){}
      });
    } else if (type === 'history') {
      const data = db.prepare(queries.getStokHistoryPaginated).all(
        null, null, null, null, null, null, null, null, 10000, 0
      );
      filePath = await exportHistoryCsv(data);
      res.download(filePath, 'laporan-riwayat-transaksi.csv', () => {
        try { fs.unlinkSync(filePath); } catch(e){}
      });
    } else if (type === 'warning-stok') {
      const data = db.prepare(queries.getWarningInventory).all();
      const headers = [
        { id: 'nama_barang', title: 'Nama Barang' },
        { id: 'kategori', title: 'Kategori' },
        { id: 'stok', title: 'Stok Saat Ini' },
        { id: 'min_stok', title: 'Batas Minimum' },
        { id: 'selisih', title: 'Kekurangan Stok' },
        { id: 'satuan', title: 'Satuan' }
      ];
      filePath = await exportToCsv('laporan-warning-stok.csv', headers, data);
      res.download(filePath, 'laporan-warning-stok.csv', () => {
        try { fs.unlinkSync(filePath); } catch(e){}
      });
    } else {
      return res.status(400).json({ error: 'Tipe export tidak valid' });
    }
  } catch (err) {
    next(err);
  }
}

async function exportPdf(req, res, next) {
  try {
    const db = getDb();
    const type = req.query.type || 'stok-summary';
    const config = db.prepare(queries.getAppConfig).get();
    const schoolName = config?.school_name || 'Inventaris Sekolah';

    res.setHeader('Content-Type', 'application/pdf');

    if (type === 'stok-summary') {
      res.setHeader('Content-Disposition', 'attachment; filename=laporan-stok-summary.pdf');
      const data = db.prepare(queries.getAllInventory).all(null, null);

      let totalVal = 0;
      const rows = data.map(item => {
        const val = (item.stok || 0) * (item.harga_satuan || 0);
        totalVal += val;
        return [
          item.nama_barang,
          item.kategori || '-',
          `${item.stok} ${item.satuan}`,
          `Rp ${Number(item.harga_satuan || 0).toLocaleString('id-ID')}`,
          `Rp ${Number(val).toLocaleString('id-ID')}`
        ];
      });

      const doc = createPdfReport({
        title: 'LAPORAN REKAPITULASI STOK BARANG',
        schoolName,
        headers: ['Nama Barang', 'Kategori', 'Stok', 'Harga Satuan', 'Total Nilai'],
        rows,
        summary: {
          'Total Jenis Barang': `${data.length} item`,
          'Total Nilai Aset Stok': `Rp ${Number(totalVal).toLocaleString('id-ID')}`
        }
      });

      doc.pipe(res);
      doc.end();
    } else if (type === 'masuk-keluar') {
      res.setHeader('Content-Disposition', 'attachment; filename=laporan-masuk-keluar.pdf');
      const start_date = req.query.start_date || null;
      const end_date = req.query.end_date || null;
      const records = db.prepare(queries.getMasukKeluarReport).all(
        start_date, start_date,
        end_date, end_date,
        null, null
      );

      let inTotal = 0;
      let outTotal = 0;

      const rows = records.map(r => {
        if (r.tipe === 'masuk') inTotal += r.jumlah;
        else outTotal += r.jumlah;

        return [
          r.tanggal,
          r.nama_barang,
          r.tipe.toUpperCase(),
          `${r.jumlah} ${r.satuan}`,
          r.keterangan || '-'
        ];
      });

      const doc = createPdfReport({
        title: `LAPORAN MUTASI BARANG (${start_date || 'Awal'} s/d ${end_date || 'Sekarang'})`,
        schoolName,
        headers: ['Tanggal', 'Nama Barang', 'Tipe', 'Jumlah', 'Keterangan'],
        rows,
        summary: {
          'Total Barang Masuk': inTotal,
          'Total Barang Keluar': outTotal,
          'Net Perubahan': inTotal - outTotal
        }
      });

      doc.pipe(res);
      doc.end();
    } else if (type === 'warning-stok') {
      res.setHeader('Content-Disposition', 'attachment; filename=laporan-warning-stok.pdf');
      const data = db.prepare(queries.getWarningInventory).all();

      const rows = data.map(item => [
        item.nama_barang,
        item.kategori || '-',
        `${item.stok} ${item.satuan}`,
        `${item.min_stok} ${item.satuan}`,
        `-${item.selisih} ${item.satuan}`
      ]);

      const doc = createPdfReport({
        title: 'LAPORAN PERINGATAN STOK MENIPIS',
        schoolName,
        headers: ['Nama Barang', 'Kategori', 'Stok Saat Ini', 'Batas Minimum', 'Kekurangan'],
        rows,
        summary: {
          'Jumlah Barang Menipis': `${data.length} item`
        }
      });

      doc.pipe(res);
      doc.end();
    } else {
      return res.status(400).json({ error: 'Tipe export PDF tidak didukung' });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDashboardData,
  getStokSummary,
  getMasukKeluarReport,
  getWarningStok,
  exportCsv,
  exportPdf
};
