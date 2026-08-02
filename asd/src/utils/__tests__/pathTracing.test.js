import {
  calculateTraceScore,
  distanceToSegment,
  getPathCoverage,
  getPathSegments,
  minDistanceToSegments,
  samplePathPoints,
} from '../pathTracing';

describe('samplePathPoints', () => {
  it('samples a straight line including both endpoints', () => {
    const points = samplePathPoints('M 0 0 L 100 0', 1);

    expect(points.length).toBeGreaterThan(1);
    expect(points[0]).toEqual({ x: 0, y: 0 });
    expect(points[points.length - 1]).toEqual({ x: 100, y: 0 });
    // All points lie on y = 0.
    expect(points.every((p) => p.y === 0)).toBe(true);
  });

  it('handles relative line commands', () => {
    const points = samplePathPoints('m 10 10 l 20 0', 1);

    expect(points[0]).toEqual({ x: 10, y: 10 });
    expect(points[points.length - 1]).toEqual({ x: 30, y: 10 });
  });

  it('handles horizontal and vertical commands', () => {
    const points = samplePathPoints('M 0 0 H 50 V 50', 1);

    expect(points[points.length - 1]).toEqual({ x: 50, y: 50 });
    // There are points along both the horizontal and vertical legs.
    expect(points.some((p) => p.y === 0 && p.x > 0)).toBe(true);
  });

  it('treats extra coordinate pairs after a moveto as implicit linetos', () => {
    const points = samplePathPoints('M 0 0 100 0');

    expect(points[0]).toEqual({ x: 0, y: 0 });
    expect(points[points.length - 1]).toEqual({ x: 100, y: 0 });
    // A connecting segment exists between the two points (implicit L).
    expect(points.length).toBeGreaterThan(2);
  });

  it('samples a closed path back to the start', () => {
    const points = samplePathPoints('M 0 0 L 50 0 L 50 50 Z', 1);

    expect(points[points.length - 1]).toEqual({ x: 0, y: 0 });
  });

  it('returns an empty array for invalid path data', () => {
    expect(samplePathPoints('')).toEqual([]);
  });
});

describe('getPathSegments & distance helpers', () => {
  const segments = getPathSegments([
    { x: 0, y: 0 },
    { x: 10, y: 0 },
  ]);

  it('builds segments between consecutive points', () => {
    expect(segments).toEqual([
      { x1: 0, y1: 0, x2: 10, y2: 0 },
    ]);
  });

  it('computes distance to a segment, clamping to its ends', () => {
    expect(distanceToSegment(5, 3, 0, 0, 10, 0)).toBe(3);
    expect(distanceToSegment(-5, 0, 0, 0, 10, 0)).toBe(5); // clamped to start
    expect(distanceToSegment(20, 0, 0, 0, 10, 0)).toBe(10); // clamped to end
  });

  it('minDistanceToSegments returns the closest distance', () => {
    expect(minDistanceToSegments(5, 3, segments)).toBe(3);
    expect(minDistanceToSegments(100, 100, segments)).toBeGreaterThan(100);
  });
});

describe('calculateTraceScore', () => {
  const template = ['M 0 0 L 100 0'];

  it('scores 100 when the trace follows the path exactly', () => {
    const stroke = [
      { x: 0, y: 0 },
      { x: 50, y: 0 },
      { x: 100, y: 0 },
    ];
    expect(calculateTraceScore([stroke], template, 5)).toBe(100);
  });

  it('scores 0 when the trace is far from the path', () => {
    const stroke = [
      { x: 0, y: 50 },
      { x: 50, y: 50 },
      { x: 100, y: 50 },
    ];
    expect(calculateTraceScore([stroke], template, 5)).toBe(0);
  });

  it('scores partially when only some points are within tolerance', () => {
    const stroke = [
      { x: 0, y: 0 }, // within
      { x: 50, y: 50 }, // far
    ];
    expect(calculateTraceScore([stroke], template, 5)).toBe(50);
  });

  it('returns 0 with no strokes', () => {
    expect(calculateTraceScore([], template, 5)).toBe(0);
  });

  it('supports multiple template paths', () => {
    const templates = ['M 0 0 L 50 0', 'M 0 20 L 50 20'];
    const stroke = [
      { x: 0, y: 0 },
      { x: 50, y: 0 },
      { x: 0, y: 20 },
      { x: 50, y: 20 },
    ];
    expect(calculateTraceScore([stroke], templates, 5)).toBe(100);
  });
});

describe('getPathCoverage', () => {
  it('returns 1 when the whole path is traced', () => {
    const strokes = [[{ x: 0, y: 0 }, { x: 100, y: 0 }]];
    expect(getPathCoverage(strokes, 'M 0 0 L 100 0', 5)).toBe(1);
  });

  it('returns 0 when nothing is traced', () => {
    expect(getPathCoverage([], 'M 0 0 L 100 0', 5)).toBe(0);
  });

  it('gives partial coverage when only part of the path is traced', () => {
    const strokes = [[{ x: 0, y: 0 }, { x: 30, y: 0 }]];
    const coverage = getPathCoverage(strokes, 'M 0 0 L 100 0', 5);

    expect(coverage).toBeGreaterThan(0);
    expect(coverage).toBeLessThan(1);
  });
});
