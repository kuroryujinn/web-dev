import React, { useEffect, useRef } from 'react';
import AccessibleButton from './AccessibleButton';
import { useSettings } from '../../contexts/SettingsContext';

/**
 * Enhanced feedback modal shown after an activity is completed.
 * - Announcements are read via a polite live region.
 * - Dialog semantics (role="dialog", aria-modal) with focus management.
 * - Plays an optional success/reassurance tone when sound is enabled
 *   (sound is OFF by default — ASD consideration).
 */
const FeedbackOverlay = ({ isCorrect, feedback, onNext, nextLabel = 'CONTINUE' }) => {
  const { settings } = useSettings();
  const continueButtonRef = useRef(null);

  // Move focus into the dialog so screen readers and keyboard users land on the action.
  useEffect(() => {
    continueButtonRef.current?.focus();
  }, []);

  // Optional audio cue — gated behind the user's sound preference (default: off).
  useEffect(() => {
    if (!settings.sound || typeof window === 'undefined' || !window.AudioContext) return;

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const playTone = (freq, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + startTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startTime + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration + 0.05);
    };

    if (isCorrect) {
      playTone(523.25, 0, 0.25); // C5
      playTone(659.25, 0.18, 0.3); // E5
    } else {
      playTone(392, 0, 0.3); // G4
    }
    ctx.close().catch(() => {});
  }, [settings.sound, isCorrect]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isCorrect ? 'Activity complete' : 'Try again'}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(31,26,23,0.35)] p-6 backdrop-blur-[2px]"
    >
      <div
        className={`brutal-card raised-glass-soft w-full max-w-3xl rounded-[2rem] p-8 md:p-12 text-center ${
          isCorrect ? 'bg-warm-mint' : 'bg-warm-coral'
        }`}
      >
        <div className="text-7xl mb-6" aria-hidden="true">
          {isCorrect ? '🌟' : '🧠'}
        </div>

        <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-[0.04em] text-[var(--ink)]">
          {isCorrect ? 'NICE WORK!' : 'TRY AGAIN!'}
        </h2>

        <p
          className="text-xl md:text-3xl font-black text-[var(--ink-soft)] mb-10 leading-relaxed max-w-2xl mx-auto"
          aria-live="polite"
        >
          {feedback}
        </p>

        <AccessibleButton
          ref={continueButtonRef}
          onClick={onNext}
          variant="butter"
          className="w-full py-4 text-2xl md:text-3xl"
        >
          {nextLabel}
        </AccessibleButton>
      </div>
    </div>
  );
};

export default FeedbackOverlay;
