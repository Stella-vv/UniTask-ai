// src/studentworkspace/CourseList/CourseListPage.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StudentCourseList from './CourseListPage';
import api from '../../api';

vi.mock('../../api');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockCourses = [
  { id: 1, name: 'Introduction to AI', semester: 'T1', year: 2025 },
  { id: 2, name: 'Web Development Fundamentals', semester: 'T2', year: 2025 },
];

describe('StudentCourseList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test Case 1: Happy Path - Renders course list correctly
  it('should render the list of courses after a successful API call', async () => {
    // Arrange
    api.get.mockResolvedValue({ data: mockCourses });

    render(
      <BrowserRouter>
        <StudentCourseList />
      </BrowserRouter>
    );

    // Assert: Check for loading state initially
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Assert: Wait for the course names to be rendered
    expect(await screen.findByText('Introduction to AI')).toBeInTheDocument();
    expect(screen.getByText('Web Development Fundamentals')).toBeInTheDocument();
    
    // Assert: Check for secondary text (semester and year)
    expect(screen.getByText(/Semester T1 - 2025/i)).toBeInTheDocument();
    expect(screen.getByText(/Semester T2 - 2025/i)).toBeInTheDocument();
  });

  // Test Case 2: Sad Path - Displays a message when no courses are found
  it('should display a "no courses found" message when the API returns an empty array', async () => {
    // Arrange
    api.get.mockResolvedValue({ data: [] });

    render(
      <BrowserRouter>
        <StudentCourseList />
      </BrowserRouter>
    );

    // Assert
    expect(await screen.findByText(/No courses found/i)).toBeInTheDocument();
  });

  // Test Case 3: Sad Path - Displays an error message on API failure
  it('should display an error message if the API call fails', async () => {
    // Arrange
    api.get.mockRejectedValue(new Error('Network Error'));

    render(
      <BrowserRouter>
        <StudentCourseList />
      </BrowserRouter>
    );

    // Assert
    expect(await screen.findByText(/Failed to load courses/i)).toBeInTheDocument();
  });

  // Test Case 4: Navigation - Clicking a course item
  it('should navigate to the correct course detail page when an item is clicked', async () => {
    // Arrange
    api.get.mockResolvedValue({ data: mockCourses });
    render(
      <BrowserRouter>
        <StudentCourseList />
      </BrowserRouter>
    );
    
    // Wait for the item to appear and then click it
    const courseItem = await screen.findByText('Web Development Fundamentals');

    // Act
    fireEvent.click(courseItem);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/student/course/2');
  });
});
