"use client";

import { useState } from "react";
import { MessageSquare, Clock, Check, Mail, Phone } from "lucide-react";
import InquiryRowActions from "@/components/admin/InquiryRowActions";

// Fixed locale + timezone so server render and browser render match (no hydration warning)
const dateFmt = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

export default function InquiriesPageClient({ inquiries }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const total = inquiries.length;
  const unresolved = inquiries.filter((i) => !i.is_resolved).length;
  const resolved = total - unresolved;

  const filtered =
    activeFilter === "new"
      ? inquiries.filter((i) => !i.is_resolved)
      : activeFilter === "resolved"
      ? inquiries.filter((i) => i.is_resolved)
      : inquiries;

  const tabs = [
    { key: "all", label: "All", count: total },
    { key: "new", label: "New", count: unresolved },
    { key: "resolved", label: "Resolved", count: resolved },
  ];

  const stats = [
    { label: "Total inquiries", value: total, Icon: MessageSquare, tint: "bg-[#b38b4d]/10 text-[#b38b4d]" },
    { label: "Unresolved", value: unresolved, Icon: Clock, tint: "bg-amber-100 text-amber-600" },
    { label: "Resolved", value: resolved, Icon: Check, tint: "bg-green-100 text-green-600" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="border-b border-[#b38b4d]/20 pb-6">
        <h1 className="text-3xl font-semibold text-[#1a1a1a]">Contact Inquiries</h1>
        <p className="text-base text-[#1a1a1a]/50 mt-1">
          Messages submitted through the Contact page.
        </p>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, Icon, tint }) => (
          <div
            key={label}
            className="rounded-2xl border border-[#b38b4d]/20 bg-white/85 p-5 shadow-sm flex items-center gap-4"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${tint}`}>
              <Icon className="h-[18px] w-[18px]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1a1a1a]">{value}</p>
              <p className="text-xs text-[#1a1a1a]/50 font-medium uppercase tracking-wide">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveFilter(t.key)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
              activeFilter === t.key
                ? "bg-[#b38b4d]/15 border-[#b38b4d]/40 text-[#1a1a1a]"
                : "border-[#e5e0d8] text-[#1a1a1a]/60 hover:bg-[#1a1a1a]/5"
            }`}
          >
            {t.label} <span className="opacity-60">({t.count})</span>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="mt-6 space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center py-12 text-[#1a1a1a]/50 font-semibold">
            {total === 0 ? "No inquiries yet." : "No inquiries in this view."}
          </p>
        ) : (
          filtered.map((i) => (
            <div key={i.id} className="rounded-2xl border border-[#b38b4d]/20 bg-white/85 p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-lg text-[#1a1a1a]">{i.name}</p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        i.is_resolved ? "bg-green-400/15 text-green-700" : "bg-amber-400/20 text-amber-700"
                      }`}
                    >
                      {i.is_resolved ? "Resolved" : "New"}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-[#b38b4d]">
                    <a href={`mailto:${i.email}`} className="inline-flex items-center gap-1.5 hover:underline">
                      <Mail className="h-4 w-4" /> {i.email}
                    </a>
                    {i.phone && (
                      <a href={`tel:${i.phone}`} className="inline-flex items-center gap-1.5 hover:underline">
                        <Phone className="h-4 w-4" /> {i.phone}
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-[#1a1a1a]/80 mt-3 whitespace-pre-wrap break-words">{i.message}</p>
                  <p className="text-xs text-[#1a1a1a]/40 mt-3">{dateFmt.format(new Date(i.created_at))}</p>
                </div>
                <div className="shrink-0">
                  <InquiryRowActions id={i.id} isResolved={i.is_resolved} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
