"use client";

import { useState } from "react";
import {
  BedDouble,
  Check,
  Copy,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Plus,
  Save,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react";
import type { PublicMediaItem, PublicRoomItem } from "@/db/defaults";
import { CoastalImage } from "@/components/CoastalImage";

const STANDARD_FACILITIES = [
  "Air Conditioning",
  "Complimentary Wi-Fi",
  "Private En-suite Bathroom",
  "Doorstep Beach Access",
  "2 Main Beds + 2 Add-ons",
  "Sea Breeze Balcony / Patio",
  "24/7 Power Backup",
  "Free On-site Parking",
  "Fresh Linens & Towels",
  "Daily Housekeeping",
];

export function AdminRoomsTab({
  initialRooms,
  mediaItems,
  onFeedback,
}: {
  initialRooms: PublicRoomItem[];
  mediaItems: PublicMediaItem[];
  onFeedback: (msg: string, isError?: boolean) => void;
}) {
  const [rooms, setRooms] = useState<PublicRoomItem[]>(initialRooms);
  const [editingRoom, setEditingRoom] = useState<PublicRoomItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  function startCreate() {
    setIsNew(true);
    setEditingRoom({
      id: 0,
      name: "",
      slug: "",
      shortDescription: "",
      fullDescription: "",
      capacityGuests: 4,
      bedInfo: "2 Main Beds + 2 Optional Add-on Beds",
      pricingNote: "Prices provided upon enquiry",
      imageUrl: "https://images.unsplash.com/photo-1779870458288-95fd59cd2c5b?auto=format&fit=crop&w=1400&q=80",
      galleryImages: [],
      facilities: [
        "Air Conditioning",
        "Complimentary Wi-Fi",
        "Private En-suite Bathroom",
      ],
      isFeatured: true,
      isVisible: true,
      sortOrder: rooms.length + 1,
    });
  }

  function startEdit(room: PublicRoomItem) {
    setIsNew(false);
    setEditingRoom({ ...room });
  }

  function duplicateRoom(room: PublicRoomItem) {
    setIsNew(true);
    setEditingRoom({
      ...room,
      id: 0,
      name: `${room.name} (Copy)`,
      slug: `${room.slug}-copy`,
      sortOrder: rooms.length + 1,
    });
  }

  async function handleSaveRoom(e: React.FormEvent) {
    e.preventDefault();
    if (!editingRoom) return;

    setSaving(true);
    try {
      const endpoint = isNew ? "/api/admin/rooms" : `/api/admin/rooms/${editingRoom.id}`;
      const method = isNew ? "POST" : "PATCH";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingRoom),
      });

      const data = await res.json();
      if (!res.ok || !data.room) {
        onFeedback(data.error || "Failed to save room.", true);
        return;
      }

      if (isNew) {
        setRooms([...rooms, data.room]);
        onFeedback("Added new room listing.");
      } else {
        setRooms(rooms.map((r) => (r.id === data.room.id ? data.room : r)));
        onFeedback("Updated room specifications.");
      }
      setEditingRoom(null);
    } catch {
      onFeedback("Network error while saving room.", true);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/rooms/${id}`, { method: "DELETE" });
      if (!res.ok) {
        onFeedback("Failed to delete room.", true);
        return;
      }
      setRooms(rooms.filter((r) => r.id !== id));
      setDeletingId(null);
      if (editingRoom?.id === id) setEditingRoom(null);
      onFeedback("Deleted room listing.");
    } catch {
      onFeedback("Network error while deleting room.", true);
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisibility(room: PublicRoomItem) {
    const nextVal = !room.isVisible;
    try {
      const res = await fetch(`/api/admin/rooms/${room.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: nextVal }),
      });
      if (!res.ok) {
        onFeedback("Failed to toggle visibility.", true);
        return;
      }
      setRooms(
        rooms.map((r) => (r.id === room.id ? { ...r, isVisible: nextVal } : r))
      );
      onFeedback(nextVal ? "Room is now visible on public site." : "Room hidden from public site.");
    } catch {
      onFeedback("Network error.", true);
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-eden-line/60 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C5A059]">
            <BedDouble className="h-3.5 w-3.5" />
            Accommodation Manager
          </span>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-eden-ink">
            Rooms & Accommodation ({rooms.length})
          </h1>
          <p className="text-xs sm:text-sm text-eden-muted">
            Manage your single beachfront room, capacities, bed setups, amenities, and pricing notes.
          </p>
        </div>

        <button
          type="button"
          onClick={startCreate}
          className="canva-btn-camel flex items-center gap-1.5 text-xs cursor-pointer shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>Add Room Listing</span>
        </button>
      </div>

      {/* Room Form Modal / Inline Editor */}
      {editingRoom && (
        <div className="rounded-[28px] border-2 border-[#C5A059] bg-eden-surface p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-eden-line pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5A059]">
                {isNew ? "Create Room Listing" : "Edit Room Specifications"}
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-eden-ink">
                {editingRoom.name || "Untitled Room"}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setEditingRoom(null)}
              className="p-1.5 text-eden-muted hover:text-eden-ink rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSaveRoom} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-eden-soft">
                  Room Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingRoom.name}
                  onChange={(e) =>
                    setEditingRoom({ ...editingRoom, name: e.target.value })
                  }
                  className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm font-semibold text-eden-ink outline-none focus:border-[#C5A059]"
                  placeholder="The Private Beachfront Sanctuary"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-eden-soft">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={editingRoom.slug}
                  onChange={(e) =>
                    setEditingRoom({ ...editingRoom, slug: e.target.value })
                  }
                  className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none focus:border-[#C5A059]"
                  placeholder="beachfront-sanctuary"
                />
              </div>

              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-eden-soft">
                  <Users className="h-3.5 w-3.5" />
                  Maximum Guests *
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  required
                  value={editingRoom.capacityGuests}
                  onChange={(e) =>
                    setEditingRoom({
                      ...editingRoom,
                      capacityGuests: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-eden-soft">
                  <BedDouble className="h-3.5 w-3.5" />
                  Bed Configuration *
                </label>
                <input
                  type="text"
                  required
                  value={editingRoom.bedInfo}
                  onChange={(e) =>
                    setEditingRoom({ ...editingRoom, bedInfo: e.target.value })
                  }
                  className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none focus:border-[#C5A059]"
                  placeholder="2 Main Beds + 2 Optional Add-on Beds"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-eden-soft">
                  Short Summary (Room Card) *
                </label>
                <input
                  type="text"
                  required
                  value={editingRoom.shortDescription}
                  onChange={(e) =>
                    setEditingRoom({
                      ...editingRoom,
                      shortDescription: e.target.value,
                    })
                  }
                  className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none focus:border-[#C5A059]"
                  placeholder="A quiet, secluded coastal room reserved exclusively for your party..."
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-eden-soft">
                  Full Detailed Description
                </label>
                <textarea
                  rows={3}
                  value={editingRoom.fullDescription}
                  onChange={(e) =>
                    setEditingRoom({
                      ...editingRoom,
                      fullDescription: e.target.value,
                    })
                  }
                  className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none focus:border-[#C5A059]"
                  placeholder="Experience dedicated coastal hospitality with one exclusive private beachfront room..."
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-eden-soft">
                  Primary Room Photograph URL *
                </label>
                <input
                  type="text"
                  required
                  value={editingRoom.imageUrl}
                  onChange={(e) =>
                    setEditingRoom({ ...editingRoom, imageUrl: e.target.value })
                  }
                  className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none focus:border-[#C5A059]"
                  placeholder="https://... or /uploads/..."
                />
                {mediaItems.length > 0 && (
                  <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-eden-muted">
                    <span>Quick pick from media:</span>
                    {mediaItems.slice(0, 5).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() =>
                          setEditingRoom({ ...editingRoom, imageUrl: m.url })
                        }
                        className="rounded-lg border border-eden-line bg-eden-inset px-2 py-0.5 text-[11px] hover:border-[#C5A059]"
                      >
                        {m.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-eden-soft">
                  Pricing Note
                </label>
                <input
                  type="text"
                  value={editingRoom.pricingNote}
                  onChange={(e) =>
                    setEditingRoom({ ...editingRoom, pricingNote: e.target.value })
                  }
                  className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none focus:border-[#C5A059]"
                  placeholder="Prices provided upon enquiry"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-eden-soft">
                  Display Order
                </label>
                <input
                  type="number"
                  min={1}
                  value={editingRoom.sortOrder}
                  onChange={(e) =>
                    setEditingRoom({
                      ...editingRoom,
                      sortOrder: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* Room Facilities Checkboxes */}
            <div className="space-y-2 pt-2 border-t border-eden-line">
              <span className="block text-xs font-semibold uppercase tracking-wider text-eden-soft">
                Included Facilities
              </span>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {STANDARD_FACILITIES.map((fac) => {
                  const checked = editingRoom.facilities.includes(fac);
                  return (
                    <label
                      key={fac}
                      className="flex items-center gap-2.5 rounded-xl bg-eden-inset p-2.5 text-xs text-eden-ink cursor-pointer hover:bg-eden-surface border border-eden-line/40"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...editingRoom.facilities, fac]
                            : editingRoom.facilities.filter((f) => f !== fac);
                          setEditingRoom({ ...editingRoom, facilities: next });
                        }}
                        className="rounded accent-[#C5A059]"
                      />
                      <span>{fac}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap gap-4 pt-3 border-t border-eden-line">
              <label className="flex items-center gap-2 text-xs font-semibold text-eden-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingRoom.isFeatured}
                  onChange={(e) =>
                    setEditingRoom({ ...editingRoom, isFeatured: e.target.checked })
                  }
                  className="rounded accent-[#C5A059]"
                />
                <span>Featured on Homepage</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-eden-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingRoom.isVisible}
                  onChange={(e) =>
                    setEditingRoom({ ...editingRoom, isVisible: e.target.checked })
                  }
                  className="rounded accent-[#C5A059]"
                />
                <span>Active & Published</span>
              </label>
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-eden-line">
              <button
                type="button"
                onClick={() => setEditingRoom(null)}
                className="rounded-full border border-eden-line px-5 py-2.5 text-xs font-semibold text-eden-muted hover:bg-eden-inset"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="canva-btn-camel flex items-center gap-1.5 text-xs"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>Save Room</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rooms Showcase Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {rooms.map((room) => (
          <div
            key={room.id}
            className={`glass-card rounded-[28px] overflow-hidden border transition-all duration-300 ${
              room.isVisible ? "border-eden-line/60" : "border-rose-300 opacity-60"
            }`}
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/20">
              <CoastalImage
                src={room.imageUrl}
                alt={room.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                {room.isFeatured && (
                  <span className="rounded-full bg-[#C5A059] px-3 py-1 text-[10px] font-bold text-white shadow-md flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Featured
                  </span>
                )}
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold shadow-md ${
                    room.isVisible
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-700 text-white"
                  }`}
                >
                  {room.isVisible ? "Live" : "Hidden"}
                </span>
              </div>
              <span className="absolute bottom-3 right-3 rounded-full bg-black/75 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
                Order #{room.sortOrder}
              </span>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-eden-ink">{room.name}</h3>
                <p className="mt-1 text-xs text-eden-muted leading-relaxed line-clamp-2">
                  {room.shortDescription}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-xs text-eden-muted border-y border-eden-line/40 py-2.5">
                <div className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-[#C5A059]" />
                  <span>Max {room.capacityGuests} Guests</span>
                </div>
                <div className="flex items-center gap-1">
                  <BedDouble className="h-3.5 w-3.5 text-[#C5A059]" />
                  <span>{room.bedInfo}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <span className="font-mono text-xs font-semibold text-[#C5A059]">
                  {room.pricingNote}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleVisibility(room)}
                    className="p-2 rounded-xl text-eden-muted hover:bg-eden-inset"
                    title={room.isVisible ? "Hide from public" : "Publish to public"}
                  >
                    {room.isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => duplicateRoom(room)}
                    className="p-2 rounded-xl text-eden-muted hover:bg-eden-inset"
                    title="Duplicate room"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(room)}
                    className="p-2 rounded-xl text-[#C5A059] hover:bg-[#C5A059]/10"
                    title="Edit room"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingId(room.id)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50"
                    title="Delete room"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Delete Confirmation Banner */}
            {deletingId === room.id && (
              <div className="bg-rose-50 border-t border-rose-200 p-4 flex items-center justify-between text-xs text-rose-900">
                <span>Are you sure you want to delete this room listing?</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDeletingId(null)}
                    className="rounded-lg px-2.5 py-1 text-slate-600 hover:bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(room.id)}
                    className="rounded-lg bg-rose-600 px-3 py-1 font-bold text-white hover:bg-rose-700"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
