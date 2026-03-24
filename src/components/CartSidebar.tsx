'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import {
    X,
    Minus,
    Plus,
    Trash2,
    ShoppingBag,
    ShoppingCart,
    ArrowRight,
} from 'lucide-react';
import { useEffect, useState } from 'react';

/* ─── Theme tokens ─── */
function cartTokens(isDark: boolean) {
    return {
        // Sidebar bg
        sidebarBg: isDark
            ? 'linear-gradient(180deg, #0F172A 0%, #0B1121 100%)'
            : 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
        sidebarBorder: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)',
        sidebarShadow: isDark ? '-20px 0 60px rgba(0,0,0,0.5)' : '-20px 0 60px rgba(15,23,42,0.12)',

        // Header / footer border
        sectionBorder: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)',

        // Footer bg
        footerBg: isDark ? 'rgba(15,23,42,0.5)' : 'rgba(241,245,249,0.7)',

        // Text
        textPrimary: isDark ? '#FFFFFF' : '#0F172A',
        textSecondary: isDark ? 'rgba(255,255,255,0.5)' : '#64748B',
        textMuted: isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8',
        textFaint: isDark ? 'rgba(255,255,255,0.3)' : '#CBD5E1',
        textEmptyIcon: isDark ? 'rgba(255,255,255,0.15)' : '#CBD5E1',

        // Close button
        closeBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.04)',
        closeColor: isDark ? 'rgba(255,255,255,0.5)' : '#64748B',

        // Empty state bg
        emptyBg: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(15,23,42,0.03)',

        // Item card
        itemBg: isDark ? 'rgba(30,41,59,0.4)' : '#FFFFFF',
        itemBorder: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)',
        itemShadow: isDark ? 'none' : '0 2px 8px rgba(15,23,42,0.04)',

        // Image placeholder
        imgBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.03)',

        // Quantity controls
        qtyBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.04)',
        qtyBorder: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)',
        qtyDivider: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)',
        qtyActive: isDark ? '#06B6D4' : '#0891B2',
        qtyInactive: isDark ? 'rgba(255,255,255,0.2)' : '#CBD5E1',
        qtyHover: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.08)',

        // Delete button
        deleteBg: isDark ? 'rgba(239,68,68,0.05)' : 'rgba(239,68,68,0.04)',
        deleteColor: isDark ? 'rgba(255,255,255,0.3)' : '#CBD5E1',
        deleteHoverBg: isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.1)',

        // Clear cart
        clearColor: isDark ? 'rgba(255,255,255,0.3)' : '#94A3B8',
        clearHoverBg: isDark ? 'rgba(239,68,68,0.05)' : 'rgba(239,68,68,0.05)',

        // Scrollbar
        scrollThumb: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.1)',
        scrollThumbHover: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(15,23,42,0.2)',

        // Item name hover
        nameHoverClass: isDark ? 'hover:text-cyan-400' : 'hover:text-cyan-600',
    };
}

export default function CartSidebar() {
    const { items, totalItems, totalPrice, isOpen, closeCart, updateQuantity, removeItem, clearCart } = useCart();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { language } = useLanguage();
    const isAr = language === 'ar';
    const t = cartTokens(isDark);
    const [mounted, setMounted] = useState(false);
    const [renderedLang, setRenderedLang] = useState(language);

    const isLangChanging = language !== renderedLang;

    useEffect(() => {
        if (isLangChanging) {
            const timer = setTimeout(() => {
                setRenderedLang(language);
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [language, isLangChanging]);

    useEffect(() => {
        // Use setTimeout to avoid synchronous setState in effect
        const timer = setTimeout(() => {
            setMounted(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    // Lock body scroll when sidebar is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!mounted) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[10000] transition-all duration-700"
                style={{
                    background: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(15,23,42,0.3)',
                    backdropFilter: isOpen ? 'blur(8px)' : 'blur(0px)',
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? 'auto' : 'none',
                }}
                onClick={closeCart}
            />

            {/* Sidebar */}
            <aside
                dir={isAr ? 'rtl' : 'ltr'}
                className={`fixed top-0 ${isAr ? 'left-0' : 'right-0'} z-[10001] h-full w-full sm:w-[420px] flex flex-col ${isAr ? 'font-arabic' : ''}`}
                style={{
                    transform: isOpen ? 'translateX(0)' : `translateX(${isAr ? '-100%' : '100%'})`,
                    transition: isLangChanging ? 'none' : 'transform 700ms cubic-bezier(0.32,0.72,0,1)',
                    background: t.sidebarBg,
                    borderLeft: isAr ? 'none' : `1px solid ${t.sidebarBorder}`,
                    borderRight: isAr ? `1px solid ${t.sidebarBorder}` : 'none',
                    boxShadow: isOpen ? t.sidebarShadow : 'none',
                }}
            >
                {/* ── Header ── */}
                <div
                    className="flex items-center justify-between px-6 py-5"
                    style={{ borderBottom: `1px solid ${t.sectionBorder}` }}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #06B6D4, #2563EB)' }}
                        >
                            <ShoppingBag className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold" style={{ color: t.textPrimary }}>{isAr ? 'عربة التسوق' : 'Your Cart'}</h2>
                            <p className="text-xs" style={{ color: t.textMuted }}>
                                {isAr ? `${totalItems} عنصر` : `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={closeCart}
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-700 hover:scale-110"
                        style={{ background: t.closeBg, color: t.closeColor }}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* ── Items ── */}
                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center px-6">
                        <div
                            className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                            style={{ background: t.emptyBg }}
                        >
                            <ShoppingCart className="w-10 h-10" style={{ color: t.textEmptyIcon }} />
                        </div>
                        <h3 className="text-lg font-semibold mb-2" style={{ color: t.textPrimary }}>{isAr ? 'عربة التسوق فارغة' : 'Your cart is empty'}</h3>
                        <p className="text-sm text-center mb-8" style={{ color: t.textMuted }}>
                            {isAr ? 'تصفح منتجاتنا وأضف عناصر إلى عربة التسوق الخاصة بك' : 'Browse our products and add items to your cart'}
                        </p>
                        <Link
                            href="/shop"
                            onClick={closeCart}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all duration-700"
                            style={{
                                background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                boxShadow: '0 4px 15px rgba(6,182,212,0.3)',
                            }}
                        >
                            {isAr ? 'تصفح المتجر' : 'Browse Shop'}
                            <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                        </Link>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto cart-scrollbar px-6 py-4 space-y-3">
                        {items.map((item) => {
                            const itemPrice = Number(item.price);
                            return (
                                <div
                                    key={item.id}
                                    className="group relative rounded-2xl overflow-hidden transition-all duration-700"
                                    style={{
                                        background: t.itemBg,
                                        border: `1px solid ${t.itemBorder}`,
                                        boxShadow: t.itemShadow,
                                    }}
                                >
                                    <div className="flex gap-4 p-4">
                                        {/* Image */}
                                        <Link
                                            href={`/shop/${item.id}`}
                                            onClick={closeCart}
                                            className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"
                                            style={{ background: t.imgBg }}
                                        >
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                sizes="80px"
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </Link>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={`/shop/${item.id}`}
                                                onClick={closeCart}
                                                className={`text-sm font-semibold ${t.nameHoverClass} transition-colors line-clamp-2 block mb-1`}
                                                style={{ color: t.textPrimary }}
                                            >
                                                {item.name}
                                            </Link>
                                            <p
                                                className="text-sm font-bold mb-3"
                                                style={{ color: '#06B6D4' }}
                                            >
                                                {isAr ? `ج.م ${itemPrice.toFixed(2)}` : `$${itemPrice.toFixed(2)}`}
                                            </p>

                                            {/* Quantity + Remove */}
                                            <div className="flex items-center justify-between">
                                                <div
                                                    className="flex items-center rounded-lg overflow-hidden"
                                                    style={{ background: t.qtyBg, border: `1px solid ${t.qtyBorder}` }}
                                                >
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-8 h-8 flex items-center justify-center transition-colors"
                                                        style={{ color: item.quantity > 1 ? t.qtyActive : t.qtyInactive }}
                                                        onMouseEnter={(e) => { e.currentTarget.style.background = t.qtyHover; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}
                                                    >
                                                        <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
                                                    </button>
                                                    <span
                                                        className="w-8 h-8 flex items-center justify-center text-xs font-bold"
                                                        style={{ color: t.textPrimary, borderLeft: `1px solid ${t.qtyDivider}`, borderRight: `1px solid ${t.qtyDivider}` }}
                                                    >
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center transition-colors"
                                                        style={{ color: t.qtyActive }}
                                                        onMouseEnter={(e) => { e.currentTarget.style.background = t.qtyHover; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}
                                                    >
                                                        <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-700 hover:scale-110"
                                                    style={{ color: t.deleteColor, background: t.deleteBg }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.color = '#EF4444';
                                                        e.currentTarget.style.background = t.deleteHoverBg;
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.color = t.deleteColor;
                                                        e.currentTarget.style.background = t.deleteBg;
                                                    }}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Line Total */}
                                        <div className={`text-right flex-shrink-0 ${isAr ? 'text-left mr-auto' : 'ml-auto text-right'}`}>
                                            <span className="text-sm font-bold" style={{ color: t.textPrimary }}>
                                                {isAr ? `ج.م ${(itemPrice * item.quantity).toFixed(2)}` : `$${(itemPrice * item.quantity).toFixed(2)}`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── Footer ── */}
                {items.length > 0 && (
                    <div
                        className="px-6 py-5 space-y-4"
                        style={{ borderTop: `1px solid ${t.sectionBorder}`, background: t.footerBg }}
                    >
                        {/* Summary */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span style={{ color: t.textSecondary }}>{isAr ? `المجموع الفرعي (${totalItems} عناصر)` : `Subtotal (${totalItems} items)`}</span>
                                <span className="font-semibold" style={{ color: t.textPrimary }}>{isAr ? `ج.م ${totalPrice.toFixed(2)}` : `$${totalPrice.toFixed(2)}`}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span style={{ color: t.textSecondary }}>{isAr ? 'الشحن' : 'Shipping'}</span>
                                <span className="font-semibold" style={{ color: '#10B981' }}>{isAr ? 'مجانًا' : 'Free'}</span>
                            </div>
                            <div
                                className="flex justify-between pt-3"
                                style={{ borderTop: `1px solid ${t.sectionBorder}` }}
                            >
                                <span className="text-base font-bold" style={{ color: t.textPrimary }}>{isAr ? 'الإجمالي' : 'Total'}</span>
                                <span
                                    className="text-xl font-extrabold"
                                    style={{
                                        background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    {isAr ? `ج.م ${totalPrice.toFixed(2)}` : `$${totalPrice.toFixed(2)}`}
                                </span>
                            </div>
                        </div>

                        {/* Buttons */}
                        <Link
                            href="/checkout"
                            onClick={closeCart}
                            className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-700 block text-center"
                            style={{
                                background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                boxShadow: '0 6px 20px rgba(6,182,212,0.3)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = '0 8px 30px rgba(6,182,212,0.5)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(6,182,212,0.3)';
                                e.currentTarget.style.transform = '';
                            }}
                        >
                            {isAr ? 'المتابعة للدفع' : 'Proceed to Checkout'}
                        </Link>

                        <button
                            onClick={clearCart}
                            className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-400"
                            style={{ color: t.clearColor, background: 'transparent' }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#EF4444';
                                e.currentTarget.style.background = t.clearHoverBg;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = t.clearColor;
                                e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            {isAr ? 'تفريغ العربة' : 'Clear Cart'}
                        </button>
                    </div>
                )}
            </aside>

            {/* Scrollbar styles */}
            <style jsx global>{`
                .cart-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .cart-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .cart-scrollbar::-webkit-scrollbar-thumb {
                    background: ${t.scrollThumb};
                    border-radius: 10px;
                }
                .cart-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: ${t.scrollThumbHover};
                }
            `}</style>
        </>
    );
}
