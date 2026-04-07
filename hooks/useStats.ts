'use client'
import { useCallback, useMemo } from "react"
import { useStorage } from "./useStorage"
import { LOCAL_STORAGE_KEYS } from "@/lib/constants"
import type { TimerMode } from "@/types"

export interface SessionRecord {
    id: string
    type: TimerMode
    durationMinutes: number
    completedAt: string // ISO string
}

export interface StatsData {
    focusTimeToday: string        // "4h 25m"
    sessionsToday: number
    focusSessionsToday: number    // para o contador de ciclos do pomodoro
    streak: number
    averagePerDay: string         // "3h 45m"
}

function formatMinutes(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = Math.round(totalMinutes % 60)
    if (hours === 0) return `${minutes}m`
    if (minutes === 0) return `${hours}h`
    return `${hours}h ${minutes}m`
}

function getDateString(isoString: string): string {
    return isoString.split('T')[0]
}

function calculateStreak(sessions: SessionRecord[]): number {
    if (!sessions || sessions.length === 0) return 0

    // Dias únicos com sessões de foco, ordenados do mais recente
    const focusDays = new Set(
        sessions
            .filter(s => s.type === 'focus')
            .map(s => getDateString(s.completedAt))
    )

    if (focusDays.size === 0) return 0

    const sortedDays = Array.from(focusDays).sort().reverse()

    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    // Sequência deve incluir hoje ou ontem para ser válida
    if (sortedDays[0] !== today && sortedDays[0] !== yesterday) return 0

    let streak = 1
    for (let i = 1; i < sortedDays.length; i++) {
        const currentDate = new Date(sortedDays[i - 1] + 'T00:00:00')
        const prevDate = new Date(sortedDays[i] + 'T00:00:00')
        const diffDays = Math.round(
            (currentDate.getTime() - prevDate.getTime()) / 86400000
        )

        if (diffDays === 1) {
            streak++
        } else {
            break
        }
    }

    return streak
}

export function useStats() {
    const [sessions, setSessions] = useStorage<SessionRecord[]>({
        key: LOCAL_STORAGE_KEYS.sessions,
        initialValue: []
    })

    const recordSession = useCallback((type: TimerMode, durationMinutes: number) => {
        const newSession: SessionRecord = {
            id: Date.now().toString(),
            type,
            durationMinutes,
            completedAt: new Date().toISOString()
        }
        setSessions(prev => [...(prev || []), newSession])
    }, [setSessions])

    const stats: StatsData = useMemo(() => {
        const allSessions = sessions || []
        const today = new Date().toISOString().split('T')[0]

        // Sessões de hoje
        const todaySessions = allSessions.filter(
            s => getDateString(s.completedAt) === today
        )
        const todayFocusSessions = todaySessions.filter(s => s.type === 'focus')
        const todayFocusMinutes = todayFocusSessions.reduce(
            (sum, s) => sum + s.durationMinutes, 0
        )

        // Sequência de dias
        const streak = calculateStreak(allSessions)

        // Média por dia (apenas dias com sessões de foco)
        const focusSessions = allSessions.filter(s => s.type === 'focus')
        const uniqueDays = new Set(
            focusSessions.map(s => getDateString(s.completedAt))
        )
        const totalFocusMinutes = focusSessions.reduce(
            (sum, s) => sum + s.durationMinutes, 0
        )
        const avgMinutes = uniqueDays.size > 0
            ? totalFocusMinutes / uniqueDays.size
            : 0

        return {
            focusTimeToday: formatMinutes(todayFocusMinutes),
            sessionsToday: todaySessions.length,
            focusSessionsToday: todayFocusSessions.length,
            streak,
            averagePerDay: formatMinutes(avgMinutes)
        }
    }, [sessions])

    return {
        recordSession,
        stats,
        sessions: sessions || []
    }
}
