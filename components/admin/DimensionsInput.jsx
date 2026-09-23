"use client";

import { Plus, X } from "lucide-react";

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
    onChange([...items, { label: "", value: "" }]);
  }

  return (
    <div className="space-y-3">
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2 sm:gap-3">
              <input
                type="text"
                placeholder="e.g. Height, Width, Weight"
                value={item.label ?? ""}
                onChange={(e) => updateRow(index, "label", e.target.value)}
                className="flex-1 rounded-lg border border-[#e5e0d8] px-3 py-2 text-sm outline-none focus:border-[#b38b4d] bg-white transition-colors"
              />
              <input
                type="text"
                placeholder="e.g. 12 inches, 50 kg"
                value={item.value ?? ""}
                onChange={(e) => updateRow(index, "value", e.target.value)}
                className="flex-1 rounded-lg border border-[#e5e0d8] px-3 py-2 text-sm outline-none focus:border-[#b38b4d] bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => removeRow(index)}
                aria-label={`Remove row ${index + 1}`}
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
