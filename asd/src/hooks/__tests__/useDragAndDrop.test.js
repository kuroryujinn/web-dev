import { act, renderHook } from '@testing-library/react';
import { useDragAndDrop } from '../useDragAndDrop';

const items = [
  { id: 'apple', label: 'Apple' },
  { id: 'banana', label: 'Banana' },
];

const targets = [
  { id: 't1', label: 'Fruit 1', correctItemId: 'apple' },
  { id: 't2', label: 'Fruit 2', correctItemId: 'banana' },
];

describe('useDragAndDrop', () => {
  it('starts with no assignments and incomplete state', () => {
    const { result } = renderHook(() => useDragAndDrop(items, targets));

    expect(result.current.assignments).toEqual({});
    expect(result.current.isComplete).toBe(false);
    expect(result.current.getPlacements()).toEqual([
      { targetId: 't1', itemId: null, correct: false },
      { targetId: 't2', itemId: null, correct: false },
    ]);
  });

  it('assigns an item to a target via tap', () => {
    const { result } = renderHook(() => useDragAndDrop(items, targets));

    act(() => {
      result.current.handleTapAssign('apple', 't1');
    });

    expect(result.current.assignments).toEqual({ t1: 'apple' });
    expect(result.current.getPlacements()[0]).toEqual({
      targetId: 't1',
      itemId: 'apple',
      correct: true,
    });
  });

  it('assigns an item to a target via drag/drop', () => {
    const { result } = renderHook(() => useDragAndDrop(items, targets));

    act(() => {
      result.current.handleDragStart('banana');
    });
    expect(result.current.draggedItem).toBe('banana');

    act(() => {
      result.current.handleDrop('t2');
    });

    expect(result.current.assignments).toEqual({ t2: 'banana' });
    expect(result.current.draggedItem).toBeNull();
    expect(result.current.getPlacements()[1].correct).toBe(true);
  });

  it('reports an incorrect placement when the wrong item is dropped', () => {
    const { result } = renderHook(() => useDragAndDrop(items, targets));

    act(() => {
      result.current.handleTapAssign('banana', 't1');
    });

    expect(result.current.getPlacements()[0]).toEqual({
      targetId: 't1',
      itemId: 'banana',
      correct: false,
    });
  });

  it('replaces a previous assignment when the target is reused', () => {
    const { result } = renderHook(() => useDragAndDrop(items, targets));

    act(() => {
      result.current.handleTapAssign('apple', 't1');
      result.current.handleTapAssign('banana', 't1');
    });

    expect(result.current.assignments).toEqual({ t1: 'banana' });
  });

  it('moves an item out of its previous target when placed elsewhere', () => {
    const { result } = renderHook(() => useDragAndDrop(items, targets));

    act(() => {
      result.current.handleTapAssign('apple', 't1');
      result.current.handleTapAssign('apple', 't2');
    });

    // The item is no longer shown in target 1 — one item, one target.
    expect(result.current.assignments).toEqual({ t2: 'apple' });
  });

  it('marks the activity complete when every target has an item', () => {
    const { result } = renderHook(() => useDragAndDrop(items, targets));

    act(() => {
      result.current.handleTapAssign('apple', 't1');
      result.current.handleTapAssign('banana', 't2');
    });

    expect(result.current.isComplete).toBe(true);
  });

  it('reset clears assignments and the dragged item', () => {
    const { result } = renderHook(() => useDragAndDrop(items, targets));

    act(() => {
      result.current.handleTapAssign('apple', 't1');
      result.current.handleDragStart('banana');
    });
    expect(result.current.isComplete).toBe(false);

    act(() => {
      result.current.reset();
    });

    expect(result.current.assignments).toEqual({});
    expect(result.current.draggedItem).toBeNull();
  });

  it('ignores drop when no item is being dragged', () => {
    const { result } = renderHook(() => useDragAndDrop(items, targets));

    act(() => {
      result.current.handleDrop('t1');
    });

    expect(result.current.assignments).toEqual({});
  });
});
