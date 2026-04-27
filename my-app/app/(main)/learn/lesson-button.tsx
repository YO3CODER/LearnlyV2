"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Crown, Star } from "lucide-react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import "react-circular-progressbar/dist/styles.css";

type Props = {
  id: number;
  index: number;
  totalCount: number;
  locked?: boolean;
  current?: boolean;
  percentage: number;
  unitColor: string;
  isLastLesson: boolean;
  unitId: number;
};

const colorMap: Record<string, {
  bg: string;
  hover: string;
  border: string;
  shadow: string;
  glow: string;
  progress: string[];
}> = {
  blue:   { bg: "!bg-blue-500",   hover: "hover:!bg-blue-600",   border: "!border-b-blue-700",   shadow: "shadow-blue-200",   glow: "bg-blue-300/40",   progress: ["#3b82f6", "#6366f1"] },
  purple: { bg: "!bg-purple-500", hover: "hover:!bg-purple-600", border: "!border-b-purple-700", shadow: "shadow-purple-200", glow: "bg-purple-300/40", progress: ["#a855f7", "#8b5cf6"] },
  green:  { bg: "!bg-green-500",  hover: "hover:!bg-green-600",  border: "!border-b-green-700",  shadow: "shadow-green-200",  glow: "bg-green-300/40",  progress: ["#22c55e", "#16a34a"] },
  orange: { bg: "!bg-orange-500", hover: "hover:!bg-orange-600", border: "!border-b-orange-700", shadow: "shadow-orange-200", glow: "bg-orange-300/40", progress: ["#f97316", "#ea580c"] },
  pink:   { bg: "!bg-pink-500",   hover: "hover:!bg-pink-600",   border: "!border-b-pink-700",   shadow: "shadow-pink-200",   glow: "bg-pink-300/40",   progress: ["#ec4899", "#db2777"] },
  indigo: { bg: "!bg-indigo-500", hover: "hover:!bg-indigo-600", border: "!border-b-indigo-700", shadow: "shadow-indigo-200", glow: "bg-indigo-300/40", progress: ["#6366f1", "#4f46e5"] },
  teal:   { bg: "!bg-teal-500",   hover: "hover:!bg-teal-600",   border: "!border-b-teal-700",   shadow: "shadow-teal-200",   glow: "bg-teal-300/40",   progress: ["#14b8a6", "#0d9488"] },
  red:    { bg: "!bg-red-500",    hover: "hover:!bg-red-600",    border: "!border-b-red-700",    shadow: "shadow-red-200",    glow: "bg-red-300/40",    progress: ["#ef4444", "#dc2626"] },
};

export const LessonButton = ({
  id,
  index,
  totalCount,
  locked,
  current,
  percentage,
  unitColor,
  isLastLesson,
  unitId,
}: Props) => {
  const cycleLength = 8;
  const cycleIndex = index % cycleLength;

  let indentationLevel;
  if (cycleIndex <= 2) indentationLevel = cycleIndex;
  else if (cycleIndex <= 4) indentationLevel = 4 - cycleIndex;
  else if (cycleIndex <= 6) indentationLevel = 4 - cycleIndex;
  else indentationLevel = cycleIndex - 8;

  const rightPosition = indentationLevel * 40;

  const isFirst = index === 0;
  const isCompleted = !current && !locked;
  const isPerfect = isCompleted && percentage === 100;
  const isGolden = isLastLesson;

  const Icon = isLastLesson ? Crown : isCompleted ? Check : Star;
  const href = isCompleted ? `/lesson/${id}` : "/lesson";

  const colors = colorMap[unitColor] || colorMap.blue;

  return (
    <Link
      href={href}
      aria-disabled={locked}
      style={{
        pointerEvents: locked ? "none" : "auto",
        animationDelay: `${index * 60}ms`,
        animationFillMode: "both",
      }}
      className="animate-in fade-in slide-in-from-bottom-4"
    >
      <div
        className="relative"
        style={{
          right: `${rightPosition}px`,
          marginTop: isFirst && !isCompleted ? 60 : 24,
        }}
      >
        {current ? (
          <div className="h-[102px] w-[102px] relative">

            {/* Badge COMMENCER en bas */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-10
              px-4 py-2 rounded-xl
              bg-white border-2 border-b-4 border-slate-200
              text-slate-700 text-xs font-extrabold uppercase tracking-widest
              shadow-lg whitespace-nowrap"
            >
              Start
            </div>

            <CircularProgressbarWithChildren
              value={Number.isNaN(percentage) ? 0 : percentage}
              styles={{
                path: { stroke: "url(#progressGradient)", strokeLinecap: "round" },
                trail: { stroke: "#e8e8f0" },
              }}
            >
              <svg style={{ height: 0, width: 0, position: "absolute" }}>
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={colors.progress[0]} />
                    <stop offset="100%" stopColor={colors.progress[1]} />
                  </linearGradient>
                </defs>
              </svg>

              <Button
                size="rounded"
                variant={locked ? "locked" : "secondary"}
                className={cn(
                  "h-[70px] w-[70px] border-b-[6px] transition-all duration-300 active:scale-95",
                  "relative overflow-hidden group",
                  !locked && `${colors.bg} ${colors.hover} ${colors.border} shadow-lg ${colors.shadow}`,
                )}
              >
                <div className="absolute inset-0 pointer-events-none rounded-full overflow-hidden">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-4 bg-white/30 rounded-full blur-sm" />
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/25 to-transparent rounded-t-full" />
                </div>
                <div className="absolute inset-0 pointer-events-none">
                  <span
                    className="absolute top-1 right-2 text-white/80 text-[8px] animate-[twinkle_3s_ease-in-out_infinite]"
                    style={{ animationDelay: `${index * 400}ms` }}
                  >✦</span>
                  <span
                    className="absolute bottom-2 left-1 text-white/60 text-[6px] animate-[twinkle_3s_ease-in-out_infinite]"
                    style={{ animationDelay: `${index * 400 + 500}ms` }}
                  >✦</span>
                </div>
                <Icon className="h-9 w-9 fill-white text-white relative z-10" />
              </Button>
            </CircularProgressbarWithChildren>
          </div>

        ) : (
          <div className="relative group">

            {/* Halo hover */}
            {!locked && (
              <div className={cn(
                "absolute inset-0 rounded-full blur-md scale-125 opacity-0 group-hover:opacity-100 transition-all duration-500",
                isGolden ? "bg-yellow-300/50" : colors.glow
              )} />
            )}

            {/* Badge Perfect */}
            {isPerfect && !isGolden && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10
                px-2 py-0.5 rounded-full
                bg-gradient-to-r from-yellow-400 to-amber-400
                text-white text-[9px] font-extrabold uppercase tracking-wider
                shadow-sm whitespace-nowrap"
              >
                ★ Perfect
              </div>
            )}

            <Button
              size="rounded"
              variant={locked ? "locked" : "secondary"}
              className={cn(
                "relative h-[70px] w-[70px] border-b-[6px] overflow-hidden transition-all duration-300",
                "hover:scale-110 hover:-translate-y-1 active:scale-95 active:translate-y-0",
                isGolden && !locked && "!bg-gradient-to-br !from-yellow-400 !to-amber-500 !border-b-amber-600 shadow-md shadow-amber-200",
                !isGolden && !locked && `${colors.bg} ${colors.hover} ${colors.border} shadow-md ${colors.shadow}`,
                locked && "opacity-60",
              )}
            >
              {!locked && (
                <div className="absolute inset-0 pointer-events-none rounded-full overflow-hidden">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-4 bg-white/30 rounded-full blur-sm" />
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/25 to-transparent rounded-t-full" />
                </div>
              )}
              {!locked && (
                <div className="absolute inset-0 pointer-events-none">
                  <span
                    className="absolute top-1 right-2 text-white/80 text-[8px] animate-[twinkle_3s_ease-in-out_infinite]"
                    style={{ animationDelay: `${index * 400}ms` }}
                  >✦</span>
                  <span
                    className="absolute bottom-2 left-1 text-white/60 text-[6px] animate-[twinkle_3s_ease-in-out_infinite]"
                    style={{ animationDelay: `${index * 400 + 500}ms` }}
                  >✦</span>
                  <span
                    className="absolute top-2 left-2 text-white/50 text-[5px] animate-[twinkle_3s_ease-in-out_infinite]"
                    style={{ animationDelay: `${index * 400 + 1000}ms` }}
                  >✧</span>
                </div>
              )}
              <Icon
                className={cn(
                  "h-9 w-9 relative z-10 transition-transform duration-300 group-hover:scale-110",
                  locked
                    ? "fill-neutral-300 text-neutral-300 stroke-neutral-300"
                    : "fill-white text-white drop-shadow-sm",
                  isCompleted && !isGolden && "fill-none stroke-white stroke-[4]",
                )}
              />
            </Button>
          </div>
        )}
      </div>
    </Link>
  );
};