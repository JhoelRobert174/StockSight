# Backend

## Getting Started

### 1. Masuk ke direktori backend:

```bash
cd backend
```

---

### 2. Buat virtual environment:

```bash
python3 -m venv env
```

---

###  3. Upgrade alat-alat packaging:

```bash
env/bin/pip install --upgrade pip setuptools
```

---

### 4. Install project dengan dependencies testing:

```bash
env/bin/pip install -e ".[testing]"
```

---

### 5. Konfigurasi Database

#### a. Buat database development dan test di PostgreSQL:

```sql
CREATE DATABASE be174;
CREATE DATABASE be174_test;
```

#### b. Buat user PostgreSQL (jika belum):

```sql
CREATE USER be_user WITH PASSWORD 'passwordmu';
GRANT ALL PRIVILEGES ON DATABASE be174 TO be_user;
GRANT ALL PRIVILEGES ON DATABASE be174_test TO be_user;
```

#### c. Berikan akses ke schema `public`:

```sql
\c be174
GRANT ALL ON SCHEMA public TO be_user;

\c be174_test
GRANT ALL ON SCHEMA public TO be_user;
```

---

### 6. Inisialisasi database (development dan testing):

#### a. Autogenerate migration pertama:

```bash
env/bin/alembic -c development.ini revision --autogenerate -m "initial schema"
```

#### b. Jalankan migrasi ke `head` (untuk development):

```bash
env/bin/alembic -c development.ini upgrade head
```

#### c. Jalankan migrasi ke `head` (untuk testing):

```bash
env/bin/alembic -c testing.ini upgrade head
```

---

### 7. Load data default (jika ada):

```bash
env/bin/initialize_backend_db development.ini
```

---

### 8. Jalankan test project (pytest):

```bash
# Menjalankan semua test
env/bin/pytest

# Menjalankan test pada file tertentu
env/bin/pytest tests/test_auth.py
```

---

### 9. Jalankan server backend (Pyramid):

```bash
env/bin/pserve development.ini
```

---

## Debugging Tips

* **Ganti password user PostgreSQL:**

  ```sql
  ALTER USER be_user WITH PASSWORD 'passwordbaru';
  ```

* **Cek revisi Alembic yang aktif:**

  ```bash
  env/bin/alembic -c development.ini current
  env/bin/alembic -c testing.ini current
  ```

* **Reset migration (hati-hati!):**

  ```bash
  alembic downgrade base
  alembic revision --autogenerate -m "reset schema"
  ```

---

## Maintainer Notes

* Pastikan `testing.ini` dan `development.ini` memiliki `sqlalchemy.url` yang sesuai.
* Jangan lupa setup `conftest.py` agar DB test ter-isolasi dan fixture `testapp`, `dbsession`, dll bekerja sempurna.


note: salah path kelar sudah