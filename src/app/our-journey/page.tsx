'use client';

import { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { contentApi, ContentMapResponse } from '@/lib/api';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

interface Milestone {
    number: number;
    year: number;
    title: string;
    era: number;
    color: string;
    accentGlow: string;
}

interface Era {
    label: string;
    subtitle: string;
    range: string;
    color: string;
}

const milestoneColors = [
    { color: '#10B981', accentGlow: 'rgba(16, 185, 129, 0.3)' },
    { color: '#06B6D4', accentGlow: 'rgba(6, 182, 212, 0.3)' },
    { color: '#F97316', accentGlow: 'rgba(249, 115, 22, 0.3)' },
    { color: '#2563EB', accentGlow: 'rgba(37, 99, 235, 0.3)' },
    { color: '#8B5CF6', accentGlow: 'rgba(139, 92, 246, 0.3)' },
    { color: '#06B6D4', accentGlow: 'rgba(6, 182, 212, 0.3)' },
    { color: '#10B981', accentGlow: 'rgba(16, 185, 129, 0.3)' },
    { color: '#EF4444', accentGlow: 'rgba(239, 68, 68, 0.3)' },
    { color: '#F59E0B', accentGlow: 'rgba(245, 158, 11, 0.3)' },
    { color: '#2563EB', accentGlow: 'rgba(37, 99, 235, 0.3)' },
    { color: '#06B6D4', accentGlow: 'rgba(6, 182, 212, 0.3)' },
    { color: '#8B5CF6', accentGlow: 'rgba(139, 92, 246, 0.3)' },
];

const eraColors = [
    '#10B981',
    '#06B6D4',
    '#F59E0B',
    '#8B5CF6'
];

function TimelineCard({ milestone, index, isLight }: { milestone: Milestone; index: number; isLight: boolean }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const isLeft = index % 2 === 0;

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const cardStyle = {
        background: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(30, 41, 59, 0.6)',
        backdropFilter: 'blur(12px)',
        borderTop: `3px solid ${milestone.color}`,
        borderLeft: `1px solid ${isHovered ? milestone.color + '50' : isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255, 255, 255, 0.06)'}`,
        borderRight: `1px solid ${isHovered ? milestone.color + '50' : isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255, 255, 255, 0.06)'}`,
        borderBottom: `1px solid ${isHovered ? milestone.color + '50' : isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255, 255, 255, 0.06)'}`,
        boxShadow: isHovered
            ? isLight
                ? `0 25px 50px rgba(0,0,0,0.08), 0 0 30px ${milestone.accentGlow.replace('0.3', '0.12')}`
                : `0 25px 50px rgba(0,0,0,0.4), 0 0 40px ${milestone.accentGlow}`
            : isLight
                ? '0 4px 20px rgba(0,0,0,0.04)'
                : '0 4px 20px rgba(0,0,0,0.2)',
        transform: isHovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    const textColor = isLight ? '#334155' : 'rgba(255, 255, 255, 0.8)';

    return (
        <div
            ref={cardRef}
            className={`timeline-item flex items-center w-full mb-12 lg:mb-16`}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                    ? 'translateX(0) translateY(0)'
                    : `translateX(${isLeft ? '-60px' : '60px'}) translateY(20px)`,
                transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`,
            }}
        >
            {/* Desktop: alternating layout */}
            <div className={`hidden lg:flex items-center w-full ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Card */}
                <div className="w-5/12">
                    <div
                        className="relative rounded-2xl p-6 cursor-pointer"
                        style={cardStyle}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {/* Year badge */}
                        <div
                            className="inline-flex items-center px-4 py-1.5 rounded-full mb-4"
                            style={{
                                background: `${milestone.color}15`,
                                border: `1px solid ${milestone.color}30`,
                            }}
                        >
                            <span className="text-sm font-bold" style={{ color: milestone.color }}>
                                {milestone.year}
                            </span>
                        </div>

                        <p className="text-base leading-relaxed" style={{ color: textColor }}>
                            {milestone.title}
                        </p>

                        {/* Decorative corner */}
                        <div
                            className="absolute top-0 right-0 w-20 h-20 rounded-bl-full"
                            style={{ background: milestone.color, opacity: isLight ? 0.04 : 0.05 }}
                        ></div>
                    </div>
                </div>

                {/* Center line connector */}
                <div className="w-2/12 flex justify-center relative">
                    {/* Number circle */}
                    <div
                        className="w-14 h-14 rounded-full flex items-center justify-center z-10 relative"
                        style={{
                            background: `linear-gradient(135deg, ${milestone.color}, ${milestone.color}CC)`,
                            boxShadow: isHovered
                                ? `0 0 30px ${milestone.accentGlow}, 0 0 60px ${milestone.accentGlow}`
                                : `0 4px 15px ${milestone.accentGlow}`,
                            transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                            transition: 'all 0.4s ease',
                        }}
                    >
                        <span className="text-white font-bold text-lg">{milestone.number}</span>
                    </div>
                </div>

                {/* Empty space for alternating */}
                <div className="w-5/12"></div>
            </div>

            {/* Mobile/Tablet layout */}
            <div className="flex lg:hidden items-start w-full gap-4">
                {/* Timeline line + circle */}
                <div className="flex flex-col items-center flex-shrink-0">
                    <div
                        className="w-11 h-11 rounded-full flex items-center justify-center z-10 relative"
                        style={{
                            background: `linear-gradient(135deg, ${milestone.color}, ${milestone.color}CC)`,
                            boxShadow: `0 4px 15px ${milestone.accentGlow}`,
                        }}
                    >
                        <span className="text-white font-bold text-sm">{milestone.number}</span>
                    </div>
                    <div
                        className="w-0.5 flex-1 mt-2"
                        style={{ background: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255, 255, 255, 0.1)' }}
                    ></div>
                </div>

                {/* Card */}
                <div className="flex-1 pb-4">
                    <div
                        className="rounded-2xl p-5"
                        style={{
                            background: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(30, 41, 59, 0.6)',
                            backdropFilter: 'blur(12px)',
                            borderTop: `3px solid ${milestone.color}`,
                            borderLeft: `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255, 255, 255, 0.06)'}`,
                            borderRight: `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255, 255, 255, 0.06)'}`,
                            borderBottom: `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255, 255, 255, 0.06)'}`,
                            boxShadow: isLight ? '0 4px 20px rgba(0,0,0,0.04)' : '0 4px 20px rgba(0,0,0,0.2)',
                        }}
                    >
                        <div
                            className="inline-flex items-center px-3 py-1 rounded-full mb-3"
                            style={{
                                background: `${milestone.color}15`,
                                border: `1px solid ${milestone.color}30`,
                            }}
                        >
                            <span className="text-xs font-bold" style={{ color: milestone.color }}>
                                {milestone.year}
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: textColor }}>
                            {milestone.title}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function EraSection({ era, isLight }: { era: Era; isLight: boolean }) {
    const eraRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.3 }
        );

        if (eraRef.current) {
            observer.observe(eraRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={eraRef}
            className="flex justify-center my-16 lg:my-20"
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
                transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
        >
            <div className="text-center relative">
                {/* Background glow */}
                <div
                    className="absolute inset-0 rounded-full"
                    style={{
                        opacity: isLight ? 0.1 : 0.2,
                        background: `radial-gradient(circle, ${era.color}, transparent 70%)`,
                        filter: 'blur(30px)',
                        transform: 'scale(2)',
                    }}
                ></div>

                <div
                    className="relative inline-flex flex-col items-center px-10 py-6 rounded-2xl"
                    style={{
                        background: isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(30, 41, 59, 0.5)',
                        backdropFilter: 'blur(12px)',
                        border: `1px solid ${era.color}30`,
                        boxShadow: isLight ? '0 8px 30px rgba(0,0,0,0.06)' : 'none',
                    }}
                >
                    <div
                        className="text-3xl lg:text-4xl font-black mb-1"
                        style={{ color: era.color }}
                    >
                        {era.label}
                    </div>
                    <div
                        className="text-sm font-semibold mb-1"
                        style={{ color: isLight ? '#334155' : 'rgba(255, 255, 255, 0.7)' }}
                    >
                        {era.subtitle}
                    </div>
                    <div
                        className="text-xs font-medium"
                        style={{ color: isLight ? '#94A3B8' : 'rgba(255, 255, 255, 0.4)' }}
                    >
                        {era.range}
                    </div>
                    {/* Decorative line */}
                    <div
                        className="w-16 h-0.5 rounded-full mt-3"
                        style={{ background: `linear-gradient(90deg, transparent, ${era.color}, transparent)` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}

export default function OurJourney() {
    const [content, setContent] = useState<ContentMapResponse>({});
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    const { language } = useLanguage();
    const isLight = theme === 'light';

    // Language-aware content value getter
    const cv = (item: { value: string; valueAr?: string | null } | undefined, fallback: string = '') => {
        if (!item) return fallback;
        if (language === 'ar' && item.valueAr) return item.valueAr;
        return item.value || fallback;
    };

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await contentApi.getPageContent('our-journey');
                setContent(data);
            } catch (error) {
                console.error('Error fetching our-journey content:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    // Build milestones array from dynamic content
    const milestones: Milestone[] = [];
    for (let i = 1; i <= 12; i++) {
        const year = cv(content.timeline?.[`milestone${i}-year`]);
        const title = cv(content.timeline?.[`milestone${i}-title`]);

        if (year && title) {
            let era = 1;
            const yearNum = parseInt(year);
            if (yearNum >= 2014 && yearNum <= 2018) era = 2;
            else if (yearNum >= 2019 && yearNum <= 2022) era = 3;
            else if (yearNum >= 2023) era = 4;

            const colorIndex = (i - 1) % milestoneColors.length;
            milestones.push({
                number: i,
                year: yearNum,
                title,
                era,
                color: milestoneColors[colorIndex].color,
                accentGlow: milestoneColors[colorIndex].accentGlow,
            });
        }
    }

    // Build eras array from dynamic content
    const eras: Era[] = [];
    for (let i = 1; i <= 4; i++) {
        const label = cv(content.eras?.[`era${i}-label`]);
        const subtitle = cv(content.eras?.[`era${i}-subtitle`]);
        const range = cv(content.eras?.[`era${i}-range`]);

        if (label && subtitle && range) {
            eras.push({
                label,
                subtitle,
                range,
                color: eraColors[i - 1],
            });
        }
    }

    // Group milestones by era
    const era1 = milestones.filter((m) => m.era === 1);
    const era2 = milestones.filter((m) => m.era === 2);
    const era3 = milestones.filter((m) => m.era === 3);
    const era4 = milestones.filter((m) => m.era === 4);
    const eraGroups = [
        { era: eras[0], items: era1 },
        { era: eras[1], items: era2 },
        { era: eras[2], items: era3 },
        { era: eras[3], items: era4 },
    ];

    const heroContent = {
        badgeText: cv(content.hero?.['badge-text'], 'Our Journey'),
        title: cv(content.hero?.title, 'Building the Future'),
        description: cv(content.hero?.description, 'Over a decade of innovation, growth, and relentless pursuit of excellence in industrial packaging solutions.'),
        stat1Value: cv(content.hero?.['stat1-value'], '15+'),
        stat1Label: cv(content.hero?.['stat1-label'], 'Years of Innovation'),
        stat2Value: cv(content.hero?.['stat2-value'], '12'),
        stat2Label: cv(content.hero?.['stat2-label'], 'Key Milestones'),
        stat3Value: cv(content.hero?.['stat3-value'], '4'),
        stat3Label: cv(content.hero?.['stat3-label'], 'Growth Eras'),
        stat4Value: cv(content.hero?.['stat4-value'], '300%'),
        stat4Label: cv(content.hero?.['stat4-label'], 'Capacity Growth'),
    };

    const ctaContent = {
        title: cv(content.cta?.title, 'The Journey Continues'),
        description: cv(content.cta?.description, 'Join us as we shape the future of industrial packaging solutions across the MENA region and beyond.'),
        button1Text: cv(content.cta?.['button1-text'], 'Partner With Us →'),
        button2Text: cv(content.cta?.['button2-text'], 'Learn About PAFT'),
    };

    return (
        <div className="min-h-screen" style={{ background: isLight ? '#F8FBFF' : '#0B1121' }}>
            <Header currentPage="our-journey" />

            {/* ════════════════════  Hero Section  ════════════════════ */}
            <section
                className="relative overflow-hidden py-28 lg:py-36"
                style={{
                    background: isLight
                        ? 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 50%, #F0F9FF 100%)'
                        : 'linear-gradient(135deg, #0B1121 0%, #1a2744 50%, #0B1121 100%)',
                }}
            >
                {/* Background decorations */}
                <div
                    className="absolute top-0 left-0 w-96 h-96 rounded-full"
                    style={{
                        opacity: isLight ? 0.06 : 0.1,
                        background: 'radial-gradient(circle, #06B6D4, transparent 70%)',
                        filter: 'blur(80px)',
                        transform: 'translate(-30%, -30%)',
                    }}
                ></div>
                <div
                    className="absolute bottom-0 right-0 w-96 h-96 rounded-full"
                    style={{
                        opacity: isLight ? 0.06 : 0.1,
                        background: 'radial-gradient(circle, #2563EB, transparent 70%)',
                        filter: 'blur(80px)',
                        transform: 'translate(30%, 30%)',
                    }}
                ></div>

                {/* Floating particles */}
                <div
                    className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full"
                    style={{ background: '#06B6D4', opacity: isLight ? 0.15 : 0.3, animation: 'float 6s ease-in-out infinite' }}
                ></div>
                <div
                    className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full"
                    style={{ background: '#2563EB', opacity: isLight ? 0.1 : 0.2, animation: 'float 8s ease-in-out infinite reverse' }}
                ></div>
                <div
                    className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 rounded-full"
                    style={{ background: '#8B5CF6', opacity: isLight ? 0.15 : 0.3, animation: 'float 7s ease-in-out infinite 1s' }}
                ></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div
                        className="inline-flex items-center px-4 py-2 rounded-full mb-8"
                        style={{
                            background: isLight ? 'rgba(6, 182, 212, 0.06)' : 'rgba(6, 182, 212, 0.1)',
                            border: '1px solid rgba(6, 182, 212, 0.2)',
                            animation: 'fadeInUp 0.8s ease-out',
                        }}
                    >
                        <svg className="w-4 h-4 mr-2" style={{ color: '#06B6D4' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span style={{ color: '#06B6D4' }} className="text-sm font-semibold tracking-wider uppercase">
                            {heroContent.badgeText}
                        </span>
                    </div>

                    <h1
                        className="text-5xl lg:text-7xl font-bold mb-6"
                        style={{
                            background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-0.03em',
                            animation: 'fadeInUp 0.8s ease-out 0.1s both',
                        }}
                    >
                        {heroContent.title}
                    </h1>

                    <div
                        className="w-24 h-1 mx-auto rounded-full mb-8"
                        style={{
                            background: 'linear-gradient(90deg, #06B6D4, #2563EB)',
                            animation: 'fadeInUp 0.8s ease-out 0.2s both',
                        }}
                    ></div>

                    <p
                        className="text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed font-medium"
                        style={{
                            color: isLight ? '#475569' : 'rgba(255, 255, 255, 0.7)',
                            animation: 'fadeInUp 0.8s ease-out 0.3s both',
                        }}
                    >
                        {heroContent.description}
                    </p>

                    {/* Stats row */}
                    <div
                        className="flex flex-wrap justify-center gap-8 lg:gap-16 mt-12"
                        style={{ animation: 'fadeInUp 0.8s ease-out 0.5s both' }}
                    >
                        {[
                            { value: heroContent.stat1Value, label: heroContent.stat1Label },
                            { value: heroContent.stat2Value, label: heroContent.stat2Label },
                            { value: heroContent.stat3Value, label: heroContent.stat3Label },
                            { value: heroContent.stat4Value, label: heroContent.stat4Label },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div
                                    className="text-3xl lg:text-4xl font-black"
                                    style={{
                                        background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    {stat.value}
                                </div>
                                <div
                                    className="text-xs lg:text-sm mt-1"
                                    style={{ color: isLight ? '#94A3B8' : 'rgba(255, 255, 255, 0.5)' }}
                                >
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════  Timeline Section  ════════════════════ */}
            <section
                className="py-20 lg:py-28 relative"
                style={{
                    background: isLight
                        ? 'linear-gradient(180deg, #F8FBFF 0%, #EFF6FF 50%, #F8FBFF 100%)'
                        : 'linear-gradient(180deg, #0B1121 0%, #111d36 50%, #0B1121 100%)',
                }}
            >
                {/* Vertical center line (desktop only) */}
                <div
                    className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5"
                    style={{
                        background: isLight
                            ? 'linear-gradient(180deg, transparent, rgba(6, 182, 212, 0.15) 10%, rgba(6, 182, 212, 0.15) 90%, transparent)'
                            : 'linear-gradient(180deg, transparent, rgba(6, 182, 212, 0.2) 10%, rgba(6, 182, 212, 0.2) 90%, transparent)',
                        transform: 'translateX(-50%)',
                    }}
                ></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    {eraGroups.map((group, groupIndex) => (
                        <div key={groupIndex}>
                            {group.era && <EraSection era={group.era} isLight={isLight} />}
                            {group.items.map((milestone) => {
                                // Calculate the global index for alternating
                                const globalIndex = milestones.findIndex((m) => m.number === milestone.number);
                                return (
                                    <TimelineCard
                                        key={milestone.number}
                                        milestone={milestone}
                                        index={globalIndex}
                                        isLight={isLight}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </section>

            {/* ════════════════════  CTA Section  ════════════════════ */}
            <section className="py-20 relative overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        background: isLight
                            ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.04), rgba(37, 99, 235, 0.04))'
                            : 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(37, 99, 235, 0.1))',
                    }}
                ></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h2
                        className="text-4xl lg:text-5xl font-bold mb-6"
                        style={{ color: isLight ? '#0F172A' : '#fff' }}
                    >
                        {ctaContent.title.split(' ').slice(0, -1).join(' ')}{' '}
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            {ctaContent.title.split(' ').slice(-1)[0]}
                        </span>
                    </h2>
                    <p
                        className="text-xl mb-10"
                        style={{ color: isLight ? '#64748B' : 'rgba(255, 255, 255, 0.6)' }}
                    >
                        {ctaContent.description}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="/contact"
                            className="px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all duration-300 hover:shadow-lg hover:scale-105"
                            style={{
                                background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
                            }}
                        >
                            {ctaContent.button1Text}
                        </a>
                        <a
                            href="/about"
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
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
