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
        videoSrc="https://paft.eg/wp-content/uploads/2025/11/Homepage.mp4"
        videoSrc2="https://paft.eg/wp-content/uploads/2025/10/Drop-test-2-1-1.mp4"
        watchVideoText={content['video-hero']?.['watch-video-text']?.value || "Watch Video"}
      />

      {/* Business Units Section */}
      <BusinessUnits content={content['business-units'] || {}} />

      {/* Footer */}
      <Footer />
    </div>
  );
}

