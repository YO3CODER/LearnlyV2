import Link from "next/link";
import Image from "next/image";

import { quests } from "@/constants";

type Props = {
  points: number;
};

export const Quests = ({ points }: Props) => {
  const dailyQuest = quests[0];
  const progress = Math.min((points / dailyQuest.value) * 100, 100);
  const isCompleted = progress >= 100;

  return (
    <div className="rounded-2xl bg-card border-2 border-b-4 border-border shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-extrabold text-lg text-foreground">
          Quêtes du jour
        </h3>
        <Link
          href="/quests"
          className="text-xs font-extrabold tracking-wide text-sky-400 hover:text-sky-500 transition-colors uppercase"
        >
          Afficher tout
        </Link>
      </div>

      {/* Quest row */}
      <div className="flex items-center gap-4">
        {/* XP icon */}
        <div className="shrink-0">
          <Image
            src="/xp-bolt.svg"
            alt="XP"
            width={40}
            height={40}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-extrabold text-foreground mb-2">
            Gagne {dailyQuest.value} XP
          </p>

          {/* Progress bar */}
          <div className="relative h-6 rounded-full bg-muted border border-border overflow-hidden">
            {/* Fill */}
            {progress > 0 && (
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-400 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            )}
            {/* Label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-muted-foreground">
                {Math.min(points, dailyQuest.value)} / {dailyQuest.value}
              </span>
            </div>
          </div>
        </div>

        {/* Chest icon */}
        <div className="shrink-0">
          <Image
            src="/quete8.svg"
            alt="Récompense"
            width={40}
            height={40}
            className={isCompleted ? "opacity-100" : "opacity-60"}
          />
        </div>
      </div>
    </div>
  );
};