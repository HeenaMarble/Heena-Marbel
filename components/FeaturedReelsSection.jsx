"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import styles from "./FeaturedReelsSection.module.css";

const isValidReelUrl = (url) => {
  return (
    typeof url === "string" &&
    (url.startsWith("https://") || url.startsWith("http://")) &&
    !url.includes("TODO_REEL_URL")
  );
};

export default function FeaturedReelsSection({ reels = [] }) {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Helper to process Instagram embeds
  const processInstagramEmbeds = useCallback(() => {
    if (typeof window !== "undefined" && window.instgrm?.Embeds?.process) {
      window.instgrm.Embeds.process();
    }
  }, []);

  useEffect(() => {
    processInstagramEmbeds();
    const t1 = setTimeout(processInstagramEmbeds, 400);
    const t2 = setTimeout(processInstagramEmbeds, 1200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isScriptLoaded, reels, processInstagramEmbeds]);

  const handleScriptLoad = () => {
    setIsScriptLoaded(true);
    processInstagramEmbeds();
  };

  const checkScroll = useCallback(() => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = trackRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [reels, checkScroll]);

  if (!reels || reels.length === 0) {
    return null;
  }

  const handleScroll = (direction) => {
    if (!trackRef.current) return;
    const { clientWidth } = trackRef.current;
    const scrollAmount = direction === "left" ? -clientWidth * 0.75 : clientWidth * 0.75;
    trackRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section id="featured-reels" className={`section ${styles.reelsSection}`}>
      {/* Instagram Official Embed Script */}
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={handleScriptLoad}
      />

      <div className="container">
        {/* Header with Background & Action */}
        <div className={styles.headerWithBg}>
          <div>
            <span className={styles.subheading}>CRAFT IN MOTION</span>
            <h2 className={`heading ${styles.heading}`}>Watch Us on Instagram</h2>
          </div>

          <div className={styles.headerActions}>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                disabled={!canScrollLeft}
                className={styles.navBtn}
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={() => handleScroll("right")}
                disabled={!canScrollRight}
                className={styles.navBtn}
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <Link href="/reels" className={styles.viewAllBtn}>
              <span>View All Reels</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Horizontal Slider Track */}
        <div className={styles.sliderWrapper}>
          <div ref={trackRef} className={styles.sliderTrack}>
            {reels.map((reel, index) => {
              const hasValidUrl = isValidReelUrl(reel.url);
              const displayLabel = reel.label || `Reel ${index + 1}`;

              return (
                <div key={reel.id || index} className={styles.reelCard}>
                  {/* Card Header */}
                  <div className={styles.cardTopBar}>
                    <span className={styles.cardTopLabel}>{displayLabel}</span>
                    <a
                      href={reel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.cardInstaLink}
                    >
                      <span>Instagram</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>

                  {/* Skeleton / Fallback Layer */}
                  <div className={styles.skeleton}>
                    <div className={styles.skeletonIconWrapper}>
                      <svg
                        width="24"
                        height="24"
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
                    </div>
                    <span className={styles.skeletonTag}>{displayLabel}</span>
                    <p className={styles.skeletonText}>
                      {hasValidUrl ? "Loading Reel..." : "Awaiting Link"}
                    </p>
                    {hasValidUrl && (
                      <a
                        href={reel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 text-xs font-semibold text-[#967440] hover:underline inline-flex items-center gap-1"
                      >
                        Open Reel <ExternalLink size={12} />
                      </a>
                    )}
                  </div>

                  {/* Instagram Embed Blockquote */}
                  {hasValidUrl && (
                    <div className={styles.embedContainer}>
                      <blockquote
                        className="instagram-media"
                        data-instgrm-permalink={reel.url}
                        data-instgrm-version="14"
                        style={{
                          background: "#FFF",
                          border: 0,
                          borderRadius: "16px",
                          margin: "0px",
                          maxWidth: "540px",
                          minWidth: "100%",
                          padding: 0,
                          width: "100%",
                        }}
                      >
                        <a
                          href={reel.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: "none" }}
                        >
                          Watch on Instagram
                        </a>
                      </blockquote>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
