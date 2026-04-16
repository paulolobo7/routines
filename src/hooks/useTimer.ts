import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import type { TimerMode } from "@/types";
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

export function useTimer(
    initialMode: TimerMode = 'focus',
    onComplete?: (mode: TimerMode, durationMinutes: number) => void
): UseTimerReturn {
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [currentMode, setCurrentMode] = useState<TimerMode>(initialMode);

    // Contador de sessões de foco para saber quando dar pausa longa
    const focusCountRef = useRef(0);

    const hasStartedRef = useRef(false);
    const hasCompletedRef = useRef(false);
    const onCompleteRef = useRef(onComplete);
    useEffect(() => { onCompleteRef.current = onComplete; });

    const { settings } = useSettings();

    const totalSeconds = useMemo(() => {
        if (!settings) {
            return currentMode === 'focus' ? 25 * 60 
                 : currentMode === 'shortBreak' ? 5 * 60 
                 : 15 * 60;
        }

        if (currentMode === 'focus') {
            return (settings.focusDuration || 25) * 60;
        } else if (currentMode === 'shortBreak') {
            return (settings.shortBreakDuration || 5) * 60;
        } else {
            return (settings.longBreakDuration || 15) * 60;
        }
    }, [
        settings?.focusDuration,
        settings?.shortBreakDuration,
        settings?.longBreakDuration,
        currentMode
    ]);

    // ─── FIX: Depende de currentMode ALÉM de totalSeconds ───
    // Antes: se dois modos tinham a mesma duração (ex: foco 25min, pausa longa 25min),
    // totalSeconds não mudava e o efeito não disparava → timer continuava contando.
    // Agora: currentMode na dependência garante que o reset acontece em TODA troca de modo.
    useEffect(() => {
        setSecondsLeft(totalSeconds);
        setIsRunning(false);
        hasCompletedRef.current = false;
    }, [totalSeconds, currentMode]);

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 1) {
                    setIsRunning(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning]);

    const { notify } = useNotification();

    // Lógica de conclusão e transição automática
    useEffect(() => {
        if (!hasStartedRef.current) return;
        if (hasCompletedRef.current) return;

        if (secondsLeft === 0 && totalSeconds > 0 && !isRunning) {
            hasCompletedRef.current = true;

            const mensagem = currentMode === 'focus'
                ? 'Pausa merecida! Descanse um pouco antes de voltar ao trabalho.'
                : 'Tempo esgotado! Vamos para a próxima atividade.';

            notify({
                title: 'Sessão Concluída',
                message: mensagem
            });

            onCompleteRef.current?.(currentMode, totalSeconds / 60);

            // Transição automática de modo
            if (currentMode === 'focus') {
                focusCountRef.current += 1;
                const nextMode: TimerMode = focusCountRef.current % 4 === 0
                    ? 'longBreak'
                    : 'shortBreak';
                setCurrentMode(nextMode);
            } else {
                setCurrentMode('focus');
            }
            hasStartedRef.current = false;
        }
    }, [secondsLeft, currentMode, notify, totalSeconds, isRunning]);

    const start = useCallback(() => {
        hasStartedRef.current = true;
        hasCompletedRef.current = false;
        setIsRunning(true);
    }, []);

    const pause = useCallback(() => setIsRunning(false), []);

    const reset = useCallback(() => {
        setSecondsLeft(totalSeconds);
        setIsRunning(false);
        hasCompletedRef.current = false;
    }, [totalSeconds]);

    const switchMode = useCallback((mode: TimerMode) => {
        setCurrentMode(mode);
        setIsRunning(false);
        hasCompletedRef.current = false;
    }, []);

    const progressPercentage = totalSeconds > 0 
        ? 100 - (secondsLeft / totalSeconds) * 100 
        : 0;

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
