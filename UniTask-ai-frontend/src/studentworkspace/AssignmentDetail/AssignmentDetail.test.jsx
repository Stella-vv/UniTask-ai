// src/studentworkspace/AssignmentDetail/AssignmentDetail.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StudentAssignmentDetail from './AssignmentDetail';
import api from '../../api';

// Mock the API module
vi.mock('../../api');

// Mock react-router-dom hooks
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ assignmentId: '1' }), // Provide a mock assignmentId
  };
});

// Mock data for the assignment
const mockAssignmentData = {
  id: 1,
  name: 'Test Assignment 1',
  description: 'This is a detailed description of the test assignment.',
  // Changed time to midday UTC to avoid timezone rollover issues
  dueDate: '2025-12-31T12:00:00Z', 
  rubric: { id: 1, filename: 'rubric_test.pdf' },
  attachments: [
    { id: 1, filename: 'attachment_one.pdf' },
    { id: 2, filename: 'attachment_two.docx' },
  ],
};

describe('StudentAssignmentDetail Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test Case 1: Happy Path - Renders assignment details correctly
  it('should render assignment details after a successful API call', async () => {
    // Arrange: Mock a successful API response
    api.get.mockResolvedValue({ data: mockAssignmentData });

    render(
      <BrowserRouter>
        <StudentAssignmentDetail />
      </BrowserRouter>
    );

    // Assert: Check for loading state initially, then wait for data to be rendered
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Test Assignment 1')).toBeInTheDocument();
      expect(screen.getByText(/This is a detailed description/i)).toBeInTheDocument();
      // Check for formatted date - this will now pass consistently
      expect(screen.getByText('31/12/2025')).toBeInTheDocument(); 
      // Check for rubric and attachments
      expect(screen.getByText('rubric_test.pdf')).toBeInTheDocument();
      expect(screen.getByText('attachment_one.pdf')).toBeInTheDocument();
      expect(screen.getByText('attachment_two.docx')).toBeInTheDocument();
    });
  });

  // Test Case 2: Sad Path - Displays an error message on API failure
  it('should display an error message if the API call fails', async () => {
    // Arrange: Mock a failed API response
    const errorMessage = 'Failed to fetch assignment details.';
    api.get.mockRejectedValue(new Error(errorMessage));

    render(
      <BrowserRouter>
        <StudentAssignmentDetail />
      </BrowserRouter>
    );

    // Assert: Wait for the error message to be displayed
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/Failed to fetch assignment details/i)).toBeInTheDocument();
    });
  });

  // Test Case 3: Navigation - Back button
  it('should navigate back to the assignment list when the back button is clicked', async () => {
    // Arrange
    api.get.mockResolvedValue({ data: mockAssignmentData });
    render(
      <BrowserRouter>
        <StudentAssignmentDetail />
      </BrowserRouter>
    );

    // Act: Wait for the button to appear before clicking
    const backButton = await screen.findByRole('button', { name: /Back/i });
    fireEvent.click(backButton);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/student/assignment');
  });

  // Test Case 4: Navigation - Forum button
  it('should navigate to the forum page when the forum button is clicked', async () => {
    // Arrange
    api.get.mockResolvedValue({ data: mockAssignmentData });
    render(
      <BrowserRouter>
        <StudentAssignmentDetail />
      </BrowserRouter>
    );
    
    // Act: Wait for the button to appear before clicking
    const forumButton = await screen.findByRole('button', { name: /Forum/i });
    fireEvent.click(forumButton);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/student/assignment/1/forum');
  });

  // Test Case 5: Navigation - Help button
  it('should navigate to the help/chat page when the help button is clicked', async () => {
    // Arrange
    api.get.mockResolvedValue({ data: mockAssignmentData });
    render(
      <BrowserRouter>
        <StudentAssignmentDetail />
      </BrowserRouter>
    );

    // Act: Wait for the button to appear before clicking
    const helpButton = await screen.findByRole('button', { name: /Help/i });
    fireEvent.click(helpButton);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/student/assignment/1/help');
  });
});
