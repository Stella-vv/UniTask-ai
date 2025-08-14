import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, beforeEach, vi } from 'vitest';

import TutorDashboard from './Dashboard';
import api from '../../api';

vi.mock('../../api');

const renderDash = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <TutorDashboard />
    </MemoryRouter>
  );

describe('Tutor Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('shows loading then renders success counts (plural)', async () => {
    const mockCourses = [{ id: 1 }, { id: 2 }];
    const mockAssignments = [{ id: 101 }, { id: 102 }, { id: 103 }];

    vi.spyOn(api, 'get').mockImplementation((url) => {
      if (url.includes('/courses/')) return Promise.resolve({ data: mockCourses });
      if (url.includes('/assignments')) return Promise.resolve({ data: mockAssignments });
      return Promise.reject(new Error('Not mocked'));
    });

    renderDash();

    expect(screen.getByText(/Loading dashboard data/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Course')).toBeInTheDocument();
      expect(screen.getByText(/You have 2 courses/i)).toBeInTheDocument();
      expect(screen.getByText('Assignment')).toBeInTheDocument();
      expect(screen.getByText(/3 assignments created/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('link', { name: /Course/i })).toHaveAttribute('href', '/tutor/course');
    expect(screen.getByRole('link', { name: /Assignment/i })).toHaveAttribute('href', '/tutor/assignment');
  });

  test('singular grammar (1 course, 1 assignment)', async () => {
    const mockCourses = [{ id: 1 }];
    const mockAssignments = [{ id: 201 }];

    vi.spyOn(api, 'get').mockImplementation((url) => {
      if (url.includes('/courses/')) return Promise.resolve({ data: mockCourses });
      if (url.includes('/assignments')) return Promise.resolve({ data: mockAssignments });
      return Promise.reject(new Error('Not mocked'));
    });

    renderDash();

    await waitFor(() => {
      expect(screen.getByText(/You have 1 course/i)).toBeInTheDocument();
      expect(screen.getByText(/1 assignment created/i)).toBeInTheDocument();
    });
  });

  test('partial failure: courses OK, assignments fail', async () => {
    const mockCourses = [{ id: 1 }, { id: 2 }];

    vi.spyOn(api, 'get').mockImplementation((url) => {
      if (url.includes('/courses/')) return Promise.resolve({ data: mockCourses });
      if (url.includes('/assignments')) return Promise.reject(new Error('API is down'));
      return Promise.reject(new Error('Not mocked'));
    });

    renderDash();

    await waitFor(() => {
      expect(screen.getByText(/You have 2 courses/i)).toBeInTheDocument();
      expect(screen.getByText(/No assignments created yet/i)).toBeInTheDocument();
    });
  });

  test('partial failure: assignments OK, courses fail', async () => {
    const mockAssignments = [{ id: 101 }, { id: 102 }, { id: 103 }];

    vi.spyOn(api, 'get').mockImplementation((url) => {
      if (url.includes('/courses/')) return Promise.reject(new Error('API is down'));
      if (url.includes('/assignments')) return Promise.resolve({ data: mockAssignments });
      return Promise.reject(new Error('Not mocked'));
    });

    renderDash();

    await waitFor(() => {
      expect(screen.getByText(/You have 0 courses/i)).toBeInTheDocument();
      expect(screen.getByText(/3 assignments created/i)).toBeInTheDocument();
    });
  });

  test('all failed: shows empty state (current component behavior)', async () => {
    vi.spyOn(api, 'get').mockRejectedValue(new Error('API is down'));

    renderDash();

    await waitFor(() => {
      expect(screen.getByText(/You have 0 courses/i)).toBeInTheDocument();
      expect(screen.getByText(/No assignments created yet/i)).toBeInTheDocument();
    });
  });
});
