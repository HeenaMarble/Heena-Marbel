"use client";

import { useState } from "react";
import { FolderTree, Image as ImageIcon } from "lucide-react";
import CategoriesTab from "./CategoriesTab";
import GalleryTab from "./GalleryTab";
import { getProjectCategories } from "@/lib/actions/project-actions";

export default function ProjectsManager({ initialCategories = [] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [activeTab, setActiveTab] = useState("categories");
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    initialCategories[0]?.id || null
  );

  async function refreshCategories() {
    try {
      const refreshed = await getProjectCategories();
      setCategories(refreshed || []);
      // If selected category was deleted or not set, fallback to first
      if (
        refreshed &&
        refreshed.length > 0 &&
        (!selectedCategoryId || !refreshed.some((c) => c.id === selectedCategoryId))
      ) {
        setSelectedCategoryId(refreshed[0].id);
      }
    } catch (err) {
      console.error("Failed to refresh categories:", err);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#b38b4d]/20 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#b38b4d] bg-[#b38b4d]/10 rounded-full px-2.5 py-0.5">
              Portfolio &amp; Atelier
            </span>
          </div>
          <h1 className="text-3xl font-semibold text-[#1a1a1a]">Projects</h1>
          <p className="text-base text-[#1a1a1a]/50 mt-1">
            Manage project showcase categories and high-resolution photo galleries.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="inline-flex items-center rounded-full bg-stone-100 p-1 border border-[#b38b4d]/20 self-start md:self-auto shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "categories"
                ? "bg-[#b38b4d] text-white shadow-sm"
                : "text-[#1a1a1a]/70 hover:text-[#1a1a1a] hover:bg-stone-200/60"
            }`}
          >
            <FolderTree className="h-4 w-4" />
            <span>Categories</span>
            <span
              className={`ml-0.5 rounded-full px-2 py-0.2 text-[11px] font-mono ${
                activeTab === "categories"
                  ? "bg-white/20 text-white"
                  : "bg-stone-200 text-[#1a1a1a]/60"
              }`}
            >
              {categories.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (categories.length > 0 && !selectedCategoryId) {
                setSelectedCategoryId(categories[0].id);
              }
              setActiveTab("gallery");
            }}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "gallery"
                ? "bg-[#b38b4d] text-white shadow-sm"
                : "text-[#1a1a1a]/70 hover:text-[#1a1a1a] hover:bg-stone-200/60"
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            <span>Gallery</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "categories" ? (
          <CategoriesTab categories={categories} onRefresh={refreshCategories} />
        ) : (
          <GalleryTab
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
            onSwitchToCategoriesTab={() => setActiveTab("categories")}
          />
        )}
      </div>
    </div>
  );
}
