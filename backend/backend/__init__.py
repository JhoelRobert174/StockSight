from pyramid.config import Configurator
from pyramid.renderers import JSON
from pyramid.session import SignedCookieSessionFactory
from pyramid.events import NewRequest
from backend.tweens.auth_tween import auth_tween_factory


def add_cors_headers_response_callback(event):
    def cors_headers(request, response):
        response.headers.update({
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true',
        })
        return response
    event.request.add_response_callback(cors_headers)

def main(global_config, **settings):
    with Configurator(settings=settings) as config:
        # Include modules
        config.include('pyramid_jinja2')
        config.include('.models')
        config.include('.routes')

        # Renderer & session
        config.add_renderer('json', JSON())
        my_session_factory = SignedCookieSessionFactory('youlookstock')
        config.set_session_factory(my_session_factory)

        # Auth routes
        config.add_route('register', '/register')
        config.add_route('login', '/login')
        config.add_route('me', '/me')
        config.add_route('update_store_name', '/me/store-name')
        config.add_route('logout', '/logout')
        config.add_route('verify_identity', '/verify-identity')
        config.add_route('reset_password', '/reset-password')

        # Produk routes
        config.add_route('produk_list', '/produk')                     # GET
        config.add_route('produk_create', '/produk')                  # POST
        config.add_route('produk_detail', '/produk/{id}')             # GET
        config.add_route('produk_update', '/produk/{id}')             # PUT
        config.add_route('produk_delete', '/produk/{id}')             # DELETE
        config.add_route('produk_mutasi', '/produk/{id}/mutasi')
        config.add_route('produk_mutasi_riwayat', '/produk/{id}/mutasi-riwayat')  # GET      # POST
        config.add_route('produk_by_kategori', '/produk/kategori/{kategori_id}')  # GET

        # Kategori routes
        config.add_route('kategori_list', '/kategori')                # GET, POST
        config.add_route('kategori_detail', '/kategori/{id}')         # GET, PUT, DELETE

        # Log aktivitas
        config.add_route('log_aktivitas', '/log-aktivitas')           # GET

        # CORS
        config.add_subscriber(add_cors_headers_response_callback, NewRequest)

        # Protect
        config.add_tween('backend.tweens.auth_tween.auth_tween_factory')

        # Auto-discover views
        config.scan()

        return config.make_wsgi_app()
