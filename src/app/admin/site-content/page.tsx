'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { siteContentApi, type SiteContentResponse } from '@/lib/api';
import { useSearchParams } from 'next/navigation';

type FormData = {
    sectionKey: string; contentType: string;
    titleEn: string; contentEn: string;
    titleAr: string; contentAr: string;
    sortOrder: number;
};

const emptyForm: FormData = {
    sectionKey: '', contentType: 'text',
    titleEn: '', contentEn: '',
    titleAr: '', contentAr: '',
    sortOrder: 0,
};

export default function AdminSiteContentPage() {
    const { token } = useAuth();
    const searchParams = useSearchParams();
    const [items, setItems] = useState<SiteContentResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<FormData>(emptyForm);
    const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    // Preview
    const [previewItem, setPreviewItem] = useState<SiteContentResponse | null>(null);
    const [previewLang, setPreviewLang] = useState<'en' | 'ar'>('en');
    const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; key: string } | null>(null);

    useEffect(() => {
        if (searchParams.get('action') === 'add') openAdd();
    }, [searchParams]);

    const fetchItems = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await siteContentApi.getAll(token, true);
            setItems(data);
        } catch { setError('Failed to load content'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchItems(); }, [token]);

    const openAdd = () => { setEditingId(null); setForm(emptyForm); setActiveTab('en'); setShowModal(true); };
    const openEdit = (item: SiteContentResponse) => {
        setEditingId(item.id);
        setForm({
            sectionKey: item.sectionKey, contentType: item.contentType,
            titleEn: item.titleEn || '', contentEn: item.contentEn || '',
            titleAr: item.titleAr || '', contentAr: item.contentAr || '',
            sortOrder: item.sortOrder,
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
                await siteContentApi.update(editingId, body, token);
                setSuccessMsg('Content saved as draft!');
            } else {
                await siteContentApi.create(body, token);
                setSuccessMsg('Content created as draft!');
            }
            setShowModal(false);
            fetchItems();
        } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Failed to save'); }
        finally { setSaving(false); }
    };

    const handlePublish = async (id: number) => {
        if (!token) return;
        try {
            await siteContentApi.publish(id, token);
            setSuccessMsg('Content published!');
            fetchItems();
        } catch { setError('Failed to publish'); }
    };

    const handleDelete = async (id: number) => {
        if (!token) return;
        try {
            await siteContentApi.delete(id, token);
            setSuccessMsg('Content deleted!');
            setDeleteConfirm(null);
            fetchItems();
        } catch { setError('Failed to delete'); }
    };

    useEffect(() => { if (successMsg) { const t = setTimeout(() => setSuccessMsg(''), 3000); return () => clearTimeout(t); } }, [successMsg]);

    const updateForm = (field: keyof FormData, value: string | number) => setForm({ ...form, [field]: value });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Site Content</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage website text blocks with EN/AR translations</p>
                </div>
                <button onClick={openAdd} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                    + Add Content
                </button>
            </div>

            {successMsg && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm">{successMsg}</div>}
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>}

            {/* Content List */}
            <div className="space-y-3">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-[#151b2e] border border-white/5 rounded-2xl p-5 animate-pulse">
                            <div className="h-4 bg-white/5 rounded mb-3 w-1/3" />
                            <div className="h-3 bg-white/5 rounded w-2/3" />
                        </div>
                    ))
                ) : items.length === 0 ? (
                    <div className="bg-[#151b2e] border border-white/5 rounded-2xl p-12 text-center">
                        <p className="text-gray-500 text-sm">No content blocks yet. Create your first one!</p>
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="bg-[#151b2e] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <code className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded-lg font-mono">
                                            {item.sectionKey}
                                        </code>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${item.isDraft
                                            ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                            }`}>
                                            {item.isDraft ? 'Draft' : 'Published'}
                                        </span>
                                        <span className="text-[10px] text-gray-600 bg-white/5 px-2 py-0.5 rounded">{item.contentType}</span>
                                    </div>
                                    {item.titleEn && <p className="text-white text-sm font-medium mb-1">{item.titleEn}</p>}
                                    {item.contentEn && <p className="text-gray-500 text-xs line-clamp-2">{item.contentEn}</p>}
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className={`text-[10px] ${item.titleAr || item.contentAr ? 'text-emerald-400' : 'text-gray-600'}`}>
                                            AR: {item.titleAr || item.contentAr ? '✓ Translated' : '— Missing'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <button onClick={() => setPreviewItem(item)} className="text-gray-400 hover:text-blue-400 p-2 rounded-lg hover:bg-blue-500/10 transition-all" title="Preview">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    </button>
                                    {item.isDraft && (
                                        <button onClick={() => handlePublish(item.id)} className="text-gray-400 hover:text-emerald-400 p-2 rounded-lg hover:bg-emerald-500/10 transition-all" title="Publish">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </button>
                                    )}
                                    <button onClick={() => openEdit(item)} className="text-gray-400 hover:text-amber-400 p-2 rounded-lg hover:bg-amber-500/10 transition-all" title="Edit">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    </button>
                                    <button onClick={() => setDeleteConfirm({ id: item.id, key: item.sectionKey })} className="text-gray-400 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-all" title="Delete">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
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
                        <h3 className="text-lg font-bold text-white text-center mb-2">Delete Content</h3>
                        <p className="text-gray-400 text-sm text-center mb-6">
                            Are you sure you want to delete <span className="text-white font-semibold">&quot;{deleteConfirm.key}&quot;</span>? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => handleDelete(deleteConfirm.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-all">
                                Delete
                            </button>
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-white/5 border border-white/10 text-gray-300 py-2.5 rounded-xl font-semibold text-sm hover:bg-white/10 transition-all">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview modal */}
            {previewItem && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPreviewItem(null)}>
                    <div className="bg-[#151b2e] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-lg font-bold text-white">Content Preview</h2>
                                <code className="text-xs text-purple-400">{previewItem.sectionKey}</code>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setPreviewLang('en')} className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${previewLang === 'en' ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400'}`}>EN</button>
                                <button onClick={() => setPreviewLang('ar')} className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${previewLang === 'ar' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-gray-400'}`}>AR</button>
                                <button onClick={() => setPreviewItem(null)} className="ml-2 text-gray-400 hover:text-white p-1">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>
                        <div className={`bg-white/5 rounded-xl p-5 ${previewLang === 'ar' ? 'text-right' : 'text-left'}`} dir={previewLang === 'ar' ? 'rtl' : 'ltr'}>
                            <h3 className="text-xl font-bold text-white mb-3">
                                {previewLang === 'ar' ? (previewItem.titleAr || <span className="text-gray-600 italic">No Arabic title</span>) : (previewItem.titleEn || <span className="text-gray-600 italic">No title</span>)}
                            </h3>
                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                {previewLang === 'ar' ? (previewItem.contentAr || <span className="text-gray-600 italic">No Arabic content</span>) : (previewItem.contentEn || <span className="text-gray-600 italic">No content</span>)}
                            </p>
                        </div>
                        {previewItem.publishedSnapshot && (
                            <div className="mt-4 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                                <p className="text-xs text-emerald-400 font-semibold mb-2">Last Published Version:</p>
                                <pre className="text-xs text-gray-400 overflow-x-auto">{JSON.stringify(JSON.parse(previewItem.publishedSnapshot), null, 2)}</pre>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#151b2e] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-[#151b2e] border-b border-white/5 px-6 py-4 flex items-center justify-between z-10">
                            <h2 className="text-lg font-bold text-white">{editingId ? 'Edit Content' : 'Add New Content'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white p-1">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-5">
                            {/* Section key + type */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Section Key *</label>
                                    <input required value={form.sectionKey} onChange={(e) => updateForm('sectionKey', e.target.value)} disabled={!!editingId} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all disabled:opacity-50" placeholder="e.g. home.hero.title" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Content Type</label>
                                    <select value={form.contentType} onChange={(e) => updateForm('contentType', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all">
                                        <option value="text" className="bg-[#151b2e]">Text</option>
                                        <option value="html" className="bg-[#151b2e]">HTML</option>
                                        <option value="json" className="bg-[#151b2e]">JSON</option>
                                    </select>
                                </div>
                            </div>

                            {/* Language tabs */}
                            <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl w-fit">
                                <button type="button" onClick={() => setActiveTab('en')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'en' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>🇬🇧 English</button>
                                <button type="button" onClick={() => setActiveTab('ar')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'ar' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>🇸🇦 العربية</button>
                            </div>

                            {activeTab === 'en' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Title (EN)</label>
                                        <input value={form.titleEn} onChange={(e) => updateForm('titleEn', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all" placeholder="English title" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Content (EN)</label>
                                        <textarea rows={6} value={form.contentEn} onChange={(e) => updateForm('contentEn', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-y font-mono" placeholder="English content..." />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'ar' && (
                                <div className="space-y-4" dir="rtl">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">العنوان</label>
                                        <input value={form.titleAr} onChange={(e) => updateForm('titleAr', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-right" placeholder="العنوان بالعربية" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">المحتوى</label>
                                        <textarea rows={6} value={form.contentAr} onChange={(e) => updateForm('contentAr', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-y text-right" placeholder="المحتوى بالعربية..." />
                                    </div>
                                </div>
                            )}

                            {/* Sort order */}
                            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                                <label className="text-sm text-gray-300">Sort Order:</label>
                                <input type="number" min={0} value={form.sortOrder} onChange={(e) => updateForm('sortOrder', parseInt(e.target.value) || 0)} className="w-20 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-purple-500/50" />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={saving} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50">
                                    {saving ? 'Saving...' : editingId ? 'Save as Draft' : 'Create as Draft'}
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
