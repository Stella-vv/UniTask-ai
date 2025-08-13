// src/tutorworkspace/QandAList/QandAListPage.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import QandAListPage from './QandAListPage';
import api from '../../api';

// Mock the API module
vi.mock('../../api');

// Mock react-router-dom hooks
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

// Mock data
const mockAssignmentData = { id: mockAssignmentId, name: 'Assignment 1' };
const mockQAList = [
  { id: 'q1', filename: 'QnA_file_1.pdf', filetype: 'application/pdf', created_at: '2025-08-14T01:00:00Z' },
  { id: 'q2', filename: 'QnA_file_2.csv', filetype: 'text/csv', created_at: '2025-08-13T15:30:00Z' },
];

describe('QandAListPage Component', () => {
  let confirmSpy;
  let alertSpy;
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock global objects
    confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    // Mock localStorage to simulate a logged-in user
    localStorage.setItem('user', JSON.stringify({ id: 1, email: 'tutor@test.com' }));

    // Default API mocks for a common happy path
    api.get.mockImplementation((url) => {
      if (url.includes(`/assignments/detail/${mockAssignmentId}`)) {
        return Promise.resolve({ data: mockAssignmentData });
      }
      if (url.includes(`/qa/assignment/${mockAssignmentId}/uploads`)) {
        return Promise.resolve({ data: mockQAList });
      }
      return Promise.resolve({ data: [] });
    });
    api.delete.mockResolvedValue({ data: { message: 'File deleted successfully!' } });
  });

  afterEach(() => {
    confirmSpy.mockRestore();
    alertSpy.mockRestore();
    localStorage.clear();
  });

  // Test Case 1: Happy Path - Renders the Q&A list correctly
  it('should render the list of Q&As after a successful API call', async () => {
    render(<BrowserRouter><QandAListPage /></BrowserRouter>);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    expect(await screen.findByText(`Q&As for ${mockAssignmentData.name}`)).toBeInTheDocument();
    expect(screen.getByText('QnA_file_1.pdf')).toBeInTheDocument();
    expect(screen.getByText('QnA_file_2.csv')).toBeInTheDocument();
  });

  // Test Case 2: Sad Path - Displays an empty state when no files are found
  it('should display the empty state when no Q&A files are found', async () => {
    api.get.mockImplementation((url) => {
      if (url.includes(`/assignments/detail/${mockAssignmentId}`)) {
        return Promise.resolve({ data: mockAssignmentData });
      }
      if (url.includes(`/qa/assignment/${mockAssignmentId}/uploads`)) {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: [] });
    });

    render(<BrowserRouter><QandAListPage /></BrowserRouter>);

    expect(await screen.findByText('No Q&As Found')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upload First Q&A/i })).toBeInTheDocument();
  });

  // Test Case 3: Sad Path - Displays an error message on API failure for file list
  it('should display an error message if the API call for Q&A list fails', async () => {
    api.get.mockImplementation((url) => {
      if (url.includes(`/assignments/detail/${mockAssignmentId}`)) {
        return Promise.resolve({ data: mockAssignmentData });
      }
      if (url.includes(`/qa/assignment/${mockAssignmentId}/uploads`)) {
        return Promise.reject(new Error('Network Error'));
      }
      return Promise.resolve({ data: [] });
    });

    render(<BrowserRouter><QandAListPage /></BrowserRouter>);

    expect(await screen.findByText(/Failed to load Q&A list/i)).toBeInTheDocument();
  });

  // Test Case 4: Navigation - "Back" button
  it('should navigate back to the assignment detail page when the back button is clicked', async () => {
    render(<BrowserRouter><QandAListPage /></BrowserRouter>);
    const backButton = await screen.findByRole('button', { name: 'Back' });
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith(`/tutor/assignment/${mockAssignmentId}`);
  });

  // Test Case 5: Navigation - "Upload Q&A" button
  it('should navigate to the Q&A upload page when the upload button is clicked', async () => {
    render(<BrowserRouter><QandAListPage /></BrowserRouter>);
    const uploadButton = await screen.findByRole('button', { name: /Upload Q&A/i });
    fireEvent.click(uploadButton);
    expect(mockNavigate).toHaveBeenCalledWith(`/tutor/assignment/${mockAssignmentId}/qnas/upload`);
  });

  // Test Case 6: Interaction - Download file
  it('should initiate a file download when the download icon is clicked', async () => {
    const link = document.createElement('a');
    const linkClickSpy = vi.spyOn(link, 'click');
    
    // mock document.createElement to return a real DOM node
    vi.spyOn(document, 'createElement').mockReturnValue(link);

    render(<BrowserRouter><QandAListPage /></BrowserRouter>);
    const downloadButtons = await screen.findAllByTestId('DownloadIcon');
    fireEvent.click(downloadButtons[0]);

    // Assert that the download process was initiated correctly
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(link.setAttribute).toHaveBeenCalledWith('download', mockQAList[0].filename);
    expect(linkClickSpy).toHaveBeenCalled();
  });
  
  // Test Case 7: Interaction - Delete file (Happy Path)
  it('should call the DELETE API and update the list on successful deletion', async () => {
    render(<BrowserRouter><QandAListPage /></BrowserRouter>);
    await screen.findByText('QnA_file_1.pdf');

    const deleteButtons = screen.getAllByTestId('DeleteIcon');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalled();
      expect(api.delete).toHaveBeenCalledWith(`/qa/delete/${mockQAList[0].id}`);
    });
    expect(alertSpy).toHaveBeenCalledWith('File deleted successfully!');
    expect(screen.queryByText('QnA_file_1.pdf')).not.toBeInTheDocument();
    expect(screen.getByText('QnA_file_2.csv')).toBeInTheDocument();
  });

  // Test Case 8: Interaction - Delete file (Cancel)
  it('should NOT call the delete API if the user cancels the confirmation', async () => {
    confirmSpy.mockReturnValue(false); // User clicks "Cancel"
    render(<BrowserRouter><QandAListPage /></BrowserRouter>);
    await screen.findByText('QnA_file_1.pdf');

    const deleteButtons = screen.getAllByTestId('DeleteIcon');
    fireEvent.click(deleteButtons[0]);

    expect(confirmSpy).toHaveBeenCalled();
    expect(api.delete).not.toHaveBeenCalled();
    expect(screen.getByText('QnA_file_1.pdf')).toBeInTheDocument();
  });

  // Test Case 9: Interaction - Delete file (Sad Path: API failure)
  it('should display an error if the DELETE API call fails', async () => {
    api.delete.mockRejectedValue(new Error('Deletion failed'));
    
    render(<BrowserRouter><QandAListPage /></BrowserRouter>);
    await screen.findByText('QnA_file_1.pdf');

    const deleteButtons = screen.getAllByTestId('DeleteIcon');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
        expect(confirmSpy).toHaveBeenCalled();
        expect(api.delete).toHaveBeenCalledWith(`/qa/delete/${mockQAList[0].id}`);
    });

    expect(alertSpy).toHaveBeenCalledWith('Failed to delete the file. Please try again.');
    expect(screen.getByText('QnA_file_1.pdf')).toBeInTheDocument();
  });

  // Test Case 10: Utility Function - File icon is correct
  it('should render correct icons for different file types', async () => {
    render(<BrowserRouter><QandAListPage /></BrowserRouter>);
    await screen.findByText('QnA_file_1.pdf');
    
    const icons = screen.getAllByTestId('DescriptionIcon');
    expect(icons.length).toBe(1);

    const attachIcons = screen.getAllByTestId('AttachFileIcon');
    expect(attachIcons.length).toBe(1);
  });
});