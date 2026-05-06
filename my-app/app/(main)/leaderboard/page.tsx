import Image from "next/image";
import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { getTopTenUsers, getUserProgress, getUserSubscription } from "@/db/queries";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import { LeaderboardClient } from "./leaderboard-client";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

const divisionImages = {
  Legendary: "/legendary.svg",
  Diamond:   "/diamond.svg",
  Platinum:  "/platinum.svg",
  Gold:      "/gold.svg",
};

const legendImages = {
  Gold:      "/gold.svg",
  Platinum:  "/platinum.svg",
  Diamond:   "/diamond.svg",
  Legendary: "/legendary.svg",
};

const getDivision = (points: number) => {
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

const getNextThreshold = (points: number) => {
  if (points >= 5000) return null;
  if (points >= 3000) return { name: "Légendaire", required: 5000 };
  if (points >= 2000) return { name: "Diamant",    required: 3000 };
  return                     { name: "Platine",    required: 2000 };
};

const getPrevThreshold = (points: number) => {
  if (points >= 5000) return 3000;
  if (points >= 3000) return 2000;
  if (points >= 2000) return 1000;
  return 0;
};

const LeaderboardPage = async () => {
  const { userId } = await auth();

  const [userProgress, userSubscription, leaderboard] = await Promise.all([
    getUserProgress(),
    getUserSubscription(),
    getTopTenUsers(),
  ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  const isPro           = !!userSubscription?.isActive;
  const division        = getDivision(userProgress.points);
  const nextDiv         = getNextThreshold(userProgress.points);
  const prevThreshold   = getPrevThreshold(userProgress.points);
  const progressPercent = nextDiv
    ? Math.min(100, Math.round(
        ((userProgress.points - prevThreshold) / (nextDiv.required - prevThreshold)) * 100
      ))
    : 100;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={isPro}
          streak={userProgress.streak ?? 0}
        />
        {!isPro && <Promo />}
        <Quests points={userProgress.points} />
      </StickyWrapper>

      <FeedWrapper>
        <div className="w-full flex flex-col items-center">

          {/* ── Header ── */}
          <div className="relative mb-2">
            <div className="absolute inset-0 bg-blue-200/30 dark:bg-blue-800/20 rounded-full blur-xl scale-150" />
            <Image
              src="/leaderboard.ico"
              alt="Classement"
              height={90}
              width={90}
              className="relative drop-shadow-md"
            />
          </div>

          <p className="text-xs font-semibold tracking-widest uppercase text-blue-400 mb-1">
            Classement
          </p>
          <h1 className="font-extrabold text-foreground text-3xl tracking-tight mb-1">
            Classement
          </h1>
          <p className="text-muted-foreground text-center text-sm mb-6 max-w-sm">
            Découvre ta position parmi les autres apprenants de la communauté.
          </p>

          {/* ── Division Card ── */}
          <div className={`w-full rounded-2xl border-2 border-b-4 ${division.border} ${division.bg} p-4 mb-6`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-xl bg-background shadow-sm border-2 border-b-4 ${division.border}`}>
                <Image src={division.image} alt={division.name} width={24} height={24} className="drop-shadow-sm" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Votre division</p>
                <p className={`font-extrabold text-lg ${division.color}`}>{division.name}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-muted-foreground font-medium">Points</p>
                <p className="font-extrabold text-foreground text-lg">{userProgress.points} XP</p>
              </div>
            </div>

            {nextDiv && (
              <>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{division.name}</span>
                  <span>{nextDiv.name} — {nextDiv.required} XP</span>
                </div>
                <div className="w-full h-2.5 bg-background rounded-full overflow-hidden border border-border">
                  <div
                    className={`h-full rounded-full ${division.barColor} transition-all duration-700`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {nextDiv.required - userProgress.points} XP pour atteindre {nextDiv.name}
                </p>
              </>
            )}

            {!nextDiv && (
              <div className="flex items-center gap-2 mt-1">
                <Image src="/legendary.svg" alt="Légendaire" width={16} height={16} />
                <p className="text-xs font-bold text-yellow-600 dark:text-yellow-400">
                  Vous avez atteint la division maximale !
                </p>
              </div>
            )}
          </div>

          {/* ── Légende des divisions ── */}
          <div className="w-full mb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              Divisions
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { name: "Or",         image: legendImages.Gold,      req: "0 XP"    },
                { name: "Platine",    image: legendImages.Platinum,  req: "2000 XP" },
                { name: "Diamant",    image: legendImages.Diamond,   req: "3000 XP" },
                { name: "Légendaire", image: legendImages.Legendary, req: "5000 XP" },
              ].map(({ name, image, req }) => {
                const isCurrentDivision = division.name === name;
                return (
                  <div
                    key={name}
                    className={`flex flex-col items-center p-2 rounded-xl border-2 border-b-4 text-center transition-all
                      ${isCurrentDivision
                        ? "border-primary bg-blue-50 dark:bg-blue-950/30 shadow-sm scale-105"
                        : "border-border bg-card opacity-60"
                      }`}
                  >
                    <Image src={image} alt={name} width={20} height={20} className="mb-1 drop-shadow-sm" />
                    <p className="text-[10px] font-bold text-foreground">{name}</p>
                    <p className="text-[9px] text-muted-foreground">{req}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="h-px w-full bg-border mb-6 rounded-full" />

          <div className="w-full flex items-center justify-between mb-4">
            <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
              Classement
            </p>
          </div>

          <LeaderboardClient
            leaderboard={leaderboard}
            currentUserId={userId}
          />

        </div>
      </FeedWrapper>
    </div>
  );
};

export default LeaderboardPage;