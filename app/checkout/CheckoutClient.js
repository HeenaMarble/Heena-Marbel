"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { placeOrder } from "@/lib/actions/checkout-actions";
import { validateCoupon } from "@/lib/actions/coupons";
import { getActiveQuantityDiscount } from "@/lib/actions/quantity-discount";
import styles from "./Checkout.module.css";

export default function CheckoutClient({
  customer,
  shippingSettings,
  initialQuantityDiscount = null,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const { cart, cartItems, buyNowItem, clearBuyNowItem, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // Quantity discount rules state
  const [quantityDiscountRules, setQuantityDiscountRules] = useState(
    initialQuantityDiscount || null
  );

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Address form fields
  const [formData, setFormData] = useState({
    fullName: customer?.name || "",
    phone: customer?.phone || "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pinCode: "",
  });

  useEffect(() => {
    setMounted(true);
    if (!initialQuantityDiscount) {
      getActiveQuantityDiscount()
        .then((rules) => {
          if (rules) setQuantityDiscountRules(rules);
        })
        .catch(() => {
          // Fail gracefully
        });
    }
  }, [initialQuantityDiscount]);

  // Determine items to checkout
  const isBuyNow = mode === "buynow";
  const activeCart = cart || cartItems || [];
  const itemsToCheckout = isBuyNow
    ? buyNowItem
      ? [buyNowItem]
      : []
    : activeCart;

  // If itemsToCheckout is empty (e.g. refreshed in buy-now mode, or empty cart), redirect to /shop
  useEffect(() => {
    if (mounted && itemsToCheckout.length === 0) {
      router.replace("/shop");
    }
  }, [mounted, itemsToCheckout.length, router]);

  // Totals & Discounts calculations
  const totalItems = itemsToCheckout.reduce(
    (sum, item) => sum + (Number(item.quantity) || 1),
    0
  );

  const subtotal = itemsToCheckout.reduce((sum, item) => {
    const p = Number(item.price) || 0;
    const q = Number(item.quantity) || 1;
    return sum + p * q;
  }, 0);

  // Quantity discount calculation
  let quantityDiscount = 0;
  if (quantityDiscountRules?.enabled && Array.isArray(quantityDiscountRules?.tiers)) {
    const sortedTiers = [...quantityDiscountRules.tiers].sort(
      (a, b) => Number(b.min_items) - Number(a.min_items)
    );
    const match = sortedTiers.find((t) => totalItems >= Number(t.min_items));
    if (match) {
      quantityDiscount = Number(match.discount_amount) || 0;
    }
  }

  // Coupon discount calculation
  const couponDiscount = appliedCoupon ? Number(appliedCoupon.discount) || 0 : 0;

  // Clamp subtotal discount at 0
  const discountedSubtotal = Math.max(0, subtotal - quantityDiscount - couponDiscount);

  const flatRate = Number(shippingSettings?.flat_rate) || 79;
  const freeShippingAbove = Number(shippingSettings?.free_shipping_above) || 1499;
  const codFee = Number(shippingSettings?.cod_fee) || 40;

  const isFreeShipping = subtotal >= freeShippingAbove;
  const shippingCharge = isFreeShipping ? 0 : flatRate;
  const totalPayable = discountedSubtotal + shippingCharge + codFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }
    const cleanPhone = formData.phone.trim().replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = "Valid 10-digit phone number is required";
    }
    if (!formData.addressLine1.trim()) {
      errors.addressLine1 = "Street address is required";
    }
    if (!formData.city.trim()) {
      errors.city = "City is required";
    }
    if (!formData.state.trim()) {
      errors.state = "State is required";
    }
    const cleanPin = formData.pinCode.trim().replace(/\D/g, "");
    if (!cleanPin || cleanPin.length !== 6) {
      errors.pinCode = "Valid 6-digit PIN code is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;
    setSubmitError("");

    if (!validateForm()) {
      setSubmitError("Please fill in all required fields accurately.");
      return;
    }

    if (itemsToCheckout.length === 0) {
      setSubmitError("Your checkout bag is empty. Please add items before placing an order.");
      return;
    }

    setIsSubmitting(true);

    const preparedItems = itemsToCheckout.map((item) => ({
      productId: item.productId || item.id,
      variantId: item.variantId || item.selectedVariant?.id || null,
      name: item.name || item.title || "Makrana Marble Artifact",
      price: Number(item.price),
      quantity: Number(item.quantity) || 1,
      colorName: item.colorName || item.selectedVariant?.color_name || null,
      dimensionValues:
        item.dimensionValues || item.selectedVariant?.dimension_values || null,
      image: item.image || item.img || item.image_url || "",
    }));

    const fd = new FormData();
    fd.set("full_name", formData.fullName.trim());
    fd.set("phone", formData.phone.trim());
    fd.set("address_line1", formData.addressLine1.trim());
    fd.set("address_line2", formData.addressLine2.trim());
    fd.set("city", formData.city.trim());
    fd.set("state", formData.state.trim());
    fd.set("pin_code", formData.pinCode.trim());
    fd.set("items_json", JSON.stringify(preparedItems));
    fd.set("coupon_code", appliedCoupon ? appliedCoupon.code : "");
    fd.set("coupon_discount", String(couponDiscount));
    fd.set("quantity_discount", String(quantityDiscount));

    try {
      const result = await placeOrder(fd);
      if (result?.error) {
        setSubmitError(result.error);
        setIsSubmitting(false);
      }
    } catch (err) {
      if (err?.message === "NEXT_REDIRECT" || err?.digest?.includes("NEXT_REDIRECT")) {
        throw err;
      }
      setSubmitError(err?.message || "Failed to place order. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleApplyCoupon = async (e) => {
    if (e) e.preventDefault();
    if (isApplyingCoupon) return;
    if (!couponInput.trim()) return;
    setCouponError("");
    setIsApplyingCoupon(true);

    try {
      const res = await validateCoupon(couponInput.trim(), subtotal);
      if (res?.valid) {
        setAppliedCoupon({
          code: couponInput.trim().toUpperCase(),
          discount: res.discount,
        });
        setCouponInput("");
        setCouponError("");
      } else {
        setCouponError(res?.error || "Invalid coupon code");
      }
    } catch (err) {
      setCouponError(err?.message || "Failed to validate coupon");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  if (!mounted) {
    return (
      <>
        <Navbar />
        <main className={styles.checkoutMain}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner} style={{ borderColor: "#b38b4d transparent #b38b4d transparent" }}></div>
            <p>Loading your checkout bag...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (itemsToCheckout.length === 0) {
    return (
      <>
        <Navbar />
        <main className={styles.checkoutMain}>
          <div className={styles.loadingContainer}>
            <p>No items found for checkout. Redirecting to shop...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className={styles.checkoutMain}>
        <div className={styles.checkoutContainer}>
          {/* Header */}
          <div className={styles.checkoutHeader}>
            <nav className={styles.breadcrumb}>
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/cart">Cart</Link>
              <span>/</span>
              <span className={styles.breadcrumbCurrent}>Checkout</span>
            </nav>
            <h1 className={styles.pageTitle}>Secure Checkout</h1>
            <div className={styles.secureBadgeTop}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>256-Bit Encrypted & Verified Transaction</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.checkoutGrid}>
              {/* Left Column: Steps */}
              <div className={styles.leftColumn}>
                {/* Step 1: Shipping Address */}
                <section className={styles.stepCard}>
                  <div className={styles.stepHeader}>
                    <span className={styles.stepNumber}>1</span>
                    <h2 className={styles.stepTitle}>Shipping Address</h2>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="fullName">
                        Full Name <span className={styles.required}>*</span>
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g. Rajesh Sharma"
                        className={`${styles.inputField} ${fieldErrors.fullName ? styles.inputError : ""}`}
                        required
                      />
                      {fieldErrors.fullName && (
                        <span className={styles.fieldErrorText}>{fieldErrors.fullName}</span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="phone">
                        Phone Number <span className={styles.required}>*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="10-digit mobile number"
                        maxLength={15}
                        className={`${styles.inputField} ${fieldErrors.phone ? styles.inputError : ""}`}
                        required
                      />
                      {fieldErrors.phone && (
                        <span className={styles.fieldErrorText}>{fieldErrors.phone}</span>
                      )}
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="addressLine1">
                        Address Line 1 <span className={styles.required}>*</span>
                      </label>
                      <input
                        id="addressLine1"
                        type="text"
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleInputChange}
                        placeholder="House / Flat / Block No., Apartment or Street"
                        className={`${styles.inputField} ${fieldErrors.addressLine1 ? styles.inputError : ""}`}
                        required
                      />
                      {fieldErrors.addressLine1 && (
                        <span className={styles.fieldErrorText}>{fieldErrors.addressLine1}</span>
                      )}
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="addressLine2">Address Line 2 (Optional)</label>
                      <input
                        id="addressLine2"
                        type="text"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleInputChange}
                        placeholder="Landmark, Area, or Suite (optional)"
                        className={styles.inputField}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow3}>
                    <div className={styles.formGroup}>
                      <label htmlFor="city">
                        City <span className={styles.required}>*</span>
                      </label>
                      <input
                        id="city"
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Makrana / Jaipur"
                        className={`${styles.inputField} ${fieldErrors.city ? styles.inputError : ""}`}
                        required
                      />
                      {fieldErrors.city && (
                        <span className={styles.fieldErrorText}>{fieldErrors.city}</span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="state">
                        State <span className={styles.required}>*</span>
                      </label>
                      <input
                        id="state"
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="e.g. Rajasthan"
                        className={`${styles.inputField} ${fieldErrors.state ? styles.inputError : ""}`}
                        required
                      />
                      {fieldErrors.state && (
                        <span className={styles.fieldErrorText}>{fieldErrors.state}</span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="pinCode">
                        PIN Code <span className={styles.required}>*</span>
                      </label>
                      <input
                        id="pinCode"
                        type="text"
                        name="pinCode"
                        value={formData.pinCode}
                        onChange={handleInputChange}
                        placeholder="6-digit PIN"
                        maxLength={6}
                        className={`${styles.inputField} ${fieldErrors.pinCode ? styles.inputError : ""}`}
                        required
                      />
                      {fieldErrors.pinCode && (
                        <span className={styles.fieldErrorText}>{fieldErrors.pinCode}</span>
                      )}
                    </div>
                  </div>
                </section>

                {/* Step 2: Payment Method */}
                <section className={styles.stepCard}>
                  <div className={styles.stepHeader}>
                    <span className={styles.stepNumber}>2</span>
                    <h2 className={styles.stepTitle}>Payment Method</h2>
                  </div>

                  <div className={styles.paymentCards}>
                    {/* Cash on Delivery (Pre-selected) */}
                    <label className={`${styles.paymentOption} ${styles.paymentOptionActive}`}>
                      <input
                        type="radio"
                        name="payment_method"
                        value="cod"
                        defaultChecked
                        className={styles.paymentRadio}
                        readOnly
                      />
                      <div className={styles.paymentContent}>
                        <div className={styles.paymentHeader}>
                          <span className={styles.paymentName}>Cash on Delivery (COD)</span>
                          <span className={styles.codBadge}>+₹{codFee} COD Fee</span>
                        </div>
                        <p className={styles.paymentDescription}>
                          Pay in cash or UPI to the delivery executive upon receiving your handcrafted marble piece.
                        </p>
                      </div>
                    </label>

                    {/* Pay Online (Disabled / Coming Soon) */}
                    <div className={`${styles.paymentOption} ${styles.paymentOptionDisabled}`}>
                      <input
                        type="radio"
                        name="payment_method_disabled"
                        value="online"
                        disabled
                        className={styles.paymentRadio}
                      />
                      <div className={styles.paymentContent}>
                        <div className={styles.paymentHeader}>
                          <span className={styles.paymentName}>Pay Online (UPI, NetBanking, Cards)</span>
                          <span className={styles.comingSoonBadge}>Coming Soon</span>
                        </div>
                        <p className={styles.paymentDescription}>
                          Online payment gateway integration will be available shortly.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column: Order Summary */}
              <aside className={styles.rightColumn}>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryHeader}>
                    <h2 className={styles.summaryTitle}>Order Summary</h2>
                    <span className={styles.itemCountBadge}>
                      {itemsToCheckout.reduce((c, i) => c + (Number(i.quantity) || 1), 0)}{" "}
                      {itemsToCheckout.reduce((c, i) => c + (Number(i.quantity) || 1), 0) === 1
                        ? "item"
                        : "items"}
                    </span>
                  </div>

                  {/* Items List */}
                  <div className={styles.itemsList}>
                    {itemsToCheckout.map((item, index) => {
                      const itemTitle = item.name || item.title || "Marble Artifact";
                      const itemImg = item.image || item.img || item.image_url || "/shop-bg.jpg";
                      const itemPrice = Number(item.price) || 0;
                      const itemQty = Number(item.quantity) || 1;

                      // Format variant summary if present
                      const variantLine =
                        item.variantSummary ||
                        (item.colorName ? item.colorName : null);

                      return (
                        <div key={item.cartKey || item.productId || item.id || index} className={styles.itemRow}>
                          <div className={styles.itemImageWrapper}>
                            <img src={itemImg} alt={itemTitle} className={styles.itemImage} />
                            {itemQty > 1 && <span className={styles.itemQtyBadge}>{itemQty}</span>}
                          </div>
                          <div className={styles.itemDetails}>
                            <h4 className={styles.itemName} title={itemTitle}>
                              {itemTitle}
                            </h4>
                            {variantLine ? (
                              <p className={styles.itemVariant}>{variantLine}</p>
                            ) : null}
                            <p className={styles.itemQtyPrice}>
                              Qty: {itemQty} × ₹{Number(itemPrice).toLocaleString('en-IN')}
                            </p>
                          </div>
                          <div className={styles.itemTotal}>
                            ₹{(Number(itemPrice) * itemQty).toLocaleString('en-IN')}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Coupon Code Section */}
                  {appliedCoupon ? (
                    <div className={styles.couponAppliedBadge}>
                      <div className={styles.couponAppliedInfo}>
                        <span className={styles.couponAppliedCode}>{appliedCoupon.code}</span>
                        <span className={styles.couponAppliedDiscount}>
                          (−₹{Number(appliedCoupon.discount).toLocaleString('en-IN')} applied)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className={styles.couponRemoveBtn}
                        title="Remove coupon"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ) : (
                    <div style={{ marginBottom: "14px" }}>
                      <div className={styles.couponBox}>
                        <input
                          type="text"
                          placeholder="Coupon Code"
                          value={couponInput}
                          onChange={(e) => {
                            setCouponInput(e.target.value);
                            if (couponError) setCouponError("");
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleApplyCoupon(e);
                            }
                          }}
                          className={styles.couponInput}
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={isApplyingCoupon || !couponInput.trim()}
                          className={styles.couponBtn}
                        >
                          {isApplyingCoupon ? "Applying..." : "Apply"}
                        </button>
                      </div>
                      {couponError && (
                        <p className={styles.couponError} role="alert">
                          {couponError}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Cost Breakdown */}
                  <div className={styles.costBreakdown}>
                    <div className={styles.costRow}>
                      <span className={styles.costLabel}>Subtotal</span>
                      <span className={styles.costValue}>₹{Number(subtotal).toLocaleString('en-IN')}</span>
                    </div>

                    {quantityDiscount > 0 && (
                      <div className={styles.costRow}>
                        <span className={styles.costLabel}>Quantity Discount</span>
                        <span className={styles.costValue} style={{ color: "#15803d", fontWeight: 600 }}>
                          − ₹{Number(quantityDiscount).toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}

                    {appliedCoupon && couponDiscount > 0 && (
                      <div className={styles.costRow}>
                        <span className={styles.costLabel}>Coupon ({appliedCoupon.code})</span>
                        <span className={styles.costValue} style={{ color: "#15803d", fontWeight: 600 }}>
                          − ₹{Number(couponDiscount).toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}

                    <div className={styles.costRow}>
                      <span className={styles.costLabel}>Shipping</span>
                      <span className={`${styles.costValue} ${isFreeShipping ? styles.freeShipping : ""}`}>
                        {isFreeShipping ? "FREE" : `₹${shippingCharge}`}
                      </span>
                    </div>

                    <div className={styles.costRow}>
                      <span className={styles.costLabel}>COD Charge</span>
                      <span className={styles.costValue}>₹{codFee}</span>
                    </div>
                  </div>

                  {/* Grand Total */}
                  <div className={styles.grandTotalRow}>
                    <span className={styles.grandTotalLabel}>Total Payable</span>
                    <span className={styles.grandTotalAmount}>₹{Number(totalPayable).toLocaleString('en-IN')}</span>
                  </div>

                  {/* Error Notification */}
                  {submitError && (
                    <div className={styles.errorBanner} role="alert">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Place Order CTA Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={styles.placeOrderBtn}
                  >
                    {isSubmitting ? (
                      <>
                        <div className={styles.spinner}></div>
                        <span>Processing Order...</span>
                      </>
                    ) : (
                      <span>Place Order — ₹{Number(totalPayable).toLocaleString('en-IN')}</span>
                    )}
                  </button>

                  {/* Trust Strips */}
                  <div className={styles.trustStrip}>
                    <div className={styles.trustItem}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.trustIcon}>
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                      <span>100% Authentic Makrana Pure White Marble</span>
                    </div>
                    <div className={styles.trustItem}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.trustIcon}>
                        <rect x="1" y="3" width="15" height="13"></rect>
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                        <circle cx="5.5" cy="18.5" r="2.5"></circle>
                        <circle cx="18.5" cy="18.5" r="2.5"></circle>
                      </svg>
                      <span>Insured Protective Wooden Crate Shipping</span>
                    </div>
                    <div className={styles.trustItem}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.trustIcon}>
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M16 12l-4-4-4 4M12 8v8"></path>
                      </svg>
                      <span>Hassle-Free Inspection Upon Delivery</span>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
