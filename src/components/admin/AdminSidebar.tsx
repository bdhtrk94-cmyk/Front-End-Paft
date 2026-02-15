'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const baseNavItems = [
    {
        label: 'Dashboard',
        href: '/admin',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        ),
    },
    {
        label: 'Users',
        href: '/admin/users',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
        ),
    },
    {
        label: 'Pages',
        href: '/admin/pages',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
    {
        label: 'Products',
        href: '/admin/products',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        ),
    },
    {
        label: 'Site Content',
        href: '/admin/site-content',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
        ),
    },
];

const superAdminNavItems = [
    {
        label: 'System Settings',
        href: '/admin/system-settings',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        label: 'Admin Logs',
        href: '/admin/logs',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
    {
        label: 'Database Backup',
        href: '/admin/backup',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
        ),
    },
];

interface AdminSidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
    const pathname = usePathname();
    const { user } = useAuth();

    const isActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin';
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-full z-50 lg:z-30
          w-[260px] bg-[#0f1523] border-r border-white/5
          flex flex-col
          transition-transform duration-500 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 h-[70px] border-b border-white/5">
                    <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center overflow-hidden group hover:from-white/15 hover:to-white/10 transition-all duration-300">
                        <img 
                            src="/paft-logo.png" 
                            alt="PAFT Logo" 
                            className="w-7 h-7 object-contain filter brightness-110 group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Subtle glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="text-white font-bold text-xl tracking-tight">PAFT</span>
                            <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider border border-blue-500/20">
                                Admin
                            </span>
                        </div>
                        <span className="text-xs text-gray-400 font-medium">Plastic Pallets</span>
                    </div>
                    {/* Mobile close */}
                    <button onClick={onToggle} className="ml-auto lg:hidden text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-3 mb-3">
                        Menu
                    </p>
                    {baseNavItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => {
                                    if (window.innerWidth < 1024) onToggle();
                                }}
                                className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-400
                  ${active
                                        ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/10 text-white shadow-lg shadow-blue-500/5'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }
                `}
                            >
                                <span className={`${active ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'} transition-colors`}>
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                                {active && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50" />
                                )}
                            </Link>
                        );
                    })}

                    {/* Super Admin Section */}
                    {user?.role === 'super_admin' && superAdminNavItems.length > 0 && (
                        <>
                            <div className="pt-4 pb-2">
                                <div className="flex items-center gap-2 px-3 mb-3">
                                    <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                                    <p className="text-[10px] font-semibold text-purple-400 uppercase tracking-widest flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M5 16L3 14l5.5-5.5L16 16l-2.5 2.5L5 16z"/>
                                            <path d="M11.5 9L16 4.5 18 6.5l-4.5 4.5L11.5 9z"/>
                                        </svg>
                                        Super Admin
                                    </p>
                                    <div className="flex-1 h-px bg-gradient-to-l from-purple-500/50 to-transparent"></div>
                                </div>
                            </div>
                            {superAdminNavItems.map((item) => {
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => {
                                            if (window.innerWidth < 1024) onToggle();
                                        }}
                                        className={`
                          group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                          transition-all duration-400
                          ${active
                                                ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/10 text-white shadow-lg shadow-purple-500/5'
                                                : 'text-gray-400 hover:text-white hover:bg-purple-500/5'
                                            }
                        `}
                                    >
                                        <span className={`${active ? 'text-purple-400' : 'text-gray-500 group-hover:text-purple-300'} transition-colors`}>
                                            {item.icon}
                                        </span>
                                        <span>{item.label}</span>
                                        {active && (
                                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400 shadow-lg shadow-purple-400/50" />
                                        )}
                                    </Link>
                                );
                            })}
                        </>
                    )}
                </nav>

                {/* Bottom section */}
                <div className="px-4 py-4 border-t border-white/5">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors px-2 py-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Website
                    </Link>
                </div>
            </aside>
        </>
    );
}
