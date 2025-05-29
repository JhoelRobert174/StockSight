from backend.models.user import User
from backend.models.kategori import Kategori
from backend.views.auth import hash_password

def setup_produk_user_kategori(testapp, dbsession):
    user = User(username='produser', password_hash=hash_password('prodpass'))
    dbsession.add(user)
    dbsession.flush()
    testapp.post_json('/login', {'username': 'produser', 'password': 'prodpass'}, status=200)

    kategori = Kategori(nama='Kebutuhan', user_id=user.id)
    dbsession.add(kategori)
    dbsession.flush()
    return user.id, kategori.id

def test_create_produk_success(testapp, dbsession):
    user_id, kategori_id = setup_produk_user_kategori(testapp, dbsession)
    res = testapp.post_json('/produk', {
        'nama': 'Sabun',
        'harga': 5000,
        'stok': 10,
        'kategori_id': kategori_id
    }, status=200)
    assert res.json['message'] == 'Produk berhasil ditambahkan'
    assert 'id' in res.json

def test_get_produk_list(testapp, dbsession):
    user_id, kategori_id = setup_produk_user_kategori(testapp, dbsession)
    testapp.post_json('/produk', {
        'nama': 'Sapu',
        'harga': 7000,
        'stok': 5,
        'kategori_id': kategori_id
    }, status=200)
    res = testapp.get('/produk?page=1&limit=10', status=200)
    assert isinstance(res.json['data'], list)
    assert 'meta' in res.json