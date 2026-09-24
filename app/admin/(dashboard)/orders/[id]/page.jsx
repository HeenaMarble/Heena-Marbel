import Link from "next/link";
import { notFound } from "next/navigation";
import { Package, MapPin, ArrowLeft } from "lucide-react";
import { getOrder } from "@/actions/orders";
import ManageStatusCard from "@/components/admin/ManageStatusCard";
import styles from "./OrderDetail.module.css";

function parseShippingAddress(rawAddress, fallbackName, fallbackPhone) {
  let addr = rawAddress;
  if (typeof addr === "string") {
    try {
      addr = JSON.parse(addr);
    } catch {
      return {
        fullName: fallbackName || "Guest",
        phone: fallbackPhone || "",
        headerLine: `${fallbackName || "Guest"}${fallbackPhone ? ` · ${fallbackPhone}` : ""}`,
        addressLine1: rawAddress,
        addressLine2: "",
        cityStatePin: "",
      };
    }
  }

  if (!addr || typeof addr !== "object") {
    return {
      fullName: fallbackName || "Guest",
      phone: fallbackPhone || "",
      headerLine: `${fallbackName || "Guest"}${fallbackPhone ? ` · ${fallbackPhone}` : ""}`,
      addressLine1: "",
      addressLine2: "",
      cityStatePin: "",
    };
  }

  const fullName = addr.full_name || fallbackName || "Guest";
  const phone = addr.phone || fallbackPhone || "";
  const headerLine = `${fullName}${phone ? ` · ${phone}` : ""}`;
  const addressLine1 = addr.address_line1 || addr.street || addr.address || "";
  const addressLine2 = addr.address_line2 || "";

  const cityState = [addr.city, addr.state].filter(Boolean).join(", ");
  const pin = addr.pin_code || addr.pincode || addr.postal_code || "";
  const cityStatePin = [cityState, pin].filter(Boolean).join(" ");

  return {
    fullName,
    phone,
    headerLine,
    addressLine1,
    addressLine2,
    cityStatePin,
  };
}

export default async function OrderDetailPage({ params }) {
  const { id } = await params;
  let order;
  try {
    order = await getOrder(id);
  } catch (e) {
    notFound();
  }

  if (!order) notFound();

  const items = order.items || [];
  const calculatedSubtotal = items.reduce(
    (acc, it) => acc + (Number(it.price) || 0) * (it.quantity || 1),
    0
  );
  const subtotal = order.subtotal ?? calculatedSubtotal;
  const shippingFee = Number(order.shipping_fee || 0);
  const codFee = Number(order.cod_fee || 0);
  const totalAmount = Number(order.total_amount || 0);

  const customerName = order.customers?.name || "Guest";
  const customerEmail = order.customers?.email || "—";
  const customerPhone = order.customers?.phone || "—";

  const parsedAddress = parseShippingAddress(
    order.shipping_address,
    customerName,
    order.customers?.phone
  );

  const orderDateObj = new Date(order.created_at);
  const formattedDate = !isNaN(orderDateObj.getTime())
    ? `${orderDateObj.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}, ${orderDateObj.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })}`
    : String(order.created_at);

  return (
    <div className={styles.pageContainer}>
      {/* Top Header */}
      <div className={styles.headerSection}>
        <Link href="/admin/orders" className={styles.backLink}>
          <ArrowLeft size={16} />
          <span>Back to Orders</span>
        </Link>
        <div>
          <h1 className={styles.orderHeading}>{order.order_number}</h1>
          <p className={styles.orderDate}>{formattedDate}</p>
        </div>
      </div>

      {/* 2-Column SakPack Layout */}
      <div className={styles.mainGrid}>
        {/* Left Column: Items + Customer & Shipping */}
        <div className={styles.leftColumn}>
          {/* Items Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrap}>
                <Package size={18} />
              </div>
              <h2 className={styles.cardTitle}>Items</h2>
            </div>

            <div className={styles.itemsList}>
              {items.map((item) => {
                const itemTotal = (Number(item.price) || 0) * (item.quantity || 1);
                return (
                  <div key={item.id} className={styles.itemRow}>
                    <div className={styles.itemLeft}>
                      <div className={styles.itemThumb}>
                        {item.products?.image_url ? (
                          <img
                            src={item.products.image_url}
                            alt={item.products?.name || "Product"}
                          />
                        ) : (
                          <span className={styles.noThumb}>No pic</span>
                        )}
                      </div>
                      <div className={styles.itemInfo}>
                        <p className={styles.itemName}>
                          {item.products?.name || "Product"}
                        </p>
                        <p className={styles.itemMeta}>Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className={styles.itemPrice}>
                      ₹{itemTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Price Breakdown */}
            <div className={styles.totalsSection}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span className={styles.totalRowValue}>
                  ₹{Number(subtotal).toLocaleString("en-IN")}
                </span>
              </div>

              <div className={styles.totalRow}>
                <span>Shipping</span>
                <span className={styles.totalRowValue}>
                  {shippingFee === 0 ? "Free" : `₹${shippingFee.toLocaleString("en-IN")}`}
                </span>
              </div>

              {codFee > 0 && (
                <div className={styles.totalRow}>
                  <span>COD Fee</span>
                  <span className={styles.totalRowValue}>
                    ₹{codFee.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              <div className={styles.grandTotalRow}>
                <span className={styles.grandTotalLabel}>Total</span>
                <span className={styles.grandTotalValue}>
                  ₹{totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrap}>
                <MapPin size={18} />
              </div>
              <h2 className={styles.cardTitle}>Customer &amp; Shipping</h2>
            </div>

            <div className={styles.customerShippingGrid}>
              {/* Customer Column */}
              <div className={styles.columnGroup}>
                <span className={styles.colSubLabel}>CUSTOMER</span>
                <p className={styles.boldContact}>{customerName}</p>
                <p className={styles.contactLine}>{customerEmail}</p>
                {customerPhone !== "—" && (
                  <p className={styles.contactLine}>{customerPhone}</p>
                )}
              </div>

              {/* Shipping Address Column */}
              <div className={styles.columnGroup}>
                <span className={styles.colSubLabel}>SHIPPING ADDRESS</span>
                <p className={styles.boldContact}>{parsedAddress.headerLine}</p>
                {parsedAddress.addressLine1 && (
                  <p className={styles.contactLine}>{parsedAddress.addressLine1}</p>
                )}
                {parsedAddress.addressLine2 && (
                  <p className={styles.contactLine}>{parsedAddress.addressLine2}</p>
                )}
                {parsedAddress.cityStatePin && (
                  <p className={styles.contactLine}>{parsedAddress.cityStatePin}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Manage Status Card */}
        <div className={styles.rightColumn}>
          <ManageStatusCard
            orderId={order.id}
            orderNumber={order.order_number}
            currentStatus={order.order_status}
            paymentMethod={order.payment_method}
          />
        </div>
      </div>
    </div>
  );
}
