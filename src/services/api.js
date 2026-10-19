import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import {
  demoLicenseAPI,
  demoAuthAPI,
  demoInventoryAPI,
  demoStokAPI,
  demoReportsAPI,
  demoBackupAPI
} from './demoService';

// Detect demo mode (set via Vercel Environment Variable or auto-detect vercel.app domain)
const IS_DEMO =
  process.env.REACT_APP_DEMO_MODE === 'true' ||
  (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app'));

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('inventaris_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle expired token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const url = error.config.url || '';
      if (!url.includes('/auth/login') && !url.includes('/license')) {
        localStorage.removeItem('inventaris_token');
        localStorage.removeItem('inventaris_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ---- Real API Service Endpoints ----
const _licenseAPI = {
  getStatus: () => api.get('/license/status'),
  activate: (data) => api.post('/license/activate', data),
  reset: () => api.post('/license/reset')
};

const _authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data)
};

const _inventoryAPI = {
  getAll: (params) => api.get('/inventory', { params }),
  getById: (id) => api.get(`/inventory/${id}`),
  create: (data) => api.post('/inventory', data),
  update: (id, data) => api.put(`/inventory/${id}`, data),
  delete: (id) => api.delete(`/inventory/${id}`),
  getCategories: () => api.get('/inventory/kategori')
};

const _stokAPI = {
  masuk: (data) => api.post('/stok-history/masuk', data),
  keluar: (data) => api.post('/stok-history/keluar', data),
  getHistory: (params) => api.get('/stok-history', { params }),
  getById: (id) => api.get(`/stok-history/${id}`),
  undo: (id) => api.delete(`/stok-history/${id}`)
};

const _reportsAPI = {
  getDashboard: () => api.get('/reports/dashboard'),
  getStokSummary: (params) => api.get('/reports/stok-summary', { params }),
  getMasukKeluar: (params) => api.get('/reports/masuk-keluar', { params }),
  getWarningStok: () => api.get('/reports/warning-stok'),
  exportCsv: (params) => {
    const token = localStorage.getItem('inventaris_token') || '';
    const cleanParams = Object.fromEntries(
      Object.entries(params || {}).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    );
    const query = new URLSearchParams({ ...cleanParams, token }).toString();
    window.open(`${API_BASE_URL}/reports/export/csv?${query}`, '_blank');
  },
  exportPdf: (params) => {
    const token = localStorage.getItem('inventaris_token') || '';
    const cleanParams = Object.fromEntries(
      Object.entries(params || {}).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    );
    const query = new URLSearchParams({ ...cleanParams, token }).toString();
    window.open(`${API_BASE_URL}/reports/export/pdf?${query}`, '_blank');
  }
};

const _backupAPI = {
  create: () => api.post('/backup/create'),
  getList: () => api.get('/backup/list'),
  restore: (filename) => api.post('/backup/restore', { filename }),
  getDownloadUrl: (filename) => {
    const token = localStorage.getItem('inventaris_token') || '';
    return `${API_BASE_URL}/backup/download/${encodeURIComponent(filename)}?token=${encodeURIComponent(token)}`;
  }
};

// ---- Export: use demo mock services if DEMO_MODE, otherwise real API ----
export const licenseAPI = IS_DEMO ? demoLicenseAPI : _licenseAPI;
export const authAPI = IS_DEMO ? demoAuthAPI : _authAPI;
export const inventoryAPI = IS_DEMO ? demoInventoryAPI : _inventoryAPI;
export const stokAPI = IS_DEMO ? demoStokAPI : _stokAPI;
export const reportsAPI = IS_DEMO ? demoReportsAPI : _reportsAPI;
export const backupAPI = IS_DEMO ? demoBackupAPI : _backupAPI;

export default api;
