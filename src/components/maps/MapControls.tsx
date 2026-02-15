'use client';

interface MapControlsProps {
    onReset: () => void;
    onFullscreen: () => void;
    onShowAll: () => void;
}

const btnBase =
    'relative overflow-hidden w-[50px] h-[50px] md:w-[55px] md:h-[55px] rounded-2xl flex items-center justify-center text-lg transition-all duration-500 group';

export default function MapControls({ onReset, onFullscreen, onShowAll }: MapControlsProps) {
    const buttons = [
        {
            label: 'Reset View',
            icon: (
                <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            onClick: onReset,
        },
        {
            label: 'Fullscreen',
            icon: (
                <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
            ),
            onClick: onFullscreen,
        },
        {
            label: 'Show All',
            icon: (
                <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            ),
            onClick: onShowAll,
        },
    ];

    return (
        <div className="absolute top-5 right-5 z-[1000] flex flex-row md:flex-col gap-3">
            {buttons.map((btn) => (
                <button
                    key={btn.label}
                    onClick={btn.onClick}
                    title={btn.label}
                    aria-label={btn.label}
                    className={btnBase}
                    style={{
                        background: 'rgba(255,255,255,0.98)',
                        color: '#06B6D4',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                        border: '1px solid rgba(255,255,255,0.3)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 12px 35px rgba(6,182,212,0.35)';
                        e.currentTarget.style.background = 'linear-gradient(135deg, #06B6D4, #2563EB)';
                        e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = '';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.98)';
                        e.currentTarget.style.color = '#06B6D4';
                    }}
                >
                    {btn.icon}
                </button>
            ))}
        </div>
    );
}
