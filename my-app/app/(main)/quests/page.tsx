import Image from "next/image";
import { redirect } from "next/navigation";
import { Clock } from "lucide-react";

import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { Promo } from "@/components/promo";
import { quests } from "@/constants";

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Sélection quotidienne des quêtes ─────────────────────────────────────────

const getDailyQuests = (
  points: number,
  streak: number,
  lessonsCompleted: number,
  challengesCompleted: number,
  count = 4
) => {
  const today = new Date();
  const seed  = parseInt(
    `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`
  );

  let rng = seed;
  const rand = () => {
    rng = (rng * 1664525 + 1013904223) & 0xffffffff;
    return (rng >>> 0) / 0xffffffff;
  };

  const active: typeof quests = [];
  const done:   typeof quests = [];

  for (const q of quests) {
    const val = getUserValue(q.type, points, streak, lessonsCompleted, challengesCompleted);
    if (val >= q.value) done.push(q);
    else active.push(q);
  }

  const pool = active.length >= count ? active : [...active, ...done];

  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const selected: typeof quests = [];
  const usedTypes = new Set<string>();

  for (const q of shuffled) {
    if (selected.length >= count) break;
    if (!usedTypes.has(q.type)) {
      selected.push(q);
      usedTypes.add(q.type);
    }
  }

  for (const q of shuffled) {
    if (selected.length >= count) break;
    if (!selected.includes(q)) selected.push(q);
  }

  return selected;
};

// ─── Temps restant jusqu'à minuit ─────────────────────────────────────────────

const getTimeUntilMidnight = () => {
  const now      = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const ms      = midnight.getTime() - now.getTime();
  const hours   = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}min`;
  return `${minutes} min`;
};

// ─── Animations ───────────────────────────────────────────────────────────────

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
  .quest-item   { animation: popIn   0.35s cubic-bezier(0.34,1.28,0.64,1) both; }
  .progress-bar { animation: fillBar 1s   cubic-bezier(0.4,0,0.2,1)       both; }
  .fade-up      { animation: slideUp 0.4s cubic-bezier(0.4,0,0.2,1)       both; }
`;

// ─── Page ─────────────────────────────────────────────────────────────────────

const QuestsPage = async () => {
  const [userProgress, userSubscription] = await Promise.all([
    getUserProgress(),
    getUserSubscription(),
  ]);

  if (!userProgress || !userProgress.activeCourse) redirect("/courses");

  const isPro               = !!userSubscription?.isActive;
  const streak              = userProgress.streak              ?? 0;
  const lessonsCompleted    = userProgress.lessonsCompleted    ?? 0;
  const challengesCompleted = userProgress.challengesCompleted ?? 0;

  const dailyQuests = getDailyQuests(
    userProgress.points,
    streak,
    lessonsCompleted,
    challengesCompleted
  );

  const timeLeft = getTimeUntilMidnight();

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
            <span>Se renouvelle dans {timeLeft}</span>
          </div>

          {/* ── Liste des quêtes ──────────────────────────────────────── */}
          <ul className="flex flex-col gap-3">
            {dailyQuests.map((quest, idx) => {
              const userVal  = getUserValue(
                quest.type, userProgress.points, streak,
                lessonsCompleted, challengesCompleted
              );
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

                    {/* Description */}
                    <p className="text-[11px] text-muted-foreground leading-tight">
                      {quest.description}
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

                      {/* Coffre ouvert si terminé */}
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

          {/* ── Note de renouvellement ────────────────────────────────── */}
          <p
            className="text-center text-xs text-muted-foreground mt-6 fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            Les quêtes se renouvellent chaque jour à minuit
          </p>

        </div>
      </FeedWrapper>
    </div>
  );
};

export default QuestsPage;