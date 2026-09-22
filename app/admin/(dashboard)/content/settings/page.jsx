import { getSiteSettings } from "@/lib/actions/content-actions";
import SiteSettingsForm from "@/components/admin/content/SiteSettingsForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Site Settings | Heena Marble Admin",
};

export default async function SiteSettingsPage() {
  let settings = null;
  try {
    settings = await getSiteSettings();
  } catch (err) {
    console.error("Failed to load site settings:", err);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#b38b4d]/20 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#b38b4d] bg-[#b38b4d]/10 rounded-full px-2.5 py-0.5">
            Global Storefront Configuration
          </span>
        </div>
        <h1 className="text-3xl font-semibold text-[#1a1a1a]">Site Settings</h1>
        <p className="text-base text-[#1a1a1a]/50 mt-1">
          Configure business contact details, social links, footer taglines, and company information.
        </p>
      </div>

      {/* Settings Form */}
      <div className="mt-8">
        <SiteSettingsForm initialData={settings} />
      </div>
    </div>
  );
}
