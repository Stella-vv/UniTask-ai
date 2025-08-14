# UniTask AI Frontend Documentation

UniTask AI is a modern frontend application for an educational management platform, built with React. It is designed for both tutors and students, providing features such as course management, assignment handling, forum discussions, and FAQ management.

## Project Overview

The UniTask AI frontend is a Single Page Application (SPA) built with React 18 and Vite. It uses the Material-UI component library to deliver a modern user interface. The project supports both **tutor** and **student** roles, offering dedicated modules and permission controls for each.

## Features

### Tutor Features
- **Dashboard**: An overview of teaching activities with statistics for courses and assignments.
- **Course Management**: Tutors can view, create, modify, and delete courses.
- **Assignment Management**: Tutors can upload and manage assignments, including setting due dates, descriptions, and attachments.
- **Forum Management**: Manage discussion forums related to specific assignments.
- **Q&A Management**: Upload and manage Q&A files for assignments.
- **FAQ Management**: Upload and manage Frequently Asked Questions.

### Student Features
- **Dashboard**: A personal overview of learning activities.
- **Course Viewing**: Browse the course list and view detailed information for each course.
- **Assignment Viewing**: View assignment lists and their detailed requirements.
- **Forum Participation**: Ask questions and discuss topics in assignment-specific forums.
- **FAQ Viewing**: Access Frequently Asked Questions published by tutors.
- **AI Assistant**: Get help with assignments by asking questions to an intelligent chat assistant.

## Tech Stack

- **Frontend Framework**: React 18.2.0
- **Build Tool**: Vite 6.3.5
- **Routing**: React Router DOM 6.30.1
- **UI Library**: Material-UI 7.1.2+
- **HTTP Client**: Axios 1.10.0
- **Styling**: Emotion (CSS-in-JS)
- **Font**: Poppins
- **Code Linting**: ESLint 9.25.0

## Project Structure
\`\`\`
src/
├── api/                  # API Configuration
│   └── index.js          # Axios instance and interceptors
├── components/           # Shared Components
│   ├── MainLayout.jsx    # Tutor main layout
│   ├── StudentMainLayout.jsx # Student main layout
│   ├── ProtectedRoute.jsx    # Route protection component
│   ├── Sidebar.jsx       # Tutor sidebar
│   └── StudentSidebar.jsx # Student sidebar
├── PublicPage/           # Public Pages
│   ├── Login/            # Login page
│   └── Register/         # Registration page
├── tutorworkspace/       # Tutor Workspace Modules
│   ├── Dashboard/
│   ├── CourseList/
│   ├── CourseDetail/
│   ├── CourseAdd/
│   ├── CourseModify/
│   ├── AssignmentList/
│   ├── AssignmentUpload/
│   ├── AssignmentDetail/
│   ├── AssignmentModify/
│   ├── Forum/
│   ├── QandA/
│   ├── QandAList/
│   ├── FaqUpload/
│   └── FaqList/
├── studentworkspace/     # Student Workspace Modules
│   ├── Dashboard/
│   ├── CourseList/
│   ├── CourseDetail/
│   ├── AssignmentList/
│   ├── AssignmentDetail/
│   ├── Forum/
│   ├── FaqList/
│   └── Chat/             # AI Chat Assistant
├── theme/                # Theme Configuration
│   └── theme.js          # Material-UI theme
├── App.jsx               # Main application component & routing
└── main.jsx              # Application entry point
\`\`\`

## Quick Start

### Prerequisites
- **Node.js**: v20.17.0 or higher
- **Package Manager**: npm or yarn

### Install Dependencies
\`\`\`bash
cd UniTask-ai-frontend
npm install
\`\`\`

### Environment Configuration
Create a \`.env\` file and configure the backend API URL:
\`\`\`env
VITE_BACKEND_URL=http://localhost:8008/api
\`\`\`

### Start Development Server
\`\`\`bash
npm run dev
\`\`\`
The app will be available at \`http://localhost:5173\`

### Build for Production
\`\`\`bash
npm run build
\`\`\`

### Preview Production Build
\`\`\`bash
npm run preview
\`\`\`

### Testing
The project uses Vitest as its testing framework, combined with the React Testing Library (RTL) for writing user-centric tests. All tests use API mocking (vi.mock) to ensure the frontend tests are independent and stable.

To run all tests:
\`\`\`bash
npm test
\`\`\`

## Authentication

The project uses Role-Based Access Control (RBAC):
- **Tutor Role** (\`tutor\`): Full access to tutor features  
- **Student Role** (\`student\`): Access to student features  

Authentication is implemented through the \`ProtectedRoute\` component. Unauthenticated users are redirected to the login page.

## UI/UX Design

- Based on Material-UI design system  
- Responsive design for desktop and mobile  
- Consistent theme colors and typography  
- Intuitive navigation and user-friendly interface  

## Development Guide

### Adding a New Page
1. Create a new component in the respective workspace directory  
2. Add the route configuration in \`App.jsx\`  
3. If required, protect the new route using ProtectedRoute.

### API Calls
Use the configured Axios instance from \`src/api/index.js\`:
\`\`\`javascript
import api from '../api';

// GET request
const response = await api.get('/endpoint');

// POST request
const response = await api.post('/endpoint', data);
\`\`\`

## Scripts

- \`npm run dev\` - Start the development server  
- \`npm run build\` - Build for production  
- \`npm run preview\` - Preview the production build  
- \`npm run lint\` - Run code linting  
- \`npm run test\` - Runs all Vitest test suites.

---

**UniTask AI Frontend** - Making educational management smarter and more efficient!
