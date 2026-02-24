'use client';

import { useState, useEffect } from 'react';

interface ContactPageEditorProps {
    content: { [key: string]: { value: string; valueAr?: string; id: number } };
    onSave: (content: { [key: string]: string }, contentAr?: { [key: string]: string }) => Promise<void>;
    onClose: () => void;
    saving: boolean;
}

export default function ContactPageEditor({ content, onSave, onClose, saving }: ContactPageEditorProps) {
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

    const renderInput = (label: string, key: string, placeholder: string, placeholderAr: string, focusColor = 'blue') => (
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
                    <h2 className="text-lg font-bold text-white">Edit Contact Page</h2>
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
                    <div className={`${sectionBg('cyan')} border rounded-xl p-4`}>
                        <h3 className={`${sectionTitle('cyan')} font-semibold mb-4 flex items-center gap-2`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            Hero Section
                        </h3>
                        <div className="space-y-4">
                            {renderInput('Badge Text', 'badge', 'Contact', 'تواصل معنا', 'cyan')}
                            {renderInput('Main Title', 'title', "We'd Love to Hear From You", 'يسعدنا سماع رأيك', 'cyan')}
                            {renderTextarea('Description', 'description', 'PAFT is a trusted supplier...', 'PAFT هي مورد موثوق...', 3, 'cyan')}
                        </div>
                    </div>

                    {/* Contact Cards */}
                    <div className={`${sectionBg('blue')} border rounded-xl p-4`}>
                        <h3 className={`${sectionTitle('blue')} font-semibold mb-4 flex items-center gap-2`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Contact Info Cards
                        </h3>
                        <div className="space-y-4">
                            {/* Card 1 - Visit Us */}
                            <div className="bg-white/5 rounded-lg p-3 space-y-3">
                                <h4 className={`${isAr ? 'text-amber-300' : 'text-blue-300'} text-sm font-medium`}>📍 Visit Us Card</h4>
                                {renderInput('Title', 'contact-cards-card-1-title', 'Visit Us', 'زورونا', 'blue')}
                                {renderInput('Address Line 1', 'contact-cards-card-1-line-1', 'T 29, IDG, Industrial Square Area E2,', 'T 29، IDG، المنطقة الصناعية المربعة E2،', 'blue')}
                                {renderInput('Address Line 2', 'contact-cards-card-1-line-2', 'October 6th Industrial Area Zone 4.', 'المنطقة الصناعية السادس من أكتوبر المنطقة 4.', 'blue')}
                                {renderInput('Address Line 3', 'contact-cards-card-1-line-3', 'Giza, Egypt.', 'الجيزة، مصر.', 'blue')}
                            </div>
                            {/* Card 2 - Call Us */}
                            <div className="bg-white/5 rounded-lg p-3 space-y-3">
                                <h4 className={`${isAr ? 'text-amber-300' : 'text-blue-300'} text-sm font-medium`}>📞 Call Us Card</h4>
                                {renderInput('Title', 'contact-cards-card-2-title', 'Call Us', 'اتصل بنا', 'blue')}
                                {renderInput('Phone Number', 'contact-cards-card-2-line-1', '+201022239770', '+201022239770', 'blue')}
                                {renderInput('Subtitle', 'contact-cards-card-2-line-2', 'Sales Unit Manager', 'مدير وحدة المبيعات', 'blue')}
                            </div>
                            {/* Card 3 - Email Us */}
                            <div className="bg-white/5 rounded-lg p-3 space-y-3">
                                <h4 className={`${isAr ? 'text-amber-300' : 'text-blue-300'} text-sm font-medium`}>📧 Email Us Card</h4>
                                {renderInput('Title', 'contact-cards-card-3-title', 'Email Us', 'راسلنا', 'blue')}
                                {renderInput('Email Address', 'contact-cards-card-3-line-1', 'info@paft.net', 'info@paft.net', 'blue')}
                            </div>
                        </div>
                    </div>

                    {/* Social Networks */}
                    <div className={`${sectionBg('purple')} border rounded-xl p-4`}>
                        <h3 className={`${sectionTitle('purple')} font-semibold mb-4 flex items-center gap-2`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                            </svg>
                            Social Networks
                        </h3>
                        <div className="space-y-3">
                            {renderInput('Section Title', 'social-title', 'Social Networks', 'شبكات التواصل الاجتماعي', 'purple')}
                            {renderInput('Facebook Label', 'social-facebook-label', 'Follow PAFT on Facebook', 'تابع PAFT على فيسبوك', 'purple')}
                            {renderInput('Facebook URL', 'social-facebook-url', 'https://web.facebook.com/...', 'https://web.facebook.com/...', 'purple')}
                            {renderInput('LinkedIn Label', 'social-linkedin-label', 'Follow PAFT on LinkedIn', 'تابع PAFT على لينكدإن', 'purple')}
                            {renderInput('LinkedIn URL', 'social-linkedin-url', 'https://www.linkedin.com/...', 'https://www.linkedin.com/...', 'purple')}
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className={`${sectionBg('green')} border rounded-xl p-4`}>
                        <h3 className={`${sectionTitle('green')} font-semibold mb-4 flex items-center gap-2`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Contact Form
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {renderInput('Form Title', 'form-title', 'Send Us a', 'أرسل لنا', 'green')}
                                {renderInput('Title Highlight', 'form-title-highlight', 'Message', 'رسالة', 'green')}
                            </div>
                            {renderInput('Subtitle', 'form-subtitle', 'Fill in the details below...', 'املأ البيانات أدناه...', 'green')}
                            <div className="grid grid-cols-2 gap-4">
                                {renderInput('First Name Label', 'form-first-name', 'First Name', 'الاسم الأول', 'green')}
                                {renderInput('Last Name Label', 'form-last-name', 'Last Name', 'الاسم الأخير', 'green')}
                            </div>
                            {renderInput('Email Label', 'form-email', 'Email', 'البريد الإلكتروني', 'green')}
                            {renderInput('Message Label', 'form-message-label', 'Comment or Message', 'تعليق أو رسالة', 'green')}
                            <div className="grid grid-cols-2 gap-4">
                                {renderInput('Placeholder: First Name', 'form-placeholder-first', 'John', 'أحمد', 'green')}
                                {renderInput('Placeholder: Last Name', 'form-placeholder-last', 'Doe', 'محمد', 'green')}
                            </div>
                            {renderInput('Placeholder: Email', 'form-placeholder-email', 'john@company.com', 'ahmed@company.com', 'green')}
                            {renderInput('Placeholder: Message', 'form-placeholder-message', 'Tell us about your requirements...', 'أخبرنا عن متطلباتك...', 'green')}
                            <div className="grid grid-cols-2 gap-4">
                                {renderInput('Submit Button', 'form-submit', 'Submit', 'إرسال', 'green')}
                                {renderInput('Sending Text', 'form-sending', 'Sending…', 'جاري الإرسال...', 'green')}
                            </div>
                            {renderInput('Success Title', 'form-success-title', 'Message Sent!', 'تم إرسال الرسالة!', 'green')}
                            {renderInput('Success Description', 'form-success-description', "Thank you for reaching out...", 'شكراً لتواصلك...', 'green')}
                            {renderInput('Success Button', 'form-success-button', 'Send Another Message', 'إرسال رسالة أخرى', 'green')}
                        </div>
                    </div>

                    {/* Quick Response */}
                    <div className={`${sectionBg('orange')} border rounded-xl p-4`}>
                        <h3 className={`${sectionTitle('orange')} font-semibold mb-4 flex items-center gap-2`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Quick Response Section
                        </h3>
                        <div className="space-y-3">
                            {renderInput('Title', 'quick-response-title', 'Quick Response Guarantee', 'ضمان الرد السريع', 'orange')}
                            {renderTextarea('Description', 'quick-response-description', 'We respond to all inquiries within 24 hours...', 'نرد على جميع الاستفسارات خلال 24 ساعة...', 2, 'orange')}
                            {renderInput('Feature 1', 'quick-response-item-1', 'Free quotes and consultations', 'عروض أسعار واستشارات مجانية', 'orange')}
                            {renderInput('Feature 2', 'quick-response-item-2', 'Custom solutions available', 'حلول مخصصة متاحة', 'orange')}
                            {renderInput('Feature 3', 'quick-response-item-3', 'Bulk order discounts', 'خصومات على الطلبات الكبيرة', 'orange')}
                            {renderInput('Feature 4', 'quick-response-item-4', 'Fast delivery nationwide', 'توصيل سريع لجميع أنحاء البلاد', 'orange')}
                        </div>
                    </div>

                    {/* Business Hours */}
                    <div className={`${sectionBg('yellow')} border rounded-xl p-4`}>
                        <h3 className={`${sectionTitle('yellow')} font-semibold mb-4 flex items-center gap-2`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Business Hours
                        </h3>
                        <div className="space-y-3">
                            {renderInput('Section Title', 'business-hours-title', 'Business Hours', 'ساعات العمل', 'yellow')}
                            <div className="grid grid-cols-2 gap-4">
                                {renderInput('Weekdays Label', 'business-hours-weekdays', 'Sunday – Thursday', 'الأحد – الخميس', 'yellow')}
                                {renderInput('Weekday Hours', 'business-hours-weekday-time', '9:00 AM – 6:00 PM', '9:00 صباحاً – 6:00 مساءً', 'yellow')}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {renderInput('Weekend Label', 'business-hours-weekend', 'Friday – Saturday', 'الجمعة – السبت', 'yellow')}
                                {renderInput('Weekend Status', 'business-hours-weekend-status', 'Closed', 'مغلق', 'yellow')}
                            </div>
                        </div>
                    </div>

                    {/* Validation Messages */}
                    <div className={`${sectionBg('red')} border rounded-xl p-4`}>
                        <h3 className={`${sectionTitle('red')} font-semibold mb-4 flex items-center gap-2`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            Validation Messages
                        </h3>
                        <div className="space-y-3">
                            {renderInput('First Name Required', 'validation-first-name', 'First name is required', 'الاسم الأول مطلوب', 'red')}
                            {renderInput('Last Name Required', 'validation-last-name', 'Last name is required', 'الاسم الأخير مطلوب', 'red')}
                            {renderInput('Email Required', 'validation-email-required', 'Email is required', 'البريد الإلكتروني مطلوب', 'red')}
                            {renderInput('Email Invalid', 'validation-email-invalid', 'Enter a valid email address', 'أدخل عنوان بريد إلكتروني صحيح', 'red')}
                            {renderInput('Message Required', 'validation-message', 'Message is required', 'الرسالة مطلوبة', 'red')}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Update Contact Page'}
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
