import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';
import { AuthProvider } from '../../../contexts/AuthContext';
import { ProgressProvider } from '../../../contexts/ProgressContext';
import DashboardScreen from '../DashboardScreen';

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(),
  signOut: vi.fn(),
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

describe('DashboardScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ uid: 'uid-1', displayName: 'Alex', email: 'alex@example.com' });
      return vi.fn();
    });
    getDoc.mockResolvedValue({ exists: () => false, data: () => ({}) });
  });

  it('renders the welcome message', async () => {
    renderWithProviders(<DashboardScreen user={user} onSelectLevel={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Welcome, Alex')).toBeInTheDocument();
    });
  });

  it('renders level 1 as unlocked and visible', async () => {
    renderWithProviders(<DashboardScreen user={user} onSelectLevel={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Level 1')).toBeInTheDocument();
    });
    expect(screen.getByText('Core Recognition')).toBeInTheDocument();
  });

  it('renders QuickStats with default values', async () => {
    renderWithProviders(<DashboardScreen user={user} onSelectLevel={vi.fn()} />);

    // Wait for the progress to load and the QuickStats section to appear.
    await waitFor(() => {
      expect(screen.getByText('Total XP')).toBeInTheDocument();
    });
    // XP, Activities, Badges start at 0 — use getAllByText for the ambiguous value.
    expect(screen.getAllByText('0')).toHaveLength(3);
    // A fresh progress document seeds a 1-day streak.
    expect(screen.getByText((text) => text.includes('1 days'))).toBeInTheDocument();
  });

  it('renders the Badges section', async () => {
    renderWithProviders(<DashboardScreen user={user} onSelectLevel={vi.fn()} />);

    // Wait for progress to load and the badges section to appear.
    await waitFor(() => {
      // 'Badges' appears as both the QuickStats label and the section heading.
      expect(screen.getAllByText((text) => text.includes('Badges'))).toHaveLength(2);
    });
    // Should show badges (all locked by default)
    expect(screen.getByText('First Steps')).toBeInTheDocument();
    expect(screen.getAllByText('Locked').length).toBeGreaterThan(0);
  });

  it('calls onSelectLevel when a level card is clicked', async () => {
    const onSelectLevel = vi.fn();
    renderWithProviders(<DashboardScreen user={user} onSelectLevel={onSelectLevel} />);

    await waitFor(() => {
      expect(screen.getByText('Level 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /level 1/i }));

    expect(onSelectLevel).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'level1', order: 1 }),
    );
  });

  it('gives header action buttons a 48px target and a visible focus ring', async () => {
    renderWithProviders(<DashboardScreen user={user} onSelectLevel={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Welcome, Alex')).toBeInTheDocument();
    });

    const profile = screen.getByRole('button', { name: /PROFILE/i });
    const settings = screen.getByRole('button', { name: /SETTINGS/i });
    const logout = screen.getByRole('button', { name: /LOG OUT/i });

    for (const button of [profile, settings, logout]) {
      expect(button).toHaveClass('min-h-[48px]');
      expect(button).toHaveClass('focus-visible:outline-4');
    }
  });

  it('shows an error card with retry when progress cannot be loaded', async () => {
    getDoc.mockRejectedValue(new Error('network'));
    renderWithProviders(<DashboardScreen user={user} onSelectLevel={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('recovers after retrying a failed progress load', async () => {
    getDoc.mockRejectedValue(new Error('network'));
    renderWithProviders(<DashboardScreen user={user} onSelectLevel={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    // Backend recovers; retry loads the fresh document and the dashboard renders.
    getDoc.mockResolvedValue({ exists: () => false, data: () => ({}) });
    fireEvent.click(screen.getByRole('button', { name: /retry/i }));

    await waitFor(() => {
      expect(screen.getByText('Welcome, Alex')).toBeInTheDocument();
    });
  });

  it('logs out when the LOG OUT button is clicked', async () => {
    renderWithProviders(<DashboardScreen user={user} onSelectLevel={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('LOG OUT')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('LOG OUT'));

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
    });
  });
});