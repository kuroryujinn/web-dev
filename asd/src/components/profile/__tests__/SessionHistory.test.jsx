import React from 'react';
import { render, screen } from '@testing-library/react';
import SessionHistory from '../SessionHistory';

describe('SessionHistory', () => {
  it('shows an empty state when there are no completed activities', () => {
    render(<SessionHistory progress={{ activities: {} }} />);

    expect(screen.getByText(/no activities yet/i)).toBeInTheDocument();
  });

  it('renders each completed activity with score, stars, and attempts', () => {
    const progress = {
      activities: {
        a1: { bestScore: 100, stars: 3, attempts: 1, completed: true, lastAttempted: '2026-08-01T10:00:00.000Z' },
        a2: { bestScore: 75, stars: 2, attempts: 3, completed: true, lastAttempted: '2026-07-30T09:00:00.000Z' },
      },
    };
    const titles = { a1: 'Identify the Fruit', a2: 'Match Body Parts' };

    render(<SessionHistory progress={progress} activityTitles={titles} />);

    expect(screen.getByText('Identify the Fruit')).toBeInTheDocument();
    expect(screen.getByText('Match Body Parts')).toBeInTheDocument();
    expect(screen.getAllByText(/3 stars/i)).toHaveLength(1);
    expect(screen.getByText(/attempts: 3/i)).toBeInTheDocument();
    expect(screen.getByText(/100%/)).toBeInTheDocument();
    expect(screen.getByText(/75%/)).toBeInTheDocument();
  });

  it('sorts sessions by most recent first', () => {
    const progress = {
      activities: {
        older: { bestScore: 60, stars: 1, attempts: 1, completed: true, lastAttempted: '2026-07-01T10:00:00.000Z' },
        newer: { bestScore: 90, stars: 3, attempts: 1, completed: true, lastAttempted: '2026-08-05T10:00:00.000Z' },
      },
    };
    const titles = { older: 'Old Activity', newer: 'New Activity' };

    const { container } = render(<SessionHistory progress={progress} activityTitles={titles} />);

    // The most recent activity appears before the older one in the DOM
    const items = container.querySelectorAll('li');
    expect(items[0]).toHaveTextContent('New Activity');
    expect(items[1]).toHaveTextContent('Old Activity');
  });

  it('falls back to the activity id when no title is known', () => {
    const progress = {
      activities: {
        mystery_act: { bestScore: 50, stars: 1, attempts: 2, completed: true, lastAttempted: '2026-08-01T10:00:00.000Z' },
      },
    };

    render(<SessionHistory progress={progress} />);

    expect(screen.getByText('mystery_act')).toBeInTheDocument();
  });

  it('ignores uncompleted activity entries', () => {
    const progress = {
      activities: {
        done: { bestScore: 80, stars: 2, attempts: 1, completed: true, lastAttempted: '2026-08-01T10:00:00.000Z' },
        notDone: { bestScore: 0, stars: 0, attempts: 1, completed: false, lastAttempted: '2026-08-02T10:00:00.000Z' },
      },
    };

    render(<SessionHistory progress={progress} />);

    expect(screen.getByText('done')).toBeInTheDocument();
    expect(screen.queryByText('notDone')).not.toBeInTheDocument();
  });
});
