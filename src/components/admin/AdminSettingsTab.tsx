"use client";

import { useState } from "react";
import { Loader2, MessageCircle, Plus, Save, Trash2 } from "lucide-react";
import type { PublicSiteSettings } from "@/db/defaults";
import type { FacilityItem, PackageItem } from "@/db/schema";
import { normalizeWhatsappNumber } from "@/lib/whatsapp";

export function AdminSettingsTab({
  settings,
  onChange,
  onFeedback,
}: {
  settings: PublicSiteSettings;
  onChange: (next: PublicSiteSettings) => void;
  onFeedback: (msg: string, isError?: boolean) => void;
}) {
  const [draft, setDraft] = useState<PublicSiteSettings>(settings);
  const [busy, setBusy] = useState(false);

  const whatsappActive = normalizeWhatsappNumber(draft.whatsappNumber).length > 0;

  function updateFacility(idx: number, patch: Partial<FacilityItem>) {
    const next = [...draft.facilities];
    next[idx] = { ...next[idx], ...patch };
    setDraft({ ...draft, facilities: next });
  }

  function addFacility() {
    setDraft({
      ...draft,
      facilities: [
        ...draft.facilities,
        {
          id: `facility-${Date.now()}`,
          title: "New Homestay Facility",
          description: "Describe the facility clearly for guests.",
          icon: "waves",
        },
      ],
    });
  }

  function removeFacility(idx: number) {
    if (draft.facilities.length <= 1) return;
    setDraft({
      ...draft,
      facilities: draft.facilities.filter((_, i) => i !== idx),
    });
  }

  function updatePackage(idx: number, patch: Partial<PackageItem>) {
    const next = [...draft.packages];
    next[idx] = { ...next[idx], ...patch };
    setDraft({ ...draft, packages: next });
  }

  async function saveAll(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = (await res.json()) as {
        settings?: PublicSiteSettings;
        error?: string;
      };
      if (!res.ok || !data.settings) {
        onFeedback(data.error || "Could not save settings.", true);
        return;
      }
      setDraft(data.settings);
      onChange(data.settings);
      onFeedback("Saved WhatsApp, contact info, facilities, and package descriptions.");
    } catch {
      onFeedback("Network error while saving settings.", true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={saveAll} className="space-y-6">
      {/* WHATSAPP_NUMBER & Contact Info */}
      <section className="glass-card rounded-[26px] p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-bold text-eden-ink">
            WhatsApp (WHATSAPP_NUMBER) & Contact Information
          </h3>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
              whatsappActive
                ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-200"
                : "bg-[#F5B69E]/45 text-eden-ink"
            }`}
          >
            <MessageCircle className="h-3.5 w-3.5" />
            {whatsappActive
              ? "WhatsApp Direct Chat Active"
              : "Blank — Showing 'Available Soon' + Enquiry Form"}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-eden-soft">
              WHATSAPP_NUMBER (Leave blank until ready; include country code e.g. 9198...)
            </label>
            <input
              type="text"
              value={draft.whatsappNumber}
              onChange={(e) =>
                setDraft({ ...draft, whatsappNumber: e.target.value })
              }
              placeholder="Leave blank until WhatsApp number is available"
              className="w-full rounded-2xl border border-eden-line bg-eden-input px-3.5 py-2.5 text-sm text-eden-ink"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-eden-soft">
              Business Name
            </label>
            <input
              type="text"
              required
              value={draft.businessName}
              onChange={(e) =>
                setDraft({ ...draft, businessName: e.target.value })
              }
              className="w-full rounded-2xl border border-eden-line bg-eden-input px-3.5 py-2.5 text-sm text-eden-ink"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-eden-soft">
              Public Contact Phone (Optional)
            </label>
            <input
              type="text"
              value={draft.contactPhone}
              onChange={(e) =>
                setDraft({ ...draft, contactPhone: e.target.value })
              }
              placeholder="Leave blank if unavailable"
              className="w-full rounded-2xl border border-eden-line bg-eden-input px-3.5 py-2.5 text-sm text-eden-ink"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-eden-soft">
              Public Contact Email (Optional)
            </label>
            <input
              type="email"
              value={draft.contactEmail}
              onChange={(e) =>
                setDraft({ ...draft, contactEmail: e.target.value })
              }
              placeholder="Leave blank if unavailable"
              className="w-full rounded-2xl border border-eden-line bg-eden-input px-3.5 py-2.5 text-sm text-eden-ink"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-eden-soft">
              Address Line
            </label>
            <input
              type="text"
              required
              value={draft.addressLine}
              onChange={(e) =>
                setDraft({ ...draft, addressLine: e.target.value })
              }
              className="w-full rounded-2xl border border-eden-line bg-eden-input px-3.5 py-2.5 text-sm text-eden-ink"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-eden-soft">
              Google Maps Link URL
            </label>
            <input
              type="url"
              required
              value={draft.mapLinkUrl}
              onChange={(e) =>
                setDraft({ ...draft, mapLinkUrl: e.target.value })
              }
              className="w-full rounded-2xl border border-eden-line bg-eden-input px-3.5 py-2.5 text-sm text-eden-ink"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-eden-soft">
              Check-In / Arrival Note
            </label>
            <input
              type="text"
              required
              value={draft.checkInNote}
              onChange={(e) =>
                setDraft({ ...draft, checkInNote: e.target.value })
              }
              className="w-full rounded-2xl border border-eden-line bg-eden-input px-3.5 py-2.5 text-sm text-eden-ink"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-eden-soft">
              Enquiry Confirmation Disclaimer
            </label>
            <input
              type="text"
              required
              value={draft.bookingDisclaimer}
              onChange={(e) =>
                setDraft({ ...draft, bookingDisclaimer: e.target.value })
              }
              className="w-full rounded-2xl border border-eden-line bg-eden-input px-3.5 py-2.5 text-sm text-eden-ink"
            />
          </div>
        </div>
      </section>

      {/* Facilities Editor */}
      <section className="glass-card rounded-[26px] p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-bold text-eden-ink">
            Property Facilities ({draft.facilities.length})
          </h3>
          <button
            type="button"
            onClick={addFacility}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-eden-inset px-3.5 py-1.5 text-xs font-bold text-eden-ink"
          >
            <Plus className="h-3.5 w-3.5" /> Add Facility
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {draft.facilities.map((fac, idx) => (
            <div
              key={fac.id}
              className="rounded-2xl border border-eden-line bg-eden-inset p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <select
                  value={fac.icon}
                  onChange={(e) =>
                    updateFacility(idx, {
                      icon: e.target.value as FacilityItem["icon"],
                    })
                  }
                  className="rounded-xl border border-eden-line bg-eden-input px-2.5 py-1 text-xs font-semibold text-eden-ink"
                >
                  <option value="waves">Beachfront</option>
                  <option value="bed">Beds</option>
                  <option value="users">Guests</option>
                  <option value="ac">Air Conditioning</option>
                  <option value="wifi">Wi-Fi</option>
                  <option value="bath">Private Bathroom</option>
                </select>
                {draft.facilities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFacility(idx)}
                    className="text-xs font-semibold text-rose-700 hover:underline dark:text-rose-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <input
                type="text"
                required
                value={fac.title}
                onChange={(e) => updateFacility(idx, { title: e.target.value })}
                className="w-full rounded-xl border border-eden-line bg-eden-input px-3 py-1.5 text-sm font-semibold text-eden-ink"
              />
              <textarea
                rows={2}
                required
                value={fac.description}
                onChange={(e) =>
                  updateFacility(idx, { description: e.target.value })
                }
                className="w-full rounded-xl border border-eden-line bg-eden-input px-3 py-1.5 text-xs text-eden-ink"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Packages & Optional Beverages Editor (No public prices!) */}
      <section className="glass-card rounded-[26px] p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-eden-ink">
            Package Descriptions (Price on Enquiry Only)
          </h3>
          <p className="text-xs text-eden-muted">
            Keep descriptions free of prices — all quotes are shared directly on enquiry.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {draft.packages.map((pkg, idx) => (
            <div
              key={pkg.id}
              className="rounded-2xl border border-eden-line bg-eden-inset p-4 space-y-3"
            >
              <div className="grid gap-2.5 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-eden-soft">
                    Package Title
                  </label>
                  <input
                    type="text"
                    required
                    value={pkg.title}
                    onChange={(e) =>
                      updatePackage(idx, { title: e.target.value })
                    }
                    className="w-full rounded-xl border border-eden-line bg-eden-input px-3 py-1.5 text-sm font-semibold text-eden-ink"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-eden-soft">
                    Badge
                  </label>
                  <input
                    type="text"
                    required
                    value={pkg.badge}
                    onChange={(e) =>
                      updatePackage(idx, { badge: e.target.value })
                    }
                    className="w-full rounded-xl border border-eden-line bg-eden-input px-3 py-1.5 text-sm text-eden-ink"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-bold text-eden-soft">
                  Subtitle
                </label>
                <input
                  type="text"
                  required
                  value={pkg.subtitle}
                  onChange={(e) =>
                    updatePackage(idx, { subtitle: e.target.value })
                  }
                  className="w-full rounded-xl border border-eden-line bg-eden-input px-3 py-1.5 text-xs text-eden-ink"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-bold text-eden-soft">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={pkg.description}
                  onChange={(e) =>
                    updatePackage(idx, { description: e.target.value })
                  }
                  className="w-full rounded-xl border border-eden-line bg-eden-input px-3 py-1.5 text-xs text-eden-ink"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-bold text-eden-soft">
                  Inclusions (one per line)
                </label>
                <textarea
                  rows={3}
                  value={pkg.inclusions.join("\n")}
                  onChange={(e) =>
                    updatePackage(idx, {
                      inclusions: e.target.value
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full rounded-xl border border-eden-line bg-eden-input px-3 py-1.5 text-xs text-eden-ink"
                />
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-eden-soft">
            Optional Beverages Disclosure Note
          </label>
          <textarea
            rows={2}
            required
            value={draft.beveragesNote}
            onChange={(e) =>
              setDraft({ ...draft, beveragesNote: e.target.value })
            }
            className="w-full rounded-2xl border border-eden-line bg-eden-input px-3.5 py-2 text-sm text-eden-ink"
          />
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-eden-btn px-7 py-3 text-sm font-semibold text-eden-btn-ink shadow-lg transition hover:bg-eden-btn-hover"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save All Settings & Descriptions
        </button>
      </div>
    </form>
  );
}

