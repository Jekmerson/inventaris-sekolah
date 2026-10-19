import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Notification from '../Common/Notification';

export default function MainLayout({ title, children }) {
  return (
    <div className="app-layout" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div
        className="main-content"
        style={{
          marginLeft: 'var(--sidebar-width)',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          backgroundColor: 'var(--bg-main)'
        }}
      >
        <Header title={title} />
        <main style={{ padding: '32px', flex: 1 }}>{children}</main>
        <footer
          style={{
            padding: '16px 32px',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.75rem',
            color: 'var(--text-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>Inventaris Sekolah Desktop v1.0.0</span>
          <span>Sistem Manajemen Inventaris Mandiri (Lifetime License)</span>
        </footer>
      </div>
      <Notification />
    </div>
  );
}
