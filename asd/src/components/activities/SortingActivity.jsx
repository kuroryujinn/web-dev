import React, { useCallback, useEffect, useRef, useState } from 'react';
import { calculateSortingScore } from '../../utils/scoring';
import AccessibleButton from '../shared/AccessibleButton';

/**
 * Sorting activity (Level 4–5 — sequencing): reorder the items to match the
 * target order (ascending or descending).
 *
 * Three equivalent input modes, all converging on the same swap semantics:
 * - Drag item A onto item B (mouse/trackpad).
 * - Tap/click two items (touch + keyboard: Tab + Enter).
 * - ArrowUp / ArrowDown on a focused item moves it one position.
 *
 * Score = fraction of items in the correct position (predictable feedback).
 * Results are announced via a polite live region.
 */
const SortingActivity = ({ content, onComplete }) => {
  // Display order = array order of content.items; correct order = item.order.
  const [items, setItems] = useState(() =>
    content.items.map((item) => ({
      id: item.id,
      label: item.label,
      image: item.image || null,
      order: item.order,
    })),
  );
  const [selectedId, setSelectedId] = useState(null);
  const [draggedId, setDraggedId] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const completeTimerRef = useRef(null);

  // Clear a pending completion timer if the activity unmounts.
  useEffect(() => {
    return () => clearTimeout(completeTimerRef.current);
  }, []);

  const directionLabel =
    content.orderHint ||
    (content.direction === 'descending' ? 'biggest to smallest' : 'smallest to biggest');

  // Swap by item ID (not array index) so the correct items always move,
  // regardless of the current display order.
  const swapByIds = useCallback((idA, idB) => {
    if (!idA || idB === idA) return;
    setItems((prev) => {
      const indexA = prev.findIndex((i) => i.id === idA);
      const indexB = prev.findIndex((i) => i.id === idB);
      if (indexA === -1 || indexB === -1) return prev;
      const next = [...prev];
      [next[indexA], next[indexB]] = [next[indexB], next[indexA]];
      return next;
    });
  }, []);

  const labelFor = (id) => items.find((i) => i.id === id)?.label;

  const announceSwap = (idA, idB) => {
    const labelA = labelFor(idA);
    const labelB = labelFor(idB);
    if (labelA && labelB && labelA !== labelB) {
      setAnnouncement(`Swapped ${labelA} and ${labelB}`);
    }
  };

  const handleItemClick = (id) => {
    if (showResult) return;
    if (selectedId === null) {
      setSelectedId(id);
    } else {
      swapByIds(selectedId, id);
      announceSwap(selectedId, id);
      setSelectedId(null);
    }
  };

  const handleDragStart = (e, id) => {
    if (showResult) return;
    e.dataTransfer?.setData('text/plain', id);
    setDraggedId(id);
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (showResult || !draggedId || draggedId === targetId) return;
    swapByIds(draggedId, targetId);
    announceSwap(draggedId, targetId);
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  const handleKeyDown = (e, id) => {
    if (showResult) return;
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return;
    if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault();
      swapByIds(id, items[index - 1].id);
      setAnnouncement(`${items[index].label} moved up to position ${index}`);
    } else if (e.key === 'ArrowDown' && index < items.length - 1) {
      e.preventDefault();
      swapByIds(id, items[index + 1].id);
      setAnnouncement(`${items[index].label} moved down to position ${index + 2}`);
    }
  };

  const handleSubmit = useCallback(() => {
    const score = calculateSortingScore(
      items.map((item, position) => ({ position, correctPosition: item.order })),
    );
    setShowResult(true);
    setAnnouncement(score >= 70 ? 'Great sorting! Well done.' : 'Keep practicing!');
    completeTimerRef.current = setTimeout(() => onComplete(score), 1500);
  }, [items, onComplete]);

  return (
    <div
      data-testid="sorting-activity"
      className="brutal-card raised-glass-soft relative w-full max-w-5xl rounded-[2rem] bg-[#b85d33]/90 p-6 md:p-10"
    >
      <h2
        id="so-instructions"
        className="text-2xl md:text-4xl font-black text-[var(--ink)] mb-2 text-center"
      >
        {content.instructions}
      </h2>
      <p className="text-sm font-bold text-[var(--ink-soft)] text-center mb-6">
        Put them in order ({directionLabel}) — drag one onto another, tap two to swap,
        or use the up and down arrow keys
      </p>

      <ol className="flex flex-col gap-4 max-w-2xl mx-auto list-none p-0">
        {items.map((item, displayIndex) => {
          const isSelected = selectedId === item.id;
          const isDragging = draggedId === item.id;
          const isCorrect = showResult && item.order === displayIndex;
          const isWrong = showResult && item.order !== displayIndex;

          return (
            <li key={item.id} className="w-full">
              <button
                type="button"
                data-testid={`sort-item-${item.id}`}
                draggable={!showResult}
                onClick={() => handleItemClick(item.id)}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragOver={(e) => {
                  if (!showResult) e.preventDefault();
                }}
                onDrop={(e) => handleDrop(e, item.id)}
                onDragEnd={handleDragEnd}
                aria-pressed={isSelected || undefined}
                className={`brutal-tile pressable p-4 md:p-6 flex items-center gap-4 text-left transition-all w-full min-h-[48px]
                  ${isSelected ? 'bg-[var(--surface-butter)] -translate-y-1' : ''}
                  ${isDragging ? 'opacity-60' : ''}
                  ${isCorrect ? 'bg-[var(--surface-mint)]' : ''}
                  ${isWrong ? 'bg-[var(--surface-coral)]' : ''}
                  ${!showResult && !isSelected ? 'bg-white/85 hover:bg-[var(--surface-sky)]' : ''}
                  ${showResult ? 'cursor-not-allowed' : ''}
                `}
                disabled={showResult}
              >
                <span className="text-2xl font-black text-[var(--ink-soft)] w-8">
                  {displayIndex + 1}.
                </span>
                {item.image && (
                  <img src={item.image} alt={item.label} className="w-12 h-12 object-contain" />
                )}
                <span className="text-lg font-black text-[var(--ink)]">{item.label}</span>
                {isSelected && (
                  <span className="ml-auto text-sm font-bold text-[var(--ink-soft)]">
                    SELECTED
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>

      {!showResult && (
        <AccessibleButton
          onClick={handleSubmit}
          variant="coral"
          className="mt-8 w-full py-4 text-xl"
        >
          CHECK ORDER
        </AccessibleButton>
      )}

      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
};

export default SortingActivity;
