"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DateInput } from "@/components/DateInput";
import { googleCalendarUrl } from "@/lib/googleCalendar";
import type { Tables } from "@/lib/supabase/database.types";

type Item = Tables<"w3_items">;

export function SortableItemRow({
  item,
  listTitle,
  onChange,
  onDelete,
}: {
  item: Item;
  listTitle: string;
  onChange: (patch: Partial<Item>) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const calendarUrl = googleCalendarUrl({
    what: item.what,
    who: item.who,
    date: item.when_date,
    time: item.when_time,
    listTitle,
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start gap-2 rounded-md border border-zinc-200 bg-white p-3 ${item.indent ? "ml-8" : ""}`}
    >
      <button
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="no-print mt-1 cursor-grab touch-none text-zinc-400 hover:text-zinc-700"
      >
        ⠿
      </button>
      <input
        type="checkbox"
        checked={item.completed}
        onChange={(e) => onChange({ completed: e.target.checked })}
        className="mt-1.5 h-4 w-4 no-print"
      />
      <div className="grid min-w-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto_auto]">
        <input
          value={item.who}
          onChange={(e) => onChange({ who: e.target.value })}
          placeholder="Who"
          className={`min-w-0 rounded border border-transparent px-2 py-1 hover:border-zinc-200 focus:border-zinc-400 ${item.completed ? "text-zinc-400 line-through" : ""}`}
        />
        <input
          value={item.what}
          onChange={(e) => onChange({ what: e.target.value })}
          placeholder="What"
          className={`min-w-0 rounded border border-transparent px-2 py-1 hover:border-zinc-200 focus:border-zinc-400 ${item.completed ? "text-zinc-400 line-through" : ""}`}
        />
        <DateInput
          value={item.when_date ?? ""}
          onChange={(v) => onChange({ when_date: v || null })}
          className="rounded border border-transparent px-2 py-1 hover:border-zinc-200 focus:border-zinc-400"
        />
        <input
          type="time"
          value={item.when_time ?? ""}
          onChange={(e) => onChange({ when_time: e.target.value || null })}
          className="rounded border border-transparent px-2 py-1 hover:border-zinc-200 focus:border-zinc-400"
        />
      </div>
      {calendarUrl ? (
        <a
          href={calendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Add to Google Calendar"
          title="Add to Google Calendar"
          className="no-print mt-1 text-zinc-400 hover:text-blue-600"
        >
          📅
        </a>
      ) : (
        <span className="no-print mt-1 w-[1.25em]" aria-hidden />
      )}
      <button
        onClick={onDelete}
        aria-label="Delete item"
        className="no-print mt-1 text-zinc-400 hover:text-red-600"
      >
        ✕
      </button>
    </div>
  );
}
