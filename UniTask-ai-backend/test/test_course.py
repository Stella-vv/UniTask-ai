# test/test_course.py
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

def _mk_course_name(tag="ok"):
    return f"Course-{uuid.uuid4().hex[:6]}-{tag}"

# 1) Create course successfully
def test_create_course_ok():
    payload = {
        "name": _mk_course_name("happy"),
        "description": "Test description",
        "year": 2025,
        "semester": "T2",
        "assessment": "Exam"
    }
    r = _post("/courses/", payload)
    assert r.status_code == 201, r.text
    data = r.json()
    assert data.get("name") == payload["name"]
    assert data.get("assessment") == "Exam"

# 2) Create course without name → 400
def test_create_course_missing_name_400():
    payload = {
        "description": "No name course",
        "year": 2025,
        "semester": "T1"
    }
    r = _post("/courses/", payload)
    assert r.status_code == 400, r.text
    assert "Missing course name" in r.text

# 3) Get all courses
def test_get_all_courses():
    r = _get("/courses/")
    assert r.status_code == 200, r.text
    assert isinstance(r.json(), list)

# 4) Get single course
def test_get_course_by_id():
    # Create one first
    payload = {
        "name": _mk_course_name("single"),
        "description": "Single course",
        "year": 2025,
        "semester": "T1"
    }
    created = _post("/courses/", payload)
    cid = created.json().get("id")
    r = _get(f"/courses/{cid}")
    assert r.status_code == 200, r.text
    assert r.json().get("name") == payload["name"]

# 5) Update course successfully
def test_update_course_ok():
    payload = {
        "name": _mk_course_name("update"),
        "description": "Before update",
        "year": 2025,
        "semester": "T1"
    }
    created = _post("/courses/", payload)
    cid = created.json().get("id")

    new_data = {
        "name": _mk_course_name("updated"),
        "description": "After update",
        "assessment": "Assignment"
    }
    r = _put(f"/courses/{cid}", new_data)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body.get("message") == "Course updated successfully!"
    assert body.get("course", {}).get("name") == new_data["name"]
    assert body.get("course", {}).get("assessment") == "Assignment"

# 6) Delete course successfully
def test_delete_course_ok():
    payload = {
        "name": _mk_course_name("delete"),
        "description": "To be deleted",
        "year": 2025,
        "semester": "T1"
    }
    created = _post("/courses/", payload)
    cid = created.json().get("id")
    r = _delete(f"/courses/{cid}")
    assert r.status_code == 200, r.text
    assert f"Course with ID {cid} has been deleted." in r.text

# 7) Get non-existent course → 404
def test_get_nonexistent_course_404():
    r = _get("/courses/999999")
    assert r.status_code == 404, r.text

# 8) Delete non-existent course → 404
def test_delete_nonexistent_course_404():
    r = _delete("/courses/999999")
    assert r.status_code == 404, r.text
