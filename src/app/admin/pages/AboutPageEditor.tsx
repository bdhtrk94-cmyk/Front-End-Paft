'use client';

import { useState } from 'react';

interface AboutPageContent {
    [key: string]: {
        value: string;
        valueAr?: string;
        id: number;
    };
}

interface AboutPageEditorProps {
    content: AboutPageContent;
    onSave: (content: { [key: string]: string }, contentAr: { [key: string]: string }) => Promise<void>;
    onClose: () => void;
    saving: boolean;
}

export default function AboutPageEditor({ content, onSave, onClose, saving }: AboutPageEditorProps) {
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

    // Shared input renderers
    const renderInput = (label: string, key: string, placeholder: string, placeholderAr: string, focusColor = 'cyan') => (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                {label} {activeTab === 'ar' && <span className="text-amber-400 text-xs">(عربي)</span>}
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

    const renderTextarea = (label: string, key: string, placeholder: string, placeholderAr: string, rows = 3, focusColor = 'cyan') => (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
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
            <div className="bg-[#151b2e] border border-white/10 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-[#151b2e] border-b border-white/5 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-lg font-bold text-white">Edit About Page Content</h2>
                    <div className="flex items-center gap-3">
                        {/* EN / AR Toggle */}
                        <div className="flex rounded-lg overflow-hidden border border-white/10">
                            <button
                                type="button"
                                onClick={() => setActiveTab('en')}
                                className={`px-3 py-1.5 text-xs font-semibold transition-all ${activeTab === 'en'
                                        ? 'bg-cyan-600 text-white'
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
                    {isAr && (
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2 text-amber-300 text-sm flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                            </svg>
                            تعديل المحتوى العربي — Arabic content editing mode
                        </div>
                    )}

                    {/* Hero Section */}
                    <div className={`${sectionBg('cyan')} border rounded-xl p-4`}>
                        <h3 className={`${sectionTitle('cyan')} font-semibold mb-4 flex items-center gap-2`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            Hero Section
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {renderInput('Badge Text', 'badge-text', 'About PAFT', 'عن بافت')}
                            {renderInput('Title', 'title', 'Our Vision', 'رؤيتنا')}
                        </div>
                        <div className="mt-4">
                            {renderTextarea('Description', 'description', 'Be, & be recognized as the pace setters...', 'أن نكون ونُعرف كفريق الصدارة في تقديم حلول لوجستيات النقل...')}
                        </div>
                    </div>

                    {/* Who We Are Section */}
                    <div className={`${sectionBg('blue')} border rounded-xl p-4`}>
                        <h3 className={`${sectionTitle('blue')} font-semibold mb-4 flex items-center gap-2`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Who We Are Section
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {renderInput('Badge Text', 'who-badge-text', 'Who We Are', 'من نحن', 'blue')}
                                {renderInput('Section Title', 'who-title', 'Packaging Applications & Future Technologies', 'تطبيقات التعبئة وتقنيات المستقبل', 'blue')}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {renderTextarea('Paragraph 1', 'paragraph1', 'PAFT is a leading provider...', 'بافت هي شركة رائدة في تقديم حلول سلاسل التوريد المبتكرة...', 3, 'blue')}
                                {renderTextarea('Paragraph 2', 'paragraph2', 'Our commitment to excellence...', 'ينعكس التزامنا بالتميز في استخدامنا لأجود المواد...', 3, 'blue')}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {renderTextarea('Paragraph 3', 'paragraph3', 'At PAFT, we understand...', 'في بافت، نتفهم التحديات التي تواجه الصناعات...', 3, 'blue')}
                                {renderTextarea('Paragraph 4', 'paragraph4', 'Whether you need heavy-duty pallets...', 'سواء كنت بحاجة إلى طبالي ثقيلة التحمل...', 3, 'blue')}
                            </div>
                            {renderTextarea('Company Quote', 'quote', 'At PAFT, innovation delivered at great value...', 'في بافت، الابتكار بقيمة عالية هو جوهر كل ما نقوم به...', 2, 'blue')}
                            <div className="grid grid-cols-4 gap-3">
                                {renderInput('Stat 1 Number', 'stat1-number', '10+', '+10', 'blue')}
                                {renderInput('Stat 1 Text', 'stat1-text', 'Years Experience', 'سنوات خبرة', 'blue')}
                                {renderInput('Stat 2 Number', 'stat2-number', 'MENA', 'الشرق الأوسط', 'blue')}
                                {renderInput('Stat 2 Text', 'stat2-text', 'Region Leader', 'رائد إقليمي', 'blue')}
                            </div>
                        </div>
                    </div>

                    {/* Values Section */}
                    <div className={`${sectionBg('green')} border rounded-xl p-4`}>
                        <h3 className={`${sectionTitle('green')} font-semibold mb-4 flex items-center gap-2`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Values Section
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {renderInput('Section Title', 'values-title', 'Our Core Values', 'قيمنا الأساسية', 'green')}
                                {renderInput('Subtitle', 'values-subtitle', 'The principles that guide everything we do at PAFT', 'المبادئ التي توجه كل ما نقوم به في بافت', 'green')}
                            </div>

                            {/* Values 1-4 */}
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { num: 1, titleEn: 'Quality First', titleAr: 'الجودة أولاً', descEn: 'Value 1 Description', descAr: 'وصف القيمة 1' },
                                    { num: 2, titleEn: 'Innovation', titleAr: 'الابتكار', descEn: 'Value 2 Description', descAr: 'وصف القيمة 2' },
                                    { num: 3, titleEn: 'Sustainability', titleAr: 'الاستدامة', descEn: 'Value 3 Description', descAr: 'وصف القيمة 3' },
                                    { num: 4, titleEn: 'Customer Focus', titleAr: 'التركيز على العميل', descEn: 'Value 4 Description', descAr: 'وصف القيمة 4' },
                                ].map(({ num, titleEn, titleAr, descEn, descAr }) => (
                                    <div key={num} className={`${isAr ? 'bg-amber-600/10 border-amber-600/20' : 'bg-green-600/10 border-green-600/20'} border rounded-lg p-3`}>
                                        <h4 className={`${isAr ? 'text-amber-300' : 'text-green-300'} font-medium mb-3`}>Value {num}</h4>
                                        <div className="space-y-2">
                                            {renderInput('Title', `value${num}-title`, titleEn, titleAr, 'green')}
                                            {renderTextarea('Description', `value${num}-description`, descEn, descAr, 2, 'green')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className={`${sectionBg('purple')} border rounded-xl p-4`}>
                        <h3 className={`${sectionTitle('purple')} font-semibold mb-4 flex items-center gap-2`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Call to Action Section
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {renderInput('Title', 'cta-title', 'Ready to Work With Us?', 'هل أنت مستعد للعمل معنا؟', 'purple')}
                                {renderInput('Description', 'cta-description', "Let's discuss how PAFT can help...", 'دعنا نناقش كيف يمكن لبافت مساعدتك...', 'purple')}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {renderInput('Button 1 Text', 'button1-text', 'Get in Touch →', 'تواصل معنا ←', 'purple')}
                                {renderInput('Button 2 Text', 'button2-text', 'Browse Products', 'تصفح المنتجات', 'purple')}
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
                            {saving ? 'Saving...' : 'Update About Page'}
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