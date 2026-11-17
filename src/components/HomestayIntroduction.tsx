"use client";

import Link from "next/link";
import { ArrowRight, BedDouble, MapPin, ShieldCheck, Sparkles, Users } from "lucide-react";
import type {
  PublicAboutContent,
  PublicGalleryImage,
  PublicHomepageContent,
  PublicSiteSettings,
} from "@/db/defaults";
import { CoastalImage } from "./CoastalImage";

export function HomestayIntroduction({
  settings,
  gallery,
  homepage,
  about,
}: {
  settings: PublicSiteSettings;
  gallery: PublicGalleryImage[];
  homepage?: PublicHomepageContent;
  about?: PublicAboutContent;
}) {
  const tallPhoto =
    (homepage?.welcomeImages && homepage.welcomeImages[0]) ||
    gallery.find((g) => g.id === 6 || g.category === "Property")?.imageUrl ||
    "https://images.unsplash.com/photo-1781419044915-c729bde42f4c?auto=format&fit=crop&w=1200&q=80";

  const insetPhoto =
    (homepage?.welcomeImages && homepage.welcomeImages[1]) ||
    gallery.find((g) => g.id === 7 || g.category === "Beachfront Views")?.imageUrl ||
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80";

  const heading = homepage?.welcomeHeading || "Timeless Coastal Rest, Delightful Stays";
  const text =
    homepage?.welcomeText ||
    about?.intro ||
    `Nestled right on the shoreline of Christiankeri in Bailur, ${settings.businessName} welcomes just one booking at a time inside a single private beachfront room. Wake up to natural Arabian Sea sunlight, step directly onto the sands of Tudalli Beach, and savor unhurried coastal moments with genuine coastal hospitality.`;

  return (
    <section className="overflow-hidden rounded-[32px] border border-[#C5A059]/30 bg-[#070D18] p-6 sm:p-10 lg:p-14 text-white shadow-2xl">
      <div className="grid items-center gap-10 lg:grid-cols-12">
        {/* Left Editorial Text & Inset Photo Column */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-[#C5A059]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C5A059]">
                Bailur Beachfront Sanctuary
              </span>
            </div>

            <h2 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-[1.14]">
              {heading}
            </h2>

            <p className="mt-4 text-xs sm:text-sm lg:text-base leading-relaxed text-[#F5F2EB]/85 max-w-xl">
              {text}
            </p>
          </div>

          {/* Staggered Inset Photo & Key Pillars */}
          <div className="mt-8 grid gap-4 sm:grid-cols-12 items-center">
            {/* Small Inset Photo */}
            <div className="relative aspect-[4/3] sm:col-span-5 overflow-hidden rounded-2xl border border-white/15 bg-black/40">
              <CoastalImage
                src={insetPhoto}
                alt="Shoreline peaceful waves at The Eden"
                fill
                sizes="(max-width: 640px) 100vw, 25vw"
                className="object-cover transition-transform duration-700 hover:scale-108"
              />
              <span className="absolute bottom-2.5 left-2.5 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
                Tudalli Shore
              </span>
            </div>

            {/* Quick Stat Highlights */}
            <div className="sm:col-span-7 space-y-2.5 text-xs text-[#F5F2EB]/90">
              <div className="flex items-center gap-2.5 rounded-xl bg-white/5 p-2.5 border border-white/10">
                <ShieldCheck className="h-4 w-4 text-[#C5A059] shrink-0" />
                <span>One group exclusivity — never a crowded hotel</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl bg-white/5 p-2.5 border border-white/10">
                <BedDouble className="h-4 w-4 text-[#C5A059] shrink-0" />
                <span>2 Main Beds + up to 2 Add-ons (Max 4 guests)</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl bg-white/5 p-2.5 border border-white/10">
                <MapPin className="h-4 w-4 text-[#C5A059] shrink-0" />
                <span>8–10 mins drive to Murudeshwar Temple & Statue</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href="/stay"
              className="canva-btn-camel w-full sm:w-auto text-center"
            >
              Explore Accommodation
            </Link>
            <Link
              href="/contact"
              className="canva-btn-outline-white w-full sm:w-auto text-center"
            >
              Contact & Location
            </Link>
          </div>
        </div>

        {/* Right Tall Editorial Photo Column (Matching Canva Section 1 Layout) */}
        <div className="lg:col-span-5">
          <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-[26px] border border-white/15 shadow-xl bg-black/40">
            <CoastalImage
              src={tallPhoto}
              alt="The Eden Beach Home Stay evening dusk exterior"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">
                Bailur Beach Road, Christiankeri
              </span>
              <p className="font-serif text-lg font-medium leading-snug mt-1">
                Your quiet oceanfront haven in coastal Karnataka.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
