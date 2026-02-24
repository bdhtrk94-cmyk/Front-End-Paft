'use client';

import { useState, useEffect } from 'react';
import ProductSpecificationCard from './ProductSpecificationCard';
import LightDutyProductCard from './LightDutyProductCard';
import { productsApi } from '@/lib/api';
import { Product } from '@/types';

interface PlasticPalletsPageContent {
    [key: string]: {
        value: string;
        valueAr?: string;
        id: number;
    };
}

// Map product slug to editor productKey
const SLUG_TO_PRODUCT_KEY: { [key: string]: string } = {
    'm1-heavy-duty': 'product-m1',
    'm2-heavy-duty': 'product-m2',
    'm4-heavy-duty': 'product-m4',
    'm5-heavy-duty': 'product-m5',
    'm6-heavy-duty': 'product-m6',
    'm7-heavy-duty': 'product-m7',
    'm8-heavy-duty': 'product-m8',
    'm9-heavy-duty': 'product-m9',
    'double-deck-light': 'product-double-deck',
    '9-leg-light': 'product-9-leg',
    'rental-pallet': 'product-rental',
};

interface PlasticPalletsPageEditorProps {
    content: PlasticPalletsPageContent;
    onSave: (content: { [key: string]: string }, contentAr: { [key: string]: string }, imageUpdates?: { productId: number; image: string }[]) => Promise<void>;
    onClose: () => void;
    saving: boolean;
}

export default function PlasticPalletsPageEditor({ content, onSave, onClose, saving }: PlasticPalletsPageEditorProps) {
    const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');
    const [editingContent, setEditingContent] = useState<{ [key: string]: string }>(() => {
        const initialContent: { [key: string]: string } = {};
        Object.keys(content).forEach(key => {
            initialContent[key] = content[key]?.value || '';
        });
        return initialContent;
    });
    const [editingContentAr, setEditingContentAr] = useState<{ [key: string]: string }>(() => {
        const init: { [key: string]: string } = {};
        Object.keys(content).forEach(key => { init[key] = content[key]?.valueAr || ''; });
        return init;
    });

    // Store products for mapping image changes back to product IDs
    const [products, setProducts] = useState<Product[]>([]);

    // Fetch products on mount to pre-populate image URLs
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const allProducts = await productsApi.getAllIncludingDeleted();
                setProducts(allProducts);

                // Pre-populate image URLs into editingContent
                setEditingContent(prev => {
                    const updated = { ...prev };
                    allProducts.forEach((product: Product) => {
                        const productKey = SLUG_TO_PRODUCT_KEY[product.slug || ''];
                        if (productKey && product.image) {
                            // Only set if not already set by user or content system
                            if (!updated[`${productKey}-image`]) {
                                updated[`${productKey}-image`] = product.image;
                            }
                        }
                    });
                    return updated;
                });
            } catch (err) {
                console.error('Failed to fetch products for image URLs:', err);
            }
        };
        fetchProducts();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Separate image updates from content updates
        const imageUpdates: { productId: number; image: string }[] = [];
        const contentOnly: { [key: string]: string } = {};

        Object.keys(editingContent).forEach(key => {
            if (key.endsWith('-image')) {
                // Find the product for this image key
                const productKey = key.replace('-image', '');
                const slug = Object.entries(SLUG_TO_PRODUCT_KEY).find(([, v]) => v === productKey)?.[0];
                const product = products.find(p => p.slug === slug);
                if (product) {
                    imageUpdates.push({ productId: product.id, image: editingContent[key] });
                }
            } else {
                contentOnly[key] = editingContent[key];
            }
        });

        await onSave(contentOnly, editingContentAr, imageUpdates);
    };

    const updateContent = (key: string, value: string) => {
        setEditingContent(prev => ({ ...prev, [key]: value }));
    };
    const updateContentAr = (key: string, value: string) => {
        setEditingContentAr(prev => ({ ...prev, [key]: value }));
    };

    const renderInput = (label: string, key: string, placeholder: string, placeholderAr: string, focusColor = 'cyan') => (
        <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
                {label} {activeTab === 'ar' && <span className="text-amber-400 text-xs">(عربي)</span>}
            </label>
            {activeTab === 'en' ? (
                <input
                    type="text"
                    value={editingContent[key] || ''}
                    onChange={(e) => updateContent(key, e.target.value)}
                    className={`w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-${focusColor}-500/50`}
                    placeholder={placeholder}
                    dir="ltr"
                />
            ) : (
                <input
                    type="text"
                    value={editingContentAr[key] || ''}
                    onChange={(e) => updateContentAr(key, e.target.value)}
                    className="w-full bg-white/5 border border-amber-500/20 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-amber-500/50"
                    placeholder={placeholderAr}
                    dir="rtl"
                />
            )}
        </div>
    );

    const renderTextarea = (label: string, key: string, placeholder: string, placeholderAr: string, rows = 3, focusColor = 'cyan') => (
        <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
                {label} {activeTab === 'ar' && <span className="text-amber-400 text-xs">(عربي)</span>}
            </label>
            {activeTab === 'en' ? (
                <textarea
                    rows={rows}
                    value={editingContent[key] || ''}
                    onChange={(e) => updateContent(key, e.target.value)}
                    className={`w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-${focusColor}-500/50 resize-y`}
                    placeholder={placeholder}
                    dir="ltr"
                />
            ) : (
                <textarea
                    rows={rows}
                    value={editingContentAr[key] || ''}
                    onChange={(e) => updateContentAr(key, e.target.value)}
                    className="w-full bg-white/5 border border-amber-500/20 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-amber-500/50 resize-y"
                    placeholder={placeholderAr}
                    dir="rtl"
                />
            )}
        </div>
    );

    const isAr = activeTab === 'ar';
    const sectionBg = (color: string) => isAr ? 'bg-amber-500/5 border-amber-500/20' : `bg-${color}-500/5 border-${color}-500/20`;
    const sectionTitle = (color: string) => isAr ? 'text-amber-400' : `text-${color}-400`;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#151b2e] border border-white/10 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-[#151b2e] border-b border-white/5 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-lg font-bold text-white">Edit Plastic Pallets Page Content</h2>
                    <div className="flex items-center gap-3">
                        {/* EN / AR Toggle */}
                        <div className="flex bg-white/5 rounded-lg p-0.5">
                            <button
                                type="button"
                                onClick={() => setActiveTab('en')}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'en' ? 'bg-cyan-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                            >
                                EN
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('ar')}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'ar' ? 'bg-amber-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                            >
                                عربي
                            </button>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {isAr && (
                    <div className="mx-6 mt-4 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-2 text-amber-300 text-xs flex items-center gap-2">
                        <span>🌐</span> أنت تقوم بتعديل المحتوى العربي — You are editing Arabic content
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Heavy Duty Hero Section */}
                    <div className={`${sectionBg('cyan')} border rounded-xl p-4`}>
                        <h3 className={`${sectionTitle('cyan')} font-semibold mb-4 flex items-center gap-2`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Heavy Duty Hero Section
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {renderInput('Title', 'heavy-duty-title', 'Heavy Duty', 'طبالي', 'cyan')}
                            {renderInput('Highlight', 'heavy-duty-highlight', 'Pallets', 'ثقيلة التحمل', 'cyan')}
                            {renderTextarea('Description', 'heavy-duty-description', 'PAFT Heavy-Duty Pallets are designed to deliver...', 'طبالي بافت الثقيلة مصممة لتقديم أعلى قيمة...', 4, 'cyan')}
                        </div>
                    </div>

                    {/* Info Cards Section */}
                    <div className={`${sectionBg('blue')} border rounded-xl p-4`}>
                        <h3 className={`${sectionTitle('blue')} font-semibold mb-4 flex items-center gap-2`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Info Cards Section
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Design Card */}
                            <div className="space-y-3">
                                <h4 className={`${isAr ? 'text-amber-300' : 'text-blue-300'} font-medium`}>Design Card</h4>
                                {renderInput('Title', 'design-title', 'Design', 'التصميم', 'blue')}
                                {renderTextarea('Content', 'design-content', 'Best used for racking system • Can be reinforced...', 'مثالية لنظام الأرفف • يمكن تعزيزها...', 4, 'blue')}
                            </div>
                            {/* Material Card */}
                            <div className="space-y-3">
                                <h4 className={`${isAr ? 'text-amber-300' : 'text-blue-300'} font-medium`}>Material Card</h4>
                                {renderInput('Title', 'material-title', 'Material', 'المواد', 'blue')}
                                {renderTextarea('Content', 'material-content', 'Can be produced in 6 different formulas...', 'يمكن إنتاجها بـ 6 تركيبات مختلفة...', 4, 'blue')}
                            </div>
                        </div>
                    </div>

                    {/* Video Section */}
                    <div className={`${sectionBg('purple')} border rounded-xl p-4`}>
                        <h3 className={`${sectionTitle('purple')} font-semibold mb-4 flex items-center gap-2`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Video Section
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {renderInput('Video Title', 'video-title', 'Product', 'اختبار', 'purple')}
                            {renderInput('Video Highlight', 'video-highlight', 'Testing', 'المنتج', 'purple')}
                            {renderInput('Video Description', 'video-description', 'Watch our rigorous quality testing in action', 'شاهد اختبارات الجودة الصارمة أثناء العمل', 'purple')}
                            {renderInput('Watch Video Text', 'video-watch-text', 'WATCH VIDEO', 'شاهد الفيديو', 'purple')}
                        </div>
                    </div>

                    {/* Light Duty Hero Section */}
                    <div className={`${sectionBg('green')} border rounded-xl p-4`}>
                        <h3 className={`${sectionTitle('green')} font-semibold mb-4 flex items-center gap-2`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            Light Duty Hero Section
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {renderInput('Title', 'light-duty-title', 'Light Duty', 'طبالي', 'green')}
                            {renderInput('Highlight', 'light-duty-highlight', 'Pallets', 'خفيفة التحمل', 'green')}
                            {renderTextarea('Description', 'light-duty-description', 'Several pallets starting at 7kg/pallet...', 'عدة طبالي تبدأ من 7 كجم/طبلية...', 4, 'green')}
                        </div>
                    </div>

                    {/* Light Duty Info Features */}
                    <div className={`${sectionBg('emerald')} border rounded-xl p-4`}>
                        <h3 className={`${sectionTitle('emerald')} font-semibold mb-4 flex items-center gap-2`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Light Duty Features
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderInput('Feature 1', 'light-duty-features-feature1', '100% Recycled Material', '100% مواد معاد تدويرها', 'emerald')}
                            {renderInput('Feature 2', 'light-duty-features-feature2', '4 Ways Entry', 'دخول من 4 جهات', 'emerald')}
                            {renderInput('Feature 3', 'light-duty-features-feature3', 'Anti Slip', 'مقاوم للانزلاق', 'emerald')}
                            {renderInput('Feature 4', 'light-duty-features-feature4', 'SPM 15 Certified', 'معتمد SPM 15', 'emerald')}
                            {renderInput('Feature 5', 'light-duty-features-feature5', 'No Nails, No Product Damage', 'بدون مسامير، لا ضرر للمنتج', 'emerald')}
                            {renderInput('Feature 6', 'light-duty-features-feature6', 'Racking System N/A', 'نظام الرفوف غير متاح', 'emerald')}
                        </div>
                    </div>

                    {/* Rental Hero Section */}
                    <div className={`${sectionBg('violet')} border rounded-xl p-4`}>
                        <h3 className={`${sectionTitle('violet')} font-semibold mb-4 flex items-center gap-2`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Rental Hero Section
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {renderInput('Title', 'rental-title', 'Rental', 'طبالي', 'violet')}
                            {renderInput('Highlight', 'rental-highlight', 'Pallets', 'للتأجير', 'violet')}
                            {renderTextarea('Description', 'rental-description', 'PAFT offers a unique, innovative approach...', 'تقدم بافت نهجاً مبتكراً وفريداً...', 4, 'violet')}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className={`${sectionBg('indigo')} border rounded-xl p-4`}>
                        <h3 className={`${sectionTitle('indigo')} font-semibold mb-4 flex items-center gap-2`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 12l2 2 4-4" />
                            </svg>
                            Call to Action Section
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {renderInput('CTA Title', 'cta-title', 'Need', 'هل تحتاج', 'indigo')}
                            {renderInput('CTA Highlight', 'cta-highlight', 'Custom Solutions?', 'حلول مخصصة؟', 'indigo')}
                            {renderInput('CTA Description', 'cta-description', 'We can manufacture pallets according to your specific requirements', 'يمكننا تصنيع طبالي وفقاً لمتطلباتك الخاصة', 'indigo')}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {renderInput('Button 1 Text', 'cta-button1-text', 'Request a Quote →', 'اطلب عرض سعر ←', 'indigo')}
                                {renderInput('Button 2 Text', 'cta-button2-text', 'Contact Our Team', 'تواصل مع فريقنا', 'indigo')}
                            </div>
                        </div>
                    </div>

                    {/* Product Specifications */}
                    <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4">
                        <h3 className="text-orange-400 font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Product Specifications
                        </h3>

                        {/* Heavy Duty Products */}
                        <div className="space-y-4 mb-6">
                            <h4 className="text-orange-300 font-medium">Heavy Duty Products</h4>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <ProductSpecificationCard
                                    productKey="product-m1"
                                    productName="M1 Heavy Duty Pallet"
                                    productNameAr="باليتة M1 ثقيلة التحمل"
                                    editingContent={editingContent}
                                    editingContentAr={editingContentAr}
                                    updateContent={updateContent}
                                    updateContentAr={updateContentAr}
                                    activeTab={activeTab}
                                />
                                <ProductSpecificationCard
                                    productKey="product-m2"
                                    productName="M2 Heavy Duty Pallet"
                                    productNameAr="باليتة M2 ثقيلة التحمل"
                                    editingContent={editingContent}
                                    editingContentAr={editingContentAr}
                                    updateContent={updateContent}
                                    updateContentAr={updateContentAr}
                                    activeTab={activeTab}
                                />
                                <ProductSpecificationCard
                                    productKey="product-m4"
                                    productName="M4 Heavy Duty Pallet"
                                    productNameAr="باليتة M4 ثقيلة التحمل"
                                    editingContent={editingContent}
                                    editingContentAr={editingContentAr}
                                    updateContent={updateContent}
                                    updateContentAr={updateContentAr}
                                    activeTab={activeTab}
                                />
                                <ProductSpecificationCard
                                    productKey="product-m5"
                                    productName="M5 Heavy Duty Pallet"
                                    productNameAr="باليتة M5 ثقيلة التحمل"
                                    editingContent={editingContent}
                                    editingContentAr={editingContentAr}
                                    updateContent={updateContent}
                                    updateContentAr={updateContentAr}
                                    activeTab={activeTab}
                                />
                                <ProductSpecificationCard
                                    productKey="product-m6"
                                    productName="M6 Heavy Duty Pallet"
                                    productNameAr="باليتة M6 ثقيلة التحمل"
                                    editingContent={editingContent}
                                    editingContentAr={editingContentAr}
                                    updateContent={updateContent}
                                    updateContentAr={updateContentAr}
                                    activeTab={activeTab}
                                />
                                <ProductSpecificationCard
                                    productKey="product-m7"
                                    productName="M7 Heavy Duty Pallet"
                                    productNameAr="باليتة M7 ثقيلة التحمل"
                                    editingContent={editingContent}
                                    editingContentAr={editingContentAr}
                                    updateContent={updateContent}
                                    updateContentAr={updateContentAr}
                                    activeTab={activeTab}
                                />
                                <ProductSpecificationCard
                                    productKey="product-m8"
                                    productName="M8 Heavy Duty Pallet"
                                    productNameAr="باليتة M8 ثقيلة التحمل"
                                    editingContent={editingContent}
                                    editingContentAr={editingContentAr}
                                    updateContent={updateContent}
                                    updateContentAr={updateContentAr}
                                    activeTab={activeTab}
                                />
                                <ProductSpecificationCard
                                    productKey="product-m9"
                                    productName="M9 Heavy Duty Pallet"
                                    productNameAr="باليتة M9 ثقيلة التحمل"
                                    editingContent={editingContent}
                                    editingContentAr={editingContentAr}
                                    updateContent={updateContent}
                                    updateContentAr={updateContentAr}
                                    activeTab={activeTab}
                                />
                            </div>
                        </div>

                        {/* Light Duty Products */}
                        <div className="space-y-4 mb-6">
                            <h4 className="text-green-300 font-medium">Light Duty Products</h4>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <LightDutyProductCard
                                    productKey="product-double-deck"
                                    productName="Double Deck Light Pallet"
                                    productNameAr="باليتة وجه مزدوج خفيفة"
                                    editingContent={editingContent}
                                    editingContentAr={editingContentAr}
                                    updateContent={updateContent}
                                    updateContentAr={updateContentAr}
                                    activeTab={activeTab}
                                />
                                <LightDutyProductCard
                                    productKey="product-9-leg"
                                    productName="9 Leg Light Pallet"
                                    productNameAr="باليتة 9 أرجل خفيفة"
                                    editingContent={editingContent}
                                    editingContentAr={editingContentAr}
                                    updateContent={updateContent}
                                    updateContentAr={updateContentAr}
                                    activeTab={activeTab}
                                />
                            </div>
                        </div>

                        {/* Rental Product */}
                        <div className="space-y-4">
                            <h4 className="text-purple-300 font-medium">Rental Product</h4>
                            <div className="grid grid-cols-1 max-w-md">
                                <ProductSpecificationCard
                                    productKey="product-rental"
                                    productName="Rental Pallet"
                                    productNameAr="باليتة الإيجار"
                                    editingContent={editingContent}
                                    editingContentAr={editingContentAr}
                                    updateContent={updateContent}
                                    updateContentAr={updateContentAr}
                                    activeTab={activeTab}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Update Plastic Pallets Page'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-white/5 border border-white/10 text-gray-300 py-2.5 rounded-xl font-semibold text-sm hover:bg-white/10 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}