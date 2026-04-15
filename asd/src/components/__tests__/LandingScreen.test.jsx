import { render, screen } from '@testing-library/react';
import LandingScreen from '../LandingScreen';

describe('LandingScreen', () => {
  test('renders without Google provider when Google client id is missing', () => {
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

    expect(screen.getByRole('button', { name: /initiate_game/i })).toBeInTheDocument();
  });
});
