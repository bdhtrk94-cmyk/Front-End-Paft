'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { contentApi, ContentMapResponse } from '@/lib/api';
import { useTheme } from '@/context/ThemeContext';

const values = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: '#06B6D4',
    glow: 'rgba(6, 182, 212, 0.3)',
    glowLight: 'rgba(6, 182, 212, 0.12)',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: '#2563EB',
    glow: 'rgba(37, 99, 235, 0.3)',
    glowLight: 'rgba(37, 99, 235, 0.12)',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: '#10B981',
    glow: 'rgba(16, 185, 129, 0.3)',
    glowLight: 'rgba(16, 185, 129, 0.12)',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.3)',
    glowLight: 'rgba(245, 158, 11, 0.12)',
  },
];

export default function About() {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const [content, setContent] = useState<ContentMapResponse>({});
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    async function fetchContent() {
      try {
        const data = await contentApi.getPageContent('about');
        setContent(data);
      } catch (error) {
        console.error('Failed to fetch about content:', error);
      }
    }

    fetchContent();
  }, []);

  const heroContent = content['hero'] || {};
  const whoWeAreContent = content['who-we-are'] || {};
  const valuesContent = content['values'] || {};
  const ctaContent = content['cta'] || {};

  return (
    <div className="min-h-screen" style={{ background: isLight ? '#F8FBFF' : '#0B1121' }}>
      <Header currentPage="about" />

      {/* ════════════════════  Hero Section  ════════════════════ */}
      <section
        className="relative overflow-hidden py-28 lg:py-36"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: isLight
              ? 'linear-gradient(135deg, rgba(248,251,255,0.88) 0%, rgba(224,242,254,0.82) 50%, rgba(248,251,255,0.92) 100%)'
              : 'linear-gradient(135deg, rgba(11,17,33,0.88) 0%, rgba(15,23,42,0.82) 50%, rgba(11,17,33,0.92) 100%)',
          }}
        />
        {/* Decorative gradient blurs */}
        <div
          className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full"
          style={{
            opacity: isLight ? 0.1 : 0.15,
            background: 'radial-gradient(circle, #06B6D4, transparent 70%)',
            filter: 'blur(100px)',
            transform: 'translate(-30%, -30%)',
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full"
          style={{
            opacity: isLight ? 0.08 : 0.1,
            background: 'radial-gradient(circle, #2563EB, transparent 70%)',
            filter: 'blur(100px)',
            transform: 'translate(30%, 30%)',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div
            className="inline-flex items-center px-5 py-2.5 rounded-full mb-8"
            style={{
              background: isLight ? 'rgba(6, 182, 212, 0.08)' : 'rgba(6, 182, 212, 0.1)',
              border: `1px solid ${isLight ? 'rgba(6, 182, 212, 0.2)' : 'rgba(6, 182, 212, 0.2)'}`,
              backdropFilter: 'blur(10px)',
            }}
          >
            <span style={{ color: '#06B6D4' }} className="text-sm font-semibold tracking-wider uppercase">
              {heroContent['badge-text']?.value || 'About PAFT'}
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
            {heroContent['title']?.value || 'Our Vision'}
          </h1>

          <div
            className="w-24 h-1 mx-auto rounded-full mb-8"
            style={{ background: 'linear-gradient(90deg, #06B6D4, #2563EB)' }}
          ></div>

          <p
            className="text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed font-medium"
            style={{ color: isLight ? '#334155' : 'rgba(255, 255, 255, 0.7)' }}
          >
            {heroContent['description']?.value || 'Be, & be recognized as the pace setters in providing optimal transport logistics & technical packaging technology solutions.'}
          </p>
        </div>
      </section>

      {/* ════════════════════  Who We Are Section  ════════════════════ */}
      <section
        className="py-24 relative"
        style={{
          background: isLight ? '#F8FBFF' : '#0B1121',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div>
              <div
                className="inline-flex items-center px-4 py-2 rounded-full mb-6"
                style={{
                  background: isLight ? 'rgba(6, 182, 212, 0.06)' : 'rgba(6, 182, 212, 0.1)',
                  border: `1px solid ${isLight ? 'rgba(6, 182, 212, 0.15)' : 'rgba(6, 182, 212, 0.2)'}`,
                }}
              >
                <span style={{ color: '#06B6D4' }} className="text-sm font-semibold tracking-wider uppercase">
                  {whoWeAreContent['badge-text']?.value || 'Who We Are'}
                </span>
              </div>

              <h2
                className="text-4xl lg:text-5xl font-bold mb-8"
                style={{ letterSpacing: '-0.02em' }}
              >
                <span
                  style={{
                    background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {whoWeAreContent['title']?.value || 'Packaging Applications & Future Technologies'}
                </span>
              </h2>

              <div className="space-y-5">
                <p className="text-lg leading-relaxed" style={{ color: isLight ? '#475569' : 'rgba(255, 255, 255, 0.65)' }}>
                  {whoWeAreContent['paragraph1']?.value || 'PAFT (Packaging Applications & Future Technologies) is a leading provider of innovative supply chain solutions in the MENA region.'}
                </p>
                <p className="text-lg leading-relaxed" style={{ color: isLight ? '#475569' : 'rgba(255, 255, 255, 0.65)' }}>
                  {whoWeAreContent['paragraph2']?.value || 'Our commitment to excellence is reflected in our use of premium materials, cutting-edge technology, and our tailored service offerings.'}
                </p>
                <p className="text-lg leading-relaxed" style={{ color: isLight ? '#475569' : 'rgba(255, 255, 255, 0.65)' }}>
                  {whoWeAreContent['paragraph3']?.value || 'At PAFT, we understand the challenges faced by industries in managing their supply chains.'}
                </p>
                <p className="text-lg leading-relaxed" style={{ color: isLight ? '#475569' : 'rgba(255, 255, 255, 0.65)' }}>
                  {whoWeAreContent['paragraph4']?.value || 'Whether you need heavy-duty pallets that can withstand significant loads, flexible rental solutions, or specialized containers for liquid storage, PAFT has the expertise and products to support your business needs.'}
                </p>
              </div>

              <div
                className="mt-8 p-6 rounded-2xl"
                style={{
                  background: isLight ? 'rgba(6, 182, 212, 0.04)' : 'rgba(6, 182, 212, 0.05)',
                  borderLeft: '4px solid #06B6D4',
                  borderTop: isLight ? '1px solid rgba(6, 182, 212, 0.12)' : 'none',
                  borderRight: isLight ? '1px solid rgba(6, 182, 212, 0.12)' : 'none',
                  borderBottom: isLight ? '1px solid rgba(6, 182, 212, 0.12)' : 'none',
                }}
              >
                <p className="text-lg font-semibold italic" style={{ color: '#06B6D4' }}>
                  &ldquo;{whoWeAreContent['quote']?.value || 'At PAFT, innovation delivered at great value is at the heart of everything we do, making us the trusted partner for businesses across various industries.'}&rdquo;
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  opacity: isLight ? 0.15 : 0.3,
                  background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                  filter: 'blur(40px)',
                  transform: 'scale(0.9)',
                }}
              ></div>
              <div
                className="relative rounded-3xl overflow-hidden"
                style={{
                  boxShadow: isLight ? '0 30px 60px rgba(0, 0, 0, 0.12)' : '0 30px 60px rgba(0, 0, 0, 0.4)',
                  border: isLight ? '1px solid rgba(0, 0, 0, 0.06)' : '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <img
                  src="https://paft.eg/wp-content/uploads/2026/02/images.jpg"
                  alt="PAFT Company"
                  className="w-full h-auto object-cover"
                  style={{ minHeight: '400px' }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: isLight
                      ? 'linear-gradient(180deg, transparent 60%, rgba(248, 251, 255, 0.5) 100%)'
                      : 'linear-gradient(180deg, transparent 60%, rgba(11, 17, 33, 0.6) 100%)',
                  }}
                ></div>
              </div>

              {/* Stats floating cards */}
              <div
                className="absolute -bottom-6 -left-6 px-6 py-4 rounded-2xl"
                style={{
                  background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${isLight ? 'rgba(6, 182, 212, 0.15)' : 'rgba(6, 182, 212, 0.2)'}`,
                  boxShadow: isLight ? '0 20px 40px rgba(0, 0, 0, 0.08)' : '0 20px 40px rgba(0, 0, 0, 0.3)',
                }}
              >
                <div className="text-3xl font-bold" style={{ color: '#06B6D4' }}>
                  {whoWeAreContent['stat1-number']?.value || '10+'}
                </div>
                <div className="text-sm" style={{ color: isLight ? '#64748B' : 'rgba(255, 255, 255, 0.6)' }}>
                  {whoWeAreContent['stat1-text']?.value || 'Years Experience'}
                </div>
              </div>

              <div
                className="absolute -top-6 -right-6 px-6 py-4 rounded-2xl"
                style={{
                  background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${isLight ? 'rgba(37, 99, 235, 0.15)' : 'rgba(37, 99, 235, 0.2)'}`,
                  boxShadow: isLight ? '0 20px 40px rgba(0, 0, 0, 0.08)' : '0 20px 40px rgba(0, 0, 0, 0.3)',
                }}
              >
                <div className="text-3xl font-bold" style={{ color: '#2563EB' }}>
                  {whoWeAreContent['stat2-number']?.value || 'MENA'}
                </div>
                <div className="text-sm" style={{ color: isLight ? '#64748B' : 'rgba(255, 255, 255, 0.6)' }}>
                  {whoWeAreContent['stat2-text']?.value || 'Region Leader'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════  Values Section  ════════════════════ */}
      <section
        className="py-24 relative"
        style={{
          background: isLight
            ? 'linear-gradient(180deg, #EFF6FF 0%, #E0F2FE 50%, #EFF6FF 100%)'
            : 'linear-gradient(180deg, #0B1121 0%, #111d36 50%, #0B1121 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-4xl lg:text-5xl font-bold mb-4"
              style={{ letterSpacing: '-0.02em' }}
            >
              <span
                style={{
                  background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {valuesContent['title']?.value || 'Our Core Values'}
              </span>
            </h2>
            <div
              className="w-20 h-1 mx-auto rounded-full mb-6"
              style={{ background: 'linear-gradient(90deg, #06B6D4, #2563EB)' }}
            ></div>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: isLight ? '#64748B' : 'rgba(255, 255, 255, 0.5)' }}
            >
              {valuesContent['subtitle']?.value || 'The principles that guide everything we do at PAFT'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const isHovered = hoveredValue === index;
              const valueNumber = index + 1;
              const title = valuesContent[`value${valueNumber}-title`]?.value || '';
              const description = valuesContent[`value${valueNumber}-description`]?.value || '';
              const glow = isLight ? value.glowLight : value.glow;

              return (
                <div
                  key={index}
                  className="relative rounded-2xl p-8 text-center cursor-pointer"
                  style={{
                    background: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(30, 41, 59, 0.5)',
                    backdropFilter: 'blur(10px)',
                    borderTop: `3px solid ${value.color}`,
                    borderLeft: `1px solid ${isHovered ? value.color + '40' : isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255, 255, 255, 0.06)'}`,
                    borderRight: `1px solid ${isHovered ? value.color + '40' : isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255, 255, 255, 0.06)'}`,
                    borderBottom: `1px solid ${isHovered ? value.color + '40' : isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255, 255, 255, 0.06)'}`,
                    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                    boxShadow: isHovered
                      ? isLight
                        ? `0 20px 40px rgba(0,0,0,0.08), 0 0 30px ${glow}`
                        : `0 20px 40px rgba(0,0,0,0.3), 0 0 30px ${glow}`
                      : isLight
                        ? '0 4px 20px rgba(0,0,0,0.04)'
                        : '0 4px 20px rgba(0,0,0,0.2)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={() => setHoveredValue(index)}
                  onMouseLeave={() => setHoveredValue(null)}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    style={{
                      background: `${value.color}15`,
                      color: value.color,
                      boxShadow: isHovered ? `0 0 25px ${glow}` : 'none',
                      transition: 'all 0.4s ease',
                      transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    {value.icon}
                  </div>
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ color: isLight ? '#0F172A' : '#fff' }}
                  >
                    {title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: isLight ? '#64748B' : 'rgba(255, 255, 255, 0.55)' }}
                  >
                    {description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════  CTA Section  ════════════════════ */}
      <section className="py-20 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: isLight
              ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.06), rgba(37, 99, 235, 0.06))'
              : 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(37, 99, 235, 0.15))',
          }}
        ></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2
            className="text-4xl lg:text-5xl font-bold mb-6"
            style={{ color: isLight ? '#0F172A' : '#fff' }}
          >
            {ctaContent['title']?.value || 'Ready to Work With Us?'}
          </h2>
          <p
            className="text-xl mb-10"
            style={{ color: isLight ? '#64748B' : 'rgba(255, 255, 255, 0.6)' }}
          >
            {ctaContent['description']?.value || "Let's discuss how PAFT can help optimize your logistics operations"}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/contact"
              className="px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all duration-300 hover:shadow-lg hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
                boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
              }}
            >
              {ctaContent['button1-text']?.value || 'Get in Touch →'}
            </a>
            <a
              href="/products"
              className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105"
              style={{
                border: isLight ? '2px solid rgba(15, 23, 42, 0.15)' : '2px solid rgba(255, 255, 255, 0.2)',
                color: isLight ? '#334155' : 'rgba(255, 255, 255, 0.8)',
                background: isLight ? 'rgba(255,255,255,0.6)' : 'transparent',
                backdropFilter: 'blur(10px)',
              }}
            >
              {ctaContent['button2-text']?.value || 'Browse Products'}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}