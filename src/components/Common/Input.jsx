import React from 'react';

export default function Input({
  label,
  error,
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  helperText,
  ...props
}) {
  const inputId = id || name || Math.random().toString(36).substring(7);

  return (
    <div className={`form-group ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}
      <input
        type={type}
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className="form-input"
        {...props}
      />
      {helperText && !error && (
        <small style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }}>{helperText}</small>
      )}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}
