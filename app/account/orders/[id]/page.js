import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCurrentCustomer } from "@/actions/customer-auth";
import { getOrderDetails } from "@/lib/actions/order-actions";
import styles from "./OrderDetail.module.css";

export const metadata = {
  title: "Order Details | Heena Marble",
  description: "View detailed tracking and receipt information for your order.",
};

function formatPlacedDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const day = d.getDate();
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function getStatusBadgeConfig(status) {
  const s = (status || "").toLowerCase().trim();
  switch (s) {
    case "pending":
      return { label: "PENDING", className: styles.statusPending };
    case "processing":
      return { label: "PROCESSING", className: styles.statusProcessing };
    case "shipped":
      return { label: "SHIPPED", className: styles.statusShipped };
    case "delivered":
      return { label: "DELIVERED", className: styles.statusDelivered };
    case "cancelled":
    case "canceled":
      return { label: "CANCELLED", className: styles.statusCancelled };
    default:
      return { label: (status || "PENDING").toUpperCase(), className: styles.statusPending };
  }
}

function formatVariantLine(snap) {
  if (!snap) return null;
  const parts = [];
  if (snap.color_name) {
    parts.push(snap.color_name);
  }
  if (snap.dimension_values) {
    if (typeof snap.dimension_values === "object" && !Array.isArray(snap.dimension_values)) {
      const dimEntries = Object.entries(snap.dimension_values)
        .filter(([_, val]) => val !== null && val !== undefined && val !== "")
        .map(([k, v]) => `${k} - ${v}`);
      if (dimEntries.length > 0) {
        parts.push(dimEntries.join(" · "));
      }
    } else if (typeof snap.dimension_values === "string" && snap.dimension_values.trim()) {
      parts.push(snap.dimension_values.trim());
    }
  }
  return parts.length > 0 ? parts.join(" · ") : null;
}

export default async function OrderDetailPage({ params }) {
  const { id } = await params;

  // Active customer session check — redirect to /signin if not logged in
  const customer = await getCurrentCustomer();
  if (!customer) {
    redirect(`/signin?redirect=/account/orders/${id}`);
  }

  const order = await getOrderDetails(id);

  if (!order) {
    return (
      <>
        <Navbar />
        <main className={styles.pageWrapper}>
          <div className={styles.container}>
            <Link href="/account/orders" className={styles.backLink}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to My Account
            </Link>
            <div className={styles.card}>
              <div className={styles.notFoundState}>
                <h1 className={styles.notFoundTitle}>Order Not Found</h1>
                <p className={styles.notFoundDesc}>
                  The order you are looking for could not be found or you do not have permission to view it.
                </p>
                <Link href="/account/orders" className="btn-primary">
                  View All Orders
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const addr = order.shipping_address || {};
  const items = order.order_items || [];
  const statusBadge = getStatusBadgeConfig(order.order_status);

  // Payment status: COD orders show "Pending" as static label per brief
  const isCod = !order.payment_method || order.payment_method.toLowerCase() === "cod";
  const paymentMethodLabel = isCod ? "Cash on Delivery" : order.payment_method;
  const paymentStatusLabel = order.payment_status || (isCod ? "Pending" : "Paid");

  return (
    <>
      <Navbar />
      <main className={styles.pageWrapper}>
        <div className={styles.container}>
          {/* 1. Back link */}
          <Link href="/account/orders" className={styles.backLink}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to My Account
          </Link>

          {/* 2. Heading with Status Badge & 3. Placed date subtext */}
          <div className={styles.orderHeader}>
            <div className={styles.headerTitleRow}>
              <h1 className={styles.orderHeading}>Order {order.order_number}</h1>
              <span className={`${styles.statusBadge} ${statusBadge.className}`}>
                {statusBadge.label}
              </span>
            </div>
            <p className={styles.placedDate}>
              Placed on {formatPlacedDate(order.created_at)}
            </p>
          </div>

          {/* 4. Items Card */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </div>
              <h2 className={styles.cardTitle}>Items</h2>
            </div>

            <div className={styles.itemsList}>
              {items.map((item, idx) => {
                const variantText = formatVariantLine(item.variant_snapshot);
                const itemTotal = Number(item.price || 0) * Number(item.quantity || 1);

                return (
                  <div key={item.id || idx} className={styles.itemRow}>
                    {/* Product Image */}
                    <div className={styles.itemImageWrapper}>
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className={styles.itemImage}
                        />
                      ) : (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className={styles.itemContent}>
                      <h3 className={styles.itemName}>{item.product_name}</h3>
                      {variantText ? (
                        <div className={styles.itemVariant}>{variantText}</div>
                      ) : null}
                      <div className={styles.itemMeta}>
                        <span className={styles.itemQuantity}>Qty: {item.quantity}</span>
                        <span>·</span>
                        <span>₹{Number(item.price || 0).toLocaleString()} each</span>
                      </div>
                    </div>

                    {/* Item Total Price */}
                    <div className={styles.itemPriceCol}>
                      <div className={styles.itemTotalPrice}>
                        ₹{itemTotal.toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Below Items: Subtotal / Shipping / COD / Total rows */}
            <div className={styles.totalsBreakdown}>
              <div className={styles.totalRow}>
                <span className={styles.totalRowLabel}>Subtotal</span>
                <span className={styles.totalRowValue}>
                  ₹{Number(order.subtotal || 0).toLocaleString()}
                </span>
              </div>
              {order.quantity_discount && Number(order.quantity_discount) > 0 ? (
                <div className={styles.totalRow}>
                  <span className={styles.totalRowLabel}>Quantity Discount</span>
                  <span className={styles.totalRowValue} style={{ color: "#15803d", fontWeight: 600 }}>
                    − ₹{Number(order.quantity_discount).toLocaleString()}
                  </span>
                </div>
              ) : null}
              {order.coupon_discount && Number(order.coupon_discount) > 0 ? (
                <div className={styles.totalRow}>
                  <span className={styles.totalRowLabel}>
                    Coupon Discount {order.coupon_code ? `(${order.coupon_code})` : ""}
                  </span>
                  <span className={styles.totalRowValue} style={{ color: "#15803d", fontWeight: 600 }}>
                    − ₹{Number(order.coupon_discount).toLocaleString()}
                  </span>
                </div>
              ) : null}
              <div className={styles.totalRow}>
                <span className={styles.totalRowLabel}>Shipping</span>
                <span className={styles.totalRowValue}>
                  {Number(order.shipping_fee) === 0 ? "FREE" : `₹${Number(order.shipping_fee).toLocaleString()}`}
                </span>
              </div>
              {order.cod_fee && Number(order.cod_fee) > 0 ? (
                <div className={styles.totalRow}>
                  <span className={styles.totalRowLabel}>Cash on Delivery Fee</span>
                  <span className={styles.totalRowValue}>
                    ₹{Number(order.cod_fee).toLocaleString()}
                  </span>
                </div>
              ) : null}
              <div className={styles.grandTotalRow}>
                <span className={styles.grandTotalLabel}>Total</span>
                <span className={styles.grandTotalValue}>
                  ₹{Number(order.total_amount || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </section>

          {/* 5. Shipping Address Card */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h2 className={styles.cardTitle}>Shipping Address</h2>
            </div>
            <div className={styles.addressCardBody}>
              <div className={styles.contactLine}>
                {addr.full_name || customer.name}
                {addr.phone ? ` · ${addr.phone}` : ""}
              </div>
              {addr.address_line1 ? (
                <p className={styles.addressLine}>{addr.address_line1}</p>
              ) : null}
              {addr.address_line2 ? (
                <p className={styles.addressLine}>{addr.address_line2}</p>
              ) : null}
              <p className={styles.locationLine}>
                {[addr.city, addr.state].filter(Boolean).join(", ")}
                {addr.pin_code ? ` - ${addr.pin_code}` : ""}
              </p>
            </div>
          </section>

          {/* 6. Payment Card */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
              </div>
              <h2 className={styles.cardTitle}>Payment</h2>
            </div>
            <div className={styles.paymentCardBody}>
              <span className={styles.paymentMethodText}>
                <strong>Method:</strong> {paymentMethodLabel}
              </span>
              <span className={styles.paymentSeparator}>|</span>
              <span className={styles.paymentStatusText}>
                <strong>Status:</strong>{" "}
                <span className={styles.paymentStatusBadge}>{paymentStatusLabel}</span>
              </span>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
