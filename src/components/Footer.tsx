'use client';

import Link from 'next/link';
import { COMPANY_INFO } from '@/lib/constants';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { contentApi } from '@/lib/api';
import { useState, useEffect } from 'react';

export default function Footer() {
    const { user } = useAuth();
    const { language } = useLanguage();
    const isAr = language === 'ar';

    const [footerContent, setFooterContent] = useState<{ [key: string]: { value: string; valueAr?: string } }>({});

    useEffect(() => {
        contentApi.getPageContent('layout').then(data => {
            const flat: { [key: string]: { value: string; valueAr?: string } } = {};
            Object.keys(data).forEach(section => {
                Object.keys(data[section]).forEach(key => {
                    flat[`${section}-${key}`] = data[section][key];
                });
            });
            setFooterContent(flat);
        }).catch(() => {/* fallback to constants */ });
    }, []);

    // Helper — same pattern as Header
    const f = (key: string, fallback: string) => {
        const item = footerContent[key];
        if (!item) return fallback;
        return isAr && item.valueAr ? item.valueAr : item.value || fallback;
    };

    return (
        <footer
            className="relative overflow-hidden"
            dir={isAr ? 'rtl' : 'ltr'}
            style={{
                background: 'var(--footer-bg)',
                color: 'var(--footer-text)',
            }}
        >
            {/* Gradient top border */}
            <div
                className="h-1 w-full"
                style={{
                    backgroundImage: 'linear-gradient(90deg, #06B6D4, #2563EB, #7C3AED)',
                }}
            />

            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-5"
                    style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)' }} />
                <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-5"
                    style={{ background: 'radial-gradient(circle, #2563EB 0%, transparent 70%)' }} />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                    {/* ── Brand Column ── */}
                    <div className="md:col-span-1">
                        <Link href="/" className="inline-flex items-center group mb-6">
                            <img
                                src="/paft-logo.png"
                                alt="PAFT Logo"
                                className="h-12 w-auto transition-transform duration-500 group-hover:scale-105"
                            />
                        </Link>
                        <p
                            className="leading-relaxed text-sm mb-6"
                            style={{ color: 'var(--footer-text-muted)' }}
                        >
                            {f('footer-brand-description', COMPANY_INFO.description)}
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {[
                                { href: '#', label: 'LinkedIn', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
                                { href: '#', label: 'Facebook', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                            ].map(({ href, label, icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-500 hover:scale-110"
                                    style={{
                                        background: 'var(--footer-social-bg)',
                                        color: 'var(--footer-social-icon)',
                                        border: '1px solid var(--footer-social-border)',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = 'linear-gradient(135deg,#06B6D4,#2563EB)';
                                        e.currentTarget.style.color = '#fff';
                                        e.currentTarget.style.borderColor = 'transparent';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = 'var(--footer-social-bg)';
                                        e.currentTarget.style.color = 'var(--footer-social-icon)';
                                        e.currentTarget.style.borderColor = 'var(--footer-social-border)';
                                    }}
                                    aria-label={label}
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d={icon} />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* ── Quick Links ── */}
                    <div>
                        <h4
                            className="text-sm font-bold uppercase tracking-wider mb-6"
                            style={{ color: 'var(--footer-heading)' }}
                        >
                            {f('footer-quick-links-title', 'Quick Links')}
                        </h4>
                        <ul className="space-y-3">
                            {[
                                { href: '/products/plastic-pallets', label: f('footer-link-products', 'Products') },
                                { href: '/about', label: f('footer-link-about', 'About Us') },
                                { href: '/contact', label: f('footer-link-contact', 'Contact') },
                                { href: '/shop', label: f('footer-link-shop', 'Shop') },
                                ...(user ? [{ href: '/admin', label: f('footer-link-admin', 'Admin') }] : []),
                            ].map(({ href, label }) => (
                                <li key={href}>
                                    <a
                                        href={href}
                                        className="flex items-center gap-2 text-sm transition-all duration-500 group"
                                        style={{ color: 'var(--footer-text-muted)' }}
                                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--footer-link-hover)'; e.currentTarget.style.paddingLeft = isAr ? '0' : '4px'; e.currentTarget.style.paddingRight = isAr ? '4px' : '0'; }}
                                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--footer-text-muted)'; e.currentTarget.style.paddingLeft = '0'; e.currentTarget.style.paddingRight = '0'; }}
                                    >
                                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                            style={{ transform: isAr ? 'rotate(180deg)' : 'none' }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Contact Info ── */}
                    <div>
                        <h4
                            className="text-sm font-bold uppercase tracking-wider mb-6"
                            style={{ color: 'var(--footer-heading)' }}
                        >
                            {f('footer-contact-info-title', 'Contact Info')}
                        </h4>
                        <ul className="space-y-4">
                            {[
                                {
                                    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
                                    label: COMPANY_INFO.contact.email,
                                    href: `mailto:${COMPANY_INFO.contact.email}`,
                                },
                                {
                                    icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
                                    label: COMPANY_INFO.contact.phone,
                                    href: `tel:${COMPANY_INFO.contact.phone}`,
                                },
                                {
                                    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
                                    label: COMPANY_INFO.contact.address,
                                    href: '#',
                                },
                            ].map(({ icon, label, href }) => (
                                <li key={label}>
                                    <a
                                        href={href}
                                        className="flex items-start gap-3 text-sm transition-colors duration-500"
                                        style={{ color: 'var(--footer-text-muted)' }}
                                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--footer-link-hover)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--footer-text-muted)'; }}
                                    >
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                                            style={{ background: 'var(--footer-icon-bg)', border: '1px solid var(--footer-icon-border)' }}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                                            </svg>
                                        </div>
                                        <span className="flex-1">{label}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* ── Bottom Bar ── */}
                <div
                    className="mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
                    style={{ borderTop: '1px solid var(--footer-bottom-border)' }}
                >
                    <p className="text-xs" style={{ color: 'var(--footer-text-muted)' }}>
                        {f('footer-copyright', `© ${new Date().getFullYear()} PAFT Plastic Pallets. All rights reserved.`)}
                    </p>
                    <div className="flex items-center gap-4">
                        <a
                            href="#"
                            className="text-xs transition-colors duration-500"
                            style={{ color: 'var(--footer-text-muted)' }}
                            onMouseEnter={e => { e.currentTarget.style.color = 'var(--footer-link-hover)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--footer-text-muted)'; }}
                        >
                            {f('footer-privacy-policy', 'Privacy Policy')}
                        </a>
                        <span style={{ color: 'var(--footer-bottom-separator)' }}>·</span>
                        <a
                            href="#"
                            className="text-xs transition-colors duration-500"
                            style={{ color: 'var(--footer-text-muted)' }}
                            onMouseEnter={e => { e.currentTarget.style.color = 'var(--footer-link-hover)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--footer-text-muted)'; }}
                        >
                            {f('footer-terms-of-service', 'Terms of Service')}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
