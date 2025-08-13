# test/test_faq.py
import os
import uuid
import requests

API_BASE = os.environ.get("API_BASE", "http://localhost:8008/api").rstrip("/")
TIMEOUT = float(os.environ.get("API_TIMEOUT", "10"))

def _post(path: str, json: dict):
    return requests.post(f"{API_BASE}{path}", json=json, timeout=TIMEOUT)

def _get(path: str):
    return requests.get(f"{API_BASE}{path}", timeout=TIMEOUT)

def _put(path: str, json: dict):
    return requests.put(f"{API_BASE}{path}", json=json, timeout=TIMEOUT)

def _delete(path: str):
    return requests.delete(f"{API_BASE}{path}", timeout=TIMEOUT)

def _mk_question(tag="ok"):
    return f"Question-{uuid.uuid4().hex[:6]}-{tag}"

# --- Helpers ---
def _create_user(email=None, role="tutor"):
    """Create a user for FAQ uploaded_by"""
    if email is None:
        email = f"faquser-{uuid.uuid4().hex[:6]}@example.com"
    r = _post("/register", {"email": email, "password": "pass123", "role": role})
    assert r.status_code in (200, 201, 409), r.text
    return r.json().get("id") or r.json().get("user", {}).get("id")

def _create_assignment(user_id):
    """Create an assignment for FAQ assignment_id"""
    payload = {
        "name": f"Assignment-{uuid.uuid4().hex[:6]}",
        "description": "Test assignment",
        "due_date": "2025-12-31 23:59:59",
        "user_id": user_id,
        "course_id": 1  
    }
    r = requests.post(f"{API_BASE}/assignments", data=payload, timeout=TIMEOUT)
    assert r.status_code in (200, 201), r.text
    return r.json()["assignment"]["id"]


def _create_faq(user_id, assignment_id, question=None, answer="Sample answer"):
    """Create a FAQ"""
    if question is None:
        question = _mk_question("happy")
    payload = {
        "question": question,
        "answer": answer,
        "uploaded_by": user_id,
        "assignment_id": assignment_id
    }
    r = _post("/faqs/", payload)
    assert r.status_code == 201, r.text
    return r.json()["faq"]["id"], question

# --- Tests ---
def test_create_faq_ok():
    uid = _create_user()
    aid = _create_assignment(uid)
    fid, question = _create_faq(uid, aid)
    assert isinstance(fid, int)

def test_create_faq_missing_fields_400():
    r = _post("/faqs/", {"question": "Only question"})
    assert r.status_code == 400, r.text
    assert "Missing required fields" in r.text

def test_get_assignment_faqs():
    uid = _create_user()
    aid = _create_assignment(uid)
    _create_faq(uid, aid, question=_mk_question("list"))
    r = _get(f"/faqs/assignment/{aid}")
    assert r.status_code == 200, r.text
    faqs = r.json()
    assert isinstance(faqs, list)
    assert any("question" in f for f in faqs)

def test_get_faq_by_id():
    uid = _create_user()
    aid = _create_assignment(uid)
    fid, question = _create_faq(uid, aid)
    r = _get(f"/faqs/{fid}")
    assert r.status_code == 200, r.text
    assert r.json().get("question") == question

def test_update_faq_ok():
    uid = _create_user()
    aid = _create_assignment(uid)
    fid, _ = _create_faq(uid, aid)
    new_question = _mk_question("updated")
    payload = {"question": new_question, "answer": "Updated answer"}
    r = _put(f"/faqs/{fid}", payload)
    assert r.status_code == 200, r.text
    faq = r.json().get("faq", {})
    assert faq.get("question") == new_question

def test_delete_faq_ok():
    uid = _create_user()
    aid = _create_assignment(uid)
    fid, _ = _create_faq(uid, aid)
    r = _delete(f"/faqs/{fid}")
    assert r.status_code == 200, r.text
    assert "FAQ deleted" in r.text

def test_get_nonexistent_faq_404():
    r = _get("/faqs/999999")
    assert r.status_code == 404, r.text

def test_delete_nonexistent_faq_404():
    r = _delete("/faqs/999999")
    assert r.status_code == 404, r.text
