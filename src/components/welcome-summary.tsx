"use client"

import { Clock, Flame, Target, TrendingUp } from "lucide-react"
import type { StatsData } from "@/hooks/useStats"

interface WelcomeSummaryProps {
  greeting: string
  stats: StatsData
}

export function WelcomeSummary({ greeting, stats }: WelcomeSummaryProps) {
  const hasFocusToday = stats.focusSessionsToday > 0
  const message = hasFocusToday
    ? "Seu ritmo de hoje ja esta registrado. Escolha uma tarefa e avance a proxima sessao com calma."
    : "Escolha uma tarefa, prepare o ambiente e comece uma sessao de foco sem pressa."

  const summaryItems = [
    {
      label: "Foco hoje",
      value: stats.focusTimeToday,
      icon: Clock,
    },
    {
      label: "Sessoes",
      value: stats.focusSessionsToday,
      icon: Target,
    },
    {
      label: "Sequencia",
      value: `${stats.streak}d`,
      icon: Flame,
    },
    {
      label: "Media",
      value: stats.averagePerDay,
      icon: TrendingUp,
    },
  ]

  return (
    <section
      className="animate-fade-in-up rounded-xl border border-border/70 bg-surface-elevated/80 p-4 shadow-[var(--shadow-soft)] sm:p-5"
      aria-labelledby="welcome-title"
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-primary">
            Painel de hoje
          </p>
          <h1 id="welcome-title" className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
            {greeting}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {message}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[32rem]">
          {summaryItems.map((item) => {
            const Icon = item.icon

            return (
              <div key={item.label} className="rounded-lg border border-border/70 bg-surface p-3">
                <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  {item.label}
                </dt>
                <dd className="mt-2 text-lg font-semibold text-foreground tabular-nums">
                  {item.value}
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
