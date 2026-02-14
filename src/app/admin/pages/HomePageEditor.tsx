'use client';

import { useState } from 'react';

interface HomePageContent {
    [key: string]: {
        value: string;
        valueAr?: string;
        id: number;
    };
}

interface HomePageEditorProps {
    content: HomePageContent;
    onSave: (content: {[key: string]: string}) => Promise<void>;
    onClose: () => void;
    saving: boolean;
}

export default function HomePageEditor({ content, onSave, onClose, saving }: HomePageEditorProps) {
    const [editingContent, setEditingContent] = useState<{[key: string]: string}>(() => {
        const initialContent: {[key: string]: string} = {};
        Object.keys(content).forEach(key => {
            initialContent[key] = content[key]?.value || '';
        });
        return initialContent;
    });

    const handleSubmit = async (e: React.FormEvent) => {
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
                    <h2 className="text-lg font-bold text-white">Edit Home Page Content</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Business Units Section */}
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                        <h3 className="text-blue-400 font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Business Units Section
                        </h3>
                        
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Section Title</label>
                                    <input 
                                        value={editingContent['title'] || ''} 
                                        onChange={(e) => updateContent('title', e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all" 
                                        placeholder="Our Business Units" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Section Subtitle</label>
                                    <input 
                                        value={editingContent['subtitle'] || ''} 
                                        onChange={(e) => updateContent('subtitle', e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all" 
                                        placeholder="Comprehensive solutions across three core divisions" 
                                    />
                                </div>
                            </div>

                            {/* Unit 1 - Plastic Pallets */}
                            <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4">
                                <h4 className="text-blue-300 font-medium mb-3">Unit 1 - Plastic Pallets</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
                                        <input 
                                            value={editingContent['unit1-title'] || ''} 
                                            onChange={(e) => updateContent('unit1-title', e.target.value)} 
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50" 
                                            placeholder="Plastic Pallets" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                                        <textarea 
                                            rows={4} 
                                            value={editingContent['unit1-description'] || ''} 
                                            onChange={(e) => updateContent('unit1-description', e.target.value)} 
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 resize-y" 
                                            placeholder="PAFT heavy-duty plastic pallets description..." 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Button Text</label>
                                        <input 
                                            value={editingContent['unit1-button-text'] || ''} 
                                            onChange={(e) => updateContent('unit1-button-text', e.target.value)} 
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50" 
                                            placeholder="Discover more" 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Unit 2 - Raw Materials */}
                            <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-4">
                                <h4 className="text-green-300 font-medium mb-3">Unit 2 - Raw Materials</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
                                        <input 
                                            value={editingContent['unit2-title'] || ''} 
                                            onChange={(e) => updateContent('unit2-title', e.target.value)} 
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/50" 
                                            placeholder="High-Performance Recycled Raw Materials" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                                        <textarea 
                                            rows={4} 
                                            value={editingContent['unit2-description'] || ''} 
                                            onChange={(e) => updateContent('unit2-description', e.target.value)} 
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/50 resize-y" 
                                            placeholder="Our innovative recycled raw materials description..." 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Button Text</label>
                                        <input 
                                            value={editingContent['unit2-button-text'] || ''} 
                                            onChange={(e) => updateContent('unit2-button-text', e.target.value)} 
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/50" 
                                            placeholder="Discover more" 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Unit 3 - Traceability */}
                            <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-4">
                                <h4 className="text-red-300 font-medium mb-3">Unit 3 - Traceability</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
                                        <input 
                                            value={editingContent['unit3-title'] || ''} 
                                            onChange={(e) => updateContent('unit3-title', e.target.value)} 
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-red-500/50" 
                                            placeholder="A New Era of Traceability" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                                        <textarea 
                                            rows={4} 
                                            value={editingContent['unit3-description'] || ''} 
                                            onChange={(e) => updateContent('unit3-description', e.target.value)} 
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-red-500/50 resize-y" 
                                            placeholder="PAFT iWMS utilizes advanced RFID technology description..." 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Button Text</label>
                                        <input 
                                            value={editingContent['unit3-button-text'] || ''} 
                                            onChange={(e) => updateContent('unit3-button-text', e.target.value)} 
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-red-500/50" 
                                            placeholder="Discover more" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Video Hero Section */}
                    <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
                        <h3 className="text-purple-400 font-semibold mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Video Hero Section
                        </h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Watch Video Text</label>
                            <input 
                                value={editingContent['watch-video-text'] || ''} 
                                onChange={(e) => updateContent('watch-video-text', e.target.value)} 
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all" 
                                placeholder="Watch Video" 
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button 
                            type="submit" 
                            disabled={saving} 
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Update Home Page'}
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