"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import ReviewRowActions from "@/components/admin/ReviewRowActions";

export default function ReviewsPageClient({ reviews }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const total = reviews.length;
  const pending = reviews.filter((r) => !r.is_approved).length;
  const approved = reviews.filter((r) => r.is_approved).length;
  const avgRating =
    approved > 0
      ? (
          reviews
            .filter((r) => r.is_approved)
            .reduce((sum, r) => sum + r.rating, 0) / approved
        ).toFixed(1)
      : "—";

  const filtered =
    activeFilter === "all"
      ? reviews
      : activeFilter === "pending"
      ? reviews.filter((r) => !r.is_approved)
      : reviews.filter((r) => r.is_approved);

  const tabs = [
    { key: "all", label: "All", count: total },
    { key: "pending", label: "Pending", count: pending },
    { key: "approved", label: "Approved", count: approved },
  ];

  return (
    <div>
      {/* Header */}
      <div className="border-b border-[#b38b4d]/20 pb-6">
        <h1 className="text-3xl font-semibold text-[#1a1a1a]">Customer Reviews</h1>
        <p className="text-base text-[#1a1a1a]/50 mt-1">
          Approve reviews before they appear on product pages.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[#b38b4d]/20 bg-white/85 p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#b38b4d]/10 flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b38b4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#1a1a1a]">{total}</p>
            <p className="text-xs text-[#1a1a1a]/50 font-medium uppercase tracking-wide">Total Reviews</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#b38b4d]/20 bg-white/85 p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#1a1a1a]">{pending}</p>
            <p className="text-xs text-[#1a1a1a]/50 font-medium uppercase tracking-wide">Pending</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#b38b4d]/20 bg-white/85 p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#1a1a1a]">{approved}</p>
            <p className="text-xs text-[#1a1a1a]/50 font-medium uppercase tracking-wide">Approved</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#b38b4d]/20 bg-white/85 p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#b38b4d]/10 flex items-center justify-center flex-shrink-0">
            <Star className="h-4 w-4 text-[#b38b4d]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#1a1a1a]">{avgRating}</p>
            <p className="text-xs text-[#1a1a1a]/50 font-medium uppercase tracking-wide">Avg Rating</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mt-6 flex gap-2 border-b border-[#b38b4d]/15 pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors border-b-2 ${
              activeFilter === tab.key
                ? "border-[#b38b4d] text-[#b38b4d]"
                : "border-transparent text-[#1a1a1a]/50 hover:text-[#1a1a1a]"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className={`ml-2 text-xs rounded-full px-2 py-0.5 ${
                  activeFilter === tab.key
                    ? "bg-[#b38b4d]/15 text-[#b38b4d]"
                    : "bg-[#1a1a1a]/8 text-[#1a1a1a]/50"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="mt-6 space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center py-12 text-[#1a1a1a]/50 font-semibold">
            No {activeFilter === "all" ? "" : activeFilter} reviews.
          </p>
        ) : (
          filtered.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-[#b38b4d]/20 bg-white/85 p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < r.rating
                            ? "fill-[#b38b4d] text-[#b38b4d]"
                            : "text-[#1a1a1a]/20"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-xs font-semibold text-[#1a1a1a]/50">
                      {r.customers?.name || "Anonymous"} on{" "}
                      {r.products?.name || "a product"}
                    </span>
                  </div>
                  <p className="text-sm text-[#1a1a1a]/80">{r.comment}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      r.is_approved
                        ? "bg-green-400/15 text-green-700"
                        : "bg-amber-400/15 text-amber-700"
                    }`}
                  >
                    {r.is_approved ? "Approved" : "Pending"}
                  </span>
                  <ReviewRowActions id={r.id} isApproved={r.is_approved} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
