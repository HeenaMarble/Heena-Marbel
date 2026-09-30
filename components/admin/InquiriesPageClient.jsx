"use client";

import { useState, useTransition, useEffect } from "react";
import {
  MessageSquare,
  Clock,
  Check,
  Mail,
  Phone,
  Eye,
  Trash2,
  RotateCcw,
  X,
  Copy,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { toggleInquiryResolved, deleteInquiry } from "@/actions/inquiries";

// Fixed locale + timezone so server render and browser render match
const dateFmt = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

export default function InquiriesPageClient({ inquiries }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [pending, startTransition] = useTransition();

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
    { key: "all", label: "All Inquiries", count: total },
    { key: "new", label: "New & Unresolved", count: unresolved },
    { key: "resolved", label: "Resolved", count: resolved },
  ];

  const stats = [
    { label: "Total inquiries", value: total, Icon: MessageSquare, tint: "bg-[#b38b4d]/10 text-[#b38b4d]" },
    { label: "Unresolved", value: unresolved, Icon: Clock, tint: "bg-amber-100 text-amber-600" },
    { label: "Resolved", value: resolved, Icon: Check, tint: "bg-emerald-100 text-emerald-600" },
  ];

  // Keep selectedInquiry in sync if list updates
  useEffect(() => {
    if (selectedInquiry) {
      const updated = inquiries.find((i) => i.id === selectedInquiry.id);
      if (updated) {
        setSelectedInquiry(updated);
      } else {
        setSelectedInquiry(null);
      }
    }
  }, [inquiries]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedInquiry(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCopy = (text, field) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleToggleResolve = (id, currentStatus) => {
    startTransition(() => {
      toggleInquiryResolved(id, !currentStatus);
    });
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to permanently delete this inquiry?")) {
      startTransition(() => {
        deleteInquiry(id);
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(null);
        }
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-[#b38b4d]/20 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">Client Inquiries</h1>
        <p className="text-sm text-[#777777] mt-1">
          Manage and review customer quote requests and contact messages. Click any inquiry to inspect details in full view.
        </p>
      </div>

      {/* 3 Stats Overview Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, Icon, tint }) => (
          <div
            key={label}
            className="rounded-2xl border border-[#b38b4d]/20 bg-white p-5 shadow-sm flex items-center gap-4 transition-all hover:border-[#b38b4d]/40"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${tint}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1a1a1a] tracking-tight">{value}</p>
              <p className="text-xs text-[#888888] font-bold uppercase tracking-wider mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveFilter(t.key)}
              className={`rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                activeFilter === t.key
                  ? "bg-[#b38b4d] text-white shadow-sm shadow-[#b38b4d]/30"
                  : "bg-white border border-[#e5e0d8] text-[#666666] hover:bg-[#fcfbf9] hover:text-[#1a1a1a]"
              }`}
            >
              {t.label} <span className={activeFilter === t.key ? "text-white/80" : "text-[#999999]"}>({t.count})</span>
            </button>
          ))}
        </div>
        <span className="text-xs font-semibold text-[#888888]">
          Showing {filtered.length} of {total} messages
        </span>
      </div>

      {/* Inquiries Compact List View */}
      <div className="mt-5 space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#b38b4d]/30 bg-white p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-[#b38b4d]/10 text-[#967440] flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1a1a1a]">No Inquiries Found</h3>
            <p className="text-xs text-[#777777] mt-1 max-w-sm mx-auto">
              {total === 0
                ? "No client inquiries have been submitted yet. New consultation requests will appear here."
                : "There are no inquiries matching your selected filter tab."}
            </p>
          </div>
        ) : (
          filtered.map((i) => (
            <div
              key={i.id}
              className={`group rounded-xl border bg-white p-4 sm:p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#b38b4d]/50 ${
                i.is_resolved ? "border-[#e5e0d8] bg-[#fcfbf9]/60" : "border-[#b38b4d]/25 bg-white"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Left Side: Clickable Inquiry Summary */}
                <div
                  className="min-w-0 flex-1 cursor-pointer"
                  onClick={() => setSelectedInquiry(i)}
                  title="Click to view full message"
                >
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-bold text-base text-[#1a1a1a] group-hover:text-[#967440] transition-colors truncate">
                      {i.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        i.is_resolved
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {i.is_resolved ? "Resolved" : "New"}
                    </span>
                    <span className="text-xs text-[#888888] font-medium ml-auto sm:ml-0">
                      {dateFmt.format(new Date(i.created_at))}
                    </span>
                  </div>

                  {/* Contact Badges */}
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#967440] font-medium">
                    <span className="inline-flex items-center gap-1 hover:underline">
                      <Mail className="h-3.5 w-3.5" /> {i.email}
                    </span>
                    {i.phone && (
                      <span className="inline-flex items-center gap-1 hover:underline">
                        <Phone className="h-3.5 w-3.5" /> {i.phone}
                      </span>
                    )}
                  </div>

                  {/* Message 2-Line Truncated Preview */}
                  <p className="text-sm text-[#444444] mt-2.5 line-clamp-2 leading-relaxed bg-[#fcfbf9] rounded-lg p-2.5 border border-[#f0ece5]">
                    {i.message}
                  </p>
                </div>

                {/* Right Side Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-start shrink-0 pt-1">
                  <button
                    onClick={() => setSelectedInquiry(i)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#967440] bg-[#b38b4d]/10 hover:bg-[#b38b4d] hover:text-white border border-[#b38b4d]/30 rounded-lg px-3 py-1.5 transition-all"
                    title="Open Full Inquiry Modal"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View</span>
                  </button>

                  <button
                    onClick={() => handleToggleResolve(i.id, i.is_resolved)}
                    disabled={pending}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold rounded-lg px-3 py-1.5 border transition-all disabled:opacity-50 ${
                      i.is_resolved
                        ? "text-[#666666] border-[#e5e0d8] hover:bg-[#f3f4f6]"
                        : "text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                    }`}
                    title={i.is_resolved ? "Mark as New / Reopen" : "Mark as Resolved"}
                  >
                    {i.is_resolved ? (
                      <>
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Reopen</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Resolve</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(i.id)}
                    disabled={pending}
                    className="inline-flex items-center justify-center text-xs font-bold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 rounded-lg p-1.5 sm:px-2.5 sm:py-1.5 transition-all disabled:opacity-50"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ========================================================
          CLICK TO VIEW FULL INQUIRY MODAL DIALOG
          ======================================================== */}
      {selectedInquiry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedInquiry(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-inquiry-title"
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#b38b4d]/30 overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Gold Accent Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#b38b4d] via-[#dfc581] to-[#967440] shrink-0" />

            {/* Modal Header */}
            <div className="flex items-start justify-between p-5 sm:p-6 border-b border-[#f0ece5] bg-[#fcfbf9]">
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-3">
                  <h2 id="modal-inquiry-title" className="text-xl sm:text-2xl font-bold text-[#1a1a1a] truncate">
                    {selectedInquiry.name}
                  </h2>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      selectedInquiry.is_resolved
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {selectedInquiry.is_resolved ? "Resolved" : "New Quote Request"}
                  </span>
                </div>
                <p className="text-xs text-[#777777] font-medium mt-1">
                  Received on {dateFmt.format(new Date(selectedInquiry.created_at))}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="w-9 h-9 rounded-xl border border-[#e5e0d8] bg-white text-[#666666] hover:text-[#1a1a1a] hover:bg-[#f5f5f5] flex items-center justify-center transition-all shrink-0"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
              {/* Contact Information Desk */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Email Box */}
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#b38b4d]/20 bg-[#fcfbf9]">
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] font-bold text-[#967440] uppercase tracking-wider block">Email Address</span>
                    <a
                      href={`mailto:${selectedInquiry.email}`}
                      className="text-sm font-semibold text-[#1a1a1a] hover:text-[#967440] truncate block mt-0.5"
                    >
                      {selectedInquiry.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleCopy(selectedInquiry.email, "email")}
                      className="p-1.5 rounded-lg text-[#777777] hover:text-[#1a1a1a] hover:bg-white border border-transparent hover:border-[#e5e0d8] transition-all"
                      title="Copy Email"
                    >
                      {copiedField === "email" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <a
                      href={`mailto:${selectedInquiry.email}`}
                      className="p-1.5 rounded-lg text-[#967440] hover:bg-[#b38b4d]/10 transition-all"
                      title="Send Email"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Phone Box */}
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#b38b4d]/20 bg-[#fcfbf9]">
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] font-bold text-[#967440] uppercase tracking-wider block">Phone Number</span>
                    {selectedInquiry.phone ? (
                      <a
                        href={`tel:${selectedInquiry.phone}`}
                        className="text-sm font-semibold text-[#1a1a1a] hover:text-[#967440] truncate block mt-0.5"
                      >
                        {selectedInquiry.phone}
                      </a>
                    ) : (
                      <span className="text-xs text-[#888888] font-medium block mt-0.5">Not provided</span>
                    )}
                  </div>
                  {selectedInquiry.phone && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleCopy(selectedInquiry.phone, "phone")}
                        className="p-1.5 rounded-lg text-[#777777] hover:text-[#1a1a1a] hover:bg-white border border-transparent hover:border-[#e5e0d8] transition-all"
                        title="Copy Phone"
                      >
                        {copiedField === "phone" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <a
                        href={`tel:${selectedInquiry.phone}`}
                        className="p-1.5 rounded-lg text-[#967440] hover:bg-[#b38b4d]/10 transition-all"
                        title="Call Customer"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Inquiry Message Text Card */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#967440] uppercase tracking-wider">
                    Full Client Message
                  </label>
                  <button
                    onClick={() => handleCopy(selectedInquiry.message, "message")}
                    className="text-xs font-semibold text-[#777777] hover:text-[#1a1a1a] inline-flex items-center gap-1"
                  >
                    {copiedField === "message" ? (
                      <span className="text-emerald-600 font-bold">✓ Copied to clipboard</span>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy message</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="rounded-xl border border-[#e5e0d8] bg-[#fcfbf9] p-4 text-sm text-[#1a1a1a] whitespace-pre-wrap break-words leading-relaxed font-normal min-h-[140px] max-h-[300px] overflow-y-auto select-text">
                  {selectedInquiry.message}
                </div>
              </div>
            </div>

            {/* Modal Bottom Action Footer */}
            <div className="p-4 sm:p-5 border-t border-[#f0ece5] bg-[#fcfbf9] flex flex-wrap items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => handleDelete(selectedInquiry.id)}
                disabled={pending}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 rounded-xl px-4 py-2.5 transition-all disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Inquiry</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#e5e0d8] text-xs sm:text-sm font-bold text-[#666666] hover:bg-[#f3f4f6] transition-all"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleResolve(selectedInquiry.id, selectedInquiry.is_resolved)}
                  disabled={pending}
                  className={`inline-flex items-center gap-2 text-xs sm:text-sm font-bold rounded-xl px-5 py-2.5 transition-all shadow-sm disabled:opacity-50 ${
                    selectedInquiry.is_resolved
                      ? "bg-white border border-[#b38b4d] text-[#967440] hover:bg-[#b38b4d]/10"
                      : "bg-[#b38b4d] text-white hover:bg-[#967440] shadow-[#b38b4d]/25"
                  }`}
                >
                  {selectedInquiry.is_resolved ? (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      <span>Mark as Unresolved</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Mark as Resolved</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
