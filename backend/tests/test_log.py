import pytest
from backend.models.user import User
from backend.views.auth import hash_password
from backend.models.log_aktivitas import LogAktivitas
from datetime import datetime, timedelta

def setup_user_with_login(testapp, dbsession):
    user = User(
        email='loguser@example.com',
        username='loguser',
        password_hash=hash_password('logpass')
    )
    dbsession.add(user)
    dbsession.flush()

    res_login = testapp.post_json('/login', {
        'username': 'loguser',
        'password': 'logpass'
    }, status=200)
    cookie = res_login.headers['Set-Cookie']
    return user.id, cookie


def test_get_logs_success(testapp, dbsession):
    user_id, cookie = setup_user_with_login(testapp, dbsession)

    # Tambah dummy log
    now = datetime.utcnow()
    logs = [
        LogAktivitas(user_id=user_id, aksi='Login', waktu=now - timedelta(minutes=1)),
        LogAktivitas(user_id=user_id, aksi='Lihat Produk', waktu=now - timedelta(minutes=2)),
        LogAktivitas(user_id=user_id, aksi='Tambah Produk', waktu=now - timedelta(minutes=3)),
    ]
    dbsession.add_all(logs)
    dbsession.flush()

    res = testapp.get('/log-aktivitas?page=1&limit=2', headers={'Cookie': cookie}, status=200)
    data = res.json
    assert data['page'] == 1
    assert data['limit'] == 2
    assert data['total'] == 3
    assert len(data['data']) == 2
    assert all('waktu' in log and 'aksi' in log for log in data['data'])


def test_get_logs_invalid_pagination(testapp, dbsession):
    _, cookie = setup_user_with_login(testapp, dbsession)
    res = testapp.get('/log-aktivitas?page=satu&limit=abc', headers={'Cookie': cookie}, status=400)
    assert 'tidak valid' in res.json['error'].lower()


def test_get_logs_unauthenticated(testapp):
    res = testapp.get('/log-aktivitas', status=401)
    assert 'unauthorized' in res.json['error'].lower()
