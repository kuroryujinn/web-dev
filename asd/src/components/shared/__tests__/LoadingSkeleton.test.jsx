import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSkeleton from '../LoadingSkeleton';

describe('LoadingSkeleton', () => {
  it('renders a status region announcing loading', () => {
    render(<LoadingSkeleton variant="dashboard" />);

    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('renders layout-matched placeholder blocks for the dashboard', () => {
    const { container } = render(<LoadingSkeleton variant="dashboard" />);

    // Header + 4 stat cards + 6 level cards + 8 badge tiles
    expect(container.querySelectorAll('.skeleton-block').length).toBe(19);
  });

  it('renders placeholder blocks for the profile layout', () => {
    const { container } = render(<LoadingSkeleton variant="profile" />);

    // Header + 5 stat cards + badges + history rows
    expect(container.querySelectorAll('.skeleton-block').length).toBeGreaterThan(5);
  });

  it('renders a compact centered layout for the app/auth boot', () => {
    const { container } = render(<LoadingSkeleton variant="app" />);

    expect(container.querySelectorAll('.skeleton-block').length).toBeGreaterThan(0);
    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();
  });
});
