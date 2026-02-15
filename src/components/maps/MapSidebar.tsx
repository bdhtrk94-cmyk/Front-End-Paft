'use client';

import { useState } from 'react';
import { PaftCountry, paftCountries, TOTAL_COUNTRIES, TOTAL_REGIONS } from '@/lib/mapData';

interface MapSidebarProps {
    searchQuery: string;
    onFocusCountry: (name: string) => void;
}

type FilterType = 'all' | 'headquarters' | 'office';

export default function MapSidebar({ searchQuery, onFocusCountry }: MapSidebarProps) {
    const [filter, setFilter] = useState<FilterType>('all');
    const [collapsed, setCollapsed] = useState(false);

    const filteredCountries = paftCountries.filter((c) => {
        const matchesFilter = filter === 'all' || c.type === filter;
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const filters: { key: FilterType; label: string; icon: React.ReactNode }[] = [
        {
            key: 'all',
            label: 'All',
            icon: (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            key: 'headquarters',
            label: 'HQ',
            icon: (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            ),
        },
        {
            key: 'office',
            label: 'Offices',
            icon: (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
        },
    ];

    return (
        <div
            className={`absolute z-[1000] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden
        left-5 top-5 rounded-3xl
        ${collapsed ? 'w-20' : 'w-[350px]'}
        h-[700px]
        max-md:left-4 max-md:right-4 max-md:top-auto max-md:bottom-4 max-md:w-auto max-md:h-[280px] max-md:rounded-t-3xl max-md:rounded-b-none
        max-sm:left-2.5 max-sm:right-2.5 max-sm:bottom-2.5 max-sm:h-[250px]
      `}
            style={{
                background: 'rgba(255,255,255,0.98)',
                backdropFilter: 'blur(25px)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.12)',
                border: '1px solid rgba(255,255,255,0.3)',
            }}
        >
            {/* Header */}
            <div
                className="flex justify-between items-center px-6 py-5 max-sm:px-5 max-sm:py-4"
                style={{
                    borderBottom: '1px solid rgba(0,0,0,0.08)',
                    background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(37,99,235,0.04))',
                }}
            >
                <div className="flex items-center gap-4">
                    <div
                        className="w-11 h-11 max-sm:w-10 max-sm:h-10 rounded-2xl flex items-center justify-center text-white text-xl max-sm:text-lg flex-shrink-0"
                        style={{
                            background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                            boxShadow: '0 8px 20px rgba(6,182,212,0.3)',
                        }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className={`transition-opacity duration-500 ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
                        <div
                            className="text-lg max-sm:text-base font-bold"
                            style={{
                                background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            PAFT
                        </div>
                        <div className="text-xs text-gray-500 font-medium -mt-0.5">Global Network</div>
                    </div>
                </div>

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden md:flex w-8 h-8 rounded-full items-center justify-center transition-all duration-500 hover:scale-110"
                    style={{ background: 'rgba(6,182,212,0.1)', color: '#06B6D4' }}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <svg
                        className="w-4 h-4 transition-transform duration-500"
                        style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </div>

            {/* Content */}
            <div
                className={`px-5 pt-5 pb-3 overflow-y-auto transition-opacity duration-500
          h-[calc(100%-85px)] max-md:h-[calc(100%-85px)] max-sm:px-4
          ${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(6,182,212,0.3) rgba(0,0,0,0.05)',
                }}
            >
                {/* Mini stats */}
                <div
                    className="flex gap-4 mb-5 p-4 rounded-xl max-md:mb-4"
                    style={{
                        background: 'rgba(6,182,212,0.06)',
                        border: '1px solid rgba(6,182,212,0.1)',
                    }}
                >
                    <div className="flex-1 text-center">
                        <span className="block text-2xl font-bold" style={{ color: '#06B6D4' }}>
                            {TOTAL_COUNTRIES}
                        </span>
                        <span className="text-[0.7rem] text-gray-500 font-medium uppercase tracking-wider">Countries</span>
                    </div>
                    <div className="flex-1 text-center">
                        <span className="block text-2xl font-bold" style={{ color: '#06B6D4' }}>
                            {TOTAL_REGIONS}
                        </span>
                        <span className="text-[0.7rem] text-gray-500 font-medium uppercase tracking-wider">Regions</span>
                    </div>
                </div>

                {/* Filter tabs */}
                <div
                    className="flex gap-2 mb-5 p-2 rounded-xl max-md:mb-4"
                    style={{ background: 'rgba(6,182,212,0.06)' }}
                >
                    {filters.map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 max-sm:py-2 rounded-lg text-xs max-sm:text-[0.7rem] font-semibold transition-all duration-500 ${filter === f.key
                                    ? 'text-white shadow-md -translate-y-px'
                                    : 'text-gray-500 hover:text-cyan-600 hover:bg-cyan-50/50'
                                }`}
                            style={
                                filter === f.key
                                    ? {
                                        background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                        boxShadow: '0 4px 15px rgba(6,182,212,0.35)',
                                    }
                                    : {}
                            }
                        >
                            <span className="max-sm:hidden">{f.icon}</span>
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Country list */}
                <div className="space-y-2.5">
                    {filteredCountries.map((country) => (
                        <CountryItem key={country.name} country={country} onClick={() => onFocusCountry(country.name)} />
                    ))}

                    {filteredCountries.length === 0 && (
                        <div className="text-center py-8 text-gray-400 text-sm">
                            No countries found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function CountryItem({ country, onClick }: { country: PaftCountry; onClick: () => void }) {
    const isHQ = country.type === 'headquarters';

    return (
        <button
            onClick={onClick}
            className="w-full flex items-center p-3.5 rounded-xl cursor-pointer transition-all duration-500 text-left group relative overflow-hidden"
            style={{
                background: isHQ ? 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(37,99,235,0.04))' : 'white',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                border: isHQ ? '1px solid rgba(6,182,212,0.15)' : '1px solid rgba(0,0,0,0.04)',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(8px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
                e.currentTarget.style.background = 'rgba(6,182,212,0.05)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.04)';
                e.currentTarget.style.background = isHQ
                    ? 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(37,99,235,0.04))'
                    : 'white';
            }}
        >
            {/* Left accent bar */}
            <div
                className="absolute left-0 top-0 h-full w-1 transition-transform duration-500 origin-center scale-y-0 group-hover:scale-y-100"
                style={{ background: 'linear-gradient(135deg, #06B6D4, #2563EB)' }}
            />

            {/* Flag badge */}
            <div
                className="w-9 h-[25px] rounded-md mr-3.5 flex items-center justify-center text-[0.7rem] text-white font-bold flex-shrink-0"
                style={{
                    background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                    boxShadow: '0 2px 8px rgba(6,182,212,0.3)',
                }}
            >
                {country.name.substring(0, 2).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 text-sm flex items-center gap-1.5">
                    {country.name}
                    {isHQ && (
                        <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    )}
                </div>
                <div className="text-xs text-gray-400">{isHQ ? 'Headquarters' : 'Regional Office'}</div>
            </div>

            {/* Status dot */}
            <div
                className="w-2 h-2 rounded-full ml-2.5 flex-shrink-0"
                style={{
                    background: '#10B981',
                    animation: 'pulseDot 2s infinite',
                }}
            />
        </button>
    );
}
