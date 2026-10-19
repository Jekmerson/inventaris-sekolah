import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLicense } from '../../hooks/useLicense';
import {
  IconDashboard,
  IconInventory,
  IconMutasi,
  IconReports,
  IconSettings,
  IconSchool,
  IconLogout,
  IconUser
} from '../Common/Icons';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { schoolName } = useLicense();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: IconDashboard },
    { to: '/inventory', label: 'Inventaris Barang', icon: IconInventory },
    { to: '/stok-flow', label: 'Mutasi Stok', icon: IconMutasi },
    { to: '/reports', label: 'Laporan & Export', icon: IconReports },
    { to: '/settings', label: 'Pengaturan & Backup', icon: IconSettings }
  ];

  return (
    <aside
      className="sidebar"
      style={{
        width: 'var(--sidebar-width)',
        backgroundColor: 'var(--bg-sidebar)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 100,
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.08)',
        transition: 'background-color 0.25s ease, border-color 0.25s ease'
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '24px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px var(--primary-glow), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            flexShrink: 0
          }}
        >
          <IconSchool size={22} color="#FFFFFF" />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              Inventaris
            </h2>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 8px #10B981'
              }}
              title="Online & Ready"
            />
          </div>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginTop: '1px'
            }}
          >
            {schoolName || 'SMP Negeri 1 Jakarta'}
          </span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav style={{ padding: '24px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div
          style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-subtle)',
            padding: '0 12px 6px 12px'
          }}
        >
          Menu Utama
        </div>

        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.875rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                border: isActive ? '1px solid var(--primary-glow)' : '1px solid transparent',
                boxShadow: isActive ? '0 4px 14px var(--primary-light)' : 'none',
                transition: 'var(--transition)'
              })}
            >
              {({ isActive }) => (
                <>
                  <IconComponent
                    size={19}
                    color={isActive ? 'var(--primary)' : 'var(--text-subtle)'}
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom User & Logout Pill */}
      <div
        style={{
          padding: '18px 14px',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'transparent'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'var(--primary-light)',
                border: '1px solid var(--primary-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                flexShrink: 0
              }}
            >
              <IconUser size={16} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {user?.username || 'admin'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                Administrator
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition)'
            }}
            title="Keluar"
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <IconLogout size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
