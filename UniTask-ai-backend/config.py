import os

# Check if running in Docker
DOCKER_ENV = os.getenv("UNITASK_DOCKER", "false").lower() == "true"

# Prefer DATABASE_URL if present (from .env)
SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")

# Optional fallback (only used if DATABASE_URL not set)
if not SQLALCHEMY_DATABASE_URI:
    DB_HOST = "db" if DOCKER_ENV else "localhost"
    DB_PORT = "5432"
    DB_NAME = "unitask"
    DB_USER = "postgres"
    DB_PASSWORD = "0827"
    
    SQLALCHEMY_DATABASE_URI = (
        f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )

SQLALCHEMY_TRACK_MODIFICATIONS = False
