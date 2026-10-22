"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  setListArchived,
  setListColor,
  setListPublic,
  updateListTitle,
  deleteList,
} from "@/app/lists/actions";
import {
  createItem,
  deleteCompletedItems,
  deleteItem,
  reorderItems,
  updateItem,
} from "@/app/lists/[id]/actions";
import { DateInput } from "@/components/DateInput";
import { ListColorPicker } from "@/components/ListColorPicker";
import { SortableItemRow } from "@/components/SortableItemRow";
import type { Tables } from "@/lib/supabase/database.types";

type List = Tables<"w3_lists">;
type Item = Tables<"w3_items">;

export function ListDetailClient({
  list,
  initialItems,
}: {
  list: List;
  initialItems: Item[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState(list.title);
  const [items, setItems] = useState(initialItems);
  const [copied, setCopied] = useState(false);
  const [newWho, setNewWho] = useState("");
  const [newWhat, setNewWhat] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  // Re-sync local state when the server gives us fresh data after a revalidate,
  // without the extra render pass a useEffect-based sync would cost.
  const [prevInitialItems, setPrevInitialItems] = useState(initialItems);
  if (prevInitialItems !== initialItems) {
    setPrevInitialItems(initialItems);
    setItems(initialItems);
  }
  const [prevTitleProp, setPrevTitleProp] = useState(list.title);
  if (prevTitleProp !== list.title) {
    setPrevTitleProp(list.title);
    setTitle(list.title);
  }

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const INDENT_DRAG_THRESHOLD = 40;

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over, delta } = event;
    if (!over) return;

    const draggedItem = items.find((i) => i.id === active.id);
    if (!draggedItem) return;

    let indent = draggedItem.indent;
    if (delta.x > INDENT_DRAG_THRESHOLD) indent = true;
    else if (delta.x < -INDENT_DRAG_THRESHOLD) indent = false;

    let reordered = items;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      reordered = arrayMove(items, oldIndex, newIndex);
    }

    if (indent !== draggedItem.indent || reordered !== items) {
      setItems(
        reordered.map((i) => (i.id === active.id ? { ...i, indent } : i)),
      );
    }

    if (active.id !== over.id) {
      await reorderItems(list.id, reordered.map((i) => i.id));
    }
    if (indent !== draggedItem.indent) {
      await updateItem(list.id, active.id as string, { indent });
    }
  }

  function patchItemLocally(id: string, patch: Partial<Item>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newWhat.trim() && !newWho.trim()) return;
    await createItem(list.id, {
      who: newWho,
      what: newWhat,
      when_date: newDate || null,
      when_time: newTime || null,
    });
    setNewWho("");
    setNewWhat("");
    setNewDate("");
    setNewTime("");
    router.refresh();
  }

  const completedCount = items.filter((i) => i.completed).length;

  async function handleDeleteCompleted() {
    const noun = completedCount === 1 ? "item" : "items";
    if (!confirm(`Delete ${completedCount} completed ${noun}? This cannot be undone.`)) return;
    setItems((prev) => prev.filter((i) => !i.completed));
    await deleteCompletedItems(list.id);
  }

  async function copyPublicLink() {
    const url = `${window.location.origin}/p/${list.id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => title.trim() && title !== list.title && updateListTitle(list.id, title)}
          className="w-full border-b border-transparent bg-transparent text-2xl font-semibold tracking-tight outline-none hover:border-zinc-200 focus:border-zinc-400"
        />
        <div className="no-print flex flex-wrap items-center gap-3 text-sm text-zinc-500">
          <button onClick={() => window.print()} className="hover:text-zinc-900 hover:underline">
            Print
          </button>
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
          <ListColorPicker value={list.color} onChange={(c) => setListColor(list.id, c)} />
          {list.is_public && (
            <button onClick={copyPublicLink} className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100">
              {copied ? "Link copied!" : "Copy public link"}
            </button>
          )}
          {completedCount > 0 && (
            <button onClick={handleDeleteCompleted} className="hover:text-zinc-900 hover:underline">
              Delete completed ({completedCount})
            </button>
          )}
          <button
            onClick={() => {
              if (confirm(`Delete "${list.title}"? This cannot be undone.`)) {
                deleteList(list.id);
                router.push("/lists");
              }
            }}
            className="text-red-500 hover:text-red-700 hover:underline"
          >
            Delete list
          </button>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <SortableItemRow
                key={item.id}
                item={item}
                onChange={(patch) => {
                  patchItemLocally(item.id, patch);
                  updateItem(list.id, item.id, patch);
                }}
                onDelete={() => {
                  setItems((prev) => prev.filter((i) => i.id !== item.id));
                  deleteItem(list.id, item.id);
                }}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {items.length === 0 && (
        <p className="text-center text-zinc-500">No items yet — add one below.</p>
      )}

      <form onSubmit={handleAddItem} className="no-print grid grid-cols-1 gap-2 rounded-md border border-dashed border-zinc-300 p-3 sm:grid-cols-[1fr_2fr_auto_auto_auto]">
        <input
          value={newWho}
          onChange={(e) => setNewWho(e.target.value)}
          placeholder="Who"
          className="rounded border border-zinc-300 px-2 py-1 outline-none focus:border-zinc-500"
        />
        <input
          value={newWhat}
          onChange={(e) => setNewWhat(e.target.value)}
          placeholder="What"
          className="rounded border border-zinc-300 px-2 py-1 outline-none focus:border-zinc-500"
        />
        <DateInput
          value={newDate}
          onChange={setNewDate}
          className="rounded border border-zinc-300 px-2 py-1 outline-none focus:border-zinc-500"
        />
        <input
          type="time"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          className="rounded border border-zinc-300 px-2 py-1 outline-none focus:border-zinc-500"
        />
        <button type="submit" className="rounded bg-zinc-900 px-3 py-1 font-medium text-white hover:bg-zinc-700">
          Add
        </button>
      </form>
    </div>
  );
}
