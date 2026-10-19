import React, { useState, useEffect } from 'react';
import Modal from '../Common/Modal';
import Input from '../Common/Input';
import Select from '../Common/Select';
import Button from '../Common/Button';
import { COMMON_UNITS } from '../../utils/constants';

export default function InventoryForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  categories = []
}) {
  const [formData, setFormData] = useState({
    nama_barang: '',
    kategori: 'Alat Tulis',
    satuan: 'pcs',
    harga_satuan: 0,
    min_stok: 10,
    deskripsi: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        nama_barang: initialData.nama_barang || '',
        kategori: initialData.kategori || 'Alat Tulis',
        satuan: initialData.satuan || 'pcs',
        harga_satuan: initialData.harga_satuan || 0,
        min_stok: initialData.min_stok !== undefined ? initialData.min_stok : 10,
        deskripsi: initialData.deskripsi || ''
      });
    } else {
      setFormData({
        nama_barang: '',
        kategori: categories[0] || 'Alat Tulis',
        satuan: 'pcs',
        harga_satuan: 0,
        min_stok: 10,
        deskripsi: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.nama_barang.trim()) {
      newErrors.nama_barang = 'Nama barang wajib diisi';
    }
    if (!formData.satuan.trim()) {
      newErrors.satuan = 'Satuan wajib diisi';
    }
    if (Number(formData.harga_satuan) < 0) {
      newErrors.harga_satuan = 'Harga tidak boleh negatif';
    }
    if (Number(formData.min_stok) < 0) {
      newErrors.min_stok = 'Minimum stok tidak boleh negatif';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        harga_satuan: parseFloat(formData.harga_satuan) || 0,
        min_stok: parseInt(formData.min_stok, 10) || 0
      });
      onClose();
    } catch (err) {
      setErrors({ form: err.response?.data?.error || err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Data Barang' : 'Tambah Barang Baru'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={submitting}>
            {initialData ? 'Simpan Perubahan' : 'Tambah Barang'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {errors.form && (
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
            {errors.form}
          </div>
        )}

        <Input
          label="Nama Barang"
          name="nama_barang"
          value={formData.nama_barang}
          onChange={handleChange}
          placeholder="contoh: Spidol Whiteboard Snowman"
          required
          error={errors.nama_barang}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Select
            label="Kategori"
            name="kategori"
            value={formData.kategori}
            onChange={handleChange}
            options={categories.map((c) => ({ value: c, label: c }))}
            placeholder=""
          />

          <Select
            label="Satuan"
            name="satuan"
            value={formData.satuan}
            onChange={handleChange}
            options={COMMON_UNITS.map((u) => ({ value: u, label: u }))}
            placeholder=""
            required
            error={errors.satuan}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Input
            label="Harga Satuan (Rp)"
            name="harga_satuan"
            type="number"
            min="0"
            step="100"
            value={formData.harga_satuan}
            onChange={handleChange}
            error={errors.harga_satuan}
          />

          <Input
            label="Batas Minimum Stok"
            name="min_stok"
            type="number"
            min="0"
            value={formData.min_stok}
            onChange={handleChange}
            helperText="Notifikasi muncul jika stok < nilai ini"
            error={errors.min_stok}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Deskripsi / Lokasi Penyimpanan</label>
          <textarea
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            placeholder="contoh: Lemari A, Rak 2 Ruang Guru"
            className="form-textarea"
          />
        </div>
      </form>
    </Modal>
  );
}
