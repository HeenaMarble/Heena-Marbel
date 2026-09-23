"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import styles from "@/app/shop/[id]/ProductDetail.module.css";

export default function ProductDetailClient({ product, relatedProducts = [] }) {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(
    (product?.images && product.images[0]) || product?.img || ""
  );

  const hasMultipleImages = Boolean(product?.images && product.images.length > 1);
  const hasDimensions = Boolean(
    product?.dimensions && product.dimensions.length > 0
  );

  const [activeTab, setActiveTab] = useState(
    hasDimensions ? "specs" : "details"
  );

  useEffect(() => {
    setSelectedImage(
      (product?.images && product.images[0]) || product?.img || ""
    );
    setActiveTab(
      product?.dimensions && product.dimensions.length > 0
        ? "specs"
        : "details"
    );
  }, [product?.id, product?.images, product?.img, product?.dimensions]);

  if (!product) {
    return (
      <>
        <Navbar />
        <main
          style={{
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1>Product Not Found</h1>
          <Link
            href="/shop"
            className="btn-primary"
            style={{ marginTop: "20px" }}
          >
            Return to Shop
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main style={{ minHeight: "80vh", backgroundColor: "var(--bg-section)" }}>
        <div className={styles.pageContainer}>
          <Link href="/shop" className={styles.backLink}>
            Back to Shop
          </Link>

          <div className={styles.productMainCard}>
            <div className={styles.productLayout}>
              {/* Left Column: Images & Guarantee */}
              <div className={styles.imageColumn}>
                <div className={styles.imageWrapper}>
                  <img
                    src={selectedImage}
                    alt={product.title}
                    className={styles.mainImage}
                  />
                </div>

                {/* Thumbnail Strip */}
                {hasMultipleImages && (
                  <div className={styles.thumbnailStrip}>
                    {product.images.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImage(imgUrl)}
                        className={`${styles.thumbnailBtn} ${
                          selectedImage === imgUrl ? styles.thumbnailActive : ""
                        }`}
                        aria-label={`View image ${idx + 1}`}
                      >
                        <img
                          src={imgUrl}
                          alt=""
                          className={styles.thumbnailImage}
                        />
                      </button>
                    ))}
                  </div>
                )}

                <div className={`${styles.guaranteeBox} ${styles.desktopOnly}`}>
                  <div className={styles.guaranteeHeader}>
                    <span className={styles.guaranteeShield}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--primary-color)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="8" r="6" />
                        <path d="m9 11 2 2 4-4" />
                        <path d="m8.5 13-2 8 5.5-2.5 5.5 2.5-2-8" />
                      </svg>
                    </span>
                    <strong>100% Authenticity Guarantee</strong>
                  </div>
                  <p>
                    All our products are carved from authentic, certified Makrana
                    marble.
                  </p>
                </div>
              </div>

              {/* Right Column: Hero Actions & Highlights */}
              <div className={styles.detailsColumn}>
                <span className={styles.category}>
                  {product.category_name
                    ? product.category_name.toUpperCase()
                    : "AUTHENTIC MAKRANA MARBLE"}
                </span>
                <h1 className={styles.title}>{product.title}</h1>

                <div className={styles.priceRatingRow}>
                  <p className={styles.price}>
                    ₹{product.price.toLocaleString()}
                  </p>
                  <div className={styles.ratingBadge}>
                    <span className={styles.starFilled}>★</span>
                    <span>4.8</span>
                    <span className={styles.ratingReviews}>(24 reviews)</span>
                  </div>
                </div>

                <button
                  className={`btn-primary ${styles.addToCartBtn}`}
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>

                <div className={styles.trustStrip}>
                  <div className={styles.trustItem}>
                    <span className={styles.trustIcon}>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--primary-color)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="1" y="3" width="15" height="13" rx="1"></rect>
                        <polygon points="16 8 20 8 23 11 23 16 16 8"></polygon>
                        <circle cx="5.5" cy="18.5" r="2.5"></circle>
                        <circle cx="18.5" cy="18.5" r="2.5"></circle>
                      </svg>
                    </span>
                    <span>Insured Transit</span>
                  </div>
                  <div className={styles.trustItem}>
                    <span className={styles.trustIcon}>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--primary-color)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 3h12l4 6-10 13L2 9Z" />
                        <path d="M11 3 8 9l4 13" />
                        <path d="M13 3l3 6-4 13" />
                      </svg>
                    </span>
                    <span>Pure Makrana</span>
                  </div>
                  <div className={styles.trustItem}>
                    <span className={styles.trustIcon}>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--primary-color)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                      </svg>
                    </span>
                    <span>Damage-Proof Box</span>
                  </div>
                </div>

                <p className={styles.shippingNotice}>
                  Shipping & taxes calculated at checkout.
                </p>

                {product.desc && (
                  <p className={styles.productSnippet}>{product.desc}</p>
                )}

                <div className={styles.featuresList}>
                  <div className={styles.featureItem}>
                    <span className={styles.featureIcon}>✓</span>
                    <span>Premium Quality White Marble</span>
                  </div>
                  <div className={styles.featureItem}>
                    <span className={styles.featureIcon}>✓</span>
                    <span>Hand-carved with intricate detailing</span>
                  </div>
                  <div className={styles.featureItem}>
                    <span className={styles.featureIcon}>✓</span>
                    <span>Durable and weather-resistant</span>
                  </div>
                </div>

                <div className={`${styles.guaranteeBox} ${styles.mobileOnly}`}>
                  <div className={styles.guaranteeHeader}>
                    <span className={styles.guaranteeShield}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--primary-color)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="8" r="6" />
                        <path d="m9 11 2 2 4-4" />
                        <path d="m8.5 13-2 8 5.5-2.5 5.5 2.5-2-8" />
                      </svg>
                    </span>
                    <strong>100% Authenticity Guarantee</strong>
                  </div>
                  <p>
                    All our products are carved from authentic, certified Makrana
                    marble.
                  </p>
                </div>
              </div>
            </div>

            {/* Full-Width Specifications & Details Tabs */}
            <div className={styles.tabsSection}>
              <div className={styles.tabsHeader}>
                {hasDimensions && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("specs")}
                    className={`${styles.tabBtn} ${
                      activeTab === "specs" ? styles.tabBtnActive : ""
                    }`}
                  >
                    Specifications
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveTab("details")}
                  className={`${styles.tabBtn} ${
                    activeTab === "details" ? styles.tabBtnActive : ""
                  }`}
                >
                  Product Details
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("care")}
                  className={`${styles.tabBtn} ${
                    activeTab === "care" ? styles.tabBtnActive : ""
                  }`}
                >
                  Care & Authenticity
                </button>
              </div>

              <div className={styles.tabContent}>
                {activeTab === "specs" && hasDimensions && (
                  <div className={styles.specifications}>
                    <table className={styles.specsTable}>
                      <tbody>
                        {product.dimensions.map((d, i) => (
                          <tr key={i}>
                            <td>{d.label}</td>
                            <td>{d.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === "details" && (
                  <div>
                    <p className={styles.tabParagraph}>{product.desc}</p>
                    <p className={styles.tabParagraph}>
                      Crafted by master artisans in Makrana, Rajasthan, this piece
                      represents the pinnacle of traditional Indian stone
                      carving. Carved from a single block of authentic Makrana
                      marble, it features delicate natural veining and a smooth,
                      translucent luster that endures for generations. Perfect for
                      elevating both interior and exterior spaces.
                    </p>
                  </div>
                )}

                {activeTab === "care" && (
                  <div className={styles.careGrid}>
                    <div className={styles.careCard}>
                      <h4>100% Pure Makrana Marble</h4>
                      <p>
                        Carved exclusively from Makrana mines. Does not absorb water,
                        yellow, or crack over time.
                      </p>
                    </div>
                    <div className={styles.careCard}>
                      <h4>Cleaning & Maintenance</h4>
                      <p>
                        Wipe gently with a soft cotton cloth and lukewarm water. Always
                        use pH-neutral stone cleaner; never use acids or harsh chemicals.
                      </p>
                    </div>
                    <div className={styles.careCard}>
                      <h4>Insured Crate Delivery</h4>
                      <p>
                        Packed in multi-layer foam and reinforced wooden crates, fully
                        insured against all transit damages.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className={styles.reviewsContainer}>
              <div className={styles.reviewsList}>
                <h3>Customer Reviews</h3>
                <div className={styles.overallRating}>
                  <div className={styles.stars}>
                    <span className={styles.starFilled}>★</span>
                    <span className={styles.starFilled}>★</span>
                    <span className={styles.starFilled}>★</span>
                    <span className={styles.starFilled}>★</span>
                    <span className={styles.starHalf}>★</span>
                  </div>
                  <span>4.8 based on 24 reviews</span>
                </div>

                <div className={styles.reviewItem}>
                  <div className={styles.reviewHeader}>
                    <span className={styles.reviewerName}>Rahul Sharma</span>
                    <span className={styles.reviewDate}>2 weeks ago</span>
                  </div>
                  <div className={styles.stars}>
                    <span className={styles.starFilled}>★</span>
                    <span className={styles.starFilled}>★</span>
                    <span className={styles.starFilled}>★</span>
                    <span className={styles.starFilled}>★</span>
                    <span className={styles.starFilled}>★</span>
                  </div>
                  <p className={styles.reviewText}>
                    Absolutely stunning craftsmanship. The details on the marble
                    are exquisite. Highly recommended!
                  </p>
                </div>

                <div className={styles.reviewItem}>
                  <div className={styles.reviewHeader}>
                    <span className={styles.reviewerName}>Priya Patel</span>
                    <span className={styles.reviewDate}>1 month ago</span>
                  </div>
                  <div className={styles.stars}>
                    <span className={styles.starFilled}>★</span>
                    <span className={styles.starFilled}>★</span>
                    <span className={styles.starFilled}>★</span>
                    <span className={styles.starFilled}>★</span>
                    <span className={styles.starEmpty}>★</span>
                  </div>
                  <p className={styles.reviewText}>
                    Beautiful piece, arrived well packaged and safe. The marble
                    quality is genuine Makrana.
                  </p>
                </div>
              </div>

              <div className={styles.reviewForm}>
                <h3>Write a Review</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("Review submitted!");
                  }}
                >
                  <div className={styles.formGroup}>
                    <label>Your Rating</label>
                    <div className={styles.ratingInput}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          className={styles.starBtn}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Review</label>
                    <textarea
                      className={styles.textareaField}
                      rows="4"
                      placeholder="Share your thoughts about this masterpiece"
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ width: "100%" }}
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className={styles.relatedSection}>
              <h2 className={styles.relatedTitle}>You May Also Like</h2>
              <div className={styles.relatedGrid}>
                {relatedProducts.map((related) => (
                  <div key={related.id} className={styles.relatedCard}>
                    <Link
                      href={`/shop/${related.id}`}
                      className={styles.relatedLink}
                    >
                      <div className={styles.relatedImageWrapper}>
                        <img src={related.img} alt={related.title} />
                      </div>
                      <div className={styles.relatedDetails}>
                        <h4>{related.title}</h4>
                        <p className={styles.relatedPrice}>
                          ₹{related.price.toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.bottomCta}>
            <h3>Looking for something else?</h3>
            <p>
              Discover our complete collection of authentic Makrana marble
              masterpieces.
            </p>
            <Link
              href="/shop"
              className="btn-outline"
              style={{ marginTop: "15px", display: "inline-block" }}
            >
              Explore All Products
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
