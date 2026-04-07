"use client";
import { useState, useEffect, useCallback } from "react";

interface useStorageOptions<T> {
    key: string;
    initialValue?: T;
}

const STORAGE_SYNC_EVENT = 'routines-storage-sync'

export function useStorage<T>({ key, initialValue }: useStorageOptions<T>) {
    const [isClient, setIsClient] = useState(false);
    const [value, setValue] = useState<T | undefined>(initialValue);

    useEffect(() => {
        setIsClient(true);
    }, [])

    // ✅ CORREÇÃO 1: useEffect separado para ler localStorage
    useEffect(() => {
        if (!isClient) return;

        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                setValue(JSON.parse(item));
            }
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
        }
    }, [key, isClient]); // ✅ Apenas key e isClient como dependências


    useEffect(() => {
        if (!isClient) return;

        const handleSync = (e: Event) => {
            const detail = (e as CustomEvent).detail;

            if (detail.key !== key) return;

            try{
                const item = window.localStorage.getItem(key);
                if (item) {
                    setValue(JSON.parse(item));
                }
            }catch(error){
                console.error(`Error reading localStorage key "${key}":`, error);
            }
        };

        window.addEventListener(STORAGE_SYNC_EVENT, handleSync);

        return () => {
            window.removeEventListener(STORAGE_SYNC_EVENT, handleSync);
        };
    }, [key, isClient]);




    const setStorageValue = useCallback(
        (newValue: T | ((val: T | undefined) => T)) => {
            try{
                setValue(prevValue => {
                    const valueToStore = newValue instanceof Function
                        ? newValue(prevValue)
                        : newValue;
                        if (isClient) {
                            window.localStorage.setItem(key, JSON.stringify(valueToStore));

                            
                        }

                        return valueToStore;
                    });

                    if (isClient) {
                        queueMicrotask(() => {
                            window.dispatchEvent(
                                new CustomEvent(STORAGE_SYNC_EVENT, {
                                    detail: { key }
                                })
                            );
                        });
                            
                    }
                        
            }catch(error){
                console.error(`Error setting localStorage key "${key}":`, error);
            }
        },
        [key, isClient]
    );

    return [value, setStorageValue] as const;
}