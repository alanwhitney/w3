"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TablesUpdate } from "@/lib/supabase/database.types";

// Close the gaps left by deletes so createItem's count-based position
// stays past the end of the list.
async function renumberPositions(
  supabase: Awaited<ReturnType<typeof createClient>>,
  listId: string,
) {
  const { data: remaining } = await supabase
    .from("w3_items")
    .select("id")
    .eq("list_id", listId)
    .order("position", { ascending: true });
  await Promise.all(
    (remaining ?? []).map(({ id }, position) =>
      supabase.from("w3_items").update({ position }).eq("id", id),
    ),
  );
}

export async function createItem(
  listId: string,
  input: { who: string; what: string; when_date: string | null; when_time: string | null },
) {
  const supabase = await createClient();

  const { count } = await supabase
    .from("w3_items")
    .select("id", { count: "exact", head: true })
    .eq("list_id", listId);

  const { error } = await supabase.from("w3_items").insert({
    list_id: listId,
    who: input.who.trim(),
    what: input.what.trim(),
    when_date: input.when_date,
    when_time: input.when_time,
    position: count ?? 0,
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/lists/${listId}`);
}

export async function updateItem(
  listId: string,
  itemId: string,
  patch: TablesUpdate<"w3_items">,
) {
  const supabase = await createClient();
  const { error } = await supabase.from("w3_items").update(patch).eq("id", itemId);
  if (error) throw new Error(error.message);
  revalidatePath(`/lists/${listId}`);
}

export async function deleteItem(listId: string, itemId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("w3_items").delete().eq("id", itemId);
  if (error) throw new Error(error.message);
  await renumberPositions(supabase, listId);
  revalidatePath(`/lists/${listId}`);
}

export async function reorderItems(listId: string, orderedIds: string[]) {
  const supabase = await createClient();
  await Promise.all(
    orderedIds.map((id, position) =>
      supabase.from("w3_items").update({ position }).eq("id", id),
    ),
  );
  revalidatePath(`/lists/${listId}`);
}

export async function deleteCompletedItems(listId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("w3_items")
    .delete()
    .eq("list_id", listId)
    .eq("completed", true);
  if (error) throw new Error(error.message);

  await renumberPositions(supabase, listId);
  revalidatePath(`/lists/${listId}`);
}
