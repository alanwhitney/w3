// Shared date/time display helpers. Item dates are stored as plain
// "YYYY-MM-DD" and times as "HH:MM[:SS]" with no timezone, so we always
// build local Date objects from them rather than parsing as UTC.

// Fixed locale so server-rendered and client-hydrated output match.
const LOCALE = "en-US";

export function parseLocalDate(date: string, time?: string | null): Date | null {
  const d = new Date(`${date}T${time ?? "00:00"}`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatWeekday(date: string | null, style: "short" | "long" = "short") {
  if (!date) return null;
  const d = parseLocalDate(date);
  return d ? d.toLocaleDateString(LOCALE, { weekday: style }) : null;
}

export function formatDate(date: string | null) {
  if (!date) return null;
  const d = parseLocalDate(date);
  if (!d) return null;
  return d.toLocaleDateString(LOCALE, { weekday: "short", month: "short", day: "numeric" });
}

export function formatTime(time: string | null) {
  if (!time) return null;
  const d = parseLocalDate("2000-01-01", time);
  return d ? d.toLocaleTimeString(LOCALE, { hour: "numeric", minute: "2-digit" }) : null;
}

export function formatWhen(date: string | null, time: string | null) {
  const dateStr = formatDate(date);
  if (!dateStr) return null;
  const timeStr = formatTime(time);
  return timeStr ? `${dateStr} · ${timeStr}` : dateStr;
}
