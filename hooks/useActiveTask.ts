'use client'
import { useStorage } from "./useStorage"
import { LOCAL_STORAGE_KEYS } from "@/lib/constants"

export function useActiveTask(){
    const [activeTaskId, setActiveTaskId] = useStorage<string | null>({
        key: LOCAL_STORAGE_KEYS.activeTask,
        initialValue: null
    })

    return {
        activeTaskId: activeTaskId ?? null,
        setActiveTask: (id: string | null) => setActiveTaskId(id)
    }
}