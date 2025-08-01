import os

DOCKER_ENV = os.getenv("UNITASK_DOCKER", "false").lower() == "true"

DB_HOST = "db" if DOCKER_ENV else "localhost"
DB_PORT = "5432"
DB_NAME = "unitask"
DB_USER = "postgres"
DB_PASSWORD = "0827"

SQLALCHEMY_DATABASE_URI = (
    f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

SQLALCHEMY_TRACK_MODIFICATIONS = False