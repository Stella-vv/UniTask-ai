# test/test_forum.py
import os
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

def _mk_assignment_name(tag="ok"):
    return f"Assignment-{uuid.uuid4().hex[:6]}-{tag}"

def _create_user(email=None, role="student"):
    """Create and return a new user ID."""
    if email is None:
        email = f"forumuser-{uuid.uuid4().hex[:6]}@example.com"
    r = _post("/register", {"email": email, "password": "pass123", "role": role})
    assert r.status_code in (200, 201), r.text
    data = r.json()
    return data.get("id") or data.get("user", {}).get("id")

def _create_assignment(user_id):
    """Create assignment, returns (assignment_id, forum_id)"""
    payload = {
        "name": _mk_assignment_name("forum"),
        "description": "Forum test assignment",
        "due_date": "2025-12-31 23:59:59",
        "user_id": user_id,
        "course_id": 1  # ensure exists in DB
    }
    r = _post_form("/assignments", payload)
    assert r.status_code == 201, r.text
    body = r.json()
    return body["assignment"]["id"], body["forum"]["id"]

# 1) Get forum by assignment_id
def test_get_forum_ok():
    uid = _create_user()
    aid, fid = _create_assignment(uid)
    r = _get(f"/forum/{aid}")
    assert r.status_code == 200, r.text
    assert r.json()["id"] == fid

# 2) Get forum not exists → 404
def test_get_forum_not_found():
    r = _get("/forum/999999")
    assert r.status_code == 404, r.text

# 3) Create question in forum
def test_create_question_ok():
    uid = _create_user()
    _, fid = _create_assignment(uid)
    payload = {"content": "What is the deadline?", "user_id": uid}
    r = _post(f"/forum/{fid}/questions", payload)
    assert r.status_code == 201, r.text
    assert r.json()["question"]["content"] == "What is the deadline?"

# 4) Create question in non-existent forum → 404
def test_create_question_forum_not_found():
    payload = {"content": "Test?", "user_id": 1}
    r = _post("/forum/999999/questions", payload)
    assert r.status_code == 404, r.text

# 5) Get forum questions (no replies yet)
def test_get_forum_questions_ok():
    uid = _create_user()
    _, fid = _create_assignment(uid)
    _post(f"/forum/{fid}/questions", {"content": "Q1", "user_id": uid})
    r = _get(f"/forum/{fid}/questions")
    assert r.status_code == 200, r.text
    assert isinstance(r.json(), list)
    assert "replies" in r.json()[0]

# 6) Get forum questions for non-existent forum → 404
def test_get_forum_questions_not_found():
    r = _get("/forum/999999/questions")
    assert r.status_code == 404, r.text

# 7) Create reply to question
def test_create_reply_ok():
    uid = _create_user()
    _, fid = _create_assignment(uid)
    q_res = _post(f"/forum/{fid}/questions", {"content": "Q2", "user_id": uid})
    qid = q_res.json()["question"]["id"]
    r = _post(f"/forum/questions/{qid}/replies", {"content": "Reply content", "user_id": uid})
    assert r.status_code == 201, r.text
    assert r.json()["reply"]["content"] == "Reply content"

# 8) Create reply for non-existent question → 404
def test_create_reply_question_not_found():
    payload = {"content": "R?", "user_id": 1}
    r = _post("/forum/questions/999999/replies", payload)
    assert r.status_code == 404, r.text
