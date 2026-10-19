import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLicense } from '../hooks/useLicense';
import { useNotification } from '../hooks/useNotification';
import Button from '../components/Common/Button';
import ThemeToggle from '../components/Common/ThemeToggle';
import {
  IconSchool,
  IconUser,
  IconLock,
  IconEye,
  IconEyeOff,
  IconShield,
  IconKey,
  IconAlertTriangle
} from '../components/Common/Icons';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { schoolName } = useLicense();
  const { notifySuccess, notifyError } = useNotification();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Username dan password wajib diisi');
      return;
    }

    setLoading(true);
    try {
      await login(username.trim(), password.trim());
      notifySuccess('Login berhasil! Selamat datang.');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Login gagal. Periksa username dan password.';
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
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, transparent 70%)',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'pulseSlow 6s ease-in-out infinite'
        }}
      />
      <div
        className="ambient-glow"
        style={{
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)',
          bottom: '-5%',
          right: '15%'
        }}
      />

      {/* Main Login Card */}
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '440px',
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
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
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
            <IconSchool size={32} />
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-main)' }}>
            Masuk Admin
          </h2>
          <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'center' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--primary-light)',
                border: '1px solid var(--primary-glow)',
                fontSize: '0.8rem',
                color: 'var(--primary)',
                fontWeight: 600
              }}
            >
              {schoolName || 'SMP Negeri 1 Jakarta'}
            </span>
          </div>
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
              fontSize: '0.85rem',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <IconAlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <IconUser size={14} />
              <span>Username</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username admin"
                required
                className="form-input"
                style={{ paddingLeft: '38px', height: '44px' }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-subtle)',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <IconUser size={16} />
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <IconLock size={14} />
              <span>Password</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
                className="form-input"
                style={{ paddingLeft: '38px', paddingRight: '42px', height: '44px' }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-subtle)',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <IconLock size={16} />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                  borderRadius: '4px',
                  transition: 'var(--transition)'
                }}
                title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </button>
            </div>
          </div>

          {/* Default credential hint badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--primary-light)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '24px',
              fontSize: '0.78rem',
              color: 'var(--text-muted)'
            }}
          >
            <IconKey size={14} color="var(--primary)" />
            <span>Default: <strong style={{ color: 'var(--text-main)' }}>admin</strong> / <strong style={{ color: 'var(--text-main)' }}>admin123</strong></span>
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
            Masuk ke Aplikasi
          </Button>
        </form>

        {/* Security Footer */}
        <div
          style={{
            marginTop: '32px',
            paddingTop: '20px',
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
          <span>Sistem Inventaris Sekolah Mandiri (Offline Ready)</span>
        </div>
      </div>
    </div>
  );
}
