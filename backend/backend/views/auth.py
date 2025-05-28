from pyramid.view import view_config
from pyramid.response import Response
from backend.models.user import User
from passlib.hash import bcrypt
from datetime import datetime, timedelta
from sqlalchemy import func
import re

def hash_password(password):
    return bcrypt.hash(password)

def verify_password(password, hashed):
    try:
        return bcrypt.verify(password, hashed)
    except ValueError:
        return False
    
@view_config(route_name='register', request_method='OPTIONS', renderer='json')
def register_options_handler(request):
    return Response(status=204)

@view_config(route_name='login', request_method='OPTIONS', renderer='json')
def login_options_handler(request):
    return Response(status=204)

@view_config(route_name='logout', request_method='OPTIONS', renderer='json')
def logout_options_handler(request):
    return Response(status=204)

@view_config(route_name='me', request_method='OPTIONS', renderer='json')
def me_options_handler(request):
    return Response(status=204)
    
@view_config(route_name='register', renderer='json', request_method='GET')
def register_dummy(request):
    return Response(json_body={'message': 'Gunakan POST untuk register'}, status=405)


@view_config(route_name='register', renderer='json', request_method='POST')
def register_user(request):
    session = request.dbsession
    data = request.json_body

    username = data.get('username')
    password = data.get('password')

    if not isinstance(username, str) or not isinstance(password, str):
        return Response(json_body={'error': 'Username dan password harus berupa string'}, status=400)

    username = username.strip().lower()
    password = password.strip()

    if not re.match(r'^[a-z0-9_]+$', username):
        return Response(json_body={'error': 'Username hanya boleh huruf kecil, angka, dan underscore'}, status=400)

    if not username or not password:
        return Response(json_body={'error': 'Username dan password wajib diisi'}, status=400)

    if len(username) < 3 or len(username) > 32:
        return Response(json_body={'error': 'Username harus 3–32 karakter'}, status=400)

    if len(password) < 6:
        return Response(json_body={'error': 'Password minimal 6 karakter'}, status=400)

    existing = session.query(User).filter(func.lower(User.username) == username).first()
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

    username = username.strip().lower()
    password = password.strip()

    user = session.query(User).filter(func.lower(User.username) == username).first()
    if not user or not verify_password(password, user.password_hash):
        return Response(json_body={'error': 'Username atau password salah'}, status=401)

    request.session['user_id'] = user.id
    request.session['expires_at'] = (datetime.utcnow() + timedelta(hours=1)).isoformat()

    return {'message': 'Login berhasil', 'user_id': user.id}

@view_config(route_name='me', renderer='json', request_method='GET')
def get_me(request):
    session = request.dbsession
    user_id = request.session.get('user_id')

    if not user_id:
        return Response(json_body={'error': 'Belum login'}, status=401)

    user = session.get(User, user_id)
    if not user:
        return Response(json_body={'error': 'User tidak ditemukan'}, status=404)

    return {
        'id': user.id,
        'username': user.username,
        'created_at': user.created_at.isoformat()
    }

@view_config(route_name='logout', renderer='json', request_method='POST')
def logout_user(request):
    request.session.clear()
    request.session.invalidate()
    request.session._dirty = False

    response = Response(json_body={'message': 'Logout berhasil'})
    response.delete_cookie('session', path='/')
    return response
