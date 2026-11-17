"use client";

import Link from "next/link";
import { ArrowRight, Bath, BedDouble, Check, Snowflake, Users, Wifi } from "lucide-react";
import type { PublicGalleryImage, PublicRoomItem, PublicSiteSettings } from "@/db/defaults";
import { CoastalImage } from "./CoastalImage";
import { BookYourStayButton } from "./WhatsappButton";

export function AccommodationShowcase({
  settings,
  gallery,
  rooms,
}: {
  settings: PublicSiteSettings;
  gallery: PublicGalleryImage[];
  rooms?: PublicRoomItem[];
}) {
  const primaryRoom = rooms && rooms.length > 0 ? rooms[0] : null;

  const bedroomPhoto =
    primaryRoom?.imageUrl ||
    gallery.find((g) => g.category === "Beds" || g.category === "Bedroom")?.imageUrl ||
    "https://images.unsplash.com/photo-1779870458288-95fd59cd2c5b?auto=format&fit=crop&w=1400&q=80";

  const roomWidePhoto =
    primaryRoom?.imageUrl ||
    gallery.find((g) => g.id === 3)?.imageUrl ||
    "https://images.unsplash.com/photo-1770414173168-f6c666501225?auto=format&fit=crop&w=1600&q=80";

  const roomName = primaryRoom?.name || "The Eden Beachfront Sanctuary Room";
  const roomDesc =
    primaryRoom?.fullDescription ||
    primaryRoom?.shortDescription ||
    "Our property is reserved entirely for your party inside one private room by the sea. Enjoy 2 main beds with up to 2 optional add-on beds, climate-controlled AC, complimentary Wi-Fi, and a clean attached private bathroom.";

  const bedInfo = primaryRoom?.bedInfo || "2 Main Beds + 2 Add-ons";
  const maxGuests = primaryRoom?.capacityGuests || 4;
  const pricingNote = primaryRoom?.pricingNote || "Price on Enquiry Only";

  const diningPhoto =
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=80";

  return (
    <div className="space-y-8">
      {/* Featured Master Highlight (Inspired by Luxury Oceanfront Sanctuary) */}
      <div className="group relative overflow-hidden rounded-[32px] border border-[#C5A059]/30 shadow-2xl">
        <div className="relative min-h-[440px] sm:min-h-[500px] lg:min-h-[540px] w-full">
          <CoastalImage
            src={roomWidePhoto}
            alt="The Eden private beachfront room interior"
            fill
            sizes="100vw"
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070D18]/95 via-[#070D18]/60 to-black/30" />

          <div className="relative z-10 flex min-h-[440px] sm:min-h-[500px] lg:min-h-[540px] flex-col justify-between p-6 sm:p-10 lg:p-14 text-white">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-white/15 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#F5F2EB] backdrop-blur-md border border-white/20">
                Exclusive Single Booking
              </span>
              <span className="text-xs uppercase tracking-widest text-[#C5A059] font-semibold">
                {pricingNote}
              </span>
            </div>

            <div className="max-w-2xl py-6">
              <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-[1.12]">
                {roomName}
              </h3>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#F5F2EB]/90">
                {roomDesc}
              </p>

              {/* Inclusions Pill Bar */}
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-white/95">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-md border border-white/15">
                  <Users className="h-3.5 w-3.5 text-[#C5A059]" />
                  Max {maxGuests} Guests
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-md border border-white/15">
                  <BedDouble className="h-3.5 w-3.5 text-[#C5A059]" />
                  {bedInfo}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-md border border-white/15">
                  <Snowflake className="h-3.5 w-3.5 text-[#C5A059]" />
                  Air Conditioned
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-md border border-white/15">
                  <Wifi className="h-3.5 w-3.5 text-[#C5A059]" />
                  Free Wi-Fi
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-md border border-white/15">
                  <Bath className="h-3.5 w-3.5 text-[#C5A059]" />
                  Private Bathroom
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <BookYourStayButton
                label="Book Your Stay"
                variant="camel"
                showArrow
                className="w-full sm:w-auto"
              />
              <Link
                href="/stay"
                className="canva-btn-outline-white w-full sm:w-auto text-center"
              >
                More Details
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Package Cards */}
      <div className="rounded-[32px] bg-[#070D18] p-6 sm:p-10 border border-[#C5A059]/30 text-white shadow-2xl">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059] block mb-1">
              Stay & Meal Plans
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-white">
              Tailored Accommodation Options
            </h3>
          </div>
          <Link
            href="/packages"
            className="text-xs uppercase tracking-widest text-[#C5A059] hover:text-[#DFBA73] transition-colors flex items-center gap-1.5 font-bold"
          >
            <span>View Meal Options</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Card 1: Room Only */}
          <article className="overflow-hidden rounded-[24px] border border-white/10 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            {/* Top Half: Landscape Photograph */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
              <CoastalImage
                src={bedroomPhoto}
                alt="Room Only package layout with 2 main beds"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-108"
              />
              <span className="absolute top-3.5 left-3.5 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                Accommodation Only
              </span>
            </div>

            {/* Bottom Half: Solid Luxury Navy Block */}
            <div className="bg-[#0E1829] border-t border-[#C5A059]/20 p-6 sm:p-8 flex flex-1 flex-col justify-between text-white">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#F5F2EB]/80 font-medium">
                  Up to 4 guests | 2 Main beds + 2 Optional add-on beds
                </p>
                <h4 className="font-serif text-2xl sm:text-3xl font-medium text-white mt-1.5">
                  Room Only Package
                </h4>
                <p className="mt-2.5 text-xs sm:text-sm text-[#F5F2EB]/85 leading-relaxed">
                  Pure beachfront rest with exclusive use of our private room, air conditioning, Wi-Fi, and private bathroom. Perfect if you plan to explore regional coastal eateries at your own pace.
                </p>

                <ul className="mt-4 space-y-1.5 text-xs text-[#F5F2EB]/90">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#C5A059]" />
                    <span>One private room exclusively for your party</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#C5A059]" />
                    <span>AC comfort, Wi-Fi, and private bathroom</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#C5A059]" />
                    <span>Direct access to Tudalli Beach in Bailur</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/15">
                <BookYourStayButton
                  label="Book Now"
                  context={{ packageType: "Room Only" }}
                  className="py-2.5 px-5 text-xs"
                />
                <Link
                  href="/stay"
                  className="text-xs uppercase tracking-widest text-white hover:text-[#C5A059] transition-colors font-bold inline-flex items-center gap-1"
                >
                  <span>More Details</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </article>

          {/* Card 2: Breakfast + One Meal */}
          <article className="overflow-hidden rounded-[24px] border border-white/10 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            {/* Top Half: Landscape Photograph */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
              <CoastalImage
                src={diningPhoto}
                alt="Breakfast and meal package dining"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-108"
              />
              <span className="absolute top-3.5 left-3.5 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                Stay + Dining Included
              </span>
            </div>

            {/* Bottom Half: Solid Luxury Navy Block */}
            <div className="bg-[#0E1829] border-t border-[#C5A059]/20 p-6 sm:p-8 flex flex-1 flex-col justify-between text-white">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#F5F2EB]/80 font-medium">
                  Up to 4 guests | Breakfast + choice of Lunch or Dinner
                </p>
                <h4 className="font-serif text-2xl sm:text-3xl font-medium text-white mt-1.5">
                  Breakfast + Meal Package
                </h4>
                <p className="mt-2.5 text-xs sm:text-sm text-[#F5F2EB]/85 leading-relaxed">
                  Wake up to fresh morning breakfast by the sea, paired with your choice of either an authentic coastal lunch or a relaxed evening dinner prepared for your stay.
                </p>

                <ul className="mt-4 space-y-1.5 text-xs text-[#F5F2EB]/90">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#C5A059]" />
                    <span>Private beachfront room (up to 4 guests)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#C5A059]" />
                    <span>Fresh daily morning breakfast included</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#C5A059]" />
                    <span>Guest choice of Lunch or Dinner</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/15">
                <BookYourStayButton
                  label="Book Now"
                  context={{ packageType: "Breakfast + Dinner" }}
                  className="py-2.5 px-5 text-xs"
                />
                <Link
                  href="/packages"
                  className="text-xs uppercase tracking-widest text-white hover:text-[#C5A059] transition-colors font-bold inline-flex items-center gap-1"
                >
                  <span>More Details</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
