import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import AccessibleButton from '../AccessibleButton';

describe('AccessibleButton', () => {
  it('renders children and is a native button', () => {
    render(<AccessibleButton onClick={vi.fn()}>Start</AccessibleButton>);

    const button = screen.getByRole('button', { name: 'Start' });
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  it('fires onClick when clicked', () => {
    const onClick = vi.fn();
    render(<AccessibleButton onClick={onClick}>Start</AccessibleButton>);

    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('exposes the aria-label and applies the focus-visible ring class', () => {
    render(
      <AccessibleButton onClick={vi.fn()} aria-label="Close modal">
        X
      </AccessibleButton>,
    );

    const button = screen.getByRole('button', { name: 'Close modal' });
    expect(button).toHaveClass('focus-visible:outline-4');
    expect(button).toHaveClass('min-h-[48px]');
  });

  it('respects the disabled state and blocks clicks', () => {
    const onClick = vi.fn();
    render(
      <AccessibleButton onClick={onClick} disabled>
        Paused
      </AccessibleButton>,
    );

    const button = screen.getByRole('button', { name: 'Paused' });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies a custom className alongside the base styles', () => {
    render(
      <AccessibleButton onClick={vi.fn()} className="w-full">
        Wide
      </AccessibleButton>,
    );

    expect(screen.getByRole('button', { name: 'Wide' })).toHaveClass('w-full');
    expect(screen.getByRole('button', { name: 'Wide' })).toHaveClass('brutal-button');
  });

  it('defaults to type button to avoid accidental form submits', () => {
    render(<AccessibleButton onClick={vi.fn()}>Go</AccessibleButton>);
    expect(screen.getByRole('button', { name: 'Go' })).toHaveAttribute('type', 'button');
  });
});
