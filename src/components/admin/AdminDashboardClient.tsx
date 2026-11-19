"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BedDouble,
  BookOpen,
  CalendarOff,
  Compass,
  ExternalLink,
  Globe,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  MapPin,
  Palette,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AdminAboutTab } from "./AdminAboutTab";
import { AdminAvailabilityTab } from "./AdminAvailabilityTab";
import { AdminCoastGuideTab } from "./AdminCoastGuideTab";
import { AdminContactTab } from "./AdminContactTab";
import { AdminEnquiriesTab } from "./AdminEnquiriesTab";
import { AdminFacilitiesTab } from "./AdminFacilitiesTab";
import { AdminGalleryTab } from "./AdminGalleryTab";
import { AdminHomepageTab } from "./AdminHomepageTab";
import { AdminMediaTab } from "./AdminMediaTab";
import { AdminOverviewTab } from "./AdminOverviewTab";
import { AdminRoomsTab } from "./AdminRoomsTab";
import { AdminSeoTab } from "./AdminSeoTab";
import { AdminSettingsTab } from "./AdminSettingsTab";
import { AdminThemesTab } from "./AdminThemesTab";
import type { AdminInitialData } from "./types";

export type AdminTab =
  | "overview"
  | "homepage"
  | "rooms"
  | "media"
  | "coast"
  | "about"
  | "facilities"
  | "contact"
  | "settings"
  | "seo"
  | "themes"
  | "enquiries"
  | "availability"
  | "gallery";

export function AdminDashboardClient({
  initialData,
}: {
  initialData: AdminInitialData;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [enquiries, setEnquiries] = useState(initialData.enquiries);
  const [settings, setSettings] = useState(initialData.settings);
  const [gallery, setGallery] = useState(initialData.gallery);
  const [coastGuides, setCoastGuides] = useState(initialData.coastGuides);
  const [availability, setAvailability] = useState(initialData.availability);
  const [homepage, setHomepage] = useState(initialData.homepage);
  const [rooms, setRooms] = useState(initialData.rooms);
  const [media, setMedia] = useState(initialData.media);
  const [about, setAbout] = useState(initialData.about);
  const [seo, setSeo] = useState(initialData.seo);
  const [themes, setThemes] = useState(initialData.themes || []);
  const [themeSettings, setThemeSettings] = useState(initialData.themeSettings);

  const [feedback, setFeedback] = useState<{
    msg: string;
    isError?: boolean;
  } | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(false);

  function notify(msg: string, isError = false) {
    setFeedback({ msg, isError });
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  async function handlePublishAll() {
    setPublishing(true);
    try {
      const res = await fetch("/api/admin/publish", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        notify(data.error || "Failed to publish changes.", true);
        return;
      }
      notify("All public pages successfully refreshed with latest CMS content!");
    } catch {
      notify("Network error while publishing.", true);
    } finally {
      setPublishing(false);
    }
  }

  async function handleBootstrapDefaults() {
    setBootstrapping(true);
    try {
      const res = await fetch("/api/admin/bootstrap", { method: "POST" });
      if (!res.ok) {
        notify("Could not initialize defaults.", true);
        return;
      }
      notify("Initialized default content models in PostgreSQL.");
      router.refresh();
    } finally {
      setBootstrapping(false);
    }
  }

  const newCount = enquiries.filter((e) => e.status === "New").length;

  const tabs: Array<{
    id: AdminTab;
    label: string;
    icon: typeof LayoutDashboard;
    badge?: number;
    badgeColor?: string;
  }> = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "homepage", label: "Homepage Editor", icon: Globe },
    { id: "rooms", label: "Rooms & Stay", icon: BedDouble, badge: rooms.length },
    { id: "media", label: "Photo & Media", icon: ImageIcon, badge: media.length },
    { id: "coast", label: "Explore Coast", icon: Compass, badge: coastGuides.length },
    { id: "about", label: "About Us", icon: BookOpen },
    { id: "facilities", label: "Facilities", icon: Sparkles, badge: settings.facilities.length },
    { id: "contact", label: "Contact & Location", icon: MapPin },
    { id: "settings", label: "Packages & Settings", icon: Settings },
    { id: "seo", label: "SEO Manager", icon: Search },
    { id: "themes", label: "Themes & Seasons", icon: Palette, badge: themes.length },
    {
      id: "enquiries",
      label: "Enquiries",
      icon: Inbox,
      badge: newCount > 0 ? newCount : enquiries.length,
      badgeColor: newCount > 0 ? "bg-emerald-500 text-white font-bold" : undefined,
    },
    {
      id: "availability",
      label: "Availability",
      icon: CalendarOff,
      badge: availability.length,
    },
    { id: "gallery", label: "Public Gallery", icon: ImageIcon, badge: gallery.length },
  ];

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
      {/* Top Header Bar */}
      <header className="rounded-[28px] bg-[#070D18] text-white p-4 sm:p-5 border border-[#C5A059]/30 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-2xl border border-[#C5A059]/40 shadow-md bg-[#070D18]">
            <Image
              src="/brand/eden-emblem.png"
              alt="The Eden"
              width={40}
              height={40}
              className="h-full w-full object-contain p-0.5"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white">
                The Eden Beach Home Stay
              </h1>
              <span className="rounded-full bg-[#C5A059]/20 border border-[#C5A059]/35 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#DFBA73]">
                CMS
              </span>
            </div>
            <p className="text-xs text-[#F5F2EB]/70">
              Signed in as <strong className="text-white">{initialData.username}</strong> • Property Owner
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <ThemeToggle />
          <button
            type="button"
            onClick={handlePublishAll}
            disabled={publishing}
            className="canva-btn-camel flex items-center gap-1.5 text-xs py-2 px-4 shadow-md cursor-pointer"
            title="Flush cache so latest edits immediately appear to public visitors"
          >
            {publishing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            <span>Publish Live</span>
          </button>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="canva-btn-outline-white flex items-center gap-1.5 text-xs py-2 px-3.5 cursor-pointer"
          >
            <span>View Public Site</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 px-3.5 py-2 text-xs font-semibold text-white transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Feedback Toast Banner */}
      {feedback && (
        <div
          role="status"
          className={`mt-4 flex items-center justify-between rounded-2xl px-5 py-3.5 text-xs font-semibold shadow-md ${
            feedback.isError
              ? "border border-rose-300 bg-rose-50 text-rose-900"
              : "border border-[#C5A059]/40 bg-[#070D18] text-[#DFBA73]"
          }`}
        >
          <span>{feedback.msg}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="cursor-pointer underline font-bold ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main CMS Navigation Tab Strip */}
      <nav
        aria-label="CMS Navigation"
        className="mt-6 flex flex-wrap gap-1.5 border-b border-eden-line/60 pb-3 overflow-x-auto"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition whitespace-nowrap ${
                active
                  ? "bg-[#C5A059] text-white shadow-md font-bold"
                  : "bg-eden-inset text-eden-ink hover:bg-eden-surface border border-eden-line/40"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
              {typeof tab.badge === "number" && (
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    tab.badgeColor
                      ? tab.badgeColor
                      : active
                      ? "bg-black/20 text-white"
                      : "bg-black/10 text-eden-muted"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Active Tab Panel */}
      <main className="mt-6">
        {activeTab === "overview" && (
          <AdminOverviewTab
            enquiries={enquiries}
            rooms={rooms}
            media={media}
            coastGuides={coastGuides}
            onNavigateTab={(tab) => setActiveTab(tab as AdminTab)}
            onFeedback={notify}
          />
        )}
        {activeTab === "homepage" && (
          <AdminHomepageTab
            initialContent={homepage}
            mediaItems={media}
            onFeedback={notify}
          />
        )}
        {activeTab === "rooms" && (
          <AdminRoomsTab
            initialRooms={rooms}
            mediaItems={media}
            onFeedback={notify}
          />
        )}
        {activeTab === "media" && (
          <AdminMediaTab
            initialItems={media}
            onFeedback={notify}
          />
        )}
        {activeTab === "coast" && (
          <AdminCoastGuideTab
            guides={coastGuides}
            onChange={setCoastGuides}
            onFeedback={notify}
          />
        )}
        {activeTab === "about" && (
          <AdminAboutTab
            initialAbout={about}
            mediaItems={media}
            onFeedback={notify}
          />
        )}
        {activeTab === "facilities" && (
          <AdminFacilitiesTab
            settings={settings}
            onChangeSettings={setSettings}
            onFeedback={notify}
          />
        )}
        {activeTab === "contact" && (
          <AdminContactTab
            settings={settings}
            onChangeSettings={setSettings}
            onFeedback={notify}
          />
        )}
        {activeTab === "settings" && (
          <AdminSettingsTab
            settings={settings}
            onChange={setSettings}
            onFeedback={notify}
          />
        )}
        {activeTab === "seo" && (
          <AdminSeoTab
            initialSeo={seo}
            mediaItems={media}
            onFeedback={notify}
          />
        )}
        {activeTab === "themes" && (
          <AdminThemesTab
            themes={themes}
            themeSettings={themeSettings}
            onFeedback={notify}
          />
        )}
        {activeTab === "enquiries" && (
          <AdminEnquiriesTab
            enquiries={enquiries}
            onChange={setEnquiries}
            onFeedback={notify}
          />
        )}
        {activeTab === "availability" && (
          <AdminAvailabilityTab
            blocks={availability}
            onChange={setAvailability}
            onFeedback={notify}
          />
        )}
        {activeTab === "gallery" && (
          <AdminGalleryTab
            images={gallery}
            onChange={setGallery}
            onFeedback={notify}
          />
        )}
      </main>
    </div>
  );
}
