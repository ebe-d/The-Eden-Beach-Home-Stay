"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BedDouble,
  CheckCircle2,
  Compass,
  ExternalLink,
  Eye,
  Globe,
  Image as ImageIcon,
  Inbox,
  Loader2,
  MessageCircle,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
} from "lucide-react";
import type { AdminEnquiryRow } from "./types";
import type {
  PublicCoastGuideSpot,
  PublicMediaItem,
  PublicRoomItem,
} from "@/db/defaults";

export function AdminOverviewTab({
  enquiries,
  rooms,
  media,
  coastGuides,
  onNavigateTab,
  onFeedback,
}: {
  enquiries: AdminEnquiryRow[];
  rooms: PublicRoomItem[];
  media: PublicMediaItem[];
  coastGuides: PublicCoastGuideSpot[];
  onNavigateTab: (tabId: string) => void;
  onFeedback: (msg: string, isError?: boolean) => void;
}) {
  const [publishing, setPublishing] = useState(false);
  const [lastPublished, setLastPublished] = useState<string | null>(null);

  const newEnquiries = enquiries.filter((e) => e.status === "New");
  const activeRooms = rooms.filter((r) => r.isVisible);
  const featuredMedia = media.filter((m) => m.isFeaturedHomepage);
  const activeSpots = coastGuides.filter((c) => c.isVisible);

  async function handlePublishAll() {
    setPublishing(true);
    try {
      const res = await fetch("/api/admin/publish", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        onFeedback(data.error || "Failed to publish changes.", true);
        return;
      }
      setLastPublished(new Date().toLocaleTimeString());
      onFeedback("Live website content successfully refreshed!");
    } catch {
      onFeedback("Network error while publishing.", true);
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-[28px] bg-[#070D18] text-white p-6 sm:p-8 border border-[#C5A059]/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 h-64 w-64 rounded-full bg-[#C5A059]/15 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#C5A059]/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#DFBA73] border border-[#C5A059]/30">
              <Sparkles className="h-3.5 w-3.5 text-[#C5A059]" />
              The Eden Beach Home Stay CMS
            </span>
            <h1 className="mt-3 font-serif text-2xl sm:text-4xl font-normal text-white">
              Website Content Management System
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#F5F2EB]/80 leading-relaxed">
              Manage your hero banners, room listings, photos, guest experiences, coastal travel
              attractions, and SEO without editing source code.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handlePublishAll}
              disabled={publishing}
              className="canva-btn-camel flex items-center gap-2 text-xs cursor-pointer shadow-lg active:scale-95 transition"
            >
              {publishing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span>Publish Live Updates</span>
            </button>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="canva-btn-outline-white flex items-center gap-2 text-xs cursor-pointer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>View Public Website</span>
            </Link>
          </div>
        </div>
        {lastPublished && (
          <div className="mt-4 text-[11px] text-[#FAF7F2]/60 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Last published cache flush: {lastPublished}</span>
          </div>
        )}
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button
          type="button"
          onClick={() => onNavigateTab("enquiries")}
          className="glass-card interactive-card rounded-[24px] p-5 text-left border border-eden-line/50 hover:border-[#C5A059] transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-eden-muted">
              Guest Enquiries
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
              <Inbox className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-eden-ink">{enquiries.length}</span>
            {newEnquiries.length > 0 && (
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-emerald-700">
                {newEnquiries.length} New
              </span>
            )}
          </div>
          <p className="mt-1 text-[11px] text-eden-muted">Review booking requests & WhatsApp pre-fills</p>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab("rooms")}
          className="glass-card interactive-card rounded-[24px] p-5 text-left border border-eden-line/50 hover:border-[#C5A059] transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-eden-muted">
              Rooms & Stay
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#C5A059]/15 text-[#C5A059]">
              <BedDouble className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-eden-ink">{rooms.length}</span>
            <span className="text-xs text-eden-muted">({activeRooms.length} Active)</span>
          </div>
          <p className="mt-1 text-[11px] text-eden-muted">Beds, capacity & package rates</p>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab("media")}
          className="glass-card interactive-card rounded-[24px] p-5 text-left border border-eden-line/50 hover:border-[#C5A059] transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-eden-muted">
              Media & Photos
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#C5A059]/10 text-[#C5A059]">
              <ImageIcon className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-eden-ink">{media.length}</span>
            {featuredMedia.length > 0 && (
              <span className="rounded-full bg-[#C5A059]/15 px-2 py-0.5 text-xs font-bold text-[#C5A059]">
                {featuredMedia.length} Featured
              </span>
            )}
          </div>
          <p className="mt-1 text-[11px] text-eden-muted">Cloud & local image library</p>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab("coast")}
          className="glass-card interactive-card rounded-[24px] p-5 text-left border border-eden-line/50 hover:border-[#C5A059] transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-eden-muted">
              Coast Guide
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600">
              <Compass className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-eden-ink">{coastGuides.length}</span>
            <span className="text-xs text-eden-muted">({activeSpots.length} Live)</span>
          </div>
          <p className="mt-1 text-[11px] text-eden-muted">Murudeshwar, Bailur & Netrani</p>
        </button>
      </div>

      {/* Quick Action Hub */}
      <div className="glass-card rounded-[28px] p-6 border border-eden-line/60">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-eden-ink">
          Quick Management Actions
        </h2>
        <p className="mt-1 text-xs text-eden-muted">Jump straight into any CMS section:</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <button
            type="button"
            onClick={() => onNavigateTab("homepage")}
            className="flex items-center gap-3 rounded-2xl bg-eden-inset p-3.5 text-left hover:bg-eden-surface hover:shadow-sm border border-eden-line/30 transition"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#070D18] text-[#C5A059] border border-[#C5A059]/30">
              <Globe className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-eden-ink">Homepage Editor</div>
              <div className="text-[11px] text-eden-muted">Hero headline, subtitle & slides</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab("media")}
            className="flex items-center gap-3 rounded-2xl bg-eden-inset p-3.5 text-left hover:bg-eden-surface hover:shadow-sm border border-eden-line/30 transition"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#C5A059] text-white">
              <Plus className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-eden-ink">Upload Photos</div>
              <div className="text-[11px] text-eden-muted">Add photos from your computer</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab("rooms")}
            className="flex items-center gap-3 rounded-2xl bg-eden-inset p-3.5 text-left hover:bg-eden-surface hover:shadow-sm border border-eden-line/30 transition"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#070D18] text-[#C5A059] border border-[#C5A059]/30">
              <BedDouble className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-eden-ink">Rooms & Stay</div>
              <div className="text-[11px] text-eden-muted">Capacity, bed setups & facilities</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab("about")}
            className="flex items-center gap-3 rounded-2xl bg-eden-inset p-3.5 text-left hover:bg-eden-surface hover:shadow-sm border border-eden-line/30 transition"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#070D18] text-[#C5A059] border border-[#C5A059]/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-eden-ink">About Us Editor</div>
              <div className="text-[11px] text-eden-muted">Homestay narrative & images</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab("contact")}
            className="flex items-center gap-3 rounded-2xl bg-eden-inset p-3.5 text-left hover:bg-eden-surface hover:shadow-sm border border-eden-line/30 transition"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#C5A059] text-white">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-eden-ink">Contact & WhatsApp</div>
              <div className="text-[11px] text-eden-muted">Phone, address & Plus Code</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab("seo")}
            className="flex items-center gap-3 rounded-2xl bg-eden-inset p-3.5 text-left hover:bg-eden-surface hover:shadow-sm border border-eden-line/30 transition"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Eye className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-eden-ink">SEO Manager</div>
              <div className="text-[11px] text-eden-muted">Meta titles, keywords & social cards</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
