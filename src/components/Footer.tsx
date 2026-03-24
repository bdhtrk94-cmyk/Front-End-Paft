'use client';

import Link from 'next/link';
import { COMPANY_INFO } from '@/lib/constants';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
    const { user } = useAuth();
    const { language, layoutContent } = useLanguage();
    const isAr = language === 'ar';

    // Helper — same pattern as Header
    const f = (key: string, fallback: string) => {
        const item = layoutContent[key];
        if (!item) return fallback;
        return isAr && item.valueAr ? item.valueAr : item.value || fallback;
    };

    const quickLinks = [
        { href: '/products/plastic-pallets', label: f('footer-link-products', isAr ? 'المنتجات' : 'Products') },
        { href: '/about', label: f('footer-link-about', isAr ? 'من نحن' : 'About Us') },
        { href: '/contact', label: f('footer-link-contact', isAr ? 'تواصل معنا' : 'Contact') },
        { href: '/shop', label: f('footer-link-shop', isAr ? 'المتجر' : 'Shop') },
        ...(user ? [{ href: '/admin', label: f('footer-link-admin', isAr ? 'الإدارة' : 'Admin') }] : []),
    ];

    const contactItems = [
        {
            icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
            label: f('footer-contact-email', COMPANY_INFO.contact.email),
            href: `mailto:${COMPANY_INFO.contact.email}`,
        },
        {
            icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
            label: f('footer-contact-phone', COMPANY_INFO.contact.phone),
            href: `tel:${COMPANY_INFO.contact.phone}`,
        },
        {
            icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
            label: f('footer-contact-address', isAr ? '123 المنطقة الصناعية، حي التصنيع، القاهرة، مصر' : COMPANY_INFO.contact.address),
            href: '#',
        },
    ];

    const socialLinks = [
        {
            href: COMPANY_INFO.social.linkedin,
            label: 'LinkedIn',
            icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
        },
        {
            href: COMPANY_INFO.social.facebook,
            label: 'Facebook',
            icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
        },
    ];

    return (
        <footer
            className="relative overflow-hidden"
            dir={isAr ? 'rtl' : 'ltr'}
            style={{
                background: 'var(--footer-bg)',
                color: 'var(--footer-text)',
            }}
        >
            {/* Animated gradient top border */}
            <div
                className="h-1 w-full"
                style={{
                    backgroundImage: 'linear-gradient(90deg, #06B6D4, #2563EB, #7C3AED, #06B6D4)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmerBorder 4s linear infinite',
                }}
            />

            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-5"
                    style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)' }} />
                <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-5"
                    style={{ background: 'radial-gradient(circle, #2563EB 0%, transparent 70%)' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-[0.03]"
                    style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }} />
            </div>

            {/* ── Main Footer Content ── */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

                    {/* ── Column 1: Brand ── */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="inline-flex items-center group mb-5">
                            <img
                                src="/paft-logo.png"
                                alt="PAFT Logo"
                                className="h-12 w-auto transition-transform duration-500 group-hover:scale-105"
                            />
                        </Link>
                        <p
                            className="leading-relaxed text-sm mb-6"
                            style={{ color: 'var(--footer-text-muted)', lineHeight: '1.8' }}
                        >
                            {f('footer-brand-description', isAr
                                ? 'الشركة الرائدة في تصنيع البالتات البلاستيكية الفاخرة في مصر، ملتزمة بالجودة والاستدامة والابتكار في حلول اللوجستيات.'
                                : COMPANY_INFO.description
                            )}
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map(({ href, label, icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 hover:scale-110 hover:-translate-y-0.5"
                                    style={{
                                        background: 'var(--footer-social-bg)',
                                        color: 'var(--footer-social-icon)',
                                        border: '1px solid var(--footer-social-border)',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = 'linear-gradient(135deg,#06B6D4,#2563EB)';
                                        e.currentTarget.style.color = '#fff';
                                        e.currentTarget.style.borderColor = 'transparent';
                                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(6, 182, 212, 0.3)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = 'var(--footer-social-bg)';
                                        e.currentTarget.style.color = 'var(--footer-social-icon)';
                                        e.currentTarget.style.borderColor = 'var(--footer-social-border)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                    aria-label={label}
                                >
                                    <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d={icon} />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* ── Column 2: Quick Links ── */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #06B6D4, #2563EB)' }} />
                            <h4
                                className="text-sm font-bold uppercase tracking-widest"
                                style={{ color: 'var(--footer-heading)', letterSpacing: '0.15em' }}
                            >
                                {f('footer-quick-links-title', isAr ? 'روابط سريعة' : 'Quick Links')}
                            </h4>
                        </div>
                        <ul className="space-y-3">
                            {quickLinks.map(({ href, label }) => (
                                <li key={href}>
                                    <a
                                        href={href}
                                        className="flex items-center gap-2.5 text-sm transition-all duration-500 group"
                                        style={{ color: 'var(--footer-text-muted)' }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.color = 'var(--footer-link-hover)';
                                            const arrow = e.currentTarget.querySelector('.link-arrow') as HTMLElement;
                                            if (arrow) {
                                                arrow.style.transform = isAr ? 'translateX(-4px) rotate(180deg)' : 'translateX(4px)';
                                                arrow.style.color = 'var(--footer-link-hover)';
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.color = 'var(--footer-text-muted)';
                                            const arrow = e.currentTarget.querySelector('.link-arrow') as HTMLElement;
                                            if (arrow) {
                                                arrow.style.transform = isAr ? 'rotate(180deg)' : 'none';
                                                arrow.style.color = 'var(--footer-text-muted)';
                                            }
                                        }}
                                    >
                                        <svg className="link-arrow w-3.5 h-3.5 flex-shrink-0 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                            style={{ transform: isAr ? 'rotate(180deg)' : 'none' }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Column 3: Contact Info ── */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #2563EB, #7C3AED)' }} />
                            <h4
                                className="text-sm font-bold uppercase tracking-widest"
                                style={{ color: 'var(--footer-heading)', letterSpacing: '0.15em' }}
                            >
                                {f('footer-contact-info-title', isAr ? 'معلومات التواصل' : 'Contact Info')}
                            </h4>
                        </div>
                        <ul className="space-y-4">
                            {contactItems.map(({ icon, label, href }, idx) => (
                                <li key={idx}>
                                    <a
                                        href={href}
                                        className="flex items-start gap-3 text-sm transition-all duration-500 group"
                                        style={{ color: 'var(--footer-text-muted)' }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.color = 'var(--footer-link-hover)';
                                            const iconBox = e.currentTarget.querySelector('.contact-icon') as HTMLElement;
                                            if (iconBox) {
                                                iconBox.style.background = 'linear-gradient(135deg,#06B6D4,#2563EB)';
                                                iconBox.style.color = '#fff';
                                                iconBox.style.borderColor = 'transparent';
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.color = 'var(--footer-text-muted)';
                                            const iconBox = e.currentTarget.querySelector('.contact-icon') as HTMLElement;
                                            if (iconBox) {
                                                iconBox.style.background = 'var(--footer-icon-bg)';
                                                iconBox.style.color = 'var(--footer-link-hover)';
                                                iconBox.style.borderColor = 'var(--footer-icon-border)';
                                            }
                                        }}
                                    >
                                        <div
                                            className="contact-icon w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-500"
                                            style={{
                                                background: 'var(--footer-icon-bg)',
                                                border: '1px solid var(--footer-icon-border)',
                                                color: 'var(--footer-link-hover)',
                                            }}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                                            </svg>
                                        </div>
                                        <span className="flex-1 leading-relaxed pt-1.5">{label}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Column 4: CTA / Newsletter ── */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #7C3AED, #EC4899)' }} />
                            <h4
                                className="text-sm font-bold uppercase tracking-widest"
                                style={{ color: 'var(--footer-heading)', letterSpacing: '0.15em' }}
                            >
                                {f('footer-business-hours-title', isAr ? 'ساعات العمل' : 'Business Hours')}
                            </h4>
                        </div>

                        {/* Business Hours */}
                        <div
                            className="rounded-xl p-4 mb-5"
                            style={{
                                background: 'var(--footer-cta-bg)',
                                border: '1px solid var(--footer-cta-border)',
                            }}
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--footer-link-hover)' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-xs font-semibold" style={{ color: 'var(--footer-heading)' }}>
                                    {isAr ? 'أوقات الدوام' : 'Working Hours'}
                                </span>
                            </div>
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--footer-text-muted)', lineHeight: '1.8' }}>
                                {f('footer-business-hours', isAr ? 'الأحد - الخميس: 9:00 ص - 6:00 م' : COMPANY_INFO.contact.businessHours)}
                            </p>
                        </div>

                        {/* CTA Box */}
                        <div
                            className="rounded-xl p-4 text-center"
                            style={{
                                background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(37,99,235,0.1))',
                                border: '1px solid var(--footer-cta-border)',
                            }}
                        >
                            <p className="text-sm font-medium mb-3" style={{ color: 'var(--footer-heading)' }}>
                                {f('footer-cta-text', isAr ? 'هل أنت مستعد للبدء؟' : 'Ready to get started?')}
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-500 hover:shadow-lg hover:-translate-y-0.5"
                                style={{
                                    background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                    boxShadow: '0 4px 15px rgba(6, 182, 212, 0.25)',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(6, 182, 212, 0.4)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(6, 182, 212, 0.25)';
                                }}
                            >
                                {f('footer-cta-link', isAr ? 'تواصل معنا' : 'Contact Us')}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    style={{ transform: isAr ? 'rotate(180deg)' : 'none' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── Bottom Bar ── */}
                <div
                    className="mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
                    style={{ borderTop: '1px solid var(--footer-bottom-border)' }}
                >
                    <p className="text-xs" style={{ color: 'var(--footer-text-muted)' }}>
                        {f('footer-copyright', isAr
                            ? `© ${new Date().getFullYear()} PAFT للبالتات البلاستيكية. جميع الحقوق محفوظة.`
                            : `© ${new Date().getFullYear()} PAFT Plastic Pallets. All rights reserved.`
                        )}
                    </p>
                    <div className="flex items-center gap-4">
                        <a
                            href="#"
                            className="text-xs transition-colors duration-500"
                            style={{ color: 'var(--footer-text-muted)' }}
                            onMouseEnter={e => { e.currentTarget.style.color = 'var(--footer-link-hover)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--footer-text-muted)'; }}
                        >
                            {f('footer-privacy-policy', isAr ? 'سياسة الخصوصية' : 'Privacy Policy')}
                        </a>
                        <span style={{ color: 'var(--footer-bottom-separator)' }}>·</span>
                        <a
                            href="#"
                            className="text-xs transition-colors duration-500"
                            style={{ color: 'var(--footer-text-muted)' }}
                            onMouseEnter={e => { e.currentTarget.style.color = 'var(--footer-link-hover)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--footer-text-muted)'; }}
                        >
                            {f('footer-terms-of-service', isAr ? 'شروط الخدمة' : 'Terms of Service')}
                        </a>
                    </div>
                </div>
            </div>

            {/* Shimmer animation for the top border */}
            <style jsx>{`
                @keyframes shimmerBorder {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 200% 50%; }
                }
            `}</style>
        </footer>
    );
}
