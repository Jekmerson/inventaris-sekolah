import React from 'react';

export default function Loading({ message = 'Memuat...', size = 32 }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '24px'
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          border: '3px solid rgba(59, 130, 246, 0.2)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}
      />
      {message && (
        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {message}
        </span>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
