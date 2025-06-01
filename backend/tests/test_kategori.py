import pytest
from backend.models.user import User
from backend.models.kategori import Kategori
from backend.views.auth import hash_password


def authenticated_cookie(testapp, dbsession):
    user = User(
        username='katuser',
        email='kat@example.com',
        password_hash=hash_password('katpass')
    )
    dbsession.add(user)
    dbsession.flush()
    res = testapp.post_json('/login', {
        'username': 'katuser',
        'password': 'katpass'
    }, status=200)
    return user, res.headers['Set-Cookie']


def test_create_kategori_success(testapp, dbsession):
    _, cookie = authenticated_cookie(testapp, dbsession)
    res = testapp.post_json('/kategori', {'nama': 'Kategori Baru'}, headers={'Cookie': cookie}, status=200)
    assert 'id' in res.json
    assert res.json['message'] == 'Kategori berhasil ditambahkan'


def test_create_kategori_duplicate(testapp, dbsession):
    user, cookie = authenticated_cookie(testapp, dbsession)
    dbsession.add(Kategori(nama='Kategori Sama', user_id=user.id))
    dbsession.flush()
    res = testapp.post_json('/kategori', {'nama': 'Kategori Sama'}, headers={'Cookie': cookie}, status=400)
    assert 'sudah ada' in res.json['error'].lower()


def test_get_kategori_list(testapp, dbsession):
    user, cookie = authenticated_cookie(testapp, dbsession)
    dbsession.add(Kategori(nama='Kategori A', user_id=user.id))
    dbsession.add(Kategori(nama='Kategori B', user_id=user.id))
    dbsession.flush()
    res = testapp.get('/kategori', headers={'Cookie': cookie}, status=200)
    assert isinstance(res.json['data'], list)
    assert len(res.json['data']) >= 2


def test_get_kategori_detail(testapp, dbsession):
    user, cookie = authenticated_cookie(testapp, dbsession)
    kategori = Kategori(nama='Detail Kategori', user_id=user.id)
    dbsession.add(kategori)
    dbsession.flush()
    res = testapp.get(f'/kategori/{kategori.id}', headers={'Cookie': cookie}, status=200)
    assert res.json['id'] == kategori.id
    assert res.json['nama'] == kategori.nama


def test_update_kategori_success(testapp, dbsession):
    user, cookie = authenticated_cookie(testapp, dbsession)
    kategori = Kategori(nama='Lama', user_id=user.id)
    dbsession.add(kategori)
    dbsession.flush()
    res = testapp.put_json(f'/kategori/{kategori.id}', {'nama': 'Baru'}, headers={'Cookie': cookie}, status=200)
    assert 'berhasil diperbarui' in res.json['message'].lower()


def test_update_kategori_duplicate_name(testapp, dbsession):
    user, cookie = authenticated_cookie(testapp, dbsession)
    kategori1 = Kategori(nama='Kategori1', user_id=user.id)
    kategori2 = Kategori(nama='Kategori2', user_id=user.id)
    dbsession.add_all([kategori1, kategori2])
    dbsession.flush()
    res = testapp.put_json(f'/kategori/{kategori2.id}', {'nama': 'Kategori1'}, headers={'Cookie': cookie}, status=400)
    assert 'sudah digunakan' in res.json['error'].lower()


def test_delete_kategori_success(testapp, dbsession):
    user, cookie = authenticated_cookie(testapp, dbsession)
    kategori = Kategori(nama='Kategori Hapus', user_id=user.id)
    dbsession.add(kategori)
    dbsession.flush()
    res = testapp.delete(f'/kategori/{kategori.id}', headers={'Cookie': cookie}, status=200)
    assert 'berhasil dihapus' in res.json['message'].lower()


def test_delete_kategori_with_produk(testapp, dbsession):
    from backend.models.produk import Produk

    user, cookie = authenticated_cookie(testapp, dbsession)
    kategori = Kategori(nama='Kategori Terpakai', user_id=user.id)
    dbsession.add(kategori)
    dbsession.flush()
    produk = Produk(nama='Produk Terkait', stok=10, harga=5000, kategori_id=kategori.id, user_id=user.id)
    dbsession.add(produk)
    dbsession.flush()

    res = testapp.delete(f'/kategori/{kategori.id}', headers={'Cookie': cookie}, status=400)
    assert 'tidak bisa dihapus' in res.json['error'].lower()
