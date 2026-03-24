'use client';

import { useEffect, useState } from 'react';
import VideoHero from '@/components/VideoHero';
import Header from '@/components/Header';
import BusinessUnits from '@/components/BusinessUnits';
import Footer from '@/components/Footer';
import { contentApi, ContentMapResponse } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const [content, setContent] = useState<ContentMapResponse>({});
  const { language } = useLanguage();

  useEffect(() => {
    async function fetchContent() {
      try {
        const data = await contentApi.getHomeContent();
        setContent(data);
      } catch (error) {
        console.error('Failed to fetch home content:', error);
      }
    }

    fetchContent();
  }, []);

  // Language-aware content getter
  const getVideoText = () => {
    const item = content['video-hero']?.['watch-video-text'];
    if (language === 'ar' && item?.valueAr != null) return item.valueAr;
    return item?.value != null ? item.value : 'Watch Video';
  };

  const heroSlides = [
    {
      image: 'https://paft.eg/wp-content/uploads/2026/02/Copy-of-vlcsnap-2024-07-21-14h26m13s806-scaled.png',
      video: 'https://paft.eg/wp-content/uploads/2025/11/Homepage.mp4'
    },
    {
      image: 'https://paft.eg/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-24-at-12.57.33-PM.jpeg',
      video: 'https://paft.eg/wp-content/uploads/2026/03/WhatsApp-Video-2026-03-01-at-12.23.19-PM.mp4'
    },
    {
      image: 'https://paft.eg/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-08-at-3.13.59-PM.jpeg',
      video: 'https://paft.eg/wp-content/uploads/2026/03/Lab.mp4'
    },
    {
      image: 'https://paft.eg/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-24-at-5.17.46-PM.jpeg',
      video: 'https://paft.eg/wp-content/uploads/2025/10/Drop-test-2-1-1.mp4'
    },
    {
      image: 'https://paft.eg/wp-content/uploads/2025/10/Hero-Section.png',
      video: null
    }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--page-bg)' }}>
      <Header currentPage="home" />

      <VideoHero
        slides={heroSlides}
        watchVideoText={getVideoText()}
      />

      <BusinessUnits content={content['business-units'] || {}} />

      <Footer />
    </div>
  );
}

