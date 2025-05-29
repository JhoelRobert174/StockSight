backend
=======

Getting Started
---------------

- Change directory into your newly created project if not already there. Your
  current directory should be the same as this README.txt file and setup.py.

    cd backend

- Create a Python virtual environment, if not already created.

    python3 -m venv env

- Upgrade packaging tools, if necessary.

    env/bin/pip install --upgrade pip setuptools

- Install the project in editable mode with its testing requirements.

    env/bin/pip install -e ".[testing]"

- Initialize and upgrade the database using Alembic.

    - Generate your first revision.

        env/bin/alembic -c development.ini revision --autogenerate -m "init"

    - Upgrade to that revision.

        env/bin/alembic -c development.ini upgrade head

- Load default data into the database using a script.

    env/bin/initialize_backend_db development.ini

- Run your project's tests.

    env/bin/pytest

- Run your project.

    env/bin/pserve development.ini



## 🔧 Optional Module: MutasiStok

Model `MutasiStok` disiapkan untuk fitur histori stok granular.
Saat ini tidak digunakan secara aktif karena pencatatan mutasi dilakukan via log_aktivitas.

Jika ingin mengaktifkan:
- Buka komentar import `mutasi_stok` di `models/__init__.py`
- Tambahkan kembali endpoint GET /produk/:id/mutasi-riwayat
- Tambahkan catatan ke UI jika perlu

Gunakan jika sistem inventory berkembang lebih kompleks.
