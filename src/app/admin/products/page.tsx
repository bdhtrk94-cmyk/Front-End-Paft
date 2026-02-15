'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { adminProductsApi, type ProductResponse } from '@/lib/api';
import { useSearchParams } from 'next/navigation';

type FormData = {
    name: string; nameAr: string; price: number; originalPrice: number;
    category: string; categoryAr: string; image: string; badge: string;
    inStock: boolean; description: string; descriptionAr: string;
    fullDescription: string; fullDescriptionAr: string;
};

const emptyForm: FormData = {
    name: '', nameAr: '', price: 0, originalPrice: 0,
    category: '', categoryAr: '', image: '', badge: '',
    inStock: true, description: '', descriptionAr: '',
    fullDescription: '', fullDescriptionAr: '',
};

export default function AdminProductsPage() {
    const { token, user } = useAuth();
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<FormData>(emptyForm);
    const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; name: string } | null>(null);

    useEffect(() => {
        if (searchParams.get('action') === 'add') openAdd();
    }, [searchParams]);

    const fetchProducts = async () => {
        console.log('=== STARTING FETCH PRODUCTS ===');
        console.log('Token from useAuth:', !!token);
        console.log('User from useAuth:', user);
        
        if (!token) {
            console.log('No token found, setting error');
            setError('No authentication token found. Please login again.');
            return;
        }
        
        console.log('=== DEBUG INFO ===');
        console.log('Token exists:', !!token);
        console.log('Token preview:', token?.substring(0, 50) + '...');
        console.log('User:', user);
        console.log('User role:', user?.role);
        console.log('API URL:', `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/products`);
        console.log('==================');
        
        setLoading(true);
        setError('');
        
        try {
            console.log('About to call adminProductsApi.getAll...');
            const data = await adminProductsApi.getAll(token);
            console.log('Products loaded successfully:', data.length, 'items');
            setProducts(data);
        } catch (err: any) {
            console.error('Failed to load products:', err);
            console.error('Error details:', {
                message: err.message,
                statusCode: err.statusCode,
                stack: err.stack
            });
            
            if (err.statusCode === 403) {
                setError(`Access denied. User role: ${user?.role}. Please check your admin permissions.`);
            } else if (err.statusCode === 401) {
                setError('Authentication failed. Please login again.');
            } else {
                setError(err.message || 'Failed to load products. Please try again.');
            }
        }
        finally { 
            console.log('Setting loading to false');
            setLoading(false); 
        }
    };

    useEffect(() => { fetchProducts(); }, [token]);

    const openAdd = () => { setEditingId(null); setForm(emptyForm); setActiveTab('en'); setShowModal(true); };
    const openEdit = (p: ProductResponse) => {
        setEditingId(p.id);
        setForm({
            name: p.name || '', nameAr: p.nameAr || '',
            price: p.price || 0, originalPrice: p.originalPrice || 0,
            category: p.category || '', categoryAr: p.categoryAr || '',
            image: p.image || '', badge: p.badge || '',
            inStock: p.inStock, description: p.description || '',
            descriptionAr: p.descriptionAr || '',
            fullDescription: p.fullDescription || '',
            fullDescriptionAr: p.fullDescriptionAr || '',
        });
        setActiveTab('en');
        setShowModal(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        setSaving(true); setError('');
        try {
            const body: Record<string, unknown> = { ...form };
            if (editingId) {
                await adminProductsApi.update(editingId, body, token);
                setSuccessMsg('Product updated!');
            } else {
                await adminProductsApi.create(body, token);
                setSuccessMsg('Product created!');
            }
            setShowModal(false);
            fetchProducts();
        } catch (e: any) { setError(e.message || 'Failed to save'); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id: number) => {
        if (!token) return;
        try {
            console.log('Permanently deleting product with ID:', id);
            await adminProductsApi.delete(id, token);
            console.log('Product permanently deleted successfully');
            setSuccessMsg('Product deleted permanently!');
            setDeleteConfirm(null);
            // Refresh the products list to show updated data
            await fetchProducts();
        } catch (error: any) {
            console.error('Failed to delete product:', error);
            setError(`Failed to delete: ${error.message || 'Unknown error'}`);
        }
    };

    useEffect(() => { if (successMsg) { const t = setTimeout(() => setSuccessMsg(''), 3000); return () => clearTimeout(t); } }, [successMsg]);

    const updateForm = (field: keyof FormData, value: string | boolean | number) => setForm({ ...form, [field]: value });

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Products</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage products with bilingual content</p>
                </div>
                <button onClick={openAdd} className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
                    + Add Product
                </button>
            </div>

            {successMsg && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm">{successMsg}</div>}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
                    <div className="font-medium mb-1">Error Loading Products</div>
                    <div>{error}</div>
                    <div className="mt-2 text-xs text-red-300">
                        <strong>Troubleshooting:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>Make sure the backend server is running on port 3001</li>
                            <li>Check if your user role is 'admin' or 'super_admin'</li>
                            <li>Try logging out and logging back in</li>
                            <li>Check browser console for detailed error logs</li>
                        </ul>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full sm:w-80 bg-[#151b2e] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500/50" placeholder="Search products..." />
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-[#151b2e] border border-white/5 rounded-2xl p-5 animate-pulse">
                            <div className="h-32 bg-white/5 rounded-xl mb-4" />
                            <div className="h-4 bg-white/5 rounded mb-2 w-3/4" />
                            <div className="h-3 bg-white/5 rounded w-1/2" />
                        </div>
                    ))
                ) : filtered.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500 text-sm">No products found.</div>
                ) : (
                    filtered.map((p) => (
                        <div key={p.id} className="bg-[#151b2e] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all group">
                            {/* Image */}
                            <div className="h-40 bg-white/5 relative overflow-hidden">
                                {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                                {p.badge && (
                                    <span className="absolute top-3 left-3 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase">{p.badge}</span>
                                )}
                                <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-lg ${p.inStock ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                                    {p.inStock ? 'In Stock' : 'Out'}
                                </span>
                            </div>
                            <div className="p-4">
                                <h3 className="text-white font-semibold text-sm mb-1 truncate">{p.name}</h3>
                                <p className="text-gray-500 text-xs mb-2">{p.category}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-white font-bold text-lg">${p.price}</span>
                                        {(p.originalPrice ?? 0) > 0 && <span className="text-gray-600 text-xs line-through">${p.originalPrice}</span>}
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => openEdit(p)} className="text-gray-400 hover:text-amber-400 p-1.5 rounded-lg hover:bg-amber-500/10 transition-all">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </button>
                                        <button onClick={() => setDeleteConfirm({ id: p.id, name: p.name })} className="text-gray-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Delete Confirm Popup */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
                    <div className="bg-[#151b2e] border border-white/10 rounded-2xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </div>
                        <h3 className="text-lg font-bold text-white text-center mb-2">Delete Product Permanently</h3>
                        <p className="text-gray-400 text-sm text-center mb-6">
                            Are you sure you want to permanently delete <span className="text-white font-semibold">&quot;{deleteConfirm.name}&quot;</span>? This action cannot be undone and the product will be removed from the database completely.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => handleDelete(deleteConfirm.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-all">
                                Delete Permanently
                            </button>
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-white/5 border border-white/10 text-gray-300 py-2.5 rounded-xl font-semibold text-sm hover:bg-white/10 transition-all">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#151b2e] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-[#151b2e] border-b border-white/5 px-6 py-4 flex items-center justify-between z-10">
                            <h2 className="text-lg font-bold text-white">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white p-1">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-5">
                            {/* Language tabs */}
                            <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl w-fit">
                                <button type="button" onClick={() => setActiveTab('en')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'en' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>🇬🇧 English</button>
                                <button type="button" onClick={() => setActiveTab('ar')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'ar' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>🇸🇦 العربية</button>
                            </div>

                            {activeTab === 'en' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Product Name *</label>
                                            <input required value={form.name} onChange={(e) => updateForm('name', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Category *</label>
                                            <input required value={form.category} onChange={(e) => updateForm('category', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Price *</label>
                                            <input required type="number" step="0.01" min={0} value={form.price} onChange={(e) => updateForm('price', parseFloat(e.target.value) || 0)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Original Price</label>
                                            <input type="number" step="0.01" min={0} value={form.originalPrice} onChange={(e) => updateForm('originalPrice', parseFloat(e.target.value) || 0)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Badge</label>
                                            <input value={form.badge} onChange={(e) => updateForm('badge', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all" placeholder="e.g. New, Hot" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Image URL *</label>
                                        <input required value={form.image} onChange={(e) => updateForm('image', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all" placeholder="https://..." />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Description *</label>
                                        <textarea required rows={3} value={form.description} onChange={(e) => updateForm('description', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-y" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Description</label>
                                        <textarea rows={3} value={form.fullDescription} onChange={(e) => updateForm('fullDescription', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-y" />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'ar' && (
                                <div className="space-y-4" dir="rtl">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1.5">اسم المنتج</label>
                                            <input value={form.nameAr} onChange={(e) => updateForm('nameAr', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-right" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1.5">الفئة</label>
                                            <input value={form.categoryAr} onChange={(e) => updateForm('categoryAr', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-right" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">الوصف</label>
                                        <textarea rows={3} value={form.descriptionAr} onChange={(e) => updateForm('descriptionAr', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-y text-right" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">الوصف الكامل</label>
                                        <textarea rows={3} value={form.fullDescriptionAr} onChange={(e) => updateForm('fullDescriptionAr', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-y text-right" />
                                    </div>
                                </div>
                            )}

                            {/* In Stock */}
                            <div className="pt-2 border-t border-white/5">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={form.inStock} onChange={(e) => updateForm('inStock', e.target.checked)} className="w-4 h-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500/50" />
                                    <span className="text-sm text-gray-300">In Stock</span>
                                </label>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={saving} className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50">
                                    {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-white/5 border border-white/10 text-gray-300 py-2.5 rounded-xl font-semibold text-sm hover:bg-white/10 transition-all">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
