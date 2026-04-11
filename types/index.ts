export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';


export interface TimerConfig {
    id: TimerMode
    label: string
    duration: number // in minutes
    color: string
}

export interface Task {
    id: string
    title: string
    pomodorosNeeded: number
    pomodorosCompleted: number
    timeSpentMinutes: number
    completed: boolean
    createdAt: Date
}

export interface Session {
    id: string
    type: TimerMode
    durationMinutes: number
    completedAt: Date
    taskId?: string
}

export interface DailyStats {
    date: string // YYYY-MM-DD
    focusMinutes: number
    sessionsCompleted: number
    tasksCompleted: number
}


export interface HistoryEntry {
    id: string
    date: string
    stats: DailyStats
    sessions: Session[]
}

export interface TimerSettings {
    focusDuration: number
    shortBreakDuration: number
    longBreakDuration: number
}

export type TimersettingsKey = 'focusDuration' | 'shortBreakDuration' | 'longBreakDuration'

