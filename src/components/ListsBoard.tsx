"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  createList,
  deleteList,
  setListArchived,
  setListPublic,
} from "@/app/lists/actions";
import type { Tables } from "@/lib/supabase/database.types";

type ListWithItems = Tables<"w3_lists"> & {
  w3_items: { id: string; completed: boolean }[];
};

export function ListsBoard({ lists }: { lists: ListWithItems[] }) {
  const [query, setQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return lists
      .filter((l) => l.archived === showArchived)
      .filter((l) => !q || l.title.toLowerCase().includes(q));
  }, [lists, query, showArchived]);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search lists…"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500 sm:max-w-xs"
        />
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => setShowArchived(false)}
            className={`rounded-full px-3 py-1 ${!showArchived ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600"}`}
          >
            Active
          </button>
          <button
            onClick={() => setShowArchived(true)}
            className={`rounded-full px-3 py-1 ${showArchived ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600"}`}
          >
            Archived
          </button>
        </div>
      </div>

      {!showArchived && (
        <form action={createList} className="flex gap-2">
          <input
            name="title"
            placeholder="Create a new list…"
            required
            className="flex-1 rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
          />
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-700"
          >
            New list
          </button>
        </form>
      )}

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-zinc-500">
          {query ? "No lists match your search." : showArchived ? "No archived lists." : "No lists yet — create one above."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((list) => (
            <ListCard key={list.id} list={list} />
          ))}
        </div>
      )}
    </div>
  );
}

function ListCard({ list }: { list: ListWithItems }) {
  const total = list.w3_items.length;
  const done = list.w3_items.filter((i) => i.completed).length;

  return (
    <div className="group flex flex-col gap-3 rounded-lg border border-zinc-200 p-4 shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/lists/${list.id}`} className="flex flex-col gap-1">
        <h2 className="font-medium text-zinc-900">{list.title}</h2>
        <p className="text-sm text-zinc-500">
          {total === 0 ? "No items" : `${done}/${total} done`}
        </p>
      </Link>
      {list.is_public && (
        <PublicLinkBadge listId={list.id} />
      )}
      <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500">
        <button
          onClick={() => setListArchived(list.id, !list.archived)}
          className="hover:text-zinc-900 hover:underline"
        >
          {list.archived ? "Unarchive" : "Archive"}
        </button>
        <button
          onClick={() => setListPublic(list.id, !list.is_public)}
          className="hover:text-zinc-900 hover:underline"
        >
          {list.is_public ? "Make private" : "Make public"}
        </button>
        <button
          onClick={() => {
            if (confirm(`Delete "${list.title}"? This cannot be undone.`)) {
              deleteList(list.id);
            }
          }}
          className="text-red-500 hover:text-red-700 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function PublicLinkBadge({ listId }: { listId: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={async (e) => {
        e.preventDefault();
        const url = `${window.location.origin}/p/${listId}`;
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="w-fit rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
    >
      {copied ? "Link copied!" : "Public · copy link"}
    </button>
  );
}
