from pyramid.response import Response
from datetime import datetime, timedelta

PUBLIC_PATHS = {
    '/login',
    '/register',
    '/me',
    '/favicon.ico',
    '/reset-password',
    '/verify-identity',
}


def auth_tween_factory(handler, registry):
    def auth_tween(request):
        path = request.path_info

        if request.method == 'OPTIONS':
            return Response(
                status=204,
                headers={
                    'Access-Control-Allow-Origin': 'http://localhost:5173',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    'Access-Control-Allow-Credentials': 'true',
                }
            )

        # Public path
        if any(path == pub or path.startswith(pub + '/') for pub in PUBLIC_PATHS):
            return handler(request)

        # Cek session ID dan expiry
        user_id = request.session.get('user_id')
        expires = request.session.get('expires_at')

        if not user_id:
            return Response(json_body={'error': 'Unauthorized'}, status=401)

        if expires and datetime.utcnow() > datetime.fromisoformat(expires):
            request.session.invalidate()
            return Response(json_body={'error': 'Session expired'}, status=401)

        # Lolos semua — lanjut ke view
        request.user_id = user_id
        return handler(request)

    return auth_tween
