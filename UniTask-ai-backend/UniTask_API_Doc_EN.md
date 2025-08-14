# UniTask AI Backend

## Project Overview
**UniTask AI Backend** is a backend service designed for **learning and teaching support**, built with **Flask + PostgreSQL + SQLAlchemy**.  
It provides API endpoints for modules such as **Users, Courses, Assignments, FAQs, Forums, Q&A, and AI simulation**.  

This project is developed by the **UNSW UniTask AI** team as part of a course project, focusing on backend architecture, database integration, and core functionalities. It supports frontend integration (React/Vue) and can be extended with AI capabilities in the future.

---

## Tech Stack
- **Backend Framework**: Flask
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Containerization**: Docker, docker-compose
- **Testing Tools**: Postman / curl
- **AI Support**: Ollama / LM Studio (optional)

---

## Project Structure
```
UniTask-ai-backend/
├── config.py                 # Configuration file
├── create_tables.py          # Database initialization
├── docker-compose.yml        # Docker services configuration
├── Dockerfile                # Docker image definition
├── faq_search.py             # FAQ search and matching utility
├── integration_test_all.py   # Integrated testing script
├── main.py                   # Main application entry point
├── models.py                 # Database models
├── requirements.txt          # Python dependencies
├── routes/                   # API route modules
│   ├── auth.py               # User registration/login
│   ├── course.py             # Course endpoints
│   ├── assignment.py         # Assignment endpoints
│   ├── forum.py              # Forum endpoints
│   ├── question.py           # Student questions
│   ├── reply.py              # Replies
│   ├── faqs.py               # FAQ upload and retrieval
│   ├── qa.py                 # Q&A logic
│   ├── mock_ai.py            # Simulated AI (mock API)
│   ├── real_ai.py            # Real AI integration (in progress)
│   ├── mock_user.py          # In-memory mock users
│   └── user.py               # User management endpoints
├── data/                     # FAQ/test data
├── uploads/                  # Uploaded files (FAQ/assignment attachments)
├── test.py / test1.py        # Unit tests
└── UniTask_API_Doc_EN/CN.md  # API documentation
```

---

## Core Endpoints

### Users
- **Register**: `POST /api/register`
- **Login**: `POST /api/login`
- **User Management**: `routes/user.py`

### Courses & Assignments
- Course endpoints: `routes/course.py`
- Assignment endpoints: `routes/assignment.py`
- Each assignment automatically creates a related forum (`routes/forum.py`)

### Q&A & FAQs
- Student Questions: `routes/question.py`
- Replies: `routes/reply.py`
- FAQ Upload/Retrieval: `routes/faqs.py`
- FAQ Search: `faq_search.py`

### AI Modules
- Simulated AI: `routes/mock_ai.py` (mock API with hardcoded/simple logic)
- Real AI: `routes/real_ai.py` (supports Ollama/Mistral, in development)

---

## Future Development
1. Integrate JWT authentication.
2. Enhance FAQ upload, search, and AI endpoints.
3. Add complete Swagger documentation for all endpoints.
4. Implement automated testing and CI/CD.
5. Expand support for multiple courses and user roles.
