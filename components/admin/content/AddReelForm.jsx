"use client";

import { useState, useTransition } from "react";
import { PlusCircle, AlertCircle, Link2 } from "lucide-react";
import { createReel } from "@/lib/actions/content-actions";

export default function AddReelForm() {
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");
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
        await createReel({ url: url.trim(), label: label.trim() });
        setUrl("");
        setLabel("");
      } catch (err) {
        setError(err.message || "Failed to add reel.");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#b38b4d]/20 bg-white/90 p-5 md:p-6 shadow-sm space-y-4"
    >
      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_auto] gap-3 items-end">
        <div>
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

        <div>
          <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">
            Label (optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Temple Install"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full rounded-xl border border-[#e5e0d8] bg-white px-3.5 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#b38b4d] hover:bg-[#967440] text-white font-semibold px-5 py-2.5 text-sm transition-colors disabled:opacity-60 shadow-sm whitespace-nowrap"
        >
          <PlusCircle className="h-4 w-4" /> {pending ? "Adding..." : "Add Reel"}
        </button>
      </div>
    </form>
  );
}
