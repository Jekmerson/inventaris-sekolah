import React from 'react';
import Table from '../Common/Table';
import { formatDate } from '../../utils/formatters';
import { IconArrowDown, IconArrowUp } from '../Common/Icons';

export default function RecentTransactions({ transactions = [], loading = false }) {
  const columns = [
    {
      key: 'tanggal',
      label: 'Tanggal',
      render: (row) => formatDate(row.tanggal)
    },
    {
      key: 'nama_barang',
      label: 'Barang',
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
      render: (row) => `${row.jumlah} ${row.satuan || ''}`
    },
    {
      key: 'keterangan',
      label: 'Keterangan',
      render: (row) => row.keterangan || <span style={{ color: 'var(--text-subtle)' }}>-</span>
    }
  ];

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div>
          <h3 style={{ color: 'var(--text-main)', fontWeight: 700 }}>Transaksi Terbaru</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
            10 mutasi stok terakhir
          </p>
        </div>
      </div>
      <Table
        columns={columns}
        data={transactions}
        loading={loading}
        emptyMessage="Belum ada transaksi mutasi stok."
      />
    </div>
  );
}
