'use client'
import { useStorage } from "./useStorage"
import type { TimerSettings } from "@/types"
import { LOCAL_STORAGE_KEYS } from "@/lib/constants"

const DEFAULT_SETTINGS: TimerSettings = {
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
}

export function useSettings() {
    const [settings, setSettings] = useStorage<TimerSettings>({
        key: LOCAL_STORAGE_KEYS.settings,
        initialValue: DEFAULT_SETTINGS
    })

    const updateFocusDuration = (minutes: number) => {
        setSettings(prev => ({
            ...prev,
            focusDuration: Math.max(1, minutes)
        }))
    }

    const updateShortBreakDuration = (minutes: number) => {
        setSettings(prev => ({
            ...prev,
            shortBreakDuration: Math.max(1, minutes)
        }))
    }

    const updateLongBreakDuration = (minutes: number) => {
        setSettings(prev => ({
            ...prev,
            longBreakDuration: Math.max(1, minutes)
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
