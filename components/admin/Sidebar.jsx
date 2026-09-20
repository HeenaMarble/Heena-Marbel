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
  Mail,
  LayoutTemplate,
  Quote,
  Megaphone,
  Settings,
  X,
  LogOut,
} from "lucide-react";
import { useAdminSidebar } from "@/context/AdminSidebarContext";
import { adminLogout } from "@/actions/auth";
import { getSidebarBadgeCounts } from "@/actions/admin/dashboard";

const NAV_GROUPS = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Catalog",
    items: [
      { label: "Categories", href: "/admin/categories", icon: FolderTree },
      { label: "Products", href: "/admin/products", icon: Package },
    ],
  },
  {
    title: "Sales",
    items: [
      { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Reviews", href: "/admin/reviews", icon: Star },
      { label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
      { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Home Customization", href: "/admin/hero-slides", icon: LayoutTemplate },
      { label: "Testimonials", href: "/admin/testimonials", icon: Quote },
      { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
    ],
  },
  {
    title: "Settings",
    items: [{ label: "Site Settings", href: "/admin/settings", icon: Settings }],
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
        "/admin/inquiries": counts.unresolvedInquiryCount,
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-[#b38b4d]/20 bg-white/95 backdrop-blur-md transition-transform duration-300 lg:static lg:h-screen lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-px w-full shrink-0 bg-gradient-to-r from-transparent via-[#b38b4d]/40 to-transparent" />

        <div className="relative flex h-16 shrink-0 items-center justify-between border-b border-[#b38b4d]/20 px-5">
          <div className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-[#b38b4d]/10 blur-3xl" />
          <div className="relative flex-1 overflow-hidden">
            <p className="truncate text-base font-semibold tracking-wider text-[#1a1a1a]">Heena Marble</p>
            <p className="truncate text-base uppercase tracking-[0.2em] text-[#967440] font-bold">Admin Panel</p>
          </div>
          <button onClick={() => setMobileOpen(false)} className="relative p-1 text-[#1a1a1a]/50 hover:text-[#1a1a1a] lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-7 overflow-y-auto px-4 py-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-2">
              <p className="px-3 text-base font-bold uppercase tracking-[0.25em] text-[#967440]/70">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active =
                    item.href === "/admin" || item.href === "/admin/settings"
                      ? pathname === item.href
                      : pathname.startsWith(item.href);
                  const badgeCount = badges[item.href];
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`group relative flex items-center gap-3 rounded-xl border-l-2 px-3 py-2.5 text-base font-semibold tracking-wide transition-all duration-300 ${
                        active
                          ? "border-[#b38b4d] bg-gradient-to-r from-[#b38b4d]/12 to-transparent text-[#967440]"
                          : "border-transparent text-[#1a1a1a]/80 hover:border-[#b38b4d]/35 hover:bg-[#1a1a1a]/[0.04] hover:text-[#1a1a1a]"
                      }`}
                    >
                      <item.icon
                        className={`h-4 w-4 shrink-0 ${active ? "text-[#b38b4d]" : "text-[#1a1a1a]/60 group-hover:text-[#b38b4d]/80"}`}
                      />
                      <span className="flex-1">{item.label}</span>
                      {!!badgeCount && (
                        <span
                          className={`flex h-4.5 min-w-[1.125rem] items-center justify-center rounded-full px-1 text-base font-bold ${
                            active ? "bg-[#b38b4d]/25 text-[#967440]" : "bg-red-400/20 text-red-600 group-hover:bg-red-400/25"
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

        <div className="shrink-0 border-t border-[#b38b4d]/20 bg-[#b38b4d]/5 p-3">
          <div className="flex items-center gap-3 rounded-2xl border border-[#b38b4d]/20 bg-[#1a1a1a]/[0.04] p-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#b38b4d] text-base font-bold text-white">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-semibold text-[#1a1a1a]">{adminName}</p>
              <p className="truncate text-base uppercase tracking-widest text-[#967440]/70 font-semibold">Administrator</p>
            </div>
            <form action={adminLogout}>
              <button
                type="submit"
                title="Log out"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-red-400/30 bg-red-500/10 text-red-700 hover:bg-red-500/20"
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
