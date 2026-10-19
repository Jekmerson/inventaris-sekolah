export const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (typeof window !== 'undefined' && window.location.port !== '3000'
    ? `${window.location.origin}/api`
    : 'http://localhost:3001/api');

export const DEFAULT_CATEGORIES = [
  'Alat Tulis',
  'Elektronik',
  'Furniture',
  'Buku',
  'Perlengkapan Kelas',
  'Kebersihan',
  'Lainnya'
];

export const COMMON_UNITS = [
  'pcs',
  'unit',
  'buah',
  'rim',
  'box',
  'pak',
  'set',
  'meter',
  'lembar'
];
