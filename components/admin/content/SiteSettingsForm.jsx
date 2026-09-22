"use client";

import { useState, useTransition } from "react";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Navigation,
  Sparkles,
  FileText,
  Copyright,
  CheckCircle2,
  AlertCircle,
  Save,
} from "lucide-react";
import { updateSiteSettings } from "@/lib/actions/content-actions";

function InstagramIcon({ className = "h-3.5 w-3.5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className = "h-3.5 w-3.5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export default function SiteSettingsForm({ initialData = null }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    phone: initialData?.phone || "",
    whatsapp_number: initialData?.whatsapp_number || "",
    email: initialData?.email || "",
    address: initialData?.address || "",
    business_hours: initialData?.business_hours || "",
    maps_query: initialData?.maps_query || "",
    instagram_url: initialData?.instagram_url || "",
    facebook_url: initialData?.facebook_url || "",
    footer_tagline: initialData?.footer_tagline || "",
    footer_strip_text: initialData?.footer_strip_text || "",
    copyright_name: initialData?.copyright_name || "Heena Marble",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    startTransition(async () => {
      try {
        const payload = {
          phone: formData.phone.trim() || null,
          whatsapp_number: formData.whatsapp_number.trim() || null,
          email: formData.email.trim() || null,
          address: formData.address.trim() || null,
          business_hours: formData.business_hours.trim() || null,
          maps_query: formData.maps_query.trim() || null,
          instagram_url: formData.instagram_url.trim() || null,
          facebook_url: formData.facebook_url.trim() || null,
          footer_tagline: formData.footer_tagline.trim() || null,
          footer_strip_text: formData.footer_strip_text.trim() || null,
          copyright_name: formData.copyright_name.trim() || null,
        };

        await updateSiteSettings(payload);
        setSuccess(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => setSuccess(false), 4000);
      } catch (err) {
        setError(err.message || "Failed to save site settings.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-16">
      {/* Notifications */}
      {success && (
        <div className="flex items-center gap-2 text-sm text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-xl p-4 shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>Site settings successfully updated and saved to database!</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-800 bg-red-50 border border-red-300 rounded-xl p-4 shadow-sm">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* SECTION 1: CONTACT & STORE INFORMATION */}
      <div className="rounded-2xl border border-[#b38b4d]/20 bg-white/95 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-[#b38b4d]/15 pb-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#b38b4d]/10 text-[#b38b4d]">
            <Phone className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#1a1a1a]">
              Contact & Location Details
            </h2>
            <p className="text-xs text-[#1a1a1a]/50">
              Customer contact numbers, address, and showroom operational hours.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5 flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-[#b38b4d]" /> Primary Phone Number
            </label>
            <input
              type="text"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full rounded-xl border border-[#e5e0d8] bg-white px-3.5 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5 flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5 text-emerald-600" /> WhatsApp Number
            </label>
            <input
              type="text"
              placeholder="+91 98765 43210"
              value={formData.whatsapp_number}
              onChange={(e) => handleChange("whatsapp_number", e.target.value)}
              className="w-full rounded-xl border border-[#e5e0d8] bg-white px-3.5 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-[#b38b4d]" /> Email Address
            </label>
            <input
              type="email"
              placeholder="contact@heenamarble.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full rounded-xl border border-[#e5e0d8] bg-white px-3.5 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
            />
          </div>

          {/* Business Hours */}
          <div>
            <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#b38b4d]" /> Business Hours
            </label>
            <input
              type="text"
              placeholder="Mon – Sat: 9:00 AM – 8:00 PM"
              value={formData.business_hours}
              onChange={(e) => handleChange("business_hours", e.target.value)}
              className="w-full rounded-xl border border-[#e5e0d8] bg-white px-3.5 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
            />
          </div>

          {/* Address */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#b38b4d]" /> Physical Address / Showroom Location
            </label>
            <textarea
              rows={2}
              placeholder="Heena Marble & Granites, Makrana Road, Kishangarh, Rajasthan 305801"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full rounded-xl border border-[#e5e0d8] bg-white px-3.5 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
            />
          </div>

          {/* Maps Query */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5 flex items-center gap-1.5">
              <Navigation className="h-3.5 w-3.5 text-[#b38b4d]" /> Google Maps Query / Embed String
            </label>
            <input
              type="text"
              placeholder="Heena Marble Kishangarh or https://maps.google.com/?q=..."
              value={formData.maps_query}
              onChange={(e) => handleChange("maps_query", e.target.value)}
              className="w-full rounded-xl border border-[#e5e0d8] bg-white px-3.5 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: SOCIAL MEDIA CHANNELS */}
      <div className="rounded-2xl border border-[#b38b4d]/20 bg-white/95 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-[#b38b4d]/15 pb-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#b38b4d]/10 text-[#b38b4d]">
            <InstagramIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#1a1a1a]">
              Social Media Links
            </h2>
            <p className="text-xs text-[#1a1a1a]/50">
              Links to official social channels displayed on header and footer.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Instagram */}
          <div>
            <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5 flex items-center gap-1.5">
              <InstagramIcon className="h-3.5 w-3.5 text-pink-600" /> Instagram Profile URL
            </label>
            <input
              type="url"
              placeholder="https://instagram.com/heenamarble"
              value={formData.instagram_url}
              onChange={(e) => handleChange("instagram_url", e.target.value)}
              className="w-full rounded-xl border border-[#e5e0d8] bg-white px-3.5 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
            />
          </div>

          {/* Facebook */}
          <div>
            <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5 flex items-center gap-1.5">
              <FacebookIcon className="h-3.5 w-3.5 text-blue-600" /> Facebook Page URL
            </label>
            <input
              type="url"
              placeholder="https://facebook.com/heenamarble"
              value={formData.facebook_url}
              onChange={(e) => handleChange("facebook_url", e.target.value)}
              className="w-full rounded-xl border border-[#e5e0d8] bg-white px-3.5 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: FOOTER & BRANDING */}
      <div className="rounded-2xl border border-[#b38b4d]/20 bg-white/95 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-[#b38b4d]/15 pb-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#b38b4d]/10 text-[#b38b4d]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#1a1a1a]">
              Footer & Brand Presentation
            </h2>
            <p className="text-xs text-[#1a1a1a]/50">
              Brand tagline, trust strip copy, and copyright entity.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Tagline */}
          <div>
            <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-[#b38b4d]" /> Footer Tagline / Mission Statement
            </label>
            <textarea
              rows={2}
              placeholder="Curators of exquisite Italian & Indian marble, granites, and bespoke architectural stones."
              value={formData.footer_tagline}
              onChange={(e) => handleChange("footer_tagline", e.target.value)}
              className="w-full rounded-xl border border-[#e5e0d8] bg-white px-3.5 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Strip text */}
            <div>
              <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#b38b4d]" /> Footer Strip Text / Badges
              </label>
              <input
                type="text"
                placeholder="ISO 9001:2015 Certified • Premium Quality • Direct Quarry Imports"
                value={formData.footer_strip_text}
                onChange={(e) => handleChange("footer_strip_text", e.target.value)}
                className="w-full rounded-xl border border-[#e5e0d8] bg-white px-3.5 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
              />
            </div>

            {/* Copyright Name */}
            <div>
              <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5 flex items-center gap-1.5">
                <Copyright className="h-3.5 w-3.5 text-[#b38b4d]" /> Copyright Holder Name
              </label>
              <input
                type="text"
                placeholder="Heena Marble. All rights reserved."
                value={formData.copyright_name}
                onChange={(e) => handleChange("copyright_name", e.target.value)}
                className="w-full rounded-xl border border-[#e5e0d8] bg-white px-3.5 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#b38b4d]/15">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-[#b38b4d] hover:bg-[#967440] text-white font-semibold px-8 py-3 text-sm transition-colors disabled:opacity-60 shadow-md"
        >
          <Save className="h-4 w-4" />
          {pending ? "Saving Settings..." : "Save All Settings"}
        </button>
      </div>
    </form>
  );
}
