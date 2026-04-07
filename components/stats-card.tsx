"use client"

import { Clock, Target, Flame, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { StatsData } from "@/hooks/useStats"

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
  )
}
