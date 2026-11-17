"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, Plus, Trash2 } from "lucide-react";
import { CoastalImage } from "@/components/CoastalImage";
import type { PublicGalleryImage } from "@/db/defaults";
import { GALLERY_CATEGORIES, type GalleryCategory } from "@/db/schema";

export function AdminGalleryTab({
  images,
  onChange,
  onFeedback,
}: {
  images: PublicGalleryImage[];
  onChange: (next: PublicGalleryImage[]) => void;
  onFeedback: (msg: string, isError?: boolean) => void;
}) {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState<GalleryCategory>("Bedroom");
  const [imageUrl, setImageUrl] = useState("");
  const [isStockPlaceholder, setIsStockPlaceholder] = useState(false);
  const [sortOrder, setSortOrder] = useState(images.length + 1);
  const [busy, setBusy] = useState(false);

  async function addImage(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          caption,
          category,
          imageUrl,
          isStockPlaceholder,
          sortOrder,
          isVisible: true,
        }),
      });
      const data = (await res.json()) as {
        image?: PublicGalleryImage;
        error?: string;
      };
      if (!res.ok || !data.image) {
        onFeedback(data.error || "Failed to add gallery image.", true);
        return;
      }
      onChange([...images, data.image]);
      setTitle("");
      setCaption("");
      setImageUrl("");
      onFeedback("Added gallery image.");
    } catch {
      onFeedback("Network error while adding image.", true);
    } finally {
      setBusy(false);
    }
  }

  async function patchImage(
    id: number,
    patch: Partial<PublicGalleryImage>
  ) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = (await res.json()) as {
        image?: PublicGalleryImage;
        error?: string;
      };
      if (!res.ok || !data.image) {
        onFeedback(data.error || "Failed to update image.", true);
        return;
      }
      onChange(images.map((img) => (img.id === id ? data.image! : img)));
      onFeedback("Updated gallery image.");
    } catch {
      onFeedback("Network error while updating image.", true);
    } finally {
      setBusy(false);
    }
  }

  async function deleteImage(id: number) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) {
        onFeedback("Could not delete image.", true);
        return;
      }
      onChange(images.filter((img) => img.id !== id));
      onFeedback("Deleted gallery image.");
    } catch {
      onFeedback("Network error while deleting image.", true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={addImage}
        className="glass-card rounded-[26px] p-6 space-y-4"
      >
        <h3 className="text-lg font-bold text-eden-ink">
          Add Photo by URL
        </h3>
        <p className="text-xs text-eden-muted">
          Paste a direct image URL (`https://...`). Uncheck &ldquo;Temporary Stock
          Preview&rdquo; when adding real photos of The Eden – Beach Homestay.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-eden-soft">
              Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Beachfront Room Morning View"
              className="w-full rounded-2xl border border-eden-line bg-eden-input px-3.5 py-2 text-sm text-eden-ink"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-eden-soft">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as GalleryCategory)}
              className="w-full rounded-2xl border border-eden-line bg-eden-input px-3.5 py-2 text-sm text-eden-ink"
            >
              {GALLERY_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
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
              placeholder="https://..."
              className="w-full rounded-2xl border border-eden-line bg-eden-input px-3.5 py-2 text-sm text-eden-ink"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-eden-soft">
              Caption
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Short description shown under the photo"
              className="w-full rounded-2xl border border-eden-line bg-eden-input px-3.5 py-2 text-sm text-eden-ink"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-eden-soft">
              Display Order
            </label>
            <input
              type="number"
              min={0}
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="w-full rounded-2xl border border-eden-line bg-eden-input px-3.5 py-2 text-sm text-eden-ink"
            />
          </div>
          <div className="flex items-end">
            <label className="flex cursor-pointer items-center gap-2 rounded-2xl bg-eden-inset px-3.5 py-2.5 text-xs font-semibold text-eden-ink">
              <input
                type="checkbox"
                checked={isStockPlaceholder}
                onChange={(e) => setIsStockPlaceholder(e.target.checked)}
              />
              Mark as Stock Preview
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-eden-btn px-5 py-2.5 text-sm font-semibold text-eden-btn-ink transition hover:bg-eden-btn-hover"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Add Image to Gallery
        </button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img) => (
          <article
            key={img.id}
            className="glass-card overflow-hidden rounded-[24px]"
          >
            <div className="relative aspect-[16/10] w-full">
              <CoastalImage
                src={img.imageUrl}
                alt={img.title}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
              <span className="absolute left-3 top-3 rounded-full bg-[#142033]/85 px-2.5 py-1 text-[10px] font-bold text-white">
                {img.category}
              </span>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <h4 className="font-bold text-eden-ink">{img.title}</h4>
                <p className="mt-0.5 text-xs text-eden-muted">{img.caption}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    patchImage(img.id, {
                      isStockPlaceholder: !img.isStockPlaceholder,
                    })
                  }
                  className={`cursor-pointer rounded-full px-3 py-1 text-[11px] font-bold ${
                    img.isStockPlaceholder
                      ? "bg-[#F5B69E]/45 text-eden-ink"
                      : "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-200"
                  }`}
                >
                  {img.isStockPlaceholder
                    ? "Stock Preview (Click to mark Actual)"
                    : "Actual Property Photo"}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    patchImage(img.id, { isVisible: !img.isVisible })
                  }
                  className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-eden-line bg-eden-inset px-3 py-1 text-[11px] font-semibold text-eden-ink"
                >
                  {img.isVisible ? (
                    <>
                      <Eye className="h-3 w-3" /> Visible
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3" /> Hidden
                    </>
                  )}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => deleteImage(img.id)}
                  className="ml-auto inline-flex cursor-pointer items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

