// src/tutorworkspace/CourseDetail/CourseDetail.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import CourseDetail from './CourseDetail';
import api from '../../api';

vi.mock('../../api');

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

const mockCourseData = {
  id: mockCourseId,
  name: 'Intro to Programming',
  description: 'A foundational course on programming principles.',
  year: 2025,
  semester: 'T1',
  assessment: JSON.stringify(['Quiz 1 (20%)', 'Final Exam (80%)']),
};

describe('Tutor CourseDetail Component', () => {
  let confirmSpy;
  let alertSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    localStorage.setItem('user', JSON.stringify({ id: 1, email: 'tutor@test.com' }));
  });

  afterEach(() => {
    confirmSpy.mockRestore();
    alertSpy.mockRestore();
    localStorage.clear();
  });

  // Test Case 1: Happy Path - Renders course details correctly
  it('should render course details after a successful API call', async () => {
    // Arrange
    api.get.mockResolvedValue({ data: mockCourseData });

    render(
      <BrowserRouter>
        <CourseDetail />
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
        <CourseDetail />
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
        <CourseDetail />
      </BrowserRouter>
    );
    const backButton = await screen.findByRole('button', { name: /Back/i });

    // Act
    fireEvent.click(backButton);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/tutor/course');
  });

  // Test Case 4: Navigation - Assignment button
  it('should navigate to the assignment page with course context when assignment button is clicked', async () => {
    // Arrange
    api.get.mockResolvedValue({ data: mockCourseData });
    render(
      <BrowserRouter>
        <CourseDetail />
      </BrowserRouter>
    );
    const assignmentButton = await screen.findByRole('button', { name: /Assignment/i });

    // Act
    fireEvent.click(assignmentButton);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/tutor/assignment', {
      state: { defaultCourseId: mockCourseId },
    });
  });

  // Test Case 5: Interaction - Modify button
  it('should navigate to the modify page when the modify button is clicked', async () => {
    // Arrange
    api.get.mockResolvedValue({ data: mockCourseData });
    render(
      <BrowserRouter>
        <CourseDetail />
      </BrowserRouter>
    );
    const modifyButton = await screen.findByRole('button', { name: /Modify/i });

    // Act
    fireEvent.click(modifyButton);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith(`/tutor/course/modify/${mockCourseId}`);
  });
  
  // Test Case 6: Interaction - Delete button (Happy Path)
  it('should call the delete API and navigate on successful deletion', async () => {
    // Arrange
    api.get.mockResolvedValue({ data: mockCourseData });
    api.delete.mockResolvedValue({ data: { message: 'Success' } });
    render(
      <BrowserRouter>
        <CourseDetail />
      </BrowserRouter>
    );
    const deleteButton = await screen.findByRole('button', { name: /Delete/i });

    // Act
    fireEvent.click(deleteButton);

    // Assert
    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalled();
      expect(api.delete).toHaveBeenCalledWith(`/courses/${mockCourseId}`);
      expect(mockNavigate).toHaveBeenCalledWith('/tutor/course');
    });
  });
});