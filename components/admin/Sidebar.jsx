"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FolderTree,
  Package,
  ShoppingCart,
  Users,
  Star,
  MessageSquare,
  Quote,
  Settings,
  Megaphone,
  Layers,
  BarChart3,
  Film,
  FolderKanban,
  Video,
  X,
  LogOut,
  Truck,
  Tag,
} from "lucide-react";
import { useAdminSidebar } from "@/context/AdminSidebarContext";
import { adminLogout } from "@/actions/auth";
import { getSidebarBadgeCounts } from "@/actions/admin/dashboard";
import styles from "./Sidebar.module.css";

const NAV_GROUPS = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Catalog & Sales",
    items: [
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Categories", href: "/admin/categories", icon: FolderTree },
      { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
      { label: "Reviews", href: "/admin/reviews", icon: Star },
      { label: "Users", href: "/admin/users", icon: Users },
    ],
  },
  {
    title: "Studio & Content",
    items: [
      { label: "Hero Content", href: "/admin/content/hero-video", icon: Video },
      { label: "Announcements", href: "/admin/content/announcements", icon: Megaphone },
      { label: "Services", href: "/admin/content/services", icon: Layers },
      { label: "Projects", href: "/admin/projects", icon: FolderKanban },
      { label: "Stats", href: "/admin/content/stats", icon: BarChart3 },
      { label: "Testimonials", href: "/admin/content/testimonials", icon: Quote },
      { label: "Reels", href: "/admin/content/reels", icon: Film },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Site Settings", href: "/admin/content/settings", icon: Settings },
      { label: "Coupons", href: "/admin/settings/coupons", icon: Tag },
      { label: "Shipping Settings", href: "/admin/settings/shipping", icon: Truck },
      { label: "Quantity Discount", href: "/admin/settings/quantity-discount", icon: Layers },
    ],
  },
];

export default function AdminSidebar({ adminName = "Admin" }) {
  const pathname = usePathname();
  const { mobileOpen, setMobileOpen } = useAdminSidebar();
  const initial = adminName.trim().charAt(0).toUpperCase();

  const [badges, setBadges] = useState({});
  useEffect(() => {
    let cancelled = false;
    getSidebarBadgeCounts().then((counts) => {
      if (cancelled) return;
      setBadges({
        "/admin/reviews": counts.pendingReviewCount,
        "/admin/inquiries": counts.unreadInquiryCount,
      });
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`${styles.aside} ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top gold bar */}
        <div className={styles.topGoldBar} />

        {/* Sidebar Header */}
        <div className={styles.header}>
          <Link
            href="/admin"
            className={styles.brandLink}
            title="Heena Marble Admin Atelier"
          >
            <div className={styles.logoWrapper}>
              <img
                src="/logo.png"
                alt="Heena Marble"
                className={styles.logoImg}
              />
            </div>
            <div className={styles.brandMeta}>
              <p className={styles.brandTitle}>Heena Marble</p>
              <p className={styles.brandSubtitle}>Atelier Suite</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className={styles.closeMobileBtn}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className={styles.navContainer}>
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className={styles.group}>
              <p className={styles.groupTitle}>{group.title}</p>
              <div className={styles.navItems}>
                {group.items.map((item) => {
                  const active =
                    item.href === "/admin" ||
                    item.href === "/admin/content/hero-video" ||
                    item.href === "/admin/content/settings" ||
                    item.href === "/admin/settings/shipping" ||
                    item.href === "/admin/settings/coupons" ||
                    item.href === "/admin/settings/quantity-discount"
                      ? pathname === item.href
                      : pathname.startsWith(item.href);
                  const badgeCount = badges[item.href];
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`${styles.navLink} ${
                        active ? styles.navLinkActive : ""
                      }`}
                    >
                      <item.icon
                        className={`${styles.navIcon} ${
                          active ? styles.navIconActive : ""
                        }`}
                      />
                      <span className={styles.navLabel}>{item.label}</span>
                      {!!badgeCount && (
                        <span
                          className={`${styles.badge} ${
                            active ? styles.badgeActive : styles.badgeAlert
                          }`}
                        >
                          {badgeCount > 99 ? "99+" : badgeCount}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Profile Card */}
        <div className={styles.profileSection}>
          <div className={styles.profileCard}>
            <div className={styles.avatar}>
              {initial}
              <span className={styles.statusDot} />
            </div>
            <div className={styles.profileMeta}>
              <p className={styles.adminName}>{adminName}</p>
              <p className={styles.adminRole}>Store Administrator</p>
            </div>
            <form action={adminLogout}>
              <button
                type="submit"
                title="Log out of Admin"
                className={styles.logoutBtn}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}

