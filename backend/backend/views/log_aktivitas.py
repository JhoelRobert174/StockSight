from pyramid.view import view_config
from pyramid.response import Response
from sqlalchemy.exc import DBAPIError
from backend.models.log_aktivitas import LogAktivitas
from backend.utils import apply_pagination

@view_config(route_name='log_aktivitas', renderer='json', request_method='GET')
def get_logs(request):
    session = request.dbsession

    user_id = request.session.get('user_id')
    if not user_id:
        return Response(json_body={"error": "Unauthorized"}, status=401)

    try:
        page = int(request.GET.get("page", 1))
        limit = int(request.GET.get("limit", 10))

        query = session.query(LogAktivitas).filter_by(user_id=user_id).order_by(LogAktivitas.waktu.desc())
        logs, total = apply_pagination(query, page, limit)

        return {
            "total": total,
            "page": page,
            "limit": limit,
            "data": [
                {
                    "waktu": log.waktu.isoformat() if log.waktu else None,
                    "aksi": log.aksi
                }
                for log in logs
            ]
        }

    except DBAPIError as e:
        return Response(json_body={"error": "Database error", "details": str(e)}, status=500)
    except ValueError:
        return Response(json_body={"error": "Parameter page/limit tidak valid"}, status=400)
    
@view_config(route_name='log_aktivitas', request_method='OPTIONS')
def log_aktivitas_options(request):
    return Response()

