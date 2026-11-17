"use client";

import { Sparkles, Compass, Waves } from "lucide-react";
import type { ExperienceItem } from "@/db/schema";
import { CoastalImage } from "./CoastalImage";

const DEFAULT_EXPERIENCES_LIST = [
  {
    num: "01",
    title: "Beachfront Relaxation",
    desc: "Step straight from your room onto the quiet golden sands of Tudalli Beach in Bailur. Wake to sea breezes and unwind to rhythmic Arabian Sea waves free from commercial tourist crowds.",
  },
  {
    num: "02",
    title: "Murudeshwar Sightseeing",
    desc: "A quick 8–10 minute drive north takes you to the iconic 123-ft Shiva statue, the towering 20-storey Raja Gopura with ocean viewing deck, Bhukailasa Cave Museum, and Statue Park.",
  },
  {
    num: "03",
    title: "Netrani Island Exploration",
    desc: "A legendary offshore sanctuary situated 19 km off Murudeshwar in the open Arabian Sea, celebrated for its unique heart-shaped contour, rugged sea cliffs, and azure coastal waters.",
  },
  {
    num: "04",
    title: "Scuba Diving Information",
    desc: "Celebrated as one of mainland India's premier underwater diving locations, featuring 15–30m visibility, coral reefs, and diverse marine life. Independent boat trips depart from Murudeshwar harbor.",
  },
  {
    num: "05",
    title: "Local Coastal Experiences",
    desc: "Savor the authentic pace of coastal Uttara Kannada — traditional fishing hamlets, lush coconut palm belts, peaceful cycling paths along Bailur Beach Road, and fresh coastal flavors.",
  },
  {
    num: "06",
    title: "Nearby Beaches & Attractions",
    desc: "Explore scenic coastal treasures including Blue Flag certified Kasarkod Eco Beach, Sharavathi river backwaters, Apsarakonda clifftop waterfalls, 16th-century Mirjan Fort, and Gokarna.",
  },
];

export function GuestExperiencesSection({
  experiences,
}: {
  experiences?: ExperienceItem[];
}) {
  const displayItems =
    Array.isArray(experiences) && experiences.length > 0
      ? experiences.map((exp) => ({
          num: exp.number,
          title: exp.title,
          desc: exp.description,
        }))
      : DEFAULT_EXPERIENCES_LIST;
  return (
    <section className="overflow-hidden rounded-[32px] border border-[#C5A059]/30 shadow-2xl">
      <div className="grid lg:grid-cols-12 items-stretch">
        {/* Left Column: High-Atmosphere Editorial Photo */}
        <div className="relative min-h-[380px] sm:min-h-[460px] lg:col-span-5 overflow-hidden bg-[#070D18]">
          <CoastalImage
            src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"
            alt="Scuba diving and coastal exploration near Murudeshwar"
            fill
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-cover object-center transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30" />

          {/* Floating Aesthetic Inset Badge */}
          <div className="absolute bottom-6 left-6 right-6 text-white p-4 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15">
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">
              <Waves className="h-3.5 w-3.5" />
              Bailur & Murudeshwar Coast
            </span>
            <p className="font-serif text-lg sm:text-xl font-medium mt-1 leading-snug">
              Unrivaled tranquility by the Arabian Sea shore.
            </p>
          </div>
        </div>

        {/* Right Column: Burnished Luxury Gold Block */}
        <div className="bg-gradient-to-br from-[#DFBA73] via-[#C5A059] to-[#A37B30] p-6 sm:p-10 lg:col-span-7 flex flex-col justify-between text-[#070D18] shadow-2xl">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-[#070D18]/60" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#070D18]/90">
                Tailored Coastal Leisure
              </span>
            </div>

            <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-medium leading-[1.12] text-[#070D18] tracking-tight">
              Make new memories with our bespoke experiences
            </h2>

            <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-[#070D18]/85 max-w-xl">
              From peaceful doorstep shoreline strolls in Bailur to offshore marine discovery and sacred regional temples, immerse yourself in authentic coastal Karnataka.
            </p>
          </div>

          {/* 6 Numbered Experiences */}
          <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {displayItems.map((exp) => (
              <div
                key={exp.num}
                className="group border-t border-[#070D18]/25 pt-4 transition-all duration-200"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-2xl font-normal text-[#070D18]/70 group-hover:text-[#070D18] transition-colors">
                    {exp.num}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#070D18] leading-tight">
                    {exp.title}
                  </h3>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-[#070D18]/80 pl-9">
                  {exp.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Compliance Disclaimer */}
          <div className="mt-8 pt-4 border-t border-[#070D18]/20 text-[11px] text-[#070D18]/75 leading-relaxed">
            <strong>Travel Guide Note:</strong> The Eden Beach Home Stay provides accommodations in Bailur. Watersports and island boat trips are conducted independently by licensed third-party operators at Murudeshwar harbor, subject to seasonal weather and permissions.
          </div>
        </div>
      </div>
    </section>
  );
}
