import Link from "next/link";
import { ShoppingCart, Clock, Truck, XCircle, Eye } from "lucide-react";
import { getOrdersOverview } from "@/lib/actions/orders-admin-actions";
import styles from "./Orders.module.css";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
];

function formatOrderDate(dateInput) {
  if (!dateInput) return "—";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

function formatPaymentLabel(paymentMethod, paymentStatus) {
  const isCod = (paymentMethod || "").toLowerCase() === "cod";
  const methodLabel = isCod ? "COD" : "Online";
  const statusLabel = paymentStatus || (isCod ? "Pending" : "Paid");
  return `${methodLabel} · ${statusLabel}`;
}

function getCustomerName(order) {
  if (order.customers?.name) return order.customers.name;
  let addr = order.shipping_address;
  if (typeof addr === "string") {
    try {
      addr = JSON.parse(addr);
    } catch {}
  }
  if (addr?.full_name) return addr.full_name;
  return "Guest";
}

function formatTotalAmount(amount) {
  const num = Math.round(Number(amount) || 0);
  return `₹${num.toLocaleString("en-IN")}`;
}

function getStatusBadgeClass(status) {
  const s = (status || "").toLowerCase();
  switch (s) {
    case "pending":
      return styles.statusPending;
    case "processing":
      return styles.statusProcessing;
    case "shipped":
      return styles.statusShipped;
    case "delivered":
      return styles.statusDelivered;
    case "cancelled":
    case "canceled":
      return styles.statusCancelled;
    default:
      return styles.statusPending;
  }
}

export default async function OrdersPage() {
  const { orders = [], stats = { total: 0, pending: 0, shipped: 0, cancelled: 0 } } =
    await getOrdersOverview();

  const statCards = [
    {
      label: "TOTAL ORDERS",
      value: stats.total ?? 0,
      icon: ShoppingCart,
    },
    {
      label: "PENDING",
      value: stats.pending ?? 0,
      icon: Clock,
    },
    {
      label: "SHIPPED",
      value: stats.shipped ?? 0,
      icon: Truck,
    },
    {
      label: "CANCELLED",
      value: stats.cancelled ?? 0,
      icon: XCircle,
    },
  ];

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.headerSection}>
        <div className={styles.titleGroup}>
          <h1 className={styles.pageTitle}>
            Order <span className={styles.titleHighlight}>Management</span>
          </h1>
          <p className={styles.pageSubtitle}>
            {stats.total ?? 0} orders placed so far.
          </p>
        </div>
      </div>

      {/* 4 Stat Cards Row */}
      <div className={styles.kpiGrid}>
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <span className={styles.kpiLabel}>{card.label}</span>
                <div className={styles.kpiIconWrap}>
                  <Icon size={20} />
                </div>
              </div>
              <p className={styles.kpiValue}>{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Orders Table or Empty State */}
      <div className={styles.contentWrapper}>
        {orders.length === 0 ? (
          <div className={styles.emptyStateContainer}>
            <p className={styles.emptyStateMessage}>No orders yet</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.ordersTable}>
              <thead>
                <tr>
                  <th>ORDER</th>
                  <th>CUSTOMER</th>
                  <th>DATE</th>
                  <th>PAYMENT</th>
                  <th>TOTAL</th>
                  <th>STATUS</th>
                  <th style={{ textAlign: "right" }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <span className={styles.orderNumber}>{o.order_number}</span>
                    </td>
                    <td>
                      <span className={styles.customerName}>
                        {getCustomerName(o)}
                      </span>
                    </td>
                    <td>
                      <span className={styles.orderDate}>
                        {formatOrderDate(o.created_at)}
                      </span>
                    </td>
                    <td>
                      <span className={styles.paymentLabel}>
                        {formatPaymentLabel(o.payment_method, o.payment_status)}
                      </span>
                    </td>
                    <td>
                      <span className={styles.totalAmount}>
                        {formatTotalAmount(o.total_amount)}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${getStatusBadgeClass(
                          o.order_status
                        )}`}
                      >
                        {o.order_status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className={styles.viewDetailsBtn}
                      >
                        <Eye size={14} />
                        <span>View Details</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
