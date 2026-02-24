'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { contentApi } from '@/lib/api';

type InnovativeSolutionsContent = {
    [key: string]: {
        value: string;
        valueAr?: string;
        id: number;
    };
};

interface InnovativeSolutionsEditorProps {
    onClose: () => void;
    onSave?: () => void;
}

export default function InnovativeSolutionsEditor({ onClose, onSave }: InnovativeSolutionsEditorProps) {
    const { token } = useAuth();
    const [content, setContent] = useState<InnovativeSolutionsContent>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');

    const isAr = activeTab === 'ar';

    const fetchContent = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await contentApi.getPageContent('innovative-solutions');
            const flattenedContent: InnovativeSolutionsContent = {};

            Object.keys(data).forEach(section => {
                if (data[section]) {
                    Object.keys(data[section]).forEach(key => {
                        const uniqueKey = `${section}-${key}`;
                        flattenedContent[uniqueKey] = data[section][key];
                    });
                }
            });

            setContent(flattenedContent);
        } catch (err: unknown) {
            console.error('Failed to fetch content', err);
            setError('Failed to load content');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!token) return;
        setSaving(true);
        setError('');
        setSuccessMsg('');

        try {
            const freshData = await contentApi.getPageContent('innovative-solutions');
            const updates: { id: number; value: string; valueAr?: string }[] = [];

            Object.keys(content).forEach(uniqueKey => {
                Object.keys(freshData).forEach(section => {
                    Object.keys(freshData[section]).forEach(key => {
                        if (`${section}-${key}` === uniqueKey) {
                            const update: { id: number; value: string; valueAr?: string } = {
                                id: freshData[section][key].id,
                                value: content[uniqueKey].value
                            };
                            if (content[uniqueKey].valueAr !== undefined) {
                                update.valueAr = content[uniqueKey].valueAr || '';
                            }
                            updates.push(update);
                        }
                    });
                });
            });

            if (updates.length > 0) {
                await contentApi.bulkUpdate(updates, token);
                setSuccessMsg('Content updated successfully!');
                setTimeout(() => {
                    if (onSave) onSave(); else onClose();
                }, 800);
            } else {
                if (onSave) onSave(); else onClose();
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to save content';
            setError(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key: string, value: string) => {
        if (isAr) {
            setContent(prev => ({
                ...prev,
                [key]: { ...prev[key], valueAr: value }
            }));
        } else {
            setContent(prev => ({
                ...prev,
                [key]: { ...prev[key], value }
            }));
        }
    };

    const getValue = (key: string) => {
        if (isAr) return content[key]?.valueAr || '';
        return content[key]?.value || '';
    };

    // Render helper functions (NOT components — avoids remount/focus-loss on each keystroke)
    const renderInput = (label: string, fieldKey: string, placeholder: string = '', placeholderAr: string = '') => (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                {label} {isAr && <span className="text-amber-400 text-xs">(عربي)</span>}
            </label>
            <input
                value={getValue(fieldKey)}
                onChange={(e) => handleChange(fieldKey, e.target.value)}
                placeholder={isAr ? placeholderAr : placeholder}
                dir={isAr ? 'rtl' : 'ltr'}
                className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none transition-all ${isAr
                    ? 'border-amber-500/20 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50'
                    : 'border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50'
                    }`}
            />
        </div>
    );

    const renderTextarea = (label: string, fieldKey: string, rows: number = 3, placeholder: string = '', placeholderAr: string = '') => (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                {label} {isAr && <span className="text-amber-400 text-xs">(عربي)</span>}
            </label>
            <textarea
                rows={rows}
                value={getValue(fieldKey)}
                onChange={(e) => handleChange(fieldKey, e.target.value)}
                placeholder={isAr ? placeholderAr : placeholder}
                dir={isAr ? 'rtl' : 'ltr'}
                className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none transition-all resize-y ${isAr
                    ? 'border-amber-500/20 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50'
                    : 'border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50'
                    }`}
            />
        </div>
    );

    if (loading) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#151b2e] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-[#151b2e] border-b border-white/5 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-lg font-bold text-white">Edit Innovative Solutions</h2>
                    <div className="flex items-center gap-3">
                        {/* Language Tabs */}
                        <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl">
                            <button
                                type="button"
                                onClick={() => setActiveTab('en')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'en'
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                🇬🇧 English
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('ar')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'ar'
                                    ? 'bg-amber-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                🇸🇦 العربية
                            </button>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSave} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {successMsg && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm">
                            {successMsg}
                        </div>
                    )}

                    {/* Active language indicator */}
                    {isAr && (
                        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                            <span>🇸🇦</span>
                            <span>أنت تقوم بتعديل المحتوى العربي — You are editing Arabic content</span>
                        </div>
                    )}

                    {/* ─── 1. Hero Section ─── */}
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                        <h3 className="text-blue-400 font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Hero Section
                        </h3>
                        <div className="space-y-4">
                            {renderInput('Title Line 1', 'hero-title-line1', 'WE BRING', 'نحن نقدم')}
                            {renderInput('Title Highlight', 'hero-title-highlight', 'INNOVATION', 'الابتكار')}
                            {renderInput('Title Line 2', 'hero-title-line2', 'TO SUPPLY CHAIN', 'لسلسلة التوريد')}
                        </div>
                    </div>

                    {/* ─── 2. Smart Pallets Section ─── */}
                    <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4">
                        <h3 className="text-cyan-400 font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                            Smart Pallets Section
                        </h3>
                        <div className="space-y-4">
                            {renderInput('Badge Text', 'smart-pallets-badge', 'Smart Plastic Pallets', 'البالتات البلاستيكية الذكية')}
                            <div className="grid grid-cols-2 gap-4">
                                {renderInput('Title (Plain)', 'smart-pallets-title-plain', 'Intelligent', 'أصول لوجستية')}
                                {renderInput('Title (Highlight)', 'smart-pallets-title-highlight', 'Logistics Assets', 'ذكية')}
                            </div>
                            {renderTextarea('Description', 'smart-pallets-description', 4)}
                            {renderInput('Features (comma-separated)', 'smart-pallets-features', 'Full Life Traceability,RFID-Enabled,...', 'تتبع دورة الحياة الكاملة,تقنية RFID,...')}
                        </div>
                    </div>

                    {/* ─── 3. RFID Technology Section ─── */}
                    <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4">
                        <h3 className="text-indigo-400 font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                            RFID Technology Section
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {renderInput('Title (Plain)', 'rfid-tech-title-plain', 'RFID Technology', 'تقنية RFID')}
                                {renderInput('Title (Highlight)', 'rfid-tech-title-highlight', 'Integration', 'والتكامل')}
                            </div>
                            {renderInput('Subtitle', 'rfid-tech-subtitle')}

                            {[1, 2, 3].map(n => (
                                <div key={n} className="bg-indigo-500/10 border border-indigo-500/15 rounded-lg p-4">
                                    <h4 className="text-indigo-300 font-medium mb-3">Card {n}</h4>
                                    <div className="space-y-3">
                                        {renderInput('Title', `rfid-tech-card-${n}-title`)}
                                        {renderTextarea('Description', `rfid-tech-card-${n}-desc`, 2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ─── 4. Process Flow Section ─── */}
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                        <h3 className="text-emerald-400 font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            Process Flow Section
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {renderInput('Title (Plain)', 'process-flow-title-plain', 'How PAFT iWMS', 'كيف يعمل PAFT iWMS')}
                                {renderInput('Title (Highlight)', 'process-flow-title-highlight', 'Works', 'يعمل')}
                            </div>
                            {renderInput('Subtitle', 'process-flow-subtitle')}

                            {[1, 2, 3, 4, 5].map(n => (
                                <div key={n} className="bg-emerald-500/10 border border-emerald-500/15 rounded-lg p-4">
                                    <h4 className="text-emerald-300 font-medium mb-3">Step {n}</h4>
                                    <div className="space-y-3">
                                        {renderInput('Title', `process-flow-step-${n}-title`)}
                                        {renderInput('Description', `process-flow-step-${n}-desc`)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ─── 5. Business Impact Section ─── */}
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                        <h3 className="text-amber-400 font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            Business Impact Section
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {renderInput('Title (Plain)', 'business-impact-title-plain', 'Business', 'التأثير')}
                                {renderInput('Title (Highlight)', 'business-impact-title-highlight', 'Impact', 'التجاري')}
                            </div>
                            {renderTextarea('Description', 'business-impact-description', 3)}

                            <div className="grid grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map(n => (
                                    <div key={n} className="bg-amber-500/10 border border-amber-500/15 rounded-lg p-3">
                                        <h4 className="text-amber-300 font-medium mb-2 text-sm">Stat {n}</h4>
                                        <div className="space-y-2">
                                            {renderInput('Value', `business-impact-stat-${n}-value`)}
                                            {renderInput('Label', `business-impact-stat-${n}-label`)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ─── 6. RFID Understanding Section ─── */}
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                        <h3 className="text-blue-400 font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0" /></svg>
                            RFID Understanding Section
                        </h3>
                        <div className="space-y-4">
                            {renderInput('Badge Text', 'rfid-understanding-badge', 'Understanding RFID', 'فهم تقنية RFID')}
                            <div className="grid grid-cols-2 gap-4">
                                {renderInput('Title (Plain)', 'rfid-understanding-title-plain', 'Radio Frequency', 'تحديد الهوية')}
                                {renderInput('Title (Highlight)', 'rfid-understanding-title-highlight', 'Identification', 'بالترددات الراديوية')}
                            </div>
                            {renderTextarea('Paragraph 1', 'rfid-understanding-paragraph-1', 4)}
                            {renderTextarea('Paragraph 2', 'rfid-understanding-paragraph-2', 4)}
                        </div>
                    </div>

                    {/* ─── 7. Challenges Section ─── */}
                    <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
                        <h3 className="text-purple-400 font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            Challenges &amp; Considerations
                        </h3>
                        <div className="space-y-4">
                            {renderInput('Badge Text', 'challenges-badge', 'Challenges & Considerations', 'التحديات والاعتبارات')}
                            <div className="grid grid-cols-2 gap-4">
                                {renderInput('Title (Plain)', 'challenges-title-plain', 'Implementation', 'نجاح')}
                                {renderInput('Title (Highlight)', 'challenges-title-highlight', 'Success', 'التطبيق')}
                            </div>
                            {renderTextarea('Paragraph 1', 'challenges-paragraph-1', 3)}
                            {renderTextarea('Paragraph 2', 'challenges-paragraph-2', 3)}
                            {renderTextarea('Quote', 'challenges-quote', 2)}
                        </div>
                    </div>

                    {/* ─── 8. Conclusion / CTA Section ─── */}
                    <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-4">
                        <h3 className="text-teal-400 font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                            Conclusion / CTA Section
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {renderInput('Title (Plain)', 'conclusion-title-plain', 'Transform Your', 'حوّل')}
                                {renderInput('Title (Highlight)', 'conclusion-title-highlight', 'Operations', 'عملياتك')}
                            </div>
                            {renderTextarea('Paragraph 1', 'conclusion-paragraph-1', 3)}
                            {renderTextarea('Paragraph 2', 'conclusion-paragraph-2', 3)}
                            <div className="grid grid-cols-2 gap-4">
                                {renderInput('Primary CTA Text', 'conclusion-cta-primary', 'Request a Demo →', 'اطلب عرضًا توضيحيًا ←')}
                                {renderInput('Secondary CTA Text', 'conclusion-cta-secondary', 'Explore Products', 'استكشف المنتجات')}
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
                            {saving ? 'Saving...' : 'Update Page'}
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
            </div >
        </div >
    );
}
