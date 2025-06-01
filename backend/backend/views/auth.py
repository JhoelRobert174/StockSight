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

@view_config(route_name='update_store_name', request_method='OPTIONS', renderer='json')
def update_store_name_options_handler(request):
    return Response(status=204)

@view_config(route_name='delete_account', renderer='json', request_method='DELETE')
def delete_account(request):
    session = request.dbsession
    user_id = request.session.get('user_id')

    if not user_id:
        return Response(json_body={'error': 'Belum login'}, status=401)

    user = session.get(User, user_id)
    if not user:
        return Response(json_body={'error': 'User tidak ditemukan'}, status=404)

    session.delete(user)
    session.flush()
    
    request.session.invalidate()

    return {'message': 'Akun berhasil dihapus'}

@view_config(route_name='delete_account_options', renderer='json')
def delete_account_options(request):
    return Response(status=204)

@view_config(route_name='register', renderer='json', request_method='POST')
def register_user(request):
    session = request.dbsession
    data = request.json_body

    username = data.get('username', '').strip().lower()
    password = data.get('password', '').strip()
    email = data.get('email', '').strip().lower()

    # Validasi dasar
    if username == password:
        return Response(json_body={'error': 'Password tidak boleh sama dengan username'}, status=400)

    if not all(isinstance(x, str) for x in [username, password, email]):
        return Response(json_body={'error': 'Semua input harus berupa string'}, status=400)

    if not username or not password or not email:
        return Response(json_body={'error': 'Semua field wajib diisi'}, status=400)

    if not re.match(r'^[a-z0-9_]+$', username):
        return Response(json_body={'error': 'Username hanya boleh huruf kecil, angka, dan underscore'}, status=400)

    if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w{2,}$', email):
        return Response(json_body={'error': 'Format email tidak valid'}, status=400)

    if len(username) < 3 or len(username) > 32:
        return Response(json_body={'error': 'Username harus 3–32 karakter'}, status=400)

    if len(password) < 6:
        return Response(json_body={'error': 'Password minimal 6 karakter'}, status=400)

    if session.query(User).filter(func.lower(User.username) == username).first():
        return Response(json_body={'error': 'Username sudah digunakan'}, status=400)

    if session.query(User).filter(func.lower(User.email) == email).first():
        return Response(json_body={'error': 'Email sudah digunakan'}, status=400)

    user = User(username=username, email=email, password_hash=hash_password(password))
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
        'store_name': user.store_name,
        'created_at': user.created_at.isoformat()
    }

@view_config(route_name='verify_identity', renderer='json', request_method='POST')
def verify_identity(request):
    session = request.dbsession
    data = request.json_body

    username = data.get('username', '').strip().lower()
    email = data.get('email', '').strip().lower()

    if not username or not email:
        return Response(json_body={'error': 'Username dan email wajib diisi'}, status=400)

    user = session.query(User).filter(
        func.lower(User.username) == username,
        func.lower(User.email) == email
    ).first()

    if not user:
        return Response(json_body={'error': 'Username dan email tidak cocok'}, status=404)

    return {'status': 'ok'}

@view_config(route_name='reset_password', renderer='json', request_method='POST')
def reset_password(request):
    session = request.dbsession
    data = request.json_body

    username = data.get('username', '').strip().lower()
    new_password = data.get('new_password', '').strip()

    if not username or not new_password:
        return Response(json_body={'error': 'Username dan password wajib diisi'}, status=400)

    if len(new_password) < 6:
        return Response(json_body={'error': 'Password minimal 6 karakter'}, status=400)

    if username == new_password:
        return Response(json_body={'error': 'Password tidak boleh sama dengan username'}, status=400)

    user = session.query(User).filter(func.lower(User.username) == username).first()
    if not user:
        return Response(json_body={'error': 'User tidak ditemukan'}, status=404)

    user.password_hash = hash_password(new_password)
    session.add(user)

    return {'message': 'Password berhasil direset'}

@view_config(route_name='update_store_name', renderer='json', request_method='PUT')
def update_store_name(request):
    session = request.dbsession
    user_id = request.session.get('user_id')

    if not user_id:
        return Response(json_body={'error': 'Belum login'}, status=401)

    user = session.get(User, user_id)
    if not user:
        return Response(json_body={'error': 'User tidak ditemukan'}, status=404)

    data = request.json_body
    store_name = data.get('store_name', '').strip()

    if not store_name:
        return Response(json_body={'error': 'Nama toko tidak boleh kosong'}, status=400)

    user.store_name = store_name
    session.add(user)

    session.flush()

    return {'message': 'Nama toko diperbarui'}

@view_config(route_name='logout', renderer='json', request_method='POST')
def logout_user(request):
    request.session.clear()
    request.session.invalidate()
    request.session._dirty = False

    response = Response(json_body={'message': 'Logout berhasil'})
    response.delete_cookie('session', path='/')
    return response
