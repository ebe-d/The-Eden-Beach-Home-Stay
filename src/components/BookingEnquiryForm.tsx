"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Loader2,
  MessageCircle,
  Send,
  Users,
} from "lucide-react";
import type { PublicAvailabilityBlock } from "@/db/defaults";
import { PACKAGE_OPTIONS, type PackageOption } from "@/db/schema";
import { buildWhatsappUrl, normalizeWhatsappNumber } from "@/lib/whatsapp";

const noopSubscribe = () => () => {};

function getLocalTodayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function nextIsoDayClient(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

type BookingEnquiryFormProps = {
  whatsappNumber: string;
  bookingDisclaimer: string;
  availabilityBlocks?: PublicAvailabilityBlock[];
  defaultPackage?: PackageOption;
  defaultCheckIn?: string;
  defaultCheckOut?: string;
  defaultGuests?: number;
  source?: "web_form" | "whatsapp_fallback";
  compact?: boolean;
  onSuccess?: () => void;
};

export function BookingEnquiryForm({
  whatsappNumber,
  bookingDisclaimer,
  availabilityBlocks = [],
  defaultPackage = "Room Only",
  defaultCheckIn = "",
  defaultCheckOut = "",
  defaultGuests = 2,
  source = "web_form",
  compact = false,
  onSuccess,
}: BookingEnquiryFormProps) {
  const today = useSyncExternalStore(
    noopSubscribe,
    getLocalTodayIso,
    () => ""
  );
  const hasWhatsapp = normalizeWhatsappNumber(whatsappNumber).length > 0;

  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [guests, setGuests] = useState(Math.min(4, Math.max(1, defaultGuests)));
  const [packageType, setPackageType] = useState<PackageOption>(defaultPackage);
  const [addonBeds, setAddonBeds] = useState(0);
  const [specialRequests, setSpecialRequests] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<number | null>(null);

  const overlapWarning = useMemo(() => {
    if (!checkIn || !checkOut || checkOut <= checkIn) return null;
    return availabilityBlocks.find((b) => {
      const effectiveEnd =
        b.endDate > b.startDate ? b.endDate : nextIsoDayClient(b.startDate);
      return checkIn < effectiveEnd && checkOut > b.startDate;
    });
  }, [availabilityBlocks, checkIn, checkOut]);

  const contextualWhatsappUrl = useMemo(() => {
    return buildWhatsappUrl(whatsappNumber, {
      guestName,
      checkIn,
      checkOut,
      guests,
      addonBeds,
      packageType,
      specialRequests,
    });
  }, [
    whatsappNumber,
    guestName,
    checkIn,
    checkOut,
    guests,
    addonBeds,
    packageType,
    specialRequests,
  ]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!guestName.trim() || guestName.trim().length < 2) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    const phoneDigits = phone.replace(/[^\d]/g, "");
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      setErrorMsg("Please enter a valid phone number (7 to 15 digits).");
      return;
    }
    const currentToday = today || getLocalTodayIso();
    if (!checkIn || checkIn < currentToday) {
      setErrorMsg("Please select a valid check-in date (today or later).");
      return;
    }
    if (!checkOut || checkOut <= checkIn) {
      setErrorMsg("Check-out date must be after the check-in date.");
      return;
    }
    if (guests < 1 || guests > 4) {
      setErrorMsg("Guest count must be between 1 and 4.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName,
          phone,
          email,
          checkIn,
          checkOut,
          guests,
          packageType,
          addonBeds,
          specialRequests,
          source,
        }),
      });
      const data = (await res.json()) as { id?: number; error?: string };
      if (!res.ok) {
        setErrorMsg(data.error || "Unable to submit enquiry right now.");
        return;
      }
      setSubmittedId(data.id ?? 1);
      onSuccess?.();
    } catch {
      setErrorMsg("Network error while sending your enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submittedId !== null) {
    return (
      <div className="rounded-3xl border border-eden-line bg-eden-inset p-6 text-center shadow-sm">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-eden-btn text-eden-btn-ink">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-eden-ink">
          Enquiry Received (#{submittedId})
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-eden-muted">
          Thank you, <span className="font-semibold text-eden-ink">{guestName}</span>.{" "}
          {bookingDisclaimer}
        </p>
        <p className="mt-3 text-xs font-medium text-eden-soft">
          The owner will respond personally with availability and current pricing.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {contextualWhatsappUrl && (
            <a
              href={contextualWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-eden-btn px-5 py-2.5 text-sm font-semibold text-eden-btn-ink transition hover:bg-eden-btn-hover"
            >
              <MessageCircle className="h-4 w-4" />
              Also Send via WhatsApp
            </a>
          )}
          <button
            type="button"
            onClick={() => setSubmittedId(null)}
            className="rounded-full border border-eden-line bg-eden-surface px-5 py-2.5 text-sm font-semibold text-eden-ink transition hover:opacity-90"
          >
            Submit Another Enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "space-y-4" : "space-y-5"}>
      <div className="rounded-2xl border border-[#F5B69E]/55 bg-[#F5B69E]/18 px-4 py-3 text-xs leading-relaxed text-eden-ink">
        <span className="font-semibold">Enquiry Notice:</span> {bookingDisclaimer}{" "}
        All prices are shared individually on enquiry.
      </div>

      {overlapWarning && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-amber-300 bg-amber-50/90 px-4 py-3 text-xs text-amber-950 dark:border-amber-700/60 dark:bg-amber-950/50 dark:text-amber-100">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" />
          <div>
            The selected dates overlap a manually marked{" "}
            <span className="font-semibold">{overlapWarning.status}</span> period (
            {overlapWarning.startDate} to {overlapWarning.endDate}). Please choose alternate
            dates.
          </div>
        </div>
      )}

      {errorMsg && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-xs text-rose-900 dark:border-rose-700/60 dark:bg-rose-950/50 dark:text-rose-100"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-300" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="enquiry-name"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-eden-soft"
          >
            Guest Name *
          </label>
          <input
            id="enquiry-name"
            type="text"
            required
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Your full name"
            className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink placeholder:text-eden-muted/70 outline-none transition focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/35"
          />
        </div>

        <div>
          <label
            htmlFor="enquiry-phone"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-eden-soft"
          >
            Phone / WhatsApp *
          </label>
          <input
            id="enquiry-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 ..."
            className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink placeholder:text-eden-muted/70 outline-none transition focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/35"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="enquiry-email"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-eden-soft"
          >
            Email Address (Optional)
          </label>
          <input
            id="enquiry-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink placeholder:text-eden-muted/70 outline-none transition focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/35"
          />
        </div>

        <div className="min-w-0">
          <label
            htmlFor="enquiry-checkin"
            className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-eden-soft"
          >
            <CalendarDays className="h-3.5 w-3.5" />
            Check-In Date *
          </label>
          <input
            id="enquiry-checkin"
            type="date"
            required
            min={today || undefined}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full min-w-0 max-w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none transition focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/35"
          />
        </div>

        <div className="min-w-0">
          <label
            htmlFor="enquiry-checkout"
            className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-eden-soft"
          >
            <CalendarDays className="h-3.5 w-3.5" />
            Check-Out Date *
          </label>
          <input
            id="enquiry-checkout"
            type="date"
            required
            min={checkIn || today || undefined}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full min-w-0 max-w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none transition focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/35"
          />
        </div>

        <div className="min-w-0">
          <label
            htmlFor="enquiry-guests"
            className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-eden-soft"
          >
            <Users className="h-3.5 w-3.5" />
            Guests (Max 4) *
          </label>
          <select
            id="enquiry-guests"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full min-w-0 rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none transition focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/35"
          >
            {[1, 2, 3, 4].map((count) => (
              <option key={count} value={count}>
                {count} Guest{count > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="enquiry-addon-beds"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-eden-soft"
          >
            Optional Add-on Beds
          </label>
          <select
            id="enquiry-addon-beds"
            value={addonBeds}
            onChange={(e) => setAddonBeds(Number(e.target.value))}
            className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none transition focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/35"
          >
            <option value={0}>0 Add-on Beds (2 main beds only)</option>
            <option value={1}>1 Optional Add-on Bed</option>
            <option value={2}>2 Optional Add-on Beds</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="enquiry-package"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-eden-soft"
          >
            Package Selection (Price on Enquiry) *
          </label>
          <div className="grid gap-2.5 sm:grid-cols-3">
            {PACKAGE_OPTIONS.map((opt) => {
              const selected = packageType === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setPackageType(opt)}
                  className={`rounded-2xl border px-3.5 py-2.5 text-left text-xs font-semibold btn-interactive active:scale-95 hover:-translate-y-0.5 transition-all duration-200 ${
                    selected
                      ? "border-eden-btn bg-eden-btn text-eden-btn-ink shadow-sm"
                      : "border-eden-line bg-eden-inset text-eden-ink hover:border-eden-blue"
                  }`}
                >
                  <div>{opt}</div>
                  <div
                    className={`mt-0.5 text-[11px] font-normal ${
                      selected ? "opacity-85" : "text-eden-muted"
                    }`}
                  >
                    Price on enquiry
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="enquiry-requests"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-eden-soft"
          >
            Special Requests / Optional Beverages Note
          </label>
          <textarea
            id="enquiry-requests"
            rows={compact ? 2 : 3}
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="Share arrival preferences, meal questions, or optional beverage enquiries (tea, coffee, fresh juices, soft drinks — charged separately)."
            className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink placeholder:text-eden-muted/70 outline-none transition focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/35"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="submit"
          disabled={submitting || Boolean(overlapWarning)}
          className="btn-interactive active:scale-[0.98] hover:-translate-y-0.5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-eden-btn px-6 py-3 text-sm font-semibold text-eden-btn-ink shadow-md hover:shadow-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Send Stay Enquiry
        </button>

        {hasWhatsapp && contextualWhatsappUrl && (
          <a
            href={contextualWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-interactive active:scale-[0.98] hover:-translate-y-0.5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#C5A059]/40 bg-[#C5A059]/15 px-5 py-3 text-sm font-semibold text-eden-ink shadow-sm hover:shadow transition-all duration-200 hover:bg-[#C5A059]/25 sm:w-auto"
          >
            <MessageCircle className="h-4 w-4" />
            Ask for Price on WhatsApp
          </a>
        )}
      </div>
    </form>
  );
}
