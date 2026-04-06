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

    // ✅ CORREÇÃO 1: useEffect separado para ler localStorage
    useEffect(() => {
        if (!isClient) return;

        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                const parsedValue = JSON.parse(item);
                setValue(parsedValue);
            }
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
        }
    }, [key, isClient]); // ✅ Apenas key e isClient como dependências

    // ✅ CORREÇÃO 2: setStorageValue com useCallback adequado
    const setStorageValue = useCallback(
        (newValue: T | ((val: T | undefined) => T)) => {
            try {
                setValue(prevValue => {
                    const valueToStore = newValue instanceof Function ? newValue(prevValue) : newValue;
                    
                    // Salva no localStorage após atualizar o estado
                    if (isClient) {
                        window.localStorage.setItem(key, JSON.stringify(valueToStore));
                    }
                    
                    return valueToStore;
                });
            } catch (error) {
                console.error(`Erro ao salvar no localStorage key "${key}":`, error);
            }
        },
        [key, isClient] // ✅ Sem 'value' nas dependências
    );

    return [value, setStorageValue] as const;
}