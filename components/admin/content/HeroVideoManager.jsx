"use client";

import { useState, useTransition } from "react";
import {
  Video,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  Sparkles,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import VideoUploader from "@/components/admin/VideoUploader";
import { updateHeroVideo } from "@/lib/actions/content-actions";

export default function HeroVideoManager({ initialVideoUrl = null }) {
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

  const handleSave = () => {
    if (!stagedVideo) return;
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("video_url", stagedVideo);

    startTransition(async () => {
      try {
        const res = await updateHeroVideo(formData);
        if (res?.error) {
          setErrorMessage(res.error);
        } else {
          setCurrentVideo(stagedVideo);
          setStagedVideo(null);
          setSuccessMessage("Homepage Hero video updated successfully!");
          setTimeout(() => setSuccessMessage(""), 5000);
        }
      } catch (err) {
        setErrorMessage(
          err?.message || "An unexpected error occurred while saving the video."
        );
      }
    });
  };

  return (
    <div className="space-y-8 max-w-5xl pb-16">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Current Live Hero Video Preview */}
        <div className="rounded-2xl border border-[#b38b4d]/20 bg-white/95 p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#b38b4d]/15 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#b38b4d]/10 text-[#b38b4d]">
                <Video className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#1a1a1a]">
                  Current Live Video
                </h2>
                <p className="text-xs text-[#1a1a1a]/50">
                  Currently active background video on the homepage.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Active
            </span>
          </div>

          <div className="space-y-3">
            <div className="relative rounded-xl overflow-hidden bg-black/90 aspect-video shadow-inner border border-[#b38b4d]/20">
              <video
                key={currentVideo}
                src={currentVideo}
                controls
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-[#1a1a1a]/60 bg-[#b38b4d]/5 px-3.5 py-2.5 rounded-xl border border-[#b38b4d]/15">
              <span className="truncate max-w-[280px] sm:max-w-xs font-mono">
                {currentVideo.startsWith("http")
                  ? currentVideo
                  : `${currentVideo} (Default Local Video)`}
              </span>
              {currentVideo.startsWith("http") && (
                <a
                  href={currentVideo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#b38b4d] hover:text-[#967440] inline-flex items-center gap-1 font-medium ml-2 shrink-0"
                >
                  Open <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Upload & Staged Preview Card */}
        <div className="rounded-2xl border border-[#b38b4d]/20 bg-white/95 p-6 sm:p-7 shadow-sm space-y-5">
          <div className="border-b border-[#b38b4d]/15 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#b38b4d]/10 text-[#b38b4d]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#1a1a1a]">
                  {stagedVideo ? "Review & Confirm" : "Upload New Video"}
                </h2>
                <p className="text-xs text-[#1a1a1a]/50">
                  {stagedVideo
                    ? "Preview the uploaded video before saving it to the live site."
                    : "Upload an MP4 or WebM video to replace the hero background."}
                </p>
              </div>
            </div>
            {stagedVideo && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                Pending Save
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
            <div className="space-y-5">
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
                <span className="text-amber-700 font-semibold shrink-0 ml-2">
                  Uploaded
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isPending}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#b38b4d] to-[#967440] text-white font-medium text-sm shadow-sm hover:opacity-95 transition-opacity disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Saving Video...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save & Apply to Hero
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDiscardStaged}
                  disabled={isPending}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#1a1a1a]/20 bg-white text-[#1a1a1a]/70 font-medium text-sm hover:bg-[#1a1a1a]/5 transition-colors disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                  Discard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
