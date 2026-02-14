'use client';

import { useEffect, useState } from 'react';
import VideoHero from '@/components/VideoHero';
import Header from '@/components/Header';
import BusinessUnits from '@/components/BusinessUnits';
import Footer from '@/components/Footer';
import { contentApi, ContentMapResponse } from '@/lib/api';

export default function Home() {
  const [content, setContent] = useState<ContentMapResponse>({});

  useEffect(() => {
    async function fetchContent() {
      try {
        const data = await contentApi.getHomeContent();
        setContent(data);
      } catch (error) {
        console.error('Failed to fetch home content:', error);
        // Continue with empty content (fallback to default values)
      }
    }

    fetchContent();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--page-bg)' }}>
      {/* Modern Header */}
      <Header currentPage="home" />

      {/* Video Hero Section */}
      <VideoHero
        videoSrc="/homepage-video.mp4"
        content={content['video-hero'] || {}}
      />

      {/* Business Units Section */}
      <BusinessUnits content={content['business-units'] || {}} />

      {/* Footer */}
      <Footer />
    </div>
  );
}

