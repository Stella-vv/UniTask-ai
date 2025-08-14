# UniTask AI Backend – Testing Guide

This document describes **how we test the backend** of UniTask AI. It covers the test scope, how to run tests locally and via Docker, basic coverage, and troubleshooting.

> **Summary:** We currently maintain **6 test modules** with **50 total tests** covering authentication, courses, assignments, FAQs, Q&A, and forum CRUD. We will expand edge‑case coverage in future iterations.

---

## 1. Test Stack & Layout

- **Test framework:** `pytest`
- **HTTP client:** Flask test client / `requests`
- **Container orchestration (integration):** `docker-compose`
- **Location:** `UniTask-ai-backend/test/`

```
test/
├── conftest.py          # Shared fixtures (app factory, client, test DB, tokens, etc.)
├── run_all_tests.py     # One-click test runner that starts/stops Docker + runs pytest
├── start_docker.py      # Helper to start docker-compose for integration tests
├── stop_docker.py       # Helper to stop and cleanup containers
├── test_auth.py         # Register, login, token checks, negative cases
├── test_course.py       # Course CRUD & validations
├── test_assignment.py   # Assignment CRUD & relation constraints
├── test_faq.py          # FAQ CRUD & query (by assignment / by course if enabled)
├── test_forum.py        # Forum CRUD & thread basics
└── test_qa.py           # Q&A endpoints (ask/reply flows, validations)
```

> The tree above matches the current repository (see screenshot).

---

## 2. What We Test (Current Scope)

| Area            | File                | Key Assertions                                                                 |
|-----------------|---------------------|---------------------------------------------------------------------------------|
| Auth            | `test_auth.py`      | Register/login flows, invalid payloads, duplicate email, token required paths  |
| Courses         | `test_course.py`    | Create/list/get/update/delete, schema validation, 404/400 paths                 |
| Assignments     | `test_assignment.py`| CRUD, course linkage, missing fields, not‑found IDs                             |
| FAQs            | `test_faq.py`       | CRUD, list by assignment, (optional) list by course aggregation                 |
| Forum           | `test_forum.py`     | Basic forum creation per assignment, thread CRUD, permissions stubs             |
| Q&A             | `test_qa.py`        | Ask/reply cycle, field validation, not‑found handling                           |

- **Total:** 6 files, **~50 tests**.  
- **Planned:** more boundary/negative tests (rate limits, pagination, auth scopes, concurrency).

---

## 3. Running Tests

### 3.1 One‑click runner (recommended)
This script installs deps, starts Docker, waits for the backend, runs all tests, then tears down containers.

```bash
python UniTask-ai-backend/test/run_all_tests.py
```

**What it does (simplified):**
1. `pip install -r requirements.txt`
2. `docker compose up -d` (backend, db, optional ollama)
3. Waits for `http://localhost:8008` (timeout 45s)
4. `pytest -q` (defaults to `test/`)
5. `docker compose down`

> You may see a warning: *the attribute `version` is obsolete…* — safe to ignore for now.

### 3.2 Direct pytest (unit/integration without helper)
From the backend root:

```bash
# (Optional) create and activate a venv
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate

pip install -r requirements.txt

# Run all tests
pytest -q

# Run a single file
pytest -q test/test_faq.py

# Run by keyword (e.g., only tests mentioning 'login')
pytest -q -k login
```

### 3.3 With coverage
```bash
pytest --cov=app --cov=routes --cov-report=term-missing
# or generate HTML for report/
pytest --cov=app --cov=routes --cov-report=html:report
```

> Adjust the `--cov` targets to your packages (e.g., `app`, `routes`, `models`).

---

## 4. Test Data & Isolation

- Tests use **isolated test database** (e.g., `unitask_test`) configured via fixtures in `conftest.py`.
- Where external services exist (e.g., Ollama, email), tests use **mocks** or **fake providers** to keep tests deterministic.
- Integration tests create and clean up resources per run.

---

For Docker‑based integration:
```yaml
services:
  postgres:
    image: postgres:14
    env:
      POSTGRES_PASSWORD: "0827"
```

---

## 5. Troubleshooting

- **`the attribute 'version' is obsolete`** in `docker-compose.yml`  
  Remove the `version:` field or ignore the warning; Compose v2 no longer requires it.

- **Service not up within timeout**  
  Increase wait time in `run_all_tests.py` or ensure ports aren’t occupied. Check logs:  
  `docker compose logs -f backend db`

- **Port conflicts (e.g., 8008 or 5432)**  
  Stop old containers or change ports in `docker-compose.yml`.

- **Windows path/permission issues**  
  Run terminal as Administrator or use WSL2; ensure Python and Docker are on PATH.

---

## 7. Roadmap for Better Coverage

- Add **pagination & filtering** tests (e.g., list endpoints with `page`/`page_size`).  
- Add **auth scopes/roles** tests (student/tutor/admin).  
- Add **race condition** tests (simulated concurrent updates).  
- Add **schema validation** tests for strict typing and error messages.  
- Add **error‑path** assertions for upstream failures (mocked 5xx/timeout).

---