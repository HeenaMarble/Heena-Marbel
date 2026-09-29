"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Play, Sparkles } from "lucide-react";
import ReelModal from "./ReelModal";
import styles from "./FeaturedReelsSection.module.css";

const UNIFORM_REEL_PLACEHOLDER = "/mandir_gallery_1_1789756062064.jpg";

function getReelThumbnail(reel) {
  if (reel?.thumbnail_url) return reel.thumbnail_url;
  const match = reel?.url?.match(/(?:reel|reels|p)\/([A-Za-z0-9_-]+)/);
  if (match && match[1]) {
    return `https://www.instagram.com/p/${match[1]}/media/?size=l`;
  }
  return UNIFORM_REEL_PLACEHOLDER;
}

export default function FeaturedReelsSection({ reels = [] }) {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Modal State
  const [activeModalIndex, setActiveModalIndex] = useState(null);

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
    const scrollAmount =
      direction === "left" ? -clientWidth * 0.75 : clientWidth * 0.75;
    trackRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <>
      <section id="featured-reels" className={`section ${styles.reelsSection}`}>
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
                const thumbUrl = getReelThumbnail(reel, index);
                const displayLabel = reel.label || `Masterpiece ${index + 1}`;

                return (
                  <div
                    key={reel.id || index}
                    className={styles.reelPosterCard}
                    onClick={() => setActiveModalIndex(index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setActiveModalIndex(index);
                      }
                    }}
                    aria-label={`Play ${displayLabel}`}
                  >
                    {/* Cover Thumbnail */}
                    <div className={styles.posterImgWrapper}>
                      <img
                        src={thumbUrl}
                        alt={displayLabel}
                        className={styles.posterImg}
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = UNIFORM_REEL_PLACEHOLDER;
                        }}
                      />
                    </div>

                    {/* Dark Vignette Overlay */}
                    <div className={styles.posterGradient} />

                    {/* Glowing Center Play Button */}
                    <div className={styles.playButtonWrapper}>
                      <Play size={26} className={styles.playIcon} fill="#ffffff" />
                    </div>

                    {/* Bottom Info */}
                    <div className={styles.posterBottomInfo}>
                      <span className={styles.posterTag}>
                        <Sparkles size={11} />
                        Heena Marble
                      </span>
                      <h3 className={styles.posterTitle}>{displayLabel}</h3>
                      <span className={styles.watchBadge}>Tap to watch video</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Luxury Fullscreen Popup Modal */}
      <ReelModal
        isOpen={activeModalIndex !== null}
        onClose={() => setActiveModalIndex(null)}
        reels={reels}
        currentIndex={activeModalIndex ?? 0}
        onNavigate={(newIdx) => setActiveModalIndex(newIdx)}
      />
    </>
  );
}
