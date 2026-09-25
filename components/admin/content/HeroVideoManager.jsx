"use client";

import { useState, useTransition } from "react";
import {
  Video,
  Type,
  FileText,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Eye,
} from "lucide-react";
import VideoUploader from "@/components/admin/VideoUploader";
import { updateHeroSettings } from "@/lib/actions/content-actions";

const DEFAULT_TITLE = "HEENA MARBLE";
const DEFAULT_DESCRIPTION =
  "We create masterpieces in marble with precision, passion and perfection. From temples to homes, we bring tradition and craftsmanship to life.";

export default function HeroVideoManager({
  initialVideoUrl = null,
  initialTitle = "",
  initialDescription = "",
}) {
  const [title, setTitle] = useState(initialTitle || "");
  const [description, setDescription] = useState(initialDescription || "");
  const [currentVideo, setCurrentVideo] = useState(
    initialVideoUrl || "/hero-bg.mp4"
  );
  const [stagedVideo, setStagedVideo] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUploadComplete = (url) => {
    setStagedVideo(url);
    setErrorMessage("");
  };

  const handleDiscardStaged = () => {
    setStagedVideo(null);
    setErrorMessage("");
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const videoToSave = stagedVideo || currentVideo;

    startTransition(async () => {
      try {
        const res = await updateHeroSettings({
          video_url: videoToSave,
          title: title.trim(),
          description: description.trim(),
        });

        if (res?.error) {
          setErrorMessage(res.error);
        } else {
          if (stagedVideo) {
            setCurrentVideo(stagedVideo);
            setStagedVideo(null);
          }
          setSuccessMessage("Homepage hero content updated successfully!");
          setTimeout(() => setSuccessMessage(""), 5000);
        }
      } catch (err) {
        setErrorMessage(
          err?.message || "An unexpected error occurred while saving hero content."
        );
      }
    });
  };

  const activeVideo = stagedVideo || currentVideo;
  const previewTitle = title.trim() || DEFAULT_TITLE;
  const previewDescription = description.trim() || DEFAULT_DESCRIPTION;

  return (
    <div className="space-y-8 max-w-6xl pb-16">
      {/* Toast / Notification feedback */}
      {successMessage && (
        <div className="flex items-center gap-3 text-sm text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-2xl p-4 shadow-sm animate-in fade-in duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-3 text-sm text-red-800 bg-red-50 border border-red-300 rounded-2xl p-4 shadow-sm animate-in fade-in duration-200">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs & Video Uploader Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Text Content Section */}
          <div className="rounded-2xl border border-[#b38b4d]/20 bg-white/95 p-6 sm:p-7 shadow-sm space-y-5">
            <div className="border-b border-[#b38b4d]/15 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#b38b4d]/10 text-[#b38b4d]">
                  <Type className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[#1a1a1a]">
                    Hero Text Content
                  </h2>
                  <p className="text-xs text-[#1a1a1a]/50">
                    Edit the main title and description shown on the hero banner.
                  </p>
                </div>
              </div>
            </div>

            {/* Title Field */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-[#1a1a1a]">
                Hero Title (H1)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="HEENA MARBLE"
                disabled={isPending}
                className="w-full rounded-xl border border-[#e5e0d8] bg-white px-4 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d] disabled:opacity-50"
              />
              <p className="text-xs text-[#1a1a1a]/45">
                Default fallback if left empty: <strong>HEENA MARBLE</strong>
              </p>
            </div>

            {/* Description Field */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-[#1a1a1a]">
                Hero Description Paragraph
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="We create masterpieces in marble with precision, passion and perfection..."
                disabled={isPending}
                className="w-full rounded-xl border border-[#e5e0d8] bg-white px-4 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d] disabled:opacity-50 leading-relaxed"
              />
              <p className="text-xs text-[#1a1a1a]/45">
                Default fallback if left empty: <em>&ldquo;We create masterpieces in marble with precision, passion and perfection...&rdquo;</em>
              </p>
            </div>
          </div>

          {/* Video Media Section */}
          <div className="rounded-2xl border border-[#b38b4d]/20 bg-white/95 p-6 sm:p-7 shadow-sm space-y-5">
            <div className="border-b border-[#b38b4d]/15 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#b38b4d]/10 text-[#b38b4d]">
                  <Video className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[#1a1a1a]">
                    Hero Background Video
                  </h2>
                  <p className="text-xs text-[#1a1a1a]/50">
                    Upload an MP4 or WebM video to update the background.
                  </p>
                </div>
              </div>
              {stagedVideo && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                  New Video Staged
                </span>
              )}
            </div>

            {!stagedVideo ? (
              <div className="space-y-4">
                <VideoUploader
                  onUploadComplete={handleUploadComplete}
                  folder="/heena-marble/hero"
                  disabled={isPending}
                />
                <div className="p-4 rounded-xl bg-[#b38b4d]/5 border border-[#b38b4d]/15 text-xs text-[#1a1a1a]/60 space-y-1">
                  <p className="font-semibold text-[#1a1a1a]">Best practices for hero background videos:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-1">
                    <li>Use 1080p (1920x1080) or 720p resolution for fast loading</li>
                    <li>Keep duration between 10 to 30 seconds for smooth looping</li>
                    <li>Muted audio track or no audio channel is ideal</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden bg-black/90 aspect-video shadow-inner border-2 border-[#b38b4d]">
                  <video
                    key={stagedVideo}
                    src={stagedVideo}
                    controls
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-[#1a1a1a]/60 bg-amber-50/60 px-3.5 py-2.5 rounded-xl border border-amber-200">
                  <span className="truncate max-w-[280px] sm:max-w-xs font-mono">
                    {stagedVideo}
                  </span>
                  <button
                    type="button"
                    onClick={handleDiscardStaged}
                    disabled={isPending}
                    className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 ml-2 shrink-0"
                  >
                    <X className="h-3.5 w-3.5" /> Discard Video
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Unified Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#b38b4d] to-[#967440] text-white font-medium text-sm shadow-md hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Saving Hero Content...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save & Apply Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Preview Card Column */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-6">
          <div className="rounded-2xl border border-[#b38b4d]/20 bg-white/95 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#b38b4d]/15 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#b38b4d]/10 text-[#b38b4d]">
                  <Eye className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[#1a1a1a]">
                    Live Preview
                  </h2>
                  <p className="text-xs text-[#1a1a1a]/50">
                    Real-time storefront presentation
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                {stagedVideo ? "Staged" : "Live"}
              </span>
            </div>

            {/* Visual Hero Mockup */}
            <div className="relative rounded-xl overflow-hidden bg-stone-900 border border-[#b38b4d]/30 aspect-[4/3] flex flex-col justify-center items-center text-center p-6 text-white shadow-inner">
              {/* Background Video */}
              <video
                key={activeVideo}
                src={activeVideo}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-45 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/70 pointer-events-none" />

              {/* Overlay Content */}
              <div className="relative z-10 space-y-2.5 max-w-sm">
                <span className="text-[10px] tracking-[0.2em] font-semibold text-[#c8a97e] uppercase block">
                  CRAFTING TIMELESS BEAUTY IN MARBLE
                </span>
                <h3 className="text-xl font-bold tracking-wider text-white font-serif uppercase break-words">
                  {previewTitle}
                </h3>
                <div className="flex items-center justify-center gap-2 py-0.5">
                  <span className="h-[1px] w-6 bg-[#c8a97e]/60" />
                  <span className="text-[9px] tracking-widest text-[#c8a97e] uppercase font-semibold">
                    MAKRANA RAJASTHAN
                  </span>
                  <span className="h-[1px] w-6 bg-[#c8a97e]/60" />
                </div>
                <p className="text-[11px] text-stone-200/90 leading-relaxed line-clamp-4 px-2">
                  {previewDescription}
                </p>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <span className="text-[10px] px-3 py-1 rounded bg-[#b38b4d] text-white font-medium shadow-sm">
                    Get a Free Quote
                  </span>
                  <span className="text-[10px] px-3 py-1 rounded border border-white/40 text-white font-medium">
                    View Our Work
                  </span>
                </div>
              </div>
            </div>

            {/* Video Details */}
            <div className="flex items-center justify-between text-xs text-[#1a1a1a]/60 bg-[#b38b4d]/5 px-3.5 py-2.5 rounded-xl border border-[#b38b4d]/15">
              <span className="truncate max-w-[200px] font-mono">
                {activeVideo.startsWith("http")
                  ? activeVideo
                  : `${activeVideo} (Default)`}
              </span>
              {activeVideo.startsWith("http") && (
                <a
                  href={activeVideo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#b38b4d] hover:text-[#967440] inline-flex items-center gap-1 font-medium shrink-0"
                >
                  Open <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
