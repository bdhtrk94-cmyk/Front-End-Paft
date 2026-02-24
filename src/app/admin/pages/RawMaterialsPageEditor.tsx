'use client';

import { useState, useEffect } from 'react';

interface RawMaterialsPageEditorProps {
    content: { [key: string]: { value: string; valueAr?: string; id: number } };
    onSave: (content: { [key: string]: string }, contentAr?: { [key: string]: string }) => Promise<void>;
    onClose: () => void;
    saving: boolean;
}

export default function RawMaterialsPageEditor({ content, onSave, onClose, saving }: RawMaterialsPageEditorProps) {
    const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');
    const [editingContent, setEditingContent] = useState<{ [key: string]: string }>(() => {
        const initialContent: { [key: string]: string } = {};
        Object.keys(content).forEach(key => {
            initialContent[key] = content[key]?.value || '';
        });
        return initialContent;
    });
    const [editingContentAr, setEditingContentAr] = useState<{ [key: string]: string }>(() => {
        const initialContent: { [key: string]: string } = {};
        Object.keys(content).forEach(key => {
            initialContent[key] = content[key]?.valueAr || '';
        });
        return initialContent;
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onSave(editingContent, editingContentAr);
    };

    const updateContent = (key: string, value: string) => {
        setEditingContent(prev => ({ ...prev, [key]: value }));
    };

    const updateContentAr = (key: string, value: string) => {
        setEditingContentAr(prev => ({ ...prev, [key]: value }));
    };

    const isAr = activeTab === 'ar';

    const renderInput = (label: string, key: string, placeholder: string = '', placeholderAr: string = '') => (
        <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
                {label} {isAr && <span className="text-amber-400 text-xs">(عربي)</span>}
            </label>
            {activeTab === 'en' ? (
                <input
                    value={editingContent[key] || ''}
                    onChange={(e) => updateContent(key, e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50"
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

    const renderTextarea = (label: string, key: string, rows: number = 3, placeholder: string = '', placeholderAr: string = '') => (
        <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
                {label} {isAr && <span className="text-amber-400 text-xs">(عربي)</span>}
            </label>
            {activeTab === 'en' ? (
                <textarea
                    rows={rows}
                    value={editingContent[key] || ''}
                    onChange={(e) => updateContent(key, e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 resize-y"
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
                    <h2 className="text-lg font-bold text-white">Edit Raw Materials Page</h2>
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
                    <div className={`${isAr ? 'bg-amber-500/5 border-amber-500/20' : 'bg-blue-500/5 border-blue-500/20'} border rounded-xl p-4`}>
                        <h3 className={`${isAr ? 'text-amber-400' : 'text-blue-400'} font-semibold mb-4`}>Hero Section</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {renderInput('Badge Text', 'badge-text', 'Raw Material Supply', 'توريد المواد الخام')}
                                {renderInput('Main Title', 'title', 'Sustainable Materials', 'مواد مستدامة')}
                            </div>
                            {renderTextarea('Description', 'description', 3, 'Our commitment to sustainability...', 'التزامنا بالاستدامة...')}
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className={`${isAr ? 'bg-amber-500/5 border-amber-500/20' : 'bg-green-500/5 border-green-500/20'} border rounded-xl p-4`}>
                        <h3 className={`${isAr ? 'text-amber-400' : 'text-green-400'} font-semibold mb-4`}>Stats Section</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="p-3 bg-white/5 rounded-lg">
                                    {renderInput(`Stat ${i} Value`, `stat-${i}-value`)}
                                    {renderInput(`Stat ${i} Label`, `stat-${i}-label`)}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Materials Grid */}
                    <div className={`${isAr ? 'bg-amber-500/5 border-amber-500/20' : 'bg-purple-500/5 border-purple-500/20'} border rounded-xl p-4`}>
                        <h3 className={`${isAr ? 'text-amber-400' : 'text-purple-400'} font-semibold mb-4`}>{isAr ? 'شبكة المواد' : 'Materials Grid'}</h3>
                        <div className="space-y-6">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="bg-white/5 rounded-lg p-4 border border-white/5">
                                    <h4 className="text-white font-medium mb-3">{isAr ? `المادة ${i}` : `Material ${i}`}</h4>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="col-span-2">
                                            {renderInput('Title', `material-${i}-title`, 'Material title', 'عنوان المادة')}
                                        </div>
                                        <div className="col-span-2">
                                            {renderInput('Image URL', `material-${i}-image`, 'https://...', 'https://...')}
                                        </div>
                                        {renderInput('Polymer', `material-${i}-polymer`, 'Polymer type', 'نوع البوليمر')}
                                        {renderInput('Source', `material-${i}-source`, 'Material source', 'مصدر المادة')}
                                        {renderInput('Color', `material-${i}-color`, 'Available colors', 'الألوان المتاحة')}
                                        {renderInput('Additives', `material-${i}-additives`, 'Additives used', 'المضافات المستخدمة')}
                                        <div className="col-span-2">
                                            {renderInput('Link', `material-${i}-link`, 'https://...', 'https://...')}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Data Sheets Section */}
                    <div className={`${isAr ? 'bg-amber-500/5 border-amber-500/20' : 'bg-orange-500/5 border-orange-500/20'} border rounded-xl p-4`}>
                        <h3 className={`${isAr ? 'text-amber-400' : 'text-orange-400'} font-semibold mb-4`}>{isAr ? 'أوراق البيانات' : 'Data Sheets'}</h3>
                        <div className="space-y-6">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="bg-white/5 rounded-lg p-4 border border-white/5">
                                    <h4 className="text-white font-medium mb-3">{isAr ? `ورقة بيانات ${i}` : `Sheet ${i}`}</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {renderInput('Title', `sheet-${i}-title`, 'Sheet title', 'عنوان ورقة البيانات')}
                                        {renderInput('Subtitle', `sheet-${i}-subtitle`, 'Sheet subtitle', 'العنوان الفرعي')}
                                        <div className="col-span-2">
                                            {renderInput('Badges (comma-separated)', `sheet-${i}-badges`, 'Badge1, Badge2', 'شارة1, شارة2')}
                                        </div>
                                        <div className="col-span-2">
                                            {renderTextarea('Description', `sheet-${i}-description`, 3, 'Sheet description...', 'وصف ورقة البيانات...')}
                                        </div>
                                        {renderInput('Datasheet URL', `sheet-${i}-datasheetUrl`, 'https://...', 'https://...')}
                                        {renderInput('PDF URL', `sheet-${i}-pdfUrl`, 'https://...', 'https://...')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section Titles */}
                    <div className={`${isAr ? 'bg-amber-500/5 border-amber-500/20' : 'bg-indigo-500/5 border-indigo-500/20'} border rounded-xl p-4`}>
                        <h3 className={`${isAr ? 'text-amber-400' : 'text-indigo-400'} font-semibold mb-4`}>Section Titles</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {renderInput('Materials Section Title', 'materials-section-title', 'Our Materials', 'موادنا')}
                                {renderInput('Materials Section Subtitle', 'materials-section-subtitle', 'Discover our range...', 'اكتشف مجموعتنا...')}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {renderInput('Datasheets Section Title', 'datasheets-section-title', 'Product Data Sheets', 'أوراق بيانات المنتج')}
                                {renderInput('Datasheets Section Subtitle', 'datasheets-section-subtitle', 'Explore our comprehensive...', 'استكشف مجموعتنا...')}
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className={`${isAr ? 'bg-amber-500/5 border-amber-500/20' : 'bg-yellow-500/5 border-yellow-500/20'} border rounded-xl p-4`}>
                        <h3 className={`${isAr ? 'text-amber-400' : 'text-yellow-400'} font-semibold mb-4`}>Call to Action</h3>
                        <div className="space-y-4">
                            {renderInput('CTA Title', 'cta-title', 'Need Custom Materials?', 'هل تحتاج مواد مخصصة؟')}
                            {renderTextarea('CTA Description', 'cta-description', 2, 'Contact our materials team...', 'اتصل بفريق المواد...')}
                            <div className="grid grid-cols-2 gap-4">
                                {renderInput('Sample Button Text', 'button-sample', 'Request a Sample →', 'اطلب عينة ←')}
                                {renderInput('Contact Button Text', 'button-contact', 'Contact Sales', 'تواصل مع المبيعات')}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Update Raw Materials Page'}
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
