import subprocess
import os


PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(PROJECT_DIR)

try:
    print("Starting Docker container...")
    subprocess.run(["docker", "compose", "up", "-d"], check=True)
    print("Docker is started")
except subprocess.CalledProcessError as e:
    print(f"Startup failure: {e}")
