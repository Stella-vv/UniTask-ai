
import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import QandAListPage from './QandAListPage';
import api from '../../api';

// Mock the entire api module to control its behavior in tests
vi.mock('../../api');

// Mock react-router-dom hooks to control navigation and URL parameters
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

// Mock data for the assignment and Q&A list
const mockAssignmentData = { id: mockAssignmentId, name: 'Assignment 1' };
const mockQAList = [
  { id: 'q1', filename: 'QnA_file_1.pdf', filetype: 'application/pdf', created_at: '2025-08-14T01:00:00Z' },
  { id: 'q2', filename: 'QnA_file_2.csv', filetype: 'text/csv', created_at: '2025-08-13T15:30:00Z' },
];

describe('QandAListPage Component', () => {
  let confirmSpy;
  let alertSpy;
  
  beforeEach(() => {
    // Reset all mocks before each test to ensure isolation
    vi.clearAllMocks();
    
    // Mock browser APIs like confirm and alert
    confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    // Mock localStorage as it's used for user authentication
    localStorage.setItem('user', JSON.stringify({ id: 1, email: 'tutor@test.com' }));

    // Mock API calls to return predefined data
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
    // Clean up mocks after each test
    confirmSpy.mockRestore();
    alertSpy.mockRestore();
    localStorage.clear();
  });

  // Test Case 1: Happy Path - Renders the Q&A list correctly
  it('should render the list of Q&As after a successful API call', async () => {
    render(<BrowserRouter><QandAListPage /></BrowserRouter>);

    // Assert: Initially shows a loading indicator
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    // Assert: After loading, displays the correct title and file names
    expect(await screen.findByText(`Q&As for ${mockAssignmentData.name}`)).toBeInTheDocument();
    expect(screen.getByText('QnA_file_1.pdf')).toBeInTheDocument();
    expect(screen.getByText('QnA_file_2.csv')).toBeInTheDocument();
  });

  // Test Case 2: Sad Path - Displays an empty state when no files are found
  it('should display the empty state when no Q&A files are found', async () => {
    // Arrange: Override the mock to return an empty array for the Q&A list
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

    // Assert: Shows the "No Q&As Found" message and a prompt to upload
    expect(await screen.findByText('No Q&As Found')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upload First Q&A/i })).toBeInTheDocument();
  });

  // Test Case 3: Sad Path - Displays an error message on API failure
  it('should display an error message if the API call for Q&A list fails', async () => {
    // Arrange: Mock the API to reject the promise
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

    // Assert: The component catches the error and displays a user-friendly message
    expect(await screen.findByText(/Failed to load Q&A list/i)).toBeInTheDocument();
  });

  // Test Case 4: Navigation - "Back" button
  it('should navigate back to the assignment detail page when the back button is clicked', async () => {
    render(<BrowserRouter><QandAListPage /></BrowserRouter>);
    const backButton = await screen.findByRole('button', { name: 'Back' });
    
    // Act
    fireEvent.click(backButton);
    
    // Assert
    expect(mockNavigate).toHaveBeenCalledWith(`/tutor/assignment/${mockAssignmentId}`);
  });

  // Test Case 5: Navigation - "Upload Q&A" button
  it('should navigate to the Q&A upload page when the upload button is clicked', async () => {
    render(<BrowserRouter><QandAListPage /></BrowserRouter>);
    const uploadButton = await screen.findByRole('button', { name: /Upload Q&A/i });
    
    // Act
    fireEvent.click(uploadButton);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith(`/tutor/assignment/${mockAssignmentId}/qnas/upload`);
  });

  // Test Case 6: Interaction - Download file (Fixed)
  it('should have a correctly formatted download link', async () => {
    render(<BrowserRouter><QandAListPage /></BrowserRouter>);
    
    // Assert: Find the download icon and then check its parent link
    const downloadIcons = await screen.findAllByTestId('DownloadIcon');
    const downloadLink = downloadIcons[0].closest('a'); // Find the wrapping <a> tag
    
    expect(downloadLink).toHaveAttribute('href', `${api.defaults.baseURL}/qa/download/${mockQAList[0].id}`);
    expect(downloadLink).toHaveAttribute('download', mockQAList[0].filename);
  });
  
  // Test Case 7: Interaction - Delete file (Happy Path) (Fixed Selector)
  it('should call the DELETE API and update the list on successful deletion', async () => {
    render(<BrowserRouter><QandAListPage /></BrowserRouter>);
    
    // Arrange: Find the list item for the first file
    const listItem1 = await screen.findByText('QnA_file_1.pdf');
    
    // Act: Find the delete icon within that specific list item and click its parent button
    const deleteIcon = within(listItem1.closest('li')).getByTestId('DeleteIcon');
    fireEvent.click(deleteIcon.closest('button'));

    // Assert: Confirm dialog was shown and API was called correctly
    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalled();
      expect(api.delete).toHaveBeenCalledWith(`/qa/delete/${mockQAList[0].id}`);
    });

    // Assert: Success message is shown and the item is removed from the UI
    expect(alertSpy).toHaveBeenCalledWith('File deleted successfully!');
    expect(screen.queryByText('QnA_file_1.pdf')).not.toBeInTheDocument();
    expect(screen.getByText('QnA_file_2.csv')).toBeInTheDocument();
  });

  // Test Case 8: Interaction - Delete file (Cancel) (Fixed Selector)
  it('should NOT call the delete API if the user cancels the confirmation', async () => {
    // Arrange: Mock window.confirm to return false
    confirmSpy.mockReturnValue(false);
    render(<BrowserRouter><QandAListPage /></BrowserRouter>);
    
    const listItem1 = await screen.findByText('QnA_file_1.pdf');
    const deleteIcon = within(listItem1.closest('li')).getByTestId('DeleteIcon');

    // Act
    fireEvent.click(deleteIcon.closest('button'));

    // Assert: Confirmation was shown, but delete API was not called
    expect(confirmSpy).toHaveBeenCalled();
    expect(api.delete).not.toHaveBeenCalled();
    expect(screen.getByText('QnA_file_1.pdf')).toBeInTheDocument();
  });

  // Test Case 9: Interaction - Delete file (Sad Path: API failure) (FIXED)
  it('should display an error if the DELETE API call fails', async () => {
    // Arrange: Mock the delete API to reject
    api.delete.mockRejectedValue(new Error('Deletion failed'));
    
    render(<BrowserRouter><QandAListPage /></BrowserRouter>);
    
    const listItem1 = await screen.findByText('QnA_file_1.pdf');
    const deleteIcon = within(listItem1.closest('li')).getByTestId('DeleteIcon');

    // Act
    fireEvent.click(deleteIcon.closest('button'));

    // Assert: API was called
    await waitFor(() => {
        expect(confirmSpy).toHaveBeenCalled();
        expect(api.delete).toHaveBeenCalledWith(`/qa/delete/${mockQAList[0].id}`);
    });

    // Assert: An error message is displayed in an Alert component, and the item remains.
    const errorAlert = await screen.findByRole('alert');
    expect(errorAlert).toHaveTextContent('Failed to delete the file. Please try again.');
    expect(screen.getByText('QnA_file_1.pdf')).toBeInTheDocument();
  });
});
