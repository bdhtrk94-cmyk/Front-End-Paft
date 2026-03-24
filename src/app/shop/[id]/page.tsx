'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { productsApi } from '@/lib/api';
import { Product } from '@/lib/shopData';
import {
    ShoppingCart,
    Check,
    ArrowLeft,
    Truck,
    ShieldCheck,
    RotateCcw,
    Minus,
    Plus,
    Star,
    StarHalf,
    AlertCircle,
    Loader2,
    ChevronRight,
    Home,
    Package,
    Tag,
    Hash,
    BarChart3,
    CheckCircle2,
    Award,
    Heart,
    Share2,
    Zap,
    Eye,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

/* ──────────────────────────────────────────── */
/*  Theme-aware single product page             */
/* ──────────────────────────────────────────── */

/** Build a token map so every colour comes from one place. */
function themeTokens(isDark: boolean) {
    return {
        // Page
        pageBg: isDark
            ? '#0B1121'
            : 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 50%, #F8FAFC 100%)',
        pageBgFlat: isDark ? '#0B1121' : '#F8FAFC',

        // Text
        textPrimary: isDark ? '#FFFFFF' : '#0F172A',
        textSecondary: isDark ? 'rgba(255,255,255,0.6)' : '#64748B',
        textMuted: isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8',
        textBreadcrumbActive: isDark ? '#06B6D4' : '#0891B2',

        // Cards & surfaces
        cardBg: isDark ? 'rgba(30,41,59,0.5)' : '#FFFFFF',
        cardBorder: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)',
        cardShadow: isDark ? 'none' : '0 4px 40px rgba(15,23,42,0.06), 0 0 0 1px rgba(15,23,42,0.04)',

        // Image placeholder
        placeholderColor: isDark ? 'rgba(255,255,255,0.15)' : '#CBD5E1',

        // Section alt bg (tabs area)
        sectionAlt: isDark ? 'rgba(15,23,42,0.5)' : 'rgba(241,245,249,0.5)',

        // Tab bar
        tabBarBg: isDark ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
        tabBarBorder: isDark ? 'none' : '1px solid #F1F5F9',
        tabBarShadow: isDark ? 'none' : '0 2px 8px rgba(15,23,42,0.04)',
        tabInactiveColor: isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8',

        // Tab content
        tabContentBg: isDark ? 'rgba(30,41,59,0.4)' : '#FFFFFF',
        tabContentBorder: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
        tabContentShadow: isDark ? 'none' : '0 4px 20px rgba(15,23,42,0.04)',

        // Spec rows
        specBorder: isDark ? 'rgba(255,255,255,0.04)' : '#F1F5F9',
        specHoverBg: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
        specIconBg: isDark ? 'rgba(6,182,212,0.1)' : '#ECFEFF',

        // Dividers
        divider: isDark ? 'rgba(255,255,255,0.06)' : 'linear-gradient(to right, transparent, #E2E8F0, transparent)',

        // Category pill
        categoryBg: isDark
            ? 'rgba(6,182,212,0.1)'
            : 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(37,99,235,0.06))',
        categoryBorder: isDark ? 'rgba(6,182,212,0.2)' : 'rgba(6,182,212,0.12)',
        categoryColor: isDark ? '#06B6D4' : '#0891B2',

        // Price block
        priceBg: isDark
            ? 'transparent'
            : 'linear-gradient(135deg, rgba(6,182,212,0.04), rgba(37,99,235,0.03))',
        priceBorder: isDark ? 'none' : '1px solid rgba(6,182,212,0.08)',
        priceStrike: isDark ? 'rgba(255,255,255,0.3)' : '#CBD5E1',

        // Stock
        stockInBg: isDark ? 'transparent' : '#ECFDF5',
        stockInBorder: isDark ? 'none' : '1px solid #A7F3D0',
        stockOutBg: isDark ? 'transparent' : '#FEF2F2',
        stockOutBorder: isDark ? 'none' : '1px solid #FECACA',
        stockInColor: isDark ? '#10B981' : '#059669',
        stockOutColor: isDark ? '#EF4444' : '#DC2626',

        // Quantity selector
        qtyBg: isDark ? 'rgba(30,41,59,0.6)' : '#F8FAFC',
        qtyBorder: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0',
        qtyShadow: isDark ? 'none' : '0 1px 2px rgba(15,23,42,0.04)',
        qtyNumBg: isDark ? 'transparent' : '#FFFFFF',
        qtyDivider: isDark ? 'rgba(255,255,255,0.06)' : '#E2E8F0',
        qtyActive: isDark ? '#06B6D4' : '#0891B2',
        qtyInactive: isDark ? 'rgba(255,255,255,0.2)' : '#CBD5E1',
        qtyHover: isDark ? 'rgba(255,255,255,0.05)' : '#EFF6FF',

        // Trust badges
        trustBg: isDark ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
        trustBorder: isDark ? 'rgba(255,255,255,0.04)' : '#F1F5F9',
        trustShadow: isDark ? 'none' : '0 1px 3px rgba(15,23,42,0.03)',
        trustLabel: isDark ? 'rgba(255,255,255,0.45)' : '#334155',
        trustSublabel: isDark ? 'rgba(255,255,255,0.25)' : '#94A3B8',
        trustColors: isDark
            ? [
                { color: '#06B6D4', bg: 'rgba(6,182,212,0.1)' },
                { color: '#2563EB', bg: 'rgba(37,99,235,0.1)' },
                { color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
            ]
            : [
                { color: '#0891B2', bg: '#ECFEFF' },
                { color: '#2563EB', bg: '#EFF6FF' },
                { color: '#059669', bg: '#ECFDF5' },
            ],

        // Floating action buttons
        fabBg: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.85)',
        fabShadow: isDark ? 'none' : '0 4px 12px rgba(0,0,0,0.08)',
        fabIcon: isDark ? 'rgba(255,255,255,0.7)' : '#64748B',

        // CTA back-to-shop
        ctaBg: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
        ctaBorder: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0',
        ctaColor: isDark ? '#FFFFFF' : '#334155',
        ctaShadow: isDark ? 'none' : '0 2px 8px rgba(15,23,42,0.04)',

        // Decorative glow
        glowOpacity: isDark ? 'opacity-20' : 'opacity-10',
        glowBg: isDark
            ? 'linear-gradient(135deg, #06B6D4, #2563EB)'
            : 'linear-gradient(135deg, #CFFAFE, #DBEAFE, #E0E7FF)',

        // Stars empty
        starEmpty: isDark ? 'rgba(255,255,255,0.15)' : '#CBD5E1',

        // Rating box
        ratingBoxBg: isDark ? 'rgba(251,191,36,0.1)' : '#FFFBEB',
        ratingBoxBorder: isDark ? 'rgba(251,191,36,0.2)' : '#FEF3C7',
        ratingTextColor: isDark ? '#FBBF24' : '#D97706',

        // Loader
        loaderRingOuter: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
        loaderRingInner: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',

        // Error
        errorBg: isDark ? 'rgba(239,68,68,0.1)' : 'linear-gradient(135deg, #FEE2E2, #FECACA)',

        // Bottom gradient overlay on image
        imgOverlay: isDark ? 'transparent' : 'linear-gradient(to top, rgba(255,255,255,0.3), transparent)',
    };
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const t = themeTokens(isDark);
    const { language } = useLanguage();
    const isAr = language === 'ar';

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<'description' | 'details'>('description');
    const [imgError, setImgError] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const { addItem } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                const data = await productsApi.getOne(Number(id));
                setProduct(data as unknown as Product);
            } catch (err: unknown) {
                const e = err as { message?: string };
                setError(e.message || 'Product not found');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        addItem({
            id: product.id,
            name: product.name,
            price: price,
            image: product.image,
        }, quantity);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 3000);
    };

    const price = product ? Number(product.price) : 0;
    const originalPrice = product?.originalPrice ? Number(product.originalPrice) : undefined;
    const rating = product ? Number(product.rating) : 0;
    const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    const renderStars = (r: number) => {
        const full = Math.floor(r);
        const half = r % 1 >= 0.5;
        return (
            <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, i) => {
                    if (i < full) return <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />;
                    if (i === full && half) return <StarHalf key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />;
                    return <Star key={i} className="w-4 h-4" style={{ color: t.starEmpty }} />;
                })}
            </div>
        );
    };

    /* ── Loading ── */
    if (isLoading) {
        return (
            <div className="min-h-screen" style={{ background: isDark ? t.pageBgFlat : t.pageBg }}>
                <Header currentPage="shop" />
                <div className="flex items-center justify-center py-40">
                    <div className="text-center">
                        <div className="relative w-16 h-16 mx-auto mb-5">
                            <div
                                className="absolute inset-0 rounded-full animate-spin"
                                style={{ border: `3px solid ${t.loaderRingOuter}`, borderTopColor: '#06B6D4' }}
                            />
                            <div
                                className="absolute inset-2 rounded-full animate-spin"
                                style={{ border: `3px solid ${t.loaderRingInner}`, borderTopColor: '#2563EB', animationDirection: 'reverse', animationDuration: '0.8s' }}
                            />
                        </div>
                        <p className="text-sm font-medium" style={{ color: t.textMuted }}>{isAr ? 'جاري تحميل تفاصيل المنتج…' : 'Loading product details…'}</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    /* ── Error ── */
    if (error || !product) {
        return (
            <div className="min-h-screen" style={{ background: isDark ? t.pageBgFlat : t.pageBg }}>
                <Header currentPage="shop" />
                <div className="flex items-center justify-center py-40">
                    <div className="text-center max-w-md mx-auto">
                        <div
                            className="w-24 h-24 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                            style={{ background: t.errorBg }}
                        >
                            <AlertCircle className="w-10 h-10" style={{ color: '#DC2626' }} />
                        </div>
                        <h2 className="text-2xl font-bold mb-2" style={{ color: t.textPrimary }}>{isAr ? 'المنتج غير موجود' : 'Product Not Found'}</h2>
                        <p className="text-sm mb-8" style={{ color: t.textSecondary }}>{error || (isAr ? 'هذا المنتج غير موجود أو تم إزالته.' : 'This product does not exist or has been removed.')}</p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
                            style={{ background: 'linear-gradient(135deg, #06B6D4, #2563EB)', boxShadow: '0 8px 25px rgba(6,182,212,0.25)' }}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {isAr ? 'العودة للمتجر' : 'Back to Shop'}
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    /* ── Product Page ── */
    return (
        <>
            {/* Keyframe animations */}
            <style jsx global>{`
                @keyframes pdp-fadeInUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes pdp-slideInR {
                    from { opacity: 0; transform: translateX(24px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes pdp-scaleIn {
                    from { opacity: 0; transform: scale(0.92); }
                    to   { opacity: 1; transform: scale(1); }
                }
                .pdp-fadeInUp  { animation: pdp-fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
                .pdp-slideInR  { animation: pdp-slideInR 0.7s cubic-bezier(0.16,1,0.3,1) both; }
                .pdp-scaleIn   { animation: pdp-scaleIn 0.6s cubic-bezier(0.16,1,0.3,1) both; }
                .pdp-d1 { animation-delay: 0.1s; }
                .pdp-d2 { animation-delay: 0.2s; }
                .pdp-d3 { animation-delay: 0.3s; }
                .pdp-d4 { animation-delay: 0.4s; }
            `}</style>

            <div className="min-h-screen" dir={isAr ? 'rtl' : 'ltr'} style={{ background: isDark ? t.pageBgFlat : t.pageBg }}>
                <Header currentPage="shop" />

                {/* ─── Breadcrumb ─── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-3">
                    <nav className="flex items-center gap-2 text-[13px] font-medium" style={{ color: t.textMuted }}>
                        <Link href="/" className="flex items-center gap-1 transition-colors" style={{ color: t.textMuted }}
                            onMouseEnter={(e) => e.currentTarget.style.color = t.textPrimary}
                            onMouseLeave={(e) => e.currentTarget.style.color = t.textMuted}>
                            <Home className="w-3.5 h-3.5" />
                            {isAr ? 'الرئيسية' : 'Home'}
                        </Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link href="/shop" className="transition-colors" style={{ color: t.textMuted }}
                            onMouseEnter={(e) => e.currentTarget.style.color = t.textPrimary}
                            onMouseLeave={(e) => e.currentTarget.style.color = t.textMuted}>
                            {isAr ? 'المتجر' : 'Shop'}
                        </Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="font-semibold" style={{ color: t.textBreadcrumbActive }}>{isAr && product.nameAr ? product.nameAr : product.name}</span>
                    </nav>
                </div>

                {/* ─── Main Product Section ─── */}
                <section className="py-6 lg:py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

                            {/* ── Left: Image ── */}
                            <div className="relative pdp-fadeInUp">
                                <div
                                    className="relative aspect-square rounded-3xl overflow-hidden group"
                                    style={{
                                        background: t.cardBg,
                                        border: `1px solid ${t.cardBorder}`,
                                        boxShadow: t.cardShadow,
                                    }}
                                >
                                    {!imgError ? (
                                        <Image
                                            src={product.image}
                                            alt={isAr && product.nameAr ? product.nameAr : product.name}
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                            className="object-contain drop-shadow-xl p-8 transition-transform duration-700 ease-out group-hover:scale-105"
                                            priority
                                            onError={() => setImgError(true)}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center gap-3" style={{ color: t.placeholderColor }}>
                                            <Package className="w-20 h-20" strokeWidth={1} />
                                            <p className="text-xs font-medium">{isAr ? 'لا توجد صورة' : 'No image available'}</p>
                                        </div>
                                    )}

                                    {/* Floating action buttons */}
                                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                        <button
                                            onClick={() => setIsWishlisted(!isWishlisted)}
                                            className="w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md transition-all duration-300"
                                            style={{
                                                background: isWishlisted ? 'rgba(239,68,68,0.9)' : t.fabBg,
                                                boxShadow: t.fabShadow,
                                            }}
                                        >
                                            <Heart
                                                className="w-4.5 h-4.5"
                                                style={{ color: isWishlisted ? '#fff' : t.fabIcon }}
                                                fill={isWishlisted ? '#fff' : 'none'}
                                            />
                                        </button>
                                        <button
                                            className="w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-105"
                                            style={{ background: t.fabBg, boxShadow: t.fabShadow }}
                                        >
                                            <Share2 className="w-4.5 h-4.5" style={{ color: t.fabIcon }} />
                                        </button>
                                    </div>

                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        {product.badge && (
                                            <span
                                                className="pdp-scaleIn px-4 py-1.5 rounded-xl text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5"
                                                style={{
                                                    background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                                    boxShadow: '0 4px 15px rgba(6,182,212,0.35)',
                                                }}
                                            >
                                                <Zap className="w-3 h-3" />
                                                {product.badge}
                                            </span>
                                        )}
                                        {discount > 0 && (
                                            <span
                                                className="pdp-scaleIn pdp-d1 px-4 py-1.5 rounded-xl text-[11px] font-bold text-white uppercase tracking-wider"
                                                style={{
                                                    background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                                                    boxShadow: '0 4px 15px rgba(239,68,68,0.3)',
                                                }}
                                            >
                                                {isAr ? `خصم ${discount}%–` : `–${discount}% OFF`}
                                            </span>
                                        )}
                                    </div>

                                    {/* Bottom gradient overlay */}
                                    <div
                                        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
                                        style={{ background: t.imgOverlay }}
                                    />
                                </div>

                                {/* Decorative glow */}
                                <div
                                    className={`absolute -inset-3 -z-10 rounded-[2rem] ${t.glowOpacity} blur-3xl`}
                                    style={{ background: t.glowBg }}
                                />
                            </div>

                            {/* ── Right: Details ── */}
                            <div className="flex flex-col justify-center pdp-slideInR pdp-d2">

                                {/* Category pill */}
                                <div
                                    className="inline-flex items-center self-start gap-1.5 px-3.5 py-1.5 rounded-full mb-5"
                                    style={{ background: t.categoryBg, border: `1px solid ${t.categoryBorder}` }}
                                >
                                    <Tag className="w-3 h-3" style={{ color: t.categoryColor }} />
                                    <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: t.categoryColor }}>
                                        {isAr && product.categoryAr ? product.categoryAr : product.category}
                                    </span>
                                </div>

                                {/* Name */}
                                <h1
                                    className="text-3xl lg:text-4xl xl:text-[2.75rem] font-extrabold mb-4 leading-[1.15] tracking-tight"
                                    style={{ color: t.textPrimary }}
                                >
                                    {isAr && product.nameAr ? product.nameAr : product.name}
                                </h1>

                                {/* Rating */}
                                <div className="flex items-center gap-3 mb-5 flex-wrap">
                                    <div
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                                        style={{ background: t.ratingBoxBg, border: `1px solid ${t.ratingBoxBorder}` }}
                                    >
                                        {renderStars(rating)}
                                        <span className="text-xs font-bold" style={{ color: t.ratingTextColor }}>{rating}</span>
                                    </div>
                                    <span className="text-[13px] font-medium" style={{ color: t.textMuted }}>
                                        ({product.reviewCount} {isAr ? 'تقييم' : 'reviews'})
                                    </span>
                                    <div className="flex items-center gap-1 text-[13px]" style={{ color: t.textMuted }}>
                                        <Eye className="w-3.5 h-3.5" />
                                        <span>{isAr ? '142 مشاهدة' : '142 views'}</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-[15px] leading-relaxed mb-7" style={{ color: t.textSecondary, lineHeight: '1.75' }}>
                                    {isAr && product.descriptionAr ? product.descriptionAr : product.description}
                                </p>

                                {/* Price */}
                                <div
                                    className="flex items-center gap-4 mb-7 p-5 rounded-2xl"
                                    style={{ background: t.priceBg, border: t.priceBorder }}
                                >
                                    <span
                                        className="text-4xl font-black tracking-tight"
                                        style={{
                                            background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        ${price.toFixed(2)}
                                    </span>
                                    {originalPrice && (
                                        <span className="text-lg line-through font-medium" style={{ color: t.priceStrike }}>
                                            ${originalPrice.toFixed(2)}
                                        </span>
                                    )}
                                    {discount > 0 && (
                                        <span
                                            className="px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider"
                                            style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: isDark ? 'none' : '1px solid #FECACA' }}
                                        >
                                            {isAr ? `وفّر $${(originalPrice! - price).toFixed(2)}` : `Save $${(originalPrice! - price).toFixed(2)}`}
                                        </span>
                                    )}
                                </div>

                                {/* Stock */}
                                <div
                                    className="flex items-center gap-2.5 mb-7 px-4 py-2.5 rounded-xl self-start"
                                    style={{
                                        background: product.inStock ? t.stockInBg : t.stockOutBg,
                                        border: product.inStock ? t.stockInBorder : t.stockOutBorder,
                                    }}
                                >
                                    {product.inStock ? (
                                        <CheckCircle2 className="w-4 h-4" style={{ color: t.stockInColor }} />
                                    ) : (
                                        <AlertCircle className="w-4 h-4" style={{ color: t.stockOutColor }} />
                                    )}
                                    <span className="text-[13px] font-semibold" style={{ color: product.inStock ? t.stockInColor : t.stockOutColor }}>
                                        {product.inStock ? (isAr ? 'متوفر — جاهز للشحن' : 'In Stock — Ready to Ship') : (isAr ? 'غير متوفر' : 'Out of Stock')}
                                    </span>
                                </div>

                                {/* Divider */}
                                <div className="h-px mb-7" style={{ background: t.divider }} />

                                {/* Quantity + Add to Cart */}
                                <div className="flex flex-col sm:flex-row gap-3 mb-7">
                                    {/* Quantity */}
                                    <div
                                        className="flex items-center rounded-2xl overflow-hidden"
                                        style={{ background: t.qtyBg, border: `1px solid ${t.qtyBorder}`, boxShadow: t.qtyShadow }}
                                    >
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-12 h-13 flex items-center justify-center transition-all duration-200"
                                            style={{ color: quantity > 1 ? t.qtyActive : t.qtyInactive }}
                                            disabled={quantity <= 1}
                                            onMouseEnter={(e) => { if (quantity > 1) e.currentTarget.style.background = t.qtyHover; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}
                                        >
                                            <Minus className="w-4 h-4" strokeWidth={2.5} />
                                        </button>
                                        <div
                                            className="w-14 h-13 flex items-center justify-center text-lg font-bold"
                                            style={{
                                                color: t.textPrimary,
                                                borderLeft: `1px solid ${t.qtyDivider}`,
                                                borderRight: `1px solid ${t.qtyDivider}`,
                                                background: t.qtyNumBg,
                                            }}
                                        >
                                            {quantity}
                                        </div>
                                        <button
                                            onClick={() => setQuantity(Math.min(99, quantity + 1))}
                                            className="w-12 h-13 flex items-center justify-center transition-all duration-200"
                                            style={{ color: t.qtyActive }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = t.qtyHover; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}
                                        >
                                            <Plus className="w-4 h-4" strokeWidth={2.5} />
                                        </button>
                                    </div>

                                    {/* Add to Cart */}
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={!product.inStock}
                                        className="flex-1 flex items-center justify-center gap-3 h-13 rounded-2xl text-sm font-bold text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                                        style={{
                                            background: addedToCart
                                                ? 'linear-gradient(135deg, #10B981, #059669)'
                                                : 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                            boxShadow: addedToCart
                                                ? '0 8px 25px rgba(16,185,129,0.3)'
                                                : '0 8px 25px rgba(6,182,212,0.25)',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (product.inStock && !addedToCart) {
                                                e.currentTarget.style.boxShadow = '0 12px 35px rgba(6,182,212,0.4)';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.boxShadow = addedToCart
                                                ? '0 8px 25px rgba(16,185,129,0.3)'
                                                : '0 8px 25px rgba(6,182,212,0.25)';
                                            e.currentTarget.style.transform = '';
                                        }}
                                    >
                                        {addedToCart ? (
                                            <>
                                                <Check className="w-5 h-5" strokeWidth={2.5} />
                                                {isAr ? 'تمت الإضافة!' : 'Added to Cart!'}
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart className="w-5 h-5" />
                                                {isAr ? `أضف للسلة — $${(price * quantity).toFixed(2)}` : `Add to Cart — $${(price * quantity).toFixed(2)}`}
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Trust badges */}
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { icon: <Truck className="w-5 h-5" />, label: isAr ? 'شحن مجاني' : 'Free Shipping', sublabel: isAr ? 'للطلبات +$50' : 'On orders $50+', idx: 0 },
                                        { icon: <ShieldCheck className="w-5 h-5" />, label: isAr ? 'دفع آمن' : 'Secure Payment', sublabel: isAr ? 'مشفر 100%' : '100% encrypted', idx: 1 },
                                        { icon: <RotateCcw className="w-5 h-5" />, label: isAr ? 'إرجاع 30 يوم' : '30-Day Returns', sublabel: isAr ? 'استرداد الأموال' : 'Money back', idx: 2 },
                                    ].map((badge) => {
                                        const tc = t.trustColors[badge.idx];
                                        return (
                                            <div
                                                key={badge.idx}
                                                className="flex flex-col items-center gap-1.5 py-4 px-2 rounded-2xl transition-all duration-300 cursor-default"
                                                style={{ background: t.trustBg, border: `1px solid ${t.trustBorder}`, boxShadow: t.trustShadow }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = tc.bg;
                                                    e.currentTarget.style.borderColor = `${tc.color}30`;
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                    e.currentTarget.style.boxShadow = `0 8px 20px ${tc.color}12`;
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = t.trustBg;
                                                    e.currentTarget.style.borderColor = t.trustBorder;
                                                    e.currentTarget.style.transform = '';
                                                    e.currentTarget.style.boxShadow = t.trustShadow;
                                                }}
                                            >
                                                <div
                                                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-0.5"
                                                    style={{ background: tc.bg }}
                                                >
                                                    <span style={{ color: tc.color }}>{badge.icon}</span>
                                                </div>
                                                <span className="text-[11px] font-semibold" style={{ color: t.trustLabel }}>{badge.label}</span>
                                                <span className="text-[10px]" style={{ color: t.trustSublabel }}>{badge.sublabel}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── Description / Specs ─── */}
                <section className="py-14" style={{ background: t.sectionAlt }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Tab bar */}
                        <div
                            className="flex gap-1 mb-10 p-1.5 max-w-md rounded-2xl pdp-fadeInUp pdp-d3"
                            style={{ background: t.tabBarBg, boxShadow: t.tabBarShadow, border: t.tabBarBorder }}
                        >
                            {(['description', 'details'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className="flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300"
                                    style={{
                                        background: activeTab === tab ? 'linear-gradient(135deg, #06B6D4, #2563EB)' : 'transparent',
                                        color: activeTab === tab ? '#fff' : t.tabInactiveColor,
                                        boxShadow: activeTab === tab ? '0 4px 15px rgba(6,182,212,0.25)' : 'none',
                                    }}
                                >
                                    {tab === 'description' ? (isAr ? 'الوصف الكامل' : 'Full Description') : (isAr ? 'المواصفات' : 'Specifications')}
                                </button>
                            ))}
                        </div>

                        {/* Tab content */}
                        <div
                            className="rounded-3xl p-8 lg:p-10 pdp-fadeInUp pdp-d4"
                            style={{
                                background: t.tabContentBg,
                                border: `1px solid ${t.tabContentBorder}`,
                                boxShadow: t.tabContentShadow,
                            }}
                        >
                            {activeTab === 'description' ? (
                                <div className="max-w-3xl">
                                    {(() => {
                                        const fullDesc = isAr && product.fullDescriptionAr
                                            ? product.fullDescriptionAr
                                            : isAr && product.descriptionAr
                                                ? product.descriptionAr
                                                : (product.fullDescription || product.description);
                                        return fullDesc.split('\n\n').map((paragraph, i) => (
                                            <p
                                                key={i}
                                                className="text-[15px] leading-relaxed mb-5 last:mb-0"
                                                style={{ color: t.textSecondary, lineHeight: '1.85' }}
                                            >
                                                {paragraph}
                                            </p>
                                        ));
                                    })()}
                                </div>
                            ) : (
                                <div className="max-w-2xl">
                                    <div className="space-y-0">
                                        {[
                                            { icon: <Hash className="w-4 h-4" />, label: isAr ? 'رقم المنتج' : 'Product ID', value: `#${product.id}` },
                                            { icon: <Tag className="w-4 h-4" />, label: isAr ? 'الفئة' : 'Category', value: isAr && product.categoryAr ? product.categoryAr : product.category },
                                            { icon: <Package className="w-4 h-4" />, label: isAr ? 'السعر' : 'Price', value: `$${price.toFixed(2)}` },
                                            { icon: <BarChart3 className="w-4 h-4" />, label: isAr ? 'التقييم' : 'Rating', value: `${rating} / 5 (${product.reviewCount} ${isAr ? 'تقييمات' : 'reviews'})` },
                                            { icon: <CheckCircle2 className="w-4 h-4" />, label: isAr ? 'التوفر' : 'Availability', value: product.inStock ? (isAr ? 'متوفر' : 'In Stock') : (isAr ? 'غير متوفر' : 'Out of Stock') },
                                            ...(product.badge ? [{ icon: <Award className="w-4 h-4" />, label: isAr ? 'شارة' : 'Badge', value: product.badge }] : []),
                                        ].map((spec, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between py-4 transition-colors duration-200 px-4 -mx-4 rounded-xl"
                                                style={{ borderBottom: `1px solid ${t.specBorder}` }}
                                                onMouseEnter={(e) => { e.currentTarget.style.background = t.specHoverBg; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                                                        style={{ background: t.specIconBg }}
                                                    >
                                                        <span style={{ color: t.categoryColor }}>{spec.icon}</span>
                                                    </div>
                                                    <span className="text-sm font-medium" style={{ color: t.textSecondary }}>{spec.label}</span>
                                                </div>
                                                <span className="text-sm font-bold" style={{ color: t.textPrimary }}>{spec.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* ─── Back to Shop ─── */}
                <section className="py-14">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-300"
                            style={{
                                background: t.ctaBg,
                                border: `1px solid ${t.ctaBorder}`,
                                color: t.ctaColor,
                                boxShadow: t.ctaShadow,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#06B6D4';
                                e.currentTarget.style.color = t.textBreadcrumbActive;
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(6,182,212,0.12)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = t.ctaBorder;
                                e.currentTarget.style.color = t.ctaColor;
                                e.currentTarget.style.transform = '';
                                e.currentTarget.style.boxShadow = t.ctaShadow;
                            }}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {isAr ? 'تابع التسوق' : 'Continue Shopping'}
                        </Link>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
}
