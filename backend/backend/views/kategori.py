from pyramid.view import view_config
from pyramid.response import Response
from backend.models.kategori import Kategori
from backend.models.produk import Produk

@view_config(route_name='kategori_list', renderer='json', request_method='GET')
def get_all_kategori(request):
    session = request.dbsession
    kategori_list = session.query(Kategori).all()
    return [{
        'id': k.id,
        'nama': k.nama,
        'created_at': k.created_at.isoformat()
    } for k in kategori_list]


@view_config(route_name='kategori_list', renderer='json', request_method='POST')
def create_kategori(request):
    session = request.dbsession
    data = request.json_body

    allowed_fields = {'nama'}
    unknown_fields = set(data.keys()) - allowed_fields
    if unknown_fields:
        return Response(json_body={'error': f'Terdapat field tidak dikenali: {", ".join(unknown_fields)}'}, status=400)

    nama = data.get('nama')
    if not isinstance(nama, str) or not nama.strip():
        return Response(json_body={'error': 'Nama kategori harus berupa string dan tidak boleh kosong'}, status=400)

    nama = nama.strip()

    existing = session.query(Kategori).filter_by(nama=nama).first()
    if existing:
        return Response(json_body={'error': 'Kategori sudah ada'}, status=400)

    kategori = Kategori(nama=nama)
    session.add(kategori)
    session.flush()

    return {'message': 'Kategori berhasil ditambahkan', 'id': kategori.id}


@view_config(route_name='kategori_detail', renderer='json', request_method='GET')
def get_kategori_detail(request):
    session = request.dbsession
    try:
        kategori_id = int(request.matchdict['id'])
    except ValueError:
        return Response(json_body={'error': 'ID kategori tidak valid'}, status=400)

    kategori = session.get(Kategori, kategori_id)

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
        kategori_id = int(request.matchdict['id'])
    except ValueError:
        return Response(json_body={'error': 'ID kategori tidak valid'}, status=400)

    kategori = session.get(Kategori, kategori_id)

    if not kategori:
        return Response(json_body={'error': 'Kategori tidak ditemukan'}, status=404)

    data = request.json_body
    nama = str(data.get('nama', '')).strip()
    if not nama:
        return Response(json_body={'error': 'Nama tidak boleh kosong'}, status=400)

    existing = session.query(Kategori).filter(Kategori.nama == nama, Kategori.id != kategori.id).first()
    if existing:
        return Response(json_body={'error': 'Nama kategori sudah digunakan'}, status=400)

    kategori.nama = nama
    return {'message': 'Kategori berhasil diperbarui'}


@view_config(route_name='kategori_detail', renderer='json', request_method='DELETE')
def delete_kategori(request):
    session = request.dbsession
    try:
        kategori_id = int(request.matchdict['id'])
    except ValueError:
        return Response(json_body={'error': 'ID kategori tidak valid'}, status=400)

    kategori = session.get(Kategori, kategori_id)
    if not kategori:
        return Response(json_body={'error': 'Kategori tidak ditemukan'}, status=404)

    produk_terkait = session.query(Produk).filter_by(kategori_id=kategori.id).first()
    if produk_terkait:
        return Response(json_body={
            'error': 'Kategori tidak bisa dihapus karena masih digunakan oleh produk'
        }, status=400)

    

    session.delete(kategori)
    return {'message': 'Kategori berhasil dihapus'}
