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
    taskId?: string
}

export interface StatsData {
    focusTimeToday: string        // "4h 25m"
    sessionsToday: number
    focusSessionsToday: number    // para o contador de ciclos do pomodoro
    streak: number
    averagePerDay: string         // "3h 45m"
    last7Days: { day: string; minutes: number }[]
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

    const focusDays = new Set(
        sessions
            .filter(s => s.type === 'focus')
            .map(s => getDateString(s.completedAt))
    )

    if (focusDays.size === 0) return 0

    const sortedDays = Array.from(focusDays).sort().reverse()

    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

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

    const recordSession = useCallback((
        type: TimerMode, 
        durationMinutes: number,
        taskId?: string
    ) => {
        const newSession: SessionRecord = {
            id: Date.now().toString(),
            type,
            durationMinutes,
            completedAt: new Date().toISOString(),
            taskId
        }
        setSessions(prev => [...(prev || []), newSession])

        if (taskId && type === 'focus') {
            const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.tasks)
            if (raw) {
                const tasks = JSON.parse(raw)
                const updated = tasks.map((t: any) =>
                    t.id === taskId
                       ? {...t, timeSpentMinutes: (t.timeSpentMinutes || 0) + durationMinutes}
                       : t
                )
                localStorage.setItem(LOCAL_STORAGE_KEYS.tasks, JSON.stringify(updated))

                window.dispatchEvent(new CustomEvent('routines-storage-sync',{
                    detail: { key: LOCAL_STORAGE_KEYS.tasks }
                }))
            }
        }
    }, [setSessions])

    const stats: StatsData = useMemo(() => {
        const allSessions = sessions || []
        const today = new Date().toISOString().split('T')[0]

        const todaySessions = allSessions.filter(
            s => getDateString(s.completedAt) === today
        )
        const todayFocusSessions = todaySessions.filter(s => s.type === 'focus')
        const todayFocusMinutes = todayFocusSessions.reduce(
            (sum, s) => sum + s.durationMinutes, 0
        )

        const streak = calculateStreak(allSessions)

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
            
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - (6 - i))     
            const dateStr = date.toISOString().split('T')[0]
            const dayLabel = date.toLocaleDateString('pt-BR', { weekday: 'short' })
        
            const dayMinutes = allSessions
                .filter(s => s.type === 'focus' && getDateString(s.completedAt) === dateStr)
                .reduce((sum, s) => sum + s.durationMinutes, 0)
        
                return {
                    day: dayLabel,
                    minutes: dayMinutes,
                }            
            })

        return {
            focusTimeToday: formatMinutes(todayFocusMinutes),
            sessionsToday: todaySessions.length,
            focusSessionsToday: todayFocusSessions.length,
            streak,
            averagePerDay: formatMinutes(avgMinutes),
            last7Days
        }
    }, [sessions])

        

    return {
        recordSession,
        stats,
        sessions: sessions || [],
        last7Days: stats.last7Days
    }
}
