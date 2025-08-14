# test/run_all_tests.py
import os
import re
import time
import subprocess
from pathlib import Path

# ==== paths ====
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent                  # UniTask-ai-backend/
REQ_FILE = PROJECT_ROOT / "requirements.txt"
DOCKER_COMPOSE = PROJECT_ROOT / "docker-compose.yml"
TEST_DIR = PROJECT_ROOT / "test"                  # your tests live here
# ===============

SERVICE_URL = os.environ.get("SERVICE_URL", "http://localhost:8008")
WAIT_FOR_SERVICE = os.environ.get("WAIT_FOR_SERVICE", "1") == "1"  #The default is 1
WAIT_TIMEOUT = 45

ENV_UTF8 = os.environ.copy()
ENV_UTF8["PYTHONIOENCODING"] = "utf-8"

def sh(args, cwd=None, capture=True, check=True):
    """
    Run a command. If capture=True, capture and decode with UTF-8 safely.
    """
    if capture:
        return subprocess.run(
            args,
            cwd=cwd,
            check=check,
            text=True,
            encoding="utf-8",
            errors="replace",
            capture_output=True,
            env=ENV_UTF8,
        )
    else:
        # inherit stdout/stderr to avoid decode issues (e.g., docker on Windows)
        return subprocess.run(
            args,
            cwd=cwd,
            check=check,
            env=ENV_UTF8,
        )

def pip_install():
    print("Installing Python dependencies from requirements.txt ...")
    if not REQ_FILE.exists():
        raise FileNotFoundError(f"requirements.txt not found at: {REQ_FILE}")
    sh([os.sys.executable, "-m", "pip", "install", "-r", str(REQ_FILE)], cwd=PROJECT_ROOT)

def docker_up():
    print("Starting Docker containers ...")
    if not DOCKER_COMPOSE.exists():
        raise FileNotFoundError(f"docker-compose.yml not found at: {DOCKER_COMPOSE}")
    # do NOT capture output to avoid Windows GBK decode problem
    sh(["docker", "compose", "-f", str(DOCKER_COMPOSE), "up", "-d"], cwd=PROJECT_ROOT, capture=False)

def docker_down():
    print("Stopping Docker containers ...")
    sh(["docker", "compose", "-f", str(DOCKER_COMPOSE), "down"], cwd=PROJECT_ROOT, capture=False)

def wait_for_service(url: str, timeout: int):
    import urllib.request
    print(f"Waiting for service: {url} (timeout {timeout}s) ...")
    start = time.time()
    while time.time() - start < timeout:
        try:
            with urllib.request.urlopen(url, timeout=3) as resp:
                if 200 <= resp.status < 500:
                    print("Service is up.")
                    return
        except Exception:
            pass
        time.sleep(1)
    raise TimeoutError(f"Service not ready within {timeout} seconds: {url}")

def collect_counts():
    if not TEST_DIR.exists():
        return 0, 0
    res = sh(["pytest", "-q", "--collect-only", str(TEST_DIR)], cwd=PROJECT_ROOT, check=False)
    # handle "no tests collected"
    if res.returncode == 5 and "no tests collected" in (res.stdout or "").lower():
        return 0, 0
    if res.returncode not in (0, 5):
        print("Command failed: pytest --collect-only")
        print("---- STDOUT ----")
        print(res.stdout)
        print("---- STDERR ----")
        print(res.stderr)
        raise SystemExit(res.returncode)

    lines = [ln.strip() for ln in (res.stdout or "").splitlines() if ln.strip()]
    nodeids = [ln for ln in lines if "::" in ln and not ln.startswith("=")]
    total_tests = len(nodeids)
    suites = set(ni.split("::", 1)[0] for ni in nodeids)
    return total_tests, len(suites)

def run_pytest():
    res = sh(["pytest", str(TEST_DIR)], cwd=PROJECT_ROOT, check=False)
    out = res.stdout or ""
    m = re.search(r"(?P<passed>\d+)\s+passed.*?in\s+(?P<secs>[\d\.]+)s", out, re.I)
    passed = int(m.group("passed")) if m else 0
    m_failed = re.search(r"(?P<failed>\d+)\s+failed", out, re.I)
    failed = int(m_failed.group("failed")) if m_failed else 0
    secs = float(m.group("secs")) if m else 0.0

    if res.returncode not in (0, 5):
        print("Pytest failed.")
        print("---- STDOUT ----"); print(res.stdout)
        print("---- STDERR ----"); print(res.stderr)
        raise SystemExit(res.returncode)
    return passed, failed, secs


def print_summary(suites_total, tests_total, passed, failed, secs):
    suites_passed = suites_total if failed == 0 else max(0, suites_total - 1)
    print()
    print(f"Test Files: {suites_passed} passed, {suites_total} total")
    print(f"Tests: {passed} passed, {tests_total} total")
    print(f"Time: {secs:.3f} s")
    print(f"Ran all test suites matching /{TEST_DIR.name}*/i.")

def main():
    pip_install()
    docker_up()
    try:
        if WAIT_FOR_SERVICE:
            wait_for_service(SERVICE_URL, WAIT_TIMEOUT)
        tests_total, suites_total = collect_counts()
        passed, failed, secs = run_pytest()
    finally:
        docker_down()
    print_summary(suites_total, tests_total, passed, failed, secs)

if __name__ == "__main__":
    main()
