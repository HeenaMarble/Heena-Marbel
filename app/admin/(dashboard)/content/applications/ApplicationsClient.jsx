"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  createApplication,
  updateApplication,
  deleteApplication,
  updateApplicationsTagline,
} from "@/lib/actions/content-actions";

export default function ApplicationsClient({ initialApplications = [], initialTagline = "" }) {
  const [applications, setApplications] = useState(initialApplications);
  const [tagline, setTagline] = useState(initialTagline);
  const [taglineDraft, setTaglineDraft] = useState(initialTagline);
  const [savingTagline, setSavingTagline] = useState(false);
  const [taglineMsg, setTaglineMsg] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function resetForm() {
    setShowForm(false);
    setEditingId(null);
    setTitle("");
    setImageUrl("");
    setError("");
  }

  function startEdit(app) {
    setEditingId(app.id);
    setTitle(app.title);
    setImageUrl(app.image_url);
    setShowForm(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        if (editingId) {
          await updateApplication(editingId, { title, image_url: imageUrl });
          setApplications((prev) =>
            prev.map((a) =>
              a.id === editingId ? { ...a, title, image_url: imageUrl } : a
            )
          );
        } else {
          await createApplication({ title, image_url: imageUrl });
          // Simplest reliable way to reflect server-assigned id/order: reload
          window.location.reload();
          return;
        }
        resetForm();
      } catch (err) {
        setError(err.message || "Something went wrong");
      }
    });
  }

  function handleDelete(id) {
    if (!confirm("Delete this application card?")) return;
    startTransition(async () => {
      try {
        await deleteApplication(id);
        setApplications((prev) => prev.filter((a) => a.id !== id));
      } catch (err) {
        alert(err.message || "Delete failed");
      }
    });
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a1a]">Our Applications</h1>
          <p className="text-sm text-[#666]">
            Cards shown on the homepage &quot;Our Applications&quot; section.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#b38b4d] text-white font-medium hover:bg-[#967440] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Application
        </button>
      </div>

      <div className="mb-8 p-4 border border-[#b38b4d]/25 rounded-xl bg-white">
        <label className="block text-sm font-medium text-[#1a1a1a] mb-1">
          Homepage tagline
        </label>
        <p className="text-xs text-[#666] mb-2">
          Shown under the &quot;Our Applications&quot; heading on the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={taglineDraft}
            onChange={(e) => setTaglineDraft(e.target.value)}
            className="flex-1 px-3 py-2 border border-[#b38b4d]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b38b4d]/40"
          />
          <button
            type="button"
            disabled={savingTagline || !taglineDraft.trim() || taglineDraft === tagline}
            onClick={() => {
              setSavingTagline(true);
              setTaglineMsg("");
              updateApplicationsTagline(taglineDraft)
                .then(() => {
                  setTagline(taglineDraft);
                  setTaglineMsg("Saved");
                })
                .catch((err) => setTaglineMsg(err.message || "Failed to save"))
                .finally(() => setSavingTagline(false));
            }}
            className="px-4 py-2 rounded-lg bg-[#1a1a1a] text-white font-medium disabled:opacity-50 whitespace-nowrap"
          >
            {savingTagline ? "Saving..." : "Save"}
          </button>
        </div>
        {taglineMsg && (
          <p className={`mt-2 text-sm ${taglineMsg === "Saved" ? "text-green-600" : "text-red-600"}`}>
            {taglineMsg}
          </p>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-5 border border-[#b38b4d]/25 rounded-xl bg-white"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-[#1a1a1a]">
              {editingId ? "Edit Application" : "New Application"}
            </h2>
            <button type="button" onClick={resetForm} className="text-[#666] hover:text-black">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Temples"
                required
                className="w-full px-3 py-2 border border-[#b38b4d]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b38b4d]/40"
              />

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={isPending || !title || !imageUrl}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a1a] text-white font-medium disabled:opacity-50"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingId ? "Save Changes" : "Add Card"}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Image</label>
              <ImageUploader value={imageUrl} onChange={setImageUrl} folder="/heena-marble/applications" />
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {applications.map((app) => (
          <div
            key={app.id}
            className="rounded-xl overflow-hidden border border-[#b38b4d]/20 bg-white shadow-sm flex flex-col justify-between"
          >
            <img src={app.image_url} alt={app.title} className="w-full aspect-square object-cover" />
            <div className="p-3 flex items-center justify-between gap-2 bg-white">
              <p className="font-medium text-[#1a1a1a] text-sm truncate" title={app.title}>
                {app.title}
              </p>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => startEdit(app)}
                  className="p-1.5 rounded-md text-[#666] hover:text-[#1a1a1a] hover:bg-[#f5f0e8] transition-colors"
                  title="Edit"
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(app.id)}
                  className="p-1.5 rounded-md text-[#666] hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {applications.length === 0 && !showForm && (
        <p className="text-center text-[#666] py-12">No application cards yet — add your first one.</p>
      )}
    </div>
  );
}
