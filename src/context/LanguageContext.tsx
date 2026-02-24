'use client';

import { createContext, useContext, useEffect, useLayoutEffect, useState, useCallback } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    t: (value?: string, valueAr?: string | null) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Use useLayoutEffect on client, useEffect on server to avoid SSR warnings
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');
    const [mounted, setMounted] = useState(false);

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
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
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
