'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { contentApi, productsApi, ContentMapResponse } from '@/lib/api';
import { Product } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

/* ─── Data ─── */
// Static data removed - now using dynamic data from database

/* ─── Animated Section Hook ─── */
function useInView(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(e.target); } },
            { threshold, rootMargin: '0px 0px -40px 0px' }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, visible };
}

/* ─── Product Card ─── */
function ProductCard({
    product,
    index,
    accent = '#06B6D4',
    content,
    isLight,
    cv,
}: {
    product: Product;
    index: number;
    accent?: string;
    content: ContentMapResponse;
    isLight: boolean;
    cv: (section: string, key: string, fallback: string) => string;
}) {
    const { ref, visible } = useInView(0.1);
    const [hovered, setHovered] = useState(false);

    const slugToSection: { [key: string]: string } = {
        'm1-heavy-duty': 'product-m1',
        'm2-heavy-duty': 'product-m2',
        'm4-heavy-duty': 'product-m4',
        'm5-heavy-duty': 'product-m5',
        'm6-heavy-duty': 'product-m6',
        'm7-heavy-duty': 'product-m7',
        'm8-heavy-duty': 'product-m8',
        'm9-heavy-duty': 'product-m9',
        'double-deck-light': 'product-double-deck',
        '9-leg-light': 'product-9-leg',
        'rental-pallet': 'product-rental'
    };

    const sectionName = slugToSection[product.slug || ''] || product.slug || '';

    const specs = [
        { label: cv('product-specs', 'dimensions-label', 'Dimensions'), value: cv(sectionName, 'dimensions', product.dimensions || '') },
        { label: cv('product-specs', 'design-label', 'Design'), value: cv(sectionName, 'design', product.design || '') },
        ...(product.weight || content[sectionName]?.['weight']?.value ? [{ label: cv('product-specs', 'weight-label', 'Weight'), value: cv(sectionName, 'weight', product.weight || '') }] : []),
        { label: cv('product-specs', 'static-load-label', 'Static Load'), value: cv(sectionName, 'static-load', product.staticLoad || '') },
        { label: cv('product-specs', 'dynamic-load-label', 'Dynamic Load'), value: cv(sectionName, 'dynamic-load', product.dynamicLoad || '') },
        { label: cv('product-specs', 'rack-load-label', 'Rack Load'), value: cv(sectionName, 'rack-load', product.rackLoad || '') },
        { label: cv('product-specs', 'expected-life-label', 'Expected Life'), value: cv(sectionName, 'expected-life', product.expectedLife || '') },
    ].filter(spec => spec.value && spec.label);

    return (
        <div
            ref={ref}
            className="group"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(40px)',
                transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s`,
            }}
        >
            <div
                className="relative rounded-2xl overflow-hidden cursor-pointer h-full flex flex-col"
                style={{
                    background: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(30, 41, 59, 0.5)',
                    backdropFilter: 'blur(16px)',
                    borderTop: `3px solid ${accent}`,
                    borderLeft: `1px solid ${hovered ? accent + '40' : isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255, 255, 255, 0.06)'}`,
                    borderRight: `1px solid ${hovered ? accent + '40' : isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255, 255, 255, 0.06)'}`,
                    borderBottom: `1px solid ${hovered ? accent + '40' : isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255, 255, 255, 0.06)'}`,
                    boxShadow: hovered
                        ? isLight
                            ? `0 25px 60px rgba(0,0,0,0.1), 0 0 30px ${accent}10`
                            : `0 25px 60px rgba(0,0,0,0.4), 0 0 40px ${accent}15`
                        : isLight
                            ? '0 4px 24px rgba(0,0,0,0.05)'
                            : '0 4px 24px rgba(0,0,0,0.2)',
                    transform: hovered ? 'translateY(-8px) scale(1.01)' : 'translateY(0) scale(1)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {/* Image Section */}
                <div
                    className="relative flex items-center justify-center p-6 overflow-hidden"
                    style={{
                        background: isLight
                            ? 'linear-gradient(145deg, rgba(240, 249, 255, 0.8), rgba(224, 242, 254, 0.6))'
                            : 'linear-gradient(145deg, rgba(15, 23, 42, 0.4), rgba(30, 41, 59, 0.6))',
                        minHeight: '240px',
                    }}
                >
                    {/* Background glow */}
                    <div
                        className="absolute inset-0 transition-opacity duration-500"
                        style={{
                            background: `radial-gradient(circle at 50% 50%, ${accent}10, transparent 70%)`,
                            opacity: hovered ? 0.6 : 0,
                        }}
                    />
                    <img
                        src={product.image}
                        alt={`PAFT ${product.name} Pallet`}
                        className="relative z-10 max-w-[280px] max-h-[220px] w-full h-auto object-contain transition-transform duration-500"
                        style={{
                            filter: isLight
                                ? 'drop-shadow(0 8px 24px rgba(0,0,0,0.12))'
                                : 'drop-shadow(0 8px 24px rgba(0,0,0,0.3))',
                            transform: hovered ? 'scale(1.08)' : 'scale(1)',
                        }}
                        loading="lazy"
                    />
                    {/* Model badge — hidden when name is empty */}
                    {cv(sectionName, 'product-name', product.name) && (
                        <div
                            className="absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase z-20"
                            style={{
                                background: `${accent}20`,
                                color: accent,
                                border: `1px solid ${accent}30`,
                                backdropFilter: 'blur(8px)',
                            }}
                        >
                            {cv(sectionName, 'product-name', product.name)}
                        </div>
                    )}
                </div>

                {/* Specs Section */}
                <div className="flex-1 p-5">
                    <div className="space-y-0">
                        {specs.map((spec, i) => (
                            <div
                                key={i}
                                className="flex justify-between items-center py-2.5"
                                style={{
                                    borderBottom: i < specs.length - 1
                                        ? `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255, 255, 255, 0.05)'}`
                                        : 'none',
                                }}
                            >
                                <span className="text-sm" style={{ color: isLight ? '#94A3B8' : 'rgba(255, 255, 255, 0.5)' }}>
                                    {spec.label}
                                </span>
                                <span className="text-sm font-semibold" style={{ color: isLight ? '#1E293B' : 'rgba(255, 255, 255, 0.9)' }}>
                                    {spec.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Decorative corner accent */}
                <div
                    className="absolute top-0 right-0 w-24 h-24"
                    style={{
                        opacity: isLight ? 0.04 : 0.05,
                        background: `linear-gradient(135deg, ${accent}, transparent)`,
                        borderBottomLeftRadius: '100%',
                    }}
                />
            </div>
        </div>
    );
}

/* ─── Section Hero ─── */
function SectionHero({
    title,
    highlight,
    description,
    accent = '#06B6D4',
    image,
    isLight,
}: {
    title: string;
    highlight: string;
    description: string;
    accent?: string;
    image?: string;
    isLight: boolean;
}) {
    const { ref, visible } = useInView(0.2);

    return (
        <section
            ref={ref}
            className="relative overflow-hidden py-20 lg:py-28"
            style={{
                background: isLight
                    ? 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 50%, #F0F9FF 100%)'
                    : 'linear-gradient(135deg, #0B1121 0%, #1a2744 50%, #0B1121 100%)',
            }}
        >
            {/* Decorative blurs */}
            <div
                className="absolute top-0 left-0 w-96 h-96 rounded-full"
                style={{
                    opacity: isLight ? 0.06 : 0.1,
                    background: `radial-gradient(circle, ${accent}, transparent 70%)`,
                    filter: 'blur(80px)',
                    transform: 'translate(-30%, -30%)',
                }}
            />
            <div
                className="absolute bottom-0 right-0 w-80 h-80 rounded-full"
                style={{
                    opacity: isLight ? 0.06 : 0.1,
                    background: 'radial-gradient(circle, #2563EB, transparent 70%)',
                    filter: 'blur(80px)',
                    transform: 'translate(30%, 30%)',
                }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className={`flex flex-col ${image ? 'lg:flex-row lg:items-center lg:gap-12' : ''}`}>
                    {/* Text content */}
                    <div
                        className={`${image ? 'lg:flex-1' : 'text-center max-w-4xl mx-auto'}`}
                        style={{
                            opacity: visible ? 1 : 0,
                            transform: visible ? 'translateY(0)' : 'translateY(30px)',
                            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                    >
                        {(title || highlight) && (
                            <h2
                                className="text-4xl lg:text-6xl font-bold mb-6"
                                style={{ letterSpacing: '-0.03em' }}
                            >
                                {title && <span style={{ color: isLight ? '#0F172A' : '#fff' }}>{title} </span>}
                                {highlight && (
                                    <span
                                        style={{
                                            background: `linear-gradient(135deg, ${accent}, #2563EB)`,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        {highlight}
                                    </span>
                                )}
                            </h2>
                        )}
                        {description && (
                            <p
                                className="text-lg lg:text-xl leading-relaxed max-w-3xl"
                                style={{ color: isLight ? '#475569' : 'rgba(255, 255, 255, 0.7)' }}
                            >
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Optional hero image */}
                    {image && (
                        <div
                            className="lg:flex-1 flex justify-center mt-10 lg:mt-0"
                            style={{
                                opacity: visible ? 1 : 0,
                                transform: visible ? 'translateX(0)' : 'translateX(40px)',
                                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
                            }}
                        >
                            <img
                                src={image}
                                alt={`${title} ${highlight}`}
                                className="max-w-md w-full h-auto object-contain"
                                style={{ filter: isLight ? 'drop-shadow(0 20px 50px rgba(0,0,0,0.15))' : 'drop-shadow(0 20px 50px rgba(0,0,0,0.4))' }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

/* ─── Info Cards ─── */
function InfoCards({ content, isLight }: { content: ContentMapResponse; isLight: boolean }) {
    const { ref, visible } = useInView(0.15);
    const { language } = useLanguage();
    const cv = (section: string, key: string, fallback: string) => {
        const item = content[section]?.[key];
        if (!item) return fallback;
        if (language === 'ar' && item.valueAr != null && item.valueAr !== '') return item.valueAr;
        return item.value != null ? item.value : fallback;
    };
    const cards = [
        {
            title: cv('info-cards', 'design-title', 'Design'),
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            content: cv('info-cards', 'design-content', 'Best used for racking system • Can be reinforced up to 10 metal bars and up to 2.0mm thickness • Compatible with RFID for pallet tracing • Free entry for manual hand pallet • Anti-slip stoppers • Perforated top and bottom • Client logos engraved on both sides • Full traceability solution available'),
            accent: '#06B6D4',
        },
        {
            title: cv('info-cards', 'material-title', 'Material'),
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            ),
            content: cv('info-cards', 'material-content', 'Can be produced in 6 different formulas with HDPE/PP • High impact composite material • Virgin Material • Partially recycled materials plus enhancement additives (Optional) • Elastomer and UV protection additives (Optional) • Electro-static coated steel reinforcement bars • Certified food grade material • Certified Hygienic design'),
            accent: '#10B981',
        },
    ].filter(card => card.title || card.content);

    return (
        <section
            ref={ref}
            className="py-16 lg:py-20"
            style={{ background: isLight ? '#EFF6FF' : '#0d1526' }}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {cards.map((card, i) => (
                        <div
                            key={card.title}
                            className="rounded-2xl p-6 lg:p-8"
                            style={{
                                background: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(30, 41, 59, 0.5)',
                                backdropFilter: 'blur(12px)',
                                borderTop: `3px solid ${card.accent}`,
                                borderLeft: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255, 255, 255, 0.06)'}`,
                                borderRight: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255, 255, 255, 0.06)'}`,
                                borderBottom: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255, 255, 255, 0.06)'}`,
                                boxShadow: isLight ? '0 4px 20px rgba(0,0,0,0.04)' : 'none',
                                opacity: visible ? 1 : 0,
                                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                                transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.15}s`,
                            }}
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{
                                        background: `${card.accent}15`,
                                        color: card.accent,
                                    }}
                                >
                                    {card.icon}
                                </div>
                                <h3 className="text-xl font-bold" style={{ color: card.accent }}>
                                    {card.title}
                                </h3>
                            </div>
                            <p
                                className="text-sm leading-relaxed"
                                style={{ color: isLight ? '#64748B' : 'rgba(255, 255, 255, 0.65)' }}
                            >
                                {card.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Video Section (matching Home VideoHero style) ─── */
function VideoSection({ content, isLight, cv }: { content: ContentMapResponse; isLight: boolean; cv: (section: string, key: string, fallback: string) => string }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const { language } = useLanguage();
    const { ref, visible } = useInView(0.2);

    // Single background image
    const bgImage = 'https://paft.eg/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-24-at-5.17.46-PM.jpeg';

    const handlePlay = () => {
        setIsPlaying(true);
        setTimeout(() => {
            if (videoRef.current) {
                videoRef.current.play().catch(console.error);
            }
        }, 100);
    };

    const handleVideoEnd = () => {
        setIsPlaying(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    const videoTitle = cv('video', 'video-title', 'Product');
    const videoHighlight = cv('video', 'video-highlight', 'Testing');
    const videoDescription = cv('video', 'video-description', 'Watch our rigorous quality testing in action');

    return (
        <div>
            {/* Video Title Section */}
            <section
                ref={ref}
                className="py-16 lg:py-20 text-center"
                style={{ background: isLight ? '#F0F9FF' : '#0B1121' }}
            >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {(videoTitle || videoHighlight) && (
                        <h2
                            className="text-4xl lg:text-6xl font-bold mb-6"
                            style={{
                                letterSpacing: '-0.03em',
                                opacity: visible ? 1 : 0,
                                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                            }}
                        >
                            {videoTitle && <span style={{ color: isLight ? '#0F172A' : '#fff' }}>{videoTitle} </span>}
                            {videoHighlight && (
                                <span
                                    style={{
                                        background: 'linear-gradient(135deg, #8B5CF6, #2563EB)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    {videoHighlight}
                                </span>
                            )}
                        </h2>
                    )}
                    {videoDescription && (
                        <p
                            className="text-lg lg:text-xl leading-relaxed"
                            style={{
                                color: isLight ? '#475569' : 'rgba(255, 255, 255, 0.7)',
                                opacity: visible ? 1 : 0,
                                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
                            }}
                        >
                            {videoDescription}
                        </p>
                    )}
                </div>
            </section>

            {/* Video Player Section */}
            <section className="relative h-[70vh] overflow-hidden bg-black">
                {/* Background Image with Play Button */}
                <div
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${isPlaying ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
                        }`}
                >
                    <img
                        src={bgImage}
                        alt="PAFT Product Testing"
                        className="w-full h-full object-cover"
                        style={{ objectPosition: 'center center' }}
                        loading="eager"
                    />

                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

                    {/* Play Button */}
                    <button
                        onClick={handlePlay}
                        className="absolute inset-0 flex items-center justify-center z-10 group cursor-pointer"
                        aria-label="Play video"
                    >
                        <div className="relative">
                            {/* Pulsing ring */}
                            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" style={{ animationDuration: '2s' }} />
                            {/* Outer glow */}
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-500 shadow-2xl">
                                {/* Inner play icon */}
                                <svg
                                    className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1 drop-shadow-lg"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>
                        {/* Watch video text */}
                        <span className="absolute bottom-[22%] text-white/80 text-sm font-medium tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            {cv('video', 'video-watch-text', 'WATCH VIDEO')}
                        </span>
                    </button>
                </div>

                {/* Video Layer */}
                <div
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                        }`}
                >
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        playsInline
                        controls
                        onEnded={handleVideoEnd}
                    >
                        <source src="https://paft.eg/wp-content/uploads/2025/10/Drop-test-2-1-1.mp4" type="video/mp4" />
                    </video>

                    {/* Close / Back button */}
                    <button
                        onClick={handleVideoEnd}
                        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-all border border-white/20"
                        aria-label="Close video"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </section>
        </div>
    );
}


/* ─── Light Duty Info Bar ─── */
function LightDutyInfo({ content, isLight }: { content: ContentMapResponse; isLight: boolean }) {
    const { ref, visible } = useInView(0.2);
    const { language } = useLanguage();
    const cv = (section: string, key: string, fallback: string) => {
        const item = content[section]?.[key];
        if (!item) return fallback;
        if (language === 'ar' && item.valueAr != null && item.valueAr !== '') return item.valueAr;
        return item.value != null ? item.value : fallback;
    };
    const features = [
        cv('light-duty-features', 'feature1', '100% Recycled Material'),
        cv('light-duty-features', 'feature2', '4 Ways Entry'),
        cv('light-duty-features', 'feature3', 'Anti Slip'),
        cv('light-duty-features', 'feature4', 'SPM 15 Certified'),
        cv('light-duty-features', 'feature5', 'No Nails, No Product Damage'),
        cv('light-duty-features', 'feature6', 'Racking System N/A'),
    ].filter(f => f);

    return (
        <div
            ref={ref}
            className="py-10"
            style={{ background: isLight ? '#EFF6FF' : '#0d1526' }}
        >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className="flex flex-wrap justify-center gap-3"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.7s ease',
                    }}
                >
                    {features.map((f, i) => (
                        <span
                            key={i}
                            className="px-4 py-2 rounded-full text-sm font-medium"
                            style={{
                                background: isLight ? 'rgba(16, 185, 129, 0.06)' : 'rgba(16, 185, 129, 0.1)',
                                color: '#10B981',
                                border: `1px solid ${isLight ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.2)'}`,
                            }}
                        >
                            ✓ {f}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ─── Products Grid ─── */
function ProductsGrid({
    title,
    products,
    accent = '#06B6D4',
    columns = 3,
    content,
    isLight,
    cv,
}: {
    title?: string;
    products: Product[];
    accent?: string;
    columns?: number;
    content: ContentMapResponse;
    isLight: boolean;
    cv: (section: string, key: string, fallback: string) => string;
}) {
    const { ref, visible } = useInView(0.05);

    return (
        <section
            ref={ref}
            className="py-16 lg:py-20"
            style={{ background: isLight ? '#F8FBFF' : '#0f1729' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {title && (
                    <h3
                        className="text-2xl lg:text-3xl font-bold text-center mb-12"
                        style={{
                            color: isLight ? '#0F172A' : '#fff',
                            opacity: visible ? 1 : 0,
                            transform: visible ? 'translateY(0)' : 'translateY(20px)',
                            transition: 'all 0.6s ease',
                        }}
                    >
                        {title}
                    </h3>
                )}

                {products.length === 0 ? (
                    <div className="text-center py-12" style={{ color: isLight ? '#64748B' : 'white' }}>
                        <p className="text-xl">No products found</p>
                    </div>
                ) : (
                    <div
                        className="grid gap-6 lg:gap-8"
                        style={{
                            gridTemplateColumns: `repeat(auto-fill, minmax(${columns >= 3 ? '300px' : '360px'}, 1fr))`,
                        }}
                    >
                        {products.map((p, i) => (
                            <ProductCard key={p.id + i} product={p} index={i} accent={accent} content={content} isLight={isLight} cv={cv} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

/* ─── Main Page ─── */
export default function PlasticPallets() {
    const { theme } = useTheme();
    const isLight = theme === 'light';
    const { language } = useLanguage();

    // Initialize with static content structure to prevent content disappearing
    const [content, setContent] = useState<ContentMapResponse>({
        'heavy-duty-hero': {
            'heavy-duty-title': { value: 'Heavy Duty', id: 0 },
            'heavy-duty-highlight': { value: 'Pallets', id: 0 },
            'heavy-duty-description': { value: 'PAFT Heavy-Duty Pallets are designed to deliver the highest value for money in the MENA region, offering exceptional durability with the lowest annual breakage rates. Constructed from premium composite virgin materials and reinforced with metal bars, these pallets have a lifespan of 10+ years and come with a 5-year manufacturing warranty. PAFT pallets can handle exceptional rack loads of up to 2 tonnes with maximum deflection of 15mm.', id: 0 }
        },
        'info-cards': {
            'design-title': { value: 'Design', id: 0 },
            'design-content': { value: 'Best used for racking system • Can be reinforced up to 10 metal bars and up to 2.0mm thickness • Compatible with RFID for pallet tracing • Free entry for manual hand pallet • Anti-slip stoppers • Perforated top and bottom • Client logos engraved on both sides • Full traceability solution available', id: 0 },
            'material-title': { value: 'Material', id: 0 },
            'material-content': { value: 'Can be produced in 6 different formulas with HDPE/PP • High impact composite material • Virgin Material • Partially recycled materials plus enhancement additives (Optional) • Elastomer and UV protection additives (Optional) • Electro-static coated steel reinforcement bars • Certified food grade material • Certified Hygienic design', id: 0 }
        },
        'video': {
            'video-title': { value: 'Product', id: 0 },
            'video-highlight': { value: 'Testing', id: 0 },
            'video-description': { value: 'Watch our rigorous quality testing in action', id: 0 },
            'video-watch-text': { value: 'WATCH VIDEO', id: 0 }
        },
        'light-duty-hero': {
            'light-duty-title': { value: 'Light Duty', id: 0 },
            'light-duty-highlight': { value: 'Pallets', id: 0 },
            'light-duty-description': { value: 'Several pallets starting at 7kg/pallet. Made from recycled plastic, perfect for single-use applications. Unlike wooden pallets, these do not require special treatments, meeting all hygienic and environmental standards. Waterproof and competitively priced starting from just 8 USD/piece, ideal for industries with dynamic loads of up to 1.5 tons.', id: 0 }
        },
        'light-duty-features': {
            'feature1': { value: '100% Recycled Material', id: 0 },
            'feature2': { value: '4 Ways Entry', id: 0 },
            'feature3': { value: 'Anti Slip', id: 0 },
            'feature4': { value: 'SPM 15 Certified', id: 0 },
            'feature5': { value: 'No Nails, No Product Damage', id: 0 },
            'feature6': { value: 'Racking System N/A', id: 0 }
        },
        'rental-hero': {
            'rental-title': { value: 'Rental', id: 0 },
            'rental-highlight': { value: 'Pallets', id: 0 },
            'rental-description': { value: 'PAFT offers a unique, innovative approach to product storage via our flexible rental service tailored to meet the specific needs of each client, allowing you to convert pallet costs from CAPEX to OPEX. Our rental options include misuse and abuse protection and can be arranged for both short and long-term periods, providing a cost-effective solution without the need for capital investment.', id: 0 }
        },
        'cta': {
            'cta-title': { value: 'Need', id: 0 },
            'cta-highlight': { value: 'Custom Solutions?', id: 0 },
            'cta-description': { value: 'We can manufacture pallets according to your specific requirements', id: 0 },
            'cta-button1-text': { value: 'Request a Quote →', id: 0 },
            'cta-button2-text': { value: 'Contact Our Team', id: 0 }
        }
    });
    const [heavyDutyProducts, setHeavyDutyProducts] = useState<Product[]>([]);
    const [lightDutyProducts, setLightDutyProducts] = useState<Product[]>([]);
    const [rentalProducts, setRentalProducts] = useState<Product[]>([]);
    const [productsLoaded, setProductsLoaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch content and products safely
                const contentPromise = contentApi.getPageContent('plastic-pallets').catch(err => {
                    console.warn('Failed to fetch plastic pallets content:', err);
                    return {};
                });

                const heavyDutyPromise = productsApi.getAllIncludingDeleted({ category: 'heavy-duty' }).catch(err => {
                    console.error('Failed to fetch heavy duty products:', err);
                    return [];
                });

                const lightDutyPromise = productsApi.getAllIncludingDeleted({ category: 'light-duty' }).catch(err => {
                    console.error('Failed to fetch light duty products:', err);
                    return [];
                });

                const rentalPromise = productsApi.getAllIncludingDeleted({ category: 'rental' }).catch(err => {
                    console.error('Failed to fetch rental products:', err);
                    return [];
                });

                const [contentData, heavyDutyData, lightDutyData, rentalData] = await Promise.all([
                    contentPromise,
                    heavyDutyPromise,
                    lightDutyPromise,
                    rentalPromise
                ]);

                setContent(prevContent => {
                    const mergedContent = { ...prevContent };
                    const typedContentData = contentData as ContentMapResponse;
                    if (typedContentData && Object.keys(typedContentData).length > 0) {
                        Object.keys(typedContentData).forEach(section => {
                            if (typedContentData[section]) {
                                mergedContent[section] = { ...mergedContent[section], ...typedContentData[section] };
                            }
                        });
                    }
                    return mergedContent;
                });

                setHeavyDutyProducts(heavyDutyData);
                setLightDutyProducts(lightDutyData);
                setRentalProducts(rentalData);
                setProductsLoaded(true);
            } catch (error) {
                console.error('Critical error fetching data:', error);
                setProductsLoaded(true);
            }
        };

        fetchData();
    }, []);

    // Content value helper — picks Arabic when language is 'ar'
    const cv = (section: string, key: string, fallback: string) => {
        const item = content[section]?.[key];
        if (!item) return fallback;
        if (language === 'ar' && item.valueAr != null && item.valueAr !== '') return item.valueAr;
        return item.value != null ? item.value : fallback;
    };

    const heavyDutyHeroContent = {
        title: cv('heavy-duty-hero', 'heavy-duty-title', 'Heavy Duty'),
        highlight: cv('heavy-duty-hero', 'heavy-duty-highlight', 'Pallets'),
        description: cv('heavy-duty-hero', 'heavy-duty-description', 'PAFT Heavy-Duty Pallets are designed to deliver the highest value for money in the MENA region, offering exceptional durability with the lowest annual breakage rates. Constructed from premium composite virgin materials and reinforced with metal bars, these pallets have a lifespan of 10+ years and come with a 5-year manufacturing warranty. PAFT pallets can handle exceptional rack loads of up to 2 tonnes with maximum deflection of 15mm.'),
    };

    const lightDutyHeroContent = {
        title: cv('light-duty-hero', 'light-duty-title', 'Light Duty'),
        highlight: cv('light-duty-hero', 'light-duty-highlight', 'Pallets'),
        description: cv('light-duty-hero', 'light-duty-description', 'Several pallets starting at 7kg/pallet. Made from recycled plastic, perfect for single-use applications. Unlike wooden pallets, these do not require special treatments, meeting all hygienic and environmental standards. Waterproof and competitively priced starting from just 8 USD/piece, ideal for industries with dynamic loads of up to 1.5 tons.'),
    };

    const rentalHeroContent = {
        title: cv('rental-hero', 'rental-title', 'Rental'),
        highlight: cv('rental-hero', 'rental-highlight', 'Pallets'),
        description: cv('rental-hero', 'rental-description', 'PAFT offers a unique, innovative approach to product storage via our flexible rental service tailored to meet the specific needs of each client, allowing you to convert pallet costs from CAPEX to OPEX. Our rental options include misuse and abuse protection and can be arranged for both short and long-term periods, providing a cost-effective solution without the need for capital investment.'),
    };

    const ctaContent = {
        title: cv('cta', 'cta-title', 'Need'),
        highlight: cv('cta', 'cta-highlight', 'Custom Solutions?'),
        description: cv('cta', 'cta-description', 'We can manufacture pallets according to your specific requirements'),
        button1Text: cv('cta', 'cta-button1-text', 'Request a Quote →'),
        button2Text: cv('cta', 'cta-button2-text', 'Contact Our Team'),
    };

    return (
        <div className="min-h-screen" style={{ background: isLight ? '#F8FBFF' : '#0B1121' }}>
            <Header currentPage="plastic-pallets" />

            {/* ── Heavy Duty Section ── */}
            <SectionHero
                title={heavyDutyHeroContent.title}
                highlight={heavyDutyHeroContent.highlight}
                description={heavyDutyHeroContent.description}
                accent="#06B6D4"
                image="https://paft.eg/wp-content/uploads/2026/02/Steel-Reinforced-Pallet.png"
                isLight={isLight}
            />
            <InfoCards content={content} isLight={isLight} />
            {productsLoaded && <ProductsGrid products={heavyDutyProducts} accent="#06B6D4" columns={3} content={content} isLight={isLight} cv={cv} />}

            {/* ── Video Section ── */}
            <VideoSection content={content} isLight={isLight} cv={cv} />

            {/* ── Light Duty Section ── */}
            <SectionHero
                title={lightDutyHeroContent.title}
                highlight={lightDutyHeroContent.highlight}
                description={lightDutyHeroContent.description}
                accent="#10B981"
                isLight={isLight}
            />
            <LightDutyInfo content={content} isLight={isLight} />
            {productsLoaded && <ProductsGrid products={lightDutyProducts} accent="#10B981" columns={2} content={content} isLight={isLight} cv={cv} />}

            {/* ── Rental Section ── */}
            <SectionHero
                title={rentalHeroContent.title}
                highlight={rentalHeroContent.highlight}
                description={rentalHeroContent.description}
                accent="#8B5CF6"
                isLight={isLight}
            />
            {productsLoaded && <ProductsGrid products={rentalProducts} accent="#8B5CF6" columns={2} content={content} isLight={isLight} cv={cv} />}

            {/* ── CTA Section ── */}
            <section className="py-20 relative overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        background: isLight
                            ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.04), rgba(37, 99, 235, 0.04))'
                            : 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(37, 99, 235, 0.1))',
                    }}
                />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    {(ctaContent.title || ctaContent.highlight) && (
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: isLight ? '#0F172A' : '#fff' }}>
                            {ctaContent.title && <>{ctaContent.title}{' '}</>}
                            {ctaContent.highlight && (
                                <span
                                    style={{
                                        background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    {ctaContent.highlight}
                                </span>
                            )}
                        </h2>
                    )}
                    {ctaContent.description && (
                        <p className="text-xl mb-10" style={{ color: isLight ? '#64748B' : 'rgba(255, 255, 255, 0.6)' }}>
                            {ctaContent.description}
                        </p>
                    )}
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        {ctaContent.button1Text && (
                            <a
                                href="/contact"
                                className="px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:scale-105"
                                style={{
                                    background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                    boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
                                }}
                            >
                                {ctaContent.button1Text}
                            </a>
                        )}
                        {ctaContent.button2Text && (
                            <a
                                href="/contact"
                                className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105"
                                style={{
                                    border: isLight ? '2px solid rgba(15, 23, 42, 0.15)' : '2px solid rgba(255, 255, 255, 0.2)',
                                    color: isLight ? '#334155' : 'rgba(255, 255, 255, 0.8)',
                                    background: isLight ? 'rgba(255,255,255,0.6)' : 'transparent',
                                    backdropFilter: 'blur(10px)',
                                }}
                            >
                                {ctaContent.button2Text}
                            </a>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
