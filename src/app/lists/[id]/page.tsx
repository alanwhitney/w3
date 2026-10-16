import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ListDetailClient } from "@/components/ListDetailClient";

export default async function ListDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: list } = await supabase
    .from("w3_lists")
    .select("*")
    .eq("id", id)
    .single();

  if (!list) notFound();

  const { data: items } = await supabase
    .from("w3_items")
    .select("*")
    .eq("list_id", id)
    .order("position", { ascending: true });

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8">
      <Link href="/lists" className="no-print mb-6 w-fit text-sm text-zinc-500 hover:underline">
        ← All lists
      </Link>
      <ListDetailClient list={list} initialItems={items ?? []} />
    </div>
  );
}
