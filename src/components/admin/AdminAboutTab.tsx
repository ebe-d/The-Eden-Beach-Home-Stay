"use client";

import { useState } from "react";
import { Loader2, Plus, Save, Sparkles, Trash2 } from "lucide-react";
import type { PublicAboutContent, PublicMediaItem } from "@/db/defaults";

export function AdminAboutTab({
  initialAbout,
  mediaItems,
  onFeedback,
}: {
  initialAbout: PublicAboutContent;
  mediaItems: PublicMediaItem[];
  onFeedback: (msg: string, isError?: boolean) => void;
}) {
  const [about, setAbout] = useState<PublicAboutContent>(initialAbout);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  function updateField<K extends keyof PublicAboutContent>(
    key: K,
    val: PublicAboutContent[K]
  ) {
    setAbout((prev) => ({ ...prev, [key]: val }));
    setDirty(true);
  }

  function addHighlight() {
    const next = [
      ...about.highlights,
      { title: "New Feature", desc: "Short highlight description" },
    ];
    updateField("highlights", next);
  }

  function removeHighlight(idx: number) {
    updateField(
      "highlights",
      about.highlights.filter((_, i) => i !== idx)
    );
  }

  function updateHighlight(idx: number, patch: { title?: string; desc?: string }) {
    const next = [...about.highlights];
    next[idx] = { ...next[idx], ...patch };
    updateField("highlights", next);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(about),
      });
      const data = await res.json();
      if (!res.ok) {
        onFeedback(data.error || "Failed to save about content.", true);
        return;
      }
      setAbout(data.about);
      setDirty(false);
      onFeedback("About Us content updated persistently!");
    } catch {
      onFeedback("Network error.", true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-eden-line/60 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C5A059]">
            <Sparkles className="h-3.5 w-3.5" />
            Story & Heritage
          </span>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-eden-ink">
            About Us Editor
          </h1>
          <p className="text-xs sm:text-sm text-eden-muted">
            Customize the homestay narrative, founding vision, shoreline setting, and host hospitality highlights.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {dirty && (
            <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-700">
              Unsaved changes
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !dirty}
            className="canva-btn-camel flex items-center gap-1.5 text-xs disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>Save About Us</span>
          </button>
        </div>
      </div>

      <div className="glass-card rounded-[28px] p-6 sm:p-8 border border-eden-line/60 space-y-6">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-eden-soft">
            About Section Heading *
          </label>
          <input
            type="text"
            value={about.heading}
            onChange={(e) => updateField("heading", e.target.value)}
            className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm font-semibold text-eden-ink outline-none focus:border-[#C5A059]"
            placeholder="Hospitality Rooted in the Rhythm of the Arabian Sea"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-eden-soft">
            Short Introduction *
          </label>
          <input
            type="text"
            value={about.intro}
            onChange={(e) => updateField("intro", e.target.value)}
            className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none focus:border-[#C5A059]"
            placeholder="The Eden Beach Home Stay was created to offer travelers an unhurried, peaceful coastal sanctuary..."
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-eden-soft">
            Full Narrative Story *
          </label>
          <textarea
            rows={5}
            value={about.fullDescription}
            onChange={(e) => updateField("fullDescription", e.target.value)}
            className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none focus:border-[#C5A059]"
            placeholder="Located at the intersection of Bailur Beach Road, our homestay provides an intimate beachfront setting..."
          />
        </div>

        {/* Highlights List */}
        <div className="pt-4 border-t border-eden-line/60 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-eden-ink">
              Hospitality Highlights ({about.highlights.length})
            </h3>
            <button
              type="button"
              onClick={addHighlight}
              className="inline-flex items-center gap-1 rounded-full bg-eden-inset px-3 py-1 text-xs font-bold text-eden-ink hover:bg-eden-surface border border-eden-line"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Highlight</span>
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {about.highlights.map((h, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-eden-line/60 bg-eden-inset p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={h.title}
                    onChange={(e) => updateHighlight(idx, { title: e.target.value })}
                    placeholder="Highlight Title"
                    className="flex-1 rounded-xl border border-eden-line bg-eden-input px-2.5 py-1 text-xs font-bold text-eden-ink mr-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeHighlight(idx)}
                    className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={h.desc}
                  onChange={(e) => updateHighlight(idx, { desc: e.target.value })}
                  placeholder="Short description"
                  className="w-full rounded-xl border border-eden-line bg-eden-input px-2.5 py-1 text-xs text-eden-muted"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
