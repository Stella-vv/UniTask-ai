import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from './components/MainLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage'; // Import the new DashboardPage

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* The index route now renders the DashboardPage */}
          <Route index element={<DashboardPage />} />
          
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