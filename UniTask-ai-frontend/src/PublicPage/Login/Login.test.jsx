import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from './Login';
import api from '../../api';

// Mock the API module to control its behavior during tests
vi.mock('../../api');

// Mock the react-router-dom module to track navigation calls
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test to ensure a clean state
    vi.clearAllMocks();
  });

  // Test Case 1: Component renders correctly
  it('should render the login form correctly', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Check if the main elements are on the screen
    expect(screen.getByText('UniTask Login')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  // Test Case 2: Happy Path - Successful login for a tutor
  it('should log in a tutor successfully and navigate to the tutor dashboard', async () => {
    // Arrange: Set up the mock API response for a successful tutor login
    const mockTutorResponse = {
      token: 'fake-tutor-token',
      user: { id: 1, email: 'tutor@test.com', role: 'tutor' },
    };
    api.post.mockResolvedValue({ data: mockTutorResponse });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Act: Simulate user input and form submission
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'tutor@test.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    // Assert: Check that the API was called and navigation occurred
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/login', {
        email: 'tutor@test.com',
        password: 'password123',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/tutor');
    });
  });

  // Test Case 3: Happy Path - Successful login for a student
  it('should log in a student successfully and navigate to the student dashboard', async () => {
    // Arrange: Set up the mock API response for a successful student login
    const mockStudentResponse = {
      token: 'fake-student-token',
      user: { id: 2, email: 'student@test.com', role: 'student' },
    };
    api.post.mockResolvedValue({ data: mockStudentResponse });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Act: Simulate user input and form submission
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'student@test.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    // Assert: Check that the API was called and navigation occurred
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/login', {
        email: 'student@test.com',
        password: 'password123',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/student');
    });
  });

  // Test Case 4: Sad Path - Failed login with incorrect credentials
  it('should display an error message on failed login', async () => {
    // Arrange: Set up the mock API to reject the login attempt
    const errorMessage = 'Invalid credentials';
    api.post.mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Act: Simulate user input and form submission
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'wrong@test.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    // Assert: Check that an error message is displayed to the user
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // Ensure no navigation occurred
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
