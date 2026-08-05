import React from 'react';
import { render, screen } from '@testing-library/react';
import QuickStats from '../QuickStats';

describe('QuickStats', () => {
  const baseProgress = {
    totalXP: 1230,
    activities: {
      a1: { bestScore: 100, stars: 3, attempts: 1, completed: true },
      a2: { bestScore: 80, stars: 2, attempts: 2, completed: false },
    },
    streak: 4,
    badges: ['first_steps'],
  };

  it('renders all four stat cards', () => {
    render(<QuickStats progress={baseProgress} />);

    expect(screen.getByText('Total XP')).toBeInTheDocument();
    expect(screen.getByText('Activities')).toBeInTheDocument();
    expect(screen.getByText('Streak')).toBeInTheDocument();
    expect(screen.getByText('Badges')).toBeInTheDocument();
    expect(screen.getByText('1230')).toBeInTheDocument();
    expect(screen.getByText('4 days')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('falls back to zeros when progress is null', () => {
    render(<QuickStats progress={null} />);

    expect(screen.getAllByText('0')).toHaveLength(3); // XP, Activities, Badges
    expect(screen.getByText('0 days')).toBeInTheDocument();
  });

  it('treats an empty progress object like a fresh user', () => {
    render(<QuickStats progress={{}} />);

    expect(screen.getAllByText('0')).toHaveLength(3);
    expect(screen.getByText('0 days')).toBeInTheDocument();
  });

  it('does not crash when optional keys are missing entirely', () => {
    render(<QuickStats progress={{ totalXP: 500 }} />);

    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getAllByText('0')).toHaveLength(2); // Activities + Badges
    expect(screen.getByText('0 days')).toBeInTheDocument();
  });

  it('handles activities being null instead of an object', () => {
    render(<QuickStats progress={{ totalXP: 100, activities: null, streak: 2, badges: [] }} />);

    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('2 days')).toBeInTheDocument();
    expect(screen.getAllByText('0')).toHaveLength(2); // Activities + Badges
  });

  it('counts all activity entries regardless of completion status', () => {
    const progress = {
      totalXP: 10,
      streak: 1,
      badges: [],
      activities: {
        a1: { bestScore: 90, stars: 3, attempts: 1, completed: true },
        a2: { bestScore: 70, stars: 2, attempts: 1, completed: true },
        a3: { bestScore: 0, stars: 0, attempts: 1, completed: false },
      },
    };
    render(<QuickStats progress={progress} />);

    // All three entries count, even the uncompleted one
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders larger streak values with the days suffix', () => {
    render(<QuickStats progress={{ ...baseProgress, streak: 12 }} />);

    expect(screen.getByText('12 days')).toBeInTheDocument();
  });
});
