import pytest
from backend.models.user import User
from backend.views.auth import hash_password

def register(testapp, payload, status=200):
    """Helper function to register a user with the given payload."""
    return testapp.post_json('/register', payload, status=status)

def login(testapp, payload, status=200):
    """Helper function to login a user with the given payload."""
    return testapp.post_json('/login', payload, status=status)

def authenticated_cookie(testapp, dbsession):
    """Helper function to create an authenticated user and return the session cookie."""
    from backend.models.user import User
    from backend.views.auth import hash_password

    user = User(
        username='logged',
        email='logged@example.com',
        password_hash=hash_password('supersecret'),
        store_name='MyStore'
    )
    dbsession.add(user)
    dbsession.flush()

    login_response = login(testapp, {
        'username': 'logged',
        'password': 'supersecret'
    })

    cookie = login_response.headers['Set-Cookie'].split(';')[0]
    return user, cookie

@pytest.mark.auth
@pytest.mark.api
def test_register_user_success(testapp):
    """Test successful user registration with valid data."""
    res = testapp.post_json('/register', {
        'email': 'test@example.com',
        'username': 'testuser',
        'password': 'password123'
    }, status=200)
    data = res.json
    assert data['message'] == 'Registrasi berhasil', "Registration should return success message"
    assert 'id' in data, "Registration response should include user ID"

@pytest.mark.auth
@pytest.mark.api
def test_register_user_duplicate(testapp, dbsession):
    """Test that registration fails when using a duplicate username."""
    user = User(
        email='test@example.com',
        username='testuser',
        password_hash=hash_password('password123')
    )
    dbsession.add(user)
    dbsession.flush()
    res = testapp.post_json('/register', {
        'email': 'test@example.com',
        'username': 'testuser',
        'password': 'anotherpass'
    }, status=400)
    assert 'Username sudah digunakan' in res.json['error']

@pytest.mark.auth
@pytest.mark.api
def test_login_user_success(testapp, dbsession):
    """Test successful user login with valid credentials."""
    user = User(
        email='login@example.com',
        username='loginuser',
        password_hash=hash_password('pass123')
    )
    dbsession.add(user)
    dbsession.flush()
    res = testapp.post_json('/login', {
        'username': 'loginuser',
        'password': 'pass123'
    }, status=200)
    assert res.json['message'] == 'Login berhasil'

@pytest.mark.auth
@pytest.mark.api
def test_login_user_failure(testapp):
    """Test that login fails with invalid credentials."""
    res = testapp.post_json('/login', {
        'username': 'nouser',
        'password': 'wrongpass'
    }, status=401)
    assert 'Username atau password salah' in res.json['error']

@pytest.mark.auth
@pytest.mark.api
def test_register_success(testapp):
    """Test successful registration with valid data using helper function."""
    res = register(testapp, {
        'username': 'user1',
        'password': 'securepass',
        'email': 'user1@example.com'
    })
    assert res.json['message'] == 'Registrasi berhasil'


@pytest.mark.auth
@pytest.mark.api
def test_register_errors(testapp, dbsession):
    """Test various registration error cases (duplicate username, invalid email, etc.)."""
    user = User(username='taken', email='email@taken.com', password_hash='hash')
    dbsession.add(user)
    dbsession.flush()

    res = register(testapp, {
        'username': 'taken',
        'password': 'securepass',
        'email': 'unique@email.com'
    }, status=400)
    assert 'Username sudah digunakan' in res.json['error']

    res = register(testapp, {
        'username': 'uniqueuser',
        'password': 'securepass',
        'email': 'email@taken.com'
    }, status=400)
    assert 'Email sudah digunakan' in res.json['error']

    res = register(testapp, {
        'username': 'user',
        'password': 'password',
        'email': 'notanemail'
    }, status=400)
    assert 'Format email tidak valid' in res.json['error']

    res = register(testapp, {
        'username': 'same',
        'password': 'same',
        'email': 'same@x.com'
    }, status=400)
    assert 'Password tidak boleh sama dengan username' in res.json['error']


@pytest.mark.auth
@pytest.mark.api
def test_login_success(testapp, dbsession):
    """Test successful login with valid credentials using helper function."""
    dbsession.add(User(username='valid', email='valid@x.com', password_hash=hash_password('mypassword')))
    dbsession.flush()
    res = login(testapp, {'username': 'valid', 'password': 'mypassword'})
    assert res.json['message'] == 'Login berhasil'


@pytest.mark.auth
@pytest.mark.api
def test_login_failure(testapp):
    """Test that login fails with non-existent user."""
    res = login(testapp, {'username': 'ghost', 'password': 'nope'}, status=401)
    assert 'Username atau password salah' in res.json['error']


@pytest.mark.auth
@pytest.mark.api
def test_me_success(testapp, dbsession):
    """Test successful retrieval of authenticated user's profile."""
    user, cookie = authenticated_cookie(testapp, dbsession)
    res = testapp.get('/me', headers={'Cookie': cookie}, status=200)
    assert res.json['username'] == 'logged'
    assert 'created_at' in res.json


@pytest.mark.auth
@pytest.mark.api
def test_me_unauthenticated(testapp):
    """Test that unauthenticated users cannot access profile endpoint."""
    res = testapp.get('/me', status=401)
    assert 'Belum login' in res.json['error']


@pytest.mark.auth
@pytest.mark.api
def test_update_store_name(testapp, dbsession):
    """Test successful update of user's store name."""
    user, cookie = authenticated_cookie(testapp, dbsession)
    res = testapp.put_json('/me/store-name', {
        'store_name': 'StockBlast'
    }, headers={'Cookie': cookie}, status=200)
    assert res.json['message'] == 'Nama toko diperbarui'


@pytest.mark.auth
@pytest.mark.api
def test_update_store_name_invalid(testapp, dbsession):
    """Test that store name update fails with invalid data."""
    user, cookie = authenticated_cookie(testapp, dbsession)
    res = testapp.put_json('/me/store-name', {
        'store_name': ''
    }, headers={'Cookie': cookie}, status=400)
    assert 'Nama toko tidak boleh kosong' in res.json['error']


@pytest.mark.auth
@pytest.mark.api
def test_verify_identity(testapp, dbsession):
    """Test successful identity verification with valid credentials."""
    dbsession.add(User(username='veri', email='v@x.com', password_hash='x'))
    dbsession.flush()
    res = testapp.post_json('/verify-identity', {
        'username': 'veri',
        'email': 'v@x.com'
    }, status=200)
    assert res.json['status'] == 'ok'


@pytest.mark.auth
@pytest.mark.api
def test_verify_identity_fail(testapp):
    """Test that identity verification fails with invalid credentials."""
    res = testapp.post_json('/verify-identity', {
        'username': 'ghost',
        'email': 'none@x.com'
    }, status=404)
    assert 'tidak cocok' in res.json['error']


@pytest.mark.auth
@pytest.mark.api
def test_reset_password_success(testapp, dbsession):
    """Test successful password reset with valid credentials."""
    dbsession.add(User(username='resetme', email='reset@x.com', password_hash='old'))
    dbsession.flush()
    res = testapp.post_json('/reset-password', {
        'username': 'resetme',
        'email': 'reset@x.com',
        'new_password': 'newsecure'
    }, status=200)
    assert 'Password berhasil direset' in res.json['message']


@pytest.mark.auth
@pytest.mark.api
def test_reset_password_fail(testapp):
    """Test that password reset fails with invalid credentials."""
    res = testapp.post_json('/reset-password', {
        'username': 'ghost',
        'new_password': 'validpass'
    }, status=404)
    assert 'User tidak ditemukan' in res.json['error']



@pytest.mark.auth
@pytest.mark.api
def test_delete_account(testapp, dbsession):
    """Test successful account deletion for authenticated user."""
    user, cookie = authenticated_cookie(testapp, dbsession)
    res = testapp.delete('/me/delete-account', headers={'Cookie': cookie}, status=200)
    assert 'Akun berhasil dihapus' in res.json['message']


def test_delete_account_fail(testapp):
    res = testapp.delete('/me/delete-account', status=401)
    assert 'Belum login' in res.json['error']


def test_logout(testapp, dbsession):
    _, cookie = authenticated_cookie(testapp, dbsession)
    res = testapp.post_json('/logout', headers={'Cookie': cookie}, status=200)
    assert res.json['message'] == 'Logout berhasil'