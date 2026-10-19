import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import HistoryTable from '../components/StokFlow/HistoryTable';
import StokMasukModal from '../components/StokFlow/StokMasukModal';
import StokKeluarModal from '../components/StokFlow/StokKeluarModal';
import UndoConfirm from '../components/StokFlow/UndoConfirm';
import Button from '../components/Common/Button';
import Select from '../components/Common/Select';
import Input from '../components/Common/Input';
import { inventoryAPI, stokAPI } from '../services/api';
import { useNotification } from '../hooks/useNotification';
import { IconArrowDown, IconArrowUp } from '../components/Common/Icons';

export default function StokFlowPage() {
  const { notifySuccess, notifyError } = useNotification();

  const [history, setHistory] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [selectedBarangId, setSelectedBarangId] = useState('');
  const [tipe, setTipe] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Modals
  const [isMasukOpen, setIsMasukOpen] = useState(false);
  const [isKeluarOpen, setIsKeluarOpen] = useState(false);
  const [isUndoOpen, setIsUndoOpen] = useState(false);
  const [undoTarget, setUndoTarget] = useState(null);
  const [undoLoading, setUndoLoading] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      const res = await inventoryAPI.getAll({ limit: 500 });
      setItems(res.data?.data || []);
    } catch (err) {
      console.error('Fetch items error:', err);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await stokAPI.getHistory({
        barang_id: selectedBarangId || undefined,
        tipe: tipe || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        page,
        limit: 50
      });
      setHistory(res.data?.data || []);
      setTotalPages(res.data?.totalPages || 1);
      setTotalRecords(res.data?.total || 0);
    } catch (err) {
      console.error('Fetch history error:', err);
      notifyError('Gagal memuat data riwayat mutasi stok');
    } finally {
      setLoading(false);
    }
  }, [selectedBarangId, tipe, startDate, endDate, page, notifyError]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleStokMasuk = async (formData) => {
    await stokAPI.masuk(formData);
    notifySuccess('Stok masuk berhasil dicatat!');
    fetchHistory();
    fetchItems();
  };

  const handleStokKeluar = async (formData) => {
    await stokAPI.keluar(formData);
    notifySuccess('Stok keluar berhasil dicatat!');
    fetchHistory();
    fetchItems();
  };

  const handleUndoConfirm = async () => {
    if (!undoTarget) return;
    setUndoLoading(true);
    try {
      await stokAPI.undo(undoTarget.id);
      notifySuccess('Transaksi berhasil dibatalkan (undo) dan stok telah disesuaikan.');
      setIsUndoOpen(false);
      setUndoTarget(null);
      fetchHistory();
      fetchItems();
    } catch (err) {
      notifyError(err.response?.data?.error || 'Gagal membatalkan transaksi.');
    } finally {
      setUndoLoading(false);
    }
  };

  return (
    <MainLayout title="Mutasi Stok Barang">
      {/* Top Header & Actions */}
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
          <h2>Riwayat Mutasi & Transaksi</h2>
          <p>Catat pengadaan masuk, pemakaian keluar, atau batalkan transaksi ({totalRecords} catatan)</p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Button
            variant="success"
            onClick={() => setIsMasukOpen(true)}
            icon={<IconArrowDown size={16} />}
          >
            Stok Masuk
          </Button>
          <Button
            variant="danger"
            onClick={() => setIsKeluarOpen(true)}
            icon={<IconArrowUp size={16} />}
          >
            Stok Keluar
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className="card"
        style={{
          display: 'flex',
          gap: '14px',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: '24px',
          padding: '16px'
        }}
      >
        <div style={{ flex: '1 1 220px' }}>
          <Select
            value={selectedBarangId}
            onChange={(e) => {
              setSelectedBarangId(e.target.value);
              setPage(1);
            }}
            options={items.map((i) => ({ value: i.id, label: i.nama_barang }))}
            placeholder="Semua Barang"
            className="mb-0"
          />
        </div>

        <div style={{ width: '160px' }}>
          <Select
            value={tipe}
            onChange={(e) => {
              setTipe(e.target.value);
              setPage(1);
            }}
            options={[
              { value: 'masuk', label: '↓ Masuk Saja' },
              { value: 'keluar', label: '↑ Keluar Saja' }
            ]}
            placeholder="Semua Tipe"
            className="mb-0"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setPage(1);
            }}
            placeholder="Mulai"
            className="mb-0"
          />
          <span style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>s/d</span>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setPage(1);
            }}
            placeholder="Sampai"
            className="mb-0"
          />
        </div>

        {(selectedBarangId || tipe || startDate || endDate) && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedBarangId('');
              setTipe('');
              setStartDate('');
              setEndDate('');
              setPage(1);
            }}
          >
            Reset Filter
          </Button>
        )}
      </div>

      {/* History Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <HistoryTable
          data={history}
          loading={loading}
          onUndo={(item) => {
            setUndoTarget(item);
            setIsUndoOpen(true);
          }}
        />

        {totalPages > 1 && (
          <div className="pagination">
            <span>
              Halaman {page} dari {totalPages} ({totalRecords} transaksi)
            </span>
            <div className="pagination-controls">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                ‹ Sebelumnya
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Berikutnya ›
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Stock In Modal */}
      <StokMasukModal
        isOpen={isMasukOpen}
        onClose={() => setIsMasukOpen(false)}
        onSubmit={handleStokMasuk}
        items={items}
      />

      {/* Stock Out Modal */}
      <StokKeluarModal
        isOpen={isKeluarOpen}
        onClose={() => setIsKeluarOpen(false)}
        onSubmit={handleStokKeluar}
        items={items}
      />

      {/* Undo Modal */}
      <UndoConfirm
        isOpen={isUndoOpen}
        onClose={() => {
          setIsUndoOpen(false);
          setUndoTarget(null);
        }}
        onConfirm={handleUndoConfirm}
        transaction={undoTarget}
        loading={undoLoading}
      />
    </MainLayout>
  );
}
