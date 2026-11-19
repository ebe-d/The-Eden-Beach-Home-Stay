"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import type { ThemeDecorations } from "@/db/schema";

export function FestivalDecorations({
  decorations,
}: {
  decorations?: ThemeDecorations;
}) {
  const [bannerDismissed, setBannerDismissed] = useState(false);

  if (!decorations || !decorations.enabled || decorations.type === "none") {
    return null;
  }

  const { type, subtleBanner, festiveGreeting } = decorations;

  return (
    <>
      {/* 1. Optional Subtle Festive Banner */}
      {subtleBanner && festiveGreeting && !bannerDismissed && (
        <aside
          aria-label="Festive Announcement"
          className="relative z-40 bg-gradient-to-r from-canva-forest via-canva-olive to-canva-forest text-[#FAF7F2] py-2 px-4 text-center border-b border-canva-camel/30 shadow-sm"
        >
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex-1 text-center font-serif tracking-wide text-canva-camel">
              <span className="mr-2 inline-block font-sans text-xs">
                {type === "diwali-diyas" && "🪔"}
                {type === "christmas-pine" && "🎄"}
                {type === "newyear-sparkles" && "✨"}
                {type === "holi-colours" && "🎨"}
                {type === "summer-waves" && "🌊"}
                {type === "monsoon-raindrops" && "🌧️"}
                {type === "winter-warmth" && "🕯️"}
              </span>
              <span className="font-medium text-[#FAF7F2]">
                {festiveGreeting}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setBannerDismissed(true)}
              className="text-[#FAF7F2]/60 hover:text-white p-1 rounded-full transition"
              aria-label="Dismiss banner"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </aside>
      )}

      {/* 2. Tasteful Festival Accents (Non-intrusive, pointer-events-none) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-30 overflow-hidden select-none"
      >
        {/* Diwali Diya Glow & Accents */}
        {type === "diwali-diyas" && (
          <>
            {/* Top right golden ambient aura */}
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#D49A3D]/10 blur-3xl animate-pulse-gentle" />
            {/* Bottom left warm candlelight glow */}
            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#BA7F25]/10 blur-3xl" />
            {/* Subtle floating gold diya accent in top corner */}
            <div className="absolute top-20 right-6 opacity-30 sm:right-16 sm:opacity-40">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-canva-camel">
                <path
                  d="M20 6C20 6 23 12 23 15C23 16.6569 21.6569 18 20 18C18.3431 18 17 16.6569 17 15C17 12 20 6 20 6Z"
                  fill="currentColor"
                />
                <path
                  d="M6 22C6 22 9 32 20 32C31 32 34 22 34 22C34 22 28 26 20 26C12 26 6 22 6 22Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </>
        )}

        {/* Christmas Pine & Star Accents */}
        {type === "christmas-pine" && (
          <>
            <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-[#A8383B]/8 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[#1E3F2B]/12 blur-3xl" />
            <div className="absolute top-24 left-6 opacity-25 sm:left-12 sm:opacity-35 text-canva-camel">
              <Sparkles className="h-6 w-6" />
            </div>
          </>
        )}

        {/* New Year Midnight Sparkle Accents */}
        {type === "newyear-sparkles" && (
          <>
            <div className="absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-[#D4AF37]/10 blur-3xl" />
            <div className="absolute top-28 right-8 opacity-30 text-[#D4AF37] sm:right-20 sm:opacity-40">
              <Sparkles className="h-7 w-7" />
            </div>
          </>
        )}

        {/* Holi Pastel Colour Dust Accents */}
        {type === "holi-colours" && (
          <>
            <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[#D96B43]/8 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-[#7A9E77]/8 blur-3xl" />
          </>
        )}

        {/* Summer Ocean Wave Aura */}
        {type === "summer-waves" && (
          <div className="absolute -top-24 right-10 h-72 w-72 rounded-full bg-[#1E4E68]/8 blur-3xl" />
        )}

        {/* Monsoon Rain Mist Aura */}
        {type === "monsoon-raindrops" && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#294336]/4 via-transparent to-[#0F261C]/5" />
        )}

        {/* Winter Hearth Warmth Aura */}
        {type === "winter-warmth" && (
          <div className="absolute -bottom-28 right-10 h-80 w-80 rounded-full bg-[#B8844F]/10 blur-3xl" />
        )}
      </div>
    </>
  );
}
