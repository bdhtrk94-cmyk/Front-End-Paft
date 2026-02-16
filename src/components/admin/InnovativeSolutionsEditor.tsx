'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { contentApi } from '@/lib/api';

type InnovativeSolutionsContent = {
    [key: string]: {
        value: string;
        valueAr?: string;
        id: number;
    };
};

interface InnovativeSolutionsEditorProps {
    onClose: () => void;
}

export default function InnovativeSolutionsEditor({ onClose }: InnovativeSolutionsEditorProps) {
    const { token } = useAuth();
    const [content, setContent] = useState<InnovativeSolutionsContent>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const fetchContent = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await contentApi.getPageContent('innovative-solutions');
            const flattenedContent: InnovativeSolutionsContent = {};

            // Flatten the structure: section -> key -> value
            Object.keys(data).forEach(section => {
                if (data[section]) {
                    Object.keys(data[section]).forEach(key => {
                        // Create unique keys by combining section and key
                        const uniqueKey = `${section}-${key}`;
                        flattenedContent[uniqueKey] = data[section][key];
                    });
                }
            });

            setContent(flattenedContent);
        } catch (err: unknown) {
            console.error('Failed to fetch content', err);
            setError('Failed to load content');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, [token]);

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!token) return;
        setSaving(true);
        setError('');
        setSuccessMsg('');

        try {
            // Get fresh data to ensure we have correct IDs
            const freshData = await contentApi.getPageContent('innovative-solutions');
            const updates: { id: number; value: string }[] = [];

            Object.keys(content).forEach(uniqueKey => {
                const parts = uniqueKey.split('-');
                if (parts.length >= 2) {
                    let found = false;
                    Object.keys(freshData).forEach(section => {
                        Object.keys(freshData[section]).forEach(key => {
                            const constructedKey = `${section}-${key}`;
                            if (constructedKey === uniqueKey) {
                                updates.push({
                                    id: freshData[section][key].id,
                                    value: content[uniqueKey].value
                                });
                                found = true;
                            }
                        });
                    });
                }
            });

            if (updates.length > 0) {
                await contentApi.bulkUpdate(updates, token);
                setSuccessMsg('Content updated successfully!');
                fetchContent();
            } else {
                setSuccessMsg('No changes to save.');
            }

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to save content';
            setError(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key: string, value: string) => {
        setContent(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                value
            }
        }));
    };

    // Helper to get value safely
    const getValue = (key: string) => content[key]?.value || '';

    if (loading) return null; // Or a loading spinner overlay

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#151b2e] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-[#151b2e] border-b border-white/5 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-lg font-bold text-white">Edit Innovative Solutions</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSave} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {successMsg && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm">
                            {successMsg}
                        </div>
                    )}

                    {/* Hero Section */}
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                        <h3 className="text-blue-400 font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Hero Section
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                <input
                                    value={getValue('hero-title')}
                                    onChange={(e) => handleChange('hero-title', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Subtitle</label>
                                <input
                                    value={getValue('hero-subtitle')}
                                    onChange={(e) => handleChange('hero-subtitle', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea
                                    rows={3}
                                    value={getValue('hero-description')}
                                    onChange={(e) => handleChange('hero-description', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-y"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                                <input
                                    value={getValue('hero-image')}
                                    onChange={(e) => handleChange('hero-image', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Intro Section */}
                    <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
                        <h3 className="text-purple-400 font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Intro Section
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Heading</label>
                                <input
                                    value={getValue('intro-heading')}
                                    onChange={(e) => handleChange('intro-heading', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Text</label>
                                <textarea
                                    rows={3}
                                    value={getValue('intro-text')}
                                    onChange={(e) => handleChange('intro-text', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-y"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Solutions Grid */}
                    <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                        <h3 className="text-green-400 font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                            Solutions
                        </h3>

                        <div className="space-y-6">
                            {['1', '2', '3'].map((num) => (
                                <div key={`solution-${num}`} className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                                    <h4 className="text-green-300 font-medium mb-3">Solution {num}</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
                                            <input
                                                value={getValue(`solution-${num}-title`)}
                                                onChange={(e) => handleChange(`solution-${num}-title`, e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                                            <textarea
                                                rows={2}
                                                value={getValue(`solution-${num}-description`)}
                                                onChange={(e) => handleChange(`solution-${num}-description`, e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/50 resize-y"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Icon Name</label>
                                            <input
                                                value={getValue(`solution-${num}-icon`)}
                                                onChange={(e) => handleChange(`solution-${num}-icon`, e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4">
                        <h3 className="text-indigo-400 font-semibold mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                            CTA Section
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
                                <input
                                    value={getValue('cta-title')}
                                    onChange={(e) => handleChange('cta-title', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Button Text</label>
                                <input
                                    value={getValue('cta-buttonParams')}
                                    onChange={(e) => handleChange('cta-buttonParams', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
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
                            {saving ? 'Saving...' : 'Update Page'}
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
            </div >
        </div >
    );
}
