
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AssignmentList from './AssignmentListPage';
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
    useLocation: () => ({ state: null }), // Mock useLocation
  };
});

// Mock data
const mockCourses = [
  { id: 1, name: 'Data Structures' },
  { id: 2, name: 'Algorithms' },
];

const mockAllAssignments = [
  { id: 'a1', name: 'Homework 1', dueDate: '2025-10-01T12:00:00Z' },
  { id: 'a2', name: 'Project Milestone', dueDate: '2025-11-15T12:00:00Z' },
];

const mockCourse2Assignments = [
  { id: 'a3', name: 'Algorithm Analysis', dueDate: '2025-12-01T12:00:00Z' },
];

describe('Tutor AssignmentList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default successful API mocks
    api.get.mockImplementation((url) => {
      if (url === '/courses/') {
        return Promise.resolve({ data: mockCourses });
      }
      if (url === '/assignments') {
        return Promise.resolve({ data: mockAllAssignments });
      }
      if (url === '/assignments/course/2') {
        return Promise.resolve({ data: mockCourse2Assignments });
      }
      return Promise.resolve({ data: [] });
    });
  });

  // Test Case 1: Renders courses and all assignments on initial load
  it('should render courses and all assignments initially', async () => {
    render(
      <BrowserRouter>
        <AssignmentList />
      </BrowserRouter>
    );

    // Assert: Waits for and renders the full assignment list
    expect(await screen.findByText('Homework 1')).toBeInTheDocument();
    expect(screen.getByText('Project Milestone')).toBeInTheDocument();
    expect(api.get).toHaveBeenCalledWith('/courses/');
    expect(api.get).toHaveBeenCalledWith('/assignments');
  });

  // Test Case 2: Filters assignments when a course is selected
  it('should fetch and display filtered assignments when a course is selected', async () => {
    render(
      <BrowserRouter>
        <AssignmentList />
      </BrowserRouter>
    );
    await screen.findByText('Homework 1'); // Wait for initial load

    // Act: Simulate user selecting the "Algorithms" course
    fireEvent.mouseDown(screen.getByRole('combobox')); // FIX: Use getByRole for MUI Select
    const courseOption = await screen.findByRole('option', { name: 'Algorithms' });
    fireEvent.click(courseOption);

    // Assert: The new, filtered list of assignments is displayed
    expect(await screen.findByText('Algorithm Analysis')).toBeInTheDocument();
    expect(screen.queryByText('Homework 1')).not.toBeInTheDocument();
    expect(api.get).toHaveBeenCalledWith('/assignments/course/2');
  });

  // Test Case 3: Navigates to the upload page
  it('should navigate to the upload page when "Upload Assignment" is clicked', async () => {
    render(
      <BrowserRouter>
        <AssignmentList />
      </BrowserRouter>
    );
    const uploadButton = await screen.findByRole('button', { name: /Upload Assignment/i });

    // Act
    fireEvent.click(uploadButton);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/tutor/assignment/upload');
  });

  // Test Case 4: Navigates to the detail page on item click
  it('should navigate to the assignment detail page when an item is clicked', async () => {
    render(
      <BrowserRouter>
        <AssignmentList />
      </BrowserRouter>
    );
    const assignmentItem = await screen.findByText('Project Milestone');

    // Act
    fireEvent.click(assignmentItem);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/tutor/assignment/a2');
  });

  // Test Case 5: Shows empty state when no assignments are found
  it('should display a "no assignments found" message for a filter with no results', async () => {
    // Arrange
    api.get.mockImplementation((url) => {
      if (url === '/courses/') return Promise.resolve({ data: mockCourses });
      if (url === '/assignments') return Promise.resolve({ data: [] }); // Initially no assignments
      return Promise.resolve({ data: [] });
    });

    render(
      <BrowserRouter>
        <AssignmentList />
      </BrowserRouter>
    );

    // Assert
    expect(await screen.findByText(/No assignments found/i)).toBeInTheDocument();
  });
  
  // Test Case 6: Shows an error message on API failure
  it('should display an error message if fetching assignments fails', async () => {
    // Arrange
    api.get.mockRejectedValue(new Error('API Error'));

    render(
      <BrowserRouter>
        <AssignmentList />
      </BrowserRouter>
    );

    // Assert
    expect(await screen.findByText(/Failed to load assignments/i)).toBeInTheDocument();
  });
});
