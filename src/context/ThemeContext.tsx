'use client';

import { createContext, useContext, useEffect, useLayoutEffect, useState, useCallback } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Use useLayoutEffect on client, useEffect on server to avoid SSR warnings
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('dark');
    const [mounted, setMounted] = useState(false);

    // Read theme from localStorage before paint
    useIsomorphicLayoutEffect(() => {
        const stored = localStorage.getItem('paft-theme') as Theme | null;
        const initial = stored === 'light' ? 'light' : 'dark';
        setTheme(initial);
        document.documentElement.setAttribute('data-theme', initial);
        setMounted(true);
    }, []);

    // Keep data-theme attribute in sync
    useEffect(() => {
        if (!mounted) return;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('paft-theme', theme);
    }, [theme, mounted]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }, []);

    // Prevent flash: don't render children until theme is resolved
    if (!mounted) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
