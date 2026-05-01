"use client";

import { Check, Crown, Star, X } from "lucide-react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

import { cn } from "@/lib/utils";
import { usePracticeModal } from "@/store/use-practice-modal";

import "react-circular-progressbar/dist/styles.css";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  lessonChallengeCount?: number;
};

// ─── Color map ────────────────────────────────────────────────────────────────

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
  blue:   { bg: "!bg-blue-500",   hover: "hover:!bg-blue-600",   bgHex: "#3b82f6", borderHex: "#1d4ed8", shadow: "shadow-blue-200 dark:shadow-blue-900",     glow: "bg-blue-300/40",   progress: ["#3b82f6", "#6366f1"], popup: "bg-blue-500",   popupBorder: "border-blue-600",   popupArrow: "#3b82f6", popupButtonBorder: "#1d4ed8", popupButton: "bg-white", popupButtonText: "text-blue-500" },
  purple: { bg: "!bg-purple-500", hover: "hover:!bg-purple-600", bgHex: "#a855f7", borderHex: "#7e22ce", shadow: "shadow-purple-200 dark:shadow-purple-900", glow: "bg-purple-300/40", progress: ["#a855f7", "#8b5cf6"], popup: "bg-purple-500", popupBorder: "border-purple-600", popupArrow: "#a855f7", popupButtonBorder: "#7e22ce", popupButton: "bg-white", popupButtonText: "text-purple-500" },
  green:  { bg: "!bg-green-500",  hover: "hover:!bg-green-600",  bgHex: "#22c55e", borderHex: "#15803d", shadow: "shadow-green-200 dark:shadow-green-900",   glow: "bg-green-300/40",  progress: ["#22c55e", "#16a34a"], popup: "bg-green-500",  popupBorder: "border-green-600",  popupArrow: "#22c55e", popupButtonBorder: "#15803d", popupButton: "bg-white", popupButtonText: "text-green-600" },
  orange: { bg: "!bg-orange-500", hover: "hover:!bg-orange-600", bgHex: "#f97316", borderHex: "#c2410c", shadow: "shadow-orange-200 dark:shadow-orange-900", glow: "bg-orange-300/40", progress: ["#f97316", "#ea580c"], popup: "bg-orange-500", popupBorder: "border-orange-600", popupArrow: "#f97316", popupButtonBorder: "#c2410c", popupButton: "bg-white", popupButtonText: "text-orange-500" },
  pink:   { bg: "!bg-pink-500",   hover: "hover:!bg-pink-600",   bgHex: "#ec4899", borderHex: "#be185d", shadow: "shadow-pink-200 dark:shadow-pink-900",     glow: "bg-pink-300/40",   progress: ["#ec4899", "#db2777"], popup: "bg-pink-500",   popupBorder: "border-pink-600",   popupArrow: "#ec4899", popupButtonBorder: "#be185d", popupButton: "bg-white", popupButtonText: "text-pink-500" },
  indigo: { bg: "!bg-indigo-500", hover: "hover:!bg-indigo-600", bgHex: "#6366f1", borderHex: "#4338ca", shadow: "shadow-indigo-200 dark:shadow-indigo-900", glow: "bg-indigo-300/40", progress: ["#6366f1", "#4f46e5"], popup: "bg-indigo-500", popupBorder: "border-indigo-600", popupArrow: "#6366f1", popupButtonBorder: "#4338ca", popupButton: "bg-white", popupButtonText: "text-indigo-500" },
  teal:   { bg: "!bg-teal-500",   hover: "hover:!bg-teal-600",   bgHex: "#14b8a6", borderHex: "#0f766e", shadow: "shadow-teal-200 dark:shadow-teal-900",     glow: "bg-teal-300/40",   progress: ["#14b8a6", "#0d9488"], popup: "bg-teal-500",   popupBorder: "border-teal-600",   popupArrow: "#14b8a6", popupButtonBorder: "#0f766e", popupButton: "bg-white", popupButtonText: "text-teal-500" },
  red:    { bg: "!bg-red-500",    hover: "hover:!bg-red-600",    bgHex: "#ef4444", borderHex: "#b91c1c", shadow: "shadow-red-200 dark:shadow-red-900",       glow: "bg-red-300/40",    progress: ["#ef4444", "#dc2626"], popup: "bg-red-500",    popupBorder: "border-red-600",    popupArrow: "#ef4444", popupButtonBorder: "#b91c1c", popupButton: "bg-white", popupButtonText: "text-red-500" },
};

// ─── Écran de transition avant la leçon (style Duolingo) ─────────────────────

const GIFS = ["/1.gif", "/2.gif", "/3.gif"];

const TRANSITION_TEXTS = [
  { headline: "C'est parti ! 🚀", sub: "Concentre-toi, tu vas cartonner !" },
  { headline: "En forme ? 💪",    sub: "Chaque leçon te rapproche du sommet." },
  { headline: "Go go go ! ⚡",    sub: "Quelques minutes suffisent. Allez !" },
];

type TransitionScreenProps = {
  onReady: () => void;
  color: string;
};

const TransitionScreen = ({ onReady, color }: TransitionScreenProps) => {
  const [gifSrc] = useState(() => GIFS[Math.floor(Math.random() * GIFS.length)]);
  const [texts]  = useState(() => TRANSITION_TEXTS[Math.floor(Math.random() * TRANSITION_TEXTS.length)]);
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, []);

  const handleGo = () => {
    setLeaving(true);
    setTimeout(onReady, 380);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        transition: "opacity 0.35s ease, transform 0.35s ease",
        opacity: visible && !leaving ? 1 : 0,
        transform: leaving ? "scale(1.04)" : visible ? "scale(1)" : "scale(0.96)",
        pointerEvents: leaving ? "none" : "auto",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 28,
          padding: "36px 32px 28px",
          maxWidth: 340,
          width: "90vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          boxShadow: `0 20px 60px ${color}44, 0 4px 20px rgba(0,0,0,0.18)`,
          border: `3px solid ${color}33`,
          transition: "transform 0.35s cubic-bezier(.34,1.56,.64,1)",
          transform: visible && !leaving ? "translateY(0)" : "translateY(24px)",
        }}
      >
        {/* GIF animé */}
        <img
          src={gifSrc}
          alt="transition"
          style={{ width: 140, height: 140, objectFit: "contain", borderRadius: 16 }}
        />

        {/* Texte */}
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 22, fontWeight: 900, color: "#1e1e2e", margin: 0, letterSpacing: "-0.3px", lineHeight: 1.2 }}>
            {texts.headline}
          </p>
          <p style={{ fontSize: 14, color: "#6b7280", margin: "6px 0 0", fontWeight: 500 }}>
            {texts.sub}
          </p>
        </div>

        {/* Barre de progression simulée */}
        <div style={{ width: "100%", height: 8, background: "#f0f0f5", borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: visible ? "100%" : "0%",
            background: `linear-gradient(90deg, ${color}, ${color}cc)`,
            borderRadius: 99,
            transition: "width 2.8s cubic-bezier(0.4,0,0.2,1)",
          }} />
        </div>

        {/* Bouton GO */}
        <button
          onClick={handleGo}
          style={{
            marginTop: 4,
            width: "100%",
            padding: "14px 0",
            borderRadius: 16,
            background: color,
            color: "#fff",
            fontWeight: 900,
            fontSize: 15,
            letterSpacing: "0.8px",
            textTransform: "uppercase",
            border: "none",
            borderBottom: `4px solid ${color}bb`,
            cursor: "pointer",
            boxShadow: `0 4px 16px ${color}55`,
            transition: "transform 0.1s, box-shadow 0.1s",
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(3px)";
            (e.currentTarget as HTMLButtonElement).style.borderBottom = `1px solid ${color}bb`;
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLButtonElement).style.borderBottom = `4px solid ${color}bb`;
          }}
        >
          C'est parti !
        </button>
      </div>
    </div>
  );
};

// ─── Constante XP ─────────────────────────────────────────────────────────────

const XP_PER_CHALLENGE = 10;

// ─── Composant principal ──────────────────────────────────────────────────────

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
  lessonChallengeCount = 5,
}: Props) => {
  const router = useRouter();
  const { open } = usePracticeModal();

  const [showPopup,      setShowPopup]      = useState(false);
  const [popupVisible,   setPopupVisible]   = useState(false);
  const [pressing,       setPressing]       = useState(false);
  const [showTransition, setShowTransition] = useState(false);

  const popupRef = useRef<HTMLDivElement>(null);

  // ─── Audio & Haptic ──────────────────────────────────────────────────────
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/boutonsong.mp3");
    audio.preload = "auto";
    audioRef.current = audio;
  }, []);

  const playFeedback = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
    if ("vibrate" in navigator) {
      navigator.vibrate([12, 30, 12]);
    }
  };

  // ─── Layout ──────────────────────────────────────────────────────────────
  const cycleLength = 8;
  const cycleIndex  = index % cycleLength;

  let indentationLevel;
  if      (cycleIndex <= 2) indentationLevel = cycleIndex;
  else if (cycleIndex <= 4) indentationLevel = 4 - cycleIndex;
  else if (cycleIndex <= 6) indentationLevel = 4 - cycleIndex;
  else                      indentationLevel = cycleIndex - 8;

  const rightPosition = indentationLevel * 40;

  const isFirst     = index === 0;
  const isCompleted = !current && !locked;
  const isPerfect   = isCompleted && percentage === 100;
  const isGolden    = isLastLesson;

  const Icon    = isLastLesson ? Crown : isCompleted ? Check : Star;
  const colors  = colorMap[unitColor] || colorMap.green;
  const totalXP = lessonChallengeCount * XP_PER_CHALLENGE;

  // ─── Click outside ───────────────────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        closePopup();
      }
    };
    if (showPopup) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPopup]);

  // ─── Popup helpers ───────────────────────────────────────────────────────
  const openPopup = () => {
    setShowPopup(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setPopupVisible(true)));
  };

  const closePopup = () => {
    setPopupVisible(false);
    setTimeout(() => setShowPopup(false), 200);
  };

  // ─── Handlers ────────────────────────────────────────────────────────────
  const handleClick = () => {
    if (locked) return;
    playFeedback();
    if (showPopup) closePopup();
    else           openPopup();
  };

  const handleStart = () => {
    playFeedback();
    closePopup();

    // Leçon déjà complétée → modal de pratique, pas d'écran interstitiel
    if (isCompleted) {
      open(id);
      return;
    }

    // Affiche l'écran de transition style Duolingo avant la leçon
    setShowTransition(true);
  };

  // Appelée quand l'utilisateur clique "C'est parti !" dans l'écran interstitiel
  const handleTransitionReady = () => {
    setShowTransition(false);
    router.push("/lesson");
  };

  const handleButtonPress = () => {
    setPressing(true);
    setTimeout(() => setPressing(false), 150);
  };

  // ─── Bouton rond Duolingo ─────────────────────────────────────────────────
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
        boxShadow: isLocked ? "none" : pressing ? "none" : `0 4px 12px ${bgHex}55`,
      }}
      className={cn(
        !isLocked && !pressing && "hover:translate-y-[2px] hover:border-b-[3px]",
        isLocked && "opacity-60",
      )}
    >
      {!isLocked && (
        <>
          <div style={{ position: "absolute", top: 15, left: "30%", transform: "translateX(-50%) rotate(-60deg)", width: 50, height: 20, background: "rgba(255,255,255,0.25)", borderRadius: "100% 100% 0% 0%" }} />
          <div style={{ position: "absolute", top: 39, left: "50%", transform: "translateX(-53%) rotate(-60deg)", width: 93, height: 17, background: "rgba(255,255,255,0.25)", borderRadius: "90% 90% 0% 0%" }} />
        </>
      )}
      {children}
    </div>
  );

  const infiniteBounceAnimation = `
    @keyframes bounceInfinite {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-8px); }
    }
    .bounce-infinite { animation: bounceInfinite 1s ease-in-out infinite; }
  `;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* Écran interstitiel plein écran style Duolingo */}
      {showTransition && (
        <TransitionScreen
          onReady={handleTransitionReady}
          color={colors.bgHex}
        />
      )}

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
          {/* ── Popup ── */}
          {showPopup && !locked && (
            <div
              ref={popupRef}
              className={cn(
                "absolute w-[220px] rounded-2xl p-4 shadow-xl border-b-4",
                colors.popup,
                colors.popupBorder,
                "top-[85px] left-1/2 -translate-x-1/2",
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

              {/* Fermer */}
              <button
                onClick={(e) => { e.stopPropagation(); closePopup(); }}
                className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Titre */}
              <p className="text-white font-extrabold text-sm mb-1 pr-6">{title}</p>
              <p className="text-white/80 text-xs mb-4">
                Leçon {index + 1} sur {totalCount}
              </p>

              {/* Bouton Commencer */}
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

          {/* ── Bouton leçon courante ── */}
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
                  "bounce-infinite",
                )}
              >
                Start
                <div className="absolute -bottom-[10px] left-1/2 -translate-x-1/2" style={{ width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: `8px solid hsl(var(--border))` }} />
                <div className="absolute -bottom-[7px]  left-1/2 -translate-x-1/2" style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `7px solid hsl(var(--background))` }} />
              </div>

              <CircularProgressbarWithChildren
                value={Number.isNaN(percentage) ? 0 : percentage}
                styles={{
                  path:  { stroke: "url(#progressGradient)", strokeLinecap: "round" },
                  trail: { stroke: "#e8e8f0" },
                }}
              >
                <svg style={{ height: 0, width: 0, position: "absolute" }}>
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%"   stopColor={colors.progress[0]} />
                      <stop offset="100%" stopColor={colors.progress[1]} />
                    </linearGradient>
                  </defs>
                </svg>
                <DuoButton bgHex={colors.bgHex} borderHex={colors.borderHex} isLocked={locked}>
                  <Icon className={cn("h-9 w-9 relative z-10", locked ? "fill-white text-white stroke-white opacity-60" : "fill-white text-white drop-shadow-sm", isCompleted && !isGolden && "fill-none stroke-white stroke-[4]")} />
                </DuoButton>
              </CircularProgressbarWithChildren>
            </div>

          ) : (
            /* ── Bouton leçon normale ── */
            <div
              className="relative"
              onClick={() => { handleClick(); handleButtonPress(); }}
            >
              {!locked && (
                <div className={cn(
                  "absolute inset-0 rounded-full blur-md scale-125 opacity-0 hover:opacity-100 transition-all duration-500",
                  isGolden ? "bg-yellow-300/50" : colors.glow,
                )} />
              )}

              {isPerfect && !isGolden && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10 px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-400 text-white text-[9px] font-extrabold uppercase tracking-wider shadow-sm whitespace-nowrap">
                  ★ Perfect
                </div>
              )}

              <DuoButton
                bgHex={isGolden ? "#f59e0b" : colors.bgHex}
                borderHex={isGolden ? "#b45309" : colors.borderHex}
                isLocked={locked}
                isGoldenBtn={isGolden && !locked}
              >
                <Icon className={cn("h-9 w-9 relative z-10", locked ? "fill-white text-white stroke-white opacity-60" : "fill-white text-white drop-shadow-sm", isCompleted && !isGolden && "fill-none stroke-white stroke-[4]")} />
              </DuoButton>
            </div>
          )}
        </div>
      </div>
    </>
  );
};