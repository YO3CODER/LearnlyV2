"use client";

import Image from "next/image";
import { Check, Search, GripVertical, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Course = {
  title: string;
  id: number;
  imageSrc: string;
  disabled?: boolean;
  active?: boolean;
};

type CardProps = Course & {
  onClick: (id: number) => void;
  isDragging: boolean;
  isDragOver: boolean;
  onDragStart: (id: number) => void;
  onDragOver: (e: React.DragEvent, id: number) => void;
  onDrop: (id: number) => void;
  onDragEnd: () => void;
};

// ─── Constants ───────────────────────────────────────────────────────────────

const BORDER_COLORS = [
  "border-sky-400 border-b-sky-600",
  "border-violet-400 border-b-violet-600",
  "border-emerald-400 border-b-emerald-600",
  "border-rose-400 border-b-rose-600",
  "border-amber-400 border-b-amber-600",
  "border-pink-400 border-b-pink-600",
];

// ─── Card ─────────────────────────────────────────────────────────────────────

const Card = ({
  title,
  id,
  imageSrc,
  disabled,
  onClick,
  active,
  isDragging,
  isDragOver,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: CardProps) => {
  const borderColor = BORDER_COLORS[id % BORDER_COLORS.length];

  return (
    <div
      draggable={!disabled}
      onDragStart={() => onDragStart(id)}
      onDragOver={(e) => onDragOver(e, id)}
      onDrop={() => onDrop(id)}
      onDragEnd={onDragEnd}
      onClick={() => !disabled && onClick(id)}
      className={cn(
        "relative rounded-xl cursor-grab active:cursor-grabbing p-[3px] select-none",
        "hover:scale-105 hover:-translate-y-1 transition-all duration-200",
        disabled && "pointer-events-none opacity-50",
        isDragging && "opacity-40 scale-95 rotate-2",
        isDragOver && "scale-105 -translate-y-2 ring-2 ring-sky-400 ring-offset-2 rounded-xl"
      )}
      style={
        active
          ? {
              background:
                "conic-gradient(from var(--angle), #38bdf8, #a78bfa, #34d399, #fb7185, #fbbf24, #38bdf8)",
              animation: "spin-border 2s linear infinite",
            }
          : undefined
      }
    >
      {/* Drag handle badge */}
      {!disabled && (
        <div className="absolute top-1 left-1 z-10 opacity-0 group-hover:opacity-100 rounded bg-black/10 p-0.5 pointer-events-none">
          <GripVertical className="h-3 w-3 text-muted-foreground" />
        </div>
      )}

      {/* Carte intérieure */}
      <div
        className={cn(
          "relative h-full border-2 rounded-[10px] border-b-4 flex flex-col items-center justify-between p-2 pb-4 min-h-[150px] min-w-0 bg-card",
          "active:border-b-2 active:translate-y-0",
          !active && borderColor,
          active && "border-transparent"
        )}
      >
        <div className="min-h-[20px] w-full flex items-center justify-between">
          {/* Grip icon visible */}
          <GripVertical className="h-3 w-3 text-muted-foreground/40" />
          {active && (
            <div className="rounded-md bg-green-500 flex items-center justify-center p-1 shadow-md">
              <Check className="text-white stroke-[4] h-3 w-3" />
            </div>
          )}
        </div>

        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={title}
          height={50}
          width={60}
          className={cn(
            "rounded-lg drop-shadow-md border border-border object-cover transition-transform duration-200",
            active && "scale-110"
          )}
        />
        <p className="text-foreground text-center font-bold mt-2 text-sm">
          {title}
        </p>
      </div>

      {/* Drop indicator overlay */}
      {isDragOver && (
        <div className="absolute inset-0 rounded-xl border-2 border-dashed border-sky-400 bg-sky-400/10 pointer-events-none" />
      )}
    </div>
  );
};

// ─── CoursesGrid ──────────────────────────────────────────────────────────────

type CoursesGridProps = {
  initialCourses: Course[];
  onCourseClick?: (id: number) => void;
  onOrderChange?: (orderedIds: number[]) => void;
};

export const CoursesGrid = ({
  initialCourses,
  onCourseClick,
  onOrderChange,
}: CoursesGridProps) => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [search, setSearch] = useState("");
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  // ── Search filter (only on visible list, doesn't affect order) ──
  const filtered = search.trim()
    ? courses.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
      )
    : courses;

  const isSearching = search.trim().length > 0;

  // ── Drag handlers ──────────────────────────────────────────────
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

      setCourses((prev) => {
        const next = [...prev];
        const fromIdx = next.findIndex((c) => c.id === draggingId);
        const toIdx = next.findIndex((c) => c.id === targetId);
        if (fromIdx === -1 || toIdx === -1) return prev;
        const [moved] = next.splice(fromIdx, 1);
        next.splice(toIdx, 0, moved);
        onOrderChange?.(next.map((c) => c.id));
        return next;
      });

      setDraggingId(null);
      setDragOverId(null);
    },
    [draggingId, onOrderChange]
  );

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    setDragOverId(null);
  }, []);

  const handleClick = useCallback(
    (id: number) => {
      onCourseClick?.(id);
    },
    [onCourseClick]
  );

  return (
    <div className="w-full space-y-4">
      {/* ── Barre de recherche ── */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un cours…"
          className={cn(
            "w-full pl-9 pr-9 py-2.5 rounded-xl text-sm bg-card border border-border",
            "text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-400",
            "transition-all duration-200"
          )}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ── Hint drag (masqué en mode recherche) ── */}
      {!isSearching && (
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <GripVertical className="h-3.5 w-3.5 shrink-0" />
          Glissez les cartes pour réorganiser les cours
        </p>
      )}

      {/* ── Grille ── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 group">
          {filtered.map((course) => (
            <Card
              key={course.id}
              {...course}
              onClick={handleClick}
              isDragging={draggingId === course.id}
              isDragOver={!isSearching && dragOverId === course.id}
              onDragStart={isSearching ? () => {} : handleDragStart}
              onDragOver={isSearching ? (e) => e.preventDefault() : handleDragOver}
              onDrop={isSearching ? () => {} : handleDrop}
              onDragEnd={handleDragEnd}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
          <Search className="h-8 w-8 opacity-30" />
          <p className="text-sm font-medium">Aucun cours trouvé pour « {search} »</p>
          <button
            onClick={() => setSearch("")}
            className="text-xs text-sky-500 hover:underline"
          >
            Effacer la recherche
          </button>
        </div>
      )}

      {/* ── Compteur résultats ── */}
      {isSearching && filtered.length > 0 && (
        <p className="text-xs text-muted-foreground text-right">
          {filtered.length} cours trouvé{filtered.length > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
};

export { Card };