import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCurrentCustomer } from "@/actions/customer-auth";
import { getMyOrders } from "@/lib/actions/order-actions";
import styles from "./Orders.module.css";

export const metadata = {
  title: "My Orders | Heena Marble",
  description: "View and track your handcrafted marble orders.",
};

function formatDate(dateStr) {
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
      return { label: "Pending", className: styles.statusPending };
    case "processing":
      return { label: "Processing", className: styles.statusProcessing };
    case "shipped":
      return { label: "Shipped", className: styles.statusShipped };
    case "delivered":
      return { label: "Delivered", className: styles.statusDelivered };
    case "cancelled":
    case "canceled":
      return { label: "Cancelled", className: styles.statusCancelled };
    default:
      return { label: status || "Pending", className: styles.statusPending };
  }
}

export default async function OrdersListPage() {
  const customer = await getCurrentCustomer();
  if (!customer) {
    redirect("/signin?redirect=/account/orders");
  }

  const orders = await getMyOrders();

  return (
    <>
      <Navbar />
      <main className={styles.pageWrapper}>
        <div className={styles.container}>
          {/* Header & Breadcrumb */}
          <div className={styles.headerSection}>
            <div className={styles.breadcrumb}>
              <Link href="/">Home</Link>
              <span className={styles.breadcrumbSeparator}>/</span>
              <span className={styles.breadcrumbCurrent}>My Account</span>
              <span className={styles.breadcrumbSeparator}>/</span>
              <span className={styles.breadcrumbCurrent}>Orders</span>
            </div>

            <div className={styles.accountHeader}>
              <div className={styles.accountUserInfo}>
                <div className={styles.avatarCircle}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div>
                  <span className={styles.userSubheading}>Sacred Sanctuary</span>
                  <h1 className={styles.userName}>{customer.name || "Customer Account"}</h1>
                  <p className={styles.userEmail}>{customer.email} {customer.phone ? `· ${customer.phone}` : ""}</p>
                </div>
              </div>
            </div>

            {/* Account Navigation Tabs */}
            <div className={styles.accountTabs}>
              <Link href="/account/orders" className={`${styles.tabItem} ${styles.tabItemActive}`}>
                <span>My Orders</span>
                <span className={styles.tabBadge}>{orders.length}</span>
              </Link>
            </div>
          </div>

          {/* Orders Main Card */}
          <div className={styles.ordersCard}>
            {orders.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIconWrapper}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                </div>
                <h2 className={styles.emptyTitle}>No Orders Placed Yet</h2>
                <p className={styles.emptyDesc}>
                  You haven&apos;t placed any orders with Heena Marble yet. Explore our handcrafted Makrana marble temples, fountains, and artifacts.
                </p>
                <Link href="/shop" className={styles.exploreBtn}>
                  Explore Masterpieces
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className={styles.tableContainer}>
                  <table className={styles.ordersTable}>
                    <thead>
                      <tr>
                        <th>Order Number</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => {
                        const badge = getStatusBadgeConfig(order.order_status);
                        return (
                          <tr key={order.id}>
                            <td>
                              <span className={styles.orderNumber}>{order.order_number}</span>
                            </td>
                            <td>
                              <span className={styles.orderDate}>{formatDate(order.created_at)}</span>
                            </td>
                            <td>
                              <span className={`${styles.statusBadge} ${badge.className}`}>
                                {badge.label}
                              </span>
                            </td>
                            <td>
                              <span className={styles.orderTotal}>
                                ₹{Number(order.total_amount || 0).toLocaleString()}
                              </span>
                            </td>
                            <td>
                              <Link
                                href={`/account/orders/${order.id}`}
                                className={styles.viewDetailsLink}
                              >
                                View Details
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards List */}
                <div className={styles.mobileOrdersList}>
                  {orders.map((order) => {
                    const badge = getStatusBadgeConfig(order.order_status);
                    return (
                      <div key={order.id} className={styles.mobileOrderCard}>
                        <div className={styles.mobileCardTop}>
                          <span className={styles.orderNumber}>{order.order_number}</span>
                          <span className={`${styles.statusBadge} ${badge.className}`}>
                            {badge.label}
                          </span>
                        </div>
                        <div className={styles.mobileCardMeta}>
                          <span className={styles.orderDate}>{formatDate(order.created_at)}</span>
                          <span className={styles.orderTotal}>
                            ₹{Number(order.total_amount || 0).toLocaleString()}
                          </span>
                        </div>
                        <Link
                          href={`/account/orders/${order.id}`}
                          className={styles.mobileDetailsBtn}
                        >
                          View Details
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
