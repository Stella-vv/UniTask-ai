// src/PublicPage/Register/Register.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Register from './Register';
import api from '../../api';

// Mock the API module
vi.mock('../../api');

// Mock the react-router-dom module for navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Register Component', () => {
  beforeEach(() => {
    // Clear mocks before each test, no fake timers needed
    vi.clearAllMocks();
  });

  // Test Case 1: Component renders all fields correctly
  it('should render the registration form correctly', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    expect(screen.getByText('UniTask Register')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/School/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Year/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
  });

  // Test Case 2: Happy Path - Successful user registration with default values
  it('should register a new user successfully and navigate to login', async () => {
    // Arrange: Mock a successful API response
    const successMessage = 'Registration successful!';
    api.post.mockResolvedValue({ data: { message: successMessage } });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    // Act: Simulate user filling out only the text input fields
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'newstudent@test.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'newpassword123' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    // Assert: Wait for the success message to appear
    expect(await screen.findByText(successMessage)).toBeInTheDocument();
    
    // Assert: Check that the API was called with correct data (including defaults)
    expect(api.post).toHaveBeenCalledWith('/register', {
        email: 'newstudent@test.com',
        password: 'newpassword123',
        role: 'student', // Default value from component state
        school: 'CSE',   // Default value from component state
        year: new Date().getFullYear(), // Default value from component state
    });

    // Assert: Wait for the navigation to be called after the 1s timeout
    await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    }, { timeout: 1100 }); // Set timeout slightly longer than the component's timeout
  });

  // Test Case 3: Sad Path - Registration fails (e.g., email already exists)
  it('should display an error message if registration fails', async () => {
    // Arrange: Mock a failed API response
    const errorMessage = 'Email already in use';
    api.post.mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    // Act: Simulate user input and form submission
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'existing@test.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    // Assert: Wait for the error message to appear
    expect(await screen.findByText(errorMessage)).toBeInTheDocument();

    // Ensure navigation did not happen
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});