import { getQuantityDiscountAdmin } from "@/lib/actions/quantity-discount";
import QuantityDiscountForm from "@/components/admin/settings/QuantityDiscountForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Quantity Discount | Heena Marble Admin",
};

export default async function QuantityDiscountPage() {
  let settings = null;
  let tiers = [];

  try {
    const data = await getQuantityDiscountAdmin();
    settings = data?.settings || null;
    tiers = data?.tiers || [];
  } catch (err) {
    console.error("Failed to fetch quantity discount settings:", err);
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-[#b38b4d]/20 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#b38b4d] bg-[#b38b4d]/10 rounded-full px-2.5 py-0.5">
            Tiered Pricing
          </span>
        </div>
        <h1 className="text-3xl font-semibold">
          <span className="text-[#511c2e]">Quantity</span>{" "}
          <span className="text-[#b38b4d]">Discount</span>
        </h1>
        <p className="text-base text-[#1a1a1a]/55 mt-1">
          Automatic discount based on total cart quantity — applies store-wide, no coupon code required.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="mt-8">
        <QuantityDiscountForm
          initialSettings={settings}
          initialTiers={tiers}
        />
      </div>
    </div>
  );
}
