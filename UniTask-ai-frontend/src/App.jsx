import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from './components/MainLayout';
import LoginPage from './tutorworkspace/Login/Login';
import RegisterPage from './tutorworkspace/Register/Register';
import Dashboard from './tutorworkspace/Dashboard/Dashboard'; // Import the new DashboardPage
import CourseDetail from './tutorworkspace/CourseDetail/CourseDetail';
import AssignmentForumPage from './tutorworkspace/Forum/AssignmentForumPage'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* The index route now renders the DashboardPage */}
          <Route index element={<Dashboard />} />

          <Route path="course-detail" element={<CourseDetail />} /> 
          <Route path="assignments/:assignmentId/forum" element={<AssignmentForumPage />} />
          
          {/* You can add routes for other pages here later */}
          {/* For example, for highlighting to work on a "Courses" page: */}
          {/* <Route path="courses" element={<div>Courses Page</div>} /> */}
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;