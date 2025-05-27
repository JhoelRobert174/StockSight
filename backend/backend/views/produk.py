from pyramid.view import view_config
from pyramid.response import Response
from sqlalchemy.exc import DBAPIError
from backend.models.produk import Produk
from backend.models.kategori import Kategori
from ..utils import apply_pagination
from backend.models.harga_produk import HargaProduk
from backend.utils import log_aksi  # atau sesuai path filenya

@view_config(route_name='produk_by_kategori', renderer='json', request_method='GET')
def produk_by_kategori(request):
    session = request.dbsession
    try:
        kategori_id = int(request.matchdict['kategori_id'])
        kategori = session.get(Kategori, kategori_id)
        if not kategori:
            return Response(json_body={'error': 'Kategori tidak ditemukan'}, status=404)

        # Ambil parameter
        sort_by = request.GET.get('sort_by', 'id').strip().lower()
        order = request.GET.get('order', 'asc').strip().lower()
        keyword = request.GET.get('q', '').strip().lower()

        try:
            page = int(request.GET.get('page', 1))
            limit = int(request.GET.get('limit', 10))
            assert page > 0 and limit > 0
        except (ValueError, AssertionError):
            return Response(json_body={'error': 'Parameter page dan limit harus bilangan bulat positif'}, status=400)

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
        return Response(json_body={'error': 'ID kategori tidak valid'}, status=400)
    except DBAPIError:
        return Response(json_body={'error': 'Database error'}, status=500)


@view_config(route_name='produk_mutasi', renderer='json', request_method='POST')
def mutasi_stok(request):
    session = request.dbsession
    produk_id = int(request.matchdict['id'])
    produk = session.get(Produk, produk_id)

    if not produk:
        return Response(json_body={'error': 'Produk tidak ditemukan'}, status=404)

    data = request.json_body
    aksi = data.get('aksi', '').strip().lower()
    jumlah = data.get('jumlah')

    if aksi not in ['masuk', 'keluar']:
        return Response(json_body={'error': 'Aksi harus berupa "masuk" atau "keluar"'}, status=400)

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

    return {
        'message': msg,
        'produk_id': produk.id,
        'stok_sisa': produk.stok
    }

@view_config(route_name='produk_list', renderer='json', request_method='GET')
def get_all_produk(request):
    session = request.dbsession

    # Ambil query param
    keyword = request.GET.get('q', '').strip().lower()
    try:
        page = int(request.GET.get('page', 1))
        limit = int(request.GET.get('limit', 10))
        assert page > 0 and limit > 0
    except (ValueError, AssertionError):
        return Response(json_body={'error': 'Parameter page dan limit harus bilangan bulat positif'}, status=400)

    query = session.query(Produk)
    if keyword:
        query = query.filter(Produk.nama.ilike(f"%{keyword}%"))

    produk_list, total = apply_pagination(query, page, limit)

    return {
        'data': [{
            'id': p.id,
            'nama': p.nama,
            'stok': p.stok,
            'harga': float(p.harga),
            'kategori': p.kategori.nama if p.kategori else None,
            'created_at': p.created_at.isoformat(),  # ← KOMA DI SINI WAJIB
            'hargaHistory': [
                {'waktu': h.tanggal.isoformat(), 'harga': h.harga}
                for h in p.harga_histories
            ]
        } for p in produk_list],
        'meta': {
            'page': page,
            'limit': limit,
            'total': total,
            'pages': (total + limit - 1) // limit
        }
    }



@view_config(route_name='produk_list', renderer='json', request_method='POST')
def create_produk(request):
    session = request.dbsession
    data = request.json_body

    allowed_fields = {'nama', 'harga', 'stok', 'kategori_id'}
    unknown_fields = set(data.keys()) - allowed_fields
    if unknown_fields:
        return Response(json_body={'error': f'Terdapat field tidak dikenali: {", ".join(unknown_fields)}'}, status=400)

    required_fields = ['nama', 'harga', 'kategori_id']
    for field in required_fields:
        if field not in data:
            return Response(json_body={'error': f'Field {field} wajib diisi'}, status=400)

    nama = str(data['nama']).strip()
    if not nama:
        return Response(json_body={'error': 'Nama produk tidak boleh kosong'}, status=400)

    if not isinstance(data['harga'], (int, float)) or data['harga'] < 0:
        return Response(json_body={'error': 'Harga harus berupa angka ≥ 0'}, status=400)

    stok = data.get('stok', 0)
    if not isinstance(stok, int) or stok < 0:
        return Response(json_body={'error': 'Stok harus berupa bilangan bulat ≥ 0'}, status=400)

    kategori_id = data['kategori_id']
    if not isinstance(kategori_id, int):
        return Response(json_body={'error': 'kategori_id harus berupa integer'}, status=400)

    kategori = session.get(Kategori, kategori_id)
    if not kategori:
        return Response(json_body={'error': 'Kategori tidak ditemukan'}, status=400)

    existing = session.query(Produk).filter_by(nama=nama).first()
    if existing:
        return Response(json_body={'error': 'Produk dengan nama ini sudah ada'}, status=400)

    produk = Produk(
        nama=nama,
        harga=float(data['harga']),
        stok=stok,
        kategori_id=kategori.id
    )
    session.add(produk)
    session.flush()
    session.add(HargaProduk(produk_id=produk.id, harga=produk.harga))

    # ⬇ Tambahkan ini
    log_aksi(session, f"Menambahkan Produk: {produk.nama}")

    return {'message': 'Produk berhasil ditambahkan', 'id': produk.id}


@view_config(route_name='produk_detail', renderer='json', request_method='GET')
def get_produk_detail(request):
    session = request.dbsession
    produk_id = int(request.matchdict['id'])
    produk = session.get(Produk, produk_id)
    if not produk:
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
    produk_id = int(request.matchdict['id'])
    produk = session.get(Produk, produk_id)
    if not produk:
        return Response(json_body={'error': 'Produk tidak ditemukan'}, status=404)

    data = request.json_body

    if 'nama' in data:
        nama = str(data['nama']).strip()
        if not nama:
            return Response(json_body={'error': 'Nama tidak boleh kosong'}, status=400)

        existing = session.query(Produk).filter(Produk.nama == nama, Produk.id != produk.id).first()
        if existing:
            return Response(json_body={'error': 'Nama produk sudah digunakan'}, status=400)

        produk.nama = nama


    if 'harga' in data:
        if not isinstance(data['harga'], (int, float)) or data['harga'] < 0:
            return Response(json_body={'error': 'Harga harus berupa angka ≥ 0'}, status=400)
    
        new_harga = float(data['harga'])
        if produk.harga != new_harga:
            produk.harga = new_harga
            session.add(HargaProduk(produk_id=produk.id, harga=new_harga))


    if 'stok' in data:
        if not isinstance(data['stok'], int) or data['stok'] < 0:
            return Response(json_body={'error': 'Stok harus berupa bilangan bulat ≥ 0'}, status=400)
        produk.stok = data['stok']

    if 'kategori_id' in data:
        kategori = session.query(Kategori).filter_by(id=data['kategori_id']).first()
        if not kategori:
            return Response(json_body={'error': 'Kategori tidak ditemukan'}, status=400)
        produk.kategori_id = kategori.id
   
    log_aksi(session, f"Mengubah Produk: {produk.nama}")

    return {'message': 'Produk berhasil diperbarui'}


@view_config(route_name='produk_detail', renderer='json', request_method='DELETE')
def delete_produk(request):
    session = request.dbsession
    produk_id = int(request.matchdict['id'])
    produk = session.get(Produk, produk_id)
    if not produk:
        return Response(json_body={'error': 'Produk tidak ditemukan'}, status=404)

    session.delete(produk)

    log_aksi(session, f"Menghapus Produk: {produk.nama}")
    
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
