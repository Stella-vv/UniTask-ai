import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts and Public Pages
import MainLayout from './components/MainLayout';
import StudentMainLayout from './components/StudentMainLayout';
import LoginPage from './PublicPage/Login/Login';
import RegisterPage from './PublicPage/Register/Register';

// Route Guard
import ProtectedRoute from './components/ProtectedRoute';

// Tutor Workspace Components
import Dashboard from './tutorworkspace/Dashboard/Dashboard';
import CourseList from './tutorworkspace/CourseList/CourseList';
import CourseAddPage from './tutorworkspace/CourseAdd/CourseAddPage';
import CourseDetail from './tutorworkspace/CourseDetail/CourseDetail';
import CourseModifyPage from './tutorworkspace/CourseModify/CourseModifyPage';
import AssignmentList from './tutorworkspace/AssignmentList/AssignmentListPage';
import AssignmentDetail from './tutorworkspace/AssignmentDetail/AssignmentDetail';
import AssignmentModifyPage from './tutorworkspace/AssignmentModify/AssignmentModifyPage';
import AssignmentUpload from './tutorworkspace/AssignmentUpload/AssignmentUpload';
import AssignmentForumPage from './tutorworkspace/Forum/AssignmentForumPage';
import QandAListPage from './tutorworkspace/QandAList/QandAListPage';
import QandAUploadPage from './tutorworkspace/QandA/QandAUploadPage';
import FaqList from './tutorworkspace/FaqList/FaqList';
import FaqUpload from './tutorworkspace/FaqUpload/FaqUpload';
import FaqModifyPage from './tutorworkspace/FaqModify/FaqModifyPage';


// Student Workspace Components
import StudentDashboard from './studentworkspace/Dashboard/Dashboard';
import StudentCourseDetail from './studentworkspace/CourseDetail/CourseDetail';
import StudentAssignmentList from './studentworkspace/AssignmentList/AssignmentListPage';
import StudentAssignmentDetail from './studentworkspace/AssignmentDetail/AssignmentDetail';
import StudentAssignmentForumPage from './studentworkspace/Forum/AssignmentForumPage';
import StudentFaqList from './studentworkspace/FaqList/FaqList';
import ChatPage from './studentworkspace/Chat/ChatPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* --- Tutor Routes (Fully Corrected and Unified Structure) --- */}
        <Route element={<ProtectedRoute allowedRoles={['tutor']} />}>
          <Route path="/tutor" element={<MainLayout />}>
            <Route index element={<Dashboard />} />

            {/* Course Routes */}
            <Route path="course" element={<CourseList />} />
            <Route path="course/add" element={<CourseAddPage />} />
            <Route path="course/:courseId" element={<CourseDetail />} />
            <Route path="course/modify/:courseId" element={<CourseModifyPage />} />

            {/* Assignment Routes */}
            <Route path="assignment" element={<AssignmentList />} />
            <Route path="assignment/upload" element={<AssignmentUpload />} />
            <Route path="assignment/:assignmentId" element={<AssignmentDetail />} />
            <Route path="assignment/modify/:assignmentId" element={<AssignmentModifyPage />} />
            
            {/* --- Assignment-Specific Q&A and FAQ Routes --- */}
            <Route path="assignment/:assignmentId/qnas" element={<QandAListPage />} />
            <Route path="assignment/:assignmentId/qnas/upload" element={<QandAUploadPage />} />
            <Route path="assignment/:assignmentId/faqs" element={<FaqList />} />
            <Route path="assignment/:assignmentId/faqs/upload" element={<FaqUpload />} />
            <Route path="assignment/:assignmentId/faqs/modify/:faqId" element={<FaqModifyPage />} />
            
            {/* Other functional routes */}
            <Route path="assignment/:assignmentId/forum" element={<AssignmentForumPage />} />
            
            {/* Obsolete global routes can be removed */}
            {/* <Route path="qnas" element={<QandAListPage />} /> */}
            {/* <Route path="faqs" element={<FaqList />} /> */}
          </Route>
        </Route>

        {/* --- Student Routes --- */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/student" element={<StudentMainLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="course-detail" element={<StudentCourseDetail />} />
            <Route path="assignment" element={<StudentAssignmentList />} />
            <Route path="assignment/:assignmentId" element={<StudentAssignmentDetail />} />
            <Route path="assignment/:assignmentId/help" element={<ChatPage />} />
            <Route path="assignments/:assignmentId/forum" element={<StudentAssignmentForumPage />} />
            <Route path="faqs" element={<StudentFaqList />} />
          </Route>
        </Route>

        {/* --- Fallback and unmatched routes --- */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;