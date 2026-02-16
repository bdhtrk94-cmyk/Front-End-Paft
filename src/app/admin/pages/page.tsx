'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { adminPagesApi, contentApi, type PageResponse, ContentMapResponse } from '@/lib/api';
import { useSearchParams } from 'next/navigation';
import HomePageEditor from './HomePageEditor';
import AboutPageEditor from './AboutPageEditor';
import OurJourneyPageEditor from './OurJourneyPageEditor';
import { PlasticPalletsPageEditor } from './plastic-pallets';
import TransportLogisticsPageEditor from './TransportLogisticsPageEditor';
import RawMaterialsPageEditor from './RawMaterialsPageEditor';
import InnovativeSolutionsEditor from '@/components/admin/InnovativeSolutionsEditor';

type FormData = {
    title: string; titleAr: string; slug: string;
    content: string; contentAr: string;
    metaTitle: string; metaTitleAr: string;
    metaDescription: string; metaDescriptionAr: string;
    isPublished: boolean; order: number;
};

type AboutPageContent = {
    [key: string]: {
        value: string;
        valueAr?: string;
        id: number;
    };
};

type HomePageContent = {
    [key: string]: {
        value: string;
        valueAr?: string;
        id: number;
    };
};

type OurJourneyPageContent = {
    [key: string]: {
        value: string;
        valueAr?: string;
        id: number;
    };
};

type PlasticPalletsPageContent = {
    [key: string]: {
        value: string;
        valueAr?: string;
        id: number;
    };
};

type TransportLogisticsPageContent = {
    [key: string]: {
        value: string;
        valueAr?: string;
        id: number;
    };
};

type RawMaterialsPageContent = {
    [key: string]: {
        value: string;
        valueAr?: string;
        id: number;
    };
};

const emptyForm: FormData = {
    title: '', titleAr: '', slug: '',
    content: '', contentAr: '',
    metaTitle: '', metaTitleAr: '',
    metaDescription: '', metaDescriptionAr: '',
    isPublished: false, order: 0,
};

export default function AdminPagesPage() {
    const { token } = useAuth();
    const searchParams = useSearchParams();
    const [pages, setPages] = useState<PageResponse[]>([]);
    const [aboutContent, setAboutContent] = useState<AboutPageContent>({});
    const [homeContent, setHomeContent] = useState<HomePageContent>({});
    const [ourJourneyContent, setOurJourneyContent] = useState<OurJourneyPageContent>({});
    const [plasticPalletsContent, setPlasticPalletsContent] = useState<PlasticPalletsPageContent>({});
    const [transportLogisticsContent, setTransportLogisticsContent] = useState<TransportLogisticsPageContent>({});
    const [rawMaterialsContent, setRawMaterialsContent] = useState<RawMaterialsPageContent>({});
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<FormData>(emptyForm);
    const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    // Preview
    const [previewPage, setPreviewPage] = useState<PageResponse | null>(null);
    const [previewLang, setPreviewLang] = useState<'en' | 'ar'>('en');
    const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; title: string } | null>(null);
    // About page editing
    const [showAboutModal, setShowAboutModal] = useState(false);
    // Home page editing
    const [showHomeModal, setShowHomeModal] = useState(false);
    // Our Journey page editing
    const [showOurJourneyModal, setShowOurJourneyModal] = useState(false);
    // Plastic Pallets page editing
    const [showPlasticPalletsModal, setShowPlasticPalletsModal] = useState(false);
    // Transport Logistics page editing
    const [showTransportLogisticsModal, setShowTransportLogisticsModal] = useState(false);
    // Raw Materials page editing
    // Raw Materials page editing
    const [showRawMaterialsModal, setShowRawMaterialsModal] = useState(false);
    // Innovative Solutions page editing
    const [showInnovativeSolutionsModal, setShowInnovativeSolutionsModal] = useState(false);

    useEffect(() => {
        if (searchParams.get('action') === 'add') openAdd();
    }, [searchParams]);

    const fetchPages = async () => {
        if (!token) return;
        setLoading(true);
        try {
            // Fetch data with error handling for each request to prevent one failure from blocking everything
            const pagesPromise = adminPagesApi.getAll(token).catch(e => { console.error('Pages fetch error', e); return []; });
            const aboutPromise = contentApi.getPageContent('about').catch(e => { console.error('About fetch error', e); return {} as ContentMapResponse; });
            const homePromise = contentApi.getHomeContent().catch(e => { console.error('Home fetch error', e); return {} as ContentMapResponse; });
            const journeyPromise = contentApi.getPageContent('our-journey').catch(e => { console.error('Journey fetch error', e); return {} as ContentMapResponse; });
            const plasticPromise = contentApi.getPageContent('plastic-pallets').catch(e => { console.error('Plastic fetch error', e); return {} as ContentMapResponse; });
            const logisticsPromise = contentApi.getPageContent('transport-logistics').catch(e => { console.error('Logistics fetch error', e); return {} as ContentMapResponse; });
            const rawPromise = contentApi.getPageContent('raw-materials').catch(e => { console.error('Raw Materials fetch error', e); return {} as ContentMapResponse; });

            const [pagesData, aboutData, homeData, ourJourneyData, plasticPalletsData, transportLogisticsData, rawMaterialsData] = await Promise.all([
                pagesPromise, aboutPromise, homePromise, journeyPromise, plasticPromise, logisticsPromise, rawPromise
            ]);

            setPages(pagesData);

            // For about content, we need to handle sections separately to avoid key conflicts
            // We'll flatten all content but keep track of which section each key belongs to
            const allAboutContent: { [key: string]: { value: string; valueAr?: string; id: number } } = {};

            // Add hero section content
            if (aboutData['hero']) {
                Object.keys(aboutData['hero']).forEach(key => {
                    allAboutContent[key] = aboutData['hero'][key];
                });
            }

            // Add who-we-are section content
            if (aboutData['who-we-are']) {
                Object.keys(aboutData['who-we-are']).forEach(key => {
                    // For who-we-are section, we need to avoid conflicts with hero section
                    if (key === 'badge-text' || key === 'title') {
                        allAboutContent[`who-${key}`] = aboutData['who-we-are'][key];
                    } else {
                        allAboutContent[key] = aboutData['who-we-are'][key];
                    }
                });
            }

            // Add values section content
            if (aboutData['values']) {
                Object.keys(aboutData['values']).forEach(key => {
                    // For values section, avoid conflicts
                    if (key === 'title' || key === 'subtitle') {
                        allAboutContent[`values-${key}`] = aboutData['values'][key];
                    } else {
                        allAboutContent[key] = aboutData['values'][key];
                    }
                });
            }

            // Add cta section content
            if (aboutData['cta']) {
                Object.keys(aboutData['cta']).forEach(key => {
                    // For cta section, avoid conflicts
                    if (key === 'title' || key === 'description') {
                        allAboutContent[`cta-${key}`] = aboutData['cta'][key];
                    } else {
                        allAboutContent[key] = aboutData['cta'][key];
                    }
                });
            }

            setAboutContent(allAboutContent);

            // Combine both business-units and video-hero content
            const allHomeContent = {
                ...homeData['business-units'] || {},
                ...homeData['video-hero'] || {}
            };
            setHomeContent(allHomeContent);

            // Combine all our-journey content sections
            const allOurJourneyContent: { [key: string]: { value: string; valueAr?: string; id: number } } = {};

            // Add hero section content
            if (ourJourneyData['hero']) {
                Object.keys(ourJourneyData['hero']).forEach(key => {
                    allOurJourneyContent[key] = ourJourneyData['hero'][key];
                });
            }

            // Add timeline section content
            if (ourJourneyData['timeline']) {
                Object.keys(ourJourneyData['timeline']).forEach(key => {
                    allOurJourneyContent[key] = ourJourneyData['timeline'][key];
                });
            }

            // Add eras section content
            if (ourJourneyData['eras']) {
                Object.keys(ourJourneyData['eras']).forEach(key => {
                    allOurJourneyContent[key] = ourJourneyData['eras'][key];
                });
            }

            // Add CTA section content with prefix to avoid conflicts
            if (ourJourneyData['cta']) {
                Object.keys(ourJourneyData['cta']).forEach(key => {
                    allOurJourneyContent[`cta-${key}`] = ourJourneyData['cta'][key];
                });
            }

            setOurJourneyContent(allOurJourneyContent);

            // Combine all plastic-pallets content sections
            const allPlasticPalletsContent: { [key: string]: { value: string; valueAr?: string; id: number } } = {};

            // Add all sections content with their correct keys - include ALL sections from the API
            Object.keys(plasticPalletsData).forEach(section => {
                if (plasticPalletsData[section]) {
                    Object.keys(plasticPalletsData[section]).forEach(key => {
                        // For product sections, create unique keys by combining section and key
                        if (section.startsWith('product-')) {
                            const uniqueKey = `${section}-${key}`;
                            allPlasticPalletsContent[uniqueKey] = plasticPalletsData[section][key];
                        } else {
                            // For non-product sections, use the key as is
                            allPlasticPalletsContent[key] = plasticPalletsData[section][key];
                        }
                    });
                }
            });

            setPlasticPalletsContent(allPlasticPalletsContent);

            // Combine all transport-logistics content sections
            const allTransportLogisticsContent: { [key: string]: { value: string; valueAr?: string; id: number } } = {};

            // Add all sections content with their correct keys
            Object.keys(transportLogisticsData).forEach(section => {
                if (transportLogisticsData[section] && typeof transportLogisticsData[section] === 'object') {
                    Object.keys(transportLogisticsData[section]).forEach(key => {
                        const item = transportLogisticsData[section][key];
                        if (item && typeof item === 'object' && 'value' in item) {
                            // For product sections, create unique keys by combining section and key
                            if (section.startsWith('product-')) {
                                const uniqueKey = `${section}-${key}`;
                                allTransportLogisticsContent[uniqueKey] = item;
                            } else {
                                // For non-product sections, use the key as is
                                allTransportLogisticsContent[key] = item;
                            }
                        }
                    });
                }
            });

            console.log('🔍 All transport logistics content:', allTransportLogisticsContent);
            setTransportLogisticsContent(allTransportLogisticsContent);

            // Combine all raw-materials content sections
            const allRawMaterialsContent: { [key: string]: { value: string; valueAr?: string; id: number } } = {};

            // Add all sections content with their correct keys
            Object.keys(rawMaterialsData).forEach(section => {
                if (rawMaterialsData[section] && typeof rawMaterialsData[section] === 'object') {
                    Object.keys(rawMaterialsData[section]).forEach(key => {
                        const item = rawMaterialsData[section][key];
                        if (item && typeof item === 'object' && 'value' in item) {
                            // For product sections or simple keys, we can just use the key if we seeded it as such
                            // Or use section-key if specified. 
                            // The seed script used straightforward keys like `material-1` section and `title` key.
                            // But let's check how `contentApi.getPageContent` returns it. Usually it groups by section.

                            // Replicating logic similar to transport logistics:
                            if (section.startsWith('material-') || section.startsWith('sheet-')) {
                                const uniqueKey = `${section}-${key}`;
                                allRawMaterialsContent[uniqueKey] = item;
                            } else {
                                allRawMaterialsContent[key] = item;
                            }
                        }
                    });
                }
            });
            setRawMaterialsContent(allRawMaterialsContent);
        } catch { setError('Failed to load pages'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchPages(); }, [token]);

    const openAdd = () => { setEditingId(null); setForm(emptyForm); setActiveTab('en'); setShowModal(true); };
    const openEdit = (page: PageResponse) => {
        setEditingId(page.id);
        setForm({
            title: page.title || '', titleAr: page.titleAr || '',
            slug: page.slug || '', content: page.content || '', contentAr: page.contentAr || '',
            metaTitle: page.metaTitle || '', metaTitleAr: page.metaTitleAr || '',
            metaDescription: page.metaDescription || '', metaDescriptionAr: page.metaDescriptionAr || '',
            isPublished: page.isPublished, order: page.order,
        });
        setActiveTab('en');
        setShowModal(true);
    };

    const openAboutEdit = () => {
        setShowAboutModal(true);
    };

    const openHomeEdit = () => {
        setShowHomeModal(true);
    };

    const openOurJourneyEdit = () => {
        setShowOurJourneyModal(true);
    };

    const openPlasticPalletsEdit = () => {
        setShowPlasticPalletsModal(true);
    };

    const openTransportLogisticsEdit = () => {
        setShowTransportLogisticsModal(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        setSaving(true); setError('');
        try {
            const body: Record<string, unknown> = { ...form };
            if (editingId) {
                await adminPagesApi.update(editingId, body, token);
                setSuccessMsg('Page updated successfully!');
            } else {
                await adminPagesApi.create(body, token);
                setSuccessMsg('Page created successfully!');
            }
            setShowModal(false);
            fetchPages();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to save';
            setError(errorMessage);
        }
        finally { setSaving(false); }
    };

    const handleAboutSave = async (content: { [key: string]: string }) => {
        if (!token) return;
        setSaving(true); setError('');
        try {
            console.log('🔍 Saving about content:', content);

            // Get all about content from API to get the correct IDs
            const allAboutData = await contentApi.getPageContent('about');
            console.log('🔍 Fresh about data:', allAboutData);

            // Prepare bulk update data
            const updates: { id: number; value: string }[] = [];

            Object.keys(content).forEach(key => {
                // Look through all sections to find the key
                Object.keys(allAboutData).forEach(section => {
                    if (allAboutData[section][key]) {
                        updates.push({
                            id: allAboutData[section][key].id,
                            value: content[key]
                        });
                    }
                });
            });

            console.log('🔍 Updates to send:', updates);

            if (updates.length > 0) {
                // Use bulk update API
                await contentApi.bulkUpdate(updates, token);
                setSuccessMsg('About page content updated successfully!');
            } else {
                setError('No valid content items found to update');
            }

            setShowAboutModal(false);
            fetchPages();
        } catch (error: unknown) {
            console.error('🔍 Save error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to save about content';
            setError(errorMessage);
        }
        finally { setSaving(false); }
    };

    const handleHomeSave = async (content: { [key: string]: string }) => {
        if (!token) return;
        setSaving(true); setError('');
        try {
            console.log('🔍 Saving home content:', content);

            // Get all home content from API to get the correct IDs
            const allHomeData = await contentApi.getHomeContent();
            console.log('🔍 Fresh home data:', allHomeData);

            // Prepare bulk update data
            const updates: { id: number; value: string }[] = [];

            Object.keys(content).forEach(key => {
                // Look through all sections to find the key
                Object.keys(allHomeData).forEach(section => {
                    if (allHomeData[section][key]) {
                        updates.push({
                            id: allHomeData[section][key].id,
                            value: content[key]
                        });
                    }
                });
            });

            console.log('🔍 Updates to send:', updates);

            if (updates.length > 0) {
                // Use bulk update API
                await contentApi.bulkUpdate(updates, token);
                setSuccessMsg('Home page content updated successfully!');
            } else {
                setError('No valid content items found to update');
            }

            setShowHomeModal(false);
            fetchPages();
        } catch (error: unknown) {
            console.error('🔍 Save error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to save home content';
            setError(errorMessage);
        }
        finally { setSaving(false); }
    };

    const handleOurJourneySave = async (content: { [key: string]: string }) => {
        if (!token) return;
        setSaving(true); setError('');
        try {
            console.log('🔍 Saving our journey content:', content);

            // Get all our journey content from API to get the correct IDs
            const allOurJourneyData = await contentApi.getPageContent('our-journey');
            console.log('🔍 Fresh our journey data:', allOurJourneyData);

            // Prepare bulk update data
            const updates: { id: number; value: string }[] = [];

            Object.keys(content).forEach(key => {
                // Look through all sections to find the key
                Object.keys(allOurJourneyData).forEach(section => {
                    if (allOurJourneyData[section][key]) {
                        updates.push({
                            id: allOurJourneyData[section][key].id,
                            value: content[key]
                        });
                    }
                });
            });

            console.log('🔍 Updates to send:', updates);

            if (updates.length > 0) {
                // Use bulk update API
                await contentApi.bulkUpdate(updates, token);
                setSuccessMsg('Our Journey page content updated successfully!');
            } else {
                setError('No valid content items found to update');
            }

            setShowOurJourneyModal(false);
            fetchPages();
        } catch (error: unknown) {
            console.error('🔍 Save error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to save our journey content';
            setError(errorMessage);
        }
        finally { setSaving(false); }
    };

    const handlePlasticPalletsSave = async (content: { [key: string]: string }) => {
        if (!token) return;
        setSaving(true); setError('');
        try {
            console.log('🔍 Saving plastic pallets content:', content);

            // Get all plastic pallets content from API to get the correct IDs
            const allPlasticPalletsData = await contentApi.getPageContent('plastic-pallets');
            console.log('🔍 Fresh plastic pallets data:', allPlasticPalletsData);

            // Prepare bulk update data
            const updates: { id: number; value: string }[] = [];

            Object.keys(content).forEach(key => {
                // Handle product-specific keys (e.g., "product-m1-product-name")
                if (key.includes('product-') && key.includes('-')) {
                    const parts = key.split('-');
                    if (parts.length >= 3) {
                        const section = parts.slice(0, 2).join('-'); // e.g., "product-m1"
                        const field = parts.slice(2).join('-'); // e.g., "product-name"

                        // Look for the content item in the correct section
                        if (allPlasticPalletsData[section] && allPlasticPalletsData[section][field]) {
                            updates.push({
                                id: allPlasticPalletsData[section][field].id,
                                value: content[key]
                            });
                        }
                    }
                } else {
                    // Handle regular keys (non-product specific)
                    // Look through all sections to find the key
                    Object.keys(allPlasticPalletsData).forEach(section => {
                        if (allPlasticPalletsData[section][key]) {
                            updates.push({
                                id: allPlasticPalletsData[section][key].id,
                                value: content[key]
                            });
                        }
                    });
                }
            });

            console.log('🔍 Updates to send:', updates);

            if (updates.length > 0) {
                // Use bulk update API
                await contentApi.bulkUpdate(updates, token);
                setSuccessMsg('Plastic Pallets page content updated successfully!');
            } else {
                setError('No valid content items found to update');
            }

            setShowPlasticPalletsModal(false);
            fetchPages();
        } catch (error: unknown) {
            console.error('🔍 Save error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to save plastic pallets content';
            setError(errorMessage);
        }
        finally { setSaving(false); }
    };

    const handleTransportLogisticsSave = async (content: { [key: string]: string }) => {
        if (!token) return;
        setSaving(true); setError('');
        try {
            console.log('🔍 Saving transport logistics content:', content);

            // Get all transport logistics content from API to get the correct IDs
            const allTransportLogisticsData = await contentApi.getPageContent('transport-logistics');
            console.log('🔍 Fresh transport logistics data:', allTransportLogisticsData);

            // Prepare bulk update data
            const updates: { id: number; value: string }[] = [];

            Object.keys(content).forEach(key => {
                // Handle product-specific keys (e.g., "product-1-title")
                if (key.includes('product-') && key.includes('-')) {
                    const parts = key.split('-');
                    if (parts.length >= 3) {
                        const section = parts.slice(0, 2).join('-'); // e.g., "product-1"
                        const field = parts.slice(2).join('-'); // e.g., "title"

                        // Look for the content item in the correct section
                        if (allTransportLogisticsData[section] && allTransportLogisticsData[section][field]) {
                            updates.push({
                                id: allTransportLogisticsData[section][field].id,
                                value: content[key]
                            });
                        }
                    }
                } else {
                    // Handle regular keys (non-product specific)
                    // Look through all sections to find the key
                    Object.keys(allTransportLogisticsData).forEach(section => {
                        if (allTransportLogisticsData[section][key]) {
                            updates.push({
                                id: allTransportLogisticsData[section][key].id,
                                value: content[key]
                            });
                        }
                    });
                }
            });

            console.log('🔍 Updates to send:', updates);

            if (updates.length > 0) {
                // Use bulk update API
                await contentApi.bulkUpdate(updates, token);
                setSuccessMsg('Transport Logistics page content updated successfully!');
            } else {
                setError('No valid content items found to update');
            }

            setShowTransportLogisticsModal(false);
            fetchPages();
        } catch (error: unknown) {
            console.error('🔍 Save error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to save transport logistics content';
            setError(errorMessage);
        }
        finally { setSaving(false); }
    };


    const openRawMaterialsEdit = () => {
        setShowRawMaterialsModal(true);
    };

    const handleRawMaterialsSave = async (content: { [key: string]: string }) => {
        if (!token) return;
        setSaving(true); setError('');
        try {
            console.log('🔍 Saving raw materials content:', content);

            // Get all raw materials content from API to get the correct IDs
            const allRawMaterialsData = await contentApi.getPageContent('raw-materials');
            console.log('🔍 Fresh raw materials data:', allRawMaterialsData);

            // Prepare bulk update data
            const updates: { id: number; value: string }[] = [];

            Object.keys(content).forEach(key => {
                let found = false;
                // Try to find the key in the fetched data structure
                Object.keys(allRawMaterialsData).forEach(section => {
                    // Direct key match
                    if (allRawMaterialsData[section][key]) {
                        updates.push({ id: allRawMaterialsData[section][key].id, value: content[key] });
                        found = true;
                    }
                    if (!found) {
                        // Check for composite keys like material-1-title
                        if (key.startsWith(section + '-') && allRawMaterialsData[section][key.replace(section + '-', '')]) {
                            updates.push({ id: allRawMaterialsData[section][key.replace(section + '-', '')].id, value: content[key] });
                            found = true;
                        }
                    }
                });
            });

            console.log('🔍 Updates to send:', updates);

            if (updates.length > 0) {
                // Use bulk update API
                await contentApi.bulkUpdate(updates, token);
                setSuccessMsg('Raw Materials page content updated successfully!');
            } else {
                setError('No valid content items found to update');
            }

            setShowRawMaterialsModal(false);
            fetchPages();
        } catch (error: unknown) {
            console.error('🔍 Save error:', error);
            setError(error instanceof Error ? error.message : 'Failed to save raw materials content');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!token) return;
        try {
            await adminPagesApi.delete(id, token);
            setSuccessMsg('Page deleted!');
            setDeleteConfirm(null);
            fetchPages();
        } catch { setError('Failed to delete'); }
    };

    useEffect(() => { if (successMsg) { const t = setTimeout(() => setSuccessMsg(''), 3000); return () => clearTimeout(t); } }, [successMsg]);

    const updateForm = (field: keyof FormData, value: string | boolean | number) => setForm({ ...form, [field]: value });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Pages</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage website pages with bilingual content</p>
                </div>
                <button onClick={openAdd} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                    + Add Page
                </button>
            </div>

            {/* Notifications */}
            {successMsg && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm">{successMsg}</div>
            )}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>
            )}

            {/* Table */}
            <div className="bg-[#151b2e] border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Title</th>
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Slug</th>
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Arabic</th>
                                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Home Page Row */}
                            <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors bg-blue-500/5">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                        <p className="text-white text-sm font-medium">Home Page</p>
                                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">Dynamic Content</span>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <code className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">/</code>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                        Published
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="text-xs text-gray-600">— Not applicable</span>
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={openHomeEdit} className="text-gray-400 hover:text-amber-400 p-1.5 rounded-lg hover:bg-amber-500/10 transition-all" title="Edit Home Content">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            {/* About Page Row */}
                            <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors bg-cyan-500/5">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                        <p className="text-white text-sm font-medium">About Page</p>
                                        <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">Dynamic Content</span>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <code className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">/about</code>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                        Published
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="text-xs text-gray-600">— Not applicable</span>
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={openAboutEdit} className="text-gray-400 hover:text-amber-400 p-1.5 rounded-lg hover:bg-amber-500/10 transition-all" title="Edit About Content">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            {/* Our Journey Page Row */}
                            <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors bg-purple-500/5">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                        <p className="text-white text-sm font-medium">Our Journey Page</p>
                                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">Dynamic Content</span>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <code className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">/our-journey</code>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                        Published
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="text-xs text-gray-600">— Not applicable</span>
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={openOurJourneyEdit} className="text-gray-400 hover:text-amber-400 p-1.5 rounded-lg hover:bg-amber-500/10 transition-all" title="Edit Our Journey Content">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            {/* Plastic Pallets Page Row */}
                            <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors bg-teal-500/5">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                                        <p className="text-white text-sm font-medium">Plastic Pallets Page</p>
                                        <span className="text-xs bg-teal-500/20 text-teal-400 px-2 py-0.5 rounded-full">Dynamic Content</span>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <code className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">/products/plastic-pallets</code>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                        Published
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="text-xs text-gray-600">— Not applicable</span>
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={openPlasticPalletsEdit} className="text-gray-400 hover:text-amber-400 p-1.5 rounded-lg hover:bg-amber-500/10 transition-all" title="Edit Plastic Pallets Content">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            {/* Transport Logistics Page Row */}
                            <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors bg-orange-500/5">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                        <p className="text-white text-sm font-medium">Transport Logistics Page</p>
                                        <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">Dynamic Content</span>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <code className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">/products/transport-logistics</code>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                        Published
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="text-xs text-gray-600">— Not applicable</span>
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={openTransportLogisticsEdit} className="text-gray-400 hover:text-amber-400 p-1.5 rounded-lg hover:bg-amber-500/10 transition-all" title="Edit Transport Logistics Content">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            {/* Raw Materials Page Row */}
                            <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors bg-pink-500/5">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                                        <p className="text-white text-sm font-medium">Raw Materials Page</p>
                                        <span className="text-xs bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full">Dynamic Content</span>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <code className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">/products/raw-materials</code>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                        Published
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="text-xs text-gray-600">— Not applicable</span>
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={openRawMaterialsEdit} className="text-gray-400 hover:text-amber-400 p-1.5 rounded-lg hover:bg-amber-500/10 transition-all" title="Edit Raw Materials Content">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            {/* Innovative Solutions Page Row */}
                            <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors bg-indigo-500/5">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                                        <p className="text-white text-sm font-medium">Innovative Solutions</p>
                                        <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">Dynamic Content</span>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <code className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">/innovative-solutions</code>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                        Published
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="text-xs text-gray-600">— Not applicable</span>
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => setShowInnovativeSolutionsModal(true)} className="text-gray-400 hover:text-amber-400 p-1.5 rounded-lg hover:bg-amber-500/10 transition-all" title="Edit Content">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="border-b border-white/5">
                                        <td colSpan={5} className="px-5 py-4"><div className="h-4 bg-white/5 rounded animate-pulse" /></td>
                                    </tr>
                                ))
                            ) : pages.length === 0 ? (
                                <tr><td colSpan={5} className="text-gray-500 text-center py-12 text-sm">No pages found. Create your first page!</td></tr>
                            ) : (
                                pages.map((page) => (
                                    <tr key={page.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <td className="px-5 py-4">
                                            <p className="text-white text-sm font-medium">{page.title}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <code className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">{page.slug}</code>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${page.isPublished ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${page.isPublished ? 'bg-emerald-400' : 'bg-yellow-400'}`} />
                                                {page.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`text-xs ${page.titleAr ? 'text-emerald-400' : 'text-gray-600'}`}>
                                                {page.titleAr ? '✓ Translated' : '— Missing'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => setPreviewPage(page)} className="text-gray-400 hover:text-blue-400 p-1.5 rounded-lg hover:bg-blue-500/10 transition-all" title="Preview">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                </button>
                                                <button onClick={() => openEdit(page)} className="text-gray-400 hover:text-amber-400 p-1.5 rounded-lg hover:bg-amber-500/10 transition-all" title="Edit">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                </button>
                                                <button onClick={() => setDeleteConfirm({ id: page.id, title: page.title })} className="text-gray-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all" title="Delete">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirm Popup */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
                    <div className="bg-[#151b2e] border border-white/10 rounded-2xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </div>
                        <h3 className="text-lg font-bold text-white text-center mb-2">Delete Page</h3>
                        <p className="text-gray-400 text-sm text-center mb-6">
                            Are you sure you want to delete <span className="text-white font-semibold">&quot;{deleteConfirm.title}&quot;</span>? This action cannot be undone.
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
            {previewPage && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPreviewPage(null)}>
                    <div className="bg-[#151b2e] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-white">Page Preview</h2>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setPreviewLang('en')} className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${previewLang === 'en' ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}>EN</button>
                                <button onClick={() => setPreviewLang('ar')} className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${previewLang === 'ar' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}>AR</button>
                                <button onClick={() => setPreviewPage(null)} className="ml-2 text-gray-400 hover:text-white p-1">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>
                        <div className={`${previewLang === 'ar' ? 'text-right' : 'text-left'}`} dir={previewLang === 'ar' ? 'rtl' : 'ltr'}>
                            <h3 className="text-xl font-bold text-white mb-2">
                                {previewLang === 'ar' ? (previewPage.titleAr || <span className="text-gray-600 italic">No Arabic title</span>) : previewPage.title}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
                                {previewLang === 'ar' ? (previewPage.contentAr || <span className="text-gray-600 italic">No Arabic content</span>) : previewPage.content}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#151b2e] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-[#151b2e] border-b border-white/5 px-6 py-4 flex items-center justify-between z-10">
                            <h2 className="text-lg font-bold text-white">{editingId ? 'Edit Page' : 'Add New Page'}</h2>
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

                            {/* EN Fields */}
                            {activeTab === 'en' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Page Title *</label>
                                        <input required value={form.title} onChange={(e) => updateForm('title', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all" placeholder="e.g. About Us" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Slug *</label>
                                        <input required value={form.slug} onChange={(e) => updateForm('slug', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all" placeholder="e.g. about-us" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Content *</label>
                                        <textarea required rows={5} value={form.content} onChange={(e) => updateForm('content', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-y" placeholder="Page content..." />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Meta Title</label>
                                            <input value={form.metaTitle} onChange={(e) => updateForm('metaTitle', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Meta Description</label>
                                            <input value={form.metaDescription} onChange={(e) => updateForm('metaDescription', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* AR Fields */}
                            {activeTab === 'ar' && (
                                <div className="space-y-4" dir="rtl">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">عنوان الصفحة</label>
                                        <input value={form.titleAr} onChange={(e) => updateForm('titleAr', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-right" placeholder="مثال: من نحن" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">المحتوى</label>
                                        <textarea rows={5} value={form.contentAr} onChange={(e) => updateForm('contentAr', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-y text-right" placeholder="محتوى الصفحة..." />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1.5">عنوان ميتا</label>
                                            <input value={form.metaTitleAr} onChange={(e) => updateForm('metaTitleAr', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-right" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1.5">وصف ميتا</label>
                                            <input value={form.metaDescriptionAr} onChange={(e) => updateForm('metaDescriptionAr', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-right" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Common fields */}
                            <div className="flex items-center gap-6 pt-2 border-t border-white/5">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={form.isPublished} onChange={(e) => updateForm('isPublished', e.target.checked)} className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/50" />
                                    <span className="text-sm text-gray-300">Published</span>
                                </label>
                                <div className="flex items-center gap-2">
                                    <label className="text-sm text-gray-300">Order:</label>
                                    <input type="number" min={0} value={form.order} onChange={(e) => updateForm('order', parseInt(e.target.value) || 0)} className="w-20 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500/50" />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={saving} className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50">
                                    {saving ? 'Saving...' : editingId ? 'Update Page' : 'Create Page'}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-white/5 border border-white/10 text-gray-300 py-2.5 rounded-xl font-semibold text-sm hover:bg-white/10 transition-all">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Home Page Editor */}
            {showHomeModal && (
                <HomePageEditor
                    content={homeContent}
                    onSave={handleHomeSave}
                    onClose={() => setShowHomeModal(false)}
                    saving={saving}
                />
            )}

            {/* About Page Editor */}
            {showAboutModal && (
                <AboutPageEditor
                    content={aboutContent}
                    onSave={handleAboutSave}
                    onClose={() => setShowAboutModal(false)}
                    saving={saving}
                />
            )}

            {/* Our Journey Page Editor */}
            {showOurJourneyModal && (
                <OurJourneyPageEditor
                    content={ourJourneyContent}
                    onSave={handleOurJourneySave}
                    onClose={() => setShowOurJourneyModal(false)}
                    saving={saving}
                />
            )}

            {/* Plastic Pallets Page Editor */}
            {showPlasticPalletsModal && (
                <PlasticPalletsPageEditor
                    content={plasticPalletsContent}
                    onSave={handlePlasticPalletsSave}
                    onClose={() => setShowPlasticPalletsModal(false)}
                    saving={saving}
                />
            )}

            {/* Transport Logistics Page Editor */}
            {showTransportLogisticsModal && (
                <TransportLogisticsPageEditor
                    content={transportLogisticsContent}
                    onSave={handleTransportLogisticsSave}
                    onClose={() => setShowTransportLogisticsModal(false)}
                    saving={saving}
                />
            )}

            {/* Raw Materials Page Editor */}
            {showRawMaterialsModal && (
                <RawMaterialsPageEditor
                    content={rawMaterialsContent}
                    onSave={handleRawMaterialsSave}
                    onClose={() => setShowRawMaterialsModal(false)}
                    saving={saving}
                />
            )}

            {/* Innovative Solutions Editor Modal */}
            {showInnovativeSolutionsModal && (
                <InnovativeSolutionsEditor onClose={() => setShowInnovativeSolutionsModal(false)} onSave={() => { setShowInnovativeSolutionsModal(false); setSuccessMsg('Innovative Solutions page updated successfully!'); }} />
            )}
        </div>
    );
}
