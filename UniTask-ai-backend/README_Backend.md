# UniTask Backend API Documentation

This document provides a comprehensive overview of the UniTask AI backend system, detailing all available API endpoints, features, and setup instructions.

---

## Backend startup

The backend service stack (Flask App, PostgreSQL, Ollama AI) is containerized for easy setup.

### 1. Prepare Environment File
First, clone the repository. Then, in the `UniTask-ai-backend` directory, copy the example environment file:
```bash
cp .env.example .env
```

### 2. Build and Start Services
Run Docker Compose from the UniTask-ai-backend directory:
```bash
docker compose up
```

## Features Implemented

- User Management: Registration and login for student and tutor roles.

- Course Management: Full CRUD operations for courses.

- Assignment Management: Full CRUD with file uploads (rubrics, attachments). Automatically creates an associated forum upon assignment creation.

- Forum & Replies: Endpoints for creating and retrieving forum questions and replies.

- FAQ Management: Full CRUD operations for assignment-specific FAQs.

- Q&A File Handling: Endpoints to upload, list, delete, and download Q&A files (e.g., CSV) for assignments.

- AI Assistant: An endpoint that leverages a local Ollama model to answer questions based on assignment context and FAQs.

- Database: PostgreSQL managed via Flask-SQLAlchemy, with a clear data model structure.

---


## Technology Stack

- Backend Framework: Flask
- Database: PostgreSQL
- ORM: SQLAlchemy
- Containerization: Docker & Docker Compose
- AI Service: Ollama (faq-mistral model)
- Testing: Pytest

---

## Project Structure

```
UniTask-ai-backend/
├── routes/                 # API route blueprints
│   ├── user.py
│   ├── course.py
│   ├── assignment.py
│   ├── forum.py
│   ├── reply.py
│   ├── faqs.py
│   ├── qa.py
│   └── real_ai.py
├── test/                   # Pytest integration tests
│   ├── test_auth.py
│   ├── test_course.py
│   └── ...
├── uploads/                # Directory for user-uploaded files
├── main.py                 # Flask application entry point
├── models.py               # SQLAlchemy database models
├── config.py               # Database and app configuration
├── requirements.txt        # Python dependencies
├── Dockerfile              # Docker configuration for the Flask app
└── docker-compose.yml      # Docker Compose for all services
```

---

## API Endpoints

### 1. User Authentication

#### Register
-   **URL**: `/api/register`
-   **Method**: `POST`
-   **Request JSON**:
    ```json
    {
      "email": "user@example.com",
      "password": "securepassword123",
      "role": "student",
      "school": "CSE",
      "year": 2025
    }
    ```
-   **Response**: `201 Created` with user object, `409 Conflict` if email exists.

#### Login
-   **URL**: `/api/login`
-   **Method**: `POST`
-   **Request JSON**:
    ```json
    {
      "email": "user@example.com",
      "password": "securepassword123"
    }
    ```
-   **Response**: `200 OK` with user object and token, `401 Unauthorized` on failure.

---

### 2. Courses

-   `GET /api/courses/`: Get all courses.
-   `POST /api/courses/`: Create a new course.
-   `GET /api/courses/<id>`: Get a single course.
-   `PUT /api/courses/<id>`: Update a course.
-   `DELETE /api/courses/<id>`: Delete a course.

---

### 3. Assignments

-   `GET /api/assignments`: Get all assignments.
-   `POST /api/assignments`: Create an assignment. **Note**: This is a `multipart/form-data` request, not JSON. It accepts form fields (`name`, `description`, `due_date`, etc.) and file uploads (`rubric`, `attachment`).
-   `GET /api/assignments/detail/<id>`: Get details for one assignment.
-   `PUT /api/assignments/<id>`: Update an assignment (also `multipart/form-data`).
-   `DELETE /api/assignments/<id>`: Delete an assignment.
-   `GET /api/assignments/download/<filename>`: Download an associated file.

---

### 4. Forum, Questions & Replies

-   `GET /api/forum/<assignment_id>`: Get the forum associated with an assignment.
-   `GET /api/forum/<forum_id>/questions`: Get all questions and their replies for a forum.
-   `POST /api/forum/<forum_id>/questions`: Post a new question.
-   `POST /api/replies`: Post a reply to a question.

---

### 5. FAQs

-   `GET /api/faqs/`: Get all FAQs from the database.
-   `POST /api/faqs/`: Create a new FAQ.
-   `GET /api/faqs/assignment/<assignment_id>`: Get all FAQs for a specific assignment.
-   `GET /api/faqs/<id>`: Get a single FAQ by its ID.
-   `PUT /api/faqs/<id>`: Update an FAQ.
-   `DELETE /api/faqs/<id>`: Delete an FAQ.

---

### 6. Q&A Files

-   `POST /api/qa/upload`: Upload a Q&A file (`multipart/form-data`).
-   `GET /api/qa/assignment/<assignment_id>/uploads`: List all uploaded Q&A files for an assignment.
-   `DELETE /api/qa/delete/<id>`: Delete an uploaded Q&A file.
-   `GET /api/qa/download/<id>`: Download a specific Q&A file.

---

### 7. AI Assistant

-   **URL**: `/api/ai/ask`
-   **Method**: `POST`
-   **Request JSON**:
    ```json
    {
      "query": "What is the due date for this assignment?",
      "assignment_id": 1
    }
    ```
-   **Response**: `200 OK` with the AI-generated answer.
    ```json
    {
      "answer": "The due date is 2025-07-10 23:59.",
      "prompt": "..."
    }
    ```