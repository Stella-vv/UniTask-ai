// src/tutorworkspace/Forum/AssignmentForumPage.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AssignmentForumPage from './AssignmentForumPage';
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

const mockForumData = { id: 'f1', title: 'Forum for Assignment 1' };
const mockQuestionsData = [
  {
    id: 'q1',
    content: 'What is the due date?',
    user_email: 'student1@test.com',
    created_at: '2025-08-14T01:00:00Z',
    replies: [
      {
        id: 'r1',
        content: 'It is due next Friday.',
        user_email: 'tutor@test.com',
        created_at: '2025-08-14T01:05:00Z',
      },
    ],
  },
  {
    id: 'q2',
    content: 'Any hints for the first part?',
    user_email: 'student2@test.com',
    created_at: '2025-08-14T01:10:00Z',
    replies: [],
  },
];

describe('Tutor AssignmentForumPage Component', () => {
  let alertSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    localStorage.setItem('user', JSON.stringify({ id: 1, email: 'tutor@test.com' }));
    api.get.mockImplementation((url) => {
      if (url.includes(`/forum/${mockAssignmentId}`)) {
        return Promise.resolve({ data: mockForumData });
      }
      if (url.includes(`/forum/${mockForumData.id}/questions`)) {
        return Promise.resolve({ data: mockQuestionsData });
      }
      return Promise.resolve({ data: [] });
    });
    api.post.mockResolvedValue({ data: {} });
  });

  afterEach(() => {
    alertSpy.mockRestore();
    localStorage.clear();
  });

  // Test Case 1: Happy Path - Renders forum data correctly
  it('should render the forum title, questions, and replies', async () => {
    render(
      <BrowserRouter>
        <AssignmentForumPage />
      </BrowserRouter>
    );

    // Assert: Forum title is displayed
    expect(await screen.findByText(mockForumData.title)).toBeInTheDocument();

    // Assert: Questions and replies are rendered
    expect(screen.getByText('What is the due date?')).toBeInTheDocument();
    expect(screen.getByText('It is due next Friday.')).toBeInTheDocument();
    expect(screen.getByText('Any hints for the first part?')).toBeInTheDocument();
  });

  // Test Case 2: Sad Path - Displays an error if fetching data fails
  it('should display an error message if fetching data fails', async () => {
    // Arrange: Mock a failed API response
    api.get.mockRejectedValue(new Error('API Error'));

    render(
      <BrowserRouter>
        <AssignmentForumPage />
      </BrowserRouter>
    );

    // Assert: Wait for the error message to be displayed
    expect(await screen.findByText(/Could not load forum data/i)).toBeInTheDocument();
  });

  // Test Case 3: Interaction - Submitting a new question
  it('should allow a user to submit a new question', async () => {
    render(
      <BrowserRouter>
        <AssignmentForumPage />
      </BrowserRouter>
    );
    await screen.findByText(mockForumData.title); // Wait for initial load

    // Act: User types a new question and submits
    const questionInput = screen.getByPlaceholderText(/Type your question here/i);
    const submitButton = screen.getByRole('button', { name: /Submit Question/i });

    fireEvent.change(questionInput, { target: { value: 'This is a new question.' } });
    fireEvent.click(submitButton);

    // Assert: API was called to post the new question
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(`/forum/${mockForumData.id}/questions`, {
        content: 'This is a new question.',
        user_id: 1,
      });
    });
  });

  // Test Case 4: Interaction - Submitting a reply
  it('should allow a user to submit a reply to a question', async () => {
    render(
      <BrowserRouter>
        <AssignmentForumPage />
      </BrowserRouter>
    );
    await screen.findByText(mockForumData.title);

    // Act: Find the reply button for the second question and click it
    const replyButtons = screen.getAllByRole('button', { name: /Reply/i });
    fireEvent.click(replyButtons[1]); // Click reply for "Any hints...?"

    // Act: Type a reply and submit
    const replyInput = await screen.findByPlaceholderText(/Write your reply/i);
    const submitReplyButton = screen.getByRole('button', { name: /Submit Reply/i });

    fireEvent.change(replyInput, { target: { value: 'This is a new reply.' } });
    fireEvent.click(submitReplyButton);

    // Assert: API was called to post the new reply
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/replies', {
        content: 'This is a new reply.',
        user_id: 1,
        question_id: 'q2',
      });
    });
  });

  // Test Case 5: Navigation - Back button
  it('should navigate back to the assignment detail page', async () => {
    render(
      <BrowserRouter>
        <AssignmentForumPage />
      </BrowserRouter>
    );
    const backButton = await screen.findByRole('button', { name: /Back/i });

    // Act
    fireEvent.click(backButton);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith(`/tutor/assignment/${mockAssignmentId}`);
  });
});