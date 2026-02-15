'use client';

import { useState, useEffect } from 'react';

interface TransportLogisticsPageEditorProps {
    content: {[key: string]: {value: string; valueAr?: string; id: number}};
    onSave: (content: {[key: string]: string}) => Promise<void>;
    onClose: () => void;
    saving: boolean;
}

export default function TransportLogisticsPageEditor({ content, onSave, onClose, saving }: TransportLogisticsPageEditorProps) {
    const [editingContent, setEditingContent] = useState<{[key: string]: string}>(() => {
        const initialContent: {[key: string]: string} = {};
        Object.keys(content).forEach(key => {
            initialContent[key] = content[key]?.value || '';
        });
        return initialContent;
    });

    // Update editing content when content prop changes
    useEffect(() => {
        const newContent: {[key: string]: string} = {};
        Object.keys(content).forEach(key => {
            newContent[key] = content[key]?.value || '';
        });
        setEditingContent(newContent);
    }, [content]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onSave(editingContent);
    };

    const updateContent = (key: string, value: string) => {
        setEditingContent(prev => ({ ...prev, [key]: value }));
    };

    // Debug: Log content to see what we're getting
    console.log('🔍 TransportLogisticsPageEditor content:', content);
    console.log('🔍 TransportLogisticsPageEditor editingContent:', editingContent);

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#151b2e] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-[#151b2e] border-b border-white/5 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-lg font-bold text-white">Edit Transport & Logistics Page</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Hero Section */}
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                        <h3 className="text-blue-400 font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2m-6 0h8m-8 0a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2" />
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
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all" 
                                        placeholder="PAFT Product Range" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Main Title</label>
                                    <input 
                                        value={editingContent['title'] || ''} 
                                        onChange={(e) => updateContent('title', e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all" 
                                        placeholder="Transport & Logistics Items" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea 
                                    rows={3} 
                                    value={editingContent['description'] || ''} 
                                    onChange={(e) => updateContent('description', e.target.value)} 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-y" 
                                    placeholder="Innovative foldable IBCs, reusable plastic crates, sheet separators, and gallon racks..." 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Products Section Header */}
                    <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
                        <h3 className="text-purple-400 font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Products Section Header
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Section Title</label>
                                <input 
                                    value={editingContent['section-title'] || ''} 
                                    onChange={(e) => updateContent('section-title', e.target.value)} 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all" 
                                    placeholder="Our Catalogue" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Section Subtitle</label>
                                <input 
                                    value={editingContent['section-subtitle'] || ''} 
                                    onChange={(e) => updateContent('section-subtitle', e.target.value)} 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all" 
                                    placeholder="Foldable IBCs · RPC Crates · Accessories" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Product 1 - Foldable IBC */}
                    <div className="bg-cyan-600/10 border border-cyan-600/20 rounded-lg p-4">
                        <h4 className="text-cyan-300 font-medium mb-3">Product 1 - Foldable IBC</h4>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
                                    <input 
                                        value={editingContent['product-1-title'] || ''} 
                                        onChange={(e) => updateContent('product-1-title', e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50" 
                                        placeholder="Foldable IBC - 1000 Lit" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Subtitle</label>
                                    <input 
                                        value={editingContent['product-1-subtitle'] || ''} 
                                        onChange={(e) => updateContent('product-1-subtitle', e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50" 
                                        placeholder="Product subtitle" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Image URL</label>
                                <input 
                                    value={editingContent['product-1-image'] || ''} 
                                    onChange={(e) => updateContent('product-1-image', e.target.value)} 
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50" 
                                    placeholder="https://..." 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Spec Headers (comma-separated)</label>
                                <input 
                                    value={editingContent['product-1-spec-headers'] || ''} 
                                    onChange={(e) => updateContent('product-1-spec-headers', e.target.value)} 
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50" 
                                    placeholder="Types of Truck,2.6m Standard Trailer,3m Mega road train" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Specifications (label,value1,value2)</label>
                                {[1, 2, 3].map(i => (
                                    <input 
                                        key={i}
                                        value={editingContent[`product-1-spec-row-${i}`] || ''} 
                                        onChange={(e) => updateContent(`product-1-spec-row-${i}`, e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50" 
                                        placeholder={`Spec row ${i}: Label,Value1,Value2`} 
                                    />
                                ))}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Price Label</label>
                                <input 
                                    value={editingContent['product-1-price-label'] || ''} 
                                    onChange={(e) => updateContent('product-1-price-label', e.target.value)} 
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50" 
                                    placeholder="On Call" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Products 2-6 - RPC Series */}
                    {[2, 3, 4, 5, 6].map(productNum => (
                        <div key={productNum} className="bg-green-600/10 border border-green-600/20 rounded-lg p-4">
                            <h4 className="text-green-300 font-medium mb-3">Product {productNum} - RPC Series</h4>
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
                                        <input 
                                            value={editingContent[`product-${productNum}-title`] || ''} 
                                            onChange={(e) => updateContent(`product-${productNum}-title`, e.target.value)} 
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/50" 
                                            placeholder={`RPC ${productNum === 2 ? '6419' : productNum === 3 ? '6422' : productNum === 4 ? '6430' : productNum === 5 ? 'Large Foldable Crate' : '6411'}`} 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Subtitle</label>
                                        <input 
                                            value={editingContent[`product-${productNum}-subtitle`] || ''} 
                                            onChange={(e) => updateContent(`product-${productNum}-subtitle`, e.target.value)} 
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/50" 
                                            placeholder="Dimensions" 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Image URL</label>
                                    <input 
                                        value={editingContent[`product-${productNum}-image`] || ''} 
                                        onChange={(e) => updateContent(`product-${productNum}-image`, e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/50" 
                                        placeholder="https://..." 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">Specifications (label,value)</label>
                                    {Array.from({ length: productNum === 5 ? 6 : 5 }, (_, i) => (
                                        <input 
                                            key={i}
                                            value={editingContent[`product-${productNum}-spec-row-${i + 1}`] || ''} 
                                            onChange={(e) => updateContent(`product-${productNum}-spec-row-${i + 1}`, e.target.value)} 
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/50" 
                                            placeholder={`Spec row ${i + 1}: Label,Value`} 
                                        />
                                    ))}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Price Label</label>
                                    <input 
                                        value={editingContent[`product-${productNum}-price-label`] || ''} 
                                        onChange={(e) => updateContent(`product-${productNum}-price-label`, e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/50" 
                                        placeholder="On Call" 
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Product 7 - Sheet Separators */}
                    <div className="bg-orange-600/10 border border-orange-600/20 rounded-lg p-4">
                        <h4 className="text-orange-300 font-medium mb-3">Product 7 - Sheet Separators</h4>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
                                <input 
                                    value={editingContent['product-7-title'] || ''} 
                                    onChange={(e) => updateContent('product-7-title', e.target.value)} 
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-orange-500/50" 
                                    placeholder="Sheet Separators" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Image URL</label>
                                <input 
                                    value={editingContent['product-7-image'] || ''} 
                                    onChange={(e) => updateContent('product-7-image', e.target.value)} 
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-orange-500/50" 
                                    placeholder="https://..." 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Product 8 - Gallon Racks */}
                    <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-4">
                        <h4 className="text-red-300 font-medium mb-3">Product 8 - Gallon Racks</h4>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
                                <input 
                                    value={editingContent['product-8-title'] || ''} 
                                    onChange={(e) => updateContent('product-8-title', e.target.value)} 
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-red-500/50" 
                                    placeholder="Gallon Racks" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Image URL</label>
                                <input 
                                    value={editingContent['product-8-image'] || ''} 
                                    onChange={(e) => updateContent('product-8-image', e.target.value)} 
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-red-500/50" 
                                    placeholder="https://..." 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Features (comma-separated)</label>
                                <input 
                                    value={editingContent['product-8-features'] || ''} 
                                    onChange={(e) => updateContent('product-8-features', e.target.value)} 
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-red-500/50" 
                                    placeholder="The 4 pcs Set,The 8 pcs Set" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
                        <h3 className="text-yellow-400 font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Call to Action Section
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">CTA Title</label>
                                <input 
                                    value={editingContent['cta-title'] || ''} 
                                    onChange={(e) => updateContent('cta-title', e.target.value)} 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all" 
                                    placeholder="Need a Custom Quote?" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">CTA Description</label>
                                <textarea 
                                    rows={2} 
                                    value={editingContent['cta-description'] || ''} 
                                    onChange={(e) => updateContent('cta-description', e.target.value)} 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all resize-y" 
                                    placeholder="We offer tailored solutions for crates, IBCs, and logistics accessories" 
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
                            {saving ? 'Saving...' : 'Update Transport & Logistics Page'}
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