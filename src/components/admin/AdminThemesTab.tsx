"use client";

import { useState } from "react";
import {
  Calendar,
  Check,
  Clock,
  Copy,
  Edit3,
  Eye,
  Laptop,
  Loader2,
  Palette,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Smartphone,
  Sparkles,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import type { PublicThemeItem, PublicThemeSettings } from "@/db/defaults";
import { DEFAULT_THEMES } from "@/db/defaults";
import { isScheduleActive } from "@/lib/theme-utils";

export function AdminThemesTab({
  themes: initialThemes,
  themeSettings: initialSettings,
  onFeedback,
}: {
  themes: PublicThemeItem[];
  themeSettings: PublicThemeSettings;
  onFeedback: (msg: string, isError?: boolean) => void;
}) {
  const [themesList, setThemesList] = useState<PublicThemeItem[]>(initialThemes);
  const [settings, setSettings] = useState<PublicThemeSettings>(initialSettings);
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [savingSchedule, setSavingSchedule] = useState(false);

  // Preview modal state
  const [previewTheme, setPreviewTheme] = useState<PublicThemeItem | null>(null);
  const [previewViewport, setPreviewViewport] = useState<"desktop" | "mobile">("desktop");

  // Editor modal state
  const [editingTheme, setEditingTheme] = useState<PublicThemeItem | null>(null);
  const [savingTheme, setSavingTheme] = useState(false);

  // Schedule form state
  const [scheduleData, setScheduleData] = useState({
    scheduledThemeId: settings.scheduledThemeId || "diwali",
    scheduleStartDate: settings.scheduleStartDate || "",
    scheduleEndDate: settings.scheduleEndDate || "",
    manualOverride: settings.manualOverride,
    returnToThemeId: settings.returnToThemeId || "default",
  });

  const activeSchedule = isScheduleActive(settings);

  // Activate theme directly
  async function handleActivateTheme(themeId: string) {
    setActivatingId(themeId);
    try {
      const res = await fetch("/api/admin/themes/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeId }),
      });
      const data = await res.json();
      if (!res.ok) {
        onFeedback(data.error || "Failed to activate theme.", true);
        return;
      }
      setSettings(data.settings);
      setScheduleData((prev) => ({ ...prev, manualOverride: true }));
      onFeedback(data.message || `Theme activated on live website!`);
    } catch {
      onFeedback("Network error while activating theme.", true);
    } finally {
      setActivatingId(null);
    }
  }

  // Reset to default theme
  async function handleResetToDefault() {
    if (!window.confirm("Reset public website appearance to the Default Forest & Sand theme?")) return;
    await handleActivateTheme("default");
  }

  // Save schedule settings
  async function handleSaveSchedule(e: React.FormEvent) {
    e.preventDefault();
    setSavingSchedule(true);
    try {
      const res = await fetch("/api/admin/themes/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activeThemeId: settings.activeThemeId,
          ...scheduleData,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        onFeedback(data.error || "Failed to save schedule.", true);
        return;
      }
      setSettings(data.settings);
      onFeedback("Theme scheduling settings saved persistently!");
    } catch {
      onFeedback("Network error while saving schedule.", true);
    } finally {
      setSavingSchedule(false);
    }
  }

  // Duplicate a theme
  function handleDuplicateTheme(source: PublicThemeItem) {
    const newId = `custom-${Date.now().toString(36)}`;
    const duplicated: PublicThemeItem = {
      ...source,
      id: newId,
      name: `${source.name} (Custom)`,
      description: `Customized variant of ${source.name}`,
      category: "custom",
      isCustom: true,
      colors: { ...source.colors },
      typography: { ...source.typography },
      buttonStyle: { ...source.buttonStyle },
      decorations: { ...source.decorations },
    };
    setEditingTheme(duplicated);
  }

  // Delete custom theme
  async function handleDeleteTheme(themeId: string) {
    if (!window.confirm("Permanently delete this custom theme?")) return;
    try {
      const res = await fetch(`/api/admin/themes/${themeId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        onFeedback(data.error || "Failed to delete theme.", true);
        return;
      }
      setThemesList(data.themes);
      onFeedback("Custom theme deleted.");
    } catch {
      onFeedback("Network error while deleting theme.", true);
    }
  }

  // Save edited or new theme
  async function handleSaveCustomTheme() {
    if (!editingTheme) return;
    setSavingTheme(true);
    try {
      const isNew = !themesList.some((t) => t.id === editingTheme.id);
      const url = isNew ? "/api/admin/themes" : `/api/admin/themes/${editingTheme.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTheme),
      });
      const data = await res.json();
      if (!res.ok) {
        onFeedback(data.error || "Failed to save theme.", true);
        return;
      }
      setThemesList(data.themes);
      setEditingTheme(null);
      onFeedback(`Theme "${editingTheme.name}" saved successfully!`);
    } catch {
      onFeedback("Network error while saving theme.", true);
    } finally {
      setSavingTheme(false);
    }
  }

  const activeThemeItem =
    themesList.find((t) => t.id === settings.activeThemeId) ||
    DEFAULT_THEMES[0];

  return (
    <div className="space-y-10">
      {/* 1. Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-eden-line/60 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B28051]">
            <Palette className="h-3.5 w-3.5" />
            Seasonal & Festival Branding
          </span>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-eden-ink">
            Themes & Seasons ({themesList.length})
          </h1>
          <p className="text-xs sm:text-sm text-eden-muted">
            Select, customize, preview, or schedule festive themes for Diwali, Christmas, New Year, Holi, and coastal seasons.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 text-xs font-bold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live: {activeThemeItem.name}</span>
          </div>

          <button
            type="button"
            onClick={handleResetToDefault}
            className="canva-btn-outline-camel flex items-center gap-1.5 text-xs py-2 px-3.5"
            title="Reset live website back to original Default branding"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset to Default</span>
          </button>

          <button
            type="button"
            onClick={() => handleDuplicateTheme(activeThemeItem)}
            className="canva-btn-camel flex items-center gap-1.5 text-xs py-2 px-4 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Custom Theme</span>
          </button>
        </div>
      </div>

      {/* 2. Automated Scheduling Card */}
      <div className="glass-card rounded-[28px] border border-eden-line/70 p-6 bg-[#FAF7F2]/80 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-eden-line/40 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#042E09] text-[#B28051]">
              <Clock className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-serif text-lg font-bold text-eden-ink">
                Automated Festival Scheduling
              </h2>
              <p className="text-xs text-eden-muted">
                Schedule a festive theme to activate and revert automatically (Asia/Kolkata IST).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                activeSchedule
                  ? "bg-amber-500/20 text-amber-900 border border-amber-500/30"
                  : scheduleData.manualOverride
                  ? "bg-gray-200/80 text-gray-700"
                  : "bg-blue-500/15 text-blue-800"
              }`}
            >
              {activeSchedule
                ? "⚡ Schedule Currently Active in IST"
                : scheduleData.manualOverride
                ? "Manual Override Enabled"
                : "Schedule Set (Inactive)"}
            </span>
          </div>
        </div>

        <form onSubmit={handleSaveSchedule} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-eden-soft mb-1">
              Select Scheduled Theme
            </label>
            <select
              value={scheduleData.scheduledThemeId}
              onChange={(e) =>
                setScheduleData({ ...scheduleData, scheduledThemeId: e.target.value })
              }
              className="w-full rounded-xl border border-eden-line bg-eden-input px-3 py-2 text-xs font-bold text-eden-ink focus:outline-none focus:ring-1 focus:ring-[#B28051]"
            >
              {themesList.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-eden-soft mb-1">
              Start Date & Time (IST)
            </label>
            <input
              type="datetime-local"
              value={scheduleData.scheduleStartDate}
              onChange={(e) =>
                setScheduleData({ ...scheduleData, scheduleStartDate: e.target.value })
              }
              className="w-full rounded-xl border border-eden-line bg-eden-input px-3 py-2 text-xs text-eden-ink focus:outline-none focus:ring-1 focus:ring-[#B28051]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-eden-soft mb-1">
              End Date & Time (IST)
            </label>
            <input
              type="datetime-local"
              value={scheduleData.scheduleEndDate}
              onChange={(e) =>
                setScheduleData({ ...scheduleData, scheduleEndDate: e.target.value })
              }
              className="w-full rounded-xl border border-eden-line bg-eden-input px-3 py-2 text-xs text-eden-ink focus:outline-none focus:ring-1 focus:ring-[#B28051]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setScheduleData({
                  ...scheduleData,
                  manualOverride: !scheduleData.manualOverride,
                })
              }
              className={`flex-1 rounded-xl py-2 px-3 text-xs font-bold border transition ${
                scheduleData.manualOverride
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-800"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-800"
              }`}
              title="When override is on, active theme stays fixed regardless of date"
            >
              {scheduleData.manualOverride ? "Override: ON" : "Auto-Schedule: ON"}
            </button>

            <button
              type="submit"
              disabled={savingSchedule}
              className="canva-btn-camel flex items-center justify-center gap-1.5 text-xs py-2 px-4 whitespace-nowrap"
            >
              {savingSchedule ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              <span>Save Schedule</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Theme Presets Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-eden-ink">
            Theme Presets & Custom Themes
          </h2>
          <span className="text-xs text-eden-muted">
            Click &ldquo;Live Preview&rdquo; to test on desktop or mobile before activating.
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {themesList.map((theme) => {
            const isActive = theme.id === settings.activeThemeId;
            const isActivating = activatingId === theme.id;
            const c = theme.colors;

            return (
              <div
                key={theme.id}
                className={`group glass-card rounded-[26px] p-5 border flex flex-col justify-between transition-all duration-300 relative ${
                  isActive
                    ? "border-emerald-500/70 shadow-lg ring-2 ring-emerald-500/20 bg-white"
                    : "border-eden-line/70 hover:border-canva-camel/50 bg-[#FAF7F2]/50 hover:bg-white"
                }`}
              >
                {/* Active Live Indicator Badge */}
                {isActive && (
                  <div className="absolute -top-3 left-5 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                    <Check className="h-3 w-3" />
                    <span>Active on Live Site</span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Category & Custom badge */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#B28051]">
                      {theme.category}
                    </span>
                    {theme.isCustom && (
                      <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                        Custom
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-serif text-lg font-bold text-eden-ink leading-snug">
                      {theme.name}
                    </h3>
                    <p className="mt-1 text-xs text-eden-muted leading-relaxed line-clamp-2">
                      {theme.description}
                    </p>
                  </div>

                  {/* Color Swatches Palette */}
                  <div className="rounded-2xl border border-eden-line/40 p-2.5 bg-eden-inset/40 space-y-2">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="h-6 flex-1 rounded-lg shadow-inner"
                        style={{ backgroundColor: c.primary }}
                        title={`Primary: ${c.primary}`}
                      />
                      <div
                        className="h-6 flex-1 rounded-lg shadow-inner"
                        style={{ backgroundColor: c.secondary }}
                        title={`Secondary: ${c.secondary}`}
                      />
                      <div
                        className="h-6 flex-1 rounded-lg shadow-inner"
                        style={{ backgroundColor: c.accent }}
                        title={`Accent: ${c.accent}`}
                      />
                      <div
                        className="h-6 flex-1 rounded-lg border border-black/10 shadow-inner"
                        style={{ backgroundColor: c.background }}
                        title={`Background: ${c.background}`}
                      />
                      <div
                        className="h-6 flex-1 rounded-lg border border-black/10 shadow-inner"
                        style={{ backgroundColor: c.surface }}
                        title={`Surface: ${c.surface}`}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-eden-soft font-mono">
                      <span>{c.primary}</span>
                      <span>{c.accent}</span>
                      <span>{c.background}</span>
                    </div>
                  </div>

                  {/* Festival Decoration Pill */}
                  {theme.decorations.enabled && (
                    <div className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/25 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                      <Sparkles className="h-3 w-3" />
                      <span className="capitalize">{theme.decorations.type.replace("-", " ")}</span>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-3 border-t border-eden-line/50 space-y-2">
                  <div className="flex items-center gap-2">
                    {/* Live Preview Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewTheme(theme)}
                      className="flex-1 canva-btn-outline-camel py-1.5 px-2.5 text-xs flex items-center justify-center gap-1"
                      title="Preview this theme on desktop & mobile"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Preview</span>
                    </button>

                    {/* Activate Button */}
                    <button
                      type="button"
                      onClick={() => handleActivateTheme(theme.id)}
                      disabled={isActive || isActivating}
                      className={`flex-1 py-1.5 px-2.5 text-xs font-bold rounded flex items-center justify-center gap-1 transition ${
                        isActive
                          ? "bg-emerald-500/15 text-emerald-800 border border-emerald-500/30 cursor-default"
                          : "canva-btn-camel"
                      }`}
                    >
                      {isActivating ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : isActive ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <Zap className="h-3.5 w-3.5" />
                          <span>Activate</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Secondary actions: Edit, Duplicate, Delete */}
                  <div className="flex items-center justify-between pt-1 text-xs text-eden-soft">
                    <button
                      type="button"
                      onClick={() => setEditingTheme(theme)}
                      className="inline-flex items-center gap-1 hover:text-eden-ink transition"
                    >
                      <Edit3 className="h-3 w-3" />
                      <span>{theme.isCustom ? "Edit" : "Customize"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDuplicateTheme(theme)}
                      className="inline-flex items-center gap-1 hover:text-eden-ink transition"
                    >
                      <Copy className="h-3 w-3" />
                      <span>Duplicate</span>
                    </button>

                    {theme.isCustom && !isActive && (
                      <button
                        type="button"
                        onClick={() => handleDeleteTheme(theme.id)}
                        className="inline-flex items-center gap-1 text-rose-500 hover:text-rose-700 transition"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Live Preview Modal (Desktop & Mobile Simulation) */}
      {previewTheme && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in"
        >
          <div className="flex flex-col h-[92vh] w-full max-w-5xl rounded-[32px] bg-eden-bg border border-eden-line shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-eden-line/60 bg-white p-4 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#042E09] text-[#B28051]">
                  <Eye className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-serif text-lg font-bold text-eden-ink">
                    Live Preview: {previewTheme.name}
                  </h3>
                  <p className="text-xs text-eden-muted">
                    Testing appearance without affecting public visitors.
                  </p>
                </div>
              </div>

              {/* Viewport switchers */}
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-xl bg-eden-inset p-1 border border-eden-line/50">
                  <button
                    type="button"
                    onClick={() => setPreviewViewport("desktop")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      previewViewport === "desktop"
                        ? "bg-white text-eden-ink shadow-sm"
                        : "text-eden-muted hover:text-eden-ink"
                    }`}
                  >
                    <Laptop className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Desktop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewViewport("mobile")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      previewViewport === "mobile"
                        ? "bg-white text-eden-ink shadow-sm"
                        : "text-eden-muted hover:text-eden-ink"
                    }`}
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Mobile</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleActivateTheme(previewTheme.id);
                    setPreviewTheme(null);
                  }}
                  className="canva-btn-camel py-2 px-4 text-xs flex items-center gap-1.5"
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>Activate & Publish</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewTheme(null)}
                  className="p-2 text-eden-muted hover:text-eden-ink rounded-full hover:bg-black/5"
                  aria-label="Close preview"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Preview Viewport Canvas */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#E9ECEF]/60 flex justify-center items-start">
              <div
                style={
                  {
                    "--canva-forest": previewTheme.colors.primary,
                    "--canva-olive": previewTheme.colors.secondary,
                    "--canva-camel": previewTheme.colors.accent,
                    "--canva-camel-hover": previewTheme.colors.accentHover,
                    "--eden-bg": previewTheme.colors.background,
                    "--eden-surface": previewTheme.colors.surface,
                    "--eden-inset": previewTheme.colors.surfaceElevated || "#F2ECE2",
                    "--eden-ink": previewTheme.colors.text,
                    "--eden-muted": previewTheme.colors.mutedText,
                    "--eden-btn": previewTheme.colors.buttonBg,
                    "--eden-btn-hover": previewTheme.colors.buttonHoverBg,
                    "--eden-btn-text": previewTheme.colors.buttonText,
                    "--eden-border": previewTheme.colors.borderColor,
                    backgroundColor: previewTheme.colors.background,
                    color: previewTheme.colors.text,
                  } as React.CSSProperties
                }
                className={`transition-all duration-300 shadow-2xl overflow-hidden rounded-[28px] border border-black/10 ${
                  previewViewport === "mobile"
                    ? "w-[375px] min-h-[640px] my-4 rounded-[40px] ring-8 ring-black/80"
                    : "w-full max-w-4xl"
                }`}
              >
                {/* Simulated Festive Announcement */}
                {previewTheme.decorations.enabled && previewTheme.decorations.festiveGreeting && (
                  <div
                    style={{
                      backgroundColor: previewTheme.colors.primary,
                      color: "#FAF7F2",
                      borderBottom: `1px solid ${previewTheme.colors.accent}40`,
                    }}
                    className="py-1.5 px-4 text-center text-xs font-serif"
                  >
                    ✨ {previewTheme.decorations.festiveGreeting}
                  </div>
                )}

                {/* Simulated Header */}
                <div
                  style={{
                    backgroundColor: previewTheme.colors.surface,
                    borderBottom: `1px solid ${previewTheme.colors.borderColor}`,
                  }}
                  className="px-6 py-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      style={{
                        backgroundColor: previewTheme.colors.primary,
                        color: previewTheme.colors.accent,
                      }}
                      className="h-8 w-8 rounded-xl flex items-center justify-center font-bold text-xs"
                    >
                      E
                    </span>
                    <span className="font-serif font-bold text-sm tracking-tight">
                      The Eden Beach Home Stay
                    </span>
                  </div>
                  <button
                    type="button"
                    style={{
                      backgroundColor: previewTheme.colors.accent,
                      color: previewTheme.colors.buttonText || "#ffffff",
                      borderRadius: previewTheme.buttonStyle.buttonRadius || "4px",
                    }}
                    className="text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 shadow-sm"
                  >
                    Book Stay
                  </button>
                </div>

                {/* Simulated Hero */}
                <div
                  style={{
                    backgroundColor: previewTheme.colors.primary,
                    color: "#FAF7F2",
                  }}
                  className="p-8 sm:p-12 relative overflow-hidden"
                >
                  <span
                    style={{ color: previewTheme.colors.accent }}
                    className="text-[10px] font-bold uppercase tracking-[0.25em] block mb-2"
                  >
                    Beachfront Sanctuary • Bailur, Murudeshwar
                  </span>
                  <h1 className="font-serif text-2xl sm:text-4xl font-medium leading-tight text-white max-w-lg">
                    Your Peaceful Beachfront Escape in Murdeshwar.
                  </h1>
                  <p className="mt-3 text-xs sm:text-sm text-white/80 max-w-md">
                    Stay by the sea. Slow down. Make memories. One exclusive private room steps from Tudalli Beach.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      style={{
                        backgroundColor: previewTheme.colors.accent,
                        color: previewTheme.colors.buttonText || "#ffffff",
                        borderRadius: previewTheme.buttonStyle.buttonRadius || "4px",
                      }}
                      className="text-xs font-bold uppercase tracking-wider px-4 py-2 shadow-md"
                    >
                      Explore Room
                    </button>
                    <button
                      type="button"
                      style={{
                        borderColor: "rgba(255,255,255,0.4)",
                        color: "#FFFFFF",
                        borderRadius: previewTheme.buttonStyle.buttonRadius || "4px",
                      }}
                      className="border text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-white/10"
                    >
                      WhatsApp Enquiry
                    </button>
                  </div>
                </div>

                {/* Simulated Room Card */}
                <div className="p-6 sm:p-8 space-y-4">
                  <span
                    style={{ color: previewTheme.colors.accent }}
                    className="text-[10px] font-bold uppercase tracking-widest block"
                  >
                    Accommodation Showcase
                  </span>
                  <div
                    style={{
                      backgroundColor: previewTheme.colors.surface,
                      borderColor: previewTheme.colors.borderColor,
                    }}
                    className="rounded-[24px] p-5 border shadow-sm flex flex-col sm:flex-row gap-5 items-center"
                  >
                    <div
                      style={{ backgroundColor: previewTheme.colors.secondary }}
                      className="h-32 w-full sm:w-44 rounded-2xl flex items-center justify-center text-white/50 text-xs font-bold shrink-0"
                    >
                      Beachfront Photo
                    </div>
                    <div className="space-y-2 flex-1">
                      <h4 className="font-serif text-lg font-bold">
                        The Private Beachfront Sanctuary
                      </h4>
                      <p
                        style={{ color: previewTheme.colors.mutedText }}
                        className="text-xs leading-relaxed"
                      >
                        Reserved exclusively for your group with 2 main beds + up to 2 optional add-on beds, attached bath, AC & Wi-Fi.
                      </p>
                      <div className="pt-2 flex items-center justify-between">
                        <span
                          style={{ color: previewTheme.colors.accent }}
                          className="text-xs font-bold"
                        >
                          Price on enquiry
                        </span>
                        <button
                          type="button"
                          style={{
                            backgroundColor: previewTheme.colors.accent,
                            color: previewTheme.colors.buttonText || "#ffffff",
                            borderRadius: previewTheme.buttonStyle.buttonRadius || "4px",
                          }}
                          className="text-[11px] font-bold uppercase px-3 py-1.5"
                        >
                          Check Dates
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Footer */}
                <div
                  style={{
                    backgroundColor: previewTheme.colors.primary,
                    color: "#FAF7F2",
                    borderTop: `1px solid ${previewTheme.colors.secondary}`,
                  }}
                  className="p-6 text-center text-xs space-y-1"
                >
                  <p className="font-serif font-bold text-sm">
                    The Eden Beach Home Stay
                  </p>
                  <p className="text-white/60 text-[11px]">
                    Christiankeri, Bailur, Murudeshwar, Karnataka 581350
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Custom Theme Editor Modal */}
      {editingTheme && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in"
        >
          <div className="flex flex-col h-[92vh] w-full max-w-4xl rounded-[32px] bg-white border border-eden-line shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-eden-line/60 p-5 bg-[#FAF7F2]">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#042E09] text-[#B28051]">
                  <Edit3 className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-eden-ink">
                    {editingTheme.isCustom ? "Edit Custom Theme" : "Customize Theme"}
                  </h3>
                  <p className="text-xs text-eden-muted">
                    Adjust colours, typography, buttons, and festival accents.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingTheme(null)}
                className="p-2 text-eden-muted hover:text-eden-ink rounded-full hover:bg-black/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
              {/* Basic Details */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-eden-soft mb-1">
                    Theme Name
                  </label>
                  <input
                    type="text"
                    value={editingTheme.name}
                    onChange={(e) =>
                      setEditingTheme({ ...editingTheme, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-eden-line bg-eden-input px-3.5 py-2 text-xs font-bold text-eden-ink shadow-inner focus:outline-none focus:ring-1 focus:ring-[#B28051]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-eden-soft mb-1">
                    Category
                  </label>
                  <select
                    value={editingTheme.category}
                    onChange={(e) =>
                      setEditingTheme({
                        ...editingTheme,
                        category: e.target.value as PublicThemeItem["category"],
                      })
                    }
                    className="w-full rounded-xl border border-eden-line bg-eden-input px-3.5 py-2 text-xs text-eden-ink focus:outline-none focus:ring-1 focus:ring-[#B28051]"
                  >
                    <option value="preset">Preset</option>
                    <option value="festival">Festival</option>
                    <option value="season">Season</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-eden-soft mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={editingTheme.description}
                    onChange={(e) =>
                      setEditingTheme({ ...editingTheme, description: e.target.value })
                    }
                    className="w-full rounded-xl border border-eden-line bg-eden-input px-3.5 py-2 text-xs text-eden-ink shadow-inner focus:outline-none focus:ring-1 focus:ring-[#B28051]"
                  />
                </div>
              </div>

              {/* Palette Color Pickers */}
              <div className="space-y-4">
                <h4 className="font-serif text-base font-bold text-eden-ink border-b border-eden-line/60 pb-2">
                  Colour Palette Customizer
                </h4>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Primary Color */}
                  <div className="p-3 rounded-2xl border border-eden-line bg-[#FAF7F2] space-y-1.5">
                    <span className="text-[11px] font-bold text-eden-ink block">
                      Primary (Dominant Dark)
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editingTheme.colors.primary}
                        onChange={(e) =>
                          setEditingTheme({
                            ...editingTheme,
                            colors: { ...editingTheme.colors, primary: e.target.value },
                          })
                        }
                        className="h-8 w-10 cursor-pointer rounded border border-black/20"
                      />
                      <input
                        type="text"
                        value={editingTheme.colors.primary}
                        onChange={(e) =>
                          setEditingTheme({
                            ...editingTheme,
                            colors: { ...editingTheme.colors, primary: e.target.value },
                          })
                        }
                        className="w-full rounded-lg border border-eden-line bg-white px-2 py-1 text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Secondary Color */}
                  <div className="p-3 rounded-2xl border border-eden-line bg-[#FAF7F2] space-y-1.5">
                    <span className="text-[11px] font-bold text-eden-ink block">
                      Secondary (Supporting Dark)
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editingTheme.colors.secondary}
                        onChange={(e) =>
                          setEditingTheme({
                            ...editingTheme,
                            colors: { ...editingTheme.colors, secondary: e.target.value },
                          })
                        }
                        className="h-8 w-10 cursor-pointer rounded border border-black/20"
                      />
                      <input
                        type="text"
                        value={editingTheme.colors.secondary}
                        onChange={(e) =>
                          setEditingTheme({
                            ...editingTheme,
                            colors: { ...editingTheme.colors, secondary: e.target.value },
                          })
                        }
                        className="w-full rounded-lg border border-eden-line bg-white px-2 py-1 text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Accent Color */}
                  <div className="p-3 rounded-2xl border border-eden-line bg-[#FAF7F2] space-y-1.5">
                    <span className="text-[11px] font-bold text-eden-ink block">
                      Accent (Camel / Gold / Coral)
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editingTheme.colors.accent}
                        onChange={(e) =>
                          setEditingTheme({
                            ...editingTheme,
                            colors: {
                              ...editingTheme.colors,
                              accent: e.target.value,
                              buttonBg: e.target.value,
                            },
                          })
                        }
                        className="h-8 w-10 cursor-pointer rounded border border-black/20"
                      />
                      <input
                        type="text"
                        value={editingTheme.colors.accent}
                        onChange={(e) =>
                          setEditingTheme({
                            ...editingTheme,
                            colors: { ...editingTheme.colors, accent: e.target.value },
                          })
                        }
                        className="w-full rounded-lg border border-eden-line bg-white px-2 py-1 text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Background Color */}
                  <div className="p-3 rounded-2xl border border-eden-line bg-[#FAF7F2] space-y-1.5">
                    <span className="text-[11px] font-bold text-eden-ink block">
                      Page Background
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editingTheme.colors.background}
                        onChange={(e) =>
                          setEditingTheme({
                            ...editingTheme,
                            colors: { ...editingTheme.colors, background: e.target.value },
                          })
                        }
                        className="h-8 w-10 cursor-pointer rounded border border-black/20"
                      />
                      <input
                        type="text"
                        value={editingTheme.colors.background}
                        onChange={(e) =>
                          setEditingTheme({
                            ...editingTheme,
                            colors: { ...editingTheme.colors, background: e.target.value },
                          })
                        }
                        className="w-full rounded-lg border border-eden-line bg-white px-2 py-1 text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Surface / Card Color */}
                  <div className="p-3 rounded-2xl border border-eden-line bg-[#FAF7F2] space-y-1.5">
                    <span className="text-[11px] font-bold text-eden-ink block">
                      Card / Surface Color
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editingTheme.colors.surface}
                        onChange={(e) =>
                          setEditingTheme({
                            ...editingTheme,
                            colors: { ...editingTheme.colors, surface: e.target.value },
                          })
                        }
                        className="h-8 w-10 cursor-pointer rounded border border-black/20"
                      />
                      <input
                        type="text"
                        value={editingTheme.colors.surface}
                        onChange={(e) =>
                          setEditingTheme({
                            ...editingTheme,
                            colors: { ...editingTheme.colors, surface: e.target.value },
                          })
                        }
                        className="w-full rounded-lg border border-eden-line bg-white px-2 py-1 text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Text Color */}
                  <div className="p-3 rounded-2xl border border-eden-line bg-[#FAF7F2] space-y-1.5">
                    <span className="text-[11px] font-bold text-eden-ink block">
                      Ink / Text Color
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editingTheme.colors.text}
                        onChange={(e) =>
                          setEditingTheme({
                            ...editingTheme,
                            colors: { ...editingTheme.colors, text: e.target.value },
                          })
                        }
                        className="h-8 w-10 cursor-pointer rounded border border-black/20"
                      />
                      <input
                        type="text"
                        value={editingTheme.colors.text}
                        onChange={(e) =>
                          setEditingTheme({
                            ...editingTheme,
                            colors: { ...editingTheme.colors, text: e.target.value },
                          })
                        }
                        className="w-full rounded-lg border border-eden-line bg-white px-2 py-1 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Button & Styling */}
              <div className="space-y-4">
                <h4 className="font-serif text-base font-bold text-eden-ink border-b border-eden-line/60 pb-2">
                  Button & Decoration Styles
                </h4>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-eden-soft mb-1">
                      Button Corner Radius
                    </label>
                    <select
                      value={editingTheme.buttonStyle.buttonRadius}
                      onChange={(e) =>
                        setEditingTheme({
                          ...editingTheme,
                          buttonStyle: {
                            ...editingTheme.buttonStyle,
                            buttonRadius: e.target.value as any,
                          },
                        })
                      }
                      className="w-full rounded-xl border border-eden-line bg-eden-input px-3.5 py-2 text-xs text-eden-ink focus:outline-none focus:ring-1 focus:ring-[#B28051]"
                    >
                      <option value="4px">Subtle Rounded (4px)</option>
                      <option value="8px">Modern Rounded (8px)</option>
                      <option value="12px">Smooth Rounded (12px)</option>
                      <option value="9999px">Pill (9999px)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-eden-soft mb-1">
                      Festival Decoration Motif
                    </label>
                    <select
                      value={editingTheme.decorations.type}
                      onChange={(e) =>
                        setEditingTheme({
                          ...editingTheme,
                          decorations: {
                            ...editingTheme.decorations,
                            type: e.target.value as any,
                            enabled: e.target.value !== "none",
                          },
                        })
                      }
                      className="w-full rounded-xl border border-eden-line bg-eden-input px-3.5 py-2 text-xs text-eden-ink focus:outline-none focus:ring-1 focus:ring-[#B28051]"
                    >
                      <option value="none">None (Standard)</option>
                      <option value="diwali-diyas">Diwali Diyas & Glow</option>
                      <option value="christmas-pine">Christmas Pine & Star</option>
                      <option value="newyear-sparkles">New Year Sparkles</option>
                      <option value="holi-colours">Holi Pastel Gulal</option>
                      <option value="summer-waves">Summer Ocean Waves</option>
                      <option value="monsoon-raindrops">Monsoon Rain & Mist</option>
                      <option value="winter-warmth">Winter Hearth Warmth</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-eden-soft mb-1">
                      Festive Announcement Banner
                    </label>
                    <div className="flex items-center gap-2 pt-1.5">
                      <input
                        type="checkbox"
                        id="subtleBanner"
                        checked={editingTheme.decorations.subtleBanner}
                        onChange={(e) =>
                          setEditingTheme({
                            ...editingTheme,
                            decorations: {
                              ...editingTheme.decorations,
                              subtleBanner: e.target.checked,
                            },
                          })
                        }
                        className="h-4 w-4 rounded text-canva-camel cursor-pointer"
                      />
                      <label htmlFor="subtleBanner" className="text-xs font-semibold text-eden-ink cursor-pointer">
                        Display Top Festive Ribbon
                      </label>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-eden-soft mb-1">
                      Festive Ribbon Greeting Message
                    </label>
                    <input
                      type="text"
                      value={editingTheme.decorations.festiveGreeting || ""}
                      onChange={(e) =>
                        setEditingTheme({
                          ...editingTheme,
                          decorations: {
                            ...editingTheme.decorations,
                            festiveGreeting: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. Shubh Deepavali • May the Divine Light Bring Joy & Peace by the Sea"
                      className="w-full rounded-xl border border-eden-line bg-eden-input px-3.5 py-2 text-xs text-eden-ink shadow-inner focus:outline-none focus:ring-1 focus:ring-[#B28051]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between border-t border-eden-line/60 p-4 bg-[#FAF7F2]">
              <button
                type="button"
                onClick={() => setEditingTheme(null)}
                className="canva-btn-outline-camel py-2 px-4 text-xs"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveCustomTheme}
                disabled={savingTheme}
                className="canva-btn-camel py-2 px-5 text-xs flex items-center gap-1.5 shadow-md"
              >
                {savingTheme ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span>Save Theme Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
