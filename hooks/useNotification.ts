"use client"
import { useCallback, useRef } from "react"

interface NotificationOptions {
    title?: string
    message: string
    duration?: number
}

export function useNotification() {
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const playSound = useCallback(() => {
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)

            oscillator.frequency.value = 800
            oscillator.type = "sine"

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5)

            oscillator.start(audioContext.currentTime)
            oscillator.stop(audioContext.currentTime + 0.5)
        }   catch (error) {
            console.error("Erro ao reproduzir som:", error)
        }
    }, [])

    const notify = useCallback(({ title, message, duration = 3000 }: NotificationOptions) => {
        
        playSound()

        console.log(`[NOTIFICATION] ${title || 'Aviso'}: ${message}`)

        if ('Notification' in window && Notification.permission === "granted") {
            new Notification(title || 'Routines', {
             body: message,
             icon: "/favicon.ico" 
            })
        }
    }, [playSound])

    const requestPermission = useCallback(async () => {
        if ('Notification' in window && Notification.permission === "default") {
            const permission = await Notification.requestPermission()
            return permission === "granted"
        }
        return false
    }, [])

    return {
        notify,
        requestPermission,
        playSound
    }
}