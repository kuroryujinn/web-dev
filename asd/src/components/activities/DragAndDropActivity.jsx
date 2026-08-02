import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { calculateDragDropScore } from '../../utils/scoring';
import AccessibleButton from '../shared/AccessibleButton';

/**
 * Drag-and-drop activity: drag (or tap) items onto matching targets.
 *
 * Accessibility:
 * - Items are buttons: Tab focuses them, Enter/Space taps them, arrow keys
 *   move focus (native). The selected item can then be placed on a target.
 * - Drop targets also accept pointer-based HTML5 drag (mouse/trackpad).
 * - Results are announced via a polite live region.
 */
const DragAndDropActivity = ({ content, onComplete }) => {
  const {
    assignments,
    draggedItem,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleTapAssign,
    getPlacements,
    isComplete,
  } = useDragAndDrop(content.items, content.targets);

  const [selectedItem, setSelectedItem] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const completeTimerRef = useRef(null);

  // Clear a pending completion timer if the activity unmounts.
  useEffect(() => {
    return () => clearTimeout(completeTimerRef.current);
  }, []);

  const handleItemClick = useCallback(
    (itemId) => {
      if (showResult) return;
      setSelectedItem((prev) => (prev === itemId ? null : itemId));
    },
    [showResult],
  );

  const handleTargetClick = useCallback(
    (targetId) => {
      if (showResult || !selectedItem) return;
      handleTapAssign(selectedItem, targetId);
      setSelectedItem(null);
      setAnnouncement('Item placed. Choose where to put the next one.');
    },
    [showResult, selectedItem, handleTapAssign],
  );

  const handleSubmit = useCallback(() => {
    const placements = getPlacements();
    const score = calculateDragDropScore(placements);
    setShowResult(true);
    setAnnouncement(score >= 70 ? 'All placed correctly. Nice work!' : 'Keep trying!');
    completeTimerRef.current = setTimeout(() => onComplete(score), 1500);
  }, [getPlacements, onComplete]);

  const itemLabelFor = (itemId) =>
    content.items.find((item) => item.id === itemId)?.label || '';

  return (
    <div
      data-testid="drag-drop-activity"
      role="group"
      aria-labelledby="dnd-instructions"
      className="brutal-card raised-glass-soft relative w-full max-w-5xl rounded-[2rem] bg-[#b85d33]/90 p-6 md:p-10"
    >
      <h2
        id="dnd-instructions"
        className="text-2xl md:text-4xl font-black text-[var(--ink)] mb-6 text-center"
      >
        {content.instructions}
      </h2>

      {/* Items to place */}
      <div className="mb-8">
        <h3 className="text-sm font-black text-[var(--ink-soft)] uppercase tracking-[0.2em] mb-4">
          Items
        </h3>
        <div className="flex flex-wrap gap-4 justify-center">
          {content.items.map((item) => {
            const isSelected = selectedItem === item.id;
            const isDragging = draggedItem === item.id;
            const isAssigned = Object.values(assignments).includes(item.id);
            return (
              <button
                key={item.id}
                data-testid={`drag-item-${item.id}`}
                type="button"
                draggable={!showResult}
                onDragStart={() => handleDragStart(item.id)}
                onDragEnd={handleDragEnd}
                onClick={() => handleItemClick(item.id)}
                aria-pressed={isSelected || undefined}
                aria-label={`${item.label}${isAssigned ? ' (placed)' : ''}`}
                className={`brutal-tile pressable p-4 rounded-xl text-lg font-black cursor-pointer transition-all
                  ${isSelected || isDragging
                    ? 'bg-[var(--surface-butter)] -translate-y-1'
                    : 'bg-white/85 hover:bg-[var(--surface-sky)]'
                  }
                  ${showResult ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                disabled={showResult}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt=""
                    className="w-12 h-12 object-contain mb-2 mx-auto"
                  />
                )}
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Drop targets */}
      <div className="mb-8">
        <h3 className="text-sm font-black text-[var(--ink-soft)] uppercase tracking-[0.2em] mb-4">
          Targets
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {content.targets.map((target) => {
            const assignedItemId = assignments[target.id];
            const isCorrectPlacement =
              showResult && assignedItemId === target.correctItemId;
            const isWrongPlacement =
              showResult && assignedItemId && assignedItemId !== target.correctItemId;
            return (
              <div
                key={target.id}
                data-testid={`drop-target-${target.id}`}
                onDragOver={(e) => {
                  if (!showResult) e.preventDefault();
                }}
                onDrop={() => handleDrop(target.id)}
                onClick={() => handleTargetClick(target.id)}
                role="button"
                tabIndex={showResult ? -1 : 0}
                aria-label={`Target ${target.label}${
                  assignedItemId ? `, contains ${itemLabelFor(assignedItemId)}` : ', empty'
                }`}
                className={`brutal-tile p-6 rounded-xl text-center cursor-pointer transition-all min-h-[100px]
                  ${assignedItemId
                    ? 'bg-[var(--surface-mint)]'
                    : 'bg-white/60 border-dashed border-[3px] border-[var(--ink)]'
                  }
                  ${isWrongPlacement ? 'bg-[var(--surface-coral)]' : ''}
                  ${isCorrectPlacement ? 'bg-[var(--surface-mint)]' : ''}
                  ${showResult ? 'cursor-default' : 'focus-visible:outline-4 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2'}
                `}
              >
                {target.image && (
                  <img
                    src={target.image}
                    alt=""
                    className="w-16 h-16 object-contain mx-auto mb-2"
                  />
                )}
                <p className="font-black text-[var(--ink)]">{target.label}</p>
                {assignedItemId && (
                  <p className="text-sm mt-2 font-bold text-[var(--ink-soft)]">
                    → {itemLabelFor(assignedItemId)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {!showResult && (
        <AccessibleButton
          onClick={handleSubmit}
          disabled={!isComplete}
          variant="coral"
          className="w-full py-4 text-xl"
        >
          CHECK ANSWERS
        </AccessibleButton>
      )}

      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
};

export default DragAndDropActivity;
