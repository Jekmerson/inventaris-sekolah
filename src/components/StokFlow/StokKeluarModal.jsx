import React, { useState, useEffect } from 'react';
import Modal from '../Common/Modal';
import Input from '../Common/Input';
import Select from '../Common/Select';
import Button from '../Common/Button';
import { formatDateInput } from '../../utils/formatters';

export default function StokKeluarModal({
  isOpen,
  onClose,
  onSubmit,
  items = [],
  preselectedItem = null
}) {
  const [barangId, setBarangId] = useState('');
  const [jumlah, setJumlah] = useState(1);
  const [keterangan, setKeterangan] = useState('');
  const [tanggal, setTanggal] = useState(formatDateInput());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (preselectedItem) {
      setBarangId(String(preselectedItem.id));
    } else if (items.length > 0 && !barangId) {
      setBarangId(String(items[0].id));
    }
    setJumlah(1);
    setKeterangan('');
    setTanggal(formatDateInput());
    setError('');
  }, [isOpen, preselectedItem, items]);

  const selectedItem = items.find((i) => String(i.id) === String(barangId));
  const currentStock = selectedItem ? selectedItem.stok : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!barangId) {
      setError('Harap pilih barang');
      return;
    }

    const qty = parseInt(jumlah, 10);
    if (!qty || qty <= 0) {
      setError('Jumlah keluar harus lebih besar dari 0');
      return;
    }

    if (qty > currentStock) {
      setError(
        `Jumlah keluar (${qty}) melebihi stok yang tersedia (${currentStock} ${selectedItem?.satuan || ''})`
      );
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        barang_id: parseInt(barangId, 10),
        jumlah: qty,
        keterangan,
        tanggal
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Catat Stok Keluar"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Batal
          </Button>
          <Button
            variant="danger"
            onClick={handleSubmit}
            loading={submitting}
            disabled={currentStock <= 0}
          >
            Simpan Stok Keluar
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--danger-light)',
              color: 'var(--danger)',
              marginBottom: '16px',
              fontSize: '0.85rem'
            }}
          >
            {error}
          </div>
        )}

        <Select
          label="Pilih Barang"
          value={barangId}
          onChange={(e) => setBarangId(e.target.value)}
          options={items.map((i) => ({
            value: i.id,
            label: `${i.nama_barang} (Stok: ${i.stok} ${i.satuan})`
          }))}
          required
        />

        {selectedItem && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: currentStock > 0 ? 'var(--bg-elevated)' : 'var(--danger-light)',
              marginBottom: '16px',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Stok Tersedia Saat Ini:
            </span>
            <span
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: currentStock > 0 ? 'var(--text-main)' : 'var(--danger)'
              }}
            >
              {currentStock} {selectedItem.satuan}
            </span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Input
            label={`Jumlah Keluar (Maks: ${currentStock})`}
            type="number"
            min="1"
            max={currentStock}
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
            disabled={currentStock <= 0}
            required
          />

          <Input
            label="Tanggal Keluar"
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Keterangan / Keperluan Pemakaian</label>
          <textarea
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            placeholder="contoh: Dibagikan ke Ruang Lab Komputer, Diterima oleh Pak Budi"
            className="form-textarea"
          />
        </div>
      </form>
    </Modal>
  );
}
