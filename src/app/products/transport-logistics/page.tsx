
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@/context/ThemeContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TransportLogisticsPageEditor from '@/app/admin/pages/TransportLogisticsPageEditor';
import { contentService } from '@/services/contentService';

/* ─── Data Interfaces ─── */
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

// Default static data as fallback
const initialProducts: Product[] = [
    {
        id: 'foldable-ibc',
        title: 'Foldable IBC - 1000 Lit',
        // subtitle: '', // Optional default
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
    // Fallback data only has one product for brevity, full list will load from API
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
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const id = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(id);
    }, []);

    const isLight = mounted && theme === 'light';

    if (!specs) return null;
    const hasMultipleColumns = specs.headers && specs.headers.length > 2;

    const borderColor = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.08)';
    const headerBg = isLight
        ? 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(37,99,235,0.1))'
        : 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(37,99,235,0.15))';
    const cellBorder = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)';
    const rowBgStart = isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)';
    const labelColor = isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)';
    const valueColor = isLight ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)';
    const priceBg = isLight ? 'rgba(6,182,212,0.05)' : 'rgba(6,182,212,0.08)';

    return (
        <div className="mt-5 overflow-hidden rounded-xl" style={{ border: `1px solid ${borderColor}` }}>
            <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                {specs.headers && (
                    <thead>
                        <tr>
                            {specs.headers.map((h, i) => (
                                <th
                                    key={i}
                                    className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider"
                                    style={{
                                        background: headerBg,
                                        color: '#06B6D4',
                                        borderBottom: `1px solid rgba(6,182,212,0.2)`,
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
                                borderBottom: `1px solid ${cellBorder}`,
                                background: i % 2 === 0 ? rowBgStart : 'transparent',
                            }}
                        >
                            <td
                                className="px-4 py-3 font-medium"
                                style={{ color: labelColor }}
                            >
                                {row.label}
                            </td>
                            {row.values.map((v, j) => (
                                <td
                                    key={j}
                                    className="px-4 py-3 font-semibold text-right"
                                    style={{
                                        color: valueColor,
                                        textAlign: hasMultipleColumns ? 'center' : 'right',
                                    }}
                                >
                                    {v}
                                </td>
                            ))}
                        </tr>
                    ))}
                    {priceLabel && (
                        <tr style={{ background: priceBg }}>
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
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const id = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(id);
    }, []);

    const isLight = mounted && theme === 'light';
    const { ref, visible } = useInView(0.1);
    const [hovered, setHovered] = useState(false);
    const isEven = index % 2 === 0;
    const accentColors = ['#06B6D4', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4', '#10B981', '#8B5CF6'];
    const accent = accentColors[index % accentColors.length];

    // Colors based on theme
    const cardBg = isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(30, 41, 59, 0.4)';
    const cardBorder = isLight
        ? (hovered ? `${accent}40` : 'rgba(0,0,0,0.06)')
        : (hovered ? `${accent}40` : 'rgba(255,255,255,0.06)');
    const cardShadow = isLight
        ? (hovered ? `0 20px 40px rgba(0,0,0,0.1), 0 0 20px ${accent}20` : '0 4px 12px rgba(0,0,0,0.05)')
        : (hovered ? `0 30px 70px rgba(0,0,0,0.4), 0 0 40px ${accent}12` : '0 4px 24px rgba(0,0,0,0.15)');
    const imageContainerBg = isLight
        ? 'linear-gradient(145deg, #f8fafc, #e2e8f0)'
        : 'linear-gradient(145deg, rgba(15, 23, 42, 0.3), rgba(30, 41, 59, 0.5))';
    const titleColor = isLight ? '#0f172a' : '#fff';
    const featureColor = isLight ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)';
    const emptySpecColor = isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)';

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
                    background: cardBg,
                    backdropFilter: 'blur(16px)',
                    borderTop: `3px solid ${accent}`,
                    borderLeft: `1px solid ${cardBorder}`,
                    borderRight: `1px solid ${cardBorder}`,
                    borderBottom: `1px solid ${cardBorder}`,
                    boxShadow: cardShadow,
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
                            background: imageContainerBg,
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
                            style={{ color: titleColor, letterSpacing: '-0.02em' }}
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
                                        style={{ color: featureColor }}
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
                            <p className="text-sm mt-3" style={{ color: emptySpecColor }}>
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
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const id = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(id);
    }, []);

    const isLight = mounted && theme === 'light';
    const { ref: heroRef, visible: heroVisible } = useInView(0.1);
    const { ref: gridRef, visible: gridVisible } = useInView(0.05);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [content, setContent] = useState<Record<string, unknown>>({});
    const [flatContent, setFlatContent] = useState<{ [key: string]: string }>({});
    const [idMap, setIdMap] = useState<{ [key: string]: number }>({});
    const [products, setProducts] = useState<Product[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const loadContentCb = useCallback(() => {
        loadContent();
    }, []);

    useEffect(() => {
        loadContentCb();
    }, [loadContentCb]);

    const loadContent = async () => {
        try {
            const data = await contentService.getContentByPage('transport-logistics');
            setContent(data); // nested
            const flat = contentService.flattenContent(data);
            setFlatContent(flat);
            setIdMap(contentService.getIdMap(data));

            // Reconstruct Products
            reconstructProducts(flat);
        } catch (error) {
            console.error('Failed to load content', error);
            // Fallback to defaults if needed
        }
    };

    const reconstructProducts = (flat: { [key: string]: string }) => {
        const newProducts: Product[] = [];

        // Helper to get val or empty
        const getVal = (key: string) => flat[key] || '';

        // Product 1: Foldable IBC
        if (getVal('product-1-title')) {
            const p1: Product = {
                id: 'foldable-ibc',
                title: getVal('product-1-title'),
                subtitle: getVal('product-1-subtitle'), // Add subtitle support
                image: getVal('product-1-image'),
                priceLabel: getVal('product-1-price-label'),
                specs: {
                    headers: getVal('product-1-spec-headers').split(',').map(s => s.trim()),
                    rows: [1, 2, 3].map(i => {
                        const rowVal = getVal(`product-1-spec-row-${i}`);
                        if (!rowVal) return null;
                        const parts = rowVal.split(',');
                        return { label: parts[0], values: parts.slice(1) };
                    }).filter(Boolean) as SpecRow[]
                }
            };
            newProducts.push(p1);
        }

        // Products 2-6: RPCs and Large Foldable Crate
        // IDs map to sections product-2 through product-6
        const midProducts = [
            { id: 'rpc-6419', section: 2 },
            { id: 'rpc-6422', section: 3 },
            { id: 'rpc-6430', section: 4 },
            { id: 'large-foldable-crate', section: 5 },
            { id: 'rpc-6411', section: 6 }
        ];

        midProducts.forEach(({ id, section }) => {
            const prefix = `product-${section}`;
            if (getVal(`${prefix}-title`)) {
                const rows: SpecRow[] = [];
                // Check up to 6 potential spec rows
                for (let i = 1; i <= 6; i++) {
                    const rowVal = getVal(`${prefix}-spec-row-${i}`);
                    if (rowVal) {
                        // For RPCs, value format is "Label,Value" (comma separated)
                        // It might contain multiple values or just one.
                        // Based on seed: "External Dimension,600x400x195 mm" => 2 parts
                        const parts = rowVal.split(',');
                        if (parts.length >= 2) {
                            rows.push({
                                label: parts[0],
                                values: parts.slice(1)
                            });
                        }
                    }
                }

                newProducts.push({
                    id,
                    title: getVal(`${prefix}-title`),
                    subtitle: getVal(`${prefix}-subtitle`),
                    image: getVal(`${prefix}-image`),
                    priceLabel: getVal(`${prefix}-price-label`),
                    specs: rows.length > 0 ? { rows } : undefined
                });
            }
        });

        // Product 7: Sheet Separators
        if (getVal('product-7-title')) {
            newProducts.push({
                id: 'sheet-separators',
                title: getVal('product-7-title'),
                image: getVal('product-7-image'),
            });
        }

        // Product 8: Gallon Racks
        if (getVal('product-8-title')) {
            newProducts.push({
                id: 'gallon-racks',
                title: getVal('product-8-title'),
                image: getVal('product-8-image'),
                features: getVal('product-8-features')
                    ? getVal('product-8-features').split(',').map(s => s.trim())
                    : undefined
            });
        }

        if (newProducts.length > 0) {
            setProducts(newProducts);
        }
    };

    const handleSave = async (newContent: { [key: string]: string }) => {
        setIsSaving(true);
        try {
            const updates: { id: number; value: string }[] = [];
            Object.keys(newContent).forEach(key => {
                if (newContent[key] !== flatContent[key] && idMap[key]) {
                    updates.push({ id: idMap[key], value: newContent[key] });
                }
            });

            if (updates.length > 0) {
                await contentService.bulkUpdateContent(updates);
                setFlatContent(newContent);
                reconstructProducts(newContent);
            }
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to save content', error);
            alert('Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    };

    // Helper for safe text access
    const t = (key: string) => flatContent[key] || '';

    // Page Background
    const pageBg = isLight ? '#f8fafc' : '#0B1121';

    // Hero Section Colors
    const heroOverlay = isLight
        ? 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(248,250,252,0.85) 50%, rgba(255,255,255,0.95) 100%)'
        : 'linear-gradient(135deg, rgba(11,17,33,0.88) 0%, rgba(15,23,42,0.82) 50%, rgba(11,17,33,0.92) 100%)';
    const heroTitlePrefixColor = isLight ? '#0f172a' : '#fff';
    const heroDescColor = isLight ? 'rgba(15,23,42,0.7)' : 'rgba(255,255,255,0.65)';
    const heroBadgeBg = isLight ? 'rgba(6, 182, 212, 0.1)' : 'rgba(6, 182, 212, 0.1)';
    const heroBadgeBorder = isLight ? 'rgba(6, 182, 212, 0.2)' : 'rgba(6, 182, 212, 0.2)';
    const heroBadgeText = isLight ? '#0e7490' : 'rgba(255,255,255,0.9)';
    const scrollColor = isLight ? 'rgba(15,23,42,0.4)' : 'rgba(255,255,255,0.4)';

    // Section Colors
    const sectionBg = isLight ? '#f1f5f9' : '#0f1729';
    const sectionTitleColor = isLight ? '#0f172a' : '#fff';
    const sectionSubtitleColor = isLight ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.45)';

    // CTA Colors
    const ctaOverlay = isLight
        ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.05), rgba(139, 92, 246, 0.05))'
        : 'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(139, 92, 246, 0.08))';
    const ctaTitleColor = isLight ? '#0f172a' : '#fff';
    const ctaDescColor = isLight ? 'rgba(15,23,42,0.7)' : 'rgba(255,255,255,0.6)';
    const contactBtnBorder = isLight ? '2px solid rgba(15,23,42,0.2)' : '2px solid rgba(255,255,255,0.2)';
    const contactBtnText = isLight ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.8)';


    return (
        <div className="min-h-screen" style={{ background: pageBg, transition: 'background 0.3s ease' }}>
            <Header currentPage="transport-logistics" />

            {/* Edit Button */}
            <div className="fixed bottom-4 right-4 z-50">
                <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all"
                    title="Edit Page Content"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
            </div>

            {isEditing && (
                <TransportLogisticsPageEditor
                    content={Object.keys(flatContent).length > 0 ?
                        Object.keys(flatContent).reduce((acc, key) => {
                            acc[key] = { value: flatContent[key], id: idMap[key] || 0 };
                            return acc;
                        }, {} as { [key: string]: { value: string; id: number } })
                        : {}
                    }
                    onSave={handleSave}
                    onClose={() => setIsEditing(false)}
                    saving={isSaving}
                />
            )}

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

                {/* Theme-aware Overlay */}
                <div
                    className="absolute inset-0 transition-all duration-300"
                    style={{
                        background: heroOverlay,
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
                            background: heroBadgeBg,
                            border: `1px solid ${heroBadgeBorder}`,
                            backdropFilter: 'blur(10px)',
                            opacity: heroVisible ? 1 : 0,
                            transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                            transition: 'all 0.7s ease',
                        }}
                    >
                        <span className="w-2 h-2 rounded-full" style={{ background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
                        <span className="text-sm font-semibold tracking-wider uppercase" style={{ color: heroBadgeText }}>
                            {t('badge-text') || 'PAFT Product Range'}
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
                        {/* Splitting title logic for styling - this assumes standard title format */}
                        <span style={{ color: heroTitlePrefixColor }}>{t('title') ? t('title').split(' ').slice(0, 2).join(' ') : 'Transport &'} </span>
                        <br className="hidden sm:block" />
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            {t('title') ? t('title').split(' ').slice(2).join(' ') : 'Logistics Items'}
                        </span>
                    </h1>

                    <p
                        className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
                        style={{
                            color: heroDescColor,
                            opacity: heroVisible ? 1 : 0,
                            transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                            transition: 'all 0.8s ease 0.25s',
                        }}
                    >
                        {t('description') || 'Innovative foldable IBCs, reusable plastic crates, sheet separators, and gallon racks — engineered for modern supply chains with maximum efficiency and sustainability.'}
                    </p>

                    {/* Scroll indicator */}
                    <div
                        className="mt-12 flex flex-col items-center gap-2"
                        style={{
                            opacity: heroVisible ? 0.5 : 0,
                            transition: 'opacity 1s ease 0.6s',
                        }}
                    >
                        <span className="text-xs uppercase tracking-widest" style={{ color: scrollColor }}>
                            Scroll to explore
                        </span>
                        <svg className="w-5 h-5 animate-bounce" fill="none" stroke={scrollColor} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>
            </section>

            {/* ── Product Cards ── */}
            <section
                ref={gridRef}
                className="py-16 lg:py-24"
                style={{ background: sectionBg, transition: 'background 0.3s ease' }}
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
                        <h2 className="text-3xl lg:text-4xl font-bold mb-3" style={{ color: sectionTitleColor }}>
                            {t('section-title') || 'Our Catalogue'}
                        </h2>
                        <p className="text-base" style={{ color: sectionSubtitleColor }}>
                            {t('section-subtitle') || 'Foldable IBCs · RPC Crates · Accessories'}
                        </p>
                    </div>

                    <div className="space-y-8">
                        {(products.length > 0 ? products : initialProducts).map((product, i) => (
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
                        background: ctaOverlay,
                    }}
                />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: ctaTitleColor }}>
                        {t('cta-title') || 'Need a Custom Quote?'}
                    </h2>
                    <p className="text-xl mb-10" style={{ color: ctaDescColor }}>
                        {t('cta-description') || 'We offer tailored solutions for crates, IBCs, and logistics accessories'}
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
                                border: contactBtnBorder,
                                color: contactBtnText,
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