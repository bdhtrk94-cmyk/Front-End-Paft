'use client';

import { COMPANY_INFO } from '@/lib/constants';
import { useAuth } from '@/context/AuthContext';

export default function Footer() {
    const { user } = useAuth();

    return (
        <footer
            className="relative overflow-hidden"
            style={{
                background: 'var(--footer-bg)',
                color: 'var(--footer-text)',
            }}
        >
            {/* Gradient top border */}
            <div
                className="h-1 w-full"
                style={{
                    background: 'linear-gradient(90deg, #06B6D4, #2563EB, #06B6D4)',
                }}
            ></div>

            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center mb-6">
                            <img
                                src="/paft-logo.png"
                                alt="PAFT Logo"
                                className="h-12 w-auto"
                            />
                        </div>
                        <p style={{ color: 'var(--footer-text)', lineHeight: '1.8' }}>
                            Leading manufacturer of premium plastic pallets in Egypt, committed to quality,
                            sustainability, and innovation in logistics solutions.
                        </p>
                        {/* Social Icons */}
                        <div className="flex space-x-4 mt-6">
                            <a
                                href={COMPANY_INFO.social.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-700 ease-out"
                                style={{
                                    background: 'var(--header-hover-bg)',
                                    border: '1px solid var(--footer-border)',
                                    color: 'var(--footer-text)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(6, 182, 212, 0.2)';
                                    e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.5)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.color = 'var(--footer-link-hover)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--header-hover-bg)';
                                    e.currentTarget.style.borderColor = 'var(--footer-border)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.color = 'var(--footer-text)';
                                }}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                                </svg>
                            </a>
                            <a
                                href={COMPANY_INFO.social.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-700 ease-out"
                                style={{
                                    background: 'var(--header-hover-bg)',
                                    border: '1px solid var(--footer-border)',
                                    color: 'var(--footer-text)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(6, 182, 212, 0.2)';
                                    e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.5)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.color = 'var(--footer-link-hover)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--header-hover-bg)';
                                    e.currentTarget.style.borderColor = 'var(--footer-border)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.color = 'var(--footer-text)';
                                }}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.47 2H3.53a1.45 1.45 0 00-1.47 1.43v17.14A1.45 1.45 0 003.53 22h16.94a1.45 1.45 0 001.47-1.43V3.43A1.45 1.45 0 0020.47 2zM8.09 18.74h-3v-9h3v9zM6.59 8.48a1.56 1.56 0 110-3.12 1.56 1.56 0 010 3.12zM18.91 18.74h-3v-4.26c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.18-1.73 2.39v4.34h-3v-9h2.89v1.23h.04a3.18 3.18 0 012.85-1.56c3.04 0 3.6 2 3.6 4.61v4.72z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 relative" style={{ color: 'var(--footer-heading)' }}>
                            Quick Links
                            <span
                                className="absolute bottom-[-8px] left-0 w-8 h-0.5 rounded-full"
                                style={{ background: 'linear-gradient(90deg, #06B6D4, #2563EB)' }}
                            ></span>
                        </h4>
                        <ul className="space-y-3 mt-4">
                            {[
                                { label: 'Products', href: '/products' },
                                { label: 'About Us', href: '/about' },
                                { label: 'Contact', href: '/contact' },
                                ...(user?.role === 'admin' ? [{ label: 'Admin', href: '/admin' }] : []),
                            ].map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="flex items-center transition-all duration-700 ease-out group"
                                        style={{ color: 'var(--footer-text)' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--footer-link-hover)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--footer-text)'; }}
                                    >
                                        <svg className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-700 ease-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 relative" style={{ color: 'var(--footer-heading)' }}>
                            Contact Info
                            <span
                                className="absolute bottom-[-8px] left-0 w-8 h-0.5 rounded-full"
                                style={{ background: 'linear-gradient(90deg, #06B6D4, #2563EB)' }}
                            ></span>
                        </h4>
                        <ul className="space-y-4 mt-4">
                            <li className="flex items-start space-x-3">
                                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#06B6D4' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span style={{ color: 'var(--footer-text)' }}>{COMPANY_INFO.contact.phone}</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#06B6D4' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span style={{ color: 'var(--footer-text)' }}>{COMPANY_INFO.contact.email}</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#06B6D4' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-sm" style={{ color: 'var(--footer-text)' }}>{COMPANY_INFO.contact.address}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Business Hours */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 relative" style={{ color: 'var(--footer-heading)' }}>
                            Business Hours
                            <span
                                className="absolute bottom-[-8px] left-0 w-8 h-0.5 rounded-full"
                                style={{ background: 'linear-gradient(90deg, #06B6D4, #2563EB)' }}
                            ></span>
                        </h4>
                        <ul className="space-y-3 mt-4">
                            <li className="flex items-start space-x-3">
                                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#06B6D4' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span style={{ color: 'var(--footer-text)' }}>{COMPANY_INFO.contact.businessHours}</span>
                            </li>
                        </ul>
                        {/* CTA */}
                        <div
                            className="mt-8 p-4 rounded-xl"
                            style={{
                                background: 'rgba(6, 182, 212, 0.05)',
                                border: '1px solid rgba(6, 182, 212, 0.15)',
                            }}
                        >
                            <p className="text-sm font-medium mb-3" style={{ color: 'var(--footer-text)' }}>
                                Ready to get started?
                            </p>
                            <a
                                href="/contact"
                                className="inline-flex items-center text-sm font-semibold transition-all duration-700 ease-out"
                                style={{ color: '#06B6D4' }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = '#22D3EE'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = '#06B6D4'; }}
                            >
                                Contact Us
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div
                className="py-6"
                style={{
                    borderTop: '1px solid var(--footer-border)',
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-sm" style={{ color: 'var(--footer-text)', opacity: 0.7 }}>
                        &copy; 2025 {COMPANY_INFO.fullName}. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 sm:mt-0">
                        {['Privacy Policy', 'Terms of Service'].map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="text-sm transition-colors duration-700 ease-out"
                                style={{ color: 'var(--footer-text)', opacity: 0.7 }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--footer-link-hover)'; e.currentTarget.style.opacity = '1'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--footer-text)'; e.currentTarget.style.opacity = '0.7'; }}
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
