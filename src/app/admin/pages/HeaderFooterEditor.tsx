'use client';

import { useState, useEffect } from 'react';

interface HeaderFooterEditorProps {
    content: { [key: string]: { value: string; valueAr?: string; id: number } };
    onSave: (content: { [key: string]: string }, contentAr?: { [key: string]: string }) => Promise<void>;
    onClose: () => void;
    saving: boolean;
}

export default function HeaderFooterEditor({ content, onSave, onClose, saving }: HeaderFooterEditorProps) {
    const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');
    const [editingContent, setEditingContent] = useState<{ [key: string]: string }>(() => {
        const init: { [key: string]: string } = {};
        Object.keys(content).forEach(key => { init[key] = content[key]?.value || ''; });
        return init;
    });
    const [editingContentAr, setEditingContentAr] = useState<{ [key: string]: string }>(() => {
        const init: { [key: string]: string } = {};
        Object.keys(content).forEach(key => { init[key] = content[key]?.valueAr || ''; });
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

    const updateContent = (key: string, value: string) => setEditingContent(prev => ({ ...prev, [key]: value }));
    const updateContentAr = (key: string, value: string) => setEditingContentAr(prev => ({ ...prev, [key]: value }));

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onSave(editingContent, editingContentAr);
    };

    const isAr = activeTab === 'ar';

    const renderInput = (label: string, key: string, placeholder: string, placeholderAr: string, focusColor = 'blue') => (
        <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
                {label} {isAr && <span className="text-amber-400 text-xs">(عربي)</span>}
            </label>
            {activeTab === 'en' ? (
                <input
                    value={editingContent[key] || ''}
                    onChange={e => updateContent(key, e.target.value)}
                    className={`w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-${focusColor}-500/50`}
                    placeholder={placeholder}
                    dir="ltr"
                />
            ) : (
                <input
                    value={editingContentAr[key] || ''}
                    onChange={e => updateContentAr(key, e.target.value)}
                    className="w-full bg-white/5 border border-amber-500/20 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-amber-500/50"
                    placeholder={placeholderAr}
                    dir="rtl"
                />
            )}
        </div>
    );

    const renderTextarea = (label: string, key: string, placeholder: string, placeholderAr: string, rows = 3) => (
        <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
                {label} {isAr && <span className="text-amber-400 text-xs">(عربي)</span>}
            </label>
            {activeTab === 'en' ? (
                <textarea
                    rows={rows}
                    value={editingContent[key] || ''}
                    onChange={e => updateContent(key, e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 resize-y"
                    placeholder={placeholder}
                    dir="ltr"
                />
            ) : (
                <textarea
                    rows={rows}
                    value={editingContentAr[key] || ''}
                    onChange={e => updateContentAr(key, e.target.value)}
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
                {/* Header */}
                <div className="sticky top-0 bg-[#151b2e] border-b border-white/5 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-lg font-bold text-white">Edit Header & Footer</h2>
                    <div className="flex items-center gap-3">
                        <div className="flex bg-white/5 rounded-lg p-0.5">
                            <button type="button" onClick={() => setActiveTab('en')}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'en' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>
                                EN
                            </button>
                            <button type="button" onClick={() => setActiveTab('ar')}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'ar' ? 'bg-amber-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>
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

                    {/* ── HEADER NAV ──────────────────────────────────────────── */}
                    <div className={`${isAr ? 'bg-amber-500/5 border-amber-500/20' : 'bg-cyan-500/5 border-cyan-500/20'} border rounded-xl p-4`}>
                        <h3 className={`${isAr ? 'text-amber-400' : 'text-cyan-400'} font-semibold mb-4 flex items-center gap-2`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            Header Navigation Labels
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {renderInput('Home', 'nav-home', 'Home', 'الرئيسية', 'cyan')}
                            {renderInput('Company', 'nav-company', 'Company', 'الشركة', 'cyan')}
                            {renderInput('About', 'nav-about', 'About', 'من نحن', 'cyan')}
                            {renderInput('Our Journey', 'nav-our-journey', 'Our Journey', 'رحلتنا', 'cyan')}
                            {renderInput('Products', 'nav-products', 'Products', 'المنتجات', 'cyan')}
                            {renderInput('Plastic Pallets', 'nav-plastic-pallets', 'Plastic Pallets', 'البالتات البلاستيكية', 'cyan')}
                            {renderInput('Transport Logistics', 'nav-transport-logistics', 'Transport-Logistics Items', 'مستلزمات النقل', 'cyan')}
                            {renderInput('Raw Materials', 'nav-raw-materials', 'Raw Material Supply', 'توريد المواد الخام', 'cyan')}
                            {renderInput('Innovative Solutions', 'nav-innovative-solutions', 'Innovative Solutions', 'الحلول المبتكرة', 'cyan')}
                            {renderInput('Coverage', 'nav-coverage', 'Coverage', 'التغطية', 'cyan')}
                            {renderInput('Clients', 'nav-clients', 'Clients', 'العملاء', 'cyan')}
                            {renderInput('Markets', 'nav-markets', 'Markets', 'الأسواق', 'cyan')}
                            {renderInput('Shop', 'nav-shop', 'Shop', 'المتجر', 'cyan')}
                            {renderInput('Contact', 'nav-contact', 'Contact', 'تواصل معنا', 'cyan')}
                        </div>
                        <div className="mt-4">
                            {renderInput('CTA Button — Get Quote', 'nav-get-quote', 'Get Quote', 'احصل على عرض', 'cyan')}
                        </div>
                    </div>

                    {/* ── DROPDOWN DESCRIPTIONS ───────────────────────────────── */}
                    <div className={`${isAr ? 'bg-amber-500/5 border-amber-500/20' : 'bg-purple-500/5 border-purple-500/20'} border rounded-xl p-4`}>
                        <h3 className={`${isAr ? 'text-amber-400' : 'text-purple-400'} font-semibold mb-4 flex items-center gap-2`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            Dropdown Descriptions
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {renderInput('About', 'nav-desc-about', 'Who we are & our vision', 'من نحن وما رؤيتنا', 'purple')}
                            {renderInput('Our Journey', 'nav-desc-our-journey', 'Our milestones & growth', 'إنجازاتنا ونمونا', 'purple')}
                            {renderInput('Markets', 'nav-desc-markets', 'Our worldwide presence', 'حضورنا العالمي', 'purple')}
                            {renderInput('Plastic Pallets', 'nav-desc-plastic-pallets', 'Heavy & light duty pallets', 'بالتات ثقيلة وخفيفة الحمل', 'purple')}
                            {renderInput('Transport Logistics', 'nav-desc-transport-logistics', 'IBCs, crates & accessories', 'حاويات IBC وصناديق ومستلزمات', 'purple')}
                            {renderInput('Raw Materials', 'nav-desc-raw-materials', 'Recycled HDPE polymers', 'بوليمرات HDPE المعاد تدويرها', 'purple')}
                            {renderInput('Innovative Solutions', 'nav-desc-innovative-solutions', 'Vision-driven supply chain tech', 'تقنيات سلسلة التوريد المبتكرة', 'purple')}
                            {renderInput('Clients', 'nav-desc-clients', 'Our trusted partners & brands', 'شركاؤنا وعلاماتنا الموثوقة', 'purple')}
                        </div>
                    </div>

                    {/* ── FOOTER ──────────────────────────────────────────────── */}
                    <div className={`${isAr ? 'bg-amber-500/5 border-amber-500/20' : 'bg-blue-500/5 border-blue-500/20'} border rounded-xl p-4`}>
                        <h3 className={`${isAr ? 'text-amber-400' : 'text-blue-400'} font-semibold mb-4 flex items-center gap-2`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 20h16M4 16h16" />
                            </svg>
                            Footer Content
                        </h3>
                        <div className="space-y-4">
                            {renderTextarea('Brand Description', 'footer-brand-description',
                                'Leading manufacturer of premium plastic pallets...',
                                'الشركة الرائدة في تصنيع البالتات البلاستيكية الفاخرة...', 2)}

                            <div className="grid grid-cols-2 gap-4">
                                {renderInput('Section: Quick Links Title', 'footer-quick-links-title', 'Quick Links', 'روابط سريعة', 'blue')}
                                {renderInput('Section: Contact Info Title', 'footer-contact-info-title', 'Contact Info', 'معلومات التواصل', 'blue')}
                                {renderInput('Section: Business Hours Title', 'footer-business-hours-title', 'Business Hours', 'ساعات العمل', 'blue')}
                            </div>

                            <div className="bg-white/5 rounded-lg p-3 space-y-3">
                                <h4 className={`${isAr ? 'text-amber-300' : 'text-blue-300'} text-sm font-medium`}>🔗 Quick Links Labels</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {renderInput('Products link', 'footer-link-products', 'Products', 'المنتجات', 'blue')}
                                    {renderInput('About Us link', 'footer-link-about', 'About Us', 'من نحن', 'blue')}
                                    {renderInput('Contact link', 'footer-link-contact', 'Contact', 'تواصل معنا', 'blue')}
                                    {renderInput('Shop link', 'footer-link-shop', 'Shop', 'المتجر', 'blue')}
                                    {renderInput('Admin link', 'footer-link-admin', 'Admin', 'الإدارة', 'blue')}
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-lg p-3 space-y-3">
                                <h4 className={`${isAr ? 'text-amber-300' : 'text-blue-300'} text-sm font-medium`}>📍 Contact Info Details</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {renderInput('Email', 'footer-contact-email', 'info@paft.com', 'info@paft.com', 'blue')}
                                    {renderInput('Phone', 'footer-contact-phone', '+20 123 456 7890', '+20 123 456 7890', 'blue')}
                                </div>
                                {renderInput('Address', 'footer-contact-address', '123 Industrial Zone, Manufacturing District, Cairo, Egypt', '123 المنطقة الصناعية، حي التصنيع، القاهرة، مصر', 'blue')}
                                {renderInput('Business Hours', 'footer-business-hours', 'Sunday - Thursday: 9:00 AM - 6:00 PM', 'الأحد - الخميس: 9:00 ص - 6:00 م', 'blue')}
                            </div>

                            <div className="bg-white/5 rounded-lg p-3 space-y-3">
                                <h4 className={`${isAr ? 'text-amber-300' : 'text-blue-300'} text-sm font-medium`}>📣 CTA Box</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {renderInput('CTA Text', 'footer-cta-text', 'Ready to get started?', 'هل أنت مستعد للبدء؟', 'blue')}
                                    {renderInput('CTA Link Label', 'footer-cta-link', 'Contact Us', 'تواصل معنا', 'blue')}
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-lg p-3 space-y-3">
                                <h4 className={`${isAr ? 'text-amber-300' : 'text-blue-300'} text-sm font-medium`}>⚖️ Bottom Bar</h4>
                                {renderInput('Copyright Text', 'footer-copyright',
                                    '© 2025 PAFT Plastic Pallets. All rights reserved.',
                                    '© 2025 PAFT للبالتات البلاستيكية. جميع الحقوق محفوظة.', 'blue')}
                                <div className="grid grid-cols-2 gap-3">
                                    {renderInput('Privacy Policy', 'footer-privacy-policy', 'Privacy Policy', 'سياسة الخصوصية', 'blue')}
                                    {renderInput('Terms of Service', 'footer-terms-of-service', 'Terms of Service', 'شروط الخدمة', 'blue')}
                                </div>
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
                            {saving ? 'Saving...' : 'Update Header & Footer'}
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
