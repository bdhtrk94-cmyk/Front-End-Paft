'use client';

import { useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MapSidebar from '@/components/maps/MapSidebar';
import MapSearch from '@/components/maps/MapSearch';
import MapControls from '@/components/maps/MapControls';
import MapStatsPanel from '@/components/maps/MapStatsPanel';
import { useTheme } from '@/context/ThemeContext';
import type L from 'leaflet';

// Dynamic import with ssr disabled — Leaflet requires the DOM
const InteractiveMap = dynamic(() => import('@/components/maps/InteractiveMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center" style={{ background: '#e8f4f8' }}>
            <div className="text-center">
                <div
                    className="w-12 h-12 border-4 rounded-full mx-auto mb-4 animate-spin"
                    style={{ borderColor: '#e5e7eb', borderTopColor: '#06B6D4' }}
                />
                <p className="text-sm font-medium" style={{ color: '#06B6D4' }}>
                    Loading Global Map…
                </p>
            </div>
        </div>
    ),
});

export default function MarketsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const focusFnRef = useRef<((name: string) => void) | null>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const { theme } = useTheme();
    const isLight = theme === 'light';

    const handleFocusReady = useCallback((fn: (name: string) => void) => {
        focusFnRef.current = fn;
    }, []);

    const handleFocusCountry = useCallback((name: string) => {
        focusFnRef.current?.(name);
    }, []);

    const handleReset = useCallback(() => {
        mapInstanceRef.current?.setView([20, 20], 2);
    }, []);

    const handleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }, []);

    const handleShowAll = useCallback(() => {
        const event = new KeyboardEvent('keydown', { key: 'A' });
        document.dispatchEvent(event);
    }, []);

    return (
        <div className="min-h-screen" style={{ background: isLight ? '#F8FBFF' : '#0B1121' }}>
            <Header currentPage="markets" />

            {/* Hero Section */}
            <section
                className="relative overflow-hidden py-20 lg:py-28"
                style={{
                    background: isLight
                        ? 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 50%, #F0F9FF 100%)'
                        : 'linear-gradient(135deg, #0B1121 0%, #1a2744 50%, #0B1121 100%)',
                }}
            >
                {/* Background glow */}
                <div
                    className="absolute top-0 left-0 w-96 h-96 rounded-full"
                    style={{
                        opacity: isLight ? 0.04 : 0.1,
                        background: 'radial-gradient(circle, #06B6D4, transparent 70%)',
                        filter: 'blur(80px)',
                        transform: 'translate(-30%, -30%)',
                    }}
                />
                <div
                    className="absolute bottom-0 right-0 w-96 h-96 rounded-full"
                    style={{
                        opacity: isLight ? 0.04 : 0.1,
                        background: 'radial-gradient(circle, #2563EB, transparent 70%)',
                        filter: 'blur(80px)',
                        transform: 'translate(30%, 30%)',
                    }}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div
                        className="inline-flex items-center px-4 py-2 rounded-full mb-8"
                        style={{
                            background: isLight ? 'rgba(6,182,212,0.06)' : 'rgba(6,182,212,0.1)',
                            border: `1px solid ${isLight ? 'rgba(6,182,212,0.15)' : 'rgba(6,182,212,0.2)'}`,
                        }}
                    >
                        <span style={{ color: '#06B6D4' }} className="text-sm font-semibold tracking-wider uppercase">
                            Global Presence
                        </span>
                    </div>

                    <h1
                        className="text-5xl lg:text-7xl font-bold mb-6"
                        style={{
                            background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-0.03em',
                        }}
                    >
                        Our Markets
                    </h1>

                    <div
                        className="w-24 h-1 mx-auto rounded-full mb-8"
                        style={{ background: 'linear-gradient(90deg, #06B6D4, #2563EB)' }}
                    />

                    <p
                        className="text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed font-medium"
                        style={{ color: isLight ? '#475569' : 'rgba(255,255,255,0.7)' }}
                    >
                        Explore PAFT&apos;s worldwide network spanning 13 countries across the Middle East &amp; Africa region.
                    </p>
                </div>
            </section>

            {/* Map Section */}
            <section
                className="relative"
                style={{
                    background: isLight ? '#E0F2FE' : '#0d1529',
                    borderTop: isLight ? '1px solid rgba(6,182,212,0.08)' : 'none',
                    borderBottom: isLight ? '1px solid rgba(6,182,212,0.08)' : 'none',
                }}
            >
                <div className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px]">
                    <InteractiveMap
                        onFocusReady={handleFocusReady}
                        onMapReady={(m) => {
                            mapInstanceRef.current = m;
                        }}
                    />

                    {/* Overlays */}
                    <MapSearch query={searchQuery} onChange={setSearchQuery} />
                    <MapSidebar searchQuery={searchQuery} onFocusCountry={handleFocusCountry} />
                    <MapControls onReset={handleReset} onFullscreen={handleFullscreen} onShowAll={handleShowAll} />
                    <MapStatsPanel />
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        background: isLight
                            ? 'linear-gradient(135deg, rgba(6,182,212,0.04), rgba(37,99,235,0.04))'
                            : 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(37,99,235,0.15))',
                    }}
                />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: isLight ? '#0F172A' : '#fff' }}>
                        Want to Partner With Us?
                    </h2>
                    <p className="text-xl mb-10" style={{ color: isLight ? '#64748B' : 'rgba(255,255,255,0.6)' }}>
                        Join our growing network of partners across the Middle East &amp; Africa
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="/contact"
                            className="px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:scale-105"
                            style={{
                                background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                boxShadow: '0 4px 15px rgba(6,182,212,0.3)',
                            }}
                        >
                            Get in Touch →
                        </a>
                        <a
                            href="/about"
                            className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105"
                            style={{
                                border: isLight ? '2px solid rgba(15, 23, 42, 0.15)' : '2px solid rgba(255,255,255,0.2)',
                                color: isLight ? '#334155' : 'rgba(255,255,255,0.8)',
                                background: isLight ? 'rgba(255,255,255,0.6)' : 'transparent',
                                backdropFilter: 'blur(10px)',
                            }}
                        >
                            Learn About Us
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
