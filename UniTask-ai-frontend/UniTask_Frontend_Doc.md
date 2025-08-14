# UniTask AI Frontend

UniTask AI is a modern educational management platform frontend application based on React, designed for tutors and students, providing features such as course management, assignment management, forum discussions, FAQ management, and more.

## Project Overview

The UniTask AI frontend is a Single Page Application (SPA) built with React 19 and Vite, using the Material-UI component library to deliver a modern user interface. The project supports both tutor and student roles, offering different modules and permission controls.

## Features

### Tutor Features
- **Dashboard** - Course overview and statistics  
- **Course Management** - View and modify course details  
- **Assignment Management** - Upload, edit, and view assignment details  
- **Forum Management** - Discussion areas related to assignments  
- **Q&A Management** - Upload and manage Q&A files  
- **FAQ Management** - Upload FAQs and view FAQ list  

### Student Features
- **Dashboard** - Personal learning overview  
- **Course Viewing** - Course details and progress  
- **Assignment Viewing** - Assignment list and details  
- **Forum Participation** - Assignment discussion areas  
- **FAQ Viewing** - Access to frequently asked questions  
- **AI Assistant** - Intelligent chat assistance  

## Tech Stack

- **Frontend Framework**: React 19.1.0  
- **Build Tool**: Vite 6.3.5  
- **Routing**: React Router DOM 7.6.2  
- **UI Library**: Material-UI 7.1.2  
- **HTTP Client**: Axios 1.10.0  
- **Styling**: Emotion (CSS-in-JS)  
- **Font**: Poppins  
- **Code Linting**: ESLint 9.25.0  

## Project Structure
\`\`\`
src/
├── api/                  # API configuration
│   └── index.js          # Axios instance and interceptors
├── components/           # Shared components
│   ├── MainLayout.jsx    # Tutor main layout
│   ├── StudentMainLayout.jsx # Student main layout
│   ├── ProtectedRoute.jsx    # Route protection component
│   └── Sidebar.jsx       # Sidebar component
├── PublicPage/           # Public pages
│   ├── Login/            # Login page
│   └── Register/         # Registration page
├── tutorworkspace/       # Tutor workspace
│   ├── Dashboard/        # Dashboard
│   ├── CourseDetail/     # Course details
│   ├── CourseModify/     # Course modification
│   ├── AssignmentList/   # Assignment list
│   ├── AssignmentUpload/ # Assignment upload
│   ├── AssignmentDetail/ # Assignment details
│   ├── AssignmentModify/ # Assignment modification
│   ├── Forum/            # Forum
│   ├── QandA/            # Q&A upload
│   ├── QandAList/        # Q&A list
│   ├── FaqUpload/        # FAQ upload
│   └── FaqList/          # FAQ list
├── studentworkspace/     # Student workspace
│   ├── Dashboard/        # Student dashboard
│   ├── CourseDetail/     # Course details
│   ├── AssignmentList/   # Assignment list
│   ├── AssignmentDetail/ # Assignment details
│   ├── Forum/            # Forum
│   ├── FaqList/          # FAQ list
│   └── Chat/             # AI chat assistant
├── theme/                # Theme configuration
│   └── theme.js          # Material-UI theme
├── App.jsx               # Main application component
└── main.jsx              # Application entry point
\`\`\`

## Quick Start

### Prerequisites
- Node.js 18.0 or higher  
- npm or yarn package manager  

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
3. Add permission control if needed  

### API Calls
Use the configured Axios instance from \`src/api/index.js\`:
\`\`\`javascript
import api from '../api';

// GET request
const response = await api.get('/endpoint');

// POST request
const response = await api.post('/endpoint', data);
\`\`\`

### Styling
Use Material-UI's \`styled\` for styling:
\`\`\`javascript
import { styled } from '@mui/material/styles';

const StyledComponent = styled('div')(({ theme }) => ({
  // Style definitions
}));
\`\`\`

## Scripts

- \`npm run dev\` - Start the development server  
- \`npm run build\` - Build for production  
- \`npm run preview\` - Preview the production build  
- \`npm run lint\` - Run code linting  

## Contribution Guide

1. Fork the repository  
2. Create a feature branch (\`git checkout -b feature/AmazingFeature\`)  
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)  
4. Push to the branch (\`git push origin feature/AmazingFeature\`)  
5. Open a Pull Request  

---

**UniTask AI Frontend** - Making educational management smarter and more efficient!
