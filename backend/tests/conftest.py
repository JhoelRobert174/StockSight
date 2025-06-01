import alembic
import alembic.config
import alembic.command
import os
import time
from pyramid.paster import get_appsettings
from pyramid.scripting import prepare
from pyramid.testing import DummyRequest, testConfig
import pytest
import transaction
import webtest

from backend import main
from backend import models
from backend.models.meta import Base

# Dictionary to store test execution times
_test_times = {}


def pytest_addoption(parser):
    parser.addoption('--ini', action='store', metavar='INI_FILE')
    parser.addoption('--html', action='store', help='Create HTML report file at given path')
    parser.addoption('--verbose-tests', action='store_true', help='Show more detailed test output')

@pytest.fixture(scope='session')
def ini_file(request):
    # potentially grab this path from a pytest option
    return os.path.abspath(request.config.option.ini or 'testing.ini')

@pytest.fixture(scope='session')
def app_settings(ini_file):
    return get_appsettings(ini_file)

@pytest.fixture(scope='session')
def dbengine(app_settings, ini_file):
    engine = models.get_engine(app_settings)

    alembic_cfg = alembic.config.Config(ini_file)
    Base.metadata.drop_all(bind=engine)
    alembic.command.stamp(alembic_cfg, None, purge=True)

    # run migrations to initialize the database
    # depending on how we want to initialize the database from scratch
    # we could alternatively call:
    # Base.metadata.create_all(bind=engine)
    # alembic.command.stamp(alembic_cfg, "head")
    alembic.command.upgrade(alembic_cfg, "head")

    yield engine

    Base.metadata.drop_all(bind=engine)
    alembic.command.stamp(alembic_cfg, None, purge=True)

@pytest.fixture(scope='session')
def app(app_settings, dbengine):
    return main({}, dbengine=dbengine, **app_settings)

@pytest.fixture
def tm():
    tm = transaction.TransactionManager(explicit=True)
    tm.begin()
    tm.doom()

    yield tm

    tm.abort()

@pytest.fixture
def dbsession(app, tm):
    session_factory = app.registry['dbsession_factory']
    return models.get_tm_session(session_factory, tm)

@pytest.fixture
def testapp(app, tm, dbsession):
    # override request.dbsession and request.tm with our own
    # externally-controlled values that are shared across requests but aborted
    # at the end
    testapp = webtest.TestApp(app, extra_environ={
        'HTTP_HOST': 'example.com',
        'tm.active': True,
        'tm.manager': tm,
        'app.dbsession': dbsession,
    })

    return testapp

@pytest.fixture
def app_request(app, tm, dbsession):
    """
    A real request.

    This request is almost identical to a real request but it has some
    drawbacks in tests as it's harder to mock data and is heavier.

    """
    with prepare(registry=app.registry) as env:
        request = env['request']
        request.host = 'example.com'

        # without this, request.dbsession will be joined to the same transaction
        # manager but it will be using a different sqlalchemy.orm.Session using
        # a separate database transaction
        request.dbsession = dbsession
        request.tm = tm

        yield request

@pytest.fixture
def dummy_request(tm, dbsession):
    """
    A lightweight dummy request.

    This request is ultra-lightweight and should be used only when the request
    itself is not a large focus in the call-stack.  It is much easier to mock
    and control side-effects using this object, however:

    - It does not have request extensions applied.
    - Threadlocals are not properly pushed.

    """
    request = DummyRequest()
    request.host = 'example.com'
    request.dbsession = dbsession
    request.tm = tm

    return request

@pytest.fixture
def dummy_config(dummy_request):
    """
    A dummy :class:`pyramid.config.Configurator` object.  This allows for
    mock configuration, including configuration for ``dummy_request``, as well
    as pushing the appropriate threadlocals.

    """
    with testConfig(request=dummy_request) as config:
        yield config


# Hooks for better test reporting
@pytest.hookimpl(tryfirst=True)
def pytest_runtest_setup(item):
    _test_times[item.nodeid] = time.time()


@pytest.hookimpl(trylast=True)
def pytest_runtest_teardown(item):
    _test_times[item.nodeid] = time.time() - _test_times.get(item.nodeid, time.time())


def pytest_report_teststatus(report):
    if report.when == 'call':
        duration = _test_times.get(report.nodeid, 0)
        if duration > 1.0:  # Highlight slow tests
            return report.outcome, f'{report.outcome}', f'SLOW: {duration:.2f}s'


def pytest_terminal_summary(terminalreporter, exitstatus, config):
    if exitstatus == 0:
        terminalreporter.write_sep('=', 'StockSight Test Summary')
        passed = len(terminalreporter.stats.get('passed', []))
        failed = len(terminalreporter.stats.get('failed', []))
        skipped = len(terminalreporter.stats.get('skipped', []))
        total = passed + failed + skipped
        terminalreporter.write_line(f'Total tests: {total}')
        terminalreporter.write_line(f'Passed: {passed} ({passed/total*100:.1f}%)')
        if failed:
            terminalreporter.write_line(f'Failed: {failed} ({failed/total*100:.1f}%)')
        if skipped:
            terminalreporter.write_line(f'Skipped: {skipped} ({skipped/total*100:.1f}%)')
        
        # Show slowest tests
        terminalreporter.write_sep('=', 'Slowest Tests')
        durations = [(nodeid, duration) for nodeid, duration in _test_times.items()]
        durations.sort(key=lambda x: x[1], reverse=True)
        for nodeid, duration in durations[:5]:  # Show top 5 slowest tests
            if duration > 0.1:  # Only show tests that took more than 0.1s
                terminalreporter.write_line(f'{nodeid}: {duration:.2f}s')
