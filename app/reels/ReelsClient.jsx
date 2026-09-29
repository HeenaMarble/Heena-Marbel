"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { Play, Sparkles } from "lucide-react";
import ReelModal from "@/components/ReelModal";
import styles from "./Reels.module.css";

const UNIFORM_REEL_PLACEHOLDER = "/mandir_gallery_1_1789756062064.jpg";

function getReelThumbnail(reel) {
  if (reel?.thumbnail_url) return reel.thumbnail_url;
  const match = reel?.url?.match(/(?:reel|reels|p)\/([A-Za-z0-9_-]+)/);
  if (match && match[1]) {
    return `https://www.instagram.com/p/${match[1]}/media/?size=l`;
  }
  return UNIFORM_REEL_PLACEHOLDER;
}

export default function ReelsClient({ initialReels = [] }) {
  const [reels] = useState(initialReels);
  const [viewMode, setViewMode] = useState("carousel"); // 'carousel' | 'grid'
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  // Modal state
  const [activeModalIndex, setActiveModalIndex] = useState(null);

  const carouselRef = useRef(null);

  // Update carousel scroll status
  const updateScrollState = useCallback(() => {
    if (!carouselRef.current || reels.length === 0) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);

    const cardEl = carouselRef.current.children[0];
    const cardWidth = cardEl ? cardEl.offsetWidth + 22 : 302;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveSlide(Math.min(Math.max(index, 0), reels.length - 1));
  }, [reels.length]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el || viewMode !== "carousel") return;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState, { passive: true });

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [viewMode, updateScrollState]);

  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return;
    const scrollAmount = direction === "left" ? -340 : 340;
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const scrollToSlide = (idx) => {
    if (!carouselRef.current) return;
    const targetCard = carouselRef.current.children[idx];
    if (targetCard) {
      targetCard.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  return (
    <>
      <Navbar />
      <CartDrawer />

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
                  <div
                    className={styles.viewToggleGroup}
                    role="group"
                    aria-label="Layout view mode"
                  >
                    <button
                      type="button"
                      className={`${styles.viewBtn} ${
                        viewMode === "carousel" ? styles.viewBtnActive : ""
                      }`}
                      onClick={() => setViewMode("carousel")}
                      aria-pressed={viewMode === "carousel"}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="7" width="20" height="10" rx="2" ry="2"></rect>
                        <line x1="6" y1="12" x2="18" y2="12"></line>
                      </svg>
                      <span>Slider</span>
                    </button>

                    <button
                      type="button"
                      className={`${styles.viewBtn} ${
                        viewMode === "grid" ? styles.viewBtnActive : ""
                      }`}
                      onClick={() => setViewMode("grid")}
                      aria-pressed={viewMode === "grid"}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
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
                <div
                  className={
                    viewMode === "carousel"
                      ? styles.carouselContainer
                      : styles.gridContainer
                  }
                >
                  {/* Carousel Left Arrow */}
                  {viewMode === "carousel" && (
                    <button
                      type="button"
                      className={`${styles.navArrow} ${styles.prevArrow}`}
                      onClick={() => scrollCarousel("left")}
                      disabled={!canScrollLeft}
                      aria-label="Previous reels"
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                    </button>
                  )}

                  {/* Scroll track or Grid track */}
                  <div
                    ref={carouselRef}
                    className={
                      viewMode === "carousel"
                        ? styles.carouselTrack
                        : styles.reelsGrid
                    }
                  >
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

                  {/* Carousel Right Arrow */}
                  {viewMode === "carousel" && (
                    <button
                      type="button"
                      className={`${styles.navArrow} ${styles.nextArrow}`}
                      onClick={() => scrollCarousel("right")}
                      disabled={!canScrollRight}
                      aria-label="Next reels"
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                  )}
                </div>

                {/* Carousel Dot Indicators */}
                {viewMode === "carousel" && (
                  <div className={styles.dotIndicators} aria-hidden="true">
                    {reels.map((reel, idx) => (
                      <button
                        key={reel.id || idx}
                        type="button"
                        className={`${styles.dot} ${
                          activeSlide === idx ? styles.dotActive : ""
                        }`}
                        onClick={() => scrollToSlide(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
                <p
                  style={{
                    fontSize: "1.125rem",
                    color: "#666",
                    marginBottom: "1.5rem",
                  }}
                >
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

      {/* Luxury Fullscreen Popup Modal */}
      <ReelModal
        isOpen={activeModalIndex !== null}
        onClose={() => setActiveModalIndex(null)}
        reels={reels}
        currentIndex={activeModalIndex ?? 0}
        onNavigate={(newIdx) => setActiveModalIndex(newIdx)}
      />

      <Footer />
    </>
  );
}
