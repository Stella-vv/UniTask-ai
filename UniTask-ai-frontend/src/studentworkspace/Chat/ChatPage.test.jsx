// src/studentworkspace/Chat/ChatPage.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ChatPage from './ChatPage';
import api from '../../api';

// Mock the API module
vi.mock('../../api');

// Mock react-router-dom hooks
const mockNavigate = vi.fn();
const mockAssignmentId = '1';
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ assignmentId: mockAssignmentId }),
  };
});

// Mock the scrollIntoView function because it doesn't exist in jsdom
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('ChatPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage to simulate a logged-in user
    localStorage.setItem('user', JSON.stringify({ id: 1, email: 'student@test.com' }));
    // Mock the initial assignment name fetch
    api.get.mockResolvedValue({ data: { name: 'Test Assignment' } });
  });

  afterEach(() => {
    localStorage.clear();
  });

  // Test Case 1: Renders initial state correctly
  it('should render the initial chat interface and welcome message', async () => {
    render(
      <BrowserRouter>
        <ChatPage />
      </BrowserRouter>
    );

    // Assert: Header displays the assignment name
    expect(await screen.findByText(/Help for Test Assignment/i)).toBeInTheDocument();
    
    // Assert: Initial welcome message from assistant is present
    expect(screen.getByText(/Hello! How can I help you/i)).toBeInTheDocument();
    
    // Assert: Input field and send button are present
    expect(screen.getByPlaceholderText(/Ask a question/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send/i })).toBeInTheDocument();
  });

  // Test Case 2: Happy Path - User sends a message and gets a response
  it('should send a user message and display the AI response', async () => {
    // Arrange: Mock the AI response with a controllable promise
    const aiResponse = 'The answer is 42.';
    let resolveApiCall;
    const apiPromise = new Promise(resolve => {
      resolveApiCall = resolve;
    });
    api.post.mockImplementation(() => apiPromise);
    
    render(
      <BrowserRouter>
        <ChatPage />
      </BrowserRouter>
    );
    await screen.findByText(/Help for Test Assignment/i); // Wait for initial load

    // Act: User types and sends a message
    const inputField = screen.getByPlaceholderText(/Ask a question/i);
    const sendButton = screen.getByRole('button', { name: /Send/i });

    fireEvent.change(inputField, { target: { value: 'What is the meaning of life?' } });
    fireEvent.click(sendButton);

    // Assert: User's message appears immediately
    expect(await screen.findByText('What is the meaning of life?')).toBeInTheDocument();
    
    // Assert: Check for loading state BEFORE the API call resolves
    expect(screen.getByText('Thinking...')).toBeInTheDocument();
    expect(sendButton).toBeDisabled();

    // Act: Manually resolve the API promise now
    await act(async () => {
      resolveApiCall({ data: { answer: aiResponse } });
      await new Promise(resolve => setTimeout(resolve, 0)); // Allow promise to settle
    });

    // Assert: AI's response is displayed and loading state is gone
    expect(await screen.findByText(aiResponse)).toBeInTheDocument();
    expect(screen.queryByText('Thinking...')).not.toBeInTheDocument();
    expect(sendButton).not.toBeDisabled();
  });

  // Test Case 3: Sad Path - API call for AI response fails
  it('should display an error message if the AI call fails', async () => {
    // Arrange: Mock a failed AI response
    const errorMessage = 'AI assistant is currently offline.';
    api.post.mockRejectedValue({ response: { data: { error: errorMessage } } });

    render(
      <BrowserRouter>
        <ChatPage />
      </BrowserRouter>
    );
    await screen.findByText(/Help for Test Assignment/i);

    // Act: User sends a message
    fireEvent.change(screen.getByPlaceholderText(/Ask a question/i), { target: { value: 'Help me!' } });
    fireEvent.click(screen.getByRole('button', { name: /Send/i }));

    // Assert: An error message is displayed in the chat and as an alert
    expect(await screen.findByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
  });

  // Test Case 4: Navigation - Back button
  it('should navigate back when the back button is clicked', async () => {
    render(
      <BrowserRouter>
        <ChatPage />
      </BrowserRouter>
    );
    
    // Wait for header to render to ensure button is present
    const backButton = await screen.findByRole('button', { name: /Back/i });

    // Act
    fireEvent.click(backButton);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});