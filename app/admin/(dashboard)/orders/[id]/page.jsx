import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Package,
  MapPin,
  ArrowLeft,
  Layers,
  Sliders,
  Palette,
  Ruler,
  Tag,
  ExternalLink,
} from "lucide-react";
import { getOrder } from "@/actions/orders";
import ManageStatusCard from "@/components/admin/ManageStatusCard";
import styles from "./OrderDetail.module.css";

function safeParse(val, fallback = null) {
  if (val === null || val === undefined) return fallback;
  if (typeof val === "object") return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (typeof parsed === "string") {
        try {
          return JSON.parse(parsed);
        } catch {
          return parsed;
        }
      }
      return parsed;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

function parseDimensionUnits(labels) {
  const parsed = safeParse(labels, []);
  const list = Array.isArray(parsed) ? parsed : [];
  const unitMap = {};
  list.forEach((item) => {
    let obj = item;
    if (typeof obj === "string") {
      try {
        obj = JSON.parse(obj);
      } catch {}
    }
    if (typeof obj === "string") {
      try {
        obj = JSON.parse(obj);
      } catch {}
    }
    if (obj && typeof obj === "object") {
      const label = (obj.label || "").trim().toLowerCase();
      const unit = (obj.unit || "").trim();
      if (label && unit) unitMap[label] = unit;
    }
  });
  return unitMap;
}

function getItemVariantDetails(item) {
  const snap = safeParse(item.variant_snapshot, null) || {};
  const pv = item.product_variants || {};
  const prod = item.products || {};

  const isVariant = Boolean(
    item.variant_id ||
    snap.color_name ||
    (snap.dimension_values && Object.keys(snap.dimension_values).length > 0) ||
    prod.has_variants ||
    item.product_variants
  );

  const colorName = snap.color_name || pv.color_name || null;
  const colorHex = snap.color_hex || pv.color_hex || null;

  const rawDimValues = snap.dimension_values || pv.dimension_values || null;
  const dimValues = safeParse(rawDimValues, {});
  const unitMap = parseDimensionUnits(prod.variant_dimension_labels);

  const formattedDimensions = [];
  if (dimValues && typeof dimValues === "object" && !Array.isArray(dimValues)) {
    for (const [key, val] of Object.entries(dimValues)) {
      if (val !== null && val !== undefined && String(val).trim() !== "") {
        const unit = unitMap[key.toLowerCase()] || "";
        const valStr = String(val).trim();
        const displayVal = unit ? `${valStr} ${unit}` : valStr;
        formattedDimensions.push({ label: key, value: displayVal });
      }
    }
  } else if (typeof rawDimValues === "string" && rawDimValues.trim()) {
    formattedDimensions.push({ label: "Dimensions", value: rawDimValues.trim() });
  }

  return {
    isVariant,
    colorName,
    colorHex,
    dimensions: formattedDimensions,
  };
}

function getSoloDimensions(product) {
  if (!product) return [];
  const dims = safeParse(product.dimensions, []);
  if (!Array.isArray(dims)) return [];
  return dims
    .filter((d) => d && (d.value || d.label))
    .map((d) => {
      const label = (d.label || "Dimension").trim();
      const valStr = String(d.value || "").trim();
      const unitStr = String(d.unit || "").trim();
      const value = unitStr ? `${valStr} ${unitStr}` : valStr;
      return {
        label,
        value,
      };
    })
    .filter((d) => d.value);
}

function getProductSpecifications(product) {
  if (!product) return [];
  const specs = safeParse(product.specifications, []);
  if (!Array.isArray(specs)) return [];
  return specs
    .filter((s) => s && (s.label || s.key || s.value))
    .map((s) => ({
      label: (s.label || s.key || "Specification").trim(),
      value: String(s.value || "").trim(),
    }))
    .filter((s) => s.value);
}

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
              <h2 className={styles.cardTitle}>Items ({items.length})</h2>
            </div>

            <div className={styles.itemsList}>
              {items.map((item) => {
                const itemTotal = (Number(item.price) || 0) * (item.quantity || 1);
                const variantInfo = getItemVariantDetails(item);
                const soloDimensions = !variantInfo.isVariant ? getSoloDimensions(item.products) : [];
                const productSpecs = getProductSpecifications(item.products);
                const productName = item.product_name || item.products?.name || "Product";
                const imageUrl = item.products?.image_url;

                return (
                  <div key={item.id} className={styles.itemRow}>
                    <div className={styles.itemMain}>
                      {/* Top Header Row of Item */}
                      <div className={styles.itemHeader}>
                        <div className={styles.itemThumb}>
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={productName}
                            />
                          ) : (
                            <span className={styles.noThumb}>No pic</span>
                          )}
                        </div>

                        <div className={styles.itemBasicInfo}>
                          <div className={styles.itemTitleRow}>
                            <h3 className={styles.itemName}>{productName}</h3>
                            {variantInfo.isVariant ? (
                              <span className={styles.variantBadge}>
                                <Layers size={11} /> Variant SKU
                              </span>
                            ) : (
                              <span className={styles.soloBadge}>
                                Standard SKU
                              </span>
                            )}
                          </div>

                          <div className={styles.itemMetaRow}>
                            <span className={styles.itemQtyBadge}>
                              Qty: {item.quantity}
                            </span>
                            <span className={styles.itemUnitPrice}>
                              ₹{Number(item.price || 0).toLocaleString("en-IN")} each
                            </span>
                            {item.product_id && (
                              <Link
                                href={`/admin/products/${item.product_id}/edit`}
                                className={styles.productLink}
                                title="Edit Product in Admin"
                              >
                                <ExternalLink size={12} />
                                <span>View Product</span>
                              </Link>
                            )}
                          </div>
                        </div>

                        <div className={styles.itemPriceBlock}>
                          <span className={styles.itemTotalPrice}>
                            ₹{itemTotal.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      {/* Specifications & Variant Box */}
                      <div className={styles.specificationsBox}>
                        {/* 1. Ordered Variant Options */}
                        {variantInfo.isVariant && (
                          <div className={styles.specSection}>
                            <div className={styles.specSectionHeader}>
                              <Sliders size={13} className={styles.specSectionIcon} />
                              <span className={styles.specSectionTitle}>
                                Ordered Variant Details
                              </span>
                            </div>

                            <div className={styles.specTagsList}>
                              {/* Color Tag */}
                              {variantInfo.colorName && (
                                <div className={styles.specTag}>
                                  <Palette size={12} className={styles.tagIcon} />
                                  <span className={styles.specTagLabel}>Color:</span>
                                  {variantInfo.colorHex && (
                                    <span
                                      className={styles.colorDot}
                                      style={{ backgroundColor: variantInfo.colorHex }}
                                    />
                                  )}
                                  <span className={styles.specTagValue}>
                                    {variantInfo.colorName}
                                  </span>
                                </div>
                              )}

                              {/* Dimension Tags */}
                              {variantInfo.dimensions.map((dim, dIdx) => (
                                <div key={dIdx} className={styles.specTag}>
                                  <Ruler size={12} className={styles.tagIcon} />
                                  <span className={styles.specTagLabel}>{dim.label}:</span>
                                  <span className={styles.specTagValue}>{dim.value}</span>
                                </div>
                              ))}

                              {!variantInfo.colorName && variantInfo.dimensions.length === 0 && (
                                <span className={styles.emptySpecNote}>
                                  Default Variant SKU
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* 2. Solo Product Dimensions */}
                        {!variantInfo.isVariant && soloDimensions.length > 0 && (
                          <div className={styles.specSection}>
                            <div className={styles.specSectionHeader}>
                              <Ruler size={13} className={styles.specSectionIcon} />
                              <span className={styles.specSectionTitle}>
                                Dimensions
                              </span>
                            </div>

                            <div className={styles.specTagsList}>
                              {soloDimensions.map((dim, dIdx) => (
                                <div key={dIdx} className={styles.specTag}>
                                  <span className={styles.specTagLabel}>{dim.label}:</span>
                                  <span className={styles.specTagValue}>{dim.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 3. General Product Specifications (for both Variant & Solo) */}
                        {productSpecs.length > 0 && (
                          <div className={styles.specSection}>
                            <div className={styles.specSectionHeader}>
                              <Tag size={13} className={styles.specSectionIcon} />
                              <span className={styles.specSectionTitle}>
                                Product Specifications
                              </span>
                            </div>

                            <div className={styles.specTagsList}>
                              {productSpecs.map((spec, sIdx) => (
                                <div key={sIdx} className={styles.specTag}>
                                  <span className={styles.specTagLabel}>{spec.label}:</span>
                                  <span className={styles.specTagValue}>{spec.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Fallback if solo item has no recorded specs or dimensions */}
                        {!variantInfo.isVariant && soloDimensions.length === 0 && productSpecs.length === 0 && (
                          <div className={styles.emptySpecRow}>
                            <span className={styles.emptySpecNote}>
                              Standard single-item product without additional custom specifications.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
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

              {order.quantity_discount && Number(order.quantity_discount) > 0 ? (
                <div className={styles.totalRow}>
                  <span>Quantity Discount</span>
                  <span className={styles.totalRowValue} style={{ color: "#15803d", fontWeight: 600 }}>
                    − ₹{Number(order.quantity_discount).toLocaleString("en-IN")}
                  </span>
                </div>
              ) : null}

              {order.coupon_discount && Number(order.coupon_discount) > 0 ? (
                <div className={styles.totalRow}>
                  <span>Coupon {order.coupon_code ? `(${order.coupon_code})` : "Discount"}</span>
                  <span className={styles.totalRowValue} style={{ color: "#15803d", fontWeight: 600 }}>
                    − ₹{Number(order.coupon_discount).toLocaleString("en-IN")}
                  </span>
                </div>
              ) : null}

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
        </div>

        {/* Right Column: Manage Status Card + Customer & Shipping Card */}
        <div className={styles.rightColumn}>
          <ManageStatusCard
            orderId={order.id}
            orderNumber={order.order_number}
            currentStatus={order.order_status}
            paymentMethod={order.payment_method}
            currentPaymentStatus={order.payment_status}
          />

          {/* Customer & Shipping Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrap}>
                <MapPin size={18} />
              </div>
              <h2 className={styles.cardTitle}>Customer &amp; Shipping</h2>
            </div>

            <div className={styles.customerShippingGrid}>
              {/* Customer Section */}
              <div className={styles.columnGroup}>
                <span className={styles.colSubLabel}>CUSTOMER</span>
                <p className={styles.boldContact}>{customerName}</p>
                <p className={styles.contactLine}>{customerEmail}</p>
                {customerPhone !== "—" && (
                  <p className={styles.contactLine}>{customerPhone}</p>
                )}
              </div>

              <div className={styles.customerShippingDivider} />

              {/* Shipping Address Section */}
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
      </div>
    </div>
  );
}
