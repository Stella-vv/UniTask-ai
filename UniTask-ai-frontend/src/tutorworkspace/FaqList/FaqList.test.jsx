// src/tutorworkspace/FaqList/FaqList.test.jsx (Corrected)

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FaqList from './FaqList';
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
const mockFaqData = [
  { id: 'f1', question: 'What is the deadline for this assignment?', answer: 'The deadline is next Friday.' },
  { id: 'f2', question: 'How many words should the report be?', answer: 'The report should be between 1000-1500 words.' },
];

describe('Tutor FaqList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockImplementation((url) => {
      if (url.includes(`/assignments/detail/${mockAssignmentId}`)) {
        return Promise.resolve({ data: mockAssignmentData });
      }
      if (url.includes(`/faqs/assignment/${mockAssignmentId}`)) {
        return Promise.resolve({ data: mockFaqData });
      }
      return Promise.resolve({ data: [] });
    });
  });

  // Test Case 1: Happy Path - Renders FAQs correctly
  it('should render the list of FAQs after a successful API call', async () => {
    render(
      <BrowserRouter>
        <FaqList />
      </BrowserRouter>
    );

    // Assert: Check for loading state initially
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Assert: Wait for the header and FAQ questions to be rendered
    expect(await screen.findByText(`FAQs for ${mockAssignmentData.name}`)).toBeInTheDocument();
    expect(screen.getByText('What is the deadline for this assignment?')).toBeInTheDocument();
    expect(screen.getByText('How many words should the report be?')).toBeInTheDocument();
  });

  // Test Case 2: Sad Path - Displays an empty state when no FAQs are found
  it('should display the empty state and upload button when no FAQs are found', async () => {
    // Arrange: Mock the API to return an empty FAQ list
    api.get.mockImplementation((url) => {
      if (url.includes(`/assignments/detail/${mockAssignmentId}`)) {
        return Promise.resolve({ data: mockAssignmentData });
      }
      if (url.includes(`/faqs/assignment/${mockAssignmentId}`)) {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: [] });
    });

    render(
      <BrowserRouter>
        <FaqList />
      </BrowserRouter>
    );

    // Assert: Wait for the empty state message and its button
    expect(await screen.findByText('No FAQs Found')).toBeInTheDocument();
    expect(screen.getByText('No FAQs have been uploaded for this assignment yet.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upload First FAQ/i })).toBeInTheDocument();
  });

  // Test Case 3: Sad Path - Displays an error message on API failure
  it('should display an error message if the API call fails', async () => {
    // Arrange: Mock a failed API response
    api.get.mockRejectedValue(new Error('Network Error'));

    render(
      <BrowserRouter>
        <FaqList />
      </BrowserRouter>
    );

    // Assert: Wait for the error message to be displayed
    expect(await screen.findByText(/Failed to load FAQs/i)).toBeInTheDocument();
  });
  
  // Test Case 4: Interaction - Accordion expands and collapses
  it('should expand and collapse the accordion to show/hide the answer', async () => {
    // Arrange
    render(
      <BrowserRouter>
        <FaqList />
      </BrowserRouter>
    );

    // Act: Click to expand. The name of the button is just the question text.
    const question1Button = await screen.findByRole('button', { name: mockFaqData[0].question });
    fireEvent.click(question1Button);
    
    // Assert: The answer is now visible
    const answer1 = screen.getByText('The deadline is next Friday.');
    expect(question1Button).toHaveAttribute('aria-expanded', 'true');
    expect(answer1).toBeVisible();
    
    // Act: Click again to collapse
    fireEvent.click(question1Button);

    // Assert: The answer is no longer visible. Use waitFor to account for CSS transition.
    await waitFor(() => {
      expect(question1Button).toHaveAttribute('aria-expanded', 'false');
      expect(answer1).not.toBeVisible();
    });
  });
  
  // Test Case 5: Navigation - "Back" button
  it('should navigate back to the assignment detail page when the back button is clicked', async () => {
    // Arrange
    render(
      <BrowserRouter>
        <FaqList />
      </BrowserRouter>
    );
    
    // Act
    const backButton = await screen.findByRole('button', { name: 'Back' });
    fireEvent.click(backButton);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith(`/tutor/assignment/${mockAssignmentId}`);
  });

  // Test Case 6: Navigation - "Upload FAQ" button
  it('should navigate to the FAQ upload page when the upload button is clicked', async () => {
    // Arrange
    render(
      <BrowserRouter>
        <FaqList />
      </BrowserRouter>
    );
    
    // Act
    const uploadButton = await screen.findByRole('button', { name: /Upload FAQ/i });
    fireEvent.click(uploadButton);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith(`/tutor/assignment/${mockAssignmentId}/faqs/upload`);
  });
  
  // Test Case 7: Navigation - Edit icon
  it('should navigate to the FAQ modify page when the edit icon is clicked', async () => {
    // Arrange
    render(
      <BrowserRouter>
        <FaqList />
      </BrowserRouter>
    );
    
    // Act
    // The edit icon has a data-testid, which is a reliable selector
    const editIcons = await screen.findAllByTestId('EditIcon');
    fireEvent.click(editIcons[0]); // Click the first edit icon

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith(`/tutor/assignment/${mockAssignmentId}/faqs/modify/f1`);
  });
});