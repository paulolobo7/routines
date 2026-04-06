import { useState, useEffect, useCallback } from "react";
import type { TimerMode } from "@/types";
import { TIMER_MODES } from "@/lib/constants";
import { useNotification } from "@/hooks/useNotification";
import { useSettings } from "./useSettings";




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

    console.log('🔧 useTimer - settings:', settings);
    console.log('🔧 useTimer - currentMode:', currentMode);

    const modeConfig = TIMER_MODES.find(mode => mode.id === currentMode);
    const totalSeconds = (() => {
    // ✅ Verificação de segurança
    if (!settings) {
        console.log('Settings ainda não carregado');
        return currentMode === 'focus' ? 25 * 60 : currentMode === 'shortBreak' ? 5 * 60 : 15 * 60;
    }
    
    console.log('Settings carregado:', settings);
    
    if (currentMode === 'focus') {
        return (settings.focusDuration || 25) * 60;
    } else if (currentMode === 'shortBreak') {
        return (settings.shortBreakDuration || 5) * 60;
    } else {
        return (settings.longBreakDuration || 15) * 60;
    }
    })();

    useEffect(() => {
    console.log('Timer resetado - totalSeconds:', totalSeconds);
    setSecondsLeft(totalSeconds);
    setIsRunning(false);
    }, [totalSeconds])

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
        setSecondsLeft(totalSeconds);
        setIsRunning(false);
    }, [totalSeconds]);

    const switchMode = useCallback((mode: TimerMode) => {
        setCurrentMode(mode);
        setIsRunning(false);
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
export type { UseTimerReturn };