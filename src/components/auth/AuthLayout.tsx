'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex" style={{ background: '#0B1121' }}>
            {/* ── Left Side: Image ── */}
            <div className="hidden lg:block lg:w-[45%] xl:w-[50%] relative overflow-hidden">
                {/* Background image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            'url(https://paft.eg/wp-content/uploads/2026/02/Copy-of-vlcsnap-2024-07-21-14h26m13s806-scaled.png)',
                    }}
                />
                {/* Overlay */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(135deg, rgba(11,17,33,0.6) 0%, rgba(6,182,212,0.15) 50%, rgba(37,99,235,0.25) 100%)',
                    }}
                />
            </div>

            {/* ── Right Side: Form ── */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-28 py-12 relative overflow-hidden">
                {/* Background subtle glow */}
                <div
                    className="absolute top-0 left-0 w-80 h-80 rounded-full opacity-[0.06]"
                    style={{
                        background: 'radial-gradient(circle, #06B6D4, transparent 70%)',
                        filter: 'blur(60px)',
                        transform: 'translate(-40%, -40%)',
                    }}
                />
                <div
                    className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-[0.06]"
                    style={{
                        background: 'radial-gradient(circle, #2563EB, transparent 70%)',
                        filter: 'blur(60px)',
                        transform: 'translate(40%, 40%)',
                    }}
                />

                <div className="relative z-10 w-full max-w-md mx-auto">
                    {/* Logo */}
                    <Link href="/" className="inline-block mb-12" aria-label="Back to homepage">
                        <img
                            src="https://paft.eg/wp-content/uploads/2025/10/cropped-cropped-cropped-cropped-PAFT-Ind-3.png"
                            alt="PAFT Logo"
                            className="h-14 w-auto transition-transform duration-500 hover:scale-105"
                        />
                    </Link>

                    {/* Heading */}
                    <h1 className="text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#fff' }}>
                        {title}
                    </h1>
                    <p className="text-base mb-10" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        {subtitle}
                    </p>

                    {/* Form content slot */}
                    {children}
                </div>
            </div>
        </div>
    );
}
