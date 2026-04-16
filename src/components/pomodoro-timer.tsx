"use client"

import { Play, Pause, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TIMER_MODES } from "@/lib/constants"
import type { UseTimerReturn } from "@/hooks/useTimer"
import { useEffect } from "react"

interface PomodoroTimerProps {
  timer: UseTimerReturn
  focusSessionsToday?: number
}


export function PomodoroTimer({ timer, focusSessionsToday = 0 }: PomodoroTimerProps) {
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

  const modeConfig = TIMER_MODES.find(mode => mode.id === currentMode)
  const remainder = focusSessionsToday % 4
  const currentCycleSession = (remainder === 0 && focusSessionsToday > 0) ? 4 : remainder
  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const progress = progressPercentage

  const circumference = 2 * Math.PI * 140
  const strokeDashoffset = circumference - (progress / 100) * circumference

  useEffect(() => {
    if (isRunning || secondsLeft < (timer.totalSeconds)) {
      const timeStr = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      const modeLabel = modeConfig?.label || "Timer"
      document.title = `${timeStr} — ${modeLabel} | Routines`
    } else {
      document.title = "Routines — Timer Pomodoro & Organização de Tarefas"
    }

    return () => {
      document.title = "Routines — Timer Pomodoro & Organização de Tarefas"
    }
  }, [secondsLeft, isRunning, minutes, seconds, modeConfig, timer.totalSeconds])

  return (
    <div className="flex flex-col items-center gap-8 animate-fade-in-up">
      {/* Mode Selector */}
      <div className="flex gap-2 rounded-full bg-muted p-1.5">
        {TIMER_MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => switchMode(mode.id)}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
              currentMode === mode.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Timer Circle — glow pulsa quando o timer está rodando */}
      <div className="relative w-[min(320px,80vw)]">
        <svg
          viewBox="0 0 320 320"
          width="100%"
          height="100%"
          className={`rotate-[-90deg] transition-all duration-300 ${
            isRunning
              ? currentMode === "focus"
                ? "timer-glow-focus"
                : "timer-glow-break"
              : ""
          }`}
        >
          {/* Background circle */}
          <circle
            cx="160"
            cy="160"
            r="140"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted"
          />
          {/* Progress circle */}
          <circle
            cx="160"
            cy="160"
            r="140"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={currentMode === "focus" ? "text-primary" : "text-break"}
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>

        {/* Timer Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-sans text-7xl font-light tracking-tight text-foreground tabular-nums">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
          <span className="mt-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            {modeConfig?.label || currentMode}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => reset()}
          className="h-12 w-12 rounded-full border-2 transition-transform duration-150 active:scale-90"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>

        <Button
          size="lg"
          onClick={() => isRunning ? pause() : start()}
          className={`h-16 w-16 rounded-full shadow-lg transition-transform duration-150 active:scale-90 ${
            currentMode === "focus"
              ? "bg-primary hover:bg-primary/90"
              : "bg-break hover:bg-break/90"
          }`}
        >
          {isRunning ? (
            <Pause className={`h-6 w-6 ${currentMode === "focus" ? "text-primary-foreground" : "text-break-foreground"}`} />
          ) : (
            <Play className={`h-6 w-6 translate-x-0.5 ${currentMode === "focus" ? "text-primary-foreground" : "text-break-foreground"}`} />
          )}
        </Button>

      </div>

      {/* Session Counter */}
      <div className="flex items-center gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-3 w-3 rounded-full transition-colors duration-300 ${
              i <= currentCycleSession ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {currentCycleSession} de 4 sessões
        </span>
      </div>
    </div>
  )
}
