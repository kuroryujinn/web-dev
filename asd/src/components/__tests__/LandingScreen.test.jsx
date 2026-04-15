import { render, screen } from '@testing-library/react';
import LandingScreen from '../LandingScreen';
import '../../styles/tokens.css';

describe('LandingScreen', () => {
  test('renders without Google provider when Google client id is missing', () => {
    expect(document.documentElement).toBeInTheDocument();
    expect(getComputedStyle(document.documentElement).getPropertyValue('--ink').trim()).not.toBe('');

    expect(() => {
      render(
        <LandingScreen
          user={{ name: 'Tanmay', avatar: '🚀' }}
          onStartQuiz={() => {}}
          onLogout={() => {}}
          hasGoogleClientId={false}
        />
      );
    }).not.toThrow();

    const startButton = screen.getByRole('button', { name: /initiate_game/i });
    expect(startButton).toBeInTheDocument();
    expect(startButton.className).toMatch(/brutal-button/);
  });
});
