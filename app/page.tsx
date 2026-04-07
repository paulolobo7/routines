'use client'
import { Settings, BarChart3, Bell, Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { StatsCards } from "@/components/stats-card"
import { TaskList } from "@/components/task-list"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState } from "react"
import { SettingsModal } from "@/components/settings-modal"
import { useTimer } from "@/hooks/useTimer"

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const timer = useTimer('focus')

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
            <a href="#" className="text-sm font-medium text-foreground">
              Timer
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Tarefas
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Relatórios
            </a>
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
          <section className="flex flex-col items-center justify-center">
            <PomodoroTimer 
              timer={timer}
            />
          </section>

          {/* Sidebar */}
          <aside className="space-y-6">
            <TaskList />
          </aside>
        </div>

        {/* Stats Section */}
        <section className="mt-16">
          <h2 className="mb-6 text-lg font-semibold text-foreground">
            Suas Estatísticas
          </h2>
          <StatsCards />
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

      {/* ✅ Settings Modal movido para cá com props do timer */}
      <SettingsModal 
        open={isSettingsOpen} 
        onOpenChange={setIsSettingsOpen}
        isTimerRunning={timer.isRunning}
        onPauseTimer={timer.pause}
      />
    </div>
  )
}