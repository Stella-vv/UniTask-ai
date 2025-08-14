# UniTask AI: Full-Stack Educational Management Platform

UniTask AI is a modern frontend application for an educational management platform, built with React. It is designed for both tutors and students and is combined with a robust backend system. The platform offers features such as course management, assignment handling, forum discussions, and FAQ management.

---

## **Project Overview**

The platform consists of two main components:

* **Frontend**: A Single Page Application (SPA) built with React 18 and Vite. It uses the Material-UI component library and supports both **tutor** and **student** roles with dedicated modules and permission controls.
* **Backend**: A powerful API built with the Flask framework and containerized for easy setup using Docker. It handles all business logic, user management, database operations through PostgreSQL, and integration with a local Ollama AI service.

---

## **Features**

The application provides distinct functionalities tailored to the two primary user roles.

### **Tutor Features**

* **Dashboard**: An overview of teaching activities with statistics for courses and assignments.
* **Course Management**: Tutors can view, create, modify, and delete courses. The backend provides full CRUD operations for courses.
* **Assignment Management**: Tutors can upload and manage assignments, including setting due dates, descriptions, and attachments. The backend automatically creates an associated forum upon assignment creation.
* **Forum Management**: Manage discussion forums related to specific assignments.
* **Q&A Management**: Upload and manage Q&A files for assignments. The backend provides endpoints to upload, list, delete, and download these files.
* **FAQ Management**: Upload and manage Frequently Asked Questions. The backend supports full CRUD operations for FAQs.

### **Student Features**

* **Dashboard**: A personal overview of learning activities.
* **Course Viewing**: Browse the course list and view detailed information for each course.
* **Assignment Viewing**: View assignment lists and their detailed requirements.
* **Forum Participation**: Ask questions and discuss topics in assignment-specific forums.
* **FAQ Viewing**: Access Frequently Asked Questions published by tutors.
* **AI Assistant**: Get help with assignments by asking questions to an intelligent chat assistant. This endpoint leverages a local Ollama model to answer questions based on assignment context and FAQs.

---

## **Technology Stack**

| Component | Technology |
| --- | --- |
| **Frontend Framework** | React 18.2.0 |
| **Backend Framework** | Flask |
| **Database & ORM** | PostgreSQL with SQLAlchemy |
| **AI Service** | Ollama (faq-mistral model) |
| **Containerization** | Docker & Docker Compose |
| **UI Library** | Material-UI 7.1.2+ |
| **Build Tool** | Vite 6.3.5 |
| **Frontend Routing** | React Router DOM 6.30.1 |
| **HTTP Client** | Axios 1.10.0 |
| **Testing** | **Frontend:** Vitest & React Testing Library <br> **Backend:** Pytest |
| **Code Linting** | ESLint 9.25.0 |

---

## **System Setup and Quick Start**

### **Prerequisites**

* **Node.js**: v20.17.0 or higher
* **Package Manager**: npm or yarn
* **Docker and Docker Compose**

### **1. Backend Setup**

The backend service stack is containerized for easy setup.

```bash
# Navigate to the backend directory
cd UniTask-ai-backend

# Create the environment file from the example
cp .env.example .env

# Build and start the containers
docker compose up
```

The backend API will be running and accessible.

---

### **2. Frontend Setup
Once the backend is operational, set up the frontend application.

```bash
# In a new terminal, navigate to the frontend directory
cd UniTask-ai-frontend

# Install dependencies
npm install
```

Next, create a .env file in the UniTask-ai-frontend directory and configure it to connect to the backend API:

```bash
VITE_BACKEND_URL=http://localhost:8008/api
```

### **3. Start Development Servers
Backend: The docker compose up command will keep the backend services running.

Frontend:
```bash
# Start the frontend development server
npm run dev
```

The frontend application will be available at http://localhost:5173.

---

## Project Structure

### Frontend (UniTask-ai-frontend)
```
UniTask-ai-frontend/
├── src/                    # Source code
│   ├── api/                # API Configuration
│   ├── components/         # Global shared React components
│   ├── PublicPage/         # Pages accessible without authentication
│   ├── studentworkspace/   # All modules for the Student Workspace
│   ├── tutorworkspace/     # All modules for the Tutor Workspace
│   ├── App.jsx             # Main application component with route configuration
│   └── main.jsx            # Application entry point
├── .env                    # Environment variables
├── package.json            # Project dependencies and scripts configuration
└── vite.config.js          # Vite configuration file
```

### Backend (UniTask-ai-backend)
```
UniTask-ai-backend/
├── routes/                 # API route blueprints
├── test/                   # Pytest integration tests
├── uploads/                # Directory for user-uploaded files
├── main.py                 # Flask application entry point
├── models.py               # SQLAlchemy database models
├── Dockerfile              # Docker configuration for the Flask app
└── docker-compose.yml      # Docker Compose for all services
```

---

## API Endpoints
The backend provides a comprehensive set of API endpoints for all platform features.

1. User Authentication: POST /api/register, POST /api/login.

2. Courses: GET /api/courses/, POST /api/courses/, GET /api/courses/<id>, PUT /api/courses/<id>, DELETE /api/courses/<id>.

3. Assignments: GET /api/assignments, POST /api/assignments (multipart/form-data), GET /api/assignments/detail/<id>, PUT /api/assignments/<id> (multipart/form-data), DELETE /api/assignments/<id>, GET /api/assignments/download/<filename>.

4. Forum, Questions & Replies: GET /api/forum/<assignment_id>, GET /api/forum/<forum_id>/questions, POST /api/forum/<forum_id>/questions, POST /api/replies.

5. FAQs: GET /api/faqs/, POST /api/faqs/, GET /api/faqs/assignment/<assignment_id>, GET /api/faqs/<id>, PUT /api/faqs/<id>, DELETE /api/faqs/<id>.

6. Q&A Files: POST /api/qa/upload (multipart/form-data), GET /api/qa/assignment/<assignment_id>/uploads, DELETE /api/qa/delete/<id>, GET /api/qa/download/<id>.

7. AI Assistant: POST /api/ai/ask which takes a query and an assignment_id.

## Authentication and Authorization
The project uses Role-Based Access Control (RBAC).

1. Tutor Role (tutor): Full access to tutor features.

2. Student Role (student): Access to student features.

Authentication is implemented through the ProtectedRoute component, which redirects unauthenticated users to the login page.

## Testing
1. Frontend: The project uses Vitest as its testing framework, combined with the React Testing Library (RTL) for user-centric tests. All tests use API mocking (vi.mock). To run all tests, use npm test.

2. Backend: The backend uses Pytest for integration tests.

---

UniTask AI - Making educational management smarter and more efficient!
