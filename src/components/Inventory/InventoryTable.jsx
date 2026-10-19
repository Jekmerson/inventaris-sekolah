import React from 'react';
import Table from '../Common/Table';
import Button from '../Common/Button';
import { formatRupiah } from '../../utils/formatters';
import { IconEdit, IconTrash } from '../Common/Icons';

export default function InventoryTable({
  data = [],
  loading = false,
  onEdit,
  onDelete,
  onStokMasuk,
  onStokKeluar
}) {
  const columns = [
    {
      key: 'nama_barang',
      label: 'Nama Barang',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.nama_barang}</div>
          {row.deskripsi && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
              {row.deskripsi}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'kategori',
      label: 'Kategori',
      render: (row) => (
        <span
          style={{
            fontSize: '0.8rem',
            padding: '2px 8px',
            background: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          {row.kategori || '-'}
        </span>
      )
    },
    {
      key: 'stok',
      label: 'Stok',
      render: (row) => {
        const isWarning = row.stok < row.min_stok;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 700, color: isWarning ? 'var(--warning)' : 'var(--text-main)' }}>
              {row.stok} {row.satuan}
            </span>
            {isWarning && (
              <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>
                Menipis
              </span>
            )}
          </div>
        );
      }
    },
    {
      key: 'harga_satuan',
      label: 'Harga Satuan',
      render: (row) => formatRupiah(row.harga_satuan)
    },
    {
      key: 'total_value',
      label: 'Total Nilai',
      render: (row) => formatRupiah(row.stok * row.harga_satuan)
    },
    {
      key: 'actions',
      label: 'Aksi',
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onStokMasuk && onStokMasuk(row)}
            title="Tambah Stok Masuk"
          >
            + Masuk
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onStokKeluar && onStokKeluar(row)}
            title="Keluarkan Stok"
          >
            - Keluar
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(row)}
            title="Edit Data Barang"
          >
            <IconEdit size={14} />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(row)}
            title="Hapus Barang"
            style={{ padding: '6px 8px' }}
          >
            <IconTrash size={14} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      data={data}
      loading={loading}
      emptyMessage="Tidak ada barang dalam inventaris."
    />
  );
}
