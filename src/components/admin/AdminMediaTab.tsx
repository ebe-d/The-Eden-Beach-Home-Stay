"use client";

import { useRef, useState } from "react";
import {
  Check,
  Copy,
  ExternalLink,
  Filter,
  Image as ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Save,
  Star,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import type { PublicMediaItem } from "@/db/defaults";
import { GALLERY_CATEGORIES } from "@/db/schema";
import { CoastalImage } from "@/components/CoastalImage";

export function AdminMediaTab({
  initialItems,
  onFeedback,
}: {
  initialItems: PublicMediaItem[];
  onFeedback: (msg: string, isError?: boolean) => void;
}) {
  const [items, setItems] = useState<PublicMediaItem[]>(initialItems);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [editingItem, setEditingItem] = useState<PublicMediaItem | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [newCatInput, setNewCatInput] = useState("");
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allCategories = [
    "All",
    ...GALLERY_CATEGORIES,
    ...customCategories.filter((c) => !GALLERY_CATEGORIES.includes(c as any)),
  ];

  const filteredItems = items.filter(
    (item) => activeCategory === "All" || item.category === activeCategory
  );

  async function handleFileUpload(files: FileList | null) {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(20);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    if (activeCategory !== "All") {
      formData.append("category", activeCategory);
    }

    try {
      setUploadProgress(50);
      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(85);
      const data = await res.json();
      if (!res.ok || !data.items) {
        onFeedback(data.error || "Failed to upload images.", true);
        return;
      }

      setItems([...data.items, ...items]);
      setUploadProgress(100);
      onFeedback(`Successfully uploaded ${data.items.length} photo(s)!`);
    } catch {
      onFeedback("Network error during file upload.", true);
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }, 400);
    }
  }

  async function handleSaveItem(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const res = await fetch(`/api/admin/media/${editingItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });
      const data = await res.json();
      if (!res.ok || !data.item) {
        onFeedback(data.error || "Failed to update image details.", true);
        return;
      }

      setItems(items.map((m) => (m.id === data.item.id ? data.item : m)));
      setEditingItem(null);
      onFeedback("Updated photo details.");
    } catch {
      onFeedback("Network error.", true);
    }
  }

  async function handleDelete(id: number) {
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      if (!res.ok) {
        onFeedback("Failed to delete photo.", true);
        return;
      }
      setItems(items.filter((m) => m.id !== id));
      setDeletingId(null);
      if (editingItem?.id === id) setEditingItem(null);
      onFeedback("Deleted photo.");
    } catch {
      onFeedback("Network error.", true);
    }
  }

  function copyUrl(item: PublicMediaItem) {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
    onFeedback("Copied photo URL to clipboard!");
  }

  function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    const clean = newCatInput.trim();
    if (clean && !customCategories.includes(clean)) {
      setCustomCategories([...customCategories, clean]);
      setActiveCategory(clean);
      setNewCatInput("");
      onFeedback(`Added category "${clean}".`);
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-eden-line/60 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C5A059]">
            <ImageIcon className="h-3.5 w-3.5" />
            Media Storage & Photo Library
          </span>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-eden-ink">
            Photo & Media Manager ({items.length})
          </h1>
          <p className="text-xs sm:text-sm text-eden-muted">
            Upload multiple photos from your device, organize categories, and select photos for your homepage and gallery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="canva-btn-camel flex items-center gap-2 text-xs cursor-pointer shadow-md"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="h-4 w-4" />
            )}
            <span>{uploading ? "Uploading..." : "Upload Photos"}</span>
          </button>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFileUpload(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className="rounded-[28px] border-2 border-dashed border-[#C5A059]/40 bg-eden-inset p-8 text-center hover:bg-eden-surface hover:border-[#C5A059] transition cursor-pointer"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C5A059]/10 text-[#C5A059]">
          <UploadCloud className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-sm font-bold text-eden-ink">
          Drag & drop photos here, or click to browse
        </h3>
        <p className="mt-1 text-xs text-eden-muted">
          Supports JPEG, PNG, WebP, AVIF, GIF up to 10MB per image.
        </p>

        {uploading && (
          <div className="mt-4 max-w-xs mx-auto">
            <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-[#C5A059] transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span className="mt-1.5 block text-[11px] font-semibold text-eden-muted">
              Processing & optimizing upload ({uploadProgress}%)...
            </span>
          </div>
        )}
      </div>

      {/* Category Pills & Category Creator */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {allCategories.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "bg-[#C5A059] text-white shadow-sm font-bold"
                    : "bg-eden-inset text-eden-ink hover:bg-eden-surface border border-eden-line/40"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleAddCategory} className="flex items-center gap-2">
          <input
            type="text"
            value={newCatInput}
            onChange={(e) => setNewCatInput(e.target.value)}
            placeholder="New category..."
            className="rounded-full border border-eden-line bg-eden-input px-3.5 py-1 text-xs text-eden-ink outline-none focus:border-[#C5A059]"
          />
          <button
            type="submit"
            className="rounded-full bg-[#0E1829] text-[#DFBA73] border border-[#C5A059]/40 px-3 py-1 text-xs font-semibold hover:bg-[#070D18]"
          >
            Add
          </button>
        </form>
      </div>

      {/* Edit Image Modal */}
      {editingItem && (
        <div className="rounded-[28px] border-2 border-[#C5A059] bg-eden-surface p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-eden-line pb-3">
            <h3 className="font-serif text-xl font-bold text-eden-ink">
              Edit Photo Details
            </h3>
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="p-1 text-eden-muted hover:text-eden-ink"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSaveItem} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-eden-soft">
                Photo Title
              </label>
              <input
                type="text"
                required
                value={editingItem.title}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, title: e.target.value })
                }
                className="w-full rounded-xl border border-eden-line bg-eden-input px-3.5 py-2 text-xs text-eden-ink"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-eden-soft">
                Category
              </label>
              <select
                value={editingItem.category}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, category: e.target.value })
                }
                className="w-full rounded-xl border border-eden-line bg-eden-input px-3.5 py-2 text-xs text-eden-ink"
              >
                {allCategories
                  .filter((c) => c !== "All")
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-eden-soft">
                Alt Text (for accessibility & SEO)
              </label>
              <input
                type="text"
                value={editingItem.altText}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, altText: e.target.value })
                }
                className="w-full rounded-xl border border-eden-line bg-eden-input px-3.5 py-2 text-xs text-eden-ink"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-eden-soft">
                Caption
              </label>
              <input
                type="text"
                value={editingItem.caption}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, caption: e.target.value })
                }
                className="w-full rounded-xl border border-eden-line bg-eden-input px-3.5 py-2 text-xs text-eden-ink"
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-between pt-2 border-t border-eden-line">
              <label className="flex items-center gap-2 text-xs font-semibold text-eden-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingItem.isFeaturedHomepage}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      isFeaturedHomepage: e.target.checked,
                    })
                  }
                  className="rounded accent-[#C5A059]"
                />
                <span>Feature on Homepage Gallery Preview</span>
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="rounded-full border border-eden-line px-4 py-1.5 text-xs text-eden-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="canva-btn-camel text-xs py-1.5 px-4"
                >
                  Save Photo
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Media Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="glass-card rounded-[28px] p-12 text-center text-eden-muted">
          <ImageIcon className="mx-auto h-12 w-12 text-eden-muted/40" />
          <h3 className="mt-3 text-base font-bold text-eden-ink">No photos found</h3>
          <p className="mt-1 text-xs">
            {activeCategory === "All"
              ? "Upload your first photo using the button or dropzone above."
              : `No photos currently categorized under "${activeCategory}".`}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="glass-card group rounded-2xl overflow-hidden border border-eden-line/60 hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/20">
                <CoastalImage
                  src={item.url}
                  alt={item.altText || item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 flex gap-1.5">
                  <span className="rounded-full bg-black/75 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                    {item.category}
                  </span>
                  {item.isFeaturedHomepage && (
                    <span className="rounded-full bg-[#C5A059] p-1 text-white shadow-sm" title="Featured on Homepage">
                      <Star className="h-3 w-3 fill-current" />
                    </span>
                  )}
                </div>

                <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-white backdrop-blur-sm">
                  {item.storageType}
                </span>
              </div>

              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-eden-ink truncate" title={item.title}>
                    {item.title}
                  </h4>
                  {item.caption && (
                    <p className="text-[11px] text-eden-muted truncate">{item.caption}</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-eden-line/40 text-xs">
                  <button
                    type="button"
                    onClick={() => copyUrl(item)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-eden-muted hover:text-eden-ink"
                    title="Copy image URL"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingItem(item)}
                      className="p-1 text-[#C5A059] hover:bg-[#C5A059]/10 rounded-lg"
                      title="Edit photo info"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingId(item.id)}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg"
                      title="Delete photo"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {deletingId === item.id && (
                  <div className="mt-2 rounded-xl bg-rose-50 border border-rose-200 p-2 text-[11px] text-rose-900 flex items-center justify-between">
                    <span>Delete this photo?</span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setDeletingId(null)}
                        className="px-1.5 py-0.5 text-slate-600"
                      >
                        No
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="rounded bg-rose-600 px-2 py-0.5 font-bold text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
