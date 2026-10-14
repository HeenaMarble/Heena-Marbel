import { Film } from "lucide-react";
import CraftsmanshipVideoManager from "@/components/admin/content/CraftsmanshipVideoManager";
import { getCraftsmanshipVideos } from "@/lib/actions/content-actions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Journey Videos | Heena Marble Admin",
};

export default async function CraftsmanshipVideosPage() {
  let videos = [];
  let loadError = "";

  try {
    videos = await getCraftsmanshipVideos();
  } catch (error) {
    console.error("Failed to load craftsmanship videos:", error);
    loadError = "The saved video links could not be loaded. Local videos are shown as fallbacks.";
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="border-b border-[#b38b4d]/20 pb-6">
        <div className="mb-1 flex items-center gap-2">
          <span className="rounded-full bg-[#b38b4d]/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-[#b38b4d]">
            Fixed 6 Journey Steps
          </span>
        </div>
        <h1 className="text-3xl font-semibold text-[#1a1a1a]">Homepage Journey Videos</h1>
        <p className="mt-1 max-w-3xl text-base text-[#1a1a1a]/50">
          Replace the videos shown in &ldquo;From Quarry to Masterpiece.&rdquo; Uploads are stored in ImageKit,
          then published to the homepage when you save each card.
        </p>
      </div>

      {loadError && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <Film className="h-5 w-5 shrink-0" />
          {loadError}
        </div>
      )}

      <CraftsmanshipVideoManager videos={videos} />
    </div>
  );
}
