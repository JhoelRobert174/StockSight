from backend.models.log_aktivitas import LogAktivitas

def log_aksi(session, aksi):
    log = LogAktivitas(aksi=aksi)
    session.add(log)

def apply_pagination(query, page, limit):
    total = query.count()
    items = query.offset((page - 1) * limit).limit(limit).all()
    return items, total
