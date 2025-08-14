
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import ProtectedRoute from './ProtectedRoute';

// A simple component to render inside the protected route for successful cases
const ProtectedComponent = () => <div>Protected Content</div>;
const LoginPage = () => <div>Login Page</div>;
const StudentHomePage = () => <div>Student Home Page</div>;

describe('ProtectedRoute Component', () => {

  // Clean up localStorage after each test to ensure test isolation
  afterEach(() => {
    localStorage.clear();
  });

  // Test Case 1: Sad Path - User is not authenticated (no token)
  it('should redirect to the login page if the user is not authenticated', () => {
    // Arrange: Ensure no token is in localStorage
    localStorage.removeItem('token');

    // Act: Render the ProtectedRoute. We use MemoryRouter to simulate routing.
    render(
      <MemoryRouter initialEntries={['/tutor']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute allowedRoles={['tutor']} />}>
            <Route path="/tutor" element={<ProtectedComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Assert: The user should see the Login Page content, not the protected content.
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  // Test Case 2: Sad Path - User is authenticated but has the wrong role
  it('should redirect to their respective home page if the user role is not allowed', () => {
    // Arrange: Simulate a logged-in student
    localStorage.setItem('token', 'fake-student-token');
    localStorage.setItem('role', 'student');

    // Act: Render the ProtectedRoute, trying to access a tutor-only route
    render(
      <MemoryRouter initialEntries={['/tutor']}>
        <Routes>
          <Route path="/student" element={<StudentHomePage />} />
          <Route element={<ProtectedRoute allowedRoles={['tutor']} />}>
            <Route path="/tutor" element={<ProtectedComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Assert: The student is redirected to the student home page.
    expect(screen.getByText('Student Home Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  // Test Case 3: Happy Path - User is authenticated and has the correct role
  it('should render the component if the user is authenticated and has an allowed role', () => {
    // Arrange: Simulate a logged-in tutor
    localStorage.setItem('token', 'fake-tutor-token');
    localStorage.setItem('role', 'tutor');

    // Act: Render the ProtectedRoute for a tutor-only route
    render(
      <MemoryRouter initialEntries={['/tutor']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute allowedRoles={['tutor']} />}>
            <Route path="/tutor" element={<ProtectedComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Assert: The tutor can see the protected content.
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });
});
