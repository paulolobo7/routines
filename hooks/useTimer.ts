import { useState, useEffect, useCallback, use } from "react";
import type { TimerMode } from "@/types";
import { TIMER_MODES } from "@/lib/constants";
import { useNotification } from "@/hooks/useNotification";
import { useSettings } from "./useSettings";
import { set } from "react-hook-form";


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

    const { settings } = useSettings();

    const modeConfig = TIMER_MODES.find(mode => mode.id === currentMode);
    const totalSeconds = (() => {
        if (currentMode === 'focus') {
            return (settings.focusDuration || 25) * 60;
        } else if (currentMode === 'shortBreak') {
            return (settings.shortBreakDuration || 5) * 60;
        } else {
            return (settings.longBreakDuration || 15) * 60;
        }
    })();

    useEffect(() => {
        let newTotalSeconds = 25 * 60; // Default fallback
        if (currentMode === 'focus') {
            newTotalSeconds = (settings.focusDuration || 25) * 60;
        } else if (currentMode === 'shortBreak') {
            newTotalSeconds = (settings.shortBreakDuration || 5) * 60;
        } else {
            newTotalSeconds = (settings.longBreakDuration || 15) * 60;
        }
        setSecondsLeft(newTotalSeconds);
        setIsRunning(false);
    }, [currentMode, settings]);


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

    const { notify } = useNotification();

    useEffect(() => {
        if (secondsLeft === 0 && totalSeconds > 0 && isRunning === false) {

            const modeConfig = TIMER_MODES.find(m => m.id === currentMode);
            const mensagem = currentMode === 'focus'
            ? 'Pausa merecida! Descanse um pouco antes de voltar ao trabalho.'
            : 'Tempo esgotado! Vamos para a próxima atividade.';
            notify({
                title: 'Sessão Concluída',
                message: mensagem
            })
        }
    }, [secondsLeft, currentMode, notify])

    const start = useCallback(() => setIsRunning(true), []);
    const pause = useCallback(() => setIsRunning(false), []);
    
    const reset = useCallback(() => {
        setIsRunning(false);
        
        let newTotalSeconds = 25 * 60; // Default fallback
        if (currentMode === 'focus') {
            newTotalSeconds = (settings.focusDuration || 25) * 60;
        } else if (currentMode === 'shortBreak') {
            newTotalSeconds = (settings.shortBreakDuration || 5) * 60;
        } else {
            newTotalSeconds = (settings.longBreakDuration || 15) * 60;
        }

        setSecondsLeft(newTotalSeconds);
    }, [currentMode, settings]);

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