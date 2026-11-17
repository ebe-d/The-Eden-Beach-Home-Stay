"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, MapPin, Pencil, Plus, Save, Trash2 } from "lucide-react";
import type { PublicCoastGuideSpot } from "@/db/defaults";
import { COAST_DESTINATIONS, type CoastDestination } from "@/db/schema";

export function AdminCoastGuideTab({
  guides,
  onChange,
  onFeedback,
}: {
  guides: PublicCoastGuideSpot[];
  onChange: (next: PublicCoastGuideSpot[]) => void;
  onFeedback: (msg: string, isError?: boolean) => void;
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [destination, setDestination] = useState<CoastDestination>("Murdeshwar");
  const [spotName, setSpotName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [visitorNotes, setVisitorNotes] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(guides.length + 1);
  const [busy, setBusy] = useState(false);

  function startEdit(spot: PublicCoastGuideSpot) {
    setEditingId(spot.id);
    setDestination(spot.destination);
    setSpotName(spot.spotName);
    setShortDescription(spot.shortDescription);
    setVisitorNotes(spot.visitorNotes);
    setMapUrl(spot.mapUrl);
    setImageUrl(spot.imageUrl);
    setSortOrder(spot.sortOrder);
  }

  function resetForm() {
    setEditingId(null);
    setSpotName("");
    setShortDescription("");
    setVisitorNotes("");
    setMapUrl("");
    setImageUrl("");
    setSortOrder(guides.length + 1);
  }

  async function saveSpot(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const endpoint = editingId
        ? `/api/admin/coast-guides/${editingId}`
        : "/api/admin/coast-guides";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          spotName,
          shortDescription,
          visitorNotes,
          mapUrl,
          imageUrl,
          sortOrder,
          isVisible: true,
        }),
      });
      const data = (await res.json()) as {
        guide?: PublicCoastGuideSpot;
        error?: string;
      };
      if (!res.ok || !data.guide) {
        onFeedback(data.error || "Failed to save guide item.", true);
        return;
      }

      if (editingId) {
        onChange(guides.map((g) => (g.id === editingId ? data.guide! : g)));
        onFeedback("Updated coastal guide stop.");
      } else {
        onChange([...guides, data.guide]);
        onFeedback("Added coastal guide stop.");
      }
      resetForm();
    } catch {
      onFeedback("Network error while saving guide item.", true);
    } finally {
      setBusy(false);
    }
  }

  async function toggleVisible(spot: PublicCoastGuideSpot) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/coast-guides/${spot.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: !spot.isVisible }),
      });
      const data = (await res.json()) as { guide?: PublicCoastGuideSpot };
      if (!res.ok || !data.guide) {
        onFeedback("Could not toggle visibility.", true);
        return;
      }
      onChange(guides.map((g) => (g.id === spot.id ? data.guide! : g)));
    } finally {
      setBusy(false);
    }
  }

  async function deleteSpot(id: number) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/coast-guides/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        onFeedback("Could not delete coastal stop.", true);
        return;
      }
      onChange(guides.filter((g) => g.id !== id));
      onFeedback("Removed coastal guide stop.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={saveSpot}
        className="glass-card rounded-[26px] p-6 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-bold text-eden-ink">
            {editingId ? "Edit Coastal Guide Entry" : "Add Coastal Guide Entry"}
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-eden-line bg-eden-inset px-3.5 py-1 text-xs font-semibold text-eden-ink"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <p className="text-xs text-eden-muted">
          Keep descriptions practical and avoid guessing exact travel durations, distances,
          or opening times.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-eden-soft">
              Destination Town *
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value as CoastDestination)}
              className="w-full rounded-2xl border border-eden-line bg-eden-input px-3.5 py-2 text-sm text-eden-ink"
            >
              {COAST_DESTINATIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-eden-soft">
              Attraction / Spot Name *
            </label>
            <input
              type="text"
              required
              value={spotName}
              onChange={(e) => setSpotName(e.target.value)}
              className="w-full rounded-2xl border border-eden-line bg-eden-input px-3.5 py-2 text-sm text-eden-ink"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-eden-soft">
              Sort Order
            </label>
            <input
              type="number"
              min={0}
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="w-full rounded-2xl border border-eden-line bg-eden-input px-3.5 py-2 text-sm text-eden-ink"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-eden-soft">
              Image URL *
            </label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full rounded-2xl border border-eden-line bg-eden-input px-3.5 py-2 text-sm text-eden-ink"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-eden-soft">
              Google Maps URL *
            </label>
            <input
              type="url"
              required
              value={mapUrl}
              onChange={(e) => setMapUrl(e.target.value)}
              className="w-full rounded-2xl border border-eden-line bg-eden-input px-3.5 py-2 text-sm text-eden-ink"
            />
          </div>
          <div className="sm:col-span-3">
            <label className="mb-1 block text-xs font-semibold text-eden-soft">
              Short Description *
            </label>
            <textarea
              rows={2}
              required
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full rounded-2xl border border-eden-line bg-eden-input px-3.5 py-2 text-sm text-eden-ink"
            />
          </div>
          <div className="sm:col-span-3">
            <label className="mb-1 block text-xs font-semibold text-eden-soft">
              Practical Visitor Notes *
            </label>
            <textarea
              rows={2}
              required
              value={visitorNotes}
              onChange={(e) => setVisitorNotes(e.target.value)}
              className="w-full rounded-2xl border border-eden-line bg-eden-input px-3.5 py-2 text-sm text-eden-ink"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-eden-btn px-5 py-2.5 text-sm font-semibold text-eden-btn-ink transition hover:bg-eden-btn-hover"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : editingId ? (
            <Save className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {editingId ? "Update Coastal Stop" : "Add Coastal Stop"}
        </button>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {guides.map((spot) => (
          <article
            key={spot.id}
            className="glass-card rounded-[24px] p-5 space-y-3"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <span className="rounded-full bg-[#C5A059]/20 px-2.5 py-0.5 text-[11px] font-bold text-[#C5A059] border border-[#C5A059]/30">
                  {spot.destination}
                </span>
                <h4 className="mt-1.5 text-base font-bold text-eden-ink">
                  {spot.spotName}
                </h4>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => startEdit(spot)}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-eden-line bg-eden-inset px-3 py-1 text-xs font-semibold text-eden-ink"
                >
                  <Pencil className="h-3 w-3" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => toggleVisible(spot)}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-eden-line bg-eden-inset px-3 py-1 text-xs font-semibold text-eden-ink"
                >
                  {spot.isVisible ? (
                    <>
                      <Eye className="h-3 w-3" /> Live
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3" /> Hidden
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => deleteSpot(spot.id)}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-eden-muted">
              {spot.shortDescription}
            </p>
            <p className="rounded-xl bg-eden-inset p-2.5 text-xs text-eden-ink">
              <strong>Visitor Notes:</strong> {spot.visitorNotes}
            </p>
            <a
              href={spot.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-eden-soft underline"
            >
              <MapPin className="h-3 w-3" /> Map Link
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}

