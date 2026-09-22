"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Sparkles,
  Loader2,
  ArrowLeft,
  ArrowRight,
  FolderKanban,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import styles from "./Projects.module.css";
import {
  getProjectCategoriesWithCover,
  getProjectsByCategory,
} from "@/lib/actions/project-actions";

export default function ProjectsPage() {
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);
  const galleryRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [images, setImages] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingImages, setLoadingImages] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    if (videoRef1.current) videoRef1.current.playbackRate = 0.7;
    if (videoRef2.current) videoRef2.current.playbackRate = 0.7;
  }, []);

  // Load all categories with their first project cover image
  useEffect(() => {
    async function loadCategories() {
      setLoadingCategories(true);
      try {
        const data = await getProjectCategoriesWithCover();
        setCategories(data || []);
      } catch (err) {
        console.error("Failed to load project categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    }
    loadCategories();
  }, []);

  // When active category is clicked
  const handleSelectCategory = async (cat) => {
    setActiveCategory(cat);
    setLoadingImages(true);
    setImages([]);

    // Scroll smoothly to gallery section
    if (galleryRef.current) {
      galleryRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    try {
      const data = await getProjectsByCategory(cat.id);
      setImages(data || []);
    } catch (err) {
      console.error("Failed to load category projects:", err);
    } finally {
      setLoadingImages(false);
    }
  };

  const handleBackToFolders = () => {
    setActiveCategory(null);
    setImages([]);
    if (galleryRef.current) {
      galleryRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePrevImage = () => {
    setLightboxIndex((prev) =>
      prev === null ? null : prev > 0 ? prev - 1 : images.length - 1
    );
  };

  const handleNextImage = () => {
    setLightboxIndex((prev) =>
      prev === null ? null : prev < images.length - 1 ? prev + 1 : 0
    );
  };

  useEffect(() => {
    function handleKeyDown(e) {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "ArrowRight") handleNextImage();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, images.length]);

  const currentLightboxImage =
    lightboxIndex !== null && images[lightboxIndex]
      ? images[lightboxIndex]
      : null;

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main style={{ minHeight: "80vh" }}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className="container">
            <span className="subheading">OUR PORTFOLIO</span>
            <h1
              className="heading"
              style={{ fontSize: "3rem", margin: "10px 0", color: "white" }}
            >
              Showcase of Masterpieces
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.9)",
                maxWidth: "600px",
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Explore our proudest architectural achievements and custom installations
              across the globe.
            </p>
          </div>
        </section>

        {/* Content Section: Folders OR Category Detail Gallery */}
        <section ref={galleryRef} className={`section ${styles.content}`}>
          <div className="container">
            {loadingCategories ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "80px 0",
                  color: "#967440",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <Loader2
                  style={{
                    width: "36px",
                    height: "36px",
                    animation: "spin 1s linear infinite",
                  }}
                />
                <p style={{ fontSize: "0.95rem", color: "rgba(26,26,26,0.6)" }}>
                  Loading portfolio collections...
                </p>
              </div>
            ) : !activeCategory ? (
              /* ================= 1. FOLDER / CATEGORIES VIEW ================= */
              <div>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionSub}>PORTFOLIO SHOWCASE</span>
                  <h2 className={styles.sectionTitle}>Projects We Have Done</h2>
                </div>

                {categories.length === 0 ? (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIconWrapper}>
                      <FolderKanban size={28} />
                    </div>
                    <h3 className={styles.emptyTitle}>No Projects Yet</h3>
                    <p className={styles.emptyDesc}>
                      Our team is currently preparing and curating project collections.
                    </p>
                  </div>
                ) : (
                  <div className={styles.folderGrid}>
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => handleSelectCategory(cat)}
                        className={styles.folderCard}
                      >
                        <div className={styles.folderCoverWrapper}>
                          {cat.cover_image ? (
                            <img
                              src={cat.cover_image}
                              alt={cat.name}
                              className={styles.folderCoverImg}
                              loading="lazy"
                            />
                          ) : (
                            <div className={styles.folderPlaceholder}>
                              <Sparkles size={32} />
                              <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                                Collection
                              </span>
                            </div>
                          )}
                        </div>
                        <div className={styles.folderInfo}>
                          <h3 className={styles.folderTitle}>{cat.name}</h3>
                          <div className={styles.folderArrow}>
                            <ArrowRight size={17} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* ================= 2. DEDICATED CATEGORY GALLERY VIEW ================= */
              <div>
                {/* Top Bar with Back Action */}
                <div className={styles.detailTopBar}>
                  <button
                    type="button"
                    onClick={handleBackToFolders}
                    className={styles.backBtn}
                  >
                    <ArrowLeft size={16} />
                    <span>Back to Projects</span>
                  </button>
                </div>

                {/* Category Header with Title & 2-3 Lines Description */}
                <div className={styles.categoryHeader}>
                  <span className={styles.categoryEyebrow}>
                    HEENA MARBLE ATELIER
                  </span>
                  <h2 className={styles.categoryMainTitle}>
                    {activeCategory.name}
                  </h2>
                  <p className={styles.categoryDescription}>
                    Explore our bespoke handcrafted Makrana marble{" "}
                    {activeCategory.name.toLowerCase()} installations. Each piece is
                    custom sculpted by master artisans to deliver timeless luxury,
                    durability, and distinguished architectural elegance to your spaces.
                  </p>
                  <div className={styles.goldDivider} />
                </div>

                {/* Images Grid or Empty State */}
                {loadingImages ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "80px 0",
                      color: "#967440",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <Loader2
                      style={{
                        width: "36px",
                        height: "36px",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                    <p style={{ fontSize: "0.95rem", color: "rgba(26,26,26,0.6)" }}>
                      Loading gallery photos...
                    </p>
                  </div>
                ) : images.length === 0 ? (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIconWrapper}>
                      <Sparkles size={28} />
                    </div>
                    <h3 className={styles.emptyTitle}>
                      Masterpieces Under Curation
                    </h3>
                    <p className={styles.emptyDesc}>
                      We are currently curating and uploading our latest custom
                      installations for &ldquo;{activeCategory.name}&rdquo;.
                    </p>
                    <a
                      href={`https://wa.me/918769386438?text=${encodeURIComponent(
                        `Hello Heena Marble, I would like to inquire about your custom designs in ${activeCategory.name}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.emptyBtn}
                    >
                      <MessageCircle size={18} />
                      <span>Enquire Custom Design on WhatsApp</span>
                    </a>
                  </div>
                ) : (
                  <div className={styles.galleryGrid}>
                    {images.map((img, index) => (
                      <div
                        key={img.id}
                        className={styles.galleryCard}
                        onClick={() => setLightboxIndex(index)}
                      >
                        <div className={styles.galleryImageWrapper}>
                          <img
                            src={img.image_url}
                            alt={`${activeCategory.name} ${index + 1}`}
                            loading="lazy"
                          />
                          <div className={styles.cardOverlay}>
                            <div className={styles.overlayTop}>
                              <div className={styles.zoomBadge}>
                                <ZoomIn size={18} />
                              </div>
                            </div>
                            <div className={styles.overlayBottom}>
                              <span className={styles.categoryTag}>
                                {activeCategory.name}
                              </span>
                              <span className={styles.viewPrompt}>
                                View Fullscreen
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Lightbox Modal */}
        {currentLightboxImage && activeCategory && (
          <div
            className={styles.lightboxBackdrop}
            onClick={(e) => {
              if (e.target === e.currentTarget) setLightboxIndex(null);
            }}
          >
            <div className={styles.lightboxContainer}>
              {/* Close Button */}
              <button
                type="button"
                className={styles.lightboxCloseBtn}
                onClick={() => setLightboxIndex(null)}
                aria-label="Close Lightbox"
              >
                <X size={20} />
              </button>

              {/* Prev Button */}
              {images.length > 1 && (
                <button
                  type="button"
                  className={`${styles.lightboxNavBtn} ${styles.lightboxPrev}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  aria-label="Previous Image"
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              {/* Main Image */}
              <div className={styles.lightboxMain}>
                <img
                  src={currentLightboxImage.image_url}
                  alt={activeCategory.name}
                  className={styles.lightboxImg}
                />
              </div>

              {/* Next Button */}
              {images.length > 1 && (
                <button
                  type="button"
                  className={`${styles.lightboxNavBtn} ${styles.lightboxNext}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  aria-label="Next Image"
                >
                  <ChevronRight size={24} />
                </button>
              )}

              {/* Bottom Meta & WhatsApp Action */}
              <div className={styles.lightboxBottomBar}>
                <div className={styles.lightboxMeta}>
                  <span className={styles.lightboxCategory}>
                    {activeCategory.name}
                  </span>
                  <span className={styles.lightboxCounter}>
                    {lightboxIndex + 1} / {images.length}
                  </span>
                </div>

                <a
                  href={`https://wa.me/918769386438?text=${encodeURIComponent(
                    `Hello Heena Marble, I am interested in this design from ${activeCategory.name}: ${currentLightboxImage.image_url}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.lightboxWhatsappBtn}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MessageCircle size={18} />
                  <span>Enquire Design on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Featured Video Project 1 */}
        <section
          className={styles.splitVideoSection}
          style={{ backgroundColor: "#ffffff" }}
        >
          <div className={styles.splitLayout}>
            <div className={styles.splitVideo}>
              <video ref={videoRef1} autoPlay loop muted playsInline>
                <source src="/div3.mp4" type="video/mp4" />
              </video>
            </div>
            <div className={styles.splitContent}>
              <span className="subheading">FEATURED PROJECT</span>
              <h2>The Grand Mandir</h2>
              <p>
                A monumental architectural achievement carved entirely from pure
                Makrana marble. This project required over two years of master
                craftsmanship to complete the intricate pillars and domed
                ceilings.
              </p>
              <Link
                href="/projects/the-grand-mandir"
                className="btn-primary"
                style={{ marginTop: "30px", position: "relative", zIndex: 10 }}
              >
                View Case Study
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Video Project 2 */}
        <section className={styles.splitVideoSection}>
          <div className={`${styles.splitLayout} ${styles.rowReverse}`}>
            <div className={styles.splitVideo}>
              <video ref={videoRef2} autoPlay loop muted playsInline>
                <source src="/div4.mp4" type="video/mp4" />
              </video>
            </div>
            <div className={styles.splitContent}>
              <span className="subheading">FEATURED PROJECT</span>
              <h2>Royal Pavilion</h2>
              <p>
                An exquisite outdoor pavilion designed for a private royal
                estate. Featuring seamless inlay work and ornate jali screens
                that play beautifully with natural light.
              </p>
              <Link
                href="/projects/royal-pavilion"
                className="btn-primary"
                style={{ marginTop: "30px", position: "relative", zIndex: 10 }}
              >
                View Case Study
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
