"use client";

import { useState, useTransition } from "react";
import { Truck, CheckCircle2, AlertCircle, Save } from "lucide-react";
import { updateShippingSettings } from "@/lib/actions/shipping-actions";

export default function ShippingSettingsForm({ initialData = null }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    flat_rate: initialData?.flat_rate ?? 79,
    free_shipping_above: initialData?.free_shipping_above ?? 1499,
    cod_fee: initialData?.cod_fee ?? 40,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const data = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const result = await updateShippingSettings(data);
        if (result?.error) {
          setError(result.error);
        } else {
          setSuccess(true);
          setTimeout(() => setSuccess(false), 4000);
        }
      } catch (err) {
        setError(err?.message || "Failed to update shipping settings.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl pb-12">
      {/* Toast / Status Notifications */}
      {success && (
        <div className="flex items-center gap-2 text-sm text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-xl p-4 shadow-sm animate-in fade-in duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>Shipping settings updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-800 bg-red-50 border border-red-300 rounded-xl p-4 shadow-sm animate-in fade-in duration-200">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Delivery Rates Card */}
      <div className="rounded-2xl border border-[#b38b4d]/20 bg-white/95 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Card Header */}
        <div className="border-b border-[#b38b4d]/15 pb-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#b38b4d]/10 text-[#b38b4d]">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#1a1a1a]">
              Delivery Rates
            </h2>
            <p className="text-xs text-[#1a1a1a]/50">
              Configure shipping fees, free delivery threshold, and cash on delivery charges.
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-5">
          {/* Flat Shipping Rate */}
          <div>
            <label
              htmlFor="flat_rate"
              className="block text-xs font-semibold text-[#1a1a1a] mb-1.5"
            >
              Flat Shipping Rate (₹)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sm font-medium text-[#1a1a1a]/40">
                ₹
              </span>
              <input
                id="flat_rate"
                type="number"
                name="flat_rate"
                min="0"
                step="any"
                required
                value={formData.flat_rate}
                onChange={(e) => handleChange("flat_rate", e.target.value)}
                placeholder="79"
                className="w-full rounded-xl border border-[#e5e0d8] bg-white pl-8 pr-3.5 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
              />
            </div>
          </div>

          {/* Free Shipping Above */}
          <div>
            <label
              htmlFor="free_shipping_above"
              className="block text-xs font-semibold text-[#1a1a1a] mb-1.5"
            >
              Free Shipping Above (₹)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sm font-medium text-[#1a1a1a]/40">
                ₹
              </span>
              <input
                id="free_shipping_above"
                type="number"
                name="free_shipping_above"
                min="0"
                step="any"
                required
                value={formData.free_shipping_above}
                onChange={(e) => handleChange("free_shipping_above", e.target.value)}
                placeholder="1499"
                className="w-full rounded-xl border border-[#e5e0d8] bg-white pl-8 pr-3.5 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
              />
            </div>
            <p className="mt-1.5 text-xs text-[#1a1a1a]/60">
              Orders above this amount ship for free.
            </p>
          </div>

          {/* Cash on Delivery Fee */}
          <div>
            <label
              htmlFor="cod_fee"
              className="block text-xs font-semibold text-[#1a1a1a] mb-1.5"
            >
              Cash on Delivery Fee (₹)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sm font-medium text-[#1a1a1a]/40">
                ₹
              </span>
              <input
                id="cod_fee"
                type="number"
                name="cod_fee"
                min="0"
                step="any"
                required
                value={formData.cod_fee}
                onChange={(e) => handleChange("cod_fee", e.target.value)}
                placeholder="40"
                className="w-full rounded-xl border border-[#e5e0d8] bg-white pl-8 pr-3.5 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={pending}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#b38b4d] hover:bg-[#967440] text-white font-semibold py-3 px-6 text-sm transition-all duration-200 disabled:opacity-60 shadow-md hover:shadow-lg cursor-pointer"
          >
            <Save className="h-4 w-4" />
            {pending ? "Saving Settings..." : "Save Settings"}
          </button>
        </div>
      </div>
    </form>
  );
}
