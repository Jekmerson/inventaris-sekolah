# Aplikasi Inventaris Sekolah (Desktop Windows .exe)

Aplikasi desktop profesional untuk manajemen inventaris sekolah mandiri dengan sistem lisensi permanen (*perpetual lifetime license*) dan database lokal SQLite.

---

## 🛠️ Tech Stack

- **Desktop Framework**: Electron 27+
- **Frontend**: React 18, React Router v6, Axios, Date-fns, Modern Vanilla CSS (Dark Slate UI)
- **Backend API**: Express 4, JWT, BcryptJS, Node-Cron
- **Database**: SQLite3 (Local file `inventaris.db` dengan Triggers mutasi otomatis)
- **Export & Reports**: CSV Exporter, PDFKit (Laporan Resmi Berkop Sekolah)
- **Security**: Hardware Device Lock (`INV-XXXX-XXXX-XXXX`), Password Bcyrpt Hash, Protected Routes

---

## 🚀 Panduan Menjalankan

### 1. Inisialisasi Database Pertama Kali
```bash
npm run init-db
```
Untuk mereset database ke kondisi awal pabrik:
```bash
node scripts/init-db.js --reset
```

### 2. Jalankan Mode Development (Desktop App)
```bash
npm run dev
```
Perintah ini akan menjalankan React dev server pada `http://localhost:3000`, Express API pada `http://localhost:3001`, dan Electron Desktop Window secara bersamaan.

### 3. Akun Admin Default
- **Username**: `admin`
- **Password**: `admin123`
*(Dapat diganti kapan saja melalui menu **Pengaturan & Backup**)*

### 4. Kunci Lisensi Bawaan (Demo)
Untuk aktivasi pertama kali, gunakan salah satu lisensi yang sudah disertakan:
- `INV-DEMO-0001-ABCD`
- `INV-TEST-0002-EFGH`
- `INV-PROD-0003-IJKL`

---

## 🔑 Manajemen Lisensi (CLI Tool)

### Membuat Kunci Lisensi Baru:
```bash
# Menghasilkan 1 lisensi baru
node scripts/generate-license.js --school "SMP Negeri 1 Jakarta"

# Menghasilkan 5 lisensi sekaligus
node scripts/generate-license.js --count 5 --school "SMA Negeri 2 Bandung"
```

### Memeriksa / Mencabut Lisensi:
```bash
# Melihat daftar semua lisensi & status aktivasi
node scripts/license-manager.js --list

# Mengecek detail suatu lisensi
node scripts/license-manager.js --check INV-DEMO-0001-ABCD

# Mencabut (revoke) lisensi
node scripts/license-manager.js --revoke INV-DEMO-0001-ABCD
```

---

## 📦 Build Installer Windows (.exe)

Untuk mem-package aplikasi menjadi file installer `.exe` siap distribusi:
```bash
npm run build
```
File installer setup `.exe` akan dihasilkan di folder `dist/`.

---

## ✨ Fitur-Fitur Utama

1. **Aktivasi Lisensi Hardware-Locked**
   - Mengunci lisensi ke fingerprint mesin fisik pengguna untuk mencegah penggandaan tanpa izin.
2. **Dashboard Interaktif**
   - Statistik total barang, nilai aset rupiah, peringatan stok menipis, dan transaksi terbaru.
3. **Master Inventaris Lengkap**
   - Tambah, edit, cari, filter kategori, hapus (dengan dialog konfirmasi bahaya cascade).
4. **Alur Mutasi Stok Pintar (Stok Flow)**
   - Catat stok masuk (pengadaan/BOS) dan stok keluar (distribusi kelas/lab).
   - Validasi ketat mencegah stok keluar melebihi stok yang ada (anti-negatif).
   - Fitur **Undo Transaksi**: Membatalkan mutasi dan otomatis mengembalikan stok ke angka sebelumnya.
5. **Laporan & Ekspor Format Resmi**
   - Rekapitulasi Stok, Mutasi Masuk/Keluar, dan Peringatan Stok.
   - Ekspor instan ke format `.csv` dan dokumen `.pdf` siap cetak.
6. **Cadangan & Pemulihan (Backup & Restore)**
   - Backup otomatis harian setiap jam 00:00 (retensi 30 hari).
   - Backup manual satu klik dan restore langsung dari antarmuka aplikasi.
