"use client";

import { Menu, ExternalLink, Plus } from "lucide-react";
import { useAdminSidebar } from "@/context/AdminSidebarContext";
import styles from "./Header.module.css";

export default function AdminHeader({ adminName = "Admin" }) {
  const { setMobileOpen } = useAdminSidebar();

  return (
    <header className={styles.header}>
      <div className={styles.leftGroup}>
        <button
          onClick={() => setMobileOpen(true)}
          className={styles.mobileMenuBtn}
          aria-label="Open Sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Desktop Title & Live Store Badge */}
        <div className={styles.desktopTitleWrapper}>
          <div className={styles.titleRow}>
            <h1 className={styles.headerTitle}>
              Welcome back, <span className={styles.adminHighlight}>{adminName}</span>
            </h1>
            <span className={styles.liveBadge}>
              <span className={styles.liveDot} />
              <span>Live Store</span>
            </span>
          </div>
          <p className={styles.headerSubtitle}>
            Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>

        {/* Mobile Clean Brand Title */}
        <div className={styles.mobileBrandWrap}>
          <span className={styles.mobileBrandTitle}>Heena Marble</span>
          <span className={styles.mobileBrandBadge}>Admin</span>
        </div>
      </div>

      <div className={styles.rightGroup}>
        <a
          href="/admin/products/new"
          className={styles.addPieceBtn}
          title="Add New Product"
          aria-label="Add Product"
        >
          <Plus size={17} strokeWidth={2.5} />
          <span className={styles.addPieceBtnTextDesktop}>Add Product</span>
        </a>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.storefrontBtn}
          title="Open Public Heena Marble Store"
          aria-label="View Storefront"
        >
          <span className={styles.storefrontBtnText}>Storefront</span>
          <ExternalLink size={16} />
        </a>
      </div>
    </header>
  );
}
