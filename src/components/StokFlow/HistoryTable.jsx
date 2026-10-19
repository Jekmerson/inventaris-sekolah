import React from 'react';
import Table from '../Common/Table';
import Button from '../Common/Button';
import { formatDate } from '../../utils/formatters';
import { IconArrowDown, IconArrowUp, IconUndo } from '../Common/Icons';

export default function HistoryTable({
  data = [],
  loading = false,
  onUndo
}) {
  const columns = [
    {
      key: 'tanggal',
      label: 'Tanggal',
      render: (row) => formatDate(row.tanggal)
    },
    {
      key: 'nama_barang',
      label: 'Nama Barang',
      render: (row) => <strong style={{ color: 'var(--text-main)' }}>{row.nama_barang}</strong>
    },
    {
      key: 'tipe',
      label: 'Tipe',
      render: (row) => (
        <span className={`badge badge-${row.tipe}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          {row.tipe === 'masuk' ? (
            <>
              <IconArrowDown size={12} color="#34D399" />
              <span>Masuk</span>
            </>
          ) : (
            <>
              <IconArrowUp size={12} color="#FB7185" />
              <span>Keluar</span>
            </>
          )}
        </span>
      )
    },
    {
      key: 'jumlah',
      label: 'Jumlah',
      render: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
          {row.jumlah} {row.satuan || ''}
        </span>
      )
    },
    {
      key: 'keterangan',
      label: 'Keterangan',
      render: (row) => row.keterangan || <span style={{ color: 'var(--text-subtle)' }}>-</span>
    },
    {
      key: 'created_by',
      label: 'Oleh',
      render: (row) => (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {row.created_by || 'admin'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Aksi',
      align: 'right',
      render: (row) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onUndo(row)}
          title="Batalkan transaksi ini dan kembalikan stok"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <IconUndo size={14} color="#818CF8" />
          <span>Batalkan</span>
        </Button>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      data={data}
      loading={loading}
      emptyMessage="Belum ada riwayat transaksi mutasi stok."
    />
  );
}
