"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { StatsCards } from "@/components/stats-card"
import { TaskList } from "@/components/task-list"
import { SettingsModal } from "@/components/settings-modal"
import { DashboardHeader } from "@/components/dashboard-header"
import { MobileNavigation } from "@/components/mobile-navigation"
import { WelcomeSummary } from "@/components/welcome-summary"
import { useTimer } from "@/hooks/useTimer"
import { useStats } from "@/hooks/useStats"
import { useActiveTask } from "@/hooks/useActiveTask"
import { useNotification } from "@/hooks/useNotification"
import { useStorage } from "@/hooks/useStorage"
import { LOCAL_STORAGE_KEYS } from "@/lib/constants"
import type { Task, TimerMode } from "@/types"

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 6) return "Boa madrugada"
  if (hour < 12) return "Bom dia"
  if (hour < 18) return "Boa tarde"
  return "Boa noite"
}

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("timer-section")
  const [tasks] = useStorage<Task[]>({
    key: LOCAL_STORAGE_KEYS.tasks,
    initialValue: [],
  })

  const { recordSession, stats } = useStats()
  const { activeTaskId } = useActiveTask()
  const { requestPermission } = useNotification()

  const handleSessionComplete = useCallback(
    (mode: TimerMode, minutes: number) => {
      recordSession(mode, minutes, activeTaskId ?? undefined)
    },
    [recordSession, activeTaskId]
  )

  const timer = useTimer("focus", handleSessionComplete)

  useEffect(() => {
    void requestPermission()
  }, [requestPermission])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visibleEntry?.target.id) {
          setActiveSection(visibleEntry.target.id)
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.2, 0.45, 0.7] }
    )

    const sectionIds = ["timer-section", "tasks-section", "stats-section"]
    sectionIds.forEach((sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const { isRunning, start, pause, reset, switchMode } = timer

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        Boolean(target?.isContentEditable)

      if (isTyping) return

      switch (event.code) {
        case "Space":
          event.preventDefault()
          if (isRunning) {
            pause()
          } else {
            start()
          }
          break
        case "KeyR":
          event.preventDefault()
          reset()
          break
        case "Digit1":
          switchMode("focus")
          break
        case "Digit2":
          switchMode("shortBreak")
          break
        case "Digit3":
          switchMode("longBreak")
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isRunning, pause, reset, start, switchMode])

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (!element) return

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    })
  }, [])

  const greeting = useMemo(() => getGreeting(), [])
  const activeTask = useMemo(
    () => tasks?.find((task) => task.id === activeTaskId) ?? null,
    [activeTaskId, tasks]
  )

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader
        activeSection={activeSection}
        currentMode={timer.currentMode}
        isRunning={timer.isRunning}
        onNavigate={scrollToSection}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 pb-28 sm:px-6 sm:py-8 md:pb-12 lg:px-8">
        <WelcomeSummary greeting={greeting} stats={stats} />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(21rem,25rem)] lg:items-start">
          <section id="timer-section" className="scroll-mt-24" aria-labelledby="timer-title">
            <PomodoroTimer
              timer={timer}
              focusSessionsToday={stats.focusSessionsToday}
              activeTaskTitle={activeTask?.title ?? null}
            />
          </section>

          <section id="tasks-section" className="scroll-mt-24" aria-labelledby="tasks-title">
            <TaskList />
          </section>
        </div>

        <section id="stats-section" className="scroll-mt-24" aria-labelledby="stats-title">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase text-primary">
                Leitura rapida
              </p>
              <h2 id="stats-title" className="mt-1 text-xl font-semibold text-foreground">
                Estatisticas de foco
              </h2>
            </div>
          </div>
          <StatsCards stats={stats} />
        </section>
      </main>

      <footer className="hidden border-t border-border/70 py-8 md:block">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-sm text-muted-foreground">
            Uma rotina clara, uma sessao por vez.
          </p>
        </div>
      </footer>

      <MobileNavigation activeSection={activeSection} onNavigate={scrollToSection} />

      <SettingsModal
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        isTimerRunning={timer.isRunning}
        onPauseTimer={timer.pause}
      />
    </div>
  )
}
