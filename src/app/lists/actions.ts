"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ListColor } from "@/lib/listColors";

export async function createList(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim() || "Untitled list";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("w3_lists")
    .insert({ title, owner_id: user.id })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/lists");
  redirect(`/lists/${data.id}`);
}

export async function updateListTitle(listId: string, title: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("w3_lists")
    .update({ title: title.trim() || "Untitled list" })
    .eq("id", listId);
  if (error) throw new Error(error.message);
  revalidatePath("/lists");
  revalidatePath(`/lists/${listId}`);
}

export async function updateListDescription(listId: string, description: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("w3_lists")
    .update({ description: description.trim() || null })
    .eq("id", listId);
  if (error) throw new Error(error.message);
  revalidatePath(`/lists/${listId}`);
}

export async function setListArchived(listId: string, archived: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("w3_lists")
    .update({ archived })
    .eq("id", listId);
  if (error) throw new Error(error.message);
  revalidatePath("/lists");
  revalidatePath(`/lists/${listId}`);
}

export async function setListPublic(listId: string, isPublic: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("w3_lists")
    .update({ is_public: isPublic })
    .eq("id", listId);
  if (error) throw new Error(error.message);
  revalidatePath("/lists");
  revalidatePath(`/lists/${listId}`);
}

export async function setListColor(listId: string, color: ListColor | null) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("w3_lists")
    .update({ color })
    .eq("id", listId);
  if (error) throw new Error(error.message);
  revalidatePath("/lists");
  revalidatePath(`/lists/${listId}`);
}

export async function reorderLists(orderedIds: string[]) {
  const supabase = await createClient();
  await Promise.all(
    orderedIds.map((id, position) =>
      supabase.from("w3_lists").update({ position }).eq("id", id),
    ),
  );
  revalidatePath("/lists");
}

export async function deleteList(listId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("w3_lists").delete().eq("id", listId);
  if (error) throw new Error(error.message);
  revalidatePath("/lists");
}
