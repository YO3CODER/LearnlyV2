"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getCurrentMondayISO } from "@/utils/week";

// ─── getDivision ──────────────────────────────────────────────────────────────

const divisionImages = {
  Legendary: "/legendary.svg",
  Diamond:   "/diamond.svg",
  Platinum:  "/platinum.svg",
  Gold:      "/gold.svg",
};

type Division = {
  name:      string;
  image:     string;
  color:     string;
  bg:        string;
  border:    string;
  barColor:  string;
};

const getDivision = (points: number): Division => {
  if (points >= 5000) return {
    name: "Légendaire", image: divisionImages.Legendary,
    color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-950/30",
    border: "border-yellow-200 dark:border-yellow-800",
    barColor: "bg-gradient-to-r from-yellow-400 to-orange-400",
  };
  if (points >= 3000) return {
    name: "Diamant", image: divisionImages.Diamond,
    color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-950/30",
    border: "border-cyan-200 dark:border-cyan-800",
    barColor: "bg-gradient-to-r from-cyan-400 to-blue-400",
  };
  if (points >= 2000) return {
    name: "Platine", image: divisionImages.Platinum,
    color: "text-slate-500", bg: "bg-card", border: "border-border",
    barColor: "bg-gradient-to-r from-slate-400 to-slate-500",
  };
  return {
    name: "Or", image: divisionImages.Gold,
    color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-950/30",
    border: "border-yellow-200 dark:border-yellow-800",
    barColor: "bg-gradient-to-r from-yellow-300 to-yellow-500",
  };
};

// ─── Types ────────────────────────────────────────────────────────────────────

type LeaderboardEntry = {
  userId:          string | null;
  userName:        string;
  userImageSrc:    string;
  points:          number;
  weeklyPoints:    number;
  weeklyResetDate: string;
};

type Props = {
  leaderboard:   LeaderboardEntry[];
  currentUserId: string | null;
};

const medalImages = ["/first.svg", "/seconds.svg", "/troisieme.svg"];

type Tab = "alltime" | "weekly";

// ─── Type unifié pour les couleurs de rang ────────────────────────────────────

type RankColors = {
  from:    string;
  to:      string;
  glow:    string;
  overlay: string;
};

// ─── Couleurs par rang ────────────────────────────────────────────────────────

const RANK_TIER_COLORS: Record<number, RankColors> = {
  1: { from: "#FFE066", to: "#FFA500", glow: "#FFD700", overlay: "rgba(120,72,0,0.55)" },
  2: { from: "#F1F5F9", to: "#94A3B8", glow: "#CBD5E1", overlay: "rgba(51,65,85,0.55)" },
  3: { from: "#E8A05C", to: "#92400E", glow: "#CD7F32", overlay: "rgba(67,33,10,0.55)" },
};

const DIVISION_HEX: Record<string, RankColors> = {
  "Légendaire": { from: "#FDE68A", to: "#FB923C", glow: "#FBBF24", overlay: "rgba(120,72,0,0.45)" },
  "Diamant":    { from: "#67E8F9", to: "#60A5FA", glow: "#22D3EE", overlay: "rgba(8,51,68,0.5)" },
  "Platine":    { from: "#CBD5E1", to: "#64748B", glow: "#94A3B8", overlay: "rgba(15,23,42,0.5)" },
  "Or":         { from: "#FDE047", to: "#EAB308", glow: "#FACC15", overlay: "rgba(66,32,6,0.5)" },
};

const getRankTier = (rank: number, divisionName: string): RankColors => {
  if (rank <= 3) return RANK_TIER_COLORS[rank];
  return DIVISION_HEX[divisionName] ?? DIVISION_HEX["Or"];
};

// ─── Compteur animé ───────────────────────────────────────────────────────────

const useCountUp = (target: number, duration: number, start: boolean) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let raf: number;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setValue(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);

  return value;
};

// ─── Weekly countdown ─────────────────────────────────────────────────────────

const useWeeklyCountdown = () => {
  const getTimeLeft = () => {
    const now    = new Date();
    const monday = new Date(now);
    const day    = now.getDay();
    const diff   = day === 0 ? 1 : 8 - day;
    monday.setDate(now.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    const ms = monday.getTime() - now.getTime();
    return {
      days:    Math.floor(ms / (1000 * 60 * 60 * 24)),
      hours:   Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60)),
    };
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 60_000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
};

// ─── CountdownBadge ───────────────────────────────────────────────────────────

const CountdownBadge = () => {
  const { days, hours, minutes } = useWeeklyCountdown();
  const label =
    days > 0  ? `Réinitialisation dans ${days}j ${hours}h` :
    hours > 0 ? `Réinitialisation dans ${hours}h ${minutes}min` :
                `Réinitialisation dans ${minutes} min`;

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted border border-border">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span className="text-[11px] font-bold text-muted-foreground tracking-wide">{label}</span>
    </div>
  );
};

// ─── RankSpotlight ────────────────────────────────────────────────────────────

const RankSpotlight = ({
  entry,
  rank,
  xp,
  onDone,
  currentUserImage,
}: {
  entry: LeaderboardEntry;
  rank:  number;
  xp:    number;
  onDone: () => void;
  currentUserImage?: string;
}) => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const division = getDivision(entry.points);
  const tier = getRankTier(rank, division.name);
  const countedRank = useCountUp(rank, 900, visible);

  useEffect(() => {
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setVisible(true))
    );
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const leaveTimer = setTimeout(() => setLeaving(true), 3000);
    const doneTimer  = setTimeout(() => onDone(),         3400);
    return () => { clearTimeout(leaveTimer); clearTimeout(doneTimer); };
  }, [onDone]);

  const isTop3 = rank <= 3;
  const displayImage = currentUserImage || entry.userImageSrc;

  const content = (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        display: "flex", alignItems: "center", justifyContent: "center",
        backgroundColor: tier.overlay,
        backdropFilter: "blur(6px)",
        opacity: leaving ? 0 : visible ? 1 : 0,
        transition: leaving
          ? "opacity 0.4s ease"
          : "opacity 0.35s ease, background-color 0.6s ease",
        pointerEvents: leaving ? "none" : "all",
        colorScheme: "dark",
      }}
      onClick={() => { setLeaving(true); setTimeout(onDone, 400); }}
    >
      <style>{`
        @keyframes rankPop {
          0%   { transform: scale(0.3) rotate(-8deg); opacity: 0; }
          45%  { transform: scale(1.25) rotate(4deg); opacity: 1; }
          70%  { transform: scale(0.92) rotate(-2deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .rank-pop { animation: rankPop 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
      `}</style>

      <div
        style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
          transform: leaving
            ? "scale(0.92) translateY(12px)"
            : visible ? "scale(1) translateY(0)" : "scale(0.88) translateY(20px)",
          transition: leaving
            ? "transform 0.4s cubic-bezier(0.4,0,0.2,1)"
            : "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.7)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
          Votre classement
        </div>

        <div
          className="rank-pop"
          style={{
            fontSize: 96, fontWeight: 900, lineHeight: 1, letterSpacing: "-4px",
            color: tier.from,
            textShadow: `0 0 30px ${tier.glow}, 0 0 60px ${tier.glow}66, 0 4px 12px rgba(0,0,0,0.4)`,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          #{countedRank}
        </div>

        {isTop3 && (
          <Image src={medalImages[rank - 1]} alt={`#${rank}`} width={56} height={56} className="drop-shadow-xl rank-pop" />
        )}

        <div
          style={{
            display: "flex", alignItems: "center", gap: 14,
            backgroundColor: "rgba(255,255,255,0.12)",
            border: `1.5px solid ${tier.glow}55`,
            borderRadius: 20, padding: "14px 22px",
            backdropFilter: "blur(8px)", minWidth: 240,
          }}
        >
          <Avatar className="h-12 w-12 border-2 shadow-md" style={{ borderColor: `${tier.glow}80` }}>
            <AvatarImage className="object-cover" src={displayImage} alt={entry.userName} />
          </Avatar>
          <div>
            <p style={{ color: "#fff", fontWeight: 800, fontSize: 16, margin: 0 }}>{entry.userName}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
              <Image src={division.image} alt={division.name} width={13} height={13} />
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: 600 }}>{division.name}</span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>·</span>
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: 700 }}>{xp} XP</span>
            </div>
          </div>
        </div>

        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 500, marginTop: 4 }}>
          Appuie pour continuer
        </p>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

// ─── XpBar ────────────────────────────────────────────────────────────────────

const XpBar = ({
  xp,
  maxXp,
  barColor,
  visible,
}: {
  xp:       number;
  maxXp:    number;
  barColor: string;
  visible:  boolean;
}) => {
  const pct = maxXp > 0 ? Math.max(4, Math.round((xp / maxXp) * 100)) : 4;
  return (
    <div className="w-full h-1 rounded-full bg-muted mt-1.5 overflow-hidden">
      <div
        className={`h-full rounded-full ${barColor} transition-all duration-700 ease-out`}
        style={{ width: visible ? `${pct}%` : "0%" }}
      />
    </div>
  );
};

// ─── AnimatedRow ──────────────────────────────────────────────────────────────

const AnimatedRow = ({
  entry,
  index,
  isCurrentUser,
  tab,
  maxXp,
  currentUserImage,
}: {
  entry:        LeaderboardEntry;
  index:        number;
  isCurrentUser: boolean;
  tab:          Tab;
  maxXp:        number;
  currentUserImage?: string;
}) => {
  const [visible, setVisible] = useState(false);
  const prevTab = useRef(tab);

  useEffect(() => {
    const tabChanged = prevTab.current !== tab;
    prevTab.current = tab;

    setVisible(false);
    let timeoutId: ReturnType<typeof setTimeout>;
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const delay = tabChanged ? index * 60 : index * 80;
        timeoutId = setTimeout(() => setVisible(true), delay);
      });
    });
    return () => { cancelAnimationFrame(rafId); clearTimeout(timeoutId); };
  }, [index, tab]);

  const xp          = tab === "weekly" ? entry.weeklyPoints : entry.points;
  const division    = getDivision(entry.points);
  const currentMonday  = getCurrentMondayISO();

  const isInactiveThisWeek =
    tab === "weekly" &&
    entry.weeklyPoints === 0 &&
    entry.weeklyResetDate !== currentMonday;

  const displayImage = isCurrentUser && currentUserImage ? currentUserImage : entry.userImageSrc;

  return (
    <div
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? "translateY(0)" : "translateY(14px)",
        transition: `opacity 0.35s ease ${index * 30}ms, transform 0.35s ease ${index * 30}ms`,
      }}
      className={`flex items-center w-full px-4 py-3 rounded-2xl transition-colors
        ${isCurrentUser
          ? "bg-muted/80 dark:bg-muted/40 ring-1 ring-border"
          : "hover:bg-muted/40"}
      `}
    >
      {/* Rang */}
      <div className="w-8 shrink-0 flex items-center justify-center">
        {index < 3 ? (
          <Image src={medalImages[index]} alt={`#${index + 1}`} width={28} height={28} />
        ) : (
          <span className={`font-extrabold text-sm ${isCurrentUser ? "text-foreground" : "text-muted-foreground"}`}>
            {index + 1}
          </span>
        )}
      </div>

      {/* Avatar */}
      <Avatar className="h-11 w-11 mx-3 shrink-0">
        <AvatarImage className="object-cover" src={displayImage} alt={entry.userName} />
      </Avatar>

      {/* Nom + barre */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <p className={`font-bold text-sm truncate ${isCurrentUser ? "text-foreground" : "text-foreground/90"}`}>
            {entry.userName}
          </p>
          {/* Badge division */}
          <div className="shrink-0 flex items-center gap-0.5">
            <Image src={division.image} alt={division.name} width={12} height={12} />
          </div>
        </div>

        {isInactiveThisWeek ? (
          <p className="text-[10px] text-muted-foreground mt-0.5">Pas encore actif cette semaine</p>
        ) : (
          <XpBar xp={xp} maxXp={maxXp} barColor={division.barColor} visible={visible} />
        )}
      </div>

      {/* XP */}
      <span className={`ml-3 text-sm font-bold tabular-nums shrink-0 ${
        isCurrentUser ? "text-foreground" : "text-muted-foreground"
      }`}>
        {xp} XP
      </span>
    </div>
  );
};

// ─── LeaderboardClient ────────────────────────────────────────────────────────

export const LeaderboardClient = ({ leaderboard, currentUserId }: Props) => {
  const { user } = useUser();
  const [mounted,       setMounted]       = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [tab,           setTab]           = useState<Tab>("alltime");

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setShowSpotlight(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const sorted = [...leaderboard].sort((a, b) => {
    if (tab === "weekly") return b.weeklyPoints - a.weeklyPoints;
    return b.points - a.points;
  });

  const maxXp = sorted.length > 0
    ? (tab === "weekly" ? sorted[0].weeklyPoints : sorted[0].points)
    : 1;

  const currentUserEntry = sorted.find(e => e.userId === currentUserId);
  const currentUserRank  = currentUserEntry
    ? sorted.findIndex(e => e.userId === currentUserId) + 1
    : null;

  const spotlightXp = currentUserEntry
    ? (tab === "weekly" ? currentUserEntry.weeklyPoints : currentUserEntry.points)
    : 0;

  if (!mounted) return (
    <div className="w-full space-y-2">
      {leaderboard.map((entry) =>
        entry.userId && (
          <div key={entry.userId} className="w-full h-[68px] rounded-2xl bg-muted animate-pulse" />
        )
      )}
    </div>
  );

  return (
    <>
      {showSpotlight && currentUserEntry && currentUserRank && (
        <RankSpotlight
          entry={currentUserEntry}
          rank={currentUserRank}
          xp={spotlightXp}
          onDone={() => setShowSpotlight(false)}
          currentUserImage={user?.imageUrl}
        />
      )}

      {/* Onglets */}
      <div className="w-full flex items-center justify-between mb-4 gap-3">
        <div className="flex gap-2 p-1 rounded-xl bg-muted border border-border">
          {(["alltime", "weekly"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all duration-200 ${
                tab === t
                  ? "bg-white dark:bg-slate-800 text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "alltime" ? "Tout le temps" : "Cette semaine"}
            </button>
          ))}
        </div>

        {tab === "weekly" && <CountdownBadge />}
      </div>

      {/* Liste */}
      <div className="w-full space-y-1.5">
        {sorted.map((entry, index) => {
          if (!entry.userId) return null;
          return (
            <AnimatedRow
              key={entry.userId}
              entry={entry}
              index={index}
              isCurrentUser={entry.userId === currentUserId}
              tab={tab}
              maxXp={maxXp}
              currentUserImage={user?.imageUrl}
            />
          );
        })}
      </div>
    </>
  );
};