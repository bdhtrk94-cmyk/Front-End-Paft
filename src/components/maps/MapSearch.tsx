'use client';

import { useLanguage } from '@/context/LanguageContext';

interface MapSearchProps {
    query: string;
    onChange: (q: string) => void;
}

export default function MapSearch({ query, onChange }: MapSearchProps) {
    const { language } = useLanguage();
    const isAr = language === 'ar';

    return (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-[1000] w-[min(90%,360px)] md:w-80">
            <div
                className="flex items-center rounded-full px-5 py-3 gap-3"
                style={{
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    border: '1px solid rgba(255,255,255,0.3)',
                }}
            >
                {/* Search icon */}
                <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    stroke="#06B6D4"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>

                <input
                    type="text"
                    placeholder={isAr ? 'ابحث عن الدول...' : 'Search countries...'}
                    value={query}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                    aria-label={isAr ? 'بحث الدول' : 'Search countries'}
                    dir={isAr ? 'rtl' : 'ltr'}
                />

                {query && (
                    <button
                        onClick={() => onChange('')}
                        className="p-1 rounded-full hover:bg-cyan-50 transition-colors"
                        aria-label={isAr ? 'مسح البحث' : 'Clear search'}
                    >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}
