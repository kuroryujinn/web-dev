import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';
import { AuthProvider } from '../../../contexts/AuthContext';
import { ProgressProvider } from '../../../contexts/ProgressContext';
import LevelScreen from '../LevelScreen';

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
}));

const level = {
  id: 'level1',
  order: 1,
  title: 'Core Recognition',
  description: 'Identify objects, animals, and basic concepts',
  icon: '🔵',
  color: '#5eaefd',
  unlockXP: 0,
  activityTypes: ['multipleChoice', 'matching'],
};

const sampleActivities = [
  {
    id: 'l1-activity-1',
    type: 'multipleChoice',
    title: 'Identify the Fruit',
    description: 'What fruit is shown?',
    difficulty: 1,
    timeLimit: null,
  },
  {
    id: 'l1-activity-2',
    type: 'matching',
    title: 'Match Body Parts',
    description: 'Match each body part to its name',
    difficulty: 1,
    timeLimit: 30,
  },
];

const renderWithProviders = (ui) =>
  render(
    <AuthProvider>
      <ProgressProvider>{ui}</ProgressProvider>
    </AuthProvider>,
  );

describe('LevelScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ uid: 'uid-1', displayName: 'Alex', email: 'alex@example.com' });
      return vi.fn();
    });
    getDoc.mockResolvedValue({ exists: () => false, data: () => ({}) });
  });

  it('renders the level title and description', async () => {
    renderWithProviders(
      <LevelScreen level={level} activities={sampleActivities} onSelectActivity={vi.fn()} onBack={vi.fn()} />,
    );

    await waitFor(() => {
      expect(screen.getByText('Level 1: Core Recognition')).toBeInTheDocument();
    });
    expect(screen.getByText('Identify objects, animals, and basic concepts')).toBeInTheDocument();
  });

  it('renders the activity list', async () => {
    renderWithProviders(
      <LevelScreen level={level} activities={sampleActivities} onSelectActivity={vi.fn()} onBack={vi.fn()} />,
    );

    await waitFor(() => {
      expect(screen.getByText('Identify the Fruit')).toBeInTheDocument();
    });
    expect(screen.getByText('Match Body Parts')).toBeInTheDocument();
  });

  it('shows the progress bar with 0/2', async () => {
    renderWithProviders(
      <LevelScreen level={level} activities={sampleActivities} onSelectActivity={vi.fn()} onBack={vi.fn()} />,
    );

    await waitFor(() => {
      expect(screen.getByText('0/2 (0%)')).toBeInTheDocument();
    });
  });

  it('calls onSelectActivity when an activity card is clicked', async () => {
    const onSelectActivity = vi.fn();
    renderWithProviders(
      <LevelScreen level={level} activities={sampleActivities} onSelectActivity={onSelectActivity} onBack={vi.fn()} />,
    );

    await waitFor(() => {
      expect(screen.getByText('Identify the Fruit')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /identify the fruit/i }));

    expect(onSelectActivity).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'l1-activity-1' }),
    );
  });

  it('calls onBack when the back button is pressed', async () => {
    const onBack = vi.fn();
    renderWithProviders(
      <LevelScreen level={level} activities={sampleActivities} onSelectActivity={vi.fn()} onBack={onBack} />,
    );

    await waitFor(() => {
      expect(screen.getByText('Level 1: Core Recognition')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /back to dashboard/i }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('shows a placeholder when no activities are available', async () => {
    renderWithProviders(
      <LevelScreen level={level} activities={[]} onSelectActivity={vi.fn()} onBack={vi.fn()} />,
    );

    await waitFor(() => {
      expect(screen.getByText('No activities available yet. Check back soon!')).toBeInTheDocument();
    });
  });
});