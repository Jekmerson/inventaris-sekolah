// Demo Mock Service for Standalone Web Presentation (Vercel)
// All data is stored in browser localStorage so clients can interactively test CRUD, stock mutation, and reports!

const DEFAULT_ITEMS = [
  {
    id: 1,
    nama_barang: 'Laptop ASUS ExpertBook Core i5',
    kategori: 'Elektronik',
    satuan: 'unit',
    stok: 15,
    harga_satuan: 8500000,
    min_stok: 3,
    deskripsi: 'Laptop inventaris lab multimedia dan guru',
    created_at: '2026-01-10 09:00:00',
    updated_at: '2026-01-10 09:00:00'
  },
  {
    id: 2,
    nama_barang: 'Proyektor Epson EB-E500 HDMI',
    kategori: 'Elektronik',
    satuan: 'unit',
    stok: 6,
    harga_satuan: 5200000,
    min_stok: 2,
    deskripsi: 'Proyektor ruang kelas dan aula',
    created_at: '2026-01-12 10:30:00',
    updated_at: '2026-01-12 10:30:00'
  },
  {
    id: 3,
    nama_barang: 'Meja Siswa Kayu Jati Solid',
    kategori: 'Furniture',
    satuan: 'buah',
    stok: 40,
    harga_satuan: 3500000,
    min_stok: 5,
    deskripsi: 'Meja kelas siswa standar nasional',
    created_at: '2026-01-15 11:00:00',
    updated_at: '2026-01-15 11:00:00'
  },
  {
    id: 4,
    nama_barang: 'Kursi Siswa Besi Ergonomis',
    kategori: 'Furniture',
    satuan: 'buah',
    stok: 80,
    harga_satuan: 175000,
    min_stok: 10,
    deskripsi: 'Kursi belajar kelas pipa besi kuat',
    created_at: '2026-01-15 11:15:00',
    updated_at: '2026-01-15 11:15:00'
  },
  {
    id: 5,
    nama_barang: 'Papan Tulis Whiteboard 120x240cm',
    kategori: 'Perlengkapan Kelas',
    satuan: 'buah',
    stok: 8,
    harga_satuan: 450000,
    min_stok: 2,
    deskripsi: 'Whiteboard magnetik ruang kelas',
    created_at: '2026-01-18 13:00:00',
    updated_at: '2026-01-18 13:00:00'
  },
  {
    id: 6,
    nama_barang: 'Spidol Boardmarker Hitam Snowman',
    kategori: 'Alat Tulis',
    satuan: 'box',
    stok: 2,
    harga_satuan: 95000,
    min_stok: 5,
    deskripsi: 'Isi 12 pcs / box untuk KBM guru (Stok menipis)',
    created_at: '2026-01-20 08:30:00',
    updated_at: '2026-01-20 08:30:00'
  },
  {
    id: 7,
    nama_barang: 'Kertas HVS A4 75gr PaperOne',
    kategori: 'Alat Tulis',
    satuan: 'rim',
    stok: 1,
    harga_satuan: 48000,
    min_stok: 5,
    deskripsi: 'Kebutuhan cetak ujian dan administrasi TU',
    created_at: '2026-01-22 14:00:00',
    updated_at: '2026-01-22 14:00:00'
  },
  {
    id: 8,
    nama_barang: 'Router WiFi TP-Link Archer C6 Gigabit',
    kategori: 'Elektronik',
    satuan: 'unit',
    stok: 4,
    harga_satuan: 420000,
    min_stok: 1,
    deskripsi: 'Access point lab komputer dan ruang guru',
    created_at: '2026-01-25 10:00:00',
    updated_at: '2026-01-25 10:00:00'
  },
  {
    id: 9,
    nama_barang: 'Bola Basket Molten GG7X Original',
    kategori: 'Perlengkapan Kelas',
    satuan: 'buah',
    stok: 5,
    harga_satuan: 380000,
    min_stok: 2,
    deskripsi: 'Inventaris ekstrakurikuler olahraga',
    created_at: '2026-01-28 15:30:00',
    updated_at: '2026-01-28 15:30:00'
  },
  {
    id: 10,
    nama_barang: 'Buku Paket Matematika Kelas X',
    kategori: 'Buku',
    satuan: 'buah',
    stok: 45,
    harga_satuan: 75000,
    min_stok: 10,
    deskripsi: 'Kurikulum Merdeka cetakan Kemendikbud',
    created_at: '2026-02-01 09:00:00',
    updated_at: '2026-02-01 09:00:00'
  }
];

const DEFAULT_HISTORY = [
  {
    id: 1,
    barang_id: 1,
    nama_barang: 'Laptop ASUS ExpertBook Core i5',
    tipe: 'masuk',
    jumlah: 15,
    keterangan: 'Pengadaan DAK Fisik Laboratorium',
    tanggal: '2026-01-10',
    created_by: 'admin',
    created_at: '2026-01-10 09:30:00'
  },
  {
    id: 2,
    barang_id: 6,
    nama_barang: 'Spidol Boardmarker Hitam Snowman',
    tipe: 'keluar',
    jumlah: 3,
    keterangan: 'Distribusi untuk guru kelas VII & VIII',
    tanggal: '2026-02-14',
    created_by: 'admin',
    created_at: '2026-02-14 10:00:00'
  },
  {
    id: 3,
    barang_id: 7,
    nama_barang: 'Kertas HVS A4 75gr PaperOne',
    tipe: 'keluar',
    jumlah: 4,
    keterangan: 'Cetak soal asesmen sumatif tengah semester',
    tanggal: '2026-02-15',
    created_by: 'admin',
    created_at: '2026-02-15 11:20:00'
  }
];

// Helper functions for storage
function getStorageItems() {
  const data = localStorage.getItem('demo_inventory');
  if (!data) {
    localStorage.setItem('demo_inventory', JSON.stringify(DEFAULT_ITEMS));
    return [...DEFAULT_ITEMS];
  }
  return JSON.parse(data);
}

function saveStorageItems(items) {
  localStorage.setItem('demo_inventory', JSON.stringify(items));
}

function getStorageHistory() {
  const data = localStorage.getItem('demo_history');
  if (!data) {
    localStorage.setItem('demo_history', JSON.stringify(DEFAULT_HISTORY));
    return [...DEFAULT_HISTORY];
  }
  return JSON.parse(data);
}

function saveStorageHistory(history) {
  localStorage.setItem('demo_history', JSON.stringify(history));
}

// License API
export const demoLicenseAPI = {
  getStatus: async () => ({
    data: {
      is_activated: true,
      school_name: 'SMK Negeri 1 (Demo Presentasi)',
      activation_date: '2026-01-01',
      license_key: 'INV-DEMO-PREVIEW-ONLINE'
    }
  }),
  activate: async (payload) => ({
    data: {
      success: true,
      message: 'Aktivasi demo berhasil!',
      school_name: payload.school_name || 'Demo Sekolah'
    }
  }),
  reset: async () => ({
    data: { success: true }
  })
};

// Auth API
export const demoAuthAPI = {
  login: async (credentials) => {
    const user = {
      id: 1,
      username: credentials.username || 'admin',
      role: 'admin',
      name: 'Administrator Demo'
    };
    return {
      data: {
        token: 'demo_jwt_token_preview_2026',
        user
      }
    };
  },
  logout: async () => ({
    data: { success: true }
  }),
  getMe: async () => ({
    data: {
      user: {
        id: 1,
        username: 'admin',
        role: 'admin',
        name: 'Administrator Demo'
      }
    }
  }),
  changePassword: async () => ({
    data: { success: true, message: 'Password berhasil diubah (Mode Demo)' }
  })
};

// Inventory API
export const demoInventoryAPI = {
  getAll: async (params = {}) => {
    let items = getStorageItems();
    if (params.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (i) =>
          i.nama_barang.toLowerCase().includes(q) ||
          (i.deskripsi && i.deskripsi.toLowerCase().includes(q))
      );
    }
    if (params.kategori) {
      items = items.filter((i) => i.kategori === params.kategori);
    }
    const total = items.length;
    const page = params.page || 1;
    const limit = params.limit || 50;
    const start = (page - 1) * limit;
    const paginated = items.slice(start, start + limit);

    return {
      data: {
        data: paginated,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        page
      }
    };
  },
  getById: async (id) => {
    const items = getStorageItems();
    const item = items.find((i) => i.id === Number(id));
    return { data: item || null };
  },
  create: async (data) => {
    const items = getStorageItems();
    const newId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    const newItem = {
      id: newId,
      nama_barang: data.nama_barang,
      kategori: data.kategori || 'Lainnya',
      satuan: data.satuan || 'unit',
      stok: Number(data.stok) || 0,
      harga_satuan: Number(data.harga_satuan) || 0,
      min_stok: Number(data.min_stok) || 5,
      deskripsi: data.deskripsi || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    items.unshift(newItem);
    saveStorageItems(items);
    return { data: newItem };
  },
  update: async (id, data) => {
    const items = getStorageItems();
    const idx = items.findIndex((i) => i.id === Number(id));
    if (idx !== -1) {
      items[idx] = {
        ...items[idx],
        ...data,
        stok: data.stok !== undefined ? Number(data.stok) : items[idx].stok,
        harga_satuan:
          data.harga_satuan !== undefined ? Number(data.harga_satuan) : items[idx].harga_satuan,
        min_stok: data.min_stok !== undefined ? Number(data.min_stok) : items[idx].min_stok,
        updated_at: new Date().toISOString()
      };
      saveStorageItems(items);
      return { data: items[idx] };
    }
    return { data: null };
  },
  delete: async (id) => {
    const items = getStorageItems();
    const filtered = items.filter((i) => i.id !== Number(id));
    saveStorageItems(filtered);
    return { data: { success: true } };
  },
  getCategories: async () => ({
    data: {
      data: [
        'Alat Tulis',
        'Elektronik',
        'Furniture',
        'Buku',
        'Perlengkapan Kelas',
        'Kebersihan',
        'Lainnya'
      ]
    }
  })
};

// Stock Mutation API
export const demoStokAPI = {
  masuk: async (data) => {
    const items = getStorageItems();
    const history = getStorageHistory();
    const idx = items.findIndex((i) => i.id === Number(data.barang_id));
    if (idx !== -1) {
      items[idx].stok += Number(data.jumlah);
      items[idx].updated_at = new Date().toISOString();
      saveStorageItems(items);

      const newHistory = {
        id: history.length > 0 ? Math.max(...history.map((h) => h.id)) + 1 : 1,
        barang_id: items[idx].id,
        nama_barang: items[idx].nama_barang,
        tipe: 'masuk',
        jumlah: Number(data.jumlah),
        keterangan: data.keterangan || 'Stok Masuk Demo',
        tanggal: data.tanggal || new Date().toISOString().split('T')[0],
        created_by: 'admin',
        created_at: new Date().toISOString()
      };
      history.unshift(newHistory);
      saveStorageHistory(history);
      return { data: { success: true, item: items[idx], history: newHistory } };
    }
    throw new Error('Barang tidak ditemukan');
  },
  keluar: async (data) => {
    const items = getStorageItems();
    const history = getStorageHistory();
    const idx = items.findIndex((i) => i.id === Number(data.barang_id));
    if (idx !== -1) {
      if (items[idx].stok < Number(data.jumlah)) {
        throw new Error('Stok barang tidak mencukupi untuk dikeluarkan');
      }
      items[idx].stok -= Number(data.jumlah);
      items[idx].updated_at = new Date().toISOString();
      saveStorageItems(items);

      const newHistory = {
        id: history.length > 0 ? Math.max(...history.map((h) => h.id)) + 1 : 1,
        barang_id: items[idx].id,
        nama_barang: items[idx].nama_barang,
        tipe: 'keluar',
        jumlah: Number(data.jumlah),
        keterangan: data.keterangan || 'Stok Keluar Demo',
        tanggal: data.tanggal || new Date().toISOString().split('T')[0],
        created_by: 'admin',
        created_at: new Date().toISOString()
      };
      history.unshift(newHistory);
      saveStorageHistory(history);
      return { data: { success: true, item: items[idx], history: newHistory } };
    }
    throw new Error('Barang tidak ditemukan');
  },
  getHistory: async (params = {}) => {
    let history = getStorageHistory();
    if (params.barang_id) {
      history = history.filter((h) => h.barang_id === Number(params.barang_id));
    }
    if (params.tipe) {
      history = history.filter((h) => h.tipe === params.tipe);
    }
    const total = history.length;
    const page = params.page || 1;
    const limit = params.limit || 50;
    const start = (page - 1) * limit;

    return {
      data: {
        data: history.slice(start, start + limit),
        total,
        totalPages: Math.ceil(total / limit) || 1,
        page
      }
    };
  },
  getById: async (id) => {
    const history = getStorageHistory();
    return { data: history.find((h) => h.id === Number(id)) || null };
  },
  undo: async (id) => {
    const history = getStorageHistory();
    const target = history.find((h) => h.id === Number(id));
    if (target) {
      const items = getStorageItems();
      const itemIdx = items.findIndex((i) => i.id === target.barang_id);
      if (itemIdx !== -1) {
        if (target.tipe === 'masuk') {
          items[itemIdx].stok = Math.max(0, items[itemIdx].stok - target.jumlah);
        } else {
          items[itemIdx].stok += target.jumlah;
        }
        saveStorageItems(items);
      }
      const filtered = history.filter((h) => h.id !== Number(id));
      saveStorageHistory(filtered);
      return { data: { success: true } };
    }
    return { data: { success: false } };
  }
};

// Reports API
export const demoReportsAPI = {
  getDashboard: async () => {
    const items = getStorageItems();
    const history = getStorageHistory();

    const total_barang = items.length;
    const total_value = items.reduce((acc, curr) => acc + (curr.stok * curr.harga_satuan), 0);
    const warning_items = items.filter((i) => i.stok <= i.min_stok);

    return {
      data: {
        total_barang,
        total_value,
        warning_count: warning_items.length,
        monthly_transactions: history.length,
        recent_transactions: history.slice(0, 5),
        warning_items
      }
    };
  },
  getStokSummary: async (params = {}) => {
    let items = getStorageItems();
    if (params.kategori) {
      items = items.filter((i) => i.kategori === params.kategori);
    }
    const total_barang = items.length;
    const total_unit = items.reduce((acc, curr) => acc + curr.stok, 0);
    const total_value = items.reduce((acc, curr) => acc + (curr.stok * curr.harga_satuan), 0);

    return {
      data: {
        data: items,
        total_barang,
        total_unit,
        total_value
      }
    };
  },
  getMasukKeluar: async (params = {}) => {
    const history = getStorageHistory();
    const masuk = history.filter((h) => h.tipe === 'masuk');
    const keluar = history.filter((h) => h.tipe === 'keluar');

    return {
      data: {
        masuk,
        keluar,
        summary: {
          total_masuk: masuk.reduce((acc, curr) => acc + curr.jumlah, 0),
          total_keluar: keluar.reduce((acc, curr) => acc + curr.jumlah, 0)
        }
      }
    };
  },
  getWarningStok: async () => {
    const items = getStorageItems();
    const warning = items.filter((i) => i.stok <= i.min_stok);
    return { data: { data: warning, total: warning.length } };
  },
  exportCsv: (params = {}) => {
    const items = getStorageItems();
    let csv = 'ID,Nama Barang,Kategori,Satuan,Stok,Harga Satuan,Min Stok,Deskripsi\n';
    items.forEach((i) => {
      csv += `${i.id},"${i.nama_barang}","${i.kategori}","${i.satuan}",${i.stok},${i.harga_satuan},${i.min_stok},"${i.deskripsi || ''}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Laporan_Inventaris_Demo.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
  exportPdf: () => {
    window.print();
  }
};

// Backup API (Mock)
export const demoBackupAPI = {
  create: async () => ({
    data: { success: true, message: 'Backup demo berhasil dibuat (Simulasi).' }
  }),
  getList: async () => ({
    data: {
      backups: [
        {
          filename: 'backup_demo_2026_01.db',
          size: '142 KB',
          created_at: '2026-02-15 00:00:00'
        }
      ]
    }
  }),
  restore: async () => ({
    data: { success: true, message: 'Database demo berhasil dipulihkan.' }
  }),
  getDownloadUrl: () => '#'
};
