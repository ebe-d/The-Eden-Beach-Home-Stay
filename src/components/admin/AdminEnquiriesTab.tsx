"use client";

import { useMemo, useState } from "react";
import {
  Download,
  Loader2,
  Mail,
  Phone,
  Save,
  Search,
  Trash2,
} from "lucide-react";
import { ENQUIRY_STATUSES } from "@/db/schema";
import type { AdminEnquiryRow } from "./types";

const STATUS_BADGE: Record<string, string> = {
  New: "bg-[#C5A059]/25 text-eden-ink border border-[#C5A059]/30",
  Contacted: "bg-[#DFBA73]/25 text-eden-ink border border-[#DFBA73]/30",
  Confirmed: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-200",
  Cancelled: "bg-rose-100 text-rose-900 dark:bg-rose-900/50 dark:text-rose-200",
};

export function AdminEnquiriesTab({
  enquiries,
  onChange,
  onFeedback,
}: {
  enquiries: AdminEnquiryRow[];
  onChange: (next: AdminEnquiryRow[]) => void;
  onFeedback: (msg: string, isError?: boolean) => void;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [notesDraft, setNotesDraft] = useState<Record<number, string>>({});
  const [busyId, setBusyId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return enquiries.filter((item) => {
      if (statusFilter !== "All" && item.status !== statusFilter) return false;
      if (fromDate && item.checkOut < fromDate) return false;
      if (toDate && item.checkIn > toDate) return false;
      if (q) {
        const hay = [
          item.guestName,
          item.phone,
          item.email,
          item.specialRequests,
          item.internalNotes,
          item.packageType,
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [enquiries, search, statusFilter, fromDate, toDate]);

  const exportUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (statusFilter !== "All") params.set("status", statusFilter);
    if (fromDate) params.set("from", fromDate);
    if (toDate) params.set("to", toDate);
    if (search.trim()) params.set("q", search.trim());
    const qs = params.toString();
    return `/api/admin/enquiries/export${qs ? `?${qs}` : ""}`;
  }, [statusFilter, fromDate, toDate, search]);

  async function updateEnquiry(
    id: number,
    patch: { status?: string; internalNotes?: string }
  ) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = (await res.json()) as {
        enquiry?: AdminEnquiryRow;
        error?: string;
      };
      if (!res.ok || !data.enquiry) {
        onFeedback(data.error || "Failed to update enquiry.", true);
        return;
      }
      onChange(
        enquiries.map((row) =>
          row.id === id
            ? {
                ...row,
                status: data.enquiry!.status,
                internalNotes: data.enquiry!.internalNotes,
              }
            : row
        )
      );
      onFeedback(`Updated enquiry #${id}.`);
    } catch {
      onFeedback("Network error while updating enquiry.", true);
    } finally {
      setBusyId(null);
    }
  }

  async function deleteEnquiry(id: number) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        onFeedback("Could not delete enquiry.", true);
        return;
      }
      onChange(enquiries.filter((row) => row.id !== id));
      onFeedback(`Deleted enquiry #${id}.`);
    } catch {
      onFeedback("Network error while deleting enquiry.", true);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-5">
      {/* Filter & Export Bar */}
      <div className="glass-card rounded-[26px] p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12">
          <div className="relative sm:col-span-2 lg:col-span-4">
            <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-eden-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guest, phone, notes..."
              aria-label="Search enquiries"
              className="w-full rounded-2xl border border-eden-line bg-eden-input py-2.5 pl-10 pr-4 text-sm text-eden-ink outline-none focus:border-eden-blue"
            />
          </div>

          <div className="lg:col-span-2">
            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-2xl border border-eden-line bg-eden-input px-3.5 py-2.5 text-sm font-medium text-eden-ink outline-none"
            >
              <option value="All">All Statuses</option>
              {ENQUIRY_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <input
              type="date"
              aria-label="Filter from date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full rounded-2xl border border-eden-line bg-eden-input px-3 py-2.5 text-sm text-eden-ink outline-none"
            />
          </div>

          <div className="lg:col-span-2">
            <input
              type="date"
              aria-label="Filter to date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full rounded-2xl border border-eden-line bg-eden-input px-3 py-2.5 text-sm text-eden-ink outline-none"
            />
          </div>

          <div className="flex items-center justify-end sm:col-span-2 lg:col-span-2">
            <a
              href={exportUrl}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-eden-btn px-4 py-2.5 text-xs font-semibold text-eden-btn-ink transition hover:bg-eden-btn-hover"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </a>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="text-xs font-semibold text-eden-muted">
        Showing {filtered.length} of {enquiries.length} guest enquiries
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card rounded-3xl p-8 text-center text-sm text-eden-muted">
          No enquiries match your current filters.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            const currentNotes =
              notesDraft[item.id] !== undefined
                ? notesDraft[item.id]
                : item.internalNotes;
            const isBusy = busyId === item.id;

            return (
              <article
                key={item.id}
                className="glass-card rounded-[26px] p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-xs font-mono text-eden-muted">
                        #{item.id}
                      </span>
                      <h3 className="text-lg font-bold text-eden-ink">
                        {item.guestName}
                      </h3>
                      <span
                        className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                          STATUS_BADGE[item.status] || "bg-eden-inset text-eden-ink"
                        }`}
                      >
                        {item.status}
                      </span>
                      <span className="rounded-full bg-eden-inset px-2.5 py-0.5 text-[11px] font-medium text-eden-muted">
                        {item.source === "whatsapp_fallback"
                          ? "WhatsApp Fallback Form"
                          : "Web Enquiry"}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-eden-ink">
                      <span className="inline-flex items-center gap-1.5 font-semibold">
                        <Phone className="h-3.5 w-3.5 text-eden-blue" />
                        {item.phone}
                      </span>
                      {item.email && (
                        <span className="inline-flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-eden-blue" />
                          {item.email}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      aria-label={`Change status for ${item.guestName}`}
                      value={item.status}
                      disabled={isBusy}
                      onChange={(e) =>
                        updateEnquiry(item.id, { status: e.target.value })
                      }
                      className="rounded-full border border-eden-line bg-eden-input px-3.5 py-1.5 text-xs font-bold text-eden-ink outline-none"
                    >
                      {ENQUIRY_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => deleteEnquiry(item.id)}
                      aria-label={`Delete enquiry ${item.id}`}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-rose-50 text-rose-700 transition hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-eden-inset p-4 text-xs md:grid-cols-4">
                  <div>
                    <div className="text-eden-muted">Check-In → Check-Out</div>
                    <div className="mt-0.5 font-bold text-eden-ink">
                      {item.checkIn} → {item.checkOut}
                    </div>
                  </div>
                  <div>
                    <div className="text-eden-muted">Guests & Beds</div>
                    <div className="mt-0.5 font-bold text-eden-ink">
                      {item.guests} guest{item.guests > 1 ? "s" : ""} •{" "}
                      {item.addonBeds} add-on bed{item.addonBeds === 1 ? "" : "s"}
                    </div>
                  </div>
                  <div>
                    <div className="text-eden-muted">Package</div>
                    <div className="mt-0.5 font-bold text-eden-ink">
                      {item.packageType}
                    </div>
                  </div>
                  <div>
                    <div className="text-eden-muted">Submitted</div>
                    <div className="mt-0.5 font-medium text-eden-ink">
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                {item.specialRequests && (
                  <div className="mt-3 rounded-2xl bg-eden-inset px-4 py-2.5 text-xs text-eden-ink">
                    <span className="font-bold">Guest Special Requests: </span>
                    {item.specialRequests}
                  </div>
                )}

                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <label
                      htmlFor={`notes-${item.id}`}
                      className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-eden-muted"
                    >
                      Internal Owner Notes (Private)
                    </label>
                    <textarea
                      id={`notes-${item.id}`}
                      rows={2}
                      value={currentNotes}
                      onChange={(e) =>
                        setNotesDraft({ ...notesDraft, [item.id]: e.target.value })
                      }
                      placeholder="Quote shared, follow-up call summary, meal preferences..."
                      className="w-full rounded-2xl border border-eden-line bg-eden-input px-3.5 py-2 text-xs text-eden-ink outline-none focus:border-eden-blue"
                    />
                  </div>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() =>
                      updateEnquiry(item.id, { internalNotes: currentNotes })
                    }
                    className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full bg-eden-btn px-4 py-2.5 text-xs font-semibold text-eden-btn-ink transition hover:bg-eden-btn-hover"
                  >
                    {isBusy ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Save className="h-3.5 w-3.5" />
                    )}
                    Save Note
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

