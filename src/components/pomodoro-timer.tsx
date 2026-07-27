"use client"

import { CheckCircle2, Pause, Play, RotateCcw, TimerReset } from "lucide-react"
import { useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { TIMER_MODES } from "@/lib/constants"
import type { UseTimerReturn } from "@/hooks/useTimer"
import { cn } from "@/lib/utils"

interface PomodoroTimerProps {
  timer: UseTimerReturn
  focusSessionsToday?: number
  activeTaskTitle?: string | null
}

function formatDisplayTime(secondsLeft: number): string {
  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

function formatAccessibleMinutes(secondsLeft: number): string {
  const minutes = Math.max(0, Math.ceil(secondsLeft / 60))
  return `${minutes} ${minutes === 1 ? "minuto restante" : "minutos restantes"}`
}

export function PomodoroTimer({
  timer,
  focusSessionsToday = 0,
  activeTaskTitle,
}: PomodoroTimerProps) {
  const {
    secondsLeft,
    isRunning,
    currentMode,
    start,
    pause,
    reset,
    switchMode,
    progressPercentage,
  } = timer

  const modeConfig = TIMER_MODES.find((mode) => mode.id === currentMode)
  const modeLabel = modeConfig?.label ?? "Timer"
  const isBreak = currentMode !== "focus"
  const displayTime = formatDisplayTime(secondsLeft)
  const completedInCycle = focusSessionsToday % 4
  const circumference = 2 * Math.PI * 144
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference

  const accessibleTimerLabel = useMemo(
    () =>
      `${formatAccessibleMinutes(secondsLeft)} em ${modeLabel}. Timer ${
        isRunning ? "em andamento" : "pausado"
      }.`,
    [isRunning, modeLabel, secondsLeft]
  )

  useEffect(() => {
    if (isRunning || secondsLeft < timer.totalSeconds) {
      document.title = `${displayTime} - ${modeLabel} | Routines`
    } else {
      document.title = "Routines - Timer Pomodoro e organizacao de tarefas"
    }

    return () => {
      document.title = "Routines - Timer Pomodoro e organizacao de tarefas"
    }
  }, [displayTime, isRunning, modeLabel, secondsLeft, timer.totalSeconds])

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/75 bg-surface-elevated p-4 shadow-[var(--shadow-elevated)] sm:p-6 lg:min-h-[41rem]",
        isRunning && (isBreak ? "shadow-[var(--shadow-break)]" : "shadow-[var(--shadow-focus)]")
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-1",
          isBreak ? "bg-break" : "bg-focus"
        )}
        aria-hidden="true"
      />

      <div className="flex flex-col items-center gap-6">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-primary" id="timer-title">
              Timer Pomodoro
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-foreground">
              {modeLabel}
            </h2>
          </div>
          <div
            className={cn(
              "inline-flex w-full min-w-0 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-center text-xs font-semibold sm:w-fit sm:justify-start",
              isBreak
                ? "border-break/25 bg-break-soft text-break"
                : "border-focus/25 bg-focus-soft text-focus"
            )}
          >
            <span className={cn("h-2 w-2 rounded-full", isBreak ? "bg-break" : "bg-focus")} aria-hidden="true" />
            {isRunning ? "Em andamento" : "Pronto para iniciar"}
          </div>
        </div>

        <div
          className="grid w-full grid-cols-1 gap-2 rounded-lg border border-border/70 bg-surface-muted p-1 sm:grid-cols-3"
          role="group"
          aria-label="Selecionar modo do timer"
        >
          {TIMER_MODES.map((mode) => {
            const isActive = currentMode === mode.id
            const modeIsBreak = mode.id !== "focus"

            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => switchMode(mode.id)}
                aria-pressed={isActive}
                className={cn(
                  "min-h-11 min-w-0 rounded-md px-3 py-2 text-center text-sm leading-tight font-semibold whitespace-normal transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? modeIsBreak
                      ? "bg-break text-break-foreground shadow-sm"
                      : "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-card hover:text-foreground"
                )}
              >
                {mode.label}
              </button>
            )
          })}
        </div>

        <div className="relative aspect-square w-full max-w-[21rem] sm:max-w-[24rem]">
          <svg
            viewBox="0 0 340 340"
            className={cn(
              "h-full w-full -rotate-90 transition-[filter] duration-300",
              isRunning && (isBreak ? "timer-glow-break" : "timer-glow-focus")
            )}
            role="img"
            aria-label={`Progresso da sessao: ${Math.round(progressPercentage)}% concluido`}
          >
            <circle
              cx="170"
              cy="170"
              r="144"
              fill="none"
              stroke="currentColor"
              strokeWidth="14"
              className="text-muted"
            />
            <circle
              cx="170"
              cy="170"
              r="144"
              fill="none"
              stroke="currentColor"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={isBreak ? "text-break" : "text-primary"}
              style={{ transition: "stroke-dashoffset 600ms var(--ease-standard)" }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <span
              className="text-[clamp(3.8rem,19vw,6.5rem)] font-semibold leading-none text-foreground tabular-nums"
              aria-hidden="true"
            >
              {displayTime}
            </span>
            <span className="mt-4 text-sm font-semibold text-muted-foreground">
              {Math.round(progressPercentage)}% concluido
            </span>
            <span className="sr-only" aria-live="polite">
              {accessibleTimerLabel}
            </span>
          </div>
        </div>

        <div className="grid w-full gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={reset}
            className="min-h-12 min-w-0 rounded-lg border-border/80 bg-background/70 whitespace-normal active:scale-[0.98] sm:justify-self-end"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reiniciar
          </Button>

          <Button
            type="button"
            size="lg"
            onClick={() => (isRunning ? pause() : start())}
            className={cn(
              "min-h-14 min-w-0 rounded-lg px-7 text-base font-semibold whitespace-normal shadow-[var(--shadow-soft)] active:scale-[0.98]",
              isBreak
                ? "bg-break text-break-foreground hover:bg-break/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            aria-label={isRunning ? "Pausar timer" : "Iniciar timer"}
          >
            {isRunning ? (
              <Pause className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Play className="h-5 w-5" aria-hidden="true" />
            )}
            {isRunning ? "Pausar" : "Iniciar"}
          </Button>

          <div className="flex items-center justify-center gap-2 rounded-lg border border-border/70 bg-surface p-3 sm:justify-self-start">
            <TimerReset className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span className="text-sm font-medium text-muted-foreground">
              Ciclo
            </span>
            <div className="flex items-center gap-1" aria-label={`${completedInCycle} de 4 sessoes de foco concluidas no ciclo atual`}>
              {[1, 2, 3, 4].map((index) => (
                <span
                  key={index}
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    index <= completedInCycle ? "bg-primary" : "bg-muted"
                  )}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="w-full rounded-lg border border-border/70 bg-surface p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2
              className={cn("mt-0.5 h-5 w-5", activeTaskTitle ? "text-success" : "text-muted-foreground")}
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Tarefa em foco
              </p>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {activeTaskTitle ?? "Selecione uma tarefa para vincular a proxima sessao."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
