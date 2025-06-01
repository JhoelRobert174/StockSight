import pytest
from backend.models.user import User
from backend.models.kategori import Kategori
from backend.models.produk import Produk
from backend.models.harga_produk import HargaProduk # Tetap diimport jika ada penggunaan di masa depan atau di views
from backend.views.auth import hash_password
from decimal import Decimal # Diperlukan jika ingin membandingkan harga desimal secara presisi

# Helper function dari kode Anda
def setup_user_and_kategori(testapp, dbsession):
    user = User(
        email='produkuser@example.com',
        username='produkuser',
        password_hash=hash_password('produkpass')
    )
    dbsession.add(user)
    dbsession.flush()

    res_login = testapp.post_json('/login', {
        'username': 'produkuser',
        'password': 'produkpass'
    }, status=200)
    cookie = res_login.headers['Set-Cookie']

    kategori = Kategori(nama="Kategori Tes", user_id=user.id)
    dbsession.add(kategori)
    dbsession.flush()

    return user.id, kategori.id, cookie

# --- Tes dari Kode Anda (Sudah Berfungsi) ---

def test_create_produk_success(testapp, dbsession):
    user_id, kategori_id, cookie = setup_user_and_kategori(testapp, dbsession)
    produk_data = {
        "nama": "Produk Tes Sukses",
        "stok": 50,
        "harga": 12000,
        "kategori_id": kategori_id
    }
    res = testapp.post_json('/produk', produk_data, headers={'Cookie': cookie}, status=200)
    data = res.json

    assert 'id' in data
    assert data.get('message') == 'Produk berhasil ditambahkan'

def test_create_produk_duplicate_nama(testapp, dbsession):
    user_id, kategori_id, cookie = setup_user_and_kategori(testapp, dbsession)
    payload = {
        "nama": "Produk Duplikat Test",
        "stok": 10,
        "harga": 5000,
        "kategori_id": kategori_id
    }

    testapp.post_json('/produk', payload, headers={'Cookie': cookie}, status=200)
    res = testapp.post_json('/produk', payload, headers={'Cookie': cookie}, status=400)

    error = res.json.get('error', '').lower()
    assert 'sudah ada' in error or 'sudah digunakan' in error or 'sudah' in error


def test_get_produk_detail_success(testapp, dbsession):
    user_id, kategori_id, cookie = setup_user_and_kategori(testapp, dbsession)
    produk_data = {
        "nama": "Produk Detail Test Get", # Nama diubah sedikit
        "stok": 20,
        "harga": 15000,
        "kategori_id": kategori_id
    }
    res_create = testapp.post_json('/produk', produk_data, headers={'Cookie': cookie}, status=200)
    produk_id = res_create.json['id']

    res_get = testapp.get(f'/produk/{produk_id}', headers={'Cookie': cookie}, status=200)
    assert res_get.json['id'] == produk_id
    assert res_get.json['nama'] == produk_data['nama']
    assert res_get.json['stok'] == produk_data['stok']

def test_update_produk_success(testapp, dbsession):
    user_id, kategori_id, cookie = setup_user_and_kategori(testapp, dbsession)
    res_create = testapp.post_json('/produk', {
        "nama": "Produk Lama Update Test", # Nama diubah sedikit
        "stok": 10,
        "harga": 8000,
        "kategori_id": kategori_id
    }, headers={'Cookie': cookie}, status=200)
    produk_id = res_create.json['id']

    update_payload = {
        "nama": "Produk Baru Setelah Update",
        "stok": 15,
        "harga": 9000 # Harga bisa juga string "9000.00" jika API mengharapkan Numeric presisi
    }
    res_update = testapp.put_json(f'/produk/{produk_id}', update_payload, headers={'Cookie': cookie}, status=200)
    assert 'message' in res_update.json # Sesuai contoh Anda
    # Verifikasi tambahan (opsional tapi baik)
    res_get = testapp.get(f'/produk/{produk_id}', headers={'Cookie': cookie}, status=200)
    assert res_get.json['nama'] == update_payload['nama']
    assert res_get.json['stok'] == update_payload['stok']
    assert float(res_get.json['harga']) == float(update_payload['harga'])


def test_delete_produk_success(testapp, dbsession):
    user_id, kategori_id, cookie = setup_user_and_kategori(testapp, dbsession)
    res_create = testapp.post_json('/produk', {
        "nama": "Produk Akan Dihapus Test", # Nama diubah sedikit
        "stok": 5,
        "harga": 1000,
        "kategori_id": kategori_id
    }, headers={'Cookie': cookie}, status=200)
    produk_id = res_create.json['id']

    # Pastikan produk ada sebelum dihapus
    assert dbsession.query(Produk).filter_by(id=produk_id).one_or_none() is not None

    res_delete = testapp.delete(f'/produk/{produk_id}', headers={'Cookie': cookie}, status=200)
    assert 'message' in res_delete.json # Sesuai contoh Anda
    assert 'berhasil dihapus' in res_delete.json['message'].lower()

    # Verifikasi di database bahwa produk sudah tidak ada
    assert dbsession.query(Produk).filter_by(id=produk_id).one_or_none() is None

def test_mutasi_stok_masuk(testapp, dbsession): # Dari kode Anda
    user_id, kategori_id, cookie = setup_user_and_kategori(testapp, dbsession)
    res_create = testapp.post_json('/produk', {
        "nama": "Produk Mutasi Test", # Nama diubah sedikit
        "stok": 10,
        "harga": 5000,
        "kategori_id": kategori_id
    }, headers={'Cookie': cookie}, status=200)
    produk_id = res_create.json['id']

    res_mutasi = testapp.post_json(f'/produk/{produk_id}/mutasi', {
        "aksi": "masuk",
        "jumlah": 5
    }, headers={'Cookie': cookie}, status=200)
    assert res_mutasi.json['stok_sisa'] == 15

def test_produk_by_kategori(testapp, dbsession): # Dari kode Anda
    user_id, kategori_id, cookie = setup_user_and_kategori(testapp, dbsession)
    testapp.post_json('/produk', {
        "nama": "Produk Kategori A Test", # Nama diubah sedikit
        "stok": 5,
        "harga": 7000,
        "kategori_id": kategori_id
    }, headers={'Cookie': cookie}, status=200)
    # Buat produk lain di kategori yang sama untuk memastikan list berfungsi
    testapp.post_json('/produk', {
        "nama": "Produk Kategori B Test",
        "stok": 3,
        "harga": 6000,
        "kategori_id": kategori_id
    }, headers={'Cookie': cookie}, status=200)

    res = testapp.get(f'/produk/kategori/{kategori_id}', headers={'Cookie': cookie}, status=200)
    assert 'data' in res.json
    assert isinstance(res.json['data'], list)
    assert len(res.json['data']) >= 2 # Pastikan minimal 2 produk yang baru dibuat ada di sana
    for item in res.json['data']:
        assert item['kategori_id'] == kategori_id

def test_mutasi_riwayat_disabled(testapp, dbsession): # Dari kode Anda
    user_id, kategori_id, cookie = setup_user_and_kategori(testapp, dbsession)
    # Membuat produk secara langsung ke DB untuk tes ini karena endpoint produk mungkin tidak mengizinkan harga 0 atau stok 0
    produk = Produk(
        nama="Dummy Riwayat Test", # Nama diubah sedikit
        harga=1000,
        stok=1,
        kategori_id=kategori_id,
        user_id=user_id
    )
    dbsession.add(produk)
    dbsession.flush()

    res = testapp.get(f'/produk/{produk.id}/mutasi-riwayat', headers={'Cookie': cookie}, status=410) # 410 Gone
    assert 'error' in res.json
    assert 'dinonaktifkan' in res.json['error'].lower()

# --- Tes Tambahan dari Rancangan test_produk_crud.py (Disesuaikan) ---

def test_create_produk_missing_fields(testapp, dbsession):
    user_id, kategori_id, cookie = setup_user_and_kategori(testapp, dbsession)

    # Kasus 1: Nama kosong
    payload_no_nama = {"stok": 100, "harga": 15000, "kategori_id": kategori_id}
    res_no_nama = testapp.post_json('/produk', payload_no_nama, headers={'Cookie': cookie}, status=400)
    assert 'error' in res_no_nama.json
    assert 'nama' in res_no_nama.json['error'].lower() # Asumsi pesan error menyebut field 'nama'

    # Kasus 2: Harga kosong
    payload_no_harga = {"nama": "Produk Tanpa Harga", "stok": 100, "kategori_id": kategori_id}
    res_no_harga = testapp.post_json('/produk', payload_no_harga, headers={'Cookie': cookie}, status=400)
    assert 'error' in res_no_harga.json
    assert 'harga' in res_no_harga.json['error'].lower()

    # Kasus 3: Kategori ID kosong
    payload_no_kategori = {"nama": "Produk Tanpa Kategori", "stok": 100, "harga": 20000}
    res_no_kategori = testapp.post_json('/produk', payload_no_kategori, headers={'Cookie': cookie}, status=400)
    assert 'error' in res_no_kategori.json
    assert 'kategori_id' in res_no_kategori.json['error'].lower() or 'kategori' in res_no_kategori.json['error'].lower()

def test_create_produk_invalid_kategori(testapp, dbsession):
    user_id, _, cookie = setup_user_and_kategori(testapp, dbsession) # kategori_id dari setup tidak digunakan
    invalid_kategori_id = 99999 # ID yang diasumsikan tidak ada

    payload = {
        "nama": "Produk Kategori Invalid Test", # Nama diubah sedikit
        "stok": 10,
        "harga": 5000,
        "kategori_id": invalid_kategori_id
    }
    res = testapp.post_json('/produk', payload, headers={'Cookie': cookie}, status=400) # Asumsi 400 untuk kategori tidak valid
    assert 'error' in res.json
    # Pesan error bisa bervariasi, misalnya "kategori tidak ditemukan" atau "kategori_id tidak valid"
    assert 'kategori' in res.json['error'].lower()

def test_get_produk_detail_not_found(testapp, dbsession):
    _, _, cookie = setup_user_and_kategori(testapp, dbsession)
    non_existent_produk_id = 99999

    res = testapp.get(f'/produk/{non_existent_produk_id}', headers={'Cookie': cookie}, status=404)
    assert 'error' in res.json
    assert 'tidak ditemukan' in res.json['error'].lower() # Sesuaikan dengan pesan error Anda

def test_update_produk_not_found(testapp, dbsession):
    _, _, cookie = setup_user_and_kategori(testapp, dbsession)
    non_existent_produk_id = 99999
    update_payload = {"nama": "Update Produk Tidak Ada"}

    res = testapp.put_json(f'/produk/{non_existent_produk_id}', update_payload, headers={'Cookie': cookie}, status=404)
    assert 'error' in res.json
    assert 'tidak ditemukan' in res.json['error'].lower()

def test_update_produk_to_duplicate_nama(testapp, dbsession):
    user_id, kategori_id, cookie = setup_user_and_kategori(testapp, dbsession)

    # Produk 1
    produk1_nama = "Nama Produk Satu Original"
    res_p1 = testapp.post_json('/produk', {
        "nama": produk1_nama, "stok": 10, "harga": 10000, "kategori_id": kategori_id
    }, headers={'Cookie': cookie}, status=200)
    assert 'id' in res_p1.json

    # Produk 2
    res_p2 = testapp.post_json('/produk', {
        "nama": "Nama Produk Dua Akan Diubah", "stok": 20, "harga": 20000, "kategori_id": kategori_id
    }, headers={'Cookie': cookie}, status=200)
    produk2_id = res_p2.json['id']

    # Coba update Produk 2 dengan nama Produk 1
    update_payload = {"nama": produk1_nama, "stok": 25, "harga": 25000} # Nama sama dengan produk1
    res_update = testapp.put_json(f'/produk/{produk2_id}', update_payload, headers={'Cookie': cookie}, status=400) # Sesuai contoh duplicate Anda
    assert 'error' in res_update.json
    assert 'sudah digunakan' in res_update.json['error'].lower()

def test_update_produk_invalid_kategori(testapp, dbsession):
    user_id, kategori_id, cookie = setup_user_and_kategori(testapp, dbsession)
    # Buat produk awal
    res_create = testapp.post_json('/produk', {
        "nama": "Produk Update Kategori Invalid",
        "stok": 10,
        "harga": 8000,
        "kategori_id": kategori_id # Kategori awal valid
    }, headers={'Cookie': cookie}, status=200)
    produk_id = res_create.json['id']

    invalid_kategori_id = 99999
    update_payload = {"kategori_id": invalid_kategori_id}

    res_update = testapp.put_json(f'/produk/{produk_id}', update_payload, headers={'Cookie': cookie}, status=400) # Asumsi 400
    assert 'error' in res_update.json
    assert 'kategori' in res_update.json['error'].lower() # "kategori tidak ditemukan" atau serupa

def test_delete_produk_not_found(testapp, dbsession):
    _, _, cookie = setup_user_and_kategori(testapp, dbsession)
    non_existent_produk_id = 99999

    res = testapp.delete(f'/produk/{non_existent_produk_id}', headers={'Cookie': cookie}, status=404)
    assert 'error' in res.json
    assert 'tidak ditemukan' in res.json['error'].lower()

def test_produk_unauthenticated_access(testapp, dbsession):
    # Setup data tanpa login, hanya untuk memastikan ada ID yang bisa ditarget
    # User dan kategori tetap perlu dibuat untuk foreign key constraint jika produk dibuat
    # Namun, untuk tes unauthenticated, kita tidak perlu cookie yang valid
    user_temp = User(email='temp@example.com', username='tempuser', password_hash=hash_password('temppass'))
    dbsession.add(user_temp)
    dbsession.flush()
    kategori_temp = Kategori(nama="Kategori Temp", user_id=user_temp.id)
    dbsession.add(kategori_temp)
    dbsession.flush()
    produk_temp = Produk(nama="Produk Temp Unauth", stok=5, harga=100, kategori_id=kategori_temp.id, user_id=user_temp.id)
    dbsession.add(produk_temp)
    dbsession.flush()
    
    produk_id_for_test = produk_temp.id
    kategori_id_for_test = kategori_temp.id

    # Test POST (Create)
    res_post = testapp.post_json('/produk', {
        "nama": "Produk Unauth Create", "stok": 10, "harga": 100, "kategori_id": kategori_id_for_test
    }, status=401) # Mengharapkan 401 Unauthorized
    assert 'error' in res_post.json
    assert 'unauthorized' in res_post.json['error'].lower() or 'otentikasi' in res_post.json['error'].lower()


    # Test GET (Detail)
    res_get = testapp.get(f'/produk/{produk_id_for_test}', status=401)
    assert 'error' in res_get.json
    assert 'unauthorized' in res_get.json['error'].lower() or 'otentikasi' in res_get.json['error'].lower()

    # Test PUT (Update)
    res_put = testapp.put_json(f'/produk/{produk_id_for_test}', {"nama": "Updated Unauth"}, status=401)
    assert 'error' in res_put.json
    assert 'unauthorized' in res_put.json['error'].lower() or 'otentikasi' in res_put.json['error'].lower()

    # Test DELETE
    res_delete = testapp.delete(f'/produk/{produk_id_for_test}', status=401)
    assert 'error' in res_delete.json
    assert 'unauthorized' in res_delete.json['error'].lower() or 'otentikasi' in res_delete.json['error'].lower()

    # Test GET (List - endpoint dari test_produk_list.py, contoh)
    res_list_all = testapp.get('/produk?page=1&limit=10', status=401)
    assert 'error' in res_list_all.json
    assert 'unauthorized' in res_list_all.json['error'].lower() or 'otentikasi' in res_list_all.json['error'].lower()
    
    # Test GET (List by Kategori - endpoint dari kode Anda)
    res_list_kategori = testapp.get(f'/produk/kategori/{kategori_id_for_test}', status=401)
    assert 'error' in res_list_kategori.json
    assert 'unauthorized' in res_list_kategori.json['error'].lower() or 'otentikasi' in res_list_kategori.json['error'].lower()

    # Test POST (Mutasi Stok - endpoint dari kode Anda)
    if produk_id_for_test: # Hanya jika produk berhasil dibuat sebelumnya
        res_mutasi = testapp.post_json(f'/produk/{produk_id_for_test}/mutasi', {
            "aksi": "masuk", "jumlah": 5
        }, status=401)
        assert 'error' in res_mutasi.json
        assert 'unauthorized' in res_mutasi.json['error'].lower() or 'otentikasi' in res_mutasi.json['error'].lower()