import Link from "next/link";
import Image from "next/image";

import { quests } from "@/constants";

type Props = {
  points: number;
  streak?: number;
  lessonsCompleted?: number;
  challengesCompleted?: number;
};

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

const categories = ["xp", "streak", "lessons"] as const;

export const Quests = ({
  points,
  streak = 0,
  lessonsCompleted = 0,
  challengesCompleted = 0,
}: Props) => {

  // 1 quête par catégorie : première non complétée, sinon la dernière
  const dailyQuests = categories.map((cat) => {
    const catQuests = quests.filter((q) => q.type === cat);
    return (
      catQuests.find((q) => {
        const val = getUserValue(q.type, points, streak, lessonsCompleted, challengesCompleted);
        return val < q.value;
      }) ?? catQuests[catQuests.length - 1]
    );
  }).filter(Boolean);

  return (
    <div className="rounded-2xl bg-card border-2 border-b-4 border-border shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-extrabold text-lg text-foreground text-gray-600">
          Quêtes du jour
        </h3>
        <Link
          href="/quests"
          className="text-xs font-extrabold tracking-wide text-sky-400 hover:text-sky-500 transition-colors uppercase"
        >
          Afficher tout
        </Link>
      </div>

      {/* Quest rows */}
      <div className="flex flex-col gap-3">
        {dailyQuests.map((quest) => {
          const userVal  = getUserValue(quest.type, points, streak, lessonsCompleted, challengesCompleted);
          const progress = Math.min((userVal / quest.value) * 100, 100);
          const done     = userVal >= quest.value;

          return (
            <div key={quest.title} className="flex items-center gap-3">
              {/* Icône catégorie */}
              <div className="shrink-0">
                <Image
                  src={questIcon[quest.type] ?? "/xp-bolt.svg"}
                  alt={quest.title}
                  width={36}
                  height={36}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold text-foreground mb-1.5">
                  {quest.title}
                </p>

                {/* Progress bar */}
                <div className="relative h-5 rounded-full bg-muted border border-border overflow-hidden">
                  {progress > 0 && (
                    <div
                      className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                      style={{ width: `${progress}%`, backgroundColor: "#fbbf24" }}
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-gray-500 tabular-nums">
                      {Math.min(userVal, quest.value)} / {quest.value}
                    </span>
                  </div>
                </div>
              </div>

              {/* Coffre */}
              <div className="shrink-0">
                <Image
                  src={done ? "/quete6.svg" : "/quete7.svg"}
                  alt="Récompense"
                  width={36}
                  height={36}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};