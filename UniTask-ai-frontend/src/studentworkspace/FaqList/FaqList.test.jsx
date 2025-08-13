
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StudentFaqList from './FaqList';
import api from '../../api';

// Mock the API module
vi.mock('../../api');

// Mock react-router-dom hooks
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock Data
const mockCourses = [
  { id: 1, name: 'Course A' },
  { id: 2, name: 'Course B' },
];

const mockAssignments = [
  { id: 101, name: 'Assignment 1A' },
];

const mockFaqs = [
  { id: 1, question: 'Question 1?', answer: 'Answer 1.' },
  { id: 2, question: 'Question 2?', answer: 'Answer 2.' },
];

describe('StudentFaqList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default successful API responses
    api.get.mockImplementation((url) => {
      if (url.includes('/courses')) {
        return Promise.resolve({ data: mockCourses });
      }
      if (url.includes('/assignments/course/')) {
        return Promise.resolve({ data: mockAssignments });
      }
      if (url.includes('/faqs/assignment/')) {
        return Promise.resolve({ data: mockFaqs });
      }
      return Promise.resolve({ data: [] });
    });
  });

  // Test Case 1: Renders initial state and data correctly
  it('should render filters and display FAQs for the default course', async () => {
    render(
      <BrowserRouter>
        <StudentFaqList />
      </BrowserRouter>
    );

    // Assert: Waits for FAQs to be loaded and displayed
    const question1 = await screen.findByText('Question 1?');
    expect(question1).toBeInTheDocument();
    expect(screen.getByText('Question 2?')).toBeInTheDocument();

    // Assert: Accordion is initially collapsed by checking aria-expanded attribute
    const accordionButton = screen.getByRole('button', { name: 'Question 1?' });
    expect(accordionButton).toHaveAttribute('aria-expanded', 'false');
  });

  // Test Case 2: Accordion interaction
  it('should expand and collapse the accordion to show/hide the answer', async () => {
    render(
      <BrowserRouter>
        <StudentFaqList />
      </BrowserRouter>
    );

    const accordionButton = await screen.findByRole('button', { name: 'Question 1?' });
    
    // Act: Click to expand
    fireEvent.click(accordionButton);
    
    // Assert: Accordion is expanded and answer is visible
    expect(accordionButton).toHaveAttribute('aria-expanded', 'true');
    expect(await screen.findByText('Answer 1.')).toBeInTheDocument();
    
    // Act: Click again to collapse
    fireEvent.click(accordionButton);

    // Assert: Accordion is collapsed again
    expect(accordionButton).toHaveAttribute('aria-expanded', 'false');
  });

  // Test Case 3: Filtering by course
  it('should refetch FAQs when a new course is selected', async () => {
    render(
      <BrowserRouter>
        <StudentFaqList />
      </BrowserRouter>
    );
    await screen.findByText('Question 1?'); // Wait for initial load

    // Act: Change course selection using a more robust selector
    const courseSelect = screen.getAllByRole('combobox')[0]; // First combobox is for courses
    fireEvent.mouseDown(courseSelect);
    const courseOption = await screen.findByRole('option', { name: 'Course B' });
    fireEvent.click(courseOption);

    // Assert: API was called to get new assignments and FAQs
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/assignments/course/2');
      expect(api.get).toHaveBeenCalledWith('/faqs/assignment/2');
    });
  });

  // Test Case 4: Sad Path - No FAQs found
  it('should display a "no FAQs found" message when API returns empty array', async () => {
    // Arrange
    api.get.mockImplementation((url) => {
      if (url.includes('/faqs/assignment/')) {
        return Promise.resolve({ data: [] });
      }
      if (url.includes('/courses')) {
        return Promise.resolve({ data: mockCourses });
      }
      return Promise.resolve({ data: [] });
    });

    render(
      <BrowserRouter>
        <StudentFaqList />
      </BrowserRouter>
    );

    // Assert
    expect(await screen.findByText(/No FAQs Found/i)).toBeInTheDocument();
  });

  // Test Case 5: Sad Path - API error
  it('should display an error message if fetching courses fails', async () => {
    // Arrange
    api.get.mockRejectedValue(new Error('API Error'));

    render(
      <BrowserRouter>
        <StudentFaqList />
      </BrowserRouter>
    );

    // Assert
    expect(await screen.findByText(/Failed to load courses/i)).toBeInTheDocument();
  });
});
