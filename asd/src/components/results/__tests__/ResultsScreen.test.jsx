import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ResultsScreen from '../ResultsScreen';
import StarsEarned from '../StarsEarned';
import BadgesEarned from '../BadgesEarned';

const badges = [
  { id: 'first_steps', title: 'First Steps', icon: '👶', rarity: 'common' },
  { id: 'level_up', title: 'Level Up', icon: '🔓', rarity: 'rare' },
];

const renderScreen = (props = {}) =>
  render(
    <ResultsScreen
      score={95}
      totalQuestions={100}
      stars={3}
      xp={30}
      activityTitle="Find the Dog"
      earnedBadges={[]}
      onPlayAgain={vi.fn()}
      onBackToHome={vi.fn()}
      {...props}
    />,
  );

describe('ResultsScreen', () => {
  it('shows the completion state, score, stars, and XP for a passing score', () => {
    renderScreen();

    expect(screen.getByRole('heading', { name: 'SESSION COMPLETE' })).toBeInTheDocument();
    expect(screen.getByText('Find the Dog')).toBeInTheDocument();
    expect(screen.getByText('95')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('+30 XP')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '3 of 3 stars earned' })).toBeInTheDocument();
  });

  it('shows an encouraging retry state for a low score', () => {
    renderScreen({ score: 40, stars: 1, xp: 10 });

    expect(screen.getByRole('heading', { name: 'KEEP PRACTICING' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '1 of 3 stars earned' })).toBeInTheDocument();
  });

  it('renders earned badges and hides the section when none are earned', () => {
    const { rerender } = renderScreen({ earnedBadges: badges });

    expect(screen.getByText('Badges Earned')).toBeInTheDocument();
    expect(screen.getByText('First Steps')).toBeInTheDocument();
    expect(screen.getByText('Level Up')).toBeInTheDocument();

    rerender(
      <ResultsScreen
        score={95}
        totalQuestions={100}
        stars={3}
        xp={30}
        activityTitle="Find the Dog"
        earnedBadges={[]}
        onPlayAgain={vi.fn()}
        onBackToHome={vi.fn()}
      />,
    );

    expect(screen.queryByText('Badges Earned')).not.toBeInTheDocument();
  });

  it('calls the play-again and home actions', () => {
    const onPlayAgain = vi.fn();
    const onBackToHome = vi.fn();

    renderScreen({ onPlayAgain, onBackToHome });

    fireEvent.click(screen.getByRole('button', { name: 'PLAY AGAIN' }));
    fireEvent.click(screen.getByRole('button', { name: 'HOME' }));

    expect(onPlayAgain).toHaveBeenCalledTimes(1);
    expect(onBackToHome).toHaveBeenCalledTimes(1);
  });
});

describe('StarsEarned', () => {
  it('labels how many stars were earned for assistive tech', () => {
    render(<StarsEarned stars={2} />);

    expect(screen.getByRole('img', { name: '2 of 3 stars earned' })).toBeInTheDocument();
  });
});

describe('BadgesEarned', () => {
  it('renders nothing when there are no badges', () => {
    const { container } = render(<BadgesEarned badges={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
