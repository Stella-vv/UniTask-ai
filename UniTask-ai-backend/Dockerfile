# Dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

ENV UNITASK_MOCK=false
EXPOSE 8008

CMD ["python", "main.py"]