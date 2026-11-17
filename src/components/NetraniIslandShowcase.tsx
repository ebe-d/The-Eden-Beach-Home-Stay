"use client";

import {
  Anchor,
  Calendar,
  Compass,
  ExternalLink,
  Fish,
  Info,
  MapPin,
  Waves,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { CoastalImage } from "./CoastalImage";

const NETRANI_PHOTOS = [
  {
    title: "Netrani Island Coastal Profile",
    caption: "The rugged rocky promontory of Netrani Island rising abruptly from the Arabian Sea.",
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/NETRANI_ISLAND-1.jpg/1280px-NETRANI_ISLAND-1.jpg",
  },
  {
    title: "Scuba Diving & Coral Exploration",
    caption: "A scuba diver exploring the underwater coral reefs and clear waters of Netrani Island.",
    src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Vibrant Coral Ecosystems",
    caption: "Rich coral formations, marine biodiversity, and clear visibility in the surrounding waters.",
    src: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Marine Life & Sea Inhabitants",
    caption: "Diverse aquatic life including butterflyfish, morays, and occasional sea turtles.",
    src: "https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&w=1400&q=80",
  },
];

export function NetraniIslandShowcase() {
  const mapUrl =
    "https://www.google.com/maps/search/?api=1&query=Netrani+Island+Arabian+Sea+Murudeshwar";

  return (
    <article className="overflow-hidden rounded-[32px] border border-[#C5A059]/30 bg-[#070D18] text-white shadow-2xl transition-all duration-300">
      {/* Top Banner / Heading */}
      <div className="p-6 sm:p-10 lg:p-12 border-b border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059] backdrop-blur-md border border-white/15">
            <Waves className="h-3.5 w-3.5" />
            Offshore Marine Sanctuary • Arabian Sea
          </span>

          <span className="rounded-full bg-[#C5A059]/20 px-3 py-1 text-[11px] font-semibold text-[#DFBA73] border border-[#C5A059]/30">
            Pigeon Island
          </span>
        </div>

        <h2 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white">
          NETRANI ISLAND – DISCOVER THE UNDERWATER WORLD
        </h2>

        <p className="mt-4 max-w-3xl text-xs sm:text-sm leading-relaxed text-[#F5F2EB]/85">
          Netrani Island, also known as Pigeon Island, is a beautiful island located in the
          Arabian Sea off the coast of Murudeshwar, Karnataka. It is known for its clear
          waters, rocky landscape and rich marine biodiversity.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-4">
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="canva-btn-camel text-xs py-2.5 px-5 shadow-none"
          >
            <MapPin className="h-3.5 w-3.5 mr-1.5 text-white" />
            <span>Open Netrani Island on Google Maps</span>
            <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
          </a>

          <span className="text-xs text-[#F5F2EB]/70 flex items-center gap-1.5 font-medium">
            <Compass className="h-3.5 w-3.5 text-[#C5A059]" />
            19 km offshore from Murudeshwar harbor
          </span>
        </div>
      </div>

      {/* Photography Grid */}
      <div className="p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {NETRANI_PHOTOS.map((photo, idx) => (
            <div
              key={photo.title}
              className="group/photo relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-900 zoom-image-wrapper border border-eden-line/40 shadow-sm"
            >
              <CoastalImage
                src={photo.src}
                alt={photo.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover zoom-image transition-transform duration-700 ease-out group-hover/photo:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-85 transition-opacity group-hover/photo:opacity-95" />
              <div className="absolute bottom-0 left-0 right-0 p-3.5 text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-300">
                  {idx === 0
                    ? "Landscape"
                    : idx === 1
                    ? "Scuba Diving"
                    : idx === 2
                    ? "Corals"
                    : "Marine Fauna"}
                </span>
                <p className="text-xs font-bold leading-tight">{photo.title}</p>
                <p className="mt-1 text-[11px] leading-snug text-slate-300 line-clamp-2">
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Essential Quick Facts Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-eden-inset/80 p-4 border border-eden-line/40">
            <div className="flex items-center gap-2 text-xs font-bold text-eden-blue">
              <MapPin className="h-4 w-4 text-eden-blue shrink-0" />
              <span>Location</span>
            </div>
            <p className="mt-1 text-xs text-eden-ink font-semibold">
              Arabian Sea, off Murudeshwar, Karnataka, India
            </p>
          </div>

          <div className="rounded-2xl bg-eden-inset/80 p-4 border border-eden-line/40">
            <div className="flex items-center gap-2 text-xs font-bold text-eden-blue">
              <Compass className="h-4 w-4 text-eden-blue shrink-0" />
              <span>Approximate Distance</span>
            </div>
            <p className="mt-1 text-xs text-eden-ink font-semibold">
              19 km offshore from Murudeshwar (~70–90 mins boat journey)
            </p>
          </div>

          <div className="rounded-2xl bg-eden-inset/80 p-4 border border-eden-line/40">
            <div className="flex items-center gap-2 text-xs font-bold text-eden-blue">
              <Waves className="h-4 w-4 text-eden-blue shrink-0" />
              <span>Known For</span>
            </div>
            <p className="mt-1 text-xs text-eden-ink font-semibold">
              Marine life, coral formations and underwater scenery
            </p>
          </div>

          <div className="rounded-2xl bg-eden-inset/80 p-4 border border-eden-line/40">
            <div className="flex items-center gap-2 text-xs font-bold text-eden-blue">
              <Anchor className="h-4 w-4 text-eden-blue shrink-0" />
              <span>Activities</span>
            </div>
            <p className="mt-1 text-xs text-eden-ink font-semibold">
              Scuba diving, snorkelling and boat excursions
            </p>
          </div>

          <div className="rounded-2xl bg-eden-inset/80 p-4 border border-eden-line/40">
            <div className="flex items-center gap-2 text-xs font-bold text-eden-blue">
              <Info className="h-4 w-4 text-eden-blue shrink-0" />
              <span>Access</span>
            </div>
            <p className="mt-1 text-xs text-eden-ink font-semibold">
              Visitors generally travel by boat from Murudeshwar, subject to permissions and sea conditions
            </p>
          </div>

          <div className="rounded-2xl bg-eden-inset/80 p-4 border border-eden-line/40">
            <div className="flex items-center gap-2 text-xs font-bold text-eden-blue">
              <Calendar className="h-4 w-4 text-eden-blue shrink-0" />
              <span>Suggested Visiting Season</span>
            </div>
            <p className="mt-1 text-xs text-eden-ink font-semibold">
              November to May, depending on weather and sea conditions
            </p>
          </div>
        </div>

        {/* Deep Dive: Biodiversity & Interesting Facts */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Marine Biodiversity Breakdown */}
          <div className="rounded-2xl bg-eden-surface/70 p-5 border border-eden-line/50">
            <div className="flex items-center gap-2">
              <Fish className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-sm font-bold text-eden-ink">
                Marine Biodiversity & Underwater Ecosystem
              </h3>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-eden-muted sm:text-sm">
              Netrani Island is celebrated as one of mainland India&apos;s premier diving sanctuaries. Its underwater topography features sheer granite drop-offs and submerged boulders colonized by both hard and soft coral colonies.
            </p>
            <ul className="mt-3 space-y-1.5 text-xs text-eden-ink">
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">•</span>
                <span><strong>Corals:</strong> Abundant brain corals, table corals, and seafans covering submerged rocky slopes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">•</span>
                <span><strong>Marine Species:</strong> Schools of butterflyfish, parrotfish, bannerfish, clownfish, moray eels, barracudas, and occasional sightings of olive ridley turtles and stingrays.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">•</span>
                <span><strong>Underwater Visibility:</strong> Typically ranges between 15 and 30 meters during optimal post-monsoon sea conditions.</span>
              </li>
            </ul>
          </div>

          {/* Interesting Facts */}
          <div className="rounded-2xl bg-eden-surface/70 p-5 border border-eden-line/50">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-bold text-eden-ink">
                Interesting Island Facts
              </h3>
            </div>
            <ul className="mt-2.5 space-y-2 text-xs leading-relaxed text-eden-ink sm:text-sm">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span><strong>Heart-Shaped Island:</strong> When viewed from aerial satellite imagery, the island resembles a distinct heart shape nestled in the Arabian Sea.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span><strong>Pigeon Sanctuary:</strong> Known historically as Pigeon Island due to the large colonies of wild rock pigeons that nest within its steep sea-cliff fissures.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span><strong>Maritime Beacon:</strong> For centuries, Arab, Portuguese, and Indian merchant vessels utilized the island as a prominent navigational waypoint along the Konkan-Kanara trade route.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span><strong>Uninhabited Nature Zone:</strong> The island has no human settlements or fresh water sources, and overnight stays are strictly prohibited to preserve its delicate offshore ecology.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Informational Travel Disclaimer */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-300/40 bg-amber-50/60 dark:bg-amber-950/20 px-4 py-3 text-xs leading-relaxed text-eden-ink">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            <strong>Informational Travel Guide Notice: </strong>
            This guide is provided purely for educational and traveler reference. The Eden – Beach Homestay provides accommodation in Bailur and does not conduct, operate, sell, or book scuba diving packages or boat trips. Sea excursions and water activities are operated independently by licensed local operators departing from Murudeshwar harbor, strictly subject to daily sea conditions, seasonal weather windows, and Indian Coast Guard permissions.
          </span>
        </div>
      </div>
    </article>
  );
}
