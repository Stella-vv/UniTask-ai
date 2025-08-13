// src/tutorworkspace/AssignmentDetail/AssignmentDetail.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AssignmentDetail from './AssignmentDetail';
import api from '../../api';

// Mock the API module
vi.mock('../../api');

// Mock react-router-dom hooks
const mockNavigate = vi.fn();
const mockAssignmentId = '123';
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ assignmentId: mockAssignmentId }),
  };
});

// Mock data for the assignment
const mockAssignmentData = {
  id: mockAssignmentId,
  name: 'Advanced Sorting Algorithms',
  description: 'Implement a Timsort algorithm.',
  // Use midday UTC to prevent timezone rollover issues
  dueDate: '2025-10-15T12:00:00Z',
  courseName: 'Data Structures',
  rubric: { id: 1, filename: 'timsort_rubric.pdf' },
  attachments: [{ id: 1, filename: 'dataset.zip' }],
};

describe('Tutor AssignmentDetail Component', () => {
  let confirmSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    // Spy on window.confirm and mock its return value
    confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    // FIX: Add a mock user to localStorage to simulate a logged-in state
    localStorage.setItem('user', JSON.stringify({ id: 1, email: 'tutor@test.com' }));
  });

  afterEach(() => {
    // Restore the original window.confirm function
    confirmSpy.mockRestore();
    // Clean up localStorage
    localStorage.clear();
  });

  // Test Case 1: Happy Path - Renders assignment details correctly
  it('should render assignment details after a successful API call', async () => {
    // Arrange
    api.get.mockResolvedValue({ data: mockAssignmentData });

    render(
      <BrowserRouter>
        <AssignmentDetail />
      </BrowserRouter>
    );

    // Assert
    expect(await screen.findByText('Advanced Sorting Algorithms')).toBeInTheDocument();
    expect(screen.getByText(/Implement a Timsort algorithm/i)).toBeInTheDocument();
    expect(screen.getByText(/Due Date/i)).toBeInTheDocument();
    expect(screen.getByText('timsort_rubric.pdf')).toBeInTheDocument();
    expect(screen.getByText('dataset.zip')).toBeInTheDocument();
  });

  // Test Case 2: Sad Path - Displays an error message on API failure
  it('should display an error message if the API call fails', async () => {
    // Arrange
    api.get.mockRejectedValue({ response: { status: 404 } });

    render(
      <BrowserRouter>
        <AssignmentDetail />
      </BrowserRouter>
    );

    // Assert
    expect(await screen.findByText(/Assignment not found/i)).toBeInTheDocument();
  });

  // Test Case 3: Navigation - Modify button
  it('should navigate to the modify page when the modify button is clicked', async () => {
    // Arrange
    api.get.mockResolvedValue({ data: mockAssignmentData });
    render(
      <BrowserRouter>
        <AssignmentDetail />
      </BrowserRouter>
    );
    const modifyButton = await screen.findByRole('button', { name: /Modify/i });

    // Act
    fireEvent.click(modifyButton);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith(`/tutor/assignment/modify/${mockAssignmentId}`);
  });

  // Test Case 4: Interaction - Delete button (Happy Path)
  it('should call the delete API and navigate on successful deletion', async () => {
    // Arrange
    api.get.mockResolvedValue({ data: mockAssignmentData });
    api.delete.mockResolvedValue({ data: { message: 'Success' } });
    render(
      <BrowserRouter>
        <AssignmentDetail />
      </BrowserRouter>
    );
    const deleteButton = await screen.findByRole('button', { name: /Delete/i });

    // Act
    fireEvent.click(deleteButton);

    // Assert
    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalled();
      expect(api.delete).toHaveBeenCalledWith(`/assignments/${mockAssignmentId}`);
      expect(mockNavigate).toHaveBeenCalledWith('/tutor/assignment');
    });
  });

  // Test Case 5: Interaction - Delete button (Cancel)
  it('should not call the delete API if the user cancels the confirmation', async () => {
    // Arrange
    confirmSpy.mockReturnValue(false); // User clicks "Cancel"
    api.get.mockResolvedValue({ data: mockAssignmentData });
    render(
      <BrowserRouter>
        <AssignmentDetail />
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