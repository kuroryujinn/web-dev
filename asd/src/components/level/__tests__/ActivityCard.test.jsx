import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ActivityCard from '../ActivityCard';

const baseActivity = {
  id: 'l1-activity-1',
  type: 'multipleChoice',
  title: 'Identify the Fruit',
  description: 'What fruit is shown?',
  difficulty: 1,
  timeLimit: null,
};

const renderCard = (overrides = {}) =>
  render(
    <ActivityCard
      activity={baseActivity}
      isCompleted={false}
      bestScore={0}
      onClick={vi.fn()}
      {...overrides}
    />,
  );

describe('ActivityCard', () => {
  it('renders the title and description', () => {
    renderCard();

    expect(screen.getByText('Identify the Fruit')).toBeInTheDocument();
    expect(screen.getByText('What fruit is shown?')).toBeInTheDocument();
  });

  it('falls back to the activity type when description is missing', () => {
    renderCard({
      activity: { ...baseActivity, description: undefined },
    });

    expect(screen.getByText('multipleChoice')).toBeInTheDocument();
  });

  it('shows the time limit when present', () => {
    renderCard({
      activity: { ...baseActivity, timeLimit: 30 },
    });

    expect(screen.getByText('30s')).toBeInTheDocument();
  });

  it('renders an activity-type chip with a friendly label', () => {
    renderCard();

    const chip = screen.getByTestId('activity-type-chip');
    expect(chip).toHaveTextContent('Multiple Choice');
  });

  it('labels the type chip from the raw activity type', () => {
    renderCard({ activity: { ...baseActivity, type: 'dragAndDrop' } });

    expect(screen.getByTestId('activity-type-chip')).toHaveTextContent('Drag & Drop');
  });

  it('omits the time limit when absent', () => {
    renderCard();

    expect(screen.queryByText('30s')).not.toBeInTheDocument();
  });

  it('shows the play indicator for uncompleted activities', () => {
    renderCard({ isCompleted: false });

    expect(screen.getByText('▶️')).toBeInTheDocument();
    // No "Completed" suffix in the accessible name
    expect(screen.getByRole('button', { name: 'Identify the Fruit' })).toBeInTheDocument();
  });

  it('shows the completion state with best score', () => {
    renderCard({ isCompleted: true, bestScore: 100 });

    expect(screen.getByText('✅')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Identify the Fruit — Completed, 100%' }),
    ).toBeInTheDocument();
  });

  it('shows 0% when completed with a zero best score', () => {
    renderCard({ isCompleted: true, bestScore: 0 });

    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Identify the Fruit — Completed, 0%' }),
    ).toBeInTheDocument();
  });

  it('defaults an undefined best score to 0% instead of rendering "undefined"', () => {
    renderCard({ isCompleted: true, bestScore: undefined });

    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Identify the Fruit — Completed, 0%' }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/undefined%/i)).not.toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    renderCard({ onClick });

    fireEvent.click(screen.getByRole('button', { name: 'Identify the Fruit' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
