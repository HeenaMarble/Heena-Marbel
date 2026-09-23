"use client";

import { useState, useEffect } from "react";
import { Palette, X } from "lucide-react";

// Quick default color map for common names
const DEFAULT_HEX_MAP = {
  white: "#FFFFFF",
  black: "#000000",
  grey: "#808080",
  gray: "#808080",
  green: "#1b4d3e",
  red: "#b91c1c",
  blue: "#1e3a8a",
  beige: "#f5f5dc",
  brown: "#78350f",
  cream: "#fffdd0",
  gold: "#b38b4d",
  pink: "#f472b6",
};

export default function ColorManager({ colors = [], onChange }) {
  // text state for comma-separated input
  const [inputText, setInputText] = useState(() =>
    colors.map((c) => c.name).join(", ")
  );

  // Sync inputText if external colors changed outside typing (e.g. initial load)
  useEffect(() => {
    const currentNames = colors.map((c) => c.name).join(", ");
    const parsedFromInput = inputText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .join(", ");
    if (currentNames !== parsedFromInput && !inputText.endsWith(",")) {
      setInputText(currentNames);
    }
  }, [colors]);

  function handleTextChange(e) {
    const rawVal = e.target.value;
    setInputText(rawVal);

    const parsedNames = rawVal
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // Remove duplicates preserving order
    const uniqueNames = Array.from(new Set(parsedNames));

    // Map to color objects keeping existing hex
    const updatedColors = uniqueNames.map((name) => {
      const existing = colors.find(
        (c) => c.name.toLowerCase() === name.toLowerCase()
      );
      if (existing) {
        return { name, hex: existing.hex || "#FFFFFF" };
      }
      const lower = name.toLowerCase();
      const defaultHex = DEFAULT_HEX_MAP[lower] || "#E5E0D8";
      return { name, hex: defaultHex };
    });

    onChange(updatedColors);
  }

  function handleHexChange(index, hexValue) {
    const updated = [...colors];
    updated[index] = { ...updated[index], hex: hexValue };
    onChange(updated);
  }

  function handleRemoveColor(indexToRemove) {
    const updated = colors.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
    setInputText(updated.map((c) => c.name).join(", "));
  }

  return (
    <div className="space-y-3 p-4 rounded-xl border border-[#b38b4d]/20 bg-[#faf8f5]/60">
      <div className="flex items-center gap-2">
        <Palette className="h-4 w-4 text-[#b38b4d]" />
        <label className="text-sm font-semibold text-[#1a1a1a]">
          Available Product Colors
        </label>
      </div>

      <div>
        <input
          type="text"
          value={inputText}
          onChange={handleTextChange}
          placeholder="e.g. White, Forest Green, Italian Black, Beige"
          className="w-full rounded-lg border border-[#e5e0d8] px-3 py-2 text-sm outline-none focus:border-[#b38b4d] bg-white transition-colors"
        />
        <p className="text-xs text-[#1a1a1a]/55 mt-1">
          Separate color names with commas. You can pick exact hex codes below.
        </p>
      </div>

      {colors.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-xs font-medium text-[#1a1a1a]/70">
            Assigned Color Swatches & Hex:
          </span>
          <div className="flex flex-wrap gap-2.5">
            {colors.map((color, idx) => (
              <div
                key={`${color.name}-${idx}`}
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg border border-[#e5e0d8] bg-white shadow-xs text-xs font-medium text-[#1a1a1a]"
              >
                {/* Visual Swatch with hidden/inline color input */}
                <label
                  title="Click to change hex"
                  className="relative flex items-center justify-center cursor-pointer"
                >
                  <span
                    className="w-4 h-4 rounded-full border border-black/20 shadow-inner block"
                    style={{ backgroundColor: color.hex || "#FFFFFF" }}
                  />
                  <input
                    type="color"
                    value={color.hex || "#FFFFFF"}
                    onChange={(e) => handleHexChange(idx, e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </label>

                <span>{color.name}</span>
                <span className="text-[10px] text-[#1a1a1a]/45 uppercase font-mono">
                  {color.hex || "#FFFFFF"}
                </span>

                <button
                  type="button"
                  onClick={() => handleRemoveColor(idx)}
                  className="text-[#1a1a1a]/40 hover:text-red-600 transition-colors ml-0.5"
                  title={`Remove ${color.name}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
