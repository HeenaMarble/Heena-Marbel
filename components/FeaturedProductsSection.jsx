"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import styles from "./FeaturedProductsSection.module.css";

export default function FeaturedProductsSection({ products = [] }) {
  const { addToCart } = useCart();
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

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
  }, [products]);

  // Hide the entire section if no featured products are returned
  if (!products || products.length === 0) {
    return null;
  }

  const handleScroll = (direction) => {
    if (!trackRef.current) return;
    const { clientWidth } = trackRef.current;
    const scrollAmount = direction === "left" ? -clientWidth * 0.75 : clientWidth * 0.75;
    trackRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section id="featured-products" className={`section ${styles.section}`}>
      <div className="container">
        {/* Header with Background & Action */}
        <div className={styles.headerWithBg}>
          <div>
            <span className={styles.subheading}>ONLINE STORE</span>
            <h2 className={`heading ${styles.heading}`}>Featured Products</h2>
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
            <Link href="/shop" className={styles.viewAllBtn}>
              <span>View All Products</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Horizontal Slider Track */}
        <div className={styles.sliderWrapper}>
          <div ref={trackRef} className={styles.sliderTrack}>
            {products.map((product) => (
              <div key={product.id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <Link href={`/shop/${product.id}`}>
                    <img
                      src={product.img || "/placeholder-product.jpg"}
                      alt={product.title}
                      loading="lazy"
                    />
                  </Link>
                </div>

                <div className={styles.details}>
                  <Link
                    href={`/shop/${product.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <h3>{product.title}</h3>
                  </Link>

                  <div className={styles.priceRow}>
                    <div className={styles.priceGroup}>
                      <span className={styles.price}>
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </span>
                      {product.compare_at_price &&
                        Number(product.compare_at_price) > Number(product.price) && (
                          <span className={styles.comparePrice}>
                            ₹{Number(product.compare_at_price).toLocaleString("en-IN")}
                          </span>
                        )}
                    </div>

                    <button
                      type="button"
                      className={styles.inlineAddBtn}
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                      }}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ marginRight: "5px", flexShrink: 0 }}
                      >
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
