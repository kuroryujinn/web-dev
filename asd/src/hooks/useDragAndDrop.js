import { useState, useCallback } from 'react';

/**
 * Drag-and-drop state management for DragAndDropActivity.
 *
 * Supports three input modes:
 * - Native HTML5 drag & drop (mouse/trackpad)
 * - Tap-to-assign (touch): pick an item, then tap a target
 * - Keyboard (buttons are natively focusable + Enter/Space activates tap-assign)
 *
 * Assignments are stored as a map of `targetId -> itemId`. Dropping or
 * tapping an item onto a target replaces whatever was there before.
 */
export const useDragAndDrop = (items, targets) => {
  const [assignments, setAssignments] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = useCallback((itemId) => {
    setDraggedItem(itemId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
  }, []);

  // Assign an item to a target, removing it from any other target it was in.
  // Each item lives in exactly one place — predictable matching semantics.
  const assignItem = useCallback((itemId, targetId) => {
    setAssignments((prev) => {
      const next = {};
      for (const [existingTargetId, existingItemId] of Object.entries(prev)) {
        if (existingItemId !== itemId) next[existingTargetId] = existingItemId;
      }
      next[targetId] = itemId;
      return next;
    });
  }, []);

  const handleDrop = useCallback(
    (targetId) => {
      if (!draggedItem) return;
      assignItem(draggedItem, targetId);
      setDraggedItem(null);
    },
    [draggedItem, assignItem],
  );

  const handleTapAssign = useCallback(
    (itemId, targetId) => {
      assignItem(itemId, targetId);
    },
    [assignItem],
  );

  const getPlacements = useCallback(() => {
    return targets.map((target) => ({
      targetId: target.id,
      itemId: assignments[target.id] || null,
      correct: assignments[target.id] === target.correctItemId,
    }));
  }, [assignments, targets]);

  const isComplete = targets.every((target) => assignments[target.id]);

  const reset = useCallback(() => {
    setAssignments({});
    setDraggedItem(null);
  }, []);

  return {
    assignments,
    draggedItem,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleTapAssign,
    getPlacements,
    isComplete,
    reset,
  };
};
