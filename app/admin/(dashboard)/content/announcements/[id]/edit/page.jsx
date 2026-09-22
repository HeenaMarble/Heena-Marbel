import { notFound } from "next/navigation";
import { getAnnouncements } from "@/lib/actions/content-actions";
import AnnouncementForm from "@/components/admin/content/AnnouncementForm";

export const metadata = {
  title: "Edit Announcement | Heena Marble Admin",
};

export default async function EditAnnouncementPage({ params }) {
  const { id } = await params;
  let announcement = null;

  try {
    const announcements = await getAnnouncements();
    announcement = announcements?.find((a) => String(a.id) === String(id));
  } catch (err) {
    console.error("Error fetching announcement:", err);
  }

  if (!announcement) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-[#b38b4d]/20 pb-6">
        <h1 className="text-3xl font-semibold text-[#1a1a1a]">Edit Announcement</h1>
        <p className="text-base text-[#1a1a1a]/50 mt-1">
          Update the announcement banner details below.
        </p>
      </div>

      <div className="mt-8">
        <AnnouncementForm initialData={announcement} />
      </div>
    </div>
  );
}
