import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { SettingsProvider } from '../../../contexts/SettingsContext';
import FeedbackOverlay from '../FeedbackOverlay';

const renderOverlay = (props) =>
  render(
    <SettingsProvider>
      <FeedbackOverlay
        isCorrect
        feedback="Excellent work!"
        onNext={vi.fn()}
        {...props}
      />
    </SettingsProvider>,
  );

describe('FeedbackOverlay', () => {
  it('announces positive results with dialog semantics', () => {
    renderOverlay({ isCorrect: true, feedback: 'Excellent work!' });

    const dialog = screen.getByRole('dialog', { name: 'Activity complete' });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('NICE WORK!')).toBeInTheDocument();
    expect(screen.getByText('Excellent work!')).toBeInTheDocument();
  });

  it('shows a retry message for incorrect attempts', () => {
    renderOverlay({ isCorrect: false, feedback: 'Keep going!' });

    expect(screen.getByRole('dialog', { name: 'Try again' })).toBeInTheDocument();
    expect(screen.getByText('TRY AGAIN!')).toBeInTheDocument();
    expect(screen.getByText('Keep going!')).toBeInTheDocument();
  });

  it('calls onNext when continue is clicked', () => {
    const onNext = vi.fn();
    renderOverlay({ onNext });

    fireEvent.click(screen.getByRole('button', { name: 'CONTINUE' }));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('moves focus to the continue button on open', () => {
    renderOverlay();

    expect(screen.getByRole('button', { name: 'CONTINUE' })).toHaveFocus();
  });

  it('renders a custom next label', () => {
    renderOverlay({ nextLabel: 'NEXT' });

    expect(screen.getByRole('button', { name: 'NEXT' })).toBeInTheDocument();
  });
});
