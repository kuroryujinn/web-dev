import React from 'react';
import { render, screen } from '@testing-library/react';
import BadgeShelf from '../BadgeShelf';

describe('BadgeShelf', () => {
  it('shows all badges as locked when none are earned (default)', () => {
    render(<BadgeShelf />);

    expect(screen.getByText('First Steps')).toBeInTheDocument();
    expect(screen.getAllByText('Locked')).toHaveLength(8);
    expect(screen.queryByText('✓ Earned')).not.toBeInTheDocument();
  });

  it('shows all badges as locked for an empty badges array', () => {
    render(<BadgeShelf badges={[]} />);

    expect(screen.getAllByText('Locked')).toHaveLength(8);
  });

  it('does not crash when badges is null', () => {
    render(<BadgeShelf badges={null} />);

    // Treated like no earned badges — everything locked
    expect(screen.getAllByText('Locked')).toHaveLength(8);
    expect(screen.queryByText('✓ Earned')).not.toBeInTheDocument();
  });

  it('marks earned badges and keeps the rest locked', () => {
    render(<BadgeShelf badges={['first_steps', 'perfectionist']} />);

    expect(screen.getAllByText('✓ Earned')).toHaveLength(2);
    expect(screen.getAllByText('Locked')).toHaveLength(6);
    // aria-labels reflect the earned state
    expect(screen.getByLabelText('First Steps — Earned')).toBeInTheDocument();
    expect(screen.getByLabelText('Streak Master — Locked')).toBeInTheDocument();
  });

  it('marks every badge earned when the full set is present', () => {
    const allBadgeIds = [
      'first_steps',
      'quick_learner',
      'perfectionist',
      'level_up',
      'streak_master',
      'badge_collector',
      'motor_pro',
      'master_artist',
    ];
    render(<BadgeShelf badges={allBadgeIds} />);

    expect(screen.getAllByText('✓ Earned')).toHaveLength(8);
    expect(screen.queryByText('Locked')).not.toBeInTheDocument();
  });

  it('ignores unknown badge ids without crashing', () => {
    render(<BadgeShelf badges={['first_steps', 'not-a-real-badge']} />);

    expect(screen.getByLabelText('First Steps — Earned')).toBeInTheDocument();
    expect(screen.getAllByText('Locked')).toHaveLength(7);
  });
});
