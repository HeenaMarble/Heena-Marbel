import { getReels } from "@/lib/actions/content-actions";
import AddReelForm from "@/components/admin/content/AddReelForm";
import ReelCard from "@/components/admin/content/ReelCard";
import { Film, ArrowUpDown, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Reels Showcase | Heena Marble Admin",
};

export default async function ReelsAdminPage() {
  let reels = [];
  try {
    reels = await getReels();
  } catch (err) {
    console.error("Failed to load reels:", err);
  }

  const featuredCount = reels.filter((r) => r.is_featured).length;

  return (
    <div className="space-y-6">
      <div className="border-b border-[#b38b4d]/20 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#1a1a1a]">
            Reels Showcase
          </h1>
          <p className="text-base text-[#1a1a1a]/60 mt-1">
            Manage Instagram reels, customize their display rank order, and choose which reels appear on the homepage showcase.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span>{featuredCount} Featured on Home</span>
          </div>
          <div className="bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <ArrowUpDown className="h-3.5 w-3.5 text-stone-500" />
            <span>{reels.length} Total Reels</span>
          </div>
        </div>
      </div>

      <AddReelForm />

      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-wider">
            Reels List & Order Ranking
          </h2>
          <span className="text-xs text-stone-400">
            Use ▲ ▼ buttons to change display order
          </span>
        </div>

        {!reels || reels.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#b38b4d]/30 bg-white/50 p-12 text-center">
            <Film className="mx-auto h-10 w-10 text-[#b38b4d]/30 mb-3" />
            <p className="text-base font-semibold text-[#1a1a1a]">
              No reels added yet
            </p>
            <p className="text-sm text-[#1a1a1a]/50 mt-1 max-w-sm mx-auto">
              Paste an Instagram reel link above to show it on the storefront and homepage.
            </p>
          </div>
        ) : (
          reels.map((reel, index) => (
            <ReelCard
              key={reel.id}
              reel={reel}
              index={index}
              totalCount={reels.length}
              isFirst={index === 0}
              isLast={index === reels.length - 1}
            />
          ))
        )}
      </div>
    </div>
  );
}
