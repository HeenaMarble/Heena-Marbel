import AnnouncementForm from "@/components/admin/content/AnnouncementForm";

export const metadata = {
  title: "Add Announcement | Heena Marble Admin",
};

export default function NewAnnouncementPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-[#b38b4d]/20 pb-6">
        <h1 className="text-3xl font-semibold text-[#1a1a1a]">Add Announcement</h1>
        <p className="text-base text-[#1a1a1a]/50 mt-1">
          Create a new notification banner for your storefront.
        </p>
      </div>

      <div className="mt-8">
        <AnnouncementForm />
      </div>
    </div>
  );
}
