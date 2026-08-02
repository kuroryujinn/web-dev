import {
  getActivityById,
  getActivitiesByLevel,
  getLevelById,
  getLevels,
} from '../activityService';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

vi.mock('../firebase', () => ({ db: {} }));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn((db, name) => ({ db, name })),
  doc: vi.fn((col, id) => ({ col, id })),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn((...args) => ({ args })),
  orderBy: vi.fn((field, dir) => ({ field, dir })),
  where: vi.fn((field, op, value) => ({ field, op, value })),
}));

const fakeDoc = (id, data, exists = true) => ({
  id,
  exists: () => exists,
  data: () => data,
});

describe('activityService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getLevels', () => {
    it('queries the levels collection ordered by order and maps docs to objects with id', async () => {
      getDocs.mockResolvedValue({
        docs: [fakeDoc('level1', { title: 'Core Recognition', order: 1 })],
      });

      const levels = await getLevels();

      expect(collection).toHaveBeenCalledWith(expect.anything(), 'levels');
      expect(query).toHaveBeenCalledTimes(1);
      expect(orderBy).toHaveBeenCalledWith('order', 'asc');
      expect(levels).toEqual([{ id: 'level1', title: 'Core Recognition', order: 1 }]);
    });
  });

  describe('getLevelById', () => {
    it('returns the mapped level when it exists', async () => {
      getDoc.mockResolvedValue(fakeDoc('level2', { title: 'Basic Coordination' }));

      const level = await getLevelById('level2');

      expect(doc).toHaveBeenCalledWith(expect.anything(), 'level2');
      expect(level).toEqual({ id: 'level2', title: 'Basic Coordination' });
    });

    it('returns null when the level does not exist', async () => {
      getDoc.mockResolvedValue(fakeDoc('level2', {}, false));

      const level = await getLevelById('level2');

      expect(level).toBeNull();
    });
  });

  describe('getActivitiesByLevel', () => {
    it('queries activities by levelId ordered by order and maps docs', async () => {
      getDocs.mockResolvedValue({
        docs: [
          fakeDoc('act1', { title: 'Identify Fruits', levelId: 'level1', order: 1 }),
          fakeDoc('act2', { title: 'Match Pairs', levelId: 'level1', order: 2 }),
        ],
      });

      const activities = await getActivitiesByLevel('level1');

      expect(collection).toHaveBeenCalledWith(expect.anything(), 'activities');
      expect(where).toHaveBeenCalledWith('levelId', '==', 'level1');
      expect(query).toHaveBeenCalledTimes(1);
      expect(orderBy).toHaveBeenCalledWith('order', 'asc');
      expect(activities).toHaveLength(2);
      expect(activities[0]).toEqual({
        id: 'act1',
        title: 'Identify Fruits',
        levelId: 'level1',
        order: 1,
      });
    });
  });

  describe('getActivityById', () => {
    it('returns the mapped activity when it exists', async () => {
      getDoc.mockResolvedValue(
        fakeDoc('act1', { title: 'Identify Fruits', type: 'multipleChoice' })
      );

      const activity = await getActivityById('act1');

      expect(doc).toHaveBeenCalledWith(expect.anything(), 'act1');
      expect(activity).toEqual({ id: 'act1', title: 'Identify Fruits', type: 'multipleChoice' });
    });

    it('returns null when the activity does not exist', async () => {
      getDoc.mockResolvedValue(fakeDoc('act1', {}, false));

      const activity = await getActivityById('act1');

      expect(activity).toBeNull();
    });
  });
});
