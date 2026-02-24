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
    if (language === 'ar' && item?.valueAr) return item.valueAr;
    return item?.value || 'Watch Video';
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--page-bg)' }}>
      <Header currentPage="home" />

      <VideoHero
        videoSrc="https://paft.eg/wp-content/uploads/2025/11/Homepage.mp4"
        videoSrc2="https://paft.eg/wp-content/uploads/2025/10/Drop-test-2-1-1.mp4"
        watchVideoText={getVideoText()}
      />

      <BusinessUnits content={content['business-units'] || {}} />

      <Footer />
    </div>
  );
}

