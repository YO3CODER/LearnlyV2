"use client";

import { toast } from "sonner";
import { useTransition, useState, useCallback, useRef } from "react";
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
  const STORAGE_KEY = "learnly:courses-order";

  const getInitialOrder = (): Course[] => {
    if (typeof window === "undefined") return initialCourses;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return initialCourses;
      const savedIds: number[] = JSON.parse(raw);
      const byId = new Map(initialCourses.map((c) => [c.id, c]));
      const restored: Course[] = [];
      savedIds.forEach((id) => {
        const c = byId.get(id);
        if (c) {
          restored.push(c);
          byId.delete(id);
        }
      });
      // Ajoute les nouveaux cours (absents du localStorage) à la fin
      byId.forEach((c) => restored.push(c));
      return restored.length === initialCourses.length ? restored : initialCourses;
    } catch {
      return initialCourses;
    }
  };

  const [ordered, setOrdered] = useState<Course[]>(getInitialOrder);
  const [search, setSearch] = useState("");
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  // ── Refs touch (drag via grip uniquement) ─────────────────────
  const touchDraggingId = useRef<number | null>(null);
  const touchClone = useRef<HTMLElement | null>(null);
  const touchOffsetX = useRef(0);
  const touchOffsetY = useRef(0);
  // true uniquement si le touch a commencé sur le grip
  const gripTouchActive = useRef(false);

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

  // ── Réordonnancement ──────────────────────────────────────────
  const reorder = useCallback((fromId: number, toId: number) => {
    if (fromId === toId) return;
    setOrdered((prev) => {
      const next = [...prev];
      const fromIdx = next.findIndex((c) => c.id === fromId);
      const toIdx = next.findIndex((c) => c.id === toId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(next.map((c) => c.id))
        );
      } catch {
        // localStorage indisponible (mode privé, quota...) → on ignore silencieusement
      }
      return next;
    });
  }, []);

  // ── Drag & Drop Desktop ───────────────────────────────────────
  // Le draggable est sur le grip uniquement via onMouseDown qui le set
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
      if (draggingId === null) return;
      reorder(draggingId, targetId);
      setDraggingId(null);
      setDragOverId(null);
    },
    [draggingId, reorder]
  );

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    setDragOverId(null);
  }, []);

  // ── Helpers touch ─────────────────────────────────────────────
  const getCardIdAtPoint = useCallback((x: number, y: number): number | null => {
    if (touchClone.current) touchClone.current.style.display = "none";
    const el = document.elementFromPoint(x, y);
    if (touchClone.current) touchClone.current.style.display = "";
    if (!el) return null;
    const card = el.closest("[data-card-id]") as HTMLElement | null;
    return card ? parseInt(card.dataset.cardId!, 10) : null;
  }, []);

  const cleanupTouchDrag = useCallback(() => {
    if (touchClone.current) {
      touchClone.current.remove();
      touchClone.current = null;
    }
    gripTouchActive.current = false;
    touchDraggingId.current = null;
    setDraggingId(null);
    setDragOverId(null);
  }, []);

  // ── Touch sur le grip : démarre le drag immédiatement ────────
  const handleGripTouchStart = useCallback(
    (e: React.TouchEvent, id: number, cardEl: HTMLElement) => {
      if (pending || isSearching) return;
      e.stopPropagation(); // ne pas remonter vers la carte

      const touch = e.touches[0];
      const rect = cardEl.getBoundingClientRect();

      gripTouchActive.current = true;
      touchDraggingId.current = id;
      touchOffsetX.current = touch.clientX - rect.left;
      touchOffsetY.current = touch.clientY - rect.top;

      // Vibration haptique
      if (navigator.vibrate) navigator.vibrate(30);

      // Clone fantôme
      const clone = cardEl.cloneNode(true) as HTMLElement;
      clone.style.cssText = `
        position: fixed;
        top: ${rect.top}px;
        left: ${rect.left}px;
        width: ${rect.width}px;
        height: ${rect.height}px;
        opacity: 0.88;
        pointer-events: none;
        z-index: 9999;
        transform: scale(1.06) rotate(2deg);
        border-radius: 12px;
        box-shadow: 0 20px 48px rgba(0,0,0,0.22);
      `;
      document.body.appendChild(clone);
      touchClone.current = clone;

      setDraggingId(id);
    },
    [pending, isSearching]
  );

  // ── Touch move / end sur le wrapper (actif seulement si grip) ─
  const handleWrapperTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!gripTouchActive.current || !touchClone.current) return;
      e.preventDefault();

      const touch = e.touches[0];
      touchClone.current.style.left = `${touch.clientX - touchOffsetX.current}px`;
      touchClone.current.style.top = `${touch.clientY - touchOffsetY.current}px`;

      const overId = getCardIdAtPoint(touch.clientX, touch.clientY);
      if (overId !== null && overId !== touchDraggingId.current) {
        setDragOverId(overId);
      } else {
        setDragOverId(null);
      }
    },
    [getCardIdAtPoint]
  );

  const handleWrapperTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!gripTouchActive.current) return;

      const touch = e.changedTouches[0];
      const overId = getCardIdAtPoint(touch.clientX, touch.clientY);

      if (
        touchDraggingId.current !== null &&
        overId !== null &&
        overId !== touchDraggingId.current
      ) {
        reorder(touchDraggingId.current, overId);
      }

      cleanupTouchDrag();
    },
    [getCardIdAtPoint, reorder, cleanupTouchDrag]
  );

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
            "w-full pl-9 pr-9 py-2.5 rounded-xl text-base sm:text-sm",
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

      {/* Hint */}
      {!isSearching && (
        <p className="text-xs text-muted-foreground flex items-center gap-1.5 select-none">
          <GripVertical className="h-3.5 w-3.5 shrink-0" />
          Glisse l'icône <GripVertical className="inline h-3 w-3 mx-0.5" /> pour réorganiser
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
                  data-card-id={course.id}
                  // desktop : drag activé par onMouseDown sur le grip (draggable mis à true depuis le grip)
                  draggable={false}
                  onDragStart={() => handleDragStart(course.id)}
                  onDragOver={(e) => handleDragOver(e, course.id)}
                  onDrop={() => handleDrop(course.id)}
                  onDragEnd={handleDragEnd}
                  // mobile : move/end gérés ici, mais start uniquement depuis le grip
                  onTouchMove={handleWrapperTouchMove}
                  onTouchEnd={handleWrapperTouchEnd}
                  className={cn(
                    "relative opacity-0 animate-fade-in-up rounded-xl transition-all duration-200",
                    isDragging && "opacity-30 scale-95",
                    isDragOver && "scale-105 -translate-y-1 ring-2 ring-sky-400 ring-offset-2"
                  )}
                  style={{
                    animationDelay: `${index * 80}ms`,
                    animationFillMode: "forwards",
                    touchAction: "auto",
                  }}
                >
                  {/* ── Grip handle (placé à GAUCHE pour ne pas chevaucher le check actif à droite) ── */}
                  {!isSearching && (
                    <div
                      data-grip
                      title="Déplacer ce cours"
                      // Desktop : rend le wrapper draggable le temps du drag
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        const wrapper = (e.currentTarget as HTMLElement).closest("[data-card-id]") as HTMLElement;
                        if (wrapper) wrapper.draggable = true;
                      }}
                      onMouseUp={(e) => {
                        const wrapper = (e.currentTarget as HTMLElement).closest("[data-card-id]") as HTMLElement;
                        if (wrapper) wrapper.draggable = false;
                      }}
                      // Mobile : démarre le drag immédiatement depuis le grip
                      onTouchStart={(e) => {
                        const wrapper = (e.currentTarget as HTMLElement).closest("[data-card-id]") as HTMLElement;
                        if (wrapper) handleGripTouchStart(e, course.id, wrapper);
                      }}
                      className={cn(
                        "absolute top-2 left-2 z-20",
                        "flex items-center justify-center",
                        "w-6 h-6 rounded-md",
                        "bg-black/5 dark:bg-white/10",
                        "hover:bg-black/15 dark:hover:bg-white/20",
                        "active:bg-sky-100 dark:active:bg-sky-900/40",
                        "transition-colors duration-150",
                        "cursor-grab active:cursor-grabbing",
                        "touch-none select-none"
                      )}
                    >
                      <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                  )}

                  {/* Indicateur drop */}
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

          {isSearching && (
            <p className="text-xs text-muted-foreground text-right">
              {filtered.length} cours trouvé{filtered.length > 1 ? "s" : ""}
            </p>
          )}
        </>
      ) : (
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