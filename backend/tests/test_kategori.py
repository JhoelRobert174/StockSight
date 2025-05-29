from backend.models.user import User
from backend.views.auth import hash_password

def login_and_get_session(testapp, dbsession):
    user = User(username='katuser', password_hash=hash_password('katpass'))
    dbsession.add(user)
    dbsession.flush()
    res = testapp.post_json('/login', {
        'username': 'katuser',
        'password': 'katpass'
    }, status=200)
    return user.id

def test_create_kategori_success(testapp, dbsession):
    user_id = login_and_get_session(testapp, dbsession)
    res = testapp.post_json('/kategori', {'nama': 'Elektronik'}, status=200)
    assert res.json['message'] == 'Kategori berhasil ditambahkan'
    assert 'id' in res.json

def test_create_kategori_duplicate(testapp, dbsession):
    user_id = login_and_get_session(testapp, dbsession)
    testapp.post_json('/kategori', {'nama': 'Buku'}, status=200)
    res = testapp.post_json('/kategori', {'nama': 'Buku'}, status=400)
    assert 'Kategori dengan nama ini sudah ada' in res.json['error']

def test_get_all_kategori(testapp, dbsession):
    login_and_get_session(testapp, dbsession)
    res = testapp.get('/kategori?page=1&limit=10', status=200)
    assert isinstance(res.json['data'], list)
    assert 'meta' in res.json