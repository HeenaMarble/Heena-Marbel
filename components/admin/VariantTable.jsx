"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react";

export default function VariantTable({
  dimensionLabels = [],
  onChangeDimensionLabels,
  hasColors = false,
  colors = [],
  variants = [],
  onChangeVariants,
}) {
  // Comma-separated input for dimension labels
  const [labelsInput, setLabelsInput] = useState(() =>
    dimensionLabels.join(", ")
  );

  // Sync labels input if external labels change (e.g. initial load)
  useEffect(() => {
    const current = dimensionLabels.join(", ");
    const parsed = labelsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .join(", ");
    if (current !== parsed && !labelsInput.endsWith(",")) {
      setLabelsInput(current);
    }
  }, [dimensionLabels]);

  function handleLabelsChange(e) {
    const raw = e.target.value;
    setLabelsInput(raw);

    const parsed = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // Unique labels preserving order
    const unique = Array.from(new Set(parsed));
    onChangeDimensionLabels(unique);
  }

  function addVariantRow() {
    const isFirst = variants.length === 0;
    const defaultColor = hasColors && colors.length > 0 ? colors[0].name : "";
    const defaultHex =
      hasColors && colors.length > 0 ? colors[0].hex || null : null;

    const newRow = {
      dimension_values: {},
      color_name: defaultColor || null,
      color_hex: defaultHex,
      price: "",
      compare_at_price: "",
      stock: 0,
      is_default: isFirst, // First row is default by default
    };

    onChangeVariants([...variants, newRow]);
  }

  function removeVariantRow(index) {
    const wasDefault = variants[index]?.is_default;
    const updated = variants.filter((_, i) => i !== index);

    // If we removed the default row and rows remain, make the first row default
    if (wasDefault && updated.length > 0) {
      updated[0] = { ...updated[0], is_default: true };
    }

    onChangeVariants(updated);
  }

  function updateVariantField(index, field, value) {
    const updated = variants.map((row, i) => {
      if (i !== index) return row;
      return { ...row, [field]: value };
    });
    onChangeVariants(updated);
  }

  function updateDimensionValue(index, label, value) {
    const updated = variants.map((row, i) => {
      if (i !== index) return row;
      const dimValues = { ...(row.dimension_values || {}) };
      dimValues[label] = value;
      return { ...row, dimension_values: dimValues };
    });
    onChangeVariants(updated);
  }

  function updateColor(index, colorName) {
    const matchedColor = colors.find((c) => c.name === colorName);
    const updated = variants.map((row, i) => {
      if (i !== index) return row;
      return {
        ...row,
        color_name: colorName || null,
        color_hex: matchedColor ? matchedColor.hex : null,
      };
    });
    onChangeVariants(updated);
  }

  function setDefaultVariant(index) {
    const updated = variants.map((row, i) => ({
      ...row,
      is_default: i === index,
    }));
    onChangeVariants(updated);
  }

  const showColorColumn = hasColors && colors.length > 0;

  return (
    <div className="space-y-4">
      {/* 2A. Variant Dimension Labels Input */}
      <div>
        <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">
          Variant Dimension Labels
        </label>
        <input
          type="text"
          value={labelsInput}
          onChange={handleLabelsChange}
          placeholder="e.g. Height, Base Width, Thickness"
          className="w-full rounded-lg border border-[#e5e0d8] px-3 py-2 text-sm outline-none focus:border-[#b38b4d] bg-white transition-colors"
        />
        <p className="text-xs text-[#1a1a1a]/55 mt-1">
          Enter comma-separated dimension headers (e.g. Height, Width). These
          will become the column headers below.
        </p>
      </div>

      {/* 2B. Variant SKU Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-[#1a1a1a]">
            Variant SKUs ({variants.length})
          </label>
          <button
            type="button"
            onClick={addVariantRow}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#967440] hover:text-[#b38b4d] bg-[#b38b4d]/10 hover:bg-[#b38b4d]/15 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Add Variant
          </button>
        </div>

        {variants.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#b38b4d]/30 bg-[#faf8f5]/40 p-6 text-center">
            <p className="text-sm text-[#1a1a1a]/70">
              No variant SKUs added yet.
            </p>
            <p className="text-xs text-[#1a1a1a]/50 mt-1">
              Click &quot;+ Add Variant&quot; to define custom size, pricing, and stock combinations.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#e5e0d8] bg-white shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#e5e0d8] bg-[#faf8f5] text-[#1a1a1a]/80 font-semibold">
                  {/* Dynamic Dimension Column Headers */}
                  {dimensionLabels.length > 0 ? (
                    dimensionLabels.map((label, idx) => (
                      <th key={idx} className="p-2.5 whitespace-nowrap min-w-[110px]">
                        {label}
                      </th>
                    ))
                  ) : (
                    <th className="p-2.5 whitespace-nowrap min-w-[120px] text-[#1a1a1a]/40 italic">
                      Dimensions (none set)
                    </th>
                  )}

                  {/* Color Dropdown Column (only if colors are active) */}
                  {showColorColumn && (
                    <th className="p-2.5 whitespace-nowrap min-w-[120px]">
                      Color
                    </th>
                  )}

                  <th className="p-2.5 whitespace-nowrap min-w-[90px]">
                    Price (₹) *
                  </th>
                  <th className="p-2.5 whitespace-nowrap min-w-[90px]">
                    Compare Price (₹)
                  </th>
                  <th className="p-2.5 whitespace-nowrap min-w-[70px]">
                    Stock *
                  </th>
                  <th className="p-2.5 text-center whitespace-nowrap w-[70px]">
                    Default
                  </th>
                  <th className="p-2.5 text-center whitespace-nowrap w-[45px]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e0d8]">
                {variants.map((v, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-[#faf8f5]/50 transition-colors ${
                      v.is_default ? "bg-[#b38b4d]/5" : ""
                    }`}
                  >
                    {/* Dimension Value Inputs */}
                    {dimensionLabels.length > 0 ? (
                      dimensionLabels.map((label, idx) => (
                        <td key={idx} className="p-2">
                          <input
                            type="text"
                            placeholder={`e.g. 12"`}
                            value={v.dimension_values?.[label] || ""}
                            onChange={(e) =>
                              updateDimensionValue(index, label, e.target.value)
                            }
                            className="w-full rounded-md border border-[#e5e0d8] px-2 py-1.5 text-xs outline-none focus:border-[#b38b4d] bg-white"
                          />
                        </td>
                      ))
                    ) : (
                      <td className="p-2 text-xs text-[#1a1a1a]/40 italic">
                        Enter dimension labels above
                      </td>
                    )}

                    {/* Color Dropdown */}
                    {showColorColumn && (
                      <td className="p-2">
                        <select
                          value={v.color_name || ""}
                          onChange={(e) => updateColor(index, e.target.value)}
                          className="w-full rounded-md border border-[#e5e0d8] px-2 py-1.5 text-xs outline-none focus:border-[#b38b4d] bg-white cursor-pointer"
                        >
                          <option value="">Select Color</option>
                          {colors.map((c) => (
                            <option key={c.name} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </td>
                    )}

                    {/* Price */}
                    <td className="p-2">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={v.price ?? ""}
                        onChange={(e) =>
                          updateVariantField(index, "price", e.target.value)
                        }
                        className="w-full rounded-md border border-[#e5e0d8] px-2 py-1.5 text-xs outline-none focus:border-[#b38b4d] bg-white"
                        required
                      />
                    </td>

                    {/* Compare-at Price */}
                    <td className="p-2">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Optional"
                        value={v.compare_at_price ?? ""}
                        onChange={(e) =>
                          updateVariantField(
                            index,
                            "compare_at_price",
                            e.target.value
                          )
                        }
                        className="w-full rounded-md border border-[#e5e0d8] px-2 py-1.5 text-xs outline-none focus:border-[#b38b4d] bg-white"
                      />
                    </td>

                    {/* Stock */}
                    <td className="p-2">
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={v.stock ?? 0}
                        onChange={(e) =>
                          updateVariantField(index, "stock", e.target.value)
                        }
                        className="w-full rounded-md border border-[#e5e0d8] px-2 py-1.5 text-xs outline-none focus:border-[#b38b4d] bg-white"
                        required
                      />
                    </td>

                    {/* Default Selector */}
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => setDefaultVariant(index)}
                        title={
                          v.is_default
                            ? "Default variant"
                            : "Set as default variant"
                        }
                        className={`inline-flex items-center justify-center p-1 rounded-full transition-colors cursor-pointer ${
                          v.is_default
                            ? "text-[#b38b4d]"
                            : "text-[#1a1a1a]/30 hover:text-[#1a1a1a]/60"
                        }`}
                      >
                        {v.is_default ? (
                          <CheckCircle2 className="h-4 w-4 fill-[#b38b4d]/20" />
                        ) : (
                          <Circle className="h-4 w-4" />
                        )}
                      </button>
                    </td>

                    {/* Delete */}
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeVariantRow(index)}
                        title="Delete variant"
                        className="p-1 rounded-md text-[#1a1a1a]/40 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
