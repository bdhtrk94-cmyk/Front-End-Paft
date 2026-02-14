'use client';

import { useState } from 'react';
import ProductSpecificationCard from './ProductSpecificationCard';
import LightDutyProductCard from './LightDutyProductCard';

interface PlasticPalletsPageContent {
    [key: string]: {
        value: string;
        valueAr?: string;
        id: number;
    };
}

interface PlasticPalletsPageEditorProps {
    content: PlasticPalletsPageContent;
    onSave: (content: {[key: string]: string}) => Promise<void>;
    onClose: () => void;
    saving: boolean;
}

export default function PlasticPalletsPageEditor({ content, onSave, onClose, saving }: PlasticPalletsPageEditorProps) {
    const [editingContent, setEditingContent] = useState<{[key: string]: string}>(() => {
        const initialContent: {[key: string]: string} = {};
        Object.keys(content).forEach(key => {
            initialContent[key] = content[key]?.value || '';
        });
        return initialContent;
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onSave(editingContent);
    };

    const updateContent = (key: string, value: string) => {
        setEditingContent(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#151b2e] border border-white/10 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-[#151b2e] border-b border-white/5 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-lg font-bold text-white">Edit Plastic Pallets Page Content</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Heavy Duty Hero Section */}
                    <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4">
                        <h3 className="text-cyan-400 font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Heavy Duty Hero Section
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={editingContent['heavy-duty-title'] || ''}
                                    onChange={(e) => updateContent('heavy-duty-title', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none"
                                    placeholder="Heavy Duty"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Highlight</label>
                                <input
                                    type="text"
                                    value={editingContent['heavy-duty-highlight'] || ''}
                                    onChange={(e) => updateContent('heavy-duty-highlight', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none"
                                    placeholder="Pallets"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={editingContent['heavy-duty-description'] || ''}
                                    onChange={(e) => updateContent('heavy-duty-description', e.target.value)}
                                    rows={4}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none"
                                    placeholder="PAFT Heavy-Duty Pallets are designed to deliver..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Info Cards Section */}
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                        <h3 className="text-blue-400 font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Info Cards Section
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Design Card */}
                            <div className="space-y-3">
                                <h4 className="text-blue-300 font-medium">Design Card</h4>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={editingContent['design-title'] || ''}
                                        onChange={(e) => updateContent('design-title', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                        placeholder="Design"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                                    <textarea
                                        value={editingContent['design-content'] || ''}
                                        onChange={(e) => updateContent('design-content', e.target.value)}
                                        rows={4}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                        placeholder="Best used for racking system • Can be reinforced..."
                                    />
                                </div>
                            </div>
                            {/* Material Card */}
                            <div className="space-y-3">
                                <h4 className="text-blue-300 font-medium">Material Card</h4>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={editingContent['material-title'] || ''}
                                        onChange={(e) => updateContent('material-title', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                        placeholder="Material"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                                    <textarea
                                        value={editingContent['material-content'] || ''}
                                        onChange={(e) => updateContent('material-content', e.target.value)}
                                        rows={4}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                        placeholder="Can be produced in 6 different formulas..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Video Section */}
                    <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
                        <h3 className="text-purple-400 font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Video Section
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Video Title</label>
                                <input
                                    type="text"
                                    value={editingContent['video-title'] || ''}
                                    onChange={(e) => updateContent('video-title', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                                    placeholder="Product"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Video Highlight</label>
                                <input
                                    type="text"
                                    value={editingContent['video-highlight'] || ''}
                                    onChange={(e) => updateContent('video-highlight', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                                    placeholder="Testing"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Video Description</label>
                                <input
                                    type="text"
                                    value={editingContent['video-description'] || ''}
                                    onChange={(e) => updateContent('video-description', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                                    placeholder="Watch our rigorous quality testing in action"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Light Duty Hero Section */}
                    <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                        <h3 className="text-green-400 font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            Light Duty Hero Section
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={editingContent['light-duty-title'] || ''}
                                    onChange={(e) => updateContent('light-duty-title', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                                    placeholder="Light Duty"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Highlight</label>
                                <input
                                    type="text"
                                    value={editingContent['light-duty-highlight'] || ''}
                                    onChange={(e) => updateContent('light-duty-highlight', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                                    placeholder="Pallets"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={editingContent['light-duty-description'] || ''}
                                    onChange={(e) => updateContent('light-duty-description', e.target.value)}
                                    rows={4}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                                    placeholder="Several pallets starting at 7kg/pallet..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Light Duty Info Features */}
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                        <h3 className="text-emerald-400 font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Light Duty Features
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2, 3, 4, 5, 6].map(num => (
                                <div key={num}>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Feature {num}</label>
                                    <input
                                        type="text"
                                        value={editingContent[`feature${num}`] || ''}
                                        onChange={(e) => updateContent(`feature${num}`, e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
                                        placeholder={`Feature ${num}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rental Hero Section */}
                    <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-4">
                        <h3 className="text-violet-400 font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Rental Hero Section
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={editingContent['rental-title'] || ''}
                                    onChange={(e) => updateContent('rental-title', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-violet-500 focus:outline-none"
                                    placeholder="Rental"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Highlight</label>
                                <input
                                    type="text"
                                    value={editingContent['rental-highlight'] || ''}
                                    onChange={(e) => updateContent('rental-highlight', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-violet-500 focus:outline-none"
                                    placeholder="Pallets"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={editingContent['rental-description'] || ''}
                                    onChange={(e) => updateContent('rental-description', e.target.value)}
                                    rows={4}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-violet-500 focus:outline-none"
                                    placeholder="PAFT offers a unique, innovative approach..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4">
                        <h3 className="text-indigo-400 font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 12l2 2 4-4" />
                            </svg>
                            Call to Action Section
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">CTA Title</label>
                                <input
                                    type="text"
                                    value={editingContent['cta-title'] || ''}
                                    onChange={(e) => updateContent('cta-title', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none"
                                    placeholder="Need"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">CTA Highlight</label>
                                <input
                                    type="text"
                                    value={editingContent['cta-highlight'] || ''}
                                    onChange={(e) => updateContent('cta-highlight', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none"
                                    placeholder="Custom Solutions?"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">CTA Description</label>
                                <input
                                    type="text"
                                    value={editingContent['cta-description'] || ''}
                                    onChange={(e) => updateContent('cta-description', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none"
                                    placeholder="We can manufacture pallets according to your specific requirements"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Button 1 Text</label>
                                    <input
                                        type="text"
                                        value={editingContent['cta-button1-text'] || ''}
                                        onChange={(e) => updateContent('cta-button1-text', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none"
                                        placeholder="Request a Quote →"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Button 2 Text</label>
                                    <input
                                        type="text"
                                        value={editingContent['cta-button2-text'] || ''}
                                        onChange={(e) => updateContent('cta-button2-text', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none"
                                        placeholder="Contact Our Team"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Specifications */}
                    <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4">
                        <h3 className="text-orange-400 font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Product Specifications
                        </h3>
                        
                        {/* Heavy Duty Products */}
                        <div className="space-y-4 mb-6">
                            <h4 className="text-orange-300 font-medium">Heavy Duty Products</h4>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <ProductSpecificationCard
                                    productKey="product-m1"
                                    productName="M1 Heavy Duty Pallet"
                                    editingContent={editingContent}
                                    updateContent={updateContent}
                                />
                                <ProductSpecificationCard
                                    productKey="product-m2"
                                    productName="M2 Heavy Duty Pallet"
                                    editingContent={editingContent}
                                    updateContent={updateContent}
                                />
                                <ProductSpecificationCard
                                    productKey="product-m4"
                                    productName="M4 Heavy Duty Pallet"
                                    editingContent={editingContent}
                                    updateContent={updateContent}
                                />
                                <ProductSpecificationCard
                                    productKey="product-m5"
                                    productName="M5 Heavy Duty Pallet"
                                    editingContent={editingContent}
                                    updateContent={updateContent}
                                />
                                <ProductSpecificationCard
                                    productKey="product-m6"
                                    productName="M6 Heavy Duty Pallet"
                                    editingContent={editingContent}
                                    updateContent={updateContent}
                                />
                                <ProductSpecificationCard
                                    productKey="product-m7"
                                    productName="M7 Heavy Duty Pallet"
                                    editingContent={editingContent}
                                    updateContent={updateContent}
                                />
                                <ProductSpecificationCard
                                    productKey="product-m8"
                                    productName="M8 Heavy Duty Pallet"
                                    editingContent={editingContent}
                                    updateContent={updateContent}
                                />
                                <ProductSpecificationCard
                                    productKey="product-m9"
                                    productName="M9 Heavy Duty Pallet"
                                    editingContent={editingContent}
                                    updateContent={updateContent}
                                />
                            </div>
                        </div>

                        {/* Light Duty Products */}
                        <div className="space-y-4 mb-6">
                            <h4 className="text-green-300 font-medium">Light Duty Products</h4>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <LightDutyProductCard
                                    productKey="product-double-deck"
                                    productName="Double Deck Light Pallet"
                                    editingContent={editingContent}
                                    updateContent={updateContent}
                                />
                                <LightDutyProductCard
                                    productKey="product-9-leg"
                                    productName="9 Leg Light Pallet"
                                    editingContent={editingContent}
                                    updateContent={updateContent}
                                />
                            </div>
                        </div>

                        {/* Rental Product */}
                        <div className="space-y-4">
                            <h4 className="text-purple-300 font-medium">Rental Product</h4>
                            <div className="grid grid-cols-1 max-w-md">
                                <ProductSpecificationCard
                                    productKey="product-rental"
                                    productName="Rental Pallet"
                                    editingContent={editingContent}
                                    updateContent={updateContent}
                                />
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
                            {saving ? 'Saving...' : 'Update Plastic Pallets Page'}
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