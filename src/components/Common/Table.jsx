import React from 'react';
import Loading from './Loading';

export default function Table({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'Tidak ada data ditemukan.',
  className = ''
}) {
  return (
    <div className={`table-container ${className}`.trim()}>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key || col.label}
                style={{ textAlign: col.align || 'left', width: col.width || 'auto' }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: '36px' }}>
                <Loading message="Memuat data..." />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{ textAlign: 'center', padding: '36px', color: 'var(--text-subtle)' }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={row.id || idx}>
                {columns.map((col) => (
                  <td
                    key={col.key || col.label}
                    style={{ textAlign: col.align || 'left' }}
                  >
                    {col.render ? col.render(row, idx) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
