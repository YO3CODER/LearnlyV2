import Image from "next/image";
import { redirect } from "next/navigation";
import { Clock } from "lucide-react";

import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { Promo } from "@/components/promo";
import { quests } from "@/constants";

const getUserValue = (
  type: string, points: number, streak: number,
  lessonsCompleted: number, challengesCompleted: number
) => {
  if (type === "xp")         return points;
  if (type === "streak")     return streak;
  if (type === "lessons")    return lessonsCompleted;
  if (type === "challenges") return challengesCompleted;
  return 0;
};

const questIcon: Record<string, string> = {
  xp:         "/xp-bolt.svg",
  streak:     "/streak.svg",
  lessons:    "/book.svg",
  challenges: "/challenge.svg",
};

const categories = ["xp", "streak", "lessons", "challenges"] as const;

const animStyles = `
  @keyframes fillBar {
    from { width: 0%; }
  }
  @keyframes slideUp {
    from { opacity:0; transform: translateY(16px); }
    to   { opacity:1; transform: translateY(0);    }
  }
  @keyframes popIn {
    0%   { opacity:0; transform: scale(0.88); }
    70%  { transform: scale(1.03);            }
    100% { opacity:1; transform: scale(1);    }
  }

  .quest-item {
    animation: popIn 0.35s cubic-bezier(0.34,1.28,0.64,1) both;
  }
  .progress-bar {
    animation: fillBar 1s cubic-bezier(0.4,0,0.2,1) both;
  }
  .fade-up {
    animation: slideUp 0.4s cubic-bezier(0.4,0,0.2,1) both;
  }
`;

const QuestsPage = async () => {
  const [userProgress, userSubscription] = await Promise.all([
    getUserProgress(),
    getUserSubscription(),
  ]);

  if (!userProgress || !userProgress.activeCourse) redirect("/courses");

  const isPro               = !!userSubscription?.isActive;
  const streak              = userProgress.streak             ?? 0;
  const lessonsCompleted    = userProgress.lessonsCompleted   ?? 0;
  const challengesCompleted = userProgress.challengesCompleted ?? 0;

  // 1 quête par catégorie : la première non complétée, sinon la dernière de la catégorie
  const dailyQuests = categories.map((cat) => {
    const catQuests = quests.filter((q) => q.type === cat);
    const active = catQuests.find((q) => {
      const val = getUserValue(q.type, userProgress.points, streak, lessonsCompleted, challengesCompleted);
      return val < q.value;
    }) ?? catQuests[catQuests.length - 1];
    return active;
  }).filter(Boolean);

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <style dangerouslySetInnerHTML={{ __html: animStyles }} />

      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={isPro}
          streak={userProgress.streak ?? 0}
        />
        {!isPro && <Promo />}
      </StickyWrapper>

      <FeedWrapper>
        <div className="w-full flex flex-col">

          {/* ── En-tête ───────────────────────────────────────────────── */}
          <h1
            className="font-extrabold text-foreground text-2xl mb-1 fade-up"
            style={{ animationDelay: "0s" }}
          >
            Quêtes du jour
          </h1>
          <div
            className="flex items-center gap-1.5 text-orange-500 font-bold text-sm mb-6 fade-up"
            style={{ animationDelay: "0.06s" }}
          >
            <Clock className="w-4 h-4" />
            <span>3 HEURES</span>
          </div>

          {/* ── Liste des quêtes ──────────────────────────────────────── */}
          <ul className="flex flex-col gap-3">
            {dailyQuests.map((quest, idx) => {
              const userVal  = getUserValue(quest.type, userProgress.points, streak, lessonsCompleted, challengesCompleted);
              const progress = Math.min((userVal / quest.value) * 100, 100);
              const done     = userVal >= quest.value;

              return (
                <li
                  key={quest.title}
                  className="quest-item w-full rounded-2xl border-2 border-b-4 border-border bg-background px-3 py-3 flex items-center gap-3"
                  style={{ animationDelay: `${0.08 + idx * 0.07}s` }}
                >
                  {/* Icône catégorie */}
                  <div className="shrink-0">
                    <Image
                      src={questIcon[quest.type] ?? "/xp-bolt.svg"}
                      alt={quest.title}
                      width={32}
                      height={32}
                    />
                  </div>

                  {/* Contenu */}
                  <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <p className="font-bold text-foreground text-sm leading-tight">
                      {quest.title}
                    </p>

                    {/* Barre + coffre */}
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1 h-4 bg-muted rounded-full overflow-hidden border border-border">
                        <div
                          className="progress-bar h-full rounded-full"
                          style={{
                            width: `${progress}%`,
                            backgroundColor: "#fbbf24",
                            animationDelay: `${0.15 + idx * 0.07}s`,
                          }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground/60 tabular-nums">
                          {Math.min(userVal, quest.value)} / {quest.value}
                        </span>
                      </div>

                      {/* Coffre : quete6 si terminé, quete7 sinon */}
                      <div className="shrink-0">
                        <Image
                          src={done ? "/quete6.svg" : "/quete7.svg"}
                          alt="Récompense"
                          width={28}
                          height={28}
                        />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

        </div>
      </FeedWrapper>
    </div>
  );
};

export default QuestsPage;