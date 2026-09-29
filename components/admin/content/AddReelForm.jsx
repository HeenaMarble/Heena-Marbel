"use client";

import { useState, useTransition } from "react";
import { PlusCircle, AlertCircle, Star, Video, Check } from "lucide-react";
import { createReel } from "@/lib/actions/content-actions";
import VideoUploader from "@/components/admin/VideoUploader";

export default function AddReelForm() {
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");
  const [isFeatured, setIsFeatured] = useState(true);
  const [displayOrder, setDisplayOrder] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  function handleVideoUploaded(videoUrl) {
    setUrl(videoUrl);
    setUploadSuccess(true);
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Please select and upload a video file first.");
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
        setUploadSuccess(false);
      } catch (err) {
        setError(err.message || "Failed to add reel.");
      }
    });
  }

  return (
    <div className="rounded-2xl border border-[#b38b4d]/20 bg-white/95 p-5 md:p-6 shadow-sm space-y-5">
      <div className="border-b border-[#b38b4d]/10 pb-3">
        <h3 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-wider flex items-center gap-2">
          <Video className="h-4 w-4 text-[#b38b4d]" />
          Upload New Reel Video
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Videos are hosted on ImageKit CDN and play in pure fullscreen mode with zero clutter.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {/* Video Uploader (ImageKit direct upload) */}
      <div className="space-y-4">
        <VideoUploader
          folder="/heena-marble/reels"
          onUploadComplete={handleVideoUploaded}
          disabled={pending}
        />

        {url && (
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800">
            <div className="w-24 h-36 shrink-0 rounded-xl overflow-hidden bg-black border border-emerald-300 shadow-sm">
              <video
                src={url}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-sm">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Video Uploaded Successfully!</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                Ready to be published on the storefront and homepage reels showcase.
              </p>
              <div className="font-mono text-[11px] text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-lg truncate mt-1">
                {url}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Details Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-8">
            <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">
              Reel Title / Label (e.g. Makrana Marble Temple Carving)
            </label>
            <input
              type="text"
              placeholder="e.g. Luxury Mandir CNC Carving"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full rounded-xl border border-[#e5e0d8] bg-white px-3.5 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
            />
          </div>

          <div className="sm:col-span-4">
            <button
              type="submit"
              disabled={pending || !url.trim()}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#b38b4d] hover:bg-[#967440] text-white font-semibold px-4 py-2.5 text-sm transition-colors disabled:opacity-50 shadow-sm whitespace-nowrap cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" /> {pending ? "Saving..." : "Save & Publish Reel"}
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
              Feature on Homepage (Landing Page Showcase)
            </span>
          </label>

          <span className="text-[11px] text-stone-400">
            Display rank will auto-assign to end (reorder anytime using ▲/▼ buttons)
          </span>
        </div>
      </form>
    </div>
  );
}
