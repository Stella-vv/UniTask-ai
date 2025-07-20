// src/App.jsx (Modified)

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 1. Import layouts and public pages
import MainLayout from './components/MainLayout';
import StudentMainLayout from './components/StudentMainLayout';
import LoginPage from './PublicPage/Login/Login';         // Corrected path
import RegisterPage from './PublicPage/Register/Register'; // Corrected path

// 2. Import the route guard
import ProtectedRoute from './components/ProtectedRoute';

// 3. Import all page components needed for routing
import Dashboard from './tutorworkspace/Dashboard/Dashboard';
import CourseDetail from './tutorworkspace/CourseDetail/CourseDetail';
import CourseModifyPage from './tutorworkspace/CourseModify/CourseModifyPage';
import AssignmentList from './tutorworkspace/AssignmentList/AssignmentListPage';
import AssignmentForumPage from './tutorworkspace/Forum/AssignmentForumPage';
import AssignmentUpload from './tutorworkspace/AssignmentUpload/AssignmentUpload';
import AssignmentDetail from './tutorworkspace/AssignmentDetail/AssignmentDetail';
import QandAUploadPage from './tutorworkspace/QandA/QandAUploadPage';
import FaqList from './tutorworkspace/FaqList/FaqList';
import FaqUpload from './tutorworkspace/FaqUpload/FaqUpload';

import StudentDashboard from './studentworkspace/Dashboard/Dashboard';
import StudentCourseDetail from './studentworkspace/CourseDetail/CourseDetail';
import StudentAssignmentList from './studentworkspace/AssignmentList/AssignmentListPage';
import StudentAssignmentForumPage from './studentworkspace/Forum/AssignmentForumPage';
import StudentAssignmentDetail from './studentworkspace/AssignmentDetail/AssignmentDetail'; 


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* --- Tutor-only Protected Routes --- */}
        <Route element={<ProtectedRoute allowedRoles={['tutor']} />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="course-detail" element={<CourseDetail />} />
            <Route path="course-modify/:courseId" element={<CourseModifyPage />} />
            <Route path="Assignment" element={<AssignmentList />} />
            <Route path="assignments/:assignmentId/forum" element={<AssignmentForumPage />} />
            <Route path="assignment-upload" element={<AssignmentUpload />} />
            <Route path="assignment-detail" element={<AssignmentDetail />} />
            <Route path="assignment-detail/:assignmentId" element={<AssignmentDetail />} />
            <Route path="qnas" element={<QandAUploadPage />} />
            <Route path="faqs" element={<FaqList />} />
            <Route path="faq-upload" element={<FaqUpload />} />
          </Route>
        </Route>

        {/* --- Student-only Protected Routes --- */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/student" element={<StudentMainLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="course-detail" element={<StudentCourseDetail />} />
            <Route path="assignment" element={<StudentAssignmentList />} />
            <Route path="assignment-detail/:assignmentId" element={<StudentAssignmentDetail />} />
            <Route path="assignments/:assignmentId/forum" element={<StudentAssignmentForumPage />} />
            {/* Future student pages can be added here */}
          </Route>
        </Route>

        {/* --- Fallback and unmatched routes --- */}
        {/* Redirect root access to login if not already handled by protected routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* A 404 page for any other unmatched paths */}
        <Route path="*" element={<div>404 Page Not Found</div>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;