'use client';

import { useState } from 'react';

interface HomePageContent {
    [key: string]: {
        value: string;
        valueAr?: string;
        id: number;
    };
}

interface HomePageEditorProps {
    content: HomePageContent;
    onSave: (content: { [key: string]: string }, contentAr: { [key: string]: string }) => Promise<void>;
    onClose: () => void;
    saving: boolean;
}

export default function HomePageEditor({ content, onSave, onClose, saving }: HomePageEditorProps) {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(editingContent, editingContentAr);
    };

    const updateContent = (key: string, value: string) => {
        setEditingContent(prev => ({ ...prev, [key]: value }));
    };

    const updateContentAr = (key: string, value: string) => {
        setEditingContentAr(prev => ({ ...prev, [key]: value }));
    };

    // Render an input field pair (label + input) for the active language
    const renderInput = (label: string, key: string, placeholder: string, placeholderAr: string) => (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                {label} {activeTab === 'ar' && <span className="text-amber-400 text-xs">(عربي)</span>}
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
                    style={{ fontFamily: 'inherit' }}
                />
            )}
        </div>
    );

    const renderTextarea = (label: string, key: string, placeholder: string, placeholderAr: string) => (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                {label} {activeTab === 'ar' && <span className="text-amber-400 text-xs">(عربي)</span>}
            </label>
            {activeTab === 'en' ? (
                <textarea
                    rows={4}
                    value={editingContent[key] || ''}
                    onChange={(e) => updateContent(key, e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 resize-y"
                    placeholder={placeholder}
                    dir="ltr"
                />
            ) : (
                <textarea
                    rows={4}
                    value={editingContentAr[key] || ''}
                    onChange={(e) => updateContentAr(key, e.target.value)}
                    className="w-full bg-white/5 border border-amber-500/20 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-amber-500/50 resize-y"
                    placeholder={placeholderAr}
                    dir="rtl"
                    style={{ fontFamily: 'inherit' }}
                />
            )}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#151b2e] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-[#151b2e] border-b border-white/5 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-lg font-bold text-white">Edit Home Page Content</h2>
                    <div className="flex items-center gap-3">
                        {/* EN / AR Toggle */}
                        <div className="flex rounded-lg overflow-hidden border border-white/10">
                            <button
                                type="button"
                                onClick={() => setActiveTab('en')}
                                className={`px-3 py-1.5 text-xs font-semibold transition-all ${activeTab === 'en'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white/5 text-gray-400 hover:text-white'
                                    }`}
                            >
                                EN
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('ar')}
                                className={`px-3 py-1.5 text-xs font-semibold transition-all ${activeTab === 'ar'
                                        ? 'bg-amber-600 text-white'
                                        : 'bg-white/5 text-gray-400 hover:text-white'
                                    }`}
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

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Language indicator banner */}
                    {activeTab === 'ar' && (
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2 text-amber-300 text-sm flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                            </svg>
                            تعديل المحتوى العربي — Arabic content editing mode
                        </div>
                    )}

                    {/* Business Units Section */}
                    <div className={`${activeTab === 'ar' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-blue-500/5 border-blue-500/20'} border rounded-xl p-4`}>
                        <h3 className={`${activeTab === 'ar' ? 'text-amber-400' : 'text-blue-400'} font-semibold mb-4 flex items-center gap-2`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Business Units Section
                        </h3>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {renderInput('Section Title', 'title', 'Our Business Units', 'وحدات الأعمال')}
                                {renderInput('Section Subtitle', 'subtitle', 'Comprehensive solutions across three core divisions', 'حلول شاملة عبر ثلاثة أقسام رئيسية')}
                            </div>

                            {/* Unit 1 - Plastic Pallets */}
                            <div className={`${activeTab === 'ar' ? 'bg-amber-600/10 border-amber-600/20' : 'bg-blue-600/10 border-blue-600/20'} border rounded-lg p-4`}>
                                <h4 className={`${activeTab === 'ar' ? 'text-amber-300' : 'text-blue-300'} font-medium mb-3`}>Unit 1 - Plastic Pallets</h4>
                                <div className="space-y-3">
                                    {renderInput('Title', 'unit1-title', 'Plastic Pallets', 'طبالي بلاستيكية')}
                                    {renderTextarea('Description', 'unit1-description', 'PAFT heavy-duty plastic pallets description...', 'وصف طبالي بافت البلاستيكية الثقيلة...')}
                                    {renderInput('Button Text', 'unit1-button-text', 'Discover more', 'اكتشف المزيد')}
                                </div>
                            </div>

                            {/* Unit 2 - Raw Materials */}
                            <div className={`${activeTab === 'ar' ? 'bg-amber-600/10 border-amber-600/20' : 'bg-green-600/10 border-green-600/20'} border rounded-lg p-4`}>
                                <h4 className={`${activeTab === 'ar' ? 'text-amber-300' : 'text-green-300'} font-medium mb-3`}>Unit 2 - Raw Materials</h4>
                                <div className="space-y-3">
                                    {renderInput('Title', 'unit2-title', 'High-Performance Recycled Raw Materials', 'مواد خام معاد تدويرها عالية الأداء')}
                                    {renderTextarea('Description', 'unit2-description', 'Our innovative recycled raw materials description...', 'وصف المواد الخام المعاد تدويرها المبتكرة...')}
                                    {renderInput('Button Text', 'unit2-button-text', 'Discover more', 'اكتشف المزيد')}
                                </div>
                            </div>

                            {/* Unit 3 - Traceability */}
                            <div className={`${activeTab === 'ar' ? 'bg-amber-600/10 border-amber-600/20' : 'bg-red-600/10 border-red-600/20'} border rounded-lg p-4`}>
                                <h4 className={`${activeTab === 'ar' ? 'text-amber-300' : 'text-red-300'} font-medium mb-3`}>Unit 3 - Traceability</h4>
                                <div className="space-y-3">
                                    {renderInput('Title', 'unit3-title', 'A New Era of Traceability', 'عصر جديد من التتبع')}
                                    {renderTextarea('Description', 'unit3-description', 'PAFT iWMS utilizes advanced RFID technology description...', 'يستخدم نظام بافت iWMS تقنية RFID المتقدمة...')}
                                    {renderInput('Button Text', 'unit3-button-text', 'Discover more', 'اكتشف المزيد')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Video Hero Section */}
                    <div className={`${activeTab === 'ar' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-purple-500/5 border-purple-500/20'} border rounded-xl p-4`}>
                        <h3 className={`${activeTab === 'ar' ? 'text-amber-400' : 'text-purple-400'} font-semibold mb-3 flex items-center gap-2`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Video Hero Section
                        </h3>
                        {renderInput('Watch Video Text', 'watch-video-text', 'Watch Video', 'شاهد الفيديو')}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Update Home Page'}
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