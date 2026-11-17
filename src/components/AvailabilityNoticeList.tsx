import { CalendarOff, CheckCircle2 } from "lucide-react";
import type { PublicAvailabilityBlock } from "@/db/defaults";

export function AvailabilityNoticeList({
  blocks,
}: {
  blocks: PublicAvailabilityBlock[];
}) {
  return (
    <div className="glass-card rounded-[26px] p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-bold text-eden-ink">
          Manual Availability Notes (1 Private Room)
        </h3>
        <span className="rounded-full bg-[#C5A059]/20 px-3 py-1 text-xs font-semibold text-[#C5A059] border border-[#C5A059]/30">
          Owner-Updated Calendar
        </span>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-eden-muted sm:text-sm">
        Because The Eden offers only one private room, availability depends on direct
        owner confirmations rather than instant online booking. Below are any date ranges
        manually marked unavailable by the owner.
      </p>

      {blocks.length === 0 ? (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-eden-line bg-eden-inset p-4 text-sm text-eden-ink">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-[#C5A059]" />
          <span>
            No upcoming blocked dates are currently listed. Please submit an enquiry or
            message on WhatsApp to confirm availability for your dates.
          </span>
        </div>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {blocks.map((block) => (
            <li
              key={block.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#C5A059]/40 bg-[#C5A059]/10 px-4 py-3 text-sm"
            >
              <div className="flex items-center gap-2.5 font-semibold text-eden-ink">
                <CalendarOff className="h-4 w-4 text-eden-soft" />
                <span>
                  {block.startDate} to {block.endDate}
                </span>
              </div>
              <span className="rounded-full bg-eden-btn px-3 py-1 text-xs font-semibold text-eden-btn-ink">
                {block.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

