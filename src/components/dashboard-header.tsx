"use client"

import { BarChart3, Coffee, ListChecks, Settings, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { TIMER_MODES } from "@/lib/constants"
import type { TimerMode } from "@/types"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
  activeSection: string
  currentMode: TimerMode
  isRunning: boolean
  onNavigate: (sectionId: string) => void
  onOpenSettings: () => void
}

const NAV_ITEMS = [
  { id: "timer-section", label: "Timer", icon: Timer },
  { id: "tasks-section", label: "Tarefas", icon: ListChecks },
  { id: "stats-section", label: "Estatisticas", icon: BarChart3 },
] as const

export function DashboardHeader({
  activeSection,
  currentMode,
  isRunning,
  onNavigate,
  onOpenSettings,
}: DashboardHeaderProps) {
  const modeLabel = TIMER_MODES.find((mode) => mode.id === currentMode)?.label ?? "Timer"
  const isBreak = currentMode !== "focus"

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/82 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => onNavigate("timer-section")}
          className="group flex min-w-0 items-center gap-3 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Ir para o timer do Routines"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[var(--shadow-soft)] transition-transform duration-200 group-active:scale-95">
            <Coffee className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-base font-semibold leading-tight text-foreground sm:text-lg">
              Routines
            </span>
            <span className="hidden text-xs font-medium text-muted-foreground sm:block">
              Central de foco
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 rounded-lg border border-border/70 bg-surface-muted/70 p-1 md:flex" aria-label="Secoes principais">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <div
            className={cn(
              "hidden h-9 items-center gap-2 rounded-lg border px-3 text-xs font-medium sm:flex",
              isBreak
                ? "border-break/25 bg-break-soft text-break"
                : "border-focus/25 bg-focus-soft text-focus"
            )}
            aria-label={`Sessao atual: ${modeLabel}${isRunning ? ", em andamento" : ", pausada"}`}
          >
            <span className={cn("h-2 w-2 rounded-full", isBreak ? "bg-break" : "bg-focus")} aria-hidden="true" />
            <span>{modeLabel}</span>
            <span className="text-muted-foreground">{isRunning ? "ativo" : "pausado"}</span>
          </div>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={onOpenSettings}
            aria-label="Abrir configuracoes do temporizador"
          >
            <Settings className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  )
}
