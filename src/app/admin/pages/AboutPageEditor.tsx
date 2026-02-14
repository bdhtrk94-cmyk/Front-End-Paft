'use client';

import { useState } from 'react';

interface AboutPageContent {
    [key: string]: {
        value: string;
        valueAr?: string;
        id: number;
    };
}

interface AboutPageEditorProps {
    content: AboutPageContent;
    onSave: (content: {[key: string]: string}) => Promise<void>;
    onClose: () => void;
    saving: boolean;
}

export default function AboutPageEditor({ content, onSave, onClose, saving }: AboutPageEditorProps) {
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
                    <h2 className="text-lg font-bold text-white">Edit About Page Content</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Hero Section */}
                    <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4">
                        <h3 className="text-cyan-400 font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            Hero Section
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Badge Text</label>
                                <input 
                                    value={editingContent['badge-text'] || ''} 
                                    onChange={(e) => updateContent('badge-text', e.target.value)} 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all" 
                                    placeholder="About PAFT" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                <input 
                                    value={editingContent['title'] || ''} 
                                    onChange={(e) => updateContent('title', e.target.value)} 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all" 
                                    placeholder="Our Vision" 
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                            <textarea 
                                rows={3} 
                                value={editingContent['description'] || ''} 
                                onChange={(e) => updateContent('description', e.target.value)} 
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all resize-y" 
                                placeholder="Be, & be recognized as the pace setters..." 
                            />
                        </div>
                    </div>

                    {/* Who We Are Section */}
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                        <h3 className="text-blue-400 font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Who We Are Section
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Badge Text</label>
                                    <input 
                                        value={editingContent['who-badge-text'] || ''} 
                                        onChange={(e) => updateContent('who-badge-text', e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50" 
                                        placeholder="Who We Are" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Section Title</label>
                                    <input 
                                        value={editingContent['who-title'] || ''} 
                                        onChange={(e) => updateContent('who-title', e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50" 
                                        placeholder="Packaging Applications & Future Technologies" 
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Paragraph 1</label>
                                    <textarea 
                                        rows={3} 
                                        value={editingContent['paragraph1'] || ''} 
                                        onChange={(e) => updateContent('paragraph1', e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 resize-y" 
                                        placeholder="PAFT is a leading provider..." 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Paragraph 2</label>
                                    <textarea 
                                        rows={3} 
                                        value={editingContent['paragraph2'] || ''} 
                                        onChange={(e) => updateContent('paragraph2', e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 resize-y" 
                                        placeholder="Our commitment to excellence..." 
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Paragraph 3</label>
                                    <textarea 
                                        rows={3} 
                                        value={editingContent['paragraph3'] || ''} 
                                        onChange={(e) => updateContent('paragraph3', e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 resize-y" 
                                        placeholder="At PAFT, we understand..." 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Paragraph 4</label>
                                    <textarea 
                                        rows={3} 
                                        value={editingContent['paragraph4'] || ''} 
                                        onChange={(e) => updateContent('paragraph4', e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 resize-y" 
                                        placeholder="Whether you need heavy-duty pallets..." 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Company Quote</label>
                                <textarea 
                                    rows={2} 
                                    value={editingContent['quote'] || ''} 
                                    onChange={(e) => updateContent('quote', e.target.value)} 
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 resize-y" 
                                    placeholder="At PAFT, innovation delivered at great value..." 
                                />
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Stat 1 Number</label>
                                    <input 
                                        value={editingContent['stat1-number'] || ''} 
                                        onChange={(e) => updateContent('stat1-number', e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50" 
                                        placeholder="10+" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Stat 1 Text</label>
                                    <input 
                                        value={editingContent['stat1-text'] || ''} 
                                        onChange={(e) => updateContent('stat1-text', e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50" 
                                        placeholder="Years Experience" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Stat 2 Number</label>
                                    <input 
                                        value={editingContent['stat2-number'] || ''} 
                                        onChange={(e) => updateContent('stat2-number', e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50" 
                                        placeholder="MENA" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Stat 2 Text</label>
                                    <input 
                                        value={editingContent['stat2-text'] || ''} 
                                        onChange={(e) => updateContent('stat2-text', e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50" 
                                        placeholder="Region Leader" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Values Section */}
                    <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                        <h3 className="text-green-400 font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Values Section
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Section Title</label>
                                    <input 
                                        value={editingContent['values-title'] || ''} 
                                        onChange={(e) => updateContent('values-title', e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/50" 
                                        placeholder="Our Core Values" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Subtitle</label>
                                    <input 
                                        value={editingContent['values-subtitle'] || ''} 
                                        onChange={(e) => updateContent('values-subtitle', e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/50" 
                                        placeholder="The principles that guide everything we do at PAFT" 
                                    />
                                </div>
                            </div>
                            
                            {/* Values 1-4 */}
                            <div className="grid grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map(num => (
                                    <div key={num} className="bg-green-600/10 border border-green-600/20 rounded-lg p-3">
                                        <h4 className="text-green-300 font-medium mb-3">Value {num}</h4>
                                        <div className="space-y-2">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-300 mb-1">Title</label>
                                                <input 
                                                    value={editingContent[`value${num}-title`] || ''} 
                                                    onChange={(e) => updateContent(`value${num}-title`, e.target.value)} 
                                                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-green-500/50" 
                                                    placeholder={`Value ${num} Title`} 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-300 mb-1">Description</label>
                                                <textarea 
                                                    rows={2} 
                                                    value={editingContent[`value${num}-description`] || ''} 
                                                    onChange={(e) => updateContent(`value${num}-description`, e.target.value)} 
                                                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-green-500/50 resize-y" 
                                                    placeholder={`Value ${num} Description`} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
                        <h3 className="text-purple-400 font-semibold mb-4 flex items-center gap-2">
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
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50" 
                                        placeholder="Ready to Work With Us?" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                    <input 
                                        value={editingContent['cta-description'] || ''} 
                                        onChange={(e) => updateContent('cta-description', e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50" 
                                        placeholder="Let's discuss how PAFT can help..." 
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Button 1 Text</label>
                                    <input 
                                        value={editingContent['button1-text'] || ''} 
                                        onChange={(e) => updateContent('button1-text', e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50" 
                                        placeholder="Get in Touch →" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Button 2 Text</label>
                                    <input 
                                        value={editingContent['button2-text'] || ''} 
                                        onChange={(e) => updateContent('button2-text', e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50" 
                                        placeholder="Browse Products" 
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
                            className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Update About Page'}
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