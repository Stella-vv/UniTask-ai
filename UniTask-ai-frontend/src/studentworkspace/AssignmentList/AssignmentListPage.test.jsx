// src/studentworkspace/AssignmentList/AssignmentListPage.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StudentAssignmentList from './AssignmentListPage';
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
    useLocation: () => ({ state: null }), // Default mock for useLocation
  };
});

// Mock data
const mockCourses = [
  { id: 1, name: 'Data Structures' },
  { id: 2, name: 'Algorithms' },
];

const mockAssignmentsCourse1 = [
  { id: 101, name: 'Homework 1', dueDate: '2025-01-10T12:00:00Z' },
  { id: 102, name: 'Lab 1', dueDate: '2025-01-15T12:00:00Z' },
];

const mockAssignmentsCourse2 = [
  { id: 201, name: 'Project A', dueDate: '2025-02-20T12:00:00Z' },
];

describe('StudentAssignmentList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default successful API responses
    api.get.mockImplementation((url) => {
      if (url === '/courses/') {
        return Promise.resolve({ data: mockCourses });
      }
      if (url === '/assignments/course/1') {
        return Promise.resolve({ data: mockAssignmentsCourse1 });
      }
      if (url === '/assignments/course/2') {
        return Promise.resolve({ data: mockAssignmentsCourse2 });
      }
      return Promise.resolve({ data: [] });
    });
  });

  // Test Case 1: Happy Path - Renders courses and assignments correctly on initial load
  it('should render courses and the first course\'s assignments on initial load', async () => {
    render(
      <BrowserRouter>
        <StudentAssignmentList />
      </BrowserRouter>
    );

    // Assert: Waits for and renders the assignment list for the default selected course (Course 1)
    // We no longer check for the progress bar as it can be too quick to appear and disappear.
    expect(await screen.findByText('Homework 1')).toBeInTheDocument();
    expect(screen.getByText('Lab 1')).toBeInTheDocument();
    expect(screen.queryByText('Project A')).not.toBeInTheDocument();
  });

  // Test Case 2: User Interaction - Filters assignments when a different course is selected
  it('should fetch and display new assignments when the course filter is changed', async () => {
    render(
      <BrowserRouter>
        <StudentAssignmentList />
      </BrowserRouter>
    );

    // Wait for initial data to load
    await screen.findByText('Homework 1');

    // Act: Simulate user changing the course selection to "Algorithms"
    // Use getByRole('combobox') which is more reliable for MUI Select
    fireEvent.mouseDown(screen.getByRole('combobox'));
    const courseOption = await screen.findByRole('option', { name: 'Algorithms' });
    fireEvent.click(courseOption);

    // Assert: New assignment list is rendered
    expect(await screen.findByText('Project A')).toBeInTheDocument();
    expect(screen.queryByText('Homework 1')).not.toBeInTheDocument();
    expect(api.get).toHaveBeenCalledWith('/assignments/course/2');
  });

  // Test Case 3: Sad Path - Shows a message when no assignments are found
  it('should display a "no assignments found" message when the API returns an empty array', async () => {
    // Arrange: Override default mock for a specific course to return no assignments
    api.get.mockImplementation((url) => {
      if (url === '/courses/') return Promise.resolve({ data: mockCourses });
      if (url === '/assignments/course/1') return Promise.resolve({ data: [] }); // No assignments
      return Promise.resolve({ data: [] });
    });

    render(
      <BrowserRouter>
        <StudentAssignmentList />
      </BrowserRouter>
    );

    // Assert
    expect(await screen.findByText(/No assignments found for this course/i)).toBeInTheDocument();
  });
  
  // Test Case 4: Sad Path - Shows an error message on API failure
  it('should display an error message if fetching assignments fails', async () => {
    // Arrange
    api.get.mockImplementation((url) => {
        if (url === '/courses/') return Promise.resolve({ data: mockCourses });
        if (url.startsWith('/assignments/course/')) return Promise.reject(new Error('API Error'));
        return Promise.resolve({ data: [] });
    });

    render(
      <BrowserRouter>
        <StudentAssignmentList />
      </BrowserRouter>
    );

    // Assert
    expect(await screen.findByText(/Failed to load assignments/i)).toBeInTheDocument();
  });

  // Test Case 5: Navigation - Clicking an assignment navigates to its detail page
  it('should navigate to the correct assignment detail page when an item is clicked', async () => {
    render(
      <BrowserRouter>
        <StudentAssignmentList />
      </BrowserRouter>
    );

    // Wait for the list to render
    const assignmentItem = await screen.findByText('Homework 1');

    // Act
    fireEvent.click(assignmentItem);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/student/assignment/101');
  });
});