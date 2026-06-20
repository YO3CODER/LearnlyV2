"use client";

import { Check, Crown, Star, X } from "lucide-react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

import "react-circular-progressbar/dist/styles.css";
import { Button } from "@/components/ui/button";

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
  isChest?: boolean;
  unitId: number;
  title?: string;
  lessonChallengeCount?: number;
  unitTotalXP?: number;
  mascotGif?: string;
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
  blue: { bg: "!bg-sky-400", hover: "hover:!bg-sky-500", bgHex: "#38bdf8", borderHex: "#0284c7", shadow: "shadow-sky-200 dark:shadow-sky-900", glow: "bg-sky-300/40", progress: ["#38bdf8", "#0ea5e9"], popup: "bg-sky-400", popupBorder: "border-sky-500", popupArrow: "#38bdf8", popupButtonBorder: "#0284c7", popupButton: "bg-white", popupButtonText: "text-sky-500" },
  purple: { bg: "!bg-violet-400", hover: "hover:!bg-violet-500", bgHex: "#a78bfa", borderHex: "#7c3aed", shadow: "shadow-violet-200 dark:shadow-violet-900", glow: "bg-violet-300/40", progress: ["#a78bfa", "#8b5cf6"], popup: "bg-violet-400", popupBorder: "border-violet-500", popupArrow: "#a78bfa", popupButtonBorder: "#7c3aed", popupButton: "bg-white", popupButtonText: "text-violet-500" },
  green: { bg: "!bg-lime-400", hover: "hover:!bg-lime-500", bgHex: "#a3e635", borderHex: "#65a30d", shadow: "shadow-lime-200 dark:shadow-lime-900", glow: "bg-lime-300/40", progress: ["#a3e635", "#84cc16"], popup: "bg-lime-400", popupBorder: "border-lime-500", popupArrow: "#a3e635", popupButtonBorder: "#65a30d", popupButton: "bg-white", popupButtonText: "text-lime-600" },
  orange: { bg: "!bg-amber-400", hover: "hover:!bg-amber-500", bgHex: "#fbbf24", borderHex: "#d97706", shadow: "shadow-amber-200 dark:shadow-amber-900", glow: "bg-amber-300/40", progress: ["#fbbf24", "#f59e0b"], popup: "bg-amber-400", popupBorder: "border-amber-500", popupArrow: "#fbbf24", popupButtonBorder: "#d97706", popupButton: "bg-white", popupButtonText: "text-amber-600" },
  pink: { bg: "!bg-fuchsia-400", hover: "hover:!bg-fuchsia-500", bgHex: "#e879f9", borderHex: "#c026d3", shadow: "shadow-fuchsia-200 dark:shadow-fuchsia-900", glow: "bg-fuchsia-300/40", progress: ["#e879f9", "#d946ef"], popup: "bg-fuchsia-400", popupBorder: "border-fuchsia-500", popupArrow: "#e879f9", popupButtonBorder: "#c026d3", popupButton: "bg-white", popupButtonText: "text-fuchsia-500" },
  indigo: { bg: "!bg-indigo-400", hover: "hover:!bg-indigo-500", bgHex: "#818cf8", borderHex: "#4f46e5", shadow: "shadow-indigo-200 dark:shadow-indigo-900", glow: "bg-indigo-300/40", progress: ["#818cf8", "#6366f1"], popup: "bg-indigo-400", popupBorder: "border-indigo-500", popupArrow: "#818cf8", popupButtonBorder: "#4f46e5", popupButton: "bg-white", popupButtonText: "text-indigo-500" },
  teal: { bg: "!bg-teal-400", hover: "hover:!bg-teal-500", bgHex: "#2dd4bf", borderHex: "#0d9488", shadow: "shadow-teal-200 dark:shadow-teal-900", glow: "bg-teal-300/40", progress: ["#2dd4bf", "#14b8a6"], popup: "bg-teal-400", popupBorder: "border-teal-500", popupArrow: "#2dd4bf", popupButtonBorder: "#0d9488", popupButton: "bg-white", popupButtonText: "text-teal-500" },
  red: { bg: "!bg-rose-400", hover: "hover:!bg-rose-500", bgHex: "#fb7185", borderHex: "#e11d48", shadow: "shadow-rose-200 dark:shadow-rose-900", glow: "bg-rose-300/40", progress: ["#fb7185", "#f43f5e"], popup: "bg-rose-400", popupBorder: "border-rose-500", popupArrow: "#fb7185", popupButtonBorder: "#e11d48", popupButton: "bg-white", popupButtonText: "text-rose-500" },
};
// ─── Données de transition ────────────────────────────────────────────────────

const GIFS = ["/1.gif", "/2.gif", "/3.gif"];
const DURATIONS = [2000, 3000, 5000];
const TRANSITION_LABELS = [
  {
    headline: "Prépare-toi",
    sub: "La leçon commence dans un instant",
    headlineColors: ["#FFD700", "#FF8C00", "#FF4500", "#FF8C00", "#FFD700", "#FFFFFF", "#FFD700", "#FF8C00", "#FF4500"],
    subColor: "#FFE599",
    effect: "wave" as const,
  },
  {
    headline: "Concentre-toi",
    sub: "Quelques secondes et c'est parti",
    headlineColors: ["#00FFFF", "#00BFFF", "#1E90FF", "#00BFFF", "#00FFFF", "#FFFFFF", "#00FFFF", "#00BFFF", "#1E90FF", "#FFFFFF", "#00FFFF", "#00BFFF"],
    subColor: "#B0E8FF",
    effect: "pulse" as const,
  },
  {
    headline: "Allez, on y va !",
    sub: "La leçon se charge pour toi",
    headlineColors: ["#FF69B4", "#FF1493", "#FF69B4", "#FFFFFF", "#7FFF00", "#00FF7F", "#FFFFFF", "#FF69B4", "#FF1493", "#FF69B4", "#FFFFFF", "#7FFF00", "#00FF7F", "#FFFFFF", "#FF69B4", "#FF1493"],
    subColor: "#CCFFCC",
    effect: "bounce" as const,
  },
];

// ─── AnimatedText ─────────────────────────────────────────────────────────────

const ANIMATED_TEXT_STYLES = `
  @keyframes letterWave {
    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 1; }
    25%       { transform: translateY(-10px) rotate(-3deg); opacity: 0.8; }
    50%       { transform: translateY(-16px) rotate(0deg); opacity: 1; }
    75%       { transform: translateY(-10px) rotate(3deg); opacity: 0.8; }
  }
  @keyframes letterPulse {
    0%, 100% { transform: scale(1); opacity: 1; text-shadow: 0 0 8px currentColor; }
    50%       { transform: scale(1.25); opacity: 0.85; text-shadow: 0 0 20px currentColor, 0 0 40px currentColor; }
  }
  @keyframes letterBounce {
    0%, 100% { transform: translateY(0) scaleY(1); }
    30%       { transform: translateY(-12px) scaleY(1.1); }
    60%       { transform: translateY(3px) scaleY(0.92); }
    80%       { transform: translateY(-5px) scaleY(1.04); }
  }
  @keyframes headlineSlideIn {
    0%   { opacity: 0; transform: translateY(28px) scale(0.85); filter: blur(6px); }
    60%  { opacity: 1; transform: translateY(-4px) scale(1.04); filter: blur(0px); }
    100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
  }
  @keyframes subFadeUp {
    0%   { opacity: 0; transform: translateY(14px); letter-spacing: 0.15em; }
    100% { opacity: 1; transform: translateY(0); letter-spacing: 0.02em; }
  }
  .headline-anim { animation: headlineSlideIn 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
  .sub-anim      { animation: subFadeUp 0.5s ease-out 0.25s both; }
`;

type AnimEffect = "wave" | "pulse" | "bounce";

const AnimatedText = ({
  text,
  colors,
  effect,
  baseDelay = 0,
}: {
  text: string;
  colors: string[];
  effect: AnimEffect;
  baseDelay?: number;
}) => {
  const animName =
    effect === "wave" ? "letterWave" :
    effect === "pulse" ? "letterPulse" :
    "letterBounce";

  const duration =
    effect === "wave" ? "1.4s" :
    effect === "pulse" ? "1.0s" :
    "0.9s";

  const chars = text.split("");

  return (
    <span style={{ display: "inline-block" }}>
      {chars.map((char, i) => {
        const color = colors[i % colors.length];
        const delay = baseDelay + i * 0.055;
        return (
          <span
            key={i}
            style={{
              display: char === " " ? "inline" : "inline-block",
              color,
              animation: char !== " " ? `${animName} ${duration} ease-in-out ${delay}s infinite` : undefined,
              textShadow: char !== " " ? `0 0 12px ${color}88, 0 2px 8px rgba(0,0,0,0.3)` : undefined,
              willChange: "transform",
              fontWeight: 900,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </span>
  );
};

// ─── TransitionScreen ─────────────────────────────────────────────────────────

type TransitionScreenProps = {
  color: string;
  onNavigate: () => void;
  practiceContent?: React.ReactNode;
};

const TransitionScreen = ({ color, onNavigate, practiceContent }: TransitionScreenProps) => {
  const [gifSrc] = useState(() => GIFS[Math.floor(Math.random() * GIFS.length)]);
  const [label] = useState(() => TRANSITION_LABELS[Math.floor(Math.random() * TRANSITION_LABELS.length)]);
  const [duration] = useState(() => DURATIONS[Math.floor(Math.random() * DURATIONS.length)]);
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigatedRef = useRef(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (practiceContent) return;

    const start = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const pct = Math.min(((now - start) / duration) * 100, 100);
      setProgress(pct);

      if (pct < 100) {
        rafId = requestAnimationFrame(tick);
      } else {
        if (!navigatedRef.current) {
          navigatedRef.current = true;
          setTimeout(onNavigate, 80);
        }
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [duration, onNavigate, practiceContent]);

  const content = (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: color,
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.28s ease",
        pointerEvents: "all",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
          width: "100%",
          maxWidth: 300,
          padding: "0 24px",
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {practiceContent ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              width: "100%",
              animation: "fadeSlideIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
            }}
          >
            <style>{`
              @keyframes fadeSlideIn {
                from { opacity: 0; transform: translateY(16px); }
                to   { opacity: 1; transform: translateY(0); }
              }
            `}</style>
            <img src="/heart.svg" alt="" width={90} height={90} style={{ display: "block" }} />
            <p style={{ color: "#fff", fontWeight: 800, fontSize: 22, textAlign: "center", margin: 0, lineHeight: 1.2 }}>
              Leçon de pratique
            </p>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, textAlign: "center", margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
              Utilisez les leçons de pratique pour récupérer des cœurs et des points. Vous ne pouvez pas perdre de cœurs ni de points lors des leçons de pratique.
            </p>
            {practiceContent}
          </div>
        ) : (
          <>
            <img
              src={gifSrc}
              alt=""
              draggable={false}
              style={{ width: 160, height: 160, objectFit: "contain", display: "block" }}
            />
            <style>{ANIMATED_TEXT_STYLES}</style>
            <div style={{ textAlign: "center" }}>
              <p
                className="headline-anim"
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  margin: 0,
                  letterSpacing: "-0.5px",
                  lineHeight: 1.2,
                  userSelect: "none",
                }}
              >
                <AnimatedText
                  text={label.headline}
                  colors={label.headlineColors}
                  effect={label.effect}
                  baseDelay={0.08}
                />
              </p>
              <p
                className="sub-anim"
                style={{
                  fontSize: 14,
                  color: label.subColor,
                  margin: "10px 0 0",
                  fontWeight: 600,
                  lineHeight: 1.5,
                  textShadow: `0 0 14px ${label.subColor}66`,
                  letterSpacing: "0.02em",
                  userSelect: "none",
                }}
              >
                {label.sub}
              </p>
            </div>
            <div style={{ width: "100%", height: 6, backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, backgroundColor: "#ffffff", borderRadius: 99, willChange: "width" }} />
            </div>
          </>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

// ─── Constante XP ─────────────────────────────────────────────────────────────

const XP_PER_CHALLENGE = 10;

// ─── Position zigzag ─────────────────────────────────────────────────────────
export const getZigzagOffset = (index: number): number => {
  const cycleLength = 8;
  const cycleIndex = index % cycleLength;
  let indentationLevel: number;
  if (cycleIndex <= 2) indentationLevel = cycleIndex;
  else if (cycleIndex <= 4) indentationLevel = 4 - cycleIndex;
  else if (cycleIndex <= 6) indentationLevel = 4 - cycleIndex;
  else indentationLevel = cycleIndex - 8;
  return indentationLevel * 40;
};

// ─── LessonButton ─────────────────────────────────────────────────────────────

export const LessonButton = ({
  id,
  index,
  totalCount,
  locked,
  current,
  percentage,
  unitColor,
  isLastLesson,
  isChest,
  title = "Leçon",
  lessonChallengeCount = 5,
  unitTotalXP,
  mascotGif,
}: Props) => {
  const router = useRouter();

  const [showPopup, setShowPopup] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [pressing, setPressing] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [showPracticeInTransition, setShowPracticeInTransition] = useState(false);

  const destinationRef = useRef<string>("/lesson");
  const popupRef = useRef<HTMLDivElement>(null);

  // ─── Sons via Web Audio API ───────────────────────────────────────────────
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bufferMapRef = useRef<Record<string, AudioBuffer>>({});

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  }, []);

  const loadBuffer = useCallback(async (url: string) => {
    if (bufferMapRef.current[url]) return bufferMapRef.current[url];
    const ctx = getCtx();
    const res = await fetch(url);
    const raw = await res.arrayBuffer();
    const buffer = await ctx.decodeAudioData(raw);
    bufferMapRef.current[url] = buffer;
    return buffer;
  }, [getCtx]);

  const playSound = useCallback(async (url: string) => {
    try {
      const ctx = getCtx();
      if (ctx.state === "suspended") await ctx.resume();
      const buffer = await loadBuffer(url);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.value = 0.8;
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start(0);
    } catch {
      // Silently fail
    }
  }, [getCtx, loadBuffer]);

  useEffect(() => {
    loadBuffer("/boutonsong1.mp3").catch(() => {});
    loadBuffer("/boutonsong.mp3").catch(() => {});
  }, [loadBuffer]);

  useEffect(() => {
    return () => {
      audioCtxRef.current?.close();
    };
  }, []);

  const playBouton = useCallback(() => {
    playSound("/boutonsong1.mp3");
    if ("vibrate" in navigator) navigator.vibrate([8, 50, 8]);
  }, [playSound]);

  const playCommencer = useCallback(() => {
    playSound("/boutonsong.mp3");
    if ("vibrate" in navigator) navigator.vibrate([10, 40, 20, 40, 40]);
  }, [playSound]);

  // ─── Layout zigzag ───────────────────────────────────────────────────────
  const rightPosition = getZigzagOffset(index);

  const isFirst = index === 0;
  const isCompleted = !current && !locked;
  const isPerfect = isCompleted && percentage === 100;
  const isGolden = isLastLesson && !isChest;

  const Icon = isGolden ? Crown : isCompleted ? Check : Star;
  const colors = colorMap[unitColor] || colorMap.green;

  // ─── CALCUL XP ────────────────────────────────────────────────────────────
  const lessonXP = lessonChallengeCount * XP_PER_CHALLENGE;
  const displayXP = isChest && unitTotalXP !== undefined ? unitTotalXP : lessonXP;

  // ─── Click outside popup ─────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) closePopup();
    };
    if (showPopup) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showPopup]);

  const openPopup = () => {
    setShowPopup(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setPopupVisible(true)));
  };

  const closePopup = () => {
    setPopupVisible(false);
    setTimeout(() => setShowPopup(false), 200);
  };

  const handleClick = () => {
    if (locked) return;
    playBouton();
    if (showPopup) closePopup();
    else openPopup();
  };

  const handleStart = () => {
    playCommencer();
    closePopup();

    if (isCompleted) {
      destinationRef.current = "practice";
    } else {
      destinationRef.current = "/lesson";
    }

    setShowTransition(true);
  };

  const handleTransitionDone = useCallback(() => {
    if (destinationRef.current === "practice") {
      setShowPracticeInTransition(true);
    } else {
      router.replace(destinationRef.current);
    }
  }, [router]);

  const handlePracticeConfirm = () => {
    router.replace(`/lesson/${id}`);
  };

  const handlePracticeCancel = () => {
    setShowPracticeInTransition(false);
    setShowTransition(false);
  };

  const handleButtonPress = () => {
    setPressing(true);
    setTimeout(() => setPressing(false), 150);
  };

  // ─── Bouton rond Duolingo ────────────────────────────────────────────────
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
          : `4px solid ${isGoldenBtn ? "#b45309" : isLocked ? "#9ca3af" : borderHex}`,
        cursor: isLocked ? "default" : "pointer",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 0.1s ease, border-bottom 0.1s ease",
        transform: pressing ? "translateY(4px)" : "translateY(0px)",
        boxShadow: isLocked ? "none" : pressing ? "none" : `0 5px 12px ${bgHex}66`,
        outline: isLocked ? "none" : `2px solid ${borderHex}30`,
        outlineOffset: "3px",
      }}
      className={cn(
        !isLocked && !pressing && "hover:translate-y-[2px] hover:border-b-[3px]",
        isLocked && "opacity-60",
      )}
    >
      {!isLocked && (
        <>
          <div style={{ position: "absolute", top: 10, left: "28%", transform: "translateX(-50%) rotate(-60deg)", width: 45, height: 18, background: "rgba(255,255,255,0.35)", borderRadius: "100% 100% 0% 0%" }} />
          <div style={{ position: "absolute", top: 31, left: "50%", transform: "translateX(-53%) rotate(-60deg)", width: 82, height: 15, background: "rgba(255,255,255,0.25)", borderRadius: "90% 90% 0% 0%" }} />
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

    @keyframes chestBounce {
      0%, 100% { transform: translateY(0) scale(1); }
      25% { transform: translateY(-4px) scale(1.02); }
      50% { transform: translateY(-8px) scale(1.05); }
      75% { transform: translateY(-4px) scale(1.02); }
    }
    .chest-bounce { animation: chestBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) infinite; }

    @keyframes chestOpen {
      0% { opacity: 0; transform: scale(0.8) rotateZ(-5deg); }
      50% { transform: scale(1.05) rotateZ(2deg); }
      100% { opacity: 1; transform: scale(1) rotateZ(0deg); }
    }
    .chest-open { animation: chestOpen 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

    @keyframes mascotFloat {
      0%, 100% { transform: translateY(-50%) translateY(0px); }
      50%       { transform: translateY(-50%) translateY(-6px); }
    }
    .mascot-float { animation: mascotFloat 2.5s ease-in-out infinite; }
  `;

  // ─── Contenu practice dans la transition ─────────────────────────────────
  const practiceButtons = showPracticeInTransition ? (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", marginTop: 8 }}>
      <Button
        variant="secondary"
        onClick={handlePracticeConfirm}
        className="w-full py-[13px] rounded-[14px] font-extrabold text-[15px] tracking-wide"
      >
        Je comprends
      </Button>
      <button
        onClick={handlePracticeCancel}
        style={{
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.65)",
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 600,
          padding: "6px 0",
        }}
      >
        Annuler
      </button>
    </div>
  ) : undefined;

  // ─── RENDER COFFRE ────────────────────────────────────────────────────────
  if (isChest) {
    const chestCompleted = !locked;
    const chestTotalXP = unitTotalXP ?? lessonXP;

    return (
      <>
        {showTransition && (
          <TransitionScreen
            color={colors.bgHex}
            onNavigate={handleTransitionDone}
            practiceContent={practiceButtons}
          />
        )}
        <div
          style={{
            cursor: "pointer",
            animationDelay: `${index * 60}ms`,
            animationFillMode: "both",
            overflow: "visible",
            position: "relative",
            marginTop: 36,
            zIndex: showPopup ? 50 : "auto",
          }}
          className="animate-in fade-in slide-in-from-bottom-4 flex justify-center w-full"
        >
          <style>{infiniteBounceAnimation}</style>

          <div className="relative" onClick={() => { handleClick(); handleButtonPress(); }}>
            {chestCompleted ? (
              <div className="chest-open">
                <img
                  src="/image1.svg"
                  alt="Coffre ouvert"
                  width={70}
                  height={70}
                  draggable={false}
                  style={{
                    display: "block",
                    cursor: "pointer",
                    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                  }}
                />
              </div>
            ) : (
              <div className="chest-bounce">
                <img
                  src="/image2.svg"
                  alt="Coffre fermé"
                  width={70}
                  height={70}
                  draggable={false}
                  style={{
                    display: "block",
                    cursor: "pointer",
                    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                  }}
                />
              </div>
            )}
          </div>

          {/* Popup du coffre */}
          {showPopup && !locked && (
            <div
              ref={popupRef}
              className={cn(
                "absolute rounded-2xl px-5 py-3 shadow-xl border-b-4",
                colors.popup,
                colors.popupBorder,
                "top-[74px] left-1/2 -translate-x-1/2",
                "transition-all duration-200 ease-out",
              )}
              style={{
                zIndex: 999,
                whiteSpace: "nowrap",
                opacity: popupVisible ? 1 : 0,
                transform: popupVisible
                  ? "translateX(-50%) translateY(0) scale(1)"
                  : "translateX(-50%) translateY(-8px) scale(0.95)",
              }}
            >
              <div
                className="absolute -top-[10px] left-1/2 -translate-x-1/2 w-0 h-0"
                style={{
                  borderLeft: "10px solid transparent",
                  borderRight: "10px solid transparent",
                  borderBottom: `10px solid ${colors.popupArrow}`,
                }}
              />
              <p className="text-white font-extrabold text-base text-center m-0 leading-none">
                ⭐ {chestTotalXP} XP {chestCompleted ? "obtenus" : "à obtenir"}
              </p>
            </div>
          )}
        </div>
      </>
    );
  }

  // ─── RENDER LEÇON NORMALE ─────────────────────────────────────────────────
  return (
    <>
      {showTransition && (
        <TransitionScreen
          color={colors.bgHex}
          onNavigate={handleTransitionDone}
          practiceContent={practiceButtons}
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
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
        className="animate-in fade-in slide-in-from-bottom-4"
      >
        <style>{infiniteBounceAnimation}</style>

        {/* ── Mascotte dans le creux du zigzag ── */}
        {mascotGif && Math.abs(rightPosition) > 5 && (
          <div
            className="absolute mascot-float pointer-events-none"
            style={{
              top: "50%",
              left: "50%",
              width: 75,
              height: 75,
              zIndex: 10,
              transform: `translate(${
                rightPosition > 0
                  ? `calc(-50% - 80px + ${rightPosition}px)`
                  : `calc(-50% + 80px + ${rightPosition}px)`
              }, -50%)`,
              transition: "transform 0.2s ease-out",
            }}
          >
            <img
              src={mascotGif}
              alt="Mascot"
              width={75}
              height={75}
              draggable={false}
              className={cn(
                "object-contain w-full h-full",
                locked && "brightness-[0.4] opacity-50"
              )}
            />
          </div>
        )}

        {/* ── Conteneur du bouton avec le décalage zigzag ── */}
        <div
          className="relative flex items-center justify-center"
          style={{
            transform: `translateX(${-rightPosition}px)`,
            marginTop: isFirst && !isCompleted ? 45 : 18,
            overflow: "visible",
            zIndex: showPopup ? 55 : 20,
            width: current ? 100 : 70,
            height: current ? 100 : 70,
          }}
        >
          {/* ── Popup de la leçon ── */}
          {showPopup && !locked && (
            <div
              ref={popupRef}
              className={cn(
                "absolute w-[240px] rounded-2xl p-4 shadow-xl border-b-4",
                colors.popup,
                colors.popupBorder,
                "top-[108px] left-1/2 -translate-x-1/2",
                "transition-all duration-200 ease-out"
              )}
              style={{
                zIndex: 999,
                opacity: popupVisible ? 1 : 0,
                transform: popupVisible
                  ? "translateX(-50%) translateY(0) scale(1)"
                  : "translateX(-50%) translateY(-8px) scale(0.95)",
              }}
            >
              <div
                className="absolute -top-[10px] left-1/2 -translate-x-1/2 w-0 h-0"
                style={{
                  borderLeft: "10px solid transparent",
                  borderRight: "10px solid transparent",
                  borderBottom: `10px solid ${colors.popupArrow}`,
                }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closePopup();
                }}
                className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              <p className="text-white font-extrabold text-sm mb-1 pr-6">
                {title}
              </p>
              <p className="text-white/80 text-xs mb-4">
                Leçon {index + 1} sur {totalCount}
              </p>
              <Button
                variant="default"
                onMouseDown={handleButtonPress}
                onClick={handleStart}
                className={cn(
                  "w-full py-2.5 text-sm font-extrabold",
                  "border-0",
                  "bg-white text-black",
                  "shadow-[0_6px_0_0_#d4d4d4]",
                  "active:shadow-[0_1px_0_0_#d4d4d4]",
                  "active:translate-y-[5px]",
                  "transition-all duration-100",
                  "hover:bg-gray-50",
                  colors.popupButtonText
                )}
                style={{
                  transform: pressing ? "translateY(5px)" : "translateY(0px)",
                }}
              >
                {isCompleted ? "Pratiquer" : `Commencer +${lessonXP} XP`}
              </Button>
            </div>
          )}

          {/* ── Bouton leçon courante (avec progression circulaire) ── */}
          {current ? (
            <div
              className="h-[116px] w-[116px] relative flex items-center justify-center"
              onClick={() => {
                handleClick();
                handleButtonPress();
              }}
            >
              <div
                className={cn(
                  "absolute -top-10 left-1/2 -translate-x-1/2 z-10",
                  "px-4 py-2 rounded-xl",
                  "bg-background border-2 border-b-4 border-border",
                  "text-foreground text-xs font-extrabold uppercase tracking-widest",
                  "shadow-lg whitespace-nowrap",
                  "bounce-infinite",
                  colors.popupButtonText
                )}
              >
                COMMENCER
                <div
                  className="absolute -bottom-[8px] left-1/2 -translate-x-1/2"
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderTop: "6px solid hsl(var(--border))",
                  }}
                />
                <div
                  className="absolute -bottom-[5px] left-1/2 -translate-x-1/2"
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "4px solid transparent",
                    borderRight: "4px solid transparent",
                    borderTop: "5px solid hsl(var(--background))",
                  }}
                />
              </div>

              <CircularProgressbarWithChildren
                value={Number.isNaN(percentage) ? 0 : percentage}
                styles={{
                  path: {
                    stroke: "url(#progressGradient)",
                    strokeLinecap: "round",
                    strokeWidth: 8,
                  },
                  trail: { stroke: "#e8e8f0", strokeWidth: 8 },
                }}
              >
                <svg style={{ height: 0, width: 0, position: "absolute" }}>
                  <defs>
                    <linearGradient
                      id="progressGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor={colors.progress[0]} />
                      <stop offset="100%" stopColor={colors.progress[1]} />
                    </linearGradient>
                  </defs>
                </svg>
                <DuoButton
                  bgHex={colors.bgHex}
                  borderHex={colors.borderHex}
                  isLocked={locked}
                >
                  <Icon
                    className={cn(
                      "h-9 w-9 relative z-10",
                      locked
                        ? "fill-white text-white stroke-white opacity-60"
                        : "fill-white text-white drop-shadow-sm",
                      isCompleted && !isGolden && "fill-none stroke-white stroke-[4]"
                    )}
                  />
                </DuoButton>
              </CircularProgressbarWithChildren>
            </div>
          ) : (
            // ── Bouton leçon normale (complétée ou à venir) ──
            <div
              className="relative w-[84px] h-[84px] flex items-center justify-center"
              onClick={() => {
                handleClick();
                handleButtonPress();
              }}
            >
              {!locked && (
                <div
                  className={cn(
                    "absolute inset-0 rounded-full blur-md scale-125 opacity-0 hover:opacity-100 transition-all duration-500",
                    isGolden ? "bg-yellow-300/50" : colors.glow
                  )}
                />
              )}

              {isPerfect && !isGolden && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-400 text-white text-[9px] font-extrabold uppercase tracking-wider shadow-sm whitespace-nowrap">
                  Parfait
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
                    isCompleted && !isGolden && "fill-none stroke-white stroke-[4]"
                  )}
                />
              </DuoButton>
            </div>
          )}
        </div>
      </div>
    </>
  );
};