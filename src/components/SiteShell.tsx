"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  BedDouble,
  Compass,
  Home,
  Image as ImageIcon,
  Mail,
  MapPin,
  Menu,
  ShieldCheck,
  Sparkles,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import type { PublicSiteSettings } from "@/db/defaults";
import { useEnquiry } from "./EnquiryProvider";
import { ThemeToggle } from "./ThemeToggle";
import { BookYourStayButton, WhatsappButton } from "./WhatsappButton";

const NAV_ITEMS = [
  { href: "/", label: "Home", shortLabel: "Home", icon: Home },
  { href: "/stay", label: "Stay", shortLabel: "Stay", icon: BedDouble },
  { href: "/packages", label: "Packages", shortLabel: "Packages", icon: UtensilsCrossed },
  { href: "/gallery", label: "Gallery", shortLabel: "Gallery", icon: ImageIcon },
  { href: "/explore-the-coast", label: "Explore Coast", shortLabel: "Coast", icon: Compass },
  { href: "/contact", label: "Contact", shortLabel: "Contact", icon: Mail },
];

export function SiteShell({
  children,
  settings,
}: {
  children: ReactNode;
  settings: PublicSiteSettings;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(2026);
  const [scrolled, setScrolled] = useState(false);
  const { openQuoteModal } = useEnquiry();

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    const onScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Admin pages render their own focused workspace shell
  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Sticky Top Floating Pill Navbar with Frosted Backdrop on Scroll */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "bg-eden-bg/85 backdrop-blur-xl border-b border-eden-line/30 shadow-md shadow-black/15 py-2 sm:py-2.5 lg:py-3"
            : "bg-transparent border-b border-transparent pb-2 pt-3 sm:pb-3 sm:pt-4 lg:pb-3 lg:pt-5"
        }`}
      >
        <div className="mx-auto w-full max-w-[1400px] px-3.5 sm:px-6 lg:pl-24 lg:pr-8">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {/* Left Brand Pill */}
            <Link
              href="/"
              className="glass-pill group btn-interactive inline-flex shrink-0 items-center gap-2 rounded-full px-2.5 py-1.5 text-eden-ink active:scale-[0.98] sm:gap-2.5 sm:px-3.5 sm:py-2"
            >
              <div className="relative h-8 w-8 sm:h-10 sm:w-10 shrink-0 overflow-hidden rounded-full border border-[#C5A059]/40 shadow-md transition-transform duration-300 group-hover:scale-105 bg-[#070D18]">
                <Image
                  src="/brand/eden-emblem.png"
                  alt="The Eden Beach Homestay Emblem"
                  width={40}
                  height={40}
                  className="h-full w-full object-contain p-0.5"
                  priority
                />
              </div>
              <div className="text-left">
                <span className="font-serif text-xs sm:text-base font-bold tracking-wider uppercase block leading-none text-eden-ink">
                  The Eden
                </span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#C5A059] font-bold block mt-0.5">
                  Beach Home Stay
                </span>
              </div>
            </Link>

            {/* Tablet Inline Navigation Pill (768px - 1023px) */}
            <nav
              aria-label="Tablet navigation"
              className="glass-pill hidden items-center gap-0.5 rounded-full px-1.5 py-1.5 md:flex lg:hidden"
            >
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-full px-2 py-1.5 text-xs font-semibold transition ${
                      active
                        ? "bg-eden-btn text-eden-btn-ink shadow-sm"
                        : "text-eden-soft hover:bg-eden-inset hover:text-eden-ink"
                    }`}
                  >
                    {item.shortLabel}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Summary Pill Strip (1024px+): compact on lg, full 3-slot on xl */}
            <div className="glass-pill hidden items-center divide-x divide-eden-line rounded-full px-2 py-1.5 lg:flex">
              <Link
                href="/contact"
                className="flex items-center gap-2 px-3.5 py-1 text-xs transition hover:opacity-80 xl:px-4"
              >
                <MapPin className="h-3.5 w-3.5 shrink-0 text-eden-blue" />
                <div className="text-left">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-eden-muted">
                    Location
                  </div>
                  <div className="whitespace-nowrap font-semibold text-eden-ink">
                    Murdeshwar, 581350
                  </div>
                </div>
              </Link>

              <Link
                href="/stay"
                className="flex items-center gap-2 px-3.5 py-1 text-xs transition hover:opacity-80 xl:px-4"
              >
                <BedDouble className="h-3.5 w-3.5 shrink-0 text-eden-blue" />
                <div className="text-left">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-eden-muted">
                    Accommodation
                  </div>
                  <div className="whitespace-nowrap font-semibold text-eden-ink">
                    One Private Room
                  </div>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => openQuoteModal()}
                className="hidden cursor-pointer items-center gap-2 px-4 py-1 text-xs transition hover:opacity-80 xl:flex"
              >
                <Users className="h-3.5 w-3.5 shrink-0 text-eden-peach" />
                <div className="text-left">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-eden-muted">
                    Capacity & Quote
                  </div>
                  <div className="whitespace-nowrap font-semibold text-eden-ink">
                    Max 4 Guests • Price on Enquiry
                  </div>
                </div>
              </button>
            </div>

            {/* Right Controls: Dark Mode Toggle + CTA (Desktop/Tablet) + Mobile Menu Toggle */}
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <ThemeToggle />

              {/* Desktop & Tablet Quick Actions */}
              <div className="hidden md:flex items-center gap-2">
                <BookYourStayButton
                  label="Book Your Stay"
                  className="py-2 px-4 text-[11px]"
                />
                <WhatsappButton
                  label="WhatsApp"
                  variant="pill"
                  className="px-4 py-2 text-xs"
                />
              </div>

              {/* Mobile Menu Toggle Button (< 768px) - Guaranteed visible and accessible */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
                className="glass-pill inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full text-eden-ink border border-[#C5A059]/30 transition-transform active:scale-95 md:hidden"
              >
                {mobileMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Drawer (< 768px) with Smooth Spring Transition */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.nav
                aria-label="Mobile navigation"
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card mt-2.5 rounded-3xl p-4 shadow-2xl md:hidden overflow-hidden border border-[#C5A059]/30"
              >
                <div className="grid grid-cols-2 gap-2">
                  {NAV_ITEMS.map((item, idx) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.03 * idx, duration: 0.2 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-xs sm:text-sm font-semibold btn-interactive active:scale-95 transition ${
                            active
                              ? "bg-eden-btn text-eden-btn-ink shadow-sm"
                              : "bg-eden-inset text-eden-ink hover:bg-eden-surface"
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0 text-[#C5A059]" />
                          <span>{item.label}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="mt-3 flex flex-col gap-2 border-t border-eden-line/60 pt-3">
                  <WhatsappButton
                    label="Ask for Price on WhatsApp"
                    variant="primary"
                    className="w-full canva-btn-camel text-xs py-3 shadow-none"
                    showArrow
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openQuoteModal();
                    }}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#C5A059]/40 bg-eden-inset px-4 py-2.5 text-xs font-semibold text-eden-ink btn-interactive active:scale-95 transition hover:border-[#C5A059]"
                  >
                    <Users className="h-3.5 w-3.5 text-[#C5A059]" />
                    <span>Check Dates & Availability</span>
                  </button>
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex w-full items-center justify-center gap-2 text-[11px] font-medium text-eden-muted hover:text-eden-ink pt-1"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-[#C5A059]" />
                    <span>Owner Admin Panel</span>
                  </Link>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Left Vertical Floating Glass Icon Dock (1024px+ Desktop, aligned with lg:pl-24) */}
      <aside
        aria-label="Primary site navigation"
        className="fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 lg:block"
      >
        <nav className="glass-dock flex flex-col items-center gap-2 rounded-full px-2 py-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                title={item.label}
                className={`group relative flex h-10 w-10 items-center justify-center rounded-full btn-interactive active:scale-90 hover:scale-105 transition-all duration-200 ${
                  active
                    ? "bg-eden-btn text-eden-btn-ink shadow-md"
                    : "text-eden-soft hover:bg-eden-inset hover:text-eden-ink"
                }`}
              >
                <Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                <span className="pointer-events-none absolute left-13 whitespace-nowrap rounded-full bg-eden-btn px-3 py-1 text-xs font-semibold text-eden-btn-ink opacity-0 shadow-lg transition-all duration-200 -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100">
                  {item.label}
                </span>
              </Link>
            );
          })}
          <div className="my-1 h-px w-5 bg-eden-line" />
          <Link
            href="/admin"
            aria-label="Owner Admin"
            title="Owner Admin"
            className="group relative flex h-10 w-10 items-center justify-center rounded-full text-eden-soft btn-interactive active:scale-90 hover:scale-105 transition-all duration-200 hover:bg-eden-inset hover:text-eden-ink"
          >
            <ShieldCheck className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
            <span className="pointer-events-none absolute left-13 whitespace-nowrap rounded-full bg-eden-btn px-3 py-1 text-xs font-semibold text-eden-btn-ink opacity-0 shadow-lg transition-all duration-200 -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100">
              Owner Admin
            </span>
          </Link>
        </nav>
      </aside>

      {/* Main Content: aligned identically with header & footer, clean gap below navbar */}
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 pb-8 pt-2 sm:px-6 sm:pt-3 md:pb-10 lg:pl-24 lg:pr-8 lg:pt-4">
        {children}
      </main>

      {/* Footer - Inspired by Luxury Oceanfront Brand Identity */}
      <footer className="mx-auto mb-8 mt-12 w-full max-w-[1400px] px-4 sm:px-6 lg:pl-24 lg:pr-8">
        <div className="overflow-hidden rounded-[32px] border border-[#C5A059]/30 bg-[#070D18] px-6 py-12 text-white shadow-2xl sm:px-10 sm:py-16 lg:px-14">
          {/* Centered Brand Mark with Full High-Res Emblem & Logo Card */}
          <div className="flex flex-col items-center text-center">
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[384px] aspect-[855/475] overflow-hidden rounded-2xl border border-[#C5A059]/35 shadow-2xl bg-[#070D18]">
              <Image
                src="/brand/eden-logo-full.png"
                alt="The Eden Beach Homestay - Stay • Relax • Unwind"
                fill
                sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, 384px"
                className="object-contain p-2"
                priority
              />
            </div>
            <span className="mt-3 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-[#DFBA73] block">
              Bailur • Murudeshwar • Karnataka
            </span>
          </div>

          {/* Editorial Headline */}
          <div className="mt-8 text-center border-b border-white/10 pb-10">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-tight">
              Stay by the sea. Slow down. Make memories.
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[#F5F2EB]/80 max-w-xl mx-auto">
              Your single private beachfront sanctuary by the Arabian Sea in Bailur, Christiankeri.
            </p>
          </div>

          {/* 3-Column Luxury Information Grid */}
          <div className="mt-10 grid gap-8 md:grid-cols-3 text-xs sm:text-sm text-[#F5F2EB]/85">
            {/* Col 1: Address & Geolocation */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C5A059] block mb-2">
                Location & Address
              </span>
              <p className="font-semibold text-white">The Eden Beach Home Stay</p>
              <p className="leading-relaxed text-[#F5F2EB]/80">
                Intersection of Bailur Beach Road, Christiankeri, Bailur, Murudeshwar, Karnataka 581350, India.
              </p>
              <p className="font-mono text-[11px] text-[#DFBA73]">
                Plus Code: 4F9P+PC Bailur, Karnataka, India
              </p>
              <div className="pt-2">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=4F9P%2BPC+Bailur+Karnataka+India"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#DFBA73] hover:underline"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Open on Google Maps</span>
                </a>
              </div>
            </div>

            {/* Col 2: Direct Contact & Enquiries */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C5A059] block mb-2">
                Reservations & Enquiries
              </span>
              <p className="leading-relaxed">
                <strong className="text-white">Accommodation:</strong> One Private Room (Max 4 guests)
              </p>
              <p className="leading-relaxed">
                <strong className="text-white">Bed Setup:</strong> 2 Main Beds + 2 Optional Add-on Beds
              </p>
              {settings.contactPhone && (
                <p>
                  <strong className="text-white">Phone:</strong> {settings.contactPhone}
                </p>
              )}
              {settings.contactEmail && (
                <p>
                  <strong className="text-white">Email:</strong> {settings.contactEmail}
                </p>
              )}
              <div className="pt-3">
                <WhatsappButton
                  label="Enquire on WhatsApp"
                  variant="primary"
                  className="canva-btn-camel text-xs py-2.5 px-5 shadow-none w-full sm:w-auto"
                  showArrow
                />
              </div>
            </div>

            {/* Col 3: Navigation & Links */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C5A059] block mb-2">
                Explore The Retreat
              </span>
              <ul className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[#F5F2EB]/80 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/packages"
                    className="text-[#F5F2EB]/80 hover:text-white transition-colors"
                  >
                    Meal Packages
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin"
                    className="text-[#DFBA73] hover:text-white transition-colors"
                  >
                    Owner Admin
                  </Link>
                </li>
              </ul>
              <p className="mt-4 text-[11px] text-[#F5F2EB]/60">
                All tariffs provided upon enquiry only. No instant commercial checkout.
              </p>
            </div>
          </div>

          {/* Bottom Copyright & Disclaimer */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-[11px] text-[#F5F2EB]/60">
            <span>
              © {currentYear} The Eden Beach Home Stay. Bailur, Murudeshwar, Karnataka.
            </span>
            <span>{settings.bookingDisclaimer}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
