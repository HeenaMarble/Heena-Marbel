"use client";

import { useState, useTransition } from "react";
import { PlusCircle, AlertCircle, Link2, Star } from "lucide-react";
import { createReel } from "@/lib/actions/content-actions";

export default function AddReelForm() {
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");
  const [isFeatured, setIsFeatured] = useState(true);
  const [displayOrder, setDisplayOrder] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Please paste an Instagram reel link.");
      return;
    }

    startTransition(async () => {
      try {
        await createReel({
          url: url.trim(),
          label: label.trim(),
          is_featured: isFeatured,
          display_order: displayOrder ? Number(displayOrder) : undefined,
        });
        setUrl("");
        setLabel("");
        setDisplayOrder("");
        setIsFeatured(true);
      } catch (err) {
        setError(err.message || "Failed to add reel.");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#b38b4d]/20 bg-white/95 p-5 md:p-6 shadow-sm space-y-4"
    >
      <div className="flex items-center justify-between border-b border-[#b38b4d]/10 pb-3">
        <h3 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-wider">
          Add New Instagram Reel
        </h3>
        <span className="text-xs text-stone-500">
          Auto-synced with Storefront & Homepage
        </span>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
        <div className="sm:col-span-6">
          <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">
            Instagram Reel Link <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Link2 className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
            <input
              type="text"
              required
              placeholder="https://www.instagram.com/reel/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-xl border border-[#e5e0d8] bg-white pl-10 pr-4 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
            />
          </div>
        </div>

        <div className="sm:col-span-4">
          <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">
            Label (optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Makrana Marble Carving"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full rounded-xl border border-[#e5e0d8] bg-white px-3.5 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={pending}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#b38b4d] hover:bg-[#967440] text-white font-semibold px-4 py-2.5 text-sm transition-colors disabled:opacity-60 shadow-sm whitespace-nowrap"
          >
            <PlusCircle className="h-4 w-4" /> {pending ? "Adding..." : "Add Reel"}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 text-xs text-stone-600">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="h-4 w-4 rounded text-[#b38b4d] border-stone-300 focus:ring-[#b38b4d] accent-[#b38b4d]"
          />
          <span className="flex items-center gap-1 font-medium text-stone-700">
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            Feature on Homepage (Option 1 Landing Page Showcase)
          </span>
        </label>

        <span className="text-[11px] text-stone-400">
          Rank will be auto-assigned to next position (can be reordered anytime)
        </span>
      </div>
    </form>
  );
}
