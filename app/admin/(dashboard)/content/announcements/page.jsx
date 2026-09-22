import Link from "next/link";
import { PlusCircle, Megaphone, Info, ExternalLink } from "lucide-react";
import { getAnnouncements } from "@/lib/actions/content-actions";
import AnnouncementRowActions from "@/components/admin/content/AnnouncementRowActions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Announcements | Heena Marble Admin",
};

export default async function AnnouncementsPage() {
  let announcements = [];
  try {
    announcements = await getAnnouncements();
  } catch (err) {
    console.error("Failed to load announcements:", err);
  }

  const activeCount = announcements?.filter((a) => a.is_active).length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#b38b4d]/20 pb-6">
        <div>
          <h1 className="text-3xl font-semibold text-[#1a1a1a]">Announcements</h1>
          <p className="text-base text-[#1a1a1a]/50 mt-1">
            Manage top banner alert notifications displayed at the very top of the live website.
          </p>
        </div>
        <Link
          href="/admin/content/announcements/new"
          className="inline-flex items-center gap-2 rounded-full bg-[#b38b4d] hover:bg-[#967440] text-white font-semibold px-5 py-2.5 transition-colors self-start sm:self-auto shadow-sm"
        >
          <PlusCircle className="h-4 w-4" /> Add Announcement
        </Link>
      </div>

      {/* Helpful Context Note */}
      <div className="flex items-start gap-3 p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-xs text-emerald-950">
        <Info className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-emerald-900">
            Top Header Banner Guide
          </p>
          <p className="text-emerald-800/80 leading-relaxed">
            This module controls the thin banner strip at the top of the storefront. Only <strong>one</strong> announcement should typically be set to <strong>Active</strong> at a time. Currently active:{" "}
            <span className="font-bold underline">{activeCount} banner{activeCount === 1 ? "" : "s"}</span>.
          </p>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {!announcements || announcements.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#b38b4d]/30 bg-white/50 p-12 text-center">
            <Megaphone className="mx-auto h-10 w-10 text-[#b38b4d]/30 mb-3" />
            <p className="text-base font-semibold text-[#1a1a1a]">No announcements found</p>
            <p className="text-sm text-[#1a1a1a]/50 mt-1 max-w-sm mx-auto">
              Create an announcement to share sales, seasonal greetings, or showroom updates with visitors.
            </p>
            <div className="mt-5">
              <Link
                href="/admin/content/announcements/new"
                className="inline-flex items-center gap-2 rounded-full bg-[#b38b4d] text-white font-semibold px-5 py-2 text-sm hover:bg-[#967440] transition-colors"
              >
                <PlusCircle className="h-4 w-4" /> Add First Announcement
              </Link>
            </div>
          </div>
        ) : (
          announcements.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-[#b38b4d]/20 bg-white/90 p-5 shadow-sm transition-all hover:border-[#b38b4d]/40"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`inline-flex items-center text-xs font-semibold rounded-full px-2.5 py-0.5 ${
                        item.is_active
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {item.is_active ? "● Live on Site" : "Hidden"}
                    </span>
                    <span className="text-xs text-[#1a1a1a]/40">
                      Created: {new Date(item.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-[#1a1a1a] leading-relaxed mb-2">
                    {item.message}
                  </p>

                  {item.link_url && (
                    <div className="flex items-center gap-1.5 text-xs text-[#967440]">
                      <ExternalLink className="h-3 w-3" />
                      <span className="font-mono truncate max-w-md">{item.link_url}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="shrink-0 flex items-center gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                  <AnnouncementRowActions
                    id={item.id}
                    isActive={item.is_active}
                    message={item.message}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
