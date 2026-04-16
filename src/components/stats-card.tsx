"use client"

import { Clock, Target, Flame, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { StatsData } from "@/hooks/useStats"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

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

function useChartColors() {
  const { resolvedTheme } = useTheme()
  const [colors, setColors] = useState({
    bar: '#c7c7d4',
    barActive: '#6366f1',
  })

  useEffect(() => {
    const resolveCssVar = (varName: string): string => {
      const el = document.createElement('div')
      el.style.backgroundColor = `var(${varName})`
      el.style.position = 'absolute'
      el.style.visibility = 'hidden'
      document.body.appendChild(el)
      const color = getComputedStyle(el).backgroundColor
      document.body.removeChild(el)
      if (!color || color === 'rgba(0, 0, 0, 0)') return ''
      return color
    }

    const bar = resolveCssVar('--chart-bar')
    const barActive = resolveCssVar('--chart-bar-active')

    setColors({
      bar: bar || (resolvedTheme === 'dark' ? '#3d3d55' : '#c7c7d4'),
      barActive: barActive || '#6366f1',
    })
  }, [resolvedTheme])

  return colors
}

export function StatsCards({ stats }: StatsCardsProps) {
  const values: Record<string, string | number> = {
    focusTimeToday: stats.focusTimeToday,
    sessionsToday: stats.sessionsToday,
    streak: stats.streak,
    averagePerDay: stats.averagePerDay,
  }

  const chartColors = useChartColors()

  return (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CARD_CONFIG.map((card, index) => (
          <Card
            key={card.label}
            className={`border-none bg-card shadow-sm hover:shadow-md transition-shadow animate-fade-in-up ${
              index === 0 ? 'animation-delay-100' :
              index === 1 ? 'animation-delay-200' :
              index === 2 ? 'animation-delay-300' : 'animation-delay-400'
            }`}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground tabular-nums">
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
        <Card className="border-none bg-card shadow-sm animate-fade-in-up animation-delay-400">
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
                  tick={{ fontSize: 12, fill: 'currentColor' }}
                  className="text-muted-foreground"
                />
                <YAxis hide />
                <Tooltip
                  formatter={(value: number) => [
                    value < 60 ? `${value}m` : `${Math.floor(value / 60)}h${value % 60 > 0 ? ` ${value % 60}m` : ''}`,
                    'Foco'
                  ]}
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    fontSize: '13px',
                  }}
                />
                <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
                  {stats.last7Days.map((_entry, index) => (
                    <Cell
                      key={index}
                      fill={index === 6 ? chartColors.barActive : chartColors.bar}
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
