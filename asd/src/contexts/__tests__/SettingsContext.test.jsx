import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SettingsProvider, useSettings } from '../SettingsContext';

// Mirrors the internal STORAGE_KEY in SettingsContext.jsx
const STORAGE_KEY = 'asd-settings-v1';

const SettingsConsumer = () => {
  const { settings, updateSetting } = useSettings();
  return (
    <div>
      <span data-testid="sound">{String(settings.sound)}</span>
      <span data-testid="haptic">{String(settings.haptic)}</span>
      <span data-testid="reduced-motion">{String(settings.reducedMotion)}</span>
      <span data-testid="font-size">{settings.fontSize}</span>
      <button onClick={() => updateSetting('sound', true)}>enable sound</button>
      <button onClick={() => updateSetting('fontSize', 'large')}>font large</button>
      <button onClick={() => updateSetting('unknown', 'x')}>unknown</button>
    </div>
  );
};

const renderWithProvider = () =>
  render(
    <SettingsProvider>
      <SettingsConsumer />
    </SettingsProvider>
  );

const storedSettings = () => JSON.parse(localStorage.getItem(STORAGE_KEY));

describe('SettingsContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('defaults', () => {
    it('provides the spec-defined defaults', () => {
      renderWithProvider();

      expect(screen.getByTestId('sound')).toHaveTextContent('false');
      expect(screen.getByTestId('haptic')).toHaveTextContent('true');
      expect(screen.getByTestId('reduced-motion')).toHaveTextContent('false');
      expect(screen.getByTestId('font-size')).toHaveTextContent('normal');
    });

    it('respects the OS prefers-reduced-motion preference when matchMedia is available', () => {
      vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));

      renderWithProvider();

      expect(screen.getByTestId('reduced-motion')).toHaveTextContent('true');
    });
  });

  describe('localStorage persistence', () => {
    it('writes the default settings to localStorage on mount', async () => {
      renderWithProvider();

      await waitFor(() => {
        expect(storedSettings()).toEqual({
          sound: false,
          haptic: true,
          reducedMotion: false,
          fontSize: 'normal',
        });
      });
    });

    it('loads stored settings on mount and merges them over defaults', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ sound: true, fontSize: 'extra-large' })
      );

      renderWithProvider();

      expect(screen.getByTestId('sound')).toHaveTextContent('true');
      expect(screen.getByTestId('font-size')).toHaveTextContent('extra-large');
      // Untouched keys keep their defaults
      expect(screen.getByTestId('haptic')).toHaveTextContent('true');
    });

    it('falls back to defaults when stored settings are corrupt', () => {
      localStorage.setItem(STORAGE_KEY, '{not valid json');

      renderWithProvider();

      expect(screen.getByTestId('sound')).toHaveTextContent('false');
      expect(screen.getByTestId('haptic')).toHaveTextContent('true');
      expect(screen.getByTestId('font-size')).toHaveTextContent('normal');
    });
  });

  describe('updateSetting', () => {
    it('updates a valid setting and persists it to localStorage', async () => {
      renderWithProvider();

      fireEvent.click(screen.getByText('enable sound'));

      expect(screen.getByTestId('sound')).toHaveTextContent('true');
      await waitFor(() => {
        expect(storedSettings().sound).toBe(true);
      });
    });

    it('updates only the targeted setting, leaving others unchanged', () => {
      renderWithProvider();

      fireEvent.click(screen.getByText('font large'));

      expect(screen.getByTestId('font-size')).toHaveTextContent('large');
      expect(screen.getByTestId('sound')).toHaveTextContent('false');
      expect(screen.getByTestId('haptic')).toHaveTextContent('true');
    });

    it('ignores unknown keys without changing state or persisting', () => {
      renderWithProvider();

      fireEvent.click(screen.getByText('unknown'));

      expect(screen.getByTestId('sound')).toHaveTextContent('false');
      expect(screen.getByTestId('font-size')).toHaveTextContent('normal');
      expect(storedSettings()).toEqual({
        sound: false,
        haptic: true,
        reducedMotion: false,
        fontSize: 'normal',
      });
    });
  });

  describe('useSettings hook', () => {
    it('throws when used outside of SettingsProvider', () => {
      const Unwrapped = () => {
        useSettings();
        return null;
      };

      expect(() => render(<Unwrapped />)).toThrow(
        'useSettings must be used within SettingsProvider'
      );
    });
  });
});
