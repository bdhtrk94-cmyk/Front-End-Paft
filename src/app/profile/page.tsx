'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { profileApi } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
    User, Camera, Lock, ShoppingBag, LogOut,
    Save, Eye, EyeOff, Check, AlertCircle, Package, Calendar, Mail, Phone, FileText,
} from 'lucide-react';

const getImageUrl = (path: string) => {
    if (!path) return '';
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const baseUrl = apiBase.replace(/\/api\/?$/, '');
    return `${baseUrl}${path}`;
};

type Tab = 'info' | 'security' | 'orders';

interface OrderItem {
    id: number;
    totalAmount: string;
    status: string;
    createdAt: string;
    items: { productName: string; quantity: number; unitPrice: string }[];
}

export default function ProfilePage() {
    const { user, token, isLoading, logout, updateUser } = useAuth();
    const { theme } = useTheme();
    const router = useRouter();
    const isDark = theme === 'dark';
    const { language } = useLanguage();
    const isAr = language === 'ar';
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [tab, setTab] = useState<Tab>('info');

    // Profile info state
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [bio, setBio] = useState('');
    const [saving, setSaving] = useState(false);
    const [infoMsg, setInfoMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Avatar state
    const [avatarUploading, setAvatarUploading] = useState(false);

    // Password state
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [pwSaving, setPwSaving] = useState(false);
    const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Orders state
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(false);

    // Populate form from user
    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setPhone(user.phone || '');
            setBio(user.bio || '');
        }
    }, [user]);

    // Load orders when orders tab opens
    useEffect(() => {
        if (tab === 'orders' && token) {
            setOrdersLoading(true);
            profileApi.getOrders(token)
                .then(setOrders)
                .catch(() => setOrders([]))
                .finally(() => setOrdersLoading(false));
        }
    }, [tab, token]);

    // Redirect if not logged in
    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/');
        }
    }, [isLoading, user, router]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: isDark ? '#0B1121' : '#F1F5F9' }}>
                <div className="w-10 h-10 rounded-full border-3 border-t-cyan-500 animate-spin" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', borderTopColor: '#06B6D4' }} />
            </div>
        );
    }

    // Profile completeness
    const fields = [user.name, user.email, user.phone, user.bio, user.avatar];
    const filled = fields.filter(Boolean).length;
    const completeness = Math.round((filled / fields.length) * 100);

    const avatarUrl = user.avatar ? getImageUrl(user.avatar) : null;

    const handleSaveProfile = async () => {
        setSaving(true);
        setInfoMsg(null);
        try {
            const res = await profileApi.updateProfile({ name, phone, bio }, token!);
            updateUser(res.user);
            setInfoMsg({ type: 'success', text: isAr ? 'تم تحديث الملف الشخصي بنجاح!' : 'Profile updated successfully!' });
        } catch {
            setInfoMsg({ type: 'error', text: isAr ? 'فشل في تحديث الملف الشخصي' : 'Failed to update profile' });
        } finally {
            setSaving(false);
            setTimeout(() => setInfoMsg(null), 4000);
        }
    };
    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !token) return;
        setAvatarUploading(true);
        try {
            const res = await profileApi.uploadAvatar(file, token);
            updateUser(res.user);
        } catch {
            setInfoMsg({ type: 'error', text: isAr ? 'فشل رفع الصورة الشخصية' : 'Avatar upload failed' });
        } finally {
            setAvatarUploading(false);
        }
    };

    const handleChangePassword = async () => {
        setPwMsg(null);
        if (newPw !== confirmPw) {
            setPwMsg({ type: 'error', text: isAr ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match' });
            return;
        }
        if (newPw.length < 6) {
            setPwMsg({ type: 'error', text: isAr ? 'يجب أن تكون كلمة المرور 6 أحرف على الأقل' : 'Password must be at least 6 characters' });
            return;
        }
        setPwSaving(true);
        try {
            await profileApi.changePassword(currentPw, newPw, token!);
            setPwMsg({ type: 'success', text: isAr ? 'تم تغيير كلمة المرور بنجاح!' : 'Password changed successfully!' });
            setCurrentPw('');
            setNewPw('');
            setConfirmPw('');
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setPwMsg({ type: 'error', text: errorMessage || (isAr ? 'فشل في تغيير كلمة المرور' : 'Failed to change password') });
        } finally {
            setPwSaving(false);
            setTimeout(() => setPwMsg(null), 4000);
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    // ─── Status badge colors ───
    const statusColors: Record<string, string> = {
        pending: '#F59E0B',
        confirmed: '#3B82F6',
        shipped: '#8B5CF6',
        delivered: '#10B981',
        cancelled: '#EF4444',
    };

    // ─── Theme tokens ───
    const bg = isDark ? '#0B1121' : '#F1F5F9';
    const cardBg = isDark ? 'rgba(15,23,42,0.6)' : '#FFFFFF';
    const cardBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)';
    const textPrimary = isDark ? '#FFFFFF' : '#0F172A';
    const textSecondary = isDark ? 'rgba(255,255,255,0.55)' : '#64748B';
    const textMuted = isDark ? 'rgba(255,255,255,0.35)' : '#94A3B8';
    const inputBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)';
    const inputBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.12)';
    const inputFocusBorder = '#06B6D4';

    const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
        { key: 'info', label: isAr ? 'المعلومات الشخصية' : 'Personal Info', icon: <User className="w-4 h-4" /> },
        { key: 'security', label: isAr ? 'الأمان' : 'Security', icon: <Lock className="w-4 h-4" /> },
        { key: 'orders', label: isAr ? 'طلباتي' : 'My Orders', icon: <ShoppingBag className="w-4 h-4" /> },
    ];

    const renderInput = (
        label: string,
        value: string,
        onChange: (v: string) => void,
        icon: React.ReactNode,
        opts?: { disabled?: boolean; multiline?: boolean; placeholder?: string },
    ) => {
        const Tag = opts?.multiline ? 'textarea' : 'input';
        return (
            <div>
                <label className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: textMuted }}>
                    {icon} {label}
                </label>
                <Tag
                    value={value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value)}
                    disabled={opts?.disabled}
                    placeholder={opts?.placeholder}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300"
                    style={{
                        background: inputBg,
                        border: `1px solid ${inputBorder}`,
                        color: opts?.disabled ? textMuted : textPrimary,
                        resize: opts?.multiline ? 'vertical' : undefined,
                        minHeight: opts?.multiline ? '100px' : undefined,
                        opacity: opts?.disabled ? 0.6 : 1,
                    }}
                    onFocus={(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.target.style.borderColor = inputFocusBorder; e.target.style.boxShadow = `0 0 0 3px ${inputFocusBorder}25`; }}
                    onBlur={(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.target.style.borderColor = inputBorder; e.target.style.boxShadow = 'none'; }}
                />
            </div>
        );
    };

    const renderPasswordField = (
        label: string,
        value: string,
        onChange: (v: string) => void,
        show: boolean,
        toggleShow: () => void,
        placeholder: string,
    ) => (
        <div>
            <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: textMuted }}>{label}</label>
            <div className="relative">
                <input
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all duration-300"
                    style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: textPrimary }}
                    onFocus={(e) => { e.target.style.borderColor = inputFocusBorder; e.target.style.boxShadow = `0 0 0 3px ${inputFocusBorder}25`; }}
                    onBlur={(e) => { e.target.style.borderColor = inputBorder; e.target.style.boxShadow = 'none'; }}
                />
                <button
                    type="button"
                    onClick={toggleShow}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors"
                    style={{ color: textMuted }}
                >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );

    return (
        <>
            <Header currentPage="profile" />
            <main className="min-h-screen pt-8 pb-20" dir={isAr ? 'rtl' : 'ltr'} style={{ background: bg }}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6">

                    {/* ─── Profile Header Card ─── */}
                    <div
                        className="relative rounded-3xl overflow-hidden mb-8"
                        style={{
                            background: cardBg,
                            border: `1px solid ${cardBorder}`,
                            backdropFilter: 'blur(20px)',
                        }}
                    >
                        {/* Gradient banner */}
                        <div className="h-32 sm:h-40" style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #2563EB 50%, #7C3AED 100%)' }}>
                            <div className="w-full h-full" style={{ background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.15), transparent 60%)' }} />
                        </div>

                        <div className="px-6 sm:px-10 pb-8 -mt-16 relative">
                            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                                {/* Avatar */}
                                <div className="relative group">
                                    <div
                                        className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden flex items-center justify-center"
                                        style={{
                                            background: avatarUrl ? 'transparent' : 'linear-gradient(135deg, #06B6D4, #7C3AED)',
                                            border: `4px solid ${isDark ? '#0B1121' : '#F1F5F9'}`,
                                            boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                                        }}
                                    >
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-4xl font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
                                        )}
                                    </div>
                                    {/* Upload overlay */}
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={avatarUploading}
                                        className="absolute inset-0 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                                        style={{ background: 'rgba(0,0,0,0.5)', border: `4px solid transparent` }}
                                    >
                                        {avatarUploading ? (
                                            <div className="w-6 h-6 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                        ) : (
                                            <Camera className="w-6 h-6 text-white" />
                                        )}
                                    </button>
                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                                </div>

                                {/* Name + Role */}
                                <div className="flex-1 pb-1">
                                    <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: textPrimary }}>{user.name}</h1>
                                    <p className="text-sm mt-1" style={{ color: textSecondary }}>{user.email}</p>
                                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                                        <span
                                            className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                                            style={{
                                                background: user.role === 'super_admin' ? 'linear-gradient(135deg, #F59E0B, #EF4444)' : user.role === 'admin' ? 'linear-gradient(135deg, #8B5CF6, #06B6D4)' : 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                                color: '#FFFFFF',
                                            }}
                                        >
                                            {user.role.replace('_', ' ')}
                                        </span>
                                        <span className="text-xs flex items-center gap-1" style={{ color: textMuted }}>
                                            {isAr ? 'عضو منذ' : 'Member since'} {new Date(user.createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>

                                {/* Logout desktop */}
                                <button
                                    onClick={handleLogout}
                                    className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
                                    style={{
                                        color: '#EF4444',
                                        background: isDark ? 'rgba(239,68,68,0.08)' : 'rgba(239,68,68,0.06)',
                                        border: `1px solid ${isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.12)'}`,
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.1)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = isDark ? 'rgba(239,68,68,0.08)' : 'rgba(239,68,68,0.06)'; }}
                                >
                                    <LogOut className="w-4 h-4" /> {isAr ? 'تسجيل الخروج' : 'Sign Out'}
                                </button>
                            </div>

                            {/* Profile Completeness Bar */}
                            <div className="mt-6 p-4 rounded-xl" style={{ background: inputBg, border: `1px solid ${cardBorder}` }}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold" style={{ color: textSecondary }}>{isAr ? 'اكتمال الملف الشخصي' : 'Profile Completeness'}</span>
                                    <span className="text-xs font-bold" style={{ color: completeness === 100 ? '#10B981' : '#06B6D4' }}>{completeness}%</span>
                                </div>
                                <div className="h-2 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)' }}>
                                    <div
                                        className="h-full rounded-full transition-all duration-700"
                                        style={{
                                            width: `${completeness}%`,
                                            background: completeness === 100 ? 'linear-gradient(90deg, #10B981, #06B6D4)' : 'linear-gradient(90deg, #06B6D4, #2563EB)',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ─── Tabs ─── */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                        {tabs.map((t) => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap"
                                style={{
                                    background: tab === t.key ? 'linear-gradient(135deg, #06B6D4, #2563EB)' : cardBg,
                                    color: tab === t.key ? '#FFFFFF' : textSecondary,
                                    border: `1px solid ${tab === t.key ? 'transparent' : cardBorder}`,
                                    boxShadow: tab === t.key ? '0 4px 15px rgba(6,182,212,0.3)' : 'none',
                                }}
                            >
                                {t.icon} {t.label}
                            </button>
                        ))}
                    </div>

                    {/* ─── Tab Content ─── */}
                    <div
                        className="rounded-3xl overflow-hidden"
                        style={{ background: cardBg, border: `1px solid ${cardBorder}`, backdropFilter: 'blur(20px)' }}
                    >
                        {/* ── Personal Info ── */}
                        {tab === 'info' && (
                            <div className="p-6 sm:p-8">
                                <h2 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: textPrimary }}>
                                    <User className="w-5 h-5" style={{ color: '#06B6D4' }} />
                                    {isAr ? 'المعلومات الشخصية' : 'Personal Information'}
                                </h2>

                                {infoMsg && (
                                    <div
                                        className="mb-6 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
                                        style={{
                                            background: infoMsg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                            color: infoMsg.type === 'success' ? '#10B981' : '#EF4444',
                                            border: `1px solid ${infoMsg.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                                        }}
                                    >
                                        {infoMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                        {infoMsg.text}
                                    </div>
                                )}

                                <div className="grid gap-5">
                                    {renderInput(isAr ? 'الاسم الكامل' : 'Full Name', name, setName, <User className="w-3.5 h-3.5" />, { placeholder: isAr ? 'اسمك الكامل' : 'Your full name' })}
                                    {renderInput(isAr ? 'البريد الإلكتروني' : 'Email Address', user.email, () => { }, <Mail className="w-3.5 h-3.5" />, { disabled: true })}
                                    {renderInput(isAr ? 'رقم الهاتف' : 'Phone Number', phone, setPhone, <Phone className="w-3.5 h-3.5" />, { placeholder: '+20 xxx xxx xxxx' })}
                                    {renderInput(isAr ? 'نبذة' : 'Bio', bio, setBio, <FileText className="w-3.5 h-3.5" />, { multiline: true, placeholder: isAr ? 'حدثنا عن نفسك...' : 'Tell us about yourself...' })}
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all duration-300"
                                        style={{
                                            background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                            boxShadow: '0 4px 15px rgba(6,182,212,0.3)',
                                            opacity: saving ? 0.7 : 1,
                                        }}
                                        onMouseEnter={(e) => { if (!saving) { e.currentTarget.style.boxShadow = '0 8px 25px rgba(6,182,212,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                                        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 15px rgba(6,182,212,0.3)'; e.currentTarget.style.transform = ''; }}
                                    >
                                        {saving ? (
                                            <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                        ) : (
                                            <Save className="w-4 h-4" />
                                        )}
                                        {saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ التعديلات' : 'Save Changes')}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── Security ── */}
                        {tab === 'security' && (
                            <div className="p-6 sm:p-8">
                                <h2 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: textPrimary }}>
                                    <Lock className="w-5 h-5" style={{ color: '#06B6D4' }} />
                                    {isAr ? 'تغيير كلمة المرور' : 'Change Password'}
                                </h2>

                                {pwMsg && (
                                    <div
                                        className="mb-6 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
                                        style={{
                                            background: pwMsg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                            color: pwMsg.type === 'success' ? '#10B981' : '#EF4444',
                                            border: `1px solid ${pwMsg.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                                        }}
                                    >
                                        {pwMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                        {pwMsg.text}
                                    </div>
                                )}

                                <div className="grid gap-5 max-w-md">
                                    {renderPasswordField(isAr ? 'كلمة المرور الحالية' : 'Current Password', currentPw, setCurrentPw, showCurrentPw, () => setShowCurrentPw(!showCurrentPw), isAr ? 'أدخل كلمة المرور الحالية' : 'Enter current password')}
                                    {renderPasswordField(isAr ? 'كلمة المرور الجديدة' : 'New Password', newPw, setNewPw, showNewPw, () => setShowNewPw(!showNewPw), isAr ? 'أدخل كلمة المرور الجديدة' : 'Enter new password')}

                                    <div>
                                        <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: textMuted }}>{isAr ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}</label>
                                        <input
                                            type="password"
                                            value={confirmPw}
                                            onChange={(e) => setConfirmPw(e.target.value)}
                                            placeholder={isAr ? 'تأكيد كلمة المرور الجديدة' : 'Confirm new password'}
                                            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300"
                                            style={{ background: inputBg, border: `1px solid ${newPw && confirmPw && newPw !== confirmPw ? '#EF4444' : inputBorder}`, color: textPrimary }}
                                            onFocus={(e) => { e.target.style.borderColor = inputFocusBorder; e.target.style.boxShadow = `0 0 0 3px ${inputFocusBorder}25`; }}
                                            onBlur={(e) => { e.target.style.borderColor = inputBorder; e.target.style.boxShadow = 'none'; }}
                                        />
                                        {newPw && confirmPw && newPw !== confirmPw && (
                                            <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{isAr ? 'كلمتا المرور غير متطابقتين' : "Passwords don't match"}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        onClick={handleChangePassword}
                                        disabled={pwSaving || !currentPw || !newPw || !confirmPw || newPw !== confirmPw}
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all duration-300"
                                        style={{
                                            background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                            boxShadow: '0 4px 15px rgba(6,182,212,0.3)',
                                            opacity: pwSaving || !currentPw || !newPw || !confirmPw || newPw !== confirmPw ? 0.5 : 1,
                                        }}
                                    >
                                        {pwSaving ? (
                                            <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                        ) : (
                                            <Lock className="w-4 h-4" />
                                        )}
                                        {pwSaving ? (isAr ? 'جاري التغيير...' : 'Changing...') : (isAr ? 'تحديث كلمة المرور' : 'Update Password')}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── Orders ── */}
                        {tab === 'orders' && (
                            <div className="p-6 sm:p-8">
                                <h2 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: textPrimary }}>
                                    <ShoppingBag className="w-5 h-5" style={{ color: '#06B6D4' }} />
                                    {isAr ? 'طلباتي' : 'My Orders'}
                                </h2>

                                {ordersLoading ? (
                                    <div className="flex justify-center py-12">
                                        <div className="w-8 h-8 rounded-full border-3 animate-spin" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', borderTopColor: '#06B6D4' }} />
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Package className="w-12 h-12 mx-auto mb-4" style={{ color: textMuted }} />
                                        <p className="text-sm font-medium" style={{ color: textSecondary }}>{isAr ? 'لا توجد طلبات بعد' : 'No orders yet'}</p>
                                        <p className="text-xs mt-1" style={{ color: textMuted }}>{isAr ? 'سجل طلباتك سيظهر هنا' : 'Your order history will appear here'}</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div
                                                key={order.id}
                                                className="rounded-2xl p-5 transition-all duration-300"
                                                style={{
                                                    background: inputBg,
                                                    border: `1px solid ${cardBorder}`,
                                                }}
                                            >
                                                <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-bold" style={{ color: textPrimary }}>{isAr ? 'طلب #' : 'Order #'}{order.id}</span>
                                                        <span
                                                            className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase"
                                                            style={{
                                                                background: `${statusColors[order.status] || '#64748B'}15`,
                                                                color: statusColors[order.status] || '#64748B',
                                                                border: `1px solid ${statusColors[order.status] || '#64748B'}30`,
                                                            }}
                                                        >
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs" style={{ color: textMuted }}>
                                                        {new Date(order.createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </div>

                                                {order.items?.length > 0 && (
                                                    <div className="space-y-1 mb-3">
                                                        {order.items.map((item, i) => (
                                                            <div key={i} className="flex justify-between text-xs" style={{ color: textSecondary }}>
                                                                <span>{item.productName} × {item.quantity}</span>
                                                                <span>${Number(item.unitPrice).toFixed(2)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-center pt-3" style={{ borderTop: `1px solid ${cardBorder}` }}>
                                                    <span className="text-xs" style={{ color: textMuted }}>{isAr ? 'المجموع' : 'Total'}</span>
                                                    <span className="text-sm font-bold" style={{ color: '#06B6D4' }}>${Number(order.totalAmount).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile logout */}
                    <button
                        onClick={handleLogout}
                        className="sm:hidden w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
                        style={{
                            color: '#EF4444',
                            background: isDark ? 'rgba(239,68,68,0.08)' : 'rgba(239,68,68,0.06)',
                            border: `1px solid ${isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.12)'}`,
                        }}
                    >
                        <LogOut className="w-4 h-4" /> {isAr ? 'تسجيل الخروج' : 'Sign Out'}
                    </button>
                </div>
            </main>
            <Footer />
        </>
    );
}
