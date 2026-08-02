import React from 'react';
import { act, renderHook } from '@testing-library/react';
import { useTimer } from '../useTimer';

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts at the provided duration and counts down', () => {
    const { result } = renderHook(() => useTimer({ duration: 90 }));

    expect(result.current.timeLeft).toBe(90);
    expect(result.current.formattedTime).toBe('1:30');

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.timeLeft).toBe(89);
    expect(result.current.formattedTime).toBe('1:29');
  });

  it('calls onTimeUp once when the timer reaches zero', () => {
    const onTimeUp = vi.fn();
    renderHook(() => useTimer({ duration: 2, onTimeUp }));

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(onTimeUp).toHaveBeenCalledTimes(1);

    // No further calls after time is up.
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(onTimeUp).toHaveBeenCalledTimes(1);
  });

  it('does not start counting when autoStart is false', () => {
    const onTimeUp = vi.fn();
    const { result } = renderHook(() =>
      useTimer({ duration: 5, onTimeUp, autoStart: false }),
    );

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.timeLeft).toBe(5);
    expect(onTimeUp).not.toHaveBeenCalled();
  });

  it('start resumes a paused countdown', () => {
    const { result } = renderHook(() =>
      useTimer({ duration: 5, autoStart: false }),
    );

    act(() => {
      result.current.start();
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.timeLeft).toBe(4);
    expect(result.current.isRunning).toBe(true);
  });

  it('pause stops the countdown', () => {
    const { result } = renderHook(() => useTimer({ duration: 5 }));

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    act(() => {
      result.current.pause();
    });
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.timeLeft).toBe(4);
    expect(result.current.isRunning).toBe(false);
  });

  it('reset restores the original duration', () => {
    const { result } = renderHook(() => useTimer({ duration: 5 }));

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    act(() => {
      result.current.reset();
    });
    expect(result.current.timeLeft).toBe(5);
  });

  it('supports untimed activities (duration null)', () => {
    const { result } = renderHook(() => useTimer({ duration: null }));

    expect(result.current.timeLeft).toBeNull();
    expect(result.current.formattedTime).toBeNull();
  });
});
