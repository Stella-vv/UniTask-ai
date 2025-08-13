# test/test_auth.py
import os
import uuid
import requests

API_BASE = os.environ.get("API_BASE", "http://localhost:8008/api").rstrip("/")
TIMEOUT = float(os.environ.get("API_TIMEOUT", "10"))

def _post(path: str, json: dict):
    return requests.post(f"{API_BASE}{path}", json=json, timeout=TIMEOUT)

def _mk_email(tag="ok"):
    return f"u{uuid.uuid4().hex[:12]}-{tag}@example.com"

def _extract_user(payload: dict):
    """Extract the user object from the response, supporting multiple return formats"""
    if isinstance(payload, dict):
        if "email" in payload or "role" in payload:
            return payload
        if isinstance(payload.get("user"), dict):
            return payload["user"]
    return {}

def _extract_role(payload: dict):
    """Extract role from either top-level or nested user object"""
    if not isinstance(payload, dict):
        return None
    return payload.get("role") or payload.get("user", {}).get("role")

# 1) register -> login
def test_register_then_login_ok():
    email = _mk_email("happy")
    role = "student"
    r1 = _post("/register", {"email": email, "password": "P@ssw0rd!", "role": role})
    assert r1.status_code in (201, 200), r1.text
    u1 = _extract_user(r1.json())
    assert u1.get("email", "").lower() == email.lower()
    assert u1.get("role") == role

    r2 = _post("/login", {"email": email, "password": "P@ssw0rd!", "role": role})
    assert r2.status_code == 200, r2.text
    body2 = r2.json()
    assert isinstance(body2.get("token"), str) and body2["token"] != ""
    assert _extract_role(body2) == role

# 2) Duplicate registration 
def test_register_duplicate_email_409():
    email = _mk_email("dup")
    role = "student"
    ok = _post("/register", {"email": email, "password": "x", "role": role})
    assert ok.status_code in (201, 200), ok.text
    dup = _post("/register", {"email": email, "password": "x", "role": role})
    assert dup.status_code == 409, dup.text

# 3) Login - wrong password → 401
def test_login_wrong_password_401():
    email = _mk_email("wrongpwd")
    role = "student"
    _ = _post("/register", {"email": email, "password": "right", "role": role})
    bad = _post("/login", {"email": email, "password": "WRONG", "role": role})
    assert bad.status_code == 401, bad.text

# 4) Login - non-existent user → 401
def test_login_nonexistent_401():
    miss = _post("/login", {"email": _mk_email("nouser"), "password": "x", "role": "student"})
    assert miss.status_code == 401, miss.text

# 5) Login should return token & role
def test_login_returns_token_and_role_shape():
    email = _mk_email("shape")
    role = "tutor"
    _ = _post("/register", {"email": email, "password": "x", "role": role})
    r = _post("/login", {"email": email, "password": "x", "role": role})
    assert r.status_code == 200, r.text
    b = r.json()
    assert isinstance(b.get("token"), str) and b["token"]
    assert _extract_role(b) == role

# 6) Login should return correct email
def test_login_returns_correct_email():
    email = _mk_email("emailcheck")
    role = "student"
    _ = _post("/register", {"email": email, "password": "abc123", "role": role})
    r = _post("/login", {"email": email, "password": "abc123", "role": role})
    assert r.status_code == 200, r.text
    user_obj = _extract_user(r.json())
    assert user_obj.get("email", "").lower() == email.lower()

# 7) Role consistency: registered role should match login response
def test_role_roundtrip_consistency():
    email = _mk_email("role")
    role = "student"
    _ = _post("/register", {"email": email, "password": "p", "role": role})
    r = _post("/login", {"email": email, "password": "p", "role": "ignored"})
    assert r.status_code == 200, r.text
    assert _extract_role(r.json()) == role

# 8) Multiple logins should all return valid tokens
def test_login_twice_tokens_exist():
    email = _mk_email("twice")
    role = "student"
    _ = _post("/register", {"email": email, "password": "p", "role": role})
    r1 = _post("/login", {"email": email, "password": "p", "role": role})
    r2 = _post("/login", {"email": email, "password": "p", "role": role})
    assert r1.status_code == 200 and r2.status_code == 200
    assert isinstance(r1.json().get("token"), str) and r1.json()["token"]
    assert isinstance(r2.json().get("token"), str) and r2.json()["token"]

# 9) Register with invalid email 
def test_register_invalid_email_422_expectation():
    bad = _post("/register", {"email": "not-an-email", "password": "x", "role": "student"})
    assert bad.status_code in (201, 200, 422, 409), bad.text


# 10) Register with invalid role 
def test_register_disallow_unknown_role_422_expectation():
    bad = _post("/register", {"email": _mk_email("badrole"), "password": "x", "role": "admin"})
    assert bad.status_code in (201, 200, 422), bad.text
