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
  Settings,
  Star,
  AlertTriangle,
} from "lucide-react";
import { getDashboardStats } from "@/actions/admin/dashboard";

const QUICK_ACTIONS = [
  { label: "Add Product", href: "/admin/products/new", icon: PlusCircle },
  { label: "View Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "View Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  { label: "Home Customization", href: "/admin/hero-slides", icon: LayoutTemplate },
  { label: "Site Settings", href: "/admin/settings", icon: Settings },
];

const STATUS_STYLES = {
  pending: "bg-[#1a1a1a]/10 text-[#1a1a1a]/70",
  processing: "bg-[#b38b4d]/15 text-[#967440]",
  shipped: "bg-blue-400/15 text-blue-600",
  delivered: "bg-green-400/15 text-green-600",
  cancelled: "bg-red-400/15 text-red-600",
};

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Total Revenue", value: `₹${stats.revenue.toLocaleString("en-IN")}`, icon: IndianRupee },
    { label: "Total Orders", value: stats.orderCount, icon: ShoppingCart, sub: `${stats.pendingOrders} pending` },
    { label: "Products", value: stats.productCount, icon: Package },
    { label: "New Inquiries", value: stats.inquiryCount, icon: MessageSquare, sub: `${stats.unresolvedInquiryCount} unresolved` },
  ];

  return (
    <div>
      <div className="border-b border-[#b38b4d]/20 pb-6">
        <h1 className="text-3xl sm:text-4xl font-semibold text-[#1a1a1a]">
          Admin <span className="text-[#967440]">Dashboard</span>
        </h1>
        <p className="text-base text-[#1a1a1a]/50 font-medium mt-1">A snapshot of how the studio is doing.</p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl sm:rounded-[2rem] border border-[#b38b4d]/20 bg-white/85 p-4 sm:p-6 shadow-sm">
            <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-[#b38b4d]/10 text-[#967440] border border-[#b38b4d]/20">
              <c.icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <p className="mt-3 sm:mt-5 text-xs uppercase tracking-widest text-[#1a1a1a]/60 font-semibold truncate">{c.label}</p>
            <p className="mt-1 sm:mt-1.5 text-xl sm:text-3xl leading-none text-[#1a1a1a] font-semibold truncate">{c.value}</p>
            {c.sub && (
              <p className="mt-2 sm:mt-3 text-xs text-emerald-700 font-semibold bg-emerald-400/15 px-2.5 py-1 rounded-full w-fit border border-emerald-400/30 truncate">
                {c.sub}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[2rem] border border-[#b38b4d]/20 bg-white/85 p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#1a1a1a]">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {QUICK_ACTIONS.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-[#b38b4d]/20 bg-[#1a1a1a]/[0.04] px-3 py-5 text-center hover:border-[#b38b4d]/40 hover:bg-[#b38b4d]/5 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b38b4d]/10 text-[#967440] border border-[#b38b4d]/20">
                  <a.icon className="h-5 w-5" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-[#1a1a1a]/80">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#b38b4d]/20 bg-white/85 p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#1a1a1a]">Needs Attention</h2>
          <div className="space-y-3">
            <Link href="/admin/reviews" className="flex items-center justify-between gap-3 rounded-2xl border border-[#b38b4d]/20 bg-[#1a1a1a]/[0.04] px-4 py-3.5 hover:bg-[#b38b4d]/5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#b38b4d]/10 text-[#967440] border border-[#b38b4d]/20">
                  <Star className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold text-[#1a1a1a]/80">Reviews to approve</span>
              </div>
              <span className="rounded-full bg-[#b38b4d]/15 px-2.5 py-1 text-xs font-semibold text-[#967440] border border-[#b38b4d]/30">
                {stats.pendingReviewCount}
              </span>
            </Link>

            <Link href="/admin/inquiries" className="flex items-center justify-between gap-3 rounded-2xl border border-[#b38b4d]/20 bg-[#1a1a1a]/[0.04] px-4 py-3.5 hover:bg-blue-400/5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-400/10 text-blue-600 border border-blue-400/20">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold text-[#1a1a1a]/80">Unresolved inquiries</span>
              </div>
              <span className="rounded-full bg-blue-400/15 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-400/30">
                {stats.unresolvedInquiryCount}
              </span>
            </Link>

            <Link href="/admin/orders" className="flex items-center justify-between gap-3 rounded-2xl border border-[#b38b4d]/20 bg-[#1a1a1a]/[0.04] px-4 py-3.5 hover:bg-red-400/5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-400/10 text-red-600 border border-red-400/20">
                  <ShoppingCart className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold text-[#1a1a1a]/80">Orders pending</span>
              </div>
              <span className="rounded-full bg-red-400/15 px-2.5 py-1 text-xs font-semibold text-red-700 border border-red-400/30">
                {stats.pendingOrders}
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <div className="rounded-[2rem] border border-[#b38b4d]/20 bg-white/85 p-6 md:p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a1a]">Recent Orders</h2>
            <Link href="/admin/orders" className="flex items-center gap-1.5 text-xs font-semibold text-[#967440] uppercase tracking-wider">
              View all <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p className="py-12 text-center text-base font-semibold text-[#1a1a1a]/50">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-[#b38b4d]/10">
              {stats.recentOrders.map((o) => (
                <li key={o.id}>
                  <Link href={`/admin/orders/${o.id}`} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-2xl px-3 py-4 text-sm font-semibold hover:bg-[#1a1a1a]/[0.04]">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#b38b4d]/10 text-[#967440] border border-[#b38b4d]/20">
                        <ShoppingCart className="h-4.5 w-4.5" />
                      </div>
                      <span className="truncate font-semibold text-[#1a1a1a]">{o.order_number}</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                      <span className="text-[#1a1a1a]/80 font-semibold">₹{Number(o.total_amount).toLocaleString("en-IN")}</span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize sm:px-3 border border-[#b38b4d]/20 ${STATUS_STYLES[o.order_status] || ""}`}>
                        {o.order_status}
                      </span>
                      <ChevronRight className="hidden h-4 w-4 text-[#1a1a1a]/30 sm:block" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-[2rem] border border-[#b38b4d]/20 bg-white/85 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-400/10 text-blue-600 border border-blue-400/20">
                <MessageSquare className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-semibold text-[#1a1a1a]">Recent Inquiries</h2>
            </div>
            {stats.recentInquiries.length === 0 ? (
              <p className="py-4 text-center text-sm font-semibold text-[#1a1a1a]/50">No inquiries yet.</p>
            ) : (
              <ul className="space-y-3">
                {stats.recentInquiries.map((i) => (
                  <li key={i.id} className="rounded-2xl border border-blue-500/15 bg-blue-500/[0.03] px-4 py-3 text-sm font-semibold hover:bg-blue-500/[0.06]">
                    <p className="text-[#1a1a1a]/80">{i.name}</p>
                    <p className="text-xs text-[#1a1a1a]/50 font-medium truncate mt-0.5">{i.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-[2rem] border border-[#b38b4d]/20 bg-white/85 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-400/10 text-red-600 border border-red-400/20">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-semibold text-[#1a1a1a]">Low Stock</h2>
            </div>
            {stats.lowStock.length === 0 ? (
              <p className="py-4 text-center text-sm font-semibold text-[#1a1a1a]/50">Everything is well stocked.</p>
            ) : (
              <ul className="space-y-3">
                {stats.lowStock.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-4 rounded-2xl border border-red-500/15 bg-red-500/[0.03] px-4 py-3 text-sm font-semibold hover:bg-red-500/[0.06]">
                    <span className="truncate text-[#1a1a1a]/80">{p.name}</span>
                    <span className="shrink-0 rounded-full bg-red-400/15 px-3 py-1 text-xs font-semibold text-red-700 border border-red-400/30">
                      {p.stock_quantity} left
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
