'use client'

import { Settings, BarChart3, Bell, Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { StatsCards } from "@/components/stats-card"
import { TaskList } from "@/components/task-list"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState, useEffect, useCallback } from "react"
import { SettingsModal } from "@/components/settings-modal"
import { useTimer } from "@/hooks/useTimer"
import { useStats } from "@/hooks/useStats"
import { useActiveTask } from "@/hooks/useActiveTask"
import type { TimerMode } from "@/types"

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('timer-section')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id) // ← pega o ID da seção
          }
        })
      },
      { threshold: 0.4 } // ← 40% visível para considerar ativa
    )

    const sections = ['timer-section', 'tasks-section', 'stats-section']

    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [])


  const { recordSession, stats } = useStats()
  const { activeTaskId } = useActiveTask()

  const handleSessionComplete = useCallback(
    (mode: TimerMode, minutes: number) => {
      recordSession(mode, minutes, activeTaskId ?? undefined)
    },
    [recordSession, activeTaskId]
  )

  const timer = useTimer('focus', handleSessionComplete)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Coffee className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">Routines</span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <button
              onClick={() => scrollToSection('timer-section')}
              className={`text-sm font-medium transition-colors ${activeSection === 'timer-section'
                  ? 'text-foreground'           // ← branco/preto quando ativa
                  : 'text-muted-foreground hover:text-foreground' // ← cinza quando inativa
                }`}
            >
              Timer
            </button>
            <button
              onClick={() => scrollToSection('tasks-section')}
              className={`text-sm font-medium transition-colors ${activeSection === 'tasks-section'
                  ? 'text-foreground'           // ← branco/preto quando ativa
                  : 'text-muted-foreground hover:text-foreground' // ← cinza quando inativa
                }`}
            >
              Tarefas
            </button>
            <button
              onClick={() => scrollToSection('stats-section')}
              className={`text-sm font-medium transition-colors ${activeSection === 'stats-section'
                  ? 'text-foreground'           // ← branco/preto quando ativa
                  : 'text-muted-foreground hover:text-foreground' // ← cinza quando inativa
                }`}
            >
              Estatísticas
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <BarChart3 className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-[1fr,380px]">
          {/* Timer Section */}
          <section id="timer-section" className="flex flex-col items-center justify-center scroll-mt-20">
            <PomodoroTimer
              timer={timer}
              focusSessionsToday={stats.focusSessionsToday}
            />
          </section>

          {/* Sidebar */}
          <aside id="tasks-section" className="space-y-6 scroll-mt-20">
            <TaskList />
          </aside>
        </div>

        {/* Stats Section */}
        <section id="stats-section" className="mt-16 scroll-mt-20">
          <h2 className="mb-6 text-lg font-semibold text-foreground">
            Suas Estatísticas
          </h2>
          <StatsCards stats={stats} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-center text-sm text-muted-foreground">
            Mantenha o foco. Uma sessão de cada vez.
          </p>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        isTimerRunning={timer.isRunning}
        onPauseTimer={timer.pause}
      />
    </div>
  )
}
