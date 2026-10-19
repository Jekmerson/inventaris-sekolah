export function isValidLicenseKey(key) {
  if (!key) return false;
  return /^INV-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(key.trim());
}

export function isNotEmpty(value) {
  return value !== null && value !== undefined && String(value).trim().length > 0;
}

export function isPositiveNumber(value) {
  const num = Number(value);
  return !isNaN(num) && num > 0;
}

export function isNonNegativeNumber(value) {
  const num = Number(value);
  return !isNaN(num) && num >= 0;
}
