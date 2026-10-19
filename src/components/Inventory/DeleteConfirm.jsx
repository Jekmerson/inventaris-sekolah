import React from 'react';
import Modal from '../Common/Modal';
import Button from '../Common/Button';

export default function DeleteConfirm({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  loading = false
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Konfirmasi Hapus Barang"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            Ya, Hapus Barang
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '2rem' }}>⚠️</div>
        <div>
          <p style={{ color: 'var(--text-main)', marginBottom: '8px' }}>
            Apakah Anda yakin ingin menghapus barang <strong>"{itemName}"</strong>?
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>
            Perhatian: Menghapus barang ini juga akan menghapus seluruh catatan riwayat transaksi mutasi stok terkait. Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
      </div>
    </Modal>
  );
}
