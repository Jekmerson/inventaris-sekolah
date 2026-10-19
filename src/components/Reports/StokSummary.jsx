import React from 'react';
import Table from '../Common/Table';
import { formatRupiah } from '../../utils/formatters';

export default function StokSummary({ data = [], loading = false }) {
  const columns = [
    { key: 'nama_barang', label: 'Nama Barang' },
    { key: 'kategori', label: 'Kategori' },
    {
      key: 'stok',
      label: 'Sisa Stok',
      render: (row) => `${row.stok} ${row.satuan}`
    },
    {
      key: 'harga_satuan',
      label: 'Harga Satuan',
      render: (row) => formatRupiah(row.harga_satuan)
    },
    {
      key: 'total_value',
      label: 'Total Nilai Aset',
      render: (row) => formatRupiah(row.total_value)
    }
  ];

  return (
    <Table
      columns={columns}
      data={data}
      loading={loading}
      emptyMessage="Tidak ada data ringkasan stok."
    />
  );
}
