# test/conftest.py
import os
import uuid
import pytest
import requests

API_BASE = os.environ.get("API_BASE", "http://localhost:8008/api").rstrip("/")
TIMEOUT = float(os.environ.get("API_TIMEOUT", "10"))

@pytest.fixture(scope="session")
def api_base():
    return API_BASE

@pytest.fixture(scope="session")
def http(api_base):
    class Client:
        def __init__(self, base):
            self.base = base

        def url(self, path: str) -> str:
            return f"{self.base}{path}"

        def get(self, path: str, **kw):
            return requests.get(self.url(path), timeout=TIMEOUT, **kw)

        def post(self, path: str, **kw):
            return requests.post(self.url(path), timeout=TIMEOUT, **kw)

        def put(self, path: str, **kw):
            return requests.put(self.url(path), timeout=TIMEOUT, **kw)

        def delete(self, path: str, **kw):
            return requests.delete(self.url(path), timeout=TIMEOUT, **kw)
    return Client(api_base)

@pytest.fixture
def unique_email():
    # Return a fresh email each time to avoid "already registered"
    return f"u{uuid.uuid4().hex[:16]}@example.com"

@pytest.fixture
def default_password():
    return "P@ssw0rd!"

@pytest.fixture(params=["student", "tutor"])
def any_role(request):
    return request.param
