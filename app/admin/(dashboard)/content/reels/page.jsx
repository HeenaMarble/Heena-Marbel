import { getReels } from "@/lib/actions/content-actions";
import AddReelForm from "@/components/admin/content/AddReelForm";
import ReelCard from "@/components/admin/content/ReelCard";
import { Film } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Reels | Heena Marble Admin",
};

export default async function ReelsAdminPage() {
  let reels = [];
  try {
    reels = await getReels();
  } catch (err) {
    console.error("Failed to load reels:", err);
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-[#b38b4d]/20 pb-6">
        <h1 className="text-3xl font-semibold text-[#1a1a1a]">Reels</h1>
        <p className="text-base text-[#1a1a1a]/50 mt-1">
          Paste an Instagram reel link to show it on the storefront{" "}
          <code className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-600 text-sm">/reels</code>{" "}
          page. New reels are appended to the end of the list.
        </p>
      </div>

      <AddReelForm />

      <div className="space-y-3">
        {!reels || reels.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#b38b4d]/30 bg-white/50 p-12 text-center">
            <Film className="mx-auto h-10 w-10 text-[#b38b4d]/30 mb-3" />
            <p className="text-base font-semibold text-[#1a1a1a]">No reels added yet</p>
            <p className="text-sm text-[#1a1a1a]/50 mt-1 max-w-sm mx-auto">
              Paste an Instagram reel link above to show it on the storefront.
            </p>
          </div>
        ) : (
          reels.map((reel, index) => (
            <ReelCard key={reel.id} reel={reel} index={index} />
          ))
        )}
      </div>
    </div>
  );
}
