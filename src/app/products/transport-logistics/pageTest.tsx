'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

/* ─── Data ─── */
interface SpecRow {
    label: string;
    values: string[];
}

interface Product {
    id: string;
    title: string;
    subtitle?: string;
    image: string;
    features?: string[];
    specs?: {
        headers?: string[];
        rows: SpecRow[];
    };
    priceLabel?: string;
}

const products: Product[] = [
    {
        id: 'foldable-ibc',
        title: 'Foldable IBC - 1000 Lit',
        image: 'https://paft.eg/wp-content/uploads/2025/11/WhatsApp_Image_2025-11-25_at_5.14.27_PM-removebg-preview.png',
        specs: {
            headers: ['Types of Truck', '2.6m Standard Trailer', '3m Mega road train'],
            rows: [
                { label: 'IC 1040', values: ['208', '270'] },
                { label: 'Industry standard IBC', values: ['130', '180'] },
                { label: 'Improvement rate', values: ['60% More', '50% More'] },
            ],
        },
        priceLabel: 'On Call',
    },
    {
        id: 'rpc-6419',
        title: 'RPC 6419',
        subtitle: '600×400×195mm',
        image: 'https://paft.eg/wp-content/uploads/2026/02/WhatsApp_Image_2026-02-05_at_4.37.38_PM-removebg-preview.png',
        specs: {
            rows: [
                { label: 'External Dimension', values: ['600×400×195 mm'] },
                { label: 'Internal Dimension', values: ['576×376×180 mm'] },
                { label: 'Tare Weight', values: ['1.8 KG'] },
                { label: 'Volume Capacity', values: ['39 L'] },
                { label: 'Unit Load', values: ['20 KG'] },
            ],
        },
        priceLabel: 'On Call',
    },
    {
        id: 'rpc-6422',
        title: 'RPC 6422',
        subtitle: '600×400×225mm',
        image: 'https://paft.eg/wp-content/uploads/2026/02/WhatsApp_Image_2026-02-05_at_4.40.55_PM-removebg-preview.png',
        specs: {
            rows: [
                { label: 'External Dimension', values: ['600×400×225 mm'] },
                { label: 'Internal Dimension', values: ['576×376×212 mm'] },
                { label: 'Tare Weight', values: ['2.0 KG'] },
                { label: 'Volume Capacity', values: ['47 L'] },
                { label: 'Unit Load', values: ['22 KG'] },
            ],
        },
        priceLabel: 'On Call',
    },
    {
        id: 'rpc-6430',
        title: 'RPC 6430',
        subtitle: '600×400×300mm',
        image: 'https://paft.eg/wp-content/uploads/2026/02/image-removebg-preview-1.png',
        specs: {
            rows: [
                { label: 'External Dimension', values: ['600×400×300 mm'] },
                { label: 'Internal Dimension', values: ['576×376×291 mm'] },
                { label: 'Tare Weight', values: ['2.8 KG'] },
                { label: 'Volume Capacity', values: ['61 L'] },
                { label: 'Unit Load', values: ['30 KG'] },
            ],
        },
        priceLabel: 'On Call',
    },
    {
        id: 'large-foldable-crate',
        title: 'Large Foldable Crate',
        subtitle: '800×600×984mm',
        image: 'https://paft.eg/wp-content/uploads/2026/02/image-removebg-preview.png',
        specs: {
            rows: [
                { label: 'External Dimension', values: ['800×600×984 mm'] },
                { label: 'Internal Dimension', values: ['760×560×852 mm'] },
                { label: 'Folding Height', values: ['334 mm'] },
                { label: 'Tare Weight', values: ['25 KG'] },
                { label: 'Volume Capacity', values: ['368 L'] },
                { label: 'Unit Load', values: ['250 KG'] },
            ],
        },
        priceLabel: 'On Call',
    },
    {
        id: 'rpc-6411',
        title: 'RPC 6411',
        subtitle: '600×400×115mm',
        image: 'https://paft.eg/wp-content/uploads/2026/02/WhatsApp_Image_2026-02-05_at_4.06.42_PM-removebg-preview-2.png',
        specs: {
            rows: [
                { label: 'External Dimension', values: ['600×400×115 mm'] },
                { label: 'Internal Dimension', values: ['576×376×105 mm'] },
                { label: 'Tare Weight', values: ['1.5 KG'] },
                { label: 'Volume Capacity', values: ['23 L'] },
                { label: 'Unit Load', values: ['15 KG'] },
            ],
        },
        priceLabel: 'On Call',
    },
    {
        id: 'sheet-separators',
        title: 'Sheet Separators',
        image: 'https://paft.eg/wp-content/uploads/2025/11/WhatsApp_Image_2025-11-25_at_5.14.26_PM-removebg-preview.png',
    },
    {
        id: 'gallon-racks',
        title: 'Gallon Racks',
        image: 'https://paft.eg/wp-content/uploads/2025/06/f2883d_1160983ac47f4db8b0586f4a4f0d4a93_mv2-removebg-preview-1.png',
        features: ['The 4 pc\'s Set', 'The 8 pc\'s Set'],
    },
];

/* ─── Scroll Animation Hook ─── */
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

/* ─── Spec Table Component ─── */
function SpecTable({ specs, priceLabel }: { specs: Product['specs']; priceLabel?: string }) {
    if (!specs) return null;
    const hasMultipleColumns = specs.headers && specs.headers.length > 2;

    return (
        <div className="mt-5 overflow-hidden rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                {specs.headers && (
                    <thead>
                        <tr>
                            {specs.headers.map((h, i) => (
                                <th
                                    key={i}
                                    className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(37,99,235,0.15))',
                                        color: '#06B6D4',
                                        borderBottom: '1px solid rgba(6,182,212,0.2)',
                                    }}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                )}
                <tbody>
                    {specs.rows.map((row, i) => (
                        <tr
                            key={i}
                            style={{
                                borderBottom: '1px solid rgba(255,255,255,0.04)',
                                background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                            }}
                        >
                            <td
                                className="px-4 py-3 font-medium"
                                style={{ color: 'rgba(255,255,255,0.6)' }}
                            >
                                {row.label}
                            </td>
                            {row.values.map((v, j) => (
                                <td
                                    key={j}
                                    className="px-4 py-3 font-semibold text-right"
                                    style={{
                                        color: 'rgba(255,255,255,0.9)',
                                        textAlign: hasMultipleColumns ? 'center' : 'right',
                                    }}
                                >
                                    {v}
                                </td>
                            ))}
                        </tr>
                    ))}
                    {priceLabel && (
                        <tr style={{ background: 'rgba(6,182,212,0.08)' }}>
                            <td
                                className="px-4 py-3 font-semibold"
                                style={{ color: '#06B6D4' }}
                                colSpan={hasMultipleColumns ? (specs.headers?.length ?? 1) - 1 : 1}
                            >
                                Price Range
                            </td>
                            <td
                                className="px-4 py-3 font-bold text-right"
                                style={{
                                    color: '#06B6D4',
                                    textAlign: hasMultipleColumns ? 'center' : 'right',
                                }}
                            >
                                {priceLabel}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

/* ─── Product Card Component ─── */
function ProductCard({ product, index }: { product: Product; index: number }) {
    const { ref, visible } = useInView(0.1);
    const [hovered, setHovered] = useState(false);
    const isEven = index % 2 === 0;
    const accentColors = ['#06B6D4', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4', '#10B981', '#8B5CF6'];
    const accent = accentColors[index % accentColors.length];

    return (
        <div
            ref={ref}
            className="w-full"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(50px)',
                transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`,
            }}
        >
            <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                    background: 'rgba(30, 41, 59, 0.4)',
                    backdropFilter: 'blur(16px)',
                    borderTop: `3px solid ${accent}`,
                    borderLeft: `1px solid ${hovered ? accent + '40' : 'rgba(255,255,255,0.06)'}`,
                    borderRight: `1px solid ${hovered ? accent + '40' : 'rgba(255,255,255,0.06)'}`,
                    borderBottom: `1px solid ${hovered ? accent + '40' : 'rgba(255,255,255,0.06)'}`,
                    boxShadow: hovered
                        ? `0 30px 70px rgba(0,0,0,0.4), 0 0 40px ${accent}12`
                        : '0 4px 24px rgba(0,0,0,0.15)',
                    transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <div
                    className={`grid gap-0 ${product.specs || product.features ? 'md:grid-cols-2' : 'md:grid-cols-[1fr_1.5fr]'}`}
                    style={{ alignItems: 'center' }}
                >
                    {/* Image Section */}
                    <div
                        className={`relative flex items-center justify-center p-8 lg:p-12 overflow-hidden ${isEven ? 'md:order-1' : 'md:order-2'}`}
                        style={{
                            background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.3), rgba(30, 41, 59, 0.5))',
                            minHeight: '280px',
                        }}
                    >
                        {/* Subtle glow */}
                        <div
                            className="absolute inset-0 transition-opacity duration-500"
                            style={{
                                background: `radial-gradient(circle at 50% 50%, ${accent}08, transparent 70%)`,
                                opacity: hovered ? 1 : 0,
                            }}
                        />
                        <img
                            src={product.image}
                            alt={product.title}
                            className="relative z-10 max-w-[320px] max-h-[280px] w-full h-auto object-contain transition-transform duration-500"
                            style={{
                                filter: 'drop-shadow(0 12px 30px rgba(0,0,0,0.3))',
                                transform: hovered ? 'scale(1.06)' : 'scale(1)',
                            }}
                            loading="lazy"
                        />

                        {/* Floating badge */}
                        <div
                            className="absolute top-5 left-5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase z-20"
                            style={{
                                background: `${accent}18`,
                                color: accent,
                                border: `1px solid ${accent}30`,
                                backdropFilter: 'blur(8px)',
                            }}
                        >
                            {product.id.includes('rpc') ? 'RPC Series' : product.id === 'foldable-ibc' ? 'IBC' : 'Accessory'}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div
                        className={`p-6 lg:p-8 ${isEven ? 'md:order-2' : 'md:order-1'}`}
                    >
                        <h3
                            className="text-2xl lg:text-3xl font-bold mb-2"
                            style={{ color: '#fff', letterSpacing: '-0.02em' }}
                        >
                            {product.title}
                        </h3>

                        {product.subtitle && (
                            <div
                                className="inline-block px-3 py-1 rounded-lg text-sm font-medium mb-4"
                                style={{
                                    background: `${accent}15`,
                                    color: accent,
                                    border: `1px solid ${accent}25`,
                                }}
                            >
                                {product.subtitle}
                            </div>
                        )}

                        {/* Features list */}
                        {product.features && (
                            <ul className="mt-4 space-y-2">
                                {product.features.map((f, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center gap-3 text-sm"
                                        style={{ color: 'rgba(255,255,255,0.7)' }}
                                    >
                                        <span
                                            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                            style={{ background: `${accent}20`, color: accent }}
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </span>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Specs table */}
                        <SpecTable specs={product.specs} priceLabel={product.priceLabel} />

                        {/* Minimal card — no specs/features */}
                        {!product.specs && !product.features && (
                            <p className="text-sm mt-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                Contact us for specifications and pricing details.
                            </p>
                        )}
                    </div>
                </div>

                {/* Corner accent */}
                <div
                    className="absolute top-0 right-0 w-32 h-32 opacity-5"
                    style={{
                        background: `linear-gradient(135deg, ${accent}, transparent)`,
                        borderBottomLeftRadius: '100%',
                    }}
                />
            </div>
        </div>
    );
}

/* ─── Main Page ─── */
export default function TransportLogistics() {
    const { ref: heroRef, visible: heroVisible } = useInView(0.1);
    const { ref: gridRef, visible: gridVisible } = useInView(0.05);

    return (
        <div className="min-h-screen" style={{ background: '#0B1121' }}>
            <Header currentPage="transport-logistics" />

            {/* ── Hero Section ── */}
            <section
                ref={heroRef}
                className="relative overflow-hidden"
                style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}
            >
                {/* Background image */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'url(https://paft.eg/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-24-at-12.57.33-PM.jpeg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                {/* Dark overlay */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(135deg, rgba(11,17,33,0.88) 0%, rgba(15,23,42,0.82) 50%, rgba(11,17,33,0.92) 100%)',
                    }}
                />
                {/* Decorative gradient blurs */}
                <div
                    className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full opacity-15"
                    style={{
                        background: 'radial-gradient(circle, #06B6D4, transparent 70%)',
                        filter: 'blur(100px)',
                        transform: 'translate(-30%, -30%)',
                    }}
                />
                <div
                    className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-10"
                    style={{
                        background: 'radial-gradient(circle, #8B5CF6, transparent 70%)',
                        filter: 'blur(100px)',
                        transform: 'translate(30%, 30%)',
                    }}
                />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24 text-center">
                    {/* Badge */}
                    <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
                        style={{
                            background: 'rgba(6, 182, 212, 0.1)',
                            border: '1px solid rgba(6, 182, 212, 0.2)',
                            backdropFilter: 'blur(10px)',
                            opacity: heroVisible ? 1 : 0,
                            transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                            transition: 'all 0.7s ease',
                        }}
                    >
                        <span className="w-2 h-2 rounded-full" style={{ background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
                        <span className="text-sm font-semibold tracking-wider uppercase" style={{ color: 'rgba(255,255,255,0.9)' }}>
                            PAFT Product Range
                        </span>
                    </div>

                    <h1
                        className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
                        style={{
                            letterSpacing: '-0.04em',
                            opacity: heroVisible ? 1 : 0,
                            transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
                            transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s',
                        }}
                    >
                        <span style={{ color: '#fff' }}>Transport &{' '}</span>
                        <br className="hidden sm:block" />
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Logistics Items
                        </span>
                    </h1>

                    <p
                        className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
                        style={{
                            color: 'rgba(255,255,255,0.65)',
                            opacity: heroVisible ? 1 : 0,
                            transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                            transition: 'all 0.8s ease 0.25s',
                        }}
                    >
                        Innovative foldable IBCs, reusable plastic crates, sheet separators, and gallon racks — engineered for modern supply chains with maximum efficiency and sustainability.
                    </p>

                    {/* Scroll indicator */}
                    <div
                        className="mt-12 flex flex-col items-center gap-2"
                        style={{
                            opacity: heroVisible ? 0.5 : 0,
                            transition: 'opacity 1s ease 0.6s',
                        }}
                    >
                        <span className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>
                            Scroll to explore
                        </span>
                        <svg className="w-5 h-5 animate-bounce" fill="none" stroke="rgba(255,255,255,0.4)" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>
            </section>

            {/* ── Product Cards ── */}
            <section
                ref={gridRef}
                className="py-16 lg:py-24"
                style={{ background: '#0f1729' }}
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section heading */}
                    <div
                        className="text-center mb-14"
                        style={{
                            opacity: gridVisible ? 1 : 0,
                            transform: gridVisible ? 'translateY(0)' : 'translateY(20px)',
                            transition: 'all 0.7s ease',
                        }}
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold mb-3" style={{ color: '#fff' }}>
                            Our{' '}
                            <span
                                style={{
                                    background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Catalogue
                            </span>
                        </h2>
                        <p className="text-base" style={{ color: 'rgba(255,255,255,0.45)' }}>
                            Foldable IBCs · RPC Crates · Accessories
                        </p>
                    </div>

                    <div className="space-y-8">
                        {products.map((product, i) => (
                            <ProductCard key={product.id} product={product} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA Section ── */}
            <section className="py-20 relative overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(139, 92, 246, 0.08))',
                    }}
                />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#fff' }}>
                        Need a{' '}
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Custom Quote?
                        </span>
                    </h2>
                    <p className="text-xl mb-10" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        We offer tailored solutions for crates, IBCs, and logistics accessories
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="/contact"
                            className="px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                            style={{
                                background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
                                boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
                            }}
                        >
                            Get a Quote →
                        </a>
                        <a
                            href="/contact"
                            className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-white/5"
                            style={{
                                border: '2px solid rgba(255,255,255,0.2)',
                                color: 'rgba(255,255,255,0.8)',
                            }}
                        >
                            Contact Sales
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}