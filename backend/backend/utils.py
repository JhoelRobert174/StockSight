from backend.models.log_aktivitas import LogAktivitas
from backend.models.produk import Produk
from backend.models.kategori import Kategori

def log_aksi(session, aksi, user_id=None):
    if user_id is None:
        raise ValueError("user_id wajib disertakan untuk mencatat log.")
    log = LogAktivitas(aksi=aksi, user_id=user_id)
    session.add(log)

def apply_pagination(query, page, limit):
    total = query.count()
    items = query.offset((page - 1) * limit).limit(limit).all()
    return items, total

def get_produk_or_404(session, produk_id: int, user_id: int):
    produk = session.get(Produk, produk_id)
    if not produk or produk.user_id != user_id:
        raise LookupError("Produk tidak ditemukan")
    return produk

def get_kategori_or_404(session, kategori_id: int, user_id: int):
    kategori = session.query(Kategori).filter_by(id=kategori_id, user_id=user_id).first()
    if not kategori:
        raise LookupError("Kategori tidak ditemukan")
    return kategori

