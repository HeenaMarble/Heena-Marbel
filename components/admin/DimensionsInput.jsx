"use client";

import { Plus, X } from "lucide-react";

const UNIT_OPTIONS = [
  { label: "—", value: "" },
  // Length / Area
  { label: "mm", value: "mm" },
  { label: "cm", value: "cm" },
  { label: "m", value: "m" },
  { label: "inches", value: "inches" },
  { label: "ft", value: "ft" },
  // Weight
  { label: "kg", value: "kg" },
  { label: "g", value: "g" },
  { label: "lbs", value: "lbs" },
  // Area
  { label: "sq ft", value: "sq ft" },
  { label: "sq m", value: "sq m" },
  // Volume
  { label: "litre", value: "litre" },
  // Custom
  { label: "pcs", value: "pcs" },
];

export default function DimensionsInput({ value = [], onChange }) {
  const items = Array.isArray(value) ? value : [];

  function updateRow(index, field, val) {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: val } : item
    );
    onChange(updated);
  }

  function removeRow(index) {
    const updated = items.filter((_, i) => i !== index);
    onChange(updated);
  }

  function addRow() {
    onChange([...items, { label: "", value: "", unit: "" }]);
  }

  return (
    <div className="space-y-3">
      {items.length > 0 && (
        <div className="space-y-2">
          {/* Header labels */}
          <div className="hidden sm:grid sm:grid-cols-[1fr_1fr_100px_36px] gap-2 px-1">
            <span className="text-[11px] font-semibold text-[#1a1a1a]/50 uppercase tracking-wide">Dimension Name</span>
            <span className="text-[11px] font-semibold text-[#1a1a1a]/50 uppercase tracking-wide">Value</span>
            <span className="text-[11px] font-semibold text-[#1a1a1a]/50 uppercase tracking-wide">Unit</span>
            <span />
          </div>

          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-[1fr_1fr_100px_36px] items-center gap-2">
              <input
                type="text"
                placeholder="e.g. Height, Width"
                value={item.label ?? ""}
                onChange={(e) => updateRow(index, "label", e.target.value)}
                className="rounded-lg border border-[#e5e0d8] px-3 py-2 text-sm outline-none focus:border-[#b38b4d] bg-white transition-colors w-full"
              />
              <input
                type="text"
                placeholder="e.g. 12, 600"
                value={item.value ?? ""}
                onChange={(e) => updateRow(index, "value", e.target.value)}
                className="rounded-lg border border-[#e5e0d8] px-3 py-2 text-sm outline-none focus:border-[#b38b4d] bg-white transition-colors w-full"
              />
              <select
                value={item.unit ?? ""}
                onChange={(e) => updateRow(index, "unit", e.target.value)}
                className="rounded-lg border border-[#e5e0d8] px-2 py-2 text-sm outline-none focus:border-[#b38b4d] bg-white transition-colors cursor-pointer w-full"
                aria-label="Select unit"
              >
                {UNIT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeRow(index)}
                aria-label={`Remove dimension ${index + 1}`}
                className="h-9 w-9 shrink-0 flex items-center justify-center rounded-lg border border-[#e5e0d8] text-[#1a1a1a]/60 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={addRow}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#967440] hover:text-[#b38b4d] transition-colors py-1 px-1"
      >
        <Plus className="h-4 w-4" /> Add Dimension
      </button>
    </div>
  );
}
