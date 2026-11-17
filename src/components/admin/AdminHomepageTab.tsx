"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Globe,
  ImageIcon,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
import type { PublicHomepageContent, PublicMediaItem } from "@/db/defaults";
import type { ExperienceItem, HeroSlide, SectionVisibility } from "@/db/schema";
import { CoastalImage } from "@/components/CoastalImage";

export function AdminHomepageTab({
  initialContent,
  mediaItems,
  onFeedback,
}: {
  initialContent: PublicHomepageContent;
  mediaItems: PublicMediaItem[];
  onFeedback: (msg: string, isError?: boolean) => void;
}) {
  const [content, setContent] = useState<PublicHomepageContent>(initialContent);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeMediaTarget, setActiveMediaTarget] = useState<string | null>(null);

  function updateField<K extends keyof PublicHomepageContent>(
    key: K,
    val: PublicHomepageContent[K]
  ) {
    setContent((prev) => ({ ...prev, [key]: val }));
    setDirty(true);
  }

  function updateVisibility(section: keyof SectionVisibility, val: boolean) {
    setContent((prev) => ({
      ...prev,
      sectionsVisibility: {
        ...prev.sectionsVisibility,
        [section]: val,
      },
    }));
    setDirty(true);
  }

  function updateExperience(idx: number, patch: Partial<ExperienceItem>) {
    const next = [...content.experiences];
    next[idx] = { ...next[idx], ...patch };
    updateField("experiences", next);
  }

  function addSlide() {
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
      title: "Coastal Solitude",
      subtitle: "Bailur, Murudeshwar",
    };
    updateField("heroSlides", [...content.heroSlides, newSlide]);
  }

  function removeSlide(idx: number) {
    updateField(
      "heroSlides",
      content.heroSlides.filter((_, i) => i !== idx)
    );
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (!res.ok) {
        onFeedback(data.error || "Failed to save homepage.", true);
        return;
      }
      setContent(data.content);
      setDirty(false);
      onFeedback("Homepage content saved persistently!");
    } catch {
      onFeedback("Network error while saving homepage.", true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Header & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-eden-line/60 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C5A059]">
            <Globe className="h-3.5 w-3.5" />
            Homepage Content Manager
          </span>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-eden-ink">
            Homepage Editor
          </h1>
          <p className="text-xs sm:text-sm text-eden-muted">
            Customize hero headline, background photography, welcome introduction, and bespoke experiences.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {dirty && (
            <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-700">
              Unsaved changes
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="canva-btn-outline-camel flex items-center gap-1.5 text-xs"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>{showPreview ? "Hide Preview" : "Live Preview"}</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !dirty}
            className="canva-btn-camel flex items-center gap-1.5 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Live Preview Pane (Toggleable) */}
      {showPreview && (
        <div className="rounded-[28px] border-2 border-[#C5A059] p-6 bg-[#070D18] text-white space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
              Live Preview of Hero & Welcome
            </span>
            <span className="text-xs text-slate-300">Displays real-time form state</span>
          </div>

          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-black/60 flex items-center justify-center p-6 text-center">
            <CoastalImage
              src={content.heroImageUrl}
              alt="Hero preview"
              fill
              className="object-cover opacity-60"
            />
            <div className="relative z-10 max-w-xl mx-auto space-y-3">
              <h2 className="font-serif text-2xl sm:text-4xl font-normal text-white">
                {content.heroTitle}
              </h2>
              <p className="text-sm text-slate-200">{content.heroSubtitle}</p>
              <div className="pt-2 flex justify-center gap-3">
                <span className="canva-btn-camel text-xs">Book Your Stay</span>
                <span className="canva-btn-outline-white text-xs">WhatsApp Enquiry</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 1: Hero Section Settings */}
      <section className="glass-card rounded-[28px] p-6 sm:p-8 border border-eden-line/60 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-eden-ink flex items-center gap-2">
            <span>Hero Headline & Background</span>
          </h2>
          <label className="flex items-center gap-2 text-xs font-semibold text-eden-muted cursor-pointer">
            <input
              type="checkbox"
              checked={content.sectionsVisibility.hero}
              onChange={(e) => updateVisibility("hero", e.target.checked)}
              className="rounded accent-[#C5A059]"
            />
            <span>Show Hero Section</span>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-eden-soft">
              Main Hero Headline *
            </label>
            <input
              type="text"
              value={content.heroTitle}
              onChange={(e) => updateField("heroTitle", e.target.value)}
              className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm font-medium text-eden-ink outline-none focus:border-[#C5A059]"
              placeholder="Your Peaceful Beachfront Escape in Murdeshwar."
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-eden-soft">
              Hero Supporting Subtitle *
            </label>
            <input
              type="text"
              value={content.heroSubtitle}
              onChange={(e) => updateField("heroSubtitle", e.target.value)}
              className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none focus:border-[#C5A059]"
              placeholder="Stay by the sea. Slow down. Make memories."
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-eden-soft">
              Hero Main Background Image URL *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={content.heroImageUrl}
                onChange={(e) => updateField("heroImageUrl", e.target.value)}
                className="flex-1 rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none focus:border-[#C5A059]"
                placeholder="https://... or /uploads/..."
              />
            </div>
            {mediaItems.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-eden-muted">
                <span>Select from media:</span>
                {mediaItems.slice(0, 5).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => updateField("heroImageUrl", m.url)}
                    className="rounded-lg border border-eden-line bg-eden-inset px-2 py-0.5 text-[11px] hover:border-[#C5A059]"
                  >
                    {m.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Hero Slides Management */}
        <div className="border-t border-eden-line/60 pt-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-eden-ink">
              Additional Hero Slides ({content.heroSlides.length})
            </div>
            <button
              type="button"
              onClick={addSlide}
              className="inline-flex items-center gap-1 rounded-full bg-eden-inset px-3 py-1 text-xs font-bold text-eden-ink hover:bg-eden-surface border border-eden-line"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Slide</span>
            </button>
          </div>

          <div className="space-y-3">
            {content.heroSlides.map((slide, idx) => (
              <div
                key={slide.id || idx}
                className="flex items-center gap-3 rounded-2xl bg-eden-inset p-3 border border-eden-line/40"
              >
                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-black/30">
                  <CoastalImage
                    src={slide.imageUrl}
                    alt={slide.title || "Slide"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 grid gap-2 sm:grid-cols-2">
                  <input
                    type="text"
                    value={slide.title || ""}
                    onChange={(e) => {
                      const next = [...content.heroSlides];
                      next[idx] = { ...next[idx], title: e.target.value };
                      updateField("heroSlides", next);
                    }}
                    placeholder="Slide Title"
                    className="rounded-xl border border-eden-line bg-eden-input px-3 py-1.5 text-xs text-eden-ink"
                  />
                  <input
                    type="text"
                    value={slide.imageUrl}
                    onChange={(e) => {
                      const next = [...content.heroSlides];
                      next[idx] = { ...next[idx], imageUrl: e.target.value };
                      updateField("heroSlides", next);
                    }}
                    placeholder="Image URL"
                    className="rounded-xl border border-eden-line bg-eden-input px-3 py-1.5 text-xs text-eden-ink"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSlide(idx)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl"
                  title="Remove slide"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Welcome Section Settings */}
      <section className="glass-card rounded-[28px] p-6 sm:p-8 border border-eden-line/60 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-eden-ink">
            Welcome & Introduction
          </h2>
          <label className="flex items-center gap-2 text-xs font-semibold text-eden-muted cursor-pointer">
            <input
              type="checkbox"
              checked={content.sectionsVisibility.welcome}
              onChange={(e) => updateVisibility("welcome", e.target.checked)}
              className="rounded accent-[#C5A059]"
            />
            <span>Show Welcome Section</span>
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-eden-soft">
              Welcome Section Heading *
            </label>
            <input
              type="text"
              value={content.welcomeHeading}
              onChange={(e) => updateField("welcomeHeading", e.target.value)}
              className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm font-medium text-eden-ink outline-none focus:border-[#C5A059]"
              placeholder="Timeless Coastal Rest, Delightful Stays"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-eden-soft">
              Introduction Paragraph *
            </label>
            <textarea
              rows={4}
              value={content.welcomeText}
              onChange={(e) => updateField("welcomeText", e.target.value)}
              className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none focus:border-[#C5A059]"
              placeholder="A secluded beachfront haven on the pristine shores of Bailur..."
            />
          </div>
        </div>
      </section>

      {/* Section 3: Bespoke Experiences */}
      <section className="glass-card rounded-[28px] p-6 sm:p-8 border border-eden-line/60 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-eden-ink">
              Bespoke Experiences (Canva 50/50 Panel)
            </h2>
            <p className="text-xs text-eden-muted">
              Edit the 6 numbered experiences presented on the warm camel panel.
            </p>
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold text-eden-muted cursor-pointer">
            <input
              type="checkbox"
              checked={content.sectionsVisibility.experiences}
              onChange={(e) => updateVisibility("experiences", e.target.checked)}
              className="rounded accent-[#C5A059]"
            />
            <span>Show Experiences</span>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {content.experiences.map((exp, idx) => (
            <div
              key={exp.id || idx}
              className="rounded-2xl border border-eden-line/60 bg-eden-inset p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#C5A059]">
                  {exp.number}
                </span>
                <input
                  type="text"
                  value={exp.badge || ""}
                  onChange={(e) => updateExperience(idx, { badge: e.target.value })}
                  placeholder="Badge text"
                  className="rounded-lg border border-eden-line bg-eden-input px-2.5 py-0.5 text-[11px] font-semibold text-eden-ink"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-eden-muted mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={exp.title}
                  onChange={(e) => updateExperience(idx, { title: e.target.value })}
                  className="w-full rounded-xl border border-eden-line bg-eden-input px-3 py-1.5 text-xs font-bold text-eden-ink"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-eden-muted mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={exp.description}
                  onChange={(e) => updateExperience(idx, { description: e.target.value })}
                  className="w-full rounded-xl border border-eden-line bg-eden-input px-3 py-1.5 text-xs text-eden-ink leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Section Visibility Toggles */}
      <section className="glass-card rounded-[28px] p-6 sm:p-8 border border-eden-line/60 space-y-4">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-eden-ink">
          Homepage Section Visibility & Display Controls
        </h2>
        <p className="text-xs text-eden-muted">
          Toggle which sections appear on the live homepage.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              ["hero", "Hero Banner"],
              ["welcome", "Welcome Section"],
              ["rooms", "Accommodation Showcase"],
              ["facilities", "Facilities & Amenities"],
              ["experiences", "Bespoke Experiences"],
              ["gallery", "Photo Gallery Preview"],
              ["coast", "Explore Coast Guide"],
              ["enquiry", "Booking Enquiry Form"],
            ] as const
          ).map(([key, label]) => (
            <label
              key={key}
              className="flex items-center gap-3 rounded-2xl bg-eden-inset p-3.5 border border-eden-line/40 cursor-pointer hover:bg-eden-surface transition"
            >
              <input
                type="checkbox"
                checked={content.sectionsVisibility[key]}
                onChange={(e) => updateVisibility(key, e.target.checked)}
                className="rounded accent-[#C5A059]"
              />
              <span className="text-xs font-semibold text-eden-ink">{label}</span>
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}
