'use client';

import { useState } from 'react';

interface OurJourneyPageContent {
    [key: string]: {
        value: string;
        valueAr?: string;
        id: number;
    };
}

interface OurJourneyPageEditorProps {
    content: OurJourneyPageContent;
    onSave: (content: { [key: string]: string }, contentAr: { [key: string]: string }) => Promise<void>;
    onClose: () => void;
    saving: boolean;
}

export default function OurJourneyPageEditor({ content, onSave, onClose, saving }: OurJourneyPageEditorProps) {
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

    const renderInput = (label: string, key: string, placeholder: string, placeholderAr: string, focusColor = 'purple') => (
        <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
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

    const renderTextarea = (label: string, key: string, placeholder: string, placeholderAr: string, rows = 3, focusColor = 'purple') => (
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
            <div className="bg-[#151b2e] border border-white/10 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-[#151b2e] border-b border-white/5 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-lg font-bold text-white">Edit Our Journey Page Content</h2>
                    <div className="flex items-center gap-3">
                        <div className="flex rounded-lg overflow-hidden border border-white/10">
                            <button
                                type="button"
                                onClick={() => setActiveTab('en')}
                                className={`px-3 py-1.5 text-xs font-semibold transition-all ${activeTab === 'en'
                                        ? 'bg-purple-600 text-white'
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
                    {isAr && (
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2 text-amber-300 text-sm flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                            </svg>
                            تعديل المحتوى العربي — Arabic content editing mode
                        </div>
                    )}

                    {/* Hero Section */}
                    <div className={`${sectionBg('purple')} border rounded-xl p-4`}>
                        <h3 className={`${sectionTitle('purple')} font-semibold mb-4 flex items-center gap-2`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            Hero Section
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {renderInput('Badge Text', 'badge-text', 'Our Journey', 'مسيرتنا')}
                                {renderInput('Title', 'title', 'Building the Future', 'بناء المستقبل')}
                            </div>
                            {renderTextarea('Description', 'description', 'Over a decade of innovation...', 'أكثر من عقد من الابتكار والنمو والسعي الدؤوب للتميز...')}
                            <div className="grid grid-cols-4 gap-3">
                                {[
                                    { num: 1, valEn: '15+', valAr: '+15', lblEn: 'Years of Innovation', lblAr: 'سنوات ابتكار' },
                                    { num: 2, valEn: '12', valAr: '12', lblEn: 'Key Milestones', lblAr: 'إنجازات رئيسية' },
                                    { num: 3, valEn: '4', valAr: '4', lblEn: 'Growth Eras', lblAr: 'حقب نمو' },
                                    { num: 4, valEn: '300%', valAr: '%300', lblEn: 'Capacity Growth', lblAr: 'نمو الطاقة الإنتاجية' },
                                ].map(({ num, valEn, valAr, lblEn, lblAr }) => (
                                    <div key={num} className="space-y-2">
                                        {renderInput(`Stat ${num} Value`, `stat${num}-value`, valEn, valAr)}
                                        {renderInput(`Stat ${num} Label`, `stat${num}-label`, lblEn, lblAr)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Era Labels */}
                    <div className={`${sectionBg('green')} border rounded-xl p-4`}>
                        <h3 className={`${sectionTitle('green')} font-semibold mb-4 flex items-center gap-2`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Era Labels
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { num: 1, lblEn: '1st Era', lblAr: 'الحقبة الأولى', subEn: 'Foundation & R&D', subAr: 'التأسيس والبحث', rngEn: '2010 – 2013', rngAr: '2010 – 2013' },
                                { num: 2, lblEn: '2nd Era', lblAr: 'الحقبة الثانية', subEn: 'Expansion & Innovation', subAr: 'التوسع والابتكار', rngEn: '2014 – 2018', rngAr: '2014 – 2018' },
                                { num: 3, lblEn: '3rd Era', lblAr: 'الحقبة الثالثة', subEn: 'Growth & Acquisition', subAr: 'النمو والاستحواذ', rngEn: '2019 – 2022', rngAr: '2019 – 2022' },
                                { num: 4, lblEn: '4th Era', lblAr: 'الحقبة الرابعة', subEn: 'Scale & Diversification', subAr: 'التوسع والتنويع', rngEn: '2023 – 2025', rngAr: '2023 – 2025' },
                            ].map(({ num, lblEn, lblAr, subEn, subAr, rngEn, rngAr }) => (
                                <div key={num} className={`${isAr ? 'bg-amber-600/10 border-amber-600/20' : 'bg-green-600/10 border-green-600/20'} border rounded-lg p-3`}>
                                    <h4 className={`${isAr ? 'text-amber-300' : 'text-green-300'} font-medium mb-3`}>Era {num}</h4>
                                    <div className="space-y-2">
                                        {renderInput('Label', `era${num}-label`, lblEn, lblAr, 'green')}
                                        {renderInput('Subtitle', `era${num}-subtitle`, subEn, subAr, 'green')}
                                        {renderInput('Year Range', `era${num}-range`, rngEn, rngAr, 'green')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline Milestones */}
                    <div className={`${sectionBg('blue')} border rounded-xl p-4`}>
                        <h3 className={`${sectionTitle('blue')} font-semibold mb-4 flex items-center gap-2`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Timeline Milestones
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                                <div key={num} className={`${isAr ? 'bg-amber-600/10 border-amber-600/20' : 'bg-blue-600/10 border-blue-600/20'} border rounded-lg p-3`}>
                                    <h4 className={`${isAr ? 'text-amber-300' : 'text-blue-300'} font-medium mb-3`}>Milestone {num}</h4>
                                    <div className="space-y-2">
                                        {renderInput('Year', `milestone${num}-year`, '2010', '2010', 'blue')}
                                        {renderTextarea('Description', `milestone${num}-title`, 'Milestone description...', 'وصف الإنجاز...', 3, 'blue')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className={`${sectionBg('orange')} border rounded-xl p-4`}>
                        <h3 className={`${sectionTitle('orange')} font-semibold mb-4 flex items-center gap-2`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Call to Action Section
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {renderInput('Title', 'cta-title', 'The Journey Continues', 'المسيرة مستمرة', 'orange')}
                                {renderTextarea('Description', 'cta-description', 'Join us as we shape the future...', 'انضم إلينا ونحن نشكل مستقبل حلول التعبئة الصناعية...', 2, 'orange')}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {renderInput('Button 1 Text', 'cta-button1-text', 'Partner With Us →', 'كن شريكنا ←', 'orange')}
                                {renderInput('Button 2 Text', 'cta-button2-text', 'Learn About PAFT', 'تعرف على بافت', 'orange')}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Update Our Journey Page'}
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