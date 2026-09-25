"use client";

import { useState, useTransition, useOptimistic } from "react";
import { useRouter } from "next/navigation";
import {
  Tag,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
} from "lucide-react";
import {
  createCoupon,
  toggleCouponActive,
  deleteCoupon,
} from "@/lib/actions/coupons";

export default function CouponsManager({ initialCoupons = [] }) {
  const router = useRouter();
  const [coupons, setCoupons] = useState(initialCoupons);
  const [couponType, setCouponType] = useState("percent_off");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: "", text: "" });

  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Sync state if initialCoupons changes via server refresh
  // (managed smoothly through local state updates + router.refresh())

  const handleToggleActive = async (id, currentActive) => {
    setTogglingId(id);
    const newActiveState = !currentActive;

    // Optimistic update
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_active: newActiveState } : c))
    );

    try {
      await toggleCouponActive(id, newActiveState);
      router.refresh();
    } catch (err) {
      // Rollback on error
      setCoupons((prev) =>
        prev.map((c) => (c.id === id ? { ...c, is_active: currentActive } : c))
      );
      setActionMessage({
        type: "error",
        text: err?.message || "Failed to update coupon status.",
      });
      setTimeout(() => setActionMessage({ type: "", text: "" }), 4000);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id, code) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the coupon "${code}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(id);
    try {
      await deleteCoupon(id);
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      setActionMessage({
        type: "success",
        text: `Coupon "${code}" deleted successfully.`,
      });
      setTimeout(() => setActionMessage({ type: "", text: "" }), 4000);
      router.refresh();
    } catch (err) {
      setActionMessage({
        type: "error",
        text: err?.message || "Failed to delete coupon.",
      });
      setTimeout(() => setActionMessage({ type: "", text: "" }), 4000);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess(false);
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await createCoupon(formData);
      if (res?.error) {
        setFormError(res.error);
      } else {
        setFormSuccess(true);
        form.reset();
        setCouponType("percent_off");
        setTimeout(() => setFormSuccess(false), 4000);
        router.refresh();
      }
    } catch (err) {
      setFormError(err?.message || "Failed to create coupon.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Global Action Notifications */}
      {actionMessage.text && (
        <div
          className={`flex items-center gap-2 text-sm rounded-xl p-4 shadow-sm animate-in fade-in duration-200 ${
            actionMessage.type === "error"
              ? "text-red-800 bg-red-50 border border-red-300"
              : "text-emerald-800 bg-emerald-50 border border-emerald-300"
          }`}
        >
          {actionMessage.type === "error" ? (
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column — Coupon List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-base font-semibold text-[#1a1a1a]">
              Active & Saved Coupons ({coupons.length})
            </h2>
          </div>

          {coupons.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#b38b4d]/30 bg-white/60 p-10 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#511c2e]/10 text-[#511c2e] flex items-center justify-center mx-auto mb-3">
                <Tag className="h-6 w-6" />
              </div>
              <p className="text-base font-semibold text-[#1a1a1a]">
                No coupons yet
              </p>
              <p className="text-sm text-[#1a1a1a]/55 mt-1 max-w-xs mx-auto">
                Create your first promotional discount coupon using the form on the right.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {coupons.map((coupon) => {
                const discountText =
                  coupon.type === "percent_off"
                    ? `${coupon.value}% off`
                    : `₹${coupon.value} off`;
                const minPurchaseText =
                  Number(coupon.min_purchase) > 0
                    ? ` · min ₹${coupon.min_purchase}`
                    : "";
                const subtitle = `${discountText}${minPurchaseText}`;

                return (
                  <div
                    key={coupon.id}
                    className={`rounded-2xl border transition-all duration-200 bg-white/95 p-4 sm:p-5 shadow-sm ${
                      coupon.is_active
                        ? "border-[#b38b4d]/25 hover:border-[#b38b4d]/50"
                        : "border-stone-200 bg-stone-50/70 opacity-75"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      {/* Left: Tag icon + Code & Subtitle */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`p-2.5 rounded-xl shrink-0 ${
                            coupon.is_active
                              ? "bg-[#511c2e]/10 text-[#511c2e]"
                              : "bg-stone-200 text-stone-500"
                          }`}
                        >
                          <Tag className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-base sm:text-lg text-[#1a1a1a] tracking-wider uppercase">
                              {coupon.code}
                            </span>
                            {!coupon.is_active && (
                              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-stone-200 text-stone-600">
                                Inactive
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm font-medium text-[#1a1a1a]/70 mt-0.5">
                            {subtitle}
                          </p>
                          {coupon.expires_at && (
                            <div className="flex items-center gap-1 text-[11px] text-[#1a1a1a]/50 mt-1">
                              <Calendar className="h-3 w-3 text-[#b38b4d]" />
                              <span>
                                Expires:{" "}
                                {new Date(coupon.expires_at).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Active Checkbox & Trash Button */}
                      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                        {/* ACTIVE Checkbox */}
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={!!coupon.is_active}
                            disabled={togglingId === coupon.id}
                            onChange={() =>
                              handleToggleActive(coupon.id, coupon.is_active)
                            }
                            className="h-4 w-4 rounded border-[#e5e0d8] text-[#511c2e] focus:ring-[#511c2e] cursor-pointer"
                          />
                          <span className="text-xs font-bold tracking-wider uppercase text-[#1a1a1a]/80 hidden sm:inline">
                            Active
                          </span>
                        </label>

                        {/* Trash Button */}
                        <button
                          type="button"
                          onClick={() => handleDelete(coupon.id, coupon.code)}
                          disabled={deletingId === coupon.id}
                          title="Delete coupon"
                          aria-label={`Delete coupon ${coupon.code}`}
                          className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {deletingId === coupon.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column — Create Coupon Card */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-[#b38b4d]/20 bg-white/95 p-6 sm:p-7 shadow-sm sticky top-6">
            {/* Header */}
            <div className="flex items-center gap-2.5 pb-5 border-b border-[#b38b4d]/15">
              <div className="p-2 rounded-lg bg-[#511c2e]/10 text-[#511c2e]">
                <Plus className="h-4 w-4 stroke-[2.5]" />
              </div>
              <h2 className="text-lg font-bold text-[#1a1a1a]">
                Create Coupon
              </h2>
            </div>

            {/* Inline Notifications */}
            {formSuccess && (
              <div className="mt-4 flex items-center gap-2 text-sm text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 shadow-sm animate-in fade-in duration-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Coupon created successfully!</span>
              </div>
            )}

            {formError && (
              <div className="mt-4 flex items-center gap-2 text-sm text-red-800 bg-red-50 border border-red-300 rounded-xl p-3.5 shadow-sm animate-in fade-in duration-200">
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleCreateSubmit} className="mt-5 space-y-4">
              {/* CODE */}
              <div>
                <label
                  htmlFor="coupon-code"
                  className="block text-xs font-bold uppercase tracking-wider text-[#1a1a1a] mb-1.5"
                >
                  Code
                </label>
                <input
                  id="coupon-code"
                  name="code"
                  type="text"
                  required
                  placeholder="AMAIRAH10"
                  className="w-full rounded-xl border border-[#e5e0d8] bg-white px-3.5 py-2.5 text-sm font-mono uppercase text-[#1a1a1a] placeholder:text-[#1a1a1a]/30 outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
                />
              </div>

              {/* TYPE */}
              <div>
                <label
                  htmlFor="coupon-type"
                  className="block text-xs font-bold uppercase tracking-wider text-[#1a1a1a] mb-1.5"
                >
                  Type
                </label>
                <select
                  id="coupon-type"
                  name="type"
                  value={couponType}
                  onChange={(e) => setCouponType(e.target.value)}
                  className="w-full rounded-xl border border-[#e5e0d8] bg-white px-3.5 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
                >
                  <option value="percent_off">Percent Off</option>
                  <option value="fixed_off">Fixed Off</option>
                </select>
              </div>

              {/* VALUE */}
              <div>
                <label
                  htmlFor="coupon-value"
                  className="block text-xs font-bold uppercase tracking-wider text-[#1a1a1a] mb-1.5"
                >
                  {couponType === "percent_off" ? "Value (%)" : "Value (₹)"}
                </label>
                <div className="relative">
                  {couponType === "fixed_off" && (
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sm font-medium text-[#1a1a1a]/40">
                      ₹
                    </span>
                  )}
                  <input
                    id="coupon-value"
                    name="value"
                    type="number"
                    min="1"
                    max={couponType === "percent_off" ? "100" : undefined}
                    step="any"
                    required
                    placeholder={couponType === "percent_off" ? "10" : "500"}
                    className={`w-full rounded-xl border border-[#e5e0d8] bg-white pr-3.5 py-2.5 text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/30 outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d] ${
                      couponType === "fixed_off" ? "pl-8" : "px-3.5"
                    }`}
                  />
                  {couponType === "percent_off" && (
                    <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-sm font-medium text-[#1a1a1a]/40">
                      %
                    </span>
                  )}
                </div>
              </div>

              {/* MINIMUM PURCHASE */}
              <div>
                <label
                  htmlFor="coupon-min-purchase"
                  className="block text-xs font-bold uppercase tracking-wider text-[#1a1a1a] mb-1.5"
                >
                  Minimum Purchase (₹)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sm font-medium text-[#1a1a1a]/40">
                    ₹
                  </span>
                  <input
                    id="coupon-min-purchase"
                    name="min_purchase"
                    type="number"
                    min="0"
                    step="any"
                    defaultValue="0"
                    placeholder="0"
                    className="w-full rounded-xl border border-[#e5e0d8] bg-white pl-8 pr-3.5 py-2.5 text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/30 outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
                  />
                </div>
              </div>

              {/* EXPIRES ON */}
              <div>
                <label
                  htmlFor="coupon-expires-at"
                  className="block text-xs font-bold uppercase tracking-wider text-[#1a1a1a] mb-1.5"
                >
                  Expires On (Optional)
                </label>
                <input
                  id="coupon-expires-at"
                  name="expires_at"
                  type="date"
                  className="w-full rounded-xl border border-[#e5e0d8] bg-white px-3.5 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#511c2e] hover:bg-[#3d1523] text-white font-semibold py-3 px-5 text-sm transition-all duration-200 disabled:opacity-60 shadow-md hover:shadow-lg cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating Coupon...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Create Coupon</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
