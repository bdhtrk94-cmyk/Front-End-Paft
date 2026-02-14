'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthInput from '@/components/auth/AuthInput';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';

interface LoginErrors {
    email?: string;
    password?: string;
}

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [errors, setErrors] = useState<LoginErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const validate = (): LoginErrors => {
        const errs: LoginErrors = {};
        if (!email.trim()) {
            errs.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errs.email = 'Enter a valid email address';
        }
        if (!password) {
            errs.password = 'Password is required';
        } else if (password.length < 6) {
            errs.password = 'Password must be at least 6 characters';
        }
        return errs;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError('');
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setIsSubmitting(true);
        try {
            const response = await login(email, password);
            // Redirect admin users to /admin, others to home
            const redirectParam = new URLSearchParams(window.location.search).get('redirect');
            if (redirectParam) {
                router.push(redirectParam);
            } else if (response.user.role === UserRole.ADMIN || response.user.role === UserRole.SUPER_ADMIN) {
                router.push('/admin');
            } else {
                router.push('/');
            }
        } catch (err: unknown) {
            const error = err as { message?: string };
            setSubmitError(
                typeof error.message === 'string'
                    ? error.message
                    : 'Login failed. Please check your credentials.',
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to your PAFT account to continue"
        >
            {/* Global error */}
            {submitError && (
                <div
                    className="mb-6 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
                    style={{
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.2)',
                        color: '#EF4444',
                    }}
                    role="alert"
                >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {submitError}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <AuthInput
                    id="email"
                    label="Email Address"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: undefined })); }}
                    error={errors.email}
                    autoComplete="email"
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    }
                />

                <AuthInput
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors((p) => ({ ...p, password: undefined })); }}
                    error={errors.password}
                    autoComplete="current-password"
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    }
                />

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="sr-only"
                                aria-label="Remember me"
                            />
                            <div
                                className="w-5 h-5 rounded-md transition-all duration-300 flex items-center justify-center"
                                style={{
                                    background: remember ? 'linear-gradient(135deg, #06B6D4, #2563EB)' : 'rgba(255,255,255,0.05)',
                                    border: remember ? 'none' : '1px solid rgba(255,255,255,0.15)',
                                }}
                            >
                                {remember && (
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Remember me</span>
                    </label>

                    <Link
                        href="#"
                        className="text-sm font-medium transition-colors hover:underline"
                        style={{ color: '#06B6D4' }}
                    >
                        Forgot password?
                    </Link>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl font-semibold text-base text-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
                    style={{
                        background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                        boxShadow: '0 4px 15px rgba(6,182,212,0.3)',
                    }}
                    onMouseEnter={(e) => {
                        if (!isSubmitting) {
                            e.currentTarget.style.boxShadow = '0 8px 30px rgba(6,182,212,0.5)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(6,182,212,0.3)';
                        e.currentTarget.style.transform = '';
                    }}
                >
                    {isSubmitting ? (
                        <>
                            <div
                                className="w-5 h-5 border-2 rounded-full animate-spin"
                                style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }}
                            />
                            Signing in…
                        </>
                    ) : (
                        'Sign In'
                    )}
                </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} />
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="px-3" style={{ background: '#0B1121', color: 'rgba(255,255,255,0.3)' }}>
                        or
                    </span>
                </div>
            </div>

            {/* Register link */}
            <p className="text-center text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Don&apos;t have an account?{' '}
                <Link
                    href="/register"
                    className="font-semibold transition-colors hover:underline"
                    style={{ color: '#06B6D4' }}
                >
                    Create one
                </Link>
            </p>
        </AuthLayout>
    );
}
