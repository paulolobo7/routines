'use client'

import { Settings, Coffee, Timer, ListChecks, BarChart3, Clock, Flame, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { StatsCards } from "@/components/stats-card"
import { TaskList } from "@/components/task-list"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState, useEffect, useCallback, useMemo } from "react"
import { SettingsModal } from "@/components/settings-modal"
import { useTimer } from "@/hooks/useTimer"
import { useStats } from "@/hooks/useStats"
import { useActiveTask } from "@/hooks/useActiveTask"
import type { TimerMode } from "@/types"

// Mensagem de boas-vindas baseada na hora do dia
function getGreeting(): { greeting: string; emoji: string } {
  const hour = new Date().getHours()
  if (hour < 6) return { greeting: "Boa madrugada", emoji: "🌙" }
  if (hour < 12) return { greeting: "Bom dia", emoji: "☀️" }
  if (hour < 18) return { greeting: "Boa tarde", emoji: "🌤️" }
  return { greeting: "Boa noite", emoji: "🌙" }
}

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('timer-section')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.4 }
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

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          timer.isRunning ? timer.pause() : timer.start()
          break
        case 'KeyR':
          timer.reset()
          break
        case 'Digit1':
          timer.switchMode('focus')
          break
        case 'Digit2':
          timer.switchMode('shortBreak')
          break
        case 'Digit3':
          timer.switchMode('longBreak')
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [timer])

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

  const { greeting, emoji } = useMemo(() => getGreeting(), [])

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
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              Timer
            </button>
            <button
              onClick={() => scrollToSection('tasks-section')}
              className={`text-sm font-medium transition-colors ${activeSection === 'tasks-section'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              Tarefas
            </button>
            <button
              onClick={() => scrollToSection('stats-section')}
              className={`text-sm font-medium transition-colors ${activeSection === 'stats-section'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              Estatísticas
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
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
      <main className="mx-auto max-w-5xl px-6 py-12 pb-28 md:pb-12">

        {/* ─── Welcome Card ─── */}
        <div className="mb-10 animate-fade-in-up rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Saudação + mensagem */}
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-foreground">
                {greeting}! {emoji}
              </h1>
              <p className="text-sm text-muted-foreground">
                {stats.focusSessionsToday > 0
                  ? `Você completou ${stats.focusSessionsToday} ${stats.focusSessionsToday === 1 ? 'sessão' : 'sessões'} hoje. Continue assim! 🔥`
                  : 'Pronto para a primeira sessão de foco do dia?'
                }
              </p>
            </div>

            {/* Mini stat badges — só aparecem se tiver dados */}
            {stats.focusSessionsToday > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5">
                  <Clock className="h-3.5 w-3.5 text-blue-500" />
                  <span className="text-xs font-medium text-foreground tabular-nums">{stats.focusTimeToday}</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5">
                  <Target className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-xs font-medium text-foreground tabular-nums">{stats.sessionsToday}</span>
                </div>
                {stats.streak > 1 && (
                  <div className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5">
                    <Flame className="h-3.5 w-3.5 text-orange-500" />
                    <span className="text-xs font-medium text-foreground tabular-nums">{stats.streak}d</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Atalhos de teclado — desktop only */}
          <div className="mt-4 hidden items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground md:flex">
            <span className="flex items-center gap-1.5">
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">espaço</kbd>
              Play/Pause
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">R</kbd>
              Reset
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">1</kbd>
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">2</kbd>
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">3</kbd>
              Trocar modo
            </span>
          </div>
        </div>

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
          <h2 className="mb-6 text-lg font-semibold text-foreground animate-fade-in">
            Suas Estatísticas
          </h2>
          <StatsCards stats={stats} />
        </section>
      </main>

      {/* Footer — desktop only */}
      <footer className="hidden border-t border-border py-8 md:block">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-center text-sm text-muted-foreground">
            Mantenha o foco. Uma sessão de cada vez.
          </p>
        </div>
      </footer>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-background/90 backdrop-blur-md md:hidden">
        <div className="flex items-center justify-around py-2">
          <button
            onClick={() => scrollToSection('timer-section')}
            className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
              activeSection === 'timer-section' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Timer className="h-5 w-5" />
            <span className="text-[10px] font-medium">Timer</span>
          </button>
          <button
            onClick={() => scrollToSection('tasks-section')}
            className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
              activeSection === 'tasks-section' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <ListChecks className="h-5 w-5" />
            <span className="text-[10px] font-medium">Tarefas</span>
          </button>
          <button
            onClick={() => scrollToSection('stats-section')}
            className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
              activeSection === 'stats-section' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            <span className="text-[10px] font-medium">Stats</span>
          </button>
        </div>
      </nav>

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
