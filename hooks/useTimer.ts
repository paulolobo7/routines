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

    // Flag para saber se o timer já foi iniciado pelo menos uma vez
    // Isso evita que a notificação dispare quando a página carrega
    const hasStartedRef = useRef(false);

    // Guard para evitar gravar a mesma sessão mais de uma vez
    const hasCompletedRef = useRef(false);

    // Ref para o callback, evita re-renders desnecessários
    const onCompleteRef = useRef(onComplete);
    useEffect(() => { onCompleteRef.current = onComplete; });

    const { settings } = useSettings();

    // Calcula o total de segundos baseado no modo atual e nos settings
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
        hasCompletedRef.current = false;
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

    // Notificação e gravação da sessão quando o timer chega a zero
    const { notify } = useNotification();

    useEffect(() => {
        // Só executa se o timer já foi iniciado pelo menos uma vez
        if (!hasStartedRef.current) return;
        // Evita gravar a mesma sessão duas vezes
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

            // Grava a sessão completada via callback
            onCompleteRef.current?.(currentMode, totalSeconds / 60);
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
