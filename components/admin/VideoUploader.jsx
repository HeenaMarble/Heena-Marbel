"use client";

import { useState, useRef } from "react";
import { Upload, Loader2, Video, AlertCircle } from "lucide-react";
import { getImageKitAuthParams } from "@/actions/upload";

export default function VideoUploader({
  onUploadComplete,
  folder = "/heena-marble/hero",
  disabled = false,
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  async function processFile(file) {
    if (!file) return;

    // Validate video type
    const isVideo =
      file.type.startsWith("video/") ||
      /\.(mp4|webm|ogg|mov|m4v)$/i.test(file.name);

    if (!isVideo) {
      setError("Please select a valid video file (.mp4, .webm, .mov, etc.)");
      return;
    }

    // Limit size to 50MB for sane upload & web performance
    const MAX_SIZE_MB = 50;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(
        `Video file is too large (${(file.size / (1024 * 1024)).toFixed(
          1
        )} MB). Please choose a video under ${MAX_SIZE_MB} MB.`
      );
      return;
    }

    setUploading(true);
    setProgress(0);
    setError("");

    try {
      const auth = await getImageKitAuthParams();
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("folder", folder);
      formData.append(
        "publicKey",
        process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ""
      );
      formData.append("signature", auth.signature);
      formData.append("expire", auth.expire);
      formData.append("token", auth.token);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "https://upload.imagekit.io/api/v1/files/upload");

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300 && data.url) {
            onUploadComplete?.(data.url);
          } else {
            setError(data.message || "Upload to ImageKit failed.");
          }
        } catch (err) {
          setError("Failed to parse response from upload server.");
        } finally {
          setUploading(false);
          setProgress(0);
          if (inputRef.current) inputRef.current.value = "";
        }
      };

      xhr.onerror = () => {
        setError("Network error occurred while uploading the video.");
        setUploading(false);
        setProgress(0);
        if (inputRef.current) inputRef.current.value = "";
      };

      xhr.send(formData);
    } catch (err) {
      setError(err.message || "Failed to initialize video upload.");
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    if (disabled || uploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  function handleDragOver(e) {
    e.preventDefault();
    if (!disabled && !uploading) {
      setDragOver(true);
    }
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setDragOver(false);
  }

  return (
    <div className="w-full space-y-3">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => {
          if (!uploading && !disabled && inputRef.current) {
            inputRef.current.click();
          }
        }}
        className={`relative flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
          dragOver
            ? "border-[#b38b4d] bg-[#b38b4d]/10"
            : "border-[#b38b4d]/30 hover:border-[#b38b4d]/60 hover:bg-[#b38b4d]/5 bg-white/40"
        } ${uploading || disabled ? "pointer-events-none opacity-80" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading || disabled}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3 py-4 w-full max-w-xs text-center">
            <Loader2 className="h-8 w-8 text-[#b38b4d] animate-spin" />
            <div className="w-full">
              <div className="flex justify-between text-xs font-semibold text-[#1a1a1a]/70 mb-1.5">
                <span>Uploading video to ImageKit...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-[#b38b4d]/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#b38b4d] transition-all duration-150 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-[#1a1a1a]/50">
              Please wait while your video is processed and uploaded.
            </p>
          </div>
        ) : (
          <>
            <div className="p-3.5 rounded-full bg-[#b38b4d]/10 text-[#b38b4d]">
              <Upload className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[#1a1a1a]">
                Click or drag & drop video to upload
              </p>
              <p className="text-xs text-[#1a1a1a]/50 mt-1">
                MP4, WebM, MOV supported (up to 50MB)
              </p>
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
