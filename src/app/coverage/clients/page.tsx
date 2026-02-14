'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme } from '@/context/ThemeContext';

/* ─── Intersection Observer Hook ─── */
function useInView(threshold = 0.1) {
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

/* ─── Client Logo Data ─── */
const clientLogos = [
    'https://paft.eg/wp-content/uploads/2025/10/download__5_-removebg-preview-1.png',
    'https://paft.eg/wp-content/uploads/2025/10/Juhayna_Food_Industries_Logo-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/10/download__8_-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/images__1_-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/regina-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/sidor-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/10/download__6_-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/interpack-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/givudan-removebg-preview-3.png',
    'https://paft.eg/wp-content/uploads/2025/06/chain.lait-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/beyti-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/حلوالشام-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/safola-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/rayhan-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/orion-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/OIP-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/lamar-removebg-preview-1.png',
    'https://paft.eg/wp-content/uploads/2025/06/lactalis-removebg-preview-1-1.png',
    'https://paft.eg/wp-content/uploads/2025/06/indevco-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/judi-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/ifff-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/faragello-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/Evafarma-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/download-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/danone-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/07/download__7_-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/daherFoods-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/farm-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/kondarina-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/farom-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/se_ilo-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/akzono_jpg-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/kellogg_s_-removebg-preview-1.png',
    'https://paft.eg/wp-content/uploads/2025/06/suger-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/afea-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/magrabl-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/ropak-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/otsuka-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/kanadia-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/biscomisr-removebg-preview.png',
    'https://paft.eg/wp-content/uploads/2025/06/nabA-removebg-preview-1.png',
    'https://paft.eg/wp-content/uploads/2025/06/Amrekana-removebg-preview.png',
];

/* ─── Logo Card Component ─── */
function LogoCard({ url, index, visible, isLight }: { url: string; index: number; visible: boolean; isLight: boolean }) {
    const cardId = `logo-card-${index}`;
    return (
        <div
            className={`logo-card-${isLight ? 'light' : 'dark'} rounded-2xl flex items-center justify-center p-5`}
            style={{
                aspectRatio: '1',
                background: isLight ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255, 255, 255, 0.06)'}`,
                boxShadow: isLight ? '0 2px 12px rgba(0,0,0,0.03)' : 'none',
                backdropFilter: 'blur(10px)',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(15px)',
                transition: `opacity 0.5s ease ${Math.min(index * 0.02, 0.4)}s, transform 0.5s ease ${Math.min(index * 0.02, 0.4)}s, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease`,
            }}
        >
            <img
                src={url}
                alt={`Client Logo ${index + 1}`}
                className="w-4/5 h-4/5 object-contain"
                style={{ filter: isLight ? 'none' : 'brightness(0.95)' }}
            />

            <style jsx>{`
                .logo-card-light:hover {
                    border-color: rgba(6, 182, 212, 0.2) !important;
                    background: rgba(255,255,255,0.95) !important;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.06), 0 0 15px rgba(6,182,212,0.04) !important;
                    transform: translateY(-4px) !important;
                }
                .logo-card-dark:hover {
                    border-color: rgba(6, 182, 212, 0.25) !important;
                    background: rgba(255,255,255,0.08) !important;
                }
                .logo-card-light:hover img,
                .logo-card-dark:hover img {
                    filter: brightness(1.05) !important;
                }
            `}</style>
        </div>
    );
}

/* ─── Hero Section ─── */
function HeroSection({ isLight }: { isLight: boolean }) {
    const { ref, visible } = useInView(0.2);

    return (
        <section
            ref={ref}
            className="relative overflow-hidden flex items-center justify-center"
            style={{
                minHeight: '60vh',
                backgroundImage: 'url(https://paft.eg/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-24-at-12.57.33-PM.jpeg)',
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
                        ? 'linear-gradient(135deg, rgba(248,251,255,0.88) 0%, rgba(224,242,254,0.82) 50%, rgba(248,251,255,0.92) 100%)'
                        : 'linear-gradient(135deg, rgba(11,17,33,0.88) 0%, rgba(15,23,42,0.82) 50%, rgba(11,17,33,0.92) 100%)',
                }}
            />
            {/* Decorative gradient blurs */}
            <div
                className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full"
                style={{
                    opacity: isLight ? 0.05 : 0.15,
                    background: 'radial-gradient(circle, #06B6D4, transparent 70%)',
                    filter: 'blur(100px)',
                    transform: 'translate(-30%, -30%)',
                }}
            />
            <div
                className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full"
                style={{
                    opacity: isLight ? 0.04 : 0.1,
                    background: 'radial-gradient(circle, #8B5CF6, transparent 70%)',
                    filter: 'blur(100px)',
                    transform: 'translate(30%, 30%)',
                }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div
                    className="text-center max-w-4xl mx-auto"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(30px)',
                        transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                >
                    {/* Badge */}
                    <div
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold mb-6"
                        style={{
                            background: isLight ? 'rgba(6, 182, 212, 0.08)' : 'rgba(6, 182, 212, 0.15)',
                            border: `1px solid ${isLight ? 'rgba(6, 182, 212, 0.2)' : 'rgba(6, 182, 212, 0.3)'}`,
                            color: '#06B6D4',
                            backdropFilter: 'blur(8px)',
                        }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Trusted Worldwide
                    </div>

                    <h1
                        className="text-4xl lg:text-6xl font-bold mb-6"
                        style={{
                            color: isLight ? '#0F172A' : '#fff',
                            letterSpacing: '-0.03em',
                            lineHeight: '1.1',
                            textShadow: isLight ? '0 4px 20px rgba(255,255,255,0.4)' : '0 4px 20px rgba(0,0,0,0.4)',
                        }}
                    >
                        Our{' '}
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                filter: 'drop-shadow(0 2px 8px rgba(6, 182, 212, 0.3))',
                            }}
                        >
                            Clients
                        </span>
                    </h1>

                    <p
                        className="text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto"
                        style={{
                            color: isLight ? '#475569' : 'rgba(255, 255, 255, 0.75)',
                            textShadow: isLight ? 'none' : '0 2px 10px rgba(0,0,0,0.3)',
                        }}
                    >
                        Partnering with industry leaders across the Middle East, Africa, and beyond.
                        Over 40 brands trust PAFT for their logistics and packaging solutions.
                    </p>
                </div>
            </div>
        </section>
    );
}

/* ─── Stats Bar ─── */
function StatsBar({ isLight }: { isLight: boolean }) {
    const { ref, visible } = useInView(0.2);

    const stats = [
        { value: '42+', label: 'Trusted Clients' },
        { value: '15+', label: 'Countries Served' },
        { value: '10+', label: 'Years of Trust' },
        { value: '95%', label: 'Client Retention' },
    ];

    return (
        <section ref={ref} className="py-12" style={{ background: isLight ? '#EFF6FF' : '#0d1526' }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className="grid grid-cols-2 lg:grid-cols-4 gap-6"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.7s ease',
                    }}
                >
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center py-6 rounded-2xl"
                            style={{
                                background: isLight ? 'rgba(255,255,255,0.85)' : 'rgba(30, 41, 59, 0.4)',
                                border: `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255, 255, 255, 0.06)'}`,
                                boxShadow: isLight ? '0 4px 16px rgba(0,0,0,0.03)' : 'none',
                                backdropFilter: 'blur(10px)',
                            }}
                        >
                            <div
                                className="text-3xl lg:text-4xl font-bold mb-1"
                                style={{
                                    background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
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

/* ─── Gallery Grid ─── */
function GalleryGrid({ isLight }: { isLight: boolean }) {
    const { ref, visible } = useInView(0.05);

    return (
        <section ref={ref} className="py-16 lg:py-24" style={{ background: isLight ? '#F8FBFF' : '#0B1121' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section heading */}
                <div
                    className="text-center mb-14"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.7s ease',
                    }}
                >
                    <h2 className="text-3xl lg:text-4xl font-bold mb-3" style={{ color: isLight ? '#0F172A' : '#fff' }}>
                        Brands That{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Trust Us
                        </span>
                    </h2>
                    <p className="text-base max-w-xl mx-auto" style={{ color: isLight ? '#94A3B8' : 'rgba(255, 255, 255, 0.45)' }}>
                        From FMCG giants to industrial manufacturers
                    </p>
                </div>

                {/* Logo grid */}
                <div
                    className="grid gap-4 lg:gap-5"
                    style={{
                        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                    }}
                >
                    {clientLogos.map((url, i) => (
                        <LogoCard key={i} url={url} index={i} visible={visible} isLight={isLight} />
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── CTA Section ─── */
function CTASection({ isLight }: { isLight: boolean }) {
    const { ref, visible } = useInView(0.2);

    return (
        <section ref={ref} className="py-16 lg:py-20 relative overflow-hidden">
            <div
                className="absolute inset-0"
                style={{
                    background: isLight
                        ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.03), rgba(37, 99, 235, 0.03))'
                        : '#0d1526',
                }}
            />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <div
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.8s ease',
                    }}
                >
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: isLight ? '#0F172A' : '#fff' }}>
                        Ready to{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Join Them?
                        </span>
                    </h2>
                    <p className="text-lg mb-8" style={{ color: isLight ? '#64748B' : 'rgba(255, 255, 255, 0.55)' }}>
                        Become part of our growing network of industry leaders
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="/contact"
                            className="px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:scale-105"
                            style={{
                                background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
                            }}
                        >
                            Contact Us →
                        </a>
                        <a
                            href="/products"
                            className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105"
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
export default function ClientsPage() {
    const { theme } = useTheme();
    const isLight = theme === 'light';

    return (
        <div className="min-h-screen" style={{ background: isLight ? '#F8FBFF' : '#0B1121' }}>
            <Header currentPage="clients" />
            <HeroSection isLight={isLight} />
            <StatsBar isLight={isLight} />
            <GalleryGrid isLight={isLight} />
            <CTASection isLight={isLight} />
            <Footer />
        </div>
    );
}
