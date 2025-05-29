from backend.models.user import User
from backend.views.auth import hash_password

def test_register_user_success(testapp):
    res = testapp.post_json('/register', {
        'username': 'testuser',
        'password': 'password123'
    }, status=200)
    print(res.json)
    data = res.json
    assert data['message'] == 'Registrasi berhasil'
    assert 'id' in data

def test_register_user_duplicate(testapp, dbsession):
    user = User(username='testuser', password_hash=hash_password('password123'))
    dbsession.add(user)
    dbsession.flush()
    res = testapp.post_json('/register', {
        'username': 'testuser',
        'password': 'anotherpass'
    }, status=400)
    assert 'Username sudah digunakan' in res.json['error']

def test_login_user_success(testapp, dbsession):
    user = User(username='loginuser', password_hash=hash_password('pass123'))
    dbsession.add(user)
    dbsession.flush()
    res = testapp.post_json('/login', {
        'username': 'loginuser',
        'password': 'pass123'
    }, status=200)
    assert res.json['message'] == 'Login berhasil'

def test_login_user_failure(testapp):
    res = testapp.post_json('/login', {
        'username': 'nouser',
        'password': 'wrongpass'
    }, status=401)
    assert 'Username atau password salah' in res.json['error']