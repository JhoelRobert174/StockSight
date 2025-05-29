"""Pyramid bootstrap environment."""
from alembic import context
from pyramid.paster import get_appsettings, setup_logging
from sqlalchemy import engine_from_config
from backend.models.meta import Base


# Ambil argumen -x ini=... (default ke development.ini kalau tidak diset)
ini_file = context.get_x_argument(as_dictionary=True).get("ini", "backend/development.ini")

setup_logging(ini_file)
settings = get_appsettings(ini_file)
config = context.config
config.set_main_option("sqlalchemy.url", settings["sqlalchemy.url"])
target_metadata = Base.metadata

def run_migrations_offline():
    context.configure(url=settings["sqlalchemy.url"])
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    from sqlalchemy import create_engine
    engine = create_engine(settings["sqlalchemy.url"])
    connection = engine.connect()
    context.configure(connection=connection, target_metadata=target_metadata)

    try:
        with context.begin_transaction():
            context.run_migrations()
    finally:
        connection.close()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
