'use client';

import { categories, priceRanges, sortOptions } from '@/lib/shopData';
import { useTheme } from '@/context/ThemeContext';

interface ShopFiltersProps {
    search: string;
    onSearchChange: (v: string) => void;
    category: string;
    onCategoryChange: (v: string) => void;
    priceRange: number;
    onPriceRangeChange: (v: number) => void;
    sort: string;
    onSortChange: (v: string) => void;
    resultCount: number;
}

export default function ShopFilters({
    search,
    onSearchChange,
    category,
    onCategoryChange,
    priceRange,
    onPriceRangeChange,
    sort,
    onSortChange,
    resultCount,
}: ShopFiltersProps) {
    const { theme } = useTheme();
    const isLight = theme === 'light';

    return (
        <div className="space-y-6 mb-10">
            {/* Search bar */}
            <div className="relative max-w-2xl mx-auto">
                <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                    style={{ color: isLight ? '#94A3B8' : 'rgba(255,255,255,0.35)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl outline-none transition-all duration-500 text-base"
                    style={{
                        background: isLight ? 'rgba(255,255,255,0.85)' : 'rgba(30,41,59,0.6)',
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'}`,
                        color: isLight ? '#0F172A' : '#fff',
                        boxShadow: isLight ? '0 2px 12px rgba(0,0,0,0.03)' : 'none',
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(6,182,212,0.4)';
                        e.currentTarget.style.boxShadow = isLight
                            ? '0 4px 20px rgba(6,182,212,0.08)'
                            : '0 0 20px rgba(6,182,212,0.1)';
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.borderColor = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)';
                        e.currentTarget.style.boxShadow = isLight ? '0 2px 12px rgba(0,0,0,0.03)' : '';
                    }}
                />
                {search && (
                    <button
                        onClick={() => onSearchChange('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{
                            background: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.1)',
                            color: isLight ? '#64748B' : 'rgba(255,255,255,0.5)',
                        }}
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Filter row */}
            <div
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl"
                style={{
                    background: isLight ? 'rgba(255,255,255,0.8)' : 'rgba(30,41,59,0.4)',
                    border: `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)'}`,
                    boxShadow: isLight ? '0 2px 12px rgba(0,0,0,0.03)' : 'none',
                    backdropFilter: 'blur(10px)',
                }}
            >
                {/* Category pills */}
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => onCategoryChange(cat)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-500"
                            style={
                                category === cat
                                    ? {
                                        background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                        color: '#fff',
                                        boxShadow: '0 4px 12px rgba(6,182,212,0.35)',
                                    }
                                    : {
                                        background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)',
                                        color: isLight ? '#64748B' : 'rgba(255,255,255,0.5)',
                                        border: `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'}`,
                                    }
                            }
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Right side filters */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Price */}
                    <select
                        value={priceRange}
                        onChange={(e) => onPriceRangeChange(Number(e.target.value))}
                        className="px-3 py-2.5 rounded-xl text-xs font-medium outline-none cursor-pointer transition-all duration-500"
                        style={{
                            background: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.05)',
                            color: isLight ? '#334155' : 'rgba(255,255,255,0.7)',
                            border: `1px solid ${isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'}`,
                        }}
                    >
                        {priceRanges.map((r, i) => (
                            <option key={i} value={i} style={{ background: isLight ? '#fff' : '#1e293b', color: isLight ? '#0F172A' : '#fff' }}>
                                {r.label}
                            </option>
                        ))}
                    </select>

                    {/* Sort */}
                    <select
                        value={sort}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="px-3 py-2.5 rounded-xl text-xs font-medium outline-none cursor-pointer transition-all duration-500"
                        style={{
                            background: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.05)',
                            color: isLight ? '#334155' : 'rgba(255,255,255,0.7)',
                            border: `1px solid ${isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'}`,
                        }}
                    >
                        {sortOptions.map((s) => (
                            <option key={s.value} value={s.value} style={{ background: isLight ? '#fff' : '#1e293b', color: isLight ? '#0F172A' : '#fff' }}>
                                {s.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Result count */}
            <div className="text-sm font-medium" style={{ color: isLight ? '#94A3B8' : 'rgba(255,255,255,0.4)' }}>
                Showing <span style={{ color: '#06B6D4' }}>{resultCount}</span> product{resultCount !== 1 ? 's' : ''}
            </div>
        </div>
    );
}
