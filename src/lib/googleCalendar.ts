import { parseLocalDate } from "@/lib/datetime";

const pad = (n: number) => String(n).padStart(2, "0");

function ymd(d: Date) {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

function ymdhms(d: Date) {
  return `${ymd(d)}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
}

// Link that opens Google Calendar's "new event" form prefilled with the item.
// Times are sent without a timezone so Google uses the calendar's own zone,
// matching how items store plain local dates/times. Timed events default to
// one hour; items without a time become all-day events.
export function googleCalendarUrl({
  what,
  who,
  date,
  time,
  listTitle,
}: {
  what: string;
  who: string;
  date: string | null;
  time: string | null;
  listTitle: string;
}): string | null {
  if (!date) return null;
  const start = parseLocalDate(date, time);
  if (!start) return null;

  let dates: string;
  if (time) {
    const end = new Date(start);
    end.setHours(end.getHours() + 1);
    dates = `${ymdhms(start)}/${ymdhms(end)}`;
  } else {
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    dates = `${ymd(start)}/${ymd(end)}`;
  }

  const details = [who && `Who: ${who}`, listTitle && `List: ${listTitle}`]
    .filter(Boolean)
    .join("\n");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: what || who || listTitle || "W3 item",
    dates,
  });
  if (details) params.set("details", details);
  return `https://calendar.google.com/calendar/render?${params}`;
}
