import { getHeroSettings } from "@/lib/actions/content-actions";
import HeroVideoManager from "@/components/admin/content/HeroVideoManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Hero Content | Heena Marble Admin",
};

export default async function HeroVideoPage() {
  let heroSettings = null;
  try {
    heroSettings = await getHeroSettings();
  } catch (err) {
    console.error("Failed to load hero settings:", err);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#b38b4d]/20 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#b38b4d] bg-[#b38b4d]/10 rounded-full px-2.5 py-0.5">
            Homepage Hero Content
          </span>
        </div>
        <h1 className="text-3xl font-semibold text-[#1a1a1a]">Hero Content</h1>
        <p className="text-base text-[#1a1a1a]/50 mt-1">
          Manage the hero title, description, and looping background video.
        </p>
      </div>

      {/* Hero Content Management Form & Previews */}
      <div className="mt-8">
        <HeroVideoManager
          initialVideoUrl={heroSettings?.video_url}
          initialTitle={heroSettings?.title}
          initialDescription={heroSettings?.description}
        />
      </div>
    </div>
  );
}
