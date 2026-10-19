import React from 'react';
import Button from '../Common/Button';
import { IconCheckCircle, IconAlertTriangle, IconPlus } from '../Common/Icons';

export default function WarningStok({ items = [], onRestock }) {
  if (!items.length) {
    return (
      <div
        className="card"
        style={{
          borderColor: 'rgba(16, 185, 129, 0.25)',
          background: 'rgba(16, 185, 129, 0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '20px'
        }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#34D399',
            flexShrink: 0
          }}
        >
          <IconCheckCircle size={22} color="#34D399" />
        </div>
        <div>
          <h4 style={{ fontSize: '0.95rem', color: '#34D399', fontWeight: 700 }}>Stok Aman</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
            Semua barang berada di atas batas minimum stok.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="card"
      style={{
        borderLeft: '4px solid #F59E0B'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
            <IconAlertTriangle size={18} />
            <span>Peringatan Stok Menipis</span>
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
            {items.length} jenis barang butuh pengadaan segera
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              transition: 'var(--transition)'
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>{item.nama_barang}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Sisa: <strong style={{ color: '#F43F5E' }}>{item.stok}</strong> {item.satuan} <span style={{ color: 'var(--text-subtle)' }}>(Min: {item.min_stok})</span>
              </div>
            </div>
            {onRestock && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onRestock(item)}
                style={{ fontSize: '0.75rem', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <IconPlus size={13} />
                <span>Isi Stok</span>
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
