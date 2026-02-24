'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShopProductCard from '@/components/shop/ShopProductCard';
import ShopFilters from '@/components/shop/ShopFilters';
import ShopPagination from '@/components/shop/ShopPagination';
import { priceRanges, PRODUCTS_PER_PAGE, Product } from '@/lib/shopData';
import { productsApi } from '@/lib/api';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [priceRange, setPriceRange] = useState(0);
    const [sort, setSort] = useState('featured');
    const [currentPage, setCurrentPage] = useState(1);
    const [cartCount] = useState(0);

    const { theme } = useTheme();
    const isLight = theme === 'light';
    const { language } = useLanguage();
    const isAr = language === 'ar';

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                setLoadError('');
                const data = await productsApi.getAll();
                setProducts(data as unknown as Product[]);
            } catch (err: unknown) {
                const error = err as { message?: string };
                setLoadError(error.message || 'Failed to load products');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Filter + sort (client-side on fetched data)
    const filtered = useMemo(() => {
        let result = [...products];

        // Search
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q) ||
                    (p.nameAr && p.nameAr.includes(q)) ||
                    (p.categoryAr && p.categoryAr.includes(q)) ||
                    (p.descriptionAr && p.descriptionAr.includes(q)),
            );
        }

        // Category
        if (category !== 'All') {
            result = result.filter((p) => p.category === category);
        }

        // Price
        const range = priceRanges[priceRange];
        if (range) {
            result = result.filter((p) => Number(p.price) >= range.min && Number(p.price) < range.max);
        }

        // Sort
        switch (sort) {
            case 'price-asc':
                result.sort((a, b) => Number(a.price) - Number(b.price));
                break;
            case 'price-desc':
                result.sort((a, b) => Number(b.price) - Number(a.price));
                break;
            case 'rating':
                result.sort((a, b) => Number(b.rating) - Number(a.rating));
                break;
            case 'newest':
                result.sort((a, b) => b.id - a.id);
                break;
            default:
                break;
        }

        return result;
    }, [products, search, category, priceRange, sort]);

    const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
    const paged: Product[] = filtered.slice(
        (currentPage - 1) * PRODUCTS_PER_PAGE,
        currentPage * PRODUCTS_PER_PAGE,
    );

    // Reset to page 1 when filters change
    const handleSearchChange = (v: string) => { setSearch(v); setCurrentPage(1); };
    const handleCategoryChange = (v: string) => { setCategory(v); setCurrentPage(1); };
    const handlePriceRangeChange = (v: number) => { setPriceRange(v); setCurrentPage(1); };
    const handleSortChange = (v: string) => { setSort(v); setCurrentPage(1); };

    return (
        <div className="min-h-screen" style={{ background: isLight ? '#F8FBFF' : '#0B1121' }}>
            <Header currentPage="shop" />

            {/* ── Hero ── */}
            <section
                className="relative overflow-hidden py-20 lg:py-28"
                style={{
                    backgroundImage: 'url(https://paft.eg/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-24-at-12.57.33-PM.jpeg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
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
                        opacity: isLight ? 0.04 : 0.15,
                        background: 'radial-gradient(circle, #06B6D4, transparent 70%)',
                        filter: 'blur(100px)',
                        transform: 'translate(-30%, -30%)',
                    }}
                />
                <div
                    className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full"
                    style={{
                        opacity: isLight ? 0.03 : 0.1,
                        background: 'radial-gradient(circle, #8B5CF6, transparent 70%)',
                        filter: 'blur(100px)',
                        transform: 'translate(30%, 30%)',
                    }}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div
                        className="inline-flex items-center px-4 py-2 rounded-full mb-8"
                        style={{
                            background: isLight ? 'rgba(6,182,212,0.06)' : 'rgba(6,182,212,0.1)',
                            border: `1px solid ${isLight ? 'rgba(6,182,212,0.15)' : 'rgba(6,182,212,0.2)'}`,
                        }}
                    >
                        <span style={{ color: '#06B6D4' }} className="text-sm font-semibold tracking-wider uppercase">
                            {isAr ? 'متجر PAFT' : 'PAFT Store'}
                        </span>
                    </div>

                    <h1
                        className="text-5xl lg:text-7xl font-bold mb-6"
                        style={{
                            background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-0.03em',
                        }}
                    >
                        {isAr ? 'تسوق منتجاتنا' : 'Shop Our Products'}
                    </h1>

                    <div
                        className="w-24 h-1 mx-auto rounded-full mb-8"
                        style={{ background: 'linear-gradient(90deg, #06B6D4, #2563EB)' }}
                    />

                    <p
                        className="text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed"
                        style={{ color: isLight ? '#475569' : 'rgba(255,255,255,0.65)' }}
                    >
                        {isAr
                            ? 'باليتات بلاستيكية متميزة، حاويات، وحلول لوجستية — مصنعة للصناعة، مصممة للأداء.'
                            : 'Premium plastic pallets, containers, and logistics solutions — built for industry, designed for performance.'
                        }
                    </p>

                    {/* Mini cart indicator */}
                    <div
                        className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 rounded-full"
                        style={{
                            background: isLight ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'}`,
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <svg className="w-5 h-5" style={{ color: '#06B6D4' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                        </svg>
                        <span className="text-sm font-medium" style={{ color: isLight ? '#64748B' : 'rgba(255,255,255,0.6)' }}>
                            {isAr
                                ? `${cartCount} ${cartCount !== 1 ? 'عناصر' : 'عنصر'} في السلة`
                                : `${cartCount} item${cartCount !== 1 ? 's' : ''} in cart`
                            }
                        </span>
                    </div>
                </div>
            </section>

            {/* ── Products ── */}
            <section className="py-16 relative" style={{ background: isLight ? '#EFF6FF' : '#0d1529' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ShopFilters
                        search={search}
                        onSearchChange={handleSearchChange}
                        category={category}
                        onCategoryChange={handleCategoryChange}
                        priceRange={priceRange}
                        onPriceRangeChange={handlePriceRangeChange}
                        sort={sort}
                        onSortChange={handleSortChange}
                        resultCount={filtered.length}
                    />

                    {/* Loading state */}
                    {isLoading && (
                        <div className="text-center py-20">
                            <div
                                className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"
                                style={{
                                    borderColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.1)',
                                    borderTopColor: '#06B6D4',
                                }}
                            />
                            <p className="text-sm" style={{ color: isLight ? '#94A3B8' : 'rgba(255,255,255,0.5)' }}>{isAr ? 'جاري تحميل المنتجات…' : 'Loading products…'}</p>
                        </div>
                    )}

                    {/* Error state */}
                    {!isLoading && loadError && (
                        <div className="text-center py-20">
                            <div
                                className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                                style={{ background: 'rgba(239,68,68,0.1)' }}
                            >
                                <svg className="w-12 h-12" style={{ color: '#EF4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2" style={{ color: isLight ? '#0F172A' : '#fff' }}>
                                {isAr ? 'فشل في تحميل المنتجات' : 'Failed to load products'}
                            </h3>
                            <p className="text-sm mb-6" style={{ color: isLight ? '#94A3B8' : 'rgba(255,255,255,0.4)' }}>
                                {loadError}
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                                style={{
                                    background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                    boxShadow: '0 4px 12px rgba(6,182,212,0.3)',
                                }}
                            >
                                {isAr ? 'حاول مرة أخرى' : 'Try Again'}
                            </button>
                        </div>
                    )}

                    {/* Products grid */}
                    {!isLoading && !loadError && paged.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {paged.map((product) => (
                                <ShopProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}

                    {/* Empty state */}
                    {!isLoading && !loadError && paged.length === 0 && (
                        <div className="text-center py-20">
                            <div
                                className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                                style={{ background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)' }}
                            >
                                <svg className="w-12 h-12" style={{ color: isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.15)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2" style={{ color: isLight ? '#0F172A' : '#fff' }}>
                                {isAr ? 'لا توجد منتجات' : 'No products found'}
                            </h3>
                            <p className="text-sm" style={{ color: isLight ? '#94A3B8' : 'rgba(255,255,255,0.4)' }}>
                                {isAr ? 'حاول تعديل البحث أو الفلاتر' : 'Try adjusting your search or filters'}
                            </p>
                            <button
                                onClick={() => {
                                    setSearch('');
                                    setCategory('All');
                                    setPriceRange(0);
                                    setCurrentPage(1);
                                }}
                                className="mt-6 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300"
                                style={{
                                    background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                    boxShadow: '0 4px 12px rgba(6,182,212,0.3)',
                                }}
                            >
                                {isAr ? 'مسح جميع الفلاتر' : 'Clear All Filters'}
                            </button>
                        </div>
                    )}

                    <ShopPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </section>

            {/* ── Why Shop With Us ── */}
            <section className="py-20 relative overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        background: isLight
                            ? 'linear-gradient(135deg, rgba(6,182,212,0.03), rgba(37,99,235,0.03))'
                            : 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(37,99,235,0.08))',
                    }}
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: isLight ? '#0F172A' : '#fff' }}>
                            {isAr ? 'لماذا تتسوق من ' : 'Why Shop With '}
                            <span
                                style={{
                                    background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                PAFT
                            </span>
                            {isAr ? '؟' : ''}
                        </h2>
                        <div
                            className="w-16 h-1 mx-auto rounded-full"
                            style={{ background: 'linear-gradient(90deg, #06B6D4, #2563EB)' }}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: (
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                    </svg>
                                ),
                                title: isAr ? 'توصيل سريع' : 'Fast Delivery',
                                desc: isAr ? 'شحن على مستوى الدولة مع تتبع متاح لجميع الطلبات.' : 'Nationwide shipping with tracking available on all orders.',
                                color: '#06B6D4',
                            },
                            {
                                icon: (
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                ),
                                title: isAr ? 'مدفوعات آمنة' : 'Secure Payments',
                                desc: isAr ? 'خيارات دفع متعددة مع عملية شراء مشفرة.' : 'Multiple payment options with encrypted checkout process.',
                                color: '#2563EB',
                            },
                            {
                                icon: (
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                ),
                                title: isAr ? 'صديق للبيئة' : 'Eco-Friendly',
                                desc: isAr ? 'منتجات مصنوعة من مواد معاد تدويرها ومستدامة.' : 'Products made from recycled and sustainable materials.',
                                color: '#10B981',
                            },
                            {
                                icon: (
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                ),
                                title: isAr ? 'جودة مضمونة' : 'Quality Guaranteed',
                                desc: isAr ? 'جميع المنتجات تلتزم بمعايير الجودة الدولية.' : 'All products meet international quality standards.',
                                color: '#F59E0B',
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="text-center p-8 rounded-2xl transition-all duration-500"
                                style={{
                                    background: isLight ? 'rgba(255,255,255,0.85)' : 'rgba(30,41,59,0.4)',
                                    border: `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`,
                                    boxShadow: isLight ? '0 2px 12px rgba(0,0,0,0.03)' : 'none',
                                    backdropFilter: 'blur(10px)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-6px)';
                                    e.currentTarget.style.borderColor = `${item.color}30`;
                                    e.currentTarget.style.boxShadow = isLight
                                        ? `0 15px 40px rgba(0,0,0,0.06), 0 0 20px ${item.color}08`
                                        : `0 15px 40px rgba(0,0,0,0.3)`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = '';
                                    e.currentTarget.style.borderColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
                                    e.currentTarget.style.boxShadow = isLight ? '0 2px 12px rgba(0,0,0,0.03)' : '';
                                }}
                            >
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                                    style={{ background: `${item.color}15`, color: item.color }}
                                >
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold mb-2" style={{ color: isLight ? '#0F172A' : '#fff' }}>{item.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: isLight ? '#64748B' : 'rgba(255,255,255,0.5)' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
