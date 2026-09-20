"use client";

import { useEffect, useState } from 'react';
import Script from 'next/script';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import styles from './Reels.module.css';

/**
 * 6 Instagram Reels placeholders as specified in requirements.
 * Replace TODO_REEL_URL_1 through TODO_REEL_URL_6 with actual Instagram Reel links:
 * e.g. 'https://www.instagram.com/reel/C34xyz123/'
 */
const REELS_DATA = [
  { id: 1, url: 'https://www.instagram.com/reel/DdJWnTnzMBs/', label: 'Reel 01' },
  { id: 2, url: 'https://www.instagram.com/reel/DdHG_ZWB7JN/', label: 'Reel 02' },
  { id: 3, url: 'https://www.instagram.com/reel/DdbYebizy7F/', label: 'Reel 03' },
  { id: 4, url: 'https://www.instagram.com/reel/DckzoF2Tv_X/', label: 'Reel 04' },
  { id: 5, url: 'https://www.instagram.com/reel/DcLWdleTDVx/', label: 'Reel 05' },
  { id: 6, url: 'https://www.instagram.com/reel/DdHG_ZWB7JN/', label: 'Reel 06' }
];

// Helper to check if a URL is an actual valid HTTP(S) link
const isValidReelUrl = (url) => {
  return typeof url === 'string' && (url.startsWith('https://') || url.startsWith('http://')) && !url.includes('TODO_REEL_URL');
};

export default function ReelsPage() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Process Instagram embeds on mount and when script is loaded
  useEffect(() => {
    const processEmbeds = () => {
      if (typeof window !== 'undefined' && window.instgrm?.Embeds?.process) {
        window.instgrm.Embeds.process();
      }
    };

    processEmbeds();
    const t1 = setTimeout(processEmbeds, 400);
    const t2 = setTimeout(processEmbeds, 1200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isScriptLoaded]);

  const handleScriptLoad = () => {
    setIsScriptLoaded(true);
    if (typeof window !== 'undefined' && window.instgrm?.Embeds?.process) {
      window.instgrm.Embeds.process();
    }
  };

  return (
    <>
      <Navbar />
      <CartDrawer />

      {/* Instagram Official Embed Script loaded once */}
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

        {/* Responsive Reels Grid */}
        <section className={styles.gridSection}>
          <div className="container">
            <div className={styles.reelsGrid}>
              {REELS_DATA.map((reel) => {
                const hasValidUrl = isValidReelUrl(reel.url);

                return (
                  <div key={reel.id} className={styles.reelCard}>
                    {/* Loading State Skeleton / Placeholder inside each 9:16 grid cell */}
                    <div className={styles.skeleton}>
                      <div className={styles.skeletonIconWrapper}>
                        <svg
                          width="28"
                          height="28"
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
                      <span className={styles.skeletonTag}>{reel.label}</span>
                      <p className={styles.skeletonText}>
                        {hasValidUrl ? 'Loading Instagram Reel...' : 'Awaiting Reel Link'}
                      </p>
                    </div>

                    {/* Instagram oEmbed blockquote container */}
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
                      /* Structural placeholder blockquote when URLs are TODO placeholders to prevent local 404 */
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
