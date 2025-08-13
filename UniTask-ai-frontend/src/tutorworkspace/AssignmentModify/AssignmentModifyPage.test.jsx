// src/tutorworkspace/AssignmentModify/AssignmentModifyPage.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AssignmentModifyPage from './AssignmentModifyPage';
import api from '../../api';

// Mock the API module
vi.mock('../../api');

// Mock react-router-dom hooks
const mockNavigate = vi.fn();
const mockAssignmentId = '42';
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ assignmentId: mockAssignmentId }),
  };
});

// Mock initial data for the assignment
const mockAssignmentData = {
  id: mockAssignmentId,
  name: 'Initial Title',
  description: 'Initial description.',
  dueDate: '2025-08-15 23:59:59',
  course_id: 1,
  courseName: 'COMP9900 - Capstone Project',
  rubric: { filename: 'initial_rubric.pdf' },
  attachments: [{ filename: 'initial_attachment.zip' }],
};

describe('AssignmentModifyPage Component', () => {
  let confirmSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.confirm for the cancel button
    confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    // Mock window.alert as it's not implemented in jsdom
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    // Default API mocks
    api.get.mockResolvedValue({ data: mockAssignmentData });
    api.put.mockResolvedValue({ data: { message: 'Success' } });
  });

  afterEach(() => {
    confirmSpy.mockRestore();
    vi.restoreAllMocks();
  });

  // Test Case 1: Renders with pre-filled data
  it('should render the form with data fetched from the API', async () => {
    render(
      <BrowserRouter>
        <AssignmentModifyPage />
      </BrowserRouter>
    );

    // Assert: Loading state is shown initially
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Assert: Form fields are populated with mock data after loading
    expect(await screen.findByDisplayValue('Initial Title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Initial description.')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2025-08-15')).toBeInTheDocument();
    expect(screen.getByDisplayValue('initial_rubric.pdf')).toBeInTheDocument();
    expect(screen.getByDisplayValue('initial_attachment.zip')).toBeInTheDocument();
  });

  // Test Case 2: Successful form submission
  it('should call the PUT API with updated data on save', async () => {
    render(
      <BrowserRouter>
        <AssignmentModifyPage />
      </BrowserRouter>
    );
    
    // Act: Wait for form to load and find inputs by their initial value
    const titleInput = await screen.findByDisplayValue('Initial Title');
    const descriptionInput = screen.getByDisplayValue('Initial description.');

    // Act: Change the input values
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Updated description.' } });

    // Act: Click the save button
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    // Assert: API.put is called with a FormData object
    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith(
        `/assignments/${mockAssignmentId}`,
        expect.any(FormData), // Check if it's a FormData object
        expect.any(Object)
      );
    });

    // Assert: Check the content of the FormData mock call
    const formData = api.put.mock.calls[0][1];
    expect(formData.get('name')).toBe('Updated Title');
    expect(formData.get('description')).toBe('Updated description.');
    expect(formData.get('course_id')).toBe(String(mockAssignmentData.course_id));

    // Assert: Navigation occurs after successful save
    expect(window.alert).toHaveBeenCalledWith('Assignment updated successfully!');
    expect(mockNavigate).toHaveBeenCalledWith(`/tutor/assignment/${mockAssignmentId}`);
  });

  // Test Case 3: Cancel button functionality
  it('should show a confirmation and navigate when cancel is clicked', async () => {
    render(
      <BrowserRouter>
        <AssignmentModifyPage />
      </BrowserRouter>
    );
    await screen.findByDisplayValue('Initial Title'); // Wait for load

    // Act
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));

    // Assert
    expect(confirmSpy).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(`/tutor/assignment/${mockAssignmentId}`);
  });

  // Test Case 4: Sad Path - API fails to load initial data
  it('should display an error if fetching initial data fails', async () => {
    // Arrange
    api.get.mockRejectedValue(new Error('Failed to load'));

    render(
      <BrowserRouter>
        <AssignmentModifyPage />
      </BrowserRouter>
    );

    // Assert
    expect(await screen.findByText(/Failed to load assignment data/i)).toBeInTheDocument();
  });
});
