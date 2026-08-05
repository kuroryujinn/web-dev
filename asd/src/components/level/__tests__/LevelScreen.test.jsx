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

// Seed a Firestore progress document so ProgressProvider loads the given state.
const seedProgress = (data) => {
  getDoc.mockResolvedValue({ exists: () => true, data: () => data });
};

const makeActivity = (id, overrides = {}) => ({
  id,
  type: 'multipleChoice',
  title: `Activity ${id}`,
  description: 'An activity',
  difficulty: 1,
  timeLimit: null,
  ...overrides,
});

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

  it('treats undefined activities like an empty list (placeholder, no progress bar)', async () => {
    renderWithProviders(
      <LevelScreen level={level} activities={undefined} onSelectActivity={vi.fn()} onBack={vi.fn()} />,
    );

    await waitFor(() => {
      expect(screen.getByText('No activities available yet. Check back soon!')).toBeInTheDocument();
    });
    // Progress bar is hidden when there is nothing to track
    expect(screen.queryByText(/0\/0/)).not.toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('hides the progress bar when the activities list is empty', async () => {
    renderWithProviders(
      <LevelScreen level={level} activities={[]} onSelectActivity={vi.fn()} onBack={vi.fn()} />,
    );

    await waitFor(() => {
      expect(screen.getByText('No activities available yet. Check back soon!')).toBeInTheDocument();
    });
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('shows 0% progress for an unplayed level with activities', async () => {
    seedProgress({ totalXP: 0, currentLevel: 1, badges: [], activities: {}, streak: 1 });
    renderWithProviders(
      <LevelScreen level={level} activities={sampleActivities} onSelectActivity={vi.fn()} onBack={vi.fn()} />,
    );

    await waitFor(() => {
      expect(screen.getByText('0/2 (0%)')).toBeInTheDocument();
    });
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '0');
  });

  it('shows partial progress and completed cards when some activities are done', async () => {
    seedProgress({
      totalXP: 30,
      currentLevel: 1,
      badges: [],
      streak: 1,
      activities: {
        'l1-activity-1': { bestScore: 100, stars: 3, attempts: 1, completed: true },
      },
    });
    renderWithProviders(
      <LevelScreen level={level} activities={sampleActivities} onSelectActivity={vi.fn()} onBack={vi.fn()} />,
    );

    await waitFor(() => {
      expect(screen.getByText('1/2 (50%)')).toBeInTheDocument();
    });
    // Completed card shows its best score; the unplayed card stays as ▶️
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('▶️')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /identify the fruit — completed, 100%/i }),
    ).toBeInTheDocument();
  });

  it('shows 100% progress when every activity is completed', async () => {
    seedProgress({
      totalXP: 60,
      currentLevel: 1,
      badges: [],
      streak: 1,
      activities: {
        'l1-activity-1': { bestScore: 90, stars: 3, attempts: 1, completed: true },
        'l1-activity-2': { bestScore: 80, stars: 2, attempts: 2, completed: true },
      },
    });
    renderWithProviders(
      <LevelScreen level={level} activities={sampleActivities} onSelectActivity={vi.fn()} onBack={vi.fn()} />,
    );

    await waitFor(() => {
      expect(screen.getByText('2/2 (100%)')).toBeInTheDocument();
    });
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    expect(screen.queryByText('▶️')).not.toBeInTheDocument();
  });

  it('rounds partial progress percentages (1 of 3 = 33%)', async () => {
    const threeActivities = [
      ...sampleActivities,
      makeActivity('l1-activity-3'),
    ];
    seedProgress({
      totalXP: 10,
      currentLevel: 1,
      badges: [],
      streak: 1,
      activities: {
        'l1-activity-1': { bestScore: 50, stars: 1, attempts: 1, completed: true },
      },
    });
    renderWithProviders(
      <LevelScreen
        level={level}
        activities={threeActivities}
        onSelectActivity={vi.fn()}
        onBack={vi.fn()}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText('1/3 (33%)')).toBeInTheDocument();
    });
  });

  it('ignores progress entries for activities outside this level', async () => {
    seedProgress({
      totalXP: 30,
      currentLevel: 1,
      badges: [],
      streak: 1,
      activities: {
        'other-level-activity': { bestScore: 100, stars: 3, attempts: 1, completed: true },
      },
    });
    renderWithProviders(
      <LevelScreen level={level} activities={sampleActivities} onSelectActivity={vi.fn()} onBack={vi.fn()} />,
    );

    // The other level's completion doesn't count toward this level's progress
    await waitFor(() => {
      expect(screen.getByText('0/2 (0%)')).toBeInTheDocument();
    });
  });

  it('does not count activity entries missing the completed flag', async () => {
    seedProgress({
      totalXP: 10,
      currentLevel: 1,
      badges: [],
      streak: 1,
      activities: {
        'l1-activity-1': { bestScore: 90, stars: 3, attempts: 1 }, // no completed: true
      },
    });
    renderWithProviders(
      <LevelScreen level={level} activities={sampleActivities} onSelectActivity={vi.fn()} onBack={vi.fn()} />,
    );

    await waitFor(() => {
      expect(screen.getByText('0/2 (0%)')).toBeInTheDocument();
    });
  });

  it('treats a null progress document as a fresh unplayed level', async () => {
    seedProgress(null);
    renderWithProviders(
      <LevelScreen level={level} activities={sampleActivities} onSelectActivity={vi.fn()} onBack={vi.fn()} />,
    );

    await waitFor(() => {
      expect(screen.getByText('0/2 (0%)')).toBeInTheDocument();
    });
  });
});