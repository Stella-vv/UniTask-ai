# 📦  UniTask Installation Guide (Docker Method)

This project uses Flask + PostgreSQL for backend services. It is recommended to use Docker for one-click deployment.

---

## 🧰 Prerequisites

Please ensure you have installed:

- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## 📁 Project Structure (Key Files)

```
unitask-backend/
├── app.py
├── main.py
├── create_tables.py
├── config.py
├── models.py
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── INSTALL.md
└── routes/
```

---

## 🚀 One-Click Backend Startup

### 1️⃣ One-Click Backend Startup

```bash
git clone https://github.com/unsw-cse-comp99-3900/capstone-project-25t2-9900-f18a-bread.git
cd unitask-backend
```

### 2️⃣ Prepare Environment Variables

Copy `.env.example` to `.env`：

```bash
cp .env.example .env
```

You can run with default values. You may also modify the database connection string or MOCK mode as needed.

---

### 3️⃣ Build and Start the Project

Run the following command:

```bash
docker compose up
```

In a new terminal, run:
```bash
docker exec -it unitask-ai-backend-db-1 psql -U postgres
```

Enter the database and reset the password:
```bash
ALTER USER postgres WITH PASSWORD '0827';
```

After seeing ALTER ROLE, type:
```bash
\q
```

Go back to the previous terminal and rerun:
```bash
docker compose down
docker compose up --build
```

In a new terminal, run the test file:
```bash
docker exec -it unitask-ai-backend-backend-1 python integration_test_all.py
```

The first build may take a few minutes. It will automatically:

- Pull the PostgreSQL image
- Build the Flask image
- Initialize database tables (`create_tables.py`)
- Start the Flask app

---

Deploy AI model:
```bash
docker exec -it ollama bash
```
Enter root:
```bash
ls /data
```
Create the model:
```bash
ollama create faq-mistral -f /data/Modelfile
```
Verify creation:
```bash
ollama list
```
If you see `faq-mistral:latest    017b7c39c717    4.4 GB`, the deployment is successful.

### 4️⃣ Start the Frontend
```bash
cd UniTask-ai-frontend
npm install
npm run dev
```

### 5️⃣ Access the Backend API

Open in browser or Postman:

```
http://localhost:8008
```

You should see:

```
UniTask backend connected to PostgreSQL!
```

---

## 🔐 Environment Variables (.env)

You need to create a `.env` file in the root directory of the project with the following content:

```env
UNITASK_MOCK=false
UNITASK_DOCKER=true
DATABASE_URL=postgresql://unitask:unitask123@db:5432/unitask_db
```

**Note: Do not upload the `.env` file. Only provide `.env.example` as a reference.**

---

## 🧪 API Testing (Examples)

Use curl or Postman for testing:

### Register API (POST `/api/register`)

```json
{
  "email": "test@example.com",
  "password": "abc123",
  "role": "tutor"
}
```

### Login API (POST `/api/login`)

```json
{
  "email": "test@example.com",
  "password": "abc123"
}
```

---

## ❓FAQ

### ❗Why can't I access `http://localhost:8008`?

Please check:

- Whether Docker has started successfully
- Whether `.env` is configured correctly (MOCK should be false)
- Whether VPN is occupying the port

---

## 📎 Additional Notes

- Default backend port: `8008`, can be modified in `main.py`
- PostgreSQL port: `5432`
- All API endpoints are prefixed with: `/api/`

---

## ✅ Features Implemented

- User registration and login
- PostgreSQL database connection
- SQLAlchemy ORM managing tables for users, courses, FAQs, etc.
- MOCK mode support (`UNITASK_MOCK=true`)
- Clear blueprint routing structure for easy extension

---

Thank you for using UniTask 🎓. If you have any questions, feel free to contact the developers!