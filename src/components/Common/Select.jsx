import React from 'react';

export default function Select({
  label,
  error,
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder = '-- Pilih --',
  required = false,
  disabled = false,
  className = '',
  helperText,
  ...props
}) {
  const selectId = id || name || Math.random().toString(36).substring(7);

  return (
    <div className={`form-group ${className}`.trim()}>
      {label && (
        <label htmlFor={selectId} className="form-label">
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className="form-select"
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
      {helperText && !error && (
        <small style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }}>{helperText}</small>
      )}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}
