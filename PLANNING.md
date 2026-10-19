# PLANNING FULL: Aplikasi Inventaris Sekolah (Desktop .exe)

## 1. OVERVIEW

**Nama Aplikasi**: Inventaris Sekolah  
**Platform**: Desktop (Windows .exe)  
**Tech Stack**: Electron + React + Express + SQLite  
**User**: Single admin per sekolah  
**License**: Perpetual (lifetime, one device)  

---

## 2. TECH STACK DETAIL

```
Frontend:     React 18+, React Router 6, Axios, date-fns
Backend:      Express 4+, JWT, bcryptjs
Desktop:      Electron 27+
Database:     SQLite3 (local)
License:      Hardware-locked, lifetime
Export:       CSV (csv-writer), PDF (pdfkit)
Build:        Webpack, Electron Builder
Dev Tools:    Nodemon, Concurrently, Wait-on
```

---

## 3. PROJECT STRUCTURE

```
inventaris-app/
│
├─ public/
│  ├─ icon.png (app icon)
│  └─ logo.png
│
├─ main/
│  ├─ index.js (Electron main process)
│  ├─ preload.js (IPC bridge)
│  └─ menu.js (app menu)
│
├─ src/
│  ├─ components/
│  │  ├─ Layout/
│  │  │  ├─ Sidebar.jsx
│  │  │  ├─ Header.jsx
│  │  │  └─ MainLayout.jsx
│  │  │
│  │  ├─ Dashboard/
│  │  │  ├─ StatsCard.jsx
│  │  │  ├─ RecentTransactions.jsx
│  │  │  └─ WarningStok.jsx
│  │  │
│  │  ├─ Inventory/
│  │  │  ├─ InventoryTable.jsx
│  │  │  ├─ InventoryForm.jsx (add/edit modal)
│  │  │  ├─ DeleteConfirm.jsx
│  │  │  └─ SearchFilter.jsx
│  │  │
│  │  ├─ StokFlow/
│  │  │  ├─ StokMasukModal.jsx
│  │  │  ├─ StokKeluarModal.jsx
│  │  │  ├─ HistoryTable.jsx
│  │  │  └─ UndoConfirm.jsx
│  │  │
│  │  ├─ Reports/
│  │  │  ├─ StokSummary.jsx
│  │  │  ├─ MasukKeluarReport.jsx
│  │  │  ├─ WarningReport.jsx
│  │  │  ├─ ExportButton.jsx
│  │  │  └─ DateRangePicker.jsx
│  │  │
│  │  ├─ License/
│  │  │  └─ LicenseActivation.jsx
│  │  │
│  │  └─ Common/
│  │     ├─ Button.jsx
│  │     ├─ Modal.jsx
│  │     ├─ Table.jsx
│  │     ├─ Input.jsx
│  │     ├─ Select.jsx
│  │     ├─ Loading.jsx
│  │     └─ Notification.jsx
│  │
│  ├─ pages/
│  │  ├─ LicensePage.jsx (first screen if not activated)
│  │  ├─ LoginPage.jsx
│  │  ├─ HomePage.jsx (dashboard)
│  │  ├─ InventoryPage.jsx
│  │  ├─ StokFlowPage.jsx
│  │  └─ ReportsPage.jsx
│  │
│  ├─ services/
│  │  └─ api.js (axios instance + endpoints)
│  │
│  ├─ context/
│  │  ├─ AuthContext.jsx
│  │  └─ LicenseContext.jsx
│  │
│  ├─ hooks/
│  │  ├─ useAuth.js
│  │  ├─ useLicense.js
│  │  └─ useNotification.js
│  │
│  ├─ utils/
│  │  ├─ formatters.js (currency, date)
│  │  ├─ validators.js
│  │  └─ constants.js
│  │
│  ├─ styles/
│  │  ├─ global.css
│  │  ├─ variables.css
│  │  ├─ components.css
│  │  └─ responsive.css
│  │
│  ├─ App.jsx
│  ├─ index.jsx
│  └─ index.css
│
├─ server/
│  ├─ index.js (Express entry point)
│  │
│  ├─ config/
│  │  ├─ db.js (SQLite connection + init)
│  │  ├─ constants.js
│  │  └─ corsConfig.js
│  │
│  ├─ middleware/
│  │  ├─ auth.js (JWT verification)
│  │  ├─ errorHandler.js
│  │  ├─ logger.js
│  │  └─ validation.js
│  │
│  ├─ routes/
│  │  ├─ index.js (root router)
│  │  ├─ auth.js
│  │  ├─ license.js
│  │  ├─ inventory.js
│  │  ├─ stokHistory.js
│  │  └─ reports.js
│  │
│  ├─ controllers/
│  │  ├─ authController.js
│  │  ├─ licenseController.js
│  │  ├─ inventoryController.js
│  │  ├─ stokHistoryController.js
│  │  └─ reportController.js
│  │
│  ├─ models/
│  │  └─ queries.js (semua SQL queries)
│  │
│  ├─ utils/
│  │  ├─ tokenUtils.js (JWT)
│  │  ├─ passwordUtils.js (bcrypt)
│  │  ├─ validators.js
│  │  ├─ deviceId.js (hardware fingerprint)
│  │  ├─ licenseGenerator.js (CLI tool)
│  │  ├─ licenseManager.js (CLI tool)
│  │  ├─ csvExporter.js
│  │  ├─ pdfExporter.js
│  │  └─ backup.js
│  │
│  └─ logs/
│     └─ app.log
│
├─ database/
│  ├─ inventaris.db (SQLite - generated)
│  ├─ schema.sql
│  ├─ seeds.sql (sample data)
│  └─ backups/
│     └─ .gitkeep
│
├─ scripts/
│  ├─ init-db.js (initialize database)
│  └─ generate-license.js (wrapper CLI)
│
├─ package.json (root)
├─ .env.example
├─ .env (gitignored)
├─ .gitignore
├─ README.md
└─ electron-builder.yml
```

---

## 4. DATABASE SCHEMA (FULL)

```sql
-- =============================================
-- LICENSE TABLE
-- =============================================
CREATE TABLE licenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  license_key TEXT UNIQUE NOT NULL,
  school_name TEXT NOT NULL,
  activation_date DATE,
  device_id TEXT UNIQUE,
  is_activated INTEGER DEFAULT 0,
  status TEXT DEFAULT 'valid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_license_key ON licenses(license_key);
CREATE INDEX idx_device_id ON licenses(device_id);

-- =============================================
-- APP CONFIG (LOCAL CACHE)
-- =============================================
CREATE TABLE app_config (
  id INTEGER PRIMARY KEY,
  device_id TEXT UNIQUE,
  license_key TEXT,
  is_activated INTEGER DEFAULT 0,
  activation_date DATE,
  school_name TEXT
);

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- INVENTORY MASTER
-- =============================================
CREATE TABLE inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nama_barang TEXT NOT NULL,
  kategori TEXT,
  satuan TEXT,
  stok INTEGER DEFAULT 0,
  harga_satuan REAL DEFAULT 0,
  min_stok INTEGER DEFAULT 10,
  deskripsi TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inventory_kategori ON inventory(kategori);
CREATE INDEX idx_inventory_nama ON inventory(nama_barang);

-- =============================================
-- STOK HISTORY (TRANSAKSI)
-- =============================================
CREATE TABLE stok_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  barang_id INTEGER NOT NULL,
  tipe TEXT NOT NULL CHECK(tipe IN ('masuk', 'keluar')),
  jumlah INTEGER NOT NULL,
  keterangan TEXT,
  tanggal DATE NOT NULL,
  created_by TEXT DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(barang_id) REFERENCES inventory(id) ON DELETE CASCADE
);

CREATE INDEX idx_stok_history_barang_id ON stok_history(barang_id);
CREATE INDEX idx_stok_history_tanggal ON stok_history(tanggal);
CREATE INDEX idx_stok_history_tipe ON stok_history(tipe);

-- =============================================
-- KATEGORI MASTER (OPTIONAL)
-- =============================================
CREATE TABLE kategori (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nama_kategori TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO kategori (nama_kategori) VALUES 
('Alat Tulis'),
('Elektronik'),
('Furniture'),
('Buku'),
('Perlengkapan Kelas'),
('Kebersihan'),
('Lainnya');

-- =============================================
-- TRIGGERS: AUTO-UPDATE STOK
-- =============================================

-- Trigger: Stok Masuk
CREATE TRIGGER update_stok_masuk
AFTER INSERT ON stok_history
WHEN NEW.tipe = 'masuk'
BEGIN
  UPDATE inventory 
  SET stok = stok + NEW.jumlah, 
      updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.barang_id;
END;

-- Trigger: Stok Keluar
CREATE TRIGGER update_stok_keluar
AFTER INSERT ON stok_history
WHEN NEW.tipe = 'keluar'
BEGIN
  UPDATE inventory 
  SET stok = stok - NEW.jumlah, 
      updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.barang_id;
END;

-- Trigger: Undo Stok Masuk
CREATE TRIGGER undo_stok_masuk
AFTER DELETE ON stok_history
WHEN OLD.tipe = 'masuk'
BEGIN
  UPDATE inventory 
  SET stok = stok - OLD.jumlah, 
      updated_at = CURRENT_TIMESTAMP
  WHERE id = OLD.barang_id;
END;

-- Trigger: Undo Stok Keluar
CREATE TRIGGER undo_stok_keluar
AFTER DELETE ON stok_history
WHEN OLD.tipe = 'keluar'
BEGIN
  UPDATE inventory 
  SET stok = stok + OLD.jumlah, 
      updated_at = CURRENT_TIMESTAMP
  WHERE id = OLD.barang_id;
END;

-- =============================================
-- SEED DATA: DEFAULT ADMIN USER
-- =============================================
INSERT INTO users (username, password_hash) VALUES 
('admin', '$2a$10$EXAMPLE_HASH');
```

---

## 5. API ENDPOINTS (FULL)

### 5.1 License

```
POST   /api/license/activate
       body: { license_key, school_name, device_id }
       response: { success, message, school_name, activation_date }

GET    /api/license/status
       response: { is_activated, school_name, activation_date, device_id }
```

### 5.2 Auth

```
POST   /api/auth/login
       body: { username, password }
       response: { token, user: { id, username } }

POST   /api/auth/logout
       headers: { Authorization: "Bearer TOKEN" }
       response: { message }

GET    /api/auth/me
       headers: { Authorization: "Bearer TOKEN" }
       response: { user: { id, username } }

PUT    /api/auth/change-password
       headers: { Authorization: "Bearer TOKEN" }
       body: { old_password, new_password }
       response: { message }
```

### 5.3 Inventory

```
GET    /api/inventory
       query: ?kategori=&search=&page=1&limit=50
       response: { data: [...], total, page, limit }

POST   /api/inventory
       body: { nama_barang, kategori, satuan, harga_satuan, min_stok, deskripsi }
       response: { id, ... }

GET    /api/inventory/:id
       response: { id, nama_barang, ... }

PUT    /api/inventory/:id
       body: { nama_barang, kategori, satuan, ... }
       response: { message, updated_at }

DELETE /api/inventory/:id
       response: { message }

GET    /api/inventory/kategori
       response: { data: ['Alat Tulis', 'Elektronik', ...] }
```

### 5.4 Stok Flow

```
POST   /api/stok-history/masuk
       body: { barang_id, jumlah, keterangan, tanggal }
       response: { id, stok_baru, message }

POST   /api/stok-history/keluar
       body: { barang_id, jumlah, keterangan, tanggal }
       validation: stok_baru tidak boleh negatif
       response: { id, stok_baru, message }

GET    /api/stok-history
       query: ?barang_id=&tipe=&start_date=&end_date=&page=1&limit=100
       response: { data: [...], total, page, limit }

GET    /api/stok-history/:id
       response: { id, barang_id, tipe, jumlah, ... }

DELETE /api/stok-history/:id
       response: { message, stok_baru }
```

### 5.5 Reports

```
GET    /api/reports/dashboard
       response: { 
         total_barang, 
         total_value, 
         warning_count,
         recent_transactions: [...] 
       }

GET    /api/reports/stok-summary
       query: ?kategori=
       response: { data: [...], total_barang, total_value }

GET    /api/reports/masuk-keluar
       query: ?start_date=&end_date=&kategori=
       response: { 
         masuk: [...], 
         keluar: [...], 
         summary: { total_masuk, total_keluar } 
       }

GET    /api/reports/warning-stok
       response: { data: [...] }

GET    /api/reports/export/csv
       query: ?type=stok-summary|masuk-keluar|history&start_date=&end_date=
       response: CSV file download

GET    /api/reports/export/pdf
       query: ?type=stok-summary|masuk-keluar&start_date=&end_date=
       response: PDF file download
```

### 5.6 Backup

```
POST   /api/backup/create
       response: { filename, path, size }

GET    /api/backup/list
       response: { backups: [{ filename, date, size }] }

POST   /api/backup/restore
       body: { filename }
       response: { message }
```

---

## 6. FEATURES BREAKDOWN (FULL)

### 6.1 License Activation (First-Time)

**Flow:**
1. App startup → check `app_config.is_activated`
2. If `0` → show `LicensePage`
3. User input license key + school name
4. POST `/api/license/activate` (device_id auto-generated)
5. Server validate → insert `licenses` table + update `app_config`
6. Success → redirect to `LoginPage`
7. Next startup → skip license screen (lifetime)

**Validations:**
- License key format: `INV-XXXX-XXXX-XXXX`
- License key exists & belum activated
- Device ID belum terdaftar
- Status = 'valid'

**UI:**
- Logo aplikasi
- Input: License Key
- Input: Nama Sekolah
- Device ID (read-only, copy button)
- Activate button
- Error/success notification

---

### 6.2 Authentication

**Flow:**
1. LoginPage → input username/password
2. POST `/api/auth/login`
3. Server verify bcrypt → generate JWT token
4. Store token localStorage
5. Redirect to HomePage (Dashboard)
6. Protected routes → verify token middleware

**Features:**
- Login
- Logout (clear token)
- Change password
- Token expiry 24 jam
- Auto-redirect jika token expired

**UI:**
- Username field
- Password field (show/hide toggle)
- Login button
- Error notification

---

### 6.3 Dashboard (HomePage)

**Stats Cards:**
- Total Barang
- Total Nilai Stok (sum: stok × harga_satuan)
- Barang Warning (stok < min_stok)
- Transaksi Bulan Ini

**Recent Transactions:**
- 10 transaksi terbaru (masuk/keluar)
- Tanggal, barang, tipe, jumlah, keterangan

**Warning Stok:**
- List barang dengan stok < min_stok
- Nama barang, stok, min_stok
- Action button (stok masuk)

**UI:**
- Grid layout (cards)
- Table (recent transactions)
- Alert list (warning stok)

---

### 6.4 Inventory Management

**Features:**
- **View**: Table dengan pagination (50 rows/page)
- **Search**: By nama_barang (real-time)
- **Filter**: By kategori (dropdown)
- **Add**: Modal form (nama, kategori, satuan, harga, min_stok, deskripsi)
- **Edit**: Modal form (same fields)
- **Delete**: Confirmation dialog → cascade delete stok_history

**Validations:**
- Nama barang required
- Satuan required
- Harga >= 0
- Min stok >= 0
- Kategori dari master

**UI:**
- Table columns: Nama, Kategori, Stok, Satuan, Harga, Action (edit/delete)
- Search input (top)
- Filter kategori (dropdown)
- Add button (top-right)
- Pagination controls

---

### 6.5 Stok Flow

**A. Stok Masuk:**

**Flow:**
1. Click "Stok Masuk" button
2. Modal open
3. Select barang (dropdown/searchable)
4. Input jumlah masuk
5. Input keterangan (dari mana, no PO)
6. Select tanggal (default: today)
7. POST `/api/stok-history/masuk`
8. Trigger update stok otomatis
9. Success notification
10. Refresh table

**Validations:**
- Barang required
- Jumlah > 0
- Tanggal required

**UI:**
- Select barang (searchable dropdown)
- Input jumlah (number)
- Textarea keterangan
- Date picker
- Simpan button

---

**B. Stok Keluar:**

**Flow:**
1. Click "Stok Keluar" button
2. Modal open
3. Select barang (dropdown/searchable)
4. Show current stok
5. Input jumlah keluar
6. Validate: jumlah keluar <= stok current
7. Input keterangan (untuk apa, no request)
8. Select tanggal (default: today)
9. POST `/api/stok-history/keluar`
10. Trigger update stok otomatis
11. Success notification
12. Refresh table

**Validations:**
- Barang required
- Jumlah > 0
- Jumlah <= stok current (prevent negatif)
- Tanggal required

**UI:**
- Select barang (searchable dropdown)
- Display: "Stok Saat Ini: X"
- Input jumlah (number, max = stok current)
- Textarea keterangan
- Date picker
- Simpan button

---

**C. History Transaksi:**

**Features:**
- View all transaksi (masuk/keluar)
- Filter by barang (dropdown)
- Filter by tipe (masuk/keluar/semua)
- Filter by tanggal range (start_date, end_date)
- Pagination (100 rows/page)
- Undo transaksi (delete with confirmation)

**UI:**
- Table columns: Tanggal, Barang, Tipe (badge), Jumlah, Keterangan, Action (undo)
- Filter barang (dropdown)
- Filter tipe (dropdown)
- Date range picker
- Pagination controls

---

### 6.6 Reports

**A. Stok Summary:**

**Data:**
- All barang dengan: nama, kategori, stok, satuan, harga_satuan, total_value
- Filter by kategori (optional)
- Sort by: nama, kategori, stok, total_value

**Export:**
- CSV: semua columns
- PDF: formatted table dengan header sekolah

**UI:**
- Table
- Filter kategori (dropdown)
- Sort controls
- Export buttons (CSV/PDF)

---

**B. Laporan Masuk-Keluar:**

**Data:**
- Range tanggal (start_date, end_date)
- Filter by kategori (optional)
- Transaksi masuk: barang, jumlah, keterangan, tanggal
- Transaksi keluar: barang, jumlah, keterangan, tanggal
- Summary: total masuk, total keluar per barang

**Export:**
- CSV: separate sheets (masuk, keluar, summary)
- PDF: formatted report dengan summary

**UI:**
- Date range picker
- Filter kategori (dropdown)
- Tabs: Masuk | Keluar | Summary
- Export buttons (CSV/PDF)

---

**C. Warning Stok:**

**Data:**
- Barang dengan stok < min_stok
- Columns: nama, kategori, stok, min_stok, selisih
- Sort by selisih (ascending)

**Export:**
- CSV
- PDF

**UI:**
- Table (alert style)
- Export buttons
- Action: Stok Masuk (quick link)

---

### 6.7 Backup & Restore

**Auto Backup:**
- Every day 00:00 (cron job)
- Filename: `inventaris-YYYY-MM-DD.db`
- Location: `database/backups/`
- Keep last 30 backups (auto-delete old)

**Manual Backup:**
- Button: "Backup Now"
- POST `/api/backup/create`
- Download file to user-selected location

**Restore:**
- Button: "Restore Backup"
- Select backup file (from list)
- Confirmation dialog (warning: overwrite current data)
- POST `/api/backup/restore`
- App restart required

**UI:**
- Backup section (settings page)
- List backups (filename, date, size)
- Backup Now button
- Restore button per backup
- Download button per backup

---

## 7. UI/UX DESIGN GUIDELINES

### Color Palette

```css
:root {
  --primary: #3B82F6;
  --primary-dark: #2563EB;
  --secondary: #10B981;
  --danger: #EF4444;
  --warning: #F59E0B;
  --dark: #1F2937;
  --light: #F9FAFB;
  --border: #E5E7EB;
  --text-primary: #111827;
  --text-secondary: #6B7280;
}
```

### Typography

```css
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

h1: 24px, bold
h2: 20px, semi-bold
h3: 18px, semi-bold
body: 14px, regular
small: 12px, regular
```

### Components Style

```
Button:
  - Primary: bg-primary, text-white, hover:bg-primary-dark
  - Secondary: bg-gray-200, text-gray-800, hover:bg-gray-300
  - Danger: bg-danger, text-white, hover:bg-red-600
  - Border-radius: 6px
  - Padding: 8px 16px

Input/Select:
  - Border: 1px solid var(--border)
  - Border-radius: 6px
  - Padding: 8px 12px
  - Focus: border-primary, outline-none

Table:
  - Border: 1px solid var(--border)
  - Header: bg-gray-100, font-semi-bold
  - Row hover: bg-gray-50
  - Zebra stripes: even rows bg-gray-50

Modal:
  - Overlay: bg-black/50
  - Container: bg-white, border-radius: 8px
  - Max-width: 600px
  - Padding: 24px

Card:
  - Border: 1px solid var(--border)
  - Border-radius: 8px
  - Padding: 16px
  - Shadow: 0 1px 3px rgba(0,0,0,0.1)
```

### Layout

```
Sidebar: 250px fixed left
  - Logo top
  - Navigation menu
  - Logout bottom

Main Content: calc(100% - 250px)
  - Header: 60px (breadcrumb, user info)
  - Content: padding 24px
  - Footer: 40px (app version, school name)

Responsive: Hide sidebar on mobile, hamburger menu
```

---

## 8. DEVELOPMENT PHASES

### Phase 1: Setup (Day 1)

```
1. Init project structure
   - Create folders
   - Setup package.json root
   - Install dependencies

2. Electron setup
   - main/index.js (BrowserWindow)
   - main/preload.js (IPC)
   - main/menu.js (app menu)

3. React setup
   - Create React App scaffold
   - Setup React Router
   - Create folder structure
   - Global styles

4. Express setup
   - server/index.js (entry point)
   - Routes structure
   - Middleware setup

5. Database setup
   - SQLite connection
   - Run schema.sql
   - Run seeds.sql
   - Test connection
```

---

### Phase 2: License System (Day 2)

```
1. Backend
   - License routes + controller
   - License validation logic
   - Device ID generator (hardware fingerprint)
   - License generator CLI tool
   - License manager CLI tool

2. Frontend
   - LicensePage UI
   - LicenseActivation component
   - License API service
   - License context

3. Testing
   - Generate test license keys
   - Test activation flow
   - Test device lock
   - Test offline mode
```

---

### Phase 3: Authentication (Day 3)

```
1. Backend
   - Auth routes + controller
   - JWT token generation
   - Password hashing (bcryptjs)
   - Auth middleware (verify token)
   - Change password endpoint

2. Frontend
   - LoginPage UI
   - Auth API service
   - Auth context
   - Protected routes wrapper
   - Token storage (localStorage)

3. Testing
   - Login success/fail
   - Token validation
   - Token expiry
   - Change password
```

---

### Phase 4: Inventory CRUD (Day 4)

```
1. Backend
   - Inventory routes + controller
   - CRUD endpoints
   - Kategori endpoint
   - Validation middleware
   - Queries (models/queries.js)

2. Frontend
   - InventoryPage layout
   - InventoryTable component
   - InventoryForm modal (add/edit)
   - SearchFilter component
   - Delete confirmation
   - Inventory API service
   - Pagination logic

3. Testing
   - Add barang
   - Edit barang
   - Delete barang
   - Search & filter
   - Pagination
```

---

### Phase 5: Stok Flow (Day 5)

```
1. Backend
   - Stok history routes + controller
   - POST masuk endpoint + validation
   - POST keluar endpoint + validation (prevent negatif)
   - GET history endpoint (filter, pagination)
   - DELETE (undo) endpoint
   - Queries (triggers already in schema)

2. Frontend
   - StokFlowPage layout
   - StokMasukModal component
   - StokKeluarModal component (with validation)
   - HistoryTable component
   - UndoConfirm dialog
   - Stok API service
   - Date picker integration

3. Testing
   - Stok masuk + trigger
   - Stok keluar + validation
   - Undo transaksi
   - History filter
   - Real-time stok update
```

---

### Phase 6: Dashboard (Day 6)

```
1. Backend
   - Dashboard endpoint
   - Stats calculation (total barang, total value, warning)
   - Recent transactions query

2. Frontend
   - HomePage layout
   - StatsCard component (reusable)
   - RecentTransactions component
   - WarningStok component
   - Dashboard API service

3. Testing
   - Stats accuracy
   - Real-time updates
   - Warning alerts
```

---

### Phase 7: Reports & Export (Day 7)

```
1. Backend
   - Reports routes + controller
   - Stok summary endpoint
   - Masuk-keluar report endpoint
   - Warning stok endpoint
   - CSV export (csv-writer)
   - PDF export (pdfkit)

2. Frontend
   - ReportsPage layout
   - StokSummary component
   - MasukKeluarReport component
   - WarningReport component
   - DateRangePicker component
   - ExportButton component
   - Reports API service

3. Testing
   - Report data accuracy
   - CSV export format
   - PDF export format
   - Date range filter
```

---

### Phase 8: Backup System (Day 8)

```
1. Backend
   - Backup routes + controller
   - Create backup endpoint (copy DB file)
   - List backups endpoint
   - Restore backup endpoint
   - Auto-backup cron job (daily)
   - Cleanup old backups (keep 30)

2. Frontend
   - Backup section (SettingsPage)
   - List backups UI
   - Backup Now button
   - Restore button + confirmation
   - Download backup button

3. Testing
   - Manual backup
   - Auto backup (simulate)
   - Restore backup
   - Cleanup old backups
```

---

### Phase 9: Polish & Integration (Day 9-10)

```
1. UI/UX Polish
   - Consistent styling
   - Loading states
   - Error handling UI
   - Success/error notifications (toast)
   - Responsive design
   - Keyboard shortcuts
   - Accessibility (ARIA labels)

2. Integration Testing
   - End-to-end flow (license → login → CRUD → reports)
   - Edge cases (empty data, large data, concurrent requests)
   - Error scenarios (network fail, DB lock, invalid input)

3. Performance
   - Lazy loading components
   - Debounce search
   - Optimize queries
   - Cache static data

4. Documentation
   - README.md (user guide)
   - API documentation
   - Code comments
```

---

### Phase 10: Build & Package (Day 11-12)

```
1. Build Configuration
   - Webpack config (production)
   - Electron Builder config (electron-builder.yml)
   - Environment variables (.env.production)
   - App icon (icon.png)

2. Build Process
   - npm run build (React production build)
   - Copy server files to build/
   - Copy database files to build/
   - Package Electron (electron-builder)

3. Testing .exe
   - Fresh install testing
   - License activation
   - All features functional
   - Database initialization
   - Auto-update (optional)

4. Distribution
   - Generate installer (NSIS)
   - Generate portable .exe
   - Create user manual (PDF)
   - Create license keys (batch)
```

---

## 9. PACKAGE.JSON (ROOT)

```json
{
  "name": "inventaris-app",
  "version": "1.0.0",
  "description": "Aplikasi Inventaris Sekolah",
  "author": "Your Name",
  "license": "MIT",
  "main": "main/index.js",
  "homepage": "./",
  "scripts": {
    "react-start": "react-scripts start",
    "react-build": "react-scripts build",
    "react-test": "react-scripts test",
    "server-start": "node server/index.js",
    "server-dev": "nodemon server/index.js",
    "electron-start": "electron .",
    "electron-dev": "concurrently \"cross-env BROWSER=none npm run react-start\" \"wait-on http://localhost:3000 && cross-env NODE_ENV=development npm run electron-start\"",
    "electron-build": "npm run react-build",
    "electron-pack": "npm run electron-build && electron-builder build --win",
    "start": "npm run electron-dev",
    "build": "npm run electron-pack",
    "postinstall": "electron-builder install-app-deps",
    "init-db": "node scripts/init-db.js",
    "generate-license": "node scripts/generate-license.js"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "axios": "^1.3.0",
    "date-fns": "^2.29.0",
    "electron-squirrel-startup": "^1.1.0",
    "express": "^4.18.2",
    "sqlite3": "^5.1.6",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "body-parser": "^1.20.2",
    "csv-writer": "^1.6.0",
    "pdfkit": "^0.13.0",
    "node-machine-id": "^1.1.12",
    "node-cron": "^3.0.2"
  },
  "devDependencies": {
    "electron": "^27.0.0",
    "electron-builder": "^24.6.0",
    "react-scripts": "5.0.1",
    "concurrently": "^7.6.0",
    "wait-on": "^7.0.1",
    "nodemon": "^2.0.20",
    "cross-env": "^7.0.3"
  },
  "build": {
    "appId": "com.inventaris.sekolah",
    "productName": "Inventaris Sekolah",
    "directories": {
      "buildResources": "public",
      "output": "dist"
    },
    "files": [
      "build/**/*",
      "main/**/*",
      "server/**/*",
      "database/schema.sql",
      "database/seeds.sql",
      "node_modules/**/*",
      "package.json"
    ],
    "win": {
      "target": "nsis",
      "icon": "public/icon.png"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true
    }
  }
}
```

---

## 10. ENVIRONMENT VARIABLES

### .env.example

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DB_PATH=./database/inventaris.db

# Auth
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRY=24h

# License
LICENSE_SECRET=your_license_secret_key_change_this_in_production

# App
APP_NAME=Inventaris Sekolah
SCHOOL_NAME=Sekolah Default

# Backup
BACKUP_PATH=./database/backups
BACKUP_RETENTION_DAYS=30
AUTO_BACKUP_TIME=00:00
```

---

## 11. SECURITY CHECKLIST

```
Authentication & Authorization:
  ✓ JWT token validation setiap request
  ✓ Password hashing dengan bcryptjs (salt rounds: 10)
  ✓ Token expiry (24 jam)
  ✓ Logout clear token dari localStorage

Input Validation:
  ✓ Validate semua input (frontend + backend)
  ✓ Sanitize user input (prevent XSS)
  ✓ Parameterized queries (prevent SQL injection)
  ✓ File upload validation (jika ada)

License Security:
  ✓ Device ID locked (hardware fingerprint)
  ✓ License key hashed dengan SECRET
  ✓ One device per license
  ✓ Revoke capability (admin only)

Data Protection:
  ✓ .env tidak commit ke git (.gitignore)
  ✓ Secrets tidak exposed di logs
  ✓ Database file permissions (read/write owner only)
  ✓ Auto-backup encrypted (optional)

Network:
  ✓ CORS configured (localhost only untuk dev)
  ✓ HTTPS untuk production (jika server external)
  ✓ Rate limiting (optional, untuk prevent brute force)

Error Handling:
  ✓ Error messages tidak expose stack trace
  ✓ Centralized error handler
  ✓ Logging (tidak log sensitive data)
```

---

## 12. TESTING CHECKLIST

### License Testing

```
✓ License activation (valid key)
✓ License activation (invalid key)
✓ License activation (already activated)
✓ License activation (device locked)
✓ License status check
✓ App startup dengan license aktif
✓ App startup tanpa license
```

### Auth Testing

```
✓ Login (valid credentials)
✓ Login (invalid username)
✓ Login (invalid password)
✓ Logout
✓ Token expiry handling
✓ Change password (success)
✓ Change password (wrong old password)
✓ Protected route access (dengan token)
✓ Protected route access (tanpa token)
```

### Inventory Testing

```
✓ Add barang (valid data)
✓ Add barang (missing required fields)
✓ Edit barang (success)
✓ Delete barang (success)
✓ Delete barang (dengan stok_history → cascade)
✓ Search barang (by nama)
✓ Filter barang (by kategori)
✓ Pagination (next/prev)
```

### Stok Flow Testing

```
✓ Stok masuk (success)
✓ Stok masuk (invalid jumlah: 0 atau negatif)
✓ Stok masuk (trigger update stok)
✓ Stok keluar (success)
✓ Stok keluar (jumlah > stok → prevent negatif)
✓ Stok keluar (trigger update stok)
✓ Undo transaksi masuk (reverse stok)
✓ Undo transaksi keluar (reverse stok)
✓ History filter (by barang)
✓ History filter (by tipe)
✓ History filter (by tanggal range)
```

### Reports Testing

```
✓ Dashboard stats (accuracy)
✓ Dashboard recent transactions (10 latest)
✓ Dashboard warning stok (stok < min_stok)
✓ Stok summary report (all barang)
✓ Stok summary report (by kategori)
✓ Masuk-keluar report (range tanggal)
✓ Masuk-keluar report (by kategori)
✓ Warning stok report
✓ Export CSV (valid format)
✓ Export PDF (valid format)
```

### Backup Testing

```
✓ Manual backup (create .db file)
✓ Auto backup (cron job simulation)
✓ List backups (show all)
✓ Restore backup (overwrite DB)
✓ Cleanup old backups (keep 30)
✓ Download backup (to user location)
```

### Integration Testing

```
✓ Full flow: License → Login → Dashboard → CRUD → Reports → Logout
✓ Concurrent requests (multiple API calls)
✓ Empty data state (no barang, no transactions)
✓ Large data (1000+ barang, 10000+ transactions)
✓ Network failure (offline mode)
✓ Database locked (concurrent writes)
```

### Build Testing

```
✓ Production build (React)
✓ Electron package (.exe)
✓ Fresh install (blank database)
✓ Database initialization (schema + seeds)
✓ License activation (on fresh install)
✓ App icon displayed
✓ App menu functional
✓ Uninstall clean (no leftover files)
```

---

## 13. CLI TOOLS

### 13.1 License Generator

**File:** `scripts/generate-license.js`

```bash
# Generate single license
node scripts/generate-license.js

# Generate multiple licenses
node scripts/generate-license.js --count 10

# Output: license keys list
```

**Output:**
```
Generated License Keys:
1. INV-A1B2-C3D4-E5F6
2. INV-G7H8-I9J0-K1L2
...
Saved to: database/licenses.txt
```

---

### 13.2 License Manager

**File:** `scripts/license-manager.js`

```bash
# List all licenses
node scripts/license-manager.js --list

# Check license status
node scripts/license-manager.js --check INV-XXXX-XXXX-XXXX

# Revoke license
node scripts/license-manager.js --revoke INV-XXXX-XXXX-XXXX

# Activate license (manual)
node scripts/license-manager.js --activate INV-XXXX-XXXX-XXXX --device DEVICE_ID --school "Nama Sekolah"
```

---

### 13.3 Database Init

**File:** `scripts/init-db.js`

```bash
# Initialize database (run schema + seeds)
node scripts/init-db.js

# Reset database (drop all tables, re-init)
node scripts/init-db.js --reset
```

---

## 14. USER MANUAL (RINGKASAN)

### Instalasi

1. Download `inventaris-app-setup.exe`
2. Run installer
3. Pilih lokasi instalasi
4. Tunggu instalasi selesai
5. Launch aplikasi

---

### Aktivasi License (First-Time)

1. App startup → License Activation screen
2. Input license key (format: INV-XXXX-XXXX-XXXX)
3. Input nama sekolah
4. Copy Device ID (untuk support jika error)
5. Click "Activate"
6. Tunggu validasi
7. Success → redirect to Login

**Catatan:** License hanya bisa diaktivasi di satu perangkat (lifetime).

---

### Login

1. Input username (default: `admin`)
2. Input password (default: `admin123`)
3. Click "Login"
4. Success → redirect to Dashboard

**Catatan:** Ganti password default setelah login pertama (Settings → Change Password).

---

### Dashboard

- View total barang, nilai stok, barang warning
- View 10 transaksi terbaru
- View barang dengan stok < min_stok
- Quick action: Stok Masuk/Keluar

---

### Kelola Barang

**Tambah Barang:**
1. Menu Inventory → Click "Tambah Barang"
2. Input: Nama Barang, Kategori, Satuan, Harga Satuan, Min Stok, Deskripsi
3. Click "Simpan"

**Edit Barang:**
1. Click icon Edit (pada row barang)
2. Edit fields
3. Click "Simpan"

**Hapus Barang:**
1. Click icon Hapus (pada row barang)
2. Konfirmasi hapus
3. Click "Ya, Hapus"

**Search & Filter:**
- Search by nama barang (kolom search)
- Filter by kategori (dropdown)

---

### Stok Masuk

1. Menu Stok Flow → Click "Stok Masuk"
2. Pilih barang (dropdown searchable)
3. Input jumlah masuk
4. Input keterangan (contoh: "Dari supplier X, no PO: 123")
5. Pilih tanggal (default: today)
6. Click "Simpan"
7. Stok otomatis bertambah

---

### Stok Keluar

1. Menu Stok Flow → Click "Stok Keluar"
2. Pilih barang (dropdown searchable)
3. Lihat stok saat ini
4. Input jumlah keluar (max: stok saat ini)
5. Input keterangan (contoh: "Untuk kelas 7A, request guru X")
6. Pilih tanggal (default: today)
7. Click "Simpan"
8. Stok otomatis berkurang

**Validasi:** Jumlah keluar tidak boleh lebih dari stok saat ini.

---

### History Transaksi

1. Menu Stok Flow → Tab "History"
2. View all transaksi (masuk/keluar)
3. Filter by barang (dropdown)
4. Filter by tipe (masuk/keluar/semua)
5. Filter by tanggal range (date picker)
6. Undo transaksi (click icon Undo → konfirmasi)

**Undo:** Membatalkan transaksi dan mengembalikan stok.

---

### Laporan

**Laporan Stok Summary:**
1. Menu Reports → Stok Summary
2. Filter by kategori (optional)
3. View table (nama, kategori, stok, harga, total value)
4. Export CSV or PDF

**Laporan Masuk-Keluar:**
1. Menu Reports → Masuk-Keluar
2. Pilih tanggal range (start date, end date)
3. Filter by kategori (optional)
4. View tabs: Masuk | Keluar | Summary
5. Export CSV or PDF

**Laporan Warning Stok:**
1. Menu Reports → Warning Stok
2. View barang dengan stok < min_stok
3. Action: Stok Masuk (quick link)
4. Export CSV or PDF

---

### Backup & Restore

**Manual Backup:**
1. Menu Settings → Backup
2. Click "Backup Now"
3. Pilih lokasi save file
4. Tunggu proses selesai

**Auto Backup:**
- Otomatis setiap hari jam 00:00
- Disimpan di folder: `database/backups/`
- Keep last 30 backups (otomatis hapus backup lama)

**Restore Backup:**
1. Menu Settings → Backup
2. Pilih backup file dari list
3. Click "Restore"
4. Konfirmasi (warning: akan overwrite data saat ini)
5. Tunggu proses selesai
6. App restart otomatis

**Download Backup:**
1. Menu Settings → Backup
2. Click icon Download (pada row backup)
3. Pilih lokasi save file

---

### Logout

1. Click user icon (top-right)
2. Click "Logout"
3. Redirect to Login screen

---

### Ganti Password

1. Menu Settings → Change Password
2. Input old password
3. Input new password
4. Confirm new password
5. Click "Simpan"

---

## 15. TROUBLESHOOTING

### License tidak bisa diaktivasi

**Penyebab:**
- License key salah format
- License key tidak terdapat di database
- License key sudah diaktivasi di device lain
- Tidak ada koneksi internet

**Solusi:**
- Cek format license key (INV-XXXX-XXXX-XXXX)
- Hubungi support dengan Device ID
- Pastikan koneksi internet aktif

---

### Login gagal

**Penyebab:**
- Username/password salah
- Token expired

**Solusi:**
- Cek username/password (default: admin/admin123)
- Logout dan login ulang

---

### Stok keluar error (tidak boleh negatif)

**Penyebab:**
- Jumlah keluar > stok saat ini

**Solusi:**
- Cek stok saat ini
- Input jumlah keluar <= stok

---

### Export PDF/CSV error

**Penyebab:**
- Tidak ada data untuk export
- File permission denied

**Solusi:**
- Pastikan ada data untuk export
- Pilih lokasi save file yang punya write permission

---

### Restore backup gagal

**Penyebab:**
- Backup file corrupt
- Database sedang digunakan

**Solusi:**
- Tutup semua transaksi
- Restart app
- Coba restore ulang

---

## PLANNING SELESAI

Ready untuk mulai setup project?
