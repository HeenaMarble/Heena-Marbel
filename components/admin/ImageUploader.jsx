"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { getImageKitAuthParams } from "@/actions/upload";

export default function ImageUploader({ value, onChange, folder = "/heena-marble" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");

    try {
      const auth = await getImageKitAuthParams();
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("folder", folder);
      formData.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY);
      formData.append("signature", auth.signature);
      formData.append("expire", auth.expire);
      formData.append("token", auth.token);

      const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      onChange(data.url);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      {value ? (
        <div className="relative w-full max-w-xs">
          <img src={value} alt="" className="w-full aspect-square object-cover rounded-xl border border-[#b38b4d]/20" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 h-7 w-7 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-2 w-full max-w-xs aspect-square rounded-xl border-2 border-dashed border-[#b38b4d]/30 cursor-pointer hover:bg-[#b38b4d]/5 transition-colors">
          {uploading ? (
            <Loader2 className="h-6 w-6 text-[#967440] animate-spin" />
          ) : (
            <>
              <Upload className="h-6 w-6 text-[#967440]" />
              <span className="text-sm font-medium text-[#1a1a1a]/60">Click to upload</span>
            </>
          )}
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
