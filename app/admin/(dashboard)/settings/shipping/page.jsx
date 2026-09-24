import { getShippingSettings } from "@/lib/actions/shipping-actions";
import ShippingSettingsForm from "@/components/admin/settings/ShippingSettingsForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shipping Settings | Heena Marble Admin",
};

export default async function ShippingSettingsPage() {
  let settings = null;
  try {
    settings = await getShippingSettings();
  } catch (err) {
    console.error("Failed to load shipping settings:", err);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#b38b4d]/20 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#b38b4d] bg-[#b38b4d]/10 rounded-full px-2.5 py-0.5">
            Logistics & Fulfillment
          </span>
        </div>
        <h1 className="text-3xl font-semibold text-[#1a1a1a]">Shipping Settings</h1>
        <p className="text-base text-[#1a1a1a]/50 mt-1">
          Manage delivery rates, free shipping thresholds, and cash on delivery fees.
        </p>
      </div>

      {/* Settings Form */}
      <div className="mt-8">
        <ShippingSettingsForm initialData={settings} />
      </div>
    </div>
  );
}
