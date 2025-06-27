# UniTask Backend API Documentation

This document describes the currently implemented backend features and API endpoints of the UniTask system.

---

## ✅ Features Implemented

- User Registration (`/api/register`)
- User Login (`/api/login`)
- PostgreSQL database connection
- SQLAlchemy ORM model for 5 core tables:
  - users
  - courses
  - questions
  - messages
  - faqs

---

## 🔐 User Registration

- **URL**: `/api/register`
- **Method**: POST
- **Request JSON**:

```json
{
  "email": "example@unsw.edu.au",
  "password": "abc123",
  "role": "tutor"
}
```

- **Response**:
  - 201 Created if successful
  - 400 if missing fields
  - 409 if email already exists

---

## 🔑 User Login

- **URL**: `/api/login`
- **Method**: POST
- **Request JSON**:

```json
{
  "email": "example@unsw.edu.au",
  "password": "abc123"
}
```

- **Response**:
  - 200 OK with user info if successful
  - 400 if missing fields
  - 401 if login fails

---

## 🛠 Technology Stack

- Flask (backend framework)
- SQLAlchemy (ORM)
- PostgreSQL (database)
- Postman / curl (API testing)

---

## 📁 Project Structure

```
unitask-backend/
├── app.py
├── config.py
├── models.py
├── routes/
│   └── user.py
```

---

## 🚀 Next Steps

- Token-based authentication (JWT)
- FAQ upload and listing endpoints
- Assignment & messaging features