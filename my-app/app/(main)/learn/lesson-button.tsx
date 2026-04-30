"use client";

import { Check, Crown, Star, X } from "lucide-react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

import { cn } from "@/lib/utils";
import { usePracticeModal } from "@/store/use-practice-modal";

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
  title?: string;
  lessonChallengeCount?: number; // 👈 nombre de challenges dans la leçon
};

const colorMap: Record<string, {
  bg: string;
  hover: string;
  bgHex: string;
  borderHex: string;
  shadow: string;
  glow: string;
  progress: string[];
  popup: string;
  popupBorder: string;
  popupArrow: string;
  popupButtonBorder: string;
  popupButton: string;
  popupButtonText: string;
}> = {
  blue: { bg: "!bg-blue-500", hover: "hover:!bg-blue-600", bgHex: "#3b82f6", borderHex: "#1d4ed8", shadow: "shadow-blue-200 dark:shadow-blue-900", glow: "bg-blue-300/40", progress: ["#3b82f6", "#6366f1"], popup: "bg-blue-500", popupBorder: "border-blue-600", popupArrow: "#3b82f6", popupButtonBorder: "#1d4ed8", popupButton: "bg-white", popupButtonText: "text-blue-500" },
  purple: { bg: "!bg-purple-500", hover: "hover:!bg-purple-600", bgHex: "#a855f7", borderHex: "#7e22ce", shadow: "shadow-purple-200 dark:shadow-purple-900", glow: "bg-purple-300/40", progress: ["#a855f7", "#8b5cf6"], popup: "bg-purple-500", popupBorder: "border-purple-600", popupArrow: "#a855f7", popupButtonBorder: "#7e22ce", popupButton: "bg-white", popupButtonText: "text-purple-500" },
  green: { bg: "!bg-green-500", hover: "hover:!bg-green-600", bgHex: "#22c55e", borderHex: "#15803d", shadow: "shadow-green-200 dark:shadow-green-900", glow: "bg-green-300/40", progress: ["#22c55e", "#16a34a"], popup: "bg-green-500", popupBorder: "border-green-600", popupArrow: "#22c55e", popupButtonBorder: "#15803d", popupButton: "bg-white", popupButtonText: "text-green-600" },
  orange: { bg: "!bg-orange-500", hover: "hover:!bg-orange-600", bgHex: "#f97316", borderHex: "#c2410c", shadow: "shadow-orange-200 dark:shadow-orange-900", glow: "bg-orange-300/40", progress: ["#f97316", "#ea580c"], popup: "bg-orange-500", popupBorder: "border-orange-600", popupArrow: "#f97316", popupButtonBorder: "#c2410c", popupButton: "bg-white", popupButtonText: "text-orange-500" },
  pink: { bg: "!bg-pink-500", hover: "hover:!bg-pink-600", bgHex: "#ec4899", borderHex: "#be185d", shadow: "shadow-pink-200 dark:shadow-pink-900", glow: "bg-pink-300/40", progress: ["#ec4899", "#db2777"], popup: "bg-pink-500", popupBorder: "border-pink-600", popupArrow: "#ec4899", popupButtonBorder: "#be185d", popupButton: "bg-white", popupButtonText: "text-pink-500" },
  indigo: { bg: "!bg-indigo-500", hover: "hover:!bg-indigo-600", bgHex: "#6366f1", borderHex: "#4338ca", shadow: "shadow-indigo-200 dark:shadow-indigo-900", glow: "bg-indigo-300/40", progress: ["#6366f1", "#4f46e5"], popup: "bg-indigo-500", popupBorder: "border-indigo-600", popupArrow: "#6366f1", popupButtonBorder: "#4338ca", popupButton: "bg-white", popupButtonText: "text-indigo-500" },
  teal: { bg: "!bg-teal-500", hover: "hover:!bg-teal-600", bgHex: "#14b8a6", borderHex: "#0f766e", shadow: "shadow-teal-200 dark:shadow-teal-900", glow: "bg-teal-300/40", progress: ["#14b8a6", "#0d9488"], popup: "bg-teal-500", popupBorder: "border-teal-600", popupArrow: "#14b8a6", popupButtonBorder: "#0f766e", popupButton: "bg-white", popupButtonText: "text-teal-500" },
  red: { bg: "!bg-red-500", hover: "hover:!bg-red-600", bgHex: "#ef4444", borderHex: "#b91c1c", shadow: "shadow-red-200 dark:shadow-red-900", glow: "bg-red-300/40", progress: ["#ef4444", "#dc2626"], popup: "bg-red-500", popupBorder: "border-red-600", popupArrow: "#ef4444", popupButtonBorder: "#b91c1c", popupButton: "bg-white", popupButtonText: "text-red-500" },
};

const XP_PER_CHALLENGE = 10;

export const LessonButton = ({
  id,
  index,
  totalCount,
  locked,
  current,
  percentage,
  unitColor,
  isLastLesson,
  title = "Leçon",
  lessonChallengeCount = 5, // défaut raisonnable
}: Props) => {
  const router = useRouter();
  const { open } = usePracticeModal();
  const [showPopup, setShowPopup] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false); // 👈 pour l'animation d'apparition
  const [pressing, setPressing] = useState(false); // 👈 pour l'effet de descente
  const popupRef = useRef<HTMLDivElement>(null);

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
  const colors = colorMap[unitColor] || colorMap.green;

  // XP total calculé
  const totalXP = lessonChallengeCount * XP_PER_CHALLENGE;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        closePopup();
      }
    };
    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPopup]);

  // Ouvre le popup avec animation d'entrée
  const openPopup = () => {
    setShowPopup(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPopupVisible(true));
    });
  };

  // Ferme le popup avec animation de sortie
  const closePopup = () => {
    setPopupVisible(false);
    setTimeout(() => setShowPopup(false), 200);
  };

  const handleClick = () => {
    if (locked) return;
    if (showPopup) {
      closePopup();
    } else {
      openPopup();
    }
  };

  const handleStart = () => {
    closePopup();
    if (isCompleted) {
      open(id);
      return;
    }
    router.push("/lesson");
  };

  // Effet de descente du bouton au clic
  const handleButtonPress = () => {
    setPressing(true);
    setTimeout(() => setPressing(false), 150);
  };

  const DuoButton = ({
    bgHex,
    borderHex,
    children,
    isLocked,
    isGoldenBtn,
  }: {
    bgHex: string;
    borderHex: string;
    children: React.ReactNode;
    isLocked?: boolean;
    isGoldenBtn?: boolean;
  }) => (
    <div
      style={{
        width: 70,
        height: 70,
        borderRadius: "50%",
        backgroundColor: isGoldenBtn ? "#f59e0b" : isLocked ? "#d1d5db" : bgHex,
        // 👇 effet de descente : réduit borderBottom et translate quand pressing
        borderBottom: pressing
          ? `2px solid ${isGoldenBtn ? "#b45309" : isLocked ? "#9ca3af" : borderHex}`
          : `6px solid ${isGoldenBtn ? "#b45309" : isLocked ? "#9ca3af" : borderHex}`,
        cursor: isLocked ? "default" : "pointer",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 0.1s ease, border-bottom 0.1s ease",
        transform: pressing ? "translateY(4px)" : "translateY(0px)",
        boxShadow: isLocked
          ? "none"
          : pressing
          ? "none"
          : `0 4px 12px ${bgHex}55`,
      }}
      className={cn(
        !isLocked && !pressing && "hover:translate-y-[2px] hover:border-b-[3px]",
        isLocked && "opacity-60",
      )}
    >
      {!isLocked && (
        <>
          <div
            style={{
              position: "absolute",
              top: 15,
              left: "30%",
              transform: "translateX(-50%) rotate(-60deg)",
              width: 50,
              height: 20,
              background: "rgba(255,255,255,0.25)",
              borderRadius: "100% 100% 0% 0%",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 39,
              left: "50%",
              transform: "translateX(-53%) rotate(-60deg)",
              width: 93,
              height: 17,
              background: "rgba(255,255,255,0.25)",
              borderRadius: "90% 90% 0% 0%",
            }}
          />
        </>
      )}
      {children}
    </div>
  );

  const infiniteBounceAnimation = `
    @keyframes bounceInfinite {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    .bounce-infinite {
      animation: bounceInfinite 1s ease-in-out infinite;
    }
  `;

  return (
    <div
      style={{
        cursor: locked ? "default" : "pointer",
        animationDelay: `${index * 60}ms`,
        animationFillMode: "both",
        overflow: "visible",
        position: "relative",
        zIndex: showPopup ? 50 : "auto",
      }}
      className="animate-in fade-in slide-in-from-bottom-4"
    >
      <style>{infiniteBounceAnimation}</style>

      <div
        className="relative"
        style={{
          right: `${rightPosition}px`,
          marginTop: isFirst && !isCompleted ? 60 : 24,
          overflow: "visible",
          zIndex: showPopup ? 50 : "auto",
        }}
      >
        {/* Popup avec animation d'entrée */}
        {showPopup && !locked && (
          <div
            ref={popupRef}
            className={cn(
              "absolute w-[220px] rounded-2xl p-4 shadow-xl border-b-4",
              colors.popup,
              colors.popupBorder,
              "top-[85px] left-1/2 -translate-x-1/2",
              // 👇 animation d'apparition douce
              "transition-all duration-200 ease-out",
            )}
            style={{
              zIndex: 999,
              opacity: popupVisible ? 1 : 0,
              transform: popupVisible
                ? "translateX(-50%) translateY(0) scale(1)"
                : "translateX(-50%) translateY(-8px) scale(0.95)",
            }}
          >
            {/* Flèche */}
            <div
              className="absolute -top-[10px] left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderBottom: `10px solid ${colors.popupArrow}`,
              }}
            />

            {/* Bouton fermer */}
            <button
              onClick={(e) => { e.stopPropagation(); closePopup(); }}
              className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Titre et sous-titre */}
            <p className="text-white font-extrabold text-sm mb-1 pr-6">{title}</p>
            <p className="text-white/80 text-xs mb-4">
              Leçon {index + 1} sur {totalCount}
            </p>

            {/* Bouton Commencer avec effet de descente */}
            <button
              onMouseDown={handleButtonPress}
              onClick={handleStart}
              className={cn(
                "w-full py-2.5 rounded-xl font-extrabold text-sm uppercase tracking-wide",
                "transition-all duration-100",
                colors.popupButton,
                colors.popupButtonText,
              )}
              style={{
                borderBottom: pressing
                  ? `1px solid ${colors.popupButtonBorder}`
                  : `4px solid ${colors.popupButtonBorder}`,
                transform: pressing ? "translateY(3px)" : "translateY(0px)",
              }}
            >
              {isCompleted ? "Pratiquer" : `Commencer +${totalXP} XP`}
            </button>
          </div>
        )}

        {current ? (
          <div
            className="h-[102px] w-[102px] relative"
            onClick={() => { handleClick(); handleButtonPress(); }}
          >
            <div
              className={cn(
                "absolute -top-10 left-1/2 -translate-x-1/2 z-10",
                "px-4 py-2 rounded-xl",
                "bg-background border-2 border-b-4 border-border",
                "text-foreground text-xs font-extrabold uppercase tracking-widest",
                "shadow-lg whitespace-nowrap",
                "bounce-infinite"
              )}
            >
              Start
              <div
                className="absolute -bottom-[10px] left-1/2 -translate-x-1/2"
                style={{
                  width: 0, height: 0,
                  borderLeft: "6px solid transparent",
                  borderRight: "6px solid transparent",
                  borderTop: `8px solid hsl(var(--border))`,
                }}
              />
              <div
                className="absolute -bottom-[7px] left-1/2 -translate-x-1/2"
                style={{
                  width: 0, height: 0,
                  borderLeft: "5px solid transparent",
                  borderRight: "5px solid transparent",
                  borderTop: `7px solid hsl(var(--background))`,
                }}
              />
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
              <DuoButton bgHex={colors.bgHex} borderHex={colors.borderHex} isLocked={locked}>
                <Icon
                  className={cn(
                    "h-9 w-9 relative z-10",
                    locked
                      ? "fill-white text-white stroke-white opacity-60"
                      : "fill-white text-white drop-shadow-sm",
                    isCompleted && !isGolden && "fill-none stroke-white stroke-[4]",
                  )}
                />
              </DuoButton>
            </CircularProgressbarWithChildren>
          </div>

        ) : (
          <div
            className="relative"
            onClick={() => { handleClick(); handleButtonPress(); }}
          >
            {!locked && (
              <div className={cn(
                "absolute inset-0 rounded-full blur-md scale-125 opacity-0 hover:opacity-100 transition-all duration-500",
                isGolden ? "bg-yellow-300/50" : colors.glow
              )} />
            )}

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

            <DuoButton
              bgHex={isGolden ? "#f59e0b" : colors.bgHex}
              borderHex={isGolden ? "#b45309" : colors.borderHex}
              isLocked={locked}
              isGoldenBtn={isGolden && !locked}
            >
              <Icon
                className={cn(
                  "h-9 w-9 relative z-10",
                  locked
                    ? "fill-white text-white stroke-white opacity-60"
                    : "fill-white text-white drop-shadow-sm",
                  isCompleted && !isGolden && "fill-none stroke-white stroke-[4]",
                )}
              />
            </DuoButton>
          </div>
        )}
      </div>
    </div>
  );
};