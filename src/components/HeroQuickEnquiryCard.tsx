"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { PublicGalleryImage } from "@/db/defaults";
import { CoastalImage } from "./CoastalImage";
import { useEnquiry } from "./EnquiryProvider";

export function HeroQuickEnquiryCard({
  previewImages,
}: {
  previewImages: PublicGalleryImage[];
}) {
  const { openQuoteModal } = useEnquiry();
  const [checkIn, setCheckIn] = useState("");
  const [guests, setGuests] = useState(2);

  return (
    <div className="glass-card interactive-card rounded-[26px] p-4 text-eden-ink sm:p-5">
      <h2 className="text-lg font-bold tracking-tight sm:text-xl">
        Plan Your
        <br />
        Beachfront Stay
      </h2>

      <div className="mt-3.5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-2xl border border-eden-line bg-eden-input p-2.5 shadow-sm sm:flex sm:gap-2 sm:rounded-full sm:p-1.5 transition-all focus-within:border-eden-blue focus-within:ring-2 focus-within:ring-eden-blue/20">
        <label className="min-w-0 sm:flex-1 sm:pl-3">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-eden-muted sm:hidden">
            Check-in
          </span>
          <input
            type="date"
            aria-label="Preferred check-in date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full min-w-0 max-w-full bg-transparent text-xs font-medium text-eden-ink outline-none"
          />
        </label>

        <label className="shrink-0">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-eden-muted sm:hidden">
            Guests
          </span>
          <select
            aria-label="Number of guests"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="shrink-0 rounded-full bg-eden-inset px-2.5 py-1.5 text-xs font-semibold text-eden-ink outline-none cursor-pointer transition hover:bg-eden-surface"
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n} Guest{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={() =>
            openQuoteModal({
              context: {
                checkIn: checkIn || undefined,
                guests,
              },
            })
          }
          aria-label="Open stay enquiry form"
          className="col-span-2 flex h-10 w-full shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-eden-btn px-4 text-xs font-semibold text-eden-btn-ink btn-interactive active:scale-95 hover:bg-eden-btn-hover transition-all duration-200 sm:col-auto sm:h-8 sm:w-8 sm:rounded-full sm:px-0"
        >
          <span className="sm:hidden">Check Dates & Quote</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex -space-x-2">
          {previewImages.slice(0, 3).map((img) => (
            <div
              key={img.id}
              className="relative h-9 w-9 overflow-hidden rounded-xl border-2 border-eden-surface shadow-sm transition-transform duration-300 hover:scale-115 hover:z-10"
            >
              <CoastalImage
                src={img.imageUrl}
                alt={img.title}
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div className="text-xs leading-tight">
          <div className="font-bold text-eden-ink">1 Private Room</div>
          <div className="text-[11px] text-eden-muted">
            Price on Enquiry • Max 4 Guests
          </div>
        </div>
      </div>
    </div>
  );
}

