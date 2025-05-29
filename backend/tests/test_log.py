from backend.models.user import User
from backend.views.auth import hash_password

def setup_user_with_login(testapp, dbsession):
    user = User(username='loguser', password_hash=hash_password('logpass'))
    dbsession.add(user)
    dbsession.flush()
    testapp.post_json('/login', {'username': 'loguser', 'password': 'logpass'}, status=200)
    return user.id

def test_get_logs_empty(testapp, dbsession):
    setup_user_with_login(testapp, dbsession)
    res = testapp.get('/log-aktivitas?page=1&limit=10', status=200)
    assert res.json['data'] == []
    assert res.json['page'] == 1