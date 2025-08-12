// src/studentworkspace/Dashboard/Dashboard.test.jsx
import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';


vi.mock('../../api', () => ({
  __esModule: true,
  default: { get: vi.fn() },
}));

import api from '../../api';
import Dashboard from './Dashboard';

// Helper to render the component with a router (safe for any internal links)
const renderDash = () =>
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );

describe('Student Dashboard Page (dynamic)', () => {
  beforeEach(() => {
    // Clean DOM & mocks between tests
    cleanup();
    vi.clearAllMocks();

    // Simulate a logged-in user so the component will hit the API
    localStorage.clear();
    localStorage.setItem('user', JSON.stringify({ id: 42 }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the three cards with API dynamic data', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/courses/') {
        return Promise.resolve({ data: [{ id: 1 }, { id: 2 }] });
      }
      if (url === '/assignments') {
        return Promise.resolve({ data: [{ id: 1 }, { id: 2 }, { id: 3 }] });
      }
      if (url === '/faqs/assignment/1') {
        return Promise.resolve({ data: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }] });
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });

    renderDash();

    // Assert API is called as expected (3 parallel GETs)
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(3);
      expect(api.get).toHaveBeenNthCalledWith(1, '/courses/');
      expect(api.get).toHaveBeenNthCalledWith(2, '/assignments');
      expect(api.get).toHaveBeenNthCalledWith(3, '/faqs/assignment/1');
    });

    // Assert dynamic copy is rendered from the mocked counts
    expect(await screen.findByText(/You have 2 courses/i)).toBeInTheDocument();
    expect(screen.getByText(/3 assignments created/i)).toBeInTheDocument();
    expect(screen.getByText(/4 FAQs/i)).toBeInTheDocument();
  });
});
