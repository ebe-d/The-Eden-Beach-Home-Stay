"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Info, Maximize2, X } from "lucide-react";
import type { PublicGalleryImage } from "@/db/defaults";
import { GALLERY_CATEGORIES } from "@/db/schema";
import { CoastalImage } from "./CoastalImage";

export function GalleryGrid({
  images,
  showFilters = true,
  limit,
}: {
  images: PublicGalleryImage[];
  showFilters?: boolean;
  limit?: number;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeImage, setActiveImage] = useState<PublicGalleryImage | null>(null);

  const filteredImages = useMemo(() => {
    const base =
      selectedCategory === "All"
        ? images
        : images.filter((img) => img.category === selectedCategory);
    return typeof limit === "number" ? base.slice(0, limit) : base;
  }, [images, selectedCategory, limit]);

  const hasStockPlaceholders = filteredImages.some((i) => i.isStockPlaceholder);

  return (
    <div className="space-y-6">
      {hasStockPlaceholders && (
        <div className="flex items-start gap-3 rounded-2xl border border-eden-line bg-eden-inset px-4 py-3.5 text-xs leading-relaxed text-eden-ink sm:text-sm">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-eden-blue" />
          <div>
            <span className="font-semibold">Temporary Stock Preview:</span> Images
            marked <span className="font-semibold">&ldquo;Stock Preview&rdquo;</span>{" "}
            are illustrative coastal and interior placeholders used until actual photos
            of The Eden – Beach Homestay are uploaded by the owner. They do not depict
            the property itself.
          </div>
        </div>
      )}

      {showFilters && (
        <div
          role="tablist"
          aria-label="Filter gallery by category"
          className="flex flex-wrap gap-2"
        >
          {["All", ...GALLERY_CATEGORIES].map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(cat)}
                className={`cursor-pointer rounded-full px-4 py-2 text-xs font-semibold btn-interactive active:scale-95 transition-all duration-200 sm:text-sm ${
                  active
                    ? "bg-[#C5A059] text-[#080E1A] shadow-md font-bold border border-[#DFBA73]"
                    : "glass-pill text-eden-ink hover:opacity-90 hover:border-[#C5A059]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredImages.map((item) => (
          <article
            key={item.id}
            className="glass-card group overflow-hidden rounded-[26px] interactive-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
          >
            <button
              type="button"
              onClick={() => setActiveImage(item)}
              className="relative block aspect-[4/3] w-full cursor-pointer overflow-hidden text-left zoom-image-wrapper"
              aria-label={`View larger preview of ${item.title}`}
            >
              <CoastalImage
                src={item.imageUrl}
                alt={
                  item.isStockPlaceholder
                    ? `${item.title} (Temporary illustrative stock image)`
                    : item.title
                }
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover zoom-image transition-transform duration-700 ease-out group-hover:scale-108"
              />
              <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 p-3 z-10">
                <span className="rounded-full bg-[#142033]/85 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md shadow-sm">
                  {item.category}
                </span>
                {item.isStockPlaceholder ? (
                  <span className="rounded-full bg-[#F5B69E]/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#1C2A45] shadow-sm">
                    Stock Preview
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-100/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-950 shadow-sm">
                    Property Photo
                  </span>
                )}
              </div>
              <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-eden-surface text-eden-ink opacity-0 translate-y-2 shadow-md transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                <Maximize2 className="h-3.5 w-3.5" />
              </span>
            </button>

            <div className="p-4 sm:p-5">
              <h3 className="font-serif text-lg font-bold text-eden-ink">{item.title}</h3>
              {item.caption && (
                <p className="mt-1 text-xs leading-relaxed text-eden-muted sm:text-sm">
                  {item.caption}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="glass-card rounded-3xl p-8 text-center text-sm text-eden-muted">
          No images are currently listed in this category.
        </div>
      )}

      {/* Lightbox Modal with Smooth AnimatePresence */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#09111E]/80 p-4 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label={activeImage.title}
            onClick={() => setActiveImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card relative w-full max-w-4xl overflow-hidden rounded-[28px] p-4 shadow-2xl sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveImage(null)}
                aria-label="Close image preview"
                className="absolute right-6 top-6 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-eden-surface text-eden-ink shadow-md btn-interactive active:scale-90 hover:scale-105"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl zoom-image-wrapper">
                <CoastalImage
                  src={activeImage.imageUrl}
                  alt={activeImage.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-4 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-eden-ink">
                    {activeImage.title}
                  </h3>
                  {activeImage.caption && (
                    <p className="mt-1 text-sm text-eden-muted">
                      {activeImage.caption}
                    </p>
                  )}
                </div>
                {activeImage.isStockPlaceholder && (
                  <span className="rounded-full bg-[#F5B69E]/45 px-3 py-1 text-xs font-semibold text-eden-ink">
                    Temporary Stock Image (Not Actual Property Photo)
                  </span>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

