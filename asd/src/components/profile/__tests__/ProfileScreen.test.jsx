import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';
import { AuthProvider } from '../../../contexts/AuthContext';
import { ProgressProvider } from '../../../contexts/ProgressContext';
import ProfileScreen from '../ProfileScreen';

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({ id: 'progress-doc' })),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
}));

vi.mock('../../../services/firebase', () => ({
  auth: {},
  db: {},
  isDemoMode: false,
}));

const user = { uid: 'uid-1', name: 'Alex', email: 'alex@test.com', avatar: '🧑' };

const renderWithProviders = (ui) =>
  render(
    <AuthProvider>
      <ProgressProvider>{ui}</ProgressProvider>
    </AuthProvider>,
  );

describe('ProfileScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ uid: 'uid-1', displayName: 'Alex', email: 'alex@example.com' });
      return vi.fn();
    });
    getDoc.mockResolvedValue({ exists: () => false, data: () => ({}) });
  });

  it('renders the user header with name and email', async () => {
    renderWithProviders(<ProfileScreen user={user} onBack={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Alex')).toBeInTheDocument();
    });
    expect(screen.getByText('alex@test.com')).toBeInTheDocument();
  });

  it('renders the stats and badges sections', async () => {
    renderWithProviders(<ProfileScreen user={user} onBack={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Total XP')).toBeInTheDocument();
    });
    // 'Badges' appears as both the UserStats label and the section heading
    expect(screen.getAllByText('Badges')).toHaveLength(2);
    expect(screen.getByText('First Steps')).toBeInTheDocument(); // badge shelf
  });

  it('renders session history section', async () => {
    renderWithProviders(<ProfileScreen user={user} onBack={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Session History')).toBeInTheDocument();
    });
    expect(screen.getByText(/no activities yet/i)).toBeInTheDocument();
  });

  it('shows an error card with retry when progress cannot be loaded', async () => {
    getDoc.mockRejectedValue(new Error('network'));
    renderWithProviders(<ProfileScreen user={user} onBack={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('recovers after retrying a failed progress load', async () => {
    getDoc.mockRejectedValue(new Error('network'));
    renderWithProviders(<ProfileScreen user={user} onBack={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    getDoc.mockResolvedValue({ exists: () => false, data: () => ({}) });
    fireEvent.click(screen.getByRole('button', { name: /retry/i }));

    await waitFor(() => {
      expect(screen.getByText('Alex')).toBeInTheDocument();
    });
  });

  it('calls onBack when the back button is pressed', async () => {
    const onBack = vi.fn();
    renderWithProviders(<ProfileScreen user={user} onBack={onBack} />);

    await waitFor(() => {
      expect(screen.getByText('Alex')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /back to dashboard/i }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
