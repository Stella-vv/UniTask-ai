import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from './components/MainLayout';
import StudentMainLayout from './components/StudentMainLayout';
import LoginPage from './tutorworkspace/Login/Login';
import RegisterPage from './tutorworkspace/Register/Register';

// Tutor workspace imports
import Dashboard from './tutorworkspace/Dashboard/Dashboard'; 
import CourseDetail from './tutorworkspace/CourseDetail/CourseDetail';
import AssignmentUpload from './tutorworkspace/AssignmentUpload/AssignmentUpload';
import AssignmentDetail from './tutorworkspace/AssignmentDetail/AssignmentDetail'; 
import AssignmentForumPage from './tutorworkspace/Forum/AssignmentForumPage'; 
import AssignmentList from './tutorworkspace/AssignmentList/AssignmentListPage';
import QandAUploadPage from './tutorworkspace/QandA/QandAUploadPage';
import FaqList from './tutorworkspace/FaqList/FaqList';
import FaqUpload from './tutorworkspace/FaqUpload/FaqUpload';
// Student workspace imports
import StudentDashboard from './studentworkspace/Dashboard/Dashboard';
import StudentCourseDetail from './studentworkspace/CourseDetail/CourseDetail';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Tutor workspace routes */}
        <Route path="/" element={<MainLayout />}>
          {/* The index route now renders the DashboardPage */}
          <Route index element={<Dashboard />} />

          <Route path="course-detail" element={<CourseDetail />} /> 
          <Route path="Assignment" element={<AssignmentList />} />
          <Route path="assignments/:assignmentId/forum" element={<AssignmentForumPage />} />
          
          
          <Route path="assignment-upload" element={<AssignmentUpload />} />
          <Route path="assignment-detail" element={<AssignmentDetail />} />
          <Route path="assignment-detail/:assignmentId" element={<AssignmentDetail />} />
          <Route path="qnas" element={<QandAUploadPage />} />
          <Route path="faqs" element={<FaqList />} />
          <Route path="faq-upload" element={<FaqUpload />} />
          {/* You can add routes for other pages here later */}
          {/* For example, for highlighting to work on a "Courses" page: */}
          {/* <Route path="courses" element={<div>Courses Page</div>} /> */}
        </Route>

         {/* Student workspace routes */}
        <Route path="/student" element={<StudentMainLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="course-detail" element={<StudentCourseDetail />} />
          {/* Additional student routes will be added here */}
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;