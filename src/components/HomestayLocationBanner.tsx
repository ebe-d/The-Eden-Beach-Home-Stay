"use client";

import { MapPin, Navigation, Compass, ShieldCheck } from "lucide-react";

export function HomestayLocationBanner() {
  const homestayAddress =
    "Intersection of Bailur Beach Road, Christiankeri, Bailur, Murudeshwar, Karnataka 581350, India";
  const plusCode = "4F9P+PC Bailur, Karnataka, India";
  const homestayMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    plusCode
  )}`;

  return (
    <div className="glass-card interactive-card overflow-hidden rounded-[28px] border border-[#C5A059]/25 p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-eden-line/60 pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C5A059]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">
            <Compass className="h-3.5 w-3.5" />
            Coastal Orientation & Reference Base
          </span>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-medium text-eden-ink">
            The Eden Beach Home Stay — Your Coastal Base
          </h2>
          <p className="mt-1 text-xs text-eden-muted sm:text-sm">
            Use our quiet beachfront property as your geographical reference point when exploring nearby attractions.
          </p>
        </div>

        <a
          href={homestayMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="canva-btn-camel text-xs py-2 px-4 shadow-none"
        >
          <MapPin className="h-3.5 w-3.5 mr-1.5 text-white" />
          <span>Open Homestay on Google Maps</span>
          <Navigation className="h-3 w-3 ml-1.5" />
        </a>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Bailur vs Murudeshwar Distinction */}
        <div className="rounded-2xl bg-eden-inset/80 p-5 border border-eden-line/40">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              1
            </span>
            <h3 className="text-sm font-bold text-eden-ink sm:text-base">
              Bailur (Christiankeri) — Peaceful Beachfront
            </h3>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-eden-muted sm:text-sm">
            <strong className="text-eden-ink">Where you stay:</strong> The Eden is located right here in Bailur, Christiankeri. It offers peaceful, unhurried seaside relaxation with direct doorstep access to tranquil <span className="font-semibold text-eden-ink">Tudalli Beach</span>, far away from commercial tourist crowds and temple traffic.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>0 km doorstep beach access • Untouched shoreline</span>
          </div>
        </div>

        <div className="rounded-2xl bg-eden-inset/80 p-5 border border-eden-line/40">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-eden-blue/20 text-eden-blue text-xs font-bold">
              2
            </span>
            <h3 className="text-sm font-bold text-eden-ink sm:text-base">
              Murudeshwar Town — Cultural & Scenic Epicenter
            </h3>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-eden-muted sm:text-sm">
            <strong className="text-eden-ink">~3.5 to 4 km North (8–10 mins drive):</strong> The iconic headland promontory featuring the 123-ft Shiva statue, 20-storey Raja Gopura, Bhukailasa Cave Museum, Statue Park, historic fort remains, and the boat harbor for Netrani Island.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-eden-blue">
            <Navigation className="h-3.5 w-3.5" />
            <span>Quick 8–10 min drive north via Murudeshwar Temple Road</span>
          </div>
        </div>
      </div>

      {/* Reference Address & Plus Code */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-eden-surface/60 px-4 py-3 text-xs text-eden-ink border border-eden-line/40">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0 text-eden-blue" />
          <span>
            <strong className="font-semibold">Exact Reference Address: </strong>
            {homestayAddress}
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-eden-inset px-3 py-1 font-mono text-[11px] font-semibold text-eden-ink border border-eden-line/50">
          <span>Plus Code:</span>
          <span className="text-eden-blue">{plusCode}</span>
        </div>
      </div>
    </div>
  );
}
