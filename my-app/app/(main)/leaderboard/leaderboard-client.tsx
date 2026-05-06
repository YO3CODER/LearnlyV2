"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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
};

// ─── Medals ───────────────────────────────────────────────────────────────────

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
      <svg
        width="10" height="10" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
        className="text-muted-foreground"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span className="text-[11px] font-bold text-muted-foreground tracking-wide">
        {label}
      </span>
    </div>
  );
};

// ─── AnimatedRow ──────────────────────────────────────────────────────────────

const AnimatedRow = ({ entry, index }: { entry: LeaderboardEntry; index: number }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Double RAF pour garantir que le DOM initial est peint à opacity:0
    // avant de déclencher la transition
    let timeoutId: ReturnType<typeof setTimeout>;
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        timeoutId = setTimeout(() => setVisible(true), index * 100);
      });
    });
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, [index]);

  const isTop3        = index < 3;
  const entryDivision = getDivision(entry.points);

  return (
    <div
      style={{
        opacity:   visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.96)",
        transition: "opacity 0.5s cubic-bezier(0.34,1.56,0.64,1), transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",
      }}
      className={`flex items-center w-full p-3 px-4 rounded-2xl border-2 border-b-4
        ${isTop3
          ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
          : "hover:bg-muted border-transparent"
        }`}
    >
      {/* Rank */}
      <div className="w-8 flex items-center justify-center shrink-0">
        {isTop3 ? (
          <Image
            src={medalImages[index]}
            alt={`Médaille ${index + 1}`}
            width={24}
            height={24}
            className="drop-shadow-md"
          />
        ) : (
          <span className="font-extrabold text-sm text-muted-foreground">
            {index + 1}
          </span>
        )}
      </div>

      {/* Avatar */}
      <Avatar className="h-11 w-11 ml-3 mr-4 border-2 border-border shadow-sm">
        <AvatarImage
          className="object-cover"
          src={entry.userImageSrc}
          alt={entry.userName}
        />
      </Avatar>

      {/* Name + Division */}
      <div className="flex-1">
        <p className="font-extrabold text-foreground text-sm">{entry.userName}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <Image
            src={entryDivision.image}
            alt={entryDivision.name}
            width={12}
            height={12}
            className="drop-shadow-sm"
          />
          <span className={`text-[10px] font-semibold ${entryDivision.color}`}>
            {entryDivision.name}
          </span>
        </div>
      </div>

      {/* XP */}
      <div className={`flex items-center gap-x-1.5 px-3 py-1 rounded-xl text-xs font-extrabold
        ${isTop3
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

export const LeaderboardClient = ({ leaderboard }: Props) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // On ne rend rien côté SSR pour éviter le flash "déjà visible"
  if (!mounted) return (
    <div className="w-full space-y-2">
      {leaderboard.map((entry) => (
        entry.userId && (
          <div
            key={entry.userId}
            className="w-full h-[68px] rounded-2xl bg-muted animate-pulse"
          />
        )
      ))}
    </div>
  );

  return (
    <>
      {/* Countdown */}
      <div className="w-full flex justify-end mb-3">
        <CountdownBadge />
      </div>

      {/* Liste animée */}
      <div className="w-full space-y-2">
        {leaderboard.map((entry, index) => {
          if (!entry.userId) return null;
          return (
            <AnimatedRow
              key={entry.userId}
              entry={entry}
              index={index}
            />
          );
        })}
      </div>
    </>
  );
};