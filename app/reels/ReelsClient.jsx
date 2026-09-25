"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import Script from 'next/script';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import styles from './Reels.module.css';

// Helper to check if a URL is an actual valid HTTP(S) link
const isValidReelUrl = (url) => {
  return typeof url === 'string' && (url.startsWith('https://') || url.startsWith('http://')) && !url.includes('TODO_REEL_URL');
};

export default function ReelsClient({ initialReels = [] }) {
  const [reels] = useState(initialReels);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [viewMode, setViewMode] = useState('carousel'); // 'carousel' | 'grid'
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  const carouselRef = useRef(null);

  // Helper to re-process Instagram embeds
  const processInstagramEmbeds = useCallback(() => {
    if (typeof window !== 'undefined' && window.instgrm?.Embeds?.process) {
      window.instgrm.Embeds.process();
    }
  }, []);

  // Process Instagram embeds on mount and when script is loaded
  useEffect(() => {
    processInstagramEmbeds();
    const t1 = setTimeout(processInstagramEmbeds, 400);
    const t2 = setTimeout(processInstagramEmbeds, 1200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isScriptLoaded, processInstagramEmbeds]);

  const handleScriptLoad = () => {
    setIsScriptLoaded(true);
    processInstagramEmbeds();
  };

  // Switch view mode and re-trigger embeds
  const handleViewChange = (mode) => {
    setViewMode(mode);
    setTimeout(processInstagramEmbeds, 150);
  };

  // Update carousel scroll status
  const updateScrollState = useCallback(() => {
    if (!carouselRef.current || reels.length === 0) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);

    // Approximate active slide index
    const cardEl = carouselRef.current.children[0];
    const cardWidth = cardEl ? cardEl.offsetWidth + 20 : 330;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveSlide(Math.min(Math.max(index, 0), reels.length - 1));
  }, [reels.length]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el || viewMode !== 'carousel') return;

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState, { passive: true });

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [viewMode, updateScrollState]);

  // Arrow button scrolling
  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return;
    const scrollAmount = direction === 'left' ? -340 : 340;
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Dot click navigation
  const scrollToSlide = (idx) => {
    if (!carouselRef.current) return;
    const targetCard = carouselRef.current.children[idx];
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  return (
    <>
      <Navbar />
      <CartDrawer />

      {/* Instagram Official Embed Script */}
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={handleScriptLoad}
      />

      <main className={styles.reelsPage}>
        {/* Page Header */}
        <section className={styles.headerSection}>
          <div className="container">
            <div className={styles.headerContent}>
              <span className={styles.eyebrow}>OUR REELS</span>
              <h1 className={styles.mainHeading}>Follow Us on Instagram</h1>
              <p className={styles.subtext}>
                See our craftsmanship in motion — behind the scenes, finished projects, and more.
              </p>
              
              <a
                href="https://www.instagram.com/heena_marble/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.instagramBadge}
                aria-label="Visit Heena Marble Instagram Profile"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span>@heena_marble</span>
              </a>
            </div>
          </div>
        </section>

        {/* Section with View Switcher Toolbar + Carousel/Grid */}
        <section className={styles.contentSection}>
          <div className="container">
            {reels.length > 0 ? (
              <>
                {/* View Switcher Toolbar */}
                <div className={styles.toolbar}>
                  <div className={styles.viewToggleGroup} role="group" aria-label="Layout view mode">
                    <button
                      type="button"
                      className={`${styles.viewBtn} ${viewMode === 'carousel' ? styles.viewBtnActive : ''}`}
                      onClick={() => handleViewChange('carousel')}
                      aria-pressed={viewMode === 'carousel'}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="10" rx="2" ry="2"></rect>
                        <line x1="6" y1="12" x2="18" y2="12"></line>
                      </svg>
                      <span>Slider</span>
                    </button>

                    <button
                      type="button"
                      className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`}
                      onClick={() => handleViewChange('grid')}
                      aria-pressed={viewMode === 'grid'}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                      </svg>
                      <span>Grid</span>
                    </button>
                  </div>
                </div>

                {/* Container for Carousel or Grid */}
                <div className={viewMode === 'carousel' ? styles.carouselContainer : styles.gridContainer}>
                  {/* Carousel Left Arrow (Desktop/Tablet) */}
                  {viewMode === 'carousel' && (
                    <button
                      type="button"
                      className={`${styles.navArrow} ${styles.prevArrow}`}
                      onClick={() => scrollCarousel('left')}
                      disabled={!canScrollLeft}
                      aria-label="Previous reels"
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                    </button>
                  )}

                  {/* Scroll track or Grid track — Keeps same DOM nodes to preserve loaded iframes */}
                  <div
                    ref={carouselRef}
                    className={viewMode === 'carousel' ? styles.carouselTrack : styles.reelsGrid}
                  >
                    {reels.map((reel) => {
                      const hasValidUrl = isValidReelUrl(reel.url);

                      return (
                        <div key={reel.id} className={styles.reelCard}>
                          {/* Loading State Skeleton Placeholder */}
                          <div className={styles.skeleton}>
                            <div className={styles.skeletonIconWrapper}>
                              <svg
                                width="26"
                                height="26"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                              </svg>
                            </div>
                            <span className={styles.skeletonTag}>{reel.label || 'Reel'}</span>
                            <p className={styles.skeletonText}>
                              {hasValidUrl ? 'Loading Reel...' : 'Awaiting Link'}
                            </p>
                          </div>

                          {/* Instagram Embed Blockquote Container */}
                          {hasValidUrl ? (
                            <div className={styles.embedContainer}>
                              <blockquote
                                className={`instagram-media ${styles.instagramMedia}`}
                                data-instgrm-permalink={reel.url}
                                data-instgrm-version="14"
                              >
                                <a
                                  href={reel.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ display: 'none' }}
                                >
                                  Watch on Instagram
                                </a>
                              </blockquote>
                            </div>
                          ) : (
                            <div style={{ display: 'none' }}>
                              <blockquote
                                className={styles.placeholderBlockquote}
                                data-instgrm-permalink={reel.url}
                                data-instgrm-version="14"
                              ></blockquote>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Carousel Right Arrow (Desktop/Tablet) */}
                  {viewMode === 'carousel' && (
                    <button
                      type="button"
                      className={`${styles.navArrow} ${styles.nextArrow}`}
                      onClick={() => scrollCarousel('right')}
                      disabled={!canScrollRight}
                      aria-label="Next reels"
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                  )}
                </div>

                {/* Carousel Dot Indicators */}
                {viewMode === 'carousel' && (
                  <div className={styles.dotIndicators} aria-hidden="true">
                    {reels.map((reel, idx) => (
                      <button
                        key={reel.id}
                        type="button"
                        className={`${styles.dot} ${activeSlide === idx ? styles.dotActive : ''}`}
                        onClick={() => scrollToSlide(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                <p style={{ fontSize: '1.125rem', color: '#666', marginBottom: '1.5rem' }}>
                  No reels published yet. Check back soon!
                </p>
              </div>
            )}

            {/* Bottom CTA Button */}
            <div className={styles.ctaContainer}>
              <a
                href="https://www.instagram.com/heena_marble/reels/"
                target="_blank"
                rel="noopener noreferrer"
                className={`btn-outline ${styles.ctaButton}`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span>View More on Instagram</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
