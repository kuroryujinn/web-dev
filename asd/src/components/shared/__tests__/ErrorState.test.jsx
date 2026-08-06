import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ErrorState from '../ErrorState';

describe('ErrorState', () => {
  it('renders the title and message in an alert region', () => {
    render(
      <ErrorState title="Couldn't load your progress" message="Check your connection and try again." />,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText("Couldn't load your progress")).toBeInTheDocument();
    expect(screen.getByText('Check your connection and try again.')).toBeInTheDocument();
  });

  it('calls onRetry when the retry button is pressed', () => {
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);

    fireEvent.click(screen.getByRole('button', { name: /retry/i }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('omits the retry button when no onRetry handler is given', () => {
    render(<ErrorState />);

    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
  });
});
