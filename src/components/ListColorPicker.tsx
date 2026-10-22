"use client";

import { useState } from "react";
import { LIST_COLORS, listColor, type ListColor } from "@/lib/listColors";

// Swatch button that expands into the palette; picking one (or "none") collapses it.
export function ListColorPicker({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (color: ListColor | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = listColor(value);

  function pick(color: ListColor | null) {
    setOpen(false);
    if (color !== value) onChange(color);
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Highlight color"
        aria-expanded={open}
        className="flex items-center gap-1 hover:text-zinc-900 hover:underline"
      >
        <span
          className={`inline-block h-3 w-3 rounded-full ${current ? current.swatch : "border border-zinc-400"}`}
        />
        Color
      </button>
      {open && (
        <div className="flex items-center gap-1">
          {(Object.keys(LIST_COLORS) as ListColor[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => pick(c)}
              aria-label={c}
              title={c}
              className={`h-4 w-4 rounded-full ${LIST_COLORS[c].swatch} ${c === value ? "ring-2 ring-zinc-900 ring-offset-1" : ""}`}
            />
          ))}
          <button
            type="button"
            onClick={() => pick(null)}
            aria-label="No color"
            title="No color"
            className="flex h-4 w-4 items-center justify-center rounded-full border border-zinc-400 text-[10px] leading-none text-zinc-500"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
