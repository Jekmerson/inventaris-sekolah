import React from 'react';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import { formatDate } from '../../utils/formatters';

export default function UndoConfirm({
  isOpen,
  onClose,
  onConfirm,
  transaction,
  loading = false
}) {
  if (!transaction) return null;

  const isMasuk = transaction.tipe === 'masuk';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Konfirmasi Undo Transaksi"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button variant="warning" onClick={onConfirm} loading={loading}>
            Ya, Batalkan Transaksi
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '2rem' }}>↩️</div>
        <div>
          <p style={{ color: 'var(--text-main)', marginBottom: '8px' }}>
            Apakah Anda yakin ingin membatalkan transaksi mutasi berikut?
          </p>
          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-elevated)',
              marginBottom: '12px',
              fontSize: '0.85rem'
            }}
          >
            <div><strong>Barang:</strong> {transaction.nama_barang}</div>
            <div><strong>Tipe:</strong> {transaction.tipe.toUpperCase()}</div>
            <div><strong>Jumlah:</strong> {transaction.jumlah} {transaction.satuan || ''}</div>
            <div><strong>Tanggal:</strong> {formatDate(transaction.tanggal)}</div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--warning)' }}>
            Efek pembatalan: Stok barang <strong>"{transaction.nama_barang}"</strong> akan otomatis di-
            {isMasuk ? 'kurangi' : 'tambah'} sebanyak {transaction.jumlah} unit.
          </p>
        </div>
      </div>
    </Modal>
  );
}
