import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLicense } from '../../hooks/useLicense';
import { IconUser, IconCheckCircle, IconAlertTriangle } from '../Common/Icons';
import ThemeToggle from '../Common/ThemeToggle';

export default function Header({ title = 'Inventaris Sekolah' }) {
  const { user } = useAuth();
  const { isActivated, schoolName } = useLicense();

  const today = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  return (
    <header
      style={{
        height: '70px',
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        transition: 'background-color 0.25s ease, border-color 0.25s ease'
      }}
    >
      <div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>{title}</h1>
        <p style={{ fontSize: '0.775rem', color: 'var(--text-subtle)', marginTop: '2px' }}>{today}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {isActivated ? (
          <span className="badge badge-masuk" title={schoolName} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <IconCheckCircle size={13} />
            <span>Lisensi Aktif</span>
          </span>
        ) : (
          <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <IconAlertTriangle size={13} />
            <span>Belum Aktivasi</span>
          </span>
        )}

        {/* Theme Toggle Button */}
        <ThemeToggle showLabel={true} />

        {/* User Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.8rem',
              border: '1px solid var(--primary-glow)'
            }}
          >
            <IconUser size={14} />
          </div>
          <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-main)' }}>
            {user?.username || 'Admin'}
          </span>
        </div>
      </div>
    </header>
  );
}
