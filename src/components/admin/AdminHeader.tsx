'use client';

import { useAuth } from '@/context/AuthContext';

interface AdminHeaderProps {
    onMenuToggle: () => void;
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
    const { user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-20 h-[70px] bg-[#0f1523]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 sm:px-6">
            {/* Left side */}
            <div className="flex items-center gap-4">
                {/* Mobile menu toggle */}
                <button
                    onClick={onMenuToggle}
                    className="lg:hidden text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Mobile logo */}
                <div className="flex items-center gap-3 lg:hidden">
                    <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center overflow-hidden group">
                        <img 
                            src="/paft-logo.png" 
                            alt="PAFT Logo" 
                            className="w-6 h-6 object-contain filter brightness-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-bold text-lg tracking-tight">PAFT</span>
                        <span className="text-xs text-gray-400 font-medium -mt-1">Admin</span>
                    </div>
                </div>

                <div className="hidden sm:block lg:ml-4">
                    <h2 className="text-white text-sm font-semibold flex items-center gap-2">
                        <span>Welcome back!</span>
                        <span className="text-blue-400">👋</span>
                    </h2>
                    <p className="text-gray-400 text-xs">Manage your PAFT website content</p>
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
                {/* User info */}
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        user?.role === 'super_admin' 
                            ? 'bg-gradient-to-br from-purple-500 to-purple-600' 
                            : 'bg-gradient-to-br from-blue-500 to-purple-600'
                    }`}>
                        {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-white text-sm font-medium flex items-center gap-2">
                            {user?.name || 'Admin'}
                            {user?.role === 'super_admin' && (
                                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                                    👑 Super Admin
                                </span>
                            )}
                        </p>
                        <p className="text-gray-500 text-xs capitalize">
                            {user?.role === 'super_admin' ? 'System Administrator' : user?.role || 'admin'}
                        </p>
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={logout}
                    className="ml-2 text-gray-400 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-all"
                    title="Logout"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>
            </div>
        </header>
    );
}
