import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLicense } from '../hooks/useLicense';
import { useNotification } from '../hooks/useNotification';
import Button from '../components/Common/Button';
import ThemeToggle from '../components/Common/ThemeToggle';
import { isValidLicenseKey } from '../utils/validators';
import {
  IconKey,
  IconSchool,
  IconShield,
  IconAlertTriangle,
  IconCheckCircle
} from '../components/Common/Icons';

export default function LicensePage() {
  const navigate = useNavigate();
  const { activate } = useLicense();
  const { notifySuccess, notifyError } = useNotification();

  const [licenseKey, setLicenseKey] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sampleKeys = [
    { key: 'INV-DEMO-0001-ABCD', label: 'Demo Key' },
    { key: 'INV-TEST-0002-EFGH', label: 'Test Key' },
    { key: 'INV-PROD-0003-IJKL', label: 'Prod Key' }
  ];

  const handleActivate = async (e) => {
    e.preventDefault();
    setError('');

    const cleanKey = licenseKey.trim().toUpperCase();
    if (!isValidLicenseKey(cleanKey)) {
      setError('Format License Key tidak valid. Contoh format: INV-XXXX-XXXX-XXXX');
      return;
    }

    if (!schoolName.trim()) {
      setError('Nama sekolah wajib diisi');
      return;
    }

    setLoading(true);
    try {
      const res = await activate(cleanKey, schoolName.trim());
      notifySuccess(`Aktivasi berhasil untuk ${res.school_name}!`);
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Aktivasi gagal. Silakan coba lagi.';
      setError(msg);
      notifyError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '24px'
      }}
    >
      {/* Top right Theme Toggle button */}
      <div style={{ position: 'absolute', top: '24px', right: '28px', zIndex: 10 }}>
        <ThemeToggle showLabel={true} />
      </div>

      {/* Ambient background glow orbs */}
      <div
        className="ambient-glow"
        style={{
          width: '550px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, transparent 70%)',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'pulseSlow 6s ease-in-out infinite'
        }}
      />
      <div
        className="ambient-glow"
        style={{
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.14) 0%, transparent 70%)',
          bottom: '-10%',
          right: '10%'
        }}
      />

      {/* Main Activation Card */}
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '40px 36px',
          position: 'relative',
          zIndex: 1,
          borderRadius: 'var(--radius-xl)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-lg), var(--glass-highlight)',
          animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header & Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'var(--primary-light)',
              border: '1px solid var(--primary-glow)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              marginBottom: '16px',
              boxShadow: '0 8px 24px -4px var(--primary-glow)'
            }}
          >
            <IconKey size={30} />
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-main)' }}>
            Aktivasi Lisensi Aplikasi
          </h2>
          <p style={{ marginTop: '6px', fontSize: '0.875rem' }}>
            Masukkan License Key resmi dan nama institusi Anda untuk mengaktifkan aplikasi Inventaris Sekolah.
          </p>
        </div>

        {/* Error message banner */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--danger-light)',
              border: '1px solid var(--danger-glow)',
              color: 'var(--danger)',
              marginBottom: '22px',
              fontSize: '0.85rem'
            }}
          >
            <IconAlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleActivate}>
          {/* License Key Input */}
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <IconKey size={14} />
              <span>License Key</span>
            </label>
            <input
              type="text"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
              placeholder="INV-XXXX-XXXX-XXXX"
              required
              className="form-input"
              style={{
                letterSpacing: '0.08em',
                fontWeight: 600,
                fontFamily: 'monospace',
                fontSize: '0.95rem',
                height: '44px'
              }}
            />
            <small style={{ color: 'var(--text-subtle)', fontSize: '0.75rem', marginTop: '2px' }}>
              Kunci lisensi 16 digit yang Anda peroleh saat registrasi
            </small>
          </div>

          {/* School Name Input */}
          <div className="form-group" style={{ marginBottom: '22px' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <IconSchool size={14} />
              <span>Nama Sekolah / Institusi</span>
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="contoh: SMP Negeri 1 Jakarta"
              required
              className="form-input"
              style={{ height: '44px' }}
            />
          </div>

          {/* Quick Fill Sample Keys */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '24px'
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: '8px' }}>
              Kunci Lisensi Uji Coba (Tersedia):
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {sampleKeys.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setLicenseKey(item.key);
                    if (!schoolName) setSchoolName('SMP Negeri 1 Jakarta');
                  }}
                  style={{
                    background: 'var(--primary-light)',
                    border: '1px solid var(--primary-glow)',
                    color: 'var(--primary)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                  title="Klik untuk mengisi otomatis"
                >
                  {item.key}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            style={{
              width: '100%',
              height: '46px',
              fontSize: '0.95rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-sm)',
              letterSpacing: '0.01em'
            }}
          >
            Aktifkan Aplikasi
          </Button>
        </form>

        {/* Footnote */}
        <div
          style={{
            marginTop: '28px',
            paddingTop: '18px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            color: 'var(--text-subtle)'
          }}
        >
          <IconShield size={14} color="#10B981" />
          <span>Lisensi Permanen Mandiri — Tanpa Ketergantungan Internet</span>
        </div>
      </div>
    </div>
  );
}
