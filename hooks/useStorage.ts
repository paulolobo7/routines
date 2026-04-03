"use client";
import { useState, useEffect, useCallback } from "react";


interface useStorageOptions<T> {
    key: string;
    initialValue?: T;
}

export function useStorage<T>({ key, initialValue }: useStorageOptions<T>) {
    const [isClient, setIsClient] = useState(false);
    const [value, setValue] = useState<T | undefined>(initialValue);

    useEffect(() => {
        setIsClient(true);
    }, [])

    useEffect(() => {
        if (!isClient) return;

        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                setValue(JSON.parse(item));
            }
        }catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
        }
    }, [key, isClient]);

    const setStorageValue = useCallback(
        (newValue: T | ((val: T) => T)) => {
            try {
                const valueToStore = newValue instanceof Function ? newValue(value as T) : newValue;
                setValue(valueToStore);
                if (isClient) {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore));
                }
            }catch (error) {
                console.error(`Erro ao salvar no localStorage key "${key}":`, error);

            }
        },
        [key, isClient, value]
    );

    return [value, setStorageValue] as const;
}