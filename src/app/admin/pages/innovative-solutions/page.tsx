'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InnovativeSolutionsAdminPage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/admin/pages');
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-gray-400">Redirecting to Pages list...</div>
        </div>
    );
}
