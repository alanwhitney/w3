import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PrintButton } from "@/components/PrintButton";
import { formatWhen } from "@/lib/datetime";

export default async function PublicListPage({
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
    .eq("is_public", true)
    .single();

  if (!list) notFound();

  const { data: items } = await supabase
    .from("w3_items")
    .select("*")
    .eq("list_id", id)
    .order("position", { ascending: true });

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-12">
      <p className="no-print mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
        Shared list · read only
      </p>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">{list.title}</h1>
      {items && items.length > 0 ? (
        <div className="flex flex-col divide-y divide-zinc-200 border-y border-zinc-200">
          {items.map((item) => {
            const when = formatWhen(item.when_date, item.when_time);
            return (
              <div
                key={item.id}
                className={`flex items-start justify-between gap-4 py-3 ${item.indent ? "ml-8" : ""}`}
              >
                <div>
                  <p className={`font-medium ${item.completed ? "text-zinc-400 line-through" : "text-zinc-900"}`}>
                    {item.what || "(no description)"}
                  </p>
                  <p className="text-sm text-zinc-500">{item.who || "Unassigned"}</p>
                </div>
                {when && <p className="shrink-0 text-sm text-zinc-500">{when}</p>}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-zinc-500">This list has no items yet.</p>
      )}
      <PrintButton />
    </div>
  );
}
