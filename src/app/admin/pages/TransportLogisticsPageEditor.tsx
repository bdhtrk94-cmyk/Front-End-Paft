'use client';

import { useState, useEffect } from 'react';

interface TransportLogisticsPageEditorProps {
    content: { [key: string]: { value: string; valueAr?: string; id: number } };
    onSave: (content: { [key: string]: string }, contentAr?: { [key: string]: string }) => Promise<void>;
    onClose: () => void;
    saving: boolean;
}

export default function TransportLogisticsPageEditor({ content, onSave, onClose, saving }: TransportLogisticsPageEditorProps) {
    console.log('🔍 Editor received content:', content);
    console.log('🔍 Editor content keys:', Object.keys(content));
    
    const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');
    const [editingContent, setEditingContent] = useState<{ [key: string]: string }>(() => {
        const init: { [key: string]: string } = {};
        Object.keys(content).forEach(key => { init[key] = content[key]?.value || ''; });
        console.log('🔍 Initial editingContent:', init);
        return init;
    });
    const [editingContentAr, setEditingContentAr] = useState<{ [key: string]: string }>(() => {
        const init: { [key: string]: string } = {};
        Object.keys(content).forEach(key => { init[key] = content[key]?.valueAr || ''; });
        console.log('🔍 Initial editingContentAr:', init);
        return init;
    });

    useEffect(() => {
        const newContent: { [key: string]: string } = {};
        const newContentAr: { [key: string]: string } = {};
        Object.keys(content).forEach(key => {
            newContent[key] = content[key]?.value || '';
            newContentAr[key] = content[key]?.valueAr || '';
        });
        const id = requestAnimationFrame(() => {
            setEditingContent(newContent);
            setEditingContentAr(newContentAr);
        });
        return () => cancelAnimationFrame(id);
    }, [content]);

    const updateContent = (key: string, value: string) => {
        setEditingContent(prev => ({ ...prev, [key]: value }));
    };
    const updateContentAr = (key: string, value: string) => {
        setEditingContentAr(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onSave(editingContent, editingContentAr);
    };

    const isAr = activeTab === 'ar';

    const sectionBg = (color: string) => isAr ? `bg-amber-500/5 border-amber-500/20` : `bg-${color}-500/5 border-${color}-500/20`;
    const sectionTitle = (color: string) => isAr ? 'text-amber-400' : `text-${color}-400`;

    const renderInput = (label: string, key: string, placeholder: string, placeholderAr: string, focusColor = 'blue') => {
        console.log(`🔍 renderInput ${key}:`, {
            value: editingContent[key],
            valueAr: editingContentAr[key],
            activeTab,
            contentHasKey: content[key] ? 'yes' : 'no'
        });
        
        return (
            <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                    {label} {isAr && <span className="text-amber-400 text-xs">(عربي)</span>}
                </label>
                {activeTab === 'en' ? (
                    <input
                        value={editingContent[key] || ''}
                        onChange={(e) => updateContent(key, e.target.value)}
                        className={`w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-${focusColor}-500/50`}
                        placeholder={placeholder}
                        dir="ltr"
                    />
                ) : (
                    <input
                        value={editingContentAr[key] || ''}
                        onChange={(e) => updateContentAr(key, e.target.value)}
                        className="w-full bg-white/5 border border-amber-500/20 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-amber-500/50"
                        placeholder={placeholderAr}
                        dir="rtl"
                    />
                )}
            </div>
        );
    };

    const renderTextarea = (label: string, key: string, placeholder: string, placeholderAr: string, rows = 3, focusColor = 'blue') => (
        <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
                {label} {isAr && <span className="text-amber-400 text-xs">(عربي)</span>}
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

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#151b2e] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-[#151b2e] border-b border-white/5 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-lg font-bold text-white">Edit Transport & Logistics Page</h2>
                    <div className="flex items-center gap-3">
                        {/* EN / AR Toggle */}
                        <div className="flex bg-white/5 rounded-lg p-0.5">
                            <button
                                type="button"
                                onClick={() => setActiveTab('en')}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'en' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
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
                    {/* Hero Section */}
                    <div className={`${sectionBg('blue')} border rounded-xl p-4`}>
                        <h3 className={`${sectionTitle('blue')} font-semibold mb-4 flex items-center gap-2`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2m-6 0h8m-8 0a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2" />
                            </svg>
                            Hero Section
                        </h3>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {renderInput('Badge Text', 'badge-text', 'PAFT Product Range', 'مجموعة منتجات PAFT', 'blue')}
                                {renderInput('Main Title', 'title', 'Transport & Logistics Items', 'مواد النقل واللوجستيات', 'blue')}
                            </div>
                            {renderTextarea('Description', 'description', 'Innovative foldable IBCs, reusable plastic crates, sheet separators, and gallon racks...', 'حاويات IBC القابلة للطي المبتكرة، صناديق بلاستيكية قابلة لإعادة الاستخدام، فواصل الألواح، وحوامل الجالون — مصممة لسلاسل التوريد الحديثة بأقصى كفاءة واستدامة.', 3, 'blue')}
                        </div>
                    </div>

                    {/* Products Section Header */}
                    <div className={`${sectionBg('purple')} border rounded-xl p-4`}>
                        <h3 className={`${sectionTitle('purple')} font-semibold mb-4 flex items-center gap-2`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Products Section Header
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            {renderInput('Section Title', 'section-title', 'Our Catalogue', 'كتالوج المنتجات', 'purple')}
                            {renderInput('Section Subtitle', 'section-subtitle', 'Foldable IBCs · RPC Crates · Accessories', 'حاويات IBC قابلة للطي · صناديق RPC · إكسسوارات', 'purple')}
                        </div>
                    </div>

                    {/* Product 1 - Foldable IBC */}
                    <div className={`${sectionBg('cyan')} border rounded-lg p-4`}>
                        <h4 className={`${isAr ? 'text-amber-300' : 'text-cyan-300'} font-medium mb-3`}>Product 1 - Foldable IBC</h4>
                        <div className="space-y-3">
                            {renderInput('Title', 'product-1-title', 'Foldable IBC - 1000 Lit', 'حاوية IBC قابلة للطي - 1000 لتر', 'cyan')}
                            {renderInput('Image URL', 'product-1-image', 'https://...', 'https://...', 'cyan')}
                            {renderInput('Spec Headers (comma-separated)', 'product-1-spec-headers', 'Types of Truck,2.6m Standard Trailer,3m Mega road train', 'أنواع الشاحنات,مقطورة قياسية 2.6 متر,قطار طريق ضخم 3 متر', 'cyan')}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Specifications (label,value1,value2)</label>
                                {[1, 2, 3].map(i => (
                                    <div key={i}>
                                        {renderInput(`Spec Row ${i}`, `product-1-spec-row-${i}`,
                                            i === 1 ? 'IC 1040,208,270' : i === 2 ? 'Industry standard IBC,130,180' : 'Improvement rate,60% More,50% More',
                                            i === 1 ? 'IC 1040,208,270' : i === 2 ? 'IBC قياسي صناعي,130,180' : 'معدل التحسين,60% أكثر,50% أكثر',
                                            'cyan'
                                        )}
                                    </div>
                                ))}
                            </div>
                            {renderInput('Price Label', 'product-1-price-label', 'On Call', 'عند الاتصال', 'cyan')}
                        </div>
                    </div>

                    {/* Products 2-6 - RPC Series */}
                    {[2, 3, 4, 5, 6].map(productNum => {
                        const productNames: { [key: number]: [string, string] } = {
                            2: ['RPC 6419', 'RPC 6419'],
                            3: ['RPC 6422', 'RPC 6422'],
                            4: ['RPC 6430', 'RPC 6430'],
                            5: ['Large Foldable Crate', 'صندوق قابل للطي كبير'],
                            6: ['RPC 6411', 'RPC 6411'],
                        };
                        const subtitlePlaceholders: { [key: number]: [string, string] } = {
                            2: ['600x400x195mm', '600×400×195 ملم'],
                            3: ['600x400x225mm', '600×400×225 ملم'],
                            4: ['600x400x300mm', '600×400×300 ملم'],
                            5: ['800x600x984mm', '800×600×984 ملم'],
                            6: ['600x400x115mm', '600×400×115 ملم'],
                        };
                        const specRowsAr: { [key: number]: string[][] } = {
                            2: [
                                ['البعد الخارجي,600*400*195 ملم', 'البعد الداخلي,576*376*180 ملم', 'الوزن الفارغ,1.8 كجم', 'السعة,39 لتر', 'حمولة الوحدة,20 كجم'],
                            ],
                            3: [
                                ['البعد الخارجي,600*400*225 ملم', 'البعد الداخلي,576*376*212 ملم', 'الوزن الفارغ,2.0 كجم', 'السعة,47 لتر', 'حمولة الوحدة,22 كجم'],
                            ],
                            4: [
                                ['البعد الخارجي,600*400*300 ملم', 'البعد الداخلي,576*376*291 ملم', 'الوزن الفارغ,2.8 كجم', 'السعة,61 لتر', 'حمولة الوحدة,30 كجم'],
                            ],
                            5: [
                                ['البعد الخارجي,800*600*984 ملم', 'البعد الداخلي,760*560*852 ملم', 'ارتفاع الطي,334 ملم', 'الوزن الفارغ,25 كجم', 'السعة,368 لتر', 'حمولة الوحدة,250 كجم'],
                            ],
                            6: [
                                ['البعد الخارجي,600*400*115 ملم', 'البعد الداخلي,576*376*105 ملم', 'الوزن الفارغ,1.5 كجم', 'السعة,23 لتر', 'حمولة الوحدة,15 كجم'],
                            ],
                        };
                        const specRowCount = productNum === 5 ? 6 : 5;
                        return (
                            <div key={productNum} className={`${sectionBg('green')} border rounded-lg p-4`}>
                                <h4 className={`${isAr ? 'text-amber-300' : 'text-green-300'} font-medium mb-3`}>Product {productNum} - {productNames[productNum][0]}</h4>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        {renderInput('Title', `product-${productNum}-title`, productNames[productNum][0], productNames[productNum][1], 'green')}
                                        {renderInput('Subtitle', `product-${productNum}-subtitle`, subtitlePlaceholders[productNum][0], subtitlePlaceholders[productNum][1], 'green')}
                                    </div>
                                    {renderInput('Image URL', `product-${productNum}-image`, 'https://...', 'https://...', 'green')}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-300">Specifications (label,value)</label>
                                        {Array.from({ length: specRowCount }, (_, i) => (
                                            <div key={i}>
                                                {renderInput(
                                                    `Spec Row ${i + 1}`,
                                                    `product-${productNum}-spec-row-${i + 1}`,
                                                    `Spec row ${i + 1}: Label,Value`,
                                                    specRowsAr[productNum]?.[0]?.[i] || `صف المواصفات ${i + 1}`,
                                                    'green'
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {renderInput('Price Label', `product-${productNum}-price-label`, 'On Call', 'عند الاتصال', 'green')}
                                </div>
                            </div>
                        );
                    })}

                    {/* Product 7 - Sheet Separators */}
                    <div className={`${sectionBg('orange')} border rounded-lg p-4`}>
                        <h4 className={`${isAr ? 'text-amber-300' : 'text-orange-300'} font-medium mb-3`}>Product 7 - Sheet Separators</h4>
                        <div className="space-y-3">
                            {renderInput('Title', 'product-7-title', 'Sheet Separators', 'فواصل الألواح', 'orange')}
                            {renderInput('Image URL', 'product-7-image', 'https://...', 'https://...', 'orange')}
                        </div>
                    </div>

                    {/* Product 8 - Gallon Racks */}
                    <div className={`${sectionBg('red')} border rounded-lg p-4`}>
                        <h4 className={`${isAr ? 'text-amber-300' : 'text-red-300'} font-medium mb-3`}>Product 8 - Gallon Racks</h4>
                        <div className="space-y-3">
                            {renderInput('Title', 'product-8-title', 'Gallon Racks', 'حوامل الجالون', 'red')}
                            {renderInput('Image URL', 'product-8-image', 'https://...', 'https://...', 'red')}
                            {renderInput('Features (comma-separated)', 'product-8-features', 'The 4 pcs Set,The 8 pcs Set', 'طقم 4 قطع,طقم 8 قطع', 'red')}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className={`${sectionBg('yellow')} border rounded-xl p-4`}>
                        <h3 className={`${sectionTitle('yellow')} font-semibold mb-4 flex items-center gap-2`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Call to Action Section
                        </h3>

                        <div className="space-y-4">
                            {renderInput('CTA Title', 'cta-title', 'Need a Custom Quote?', 'هل تحتاج عرض سعر مخصص؟', 'yellow')}
                            {renderTextarea('CTA Description', 'cta-description', 'We offer tailored solutions for crates, IBCs, and logistics accessories', 'نحن نقدم حلول مخصصة للصناديق وحاويات IBC وإكسسوارات اللوجستيات', 2, 'yellow')}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Update Transport & Logistics Page'}
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