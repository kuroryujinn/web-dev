import { calculatePathTracingScore } from './scoring';

const TAU = Math.PI * 2;
const RAD = (deg) => (deg * Math.PI) / 180;

const tokenize = (d) => d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || [];
const isCommand = (t) => /^[a-zA-Z]$/.test(t);

/**
 * Sample an SVG path `d` string into an array of points along its length.
 * Supports M/L/H/V/C/S/Q/T/A/Z (absolute and relative). Curves are sampled
 * with a fixed step count, producing a dense-enough point cloud for
 * distance-based stroke detection.
 *
 * @param {string} d - SVG path data
 * @param {number} [stepsPerSegment=6] - samples per straight/curve segment
 * @returns {Array<{x: number, y: number}>}
 */
export const samplePathPoints = (d, stepsPerSegment = 6) => {
  const tokens = tokenize(d);
  const points = [];
  let i = 0;
  let current = { x: 0, y: 0 };
  let subpathStart = { x: 0, y: 0 };
  let lastControl = null;
  let lastCommand = '';

  const readNumber = () => {
    while (i < tokens.length && isCommand(tokens[i])) i += 1;
    if (i >= tokens.length) return NaN;
    return parseFloat(tokens[i++]);
  };

  const pushPoint = (p) => {
    const last = points[points.length - 1];
    if (!last || last.x !== p.x || last.y !== p.y) points.push(p);
  };

  const sampleLine = (from, to) => {
    const steps = Math.max(1, stepsPerSegment);
    for (let s = 1; s <= steps; s += 1) {
      const t = s / steps;
      pushPoint({ x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t });
    }
  };

  const sampleCubic = (p0, p1, p2, p3) => {
    const steps = stepsPerSegment * 2;
    for (let s = 1; s <= steps; s += 1) {
      const t = s / steps;
      const mt = 1 - t;
      pushPoint({
        x: mt ** 3 * p0.x + 3 * mt ** 2 * t * p1.x + 3 * mt * t ** 2 * p2.x + t ** 3 * p3.x,
        y: mt ** 3 * p0.y + 3 * mt ** 2 * t * p1.y + 3 * mt * t ** 2 * p2.y + t ** 3 * p3.y,
      });
    }
  };

  const sampleQuadratic = (p0, p1, p2) => {
    const steps = stepsPerSegment * 2;
    for (let s = 1; s <= steps; s += 1) {
      const t = s / steps;
      const mt = 1 - t;
      pushPoint({
        x: mt ** 2 * p0.x + 2 * mt * t * p1.x + t ** 2 * p2.x,
        y: mt ** 2 * p0.y + 2 * mt * t * p1.y + t ** 2 * p2.y,
      });
    }
  };

  const sampleArc = (p0, p1, rx, ry, rotDeg, largeArc, sweep) => {
    if (rx === 0 || ry === 0 || (p0.x === p1.x && p0.y === p1.y)) {
      pushPoint({ x: p1.x, y: p1.y });
      return;
    }
    const phi = RAD(rotDeg % 360);
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);

    const dx = (p0.x - p1.x) / 2;
    const dy = (p0.y - p1.y) / 2;
    const x1 = cosPhi * dx + sinPhi * dy;
    const y1 = -sinPhi * dx + cosPhi * dy;

    let rx2 = rx * rx;
    let ry2 = ry * ry;
    const L = (x1 * x1) / rx2 + (y1 * y1) / ry2;
    if (L > 1) {
      const s = Math.sqrt(L);
      rx2 *= s * s;
      ry2 *= s * s;
    }

    const sign = largeArc === sweep ? -1 : 1;
    const numerator = rx2 * ry2 - rx2 * y1 * y1 - ry2 * x1 * x1;
    const denominator = rx2 * y1 * y1 + ry2 * x1 * x1;
    const coef = sign * Math.sqrt(Math.max(0, numerator / denominator));
    const cx1 = coef * ((rx / ry) * y1);
    const cy1 = coef * (-(ry / rx) * x1);

    const cx = cosPhi * cx1 - sinPhi * cy1 + (p0.x + p1.x) / 2;
    const cy = sinPhi * cx1 + cosPhi * cy1 + (p0.y + p1.y) / 2;

    const ux = (x1 - cx1) / rx;
    const uy = (y1 - cy1) / ry;
    const vx = (-x1 - cx1) / rx;
    const vy = (-y1 - cy1) / ry;

    const angleBetween = (ax, ay, bx, by) => {
      const dot = ax * bx + ay * by;
      const len = Math.sqrt((ax * ax + ay * ay) * (bx * bx + by * by));
      let a = Math.acos(Math.max(-1, Math.min(1, dot / len)));
      if (ax * by - ay * bx < 0) a = -a;
      return a;
    };

    const theta1 = angleBetween(1, 0, ux, uy);
    let deltaTheta = angleBetween(ux, uy, vx, vy);
    if (!sweep && deltaTheta > 0) deltaTheta -= TAU;
    if (sweep && deltaTheta < 0) deltaTheta += TAU;

    const steps = Math.max(2, Math.ceil((Math.abs(deltaTheta) / TAU) * 32));
    for (let s = 1; s <= steps; s += 1) {
      const a = theta1 + deltaTheta * (s / steps);
      pushPoint({
        x: cx + rx * Math.cos(a) * cosPhi - ry * Math.sin(a) * sinPhi,
        y: cy + rx * Math.cos(a) * sinPhi + ry * Math.sin(a) * cosPhi,
      });
    }
  };

  while (i < tokens.length) {
    let cmd = tokens[i++];
    if (!isCommand(cmd)) {
      // Implicit repetition of the previous command (commonly L after M).
      i -= 1;
      cmd = lastCommand;
    }
    const isRelative = cmd !== cmd.toUpperCase() && cmd.toLowerCase() !== 'z';
    const c = cmd.toUpperCase();
    const abs = (x, y) =>
      isRelative ? { x: current.x + x, y: current.y + y } : { x, y };

    if (c === 'Z') {
      sampleLine(current, subpathStart);
      current = { ...subpathStart };
      lastControl = null;
      lastCommand = cmd;
    } else if (c === 'M') {
      const p = abs(readNumber(), readNumber());
      pushPoint(p);
      current = p;
      subpathStart = { ...p };
      lastControl = null;
      // Extra coordinate pairs after a moveto are implicit linetos (SVG spec),
      // preserving the relative/absolute style of the original moveto.
      lastCommand = isRelative ? 'l' : 'L';
    } else if (c === 'L') {
      const p = abs(readNumber(), readNumber());
      sampleLine(current, p);
      current = p;
      lastControl = null;
      lastCommand = cmd;
    } else if (c === 'H') {
      const p = abs(readNumber(), current.y);
      sampleLine(current, p);
      current = p;
      lastControl = null;
      lastCommand = cmd;
    } else if (c === 'V') {
      const p = abs(current.x, readNumber());
      sampleLine(current, p);
      current = p;
      lastControl = null;
      lastCommand = cmd;
    } else if (c === 'C') {
      const p1 = abs(readNumber(), readNumber());
      const p2 = abs(readNumber(), readNumber());
      const p3 = abs(readNumber(), readNumber());
      sampleCubic(current, p1, p2, p3);
      lastControl = p2;
      current = p3;
      lastCommand = cmd;
    } else if (c === 'S') {
      const p2 = abs(readNumber(), readNumber());
      const p3 = abs(readNumber(), readNumber());
      const reflects = ['C', 'S'].includes(lastCommand.toUpperCase());
      const p1 = reflects
        ? { x: 2 * current.x - lastControl.x, y: 2 * current.y - lastControl.y }
        : { ...current };
      sampleCubic(current, p1, p2, p3);
      lastControl = p2;
      current = p3;
      lastCommand = cmd;
    } else if (c === 'Q') {
      const p1 = abs(readNumber(), readNumber());
      const p2 = abs(readNumber(), readNumber());
      sampleQuadratic(current, p1, p2);
      lastControl = p1;
      current = p2;
      lastCommand = cmd;
    } else if (c === 'T') {
      const p2 = abs(readNumber(), readNumber());
      const reflects = ['Q', 'T'].includes(lastCommand.toUpperCase());
      const p1 = reflects
        ? { x: 2 * current.x - lastControl.x, y: 2 * current.y - lastControl.y }
        : { ...current };
      sampleQuadratic(current, p1, p2);
      lastControl = p1;
      current = p2;
      lastCommand = cmd;
    } else if (c === 'A') {
      const rx = Math.abs(readNumber());
      const ry = Math.abs(readNumber());
      const rot = readNumber();
      const large = readNumber();
      const sweep = readNumber();
      const p = abs(readNumber(), readNumber());
      sampleArc(current, p, rx, ry, rot, large, sweep);
      current = p;
      lastControl = null;
      lastCommand = cmd;
    } else {
      lastCommand = cmd;
    }
  }

  return points;
};

/** Convert sampled points into line segments. */
export const getPathSegments = (points) => {
  const segments = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    segments.push({
      x1: points[i].x,
      y1: points[i].y,
      x2: points[i + 1].x,
      y2: points[i + 1].y,
    });
  }
  return segments;
};

/** Shortest distance from a point to a line segment. */
export const distanceToSegment = (px, py, ax, ay, bx, by) => {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - ax, py - ay);
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
  const cx = ax + t * dx;
  const cy = ay + t * dy;
  return Math.hypot(px - cx, py - cy);
};

/** Minimum distance from a point to any segment in a set. */
export const minDistanceToSegments = (px, py, segments) => {
  let min = Infinity;
  for (const s of segments) {
    const d = distanceToSegment(px, py, s.x1, s.y1, s.x2, s.y2);
    if (d < min) min = d;
  }
  return min;
};

const templateSegmentsFor = (pathDataList) =>
  pathDataList.flatMap((d) => getPathSegments(samplePathPoints(d)));

/**
 * Compute a 0–100 trace score: the fraction of traced points that fall within
 * `tolerance` (in the same coordinate space) of any template path.
 *
 * @param {Array<Array<{x, y}>>} strokes - arrays of traced points (one per stroke)
 * @param {string[]} pathDataList - template SVG `d` strings
 * @param {number} tolerance - distance threshold in path coordinates
 * @returns {number} 0-100
 */
export const calculateTraceScore = (strokes, pathDataList, tolerance = 5) => {
  const segments = templateSegmentsFor(pathDataList);
  const traced = strokes.flat();
  if (segments.length === 0 || traced.length === 0) return 0;

  const flagged = traced.map((p) => ({
    ...p,
    withinTolerance: minDistanceToSegments(p.x, p.y, segments) <= tolerance,
  }));
  return calculatePathTracingScore(flagged);
};

/**
 * Fraction (0–1) of the *template path* that has been traced: how many of the
 * path's sample points lie within tolerance of any traced point. Used for live
 * visual feedback so the template path lights up proportionally as it is
 * traced, rather than turning fully green from a single touch.
 */
export const getPathCoverage = (strokes, d, tolerance = 5) => {
  const templatePoints = samplePathPoints(d);
  const tracedSegments = strokes.flatMap((stroke) => getPathSegments(stroke));
  if (templatePoints.length === 0 || tracedSegments.length === 0) return 0;

  const covered = templatePoints.filter(
    (p) => minDistanceToSegments(p.x, p.y, tracedSegments) <= tolerance,
  ).length;
  return covered / templatePoints.length;
};
