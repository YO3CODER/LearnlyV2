"use client";

import { toast } from "sonner";
import { useTransition, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

import { courses, userProgress } from "@/db/schema";
import { upsertUserProgress } from "@/actions/user-progress";

import { Card } from "./card";

type Course = typeof courses.$inferSelect;

type Props = {
  courses: Course[];
  activeCourseId?: typeof userProgress.$inferSelect.activeCourseId;
};

export const List = ({ courses: initialCourses, activeCourseId }: Props) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // ── État local ────────────────────────────────────────────────
  const [ordered, setOrdered] = useState<Course[]>(initialCourses);
  const [search, setSearch] = useState("");
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  // ── Recherche ─────────────────────────────────────────────────
  const isSearching = search.trim().length > 0;
  const filtered = isSearching
    ? ordered.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
      )
    : ordered;

  // ── Click cours ───────────────────────────────────────────────
  const onClick = useCallback(
    (id: number) => {
      if (pending) return;
      if (id === activeCourseId) return router.push("/learn");
      startTransition(() => {
        upsertUserProgress(id).catch(() => toast.error("Something went wrong."));
      });
    },
    [pending, activeCourseId, router]
  );

  // ── Drag & Drop ───────────────────────────────────────────────
  const handleDragStart = useCallback((id: number) => {
    setDraggingId(id);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, id: number) => {
      e.preventDefault();
      if (id !== draggingId) setDragOverId(id);
    },
    [draggingId]
  );

  const handleDrop = useCallback(
    (targetId: number) => {
      if (draggingId === null || draggingId === targetId) return;
      setOrdered((prev) => {
        const next = [...prev];
        const fromIdx = next.findIndex((c) => c.id === draggingId);
        const toIdx = next.findIndex((c) => c.id === targetId);
        if (fromIdx === -1 || toIdx === -1) return prev;
        const [moved] = next.splice(fromIdx, 1);
        next.splice(toIdx, 0, moved);
        return next;
      });
      setDraggingId(null);
      setDragOverId(null);
    },
    [draggingId]
  );

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    setDragOverId(null);
  }, []);

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="pt-6 space-y-4">
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un cours…"
          className={cn(
            "w-full pl-9 pr-9 py-2.5 rounded-xl text-sm",
            "bg-white dark:bg-card",
            "border border-gray-200 dark:border-border",
            "text-gray-800 dark:text-foreground",
            "placeholder:text-gray-400 dark:placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-400",
            "transition-all duration-200 shadow-sm"
          )}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Hint drag */}
      {!isSearching && (
        <p className="text-xs text-muted-foreground flex items-center gap-1.5 select-none">
          <GripVertical className="h-3.5 w-3.5 shrink-0" />
          Glisse les cartes pour réorganiser
        </p>
      )}

      {/* Grille */}
      {filtered.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((course, index) => {
              const isDragging = draggingId === course.id;
              const isDragOver = !isSearching && dragOverId === course.id;

              return (
                <div
                  key={course.id}
                  draggable={!pending && !isSearching}
                  onDragStart={() => handleDragStart(course.id)}
                  onDragOver={(e) => handleDragOver(e, course.id)}
                  onDrop={() => handleDrop(course.id)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    "opacity-0 animate-fade-in-up rounded-xl transition-all duration-200",
                    isDragging && "opacity-40 scale-95 rotate-1",
                    isDragOver &&
                      "scale-105 -translate-y-1 ring-2 ring-sky-400 ring-offset-2"
                  )}
                  style={{
                    animationDelay: `${index * 80}ms`,
                    animationFillMode: "forwards",
                    cursor: isSearching ? "default" : "grab",
                  }}
                >
                  {/* Indicateur de survol drag */}
                  {isDragOver && (
                    <div className="absolute inset-0 z-10 rounded-xl border-2 border-dashed border-sky-400 bg-sky-400/10 pointer-events-none" />
                  )}

                  <Card
                    id={course.id}
                    title={course.title}
                    imageSrc={course.imageSrc || "/placeholder.svg"}
                    onClick={onClick}
                    disabled={pending}
                    active={course.id === activeCourseId}
                  />
                </div>
              );
            })}
          </div>

          {/* Compteur résultats recherche */}
          {isSearching && (
            <p className="text-xs text-muted-foreground text-right">
              {filtered.length} cours trouvé{filtered.length > 1 ? "s" : ""}
            </p>
          )}
        </>
      ) : (
        /* État vide */
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
          <Search className="h-10 w-10 opacity-25" />
          <p className="text-sm font-medium text-gray-500 dark:text-muted-foreground">
            Aucun cours pour «{" "}
            <span className="text-sky-400 font-semibold">{search}</span> »
          </p>
          <button
            onClick={() => setSearch("")}
            className="text-xs text-sky-500 hover:underline underline-offset-2"
          >
            Effacer la recherche
          </button>
        </div>
      )}
    </div>
  );
};