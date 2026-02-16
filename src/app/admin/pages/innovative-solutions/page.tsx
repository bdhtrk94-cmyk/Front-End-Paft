'use client';

import InnovativeSolutionsEditor from '@/components/admin/InnovativeSolutionsEditor';

export default function InnovativeSolutionsAdminPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-white">Innovative Solutions Page</h1>
                <p className="text-gray-500 text-sm">Manage content for the Innovative Solutions page.</p>
            </div>

            <InnovativeSolutionsEditor />
        </div>
    );
}
