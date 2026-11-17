"use client";

import { useState } from "react";
import {
  ExternalLink,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Save,
  ShieldAlert,
} from "lucide-react";
import type { PublicSiteSettings } from "@/db/defaults";
import { normalizeWhatsappNumber } from "@/lib/whatsapp";

export function AdminContactTab({
  settings,
  onChangeSettings,
  onFeedback,
}: {
  settings: PublicSiteSettings;
  onChangeSettings: (next: PublicSiteSettings) => void;
  onFeedback: (msg: string, isError?: boolean) => void;
}) {
  const [form, setForm] = useState<PublicSiteSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  function update<K extends keyof PublicSiteSettings>(
    key: K,
    val: PublicSiteSettings[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: val }));
    setDirty(true);
  }

  const normalizedWhatsapp = normalizeWhatsappNumber(form.whatsappNumber);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.settings) {
        onFeedback(data.error || "Failed to save contact information.", true);
        return;
      }
      onChangeSettings(data.settings);
      setForm(data.settings);
      setDirty(false);
      onFeedback("Contact information updated successfully!");
    } catch {
      onFeedback("Network error.", true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-eden-line/60 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C5A059]">
            <MapPin className="h-3.5 w-3.5" />
            Location & Channels
          </span>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-eden-ink">
            Contact & Location Information
          </h1>
          <p className="text-xs sm:text-sm text-eden-muted">
            Configure phone, WhatsApp booking line, address, Plus Code, Google Maps links, and visitor guidance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {dirty && (
            <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-700">
              Unsaved changes
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !dirty}
            className="canva-btn-camel flex items-center gap-1.5 text-xs disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>Save Contact Info</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Direct Channels */}
        <div className="glass-card rounded-[28px] p-6 sm:p-8 border border-eden-line/60 space-y-5">
          <h2 className="font-serif text-xl font-bold text-eden-ink flex items-center gap-2">
            <Phone className="h-5 w-5 text-[#C5A059]" />
            <span>Communication & WhatsApp Channels</span>
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-eden-soft">
                WhatsApp Phone Number *
              </label>
              <input
                type="text"
                value={form.whatsappNumber}
                onChange={(e) => update("whatsappNumber", e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none focus:border-[#C5A059]"
              />
              <div className="mt-1.5 text-[11px] text-eden-muted">
                {normalizedWhatsapp ? (
                  <span className="text-emerald-700 font-mono">
                    ✓ Validated E.164: +{normalizedWhatsapp}
                  </span>
                ) : (
                  <span>Enter with country code (+91 for India).</span>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-eden-soft">
                Direct Phone Number
              </label>
              <input
                type="text"
                value={form.contactPhone}
                onChange={(e) => update("contactPhone", e.target.value)}
                placeholder="+91 ..."
                className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none focus:border-[#C5A059]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-eden-soft">
                Contact Email Address
              </label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => update("contactEmail", e.target.value)}
                placeholder="stay@theedenbeachhomestay.com"
                className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>
        </div>

        {/* Physical Address & Maps */}
        <div className="glass-card rounded-[28px] p-6 sm:p-8 border border-eden-line/60 space-y-5">
          <h2 className="font-serif text-xl font-bold text-eden-ink flex items-center gap-2">
            <MapPin className="h-5 w-5 text-[#C5A059]" />
            <span>Physical Address & Map Navigation</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-eden-soft">
                Full Physical Address *
              </label>
              <input
                type="text"
                required
                value={form.addressLine}
                onChange={(e) => update("addressLine", e.target.value)}
                placeholder="Intersection of Bailur Beach Road, Christiankeri, Bailur, Murudeshwar, Karnataka 581350, India."
                className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-eden-soft">
                Google Maps Navigation Link *
              </label>
              <input
                type="url"
                required
                value={form.mapLinkUrl}
                onChange={(e) => update("mapLinkUrl", e.target.value)}
                placeholder="https://www.google.com/maps/search/?api=1&query=4F9P%2BPC+Bailur+Karnataka+India"
                className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>
        </div>

        {/* Booking Guidance */}
        <div className="glass-card rounded-[28px] p-6 sm:p-8 border border-eden-line/60 space-y-5">
          <h2 className="font-serif text-xl font-bold text-eden-ink flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-[#C5A059]" />
            <span>Check-in Guidance & Booking Disclaimers</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-eden-soft">
                Check-in Guidance Note *
              </label>
              <input
                type="text"
                required
                value={form.checkInNote}
                onChange={(e) => update("checkInNote", e.target.value)}
                placeholder="Shared individually once your enquiry is confirmed by the host."
                className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-eden-soft">
                Booking Disclaimer Note *
              </label>
              <input
                type="text"
                required
                value={form.bookingDisclaimer}
                onChange={(e) => update("bookingDisclaimer", e.target.value)}
                placeholder="Submitting an enquiry does not confirm a booking. A booking is confirmed only after the owner responds."
                className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
