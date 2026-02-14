'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

interface VideoHeroProps {
  videoSrc: string;
  content?: {
    [key: string]: {
      value: string;
      valueAr?: string;
      id: number;
    };
  };
}

const heroImages = [
  'https://paft.eg/wp-content/uploads/2026/02/Copy-of-vlcsnap-2024-07-21-14h26m13s806-scaled.png',
  'https://paft.eg/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-24-at-12.57.33-PM.jpeg',
  'https://paft.eg/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-08-at-3.13.59-PM.jpeg',
  'https://paft.eg/wp-content/uploads/2025/10/picture.png'
];

export default function VideoHero({ videoSrc, content = {} }: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get content values with fallbacks
  const getContentValue = (key: string, fallback: string = '') => {
    return content[key]?.value || fallback;
  };

  // Auto-rotate carousel
  const startAutoRotate = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        setIsTransitioning(false);
      }, 500);
    }, 4000);
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      startAutoRotate();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, startAutoRotate]);

  const handlePlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(console.error);
      }
    }, 100);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const goToSlide = (index: number) => {
    if (index === currentSlide) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 400);
    startAutoRotate();
  };

  return (
    <section className="relative h-[70vh] overflow-hidden bg-black">
      {/* Image Carousel */}
      <div
        className={`absolute inset-0 transition-all duration-700 ease-in-out ${isPlaying ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
          }`}
      >
        {heroImages.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ease-in-out ${index === currentSlide && !isTransitioning ? 'opacity-100' : 'opacity-0'
              }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`PAFT Hero ${index + 1}`}
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center center' }}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

        {/* Play Button */}
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center z-10 group cursor-pointer"
          aria-label="Play video"
        >
          <div className="relative">
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" style={{ animationDuration: '2s' }} />
            {/* Outer glow */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300 shadow-2xl">
              {/* Inner play icon */}
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1 drop-shadow-lg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          {/* Watch video text */}
          <span className="absolute bottom-[22%] text-white/80 text-sm font-medium tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {getContentValue('watch-video-text', 'Watch Video')}
          </span>
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${index === currentSlide
                ? 'w-8 h-2.5 bg-white shadow-lg shadow-white/30'
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Video Layer */}
      <div
        className={`absolute inset-0 transition-all duration-700 ease-in-out ${isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          controls
          onEnded={handleVideoEnd}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Close / Back to carousel button */}
        <button
          onClick={handleVideoEnd}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-all border border-white/20"
          aria-label="Close video"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </section>
  );
}