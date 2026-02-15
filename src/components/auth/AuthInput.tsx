'use client';

import { forwardRef, InputHTMLAttributes, useState } from 'react';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    icon?: React.ReactNode;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
    ({ label, error, icon, type, id, ...rest }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === 'password';

        return (
            <div>
                <label
                    htmlFor={id}
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                    {label}
                </label>
                <div className="relative">
                    {icon && (
                        <div
                            className="absolute left-4 top-1/2 -translate-y-1/2"
                            style={{ color: 'rgba(255,255,255,0.3)' }}
                        >
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={id}
                        type={isPassword && showPassword ? 'text' : type}
                        className={`w-full ${icon ? 'pl-11' : 'pl-4'} ${isPassword ? 'pr-12' : 'pr-4'} py-3.5 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-500 text-sm`}
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: error
                                ? '1px solid rgba(239,68,68,0.6)'
                                : '1px solid rgba(255,255,255,0.08)',
                        }}
                        onFocus={(e) => {
                            if (!error) {
                                e.currentTarget.style.borderColor = 'rgba(6,182,212,0.5)';
                                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(6,182,212,0.08)';
                            }
                        }}
                        onBlur={(e) => {
                            if (!error) {
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                e.currentTarget.style.boxShadow = 'none';
                            }
                        }}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${id}-error` : undefined}
                        {...rest}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                            style={{ color: 'rgba(255,255,255,0.3)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#06B6D4'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    )}
                </div>
                {error && (
                    <p id={`${id}-error`} className="mt-1.5 text-xs text-red-400 flex items-center gap-1" role="alert">
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </p>
                )}
            </div>
        );
    },
);

AuthInput.displayName = 'AuthInput';
export default AuthInput;
