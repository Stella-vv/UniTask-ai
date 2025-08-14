import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import CourseModifyPage from './CourseModifyPage';
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

describe('CourseModifyPage Component', () => {
  let confirmSpy;
  let alertSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    localStorage.setItem('user', JSON.stringify({ id: 1, email: 'tutor@test.com' }));
    api.get.mockResolvedValue({ data: mockCourseData });
    api.put.mockResolvedValue({ data: { message: 'Course updated successfully' } });
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
        <CourseModifyPage />
      </BrowserRouter>
    );

    // Assert: Check for loading state initially
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Assert: Wait for form fields to be populated with mock data
    expect(await screen.findByDisplayValue('Intro to Programming')).toBeInTheDocument();
    expect(screen.getByDisplayValue('A foundational course on programming principles.')).toBeInTheDocument();
    expect(screen.getByDisplayValue(2025)).toBeInTheDocument();
    expect(screen.getByText('Quiz 1 (20%)')).toBeInTheDocument();
    expect(screen.getByText('Final Exam (80%)')).toBeInTheDocument();
  });

  // Test Case 2: Sad Path - Displays an error message on initial data fetch failure
  it('should display an error message if the initial API call fails', async () => {
    // Arrange: Mock a failed API response
    api.get.mockRejectedValue(new Error('Network Error'));

    render(
      <BrowserRouter>
        <CourseModifyPage />
      </BrowserRouter>
    );

    // Assert: Wait for the error message to be displayed
    expect(await screen.findByText(/Failed to load course data/i)).toBeInTheDocument();
  });

  // Test Case 3: Dynamic assessment fields
  it('should allow adding and removing assessment items', async () => {
    // Arrange
    api.get.mockResolvedValue({ data: { ...mockCourseData, assessment: '[]' } }); // Start with no assessments
    render(
      <BrowserRouter>
        <CourseModifyPage />
      </BrowserRouter>
    );
    await screen.findByText(/Assessments:/i); // Wait for component to load

    const addAssessmentButton = screen.getByRole('button', { name: /Add/i });
    const assessmentInput = screen.getByPlaceholderText(/Add an assessment item/i);
    
    // Act: Add a new assessment
    fireEvent.change(assessmentInput, { target: { value: 'New Assessment' } });
    fireEvent.click(addAssessmentButton);

    // Assert: The new item appears in the list
    const assessmentItem = await screen.findByText('New Assessment');
    expect(assessmentItem).toBeInTheDocument();
    
    // Act: Remove the assessment
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    // Assert: The item is removed
    expect(screen.queryByText('New Assessment')).not.toBeInTheDocument();
  });

  // Test Case 4: Happy Path - Successful form submission
  it('should submit the form with updated data on save', async () => {
    // Arrange
    render(
      <BrowserRouter>
        <CourseModifyPage />
      </BrowserRouter>
    );
    // Wait for the form to load its initial values
    await screen.findByDisplayValue('Intro to Programming');

    // Get all textboxes and select by their order, as they lack accessible names
    const textboxes = screen.getAllByRole('textbox');
    const courseNameInput = textboxes[0];
    const descriptionInput = textboxes[1];

    // Act: Change a field and submit
    fireEvent.change(courseNameInput, { target: { value: 'Updated Course Name' } });
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    // Assert: API.put is called with the new data
    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith(`/courses/${mockCourseId}`, {
        name: 'Updated Course Name',
        description: mockCourseData.description,
        year: mockCourseData.year,
        semester: mockCourseData.semester,
        assessment: mockCourseData.assessment,
      });
    });

    // Assert: Success alert is shown and navigation occurs
    expect(alertSpy).toHaveBeenCalledWith('Course updated successfully!');
    expect(mockNavigate).toHaveBeenCalledWith(`/tutor/course/${mockCourseId}`);
  });
  
  // Test Case 5: Sad Path - Form submission fails
  it('should display an error message if the API put call fails', async () => {
    // Arrange: Mock a failed PUT response
    api.put.mockRejectedValue({ response: { data: { message: 'Update failed' } } });

    render(
      <BrowserRouter>
        <CourseModifyPage />
      </BrowserRouter>
    );
    await screen.findByDisplayValue('Intro to Programming'); // Wait for load

    // Act: Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    // Assert: Wait for the error message to be displayed
    await waitFor(() => {
        expect(screen.getByText(/Failed to update course/i)).toBeInTheDocument();
    });
    // Ensure no navigation occurred
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  // Test Case 6: Interaction - Cancel button
  it('should show a confirmation and navigate back on cancel', async () => {
    // Arrange
    render(
      <BrowserRouter>
        <CourseModifyPage />
      </BrowserRouter>
    );
    await screen.findByDisplayValue('Intro to Programming'); // Wait for load

    // Act
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));

    // Assert
    expect(confirmSpy).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(`/tutor/course/${mockCourseId}`);
  });
});