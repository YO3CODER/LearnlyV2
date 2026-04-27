import Image from "next/image";
import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { getTopTenUsers, getUserProgress, getUserSubscription } from "@/db/queries";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";

export const dynamic = "force-dynamic";

const LeaderboardPage = async () => {
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();
  const leaderboardData = getTopTenUsers();

  const [
    userProgress,
    userSubscription,
    leaderboard,
  ] = await Promise.all([
    userProgressData,
    userSubscriptionData,
    leaderboardData,
  ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  const isPro = !!userSubscription?.isActive;
  const medalColors = ["🥇", "🥈", "🥉"];

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
          <div className="relative">
            <div className="absolute inset-0 bg-blue-200/30 rounded-full blur-xl scale-150" />
            <Image
              src="/leaderboard.ico"
              alt="Leaderboard"
              height={90}
              width={90}
              className="relative drop-shadow-md"
            />
          </div>

          <div className="mt-4 mb-1 text-center">
            <p className="text-xs font-semibold tracking-widest uppercase text-blue-400 mb-1">
              Rankings
            </p>
            <h1 className="font-extrabold text-slate-800 text-3xl tracking-tight">
              Leaderboard
            </h1>
          </div>
          <p className="text-slate-400 text-center text-sm mb-6 max-w-sm">
            See where you stand among other learners in the community.
          </p>

          <div className="h-px w-full bg-gradient-to-r from-blue-100 via-blue-100 to-transparent mb-6 rounded-full" />

          {/* List */}
          <div className="w-full space-y-2">
            {leaderboard.map((entry, index) => {
              if (!entry.userId) return null;

              const isTop3 = index < 3;

              return (
                <div
                  key={entry.userId}
                  className={`flex items-center w-full p-3 px-4 rounded-2xl
                    transition-all duration-200 group
                    ${isTop3
                      ? "bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-100"
                      : "hover:bg-slate-50 border border-transparent"
                    }`}
                >
                  {/* Rank */}
                  <div className="w-8 flex items-center justify-center shrink-0">
                    {isTop3 ? (
                      <span className="text-xl">{medalColors[index]}</span>
                    ) : (
                      <span className="font-extrabold text-sm text-slate-400">
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <Avatar className="h-11 w-11 ml-3 mr-4 border-2 border-white shadow-sm">
                    <AvatarImage
                      key={`avatar-${entry.userId}`}
                      className="object-cover"
                      src={entry.userImageSrc}
                      alt={entry.userName}
                    />
                  </Avatar>

                  {/* Name */}
                  <p className="font-bold text-slate-700 flex-1 text-sm">
                    {entry.userName}
                  </p>

                  {/* XP */}
                  <div className={`flex items-center gap-x-1.5 px-3 py-1 rounded-xl text-xs font-extrabold
                    ${isTop3
                      ? "bg-blue-100 text-blue-500"
                      : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <span>⚡</span>
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