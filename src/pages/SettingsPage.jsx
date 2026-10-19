import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import Input from '../components/Common/Input';
import Button from '../components/Common/Button';
import Table from '../components/Common/Table';
import Modal from '../components/Common/Modal';
import { useAuth } from '../hooks/useAuth';
import { useLicense } from '../hooks/useLicense';
import { useNotification } from '../hooks/useNotification';
import { useTheme } from '../context/ThemeContext';
import { backupAPI } from '../services/api';
import { formatDate } from '../utils/formatters';
import { IconDatabase, IconLock, IconKey, IconSchool, IconSun, IconMoon } from '../components/Common/Icons';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { changePassword } = useAuth();
  const { isActivated, schoolName, licenseKey, deviceId, activationDate, resetLicense } = useLicense();
  const { notifySuccess, notifyError } = useNotification();
  const { theme, setTheme, isDark } = useTheme();

  const [activeTab, setActiveTab] = useState('backup'); // backup | password | license | theme

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  // Backup states
  const [backups, setBackups] = useState([]);
  const [backupLoading, setBackupLoading] = useState(false);
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [selectedBackupForRestore, setSelectedBackupForRestore] = useState(null);
  const [restoring, setRestoring] = useState(false);

  const fetchBackups = useCallback(async () => {
    setBackupLoading(true);
    try {
      const res = await backupAPI.getList();
      setBackups(res.data?.backups || []);
    } catch (err) {
      console.error('Fetch backups error:', err);
    } finally {
      setBackupLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'backup') {
      fetchBackups();
    }
  }, [activeTab, fetchBackups]);

  // Handle password submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      notifyError('Password baru minimal 6 karakter');
      return;
    }
    if (newPassword !== confirmPassword) {
      notifyError('Konfirmasi password tidak cocok');
      return;
    }

    setPassLoading(true);
    try {
      await changePassword(oldPassword, newPassword);
      notifySuccess('Password admin berhasil diubah!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      notifyError(err.response?.data?.error || 'Gagal mengubah password');
    } finally {
      setPassLoading(false);
    }
  };

  // Handle reset license
  const handleResetLicense = async () => {
    if (window.confirm('Apakah Anda yakin ingin mereset/mencabut lisensi aplikasi? Anda akan dialihkan ke halaman aktivasi lisensi.')) {
      try {
        await resetLicense();
        notifySuccess('Lisensi berhasil direset!');
        navigate('/license');
      } catch (err) {
        notifyError('Gagal mereset lisensi');
      }
    }
  };

  // Handle manual backup
  const handleCreateBackup = async () => {
    setCreatingBackup(true);
    try {
      const res = await backupAPI.create();
      notifySuccess(`Backup berhasil dibuat: ${res.data.filename}`);
      fetchBackups();
    } catch (err) {
      notifyError(err.response?.data?.error || 'Gagal membuat backup');
    } finally {
      setCreatingBackup(false);
    }
  };

  // Handle restore confirm
  const handleRestoreSubmit = async () => {
    if (!selectedBackupForRestore) return;
    setRestoring(true);
    try {
      await backupAPI.restore(selectedBackupForRestore.filename);
      notifySuccess('Database berhasil dipulihkan! Halaman akan memuat ulang.');
      setRestoreModalOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      notifyError(err.response?.data?.error || 'Gagal merestore backup');
    } finally {
      setRestoring(false);
    }
  };

  const backupColumns = [
    {
      key: 'filename',
      label: 'Nama File Backup',
      render: (row) => <code style={{ color: 'var(--primary)' }}>{row.filename}</code>
    },
    {
      key: 'date',
      label: 'Waktu Backup',
      render: (row) => formatDate(row.date)
    },
    {
      key: 'size',
      label: 'Ukuran',
      render: (row) => `${(row.size / 1024).toFixed(1)} KB`
    },
    {
      key: 'actions',
      label: 'Aksi',
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <a
            href={backupAPI.getDownloadUrl(row.filename)}
            className="btn btn-secondary btn-sm"
            download
            title="Unduh file backup database"
          >
            💾 Unduh
          </a>
          <Button
            variant="warning"
            size="sm"
            onClick={() => {
              setSelectedBackupForRestore(row);
              setRestoreModalOpen(true);
            }}
            title="Pulihkan database dari file ini"
          >
            🔄 Restore
          </Button>
        </div>
      )
    }
  ];

  return (
    <MainLayout title="Pengaturan & Backup Data">
      <div style={{ marginBottom: '24px' }}>
        <h2>Pengaturan Aplikasi</h2>
        <p>Kelola keamanan akun admin, cadangan database, dan informasi lisensi perangkat</p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          background: 'var(--bg-card)',
          padding: '6px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '28px',
          width: 'fit-content'
        }}
      >
        {[
          { id: 'backup', label: 'Backup & Restore Database', icon: IconDatabase },
          { id: 'password', label: 'Ganti Password Admin', icon: IconLock },
          { id: 'license', label: 'Status Lisensi & Perangkat', icon: IconKey },
          { id: 'theme', label: 'Tema Tampilan', icon: isDark ? IconMoon : IconSun }
        ].map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                border: isActive ? '1px solid var(--primary-glow)' : '1px solid transparent',
                borderRadius: 'var(--radius-sm)',
                background: isActive ? 'var(--primary-light)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                fontSize: '0.875rem',
                boxShadow: isActive ? '0 4px 12px var(--primary-light)' : 'none',
                transition: 'var(--transition)'
              }}
            >
              <IconComponent size={16} color={isActive ? 'var(--primary)' : 'currentColor'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Backup Tab */}
      {activeTab === 'backup' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            className="card"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>Cadangkan Database Sekarang</h3>
              <p style={{ fontSize: '0.825rem' }}>
                Sistem juga otomatis mencadangkan data setiap hari jam 00:00 dan menyimpan 30 hari terakhir.
              </p>
            </div>
            <Button
              variant="primary"
              onClick={handleCreateBackup}
              loading={creatingBackup}
              icon="💾"
            >
              Buat Backup Baru
            </Button>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '0.95rem' }}>Daftar Arsip Cadangan Database</h4>
            </div>
            <Table
              columns={backupColumns}
              data={backups}
              loading={backupLoading}
              emptyMessage="Belum ada file backup database."
            />
          </div>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="card" style={{ maxWidth: '500px' }}>
          <h3 style={{ marginBottom: '6px' }}>Ubah Password Admin</h3>
          <p style={{ marginBottom: '20px' }}>
            Pastikan Anda mengingat password baru untuk login kembali ke aplikasi.
          </p>

          <form onSubmit={handlePasswordSubmit}>
            <Input
              label="Password Saat Ini"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <Input
              label="Password Baru"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              helperText="Minimal 6 karakter"
              required
            />
            <Input
              label="Konfirmasi Password Baru"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="primary"
              loading={passLoading}
              style={{ marginTop: '8px' }}
            >
              Simpan Password Baru
            </Button>
          </form>
        </div>
      )}

      {/* License Tab */}
      {activeTab === 'license' && (
        <div className="card" style={{ maxWidth: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <div style={{ fontSize: '2rem' }}>🏫</div>
            <div>
              <h3>Informasi Lisensi Sekolah</h3>
              <p>Perpetual License (Lifetime) — Aplikasi Resmi Sekolah</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ padding: '12px 16px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Nama Sekolah Terdaftar</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
                {schoolName || 'Sekolah'}
              </div>
            </div>

            <div style={{ padding: '12px 16px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Status Lisensi</div>
              <div style={{ marginTop: '4px' }}>
                {isActivated ? (
                  <span className="badge badge-masuk">✓ Aktif Permanen</span>
                ) : (
                  <span className="badge badge-warning">⚠️ Belum Teraktivasi</span>
                )}
              </div>
            </div>

            <div style={{ padding: '12px 16px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>License Key</div>
              <code style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>
                {licenseKey || 'INV-DEMO-0001-ABCD'}
              </code>
            </div>

            {activationDate && (
              <div style={{ padding: '12px 16px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Tanggal Aktivasi</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '2px' }}>
                  {formatDate(activationDate)}
                </div>
              </div>
            )}

            <div style={{ marginTop: '14px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="danger"
                size="sm"
                onClick={handleResetLicense}
              >
                Reset / Cabut Lisensi Ini
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Theme Tab */}
      {activeTab === 'theme' && (
        <div className="card" style={{ maxWidth: '680px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--primary-light)',
                border: '1px solid var(--primary-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)'
              }}
            >
              {isDark ? <IconMoon size={22} /> : <IconSun size={22} />}
            </div>
            <div>
              <h3>Pilihan Tema Antarmuka</h3>
              <p>Sesuaikan kenyamanan visual aplikasi dengan mode gelap atau terang</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
            {/* Dark Theme Option Card */}
            <div
              onClick={() => setTheme('dark')}
              style={{
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                background: '#070B12',
                border: isDark ? '2px solid #6366F1' : '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: isDark ? '0 0 20px rgba(99, 102, 241, 0.3)' : 'none',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IconMoon size={18} color="#FBBF24" />
                  Mode Gelap (Dark)
                </span>
                {isDark && (
                  <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: 'var(--radius-full)', background: '#6366F1', color: '#fff', fontWeight: 600 }}>
                    Aktif
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '16px' }}>
                Tampilan obsidian dengan ambient glow. Nyaman untuk mata dan menghemat daya layar.
              </p>
              <Button
                variant={isDark ? 'primary' : 'secondary'}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setTheme('dark');
                }}
                style={{ width: '100%' }}
              >
                {isDark ? '✓ Sedang Digunakan' : 'Gunakan Mode Gelap'}
              </Button>
            </div>

            {/* Light Theme Option Card */}
            <div
              onClick={() => setTheme('light')}
              style={{
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                background: '#FFFFFF',
                border: !isDark ? '2px solid #4F46E5' : '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: !isDark ? '0 0 20px rgba(79, 70, 229, 0.2)' : 'none',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IconSun size={18} color="#4F46E5" />
                  Mode Terang (Light)
                </span>
                {!isDark && (
                  <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: 'var(--radius-full)', background: '#4F46E5', color: '#fff', fontWeight: 600 }}>
                    Aktif
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '16px' }}>
                Tampilan putih bersih dan kontras tajam. Ideal untuk ruangan kerja terang di sekolah.
              </p>
              <Button
                variant={!isDark ? 'primary' : 'secondary'}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setTheme('light');
                }}
                style={{ width: '100%' }}
              >
                {!isDark ? '✓ Sedang Digunakan' : 'Gunakan Mode Terang'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Restore Confirmation Modal */}
      <Modal
        isOpen={restoreModalOpen}
        onClose={() => {
          setRestoreModalOpen(false);
          setSelectedBackupForRestore(null);
        }}
        title="Konfirmasi Restore Database"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setRestoreModalOpen(false);
                setSelectedBackupForRestore(null);
              }}
              disabled={restoring}
            >
              Batal
            </Button>
            <Button variant="danger" onClick={handleRestoreSubmit} loading={restoring}>
              Ya, Pulihkan Database
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '2rem' }}>⚠️</div>
          <div>
            <p style={{ color: 'var(--text-main)', marginBottom: '8px' }}>
              Anda akan memulihkan database dari file: <br />
              <strong style={{ color: 'var(--warning)' }}>
                {selectedBackupForRestore?.filename}
              </strong>
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>
              PERINGATAN: Seluruh data saat ini akan ditimpa dengan data cadangan tersebut. Aplikasi akan otomatis memuat ulang setelah pemulihan selesai.
            </p>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
}
