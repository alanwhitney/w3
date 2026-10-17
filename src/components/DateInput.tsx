"use client";

import { formatWeekday } from "@/lib/datetime";

// Native date input plus the day of the week, which browsers don't show.
export function DateInput({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const weekday = formatWeekday(value || null);
  return (
    <div className="flex items-center gap-1">
      <span className="w-8 text-sm text-zinc-500" aria-hidden={!weekday}>
        {weekday}
      </span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
      />
    </div>
  );
}
