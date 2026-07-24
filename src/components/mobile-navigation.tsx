"use client"

import { BarChart3, ListChecks, Timer } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileNavigationProps {
  activeSection: string
  onNavigate: (sectionId: string) => void
}

const ITEMS = [
  { id: "timer-section", label: "Timer", icon: Timer },
  { id: "tasks-section", label: "Tarefas", icon: ListChecks },
  { id: "stats-section", label: "Dados", icon: BarChart3 },
] as const

export function MobileNavigation({ activeSection, onNavigate }: MobileNavigationProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/92 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden"
      aria-label="Navegacao principal"
    >
      <div className="mx-auto grid max-w-sm grid-cols-3 gap-2">
        {ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-xs font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
