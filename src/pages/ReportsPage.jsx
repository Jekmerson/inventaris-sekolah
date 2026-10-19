import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import StokSummary from '../components/Reports/StokSummary';
import MasukKeluarReport from '../components/Reports/MasukKeluarReport';
import WarningReport from '../components/Reports/WarningReport';
import ExportButton from '../components/Reports/ExportButton';
import DateRangePicker from '../components/Reports/DateRangePicker';
import { reportsAPI, inventoryAPI } from '../services/api';
import { useNotification } from '../hooks/useNotification';
import { formatDateInput, formatRupiah } from '../utils/formatters';
import { IconInventory, IconMutasi, IconAlertTriangle } from '../components/Common/Icons';
import Select from '../components/Common/Select';

export default function ReportsPage() {
  const { notifyError } = useNotification();
  const [activeReport, setActiveReport] = useState('summary'); // summary | mutasi | warning

  // Data states
  const [stokData, setStokData] = useState([]);
  const [stokTotals, setStokTotals] = useState({ total_barang: 0, total_unit: 0, total_value: 0 });
  const [mutasiData, setMutasiData] = useState({ masuk: [], keluar: [], summary: {} });
  const [warningData, setWarningData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(1); // First day of current month
    return formatDateInput(d);
  });
  const [endDate, setEndDate] = useState(formatDateInput());

  const fetchCategories = useCallback(async () => {
    try {
      const res = await inventoryAPI.getCategories();
      setCategories(res.data?.data || []);
    } catch (e) {}
  }, []);

  const fetchReportData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeReport === 'summary') {
        const res = await reportsAPI.getStokSummary({ kategori: category || undefined });
        setStokData(res.data?.data || []);
        setStokTotals({
          total_barang: res.data?.total_barang || 0,
          total_unit: res.data?.total_unit || 0,
          total_value: res.data?.total_value || 0
        });
      } else if (activeReport === 'mutasi') {
        const res = await reportsAPI.getMasukKeluar({
          start_date: startDate || undefined,
          end_date: endDate || undefined,
          kategori: category || undefined
        });
        setMutasiData(res.data || { masuk: [], keluar: [], summary: {} });
      } else if (activeReport === 'warning') {
        const res = await reportsAPI.getWarningStok();
        setWarningData(res.data?.data || []);
      }
    } catch (err) {
      console.error('Fetch report error:', err);
      notifyError('Gagal memuat data laporan');
    } finally {
      setLoading(false);
    }
  }, [activeReport, category, startDate, endDate, notifyError]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const handleExportCsv = () => {
    if (activeReport === 'summary') {
      reportsAPI.exportCsv({ type: 'stok-summary', kategori: category || undefined });
    } else if (activeReport === 'mutasi') {
      reportsAPI.exportCsv({ type: 'masuk-keluar', start_date: startDate, end_date: endDate, kategori: category || undefined });
    } else if (activeReport === 'warning') {
      reportsAPI.exportCsv({ type: 'warning-stok' });
    }
  };

  const handleExportPdf = () => {
    if (activeReport === 'summary') {
      reportsAPI.exportPdf({ type: 'stok-summary', kategori: category || undefined });
    } else if (activeReport === 'mutasi') {
      reportsAPI.exportPdf({ type: 'masuk-keluar', start_date: startDate, end_date: endDate, kategori: category || undefined });
    } else if (activeReport === 'warning') {
      reportsAPI.exportPdf({ type: 'warning-stok' });
    }
  };

  return (
    <MainLayout title="Laporan & Ekspor Data">
      {/* Header and Export Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h2>Laporan Inventaris Sekolah</h2>
          <p>Cetak atau unduh rekapitulasi stok dan catatan mutasi dalam format CSV atau PDF resmi</p>
        </div>

        <ExportButton
          onExportCsv={handleExportCsv}
          onExportPdf={handleExportPdf}
          loading={loading}
        />
      </div>

      {/* Report Selection Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          background: 'var(--bg-card)',
          padding: '6px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '24px',
          width: 'fit-content'
        }}
      >
        {[
          { id: 'summary', label: 'Rekapitulasi Stok', icon: IconInventory },
          { id: 'mutasi', label: 'Mutasi Masuk & Keluar', icon: IconMutasi },
          { id: 'warning', label: 'Peringatan Stok Menipis', icon: IconAlertTriangle }
        ].map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeReport === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveReport(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                border: isActive ? '1px solid var(--primary-glow)' : '1px solid transparent',
                borderRadius: 'var(--radius-sm)',
                background: isActive ? 'var(--primary-light)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                fontSize: '0.875rem',
                boxShadow: isActive ? '0 4px 12px var(--primary-light)' : 'none',
                transition: 'var(--transition)'
              }}
            >
              <IconComponent size={16} color={isActive ? 'var(--primary)' : 'currentColor'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Toolbar */}
      <div
        className="card"
        style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: '24px',
          padding: '16px'
        }}
      >
        {activeReport !== 'warning' && (
          <div style={{ width: '220px' }}>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={categories.map((c) => ({ value: c, label: c }))}
              placeholder="Semua Kategori"
              className="mb-0"
            />
          </div>
        )}

        {activeReport === 'mutasi' && (
          <DateRangePicker
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
          />
        )}
      </div>

      {/* Report Content */}
      {activeReport === 'summary' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div className="card">
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Jumlah Jenis Barang</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '4px' }}>
                {stokTotals.total_barang} item
              </div>
            </div>
            <div className="card">
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Unit Fisik</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '4px' }}>
                {stokTotals.total_unit} unit
              </div>
            </div>
            <div className="card">
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Nilai Aset</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--secondary)', marginTop: '4px' }}>
                {formatRupiah(stokTotals.total_value)}
              </div>
            </div>
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <StokSummary data={stokData} loading={loading} />
          </div>
        </>
      )}

      {activeReport === 'mutasi' && (
        <div className="card" style={{ padding: '24px' }}>
          <MasukKeluarReport
            masuk={mutasiData.masuk}
            keluar={mutasiData.keluar}
            summary={mutasiData.summary}
            loading={loading}
          />
        </div>
      )}

      {activeReport === 'warning' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <WarningReport data={warningData} loading={loading} />
        </div>
      )}
    </MainLayout>
  );
}
