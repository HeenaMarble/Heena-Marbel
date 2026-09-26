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
  LayoutGrid,
  FolderKanban,
  Video,
  X,
  LogOut,
  Truck,
  Tag,
  ChevronDown,
  Globe,
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
    title: "Appearance & Content",
    items: [
      {
        label: "Landing Page",
        icon: Globe,
        children: [
          { label: "Hero Content", href: "/admin/content/hero-video", icon: Video },
          { label: "Announcements", href: "/admin/content/announcements", icon: Megaphone },
          { label: "Services", href: "/admin/content/services", icon: Layers },
          { label: "Our Applications", href: "/admin/content/applications", icon: LayoutGrid },
          { label: "Stats & Numbers", href: "/admin/content/stats", icon: BarChart3 },
          { label: "Testimonials", href: "/admin/content/testimonials", icon: Quote },
        ],
      },
      { label: "Projects", href: "/admin/projects", icon: FolderKanban },
      { label: "Reels Showcase", href: "/admin/content/reels", icon: Film },
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
  const [openAccordions, setOpenAccordions] = useState({ "Landing Page": true });

  const isLinkActive = (href) => {
    if (href === "/admin") return pathname === "/admin";
    if (
      href === "/admin/content/hero-video" ||
      href === "/admin/content/settings" ||
      href === "/admin/settings/shipping" ||
      href === "/admin/settings/coupons" ||
      href === "/admin/settings/quantity-discount"
    ) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

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

  // Keep accordion open if currently on any landing page child route
  useEffect(() => {
    NAV_GROUPS.forEach((group) => {
      group.items.forEach((item) => {
        if (item.children) {
          const hasActiveChild = item.children.some((child) => isLinkActive(child.href));
          if (hasActiveChild) {
            setOpenAccordions((prev) => ({ ...prev, [item.label]: true }));
          }
        }
      });
    });
  }, [pathname]);

  const toggleAccordion = (label) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

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
                  if (item.children) {
                    const isOpen = !!openAccordions[item.label];
                    const isAnyChildActive = item.children.some((child) =>
                      isLinkActive(child.href)
                    );

                    return (
                      <div key={item.label}>
                        <button
                          type="button"
                          onClick={() => toggleAccordion(item.label)}
                          className={`${styles.accordionBtn} ${
                            isAnyChildActive ? styles.accordionParentActive : ""
                          }`}
                          aria-expanded={isOpen}
                        >
                          <item.icon
                            className={`${styles.navIcon} ${
                              isAnyChildActive ? styles.navIconActive : ""
                            }`}
                          />
                          <span className={styles.navLabel}>{item.label}</span>
                          <span className={styles.subCountBadge}>
                            {item.children.length}
                          </span>
                          <ChevronDown
                            className={`${styles.chevronIcon} ${
                              isOpen ? styles.chevronOpen : ""
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className={styles.subItemsContainer}>
                            {item.children.map((child) => {
                              const active = isLinkActive(child.href);
                              const badgeCount = badges[child.href];
                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => setMobileOpen(false)}
                                  className={`${styles.subNavLink} ${
                                    active ? styles.subNavLinkActive : ""
                                  }`}
                                >
                                  <child.icon
                                    className={`${styles.subNavIcon} ${
                                      active ? styles.subNavIconActive : ""
                                    }`}
                                  />
                                  <span className={styles.navLabel}>
                                    {child.label}
                                  </span>
                                  {!!badgeCount && (
                                    <span
                                      className={`${styles.badge} ${
                                        active
                                          ? styles.badgeActive
                                          : styles.badgeAlert
                                      }`}
                                    >
                                      {badgeCount > 99 ? "99+" : badgeCount}
                                    </span>
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  const active = isLinkActive(item.href);
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
