'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AccessDenied from '@/components/AccessDenied';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login?redirect=/admin');
        } else if (!isLoading && isAuthenticated && user?.role !== 'admin' && user?.role !== 'super_admin') {
            // If user is authenticated but not admin or super admin, redirect to home
            router.push('/');
        }
    }, [isLoading, isAuthenticated, user, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-gray-500 text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    // Check if user is admin or super admin
    if (user?.role !== 'admin' && user?.role !== 'super_admin') {
        return (
            <AccessDenied
                title="Admin Access Required"
                message="You need administrator privileges to access the admin dashboard."
            />
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0e1a] font-sans text-left" dir="ltr">
            <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

            {/* Main content area */}
            <div className="lg:ml-[260px] min-h-screen flex flex-col">
                <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

                <main className="flex-1 p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
