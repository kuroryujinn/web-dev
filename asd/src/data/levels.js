export const LEVELS = [
  {
    id: 'level1',
    order: 1,
    title: 'Core Recognition',
    description: 'Identify objects, animals, and basic concepts',
    unlockXP: 0,
    icon: '🔵',
    color: '#5eaefd',
    activityTypes: ['multipleChoice', 'matching'],
  },
  {
    id: 'level2',
    order: 2,
    title: 'Basic Coordination',
    description: 'Drag and drop matching, shape recognition',
    unlockXP: 500,
    icon: '🟢',
    color: '#57d19d',
    activityTypes: ['multipleChoice', 'dragAndDrop', 'matching'],
  },
  {
    id: 'level3',
    order: 3,
    title: 'Visual-Motor Integration',
    description: 'Trace paths, follow directions, connect objects',
    unlockXP: 1500,
    icon: '🟡',
    color: '#ffc94a',
    activityTypes: ['multipleChoice', 'pathTracing', 'dragAndDrop', 'matching'],
  },
  {
    id: 'level4',
    order: 4,
    title: 'Fine Motor Skills',
    description: 'Precision sorting, sequencing, pattern completion',
    unlockXP: 3000,
    icon: '🟠',
    color: '#ff7a59',
    activityTypes: ['multipleChoice', 'pathTracing', 'dragAndDrop', 'sorting', 'matching'],
  },
  {
    id: 'level5',
    order: 5,
    title: 'Functional Activities',
    description: 'Daily-life simulations, multi-step tasks, drawing',
    unlockXP: 5000,
    icon: '🔴',
    color: '#e74c3c',
    activityTypes: [
      'multipleChoice',
      'pathTracing',
      'freehandDrawing',
      'dragAndDrop',
      'sorting',
      'matching',
    ],
  },
];

export const getLevelById = (id) => LEVELS.find((l) => l.id === id);
export const getLevelByOrder = (order) => LEVELS.find((l) => l.order === order);
export const getNextLevel = (currentOrder) => LEVELS.find((l) => l.order === currentOrder + 1);
