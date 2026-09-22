import { getStats } from "@/lib/actions/content-actions";
import StatCard from "@/components/admin/content/StatCard";
import { BarChart3 } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Stats Counters | Heena Marble Admin",
};

export default async function StatsPage() {
  let stats = [];
  try {
    stats = await getStats();
  } catch (err) {
    console.error("Failed to load stats:", err);
  }

  return (
    <div className="space-y-6">
      {/* Header (No 'Add New' button as this module is fixed at 4 rows) */}
      <div className="border-b border-[#b38b4d]/20 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#b38b4d] bg-[#b38b4d]/10 rounded-full px-2.5 py-0.5">
            Fixed 4 Counters
          </span>
        </div>
        <h1 className="text-3xl font-semibold text-[#1a1a1a]">Statistics & Counters</h1>
        <p className="text-base text-[#1a1a1a]/50 mt-1">
          Manage the 4 key business metric counters highlighted across the storefront. Click &ldquo;Edit&rdquo; on any card to update its values.
        </p>
      </div>

      {/* Stats Grid */}
      {!stats || stats.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#b38b4d]/30 bg-white/50 p-12 text-center">
          <BarChart3 className="mx-auto h-10 w-10 text-[#b38b4d]/30 mb-3" />
          <p className="text-base font-semibold text-[#1a1a1a]">No stats found in database</p>
          <p className="text-sm text-[#1a1a1a]/50 mt-1 max-w-sm mx-auto">
            The 4 fixed stat rows are expected to be seeded in the Supabase &lsquo;stats&rsquo; table.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, index) => (
            <StatCard key={stat.id} stat={stat} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
