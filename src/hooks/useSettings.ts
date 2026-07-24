'use client'
import { useStorage } from "./useStorage"
import type { TimerSettings } from "@/types"
import { LOCAL_STORAGE_KEYS } from "@/lib/constants"

const DEFAULT_SETTINGS: TimerSettings = {
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
}

export const TIMER_DURATION_LIMITS = {
    min: 1,
    max: 180,
} as const

function clampDuration(minutes: number): number {
    if (!Number.isFinite(minutes)) return TIMER_DURATION_LIMITS.min
    return Math.min(
        TIMER_DURATION_LIMITS.max,
        Math.max(TIMER_DURATION_LIMITS.min, Math.round(minutes))
    )
}

export function useSettings() {
    const [settings, setSettings] = useStorage<TimerSettings>({
        key: LOCAL_STORAGE_KEYS.settings,
        initialValue: DEFAULT_SETTINGS
    })

    const updateFocusDuration = (minutes: number) => {
        setSettings(prev => ({
            ...DEFAULT_SETTINGS,
            ...prev,
            focusDuration: clampDuration(minutes)
        }))
    }

    const updateShortBreakDuration = (minutes: number) => {
        setSettings(prev => ({
            ...DEFAULT_SETTINGS,
            ...prev,
            shortBreakDuration: clampDuration(minutes)
        }))
    }

    const updateLongBreakDuration = (minutes: number) => {
        setSettings(prev => ({
            ...DEFAULT_SETTINGS,
            ...prev,
            longBreakDuration: clampDuration(minutes)
        }))
    }

    const resetToDefaults = () => {
        setSettings(DEFAULT_SETTINGS)
    }

    return {
        settings: settings || DEFAULT_SETTINGS,
        updateFocusDuration,
        updateShortBreakDuration,
        updateLongBreakDuration,
        resetToDefaults
    }
}
