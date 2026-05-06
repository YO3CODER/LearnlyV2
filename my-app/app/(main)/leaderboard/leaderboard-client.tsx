"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

// ─── getDivision ──────────────────────────────────────────────────────────────

const divisionImages = {
  Legendary: "/legendary.svg",
  Diamond:   "/diamond.svg",
  Platinum:  "/platinum.svg",
  Gold:      "/gold.svg",
};

type Division = {
  name: string;
  image: string;
  color: string;
  bg: string;
  border: string;
  barColor: string;
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
  userId: string | null;
  userName: string;
  userImageSrc: string;
  points: number;
};

type Props = {
  leaderboard: LeaderboardEntry[];
  currentUserId: string | null;
};

const medalImages = ["/first.svg", "/seconds.svg", "/troisieme.svg"];

// ─── Weekly countdown ─────────────────────────────────────────────────────────

const useWeeklyCountdown = () => {
  const getTimeLeft = () => {
    const now    = new Date();
    const sunday = new Date(now);
    const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
    sunday.setDate(now.getDate() + daysUntilSunday);
    sunday.setHours(0, 0, 0, 0);
    const diff = sunday.getTime() - now.getTime();
    return {
      days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours:   Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
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
// Overlay plein écran qui affiche le rang de l'utilisateur pendant 3 secondes

const RankSpotlight = ({
  entry,
  rank,
  onDone,
}: {
  entry: LeaderboardEntry;
  rank: number;
  onDone: () => void;
}) => {
  const [visible,  setVisible]  = useState(false);
  const [leaving,  setLeaving]  = useState(false);
  const division = getDivision(entry.points);

  // Apparition
  useEffect(() => {
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setVisible(true))
    );
    return () => cancelAnimationFrame(raf);
  }, []);

  // Disparition après 3s
  useEffect(() => {
    const leaveTimer = setTimeout(() => setLeaving(true), 3000);
    const doneTimer  = setTimeout(() => onDone(),         3400);
    return () => { clearTimeout(leaveTimer); clearTimeout(doneTimer); };
  }, [onDone]);

  const isTop3 = rank <= 3;

  const content = (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
        opacity:   leaving ? 0 : visible ? 1 : 0,
        transition: leaving
          ? "opacity 0.4s ease"
          : "opacity 0.35s ease",
        pointerEvents: leaving ? "none" : "all",
      }}
      onClick={() => { setLeaving(true); setTimeout(onDone, 400); }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          transform: leaving ? "scale(0.92) translateY(12px)" : visible ? "scale(1) translateY(0)" : "scale(0.88) translateY(20px)",
          transition: leaving
            ? "transform 0.4s cubic-bezier(0.4,0,0.2,1)"
            : "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Badge rang */}
        <div style={{
          fontSize: 13,
          fontWeight: 800,
          color: "rgba(255,255,255,0.7)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}>
          Votre classement
        </div>

        {/* Numéro de rang */}
        <div style={{
          fontSize: 96,
          fontWeight: 900,
          color: "#ffffff",
          lineHeight: 1,
          letterSpacing: "-4px",
          textShadow: "0 4px 32px rgba(0,0,0,0.4)",
          fontVariantNumeric: "tabular-nums",
        }}>
          #{rank}
        </div>

        {/* Médaille si top 3 */}
        {isTop3 && (
          <Image
            src={medalImages[rank - 1]}
            alt={`#${rank}`}
            width={56}
            height={56}
            className="drop-shadow-xl"
          />
        )}

        {/* Card utilisateur */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          backgroundColor: "rgba(255,255,255,0.12)",
          border: "1.5px solid rgba(255,255,255,0.2)",
          borderRadius: 20,
          padding: "14px 22px",
          backdropFilter: "blur(8px)",
          minWidth: 240,
        }}>
          <Avatar className="h-12 w-12 border-2 border-white/30 shadow-md">
            <AvatarImage className="object-cover" src={entry.userImageSrc} alt={entry.userName} />
          </Avatar>
          <div>
            <p style={{ color: "#fff", fontWeight: 800, fontSize: 16, margin: 0 }}>
              {entry.userName}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
              <Image src={division.image} alt={division.name} width={13} height={13} />
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: 600 }}>
                {division.name}
              </span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>·</span>
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: 700 }}>
                {entry.points} XP
              </span>
            </div>
          </div>
        </div>

        {/* Hint */}
        <p style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: 12,
          fontWeight: 500,
          marginTop: 4,
        }}>
          Appuie pour continuer
        </p>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

// ─── AnimatedRow ──────────────────────────────────────────────────────────────

const AnimatedRow = ({
  entry,
  index,
  isCurrentUser,
}: {
  entry: LeaderboardEntry;
  index: number;
  isCurrentUser: boolean;
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        timeoutId = setTimeout(() => setVisible(true), index * 100);
      });
    });
    return () => { cancelAnimationFrame(rafId); clearTimeout(timeoutId); };
  }, [index]);

  const isTop3        = index < 3;
  const entryDivision = getDivision(entry.points);

  return (
    <div
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.96)",
        transition: "opacity 0.5s cubic-bezier(0.34,1.56,0.64,1), transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",
      }}
      className={`flex items-center w-full p-3 px-4 rounded-2xl border-2 border-b-4 transition-colors
        ${isCurrentUser
          ? "bg-blue-100 dark:bg-blue-900/40 border-blue-400 dark:border-blue-600 ring-2 ring-blue-400/30"
          : isTop3
          ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
          : "hover:bg-muted border-transparent"
        }`}
    >
      {/* Rank */}
      <div className="w-8 flex items-center justify-center shrink-0">
        {isTop3 ? (
          <Image src={medalImages[index]} alt={`Médaille ${index + 1}`} width={24} height={24} className="drop-shadow-md" />
        ) : (
          <span className="font-extrabold text-sm text-muted-foreground">{index + 1}</span>
        )}
      </div>

      {/* Avatar */}
      <Avatar className="h-11 w-11 ml-3 mr-4 border-2 border-border shadow-sm">
        <AvatarImage className="object-cover" src={entry.userImageSrc} alt={entry.userName} />
      </Avatar>

      {/* Name + Division */}
      <div className="flex-1">
        <div className="flex items-center gap-1.5">
          <p className="font-extrabold text-foreground text-sm">{entry.userName}</p>
          {isCurrentUser && (
            <span className="text-[9px] font-bold bg-blue-500 text-white px-1.5 py-0.5 rounded-full uppercase tracking-wide">
              Vous
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <Image src={entryDivision.image} alt={entryDivision.name} width={12} height={12} className="drop-shadow-sm" />
          <span className={`text-[10px] font-semibold ${entryDivision.color}`}>
            {entryDivision.name}
          </span>
        </div>
      </div>

      {/* XP */}
      <div className={`flex items-center gap-x-1.5 px-3 py-1 rounded-xl text-xs font-extrabold
        ${isCurrentUser
          ? "bg-blue-500 text-white"
          : isTop3
          ? "bg-blue-100 dark:bg-blue-900/50 text-blue-500"
          : "bg-muted text-muted-foreground"
        }`}
      >
        <Image src="/xp-bolt.svg" alt="XP" width={12} height={12} />
        {entry.points} XP
      </div>
    </div>
  );
};

// ─── LeaderboardClient ────────────────────────────────────────────────────────

export const LeaderboardClient = ({ leaderboard, currentUserId }: Props) => {
  const [mounted,         setMounted]         = useState(false);
  const [showSpotlight,   setShowSpotlight]   = useState(false);

  useEffect(() => {
    setMounted(true);
    // Lance le spotlight après que les animations de liste soient bien engagées
    const timer = setTimeout(() => setShowSpotlight(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const currentUserEntry = leaderboard.find(e => e.userId === currentUserId);
  const currentUserRank  = currentUserEntry
    ? leaderboard.findIndex(e => e.userId === currentUserId) + 1
    : null;

  if (!mounted) return (
    <div className="w-full space-y-2">
      {leaderboard.map((entry) => (
        entry.userId && (
          <div key={entry.userId} className="w-full h-[68px] rounded-2xl bg-muted animate-pulse" />
        )
      ))}
    </div>
  );

  return (
    <>
      {/* Spotlight rang utilisateur */}
      {showSpotlight && currentUserEntry && currentUserRank && (
        <RankSpotlight
          entry={currentUserEntry}
          rank={currentUserRank}
          onDone={() => setShowSpotlight(false)}
        />
      )}

      {/* Countdown */}
      <div className="w-full flex justify-end mb-3">
        <CountdownBadge />
      </div>

      {/* Liste */}
      <div className="w-full space-y-2">
        {leaderboard.map((entry, index) => {
          if (!entry.userId) return null;
          return (
            <AnimatedRow
              key={entry.userId}
              entry={entry}
              index={index}
              isCurrentUser={entry.userId === currentUserId}
            />
          );
        })}
      </div>
    </>
  );
};