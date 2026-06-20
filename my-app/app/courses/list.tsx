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

// Délai long-press avant d'activer le drag sur mobile (ms)
const LONG_PRESS_DELAY = 400;

export const List = ({ courses: initialCourses, activeCourseId }: Props) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // ── État local ────────────────────────────────────────────────
  const [ordered, setOrdered] = useState<Course[]>(initialCourses);
  const [search, setSearch] = useState("");
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  // ── Refs touch ────────────────────────────────────────────────
  const touchDraggingId = useRef<number | null>(null);
  const touchClone = useRef<HTMLElement | null>(null);
  const touchOffsetX = useRef(0);
  const touchOffsetY = useRef(0);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Position initiale du doigt pour détecter si c'est un tap ou un glissement
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  // Indique si le long-press a été validé (drag actif)
  const isDragActive = useRef(false);
  // Ref vers l'élément touché pour créer le clone au bon moment
  const touchTargetEl = useRef<HTMLElement | null>(null);
  const touchStartId = useRef<number | null>(null);

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

  // ── Réordonnancement partagé ──────────────────────────────────
  const reorder = useCallback((fromId: number, toId: number) => {
    if (fromId === toId) return;
    setOrdered((prev) => {
      const next = [...prev];
      const fromIdx = next.findIndex((c) => c.id === fromId);
      const toIdx = next.findIndex((c) => c.id === toId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  }, []);

  // ── Drag & Drop Desktop ───────────────────────────────────────
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

  const cancelLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const cleanupTouchDrag = useCallback(() => {
    if (touchClone.current) {
      touchClone.current.remove();
      touchClone.current = null;
    }
    isDragActive.current = false;
    touchDraggingId.current = null;
    touchTargetEl.current = null;
    touchStartId.current = null;
    setDraggingId(null);
    setDragOverId(null);
  }, []);

  // ── Activer le drag après long-press ─────────────────────────
  const activateDrag = useCallback((id: number, el: HTMLElement, clientX: number, clientY: number) => {
    const rect = el.getBoundingClientRect();
    touchDraggingId.current = id;
    touchOffsetX.current = clientX - rect.left;
    touchOffsetY.current = clientY - rect.top;
    isDragActive.current = true;

    // Vibration haptique si disponible
    if (navigator.vibrate) navigator.vibrate(40);

    // Créer le clone fantôme
    const clone = el.cloneNode(true) as HTMLElement;
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
      transition: transform 0.15s;
    `;
    document.body.appendChild(clone);
    touchClone.current = clone;

    setDraggingId(id);
  }, []);

  // ── Handlers touch ────────────────────────────────────────────
  const handleTouchStart = useCallback(
    (e: React.TouchEvent, id: number) => {
      if (pending || isSearching) return;

      const touch = e.touches[0];
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
      touchStartId.current = id;
      touchTargetEl.current = e.currentTarget as HTMLElement;
      isDragActive.current = false;

      // Démarrer le timer long-press
      longPressTimer.current = setTimeout(() => {
        if (touchTargetEl.current && touchStartId.current !== null) {
          activateDrag(
            touchStartId.current,
            touchTargetEl.current,
            touchStartX.current,
            touchStartY.current
          );
        }
      }, LONG_PRESS_DELAY);
    },
    [pending, isSearching, activateDrag]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      const dx = touch.clientX - touchStartX.current;
      const dy = touch.clientY - touchStartY.current;
      const moved = Math.sqrt(dx * dx + dy * dy);

      // Si le doigt bouge trop avant le long-press → annuler (c'est un scroll)
      if (!isDragActive.current) {
        if (moved > 8) cancelLongPress();
        return;
      }

      // Drag actif → bloquer le scroll
      e.preventDefault();

      if (!touchClone.current || touchDraggingId.current === null) return;

      // Déplacer le clone
      touchClone.current.style.left = `${touch.clientX - touchOffsetX.current}px`;
      touchClone.current.style.top = `${touch.clientY - touchOffsetY.current}px`;

      // Détecter la carte sous le doigt
      const overId = getCardIdAtPoint(touch.clientX, touch.clientY);
      if (overId !== null && overId !== touchDraggingId.current) {
        setDragOverId(overId);
      } else {
        setDragOverId(null);
      }
    },
    [cancelLongPress, getCardIdAtPoint]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      cancelLongPress();

      if (!isDragActive.current) {
        // Simple tap → laisser le onClick de Card s'exécuter normalement
        cleanupTouchDrag();
        return;
      }

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
    [cancelLongPress, cleanupTouchDrag, getCardIdAtPoint, reorder]
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
          Maintiens une carte pour la déplacer
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
                  draggable={!pending && !isSearching}
                  onDragStart={() => handleDragStart(course.id)}
                  onDragOver={(e) => handleDragOver(e, course.id)}
                  onDrop={() => handleDrop(course.id)}
                  onDragEnd={handleDragEnd}
                  onTouchStart={(e) => handleTouchStart(e, course.id)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className={cn(
                    "relative opacity-0 animate-fade-in-up rounded-xl transition-all duration-200",
                    isDragging && "opacity-30 scale-95",
                    isDragOver && "scale-105 -translate-y-1 ring-2 ring-sky-400 ring-offset-2"
                  )}
                  style={{
                    animationDelay: `${index * 80}ms`,
                    animationFillMode: "forwards",
                    // touchAction auto → le scroll fonctionne normalement
                    // il sera bloqué via e.preventDefault() seulement quand drag actif
                    touchAction: "auto",
                  }}
                >
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