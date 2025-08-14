import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import CourseAddPage from './CourseAddPage';
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

describe('CourseAddPage Component', () => {
  let confirmSpy;
  let alertSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    localStorage.setItem('user', JSON.stringify({ id: 1, email: 'tutor@test.com' }));
    api.post.mockResolvedValue({ data: { message: 'Course created successfully' } });
  });

  afterEach(() => {
    confirmSpy.mockRestore();
    alertSpy.mockRestore();
    localStorage.clear();
  });

  // Test Case 1: Renders the form correctly
  it('should render the add course form with initial fields', () => {
    render(
      <BrowserRouter>
        <CourseAddPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Add New Course/i)).toBeInTheDocument();
    // Check for the presence of all visual labels
    expect(screen.getByText(/Course Name:/i)).toBeInTheDocument();
    expect(screen.getByText(/Year:/i)).toBeInTheDocument();
    expect(screen.getByText(/Semester:/i)).toBeInTheDocument();
    expect(screen.getByText(/Description:/i)).toBeInTheDocument();
    expect(screen.getByText(/Assessments:/i)).toBeInTheDocument();
    // Check for the presence of the Add button
    expect(screen.getByRole('button', { name: /Add/i })).toBeInTheDocument();
  });

  // Test Case 2: Dynamic assessment fields
  it('should add and remove assessment fields dynamically', async () => {
    render(
      <BrowserRouter>
        <CourseAddPage />
      </BrowserRouter>
    );

    const addAssessmentButton = screen.getByRole('button', { name: /Add/i });
    const assessmentInput = screen.getByPlaceholderText(/Add an assessment item/i);
    
    // Act: Add a new assessment
    fireEvent.change(assessmentInput, { target: { value: 'Midterm (30%)' } });
    fireEvent.click(addAssessmentButton);

    // Assert: The new assessment item appears in the list
    const assessmentItem = await screen.findByText('Midterm (30%)');
    expect(assessmentItem).toBeInTheDocument();
    
    // Act: Remove the assessment by clicking its delete icon
    // The button has an accessible name of 'delete' due to its aria-label
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    // Assert: The assessment item is removed
    expect(screen.queryByText('Midterm (30%)')).not.toBeInTheDocument();
  });

  // Test Case 3: Successful form submission
  it('should submit the form with valid data', async () => {
    render(
      <BrowserRouter>
        <CourseAddPage />
      </BrowserRouter>
    );

    // Get all textboxes and select by their order, as they lack accessible names
    const textboxes = screen.getAllByRole('textbox');
    const courseNameInput = textboxes[0];
    const descriptionInput = textboxes[1];

    // Get other inputs using robust selectors
    const yearInput = screen.getByRole('spinbutton');
    const semesterSelect = screen.getByRole('combobox');
    const assessmentInput = screen.getByPlaceholderText(/Add an assessment item/i);

    // Act: Fill out the form
    fireEvent.change(courseNameInput, { target: { value: 'New Course' } });
    fireEvent.change(yearInput, { target: { value: '2026' } });
    fireEvent.change(descriptionInput, { target: { value: 'A great new course.' } });
    
    // Select from the dropdown
    fireEvent.mouseDown(semesterSelect);
    fireEvent.click(await screen.findByRole('option', { name: 'Term 2' }));

    // Add an assessment
    fireEvent.change(assessmentInput, { target: { value: 'Final Exam (100%)' } });
    fireEvent.click(screen.getByRole('button', { name: /Add/i }));

    // Act: Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    // Assert: The API is called with the correct payload
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/courses/', {
        name: 'New Course',
        description: 'A great new course.',
        year: '2026',
        semester: 'T2',
        assessment: JSON.stringify(['Final Exam (100%)']),
      });
    });

    // Assert: A success alert is shown and navigation occurs
    expect(alertSpy).toHaveBeenCalledWith('Course added successfully!');
    expect(mockNavigate).toHaveBeenCalledWith('/tutor/course');
  });

  // Test Case 4: Validation failure
  it('should show validation errors for empty required fields', async () => {
    render(
      <BrowserRouter>
        <CourseAddPage />
      </BrowserRouter>
    );

    // Act: Submit the empty form
    fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    // Assert: The correct error messages are displayed
    expect(await screen.findByText('Course name is required')).toBeInTheDocument();
    expect(screen.getByText('Semester is required')).toBeInTheDocument();
    expect(screen.getByText('Description is required')).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  // Test Case 5: Cancel button functionality
  it('should show a confirmation and navigate on cancel', () => {
    render(
      <BrowserRouter>
        <CourseAddPage />
      </BrowserRouter>
    );

    // Act: Click the cancel button
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));

    // Assert: The confirmation dialog is called and navigation occurs
    expect(confirmSpy).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/tutor/course');
  });
});