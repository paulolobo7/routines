import type { TimerConfig } from "@/types";

export const TIMER_MODES: TimerConfig[] = [
    {
        id: 'focus',
        label: 'Foco',
        duration: 25,
        color: 'bg-primary'
    },
    {
        id: 'shortBreak',
        label: 'Pausa Curta',
        duration: 5,
        color: 'bg-accent'
    },
    {
        id: 'longBreak',
        label: 'Pausa Longa',
        duration: 15,
        color: 'bg-accent'
    },
]

export const LOCAL_STORAGE_KEYS = {
    tasks: 'routines:tasks',
    history: 'routines:history',
    settings: 'routines:settings',
    sessions: 'routines:sessions',
    activeTask: 'routines:activeTask',
}
