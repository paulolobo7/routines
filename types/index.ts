export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export interface TimerConfig {
    id: TimerMode
    label: string
    duration: number
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

export interface TimerSettings {
    focusDuration: number
    shortBreakDuration: number
    longBreakDuration: number
}
