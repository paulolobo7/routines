import { Clock, Target, Flame, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    icon: Clock,
    label: "Tempo Focado",
    value: "4h 25m",
    sublabel: "hoje",
  },
  {
    icon: Target,
    label: "Sessões",
    value: "8",
    sublabel: "completadas",
  },
  {
    icon: Flame,
    label: "Sequência",
    value: "12",
    sublabel: "dias",
  },
  {
    icon: TrendingUp,
    label: "Média",
    value: "3h 45m",
    sublabel: "por dia",
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-none bg-card shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
              </div>
              <div className="rounded-lg bg-muted p-2">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
