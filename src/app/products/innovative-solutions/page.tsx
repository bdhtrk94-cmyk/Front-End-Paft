'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme } from '@/context/ThemeContext';

/* ─── Intersection Observer Hook ─── */
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

/* ─── Hero Section ─── */
function HeroSection({ isLight }: { isLight: boolean }) {
    const { ref, visible } = useInView(0.2);

    return (
        <section
            ref={ref}
            className="relative overflow-hidden flex items-center justify-center"
            style={{
                minHeight: '65vh',
                backgroundImage: 'url(https://paft.eg/wp-content/uploads/2025/10/Hero-Section.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {/* Overlay */}
            <div
                className="absolute inset-0"
                style={{
                    background: isLight
                        ? 'linear-gradient(to bottom, rgba(248, 251, 255, 0.4) 0%, rgba(248, 251, 255, 0.5) 40%, rgba(248, 251, 255, 0.8) 100%)'
                        : 'linear-gradient(to bottom, rgba(11, 17, 33, 0.3) 0%, rgba(11, 17, 33, 0.3) 40%, rgba(11, 17, 33, 0.7) 100%)',
                }}
            />

            {/* Text */}
            <div className="relative z-10 text-center px-4">
                <h1
                    className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight"
                    style={{
                        color: isLight ? '#0F172A' : '#fff',
                        letterSpacing: '0.04em',
                        lineHeight: '1.2',
                        textShadow: isLight ? '0 4px 30px rgba(255,255,255,0.5)' : '0 4px 30px rgba(0, 0, 0, 0.5)',
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.97)',
                        transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                >
                    WE BRING{' '}
                    <span
                        style={{
                            background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 2px 10px rgba(6, 182, 212, 0.4))',
                        }}
                    >
                        INNOVATION
                    </span>
                    <br />
                    TO SUPPLY CHAIN
                </h1>
            </div>
        </section>
    );
}

/* ─── Smart Pallets Section ─── */
function SmartPalletsSection({ isLight }: { isLight: boolean }) {
    const { ref, visible } = useInView(0.1);
    const [imgHovered, setImgHovered] = useState(false);

    return (
        <section
            ref={ref}
            id="smart-pallets"
            className="py-20 lg:py-28"
            style={{ background: isLight ? '#EFF6FF' : '#0d1526' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
                    {/* Text */}
                    <div
                        className="flex-1"
                        style={{
                            opacity: visible ? 1 : 0,
                            transform: visible ? 'translateX(0)' : 'translateX(-40px)',
                            transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{
                                    background: 'rgba(6, 182, 212, 0.1)',
                                    border: '1px solid rgba(6, 182, 212, 0.2)',
                                }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="#06B6D4" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <span className="text-sm font-bold tracking-widest uppercase" style={{ color: '#06B6D4' }}>
                                Smart Plastic Pallets
                            </span>
                        </div>

                        <h2 className="text-3xl lg:text-4xl font-bold mb-8" style={{ color: isLight ? '#0F172A' : '#fff', letterSpacing: '-0.02em' }}>
                            Intelligent{' '}
                            <span
                                style={{
                                    background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Logistics Assets
                            </span>
                        </h2>

                        <p className="text-base leading-relaxed mb-6" style={{ color: isLight ? '#475569' : 'rgba(255, 255, 255, 0.65)' }}>
                            PAFT Smart Plastic Pallets are designed as intelligent logistics assets. Each pallet carries a unique
                            RFID identity that stores and transmits its full lifecycle data, transforming traditional pallets into
                            smart, trackable units within the warehouse ecosystem.
                        </p>

                        {/* Feature pills */}
                        <div className="flex flex-wrap gap-3 mt-6">
                            {['Full Life Traceability', 'RFID-Enabled', 'Real-Time Tracking', 'ERP Integration'].map((f, i) => (
                                <span
                                    key={i}
                                    className="px-4 py-2 rounded-full text-sm font-medium"
                                    style={{
                                        background: isLight ? 'rgba(6, 182, 212, 0.06)' : 'rgba(6, 182, 212, 0.1)',
                                        color: '#06B6D4',
                                        border: `1px solid ${isLight ? 'rgba(6, 182, 212, 0.15)' : 'rgba(6, 182, 212, 0.2)'}`,
                                    }}
                                >
                                    ✓ {f}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Image */}
                    <div
                        className="flex-1 flex justify-center"
                        style={{
                            opacity: visible ? 1 : 0,
                            transform: visible ? 'translateX(0)' : 'translateX(40px)',
                            transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
                        }}
                    >
                        <div
                            className="relative rounded-2xl overflow-hidden"
                            style={{
                                boxShadow: imgHovered
                                    ? isLight ? '0 30px 80px rgba(0,0,0,0.15), 0 0 40px rgba(6,182,212,0.06)' : '0 30px 80px rgba(0, 0, 0, 0.5), 0 0 40px rgba(6, 182, 212, 0.1)'
                                    : isLight ? '0 20px 60px rgba(0,0,0,0.1)' : '0 20px 60px rgba(0, 0, 0, 0.4)',
                                transform: imgHovered ? 'scale(1.02)' : 'scale(1)',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                            onMouseEnter={() => setImgHovered(true)}
                            onMouseLeave={() => setImgHovered(false)}
                        >
                            <div className="absolute inset-0 rounded-2xl z-10 pointer-events-none"
                                style={{ border: `1px solid ${isLight ? 'rgba(6,182,212,0.1)' : 'rgba(6, 182, 212, 0.15)'}` }}
                            />
                            <img
                                src="https://paft.eg/wp-content/uploads/2026/01/iwms-system-diagram.jpg"
                                alt="PAFT Smart Plastic Pallets with embedded RFID technology"
                                className="w-full h-auto object-cover"
                                style={{ maxWidth: '550px', minHeight: '280px' }}
                            />
                            <div className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
                                style={{ background: isLight ? 'linear-gradient(to top, rgba(255,255,255,0.6), transparent)' : 'linear-gradient(to top, rgba(11, 17, 33, 0.6), transparent)' }}
                            />
                            <div className="absolute bottom-4 left-4 right-4 text-xs font-medium z-20" style={{ color: isLight ? '#64748B' : 'rgba(255,255,255,0.5)' }}>
                                PAFT Smart Plastic Pallets with embedded RFID technology
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─── Tech Card ─── */
function TechCard({ card, index, visible, isLight }: {
    card: { title: string; description: string; icon: React.ReactNode; accent: string };
    index: number;
    visible: boolean;
    isLight: boolean;
}) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="relative rounded-2xl p-8 lg:p-10 flex flex-col items-center text-center cursor-pointer"
            style={{
                background: hovered
                    ? isLight ? 'rgba(255,255,255,0.95)' : 'rgba(30, 41, 59, 0.7)'
                    : isLight ? 'rgba(255,255,255,0.85)' : 'rgba(30, 41, 59, 0.4)',
                backdropFilter: 'blur(12px)',
                borderTop: `3px solid ${card.accent}`,
                borderLeft: `1px solid ${hovered ? card.accent + '30' : isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255, 255, 255, 0.06)'}`,
                borderRight: `1px solid ${hovered ? card.accent + '30' : isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255, 255, 255, 0.06)'}`,
                borderBottom: `1px solid ${hovered ? card.accent + '30' : isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255, 255, 255, 0.06)'}`,
                boxShadow: hovered
                    ? isLight ? `0 25px 60px rgba(0,0,0,0.08), 0 0 25px ${card.accent}08` : `0 25px 60px rgba(0,0,0,0.4), 0 0 30px ${card.accent}10`
                    : isLight ? '0 4px 24px rgba(0,0,0,0.04)' : '0 4px 24px rgba(0,0,0,0.2)',
                transform: hovered
                    ? 'translateY(-8px) scale(1.02)'
                    : visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(1)',
                opacity: visible ? 1 : 0,
                transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.12}s`,
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div
                className="rounded-2xl flex items-center justify-center mb-6"
                style={{
                    width: '72px',
                    height: '72px',
                    background: `${card.accent}15`,
                    color: card.accent,
                    border: `1px solid ${card.accent}25`,
                    boxShadow: hovered ? `0 8px 30px ${card.accent}20` : 'none',
                    transition: 'all 0.3s ease',
                }}
            >
                {card.icon}
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ color: isLight ? '#0F172A' : '#fff' }}>{card.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: isLight ? '#64748B' : 'rgba(255, 255, 255, 0.55)' }}>{card.description}</p>

            <div
                className="absolute top-0 right-0 w-24 h-24"
                style={{
                    opacity: isLight ? 0.03 : 0.05,
                    background: `linear-gradient(135deg, ${card.accent}, transparent)`,
                    borderBottomLeftRadius: '100%',
                }}
            />
        </div>
    );
}

/* ─── RFID Technology Cards ─── */
function RFIDTechSection({ isLight }: { isLight: boolean }) {
    const { ref, visible } = useInView(0.1);

    const techCards = [
        {
            title: 'RFID Tags',
            description: 'Embedded RFID tags provide unique identification and real-time tracking for every pallet.',
            icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
            ),
            accent: '#06B6D4',
        },
        {
            title: 'Readers & Antennas',
            description: 'Installed on forklifts, racks, aisles, and gates to capture movement automatically.',
            icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0" />
                </svg>
            ),
            accent: '#2563EB',
        },
        {
            title: 'Cloud iWMS Platform',
            description: 'All RFID data is processed instantly through PAFT iWMS with ERP synchronization.',
            icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
            ),
            accent: '#8B5CF6',
        },
    ];

    return (
        <section
            ref={ref}
            className="py-20 lg:py-28"
            style={{ background: isLight ? '#F8FBFF' : '#0B1121' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className="text-center mb-16"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.7s ease',
                    }}
                >
                    <h2 className="text-3xl lg:text-5xl font-bold mb-4" style={{ color: isLight ? '#0F172A' : '#fff' }}>
                        RFID Technology{' '}
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Integration
                        </span>
                    </h2>
                    <p className="text-lg max-w-2xl mx-auto" style={{ color: isLight ? '#94A3B8' : 'rgba(255, 255, 255, 0.5)' }}>
                        The core components powering our smart warehouse ecosystem
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {techCards.map((card, i) => (
                        <TechCard key={card.title} card={card} index={i} visible={visible} isLight={isLight} />
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Process Step ─── */
function ProcessStep({ step, index, visible, isLight }: {
    step: { number: number; title: string; description: string; accent: string };
    index: number;
    visible: boolean;
    isLight: boolean;
}) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="flex items-center gap-6 p-6 rounded-2xl cursor-pointer"
            style={{
                background: hovered
                    ? isLight ? 'rgba(255,255,255,0.9)' : 'rgba(30, 41, 59, 0.6)'
                    : isLight ? 'rgba(255,255,255,0.6)' : 'rgba(30, 41, 59, 0.3)',
                border: `1px solid ${hovered ? step.accent + '30' : isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255, 255, 255, 0.06)'}`,
                transform: hovered
                    ? 'translateX(12px)'
                    : visible ? 'translateX(0)' : 'translateX(-30px)',
                opacity: visible ? 1 : 0,
                boxShadow: hovered
                    ? isLight ? `0 10px 30px rgba(0,0,0,0.06), 0 0 20px ${step.accent}05` : `0 10px 30px rgba(0,0,0,0.3), 0 0 20px ${step.accent}08`
                    : 'none',
                backdropFilter: 'blur(10px)',
                transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s`,
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div
                className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white"
                style={{
                    background: `linear-gradient(135deg, ${step.accent}, ${step.accent}cc)`,
                    boxShadow: `0 8px 20px ${step.accent}40`,
                }}
            >
                {step.number}
            </div>

            <div className="flex-1">
                <h4 className="text-lg font-bold mb-1" style={{ color: isLight ? '#0F172A' : '#fff' }}>{step.title}</h4>
                <p className="text-sm" style={{ color: isLight ? '#64748B' : 'rgba(255, 255, 255, 0.55)' }}>{step.description}</p>
            </div>

            <svg
                className="w-5 h-5 flex-shrink-0 transition-transform duration-300"
                style={{
                    color: step.accent,
                    opacity: hovered ? 1 : 0.3,
                    transform: hovered ? 'translateX(4px)' : 'translateX(0)',
                }}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </div>
    );
}

/* ─── Process Flow Section ─── */
function ProcessFlowSection({ isLight }: { isLight: boolean }) {
    const { ref, visible } = useInView(0.1);

    const steps = [
        { number: 1, title: 'Smart Pallets', description: 'Each plastic pallet is RFID-enabled, providing full life traceability.', accent: '#06B6D4' },
        { number: 2, title: 'Smart Forklifts', description: 'Automatic reading of pallets during handling without manual scanning.', accent: '#2563EB' },
        { number: 3, title: 'Smart Racks & Aisles', description: 'Instant location tracking and optimized storage management.', accent: '#8B5CF6' },
        { number: 4, title: 'Smart Gates', description: 'Accurate inbound and outbound recording at warehouse gates.', accent: '#10B981' },
        { number: 5, title: 'ERP Integration', description: 'Real-time synchronization between iWMS and ERP systems.', accent: '#F59E0B' },
    ];

    return (
        <section
            ref={ref}
            className="py-20 lg:py-28"
            style={{ background: isLight ? '#EFF6FF' : '#0d1526' }}
        >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className="text-center mb-16"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.7s ease',
                    }}
                >
                    <h2 className="text-3xl lg:text-5xl font-bold mb-4" style={{ color: isLight ? '#0F172A' : '#fff' }}>
                        How PAFT iWMS{' '}
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Works
                        </span>
                    </h2>
                    <p className="text-lg max-w-2xl mx-auto" style={{ color: isLight ? '#94A3B8' : 'rgba(255, 255, 255, 0.5)' }}>
                        A seamless 5-step process from pallet to ERP
                    </p>
                </div>

                <div className="space-y-5">
                    {steps.map((step, i) => (
                        <ProcessStep key={step.number} step={step} index={i} visible={visible} isLight={isLight} />
                    ))}
                </div>

                {/* Second diagram image */}
                <div
                    className="mt-16 rounded-2xl overflow-hidden"
                    style={{
                        border: `1px solid ${isLight ? 'rgba(6,182,212,0.1)' : 'rgba(6, 182, 212, 0.15)'}`,
                        boxShadow: isLight
                            ? '0 20px 60px rgba(0,0,0,0.08), 0 0 30px rgba(6, 182, 212, 0.03)'
                            : '0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(6, 182, 212, 0.05)',
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
                        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
                    }}
                >
                    <img
                        src="https://paft.eg/wp-content/uploads/2026/01/smart-pallets-rfid.png"
                        alt="PAFT iWMS connecting pallets, racks, forklifts, gates, and ERP"
                        className="w-full h-auto block"
                    />
                    <div
                        className="p-4 text-center text-sm font-medium"
                        style={{
                            color: isLight ? '#64748B' : 'rgba(255,255,255,0.5)',
                            background: isLight ? 'rgba(240,249,255,0.9)' : 'rgba(15, 23, 42, 0.8)',
                        }}
                    >
                        PAFT iWMS connecting pallets, racks, forklifts, gates, and ERP
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─── Business Impact Section ─── */
function BusinessImpactSection({ isLight }: { isLight: boolean }) {
    const { ref, visible } = useInView(0.1);

    return (
        <section
            ref={ref}
            className="py-20 lg:py-28"
            style={{ background: isLight ? '#F8FBFF' : '#0B1121' }}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className="text-center mb-16"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.7s ease',
                    }}
                >
                    <h2 className="text-3xl lg:text-5xl font-bold mb-4" style={{ color: isLight ? '#0F172A' : '#fff' }}>
                        Business{' '}
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Impact
                        </span>
                    </h2>
                    <p className="text-lg max-w-3xl mx-auto" style={{ color: isLight ? '#64748B' : 'rgba(255, 255, 255, 0.55)' }}>
                        PAFT iWMS enables real-time inventory tracking, improved accuracy, reduced labor costs, faster
                        operations, and full warehouse visibility—positioning PAFT as a leader in smart pallet and warehouse
                        automation solutions.
                    </p>
                </div>

                <div
                    className="grid grid-cols-2 lg:grid-cols-4 gap-6"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.8s ease 0.2s',
                    }}
                >
                    {[
                        { label: 'Inventory Accuracy', value: '99.9%', accent: '#06B6D4' },
                        { label: 'Faster Operations', value: '3×', accent: '#2563EB' },
                        { label: 'Cost Reduction', value: '40%', accent: '#10B981' },
                        { label: 'Full Visibility', value: '100%', accent: '#8B5CF6' },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center py-8 rounded-2xl"
                            style={{
                                background: isLight ? 'rgba(255,255,255,0.85)' : 'rgba(30, 41, 59, 0.4)',
                                border: `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255, 255, 255, 0.06)'}`,
                                boxShadow: isLight ? '0 4px 16px rgba(0,0,0,0.03)' : 'none',
                                backdropFilter: 'blur(10px)',
                            }}
                        >
                            <div
                                className="text-4xl lg:text-5xl font-bold mb-2"
                                style={{
                                    background: `linear-gradient(135deg, ${stat.accent}, ${stat.accent}cc)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                {stat.value}
                            </div>
                            <div className="text-sm font-medium" style={{ color: isLight ? '#94A3B8' : 'rgba(255, 255, 255, 0.5)' }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── RFID Understanding Section ─── */
function RFIDUnderstandingSection({ isLight }: { isLight: boolean }) {
    const { ref, visible } = useInView(0.1);
    const [imgHovered, setImgHovered] = useState(false);

    return (
        <section
            ref={ref}
            className="py-20 lg:py-28"
            style={{ background: isLight ? '#EFF6FF' : '#0d1526' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
                    {/* Image first on desktop */}
                    <div
                        className="flex-1 flex justify-center order-2 lg:order-1"
                        style={{
                            opacity: visible ? 1 : 0,
                            transform: visible ? 'translateX(0)' : 'translateX(-40px)',
                            transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                    >
                        <div
                            className="relative rounded-2xl overflow-hidden"
                            style={{
                                boxShadow: imgHovered
                                    ? isLight ? '0 30px 80px rgba(0,0,0,0.12)' : '0 30px 80px rgba(0, 0, 0, 0.5), 0 0 40px rgba(6, 182, 212, 0.1)'
                                    : isLight ? '0 20px 60px rgba(0,0,0,0.08)' : '0 20px 60px rgba(0, 0, 0, 0.4)',
                                transform: imgHovered ? 'scale(1.02)' : 'scale(1)',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                            onMouseEnter={() => setImgHovered(true)}
                            onMouseLeave={() => setImgHovered(false)}
                        >
                            <div className="absolute inset-0 rounded-2xl z-10 pointer-events-none"
                                style={{ border: `1px solid ${isLight ? 'rgba(6,182,212,0.08)' : 'rgba(6, 182, 212, 0.15)'}` }}
                            />
                            <img
                                src="https://paft.eg/wp-content/uploads/2026/01/Picture3.jpg"
                                alt="How RFID technology works in warehouse environments"
                                className="w-full h-auto object-cover"
                                style={{ maxWidth: '550px', minHeight: '280px' }}
                            />
                            <div className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
                                style={{ background: isLight ? 'linear-gradient(to top, rgba(255,255,255,0.5), transparent)' : 'linear-gradient(to top, rgba(13, 21, 38, 0.6), transparent)' }}
                            />
                            <div className="absolute bottom-4 left-4 right-4 text-xs font-medium z-20" style={{ color: isLight ? '#64748B' : 'rgba(255,255,255,0.5)' }}>
                                How RFID technology works in warehouse environments
                            </div>
                        </div>
                    </div>

                    {/* Text */}
                    <div
                        className="flex-1 order-1 lg:order-2"
                        style={{
                            opacity: visible ? 1 : 0,
                            transform: visible ? 'translateX(0)' : 'translateX(40px)',
                            transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
                        }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ background: 'rgba(37, 99, 235, 0.1)', border: '1px solid rgba(37, 99, 235, 0.2)' }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="#2563EB" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0" />
                                </svg>
                            </div>
                            <span className="text-sm font-bold tracking-widest uppercase" style={{ color: '#2563EB' }}>
                                Understanding RFID
                            </span>
                        </div>

                        <h2 className="text-3xl lg:text-4xl font-bold mb-8" style={{ color: isLight ? '#0F172A' : '#fff', letterSpacing: '-0.02em' }}>
                            Radio Frequency{' '}
                            <span style={{
                                background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                Identification
                            </span>
                        </h2>

                        <div className="space-y-5">
                            <p className="text-base leading-relaxed" style={{ color: isLight ? '#475569' : 'rgba(255, 255, 255, 0.65)' }}>
                                Radio Frequency Identification (RFID) technology uses electromagnetic fields to automatically identify
                                and track tags attached to objects. This technology significantly enhances the visibility and traceability
                                of inventory items, making it an essential tool for modern warehouses.
                            </p>
                            <p className="text-base leading-relaxed" style={{ color: isLight ? '#475569' : 'rgba(255, 255, 255, 0.65)' }}>
                                Unlike traditional barcode systems that require line-of-sight scanning, RFID enables contactless reading
                                of multiple items simultaneously. This capability dramatically speeds up inventory counts and reduces
                                human error, allowing warehouse staff to focus on higher-value tasks while the system handles tracking
                                automatically.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─── Challenges & Considerations Section ─── */
function ChallengesSection({ isLight }: { isLight: boolean }) {
    const { ref, visible } = useInView(0.1);
    const [imgHovered, setImgHovered] = useState(false);

    return (
        <section
            ref={ref}
            className="py-20 lg:py-28"
            style={{ background: isLight ? '#F8FBFF' : '#0B1121' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
                    {/* Text */}
                    <div
                        className="flex-1"
                        style={{
                            opacity: visible ? 1 : 0,
                            transform: visible ? 'translateX(0)' : 'translateX(-40px)',
                            transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)' }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="#8B5CF6" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <span className="text-sm font-bold tracking-widest uppercase" style={{ color: '#8B5CF6' }}>
                                Challenges &amp; Considerations
                            </span>
                        </div>

                        <h2 className="text-3xl lg:text-4xl font-bold mb-8" style={{ color: isLight ? '#0F172A' : '#fff', letterSpacing: '-0.02em' }}>
                            Implementation{' '}
                            <span style={{
                                background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                Success
                            </span>
                        </h2>

                        <div className="space-y-5">
                            <p className="text-base leading-relaxed" style={{ color: isLight ? '#475569' : 'rgba(255, 255, 255, 0.65)' }}>
                                While the PAFT iWMS offers numerous advantages, businesses must consider potential challenges such as
                                initial setup costs and training requirements. Understanding these factors is crucial for a successful
                                implementation and maximizing benefits.
                            </p>
                            <p className="text-base leading-relaxed" style={{ color: isLight ? '#475569' : 'rgba(255, 255, 255, 0.65)' }}>
                                However, the long-term ROI typically outweighs these initial investments. PAFT provides comprehensive
                                onboarding support and training programs to ensure your team is fully equipped to leverage the system&apos;s
                                capabilities from day one.
                            </p>
                        </div>

                        {/* Highlight box */}
                        <div
                            className="mt-8 p-5 rounded-xl"
                            style={{
                                background: isLight ? 'rgba(139, 92, 246, 0.04)' : 'rgba(139, 92, 246, 0.05)',
                                borderLeft: '3px solid #8B5CF6',
                                borderTop: isLight ? '1px solid rgba(139, 92, 246, 0.08)' : 'none',
                                borderRight: isLight ? '1px solid rgba(139, 92, 246, 0.08)' : 'none',
                                borderBottom: isLight ? '1px solid rgba(139, 92, 246, 0.08)' : 'none',
                            }}
                        >
                            <p className="text-base font-medium italic" style={{ color: isLight ? '#334155' : 'rgba(255, 255, 255, 0.8)' }}>
                                &ldquo;PAFT provides comprehensive onboarding support to ensure your team is fully equipped from day one.&rdquo;
                            </p>
                        </div>
                    </div>

                    {/* Image */}
                    <div
                        className="flex-1 flex justify-center"
                        style={{
                            opacity: visible ? 1 : 0,
                            transform: visible ? 'translateX(0)' : 'translateX(40px)',
                            transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
                        }}
                    >
                        <div
                            className="relative rounded-2xl overflow-hidden"
                            style={{
                                boxShadow: imgHovered
                                    ? isLight ? '0 30px 80px rgba(0,0,0,0.12)' : '0 30px 80px rgba(0, 0, 0, 0.5), 0 0 40px rgba(139, 92, 246, 0.1)'
                                    : isLight ? '0 20px 60px rgba(0,0,0,0.08)' : '0 20px 60px rgba(0, 0, 0, 0.4)',
                                transform: imgHovered ? 'scale(1.02)' : 'scale(1)',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                            onMouseEnter={() => setImgHovered(true)}
                            onMouseLeave={() => setImgHovered(false)}
                        >
                            <div className="absolute inset-0 rounded-2xl z-10 pointer-events-none"
                                style={{ border: `1px solid ${isLight ? 'rgba(139,92,246,0.08)' : 'rgba(139, 92, 246, 0.15)'}` }}
                            />
                            <img
                                src="https://paft.eg/wp-content/uploads/2026/01/Picture6.jpg"
                                alt="Key considerations for successful iWMS implementation"
                                className="w-full h-auto object-cover"
                                style={{ maxWidth: '550px', minHeight: '280px' }}
                            />
                            <div className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
                                style={{ background: isLight ? 'linear-gradient(to top, rgba(255,255,255,0.5), transparent)' : 'linear-gradient(to top, rgba(11, 17, 33, 0.6), transparent)' }}
                            />
                            <div className="absolute bottom-4 left-4 right-4 text-xs font-medium z-20" style={{ color: isLight ? '#64748B' : 'rgba(255,255,255,0.5)' }}>
                                Key considerations for successful iWMS implementation
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─── Conclusion / CTA Section ─── */
function ConclusionSection({ isLight }: { isLight: boolean }) {
    const { ref, visible } = useInView(0.1);
    const [imgHovered, setImgHovered] = useState(false);

    return (
        <section
            ref={ref}
            className="py-20 lg:py-28 relative overflow-hidden"
            style={{ background: isLight ? '#EFF6FF' : '#0d1526' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Heading */}
                <div
                    className="text-center mb-12"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.7s ease',
                    }}
                >
                    <h2 className="text-3xl lg:text-5xl font-bold mb-6" style={{ color: isLight ? '#0F172A' : '#fff' }}>
                        Transform Your{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Operations
                        </span>
                    </h2>
                    <p className="text-lg max-w-3xl mx-auto mb-4" style={{ color: isLight ? '#64748B' : 'rgba(255, 255, 255, 0.6)' }}>
                        The PAFT iWMS with RFID technology revolutionizes inventory management. By embracing
                        this innovative solution, businesses can achieve unprecedented levels of efficiency, accuracy, and
                        operational excellence in their warehouse operations.
                    </p>
                    <p className="text-lg max-w-3xl mx-auto" style={{ color: isLight ? '#64748B' : 'rgba(255, 255, 255, 0.6)' }}>
                        From real-time tracking to seamless ERP integration, PAFT provides a complete ecosystem that transforms
                        how you manage inventory. Take the first step towards smarter warehouse management.
                    </p>
                </div>

                {/* Final image */}
                <div
                    className="max-w-4xl mx-auto mb-16"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
                        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
                    }}
                >
                    <div
                        className="relative rounded-2xl overflow-hidden"
                        style={{
                            boxShadow: imgHovered
                                ? isLight ? '0 30px 80px rgba(0,0,0,0.12)' : '0 30px 80px rgba(0, 0, 0, 0.5), 0 0 40px rgba(6, 182, 212, 0.1)'
                                : isLight ? '0 20px 60px rgba(0,0,0,0.08)' : '0 20px 60px rgba(0, 0, 0, 0.4)',
                            transform: imgHovered ? 'scale(1.01)' : 'scale(1)',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            border: `1px solid ${isLight ? 'rgba(6,182,212,0.08)' : 'rgba(6, 182, 212, 0.15)'}`,
                        }}
                        onMouseEnter={() => setImgHovered(true)}
                        onMouseLeave={() => setImgHovered(false)}
                    >
                        <img
                            src="https://paft.eg/wp-content/uploads/2026/01/Picture5.jpg"
                            alt="Transform your warehouse operations with PAFT iWMS"
                            className="w-full h-auto block"
                        />
                        <div
                            className="p-4 text-center text-sm font-medium"
                            style={{
                                color: isLight ? '#64748B' : 'rgba(255,255,255,0.5)',
                                background: isLight ? 'rgba(240,249,255,0.9)' : 'rgba(15, 23, 42, 0.8)',
                            }}
                        >
                            Transform your warehouse operations with PAFT iWMS
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div
                    className="text-center"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.8s ease 0.3s',
                    }}
                >
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="/contact"
                            className="px-10 py-4 rounded-xl font-semibold text-lg text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:scale-105"
                            style={{
                                background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
                            }}
                        >
                            Request a Demo →
                        </a>
                        <a
                            href="/products"
                            className="px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105"
                            style={{
                                border: isLight ? '2px solid rgba(15, 23, 42, 0.15)' : '2px solid rgba(255, 255, 255, 0.2)',
                                color: isLight ? '#334155' : 'rgba(255, 255, 255, 0.8)',
                                background: isLight ? 'rgba(255,255,255,0.6)' : 'transparent',
                                backdropFilter: 'blur(10px)',
                            }}
                        >
                            Explore Products
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─── Main Page ─── */
export default function InnovativeSolutions() {
    const { theme } = useTheme();
    const isLight = theme === 'light';

    return (
        <div className="min-h-screen" style={{ background: isLight ? '#F8FBFF' : '#0B1121' }}>
            <Header currentPage="innovative-solutions" />
            <HeroSection isLight={isLight} />
            <SmartPalletsSection isLight={isLight} />
            <RFIDTechSection isLight={isLight} />
            <ProcessFlowSection isLight={isLight} />
            <BusinessImpactSection isLight={isLight} />
            <RFIDUnderstandingSection isLight={isLight} />
            <ChallengesSection isLight={isLight} />
            <ConclusionSection isLight={isLight} />
            <Footer />
        </div>
    );
}