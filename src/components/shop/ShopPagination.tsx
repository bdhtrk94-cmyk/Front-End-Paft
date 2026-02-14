'use client';

import { useTheme } from '@/context/ThemeContext';

interface ShopPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function ShopPagination({ currentPage, totalPages, onPageChange }: ShopPaginationProps) {
    const { theme } = useTheme();
    const isLight = theme === 'light';

    if (totalPages <= 1) return null;

    const getPages = (): (number | '...')[] => {
        const pages: (number | '...')[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                pages.push(i);
            }
            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div
            className="flex justify-center items-center gap-2 mt-12 pt-8"
            style={{ borderTop: `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}` }}
        >
            {/* Prev */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                    background: isLight ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'}`,
                    color: isLight ? '#64748B' : 'rgba(255,255,255,0.6)',
                    boxShadow: isLight ? '0 1px 4px rgba(0,0,0,0.03)' : 'none',
                }}
                aria-label="Previous page"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Pages */}
            {getPages().map((p, i) =>
                p === '...' ? (
                    <span key={`dot-${i}`} className="px-2 text-sm" style={{ color: isLight ? '#CBD5E1' : 'rgba(255,255,255,0.3)' }}>
                        …
                    </span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-300"
                        style={
                            currentPage === p
                                ? {
                                    background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                    color: '#fff',
                                    boxShadow: '0 4px 15px rgba(6,182,212,0.4)',
                                }
                                : {
                                    background: isLight ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.05)',
                                    border: `1px solid ${isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'}`,
                                    color: isLight ? '#64748B' : 'rgba(255,255,255,0.5)',
                                    boxShadow: isLight ? '0 1px 4px rgba(0,0,0,0.03)' : 'none',
                                }
                        }
                    >
                        {p}
                    </button>
                ),
            )}

            {/* Next */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                    background: isLight ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'}`,
                    color: isLight ? '#64748B' : 'rgba(255,255,255,0.6)',
                    boxShadow: isLight ? '0 1px 4px rgba(0,0,0,0.03)' : 'none',
                }}
                aria-label="Next page"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
}
