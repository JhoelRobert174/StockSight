from pyramid.view import view_config
from pyramid.response import Response
from sqlalchemy.exc import DBAPIError
from backend.models.produk import Produk
from backend.models.kategori import Kategori
from backend.models.harga_produk import HargaProduk
from backend.utils import log_aksi
from sqlalchemy.orm import joinedload, subqueryload
from sqlalchemy import func
from ..utils import apply_pagination


def get_user_id_or_unauthorized(request):
    user_id = request.session.get('user_id')
    if not user_id:
        raise PermissionError("Unauthorized")
    return user_id

@view_config(route_name='produk_by_kategori', renderer='json', request_method='GET')
def produk_by_kategori(request):
    session = request.dbsession
    try:
        user_id = get_user_id_or_unauthorized(request)
    except PermissionError as e:
        return Response(json_body={'error': str(e)}, status=401)

    try:
        kategori_id = int(request.matchdict['kategori_id'])
        kategori = session.query(Kategori).filter_by(id=kategori_id, user_id=user_id).first()
        if not kategori:
            return Response(json_body={'error': 'Kategori tidak ditemukan'}, status=404)

        sort_by = request.GET.get('sort_by', 'id').strip().lower()
        order = request.GET.get('order', 'asc').strip().lower()
        keyword = request.GET.get('q', '').strip().lower()

        page = int(request.GET.get('page', 1))
        limit = int(request.GET.get('limit', 10))
        assert page > 0 and limit > 0

        valid_fields = {
            'id': Produk.id,
            'nama': Produk.nama,
            'stok': Produk.stok,
            'harga': Produk.harga,
            'created_at': Produk.created_at,
        }

        if sort_by not in valid_fields:
            return Response(json_body={'error': f'Field sort_by tidak valid: {sort_by}'}, status=400)

        sort_column = valid_fields[sort_by]
        if order == 'desc':
            sort_column = sort_column.desc()
        elif order != 'asc':
            return Response(json_body={'error': f'Order tidak valid: {order}'}, status=400)

        query = session.query(Produk).filter(Produk.kategori_id == kategori_id).order_by(sort_column)
        if keyword:
            query = query.filter(Produk.nama.ilike(f"%{keyword}%"))

        produk_list, total = apply_pagination(query, page, limit)

        return {
            'data': [{
                'id': produk.id,
                'nama': produk.nama,
                'stok': produk.stok,
                'harga': float(produk.harga),
                'kategori_id': produk.kategori_id,
                'created_at': produk.created_at.isoformat()
            } for produk in produk_list],
            'meta': {
                'page': page,
                'limit': limit,
                'total': total,
                'pages': (total + limit - 1) // limit
            }
        }

    except ValueError:
        return Response(json_body={'error': 'ID kategori atau pagination tidak valid'}, status=400)
    except DBAPIError:
        return Response(json_body={'error': 'Database error'}, status=500)

@view_config(route_name='produk_mutasi', renderer='json', request_method='POST')
def mutasi_stok(request):
    session = request.dbsession
    try:
        user_id = get_user_id_or_unauthorized(request)
    except PermissionError as e:
        return Response(json_body={'error': str(e)}, status=401)

    produk_id = int(request.matchdict['id'])
    produk = session.get(Produk, produk_id)
    if not produk or produk.user_id != user_id:
        return Response(json_body={'error': 'Produk tidak ditemukan'}, status=404)

    data = request.json_body
    aksi = data.get('aksi', '').strip().lower()
    jumlah = data.get('jumlah')

    if aksi not in ['masuk', 'keluar']:
        return Response(json_body={'error': 'Aksi harus "masuk" atau "keluar"'}, status=400)
    if not isinstance(jumlah, int) or jumlah <= 0:
        return Response(json_body={'error': 'Jumlah harus bilangan bulat positif'}, status=400)

    if aksi == 'keluar':
        if produk.stok < jumlah:
            return Response(json_body={'error': 'Stok tidak mencukupi'}, status=400)
        produk.stok -= jumlah
        msg = 'Stok berhasil dikurangi'
    else:
        produk.stok += jumlah
        msg = 'Stok berhasil ditambah'

    return {'message': msg, 'produk_id': produk.id, 'stok_sisa': produk.stok}

@view_config(route_name='produk_list', renderer='json', request_method='GET')
def get_all_produk(request):
    try:
        user_id = get_user_id_or_unauthorized(request)
    except PermissionError as e:
        return Response(json_body={'error': str(e)}, status=401)

    session = request.dbsession
    keyword = request.GET.get('q', '').strip().lower()

    try:
        page = int(request.GET.get('page', 1))
        limit = int(request.GET.get('limit', 10))
        assert page > 0 and limit > 0
    except (ValueError, AssertionError):
        return Response(json_body={'error': 'Parameter page dan limit harus bilangan bulat positif'}, status=400)

    query = session.query(Produk).options(
        joinedload(Produk.kategori),
        subqueryload(Produk.harga_histories)
    ).filter(Produk.user_id == user_id)

    if keyword:
        query = query.filter(func.lower(Produk.nama).ilike(f"%{keyword}%"))

    produk_list, total = apply_pagination(query, page, limit)

    return {
        'data': [{
            'id': p.id,
            'nama': p.nama,
            'stok': p.stok,
            'harga': float(p.harga),
            'kategori': p.kategori.nama if p.kategori else None,
            'created_at': p.created_at.isoformat(),
            'hargaHistory': [{'waktu': h.tanggal.isoformat(), 'harga': h.harga} for h in p.harga_histories]
        } for p in produk_list],
        'meta': {'page': page, 'limit': limit, 'total': total, 'pages': (total + limit - 1) // limit}
    }


@view_config(route_name='produk_list', renderer='json', request_method='POST')
def create_produk(request):
    session = request.dbsession
    try:
        user_id = get_user_id_or_unauthorized(request)
    except PermissionError as e:
        return Response(json_body={'error': str(e)}, status=401)

    data = request.json_body
    nama = str(data.get('nama', '')).strip()
    nama_lower = nama.lower()

    if not nama:
        return Response(json_body={'error': 'Nama produk tidak boleh kosong'}, status=400)
    if not isinstance(data.get('harga'), (int, float)) or data['harga'] < 0:
        return Response(json_body={'error': 'Harga harus angka ≥ 0'}, status=400)

    stok = data.get('stok', 0)
    if not isinstance(stok, int) or stok < 0:
        return Response(json_body={'error': 'Stok harus bilangan bulat ≥ 0'}, status=400)

    kategori_id = data.get('kategori_id')
    if not isinstance(kategori_id, int):
        return Response(json_body={'error': 'kategori_id harus integer'}, status=400)

    kategori = session.query(Kategori).filter_by(id=kategori_id, user_id=user_id).first()
    if not kategori:
        return Response(json_body={'error': 'Kategori tidak ditemukan'}, status=400)

    existing = session.query(Produk).filter(
        func.lower(Produk.nama) == nama_lower,
        Produk.user_id == user_id
    ).first()
    if existing:
        return Response(json_body={'error': 'Produk dengan nama ini sudah ada'}, status=400)

    produk = Produk(
        nama=nama,
        harga=float(data['harga']),
        stok=stok,
        kategori_id=kategori.id,
        user_id=user_id
    )
    session.add(produk)
    session.flush()
    session.add(HargaProduk(produk_id=produk.id, harga=produk.harga))

    log_aksi(session, f"Menambahkan Produk: {produk.nama}", user_id)
    return {'message': 'Produk berhasil ditambahkan', 'id': produk.id}


@view_config(route_name='produk_detail', renderer='json', request_method='GET')
def get_produk_detail(request):
    session = request.dbsession
    try:
        user_id = get_user_id_or_unauthorized(request)
    except PermissionError as e:
        return Response(json_body={'error': str(e)}, status=401)

    produk_id = int(request.matchdict['id'])
    produk = session.get(Produk, produk_id)
    if not produk or produk.user_id != user_id:
        return Response(json_body={'error': 'Produk tidak ditemukan'}, status=404)

    return {
        'id': produk.id,
        'nama': produk.nama,
        'stok': produk.stok,
        'harga': float(produk.harga),
        'kategori': produk.kategori.nama,
        'created_at': produk.created_at.isoformat()
    }

@view_config(route_name='produk_detail', renderer='json', request_method='PUT')
def update_produk(request):
    session = request.dbsession
    try:
        user_id = get_user_id_or_unauthorized(request)
    except PermissionError as e:
        return Response(json_body={'error': str(e)}, status=401)

    produk_id = int(request.matchdict['id'])
    produk = session.get(Produk, produk_id)
    if not produk or produk.user_id != user_id:
        return Response(json_body={'error': 'Produk tidak ditemukan'}, status=404)

    data = request.json_body

    if 'nama' in data:
        nama = str(data['nama']).strip()
        if not nama:
            return Response(json_body={'error': 'Nama tidak boleh kosong'}, status=400)
        existing = session.query(Produk).filter(
            func.lower(Produk.nama) == nama.lower(),
            Produk.id != produk.id,
            Produk.user_id == user_id
        ).first()
        if existing:
            return Response(json_body={'error': 'Nama produk sudah digunakan'}, status=400)
        produk.nama = nama

    if 'harga' in data:
        harga = data['harga']
        if not isinstance(harga, (int, float)) or harga < 0:
            return Response(json_body={'error': 'Harga harus angka ≥ 0'}, status=400)
        if produk.harga != harga:
            produk.harga = harga
            session.add(HargaProduk(produk_id=produk.id, harga=harga))

    if 'stok' in data:
        stok = data['stok']
        if not isinstance(stok, int) or stok < 0:
            return Response(json_body={'error': 'Stok harus bilangan bulat ≥ 0'}, status=400)
        produk.stok = stok

    if 'kategori_id' in data:
        kategori = session.query(Kategori).filter_by(id=data['kategori_id'], user_id=user_id).first()
        if not kategori:
            return Response(json_body={'error': 'Kategori tidak ditemukan'}, status=400)
        produk.kategori_id = kategori.id

    log_aksi(session, f"Menghubah Produk: {produk.nama}", user_id)
    return {'message': 'Produk berhasil diperbarui'}

@view_config(route_name='produk_detail', renderer='json', request_method='DELETE')
def delete_produk(request):
    session = request.dbsession
    try:
        user_id = get_user_id_or_unauthorized(request)
    except PermissionError as e:
        return Response(json_body={'error': str(e)}, status=401)

    produk_id = int(request.matchdict['id'])
    produk = session.get(Produk, produk_id)
    if not produk or produk.user_id != user_id:
        return Response(json_body={'error': 'Produk tidak ditemukan'}, status=404)

    session.delete(produk)
    log_aksi(session, f"Menghapus Produk: {produk.nama}", user_id)
    return {'message': 'Produk berhasil dihapus'}


@view_config(route_name='produk_list', request_method='OPTIONS', renderer='json')
def produk_list_options(request):
    return Response(status=204)

@view_config(route_name='produk_detail', request_method='OPTIONS', renderer='json')
def produk_detail_options(request):
    return Response(status=204)

@view_config(route_name='produk_mutasi', request_method='OPTIONS', renderer='json')
def produk_mutasi_options(request):
    return Response(status=204)

@view_config(route_name='produk_by_kategori', request_method='OPTIONS', renderer='json')
def produk_by_kategori_options(request):
    return Response(status=204)
