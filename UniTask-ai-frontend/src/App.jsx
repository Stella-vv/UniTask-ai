import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// ... (imports remain the same)
import MainLayout from './components/MainLayout';
import StudentMainLayout from './components/StudentMainLayout';
import LoginPage from './PublicPage/Login/Login';
import RegisterPage from './PublicPage/Register/Register';
import ProtectedRoute from './components/ProtectedRoute';

// ... (Tutor component imports remain the same)

// Student component imports
import StudentDashboard from './studentworkspace/Dashboard/Dashboard';
import StudentCourseDetail from './studentworkspace/CourseDetail/CourseDetail';
import StudentAssignmentList from './studentworkspace/AssignmentList/AssignmentListPage';
import StudentAssignmentForumPage from './studentworkspace/Forum/AssignmentForumPage';
import StudentAssignmentDetail from './studentworkspace/AssignmentDetail/AssignmentDetail';
import StudentFaqList from './studentworkspace/FaqList/FaqList'; // Corrected casing
import ChatPage from './studentworkspace/Chat/ChatPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public & Tutor Routes remain the same --- */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute allowedRoles={['tutor']} />}>
          {/* ... Tutor routes ... */}
        </Route>

        {/* --- Student-only Protected Routes --- */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/student" element={<StudentMainLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="course-detail" element={<StudentCourseDetail />} />
            
            {/* --- MODIFIED: Restructured assignment routes for correct highlighting --- */}
            <Route path="assignment" element={<StudentAssignmentList />} />
            <Route path="assignment/:assignmentId" element={<StudentAssignmentDetail />} />
            <Route path="assignment/:assignmentId/help" element={<ChatPage />} />
            
            {/* Note: Forum route is different, assuming it's a shared resource or has its own logic */}
            <Route path="assignments/:assignmentId/forum" element={<StudentAssignmentForumPage />} />
            
            <Route path="faqs" element={<StudentFaqList />} />
          </Route>
        </Route>

        {/* --- Fallback routes --- */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<div>404 Page Not Found</div>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;