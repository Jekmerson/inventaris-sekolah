import React from 'react';
import Table from '../Common/Table';

export default function WarningReport({ data = [], loading = false }) {
  const columns = [
    { key: 'nama_barang', label: 'Nama Barang' },
    { key: 'kategori', label: 'Kategori' },
    {
      key: 'stok',
      label: 'Sisa Stok',
      render: (row) => (
        <span style={{ color: 'var(--danger)', fontWeight: 700 }}>
          {row.stok} {row.satuan}
        </span>
      )
    },
    {
      key: 'min_stok',
      label: 'Batas Minimum',
      render: (row) => `${row.min_stok} ${row.satuan}`
    },
    {
      key: 'selisih',
      label: 'Kekurangan',
      render: (row) => (
        <span className="badge badge-warning">
          -{row.selisih} {row.satuan}
        </span>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      data={data}
      loading={loading}
      emptyMessage="Tidak ada barang dalam kondisi stok menipis."
    />
  );
}
