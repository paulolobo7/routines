"use client"

import { useState } from "react"
import { Play, Pause, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

const modes = [
  { id: "focus", label: "Foco", time: 25, color: "bg-primary" },
  { id: "short", label: "Pausa Curta", time: 5, color: "bg-accent" },
  { id: "long", label: "Pausa Longa", time: 15, color: "bg-accent" },
]

export function PomodoroTimer() {
  const [activeMode, setActiveMode] = useState("focus")
  const [isRunning, setIsRunning] = useState(false)

  const currentMode = modes.find((m) => m.id === activeMode) || modes[0]
  const minutes = currentMode.time
  const progress = 75 // Visual progress para demonstração

  const circumference = 2 * Math.PI * 140
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Mode Selector */}
      <div className="flex gap-2 rounded-full bg-muted p-1.5">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setActiveMode(mode.id)}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
              activeMode === mode.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div className="relative">
        <svg width="320" height="320" className="rotate-[-90deg]">
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
            className={activeMode === "focus" ? "text-primary" : "text-accent"}
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>

        {/* Timer Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-sans text-7xl font-light tracking-tight text-foreground">
            {String(minutes).padStart(2, "0")}:00
          </span>
          <span className="mt-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            {currentMode.label}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full border-2"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>

        <Button
          size="lg"
          onClick={() => setIsRunning(!isRunning)}
          className={`h-16 w-16 rounded-full shadow-lg ${
            activeMode === "focus"
              ? "bg-primary hover:bg-primary/90"
              : "bg-accent hover:bg-accent/90"
          }`}
        >
          {isRunning ? (
            <Pause className="h-6 w-6 text-primary-foreground" />
          ) : (
            <Play className="h-6 w-6 translate-x-0.5 text-primary-foreground" />
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full border-2 opacity-0"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>

      {/* Session Counter */}
      <div className="flex items-center gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-3 w-3 rounded-full transition-colors ${
              i <= 2 ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-muted-foreground">2 de 4 sessões</span>
      </div>
    </div>
  )
}
