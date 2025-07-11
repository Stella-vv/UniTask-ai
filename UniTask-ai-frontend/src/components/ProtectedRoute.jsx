// src/components/ProtectedRoute.jsx (New File)

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Check if the user is logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Check if the logged-in user has an authorized role
  if (!allowedRoles.includes(role)) {
    // If the role is not allowed, redirect to their own dashboard
    if (role === 'tutor') {
      return <Navigate to="/" replace />; // Tutor dashboard
    }
    if (role === 'student') {
      return <Navigate to="/student" replace />; // Student dashboard
    }
    // Fallback to login page for any other cases
    return <Navigate to="/login" replace />;
  }

  // If all checks pass, render the requested component
  return <Outlet />;
};

export default ProtectedRoute;