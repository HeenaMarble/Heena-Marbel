"use client";

import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react";

export const UNIT_OPTIONS = [
  { label: "inches (\")", value: "inches" },
  { label: "cm", value: "cm" },
  { label: "mm", value: "mm" },
  { label: "ft", value: "ft" },
  { label: "m", value: "m" },
  { label: "kg", value: "kg" },
  { label: "g", value: "g" },
  { label: "lbs", value: "lbs" },
  { label: "sq ft", value: "sq ft" },
  { label: "sq m", value: "sq m" },
  { label: "pcs", value: "pcs" },
  { label: "— (no unit)", value: "" },
];

function parseDimensionLabel(item) {
  if (!item) return { label: "", unit: "" };
  let current = item;

  while (typeof current === "string") {
    const trimmed = current.trim();
    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      try {
        current = JSON.parse(current);
      } catch {
        break;
      }
    } else {
      break;
    }
  }

  if (typeof current === "object" && current !== null && !Array.isArray(current)) {
    let label = current.label ?? "";
    let unit = current.unit ?? "";

    while (typeof label === "string") {
      const trimmed = label.trim();
      if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        try {
          const parsed = JSON.parse(label);
          if (parsed && typeof parsed === "object") {
            label = parsed.label ?? "";
            if (!unit && parsed.unit) unit = parsed.unit;
          } else {
            break;
          }
        } catch {
          break;
        }
      } else {
        break;
      }
    }

    return { label: String(label || ""), unit: String(unit || "") };
  }

  return { label: String(current || ""), unit: "" };
}

function getDimensionValue(dimensionValues, labelKey) {
  if (!dimensionValues || !labelKey) return "";
  if (dimensionValues[labelKey] !== undefined) return dimensionValues[labelKey];
  const lowerKey = labelKey.toLowerCase();
  for (const [k, val] of Object.entries(dimensionValues)) {
    if (k.toLowerCase() === lowerKey) return val;
    if (k.includes(labelKey) || k.toLowerCase().includes(lowerKey)) return val;
  }
  return "";
}

export default function VariantTable({
  dimensionLabels = [],
  onChangeDimensionLabels,
  hasColors = false,
  colors = [],
  variants = [],
  onChangeVariants,
}) {
  // Normalize dimension labels to objects: [{ label: "Height", unit: "inches" }]
  const normalizedLabels = (Array.isArray(dimensionLabels) ? dimensionLabels : []).map(
    parseDimensionLabel
  );

  function handleLabelNameChange(index, newName) {
    const oldLabel = normalizedLabels[index]?.label || "";
    const updatedLabels = normalizedLabels.map((item, i) =>
      i === index ? { ...item, label: newName } : item
    );
    onChangeDimensionLabels(updatedLabels);

    // If label was renamed, rename the key in variants' dimension_values
    if (oldLabel && oldLabel !== newName) {
      const updatedVariants = variants.map((v) => {
        const dv = { ...(v.dimension_values || {}) };
        if (oldLabel in dv) {
          dv[newName] = dv[oldLabel];
          delete dv[oldLabel];
        }
        return { ...v, dimension_values: dv };
      });
      onChangeVariants(updatedVariants);
    }
  }

  function handleLabelUnitChange(index, newUnit) {
    const updatedLabels = normalizedLabels.map((item, i) =>
      i === index ? { ...item, unit: newUnit } : item
    );
    onChangeDimensionLabels(updatedLabels);
  }

  function handleAddDimension() {
    const updatedLabels = [
      ...normalizedLabels,
      { label: "", unit: "inches" },
    ];
    onChangeDimensionLabels(updatedLabels);
  }

  function handleRemoveDimension(index) {
    const removedLabel = normalizedLabels[index]?.label || "";
    const updatedLabels = normalizedLabels.filter((_, i) => i !== index);
    onChangeDimensionLabels(updatedLabels);

    // Clean up key in variant rows
    if (removedLabel) {
      const updatedVariants = variants.map((v) => {
        const dv = { ...(v.dimension_values || {}) };
        delete dv[removedLabel];
        return { ...v, dimension_values: dv };
      });
      onChangeVariants(updatedVariants);
    }
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
      is_default: isFirst,
    };

    onChangeVariants([...variants, newRow]);
  }

  function removeVariantRow(index) {
    const wasDefault = variants[index]?.is_default;
    const updated = variants.filter((_, i) => i !== index);

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
    <div className="space-y-5">
      {/* 2A. Variant Dimension Headers with Units */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-[#1a1a1a]">
          Variant Dimensions & Units
        </label>
        <p className="text-xs text-[#1a1a1a]/55">
          Define dimension headers (e.g. Size, Height, Width) and their measurement units. These become the column headers below.
        </p>

        {normalizedLabels.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="hidden sm:grid sm:grid-cols-[1fr_140px_36px] gap-2 px-1">
              <span className="text-[11px] font-semibold text-[#1a1a1a]/50 uppercase tracking-wide">
                Dimension Name
              </span>
              <span className="text-[11px] font-semibold text-[#1a1a1a]/50 uppercase tracking-wide">
                Unit
              </span>
              <span />
            </div>

            {normalizedLabels.map((dim, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_140px_36px] items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Height, Width, Size"
                  value={dim.label}
                  onChange={(e) => handleLabelNameChange(idx, e.target.value)}
                  className="rounded-lg border border-[#e5e0d8] px-3 py-2 text-sm outline-none focus:border-[#b38b4d] bg-white transition-colors w-full"
                />
                <select
                  value={dim.unit ?? ""}
                  onChange={(e) => handleLabelUnitChange(idx, e.target.value)}
                  className="rounded-lg border border-[#e5e0d8] px-2.5 py-2 text-sm outline-none focus:border-[#b38b4d] bg-white transition-colors cursor-pointer w-full"
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
                  onClick={() => handleRemoveDimension(idx)}
                  className="h-9 w-9 shrink-0 flex items-center justify-center rounded-lg border border-[#e5e0d8] text-[#1a1a1a]/60 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Remove dimension"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleAddDimension}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#967440] hover:text-[#b38b4d] bg-[#b38b4d]/10 hover:bg-[#b38b4d]/15 px-3 py-1.5 rounded-lg transition-colors cursor-pointer mt-1"
        >
          <Plus className="h-3.5 w-3.5" /> Add Dimension (e.g. Height, Width, Size)
        </button>
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
                  {/* Dynamic Dimension Column Headers with Units */}
                  {normalizedLabels.length > 0 ? (
                    normalizedLabels.map((dim, idx) => (
                      <th key={idx} className="p-2.5 whitespace-nowrap min-w-[120px]">
                        <span>{dim.label || `Dim ${idx + 1}`}</span>
                        {dim.unit && (
                          <span className="ml-1 text-[10px] font-normal text-[#967440] bg-[#b38b4d]/15 px-1.5 py-0.5 rounded">
                            {dim.unit}
                          </span>
                        )}
                      </th>
                    ))
                  ) : (
                    <th className="p-2.5 whitespace-nowrap min-w-[120px] text-[#1a1a1a]/40 italic">
                      Dimensions (none set)
                    </th>
                  )}

                  {/* Color Dropdown Column */}
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
                    {normalizedLabels.length > 0 ? (
                      normalizedLabels.map((dim, idx) => {
                        const labelKey = dim.label || `Dim ${idx + 1}`;
                        return (
                          <td key={idx} className="p-2">
                            <input
                              type="text"
                              placeholder={dim.unit ? `e.g. 12` : `e.g. 12"`}
                              value={getDimensionValue(v.dimension_values, labelKey)}
                              onChange={(e) =>
                                updateDimensionValue(index, labelKey, e.target.value)
                              }
                              className="w-full rounded-md border border-[#e5e0d8] px-2 py-1.5 text-xs outline-none focus:border-[#b38b4d] bg-white"
                            />
                          </td>
                        );
                      })
                    ) : (
                      <td className="p-2 text-xs text-[#1a1a1a]/40 italic">
                        Add dimension headers above
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
