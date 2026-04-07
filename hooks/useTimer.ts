import { useState, useEffect, useCallback, useMemo, useRef } from "react";
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

    // 🆕 Flag para saber se o timer já foi iniciado pelo menos uma vez
    // Isso evita que a notificação dispare quando a página carrega
    const hasStartedRef = useRef(false);

    const { settings } = useSettings();

    // Calcula o total de segundos baseado no modo atual e nos settings
    // useMemo recalcula APENAS quando as dependências mudam
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

    // Quando totalSeconds muda (settings alterados ou modo trocado),
    // reseta o timer para o novo valor
    useEffect(() => {
        setSecondsLeft(totalSeconds);
        setIsRunning(false);
    }, [totalSeconds]);

    // O interval que faz o countdown de 1 em 1 segundo
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

    // Notificação quando o timer chega a zero
    const { notify } = useNotification();

    useEffect(() => {
        // 🆕 Só notifica se o timer já foi iniciado pelo menos uma vez
        if (!hasStartedRef.current) return;

        if (secondsLeft === 0 && totalSeconds > 0 && !isRunning) {
            const mensagem = currentMode === 'focus'
                ? 'Pausa merecida! Descanse um pouco antes de voltar ao trabalho.'
                : 'Tempo esgotado! Vamos para a próxima atividade.';

            notify({
                title: 'Sessão Concluída',
                message: mensagem
            });
        }
    }, [secondsLeft, currentMode, notify, totalSeconds, isRunning]);

    const start = useCallback(() => {
        hasStartedRef.current = true; // 🆕 Marca que o timer já foi iniciado
        setIsRunning(true);
    }, []);

    const pause = useCallback(() => setIsRunning(false), []);

    const reset = useCallback(() => {
        setSecondsLeft(totalSeconds);
        setIsRunning(false);
    }, [totalSeconds]);

    const switchMode = useCallback((mode: TimerMode) => {
        setCurrentMode(mode);
        setIsRunning(false);
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
