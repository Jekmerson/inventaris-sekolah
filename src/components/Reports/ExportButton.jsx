import React from 'react';
import Button from '../Common/Button';

export default function ExportButton({ onExportCsv, onExportPdf, loading = false }) {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {onExportCsv && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onExportCsv}
          loading={loading}
          icon="📊"
        >
          Export CSV
        </Button>
      )}
      {onExportPdf && (
        <Button
          variant="primary"
          size="sm"
          onClick={onExportPdf}
          loading={loading}
          icon="📄"
        >
          Export PDF
        </Button>
      )}
    </div>
  );
}
