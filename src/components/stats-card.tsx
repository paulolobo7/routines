"use client"

import { BarChart3, Clock, Flame, Target, TrendingUp } from "lucide-react"
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import type { StatsData } from "@/hooks/useStats"

interface StatsCardsProps {
  stats: StatsData
}

const CARD_CONFIG = [
  {
    icon: Clock,
    label: "Tempo focado",
    key: "focusTimeToday" as const,
    sublabel: "registrado hoje",
    tone: "text-primary",
    bg: "bg-focus-soft",
  },
  {
    icon: Target,
    label: "Sessoes",
    key: "sessionsToday" as const,
    sublabel: "concluidas hoje",
    tone: "text-success",
    bg: "bg-break-soft",
  },
  {
    icon: Flame,
    label: "Sequencia",
    key: "streak" as const,
    sublabel: "dias com foco",
    tone: "text-warning",
    bg: "bg-warning/15",
  },
  {
    icon: TrendingUp,
    label: "Media diaria",
    key: "averagePerDay" as const,
    sublabel: "por dia ativo",
    tone: "text-chart-3",
    bg: "bg-accent",
  },
]

const ANIMATION_DELAYS = [
  "animation-delay-100",
  "animation-delay-200",
  "animation-delay-300",
  "animation-delay-400",
] as const

function formatTooltipMinutes(value: number): string {
  if (value < 60) return `${value}m`
  const hours = Math.floor(value / 60)
  const minutes = value % 60
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
}

export function StatsCards({ stats }: StatsCardsProps) {
  const values: Record<string, string | number> = {
    focusTimeToday: stats.focusTimeToday,
    sessionsToday: stats.sessionsToday,
    streak: stats.streak,
    averagePerDay: stats.averagePerDay,
  }

  const hasChartData = stats.last7Days.some((day) => day.minutes > 0)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CARD_CONFIG.map((card, index) => {
          const Icon = card.icon

          return (
            <Card
              key={card.label}
              className={`animate-fade-in-up border-border/70 bg-surface-elevated py-0 shadow-[var(--shadow-soft)] ${ANIMATION_DELAYS[index]}`}
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                    <p className="mt-2 text-3xl font-semibold leading-none text-foreground tabular-nums">
                      {values[card.key]}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">{card.sublabel}</p>
                  </div>
                  <div className={`rounded-lg p-2.5 ${card.bg}`}>
                    <Icon className={`h-5 w-5 ${card.tone}`} aria-hidden="true" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="animate-fade-in-up border-border/70 bg-surface-elevated py-0 shadow-[var(--shadow-soft)] animation-delay-400">
        <CardContent className="p-4 sm:p-5">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                <BarChart3 className="h-4 w-4 text-primary" aria-hidden="true" />
                Ultimos 7 dias
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Minutos de foco por dia
              </p>
            </div>
            {!hasChartData && (
              <span className="rounded-lg border border-border/70 bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground">
                Sem sessoes registradas
              </span>
            )}
          </div>

          <div className="h-56 w-full" aria-label="Grafico de foco dos ultimos sete dias">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.last7Days} margin={{ top: 10, right: 6, left: -24, bottom: 0 }}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  width={36}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                />
                <Tooltip
                  formatter={(value: number) => [formatTooltipMinutes(value), "Foco"]}
                  cursor={{ fill: "var(--surface-muted)" }}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-control)",
                    boxShadow: "var(--shadow-soft)",
                    color: "var(--popover-foreground)",
                    fontSize: "13px",
                  }}
                  labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
                />
                <Bar dataKey="minutes" radius={[8, 8, 3, 3]} barSize={32} minPointSize={hasChartData ? 0 : 4}>
                  {stats.last7Days.map((entry, index) => (
                    <Cell
                      key={entry.day}
                      fill={index === stats.last7Days.length - 1 ? "var(--chart-bar-active)" : "var(--chart-bar)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
