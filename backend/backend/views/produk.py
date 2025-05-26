from pyramid.view import view_config
from pyramid.response import Response
from sqlalchemy.exc import DBAPIError
from backend.models.produk import Produk
from backend.models.kategori import Kategori

@view_config(route_name='produk_by_kategori', renderer='json', request_method='GET')
def produk_by_kategori(request):
    session = request.dbsession

    try:
        kategori_id = int(request.matchdict['kategori_id'])
        kategori = session.get(Kategori, kategori_id)

        if not kategori:
            return Response(json_body={'error': 'Kategori tidak ditemukan'}, status=404)

        produk_list = session.query(Produk).filter(Produk.kategori_id == kategori_id).all()

        return [
            {
                'id': produk.id,
                'nama': produk.nama,
                'stok': produk.stok,
                'kategori_id': produk.kategori_id,
            } for produk in produk_list
        ]
    except DBAPIError as e:
        return Response(json_body={'error': 'Database error'}, status=500)
    except ValueError:
        return Response(json_body={'error': 'ID kategori tidak valid'}, status=400)

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
    produk_list = session.query(Produk).all()
    return [{
        'id': p.id,
        'nama': p.nama,
        'stok': p.stok,
        'harga': float(p.harga),
        'kategori': p.kategori.nama if p.kategori else None,
        'created_at': p.created_at.isoformat()
    } for p in produk_list]

@view_config(route_name='produk_list', renderer='json', request_method='POST')
def create_produk(request):
    data = request.json_body
    session = request.dbsession

    # Validasi input wajib
    required_fields = ['nama', 'harga', 'kategori_id']
    for field in required_fields:
        if field not in data or not str(data[field]).strip():
            return Response(json_body={'error': f'Field {field} wajib diisi'}, status=400)

    if not isinstance(data['harga'], (int, float)) or data['harga'] < 0:
        return Response(json_body={'error': 'Harga harus berupa angka ≥ 0'}, status=400)

    if 'stok' in data and (not isinstance(data['stok'], int) or data['stok'] < 0):
        return Response(json_body={'error': 'Stok harus berupa bilangan bulat ≥ 0'}, status=400)

    kategori = session.query(Kategori).filter_by(id=data['kategori_id']).first()
    if not kategori:
        return Response(json_body={'error': 'Kategori tidak ditemukan'}, status=400)

    existing = session.query(Produk).filter_by(nama=data['nama']).first()
    if existing:
        return Response(json_body={'error': 'Produk dengan nama ini sudah ada'}, status=400)

    produk = Produk(
        nama=data['nama'],
        stok=data.get('stok', 0),
        harga=float(data['harga']),
        kategori_id=kategori.id
    )
    session.add(produk)
    session.flush() # Flush to get the ID before commit
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
        produk.harga = float(data['harga'])

    if 'stok' in data:
        if not isinstance(data['stok'], int) or data['stok'] < 0:
            return Response(json_body={'error': 'Stok harus berupa bilangan bulat ≥ 0'}, status=400)
        produk.stok = data['stok']

    if 'kategori_id' in data:
        kategori = session.query(Kategori).filter_by(id=data['kategori_id']).first()
        if not kategori:
            return Response(json_body={'error': 'Kategori tidak ditemukan'}, status=400)
        produk.kategori_id = kategori.id

    return {'message': 'Produk berhasil diperbarui'}

@view_config(route_name='produk_detail', renderer='json', request_method='DELETE')
def delete_produk(request):
    session = request.dbsession
    produk_id = int(request.matchdict['id'])
    produk = session.get(Produk, produk_id)
    if not produk:
        return Response(json_body={'error': 'Produk tidak ditemukan'}, status=404)

    session.delete(produk)
    return {'message': 'Produk berhasil dihapus'}
