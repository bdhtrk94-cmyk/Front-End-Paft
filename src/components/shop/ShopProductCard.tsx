'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/shopData';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

interface ProductCardProps {
    product: Product;
}

export default function ShopProductCard({ product }: ProductCardProps) {
    const [imgError, setImgError] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const { addItem } = useCart();
    const { theme } = useTheme();
    const isLight = theme === 'light';
    const { language } = useLanguage();
    const isAr = language === 'ar';

    const displayName = (isAr && product.nameAr) ? product.nameAr : product.name;
    const displayCategory = (isAr && product.categoryAr) ? product.categoryAr : product.category;

    const price = Number(product.price);
    const originalPrice = product.originalPrice ? Number(product.originalPrice) : undefined;
    const rating = Number(product.rating);

    const discount = originalPrice
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            id: product.id,
            name: product.name,
            price: price,
            image: product.image,
        });
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const renderStars = (rating: number) => {
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5;
        return (
            <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                    <svg
                        key={i}
                        className="w-3.5 h-3.5"
                        fill={i < full ? '#F59E0B' : i === full && half ? 'url(#half-star)' : isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)'}
                        viewBox="0 0 20 20"
                    >
                        {i === full && half && (
                            <defs>
                                <linearGradient id="half-star">
                                    <stop offset="50%" stopColor="#F59E0B" />
                                    <stop offset="50%" stopColor={isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)'} />
                                </linearGradient>
                            </defs>
                        )}
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    return (
        <Link href={`/shop/${product.id}`} className="block">
            <div
                className="group relative rounded-2xl overflow-hidden transition-all duration-800"
                style={{
                    background: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(30,41,59,0.5)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`,
                    boxShadow: isLight ? '0 2px 12px rgba(0,0,0,0.04)' : 'none',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = isLight
                        ? '0 25px 50px rgba(0,0,0,0.1), 0 0 30px rgba(6,182,212,0.05)'
                        : '0 25px 50px rgba(0,0,0,0.3), 0 0 30px rgba(6,182,212,0.1)';
                    e.currentTarget.style.borderColor = isLight ? 'rgba(6,182,212,0.15)' : 'rgba(6,182,212,0.2)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = isLight ? '0 2px 12px rgba(0,0,0,0.04)' : '';
                    e.currentTarget.style.borderColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
                }}
            >
                {/* Image */}
                <div
                    className="relative aspect-square overflow-hidden"
                    style={{ background: isLight ? '#F0F9FF' : 'rgba(15,23,42,0.5)' }}
                >
                    {!imgError ? (
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition-transform duration-800 group-hover:scale-110"
                            loading="lazy"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ color: isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)' }}>
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    )}

                    {/* Overlay gradient */}
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-800"
                        style={{
                            background: isLight
                                ? 'linear-gradient(180deg, transparent 50%, rgba(248,251,255,0.6) 100%)'
                                : 'linear-gradient(180deg, transparent 50%, rgba(11,17,33,0.6) 100%)',
                        }}
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.badge && (
                            <span
                                className="px-3 py-1 rounded-full text-xs font-bold text-white"
                                style={{
                                    background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                    boxShadow: '0 4px 12px rgba(6,182,212,0.4)',
                                }}
                            >
                                {product.badge}
                            </span>
                        )}
                        {discount > 0 && (
                            <span
                                className="px-3 py-1 rounded-full text-xs font-bold text-white"
                                style={{ background: '#EF4444', boxShadow: '0 4px 12px rgba(239,68,68,0.4)' }}
                            >
                                –{discount}%
                            </span>
                        )}
                    </div>

                    {/* Quick-view hover button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-800">
                        <button
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-800"
                            style={{
                                background: 'rgba(6,182,212,0.85)',
                                backdropFilter: 'blur(10px)',
                                transform: 'translateY(10px)',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#06B6D4'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(6,182,212,0.85)'; }}
                        >
                            {isAr ? 'عرض سريع' : 'Quick View'}
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Category */}
                    <span className="text-[0.7rem] font-semibold uppercase tracking-wider" style={{ color: '#06B6D4' }}>
                        {displayCategory}
                    </span>

                    {/* Name */}
                    <h3
                        className="text-sm font-bold mt-1.5 mb-2 line-clamp-2 leading-snug"
                        style={{ color: isLight ? '#0F172A' : '#fff' }}
                    >
                        {displayName}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                        {renderStars(rating)}
                        <span className="text-xs font-medium" style={{ color: isLight ? '#94A3B8' : 'rgba(255,255,255,0.4)' }}>
                            {rating} ({product.reviewCount})
                        </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-xl font-bold" style={{ color: '#06B6D4' }}>
                            ${price.toFixed(2)}
                        </span>
                        {originalPrice && (
                            <span className="text-sm line-through" style={{ color: isLight ? '#CBD5E1' : 'rgba(255,255,255,0.3)' }}>
                                ${originalPrice.toFixed(2)}
                            </span>
                        )}
                    </div>

                    {/* Stock + Add to Cart */}
                    <div className="flex items-center justify-between gap-3">
                        <span
                            className="text-xs font-medium flex items-center gap-1"
                            style={{ color: product.inStock ? '#10B981' : '#EF4444' }}
                        >
                            <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ background: product.inStock ? '#10B981' : '#EF4444' }}
                            />
                            {product.inStock ? (isAr ? 'متوفر' : 'In Stock') : (isAr ? 'غير متوفر' : 'Out of Stock')}
                        </span>

                        <button
                            onClick={handleAddToCart}
                            disabled={!product.inStock}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all duration-800 disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{
                                background: addedToCart
                                    ? '#10B981'
                                    : 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                boxShadow: addedToCart
                                    ? '0 4px 12px rgba(16,185,129,0.4)'
                                    : '0 4px 12px rgba(6,182,212,0.3)',
                            }}
                            onMouseEnter={(e) => {
                                if (product.inStock && !addedToCart) {
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(6,182,212,0.5)';
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = addedToCart
                                    ? '0 4px 12px rgba(16,185,129,0.4)'
                                    : '0 4px 12px rgba(6,182,212,0.3)';
                                e.currentTarget.style.transform = '';
                            }}
                        >
                            {addedToCart ? (
                                <>
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {isAr ? 'تمت الإضافة' : 'Added'}
                                </>
                            ) : (
                                <>
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                                    </svg>
                                    {isAr ? 'أضف للسلة' : 'Add to Cart'}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
