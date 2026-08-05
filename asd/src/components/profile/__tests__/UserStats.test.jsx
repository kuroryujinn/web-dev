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
});
