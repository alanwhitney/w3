"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print mt-8 w-fit text-sm text-zinc-500 hover:underline"
    >
      Print this list
    </button>
  );
}
