import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";
import { ListsBoard } from "@/components/ListsBoard";

export default async function ListsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: lists } = await supabase
    .from("w3_lists")
    .select("*, w3_items(id, completed)")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">W3</h1>
        <div className="flex items-center gap-4 text-sm text-zinc-600">
          <span>{user?.email}</span>
          <a href="/www.pdf" download="W3-blank-form.pdf" className="font-medium text-zinc-900 underline">
            Download blank PDF
          </a>
          <form action={logout}>
            <button className="font-medium text-zinc-900 underline" type="submit">
              Log out
            </button>
          </form>
        </div>
      </header>
      <ListsBoard lists={lists ?? []} />
    </div>
  );
}
