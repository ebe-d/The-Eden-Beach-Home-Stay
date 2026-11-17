"use client";

import { useState } from "react";
import {
  Bath,
  BedDouble,
  Check,
  ChevronDown,
  ChevronUp,
  Coffee,
  Loader2,
  ParkingCircle,
  Plus,
  Save,
  Shield,
  Sparkles,
  Trash2,
  Users,
  Waves,
  Wifi,
  Wind,
} from "lucide-react";
import type { FacilityItem } from "@/db/schema";
import type { PublicSiteSettings } from "@/db/defaults";
import { FacilityIcon } from "@/components/FacilityIcon";

const ICON_OPTIONS: Array<{ id: FacilityItem["icon"]; label: string }> = [
  { id: "waves", label: "Waves / Ocean" },
  { id: "bed", label: "Bed / Sleeping" },
  { id: "users", label: "Users / Guests" },
  { id: "ac", label: "Air Conditioning" },
  { id: "wifi", label: "Wi-Fi" },
  { id: "bath", label: "Bathroom" },
];

export function AdminFacilitiesTab({
  settings,
  onChangeSettings,
  onFeedback,
}: {
  settings: PublicSiteSettings;
  onChangeSettings: (next: PublicSiteSettings) => void;
  onFeedback: (msg: string, isError?: boolean) => void;
}) {
  const [facilities, setFacilities] = useState<FacilityItem[]>(settings.facilities);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  function addFacility() {
    const newItem: FacilityItem = {
      id: `fac-${Date.now()}`,
      title: "New Facility",
      description: "Description of comfort or service provided at the homestay.",
      icon: "waves",
    };
    setFacilities([...facilities, newItem]);
    setEditingIndex(facilities.length);
    setDirty(true);
  }

  function removeFacility(idx: number) {
    setFacilities(facilities.filter((_, i) => i !== idx));
    setDirty(true);
    if (editingIndex === idx) setEditingIndex(null);
  }

  function updateItem(idx: number, patch: Partial<FacilityItem>) {
    const next = [...facilities];
    next[idx] = { ...next[idx], ...patch };
    setFacilities(next);
    setDirty(true);
  }

  function moveItem(idx: number, dir: -1 | 1) {
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= facilities.length) return;
    const next = [...facilities];
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    setFacilities(next);
    setDirty(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settings,
          facilities,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.settings) {
        onFeedback(data.error || "Failed to save facilities.", true);
        return;
      }
      onChangeSettings(data.settings);
      setFacilities(data.settings.facilities);
      setDirty(false);
      onFeedback("Facilities & amenities saved persistently!");
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
            Comforts & Specifications
          </span>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-eden-ink">
            Facilities & Amenities ({facilities.length})
          </h1>
          <p className="text-xs sm:text-sm text-eden-muted">
            Manage the list of included amenities shown across the Stay and Homepage sections.
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
            onClick={addFacility}
            className="canva-btn-outline-camel flex items-center gap-1 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Facility</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !dirty}
            className="canva-btn-camel flex items-center gap-1.5 text-xs disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>Save Facilities</span>
          </button>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {facilities.map((fac, idx) => (
          <div
            key={fac.id || idx}
            className="glass-card rounded-[24px] p-5 border border-eden-line/60 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#070D18] text-[#C5A059] border border-[#C5A059]/30">
                  <FacilityIcon icon={fac.icon} />
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveItem(idx, -1)}
                    disabled={idx === 0}
                    className="p-1 text-eden-muted hover:text-eden-ink disabled:opacity-30"
                    title="Move up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(idx, 1)}
                    disabled={idx === facilities.length - 1}
                    className="p-1 text-eden-muted hover:text-eden-ink disabled:opacity-30"
                    title="Move down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFacility(idx)}
                    className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg ml-1"
                    title="Delete facility"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-eden-soft mb-1">
                  Icon
                </label>
                <select
                  value={fac.icon}
                  onChange={(e) =>
                    updateItem(idx, { icon: e.target.value as FacilityItem["icon"] })
                  }
                  className="w-full rounded-xl border border-eden-line bg-eden-input px-3 py-1.5 text-xs text-eden-ink"
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-eden-soft mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={fac.title}
                  onChange={(e) => updateItem(idx, { title: e.target.value })}
                  className="w-full rounded-xl border border-eden-line bg-eden-input px-3 py-1.5 text-xs font-bold text-eden-ink"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-eden-soft mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={fac.description}
                  onChange={(e) => updateItem(idx, { description: e.target.value })}
                  className="w-full rounded-xl border border-eden-line bg-eden-input px-3 py-1.5 text-xs text-eden-ink leading-relaxed"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
