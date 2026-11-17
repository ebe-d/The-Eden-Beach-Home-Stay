"use client";

import { useState } from "react";
import { CalendarOff, Loader2, Plus, Trash2 } from "lucide-react";
import type { PublicAvailabilityBlock } from "@/db/defaults";
import { AVAILABILITY_STATUSES, type AvailabilityStatus } from "@/db/schema";

export function AdminAvailabilityTab({
  blocks,
  onChange,
  onFeedback,
}: {
  blocks: PublicAvailabilityBlock[];
  onChange: (next: PublicAvailabilityBlock[]) => void;
  onFeedback: (msg: string, isError?: boolean) => void;
}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<AvailabilityStatus>("Confirmed Hold");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function addBlock(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/admin/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate, endDate, status, note }),
      });
      const data = (await res.json()) as {
        block?: PublicAvailabilityBlock;
        error?: string;
      };
      if (!res.ok || !data.block) {
        onFeedback(data.error || "Could not add availability block.", true);
        return;
      }
      onChange([...blocks, data.block]);
      setStartDate("");
      setEndDate("");
      setNote("");
      onFeedback("Added manual availability block.");
    } catch {
      onFeedback("Network error while saving block.", true);
    } finally {
      setBusy(false);
    }
  }

  async function deleteBlock(id: number) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/availability/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        onFeedback("Could not remove availability block.", true);
        return;
      }
      onChange(blocks.filter((b) => b.id !== id));
      onFeedback("Removed availability block.");
    } catch {
      onFeedback("Network error while deleting block.", true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <form
        onSubmit={addBlock}
        className="glass-card rounded-[26px] p-6 space-y-4 lg:col-span-5"
      >
        <h3 className="text-lg font-bold text-eden-ink">
          Mark Room Unavailable
        </h3>
        <p className="text-xs leading-relaxed text-eden-muted">
          Block date ranges for confirmed stays or maintenance. Public enquiry forms
          automatically prevent submissions overlapping these dates. Private notes
          stay visible only in this Admin dashboard.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-eden-soft">
              From (Check-in / Start)
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-2xl border border-eden-line bg-eden-input px-3.5 py-2 text-sm text-eden-ink"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-eden-soft">
              To (Check-out / End)
            </label>
            <input
              type="date"
              required
              min={startDate}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-2xl border border-eden-line bg-eden-input px-3.5 py-2 text-sm text-eden-ink"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-eden-soft">
            Block Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as AvailabilityStatus)}
            className="w-full rounded-2xl border border-eden-line bg-eden-input px-3.5 py-2 text-sm text-eden-ink"
          >
            {AVAILABILITY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-eden-soft">
            Internal Note (Private)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Confirmed via WhatsApp"
            className="w-full rounded-2xl border border-eden-line bg-eden-input px-3.5 py-2 text-sm text-eden-ink"
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-eden-btn px-5 py-2.5 text-sm font-semibold text-eden-btn-ink transition hover:bg-eden-btn-hover"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Add Blocked Dates
        </button>
      </form>

      <div className="glass-card rounded-[26px] p-6 lg:col-span-7">
        <h3 className="text-lg font-bold text-eden-ink">
          Active Manual Calendar Blocks ({blocks.length})
        </h3>
        {blocks.length === 0 ? (
          <p className="mt-4 text-sm text-eden-muted">
            No date blocks added yet. All upcoming dates currently accept guest
            enquiries.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {blocks.map((block) => (
              <li
                key={block.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-eden-inset p-4"
              >
                <div>
                  <div className="flex items-center gap-2 text-sm font-bold text-eden-ink">
                    <CalendarOff className="h-4 w-4 text-eden-blue" />
                    <span>
                      {block.startDate} → {block.endDate}
                    </span>
                    <span className="rounded-full bg-eden-surface px-2.5 py-0.5 text-[11px] font-semibold text-eden-ink">
                      {block.status}
                    </span>
                  </div>
                  {block.note && (
                    <p className="mt-1 text-xs text-eden-muted">
                      Private Note: {block.note}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => deleteBlock(block.id)}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

