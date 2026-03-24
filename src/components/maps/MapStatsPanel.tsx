'use client';

import { TOTAL_COUNTRIES, TOTAL_REGIONS, paftCountries } from '@/lib/mapData';
import { useLanguage } from '@/context/LanguageContext';

export default function MapStatsPanel() {
    const { language } = useLanguage();
    const isAr = language === 'ar';

    return (
        <div
            className="absolute bottom-5 right-5 z-[1000] hidden md:block rounded-2xl p-5 min-w-[200px]"
            style={{
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
            }}
        >
            <div className="flex items-center gap-2 font-bold text-gray-800 mb-3">
                <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {isAr ? 'إحصائيات عالمية' : 'Global Stats'}
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">{isAr ? 'الدول:' : 'Countries:'}</span>
                    <span className="font-bold" style={{ color: '#06B6D4' }}>{TOTAL_COUNTRIES}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">{isAr ? 'المناطق:' : 'Regions:'}</span>
                    <span className="font-bold" style={{ color: '#06B6D4' }}>{TOTAL_REGIONS}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">{isAr ? 'مكاتب إقليمية:' : 'Regional Offices:'}</span>
                    <span className="font-bold" style={{ color: '#10B981' }}>{paftCountries.filter(c => c.type === 'regional-office').length}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">{isAr ? 'المقر الرئيسي:' : 'Headquarters:'}</span>
                    <span className="font-bold" style={{ color: '#06B6D4' }}>{isAr ? 'مصر' : 'Egypt'}</span>
                </div>
            </div>
        </div>
    );
}
