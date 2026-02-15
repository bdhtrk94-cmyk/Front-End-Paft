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

/* ────────────────────────────────────────────────── */
/*  Light-theme single-product page (modern edition)  */
/* ────────────────────────────────────────────────── */

export default function ProductPageLight({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

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
                    return <Star key={i} className="w-4 h-4" style={{ color: '#CBD5E1' }} />;
                })}
            </div>
        );
    };

    /* ── Loading skeleton ── */
    if (isLoading) {
        return (
            <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)' }}>
                <Header currentPage="shop" />
                <div className="flex items-center justify-center py-40">
                    <div className="text-center">
                        <div className="relative w-16 h-16 mx-auto mb-5">
                            <div
                                className="absolute inset-0 rounded-full animate-spin"
                                style={{ border: '3px solid #E2E8F0', borderTopColor: '#06B6D4' }}
                            />
                            <div
                                className="absolute inset-2 rounded-full animate-spin"
                                style={{ border: '3px solid #E2E8F0', borderTopColor: '#2563EB', animationDirection: 'reverse', animationDuration: '0.8s' }}
                            />
                        </div>
                        <p className="text-sm font-medium" style={{ color: '#94A3B8' }}>Loading product details…</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    /* ── Error ── */
    if (error || !product) {
        return (
            <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)' }}>
                <Header currentPage="shop" />
                <div className="flex items-center justify-center py-40">
                    <div className="text-center max-w-md mx-auto">
                        <div
                            className="w-24 h-24 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #FEE2E2, #FECACA)' }}
                        >
                            <AlertCircle className="w-10 h-10" style={{ color: '#DC2626' }} />
                        </div>
                        <h2 className="text-2xl font-bold mb-2" style={{ color: '#0F172A' }}>Product Not Found</h2>
                        <p className="text-sm mb-8" style={{ color: '#64748B' }}>{error || 'This product does not exist or has been removed.'}</p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
                            style={{ background: 'linear-gradient(135deg, #06B6D4, #2563EB)', boxShadow: '0 8px 25px rgba(6,182,212,0.25)' }}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Shop
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
            {/* Inject keyframe animations */}
            <style jsx global>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(24px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.92); }
                    to   { opacity: 1; transform: scale(1); }
                }
                @keyframes shimmer {
                    0%   { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                .animate-fadeInUp   { animation: fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
                .animate-slideInR   { animation: slideInRight 0.7s cubic-bezier(0.16,1,0.3,1) both; }
                .animate-scaleIn    { animation: scaleIn 0.6s cubic-bezier(0.16,1,0.3,1) both; }
                .delay-100 { animation-delay: 0.10s; }
                .delay-200 { animation-delay: 0.20s; }
                .delay-300 { animation-delay: 0.30s; }
                .delay-400 { animation-delay: 0.40s; }
                .delay-500 { animation-delay: 0.50s; }
            `}</style>

            <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 50%, #F8FAFC 100%)' }}>
                <Header currentPage="shop" />

                {/* ─── Breadcrumb ─── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-3">
                    <nav className="flex items-center gap-2 text-[13px] font-medium" style={{ color: '#94A3B8' }}>
                        <Link href="/" className="flex items-center gap-1 transition-colors hover:text-slate-700">
                            <Home className="w-3.5 h-3.5" />
                            Home
                        </Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link href="/shop" className="transition-colors hover:text-slate-700">Shop</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="font-semibold" style={{ color: '#0891B2' }}>{product.name}</span>
                    </nav>
                </div>

                {/* ─── Main Product Section ─── */}
                <section className="py-6 lg:py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

                            {/* ── Left: Image ── */}
                            <div className="relative animate-fadeInUp">
                                {/* Main image card */}
                                <div
                                    className="relative aspect-square rounded-3xl overflow-hidden group"
                                    style={{
                                        background: '#FFFFFF',
                                        boxShadow: '0 4px 40px rgba(15,23,42,0.06), 0 0 0 1px rgba(15,23,42,0.04)',
                                    }}
                                >
                                    {!imgError ? (
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                            priority
                                            onError={() => setImgError(true)}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center gap-3" style={{ color: '#CBD5E1' }}>
                                            <Package className="w-20 h-20" strokeWidth={1} />
                                            <p className="text-xs font-medium">No image available</p>
                                        </div>
                                    )}

                                    {/* Floating action buttons (top-right) */}
                                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                        <button
                                            onClick={() => setIsWishlisted(!isWishlisted)}
                                            className="w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md transition-all duration-300"
                                            style={{
                                                background: isWishlisted ? 'rgba(239,68,68,0.9)' : 'rgba(255,255,255,0.85)',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                            }}
                                        >
                                            <Heart
                                                className="w-4.5 h-4.5"
                                                style={{ color: isWishlisted ? '#fff' : '#64748B' }}
                                                fill={isWishlisted ? '#fff' : 'none'}
                                            />
                                        </button>
                                        <button
                                            className="w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-105"
                                            style={{ background: 'rgba(255,255,255,0.85)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                                        >
                                            <Share2 className="w-4.5 h-4.5" style={{ color: '#64748B' }} />
                                        </button>
                                    </div>

                                    {/* Badges (top-left) */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        {product.badge && (
                                            <span
                                                className="animate-scaleIn px-4 py-1.5 rounded-xl text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5"
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
                                                className="animate-scaleIn delay-100 px-4 py-1.5 rounded-xl text-[11px] font-bold text-white uppercase tracking-wider"
                                                style={{
                                                    background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                                                    boxShadow: '0 4px 15px rgba(239,68,68,0.3)',
                                                }}
                                            >
                                                –{discount}% OFF
                                            </span>
                                        )}
                                    </div>

                                    {/* Bottom gradient overlay for visual depth */}
                                    <div
                                        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
                                        style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.3), transparent)' }}
                                    />
                                </div>

                                {/* Decorative background element */}
                                <div
                                    className="absolute -inset-3 -z-10 rounded-[2rem] opacity-30 blur-3xl"
                                    style={{ background: 'linear-gradient(135deg, #CFFAFE, #DBEAFE, #E0E7FF)' }}
                                />
                            </div>

                            {/* ── Right: Details ── */}
                            <div className="flex flex-col justify-center animate-slideInR delay-200">

                                {/* Category pill */}
                                <div
                                    className="inline-flex items-center self-start gap-1.5 px-3.5 py-1.5 rounded-full mb-5"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(37,99,235,0.06))',
                                        border: '1px solid rgba(6,182,212,0.12)',
                                    }}
                                >
                                    <Tag className="w-3 h-3" style={{ color: '#0891B2' }} />
                                    <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#0891B2' }}>
                                        {product.category}
                                    </span>
                                </div>

                                {/* Product name */}
                                <h1
                                    className="text-3xl lg:text-4xl xl:text-[2.75rem] font-extrabold mb-4 leading-[1.15] tracking-tight"
                                    style={{ color: '#0F172A' }}
                                >
                                    {product.name}
                                </h1>

                                {/* Rating row */}
                                <div className="flex items-center gap-3 mb-5">
                                    <div
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                                        style={{ background: '#FFFBEB', border: '1px solid #FEF3C7' }}
                                    >
                                        {renderStars(rating)}
                                        <span className="text-xs font-bold" style={{ color: '#D97706' }}>{rating}</span>
                                    </div>
                                    <span className="text-[13px] font-medium" style={{ color: '#94A3B8' }}>
                                        ({product.reviewCount} reviews)
                                    </span>
                                    <div className="flex items-center gap-1 text-[13px]" style={{ color: '#94A3B8' }}>
                                        <Eye className="w-3.5 h-3.5" />
                                        <span>142 views</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-[15px] leading-relaxed mb-7" style={{ color: '#64748B', lineHeight: '1.75' }}>
                                    {product.description}
                                </p>

                                {/* Price block */}
                                <div
                                    className="flex items-center gap-4 mb-7 p-5 rounded-2xl"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(6,182,212,0.04), rgba(37,99,235,0.03))',
                                        border: '1px solid rgba(6,182,212,0.08)',
                                    }}
                                >
                                    <span
                                        className="text-4xl font-black tracking-tight"
                                        style={{
                                            background: 'linear-gradient(135deg, #0891B2, #2563EB)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        ${price.toFixed(2)}
                                    </span>
                                    {originalPrice && (
                                        <span className="text-lg line-through font-medium" style={{ color: '#CBD5E1' }}>
                                            ${originalPrice.toFixed(2)}
                                        </span>
                                    )}
                                    {discount > 0 && (
                                        <span
                                            className="px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider"
                                            style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
                                        >
                                            Save ${(originalPrice! - price).toFixed(2)}
                                        </span>
                                    )}
                                </div>

                                {/* Stock status */}
                                <div
                                    className="flex items-center gap-2.5 mb-7 px-4 py-2.5 rounded-xl self-start"
                                    style={{
                                        background: product.inStock ? '#ECFDF5' : '#FEF2F2',
                                        border: `1px solid ${product.inStock ? '#A7F3D0' : '#FECACA'}`,
                                    }}
                                >
                                    {product.inStock ? (
                                        <CheckCircle2 className="w-4 h-4" style={{ color: '#059669' }} />
                                    ) : (
                                        <AlertCircle className="w-4 h-4" style={{ color: '#DC2626' }} />
                                    )}
                                    <span className="text-[13px] font-semibold" style={{ color: product.inStock ? '#059669' : '#DC2626' }}>
                                        {product.inStock ? 'In Stock — Ready to Ship' : 'Out of Stock'}
                                    </span>
                                </div>

                                {/* Divider */}
                                <div className="h-px mb-7" style={{ background: 'linear-gradient(to right, transparent, #E2E8F0, transparent)' }} />

                                {/* Quantity + Add to Cart */}
                                <div className="flex flex-col sm:flex-row gap-3 mb-7">
                                    {/* Quantity Selector */}
                                    <div
                                        className="flex items-center rounded-2xl overflow-hidden"
                                        style={{
                                            background: '#F8FAFC',
                                            border: '1px solid #E2E8F0',
                                            boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
                                        }}
                                    >
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-12 h-13 flex items-center justify-center transition-all duration-200"
                                            style={{ color: quantity > 1 ? '#0891B2' : '#CBD5E1' }}
                                            disabled={quantity <= 1}
                                            onMouseEnter={(e) => { if (quantity > 1) e.currentTarget.style.background = '#EFF6FF'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}
                                        >
                                            <Minus className="w-4 h-4" strokeWidth={2.5} />
                                        </button>
                                        <div
                                            className="w-14 h-13 flex items-center justify-center text-lg font-bold"
                                            style={{
                                                color: '#0F172A',
                                                borderLeft: '1px solid #E2E8F0',
                                                borderRight: '1px solid #E2E8F0',
                                                background: '#FFFFFF',
                                            }}
                                        >
                                            {quantity}
                                        </div>
                                        <button
                                            onClick={() => setQuantity(Math.min(99, quantity + 1))}
                                            className="w-12 h-13 flex items-center justify-center transition-all duration-200"
                                            style={{ color: '#0891B2' }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = '#EFF6FF'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}
                                        >
                                            <Plus className="w-4 h-4" strokeWidth={2.5} />
                                        </button>
                                    </div>

                                    {/* Add to Cart Button */}
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
                                                Added to Cart!
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart className="w-5 h-5" />
                                                Add to Cart — ${(price * quantity).toFixed(2)}
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Trust badges */}
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { icon: <Truck className="w-5 h-5" />, label: 'Free Shipping', sublabel: 'On orders $50+', color: '#0891B2', bg: '#ECFEFF' },
                                        { icon: <ShieldCheck className="w-5 h-5" />, label: 'Secure Payment', sublabel: '100% encrypted', color: '#2563EB', bg: '#EFF6FF' },
                                        { icon: <RotateCcw className="w-5 h-5" />, label: '30-Day Returns', sublabel: 'Money back', color: '#059669', bg: '#ECFDF5' },
                                    ].map((badge, i) => (
                                        <div
                                            key={i}
                                            className="flex flex-col items-center gap-1.5 py-4 px-2 rounded-2xl transition-all duration-300 cursor-default"
                                            style={{
                                                background: '#FFFFFF',
                                                border: '1px solid #F1F5F9',
                                                boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = badge.bg;
                                                e.currentTarget.style.borderColor = `${badge.color}25`;
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = `0 8px 20px ${badge.color}12`;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = '#FFFFFF';
                                                e.currentTarget.style.borderColor = '#F1F5F9';
                                                e.currentTarget.style.transform = '';
                                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(15,23,42,0.03)';
                                            }}
                                        >
                                            <div
                                                className="w-9 h-9 rounded-xl flex items-center justify-center mb-0.5"
                                                style={{ background: badge.bg }}
                                            >
                                                <span style={{ color: badge.color }}>{badge.icon}</span>
                                            </div>
                                            <span className="text-[11px] font-semibold" style={{ color: '#334155' }}>{badge.label}</span>
                                            <span className="text-[10px]" style={{ color: '#94A3B8' }}>{badge.sublabel}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── Description / Specs Tabs ─── */}
                <section className="py-14" style={{ background: 'rgba(241,245,249,0.5)' }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Tab bar */}
                        <div
                            className="flex gap-1 mb-10 p-1.5 max-w-md rounded-2xl animate-fadeInUp delay-300"
                            style={{ background: '#FFFFFF', boxShadow: '0 2px 8px rgba(15,23,42,0.04)', border: '1px solid #F1F5F9' }}
                        >
                            {(['description', 'details'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className="flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300"
                                    style={{
                                        background: activeTab === tab ? 'linear-gradient(135deg, #06B6D4, #2563EB)' : 'transparent',
                                        color: activeTab === tab ? '#fff' : '#94A3B8',
                                        boxShadow: activeTab === tab ? '0 4px 15px rgba(6,182,212,0.25)' : 'none',
                                    }}
                                >
                                    {tab === 'description' ? 'Full Description' : 'Specifications'}
                                </button>
                            ))}
                        </div>

                        {/* Tab content */}
                        <div
                            className="rounded-3xl p-8 lg:p-10 animate-fadeInUp delay-400"
                            style={{
                                background: '#FFFFFF',
                                border: '1px solid #F1F5F9',
                                boxShadow: '0 4px 20px rgba(15,23,42,0.04)',
                            }}
                        >
                            {activeTab === 'description' ? (
                                <div className="max-w-3xl">
                                    {(product.fullDescription || product.description).split('\n\n').map((paragraph, i) => (
                                        <p
                                            key={i}
                                            className="text-[15px] leading-relaxed mb-5 last:mb-0"
                                            style={{ color: '#64748B', lineHeight: '1.85' }}
                                        >
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            ) : (
                                <div className="max-w-2xl">
                                    <div className="space-y-0">
                                        {[
                                            { icon: <Hash className="w-4 h-4" />, label: 'Product ID', value: `#${product.id}` },
                                            { icon: <Tag className="w-4 h-4" />, label: 'Category', value: product.category },
                                            { icon: <Package className="w-4 h-4" />, label: 'Price', value: `$${price.toFixed(2)}` },
                                            { icon: <BarChart3 className="w-4 h-4" />, label: 'Rating', value: `${rating} / 5 (${product.reviewCount} reviews)` },
                                            { icon: <CheckCircle2 className="w-4 h-4" />, label: 'Availability', value: product.inStock ? 'In Stock' : 'Out of Stock' },
                                            ...(product.badge ? [{ icon: <Award className="w-4 h-4" />, label: 'Badge', value: product.badge }] : []),
                                        ].map((spec, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between py-4 transition-colors duration-200 px-4 -mx-4 rounded-xl hover:bg-slate-50"
                                                style={{ borderBottom: '1px solid #F1F5F9' }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                                                        style={{ background: '#ECFEFF' }}
                                                    >
                                                        <span style={{ color: '#0891B2' }}>{spec.icon}</span>
                                                    </div>
                                                    <span className="text-sm font-medium" style={{ color: '#64748B' }}>{spec.label}</span>
                                                </div>
                                                <span className="text-sm font-bold" style={{ color: '#0F172A' }}>{spec.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* ─── Back to Shop CTA ─── */}
                <section className="py-14">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-300"
                            style={{
                                background: '#FFFFFF',
                                border: '1px solid #E2E8F0',
                                color: '#334155',
                                boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#06B6D4';
                                e.currentTarget.style.color = '#0891B2';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(6,182,212,0.12)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#E2E8F0';
                                e.currentTarget.style.color = '#334155';
                                e.currentTarget.style.transform = '';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(15,23,42,0.04)';
                            }}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Continue Shopping
                        </Link>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
}
