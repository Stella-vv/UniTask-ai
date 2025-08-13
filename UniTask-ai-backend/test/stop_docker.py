import subprocess
import os

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(PROJECT_DIR)

try:
    print("Stopping Docker container...")
    subprocess.run(["docker", "compose", "down"], check=True)
    print("Docker is stopped")
except subprocess.CalledProcessError as e:
    print(f"Stop failure: {e}")
