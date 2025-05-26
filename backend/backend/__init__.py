from pyramid.config import Configurator
from pyramid.renderers import JSON


def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    with Configurator(settings=settings) as config:
        config.include('pyramid_jinja2')
        config.include('.models')
        config.include('.routes')
        config.add_renderer('json', JSON())
        config.add_route('register', '/register')
        config.add_route('login', '/login')
        config.add_route('produk_list', '/produk')
        config.add_route('produk_detail', '/produk/{id}')
        config.add_route('produk_create', '/produk')          # POST
        config.add_route('produk_update', '/produk/{id}')     # PUT
        config.add_route('produk_delete', '/produk/{id}')     # DELETE
        config.add_route('kategori_list', '/kategori')
        config.add_route('kategori_detail', '/kategori/{id}')
        config.add_route('produk_mutasi', '/produk/{id}/mutasi')
        config.add_route('produk_by_kategori', '/produk/kategori/{kategori_id}')
        config.scan()
     # POST kategori
    return config.make_wsgi_app()
