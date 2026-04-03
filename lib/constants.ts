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



export const APP_MESSAGES = {
    title: 'Routines',
    subtitle: 'Mantenha o foco. Uma sessão de cada vez.',
    noTasks: 'Nenhuma tarefa ainda. Crie uma para começar!',
    sessionComplete: 'Sessão Completa!',
    breakTime: 'Hora de descançar!',
}


export const LOCAL_STORAGE_KEYS = {
    tasks: 'routines:tasks',
    history: 'routines:history',
    settings: 'routines:settings',
}