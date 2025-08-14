// src/tutorworkspace/QandA/QandAUploadPage.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import QandAUploadPage from './QandAUploadPage';
import api from '../../api';

vi.mock('../../api');

const mockNavigate = vi.fn();
const mockAssignmentId = 'a1';
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ assignmentId: mockAssignmentId }),
  };
});

const mockAssignmentData = { id: mockAssignmentId, name: 'Assignment 1' };
const mockFile = new File(['Q&A content'], 'qa.pdf', { type: 'application/pdf' });

describe('QandAUploadPage Component', () => {
  let confirmSpy;
  let alertSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    localStorage.setItem('user', JSON.stringify({ id: 1, email: 'tutor@test.com' }));
    api.get.mockResolvedValue({ data: mockAssignmentData });
    api.post.mockResolvedValue({ data: { message: 'Q&A uploaded successfully!' } });
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    confirmSpy.mockRestore();
    alertSpy.mockRestore();
    localStorage.clear();
    consoleErrorSpy.mockRestore();
  });

  // Test Case 1: Happy Path - Renders the form correctly with assignment name
  it('should render the form with the assignment name and file upload area', async () => {
    render(
      <BrowserRouter>
        <QandAUploadPage />
      </BrowserRouter>
    );

    // Assert: Wait for the component to finish loading data
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Assert: Check for the header and form elements
    expect(screen.getByText(`Upload Q&As for Assignment 1`)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter a description for this Q&A file (optional)')).toBeInTheDocument();
    expect(screen.getByText('Upload Q&A File')).toBeInTheDocument();
    
    // Assert: Check for buttons
    expect(screen.getByRole('button', { name: /Confirm/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  // Test Case 2: Happy Path - Uploading a valid file
  it('should display the uploaded file name after a successful upload', async () => {
    render(
      <BrowserRouter>
        <QandAUploadPage />
      </BrowserRouter>
    );
    await screen.findByText(`Upload Q&As for Assignment 1`); // Wait for component to load

    // Use querySelector on the label to get the hidden input
    const fileInput = screen.getByText('Upload Q&A File').closest('label').querySelector('input[type="file"]');
    
    // Act: Upload a valid file
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    // Assert: The file name is displayed
    expect(await screen.findByText('qa.pdf')).toBeInTheDocument();
    expect(screen.getByText('0.00 MB')).toBeInTheDocument();
    expect(screen.queryByText(/Invalid file type/i)).not.toBeInTheDocument();
  });

  // Test Case 3: Happy Path - Successful form submission
  it('should submit the form with valid data and navigate on success', async () => {
    render(
      <BrowserRouter>
        <QandAUploadPage />
      </BrowserRouter>
    );
    await screen.findByText(`Upload Q&As for Assignment 1`); // Wait for component to load

    // Act: Upload a file and submit the form
    const fileInput = screen.getByText('Upload Q&A File').closest('label').querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [mockFile] } });
    fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    // Assert: The API is called with the correct FormData
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/qa/upload',
        expect.any(FormData),
        expect.any(Object)
      );
    });

    const formData = api.post.mock.calls[0][1];
    expect(formData.get('file')).toBe(mockFile);
    expect(formData.get('assignment_id')).toBe(mockAssignmentId);
    
    // Assert: Success alert is shown and navigation occurs
    expect(alertSpy).toHaveBeenCalledWith('Q&A uploaded successfully!');
    expect(mockNavigate).toHaveBeenCalledWith(`/tutor/assignment/${mockAssignmentId}/qnas`);
  });

  // Test Case 4: Sad Path - Displays an error for an invalid file type
  it('should display an error message for an invalid file type', async () => {
    render(
      <BrowserRouter>
        <QandAUploadPage />
      </BrowserRouter>
    );
    await screen.findByText(`Upload Q&As for Assignment 1`); // Wait for component to load

    const fileInput = screen.getByText('Upload Q&A File').closest('label').querySelector('input[type="file"]');
    const invalidFile = new File(['invalid content'], 'image.jpg', { type: 'image/jpeg' });

    // Act
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    // Assert: An error message is displayed
    await waitFor(() => {
        expect(screen.getByText('Invalid file type. Please upload PDF, CSV, Excel, XML, or Word.')).toBeInTheDocument();
    });
    expect(api.post).not.toHaveBeenCalled();
  });
  
  // Test Case 5: Sad Path - API call fails
  it('should display an alert if the API post call fails', async () => {
    // Arrange: Mock a failed POST response
    api.post.mockRejectedValue({ response: { data: { error: 'Upload failed' } } });

    render(
      <BrowserRouter>
        <QandAUploadPage />
      </BrowserRouter>
    );
    await screen.findByText(`Upload Q&As for Assignment 1`); // Wait for component to load

    // Act: Upload a valid file and submit
    const fileInput = screen.getByText('Upload Q&A File').closest('label').querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [mockFile] } });
    fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    // Assert: Wait for the alert to be called
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Upload failed: Upload failed');
    });
    
    // Ensure no navigation occurred
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  // Test Case 6: Interaction - Cancel button
  it('should navigate back to the Q&A List page when the cancel button is clicked', async () => {
    render(
      <BrowserRouter>
        <QandAUploadPage />
      </BrowserRouter>
    );
    await screen.findByText(`Upload Q&As for Assignment 1`); // Wait for component to load

    // Act
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));

    // Assert
    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to cancel? Unsaved changes will be lost.');
    expect(mockNavigate).toHaveBeenCalledWith(`/tutor/assignment/${mockAssignmentId}/qnas`);
  });
});