// src/tutorworkspace/FaqUpload/FaqUpload.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import FaqUpload from './FaqUpload';
import api from '../../api';

// Mock the API module
vi.mock('../../api');

// Mock react-router-dom hooks
const mockNavigate = vi.fn();
const mockAssignmentId = 'a1';
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ assignmentId: mockAssignmentId }),
  };
});

// Mock data
const mockAssignmentData = { id: mockAssignmentId, name: 'Assignment 1' };

describe('FaqUpload Component', () => {
  let confirmSpy;
  let alertSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.confirm and window.alert
    confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    // Mock localStorage to simulate a logged-in user
    localStorage.setItem('user', JSON.stringify({ id: 1, email: 'tutor@test.com' }));
    // Default API mock for successful GET and POST
    api.get.mockResolvedValue({ data: mockAssignmentData });
    api.post.mockResolvedValue({ data: { message: 'FAQ uploaded successfully' } });
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    confirmSpy.mockRestore();
    alertSpy.mockRestore();
    localStorage.clear();
    consoleErrorSpy.mockRestore();
  });

  // Test Case 1: Happy Path - Renders the form correctly with assignment name
  it('should render the form with the assignment name after a successful API call', async () => {
    render(
      <BrowserRouter>
        <FaqUpload />
      </BrowserRouter>
    );

    // Assert: Wait for the header to be rendered with the mock data
    expect(await screen.findByText(`Upload FAQ for Assignment 1`)).toBeInTheDocument();
    
    // Assert: Check for form fields using their placeholder text
    expect(screen.getByPlaceholderText('Enter the question')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter the answer')).toBeInTheDocument();
    
    // Assert: Check for buttons
    expect(screen.getByRole('button', { name: /Confirm/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  // Test Case 2: Sad Path - Displays error messages for empty required fields
  it('should display validation errors for empty required fields on submit', async () => {
    render(
      <BrowserRouter>
        <FaqUpload />
      </BrowserRouter>
    );
    await screen.findByText(`Upload FAQ for Assignment 1`); // Wait for component to load

    // Act: Submit the empty form
    fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    // Assert: Check for validation error messages
    expect(await screen.findByText('Please enter a question.')).toBeInTheDocument();
    expect(screen.getByText('Please enter an answer.')).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  // Test Case 3: Happy Path - Successful form submission
  it('should submit the form with valid data and navigate on success', async () => {
    render(
      <BrowserRouter>
        <FaqUpload />
      </BrowserRouter>
    );
    await screen.findByText(`Upload FAQ for Assignment 1`); // Wait for component to load

    const questionInput = screen.getByPlaceholderText('Enter the question');
    const answerInput = screen.getByPlaceholderText('Enter the answer');

    // Act: Fill out the form
    fireEvent.change(questionInput, { target: { value: 'What is a FAQ?' } });
    fireEvent.change(answerInput, { target: { value: 'A frequently asked question.' } });
    fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    // Assert: The API is called with the correct payload
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/faqs/', {
        question: 'What is a FAQ?',
        answer: 'A frequently asked question.',
        uploaded_by: 1,
        assignment_id: mockAssignmentId,
      });
    });

    // Assert: Success alert is shown and navigation occurs
    expect(alertSpy).toHaveBeenCalledWith('FAQ uploaded successfully!');
    expect(mockNavigate).toHaveBeenCalledWith(`/tutor/assignment/${mockAssignmentId}/faqs`);
  });

  // Test Case 4: Sad Path - API call fails
  it('should display an alert and a console error if the API post call fails', async () => {
    // Arrange: Mock a failed POST response
    api.post.mockRejectedValue({ response: { data: { message: 'Upload failed' } } });

    render(
      <BrowserRouter>
        <FaqUpload />
      </BrowserRouter>
    );
    await screen.findByText(`Upload FAQ for Assignment 1`); // Wait for component to load

    // Act: Fill out the form and submit
    const questionInput = screen.getByPlaceholderText('Enter the question');
    const answerInput = screen.getByPlaceholderText('Enter the answer');
    fireEvent.change(questionInput, { target: { value: 'Test question' } });
    fireEvent.change(answerInput, { target: { value: 'Test answer' } });
    fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    // Assert: Wait for the alert and console error to be called
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Upload failed: Upload failed');
    });
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    // Ensure no navigation occurred
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  // Test Case 5: Interaction - Cancel button
  it('should navigate back to the FaqList page when the cancel button is clicked', async () => {
    render(
      <BrowserRouter>
        <FaqUpload />
      </BrowserRouter>
    );
    await screen.findByText(`Upload FAQ for Assignment 1`); // Wait for component to load

    // Act
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));

    // Assert
    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to cancel? Unsaved changes will be lost.');
    expect(mockNavigate).toHaveBeenCalledWith(`/tutor/assignment/${mockAssignmentId}/faqs`);
  });
});