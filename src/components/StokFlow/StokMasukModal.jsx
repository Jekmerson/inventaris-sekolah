import React, { useState, useEffect } from 'react';
import Modal from '../Common/Modal';
import Input from '../Common/Input';
import Select from '../Common/Select';
import Button from '../Common/Button';
import { formatDateInput } from '../../utils/formatters';

export default function StokMasukModal({
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!barangId) {
      setError('Harap pilih barang');
      return;
    }
    if (!jumlah || Number(jumlah) <= 0) {
      setError('Jumlah masuk harus lebih besar dari 0');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        barang_id: parseInt(barangId, 10),
        jumlah: parseInt(jumlah, 10),
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
      title="Catat Stok Masuk"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Batal
          </Button>
          <Button variant="success" onClick={handleSubmit} loading={submitting}>
            Simpan Stok Masuk
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
            label: `${i.nama_barang} (Sisa saat ini: ${i.stok} ${i.satuan})`
          }))}
          required
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Input
            label={`Jumlah Masuk (${selectedItem?.satuan || 'unit'})`}
            type="number"
            min="1"
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
            required
          />

          <Input
            label="Tanggal Masuk"
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Keterangan / Asal Pengadaan</label>
          <textarea
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            placeholder="contoh: Pengadaan Dana BOS Triwulan 1, No Faktur: INV-091"
            className="form-textarea"
          />
        </div>
      </form>
    </Modal>
  );
}
