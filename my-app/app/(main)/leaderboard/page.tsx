import Image from "next/image";
import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { getTopTenUsers, getUserProgress, getUserSubscription } from "@/db/queries";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import {
  StarIcon,
  ShieldCheckIcon,
  BoltIcon,
  FireIcon,
  SparklesIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/solid";

export const dynamic = "force-dynamic";

const getDivision = (points: number) => {
  if (points >= 5000) return {
    name: "Légendaire",
    Icon: SparklesIcon,
    color: "text-yellow-500",
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    border: "border-yellow-200 dark:border-slate-700",
    gradient: "from-yellow-400 to-orange-400",
    barColor: "bg-gradient-to-r from-yellow-400 to-orange-400",
  };
  if (points >= 3000) return {
    name: "Diamant",
    Icon: StarIcon,
    color: "text-cyan-500",
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
    border: "border-cyan-200 dark:border-slate-700",
    gradient: "from-cyan-400 to-blue-400",
    barColor: "bg-gradient-to-r from-cyan-400 to-blue-400",
  };
  if (points >= 2000) return {
    name: "Platine",
    Icon: ShieldCheckIcon,
    color: "text-slate-500",
    bg: "bg-slate-50 dark:bg-slate-800/50",
    border: "border-slate-200 dark:border-slate-700",
    gradient: "from-slate-400 to-slate-500",
    barColor: "bg-gradient-to-r from-slate-400 to-slate-500",
  };
  if (points >= 1000) return {
    name: "Or",
    Icon: TrophyIcon,
    color: "text-yellow-500",
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    border: "border-yellow-200 dark:border-slate-700",
    gradient: "from-yellow-300 to-yellow-500",
    barColor: "bg-gradient-to-r from-yellow-300 to-yellow-500",
  };
  if (points >= 500) return {
    name: "Argent",
    Icon: ShieldCheckIcon,
    color: "text-slate-400",
    bg: "bg-slate-50 dark:bg-slate-800/50",
    border: "border-slate-200 dark:border-slate-700",
    gradient: "from-slate-300 to-slate-400",
    barColor: "bg-gradient-to-r from-slate-300 to-slate-400",
  };
  if (points >= 100) return {
    name: "Bronze",
    Icon: FireIcon,
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    border: "border-orange-200 dark:border-slate-700",
    gradient: "from-orange-300 to-orange-400",
    barColor: "bg-gradient-to-r from-orange-300 to-orange-400",
  };
  return {
    name: "Débutant",
    Icon: ArrowTrendingUpIcon,
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-200 dark:border-slate-700",
    gradient: "from-green-300 to-green-400",
    barColor: "bg-gradient-to-r from-green-300 to-green-400",
  };
};

const getNextThreshold = (points: number) => {
  if (points >= 5000) return null;
  if (points >= 3000) return { name: "Légendaire", required: 5000 };
  if (points >= 2000) return { name: "Diamant", required: 3000 };
  if (points >= 1000) return { name: "Platine", required: 2000 };
  if (points >= 500)  return { name: "Or", required: 1000 };
  if (points >= 100)  return { name: "Argent", required: 500 };
  return { name: "Bronze", required: 100 };
};

const getPrevThreshold = (points: number) => {
  if (points >= 5000) return 3000;
  if (points >= 3000) return 2000;
  if (points >= 2000) return 1000;
  if (points >= 1000) return 500;
  if (points >= 500)  return 100;
  return 0;
};

const medalIcons = [TrophyIcon, StarIcon, BoltIcon];
const medalColors = ["text-yellow-500", "text-slate-400", "text-orange-400"];
const medalBg = ["bg-yellow-50 dark:bg-yellow-950/30", "bg-slate-50 dark:bg-slate-800", "bg-orange-50 dark:bg-orange-950/30"];

const LeaderboardPage = async () => {
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();
  const leaderboardData = getTopTenUsers();

  const [userProgress, userSubscription, leaderboard] = await Promise.all([
    userProgressData,
    userSubscriptionData,
    leaderboardData,
  ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  const isPro = !!userSubscription?.isActive;
  const division = getDivision(userProgress.points);
  const nextDiv = getNextThreshold(userProgress.points);
  const prevThreshold = getPrevThreshold(userProgress.points);
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
        />
        {!isPro && <Promo />}
        <Quests points={userProgress.points} />
      </StickyWrapper>

      <FeedWrapper>
        <div className="w-full flex flex-col items-center">

          {/* Header */}
          <div className="relative mb-2">
            <div className="absolute inset-0 bg-blue-200/30 dark:bg-blue-800/20 rounded-full blur-xl scale-150" />
            <Image
              src="/leaderboard.ico"
              alt="Leaderboard"
              height={90}
              width={90}
              className="relative drop-shadow-md"
            />
          </div>

          <p className="text-xs font-semibold tracking-widest uppercase text-blue-400 mb-1">
            Rankings
          </p>
          <h1 className="font-extrabold text-slate-800 dark:text-slate-100 text-3xl tracking-tight mb-1">
            Leaderboard
          </h1>
          <p className="text-slate-400 dark:text-slate-500 text-center text-sm mb-6 max-w-sm">
            See where you stand among other learners in the community.
          </p>

          {/* Division Card — border-2 border-b-4 comme les boutons */}
          <div className={`w-full rounded-2xl border-2 border-b-4 ${division.border} ${division.bg} p-4 mb-6`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm border-2 border-b-4 ${division.border}`}>
                <division.Icon className={`h-6 w-6 ${division.color}`} />
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Votre division</p>
                <p className={`font-extrabold text-lg ${division.color}`}>
                  {division.name}
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Points</p>
                <p className="font-extrabold text-slate-700 dark:text-slate-200 text-lg">
                  {userProgress.points} XP
                </p>
              </div>
            </div>

            {nextDiv && (
              <>
                <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mb-1">
                  <span>{division.name}</span>
                  <span>{nextDiv.name} — {nextDiv.required} XP</span>
                </div>
                <div className="w-full h-2.5 bg-white dark:bg-slate-700 rounded-full overflow-hidden border-2 border-slate-100 dark:border-slate-700">
                  <div
                    className={`h-full rounded-full ${division.barColor} transition-all duration-700`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 text-right">
                  {nextDiv.required - userProgress.points} XP pour atteindre {nextDiv.name}
                </p>
              </>
            )}

            {!nextDiv && (
              <div className="flex items-center gap-2 mt-1">
                <SparklesIcon className="h-4 w-4 text-yellow-500" />
                <p className="text-xs font-bold text-yellow-600 dark:text-yellow-400">
                  Vous avez atteint la division maximale !
                </p>
              </div>
            )}
          </div>

          {/* Divisions Legend */}
          <div className="w-full mb-6">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
              Toutes les divisions
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { name: "Débutant", Icon: ArrowTrendingUpIcon, color: "text-green-500", req: "0 XP" },
                { name: "Bronze", Icon: FireIcon, color: "text-orange-500", req: "100 XP" },
                { name: "Argent", Icon: ShieldCheckIcon, color: "text-slate-400", req: "500 XP" },
                { name: "Or", Icon: TrophyIcon, color: "text-yellow-500", req: "1000 XP" },
                { name: "Platine", Icon: ShieldCheckIcon, color: "text-slate-500", req: "2000 XP" },
                { name: "Diamant", Icon: StarIcon, color: "text-cyan-500", req: "3000 XP" },
                { name: "Légendaire", Icon: SparklesIcon, color: "text-yellow-500", req: "5000 XP" },
              ].map(({ name, Icon, color, req }) => {
                const isCurrentDivision = division.name === name;
                return (
                  <div
                    key={name}
                    className={`flex flex-col items-center p-2 rounded-xl border-2 border-b-4 text-center transition-all
                      ${isCurrentDivision
                        ? "border-blue-200 dark:border-slate-700 bg-blue-50 dark:bg-blue-950/30 shadow-sm scale-105"
                        : "border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 opacity-60"
                      }`}
                  >
                    <Icon className={`h-5 w-5 ${color} mb-1`} />
                    <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{name}</p>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500">{req}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-blue-100 via-blue-100 to-transparent dark:from-slate-700 dark:via-slate-700 mb-6 rounded-full" />

          {/* Leaderboard List */}
          <div className="w-full space-y-2">
            {leaderboard.map((entry, index) => {
              if (!entry.userId) return null;
              const isTop3 = index < 3;
              const MedalIcon = isTop3 ? medalIcons[index] : null;
              const entryDivision = getDivision(entry.points);

              return (
                <div
                  key={entry.userId}
                  className={`flex items-center w-full p-3 px-4 rounded-2xl transition-all duration-200
                    ${isTop3
                      ? "bg-gradient-to-r from-blue-50 to-blue-50 dark:from-blue-950/30 dark:to-blue-950/30 border-2 border-b-4 border-slate-200 dark:border-slate-700"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800 border-2 border-b-4 border-transparent"
                    }`}
                >
                  {/* Rank */}
                  <div className="w-8 flex items-center justify-center shrink-0">
                    {isTop3 && MedalIcon ? (
                      <div className={`p-1 rounded-lg ${medalBg[index]}`}>
                        <MedalIcon className={`h-5 w-5 ${medalColors[index]}`} />
                      </div>
                    ) : (
                      <span className="font-extrabold text-sm text-slate-400 dark:text-slate-500">
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <Avatar className="h-11 w-11 ml-3 mr-4 border-2 border-white dark:border-slate-700 shadow-sm">
                    <AvatarImage
                      className="object-cover"
                      src={entry.userImageSrc}
                      alt={entry.userName}
                    />
                  </Avatar>

                  {/* Name + Division */}
                  <div className="flex-1">
                    <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">{entry.userName}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <entryDivision.Icon className={`h-3 w-3 ${entryDivision.color}`} />
                      <span className={`text-[10px] font-semibold ${entryDivision.color}`}>
                        {entryDivision.name}
                      </span>
                    </div>
                  </div>

                  {/* XP */}
                  <div className={`flex items-center gap-x-1.5 px-3 py-1 rounded-xl text-xs font-extrabold
                    ${isTop3
                      ? "bg-blue-100 dark:bg-blue-900/50 text-blue-500"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-400"
                    }`}
                  >
                    <BoltIcon className="h-3 w-3" />
                    {entry.points} XP
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </FeedWrapper>
    </div>
  );
};

export default LeaderboardPage;