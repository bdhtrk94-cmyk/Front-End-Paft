'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { contentApi } from '@/lib/api';

const MAX_MESSAGE = 600;

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  message?: string;
}

type ContentMap = { [key: string]: string };

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { language } = useLanguage();
  const isAr = language === 'ar';

  // Dynamic content state
  const [contentEn, setContentEn] = useState<ContentMap>({});
  const [contentAr, setContentAr] = useState<ContentMap>({});
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await contentApi.getPageContent('contact');
        const en: ContentMap = {};
        const ar: ContentMap = {};
        Object.keys(data).forEach(section => {
          if (data[section] && typeof data[section] === 'object') {
            Object.keys(data[section]).forEach(key => {
              const item = data[section][key];
              if (item && typeof item === 'object' && 'value' in item) {
                const fullKey = section === 'hero' ? key : `${section}-${key}`;
                en[fullKey] = item.value || '';
                ar[fullKey] = item.valueAr || '';
              }
            });
          }
        });
        setContentEn(en);
        setContentAr(ar);
        setContentLoaded(true);
      } catch (e) {
        console.error('Failed to load contact content:', e);
        setContentLoaded(true);
      }
    };
    fetchContent();
  }, []);

  // Helper to get content value with fallback
  const c = (key: string, fallback: string): string => {
    if (!contentLoaded) return fallback;
    const val = isAr ? (contentAr[key] != null && contentAr[key] !== '' ? contentAr[key] : contentEn[key]) : contentEn[key];
    return val != null ? val : fallback;
  };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!formData.firstName.trim()) errs.firstName = c('validation-first-name', 'First name is required');
    if (!formData.lastName.trim()) errs.lastName = c('validation-last-name', 'Last name is required');
    if (!formData.email.trim()) {
      errs.email = c('validation-email-required', 'Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = c('validation-email-invalid', 'Enter a valid email address');
    }
    if (!formData.message.trim()) errs.message = c('validation-message', 'Message is required');
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ firstName: '', lastName: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'message' && value.length > MAX_MESSAGE) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: c('contact-cards-card-1-title', 'Visit Us'),
      lines: [
        c('contact-cards-card-1-line-1', 'T 29, IDG, Industrial Square Area E2,'),
        c('contact-cards-card-1-line-2', 'October 6th Industrial Area Zone 4.'),
        c('contact-cards-card-1-line-3', 'Giza, Egypt.'),
      ],
      color: '#06B6D4',
      glow: 'rgba(6, 182, 212, 0.25)',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: c('contact-cards-card-2-title', 'Call Us'),
      lines: [c('contact-cards-card-2-line-1', '+201022239770'), c('contact-cards-card-2-line-2', 'Sales Unit Manager')],
      color: '#2563EB',
      glow: 'rgba(37, 99, 235, 0.25)',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: c('contact-cards-card-3-title', 'Email Us'),
      lines: [c('contact-cards-card-3-line-1', 'info@paft.net')],
      color: '#10B981',
      glow: 'rgba(16, 185, 129, 0.25)',
      href: 'mailto:' + c('contact-cards-card-3-line-1', 'info@paft.net'),
    },
  ];

  /* ─── Input styling helper ─── */
  const inputStyle = (fieldError?: string) => ({
    background: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.05)',
    border: fieldError
      ? '1px solid #EF4444'
      : `1px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`,
    color: isLight ? '#0F172A' : '#fff',
    boxShadow: isLight ? '0 1px 4px rgba(0,0,0,0.03)' : 'none',
  });

  const focusBorder = (fieldError?: string) => ({
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!fieldError) {
        e.currentTarget.style.borderColor = '#06B6D4';
        e.currentTarget.style.boxShadow = isLight ? '0 0 0 3px rgba(6,182,212,0.08)' : '';
      }
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!fieldError) {
        e.currentTarget.style.borderColor = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
        e.currentTarget.style.boxShadow = isLight ? '0 1px 4px rgba(0,0,0,0.03)' : '';
      }
    },
  });

  return (
    <div className="min-h-screen" style={{ background: isLight ? '#F8FBFF' : '#0B1121' }} dir={isAr ? 'rtl' : 'ltr'}>
      <Header currentPage="contact" />

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden py-24 lg:py-36">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1920&q=80)',
          }}
        />
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: isLight
              ? 'linear-gradient(135deg, rgba(248,251,255,0.92) 0%, rgba(224,242,254,0.88) 50%, rgba(248,251,255,0.94) 100%)'
              : 'linear-gradient(135deg, rgba(11,17,33,0.92) 0%, rgba(26,39,68,0.88) 50%, rgba(11,17,33,0.94) 100%)',
          }}
        />

        {/* Glow orbs */}
        <div
          className="absolute top-0 left-0 w-96 h-96 rounded-full"
          style={{
            opacity: isLight ? 0.04 : 0.15,
            background: 'radial-gradient(circle, #06B6D4, transparent 70%)',
            filter: 'blur(80px)',
            transform: 'translate(-30%, -30%)',
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full"
          style={{
            opacity: isLight ? 0.04 : 0.15,
            background: 'radial-gradient(circle, #2563EB, transparent 70%)',
            filter: 'blur(80px)',
            transform: 'translate(30%, 30%)',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div
            className="inline-flex items-center px-4 py-2 rounded-full mb-8"
            style={{
              background: isLight ? 'rgba(6,182,212,0.06)' : 'rgba(6,182,212,0.1)',
              border: `1px solid ${isLight ? 'rgba(6,182,212,0.12)' : 'rgba(6,182,212,0.2)'}`,
            }}
          >
            <span style={{ color: '#06B6D4' }} className="text-sm font-semibold tracking-wider uppercase">
              {c('badge', 'Contact')}
            </span>
          </div>

          <h1
            className="text-5xl lg:text-7xl font-bold mb-6"
            style={{
              background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.03em',
            }}
          >
            {c('title', "We'd Love to Hear From\u00a0You")}
          </h1>

          <div
            className="w-24 h-1 mx-auto rounded-full mb-8"
            style={{ background: 'linear-gradient(90deg, #06B6D4, #2563EB)' }}
          />

          <p
            className="text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: isLight ? '#475569' : 'rgba(255,255,255,0.7)' }}
          >
            {c('description', 'PAFT is a trusted supplier of high-quality plastic pallets, offering durable, eco-friendly, and cost-effective solutions for your storage and logistics needs. We provide a wide range of plastic pallet options designed to meet the demands of various industries, ensuring safe handling, easy transportation, and optimal warehouse efficiency.')}
          </p>
        </div>
      </section>

      {/* ── Contact Info Cards ── */}
      <section className="py-16 relative" style={{ background: isLight ? '#EFF6FF' : '#0d1529' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: isLight ? '#0F172A' : '#fff' }}>
              {c('contact-cards-section-title', isAr ? '' : 'Reach Us')}{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {c('contact-cards-section-highlight', isAr ? '' : 'Through')}
              </span>
            </h2>
            <div
              className="w-16 h-1 mx-auto rounded-full"
              style={{ background: 'linear-gradient(90deg, #06B6D4, #2563EB)' }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfo.map((item, i) => (
              <div
                key={i}
                className="relative rounded-2xl p-8 text-center transition-all duration-500 group cursor-default"
                style={{
                  background: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(30,41,59,0.5)',
                  backdropFilter: 'blur(10px)',
                  borderTop: `3px solid ${item.color}`,
                  borderLeft: `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`,
                  borderRight: `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`,
                  borderBottom: `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`,
                  boxShadow: isLight ? '0 2px 12px rgba(0,0,0,0.04)' : 'none',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = 'translateY(-8px)';
                  el.style.boxShadow = isLight
                    ? `0 20px 40px rgba(0,0,0,0.08), 0 0 30px ${item.glow.replace('0.25', '0.08')}`
                    : `0 20px 40px rgba(0,0,0,0.3), 0 0 30px ${item.glow}`;
                  const sideColor = item.color + '40';
                  el.style.borderLeftColor = sideColor;
                  el.style.borderRightColor = sideColor;
                  el.style.borderBottomColor = sideColor;
                  el.style.borderTopColor = item.color;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = '';
                  el.style.boxShadow = isLight ? '0 2px 12px rgba(0,0,0,0.04)' : '';
                  const sideColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
                  el.style.borderLeftColor = sideColor;
                  el.style.borderRightColor = sideColor;
                  el.style.borderBottomColor = sideColor;
                  el.style.borderTopColor = item.color;
                }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all duration-300"
                  style={{ background: `${item.color}15`, color: item.color }}
                >
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: isLight ? '#0F172A' : '#fff' }}>
                  {item.title}
                </h3>
                <div className="space-y-1">
                  {item.lines.map((line, j) => (
                    <p key={j} className="text-sm" style={{ color: isLight ? '#64748B' : 'rgba(255,255,255,0.55)' }}>
                      {item.href && j === 0 ? (
                        <a
                          href={item.href}
                          className="hover:underline transition-colors"
                          style={{ color: item.color }}
                        >
                          {line}
                        </a>
                      ) : (
                        line
                      )}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social Networks ── */}
      <section className="py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold" style={{ color: isLight ? '#0F172A' : '#fff' }}>
              {c('social-title', 'Social Networks')}
            </h3>
          </div>
          <div className="flex justify-center gap-5">
            {/* Facebook */}
            <a
              href={c('social-facebook-url', 'https://web.facebook.com/paft.pallets/?locale=ar_AR&_rdc=1&_rdr#')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300"
              style={{
                background: isLight ? 'rgba(59,89,152,0.06)' : 'rgba(59,89,152,0.15)',
                border: `1px solid ${isLight ? 'rgba(59,89,152,0.12)' : 'rgba(59,89,152,0.2)'}`,
                color: '#4267B2',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(59,89,152,0.3)';
                e.currentTarget.style.background = '#4267B2';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
                e.currentTarget.style.background = isLight ? 'rgba(59,89,152,0.06)' : 'rgba(59,89,152,0.15)';
                e.currentTarget.style.color = '#4267B2';
              }}
              aria-label={c('social-facebook-label', 'Follow PAFT on Facebook')}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a
              href={c('social-linkedin-url', 'https://www.linkedin.com/company/packaging-&-food-technology-paft/posts/?feedView=all')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300"
              style={{
                background: isLight ? 'rgba(0,119,181,0.06)' : 'rgba(0,119,181,0.15)',
                border: `1px solid ${isLight ? 'rgba(0,119,181,0.12)' : 'rgba(0,119,181,0.2)'}`,
                color: '#0077B5',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,119,181,0.3)';
                e.currentTarget.style.background = '#0077B5';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
                e.currentTarget.style.background = isLight ? 'rgba(0,119,181,0.06)' : 'rgba(0,119,181,0.15)';
                e.currentTarget.style.color = '#0077B5';
              }}
              aria-label={c('social-linkedin-label', 'Follow PAFT on LinkedIn')}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── Form + Quick Response ── */}
      <section
        className="py-20 relative"
        style={{
          background: isLight
            ? 'linear-gradient(180deg, #F8FBFF 0%, #EFF6FF 50%, #F8FBFF 100%)'
            : 'linear-gradient(180deg, #0B1121 0%, #111d36 50%, #0B1121 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: isLight ? '#0F172A' : '#fff' }}>
              {c('form-title', 'Send Us a')}{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {c('form-title-highlight', 'Message')}
              </span>
            </h2>
            <div
              className="w-16 h-1 mx-auto rounded-full mb-4"
              style={{ background: 'linear-gradient(90deg, #06B6D4, #2563EB)' }}
            />
            <p className="text-base max-w-xl mx-auto" style={{ color: isLight ? '#94A3B8' : 'rgba(255,255,255,0.5)' }}>
              {c('form-subtitle', 'Fill in the details below and our team will get back to you promptly.')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Contact Form — takes 3 of 5 cols */}
            <div
              className="lg:col-span-3 rounded-3xl p-8 md:p-10"
              style={{
                background: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(30,41,59,0.5)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`,
                boxShadow: isLight ? '0 4px 20px rgba(0,0,0,0.04)' : 'none',
              }}
            >
              {isSubmitted ? (
                <div className="text-center py-16">
                  <div
                    className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                    style={{ background: 'rgba(16,185,129,0.15)' }}
                  >
                    <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-3" style={{ color: isLight ? '#0F172A' : '#fff' }}>
                    {c('form-success-title', 'Message Sent!')}
                  </h3>
                  <p className="mb-8" style={{ color: isLight ? '#64748B' : 'rgba(255,255,255,0.5)' }}>
                    {c('form-success-description', "Thank you for reaching out. We'll get back to you shortly.")}
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                      boxShadow: '0 4px 15px rgba(6,182,212,0.3)',
                    }}
                  >
                    {c('form-success-button', 'Send Another Message')}
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6">
                  {/* Name row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium mb-2" style={{ color: isLight ? '#334155' : 'rgba(255,255,255,0.7)' }}>
                        {c('form-first-name', 'First Name')} <span style={{ color: '#06B6D4' }}>*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
                        style={inputStyle(errors.firstName)}
                        placeholder={c('form-placeholder-first', 'John')}
                        dir={isAr ? 'rtl' : 'ltr'}
                        {...focusBorder(errors.firstName)}
                      />
                      {errors.firstName && (
                        <p className="mt-1.5 text-xs text-red-400">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium mb-2" style={{ color: isLight ? '#334155' : 'rgba(255,255,255,0.7)' }}>
                        {c('form-last-name', 'Last Name')} <span style={{ color: '#06B6D4' }}>*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
                        style={inputStyle(errors.lastName)}
                        placeholder={c('form-placeholder-last', 'Doe')}
                        dir={isAr ? 'rtl' : 'ltr'}
                        {...focusBorder(errors.lastName)}
                      />
                      {errors.lastName && (
                        <p className="mt-1.5 text-xs text-red-400">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: isLight ? '#334155' : 'rgba(255,255,255,0.7)' }}>
                      {c('form-email', 'Email')} <span style={{ color: '#06B6D4' }}>*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
                      style={inputStyle(errors.email)}
                      placeholder={c('form-placeholder-email', 'john@company.com')}
                      dir="ltr"
                      {...focusBorder(errors.email)}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: isLight ? '#334155' : 'rgba(255,255,255,0.7)' }}>
                      {c('form-message-label', 'Comment or Message')} <span style={{ color: '#06B6D4' }}>*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 resize-none"
                      style={inputStyle(errors.message)}
                      placeholder={c('form-placeholder-message', 'Tell us about your requirements or ask us anything...')}
                      dir={isAr ? 'rtl' : 'ltr'}
                      {...focusBorder(errors.message)}
                    />
                    <div className="flex justify-between mt-1.5">
                      {errors.message ? (
                        <p className="text-xs text-red-400">{errors.message}</p>
                      ) : (
                        <span />
                      )}
                      <span
                        className="text-xs"
                        style={{
                          color:
                            formData.message.length > MAX_MESSAGE * 0.9
                              ? '#EF4444'
                              : isLight ? '#CBD5E1' : 'rgba(255,255,255,0.35)',
                        }}
                      >
                        {formData.message.length} / {MAX_MESSAGE}
                      </span>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl font-semibold text-lg text-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{
                      background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                      boxShadow: '0 4px 15px rgba(6,182,212,0.3)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(6,182,212,0.5)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(6,182,212,0.3)';
                      e.currentTarget.style.transform = '';
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div
                          className="w-5 h-5 border-2 rounded-full animate-spin"
                          style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }}
                        />
                        {c('form-sending', 'Sending…')}
                      </>
                    ) : (
                      <>
                        {c('form-submit', 'Submit')}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={isAr ? { transform: 'rotate(180deg)' } : undefined}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right column — Quick Response + Extras */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Response */}
              <div
                className="rounded-3xl p-8 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                  boxShadow: '0 20px 50px rgba(6,182,212,0.25)',
                }}
              >
                {/* Decorative circles */}
                <div
                  className="absolute -top-10 -right-10 w-40 h-40 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                />
                <div
                  className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                />

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'rgba(255,255,255,0.2)' }}>
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{c('quick-response-title', 'Quick Response Guarantee')}</h3>
                  <p className="text-white/80 text-sm mb-6 leading-relaxed">
                    {c('quick-response-description', 'We respond to all inquiries within 24 hours during business days.')}
                  </p>
                  <ul className="space-y-3">
                    {[
                      c('quick-response-item-1', 'Free quotes and consultations'),
                      c('quick-response-item-2', 'Custom solutions available'),
                      c('quick-response-item-3', 'Bulk order discounts'),
                      c('quick-response-item-4', 'Fast delivery nationwide'),
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-white/90">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.2)' }}>
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Business Hours */}
              <div
                className="rounded-3xl p-8"
                style={{
                  background: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(30,41,59,0.5)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`,
                  boxShadow: isLight ? '0 2px 12px rgba(0,0,0,0.04)' : 'none',
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: isLight ? '#0F172A' : '#fff' }}>{c('business-hours-title', 'Business Hours')}</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between" style={{ color: isLight ? '#64748B' : 'rgba(255,255,255,0.6)' }}>
                    <span>{c('business-hours-weekdays', 'Sunday – Thursday')}</span>
                    <span className="font-semibold" style={{ color: '#06B6D4' }}>{c('business-hours-weekday-time', '9:00 AM – 6:00 PM')}</span>
                  </div>
                  <div
                    className="h-px"
                    style={{ background: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)' }}
                  />
                  <div className="flex justify-between" style={{ color: isLight ? '#64748B' : 'rgba(255,255,255,0.6)' }}>
                    <span>{c('business-hours-weekend', 'Friday – Saturday')}</span>
                    <span className="font-semibold" style={{ color: isLight ? '#CBD5E1' : 'rgba(255,255,255,0.35)' }}>{c('business-hours-weekend-status', 'Closed')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}