'use client';

import { useState } from 'react';

interface OurJourneyPageContent {
    [key: string]: {
        value: string;
        valueAr?: string;
        id: number;
    };
}

interface OurJourneyPageEditorProps {
    content: OurJourneyPageContent;
    onSave: (content: {[key: string]: string}) => Promise<void>;
    onClose: () => void;
    saving: boolean;
}

export default function OurJourneyPageEditor({ content, onSave, onClose, saving }: OurJourneyPageEditorProps) {
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
            <div className="bg-[#151b2e] border border-white/10 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-[#151b2e] border-b border-white/5 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-lg font-bold text-white">Edit Our Journey Page Content</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Hero Section */}
                    <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
                        <h3 className="text-purple-400 font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            Hero Section
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Badge Text</label>
                                    <input 
                                        value={editingContent['badge-text'] || ''} 
                                        onChange={(e) => updateContent('badge-text', e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all" 
                                        placeholder="Our Journey" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                    <input 
                                        value={editingContent['title'] || ''} 
                                        onChange={(e) => updateContent('title', e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all" 
                                        placeholder="Building the Future" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea 
                                    rows={3} 
                                    value={editingContent['description'] || ''} 
                                    onChange={(e) => updateContent('description', e.target.value)} 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-y" 
                                    placeholder="Over a decade of innovation, growth, and relentless pursuit of excellence..." 
                                />
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                                {[1, 2, 3, 4].map(num => (
                                    <div key={num} className="space-y-2">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-300 mb-1">Stat {num} Value</label>
                                            <input 
                                                value={editingContent[`stat${num}-value`] || ''} 
                                                onChange={(e) => updateContent(`stat${num}-value`, e.target.value)} 
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50" 
                                                placeholder={`${num === 1 ? '15+' : num === 2 ? '12' : num === 3 ? '4' : '300%'}`} 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-300 mb-1">Stat {num} Label</label>
                                            <input 
                                                value={editingContent[`stat${num}-label`] || ''} 
                                                onChange={(e) => updateContent(`stat${num}-label`, e.target.value)} 
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50" 
                                                placeholder={`${num === 1 ? 'Years of Innovation' : num === 2 ? 'Key Milestones' : num === 3 ? 'Growth Eras' : 'Capacity Growth'}`} 
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Era Labels */}
                    <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                        <h3 className="text-green-400 font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Era Labels
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map(num => (
                                <div key={num} className="bg-green-600/10 border border-green-600/20 rounded-lg p-3">
                                    <h4 className="text-green-300 font-medium mb-3">Era {num}</h4>
                                    <div className="space-y-2">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-300 mb-1">Label</label>
                                            <input 
                                                value={editingContent[`era${num}-label`] || ''} 
                                                onChange={(e) => updateContent(`era${num}-label`, e.target.value)} 
                                                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-green-500/50" 
                                                placeholder={`${num === 1 ? '1st Era' : num === 2 ? '2nd Era' : num === 3 ? '3rd Era' : '4th Era'}`} 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-300 mb-1">Subtitle</label>
                                            <input 
                                                value={editingContent[`era${num}-subtitle`] || ''} 
                                                onChange={(e) => updateContent(`era${num}-subtitle`, e.target.value)} 
                                                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-green-500/50" 
                                                placeholder="Era subtitle..." 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-300 mb-1">Year Range</label>
                                            <input 
                                                value={editingContent[`era${num}-range`] || ''} 
                                                onChange={(e) => updateContent(`era${num}-range`, e.target.value)} 
                                                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-green-500/50" 
                                                placeholder="2010 - 2013" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline Milestones */}
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                        <h3 className="text-blue-400 font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Timeline Milestones
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                                <div key={num} className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-3">
                                    <h4 className="text-blue-300 font-medium mb-3">Milestone {num}</h4>
                                    <div className="space-y-2">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-300 mb-1">Year</label>
                                            <input 
                                                value={editingContent[`milestone${num}-year`] || ''} 
                                                onChange={(e) => updateContent(`milestone${num}-year`, e.target.value)} 
                                                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-blue-500/50" 
                                                placeholder="2010" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-300 mb-1">Description</label>
                                            <textarea 
                                                rows={3} 
                                                value={editingContent[`milestone${num}-title`] || ''} 
                                                onChange={(e) => updateContent(`milestone${num}-title`, e.target.value)} 
                                                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-blue-500/50 resize-y" 
                                                placeholder="Milestone description..." 
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4">
                        <h3 className="text-orange-400 font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Call to Action Section
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                    <input 
                                        value={editingContent['cta-title'] || ''} 
                                        onChange={(e) => updateContent('cta-title', e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-orange-500/50" 
                                        placeholder="The Journey Continues" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                    <textarea 
                                        rows={2} 
                                        value={editingContent['cta-description'] || ''} 
                                        onChange={(e) => updateContent('cta-description', e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-orange-500/50 resize-y" 
                                        placeholder="Join us as we shape the future..." 
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Button 1 Text</label>
                                    <input 
                                        value={editingContent['cta-button1-text'] || ''} 
                                        onChange={(e) => updateContent('cta-button1-text', e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-orange-500/50" 
                                        placeholder="Partner With Us →" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Button 2 Text</label>
                                    <input 
                                        value={editingContent['cta-button2-text'] || ''} 
                                        onChange={(e) => updateContent('cta-button2-text', e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-orange-500/50" 
                                        placeholder="Learn About PAFT" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button 
                            type="submit" 
                            disabled={saving} 
                            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Update Our Journey Page'}
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