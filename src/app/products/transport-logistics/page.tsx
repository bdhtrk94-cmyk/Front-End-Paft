'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme } from '@/context/ThemeContext';
import { contentApi } from '@/lib/api';

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

interface PageContent {
    [key: string]: {
        value: string;
        valueAr?: string;
        id: number;
    };
}

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
function SpecTable({ specs, priceLabel, isLight }: { specs: Product['specs']; priceLabel?: string; isLight: boolean }) {
    if (!specs) return null;
    const hasMultipleColumns = specs.headers && specs.headers.length > 2;

    return (
        <div
            className="mt-5 overflow-hidden rounded-xl"
            style={{ border: `1px solid ${isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'}` }}
        >
            <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                {specs.headers && (
                    <thead>
                        <tr>
                            {specs.headers.map((h, i) => (
                                <th
                                    key={i}
                                    className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider"
                                    style={{
                                        background: isLight
                                            ? 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(37,99,235,0.08))'
                                            : 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(37,99,235,0.15))',
                                        color: '#06B6D4',
                                        borderBottom: `1px solid ${isLight ? 'rgba(6,182,212,0.12)' : 'rgba(6,182,212,0.2)'}`,
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
                                borderBottom: `1px solid ${isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)'}`,
                                background: i % 2 === 0
                                    ? isLight ? 'rgba(0,0,0,0.015)' : 'rgba(255,255,255,0.02)'
                                    : 'transparent',
                            }}
                        >
                            <td
                                className="px-4 py-3 font-medium"
                                style={{ color: isLight ? '#64748B' : 'rgba(255,255,255,0.6)' }}
                            >
                                {row.label}
                            </td>
                            {row.values.map((v, j) => (
                                <td
                                    key={j}
                                    className="px-4 py-3 font-semibold text-right"
                                    style={{
                                        color: isLight ? '#1E293B' : 'rgba(255,255,255,0.9)',
                                        textAlign: hasMultipleColumns ? 'center' : 'right',
                                    }}
                                >
                                    {v}
                                </td>
                            ))}
                        </tr>
                    ))}
                    {priceLabel && (
                        <tr style={{ background: isLight ? 'rgba(6,182,212,0.05)' : 'rgba(6,182,212,0.08)' }}>
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
function ProductCard({ product, index, isLight }: { product: Product; index: number; isLight: boolean }) {
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
                    background: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(30, 41, 59, 0.4)',
                    backdropFilter: 'blur(16px)',
                    borderTop: `3px solid ${accent}`,
                    borderLeft: `1px solid ${hovered ? accent + '40' : isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`,
                    borderRight: `1px solid ${hovered ? accent + '40' : isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`,
                    borderBottom: `1px solid ${hovered ? accent + '40' : isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`,
                    boxShadow: hovered
                        ? isLight
                            ? `0 30px 70px rgba(0,0,0,0.1), 0 0 30px ${accent}10`
                            : `0 30px 70px rgba(0,0,0,0.4), 0 0 40px ${accent}12`
                        : isLight
                            ? '0 4px 24px rgba(0,0,0,0.05)'
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
                            background: isLight
                                ? 'linear-gradient(145deg, rgba(240, 249, 255, 0.8), rgba(224, 242, 254, 0.6))'
                                : 'linear-gradient(145deg, rgba(15, 23, 42, 0.3), rgba(30, 41, 59, 0.5))',
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
                                filter: isLight
                                    ? 'drop-shadow(0 12px 30px rgba(0,0,0,0.12))'
                                    : 'drop-shadow(0 12px 30px rgba(0,0,0,0.3))',
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
                            style={{ color: isLight ? '#0F172A' : '#fff', letterSpacing: '-0.02em' }}
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
                                        style={{ color: isLight ? '#475569' : 'rgba(255,255,255,0.7)' }}
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
                        <SpecTable specs={product.specs} priceLabel={product.priceLabel} isLight={isLight} />

                        {/* Minimal card — no specs/features */}
                        {!product.specs && !product.features && (
                            <p className="text-sm mt-3" style={{ color: isLight ? '#94A3B8' : 'rgba(255,255,255,0.5)' }}>
                                Contact us for specifications and pricing details.
                            </p>
                        )}
                    </div>
                </div>

                {/* Corner accent */}
                <div
                    className="absolute top-0 right-0 w-32 h-32"
                    style={{
                        opacity: isLight ? 0.03 : 0.05,
                        background: `linear-gradient(135deg, ${accent}, transparent)`,
                        borderBottomLeftRadius: '100%',
                    }}
                />
            </div>
        </div>
    );
}

/* ─── Helper Functions ─── */
function parseSpecRows(content: PageContent, productNum: number): SpecRow[] {
    const rows: SpecRow[] = [];
    let i = 1;
    while (content[`product-${productNum}-spec-row-${i}`]) {
        const rowData = content[`product-${productNum}-spec-row-${i}`].value;
        if (rowData) {
            const parts = rowData.split(',');
            if (parts.length >= 2) {
                rows.push({
                    label: parts[0].trim(),
                    values: parts.slice(1).map(v => v.trim())
                });
            }
        }
        i++;
    }
    return rows;
}

function buildProductsFromContent(content: PageContent): Product[] {
    const products: Product[] = [];
    
    for (let i = 1; i <= 8; i++) {
        const title = content[`product-${i}-title`]?.value;
        const image = content[`product-${i}-image`]?.value;
        
        if (title && image) {
            const product: Product = {
                id: `product-${i}`,
                title,
                image,
            };
            
            // Add subtitle if exists
            const subtitle = content[`product-${i}-subtitle`]?.value;
            if (subtitle) {
                product.subtitle = subtitle;
            }
            
            // Add features for product 8 (Gallon Racks)
            if (i === 8) {
                const featuresStr = content[`product-${i}-features`]?.value;
                if (featuresStr) {
                    product.features = featuresStr.split(',').map(f => f.trim());
                }
            }
            
            // Add specs for products with specifications (not 7 and 8)
            if (i !== 7 && i !== 8) {
                const specRows = parseSpecRows(content, i);
                if (specRows.length > 0) {
                    product.specs = { rows: specRows };
                    
                    // Add headers for product 1 (Foldable IBC)
                    if (i === 1) {
                        const headersStr = content[`product-${i}-spec-headers`]?.value;
                        if (headersStr) {
                            product.specs.headers = headersStr.split(',').map(h => h.trim());
                        }
                    }
                }
                
                // Add price label
                const priceLabel = content[`product-${i}-price-label`]?.value;
                if (priceLabel) {
                    product.priceLabel = priceLabel;
                }
            }
            
            products.push(product);
        }
    }
    
    return products;
}

/* ─── Main Page ─── */
export default function TransportLogistics() {
    console.log('🔍 TransportLogistics component loaded');
    
    const { ref: heroRef, visible: heroVisible } = useInView(0.1);
    const { ref: gridRef, visible: gridVisible } = useInView(0.05);
    const { theme } = useTheme();
    const isLight = theme === 'light';
    
    console.log('🔍 Theme:', theme, 'isLight:', isLight);
    
    // State for dynamic content
    const [content, setContent] = useState<PageContent>({});
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    
    console.log('🔍 Component state:', { contentKeys: Object.keys(content), productsCount: products.length, loading });
    
    // Fetch content from API
    useEffect(() => {
        const fetchContent = async () => {
            try {
                console.log('🔍 Starting to fetch transport logistics content...');
                console.log('🔍 API URL:', `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/content/page/transport-logistics`);
                
                const data = await contentApi.getPageContent('transport-logistics');
                console.log('🔍 Transport logistics content received:', data);
                
                // Check if data is empty or null
                if (!data || Object.keys(data).length === 0) {
                    console.error('❌ No data received from API');
                    setLoading(false);
                    return;
                }
                
                // Flatten all content sections into a single object
                const flatContent: PageContent = {};
                
                // Process each section
                Object.keys(data).forEach(section => {
                    console.log(`🔍 Processing section: ${section}`, data[section]);
                    if (data[section] && typeof data[section] === 'object') {
                        Object.keys(data[section]).forEach(key => {
                            const item = data[section][key];
                            if (item && typeof item === 'object' && 'value' in item) {
                                // For product sections, create unique keys by combining section and key
                                if (section.startsWith('product-')) {
                                    const uniqueKey = `${section}-${key}`;
                                    flatContent[uniqueKey] = item;
                                } else {
                                    // For non-product sections, use the key as is
                                    flatContent[key] = item;
                                }
                            }
                        });
                    }
                });
                
                console.log('🔍 Flattened content:', flatContent);
                console.log('🔍 Content keys:', Object.keys(flatContent));
                console.log('🔍 Sample content values:', {
                    'badge-text': flatContent['badge-text'],
                    'title': flatContent['title'],
                    'description': flatContent['description'],
                    'section-title': flatContent['section-title']
                });
                
                setContent(flatContent);
                const builtProducts = buildProductsFromContent(flatContent);
                console.log('🔍 Built products:', builtProducts);
                setProducts(builtProducts);
            } catch (error) {
                console.error('❌ Failed to fetch transport logistics content:', error);
                // Set some fallback content so the page doesn't stay loading forever
                setContent({
                    'badge-text': { value: 'PAFT Product Range', id: 0 },
                    'title': { value: 'Transport & Logistics Items', id: 0 },
                    'description': { value: 'Innovative foldable IBCs, reusable plastic crates, sheet separators, and gallon racks — engineered for modern supply chains with maximum efficiency and sustainability.', id: 0 },
                    'section-title': { value: 'Our Catalogue', id: 0 },
                    'section-subtitle': { value: 'Foldable IBCs · RPC Crates · Accessories', id: 0 }
                });
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchContent();
    }, []);
    
    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: isLight ? '#F8FBFF' : '#0B1121' }}>
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p style={{ color: isLight ? '#64748B' : 'rgba(255,255,255,0.6)' }}>Loading content...</p>
                </div>
            </div>
        );
    }

    // Show error state if no content loaded
    if (!content || Object.keys(content).length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: isLight ? '#F8FBFF' : '#0B1121' }}>
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold mb-2" style={{ color: isLight ? '#0F172A' : '#fff' }}>
                        Failed to Load Content
                    </h2>
                    <p style={{ color: isLight ? '#64748B' : 'rgba(255,255,255,0.6)' }}>
                        Unable to load page content. Please check your connection and try again.
                    </p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ background: isLight ? '#F8FBFF' : '#0B1121' }}>
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
                        opacity: isLight ? 0.06 : 0.15,
                        background: 'radial-gradient(circle, #06B6D4, transparent 70%)',
                        filter: 'blur(100px)',
                        transform: 'translate(-30%, -30%)',
                    }}
                />
                <div
                    className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full"
                    style={{
                        opacity: isLight ? 0.05 : 0.1,
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
                            background: isLight ? 'rgba(6, 182, 212, 0.06)' : 'rgba(6, 182, 212, 0.1)',
                            border: '1px solid rgba(6, 182, 212, 0.2)',
                            backdropFilter: 'blur(10px)',
                            opacity: heroVisible ? 1 : 0,
                            transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                            transition: 'all 0.7s ease',
                        }}
                    >
                        <span className="w-2 h-2 rounded-full" style={{ background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
                        <span
                            className="text-sm font-semibold tracking-wider uppercase"
                            style={{ color: isLight ? '#0F172A' : 'rgba(255,255,255,0.9)' }}
                        >
                            {content['badge-text']?.value || 'PAFT Product Range'}
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
                        <span style={{ color: isLight ? '#0F172A' : '#fff' }}>
                            {content['title']?.value ? (
                                content['title'].value.includes('&') ? (
                                    <>
                                        {content['title'].value.split('&')[0].trim()}&{' '}
                                        <br className="hidden sm:block" />
                                        <span
                                            style={{
                                                background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                            }}
                                        >
                                            {content['title'].value.split('&')[1].trim()}
                                        </span>
                                    </>
                                ) : (
                                    <span
                                        style={{
                                            background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        {content['title'].value}
                                    </span>
                                )
                            ) : (
                                <>
                                    Transport &{' '}
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
                                </>
                            )}
                        </span>
                    </h1>

                    <p
                        className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
                        style={{
                            color: isLight ? '#475569' : 'rgba(255,255,255,0.65)',
                            opacity: heroVisible ? 1 : 0,
                            transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                            transition: 'all 0.8s ease 0.25s',
                        }}
                    >
                        {content['description']?.value || 'Innovative foldable IBCs, reusable plastic crates, sheet separators, and gallon racks — engineered for modern supply chains with maximum efficiency and sustainability.'}
                    </p>

                    {/* Scroll indicator */}
                    <div
                        className="mt-12 flex flex-col items-center gap-2"
                        style={{
                            opacity: heroVisible ? 0.5 : 0,
                            transition: 'opacity 1s ease 0.6s',
                        }}
                    >
                        <span
                            className="text-xs uppercase tracking-widest"
                            style={{ color: isLight ? '#94A3B8' : 'rgba(255,255,255,0.4)' }}
                        >
                            Scroll to explore
                        </span>
                        <svg
                            className="w-5 h-5 animate-bounce"
                            fill="none"
                            stroke={isLight ? '#94A3B8' : 'rgba(255,255,255,0.4)'}
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>
            </section>

            {/* ── Product Cards ── */}
            <section
                ref={gridRef}
                className="py-16 lg:py-24"
                style={{ background: isLight ? '#EFF6FF' : '#0f1729' }}
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
                        <h2 className="text-3xl lg:text-4xl font-bold mb-3" style={{ color: isLight ? '#0F172A' : '#fff' }}>
                            {content['section-title']?.value ? (
                                content['section-title'].value.includes('Our') || content['section-title'].value.includes('Catalogue') ? (
                                    <>
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
                                    </>
                                ) : (
                                    <span
                                        style={{
                                            background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        {content['section-title'].value}
                                    </span>
                                )
                            ) : (
                                <>
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
                                </>
                            )}
                        </h2>
                        <p className="text-base" style={{ color: isLight ? '#94A3B8' : 'rgba(255,255,255,0.45)' }}>
                            {content['section-subtitle']?.value || 'Foldable IBCs · RPC Crates · Accessories'}
                        </p>
                    </div>

                    <div className="space-y-8">
                        {products.map((product, i) => (
                            <ProductCard key={product.id} product={product} index={i} isLight={isLight} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA Section ── */}
            <section className="py-20 relative overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        background: isLight
                            ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.03), rgba(139, 92, 246, 0.03))'
                            : 'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(139, 92, 246, 0.08))',
                    }}
                />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: isLight ? '#0F172A' : '#fff' }}>
                        {content['cta-title']?.value ? (
                            content['cta-title'].value.includes('Custom') ? (
                                <>
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
                                </>
                            ) : (
                                <span
                                    style={{
                                        background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    {content['cta-title'].value}
                                </span>
                            )
                        ) : (
                            <>
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
                            </>
                        )}
                    </h2>
                    <p className="text-xl mb-10" style={{ color: isLight ? '#64748B' : 'rgba(255,255,255,0.6)' }}>
                        {content['cta-description']?.value || 'We offer tailored solutions for crates, IBCs, and logistics accessories'}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="/contact"
                            className="px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:scale-105"
                            style={{
                                background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
                                boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
                            }}
                        >
                            Get a Quote →
                        </a>
                        <a
                            href="/contact"
                            className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105"
                            style={{
                                border: isLight ? '2px solid rgba(15, 23, 42, 0.15)' : '2px solid rgba(255,255,255,0.2)',
                                color: isLight ? '#334155' : 'rgba(255,255,255,0.8)',
                                background: isLight ? 'rgba(255,255,255,0.6)' : 'transparent',
                                backdropFilter: 'blur(10px)',
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
