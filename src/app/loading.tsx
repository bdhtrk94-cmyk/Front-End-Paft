'use client';

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-sm transition-all duration-300">
            <div className="relative flex flex-col items-center justify-center">
                {/* Outer glowing rings */}
                <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-[#06B6D4] opacity-70 animate-spin" style={{ animationDuration: '2s' }} />
                <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-[#2563EB] opacity-70 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />

                {/* Inner pulsing core */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#06B6D4] to-[#2563EB] flex items-center justify-center shadow-lg shadow-[#06B6D4]/30 animate-pulse">
                    {/* Hexagon shape inside */}
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                </div>
            </div>
            <div className="mt-8 font-medium tracking-widest text-[#06B6D4] dark:text-[#2563EB] animate-pulse">
                LOADING...
            </div>
        </div>
    );
}
