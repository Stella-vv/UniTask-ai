# test/test_qa.py
import os
import io
import uuid
import requests

API_BASE = os.environ.get("API_BASE", "http://localhost:8008/api").rstrip("/")
TIMEOUT = float(os.environ.get("API_TIMEOUT", "10"))

def _post(path: str, json: dict):
    return requests.post(f"{API_BASE}{path}", json=json, timeout=TIMEOUT)

def _post_form(path: str, data: dict, files=None):
    return requests.post(f"{API_BASE}{path}", data=data, files=files or {}, timeout=TIMEOUT)

def _get(path: str):
    return requests.get(f"{API_BASE}{path}", timeout=TIMEOUT)

def _delete(path: str):
    return requests.delete(f"{API_BASE}{path}", timeout=TIMEOUT)

def _mk_assignment_name(tag="ok"):
    return f"Assignment-{uuid.uuid4().hex[:6]}-{tag}"

def _create_user(email=None, role="student"):
    """Create a user and return its ID (top-level or nested)."""
    if email is None:
        email = f"qauser-{uuid.uuid4().hex[:6]}@example.com"
    r = _post("/register", {"email": email, "password": "pass123", "role": role})
    assert r.status_code in (200, 201), r.text
    data = r.json()
    return data.get("id") or data.get("user", {}).get("id")

def _create_assignment(user_id):
    """Create assignment (multipart/form-data) and return its ID."""
    payload = {
        "name": _mk_assignment_name("qa"),
        "description": "QA upload assignment",
        "due_date": "2025-12-31 23:59:59",
        "user_id": user_id,
        "course_id": 1,  # ensure this exists in DB
    }
    r = _post_form("/assignments", payload)
    assert r.status_code == 201, r.text
    return r.json()["assignment"]["id"]

def _make_file_bytes(text="hello QA file"):
    """Return a file-like object and a unique filename."""
    content = text.encode("utf-8")
    f = io.BytesIO(content)
    f.seek(0)
    filename = f"qa-{uuid.uuid4().hex[:8]}.txt"
    return f, filename

# 1) Upload QA file successfully
def test_qa_upload_ok():
    uid = _create_user()
    aid = _create_assignment(uid)
    file_obj, fname = _make_file_bytes("This is a test QA file.")
    files = {"file": (fname, file_obj, "text/plain")}
    data = {"assignment_id": str(aid), "user_id": str(uid), "description": "first upload"}

    r = _post_form("/qa/upload", data, files=files)
    assert r.status_code == 201, r.text
    body = r.json()
    assert body.get("message") == "Q&A uploaded"
    assert isinstance(body.get("upload_id"), int)

# 2) Missing required fields → 400 (no file)
def test_qa_upload_missing_file_400():
    uid = _create_user()
    aid = _create_assignment(uid)
    data = {"assignment_id": str(aid), "user_id": str(uid)}
    r = _post_form("/qa/upload", data, files=None)
    assert r.status_code == 400, r.text
    assert "Missing required fields" in r.text

# 3) Missing assignment_id → 400
def test_qa_upload_missing_assignment_id_400():
    uid = _create_user()
    file_obj, fname = _make_file_bytes()
    files = {"file": (fname, file_obj, "text/plain")}
    data = {"user_id": str(uid)}
    r = _post_form("/qa/upload", data, files=files)
    assert r.status_code == 400, r.text
    assert "Missing required fields" in r.text

# 4) Missing user_id → 400
def test_qa_upload_missing_user_id_400():
    uid = _create_user()  # not used directly; just to keep pattern consistent
    aid = _create_assignment(uid)
    file_obj, fname = _make_file_bytes()
    files = {"file": (fname, file_obj, "text/plain")}
    data = {"assignment_id": str(aid)}
    r = _post_form("/qa/upload", data, files=files)
    assert r.status_code == 400, r.text
    assert "Missing required fields" in r.text

# 5) List uploaded QAs for assignment (should contain at least one after upload)
def test_get_uploaded_qas_list_ok():
    uid = _create_user()
    aid = _create_assignment(uid)
    # upload one
    file_obj, fname = _make_file_bytes("list me!")
    files = {"file": (fname, file_obj, "text/plain")}
    data = {"assignment_id": str(aid), "user_id": str(uid), "description": "list test"}
    _ = _post_form("/qa/upload", data, files=files)

    r = _get(f"/qa/assignment/{aid}/uploads")
    assert r.status_code == 200, r.text
    items = r.json()
    assert isinstance(items, list)
    assert any(i.get("filename") == fname for i in items)

# 6) Delete uploaded QA file successfully
def test_delete_qa_file_ok():
    uid = _create_user()
    aid = _create_assignment(uid)
    file_obj, fname = _make_file_bytes("delete me!")
    files = {"file": (fname, file_obj, "text/plain")}
    data = {"assignment_id": str(aid), "user_id": str(uid), "description": "delete test"}

    up = _post_form("/qa/upload", data, files=files)
    assert up.status_code == 201, up.text
    upload_id = up.json()["upload_id"]

    r = _delete(f"/qa/delete/{upload_id}")
    assert r.status_code == 200, r.text
    assert "File deleted successfully" in r.text

# 7) Delete non-existent QA file → 404
def test_delete_qa_file_not_found_404():
    r = _delete("/qa/delete/999999")
    assert r.status_code == 404, r.text
    assert "File not found" in r.text

# 8) List uploads for assignment without uploads → empty list (still 200)
def test_get_uploaded_qas_empty_list_ok():
    uid = _create_user()
    aid = _create_assignment(uid)
    r = _get(f"/qa/assignment/{aid}/uploads")
    assert r.status_code == 200, r.text
    assert isinstance(r.json(), list)
    assert r.json() == []
