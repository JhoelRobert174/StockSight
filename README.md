# StockSight – Dashboard Inventaris Produk

## Deskripsi

**StockSight** adalah aplikasi web dashboard untuk mencatat dan memantau stok produk berdasarkan kategori. Dirancang untuk toko kecil, UKM, atau kebutuhan inventaris pribadi, aplikasi ini menyediakan antarmuka yang intuitif, responsif, dan mendukung manajemen data produk dan kategori secara efisien.

---

## Fitur-Fitur Utama

### Produk & Kategori

* **Produk:**

  * Tambah, lihat, edit, hapus produk
  * Filter & search nama produk
  * Pagination & lompat halaman
  * Riwayat harga produk tersimpan otomatis
* **Kategori:**

  * Tambah, lihat, edit, hapus kategori
  * Search kategori
  * Pagination & lompat halaman
  * Validasi kategori tidak bisa dihapus jika masih digunakan

### Mutasi Stok

* Form mutasi stok (aksi: masuk / keluar)
* Validasi stok tidak mencukupi untuk keluar
* Opsional ubah harga saat mutasi
* Aktivitas tercatat otomatis di log

### Dashboard Visual

* **Pie chart:** distribusi stok per kategori
* **Bar chart:** total stok semua produk
* **Line chart:** riwayat harga produk
* Interaktif:

  * Klik kategori → tampilkan daftar produk
  * Klik produk → tampilkan riwayat harga

### Utilitas & Navigasi

* Navigasi SPA dengan React Router
* Sidebar tetap (toggleable untuk mobile)
* Halaman Pengaturan:

  * Edit nama toko (localStorage)
  * Mode gelap (Sekarang di Sidebar)&#x20;
* Log Aktivitas:

  * Aktivitas tercatat dari backend
  * Paginasi dan lompat halaman
* Konfirmasi hapus (native confirm)

### UX & Responsivitas

* Tailwind CSS: utility-first design
* Komponen responsif & reusable (Button, Input, Table, PageWrapper, dll)
* Hover effect, rounded corner, soft shadows
* Dark mode tersedia

---

## Teknologi yang Digunakan

### Backend

* Python + Pyramid
* PostgreSQL
* RESTful API
* Session-based Authentication (SignedCookie)
* Custom middleware (auth\_tween)
* Log aktivitas terintegrasi
* Validasi input backend

### Frontend

* React JS (Hooks & Functional Components)
* React Router DOM
* Tailwind CSS
* Virtualized rendering: react-window
* Context API:

  * AuthContext
  * SettingsContext (nama toko)
  * SidebarContext

---

## Struktur Folder

```
/src
├── components/       # Navbar, Sidebar, Layout, Reusable UI
├── pages/            # Dashboard, Produk, Kategori, Log, Pengaturan
├── context/          # Auth, Settings, Sidebar
├── services/         # (rencana integrasi Axios API wrapper)
├── utils/            # Constants, helpers
├── App.jsx
├── main.jsx
```

## Instalasi & Setup

### Frontend:

```bash
npm install
npm run dev
```

### Backend (Python Pyramid):

```bash
pip install -e .
pserve development.ini
```

---

## Author

Nama: **Jhoel Robert Sugiono Hutagalung**
NIM : **122140174**

> Project ini sebelumnya dikembangkan di akun lain (**Arkyna**), dan dimirror ke akun resmi (**JhoelRobert174**) untuk kebutuhan akademik. Silakan lihat bagian *Contributors* pada repositori untuk riwayat kontribusi.
