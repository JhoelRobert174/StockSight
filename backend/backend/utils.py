from backend.models.log_aktivitas import LogAktivitas

def log_aksi(session, aksi, user_id=None):
    if user_id is None:
        raise ValueError("user_id wajib disertakan untuk mencatat log.")
    log = LogAktivitas(aksi=aksi, user_id=user_id)
    session.add(log)

def apply_pagination(query, page, limit):
    total = query.count()
    items = query.offset((page - 1) * limit).limit(limit).all()
    return items, total
