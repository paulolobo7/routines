import { useState, useEffect, useCallback } from "react";
import type { TimerMode } from "@/types";
import { TIMER_MODES } from "@/lib/constants";


interface UseTimerReturn {
    secondsLeft: number;
    isRunning: boolean;
    currentMode: TimerMode;

    start: () => void;
    pause: () => void;
    reset: () => void;
    switchMode: (mode: TimerMode) => void;

    totalSeconds: number;
    progressPercentage: number;
}

export function useTimer(initialMode: TimerMode = 'focus'): UseTimerReturn {
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [currentMode, setCurrentMode] = useState<TimerMode>(initialMode);

    const modeConfig = TIMER_MODES.find(mode => mode.id === currentMode);
    const totalSeconds = (modeConfig?.duration || 25) * 60;


    useEffect(() => {
        const modeConfig = TIMER_MODES.find(mode => mode.id === currentMode);
        const newTotalSeconds = (modeConfig?.duration || 25) * 60;
        setSecondsLeft(newTotalSeconds);
        setIsRunning(false);
    }, [currentMode]);

    useEffect(() => {
        if (!isRunning) return

        const interval = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 1) {
                    setIsRunning(false)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [isRunning])

    const start = useCallback(() => setIsRunning(true), []);
    const pause = useCallback(() => setIsRunning(false), []);
    
    const reset = useCallback(() => {
        setIsRunning(false);
        const modeConfig = TIMER_MODES.find(mode => mode.id === currentMode);
        const newTotalSeconds = (modeConfig?.duration || 25) * 60;
        setSecondsLeft(newTotalSeconds);
    }, [currentMode]);

    const switchMode = useCallback((mode: TimerMode) => {
        setCurrentMode(mode);
    }, []);

    const progressPercentage = 100 - (secondsLeft / totalSeconds) * 100;

    return {
        secondsLeft,
        isRunning,
        currentMode,
        start,
        pause,
        reset,
        switchMode,
        totalSeconds,
        progressPercentage
    };
}