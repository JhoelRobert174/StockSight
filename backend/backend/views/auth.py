from pyramid.view import view_config
from pyramid.response import Response
from backend.models.user import User
from passlib.hash import bcrypt

def hash_password(password):
    return bcrypt.hash(password)

def verify_password(password, hashed):
    try:
        return bcrypt.verify(password, hashed)
    except ValueError:
        return False

@view_config(route_name='register', renderer='json', request_method='POST')
def register_user(request):
    session = request.dbsession
    data = request.json_body

    username = data.get('username')
    password = data.get('password')

    if not isinstance(username, str) or not isinstance(password, str):
        return Response(json_body={'error': 'Username dan password harus berupa string'}, status=400)

    username = username.strip()
    password = password.strip()

    if not username or not password:
        return Response(json_body={'error': 'Username dan password wajib diisi'}, status=400)

    existing = session.query(User).filter_by(username=username).first()
    if existing:
        return Response(json_body={'error': 'Username sudah digunakan'}, status=400)

    user = User(username=username, password_hash=hash_password(password))
    session.add(user)
    session.flush()

    return {'message': 'Registrasi berhasil', 'id': user.id}

@view_config(route_name='login', renderer='json', request_method='POST')
def login_user(request):
    session = request.dbsession
    data = request.json_body

    username = data.get('username')
    password = data.get('password')

    if not isinstance(username, str) or not isinstance(password, str):
        return Response(json_body={'error': 'Username dan password harus berupa string'}, status=400)

    username = username.strip()
    password = password.strip()

    user = session.query(User).filter_by(username=username).first()
    if not user or not verify_password(password, user.password_hash):
        return Response(json_body={'error': 'Username atau password salah'}, status=401)

    return {'message': 'Login berhasil', 'user_id': user.id}
