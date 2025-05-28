from pyramid.view import view_config
from pyramid.response import Response
from backend.models.kategori import Kategori
from backend.models.produk import Produk
from backend.utils import log_aksi
from sqlalchemy import func

def get_user_id_or_unauthorized(request):
    user_id = request.session.get('user_id')
    if not user_id:
        raise PermissionError("Unauthorized")
    return user_id

@view_config(route_name='kategori_list', renderer='json', request_method='GET')
def get_all_kategori(request):
    session = request.dbsession
    try:
        user_id = get_user_id_or_unauthorized(request)
        page = int(request.GET.get('page', 1))
        limit = int(request.GET.get('limit', 10))
        assert page > 0 and limit > 0
    except (PermissionError, ValueError, AssertionError):
        return Response(json_body={'error': 'Parameter atau izin tidak valid'}, status=400)

    query = session.query(Kategori).filter_by(user_id=user_id).order_by(Kategori.nama.asc())
    total = query.count()
    items = query.offset((page - 1) * limit).limit(limit).all()

    return {
        'data': [{
            'id': k.id,
            'nama': k.nama,
            'created_at': k.created_at.isoformat()
        } for k in items],
        'meta': {
            'page': page,
            'limit': limit,
            'total': total,
            'pages': (total + limit - 1) // limit
        }
    }



@view_config(route_name='kategori_list', renderer='json', request_method='POST')
def create_kategori(request):
    session = request.dbsession
    try:
        user_id = get_user_id_or_unauthorized(request)
    except PermissionError:
        return Response(json_body={'error': 'Unauthorized'}, status=401)

    data = request.json_body
    nama = str(data.get('nama', '')).strip()

    if not nama:
        return Response(json_body={'error': 'Nama kategori tidak boleh kosong'}, status=400)

    existing = session.query(Kategori).filter(
        func.lower(Kategori.nama) == nama.lower(),
        Kategori.user_id == user_id
    ).first()
    if existing:
        return Response(json_body={'error': 'Kategori dengan nama ini sudah ada'}, status=400)

    kategori = Kategori(nama=nama, user_id=user_id)
    session.add(kategori)
    session.flush()

    log_aksi(session, f"Menambahkan Kategori: {kategori.nama}", user_id)
    return {'message': 'Kategori berhasil ditambahkan', 'id': kategori.id}

@view_config(route_name='kategori_detail', renderer='json', request_method='GET')
def get_kategori_detail(request):
    session = request.dbsession
    try:
        user_id = get_user_id_or_unauthorized(request)
        kategori_id = int(request.matchdict['id'])
    except (PermissionError, ValueError):
        return Response(json_body={'error': 'Tidak sah'}, status=400)

    kategori = session.query(Kategori).filter_by(id=kategori_id, user_id=user_id).first()
    if not kategori:
        return Response(json_body={'error': 'Kategori tidak ditemukan'}, status=404)

    return {
        'id': kategori.id,
        'nama': kategori.nama,
        'created_at': kategori.created_at.isoformat()
    }

@view_config(route_name='kategori_detail', renderer='json', request_method='PUT')
def update_kategori(request):
    session = request.dbsession
    try:
        user_id = get_user_id_or_unauthorized(request)
        kategori_id = int(request.matchdict['id'])
    except (PermissionError, ValueError):
        return Response(json_body={'error': 'Tidak sah'}, status=400)

    kategori = session.query(Kategori).filter_by(id=kategori_id, user_id=user_id).first()
    if not kategori:
        return Response(json_body={'error': 'Kategori tidak ditemukan'}, status=404)

    nama = str(request.json_body.get('nama', '')).strip()
    if not nama:
        return Response(json_body={'error': 'Nama tidak boleh kosong'}, status=400)

    existing = session.query(Kategori).filter(
        func.lower(Kategori.nama) == nama.lower(),
        Kategori.user_id == user_id,
        Kategori.id != kategori.id
    ).first()
    if existing:
        return Response(json_body={'error': 'Nama kategori sudah digunakan'}, status=400)

    kategori.nama = nama
    log_aksi(session, f"Menghubah Kategori: {kategori.nama}", user_id)
    return {'message': 'Kategori berhasil diperbarui'}

@view_config(route_name='kategori_detail', renderer='json', request_method='DELETE')
def delete_kategori(request):
    session = request.dbsession
    try:
        user_id = get_user_id_or_unauthorized(request)
        kategori_id = int(request.matchdict['id'])
    except (PermissionError, ValueError):
        return Response(json_body={'error': 'Tidak sah'}, status=400)

    kategori = session.query(Kategori).filter_by(id=kategori_id, user_id=user_id).first()
    if not kategori:
        return Response(json_body={'error': 'Kategori tidak ditemukan'}, status=404)

    produk_terkait = session.query(Produk).filter_by(kategori_id=kategori.id).first()
    if produk_terkait:
        return Response(json_body={'error': 'Kategori tidak bisa dihapus karena masih digunakan'}, status=400)

    session.delete(kategori)
    log_aksi(session, f"Menghapus Kategori: {kategori.nama}", user_id)
    return {'message': 'Kategori berhasil dihapus'}

@view_config(route_name='kategori_detail', request_method='OPTIONS', renderer='json')
def kategori_detail_options(request):
    return Response(status=204)

@view_config(route_name='kategori_list', request_method='OPTIONS', renderer='json')
def kategori_list_options(request):
    return Response(status=204)
