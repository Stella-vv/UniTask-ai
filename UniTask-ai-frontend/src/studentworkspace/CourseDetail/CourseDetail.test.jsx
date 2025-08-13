
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StudentCourseDetail from './CourseDetail';
import api from '../../api';

// Mock the API module
vi.mock('../../api');

// Mock react-router-dom hooks
const mockNavigate = vi.fn();
const mockCourseId = 'cs101';
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ courseId: mockCourseId }),
  };
});

// Mock data for the course
const mockCourseData = {
  id: mockCourseId,
  name: 'Intro to Programming',
  description: 'A foundational course on programming principles.',
  year: 2025,
  semester: 'T1',
  // Assessments are stored as a JSON string in the backend
  assessment: JSON.stringify(['Quiz 1 (20%)', 'Final Exam (80%)']),
};

describe('StudentCourseDetail Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test Case 1: Happy Path - Renders course details correctly
  it('should render course details after a successful API call', async () => {
    // Arrange
    api.get.mockResolvedValue({ data: mockCourseData });

    render(
      <BrowserRouter>
        <StudentCourseDetail />
      </BrowserRouter>
    );

    // Assert: Check for loading state initially
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Assert: Wait for data to be rendered
    expect(await screen.findByText('Intro to Programming')).toBeInTheDocument();
    expect(screen.getByText(/A foundational course on programming principles/i)).toBeInTheDocument();
    expect(screen.getByText(`Course ID: ${mockCourseId}`)).toBeInTheDocument();
    expect(screen.getByText(/This course is open in semester T1 of 2025/i)).toBeInTheDocument();
    
    // Assert: Check for rendered assessment items
    expect(screen.getByText(/Quiz 1 \(20%\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Final Exam \(80%\)/i)).toBeInTheDocument();
  });

  // Test Case 2: Sad Path - Displays an error message on API failure
  it('should display an error message if the API call fails', async () => {
    // Arrange
    api.get.mockRejectedValue(new Error('Network Error'));

    render(
      <BrowserRouter>
        <StudentCourseDetail />
      </BrowserRouter>
    );

    // Assert
    expect(await screen.findByText(/Could not load course details/i)).toBeInTheDocument();
  });

  // Test Case 3: Navigation - Back button
  it('should navigate to the course list when the back button is clicked', async () => {
    // Arrange
    api.get.mockResolvedValue({ data: mockCourseData });
    render(
      <BrowserRouter>
        <StudentCourseDetail />
      </BrowserRouter>
    );
    const backButton = await screen.findByRole('button', { name: /Back/i });

    // Act
    fireEvent.click(backButton);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/student/course');
  });

  // Test Case 4: Navigation - Assignment button
  it('should navigate to the assignment page with course context when assignment button is clicked', async () => {
    // Arrange
    api.get.mockResolvedValue({ data: mockCourseData });
    render(
      <BrowserRouter>
        <StudentCourseDetail />
      </BrowserRouter>
    );
    const assignmentButton = await screen.findByRole('button', { name: /Assignment/i });

    // Act
    fireEvent.click(assignmentButton);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/student/assignment', {
      state: { defaultCourseId: mockCourseId },
    });
  });
});
