
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AssignmentUpload from './AssignmentUpload';
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
  };
});

// Mock data for courses
const mockCourses = [
  { id: 1, name: 'COMP9900 - Capstone Project' },
  { id: 2, name: 'COMP6080 - Web Frontend' },
];

describe('AssignmentUpload Component', () => {
  let confirmSpy;
  let alertSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.confirm and window.alert
    confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    // Mock localStorage for a logged-in user
    localStorage.setItem('user', JSON.stringify({ id: 1, email: 'tutor@test.com' }));
    
    // Default API mocks
    api.get.mockResolvedValue({ data: mockCourses });
    api.post.mockResolvedValue({ data: { message: 'Success' } });
  });

  afterEach(() => {
    confirmSpy.mockRestore();
    alertSpy.mockRestore();
    localStorage.clear();
  });

  // Test Case 1: Renders and loads courses
  it('should render the form and load courses into the select dropdown', async () => {
    render(
      <BrowserRouter>
        <AssignmentUpload />
      </BrowserRouter>
    );

    // Assert: Loading state is shown initially for courses
    expect(screen.getByText(/Loading courses/i)).toBeInTheDocument();

    // Assert: After loading, the form elements are visible
    expect(await screen.findByText('Upload Assignment')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter assignment title/i)).toBeInTheDocument();
    
    // Assert: The course dropdown is populated
    fireEvent.mouseDown(screen.getByRole('combobox'));
    expect(await screen.findByRole('option', { name: 'COMP9900 - Capstone Project' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'COMP6080 - Web Frontend' })).toBeInTheDocument();
  });

  // Test Case 2: Successful submission
  it('should validate and submit the form data correctly', async () => {
    const { container } = render(
      <BrowserRouter>
        <AssignmentUpload />
      </BrowserRouter>
    );
    await screen.findByRole('combobox'); // Wait for courses to load

    // Act: Fill out the form
    fireEvent.change(screen.getByPlaceholderText(/Enter assignment title/i), { target: { value: 'New Test Assignment' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter assignment description/i), { target: { value: 'A new description.' } });
    
    // FIX: Find the date input using a more direct querySelector as it has no accessible label
    const dateInput = container.querySelector('input[type="date"]');
    fireEvent.change(dateInput, { target: { value: '2025-12-25' } });
    
    // Select a course
    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(await screen.findByRole('option', { name: 'COMP6080 - Web Frontend' }));

    // Act: Click confirm button
    fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    // Assert: API.post is called with the correct FormData
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/assignments',
        expect.any(FormData),
        expect.any(Object)
      );
    });

    const formData = api.post.mock.calls[0][1];
    expect(formData.get('name')).toBe('New Test Assignment');
    expect(formData.get('course_id')).toBe('2');
    expect(formData.get('due_date')).toBe('2025-12-25 23:59:59');

    // Assert: Success alert and navigation
    expect(alertSpy).toHaveBeenCalledWith('Assignment uploaded successfully!');
    expect(mockNavigate).toHaveBeenCalledWith('/tutor/assignment');
  });

  // Test Case 3: Validation failure
  it('should show validation errors if required fields are empty', async () => {
    render(
      <BrowserRouter>
        <AssignmentUpload />
      </BrowserRouter>
    );
    await screen.findByRole('combobox'); // Wait for load

    // Act: Click confirm without filling the form
    fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    // Assert: Error messages are displayed for required fields
    expect(await screen.findByText('Please input assignment title')).toBeInTheDocument();
    expect(screen.getByText('Please select deadline')).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  // Test Case 4: Cancel button
  it('should show a confirmation and navigate away on cancel', async () => {
    render(
      <BrowserRouter>
        <AssignmentUpload />
      </BrowserRouter>
    );
    await screen.findByRole('combobox'); // Wait for load

    // Act
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));

    // Assert
    expect(confirmSpy).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/tutor/assignment');
  });
});
