import pytest
from server import create_app


@pytest.fixture()
def server():
    server = create_app({"TESTING": True})
    yield server


@pytest.fixture()
def client(server):
    return server.test_client()


@pytest.fixture()
def runner(server):
    return server.test_cli_runner()
