"use client"

import { Clock, Target, Flame, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { StatsData } from "@/hooks/useStats"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"


interface StatsCardsProps {
  stats: StatsData
}

const CARD_CONFIG = [
  {
    icon: Clock,
    label: "Tempo Focado",
    key: "focusTimeToday" as const,
    sublabel: "hoje",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
  },
  {
    icon: Target,
    label: "Sessões",
    key: "sessionsToday" as const,
    sublabel: "completadas",
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
  },
  {
    icon: Flame,
    label: "Sequência",
    key: "streak" as const,
    sublabel: "dias",
    iconColor: "text-orange-500",
    iconBg: "bg-orange-500/10",
  },
  {
    icon: TrendingUp,
    label: "Média",
    key: "averagePerDay" as const,
    sublabel: "por dia",
    iconColor: "text-violet-500",
    iconBg: "bg-violet-500/10",
  },
]

export function StatsCards({ stats }: StatsCardsProps) {
  const values: Record<string, string | number> = {
    focusTimeToday: stats.focusTimeToday,
    sessionsToday: stats.sessionsToday,
    streak: stats.streak,
    averagePerDay: stats.averagePerDay,
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CARD_CONFIG.map((card) => (
          <Card key={card.label} className="border-none bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">
                    {values[card.key]}
                  </p>
                  <p className="text-xs text-muted-foreground">{card.sublabel}</p>
                </div>
                <div className={`rounded-lg p-2 ${card.iconBg}`}>
                  <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6">
        <Card className="border-none bg-card shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-foreground mb-4">
              Foco nos últimos 7 dias
            </p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={stats.last7Days} barSize={28}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis hide />
                <Tooltip
                  formatter={(value: number) => [
                    value < 60 ? `${value}m` : `${Math.floor(value / 60)}h${value % 60 > 0 ? ` ${value % 60}m` : ''}`,
                    'Foco'
                  ]}
                  cursor={{ fill: 'transparent' }}
                />
                <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
                  {stats.last7Days.map((entry, index) => (
                    <Cell
                      key={index}
                      // Destaca o dia atual (último item)
                      fill={index === 6 ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
