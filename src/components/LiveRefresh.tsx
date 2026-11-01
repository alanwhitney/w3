"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Wait this long after the last keystroke on this device before refreshing,
// since item fields save on every change and a refresh mid-word can drop input.
const TYPING_QUIET_MS = 1500;

// Re-fetches the page's server data when lists or items change on another
// device (Supabase Realtime, filtered by RLS), and when the tab becomes
// visible again, since phones and sleeping tabs drop the socket.
export function LiveRefresh({ listId }: { listId?: string }) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let lastInputAt = 0;

    const onInput = () => {
      lastInputAt = Date.now();
    };
    const schedule = () => {
      clearTimeout(timer);
      const wait = Math.max(300, TYPING_QUIET_MS - (Date.now() - lastInputAt));
      timer = setTimeout(() => {
        if (Date.now() - lastInputAt < TYPING_QUIET_MS) schedule();
        else router.refresh();
      }, wait);
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") schedule();
    };

    const channel = supabase
      .channel(`w3-live-${listId ?? "all"}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "w3_lists", ...(listId && { filter: `id=eq.${listId}` }) },
        schedule,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "w3_items", ...(listId && { filter: `list_id=eq.${listId}` }) },
        schedule,
      )
      // Delete events can't be filtered, so listen to all item deletes.
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "w3_items" }, schedule)
      .subscribe();

    document.addEventListener("input", onInput, true);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("input", onInput, true);
      document.removeEventListener("visibilitychange", onVisible);
      supabase.removeChannel(channel);
    };
  }, [listId, router]);

  return null;
}
