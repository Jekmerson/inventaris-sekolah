import React, { useState } from 'react';
import Table from '../Common/Table';
import { formatDate } from '../../utils/formatters';

export default function MasukKeluarReport({
  masuk = [],
  keluar = [],
  summary = {},
  loading = false
}) {
  const [activeTab, setActiveTab] = useState('summary');

  const transactionColumns = [
    {
      key: 'tanggal',
      label: 'Tanggal',
      render: (row) => formatDate(row.tanggal)
    },
    { key: 'nama_barang', label: 'Barang' },
    { key: 'kategori', label: 'Kategori' },
    {
      key: 'jumlah',
      label: 'Jumlah',
      render: (row) => `${row.jumlah} ${row.satuan || ''}`
    },
    { key: 'keterangan', label: 'Keterangan', render: (r) => r.keterangan || '-' }
  ];

  return (
    <div>
      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '20px'
        }}
      >
        {[
          { id: 'summary', label: '📊 Ringkasan Mutasi' },
          { id: 'masuk', label: `↓ Barang Masuk (${masuk.length})` },
          { id: 'keluar', label: `↑ Barang Keluar (${keluar.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 18px',
              border: 'none',
              background: 'transparent',
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
              fontWeight: activeTab === tab.id ? 600 : 500,
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'var(--transition)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'summary' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div className="card" style={{ borderLeft: '4px solid var(--secondary)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Unit Masuk</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--secondary)', marginTop: '4px' }}>
              +{summary.total_masuk || 0} unit
            </div>
          </div>
          <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Unit Keluar</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--danger)', marginTop: '4px' }}>
              -{summary.total_keluar || 0} unit
            </div>
          </div>
          <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Net Perubahan Stok</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginTop: '4px' }}>
              {(summary.net_change || 0) >= 0 ? `+${summary.net_change || 0}` : summary.net_change} unit
            </div>
          </div>
        </div>
      )}

      {activeTab === 'masuk' && (
        <Table
          columns={transactionColumns}
          data={masuk}
          loading={loading}
          emptyMessage="Tidak ada transaksi barang masuk pada periode ini."
        />
      )}

      {activeTab === 'keluar' && (
        <Table
          columns={transactionColumns}
          data={keluar}
          loading={loading}
          emptyMessage="Tidak ada transaksi barang keluar pada periode ini."
        />
      )}
    </div>
  );
}
