"use client"

import { useEffect, useMemo, useState } from "react"
import { AlertCircle, RotateCcw, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TIMER_DURATION_LIMITS, useSettings } from "@/hooks/useSettings"

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isTimerRunning?: boolean
  onPauseTimer?: () => void
}

interface DurationField {
  id: "focus" | "shortBreak" | "longBreak"
  label: string
  description: string
  value: number
  onChange: (value: number) => void
}

function normalizeDuration(value: number): number {
  if (!Number.isFinite(value)) return TIMER_DURATION_LIMITS.min
  return Math.min(TIMER_DURATION_LIMITS.max, Math.max(TIMER_DURATION_LIMITS.min, Math.round(value)))
}

export function SettingsModal({
  open,
  onOpenChange,
  isTimerRunning = false,
  onPauseTimer,
}: SettingsModalProps) {
  const {
    settings,
    updateFocusDuration,
    updateShortBreakDuration,
    updateLongBreakDuration,
    resetToDefaults,
  } = useSettings()

  const [localFocus, setLocalFocus] = useState(settings.focusDuration)
  const [localShortBreak, setLocalShortBreak] = useState(settings.shortBreakDuration)
  const [localLongBreak, setLocalLongBreak] = useState(settings.longBreakDuration)

  useEffect(() => {
    if (!open) return
    setLocalFocus(settings.focusDuration)
    setLocalShortBreak(settings.shortBreakDuration)
    setLocalLongBreak(settings.longBreakDuration)
  }, [open, settings.focusDuration, settings.longBreakDuration, settings.shortBreakDuration])

  const fields: DurationField[] = useMemo(
    () => [
      {
        id: "focus",
        label: "Foco",
        description: "Tempo da sessao principal.",
        value: localFocus,
        onChange: setLocalFocus,
      },
      {
        id: "shortBreak",
        label: "Pausa curta",
        description: "Intervalo entre ciclos de foco.",
        value: localShortBreak,
        onChange: setLocalShortBreak,
      },
      {
        id: "longBreak",
        label: "Pausa longa",
        description: "Descanso apos quatro sessoes.",
        value: localLongBreak,
        onChange: setLocalLongBreak,
      },
    ],
    [localFocus, localLongBreak, localShortBreak]
  )

  const hasChanges =
    localFocus !== settings.focusDuration ||
    localShortBreak !== settings.shortBreakDuration ||
    localLongBreak !== settings.longBreakDuration

  const handleSave = () => {
    if (isTimerRunning && hasChanges) {
      onPauseTimer?.()
    }

    updateFocusDuration(localFocus)
    updateShortBreakDuration(localShortBreak)
    updateLongBreakDuration(localLongBreak)
    onOpenChange(false)
  }

  const handleReset = () => {
    if (isTimerRunning) {
      onPauseTimer?.()
    }

    resetToDefaults()
    setLocalFocus(25)
    setLocalShortBreak(5)
    setLocalLongBreak(15)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Configuracoes do temporizador</DialogTitle>
          <DialogDescription>
            Ajuste duracoes entre {TIMER_DURATION_LIMITS.min} e {TIMER_DURATION_LIMITS.max} minutos. As alteracoes preservam seus dados salvos.
          </DialogDescription>
        </DialogHeader>

        {isTimerRunning && hasChanges && (
          <div className="flex gap-3 rounded-lg border border-warning/35 bg-warning/15 p-3 text-sm text-warning-foreground">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
            <p>
              Salvar novas duracoes pausara o timer atual para evitar uma mudanca inesperada no ciclo em andamento.
            </p>
          </div>
        )}

        <div className="grid gap-4">
          {fields.map((field) => {
            const inputId = `${field.id}-duration`
            const descriptionId = `${field.id}-duration-description`

            return (
              <div key={field.id} className="rounded-lg border border-border/70 bg-surface p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Label htmlFor={inputId} className="text-sm font-semibold">
                      {field.label}
                    </Label>
                    <p id={descriptionId} className="mt-1 text-sm text-muted-foreground">
                      {field.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      id={inputId}
                      type="number"
                      inputMode="numeric"
                      min={TIMER_DURATION_LIMITS.min}
                      max={TIMER_DURATION_LIMITS.max}
                      value={field.value}
                      onChange={(event) => field.onChange(normalizeDuration(Number(event.target.value)))}
                      aria-describedby={descriptionId}
                      className="h-11 w-24 text-center font-semibold tabular-nums"
                    />
                    <span className="text-sm text-muted-foreground">min</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Padroes
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="h-4 w-4" aria-hidden="true" />
            {isTimerRunning && hasChanges ? "Salvar e pausar" : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
