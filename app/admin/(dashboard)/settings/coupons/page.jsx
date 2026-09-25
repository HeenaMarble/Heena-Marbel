import { getCoupons } from "@/lib/actions/coupons";
import CouponsManager from "@/components/admin/settings/CouponsManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Discount Coupons | Heena Marble Admin",
};

export default async function CouponsPage() {
  let coupons = [];
  try {
    coupons = await getCoupons();
  } catch (err) {
    console.error("Failed to fetch coupons:", err);
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-[#b38b4d]/20 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#b38b4d] bg-[#b38b4d]/10 rounded-full px-2.5 py-0.5">
            Marketing & Promotions
          </span>
        </div>
        <h1 className="text-3xl font-semibold">
          <span className="text-[#511c2e]">Discount</span>{" "}
          <span className="text-[#b38b4d]">Coupons</span>
        </h1>
        <p className="text-base text-[#1a1a1a]/55 mt-1">
          Discount codes customers can apply at checkout.
        </p>
      </div>

      {/* Main Content Area */}
      <CouponsManager initialCoupons={coupons || []} />
    </div>
  );
}
