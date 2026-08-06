import React from 'react';
import { render, screen } from '@testing-library/react';
import LevelCard from '../LevelCard';

const level = {
  id: 'level1',
  order: 1,
  title: 'Core Recognition',
  description: 'Identify objects, animals, and basic concepts',
  unlockXP: 0,
  icon: '🔵',
  color: '#5eaefd',
  activityTypes: ['multipleChoice', 'matching'],
};

const renderCard = (overrides = {}) =>
  render(
    <LevelCard
      level={level}
      isUnlocked
      isCurrent={false}
      isCompleted={false}
      onClick={vi.fn()}
      {...overrides}
    />,
  );

describe('LevelCard', () => {
  it('applies the level accent color to the card border when unlocked', () => {
    renderCard();

    const card = screen.getByRole('button', { name: /level 1/i });
    expect(card).toHaveStyle(`border-color: ${level.color}`);
  });

  it('shows the locked state with no accent border color', () => {
    renderCard({ isUnlocked: false });

    const card = screen.getByRole('button', { name: /level 1/i });
    expect(card).toBeDisabled();
    expect(card).not.toHaveStyle(`border-color: ${level.color}`);
  });
});
