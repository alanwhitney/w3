// Highlight colors a list can be tagged with. Must match the check
// constraint on w3_lists.color. Class names are spelled out in full so
// Tailwind picks them up.
export const LIST_COLORS = {
  red: { swatch: "bg-red-500", card: "border-l-red-500 bg-red-50" },
  orange: { swatch: "bg-orange-500", card: "border-l-orange-500 bg-orange-50" },
  amber: { swatch: "bg-amber-400", card: "border-l-amber-400 bg-amber-50" },
  green: { swatch: "bg-green-500", card: "border-l-green-500 bg-green-50" },
  teal: { swatch: "bg-teal-500", card: "border-l-teal-500 bg-teal-50" },
  blue: { swatch: "bg-blue-500", card: "border-l-blue-500 bg-blue-50" },
  violet: { swatch: "bg-violet-500", card: "border-l-violet-500 bg-violet-50" },
  pink: { swatch: "bg-pink-500", card: "border-l-pink-500 bg-pink-50" },
} as const;

export type ListColor = keyof typeof LIST_COLORS;

export function listColor(color: string | null) {
  return color && color in LIST_COLORS ? LIST_COLORS[color as ListColor] : null;
}
