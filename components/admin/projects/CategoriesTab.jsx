"use client";

import { useState, useTransition } from "react";
import {
  PlusCircle,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  GripVertical,
  AlertTriangle,
  X,
  Loader2,
  FolderTree,
} from "lucide-react";
import {
  createProjectCategory,
  updateProjectCategory,
  deleteProjectCategory,
} from "@/lib/actions/project-actions";

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CategoriesTab({ categories = [], onRefresh }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    display_order: 1,
  });
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [modalError, setModalError] = useState("");
  const [isSubmitting, startSubmitting] = useTransition();
  const [isDeleting, startDeleting] = useTransition();
  const [isReordering, startReordering] = useTransition();

  const [draggedIndex, setDraggedIndex] = useState(null);

  function openAddModal() {
    const nextOrder =
      categories.length > 0
        ? Math.max(...categories.map((c) => Number(c.display_order) || 0)) + 1
        : 1;
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      display_order: nextOrder,
    });
    setSlugManuallyEdited(false);
    setModalError("");
    setModalOpen(true);
  }

  function openEditModal(cat) {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || "",
      slug: cat.slug || "",
      display_order: cat.display_order ?? 1,
    });
    setSlugManuallyEdited(true);
    setModalError("");
    setModalOpen(true);
  }

  function handleNameChange(e) {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: slugManuallyEdited ? prev.slug : slugify(name),
    }));
  }

  function handleSlugChange(e) {
    setSlugManuallyEdited(true);
    setFormData((prev) => ({
      ...prev,
      slug: slugify(e.target.value),
    }));
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    setModalError("");

    if (!formData.name.trim()) {
      setModalError("Category name is required.");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      slug: formData.slug.trim() || slugify(formData.name),
      display_order: Number(formData.display_order) || 1,
    };

    startSubmitting(async () => {
      try {
        if (editingCategory) {
          await updateProjectCategory(editingCategory.id, payload);
        } else {
          await createProjectCategory(payload);
        }
        setModalOpen(false);
        if (onRefresh) await onRefresh();
      } catch (err) {
        setModalError(err.message || "Failed to save category.");
      }
    });
  }

  function handleDeleteCategory() {
    if (!deletingCategory) return;
    startDeleting(async () => {
      try {
        await deleteProjectCategory(deletingCategory.id);
        setDeletingCategory(null);
        if (onRefresh) await onRefresh();
      } catch (err) {
        alert(err.message || "Failed to delete category.");
      }
    });
  }

  async function handleMove(index, direction) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const currentCat = categories[index];
    const targetCat = categories[targetIndex];

    const currentOrder = Number(currentCat.display_order) || index + 1;
    const targetOrder = Number(targetCat.display_order) || targetIndex + 1;

    const newCurrentOrder = currentOrder === targetOrder ? targetIndex + 1 : targetOrder;
    const newTargetOrder = currentOrder === targetOrder ? index + 1 : currentOrder;

    startReordering(async () => {
      try {
        await Promise.all([
          updateProjectCategory(currentCat.id, { display_order: newCurrentOrder }),
          updateProjectCategory(targetCat.id, { display_order: newTargetOrder }),
        ]);
        if (onRefresh) await onRefresh();
      } catch (err) {
        console.error("Reorder failed:", err);
      }
    });
  }

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

    const reordered = [...categories];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    setDraggedIndex(null);

    startReordering(async () => {
      try {
        const updatePromises = reordered.map((cat, idx) =>
          updateProjectCategory(cat.id, { display_order: idx + 1 })
        );
        await Promise.all(updatePromises);
        if (onRefresh) await onRefresh();
      } catch (err) {
        console.error("Drag reorder failed:", err);
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#1a1a1a]">Project Categories</h2>
          <p className="text-sm text-[#1a1a1a]/60 mt-0.5">
            Organize and arrange portfolio project categories for showcase and gallery filtering.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-full bg-[#b38b4d] hover:bg-[#967440] text-white text-sm font-semibold px-5 py-2.5 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" /> Add Category
        </button>
      </div>

      {/* Categories Table / List */}
      {categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#b38b4d]/30 bg-white/70 p-12 text-center">
          <FolderTree className="mx-auto h-10 w-10 text-[#b38b4d]/40 mb-3" />
          <p className="text-base font-semibold text-[#1a1a1a]">No project categories yet</p>
          <p className="text-sm text-[#1a1a1a]/50 mt-1 max-w-sm mx-auto">
            Create your first project category to start organizing your installation and portfolio gallery.
          </p>
          <button
            type="button"
            onClick={openAddModal}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#b38b4d] text-white text-sm font-semibold px-5 py-2 hover:bg-[#967440] transition-colors"
          >
            <PlusCircle className="h-4 w-4" /> Add First Category
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#b38b4d]/20 bg-white/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#b38b4d]/15 bg-[#b38b4d]/5 text-xs font-semibold uppercase tracking-wider text-[#967440]">
                  <th className="py-3.5 pl-4 pr-2 w-12 text-center">Order</th>
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4 w-28 text-center">Display Order</th>
                  <th className="py-3.5 pr-4 pl-2 text-right w-44">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#b38b4d]/10 text-sm">
                {categories.map((cat, index) => {
                  const isFirst = index === 0;
                  const isLast = index === categories.length - 1;
                  const isDragging = draggedIndex === index;

                  return (
                    <tr
                      key={cat.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(index)}
                      className={`transition-colors hover:bg-[#b38b4d]/5 ${
                        isDragging ? "opacity-40 bg-[#b38b4d]/10" : ""
                      }`}
                    >
                      {/* Reorder controls */}
                      <td className="py-3 pl-4 pr-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span
                            className="cursor-grab active:cursor-grabbing text-stone-400 hover:text-[#967440] p-0.5"
                            title="Drag to reorder"
                          >
                            <GripVertical className="h-4 w-4" />
                          </span>
                          <div className="flex flex-col -space-y-1">
                            <button
                              type="button"
                              onClick={() => handleMove(index, -1)}
                              disabled={isFirst || isReordering}
                              title="Move up"
                              className="p-0.5 text-stone-400 hover:text-[#b38b4d] disabled:opacity-20 disabled:hover:text-stone-400 cursor-pointer disabled:cursor-not-allowed"
                            >
                              <ChevronUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMove(index, 1)}
                              disabled={isLast || isReordering}
                              title="Move down"
                              className="p-0.5 text-stone-400 hover:text-[#b38b4d] disabled:opacity-20 disabled:hover:text-stone-400 cursor-pointer disabled:cursor-not-allowed"
                            >
                              <ChevronDown className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Category Name */}
                      <td className="py-3 px-4 font-semibold text-[#1a1a1a]">
                        {cat.name}
                      </td>

                      {/* Slug */}
                      <td className="py-3 px-4">
                        <span className="font-mono text-xs text-[#1a1a1a]/60 bg-stone-100 rounded-md px-2 py-1">
                          {cat.slug}
                        </span>
                      </td>

                      {/* Display Order Number */}
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center justify-center min-w-[28px] h-7 rounded-full bg-[#b38b4d]/10 text-xs font-semibold text-[#967440] px-2">
                          #{cat.display_order ?? index + 1}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 pr-4 pl-2 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(cat)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#967440] border border-[#b38b4d]/30 rounded-full px-3 py-1.5 hover:bg-[#b38b4d]/10 transition-colors cursor-pointer"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingCategory(cat)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-full px-3 py-1.5 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-[#b38b4d]/20 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#b38b4d]/15 pb-3">
              <h3 className="text-lg font-semibold text-[#1a1a1a]">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalError && (
              <div className="mt-4 flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="mt-5 space-y-4">
              {/* Category Name */}
              <div>
                <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Luxury Living Rooms"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full rounded-xl border border-[#e5e0d8] bg-white px-3.5 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
                />
              </div>

              {/* Slug */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#1a1a1a]">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-[#1a1a1a]/50">
                    Auto-generated from name
                  </span>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. luxury-living-rooms"
                  value={formData.slug}
                  onChange={handleSlugChange}
                  className="w-full font-mono rounded-xl border border-[#e5e0d8] bg-white px-3.5 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({ ...formData, display_order: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#e5e0d8] bg-white px-3.5 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
                />
                <p className="text-[11px] text-[#1a1a1a]/50 mt-1">
                  Lower numbers appear first in lists and galleries.
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#b38b4d]/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={isSubmitting}
                  className="rounded-full border border-stone-300 px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-[#b38b4d] hover:bg-[#967440] text-white font-semibold px-5 py-2 text-xs transition-colors disabled:opacity-60 shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {editingCategory ? "Update Category" : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-red-200 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#1a1a1a]">Delete Category</h3>
                <p className="text-xs text-[#1a1a1a]/50">Permanent action</p>
              </div>
            </div>

            <div className="space-y-2 py-2 text-sm text-[#1a1a1a]/70">
              <p>
                Are you sure you want to delete category{" "}
                <span className="font-semibold text-[#1a1a1a]">
                  &ldquo;{deletingCategory.name}&rdquo;
                </span>
                ?
              </p>
              <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 font-medium">
                ⚠️ Warning: This will permanently delete all projects and gallery images
                belonging to this category, as category deletion cascades.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                disabled={isDeleting}
                className="rounded-full border border-stone-300 px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCategory}
                disabled={isDeleting}
                className="rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 text-xs transition-colors disabled:opacity-60 shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
              >
                {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
