import React from 'react';
import Input from '../Common/Input';

export default function DateRangePicker({
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
      <div style={{ width: '170px' }}>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="mb-0"
        />
      </div>
      <span style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>s/d</span>
      <div style={{ width: '170px' }}>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="mb-0"
        />
      </div>
    </div>
  );
}
