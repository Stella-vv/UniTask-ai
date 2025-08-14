import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CourseList from './CourseList';
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
  { id: 1, name: 'Data Structures', semester: 'T1', year: 2025 },
  { id: 2, name: 'Algorithms', semester: 'T2', year: 2025 },
];

describe('Tutor CourseList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test Case 1: Happy Path - Renders the list of courses correctly
  it('should render the list of courses after a successful API call', async () => {
    // Arrange: Mock a successful API response
    api.get.mockResolvedValue({ data: mockCourses });

    render(
      <BrowserRouter>
        <CourseList />
      </BrowserRouter>
    );

    // Assert: Check for loading state initially
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Assert: Wait for course names to be rendered
    expect(await screen.findByText('Data Structures')).toBeInTheDocument();
    expect(screen.getByText('Algorithms')).toBeInTheDocument();
    
    // Assert: Check for secondary text (semester and year)
    expect(screen.getByText(/Semester T1 - 2025/i)).toBeInTheDocument();
    expect(screen.getByText(/Semester T2 - 2025/i)).toBeInTheDocument();
  });

  // Test Case 2: Sad Path - Displays a message when no courses are found
  it('should display a "no courses found" message when the API returns an empty array', async () => {
    // Arrange: Mock the API to return an empty array
    api.get.mockResolvedValue({ data: [] });

    render(
      <BrowserRouter>
        <CourseList />
      </BrowserRouter>
    );

    // Assert: Wait for the "No courses found" message to be rendered
    expect(await screen.findByText(/No courses found/i)).toBeInTheDocument();
  });

  // Test Case 3: Sad Path - Displays an error message on API failure
  it('should display an error message if the API call fails', async () => {
    // Arrange: Mock a failed API response
    api.get.mockRejectedValue(new Error('Network Error'));

    render(
      <BrowserRouter>
        <CourseList />
      </BrowserRouter>
    );

    // Assert: Wait for the error message to be rendered
    expect(await screen.findByText(/Failed to load courses/i)).toBeInTheDocument();
  });

  // Test Case 4: Navigation - Clicking a course item
  it('should navigate to the correct course detail page when a course item is clicked', async () => {
    // Arrange
    api.get.mockResolvedValue({ data: mockCourses });
    render(
      <BrowserRouter>
        <CourseList />
      </BrowserRouter>
    );
    
    // Act: Wait for the item to appear and then click it
    const courseItem = await screen.findByText('Algorithms');
    fireEvent.click(courseItem);

    // Assert: Check that navigation was called correctly
    expect(mockNavigate).toHaveBeenCalledWith('/tutor/course/2');
  });

  // Test Case 5: Navigation - Clicking the "Add Course" button
  it('should navigate to the add course page when the add button is clicked', async () => {
    // Arrange
    api.get.mockResolvedValue({ data: mockCourses });
    render(
      <BrowserRouter>
        <CourseList />
      </BrowserRouter>
    );
    
    // Act: Wait for the button to appear and then click it
    const addButton = await screen.findByRole('button', { name: /Add Course/i });
    fireEvent.click(addButton);

    // Assert: Check that navigation was called correctly
    expect(mockNavigate).toHaveBeenCalledWith('/tutor/course/add');
  });
});