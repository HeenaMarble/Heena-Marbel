"use client";

import { useState, useTransition } from "react";
import {
  Pencil,
  Check,
  X,
  AlertCircle,
  Award,
  Users,
  CheckCircle2,
  Clock,
  MapPin,
  Globe,
  Building,
  Star,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { updateStat } from "@/lib/actions/content-actions";

const ICON_OPTIONS = [
  { key: "check", label: "Checkmark", icon: CheckCircle2 },
  { key: "users", label: "Happy Clients / Users", icon: Users },
  { key: "award", label: "Award / Quality", icon: Award },
  { key: "clock", label: "Clock / Experience", icon: Clock },
  { key: "map-pin", label: "Map Pin / Location", icon: MapPin },
  { key: "globe", label: "Globe / Pan-India", icon: Globe },
  { key: "building", label: "Building / Architecture", icon: Building },
  { key: "shield", label: "Shield / Trust", icon: ShieldCheck },
  { key: "star", label: "Star / Rating", icon: Star },
  { key: "sparkles", label: "Sparkles / Luxury", icon: Sparkles },
];

function renderStatIcon(key, className = "h-6 w-6 text-[#b38b4d]") {
  const match = ICON_OPTIONS.find((opt) => opt.key === key?.toLowerCase());
  if (match) {
    const IconComponent = match.icon;
    return <IconComponent className={className} />;
  }
  return <Award className={className} />;
}

export default function StatCard({ stat, index }) {
  const [isEditing, setIsEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    icon_key: stat.icon_key || "check",
    number: stat.number || "",
    label: stat.label || "",
  });

  const handleSave = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.number.trim()) {
      setError("Please provide a number (e.g., 500+).");
      return;
    }
    if (!formData.label.trim()) {
      setError("Please provide a label (e.g., Projects Completed).");
      return;
    }

    startTransition(async () => {
      try {
        await updateStat(stat.id, {
          icon_key: formData.icon_key.trim(),
          number: formData.number.trim(),
          label: formData.label.trim(),
        });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        setIsEditing(false);
      } catch (err) {
        setError(err.message || "Failed to update stat.");
      }
    });
  };

  const handleCancel = () => {
    setFormData({
      icon_key: stat.icon_key || "check",
      number: stat.number || "",
      label: stat.label || "",
    });
    setError("");
    setIsEditing(false);
  };

  return (
    <div className="rounded-2xl border border-[#b38b4d]/20 bg-white/90 p-5 md:p-6 shadow-sm transition-all hover:border-[#b38b4d]/40 flex flex-col justify-between">
      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#b38b4d]/15 pb-3">
            <span className="text-xs font-semibold text-[#b38b4d] uppercase tracking-wider">
              Editing Stat #{index + 1}
            </span>
            <button
              type="button"
              onClick={handleCancel}
              className="text-stone-400 hover:text-stone-600 p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          {/* Icon Key Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">
              Icon Key
            </label>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-stone-50 border border-stone-200 shrink-0">
                {renderStatIcon(formData.icon_key, "h-5 w-5 text-[#b38b4d]")}
              </div>
              <select
                value={formData.icon_key}
                onChange={(e) => setFormData({ ...formData, icon_key: e.target.value })}
                className="w-full rounded-xl border border-[#e5e0d8] bg-white px-3.5 py-2 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
              >
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label} ({opt.key})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stat Number */}
          <div>
            <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">
              Stat Metric / Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 500+, 25 Years, 100%"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              className="w-full rounded-xl border border-[#e5e0d8] bg-white px-3.5 py-2 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
            />
          </div>

          {/* Label */}
          <div>
            <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">
              Stat Label <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Projects Completed, Happy Clients"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="w-full rounded-xl border border-[#e5e0d8] bg-white px-3.5 py-2 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#b38b4d]/10">
            <button
              type="button"
              onClick={handleCancel}
              disabled={pending}
              className="rounded-full border border-stone-300 px-4 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-[#b38b4d] hover:bg-[#967440] text-white font-semibold px-5 py-1.5 text-xs transition-colors disabled:opacity-60 shadow-sm"
            >
              {pending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col h-full justify-between">
          <div>
            {/* Header Badge & Edit button */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center text-xs font-semibold text-[#b38b4d] bg-[#b38b4d]/10 rounded-full px-2.5 py-0.5">
                Stat #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#967440] border border-[#b38b4d]/30 rounded-full px-3 py-1 hover:bg-[#b38b4d]/10 transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
            </div>

            {/* Icon Preview */}
            <div className="h-12 w-12 rounded-2xl bg-[#b38b4d]/10 border border-[#b38b4d]/20 flex items-center justify-center mb-4">
              {renderStatIcon(stat.icon_key, "h-6 w-6 text-[#b38b4d]")}
            </div>

            {/* Stat Number & Label */}
            <p className="text-3xl font-bold tracking-tight text-[#1a1a1a] mb-1">
              {stat.number || "—"}
            </p>
            <p className="text-sm font-medium text-[#1a1a1a]/60">
              {stat.label || "Untitled Stat"}
            </p>
            <p className="text-xs text-stone-400 mt-2">
              Icon Key: <code className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-600">{stat.icon_key || "check"}</code>
            </p>
          </div>

          {/* Success message */}
          {success && (
            <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">
              <Check className="h-3.5 w-3.5" /> Updated successfully!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
