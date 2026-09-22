"use client";

import { useState, useEffect, useTransition } from "react";
import {
  PlusCircle,
  Trash2,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  FolderTree,
  Loader2,
  X,
  AlertTriangle,
} from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import MultiImageUploader from "./MultiImageUploader";
import {
  getProjectsByCategory,
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/actions/project-actions";

export default function GalleryTab({
  categories = [],
  selectedCategoryId,
  onSelectCategory,
  onSwitchToCategoriesTab,
}) {
  const [images, setImages] = useState([]);
  const [loadingImages, startLoadingTransition] = useTransition();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [isReordering, startReordering] = useTransition();
  const [deletingImageId, setDeletingImageId] = useState(null);
  const [isDeleting, startDeleting] = useTransition();
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Active category object
  const activeCategory =
    categories.find((c) => c.id === selectedCategoryId) || categories[0] || null;

  // Load images when active category changes
  useEffect(() => {
    let isCancelled = false;
    if (!activeCategory?.id) return;

    startLoadingTransition(async () => {
      try {
        const data = await getProjectsByCategory(activeCategory.id);
        if (!isCancelled) {
          setImages(data || []);
        }
      } catch (err) {
        console.error("Failed to load category projects:", err);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [activeCategory?.id]);

  async function reloadImages() {
    if (!activeCategory?.id) return;
    startLoadingTransition(async () => {
      try {
        const data = await getProjectsByCategory(activeCategory.id);
        setImages(data || []);
      } catch (err) {
        console.error("Failed to reload projects:", err);
      }
    });
  }

  // Delete image
  function handleDeleteImage(id) {
    if (!confirm("Are you sure you want to delete this project image?")) return;
    setDeletingImageId(id);
    startDeleting(async () => {
      try {
        await deleteProject(id);
        setImages((prev) => prev.filter((img) => img.id !== id));
      } catch (err) {
        alert(err.message || "Failed to delete project image.");
      } finally {
        setDeletingImageId(null);
      }
    });
  }

  // Move image by step (prev/next)
  async function handleMove(index, direction) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const currentImg = images[index];
    const targetImg = images[targetIndex];

    const currentOrder = Number(currentImg.display_order) || index + 1;
    const targetOrder = Number(targetImg.display_order) || targetIndex + 1;

    const newCurrentOrder = currentOrder === targetOrder ? targetIndex + 1 : targetOrder;
    const newTargetOrder = currentOrder === targetOrder ? index + 1 : currentOrder;

    // Optimistic update
    const updated = [...images];
    updated[index] = { ...currentImg, display_order: newCurrentOrder };
    updated[targetIndex] = { ...targetImg, display_order: newTargetOrder };
    updated.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    setImages(updated);

    startReordering(async () => {
      try {
        await Promise.all([
          updateProject(currentImg.id, { display_order: newCurrentOrder }),
          updateProject(targetImg.id, { display_order: newTargetOrder }),
        ]);
        await reloadImages();
      } catch (err) {
        console.error("Reorder failed:", err);
        await reloadImages();
      }
    });
  }

  // Drag and drop reordering
  function handleDragStart(index) {
    setDraggedIndex(index);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  async function handleDrop(targetIndex) {
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }

    const reordered = [...images];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    setDraggedIndex(null);

    // Optimistically update
    const withNewOrders = reordered.map((img, idx) => ({
      ...img,
      display_order: idx + 1,
    }));
    setImages(withNewOrders);

    startReordering(async () => {
      try {
        const updatePromises = withNewOrders.map((img) =>
          updateProject(img.id, { display_order: img.display_order })
        );
        await Promise.all(updatePromises);
        await reloadImages();
      } catch (err) {
        console.error("Drag reorder failed:", err);
        await reloadImages();
      }
    });
  }

  // If no categories exist
  if (categories.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#b38b4d]/30 bg-white/70 p-12 text-center">
        <FolderTree className="mx-auto h-10 w-10 text-[#b38b4d]/40 mb-3" />
        <h3 className="text-base font-semibold text-[#1a1a1a]">No categories available</h3>
        <p className="text-sm text-[#1a1a1a]/50 mt-1 max-w-sm mx-auto">
          You must create at least one project category before uploading gallery images.
        </p>
        <button
          type="button"
          onClick={onSwitchToCategoriesTab}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#b38b4d] text-white text-sm font-semibold px-5 py-2 hover:bg-[#967440] transition-colors cursor-pointer"
        >
          Go to Categories Tab
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Left Column: Categories List (Compact & Scrollable) */}
      <div className="lg:col-span-3 space-y-2 sticky top-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#967440]">
            Categories
          </h3>
          <span className="text-xs text-[#1a1a1a]/50 font-medium">
            {categories.length} total
          </span>
        </div>

        <div
          className="rounded-2xl border border-[#b38b4d]/20 bg-white/90 p-1.5 shadow-sm space-y-1 max-h-[225px] overflow-y-auto pr-1"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#b38b4d66 #f5f0e8",
          }}
        >
          {categories.map((cat) => {
            const isSelected = activeCategory?.id === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full text-left rounded-xl px-2.5 py-2 transition-all flex items-center justify-between gap-2 cursor-pointer ${
                  isSelected
                    ? "bg-[#b38b4d] text-white shadow-sm font-semibold"
                    : "text-[#1a1a1a] hover:bg-[#b38b4d]/10"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold">{cat.name}</p>
                  <p
                    className={`truncate text-[11px] ${
                      isSelected ? "text-white/80" : "text-[#1a1a1a]/40"
                    }`}
                  >
                    /{cat.slug}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded-full font-mono font-medium ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-[#b38b4d]/10 text-[#967440]"
                  }`}
                >
                  #{cat.display_order ?? "-"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Column: Images Grid */}
      <div className="lg:col-span-9 space-y-4">
        {/* Header with selected category and Add Image action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#b38b4d]/20 bg-white/90 p-4 sm:px-6 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-[#1a1a1a]">
                {activeCategory?.name}
              </h3>
              <span className="text-xs bg-[#b38b4d]/10 text-[#967440] font-semibold px-2.5 py-0.5 rounded-full">
                {images.length} {images.length === 1 ? "image" : "images"}
              </span>
            </div>
            <p className="text-xs text-[#1a1a1a]/50 mt-0.5">
              Drag images or use arrow buttons to reorder. Images are saved with no title or description fields.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setUploadModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#b38b4d] hover:bg-[#967440] text-white text-sm font-semibold px-5 py-2.5 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" /> Upload Images
          </button>
        </div>

        {/* Loading Indicator */}
        {loadingImages ? (
          <div className="rounded-2xl border border-[#b38b4d]/20 bg-white/60 p-16 text-center">
            <Loader2 className="mx-auto h-8 w-8 text-[#b38b4d] animate-spin mb-2" />
            <p className="text-xs text-[#1a1a1a]/60">Loading category images...</p>
          </div>
        ) : images.length === 0 ? (
          /* Empty state */
          <div className="rounded-2xl border border-dashed border-[#b38b4d]/30 bg-white/70 p-12 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-[#b38b4d]/40 mb-3" />
            <h4 className="text-base font-semibold text-[#1a1a1a]">No images yet</h4>
            <p className="text-sm text-[#1a1a1a]/50 mt-1 max-w-sm mx-auto">
              This category has no gallery images. Upload photos to showcase work in &ldquo;{activeCategory?.name}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => setUploadModalOpen(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#b38b4d] text-white text-sm font-semibold px-5 py-2 hover:bg-[#967440] transition-colors cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" /> Upload First Images
            </button>
          </div>
        ) : (
          /* Images Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {images.map((img, index) => {
              const isFirst = index === 0;
              const isLast = index === images.length - 1;
              const isDragging = draggedIndex === index;
              const isCurrentDeleting = deletingImageId === img.id;

              return (
                <div
                  key={img.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                  className={`group relative rounded-2xl border border-[#b38b4d]/20 bg-white shadow-xs overflow-hidden transition-all hover:border-[#b38b4d]/50 hover:shadow-md ${
                    isDragging ? "opacity-30 scale-95 border-dashed border-[#b38b4d]" : ""
                  }`}
                >
                  {/* Aspect Square Image Thumbnail */}
                  <div className="aspect-square w-full bg-stone-100 overflow-hidden relative">
                    <img
                      src={img.image_url}
                      alt={`Project ${index + 1}`}
                      className="w-full h-full object-cover select-none transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Gradient Overlay for controls */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/50 opacity-90 transition-opacity" />

                    {/* Order Badge (Top Left) */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-black/60 text-white font-mono text-xs font-semibold backdrop-blur-xs border border-white/20">
                        #{img.display_order ?? index + 1}
                      </span>
                    </div>

                    {/* Delete Button (Top Right) */}
                    <div className="absolute top-2.5 right-2.5">
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img.id)}
                        disabled={isDeleting && isCurrentDeleting}
                        title="Delete image"
                        className="h-7 w-7 rounded-full bg-red-600/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        {isCurrentDeleting ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Bottom Controls Bar: Drag Handle + Move Arrows */}
                    <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between bg-black/60 backdrop-blur-xs rounded-xl px-2 py-1 border border-white/15 text-white">
                      <div
                        className="flex items-center gap-1 cursor-grab active:cursor-grabbing text-white/80 hover:text-white"
                        title="Drag to reorder"
                      >
                        <GripVertical className="h-4 w-4" />
                        <span className="text-[11px] font-medium hidden sm:inline">Drag</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMove(index, -1)}
                          disabled={isFirst || isReordering}
                          title="Move left"
                          className="p-1 rounded-lg hover:bg-white/20 disabled:opacity-20 transition-colors cursor-pointer disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMove(index, 1)}
                          disabled={isLast || isReordering}
                          title="Move right"
                          className="p-1 rounded-lg hover:bg-white/20 disabled:opacity-20 transition-colors cursor-pointer disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Upload Images Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-[#b38b4d]/20 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#b38b4d]/15 pb-3 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-[#1a1a1a]">
                  Upload Project Images
                </h3>
                <p className="text-xs text-[#1a1a1a]/50">
                  Adding to category &ldquo;{activeCategory?.name}&rdquo;
                </p>
              </div>
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <MultiImageUploader
              categoryId={activeCategory?.id}
              categoryName={activeCategory?.name}
              startDisplayOrder={
                images.length > 0
                  ? Math.max(...images.map((img) => Number(img.display_order) || 0)) + 1
                  : 1
              }
              onComplete={async () => {
                await reloadImages();
                setUploadModalOpen(false);
              }}
              onCancel={() => setUploadModalOpen(false)}
              folder="projects"
            />
          </div>
        </div>
      )}
    </div>
  );
}
