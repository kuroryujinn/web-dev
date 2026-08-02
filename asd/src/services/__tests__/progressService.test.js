import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getLocalProgress, loadProgress, persistProgress } from '../progressService';

vi.mock('firebase/firestore', () => ({
  doc: vi.fn((db, collection, id) => ({ db, collection, id })),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
}));

vi.mock('../firebase', () => ({
  db: {},
}));

const progress = {
  totalXP: 120,
  currentLevel: 2,
  badges: ['first_steps'],
  activities: { a1: { completed: true, stars: 2, bestScore: 80, attempts: 1 } },
};

describe('progressService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    setDoc.mockResolvedValue(undefined);
  });

  describe('loadProgress', () => {
    it('returns the Firestore document when it exists', async () => {
      getDoc.mockResolvedValue({ exists: () => true, data: () => progress });

      await expect(loadProgress('uid-1')).resolves.toEqual(progress);
      expect(doc).toHaveBeenCalledWith(expect.anything(), 'userProgress', 'uid-1');
    });

    it('falls back to localStorage when Firestore has no document', async () => {
      localStorage.setItem('asd_progress_uid-1', JSON.stringify(progress));
      getDoc.mockResolvedValue({ exists: () => false, data: () => ({}) });

      await expect(loadProgress('uid-1')).resolves.toEqual(progress);
    });

    it('returns null when no progress exists anywhere', async () => {
      getDoc.mockResolvedValue({ exists: () => false, data: () => ({}) });

      await expect(loadProgress('uid-1')).resolves.toBeNull();
    });

    it('falls back to localStorage when Firestore is unavailable', async () => {
      localStorage.setItem('asd_progress_uid-1', JSON.stringify(progress));
      getDoc.mockRejectedValue(new Error('network'));

      await expect(loadProgress('uid-1')).resolves.toEqual(progress);
    });
  });

  describe('persistProgress', () => {
    it('writes the local backup and merges into Firestore', async () => {
      await persistProgress('uid-1', progress);

      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        progress,
        { merge: true },
      );
      expect(getLocalProgress('uid-1')).toEqual(progress);
    });

    it('still keeps the local backup when Firestore fails', async () => {
      setDoc.mockRejectedValue(new Error('offline'));

      await persistProgress('uid-1', progress);

      expect(getLocalProgress('uid-1')).toEqual(progress);
    });
  });
});
