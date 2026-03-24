'use client';

import { createContext, useContext, useEffect, useLayoutEffect, useState, useCallback } from 'react';
import { contentApi } from '@/lib/api';

type Language = 'en' | 'ar';

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    t: (value?: string, valueAr?: string | null) => string;
    layoutContent: { [key: string]: { value: string; valueAr?: string } };
    isLayoutContentLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Use useLayoutEffect on client, useEffect on server to avoid SSR warnings
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');
    const [mounted, setMounted] = useState(false);
    const [layoutContent, setLayoutContent] = useState<{ [key: string]: { value: string; valueAr?: string } }>({});
    const [isLayoutContentLoading, setIsLayoutContentLoading] = useState(true);

    // Read language from localStorage before paint
    useIsomorphicLayoutEffect(() => {
        const stored = localStorage.getItem('paft-language') as Language | null;
        const initial = stored === 'ar' ? 'ar' : 'en';
        setLanguage(initial);
        document.documentElement.setAttribute('dir', initial === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', initial);
        setMounted(true);
    }, []);

    // Keep dir and lang attributes in sync
    useEffect(() => {
        if (!mounted) return;
        document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', language);
        localStorage.setItem('paft-language', language);
    }, [language, mounted]);

    // Fetch layout content once globally
    useEffect(() => {
        contentApi.getPageContent('layout')
            .then(data => {
                const flat: { [key: string]: { value: string; valueAr?: string } } = {};
                Object.keys(data).forEach(section => {
                    Object.keys(data[section]).forEach(key => {
                        flat[`${section}-${key}`] = data[section][key];
                    });
                });
                setLayoutContent(flat);
            })
            .catch(err => console.error('Failed to load layout content globally:', err))
            .finally(() => setIsLayoutContentLoading(false));
    }, []);

    const toggleLanguage = useCallback(() => {
        setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
    }, []);

    // Helper: pick the right translation
    const t = useCallback((value?: string, valueAr?: string | null): string => {
        if (language === 'ar' && valueAr) return valueAr;
        return value || '';
    }, [language]);

    // Prevent flash: don't render children until language is resolved
    if (!mounted) {
        return null;
    }

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t, layoutContent, isLayoutContentLoading }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
