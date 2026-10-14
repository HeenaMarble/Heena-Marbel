"use client";

import { useState, useTransition } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Save,
  Video,
  X,
} from "lucide-react";
import VideoUploader from "@/components/admin/VideoUploader";
import { updateCraftsmanshipVideo } from "@/lib/actions/content-actions";

const CRAFTSMANSHIP_STEPS = [
  {
    order: 1,
    label: "The Origin",
    title: "Marble Extraction",
    fallback: "/Steps_involved/0 To 25Sec.mp4",
  },
  {
    order: 2,
    label: "First Form",
    title: "Marble Cutting",
    fallback: "/Steps_involved/2 ; 23Min To 4.19Min.mp4",
  },
  {
    order: 3,
    label: "Artisan Detail",
    title: "Marble Carving",
    fallback: "/Steps_involved/4 ; 57Min To 5.1Min.mp4",
  },
  {
    order: 4,
    label: "Modern Precision",
    title: "Marble CNC Work",
    fallback: "/Steps_involved/5 ; 09Min To 5.29Min.mp4",
  },
  {
    order: 5,
    label: "Perfect Placement",
    title: "Marble Installation",
    fallback: "/Steps_involved/5 ; 53Min To 6.50Min.mp4",
  },
  {
    order: 6,
    label: "The Masterpiece",
    title: "Completion",
    fallback: "/Steps_involved/7 ; 33Min To 8.25Min.mp4",
  },
];

function CraftsmanshipVideoCard({ step, savedVideo }) {
  const [currentUrl, setCurrentUrl] = useState(savedVideo?.url || step.fallback);
  const [stagedUrl, setStagedUrl] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const previewUrl = stagedUrl || currentUrl;
  const usesImageKit = currentUrl.startsWith("http");

  function handleUploadComplete(url) {
    setStagedUrl(url);
    setMessage("");
    setError("");
  }

  function handleSave() {
    if (!stagedUrl) return;

    setMessage("");
    setError("");
    startTransition(async () => {
      try {
        await updateCraftsmanshipVideo(step.order, {
          url: stagedUrl,
          label: step.title,
        });
        setCurrentUrl(stagedUrl);
        setStagedUrl("");
        setMessage("Video saved and published to the homepage.");
      } catch (saveError) {
        setError(saveError?.message || "Unable to save this video.");
      }
    });
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-[#b38b4d]/20 bg-white shadow-sm">
      <div className="relative aspect-video bg-stone-950">
        <video
          key={previewUrl}
          src={previewUrl}
          controls
          preload="metadata"
          playsInline
          className="h-full w-full object-contain"
        />
        <span className="absolute left-3 top-3 rounded-full bg-[#123a31] px-2.5 py-1 text-xs font-semibold text-white shadow">
          {String(step.order).padStart(2, "0")}
        </span>
        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow ${
            stagedUrl
              ? "bg-amber-100 text-amber-800"
              : usesImageKit
                ? "bg-emerald-100 text-emerald-800"
                : "bg-white text-stone-700"
          }`}
        >
          {stagedUrl ? "New upload staged" : usesImageKit ? "ImageKit live" : "Local fallback"}
        </span>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b7336]">
            {step.label}
          </p>
          <h2 className="mt-1 text-xl font-semibold text-[#17342e]">{step.title}</h2>
          <p className="mt-1 text-sm text-[#1a1a1a]/50">
            Homepage journey step {step.order} of 6
          </p>
        </div>

        <VideoUploader
          onUploadComplete={handleUploadComplete}
          folder="/heena-marble/craftsmanship"
          disabled={isPending}
          maxSizeMb={100}
        />

        {stagedUrl && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs text-amber-900">
            <span className="min-w-0 truncate font-mono">{stagedUrl}</span>
            <button
              type="button"
              onClick={() => setStagedUrl("")}
              disabled={isPending}
              className="inline-flex shrink-0 items-center gap-1 font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              <X className="h-3.5 w-3.5" /> Discard
            </button>
          </div>
        )}

        {message && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800">
            <CheckCircle2 className="h-4 w-4 shrink-0" /> {message}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-[#b38b4d]/15 pt-4 sm:flex-row sm:items-center sm:justify-between">
          {currentUrl.startsWith("http") ? (
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9b7336] hover:text-[#765425]"
            >
              Open current video <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : (
            <span className="text-xs text-[#1a1a1a]/45">
              Upload once to move this local video to ImageKit.
            </span>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={!stagedUrl || isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#b38b4d] to-[#967440] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isPending ? "Saving..." : "Save video"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function CraftsmanshipVideoManager({ videos }) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      {CRAFTSMANSHIP_STEPS.map((step) => (
        <CraftsmanshipVideoCard
          key={step.order}
          step={step}
          savedVideo={videos.find((video) => Number(video.display_order) === step.order)}
        />
      ))}
    </div>
  );
}
