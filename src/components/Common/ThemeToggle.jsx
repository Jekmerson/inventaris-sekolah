import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { IconSun, IconMoon } from './Icons';

export default function ThemeToggle({ showLabel = false, className = '', style = {} }) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle ${className}`.trim()}
      title={isDark ? 'Beralih ke Mode Terang (Light Mode)' : 'Beralih ke Mode Gelap (Dark Mode)'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '7px 12px',
        borderRadius: 'var(--radius-full)',
        background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        border: '1px solid var(--border-subtle)',
        color: isDark ? '#FBBF24' : '#4F46E5',
        cursor: 'pointer',
        transition: 'var(--transition)',
        boxShadow: isDark ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
        outline: 'none',
        ...style
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.borderColor = 'var(--primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: isDark ? 'rotate(0deg)' : 'rotate(360deg)'
        }}
      >
        {isDark ? <IconMoon size={16} color="#FBBF24" /> : <IconSun size={16} color="#4F46E5" />}
      </div>
      {showLabel && (
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--text-main)',
            letterSpacing: '0.01em'
          }}
        >
          {isDark ? 'Mode Gelap' : 'Mode Terang'}
        </span>
      )}
    </button>
  );
}
