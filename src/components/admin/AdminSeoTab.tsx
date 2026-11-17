"use client";

import { useState } from "react";
import {
  ExternalLink,
  Eye,
  Globe,
  Loader2,
  Save,
  Search,
  Share2,
  Sparkles,
} from "lucide-react";
import type { PublicMediaItem, PublicSeoSettings } from "@/db/defaults";
import { CoastalImage } from "@/components/CoastalImage";

export function AdminSeoTab({
  initialSeo,
  mediaItems,
  onFeedback,
}: {
  initialSeo: PublicSeoSettings;
  mediaItems: PublicMediaItem[];
  onFeedback: (msg: string, isError?: boolean) => void;
}) {
  const [seo, setSeo] = useState<PublicSeoSettings>(initialSeo);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  function update<K extends keyof PublicSeoSettings>(
    key: K,
    val: PublicSeoSettings[K]
  ) {
    setSeo((prev) => ({ ...prev, [key]: val }));
    setDirty(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seo),
      });
      const data = await res.json();
      if (!res.ok || !data.seo) {
        onFeedback(data.error || "Failed to update SEO settings.", true);
        return;
      }
      setSeo(data.seo);
      setDirty(false);
      onFeedback("SEO settings updated & meta tags refreshed!");
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
            <Search className="h-3.5 w-3.5" />
            Search Engine & Social Discovery
          </span>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-eden-ink">
            SEO & Metadata Manager
          </h1>
          <p className="text-xs sm:text-sm text-eden-muted">
            Configure Google search rankings, meta descriptions, focus keywords, Open Graph social cards, and structured indexing.
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
            <span>Save SEO Settings</span>
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        {/* SEO Inputs Column */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">
          <div className="glass-card rounded-[28px] p-6 sm:p-8 border border-eden-line/60 space-y-4">
            <h2 className="font-serif text-xl font-bold text-eden-ink">
              Core Search Metadata
            </h2>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-eden-soft">
                  SEO Page Title *
                </label>
                <span className="text-[11px] text-eden-muted">
                  {seo.metaTitle.length}/60 chars
                </span>
              </div>
              <input
                type="text"
                required
                value={seo.metaTitle}
                onChange={(e) => update("metaTitle", e.target.value)}
                placeholder="The Eden Beach Home Stay — Beachfront Stay in Bailur, Murudeshwar"
                className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-eden-soft">
                  Meta Description *
                </label>
                <span className="text-[11px] text-eden-muted">
                  {seo.metaDescription.length}/160 chars
                </span>
              </div>
              <textarea
                rows={3}
                required
                value={seo.metaDescription}
                onChange={(e) => update("metaDescription", e.target.value)}
                placeholder="Experience quiet beachfront hospitality at The Eden Beach Home Stay in Bailur, Murudeshwar..."
                className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-eden-soft">
                Focus Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={seo.keywords}
                onChange={(e) => update("keywords", e.target.value)}
                placeholder="The Eden Beach Home Stay, Murudeshwar homestay, Bailur beach homestay, Tudalli Beach"
                className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-eden-soft">
                Canonical URL
              </label>
              <input
                type="url"
                value={seo.canonicalUrl}
                onChange={(e) => update("canonicalUrl", e.target.value)}
                placeholder="https://theedenbeachhomestay.com"
                className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          <div className="glass-card rounded-[28px] p-6 sm:p-8 border border-eden-line/60 space-y-4">
            <h2 className="font-serif text-xl font-bold text-eden-ink flex items-center gap-2">
              <Share2 className="h-5 w-5 text-[#C5A059]" />
              <span>Social Media Sharing Card (Open Graph)</span>
            </h2>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-eden-soft">
                Social Title (OG Title)
              </label>
              <input
                type="text"
                value={seo.ogTitle || ""}
                onChange={(e) => update("ogTitle", e.target.value)}
                placeholder="The Eden Beach Home Stay — Peaceful Beachfront Sanctuary in Murudeshwar"
                className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-eden-soft">
                Social Description (OG Description)
              </label>
              <input
                type="text"
                value={seo.ogDescription || ""}
                onChange={(e) => update("ogDescription", e.target.value)}
                placeholder="Stay by the sea. Slow down. Make memories. One exclusive private room..."
                className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-eden-soft">
                Social Sharing Image URL (OG Image)
              </label>
              <input
                type="text"
                value={seo.ogImageUrl}
                onChange={(e) => update("ogImageUrl", e.target.value)}
                placeholder="https://... or /uploads/..."
                className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none focus:border-[#C5A059]"
              />
              {mediaItems.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-eden-muted">
                  <span>Pick from media:</span>
                  {mediaItems.slice(0, 4).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => update("ogImageUrl", m.url)}
                      className="rounded-lg border border-eden-line bg-eden-inset px-2 py-0.5 text-[11px] hover:border-[#C5A059]"
                    >
                      {m.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Live Snippet Previews Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Google Search Snippet Preview */}
          <div className="glass-card rounded-[28px] p-6 border border-eden-line/60 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-eden-muted flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              Google Search Result Preview
            </span>

            <div className="rounded-2xl bg-white p-4 text-left shadow-sm border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold">
                  E
                </div>
                <div className="truncate">
                  theedenbeachhomestay.com
                  <span className="text-slate-400"> › stay</span>
                </div>
              </div>

              <h4 className="text-sm sm:text-base font-semibold text-[#1a0dab] hover:underline line-clamp-1 leading-snug">
                {seo.metaTitle || "The Eden Beach Home Stay"}
              </h4>

              <p className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                {seo.metaDescription || "No description set yet."}
              </p>
            </div>
          </div>

          {/* Social Card Preview */}
          <div className="glass-card rounded-[28px] p-6 border border-eden-line/60 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-eden-muted flex items-center gap-1.5">
              <Share2 className="h-3.5 w-3.5" />
              Social Card Preview (WhatsApp / Facebook / X)
            </span>

            <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-200">
              <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                <CoastalImage
                  src={seo.ogImageUrl || seo.ogImageUrl}
                  alt="Social preview"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3.5 space-y-1 bg-slate-50">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">
                  theedenbeachhomestay.com
                </span>
                <div className="text-xs font-bold text-slate-900 truncate">
                  {seo.ogTitle || seo.metaTitle}
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-1">
                  {seo.ogDescription || seo.metaDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
