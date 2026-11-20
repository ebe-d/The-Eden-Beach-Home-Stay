import type { ThemeItem } from "@/db/schema";
import type { PublicThemeSettings } from "@/db/defaults";

/**
 * Parses an ISO date/time string entered in Asia/Kolkata (IST, UTC+05:30)
 * e.g. "2026-11-01T00:00" or "2026-11-01"
 */
export function parseIstTimestamp(dateStr: string | null | undefined): number {
  if (!dateStr || !dateStr.trim()) return NaN;
  const trimmed = dateStr.trim();
  // If no timezone offset is specified, append +05:30 (India Standard Time)
  if (!trimmed.includes("Z") && !trimmed.includes("+") && !trimmed.match(/-\d{2}:\d{2}$/)) {
    const withTime = trimmed.includes("T") ? trimmed : `${trimmed}T00:00:00`;
    const fullIso = withTime.length === 16 ? `${withTime}:00+05:30` : `${withTime}+05:30`;
    return Date.parse(fullIso);
  }
  return Date.parse(trimmed);
}

/**
 * Checks whether a theme schedule is currently active according to Asia/Kolkata time
 */
export function isScheduleActive(
  settings: PublicThemeSettings,
  nowMs: number = Date.now()
): boolean {
  if (settings.manualOverride) return false;
  if (!settings.scheduledThemeId) return false;
  if (!settings.scheduleStartDate || !settings.scheduleEndDate) return false;

  const start = parseIstTimestamp(settings.scheduleStartDate);
  const end = parseIstTimestamp(settings.scheduleEndDate);

  if (Number.isNaN(start) || Number.isNaN(end)) return false;
  return nowMs >= start && nowMs <= end;
}

/**
 * Returns the effective theme ID taking into account schedule and manual override
 */
export function resolveEffectiveThemeId(
  settings: PublicThemeSettings,
  nowMs: number = Date.now()
): string {
  if (isScheduleActive(settings, nowMs)) {
    return settings.scheduledThemeId || settings.activeThemeId || "default";
  }
  return settings.activeThemeId || "default";
}

/**
 * Generates clean CSS variables string to be injected in SSR <head> or preview container
 */
export function generateThemeCssVariables(theme: ThemeItem): string {
  const c = theme.colors;
  const btn = theme.buttonStyle;

  return `
    :root, [data-theme="${theme.id}"] {
      --canva-forest: ${c.primary};
      --canva-forest-deep: ${c.primary};
      --canva-olive: ${c.secondary};
      --canva-olive-dark: ${c.secondary};
      --canva-sage: ${c.secondary};
      --canva-camel: ${c.accent};
      --canva-camel-hover: ${c.accentHover || c.accent};
      --canva-sand: ${c.surfaceElevated || "#F2ECE2"};
      --canva-cream: ${c.background};
      --canva-charcoal: ${c.text};

      --eden-primary: ${c.primary};
      --eden-secondary: ${c.secondary};
      --eden-accent: ${c.accent};
      --eden-accent-hover: ${c.accentHover || c.accent};
      --eden-bg: ${c.background};
      --eden-surface: ${c.surface};
      --eden-inset: ${c.surfaceElevated || "#F2ECE2"};
      --eden-input: ${c.surface};
      --eden-border: ${c.borderColor};
      --eden-line: ${c.borderColor};
      --eden-ink: ${c.text};
      --eden-ink-soft: ${c.text};
      --eden-muted: ${c.mutedText};
      --eden-btn: ${c.buttonBg || c.accent};
      --eden-btn-hover: ${c.buttonHoverBg || c.accentHover};
      --eden-btn-text: ${c.buttonText || "#ffffff"};
      --eden-btn-radius: ${btn.buttonRadius || "4px"};
    }

    .canva-btn-camel {
      background-color: var(--canva-camel) !important;
      color: var(--eden-btn-text, #ffffff) !important;
      border-radius: var(--eden-btn-radius, 4px) !important;
    }
    .canva-btn-camel:hover {
      background-color: var(--canva-camel-hover) !important;
    }
    .canva-btn-outline-camel {
      color: var(--canva-camel) !important;
      border-color: var(--canva-camel) !important;
      border-radius: var(--eden-btn-radius, 4px) !important;
    }
    .canva-btn-outline-camel:hover {
      background-color: var(--canva-camel) !important;
      color: var(--eden-btn-text, #ffffff) !important;
    }
    .canva-card-forest {
      background-color: var(--canva-forest) !important;
    }
    .canva-card-olive {
      background-color: var(--canva-olive) !important;
    }
  `.trim();
}
