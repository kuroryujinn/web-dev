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

  it('shows an empty state when progress is null', () => {
    render(<SessionHistory progress={null} />);

    expect(screen.getByText(/no activities yet/i)).toBeInTheDocument();
  });

  it('shows an empty state when the activities key is missing', () => {
    render(<SessionHistory progress={{ totalXP: 0 }} />);

    expect(screen.getByText(/no activities yet/i)).toBeInTheDocument();
  });

  it('renders "Recently" for sessions with no timestamp', () => {
    const progress = {
      activities: {
        noTs: { bestScore: 70, stars: 2, attempts: 1, completed: true }, // no lastAttempted
      },
    };

    render(<SessionHistory progress={progress} />);

    expect(screen.getByText(/recently/i)).toBeInTheDocument();
  });

  it('sorts timestamped sessions before untimestamped ones', () => {
    const progress = {
      activities: {
        noTs: { bestScore: 50, stars: 1, attempts: 1, completed: true },
        withTs: { bestScore: 90, stars: 3, attempts: 1, completed: true, lastAttempted: '2026-08-01T10:00:00.000Z' },
      },
    };
    const titles = { noTs: 'No Timestamp', withTs: 'With Timestamp' };

    const { container } = render(<SessionHistory progress={progress} activityTitles={titles} />);

    const items = container.querySelectorAll('li');
    expect(items[0]).toHaveTextContent('With Timestamp');
    expect(items[1]).toHaveTextContent('No Timestamp');
  });

  it('sorts correctly across mixed timestamp formats including timezone offsets', () => {
    const progress = {
      activities: {
        offsetUtcPlus: { bestScore: 80, stars: 2, attempts: 1, completed: true, lastAttempted: '2026-08-05T10:00:00+05:30' },
        isoUtc: { bestScore: 90, stars: 3, attempts: 1, completed: true, lastAttempted: '2026-08-05T04:30:00.000Z' },
        dateOnly: { bestScore: 70, stars: 2, attempts: 1, completed: true, lastAttempted: '2026-07-20' },
      },
    };
    const titles = {
      offsetUtcPlus: 'Offset +05:30',
      isoUtc: 'ISO UTC',
      dateOnly: 'Date Only',
    };

    const { container } = render(<SessionHistory progress={progress} activityTitles={titles} />);

    // +05:30 on Aug 5 10:00 == 04:30 UTC Aug 5 — the ISO UTC stamp is the same instant,
    // so both are more recent than the date-only July 20 entry (parsed as UTC midnight).
    const items = container.querySelectorAll('li');
    expect(items[2]).toHaveTextContent('Date Only');
    expect(items[0]).toHaveTextContent(/Offset|ISO/);
    expect(items[1]).toHaveTextContent(/Offset|ISO/);
  });

  it('does not crash when a timestamp is not parseable', () => {
    const progress = {
      activities: {
        badDate: { bestScore: 60, stars: 1, attempts: 2, completed: true, lastAttempted: 'not-a-real-date' },
      },
    };

    render(<SessionHistory progress={progress} />);

    expect(screen.getByText('badDate')).toBeInTheDocument();
    expect(screen.getByText(/attempts: 2/i)).toBeInTheDocument();
  });

  it('renders a dash for zero stars', () => {
    const progress = {
      activities: {
        zeroStars: { bestScore: 40, stars: 0, attempts: 1, completed: true, lastAttempted: '2026-08-01T10:00:00.000Z' },
      },
    };

    render(<SessionHistory progress={progress} />);

    // The stars span reads "—0 stars": a dash instead of any star emoji.
    expect(screen.getByText(/0 stars/i)).toBeInTheDocument();
    expect(screen.getByText(/^—/)).toBeInTheDocument();
  });

  it('renders a formatted date for a unicode-safe timestamp', () => {
    const progress = {
      activities: {
        unicodeTs: {
          bestScore: 85,
          stars: 2,
          attempts: 1,
          completed: true,
          lastAttempted: '2026-08-05T10:00:00.000+00:00',
        },
      },
    };

    render(<SessionHistory progress={progress} />);

    // The year is always rendered by toLocaleDateString regardless of locale.
    expect(screen.getByText(/2026/)).toBeInTheDocument();
    expect(screen.getByText(/attempts: 1/i)).toBeInTheDocument();
  });
});
