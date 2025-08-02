# Dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY . /app

RUN apt-get update && apt-get install -y netcat-openbsd && \
    pip install --no-cache-dir -r requirements.txt && \
    apt-get clean && rm -rf /var/lib/apt/lists/*


ENV UNITASK_MOCK=false
EXPOSE 8008

CMD ["sh", "-c", "\
  until nc -z db 5432; do \
    echo 'Waiting for PostgreSQL...'; sleep 1; \
  done; \
  echo 'PostgreSQL is up! Starting backend...'; \
  python create_tables.py && python main.py "]