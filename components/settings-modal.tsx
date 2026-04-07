'use client'

import { useEffect, useState } from "react"
import { useSettings } from "@/hooks/useSettings"
import { 
    Dialog, 
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DialogDescription } from "@radix-ui/react-dialog"
import { AlertCircle } from "lucide-react"

interface SettingsModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    isTimerRunning?: boolean
    onPauseTimer?: () => void
}

export function SettingsModal({ open, onOpenChange, isTimerRunning = false, onPauseTimer }: SettingsModalProps) {
    const { settings, updateFocusDuration, updateShortBreakDuration, updateLongBreakDuration, resetToDefaults } = useSettings()


    const [localFocus, setLocalFocus] = useState(settings.focusDuration)
    const [localShortBreak, setLocalShortBreak] = useState(settings.shortBreakDuration)
    const [localLongBreak, setLocalLongBreak] = useState(settings.longBreakDuration)
    const [showWarning, setShowWarning] = useState(false)
    const [pendingChanges, setPendingChanges] = useState<'focus' | 'shortBreak' | 'longBreak' | null>(null)
    const [pendingValue, setPendingValue] = useState<number | null>(null)

    const handleSave = () => {
        updateFocusDuration(localFocus)
        updateShortBreakDuration(localShortBreak)
        updateLongBreakDuration(localLongBreak)
        onOpenChange(false)
    }

    


    useEffect(() => {
        setLocalFocus(settings.focusDuration)
        setLocalShortBreak(settings.shortBreakDuration)
        setLocalLongBreak(settings.longBreakDuration)
    }, [settings, open])

    const handleReset = () => {
        resetToDefaults()
        setLocalFocus(25)
        setLocalShortBreak(5)
        setLocalLongBreak(15)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Configurações do Temporizador</DialogTitle>
                    <DialogDescription>
                    Personalize a duração de cada tipo de sessão
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">

                    <div className="space-y-2">
                        <Label htmlFor="focus-duration" className="text-base font-medium">
                            Duração do Foco (minutos)
                        </Label>
                        <Input
                            id="focus-duration"
                            type="number"
                            min={1}
                            value={localFocus}
                            onChange={(e) => {
                                const newValue = Number(e.target.value)
                                if(isTimerRunning) {
                                    setShowWarning(true)
                                    setPendingChanges('focus')
                                    setPendingValue(newValue)
                                } else {
                                    setLocalFocus(newValue)
                                }
                            }}
                            className="h-10"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="short-break-duration" className="text-base font-medium">
                            Duração do Intervalo Curto (minutos)
                        </Label>
                        <Input
                            id="short-break-duration"
                            type="number"
                            min={1}
                            value={localShortBreak}
                            onChange={(e) => {
                                const newValue = Number(e.target.value)
                                if(isTimerRunning) {
                                    setShowWarning(true)
                                    setPendingChanges('shortBreak')
                                    setPendingValue(newValue)
                                } else {
                                    setLocalShortBreak(newValue)
                                }
                            }}
                            className="h-10"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="long-break-duration" className="text-base font-medium">
                            Duração do Intervalo Longo (minutos)
                        </Label>
                        <Input
                            id="long-break-duration"
                            type="number"
                            min={1}
                            value={localLongBreak}
                            onChange={(e) => {
                                const newValue = Number(e.target.value)
                                if(isTimerRunning) {
                                    setShowWarning(true)
                                    setPendingChanges('longBreak')
                                    setPendingValue(newValue)
                                } else {
                                    setLocalLongBreak(newValue)
                                }
                            }}
                            className="h-10"
                        />
                    </div>
                </div>

                <div className="flex gap-3 justify-end">
                    <Button 
                        variant="outline" 
                        onClick={handleReset}
                        className="flex-1"
                    >
                        Resetar para Padrões
                    </Button>
                    <Button 
                        onClick={handleSave}
                        className="flex-1"
                    >
                        Salvar
                    </Button>
                </div>
            </DialogContent>
            {showWarning && (
                <Dialog open={showWarning} onOpenChange={setShowWarning}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex item-center gap-2">
                                <AlertCircle className="h-5 w-5 text-yellow-500" />
                                Timer em Contagem
                            </DialogTitle>
                        </DialogHeader>

                        <p className="mb-4 text-sm text-muted-foreground">
                              Você está tentando alterar a duração enquanto o timer ainda está contando. O que você deseja fazer?
                        </p>

                        <div className="flex gap-3">
                            <Button 
                                variant="outline" 
                                onClick={() => {
                                     setShowWarning(false)
                                     setPendingValue(null)
                                     setPendingChanges(null)
                                }}
                                className="flex-1"
                            >
                                Continuar
                            </Button>
                            <Button
                                onClick={() => {
                                    onPauseTimer?.()

                                    if(pendingChanges === 'focus' && pendingValue !== null) {
                                        setLocalFocus(pendingValue)
                                    }else if(pendingChanges === 'shortBreak' && pendingValue !== null) {
                                        setLocalShortBreak(pendingValue)
                                    }else if(pendingChanges === 'longBreak' && pendingValue !== null) {
                                        setLocalLongBreak(pendingValue)
                                    }

                                    setShowWarning(false)
                                    setPendingValue(null)
                                    setPendingChanges(null)
                                    
                                }}
                                className="flex-1"
                            >
                                Pausar e Editar
                            </Button>
                        </div>
                    </DialogContent>    
                </Dialog>
            )}
        </Dialog>
    )
}