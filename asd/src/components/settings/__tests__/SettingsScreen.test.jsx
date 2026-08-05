import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { SettingsProvider, useSettings } from '../../../contexts/SettingsContext';
import SettingsScreen from '../SettingsScreen';

const user = { uid: 'uid-1', name: 'Alex', email: 'alex@test.com' };

const SettingsProbe = () => {
  const { settings } = useSettings();
  return (
    <div data-testid="settings-probe">
      <span data-testid="probe-sound">{String(settings.sound)}</span>
      <span data-testid="probe-haptic">{String(settings.haptic)}</span>
      <span data-testid="probe-motion">{String(settings.reducedMotion)}</span>
      <span data-testid="probe-font">{settings.fontSize}</span>
    </div>
  );
};

const renderWithProvider = (ui) =>
  render(
    <SettingsProvider>
      {ui}
      <SettingsProbe />
    </SettingsProvider>,
  );

describe('SettingsScreen', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders all setting toggles with current values', () => {
    renderWithProvider(<SettingsScreen user={user} onBack={vi.fn()} />);

    expect(screen.getByText('Sound Effects')).toBeInTheDocument();
    expect(screen.getByText('Haptic Feedback')).toBeInTheDocument();
    expect(screen.getByText('Reduced Motion')).toBeInTheDocument();
    expect(screen.getByText('Text Size')).toBeInTheDocument();

    // Defaults: sound off, haptic on, reduced motion off, normal text
    expect(screen.getByRole('button', { name: /toggle sound/i })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: /toggle haptic/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: /toggle reduced motion/i })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: /text size normal/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('toggles sound on and persists it through the context', () => {
    renderWithProvider(<SettingsScreen user={user} onBack={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /toggle sound/i }));

    expect(screen.getByTestId('probe-sound')).toHaveTextContent('true');
    expect(screen.getByRole('button', { name: /toggle sound/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('toggles reduced motion on', () => {
    renderWithProvider(<SettingsScreen user={user} onBack={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /toggle reduced motion/i }));

    expect(screen.getByTestId('probe-motion')).toHaveTextContent('true');
  });

  it('selects extra-large text size', () => {
    renderWithProvider(<SettingsScreen user={user} onBack={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /text size extra-large/i }));

    expect(screen.getByTestId('probe-font')).toHaveTextContent('extra-large');
    expect(screen.getByRole('button', { name: /text size extra-large/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('shows the account email', () => {
    renderWithProvider(<SettingsScreen user={user} onBack={vi.fn()} />);

    expect(screen.getByText('alex@test.com')).toBeInTheDocument();
  });

  it('calls onBack when the back button is pressed', () => {
    const onBack = vi.fn();
    renderWithProvider(<SettingsScreen user={user} onBack={onBack} />);

    fireEvent.click(screen.getByRole('button', { name: /back to dashboard/i }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
