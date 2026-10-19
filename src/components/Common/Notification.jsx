import React from 'react';
import { useNotification } from '../../context/NotificationContext';

export default function Notification() {
  const { notifications, removeNotification } = useNotification();

  if (!notifications.length) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 9999,
        maxWidth: '380px',
        pointerEvents: 'none'
      }}
    >
      {notifications.map((n) => {
        let borderLeftColor = 'var(--primary)';
        let bg = 'var(--bg-card)';
        if (n.type === 'success') borderLeftColor = 'var(--secondary)';
        if (n.type === 'danger') borderLeftColor = 'var(--danger)';
        if (n.type === 'warning') borderLeftColor = 'var(--warning)';

        return (
          <div
            key={n.id}
            style={{
              background: 'rgba(15, 22, 38, 0.94)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              color: '#FFFFFF',
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderLeft: `4px solid ${borderLeftColor}`,
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              fontSize: '0.875rem',
              fontWeight: 500,
              pointerEvents: 'auto',
              animation: 'slideIn 0.2s ease-out'
            }}
          >
            <span>{n.message}</span>
            <button
              onClick={() => removeNotification(n.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-subtle)',
                cursor: 'pointer',
                fontSize: '1rem',
                lineHeight: 1
              }}
            >
              &times;
            </button>
          </div>
        );
      })}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
