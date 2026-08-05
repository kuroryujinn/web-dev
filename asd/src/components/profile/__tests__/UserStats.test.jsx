import React from 'react';
import { render, screen } from '@testing-library/react';
import UserStats from '../UserStats';

describe('UserStats', () => {
  const baseProgress = {
    totalXP: 1230,
    currentLevel: 3,
    badges: ['first_steps'],
    activities: {
      a1: { bestScore: 100, stars: 3, attempts: 1, completed: true },
      a2: { bestScore: 80, stars: 2, attempts: 2, completed: true },
    },
    streak: 4,
  };

  it('renders total XP, level, activities, badges, and streak', () => {
    render(<UserStats progress={baseProgress} />);

    expect(screen.getByText('Total XP')).toBeInTheDocument();
    expect(screen.getByText('1230')).toBeInTheDocument();
    expect(screen.getByText('Current Level')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Activities')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Badges')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Day Streak')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('counts only completed activities', () => {
    const progress = {
      ...baseProgress,
      // Two badges so the Activities value (1) is unique on screen
      badges: ['first_steps', 'quick_learner'],
      activities: {
        a1: { bestScore: 100, stars: 3, attempts: 1, completed: true },
        a2: { bestScore: 80, stars: 2, attempts: 2, completed: false },
        a3: { bestScore: 50, stars: 1, attempts: 3, completed: false },
      },
    };
    render(<UserStats progress={progress} />);

    expect(screen.getByText('Activities')).toBeInTheDocument();
    // Only a1 is completed
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // badges
  });

  it('falls back to zeros when progress is null', () => {
    render(<UserStats progress={null} />);

    // XP, Activities, Badges, Streak all default to 0; level defaults to 1
    expect(screen.getAllByText('0')).toHaveLength(4);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Total XP')).toBeInTheDocument();
    expect(screen.getByText('Current Level')).toBeInTheDocument();
  });

  it('treats an empty progress object like a fresh user', () => {
    render(<UserStats progress={{}} />);

    expect(screen.getAllByText('0')).toHaveLength(4);
    expect(screen.getByText('1')).toBeInTheDocument(); // level
  });

  it('does not crash when optional keys are missing entirely', () => {
    // No badges/streak/activities keys at all
    render(<UserStats progress={{ totalXP: 500, currentLevel: 2 }} />);

    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getAllByText('0')).toHaveLength(3); // activities, badges, streak
  });

  it('handles activities being null instead of an object', () => {
    render(<UserStats progress={{ totalXP: 100, currentLevel: 1, activities: null, badges: [], streak: 1 }} />);

    expect(screen.getByText('100')).toBeInTheDocument();
    // activities (0) + badges (0)
    expect(screen.getAllByText('0')).toHaveLength(2);
    // level (1) + streak (1)
    expect(screen.getAllByText('1')).toHaveLength(2);
  });

  it('shows zero XP while still counting completed activities', () => {
    const progress = {
      totalXP: 0,
      currentLevel: 1,
      badges: [],
      streak: 0,
      activities: {
        a1: { bestScore: 90, stars: 3, attempts: 1, completed: true },
        a2: { bestScore: 60, stars: 1, attempts: 2, completed: true },
      },
    };
    render(<UserStats progress={progress} />);

    // XP = 0 but Activities = 2 — the values are ambiguous text, so assert via getAllByText
    expect(screen.getAllByText('0')).toHaveLength(3); // XP, badges, streak
    expect(screen.getByText('2')).toBeInTheDocument(); // activities
  });

  it('renders large XP values without truncation', () => {
    render(<UserStats progress={{ ...baseProgress, totalXP: 1234567 }} />);

    expect(screen.getByText('1234567')).toBeInTheDocument();
  });

  it('renders a maximum level of 5 and zero streak', () => {
    const progress = {
      totalXP: 99999,
      currentLevel: 5,
      badges: ['first_steps'],
      activities: {},
      streak: 0,
    };
    render(<UserStats progress={progress} />);

    expect(screen.getByText('5')).toBeInTheDocument(); // level
    expect(screen.getAllByText('0')).toHaveLength(2); // activities + streak
  });
});
