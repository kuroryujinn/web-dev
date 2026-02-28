import { useState, useEffect, useCallback } from 'react';

export function useAnimationPlayer(steps, initialSpeed = 500) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(initialSpeed);

    useEffect(() => {
        let intervalId;
        if (isPlaying && steps && currentStepIndex < steps.length - 1) {
            intervalId = setInterval(() => {
                setCurrentStepIndex((prev) => {
                    if (prev >= steps.length - 1) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, speed);
        } else if (isPlaying && currentStepIndex >= steps.length - 1) {
            setIsPlaying(false);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isPlaying, steps, currentStepIndex, speed]);

    const play = useCallback(() => setIsPlaying(true), []);
    const pause = useCallback(() => setIsPlaying(false), []);

    const stepForward = useCallback(() => {
        pause();
        setCurrentStepIndex((prev) => Math.min(prev + 1, (steps?.length || 1) - 1));
    }, [pause, steps]);

    const stepBack = useCallback(() => {
        pause();
        setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
    }, [pause]);

    const reset = useCallback(() => {
        pause();
        setCurrentStepIndex(0);
    }, [pause]);

    return {
        currentStepIndex,
        currentStep: steps ? steps[currentStepIndex] : null,
        isPlaying,
        speed,
        setSpeed,
        play,
        pause,
        stepForward,
        stepBack,
        reset
    };
}
