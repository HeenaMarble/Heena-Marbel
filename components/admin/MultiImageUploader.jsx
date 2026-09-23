"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, ArrowLeft, ArrowRight, Star } from "lucide-react";
import { getImageKitAuthParams } from "@/actions/upload";

const MAX_IMAGES = 8;

export default function MultiImageUploader({
  value = [],
  onChange,
  folder = "/heena-marble/products",
}) {
  const images = Array.isArray(value) ? value : [];
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [error, setError] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [isDropZoneActive, setIsDropZoneActive] = useState(false);

  const inputRef = useRef(null);

  function moveImage(fromIndex, toIndex) {
    if (toIndex < 0 || toIndex >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onChange(updated);
  }

  function deleteImage(index) {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  }

  // HTML5 Drag-and-drop for reordering
  function handleDragStart(e, index) {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${index}`);
  }

  function handleDragOver(e, index) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  }

  function handleDrop(e, targetIndex) {
    e.preventDefault();
    setDragOverIndex(null);
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }
    const updated = [...images];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, draggedItem);
    setDraggedIndex(null);
    onChange(updated);
  }

  function handleDragEnd() {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }

  // Upload mechanics
  async function uploadFiles(fileList) {
    const files = Array.from(fileList || []).filter((f) =>
      f.type.startsWith("image/")
    );
    if (!files.length) return;

    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) {
      setError(`Maximum limit of ${MAX_IMAGES} images reached.`);
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      setError(
        `Only ${remainingSlots} more image(s) allowed (max ${MAX_IMAGES}).`
      );
    } else {
      setError("");
    }

    setUploading(true);
    setUploadProgress(`Uploading 1 of ${filesToUpload.length}...`);

    const uploadedUrls = [];

    try {
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        setUploadProgress(`Uploading ${i + 1} of ${filesToUpload.length}...`);

        const auth = await getImageKitAuthParams();
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", file.name);
        formData.append("folder", folder);
        formData.append(
          "publicKey",
          process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
        );
        formData.append("signature", auth.signature);
        formData.append("expire", auth.expire);
        formData.append("token", auth.token);

        const res = await fetch(
          "https://upload.imagekit.io/api/v1/files/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || `Upload failed for ${file.name}`);
        }
        uploadedUrls.push(data.url);
      }

      onChange([...images, ...uploadedUrls]);
    } catch (err) {
      setError(err.message || "Upload failed");
      if (uploadedUrls.length > 0) {
        onChange([...images, ...uploadedUrls]);
      }
    } finally {
      setUploading(false);
      setUploadProgress("");
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleFileInputChange(e) {
    uploadFiles(e.target.files);
  }

  // Upload tile drag/drop handler
  function handleTileDragOver(e) {
    e.preventDefault();
    if (e.dataTransfer.types.includes("Files")) {
      setIsDropZoneActive(true);
    }
  }

  function handleTileDragLeave(e) {
    e.preventDefault();
    setIsDropZoneActive(false);
  }

  function handleTileDrop(e) {
    e.preventDefault();
    setIsDropZoneActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  }

  const isLimitReached = images.length >= MAX_IMAGES;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {images.map((url, index) => {
          const isCover = index === 0;
          const isDragging = draggedIndex === index;
          const isOver = dragOverIndex === index;

          return (
            <div
              key={`${url}-${index}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={() => dragOverIndex === index && setDragOverIndex(null)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`group relative aspect-square rounded-xl overflow-hidden border bg-white transition-all select-none ${
                isOver
                  ? "border-[#b38b4d] ring-2 ring-[#b38b4d]/40 scale-[1.02]"
                  : "border-[#b38b4d]/20"
              } ${isDragging ? "opacity-40" : "opacity-100"}`}
            >
              <img
                src={url}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover pointer-events-none"
              />

              {/* Cover badge */}
              {isCover && (
                <span className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-[#b38b4d] text-white text-[11px] font-semibold px-2 py-0.5 rounded shadow">
                  <Star className="h-3 w-3 fill-current" /> Cover
                </span>
              )}

              {/* Delete button */}
              <button
                type="button"
                onClick={() => deleteImage(index)}
                title="Remove image"
                className="absolute top-2 right-2 z-10 h-7 w-7 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors shadow"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Bottom controls bar (Reordering arrows & Set Cover) */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent p-1.5 flex items-center justify-between opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveImage(index, index - 1)}
                    title="Move earlier"
                    className="h-6 w-6 rounded bg-white/20 hover:bg-white/40 text-white flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === images.length - 1}
                    onClick={() => moveImage(index, index + 1)}
                    title="Move later"
                    className="h-6 w-6 rounded bg-white/20 hover:bg-white/40 text-white flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {!isCover && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, 0)}
                    title="Make this the cover image"
                    className="text-[10px] font-medium text-white/90 hover:text-white bg-white/20 hover:bg-[#b38b4d] px-2 py-0.5 rounded transition-colors"
                  >
                    Make Cover
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Upload More Tile */}
        {!isLimitReached ? (
          <label
            onDragOver={handleTileDragOver}
            onDragLeave={handleTileDragLeave}
            onDrop={handleTileDrop}
            className={`flex flex-col items-center justify-center gap-2 aspect-square rounded-xl border-2 border-dashed transition-all cursor-pointer ${
              isDropZoneActive
                ? "border-[#b38b4d] bg-[#b38b4d]/10 scale-[1.01]"
                : "border-[#b38b4d]/30 hover:border-[#b38b4d]/60 hover:bg-[#b38b4d]/5"
            } ${uploading ? "pointer-events-none opacity-80" : ""}`}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-1.5 p-2 text-center">
                <Loader2 className="h-6 w-6 text-[#967440] animate-spin" />
                <span className="text-xs font-medium text-[#1a1a1a]/70">
                  {uploadProgress || "Uploading..."}
                </span>
              </div>
            ) : (
              <>
                <Upload className="h-6 w-6 text-[#967440]" />
                <div className="text-center px-2">
                  <span className="text-xs font-semibold text-[#1a1a1a]">
                    Upload Images
                  </span>
                  <p className="text-[11px] text-[#1a1a1a]/50 mt-0.5">
                    Click or drag ({images.length}/{MAX_IMAGES})
                  </p>
                </div>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileInputChange}
              disabled={uploading}
            />
          </label>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1 aspect-square rounded-xl border border-dashed border-[#e5e0d8] bg-gray-50/70 p-3 text-center">
            <span className="text-xs font-medium text-[#1a1a1a]/40">
              Max {MAX_IMAGES} images reached
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-[#1a1a1a]/55">
        <p>Drag or use arrows to reorder. The first image is the cover image.</p>
        <p>
          {images.length} / {MAX_IMAGES} images
        </p>
      </div>

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}
