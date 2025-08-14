# test/test_assignment.py
import os
import uuid
import requests
from datetime import datetime

API_BASE = os.environ.get("API_BASE", "http://localhost:8008/api").rstrip("/")
TIMEOUT = float(os.environ.get("API_TIMEOUT", "10"))

def _post_form(path: str, data: dict, files=None):
    return requests.post(f"{API_BASE}{path}", data=data, files=files or {}, timeout=TIMEOUT)

def _get(path: str):
    return requests.get(f"{API_BASE}{path}", timeout=TIMEOUT)

def _put_form(path: str, data: dict, files=None):
    return requests.put(f"{API_BASE}{path}", data=data, files=files or {}, timeout=TIMEOUT)

def _delete(path: str):
    return requests.delete(f"{API_BASE}{path}", timeout=TIMEOUT)

def _mk_assignment_name(tag="ok"):
    return f"Assignment-{uuid.uuid4().hex[:6]}-{tag}"

def _create_user():
    email = f"user-{uuid.uuid4().hex[:6]}@example.com"
    r = requests.post(f"{API_BASE}/register", json={"email": email, "password": "pass123", "role": "tutor"}, timeout=TIMEOUT)
    assert r.status_code in (200, 201, 409), r.text
    data = r.json()
    return data.get("id") or data.get("user", {}).get("id")

def _create_course():
    payload = {"name": f"Course-{uuid.uuid4().hex[:6]}", "description": "Test course"}
    r = requests.post(f"{API_BASE}/courses", json=payload, timeout=TIMEOUT)
    assert r.status_code in (200, 201), r.text
    return r.json().get("id") or r.json().get("course", {}).get("id")

def _create_assignment():
    """Helper to create a minimal valid assignment"""
    user_id = _create_user()
    course_id = _create_course()
    payload = {
        "name": _mk_assignment_name("happy"),
        "description": "Test assignment description",
        "due_date": "2025-12-31 23:59:59",
        "user_id": user_id,
        "course_id": course_id
    }
    r = _post_form("/assignments", payload)
    assert r.status_code == 201, r.text
    return r.json()["assignment"]["id"], payload["name"]


# 1) Create assignment successfully
def test_create_assignment_ok():
    aid, name = _create_assignment()
    assert isinstance(aid, int)
    assert name.startswith("Assignment-")

# 2) Create assignment with missing fields → 400
def test_create_assignment_missing_fields_400():
    payload = {
        "description": "No name assignment",
        "due_date": "2025-12-31 23:59:59",
        "user_id": 1
    }
    r = _post_form("/assignments", payload)
    assert r.status_code == 400, r.text
    assert "Missing required fields" in r.text

# 3) Get all assignments
def test_get_all_assignments():
    r = _get("/assignments")
    assert r.status_code == 200, r.text
    assert isinstance(r.json(), list)

# 4) Get single assignment detail
def test_get_assignment_detail():
    aid, name = _create_assignment()
    r = _get(f"/assignments/detail/{aid}")
    assert r.status_code == 200, r.text
    assert r.json().get("name") == name

# 5) Update assignment successfully
def test_update_assignment_ok():
    aid, _ = _create_assignment()
    new_name = _mk_assignment_name("updated")
    payload = {
        "name": new_name,
        "description": "Updated description"
    }
    r = _put_form(f"/assignments/{aid}", payload)
    assert r.status_code == 200, r.text
    assert r.json()["assignment"]["name"] == new_name

# 6) Delete assignment successfully
def test_delete_assignment_ok():
    aid, _ = _create_assignment()
    r = _delete(f"/assignments/{aid}")
    assert r.status_code == 204, r.text

# 7) Get non-existent assignment → 404
def test_get_nonexistent_assignment_404():
    r = _get("/assignments/detail/999999")
    assert r.status_code == 404, r.text

# 8) Delete non-existent assignment → 404
def test_delete_nonexistent_assignment_404():
    r = _delete("/assignments/999999")
    assert r.status_code == 404, r.text
