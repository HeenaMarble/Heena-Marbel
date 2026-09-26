import Link from "next/link";
import {
  ShoppingCart,
  Package,
  MessageSquare,
  IndianRupee,
  ArrowUpRight,
  ChevronRight,
  PlusCircle,
  LayoutTemplate,
  Star,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { getDashboardStats } from "@/actions/admin/dashboard";
import styles from "./Dashboard.module.css";

const STATUS_CLASSES = {
  pending: "bg-[#b38b4d]/15 text-[#967440] border-[#b38b4d]/30",
  processing: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  shipped: "bg-blue-500/15 text-blue-700 border-blue-500/30",
  delivered: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  cancelled: "bg-red-500/15 text-red-700 border-red-500/30",
};

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const kpis = [
    {
      label: "Total Revenue",
      value: `₹${stats.revenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      description: "Direct client sales & orders",
      trend: "All-time Billing",
    },
    {
      label: "Total Orders",
      value: stats.orderCount,
      icon: ShoppingCart,
      description: "Store product orders & purchases",
      badge: stats.pendingOrders > 0 ? `${stats.pendingOrders} pending` : "All dispatched",
      badgeType: stats.pendingOrders > 0 ? "amber" : "emerald",
    },
    {
      label: "Product Catalog",
      value: stats.productCount,
      icon: Package,
      description: "Active products & items",
      trend: "Live in Storefront",
    },
    {
      label: "Client Inquiries",
      value: stats.inquiryCount,
      icon: MessageSquare,
      description: "Consultation & quote requests",
      badge: stats.unresolvedInquiryCount > 0 ? `${stats.unresolvedInquiryCount} unresolved` : "All resolved",
      badgeType: stats.unresolvedInquiryCount > 0 ? "amber" : "emerald",
    },
  ];

  return (
    <div className={styles.dashboardWrapper}>
      {/* Mobile Greeting Banner (Visible only on mobile/tablet) */}
      <div className={styles.mobileGreetingBanner}>
        <div className={styles.mobileGreetingHeader}>
          <div>
            <h1 className={styles.mobileGreetingTitle}>
              Welcome back, <span className={styles.mobileAdminName}>Admin</span> 👋
            </h1>
            <p className={styles.mobileGreetingSub}>
              Here&apos;s what&apos;s happening with your store today.
            </p>
          </div>
          <span className={styles.mobileLiveBadge}>
            <span className={styles.mobileLiveDot} />
            <span>Live</span>
          </span>
        </div>
      </div>

      {/* 4 KPI Stat Cards */}
      <div className={styles.kpiGrid}>
        {kpis.map((kpi) => (
          <div key={kpi.label} className={styles.kpiCard}>
            <div className={styles.kpiHeader}>
              <span className={styles.kpiLabel}>{kpi.label}</span>
              <div className={styles.kpiIconWrap}>
                <kpi.icon size={20} />
              </div>
            </div>

            <p className={styles.kpiValue}>{kpi.value}</p>
            <p className={styles.kpiSub}>{kpi.description}</p>

            <div className={styles.kpiFooter}>
              <span className="text-[#888888] font-medium text-xs">Status</span>
              {kpi.badge ? (
                <span
                  className={
                    kpi.badgeType === "emerald"
                      ? styles.kpiBadgeEmerald
                      : styles.kpiBadgeAmber
                  }
                >
                  {kpi.badge}
                </span>
              ) : (
                <span className={styles.kpiTrend}>{kpi.trend}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Operations Strip */}
      <div className={styles.operationsCard}>
        <div className={styles.operationsHeader}>
          <h2 className={styles.operationsTitle}>⚡ Quick Operations Desk</h2>
          <span className={styles.operationsSub}>1-Click Direct Access</span>
        </div>

        <div className={styles.operationsGrid}>
          <Link href="/admin/products/new" className={styles.actionBtnPrimary}>
            <PlusCircle className={styles.actionIcon} />
            <span>+ Add Product</span>
          </Link>

          <Link href="/admin/orders" className={styles.actionBtnSecondary}>
            <ShoppingCart className={styles.actionIcon} style={{ color: "#967440" }} />
            <span>Manage Orders</span>
          </Link>

          <Link href="/admin/inquiries" className={styles.actionBtnSecondary}>
            <MessageSquare className={styles.actionIcon} style={{ color: "#967440" }} />
            <span>Client Inquiries</span>
          </Link>

          <Link href="/admin/content/hero-video" className={styles.actionBtnSecondary}>
            <LayoutTemplate className={styles.actionIcon} style={{ color: "#967440" }} />
            <span>Hero Content</span>
          </Link>
        </div>
      </div>

      {/* Two-Column Command Center */}
      <div className={styles.twoColumnGrid}>
        {/* Left Column: Recent Orders + Quality Guarantee */}
        <div className={styles.leftColumn}>
          {/* Orders Section Card */}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeaderFlex}>
              <div>
                <h2 className={styles.cardHeading}>Recent Store Orders</h2>
                <p className={styles.cardDescription}>
                  Customer purchases and custom temple bookings
                </p>
              </div>
              <Link href="/admin/orders" className={styles.viewAllLink}>
                <span>View All</span>
                <ArrowUpRight size={15} />
              </Link>
            </div>

            {stats.recentOrders.length === 0 ? (
              <div className={styles.emptyStateContainer}>
                <div className={styles.emptyStateIconWrap}>
                  <ShoppingCart size={26} />
                </div>
                <h3 className={styles.emptyStateTitle}>No Store Orders Yet</h3>
                <p className={styles.emptyStateText}>
                  When customers purchase from the Heena Marble storefront or place custom temple bookings, they will appear here in real-time.
                </p>
                <Link href="/admin/products" className={styles.emptyStateLink}>
                  <span>Inspect Marble Inventory</span>
                  <ChevronRight size={15} />
                </Link>
              </div>
            ) : (
              <div className={styles.tableContainer}>
                <table className={styles.ordersTable}>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th style={{ textAlign: "right" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((o) => (
                      <tr key={o.id}>
                        <td>
                          <Link href={`/admin/orders/${o.id}`} className={styles.orderNumberLink}>
                            {o.order_number}
                          </Link>
                        </td>
                        <td className={styles.orderAmount}>
                          ₹{Number(o.total_amount).toLocaleString("en-IN")}
                        </td>
                        <td>
                          <span
                            className={`${styles.statusBadge} ${
                              STATUS_CLASSES[o.order_status] || "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {o.order_status}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <Link
                            href={`/admin/orders/${o.id}`}
                            className="inline-flex items-center text-xs font-bold text-[#967440] hover:text-[#1a1a1a]"
                          >
                            <span>Manage</span>
                            <ChevronRight size={14} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Inventory Health Card */}
          <div className={styles.sectionCard}>
            <div className="flex items-center gap-3 mb-3">
              {stats.lowStock.length === 0 ? (
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <CheckCircle2 size={20} />
                </div>
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                  <AlertTriangle size={20} />
                </div>
              )}
              <div>
                <h2 className={styles.cardHeading} style={{ fontSize: "16px" }}>Inventory Health</h2>
                <p className={styles.cardDescription}>Makrana stock monitoring</p>
              </div>
            </div>

            {stats.lowStock.length === 0 ? (
              <p className="text-sm text-[#555555] leading-relaxed">
                ✓ All marble mandirs, statues, and raw stone slabs are adequately stocked in the studio.
              </p>
            ) : (
              <div className={styles.lowStockList}>
                {stats.lowStock.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50/60 px-3 py-2 text-sm"
                  >
                    <span className="font-semibold text-[#1a1a1a] truncate pr-2">{p.name}</span>
                    <span
                      className={`font-bold shrink-0 text-xs px-2 py-0.5 rounded ${
                        p.stock_quantity === 0
                          ? "bg-red-100 text-red-700 border border-red-200"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {p.stock_quantity === 0 ? "Out of Stock" : `${p.stock_quantity} left`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quality Standard Box */}
          <div className={styles.qualityCard}>
            <div className={styles.qualityIconWrap}>
              <ShieldCheck size={26} />
            </div>
            <div>
              <h3 className={styles.qualityTitle}>Heena Marble Quality Standard</h3>
              <p className={styles.qualityText}>
                Authentic Grade-1 Makrana White, Albeta, and Dungri marble carving. All custom mandirs and statues undergo diamond polishing and moisture-resistant wooden crating before dispatch.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Action Desk & Inquiries */}
        <div className={styles.rightColumn}>
          {/* Action Desk Card */}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeaderFlex} style={{ marginBottom: "16px" }}>
              <div>
                <h2 className={styles.cardHeading}>Action Desk</h2>
                <p className={styles.cardDescription}>Tasks requiring administrator review</p>
              </div>
            </div>

            <div className={styles.actionDeskList}>
              {/* Reviews */}
              <Link href="/admin/reviews" className={styles.actionDeskItem}>
                <div className={styles.actionDeskLeft}>
                  <div className={styles.actionDeskIconWrap} style={{ background: "rgba(179, 139, 77, 0.12)", color: "#967440" }}>
                    <Star size={18} />
                  </div>
                  <span className={styles.actionDeskText}>Client Reviews</span>
                </div>
                <span
                  className={styles.actionDeskBadge}
                  style={
                    stats.pendingReviewCount > 0
                      ? { background: "#b38b4d", color: "#ffffff" }
                      : { background: "#f3f4f6", color: "#6b7280" }
                  }
                >
                  {stats.pendingReviewCount}
                </span>
              </Link>

              {/* Inquiries */}
              <Link href="/admin/inquiries" className={styles.actionDeskItem}>
                <div className={styles.actionDeskLeft}>
                  <div className={styles.actionDeskIconWrap} style={{ background: "rgba(59, 130, 246, 0.12)", color: "#2563eb" }}>
                    <MessageSquare size={18} />
                  </div>
                  <span className={styles.actionDeskText}>Customer Inquiries</span>
                </div>
                <span
                  className={styles.actionDeskBadge}
                  style={
                    stats.unresolvedInquiryCount > 0
                      ? { background: "#2563eb", color: "#ffffff" }
                      : { background: "#f3f4f6", color: "#6b7280" }
                  }
                >
                  {stats.unresolvedInquiryCount}
                </span>
              </Link>

              {/* Pending Orders */}
              <Link href="/admin/orders" className={styles.actionDeskItem}>
                <div className={styles.actionDeskLeft}>
                  <div className={styles.actionDeskIconWrap} style={{ background: "rgba(245, 158, 11, 0.12)", color: "#d97706" }}>
                    <ShoppingCart size={18} />
                  </div>
                  <span className={styles.actionDeskText}>Pending Orders</span>
                </div>
                <span
                  className={styles.actionDeskBadge}
                  style={
                    stats.pendingOrders > 0
                      ? { background: "#d97706", color: "#ffffff" }
                      : { background: "#f3f4f6", color: "#6b7280" }
                  }
                >
                  {stats.pendingOrders}
                </span>
              </Link>
            </div>
          </div>

          {/* Consultation Inquiries Card */}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeaderFlex} style={{ marginBottom: "16px" }}>
              <div>
                <h2 className={styles.cardHeading}>Consultation Inquiries</h2>
                <p className={styles.cardDescription}>Recent customer quote requests</p>
              </div>
              <Link href="/admin/inquiries" className={styles.viewAllLink}>
                <span>All</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>

            {stats.recentInquiries.length === 0 ? (
              <p className="py-6 text-center text-sm font-medium text-[#888888]">
                No pending customer inquiries.
              </p>
            ) : (
              <div className={styles.inquiriesList}>
                {stats.recentInquiries.slice(0, 2).map((i) => (
                  <Link key={i.id} href="/admin/inquiries" className={styles.inquiryItem}>
                    <p className={styles.inquiryName}>{i.name}</p>
                    <p className={styles.inquiryMessage}>{i.message}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
