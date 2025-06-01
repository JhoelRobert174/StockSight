# StockSight – Dashboard Inventaris Produk

## Deskripsi

**StockSight** adalah aplikasi web dashboard yang dirancang untuk membantu pencatatan dan pemantauan stok produk berdasarkan kategori. Cocok untuk toko kecil, UMKM, hingga kebutuhan pribadi. Dengan tampilan responsif dan fitur visualisasi interaktif, StockSight memudahkan pengguna dalam mengelola inventaris secara efisien.

---

## ✅ Fitur-Fitur Utama

### 📆 Produk & Kategori

* **Produk**

  * Tambah, lihat, edit, hapus produk
  * Pencarian nama produk & filter berdasarkan kategori
  * Pagination & navigasi antar halaman
  * Riwayat harga tercatat otomatis saat mutasi

* **Kategori**

  * CRUD kategori
  * Validasi penghapusan: tidak bisa menghapus kategori yang masih digunakan
  * Search dan pagination

### 🔁 Mutasi Stok

* Tambah mutasi stok (aksi: masuk / keluar)
* Validasi stok keluar agar tidak melebihi stok tersedia
* Opsi ubah harga saat mutasi
* Tercatat otomatis di log aktivitas

### 📊 Dashboard Visual Interaktif

* **Pie chart**: distribusi stok per kategori
* **Bar chart**: total stok per produk
* **Line chart**: histori harga produk
* Interaktif:

  * Klik kategori → tampilkan produk terkait
  * Klik produk → tampilkan grafik harga

### ⚙️ Utilitas & Navigasi

* Navigasi berbasis SPA dengan React Router DOM
* Sidebar responsif (auto-collapse di mobile)
* Halaman Pengaturan:

  * Ubah nama toko
  * Dark mode toggle
  * Hapus akun (dengan konfirmasi)
* Log Aktivitas:

  * Menampilkan semua aktivitas pengguna
  * Paginasi & filtering

### 🗵️ UX & Responsivitas

* Tailwind CSS v4: utility-first responsive design
* Komponen reusable: `Button`, `Input`, `Select`, `PageWrapper`, dll
* Efek hover, shadow lembut, dan rounded corner
* Dark mode tersedia
* Ikon menggunakan `react-icons`

---

## 🔧 Teknologi yang Digunakan

### Backend

* Python + Pyramid
* SQLAlchemy ORM + PostgreSQL
* RESTful API lengkap (`GET`, `POST`, `PUT`, `DELETE`)
* Session-based authentication (SignedCookie)
* Custom middleware: `auth_tween` untuk proteksi endpoint
* Alembic untuk migrasi skema database
* Log aktivitas pengguna
* Pytest untuk unit testing dengan coverage ≥ 60%

### Frontend

* React JS (Hooks & Functional Components)
* React Router DOM
* Tailwind CSS (custom styling, responsive)
* Context API:

  * `AuthContext` (login/logout/me)
  * `SettingsContext` (nama toko, dark mode)
  * `SidebarContext` (sidebar toggle)
* Fetch API untuk komunikasi backend
* Virtualized list: `react-window`
* Ikon UI: `react-icons`

---

## 🗂️ Struktur Folder

```
/src
├── components/       # Navbar, Sidebar, Layout, Reusable UI
├── pages/            # Dashboard, Produk, Kategori, Log, Pengaturan, dll
├── context/          # Auth, Settings, Sidebar
├── hooks/            # useAuth, useSettings, useDarkMode
├── services/         # (rencana: integrasi Axios)
├── utils/            # Konstanta & helper
├── App.jsx
└── main.jsx
```

---

## ⚙️ Instalasi & Setup

### Backend (Python Pyramid)

```bash
cd backend
python3 -m venv env
source env/bin/activate        # Linux/Mac
env\Scripts\activate           # Windows

pip install -e ".[testing]"
alembic -c development.ini revision --autogenerate -m "initial schema"
alembic -c development.ini upgrade head
initialize_backend_db development.ini

pytest                         # untuk menjalankan unit test
pserve development.ini         # menjalankan server lokal
```

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

---

## 📜 Pemenuhan Spesifikasi Akademik

| Kriteria                                      |
| --------------------------------------------- |
| CRUD pada 2+ entitas (Produk, Kategori, User) |
| Gunakan PostgreSQL sebagai database           |
| RESTful API + autentikasi                     |
| Frontend React + Router + Hooks               |
| TailwindCSS + Context API                     |
| Minimal 3 commit per minggu                   |
| Unit test coverage ≥ 60% untuk fungsi kritis  |
| Link GitHub dan NIM pada repo                 |

---

## 👤 Author

* **Nama:** Jhoel Robert Sugiono Hutagalung
* **NIM:** 122140174
* 💡 *Project ini sebelumnya dikembangkan di akun lain (**Arkyna**) dan dimirror ke akun resmi (**JhoelRobert174**) untuk kebutuhan akademik.*

> Lihat bagian **Contributors** di GitHub untuk riwayat kontribusi lebih lanjut.

---

## Pytest:

![Image](https://github.com/user-attachments/assets/3c84b295-b73c-4db4-95ac-1e07f9a58f89)

---

## Reference:

* [Material Design Dark Theme](https://m2.material.io/design/color/dark-theme.html)
* [Tailwind CSS Dark Mode Docs](https://tailwindcss.com/docs/dark-mode)
