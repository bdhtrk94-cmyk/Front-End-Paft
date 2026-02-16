'use client';

import { useState, useEffect } from 'react';

interface RawMaterialsPageEditorProps {
    content: { [key: string]: { value: string; valueAr?: string; id: number } };
    onSave: (content: { [key: string]: string }) => Promise<void>;
    onClose: () => void;
    saving: boolean;
}

export default function RawMaterialsPageEditor({ content, onSave, onClose, saving }: RawMaterialsPageEditorProps) {
    const [editingContent, setEditingContent] = useState<{ [key: string]: string }>(() => {
        const initialContent: { [key: string]: string } = {};
        Object.keys(content).forEach(key => {
            initialContent[key] = content[key]?.value || '';
        });
        return initialContent;
    });

    useEffect(() => {
        const newContent: { [key: string]: string } = {};
        Object.keys(content).forEach(key => {
            newContent[key] = content[key]?.value || '';
        });
        const id = requestAnimationFrame(() => setEditingContent(newContent));
        return () => cancelAnimationFrame(id);
    }, [content]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onSave(editingContent);
    };

    const updateContent = (key: string, value: string) => {
        setEditingContent(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#151b2e] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-[#151b2e] border-b border-white/5 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-lg font-bold text-white">Edit Raw Materials Page</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Hero Section */}
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                        <h3 className="text-blue-400 font-semibold mb-4">Hero Section</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Badge Text</label>
                                    <input
                                        value={editingContent['badge-text'] || ''}
                                        onChange={(e) => updateContent('badge-text', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Main Title</label>
                                    <input
                                        value={editingContent['title'] || ''}
                                        onChange={(e) => updateContent('title', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea
                                    rows={3}
                                    value={editingContent['description'] || ''}
                                    onChange={(e) => updateContent('description', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                        <h3 className="text-green-400 font-semibold mb-4">Stats Section</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="p-3 bg-white/5 rounded-lg">
                                    <div className="mb-2">
                                        <label className="block text-xs text-gray-400 mb-1">Stat {i} Value</label>
                                        <input
                                            value={editingContent[`stat-${i}-value`] || ''}
                                            onChange={(e) => updateContent(`stat-${i}-value`, e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Stat {i} Label</label>
                                        <input
                                            value={editingContent[`stat-${i}-label`] || ''}
                                            onChange={(e) => updateContent(`stat-${i}-label`, e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-sm"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Materials Grid */}
                    <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
                        <h3 className="text-purple-400 font-semibold mb-4">Materials Grid</h3>
                        <div className="space-y-6">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="bg-white/5 rounded-lg p-4 border border-white/5">
                                    <h4 className="text-white font-medium mb-3">Material {i}</h4>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="col-span-2">
                                            <label className="block text-xs text-gray-400 mb-1">Title</label>
                                            <input
                                                value={editingContent[`material-${i}-title`] || ''}
                                                onChange={(e) => updateContent(`material-${i}-title`, e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white text-sm"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs text-gray-400 mb-1">Image URL</label>
                                            <input
                                                value={editingContent[`material-${i}-image`] || ''}
                                                onChange={(e) => updateContent(`material-${i}-image`, e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Polymer</label>
                                            <input
                                                value={editingContent[`material-${i}-polymer`] || ''}
                                                onChange={(e) => updateContent(`material-${i}-polymer`, e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Source</label>
                                            <input
                                                value={editingContent[`material-${i}-source`] || ''}
                                                onChange={(e) => updateContent(`material-${i}-source`, e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Color</label>
                                            <input
                                                value={editingContent[`material-${i}-color`] || ''}
                                                onChange={(e) => updateContent(`material-${i}-color`, e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Additives</label>
                                            <input
                                                value={editingContent[`material-${i}-additives`] || ''}
                                                onChange={(e) => updateContent(`material-${i}-additives`, e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white text-sm"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs text-gray-400 mb-1">Link</label>
                                            <input
                                                value={editingContent[`material-${i}-link`] || ''}
                                                onChange={(e) => updateContent(`material-${i}-link`, e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Data Sheets Section */}
                    <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4">
                        <h3 className="text-orange-400 font-semibold mb-4">Data Sheets</h3>
                        <div className="space-y-6">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="bg-white/5 rounded-lg p-4 border border-white/5">
                                    <h4 className="text-white font-medium mb-3">Sheet {i}</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Title</label>
                                            <input
                                                value={editingContent[`sheet-${i}-title`] || ''}
                                                onChange={(e) => updateContent(`sheet-${i}-title`, e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Subtitle</label>
                                            <input
                                                value={editingContent[`sheet-${i}-subtitle`] || ''}
                                                onChange={(e) => updateContent(`sheet-${i}-subtitle`, e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white text-sm"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs text-gray-400 mb-1">Badges (comma-separated)</label>
                                            <input
                                                value={editingContent[`sheet-${i}-badges`] || ''}
                                                onChange={(e) => updateContent(`sheet-${i}-badges`, e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white text-sm"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs text-gray-400 mb-1">Description</label>
                                            <textarea
                                                rows={3}
                                                value={editingContent[`sheet-${i}-description`] || ''}
                                                onChange={(e) => updateContent(`sheet-${i}-description`, e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Datasheet URL</label>
                                            <input
                                                value={editingContent[`sheet-${i}-datasheetUrl`] || ''}
                                                onChange={(e) => updateContent(`sheet-${i}-datasheetUrl`, e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">PDF URL</label>
                                            <input
                                                value={editingContent[`sheet-${i}-pdfUrl`] || ''}
                                                onChange={(e) => updateContent(`sheet-${i}-pdfUrl`, e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
                        <h3 className="text-yellow-400 font-semibold mb-4">Call to Action</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">CTA Title</label>
                                <input
                                    value={editingContent['cta-title'] || ''}
                                    onChange={(e) => updateContent('cta-title', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-yellow-500/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">CTA Description</label>
                                <textarea
                                    rows={2}
                                    value={editingContent['cta-description'] || ''}
                                    onChange={(e) => updateContent('cta-description', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-yellow-500/50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Update Raw Materials Page'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-white/5 border border-white/10 text-gray-300 py-2.5 rounded-xl font-semibold text-sm hover:bg-white/10 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
