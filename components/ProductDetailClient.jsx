"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import styles from "@/app/shop/[id]/ProductDetail.module.css";
import { submitReview } from "@/actions/reviews";
import ShopGrid from "@/components/ShopGrid";


function parseDimensionLabel(item) {
  if (!item) return { label: "", unit: "" };
  let current = item;

  while (typeof current === "string") {
    const trimmed = current.trim();
    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      try {
        current = JSON.parse(current);
      } catch {
        break;
      }
    } else {
      break;
    }
  }

  if (typeof current === "object" && current !== null && !Array.isArray(current)) {
    let label = current.label ?? "";
    let unit = current.unit ?? "";

    while (typeof label === "string") {
      const trimmed = label.trim();
      if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        try {
          const parsed = JSON.parse(label);
          if (parsed && typeof parsed === "object") {
            label = parsed.label ?? "";
            if (!unit && parsed.unit) unit = parsed.unit;
          } else {
            break;
          }
        } catch {
          break;
        }
      } else {
        break;
      }
    }

    return { label: String(label || ""), unit: String(unit || "") };
  }

  return { label: String(current || ""), unit: "" };
}

function formatDimensionSummary(dimValues, dimensionLabelsWithUnits = []) {
  if (!dimValues || typeof dimValues !== "object") return "";
  const entries = Object.entries(dimValues);
  if (entries.length === 0) return "";

  const unitMap = new Map();
  if (Array.isArray(dimensionLabelsWithUnits)) {
    dimensionLabelsWithUnits.forEach((item) => {
      const parsed = parseDimensionLabel(item);
      if (parsed?.label) {
        if (parsed.unit) unitMap.set(parsed.label.toLowerCase(), parsed.unit);
      }
    });
  }

  const priority = ["length", "width", "breadth", "depth", "height", "thickness", "diameter", "size"];
  const sorted = [...entries].sort((a, b) => {
    const idxA = priority.indexOf(a[0].toLowerCase());
    const idxB = priority.indexOf(b[0].toLowerCase());
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a[0].localeCompare(b[0]);
  });

  return sorted
    .map(([k, val]) => {
      const cleanVal = String(val).trim();
      const customUnit = unitMap.get(k.toLowerCase());
      let valWithUnit = cleanVal;
      if (customUnit) {
        if (!cleanVal.toLowerCase().endsWith(customUnit.toLowerCase())) {
          valWithUnit = `${cleanVal} ${customUnit}`;
        }
      } else if (/^[0-9]+(\.[0-9]+)?$/.test(cleanVal)) {
        valWithUnit = `${cleanVal}"`;
      }
      if (sorted.length === 1) return `${k}: ${valWithUnit}`;
      const shortKey = k.charAt(0).toUpperCase();
      if (["L", "W", "H", "D"].includes(shortKey)) {
        return `${valWithUnit} ${shortKey}`;
      }
      return `${k}: ${valWithUnit}`;
    })
    .join(" × ");
}

function getSizeTitle(variant, index, total) {
  if (variant.name) return variant.name;
  if (variant.title) return variant.title;
  if (variant.size_name) return variant.size_name;
  if (total === 1) return "Standard Size";
  if (total === 2) return index === 0 ? "Standard Size" : "Grand / Large Size";
  if (total === 3) {
    if (index === 0) return "Compact Size";
    if (index === 1) return "Standard Size";
    return "Grand / Large Size";
  }
  return `Size Option ${index + 1}`;
}

export default function ProductDetailClient({ product, relatedProducts = [], initialReviews = [], reviewStats = null, currentCustomer = null }) {
  const router = useRouter();
  const { addToCart, setBuyNowItem } = useCart();

  const hasVariants = Boolean(product?.has_variants && product?.variants?.length > 0);
  const hasColors = Boolean(hasVariants && product?.has_colors);

  const dimensionLabelObjects = React.useMemo(() => {
    if (!Array.isArray(product?.variant_dimension_labels)) return [];
    return product.variant_dimension_labels
      .map(parseDimensionLabel)
      .filter((d) => Boolean(d.label));
  }, [product?.variant_dimension_labels]);

  const dimensionLabels = React.useMemo(() => {
    return dimensionLabelObjects.map((d) => d.label);
  }, [dimensionLabelObjects]);

  const initialVariant = React.useMemo(() => {
    if (!hasVariants) return null;
    return product.variants.find((v) => v.is_default) || product.variants[0];
  }, [hasVariants, product?.variants]);

  const [selectedColor, setSelectedColor] = useState(
    initialVariant?.color_name || ""
  );
  const [selectedDimensions, setSelectedDimensions] = useState(
    initialVariant?.dimension_values || {}
  );
  const [activeVariant, setActiveVariant] = useState(initialVariant);

  // Distinct colors extracted from product.variants
  const distinctColors = React.useMemo(() => {
    if (!hasColors || !product?.variants) return [];
    const map = new Map();
    for (const v of product.variants) {
      if (v.color_name && !map.has(v.color_name)) {
        map.set(v.color_name, {
          color_name: v.color_name,
          color_hex: v.color_hex || "#d1d5db",
        });
      }
    }
    return Array.from(map.values());
  }, [product?.variants, hasColors]);

  // Variants filtered to the currently selected color
  const variantsForSelectedColor = React.useMemo(() => {
    if (!product?.variants) return [];
    if (hasColors && selectedColor) {
      return product.variants.filter((v) => v.color_name === selectedColor);
    }
    return product.variants;
  }, [product?.variants, hasColors, selectedColor]);

  // Handle direct click on a combined size card
  const handleSelectVariantCard = (variant) => {
    setActiveVariant(variant);
    setSelectedDimensions(variant.dimension_values || {});
    if (variant.color_name && variant.color_name !== selectedColor) {
      setSelectedColor(variant.color_name);
    }
  };

  // Image filtering based on color
  const filteredImages = React.useMemo(() => {
    if (!hasVariants || !product?.imageObjects || product.imageObjects.length === 0) {
      return (product?.images && product.images.length > 0)
        ? product.images
        : (product?.img ? [product.img] : []);
    }

    if (hasColors && selectedColor) {
      const colorImages = product.imageObjects
        .filter(
          (img) =>
            img.color_name &&
            img.color_name.toLowerCase() === selectedColor.toLowerCase()
        )
        .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
        .map((img) => img.image_url);

      if (colorImages.length > 0) {
        return colorImages;
      }
    }

    // Fallback to common/no-color images (color_name is null/empty)
    const commonImages = product.imageObjects
      .filter((img) => !img.color_name)
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      .map((img) => img.image_url);

    if (commonImages.length > 0) {
      return commonImages;
    }

    return (product?.images && product.images.length > 0)
      ? product.images
      : (product?.img ? [product.img] : []);
  }, [hasVariants, hasColors, selectedColor, product?.imageObjects, product?.images, product?.img]);

  const [selectedImage, setSelectedImage] = useState(
    filteredImages[0] || product?.img || ""
  );
  const [isVideoSelected, setIsVideoSelected] = useState(false);

  // When filtered images change (e.g. color switched), default to first image
  useEffect(() => {
    if (filteredImages && filteredImages.length > 0) {
      setSelectedImage(filteredImages[0]);
      setIsVideoSelected(false);
    }
  }, [filteredImages]);

  // Re-sync variant selection if product prop changes
  useEffect(() => {
    if (hasVariants && product?.variants?.length > 0) {
      const defaultVar =
        product.variants.find((v) => v.is_default) || product.variants[0];
      if (defaultVar) {
        setSelectedColor(defaultVar.color_name || "");
        setSelectedDimensions(defaultVar.dimension_values || {});
        setActiveVariant(defaultVar);
      }
    } else {
      setSelectedColor("");
      setSelectedDimensions({});
      setActiveVariant(null);
    }
  }, [product?.id, hasVariants, product?.variants]);

  // Quantity selection state
  const [quantity, setQuantity] = useState(1);

  // Reset quantity to 1 when active variant or product changes
  useEffect(() => {
    setQuantity(1);
  }, [product?.id, activeVariant?.id]);

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrement = () => {
    const maxLimit = effectiveStock > 0 ? effectiveStock : 99;
    setQuantity((prev) => Math.min(maxLimit, prev + 1));
  };

  // Dynamic specifications that update when switching variants (e.g. Standard vs Grand Size)
  const effectiveSpecifications = React.useMemo(() => {
    // Helper: format a dimension value with its unit if present
    function fmtDimValue(item) {
      const cleanVal = String(item.value ?? "").trim();
      const unit = item.unit ? item.unit : null;
      if (unit) return `${cleanVal} ${unit}`;
      // Legacy fallback: if purely numeric, add " inches"
      if (/^[0-9]+(\.[0-9]+)?$/.test(cleanVal)) return `${cleanVal} inches`;
      return cleanVal;
    }

    const baseDims = Array.isArray(product?.dimensions)
      ? product.dimensions.map((item) => ({ label: item.label, value: fmtDimValue(item) }))
      : [];
    const baseSpecs = Array.isArray(product?.specifications)
      ? product.specifications
      : [];
    const baseAll = [...baseDims, ...baseSpecs];

    if (hasVariants && activeVariant) {
      const specMap = new Map();
      const unitMap = new Map();
      dimensionLabelObjects.forEach((d) => {
        if (d.label && d.unit) unitMap.set(d.label.toLowerCase(), d.unit);
      });

      // If variant has dimension_values (e.g. Height, Width, Length, Size)
      if (activeVariant.dimension_values && typeof activeVariant.dimension_values === "object") {
        Object.entries(activeVariant.dimension_values).forEach(([rawK, v]) => {
          const parsedK = parseDimensionLabel(rawK).label || rawK;
          const cleanK = String(parsedK).trim();
          if (!cleanK) return;

          const cleanVal = String(v).trim();
          const customUnit = unitMap.get(cleanK.toLowerCase());
          let valWithUnit = cleanVal;
          if (customUnit) {
            if (!cleanVal.toLowerCase().endsWith(customUnit.toLowerCase())) {
              valWithUnit = `${cleanVal} ${customUnit}`;
            }
          } else if (/^[0-9]+(\.[0-9]+)?$/.test(cleanVal)) {
            valWithUnit = `${cleanVal} inches`;
          }

          // Case-insensitive key deduplication
          const existingKey = Array.from(specMap.keys()).find(
            (k) => k.toLowerCase() === cleanK.toLowerCase()
          );
          if (existingKey) {
            specMap.set(existingKey, valWithUnit);
          } else {
            specMap.set(cleanK, valWithUnit);
          }
        });
      }

      // If color is active, include Color in specifications
      if (hasColors && activeVariant.color_name) {
        specMap.set("Color", activeVariant.color_name);
      }

      // Add baseAll from product level that are not already overridden (e.g. Material, Finish, etc.)
      const existingKeysLower = new Set(Array.from(specMap.keys()).map((k) => k.toLowerCase()));
      baseAll.forEach((item) => {
        const parsedLabel = parseDimensionLabel(item?.label).label || item?.label;
        if (parsedLabel && !existingKeysLower.has(parsedLabel.toLowerCase())) {
          existingKeysLower.add(parsedLabel.toLowerCase());
          specMap.set(parsedLabel, item.value);
        }
      });

      return Array.from(specMap.entries()).map(([label, value]) => ({ label, value }));
    }

    return baseAll;
  }, [product?.dimensions, product?.specifications, hasVariants, activeVariant, hasColors, dimensionLabelObjects]);

  const hasMultipleMedia = Boolean(
    filteredImages.length > 1 || (product?.video_url && filteredImages.length > 0)
  );
  const hasDimensions = Boolean(
    effectiveSpecifications.length > 0 ||
    (product?.dimensions && product.dimensions.length > 0) ||
    (product?.specifications && product.specifications.length > 0)
  );

  const [activeTab, setActiveTab] = useState(
    hasDimensions ? "specs" : "details"
  );

  useEffect(() => {
    setActiveTab(hasDimensions ? "specs" : "details");
  }, [product?.id, hasDimensions]);

  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewToast, setReviewToast] = useState(null); // { type: "success"|"error", msg }
  const [isPendingReview, startReviewTransition] = useTransition();

  function handleSubmitReview(e) {
    e.preventDefault();
    if (reviewRating === 0) {
      setReviewToast({ type: "error", msg: "Please select a star rating." });
      setTimeout(() => setReviewToast(null), 3500);
      return;
    }
    startReviewTransition(async () => {
      try {
        await submitReview(product.id, reviewRating, reviewComment);
        setReviewRating(0);
        setReviewComment("");
        setReviewToast({ type: "success", msg: "Thank you! Your review is pending approval." });
        setTimeout(() => setReviewToast(null), 4000);
      } catch {
        setReviewToast({ type: "error", msg: "Something went wrong. Please try again." });
        setTimeout(() => setReviewToast(null), 3500);
      }
    });
  }

  // Compute avg rating and count from reviewStats (live DB aggregate) or fallback to initialReviews
  const reviewCount = reviewStats?.count ?? initialReviews.length;
  const avgRating = reviewStats?.avgRating ?? (
    initialReviews.length > 0
      ? (initialReviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / initialReviews.length).toFixed(1)
      : null
  );

  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
    if (days < 365) return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""} ago`;
    return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? "s" : ""} ago`;
  }

  // Color change handler with auto-clamping of dimension selections
  const handleColorChange = (newColor) => {
    setSelectedColor(newColor);
    if (!product?.variants) return;

    const matchingColorVariants = product.variants.filter(
      (v) => v.color_name === newColor
    );
    if (matchingColorVariants.length === 0) return;

    // Check if currently selected dimensions are valid for this color
    const exactMatch = matchingColorVariants.find((v) => {
      if (dimensionLabels.length === 0) return true;
      return dimensionLabels.every(
        (lbl) => v.dimension_values?.[lbl] === selectedDimensions[lbl]
      );
    });

    if (exactMatch) {
      setActiveVariant(exactMatch);
    } else {
      // Auto-clamp to default variant for this color or the first valid one
      const defaultForColor =
        matchingColorVariants.find((v) => v.is_default) ||
        matchingColorVariants[0];
      if (defaultForColor) {
        setSelectedDimensions(defaultForColor.dimension_values || {});
        setActiveVariant(defaultForColor);
      }
    }
  };

  // Dimension change handler with auto-clamping dependent selectors
  const handleDimensionChange = (label, value) => {
    const nextDims = { ...selectedDimensions, [label]: value };
    setSelectedDimensions(nextDims);
    if (!product?.variants) return;

    const candidateVariants = product.variants.filter((v) => {
      if (hasColors && v.color_name !== selectedColor) return false;
      return v.dimension_values?.[label] === value;
    });

    if (candidateVariants.length === 0) return;

    const exactMatch = candidateVariants.find((v) => {
      return dimensionLabels.every(
        (lbl) => v.dimension_values?.[lbl] === nextDims[lbl]
      );
    });

    if (exactMatch) {
      setActiveVariant(exactMatch);
    } else {
      const fallback = candidateVariants[0];
      setSelectedDimensions(fallback.dimension_values || {});
      setActiveVariant(fallback);
    }
  };

  // Get distinct values that exist for a dimension label, filtered to current color
  const getAvailableValuesForLabel = (label) => {
    if (!product?.variants) return [];
    const pool = hasColors
      ? product.variants.filter((v) => v.color_name === selectedColor)
      : product.variants;
    const values = [];
    for (const v of pool) {
      const val = v.dimension_values?.[label];
      if (val && !values.includes(val)) {
        values.push(val);
      }
    }
    return values;
  };

  // Effective price & compare-at price
  const effectivePrice =
    hasVariants && activeVariant
      ? Number(activeVariant.price) || 0
      : Number(product?.price) || 0;

  const compareAtPrice =
    hasVariants && activeVariant
      ? (activeVariant.compare_at_price ? Number(activeVariant.compare_at_price) : null)
      : (product?.compare_at_price ? Number(product.compare_at_price) : null);

  const discountPercent =
    compareAtPrice && compareAtPrice > effectivePrice
      ? Math.round(((compareAtPrice - effectivePrice) / compareAtPrice) * 100)
      : 0;

  // Effective stock
  const effectiveStock =
    hasVariants && activeVariant
      ? (activeVariant.stock ?? 0)
      : (product?.stock_quantity ?? 0);

  const isOutOfStock = effectiveStock <= 0;

  // Add to cart handler
  const handleAddToCart = (openDrawer = true) => {
    if (isOutOfStock) return;

    if (hasVariants && activeVariant) {
      const variantSummaryParts = [];
      if (hasColors && activeVariant.color_name) {
        variantSummaryParts.push(activeVariant.color_name);
      }
      if (activeVariant.dimension_values) {
        Object.entries(activeVariant.dimension_values).forEach(([k, v]) => {
          variantSummaryParts.push(`${k}: ${v}`);
        });
      }
      const variantSummary = variantSummaryParts.join(" • ");

      addToCart({
        ...product,
        cartKey: `${product.id}-${activeVariant.id}`,
        variantId: activeVariant.id,
        variantSummary,
        selectedVariant: activeVariant,
        price: effectivePrice,
        stock_quantity: effectiveStock,
        img: selectedImage || filteredImages[0] || product.img,
      }, quantity, openDrawer);
    } else {
      addToCart({
        ...product,
        price: effectivePrice,
        compare_at_price: compareAtPrice,
        stock_quantity: effectiveStock,
        img: selectedImage || product.img,
      }, quantity, openDrawer);
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;

    let variantSummary = "";
    if (hasVariants && activeVariant) {
      const variantSummaryParts = [];
      if (hasColors && activeVariant.color_name) {
        variantSummaryParts.push(activeVariant.color_name);
      }
      if (activeVariant.dimension_values) {
        Object.entries(activeVariant.dimension_values).forEach(([k, v]) => {
          variantSummaryParts.push(`${k}: ${v}`);
        });
      }
      variantSummary = variantSummaryParts.join(" • ");
    }

    const itemImage = selectedImage || (hasVariants && filteredImages[0]) || product.img || product.image_url;

    setBuyNowItem({
      id: product.id,
      productId: product.id,
      variantId: activeVariant?.id || null,
      name: product.title || product.name,
      title: product.title || product.name,
      price: effectivePrice ?? activeVariant?.price ?? product.price,
      quantity: quantity,
      colorName: activeVariant?.color_name || null,
      dimensionValues: activeVariant?.dimension_values || null,
      variantSummary: variantSummary || null,
      image: itemImage,
      img: itemImage,
    });

    router.push("/checkout?mode=buynow");
  };

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
              {/* Left Column: Images, Video & Guarantee */}
              <div className={styles.imageColumn}>
                <div className={styles.imageWrapper}>
                  {isVideoSelected && product?.video_url ? (
                    <video
                      key={product.video_url}
                      src={product.video_url}
                      controls
                      autoPlay
                      playsInline
                      className={styles.mainVideo}
                    />
                  ) : (
                    <img
                      src={selectedImage}
                      alt={product.title}
                      className={styles.mainImage}
                    />
                  )}
                </div>

                {/* Thumbnail Strip */}
                {hasMultipleMedia && (
                  <div className={styles.thumbnailStrip}>
                    {filteredImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedImage(imgUrl);
                          setIsVideoSelected(false);
                        }}
                        className={`${styles.thumbnailBtn} ${
                          !isVideoSelected && selectedImage === imgUrl
                            ? styles.thumbnailActive
                            : ""
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

                    {product?.video_url && (
                      <button
                        type="button"
                        onClick={() => setIsVideoSelected(true)}
                        className={`${styles.thumbnailBtn} ${styles.videoThumbnailBtn} ${
                          isVideoSelected ? styles.thumbnailActive : ""
                        }`}
                        aria-label="View product video"
                      >
                        <div className={styles.videoThumbnailContent}>
                          <video
                            src={product.video_url}
                            className={styles.thumbnailVideo}
                            preload="metadata"
                            muted
                          />
                          <div className={styles.playIconOverlay}>
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              stroke="none"
                            >
                              <polygon points="6 4 20 12 6 20 6 4" />
                            </svg>
                          </div>
                          <span className={styles.videoBadge}>VIDEO</span>
                        </div>
                      </button>
                    )}
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
                  <div className={styles.priceGroup}>
                    <p className={styles.price}>
                      ₹{Number(effectivePrice).toLocaleString('en-IN')}
                    </p>
                    {compareAtPrice && compareAtPrice > effectivePrice && (
                      <span className={styles.compareAtPrice}>
                        ₹{Number(compareAtPrice).toLocaleString('en-IN')}
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className={styles.discountBadge}>
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>
                  <a
                    href="#reviews"
                    className={styles.ratingBadge}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    title={reviewCount > 0 ? "View customer reviews" : "Write a review"}
                  >
                    {reviewCount > 0 ? (
                      <>
                        <span className={styles.starFilled}>★</span>
                        <span>{avgRating}</span>
                        <span className={styles.ratingReviews}>
                          ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                        </span>
                      </>
                    ) : (
                      <>
                        <span className={styles.starEmpty}>★</span>
                        <span className={styles.ratingReviews}>No reviews yet</span>
                      </>
                    )}
                  </a>
                </div>

                {/* Variant Selectors Section (only if has_variants is true) */}
                {hasVariants && (
                  <div className={styles.variantSection}>
                    {/* Color Swatches (only if has_colors is true) */}
                    {hasColors && distinctColors.length > 0 && (
                      <div className={styles.variantGroup}>
                        <div className={styles.variantLabel}>
                          <span>Color:</span>
                          <span className={styles.variantSelectedValue}>
                            {selectedColor || "Select"}
                          </span>
                        </div>
                        <div
                          className={styles.colorSwatches}
                          role="radiogroup"
                          aria-label="Select Color"
                        >
                          {distinctColors.map((c) => {
                            const isSelected = selectedColor === c.color_name;
                            return (
                              <div
                                key={c.color_name}
                                className={styles.colorSwatchWrapper}
                              >
                                <button
                                  type="button"
                                  onClick={() => handleColorChange(c.color_name)}
                                  className={`${styles.colorSwatch} ${
                                    isSelected ? styles.colorSwatchActive : ""
                                  }`}
                                  style={{ backgroundColor: c.color_hex }}
                                  title={c.color_name}
                                  aria-label={c.color_name}
                                  aria-checked={isSelected}
                                  role="radio"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Combined Size Cards (Idea 1) */}
                    {variantsForSelectedColor.length > 0 && dimensionLabels.length > 0 && (
                      <div className={styles.variantGroup}>
                        <div className={styles.variantLabel}>
                          <span>Select Size & Configuration:</span>
                        </div>
                        <div
                          className={styles.sizeCardsGrid}
                          role="radiogroup"
                          aria-label="Select Size & Configuration"
                        >
                          {variantsForSelectedColor.map((v, idx) => {
                            const isSelected = activeVariant?.id === v.id;
                            const sizeTitle = getSizeTitle(v, idx, variantsForSelectedColor.length);
                            const dimSummary = formatDimensionSummary(v.dimension_values, dimensionLabelObjects);
                            const cardPrice = Number(v.price) || 0;
                            const cardCompare = v.compare_at_price ? Number(v.compare_at_price) : null;
                            const isCardOut = (v.stock ?? 0) <= 0;

                            return (
                              <button
                                key={v.id || idx}
                                type="button"
                                onClick={() => handleSelectVariantCard(v)}
                                className={`${styles.sizeCard} ${
                                  isSelected ? styles.sizeCardActive : ""
                                }`}
                                aria-checked={isSelected}
                                role="radio"
                              >
                                <div className={styles.sizeCardHeader}>
                                  <span className={styles.sizeCardTitle}>{sizeTitle}</span>
                                  <div
                                    className={`${styles.sizeRadioCircle} ${
                                      isSelected ? styles.sizeRadioCircleActive : ""
                                    }`}
                                  >
                                    {isSelected && <div className={styles.sizeRadioInner} />}
                                  </div>
                                </div>

                                {dimSummary && (
                                  <div className={styles.sizeDimensions}>{dimSummary}</div>
                                )}

                                <div className={styles.sizeCardPriceRow}>
                                  <span className={styles.sizeCardPrice}>
                                    ₹{Number(cardPrice).toLocaleString('en-IN')}
                                  </span>
                                  {cardCompare && cardCompare > cardPrice && (
                                    <span className={styles.sizeCardComparePrice}>
                                      ₹{Number(cardCompare).toLocaleString('en-IN')}
                                    </span>
                                  )}
                                </div>

                                <div
                                  className={styles.sizeCardStock}
                                  style={{
                                    color: isCardOut
                                      ? "#b91c1c"
                                      : v.stock <= 5
                                      ? "#b45309"
                                      : "#15803d",
                                  }}
                                >
                                  <span
                                    style={{
                                      width: 6,
                                      height: 6,
                                      borderRadius: "50%",
                                      backgroundColor: isCardOut
                                        ? "#ef4444"
                                        : v.stock <= 5
                                        ? "#f59e0b"
                                        : "#22c55e",
                                      display: "inline-block",
                                    }}
                                  />
                                  <span>
                                    {isCardOut
                                      ? "Out of Stock"
                                      : v.stock <= 5
                                      ? `Only ${v.stock} left`
                                      : "In Stock"}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Custom Dimensions Notice */}
                        <div className={styles.customSizeNotice}>
                          <span>📐 Need custom dimensions carved for your space?</span>
                          <Link href="/contact" className={styles.customSizeNoticeLink}>
                            Enquire Custom Order →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className={styles.actionContainer}>
                  <div
                    className={styles.quantityStepper}
                    role="group"
                    aria-label="Quantity selector"
                  >
                    <button
                      type="button"
                      className={styles.qtyBtn}
                      onClick={handleDecrement}
                      disabled={quantity <= 1 || isOutOfStock}
                      aria-label="Decrease quantity"
                      title="Decrease quantity"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                    <span className={styles.qtyValue} aria-live="polite">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      className={styles.qtyBtn}
                      onClick={handleIncrement}
                      disabled={quantity >= effectiveStock || isOutOfStock}
                      aria-label="Increase quantity"
                      title={quantity >= effectiveStock ? "Max available stock reached" : "Increase quantity"}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                  </div>

                  <div className={styles.actionButtonGroup}>
                    <button
                      type="button"
                      className={`${styles.addToCartBtn} ${
                        isOutOfStock ? styles.addToCartDisabled : ""
                      }`}
                      onClick={() => handleAddToCart(true)}
                      disabled={isOutOfStock}
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
                        className={styles.buttonIcon}
                      >
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                      <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
                    </button>

                    <button
                      type="button"
                      className={`${styles.buyNowBtn} ${
                        isOutOfStock ? styles.addToCartDisabled : ""
                      }`}
                      onClick={handleBuyNow}
                      disabled={isOutOfStock}
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
                        className={styles.buttonIcon}
                      >
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                      </svg>
                      <span>Buy Now</span>
                    </button>
                  </div>
                </div>

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
                        {effectiveSpecifications.map((d, i) => (
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
            <div id="reviews" className={styles.reviewsContainer}>
              <div className={styles.reviewsList}>
                <h3>Customer Reviews</h3>

                {/* Overall rating summary */}
                {reviewCount > 0 ? (
                  <div className={styles.overallRating}>
                    <div className={styles.stars}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span
                          key={s}
                          className={
                            s <= Math.round(Number(avgRating))
                              ? styles.starFilled
                              : styles.starEmpty
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span>{avgRating} based on {reviewCount} review{reviewCount !== 1 ? "s" : ""}</span>
                  </div>
                ) : (
                  <p style={{ color: "var(--text-light)", marginBottom: "30px", fontSize: "0.95rem" }}>
                    No reviews yet. Be the first to review this product!
                  </p>
                )}

                {/* Dynamic reviews list */}
                {initialReviews.map((r) => (
                  <div key={r.id} className={styles.reviewItem}>
                    <div className={styles.reviewHeader}>
                      <span className={styles.reviewerName}>{r.customers?.name || "Customer"}</span>
                      <span className={styles.reviewDate}>{timeAgo(r.created_at)}</span>
                    </div>
                    <div className={styles.stars}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span
                          key={s}
                          className={s <= r.rating ? styles.starFilled : styles.starEmpty}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className={styles.reviewText}>{r.comment}</p>
                  </div>
                ))}

                {/* View All Reviews link */}
                {reviewCount > 0 && (
                  <div style={{ marginTop: "20px" }}>
                    <Link
                      href={`/shop/${product.id}/reviews`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "var(--primary-color)",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        textDecoration: "none",
                        borderBottom: "1px solid var(--primary-color)",
                        paddingBottom: "2px",
                      }}
                    >
                      View all reviews →
                    </Link>
                  </div>
                )}
              </div>

              {/* Review Form */}
              <div className={styles.reviewForm}>
                <h3>Write a Review</h3>

                {/* Toast notification */}
                {reviewToast && (
                  <div
                    style={{
                      marginBottom: "16px",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      background: reviewToast.type === "success" ? "#f0fdf4" : "#fef2f2",
                      color: reviewToast.type === "success" ? "#15803d" : "#b91c1c",
                      border: `1px solid ${reviewToast.type === "success" ? "#bbf7d0" : "#fecaca"}`,
                    }}
                  >
                    {reviewToast.msg}
                  </div>
                )}

                {currentCustomer ? (
                  <form onSubmit={handleSubmitReview}>
                    <div className={styles.formGroup}>
                      <label>Your Rating</label>
                      <div className={styles.ratingInput}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            className={styles.starBtn}
                            style={{
                              color:
                                star <= (hoverRating || reviewRating)
                                  ? "#f5b041"
                                  : "#e0e0e0",
                            }}
                            onClick={() => setReviewRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
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
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ width: "100%", opacity: isPendingReview ? 0.7 : 1 }}
                      disabled={isPendingReview}
                    >
                      {isPendingReview ? "Submitting…" : "Submit Review"}
                    </button>
                  </form>
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "30px 20px",
                      background: "#faf8f5",
                      borderRadius: "8px",
                      border: "1px dashed #efe8d8",
                    }}
                  >
                    <p style={{ color: "var(--text-light)", marginBottom: "16px", fontSize: "0.95rem" }}>
                      You must be logged in to write a review.
                    </p>
                    <Link href="/signin" className="btn-primary" style={{ display: "inline-block" }}>
                      Login to Write a Review
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className={styles.relatedSection}>
              <h2 className={styles.relatedTitle}>You May Also Like</h2>
              <ShopGrid products={relatedProducts} />
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
