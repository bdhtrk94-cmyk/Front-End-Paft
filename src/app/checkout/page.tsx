'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { ordersApi, stripeApi } from '@/lib/api';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/* ═══════════════════════════════════════════════════════════
   Payment Form — rendered inside Stripe <Elements> context
   ═══════════════════════════════════════════════════════════ */
function PaymentForm({
    orderId,
    totalAmount,
    onSuccess,
    onBack,
}: {
    orderId: number;
    totalAmount: number;
    onSuccess: () => void;
    onBack: () => void;
}) {
    const stripe = useStripe();
    const elements = useElements();
    const { language } = useLanguage();
    const isAr = language === 'ar';
    const [paying, setPaying] = useState(false);
    const [payError, setPayError] = useState('');

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setPaying(true);
        setPayError('');

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout?success=true&orderId=${orderId}`,
            },
            redirect: 'if_required',
        });

        if (error) {
            setPayError(error.message || (isAr ? 'فشل الدفع. يرجى المحاولة مرة أخرى.' : 'Payment failed. Please try again.'));
            setPaying(false);
        } else {
            // Payment succeeded without redirect
            onSuccess();
        }
    };

    return (
        <form onSubmit={handlePay} className="space-y-6">
            <div className="bg-[#151b2e] border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    {isAr ? 'تفاصيل الدفع' : 'Payment Details'}
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                    {isAr ? `طلب #${orderId} — ج.م ${Number(totalAmount).toLocaleString()}` : `Order #${orderId} — EGP ${Number(totalAmount).toLocaleString()}`}
                </p>

                {/* Stripe PaymentElement */}
                <div className="bg-[#0d1220] border border-white/5 rounded-xl p-4">
                    <PaymentElement
                        options={{
                            layout: 'tabs',
                        }}
                    />
                </div>
            </div>

            {/* Test card info */}
            {process.env.NODE_ENV === 'development' && (
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 text-sm">
                    <p className="text-yellow-400 font-semibold mb-2 flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Test Mode — Use these test cards:
                    </p>
                    <div className="space-y-1 text-gray-400">
                        <p><code className="text-green-400">4242 4242 4242 4242</code> — Success</p>
                        <p><code className="text-red-400">4000 0000 0000 9995</code> — Declined</p>
                        <p><code className="text-blue-400">4000 0025 0000 3155</code> — 3D Secure</p>
                        <p className="text-gray-500 mt-1">Any future date • Any 3-digit CVC</p>
                    </div>
                </div>
            )}

            {payError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {payError}
                </div>
            )}

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onBack}
                    disabled={paying}
                    className="px-6 py-3.5 bg-white/5 border border-white/10 text-gray-300 rounded-xl font-semibold hover:bg-white/10 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                    {isAr ? 'السابق →' : '← Back'}
                </button>
                <button
                    type="submit"
                    disabled={paying || !stripe || !elements}
                    className="flex-1 py-3.5 rounded-xl font-bold text-lg text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                        background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                        boxShadow: paying ? 'none' : '0 4px 15px rgba(6,182,212,0.3)',
                    }}
                >
                    {paying ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {isAr ? 'جاري معالجة الدفع...' : 'Processing Payment...'}
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            {isAr ? `دفع ج.م ${Number(totalAmount).toLocaleString()}` : `Pay EGP ${Number(totalAmount).toLocaleString()}`}
                        </>
                    )}
                </button>
            </div>

            <div className={`flex items-center justify-center gap-4 text-gray-500 text-xs pt-2 ${isAr ? 'flex-row-reverse' : ''}`}>
                <span className={`flex items-center gap-1 ${isAr ? 'flex-row-reverse' : ''}`}>
                    <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    {isAr ? 'مشفر بصيغة SSL' : 'SSL Encrypted'}
                </span>
                <span>•</span>
                <span>{isAr ? 'مدعوم بواسطة Stripe' : 'Powered by Stripe'}</span>
                <span>•</span>
                <span>{isAr ? 'متوافق مع PCI DSS' : 'PCI DSS Compliant'}</span>
            </div>
        </form>
    );
}

/* ═══════════════════════════════════════════════════════════
   Main Checkout Page — 2-step flow
   ═══════════════════════════════════════════════════════════ */
export default function CheckoutPage() {
    const router = useRouter();
    const { items, totalPrice, clearCart } = useCart();
    const { token, user, isLoading: authLoading } = useAuth();
    const { language } = useLanguage();
    const isAr = language === 'ar';

    // Step management
    const [step, setStep] = useState<'shipping' | 'payment' | 'success'>('shipping');

    // Shipping form
    const [shippingAddress, setShippingAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');

    // Order state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [idempotencyKey] = useState(() => generateUUID());
    const [clientSecret, setClientSecret] = useState('');
    const [orderInfo, setOrderInfo] = useState<{ id: number; totalAmount: number } | null>(null);
    const stripePromiseRef = useRef<Promise<Stripe | null> | null>(null);

    // Fetch Stripe public key dynamically from backend
    useEffect(() => {
        stripeApi.getPublicKey().then(({ publicKey }) => {
            if (publicKey) {
                stripePromiseRef.current = loadStripe(publicKey);
            }
        }).catch(() => {
            // Stripe not configured — payment will be skipped
        });
    }, []);

    // Check URL for redirect-back from Stripe 3DS
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('success') === 'true' && params.get('orderId')) {
            setOrderInfo({
                id: Number(params.get('orderId')),
                totalAmount: 0,
            });
            setStep('success');
            clearCart();
            // Clean up URL
            window.history.replaceState({}, '', '/checkout');
        }
    }, [clearCart]);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !token) {
            router.push('/login?redirect=/checkout');
        }
    }, [authLoading, token, router]);

    // ── Step 1: Submit shipping → create order + get clientSecret ──
    const handleShippingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (items.length === 0) {
            setError(isAr ? 'عربة التسوق فارغة' : 'Your cart is empty');
            return;
        }
        if (!shippingAddress.trim()) {
            setError(isAr ? 'يرجى إدخال عنوان الشحن' : 'Please enter your shipping address');
            return;
        }
        if (!phone.trim()) {
            setError(isAr ? 'يرجى إدخال رقم الهاتف' : 'Please enter your phone number');
            return;
        }

        setLoading(true);

        try {
            const result = await ordersApi.checkout(
                {
                    items: items.map((item) => ({
                        productId: item.id,
                        quantity: item.quantity,
                    })),
                    shippingAddress: shippingAddress.trim(),
                    phone: phone.trim(),
                    notes: notes.trim() || undefined,
                    idempotencyKey,
                },
                token!,
            );

            setClientSecret(result.clientSecret);
            setOrderInfo({
                id: result.order.id,
                totalAmount: result.order.totalAmount,
            });
            setStep('payment');
        } catch (err: unknown) {
            const apiErr = err as { message?: string };
            setError(apiErr.message || (isAr ? 'فشل إنشاء الطلب. يرجى المحاولة مرة أخرى.' : 'Failed to create order. Please try again.'));
        } finally {
            setLoading(false);
        }
    };

    // ── Payment success handler ──
    const handlePaymentSuccess = () => {
        clearCart();
        setStep('success');
    };

    // ── Loading state ──
    if (authLoading) {
        return (
            <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    // ── Step 3: Success ──
    if (step === 'success' && orderInfo) {
        return (
            <div className="min-h-screen bg-[#0a0f1e]">
                <Header currentPage="shop" />
                <div className="max-w-lg mx-auto px-4 py-24 text-center">
                    <div className="bg-[#151b2e] border border-white/10 rounded-3xl p-10">
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">{isAr ? 'تم الدفع بنجاح!' : 'Payment Successful!'}</h1>
                        <p className="text-gray-400 mb-1">{isAr ? `طلب #${orderInfo.id}` : `Order #${orderInfo.id}`}</p>
                        {orderInfo.totalAmount > 0 && (
                            <p className="text-2xl font-bold text-blue-400 mb-6">
                                {isAr ? `ج.م ${Number(orderInfo.totalAmount).toLocaleString()}` : `EGP ${Number(orderInfo.totalAmount).toLocaleString()}`}
                            </p>
                        )}
                        <p className="text-gray-400 text-sm mb-8">
                            {isAr ? 'تمت معالجة الدفع بأمان عبر Stripe. سنتواصل معك قريبًا بتفاصيل التوصيل.' : "Your payment has been processed securely via Stripe. We'll contact you soon with delivery details."}
                        </p>
                        <div className="flex gap-3">
                            <Link
                                href="/shop"
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all text-center"
                            >
                                {isAr ? 'تابع التسوق' : 'Continue Shopping'}
                            </Link>
                            <Link
                                href="/"
                                className="flex-1 bg-white/5 border border-white/10 text-gray-300 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all text-center"
                            >
                                {isAr ? 'الرئيسية' : 'Home'}
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // ── Main Layout ──
    return (
        <div className="min-h-screen bg-[#0a0f1e]">
            <Header currentPage="shop" />

            <div className={`max-w-5xl mx-auto px-4 py-12 pt-24 ${isAr ? 'font-arabic' : ''}`} dir={isAr ? 'rtl' : 'ltr'}>
                {/* Step indicator */}
                <div className="flex items-center gap-3 mb-8">
                    <h1 className="text-3xl font-bold text-white">{isAr ? 'إتمام الطلب' : 'Checkout'}</h1>
                    <div className={`flex items-center gap-2 ${isAr ? 'mr-auto' : 'ml-auto'}`}>
                        <div className={`flex items-center gap-1.5 text-sm font-medium ${step === 'shipping' ? 'text-blue-400' : 'text-green-400'}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 'shipping' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                                {step === 'payment' ? '✓' : (isAr ? '١' : '1')}
                            </div>
                            {isAr ? 'الشحن' : 'Shipping'}
                        </div>
                        <div className={`w-8 h-px ${step === 'payment' ? 'bg-blue-500' : 'bg-white/10'}`} />
                        <div className={`flex items-center gap-1.5 text-sm font-medium ${step === 'payment' ? 'text-blue-400' : 'text-gray-500'}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 'payment' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-500'}`}>
                                {isAr ? '٢' : '2'}
                            </div>
                            {isAr ? 'الدفع' : 'Payment'}
                        </div>
                    </div>
                </div>

                {items.length === 0 && step === 'shipping' ? (
                    <div className="bg-[#151b2e] border border-white/10 rounded-2xl p-12 text-center">
                        <p className="text-gray-400 text-lg mb-4">{isAr ? 'عربة التسوق فارغة' : 'Your cart is empty'}</p>
                        <Link
                            href="/shop"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                        >
                            {isAr ? 'تصفح المنتجات' : 'Browse Products'}
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Left: Form area */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* ── STEP 1: Shipping Form ── */}
                            {step === 'shipping' && (
                                <form onSubmit={handleShippingSubmit} className="space-y-6">
                                    <div className="bg-[#151b2e] border border-white/10 rounded-2xl p-6">
                                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {isAr ? 'تفاصيل الشحن' : 'Shipping Details'}
                                        </h2>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-1.5">{isAr ? 'الاسم الكامل' : 'Full Name'}</label>
                                                <input
                                                    type="text"
                                                    value={user?.name || ''}
                                                    disabled
                                                    className="w-full bg-white/5 border border-white/10 text-gray-400 px-4 py-3 rounded-xl"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm text-gray-400 mb-1.5">{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
                                                <input
                                                    type="email"
                                                    value={user?.email || ''}
                                                    disabled
                                                    className="w-full bg-white/5 border border-white/10 text-gray-400 px-4 py-3 rounded-xl"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm text-gray-400 mb-1.5">
                                                    {isAr ? 'عنوان الشحن' : 'Shipping Address'} <span className="text-red-400">*</span>
                                                </label>
                                                <textarea
                                                    value={shippingAddress}
                                                    onChange={(e) => setShippingAddress(e.target.value)}
                                                    placeholder={isAr ? 'أدخل عنوان الشحن بالكامل...' : 'Enter your full shipping address...'}
                                                    rows={3}
                                                    required
                                                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder-gray-500 transition-all resize-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm text-gray-400 mb-1.5">
                                                    {isAr ? 'رقم الهاتف' : 'Phone Number'} <span className="text-red-400">*</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    placeholder={isAr ? 'مثال: 01012345678' : 'e.g. 01012345678'}
                                                    required
                                                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder-gray-500 transition-all"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm text-gray-400 mb-1.5">{isAr ? 'ملاحظات (اختياري)' : 'Notes (optional)'}</label>
                                                <textarea
                                                    value={notes}
                                                    onChange={(e) => setNotes(e.target.value)}
                                                    placeholder={isAr ? 'أي تعليمات خاصة...' : 'Any special instructions...'}
                                                    rows={2}
                                                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder-gray-500 transition-all resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 rounded-xl font-bold text-lg text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                        style={{
                                            background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                                            boxShadow: '0 4px 15px rgba(6,182,212,0.3)',
                                        }}
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                {isAr ? 'جاري إنشاء الطلب...' : 'Creating Order...'}
                                            </>
                                        ) : (
                                            <>
                                                {isAr ? 'استمرار إلى الدفع' : 'Continue to Payment'}
                                                <svg className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </>
                                        )}
                                    </button>

                                    <div className="flex items-center gap-3 text-gray-500 text-sm px-2">
                                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        </svg>
                                        {isAr ? 'بياناتك مشفرة وآمنة. تتم معالجة المدفوعات عبر Stripe.' : 'Your data is encrypted and secure. Payments are processed by Stripe.'}
                                    </div>
                                </form>
                            )}

                            {/* ── STEP 2: Stripe Payment ── */}
                            {step === 'payment' && clientSecret && orderInfo && (
                                <Elements
                                    stripe={stripePromiseRef.current}
                                    options={{
                                        clientSecret,
                                        appearance: {
                                            theme: 'night',
                                            variables: {
                                                colorPrimary: '#06B6D4',
                                                colorBackground: '#0d1220',
                                                colorText: '#ffffff',
                                                colorDanger: '#EF4444',
                                                fontFamily: 'system-ui, -apple-system, sans-serif',
                                                borderRadius: '12px',
                                                spacingUnit: '4px',
                                            },
                                            rules: {
                                                '.Input': {
                                                    backgroundColor: '#151b2e',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    padding: '12px 16px',
                                                },
                                                '.Input:focus': {
                                                    border: '1px solid #06B6D4',
                                                    boxShadow: '0 0 0 2px rgba(6,182,212,0.2)',
                                                },
                                                '.Label': {
                                                    color: 'rgba(255,255,255,0.6)',
                                                    fontSize: '14px',
                                                },
                                                '.Tab': {
                                                    backgroundColor: '#151b2e',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                },
                                                '.Tab--selected': {
                                                    backgroundColor: '#1e293b',
                                                    border: '1px solid #06B6D4',
                                                },
                                            },
                                        },
                                    }}
                                >
                                    <PaymentForm
                                        orderId={orderInfo.id}
                                        totalAmount={orderInfo.totalAmount}
                                        onSuccess={handlePaymentSuccess}
                                        onBack={() => setStep('shipping')}
                                    />
                                </Elements>
                            )}
                        </div>

                        <div className="lg:col-span-2">
                            <div className="bg-[#151b2e] border border-white/10 rounded-2xl p-6 sticky top-24">
                                <h2 className="text-lg font-bold text-white mb-4">{isAr ? 'ملخص الطلب' : 'Order Summary'}</h2>

                                <div className="space-y-3 max-h-64 overflow-y-auto pr-1 mb-4">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm font-medium truncate">{item.name}</p>
                                                <p className="text-gray-400 text-xs">
                                                    {item.quantity} × {isAr ? `ج.م ${Number(item.price).toLocaleString()}` : `EGP ${Number(item.price).toLocaleString()}`}
                                                </p>
                                            </div>
                                            <p className="text-white text-sm font-semibold whitespace-nowrap">
                                                {isAr ? `ج.م ${(Number(item.price) * item.quantity).toLocaleString()}` : `EGP ${(Number(item.price) * item.quantity).toLocaleString()}`}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-white/10 pt-4 space-y-2">
                                    <div className="flex justify-between text-gray-400 text-sm">
                                        <span>{isAr ? `المجموع الفرعي (${items.length} عناصر)` : `Subtotal (${items.length} items)`}</span>
                                        <span>{isAr ? `ج.م ${totalPrice.toLocaleString()}` : `EGP ${totalPrice.toLocaleString()}`}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400 text-sm">
                                        <span>{isAr ? 'الشحن' : 'Shipping'}</span>
                                        <span className="text-green-400">{isAr ? 'مجانًا' : 'Free'}</span>
                                    </div>
                                    <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10">
                                        <span>{isAr ? 'الإجمالي' : 'Total'}</span>
                                        <span className="text-blue-400">{isAr ? `ج.م ${totalPrice.toLocaleString()}` : `EGP ${totalPrice.toLocaleString()}`}</span>
                                    </div>
                                </div>

                                {step === 'payment' && (
                                    <div className="mt-4 bg-blue-500/5 border border-blue-500/20 rounded-xl p-3 text-sm text-blue-300 flex items-start gap-2">
                                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                        {isAr ? 'تم إنشاء الطلب. أكمل الدفع للتأكيد.' : 'Order created. Complete payment to confirm.'}
                                    </div>
                                )}

                                <p className="text-center text-gray-500 text-xs mt-3">
                                    {isAr ? 'بتقديمك لهذا الطلب، فإنك توافق على شروط الخدمة الخاصة بنا' : 'By placing this order you agree to our Terms of Service'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
