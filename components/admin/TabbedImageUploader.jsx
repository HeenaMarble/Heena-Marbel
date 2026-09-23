"use client";

import { useState, useEffect } from "react";
import MultiImageUploader from "@/components/admin/MultiImageUploader";
import { Images } from "lucide-react";

export default function TabbedImageUploader({
  hasColors = false,
  colors = [],
  commonImages = [],
  onChangeCommonImages,
  colorImages = {},
  onChangeColorImages,
  folder = "/heena-marble/products",
}) {
  const [activeTab, setActiveTab] = useState("common");

  // Keep active tab valid if color list changes
  useEffect(() => {
    if (!hasColors) {
      setActiveTab("common");
      return;
    }
    if (activeTab !== "common") {
      const exists = colors.some((c) => c.name === activeTab);
      if (!exists) {
        setActiveTab(colors.length > 0 ? colors[0].name : "common");
      }
    }
  }, [hasColors, colors, activeTab]);

  // When colors are turned off, render single uploader
  if (!hasColors) {
    return (
      <MultiImageUploader
        value={commonImages}
        onChange={onChangeCommonImages}
        folder={folder}
      />
    );
  }

  // If colors is on but no colors entered yet
  if (colors.length === 0) {
    return (
      <div className="space-y-3">
        <p className="text-xs text-[#1a1a1a]/60 italic">
          No colors defined yet. Add color names above to manage color-specific images, or upload common gallery images below.
        </p>
        <MultiImageUploader
          value={commonImages}
          onChange={onChangeCommonImages}
          folder={folder}
        />
      </div>
    );
  }

  function handleColorImagesChange(colorName, newImages) {
    onChangeColorImages({
      ...colorImages,
      [colorName]: newImages,
    });
  }

  const isCommonTab = activeTab === "common";
  const activeColorObj = colors.find((c) => c.name === activeTab);
  const currentImages = isCommonTab
    ? commonImages
    : colorImages[activeTab] || [];

  return (
    <div className="space-y-4">
      {/* Tabs Header */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-[#e5e0d8] pb-2">
        {colors.map((c) => {
          const count = (colorImages[c.name] || []).length;
          const isActive = activeTab === c.name;
          return (
            <button
              key={c.name}
              type="button"
              onClick={() => setActiveTab(c.name)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-[#b38b4d] text-white shadow-xs"
                  : "bg-white text-[#1a1a1a]/70 hover:text-[#1a1a1a] border border-[#e5e0d8] hover:border-[#b38b4d]/40"
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/20"
                style={{ backgroundColor: c.hex || "#FFFFFF" }}
              />
              <span>{c.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-[#1a1a1a]/5 text-[#1a1a1a]/60"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}

        {/* Common / Fallback tab */}
        <button
          type="button"
          onClick={() => setActiveTab("common")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            isCommonTab
              ? "bg-[#b38b4d] text-white shadow-xs"
              : "bg-white text-[#1a1a1a]/70 hover:text-[#1a1a1a] border border-[#e5e0d8] hover:border-[#b38b4d]/40"
          }`}
        >
          <Images className="h-3.5 w-3.5" />
          <span>Common / All Colors</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              isCommonTab
                ? "bg-white/20 text-white"
                : "bg-[#1a1a1a]/5 text-[#1a1a1a]/60"
            }`}
          >
            {commonImages.length}
          </span>
        </button>
      </div>

      {/* Tab Context Helper */}
      <div className="text-xs text-[#1a1a1a]/60">
        {isCommonTab ? (
          <p>
            Common images are used as fallback when a color has no specific photos.
          </p>
        ) : (
          <p>
            Showing images specifically for <span className="font-semibold text-[#1a1a1a]">{activeTab}</span>.
          </p>
        )}
      </div>

      {/* Embedded Uploader for Active Tab */}
      <div key={activeTab}>
        <MultiImageUploader
          value={currentImages}
          onChange={(newImages) => {
            if (isCommonTab) {
              onChangeCommonImages(newImages);
            } else {
              handleColorImagesChange(activeTab, newImages);
            }
          }}
          folder={folder}
        />
      </div>
    </div>
  );
}
