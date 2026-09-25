"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Layers,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  Loader2,
  Info,
} from "lucide-react";
import { saveQuantityDiscountRules } from "@/lib/actions/quantity-discount";

export default function QuantityDiscountForm({
  initialSettings = null,
  initialTiers = [],
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [isEnabled, setIsEnabled] = useState(
    initialSettings?.is_enabled ?? false
  );

  // Normalize initial tiers sorted by min_items ascending
  const sortedInitial = [...(initialTiers || [])].sort(
    (a, b) => Number(a.min_items) - Number(b.min_items)
  );

  const [tiers, setTiers] = useState(
    sortedInitial.length > 0
      ? sortedInitial.map((t) => ({
          min_items: t.min_items ?? "",
          discount_amount: t.discount_amount ?? "",
        }))
      : [
          { min_items: 2, discount_amount: 100 },
          { min_items: 3, discount_amount: 200 },
          { min_items: 5, discount_amount: 500 },
        ]
  );

  const handleTierChange = (index, field, value) => {
    setTiers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddTier = () => {
    setTiers((prev) => {
      // Suggest next min_items based on last tier
      const last = prev[prev.length - 1];
      const nextMin = last && Number(last.min_items) ? Number(last.min_items) + 1 : "";
      return [...prev, { min_items: nextMin, discount_amount: "" }];
    });
  };

  const handleRemoveTier = (index) => {
    setTiers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Filter out and sanitize tiers
    const cleanTiers = tiers
      .filter((t) => t.min_items !== "" && t.discount_amount !== "")
      .map((t) => ({
        min_items: Math.max(1, Math.floor(Number(t.min_items))),
        discount_amount: Math.max(0, Number(t.discount_amount)),
      }))
      .sort((a, b) => a.min_items - b.min_items);

    // Update local tiers view sorted
    setTiers(cleanTiers);

    const formData = new FormData();
    formData.append("is_enabled", isEnabled ? "true" : "false");
    formData.append("tiers_json", JSON.stringify(cleanTiers));

    startTransition(async () => {
      try {
        const res = await saveQuantityDiscountRules(formData);
        if (res?.error) {
          setError(res.error);
        } else {
          setSuccess(true);
          setTimeout(() => setSuccess(false), 4000);
          router.refresh();
        }
      } catch (err) {
        setError(err?.message || "Failed to save quantity discount rules.");
      }
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-2xl pb-12">
      {/* Toast / Status Notifications */}
      {success && (
        <div className="flex items-center gap-2 text-sm text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-xl p-4 shadow-sm animate-in fade-in duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>Quantity discount rules saved successfully!</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-800 bg-red-50 border border-red-300 rounded-xl p-4 shadow-sm animate-in fade-in duration-200">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Single Card: Cart Quantity Discount */}
      <div className="rounded-2xl border border-[#b38b4d]/20 bg-white/95 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Card Header */}
        <div className="border-b border-[#b38b4d]/15 pb-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#511c2e]/10 text-[#511c2e]">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1a1a1a]">
              Cart Quantity Discount
            </h2>
            <p className="text-xs text-[#1a1a1a]/55">
              Reward customers with increasing discounts as they purchase more items.
            </p>
          </div>
        </div>

        {/* Checkbox: Enable automatic quantity discount at checkout */}
        <div className="rounded-xl border border-[#e5e0d8] bg-[#faf8f5] p-4">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => setIsEnabled(e.target.checked)}
              className="h-5 w-5 rounded border-[#e5e0d8] text-[#511c2e] focus:ring-[#511c2e] cursor-pointer"
            />
            <span className="text-sm font-semibold text-[#1a1a1a]">
              Enable automatic quantity discount at checkout
            </span>
          </label>
        </div>

        {/* Section: Discount Tiers */}
        <div className="space-y-4 pt-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a]">
              Discount Tiers
            </h3>
            <p className="text-xs text-[#1a1a1a]/60 mt-0.5">
              Based on total items in cart (any size/variant)
            </p>
          </div>

          {/* Tier Rows */}
          <div className="space-y-3">
            {tiers.length === 0 ? (
              <p className="text-xs text-stone-500 italic py-2">
                No tiers added yet. Click &quot;+ Add Tier&quot; below to add your first discount rule.
              </p>
            ) : (
              tiers.map((tier, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 sm:gap-4 bg-stone-50/70 p-3 rounded-xl border border-stone-200"
                >
                  {/* Min Items */}
                  <div className="flex-1">
                    <label
                      htmlFor={`min-items-${index}`}
                      className="block text-[11px] font-bold uppercase tracking-wider text-[#1a1a1a]/70 mb-1"
                    >
                      Min. Items
                    </label>
                    <input
                      id={`min-items-${index}`}
                      type="number"
                      min="1"
                      step="1"
                      required
                      value={tier.min_items}
                      onChange={(e) =>
                        handleTierChange(index, "min_items", e.target.value)
                      }
                      placeholder="e.g. 3"
                      className="w-full rounded-lg border border-[#e5e0d8] bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
                    />
                  </div>

                  {/* Discount Amount */}
                  <div className="flex-1">
                    <label
                      htmlFor={`discount-amount-${index}`}
                      className="block text-[11px] font-bold uppercase tracking-wider text-[#1a1a1a]/70 mb-1"
                    >
                      Discount (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sm font-medium text-[#1a1a1a]/40">
                        ₹
                      </span>
                      <input
                        id={`discount-amount-${index}`}
                        type="number"
                        min="0"
                        step="any"
                        required
                        value={tier.discount_amount}
                        onChange={(e) =>
                          handleTierChange(index, "discount_amount", e.target.value)
                        }
                        placeholder="e.g. 200"
                        className="w-full rounded-lg border border-[#e5e0d8] bg-white pl-7 pr-3 py-2 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
                      />
                    </div>
                  </div>

                  {/* Trash Icon */}
                  <div className="pt-5">
                    <button
                      type="button"
                      onClick={() => handleRemoveTier(index)}
                      title="Remove tier"
                      aria-label={`Remove tier row ${index + 1}`}
                      className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* + Add Tier Button */}
          <div>
            <button
              type="button"
              onClick={handleAddTier}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b38b4d] hover:text-[#967440] hover:underline transition-colors py-1 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Add Tier</span>
            </button>
          </div>

          {/* Helper Paragraph */}
          <div className="flex items-start gap-2.5 rounded-xl bg-[#511c2e]/5 border border-[#511c2e]/10 p-3.5 text-xs text-[#1a1a1a]/75 leading-relaxed">
            <Info className="h-4 w-4 text-[#b38b4d] shrink-0 mt-0.5" />
            <p>
              The highest tier the cart&apos;s total item count qualifies for is applied automatically — no coupon code needed. For example, a tier of &quot;5&quot; applies to 5 or more items.
            </p>
          </div>
        </div>

        {/* Big Maroon SAVE RULES Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={pending}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#511c2e] hover:bg-[#3d1523] text-white font-bold py-3.5 px-6 text-sm tracking-wide uppercase transition-all duration-200 disabled:opacity-60 shadow-md hover:shadow-lg cursor-pointer"
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving Rules...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Rules</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
