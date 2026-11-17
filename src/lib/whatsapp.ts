export type WhatsappContext = {
  guestName?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  addonBeds?: number;
  packageType?: string;
  specialRequests?: string;
};

/**
 * Normalizes a configured WHATSAPP_NUMBER into clean international digits (no '+' or spaces).
 * Returns empty string if blank or not yet configured.
 */
export function normalizeWhatsappNumber(raw: string | null | undefined): string {
  if (!raw) return "";
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length < 8 || digits.length > 15) return "";
  return digits;
}

export function buildWhatsappMessage(ctx: WhatsappContext = {}): string {
  const name = ctx.guestName?.trim() || "[Your Name]";
  const dates =
    ctx.checkIn && ctx.checkOut
      ? `${ctx.checkIn} to ${ctx.checkOut}`
      : ctx.checkIn
        ? `Check-in: ${ctx.checkIn}`
        : "[Preferred Check-in & Check-out Dates]";
  const guestsLine =
    typeof ctx.guests === "number" && ctx.guests >= 1
      ? `${ctx.guests} guest${ctx.guests > 1 ? "s" : ""}`
      : "[Number of Guests (1-4)]";
  const bedsLine =
    typeof ctx.addonBeds === "number" && ctx.addonBeds > 0
      ? ` (with ${ctx.addonBeds} optional add-on bed${ctx.addonBeds > 1 ? "s" : ""})`
      : "";
  const pkg = ctx.packageType?.trim() || "Room Only / Breakfast + One Meal";
  const notes = ctx.specialRequests?.trim() || "None";

  return [
    "Hello The Eden – Beach Homestay (Murdeshwar),",
    "I would like to request current availability and pricing for a stay:",
    "",
    `• Guest Name: ${name}`,
    `• Dates: ${dates}`,
    `• Guests: ${guestsLine}${bedsLine}`,
    `• Selected Package: ${pkg}`,
    `• Special Requests: ${notes}`,
    "",
    "Please share the current price quote and room availability. Thank you!",
  ].join("\n");
}

/**
 * Returns a properly encoded WhatsApp click-to-chat URL when WHATSAPP_NUMBER is configured,
 * or null when WHATSAPP_NUMBER is blank so the UI can show the friendly fallback notice.
 */
export function buildWhatsappUrl(
  whatsappNumber: string | null | undefined,
  ctx: WhatsappContext = {}
): string | null {
  const digits = normalizeWhatsappNumber(whatsappNumber);
  if (!digits) return null;
  const text = buildWhatsappMessage(ctx);
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

