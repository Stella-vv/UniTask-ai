// src/tutorworkspace/FaqModify/FaqModifyPage.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import FaqModifyPage from './FaqModifyPage';
import api from '../../api';

// Mock the API module
vi.mock('../../api');

// Mock react-router-dom hooks
const mockNavigate = vi.fn();
const mockAssignmentId = 'a1';
const mockFaqId = 'f1';
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ assignmentId: mockAssignmentId, faqId: mockFaqId }),
  };
});

// Mock data
const mockAssignmentData = { id: mockAssignmentId, name: 'Assignment 1' };
const mockFaqData = {
  id: mockFaqId,
  question: 'What is the original question?',
  answer: 'This is the original answer.',
};

describe('FaqModifyPage Component', () => {
  let confirmSpy;
  let alertSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.confirm and window.alert
    confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    // Mock localStorage for a logged-in user
    localStorage.setItem('user', JSON.stringify({ id: 1, email: 'tutor@test.com' }));
    // Default API mock for successful GET, PUT and DELETE
    api.get.mockImplementation((url) => {
      if (url.includes(`/assignments/detail/${mockAssignmentId}`)) {
        return Promise.resolve({ data: mockAssignmentData });
      }
      if (url.includes(`/faqs/${mockFaqId}`)) {
        return Promise.resolve({ data: mockFaqData });
      }
      return Promise.resolve({ data: {} });
    });
    api.put.mockResolvedValue({ data: { message: 'FAQ updated successfully' } });
    api.delete.mockResolvedValue({ data: { message: 'FAQ deleted successfully' } });
  });

  afterEach(() => {
    confirmSpy.mockRestore();
    alertSpy.mockRestore();
    localStorage.clear();
  });

  // Test Case 1: Happy Path - Renders and pre-fills form with fetched data
  it('should render the form with data fetched from the API', async () => {
    render(
      <BrowserRouter>
        <FaqModifyPage />
      </BrowserRouter>
    );

    // Assert: Check for loading state initially
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Assert: Wait for form fields to be populated
    expect(await screen.findByDisplayValue('What is the original question?')).toBeInTheDocument();
    expect(screen.getByDisplayValue('This is the original answer.')).toBeInTheDocument();
    expect(screen.getByText(`Modify FAQ for: ${mockAssignmentData.name}`)).toBeInTheDocument();
  });

  // Test Case 2: Sad Path - Displays an error message on initial data fetch failure
  it('should display an error message if the initial API call fails', async () => {
    // Arrange: Mock a failed API response
    api.get.mockRejectedValue(new Error('Network Error'));

    render(
      <BrowserRouter>
        <FaqModifyPage />
      </BrowserRouter>
    );

    // Assert: Wait for the error message to be displayed
    expect(await screen.findByText(/Failed to load FAQ data/i)).toBeInTheDocument();
  });

  // Test Case 3: Happy Path - Successful form submission
  it('should call the PUT API with updated data and navigate on success', async () => {
    render(
      <BrowserRouter>
        <FaqModifyPage />
      </BrowserRouter>
    );
    // Wait for the form to load its initial values
    const questionInput = await screen.findByDisplayValue('What is the original question?');
    const answerInput = screen.getByDisplayValue('This is the original answer.');

    // Act: Change a field and submit
    fireEvent.change(questionInput, { target: { value: 'Updated question' } });
    fireEvent.change(answerInput, { target: { value: 'Updated answer' } });
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    // Assert: API.put is called with the new data
    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith(`/faqs/${mockFaqId}`, {
        question: 'Updated question',
        answer: 'Updated answer',
      });
    });

    // Assert: Success alert is shown and navigation occurs
    expect(alertSpy).toHaveBeenCalledWith('FAQ updated successfully!');
    expect(mockNavigate).toHaveBeenCalledWith(`/tutor/assignment/${mockAssignmentId}/faqs`);
  });

  // Test Case 4: Sad Path - Form submission fails
  it('should display an error message if the API put call fails', async () => {
    // Arrange: Mock a failed PUT response
    api.put.mockRejectedValue({ response: { data: { message: 'Update failed' } } });

    render(
      <BrowserRouter>
        <FaqModifyPage />
      </BrowserRouter>
    );
    await screen.findByDisplayValue('What is the original question?'); // Wait for load

    // Act: Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    // Assert: Wait for the error message to be displayed
    await waitFor(() => {
        expect(screen.getByText(/Update failed/i)).toBeInTheDocument();
    });
    // Ensure no navigation occurred
    expect(mockNavigate).not.toHaveBeenCalled();
  });
  
  // Test Case 5: Happy Path - Successful FAQ deletion
  it('should call the DELETE API and navigate on successful deletion', async () => {
    render(
      <BrowserRouter>
        <FaqModifyPage />
      </BrowserRouter>
    );
    const deleteButton = await screen.findByRole('button', { name: /Delete/i });

    // Act
    fireEvent.click(deleteButton);

    // Assert
    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalled();
      expect(api.delete).toHaveBeenCalledWith(`/faqs/${mockFaqId}`);
    });
    expect(alertSpy).toHaveBeenCalledWith('FAQ deleted successfully!');
    expect(mockNavigate).toHaveBeenCalledWith(`/tutor/assignment/${mockAssignmentId}/faqs`);
  });
  
  // Test Case 6: Interaction - Delete is cancelled
  it('should NOT call the delete API if the user cancels the confirmation', async () => {
    // Arrange
    confirmSpy.mockReturnValue(false); // User clicks "Cancel"
    render(
      <BrowserRouter>
        <FaqModifyPage />
      </BrowserRouter>
    );
    const deleteButton = await screen.findByRole('button', { name: /Delete/i });

    // Act
    fireEvent.click(deleteButton);

    // Assert
    expect(confirmSpy).toHaveBeenCalled();
    expect(api.delete).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});