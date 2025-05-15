# StockSight – Dashboard Inventaris Produk

## Deskripsi
**StockSight** adalah aplikasi web dashboard untuk mencatat dan memantau stok produk berdasarkan kategori.
Dirancang untuk toko kecil, UKM, atau kebutuhan inventaris pribadi, aplikasi ini menyediakan antarmuka yang
intuitif, responsif, dan mendukung manajemen data produk dan kategori dengan efisien.

---

## Fitur-Fitur Utama

### Produk & Kategori
- CRUD Produk:
  - Tambah, lihat, edit, hapus produk
  - Filter dan search nama produk
  - Sorting berdasarkan nama, stok, kategori, dan harga
- CRUD Kategori:
  - Tambah, lihat, edit, hapus kategori
  - Search dan sorting nama kategori

### Dashboard Visual
- Pie chart distribusi stok per kategori
- Bar chart total stok semua produk
- Line chart riwayat harga produk
- Interaktif: klik kategori → filter produk → tampilkan grafik harga

### Utilitas & Navigasi
- Navigasi dinamis (React Router)
- Sidebar navigasi tetap (Layout)
- Halaman Pengaturan (nama toko, mode gelap simulasi)
- Log Aktivitas (dummy interaksi, siap integrasi backend)
- Konfirmasi aksi (hapus data dengan modal/native confirm)

### UX & Responsivitas
- Tailwind CSS utility-first design
- Komponen responsif, hover effect, shadowed box UI
- Simulasi dark mode toggle

---

## Teknologi yang Digunakan

### Backend
*(belum diimplementasikan pada tahap ini, namun dirancang untuk integrasi dengan):*
- Python Pyramid
- PostgreSQL
- RESTful API
- Basic Authentication
- Unit Testing (≥60% coverage target)

### Frontend
- React JS (Functional Components, Hooks)
- React Router DOM (SPA Navigation)
- Tailwind CSS
- Axios (rencana integrasi)
- Virtualized rendering (react-window)
- State handling with Context API (planned)

---

## Struktur Folder
```
/src
├── components/ # Navbar, Sidebar, Layout, Reusable UI
├── pages/ # Dashboard, Produk, Kategori, Log, Pengaturan
├── context/ # (untuk global state, akan dikembangkan)
├── services/ # Axios API wrapper (akan digunakan)
├── utils/ # Auth helper, constants
├── App.jsx
├── main.jsx
## Struktur Folder
```

## Instalasi & Setup (Coming Soon)
Untuk frontend:

```bash
npm install
npm run dev
```

## Author
Nama: Jhoel Robert Sugiono Hutagalung  
NIM : 122140174

> Project ini sebelumnya dikembangkan di akun lain (Arkyna), dimirror ke akun resmi (JhoelRobert174) untuk kebutuhan akademik, dapat di check pada Contributors.
