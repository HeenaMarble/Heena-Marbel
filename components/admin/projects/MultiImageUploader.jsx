"use client";

import { useState, useRef } from "react";
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  FileImage,
} from "lucide-react";
import { getImageKitAuthParams } from "@/actions/upload";
import { createProject } from "@/lib/actions/project-actions";

export default function MultiImageUploader({
  categoryId,
  categoryName,
  startDisplayOrder = 1,
  onComplete,
  onCancel,
  folder = "projects",
}) {
  const [filesQueue, setFilesQueue] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [overallProgress, setOverallProgress] = useState({ current: 0, total: 0 });
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef(null);

  // When files are selected from input or dropzone
  function handleSelectFiles(selectedFiles) {
    if (!selectedFiles || selectedFiles.length === 0) return;
    setErrorMsg("");

    const newItems = Array.from(selectedFiles).map((file, idx) => ({
      id: `${Date.now()}-${idx}-${file.name}`,
      file,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      previewUrl: URL.createObjectURL(file),
      status: "pending", // pending | uploading | success | error
      error: null,
    }));

    setFilesQueue((prev) => [...prev, ...newItems]);
  }

  function handleRemoveFromQueue(id) {
    if (isUploading) return;
    setFilesQueue((prev) => prev.filter((item) => item.id !== id));
  }

  function handleDrop(e) {
    e.preventDefault();
    if (isUploading) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleSelectFiles(e.dataTransfer.files);
    }
  }

  // Start uploading all pending files sequentially
  async function handleStartUpload() {
    const pendingItems = filesQueue.filter((item) => item.status === "pending");
    if (pendingItems.length === 0) return;

    setIsUploading(true);
    setErrorMsg("");
    setOverallProgress({ current: 0, total: pendingItems.length });

    let currentOrder = startDisplayOrder;
    let uploadedCount = 0;

    for (let i = 0; i < pendingItems.length; i++) {
      const item = pendingItems[i];

      // Mark as uploading
      setFilesQueue((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: "uploading" } : f))
      );

      try {
        // 1. Get ImageKit auth params
        const auth = await getImageKitAuthParams();

        // 2. Upload file to ImageKit
        const formData = new FormData();
        formData.append("file", item.file);
        formData.append("fileName", item.file.name);
        formData.append("folder", folder);
        formData.append(
          "publicKey",
          process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ""
        );
        formData.append("signature", auth.signature);
        formData.append("expire", auth.expire);
        formData.append("token", auth.token);

        const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Upload failed");

        // 3. Save into Supabase projects table
        await createProject({
          category_id: categoryId,
          image_url: data.url,
          display_order: currentOrder++,
        });

        uploadedCount++;
        setFilesQueue((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, status: "success" } : f))
        );
      } catch (err) {
        console.error(`Failed to upload ${item.name}:`, err);
        setFilesQueue((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? { ...f, status: "error", error: err.message || "Upload failed" }
              : f
          )
        );
      }

      setOverallProgress({ current: i + 1, total: pendingItems.length });
    }

    setIsUploading(false);

    if (uploadedCount > 0 && onComplete) {
      setTimeout(() => {
        onComplete(uploadedCount);
      }, 700);
    }
  }

  const allCompleted =
    filesQueue.length > 0 &&
    filesQueue.every((f) => f.status === "success" || f.status === "error");

  const successCount = filesQueue.filter((f) => f.status === "success").length;

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => {
          if (!isUploading && inputRef.current) inputRef.current.click();
        }}
        className={`rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
          isUploading
            ? "border-stone-200 bg-stone-50 cursor-not-allowed opacity-60"
            : "border-[#b38b4d]/40 bg-[#b38b4d]/5 hover:bg-[#b38b4d]/10 hover:border-[#b38b4d]"
        }`}
      >
        <UploadCloud className="mx-auto h-10 w-10 text-[#b38b4d] mb-2" />
        <p className="text-sm font-semibold text-[#1a1a1a]">
          Click to choose images or drag &amp; drop multiple files
        </p>
        <p className="text-xs text-[#1a1a1a]/50 mt-1">
          Supports PNG, JPG, WebP. Select multiple photos at once.
        </p>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          disabled={isUploading}
          onChange={(e) => handleSelectFiles(e.target.files)}
        />
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Progress Bar (Visible while uploading) */}
      {isUploading && (
        <div className="rounded-xl bg-stone-100 p-3.5 space-y-2 border border-stone-200">
          <div className="flex items-center justify-between text-xs font-semibold text-[#1a1a1a]">
            <span className="flex items-center gap-1.5 text-[#967440]">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Uploading photos ({overallProgress.current} / {overallProgress.total})
            </span>
            <span className="font-mono">
              {Math.round((overallProgress.current / overallProgress.total) * 100)}%
            </span>
          </div>
          <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#b38b4d] h-full transition-all duration-300 rounded-full"
              style={{
                width: `${(overallProgress.current / overallProgress.total) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Selected Files Queue List */}
      {filesQueue.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#967440]">
              Queue ({filesQueue.length} {filesQueue.length === 1 ? "file" : "files"})
            </span>
            {successCount > 0 && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> {successCount} uploaded
              </span>
            )}
          </div>

          <div
            className="max-h-56 overflow-y-auto space-y-1.5 pr-1 rounded-xl border border-stone-200 bg-white/70 p-2"
            style={{ scrollbarWidth: "thin" }}
          >
            {filesQueue.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-2 rounded-lg bg-white border border-stone-100 shadow-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-10 w-10 rounded-md overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    <img
                      src={item.previewUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#1a1a1a] truncate max-w-[200px] sm:max-w-[240px]">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-[#1a1a1a]/40">{item.size}</p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {item.status === "pending" && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFromQueue(item.id)}
                      disabled={isUploading}
                      className="text-stone-400 hover:text-red-500 p-1 rounded transition-colors disabled:opacity-30 cursor-pointer"
                      title="Remove"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}

                  {item.status === "uploading" && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-[#b38b4d]">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading
                    </span>
                  )}

                  {item.status === "success" && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" /> Done
                    </span>
                  )}

                  {item.status === "error" && (
                    <span
                      className="flex items-center gap-1 text-[11px] font-semibold text-red-500"
                      title={item.error}
                    >
                      <AlertCircle className="h-4 w-4" /> Error
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Actions */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={isUploading}
          className="rounded-full border border-stone-300 px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {allCompleted ? "Close" : "Cancel"}
        </button>

        {filesQueue.some((f) => f.status === "pending") && (
          <button
            type="button"
            onClick={handleStartUpload}
            disabled={isUploading}
            className="rounded-full bg-[#b38b4d] hover:bg-[#967440] text-white font-semibold px-5 py-2 text-xs transition-colors disabled:opacity-60 shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud className="h-4 w-4" />
                Upload {filesQueue.filter((f) => f.status === "pending").length}{" "}
                {filesQueue.filter((f) => f.status === "pending").length === 1
                  ? "Image"
                  : "Images"}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
