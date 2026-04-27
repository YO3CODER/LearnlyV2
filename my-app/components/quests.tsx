import Link from "next/link";
import Image from "next/image";

import { quests } from "@/constants";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type Props = {
  points: number;
};

export const Quests = ({ points }: Props) => {
  return (
    <div className="rounded-2xl p-5 space-y-4
      bg-gradient-to-b from-white to-blue-50/30
      border border-slate-200/80 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div>
          <p className="text-[10px] font-semibold tracking-widest uppercase text-blue-400 mb-0.5">
            Daily
          </p>
          <h3 className="font-extrabold text-lg text-slate-800 tracking-tight">
            Quests
          </h3>
        </div>
        <Link href="/quests">
          <Button
            size="sm"
            variant="primaryOutline"
            className="rounded-xl text-xs font-semibold border-blue-200 text-blue-500 hover:bg-blue-50"
          >
            View all
          </Button>
        </Link>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-blue-100 via-blue-100 to-transparent" />

      {/* Quest list */}
      <ul className="w-full space-y-4">
        {quests.map((quest) => {
          const progress = Math.min((points / quest.value) * 100, 100);
          const isCompleted = progress >= 100;

          return (
            <div
              className="flex items-center w-full gap-x-3"
              key={quest.title}
            >
              {/* Icon */}
              <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
                ${isCompleted
                  ? "bg-blue-100"
                  : "bg-amber-50 border border-amber-100"
                }`}
              >
                <Image
                  src="/points.svg"
                  alt="Points"
                  width={24}
                  height={24}
                  className={isCompleted ? "opacity-80" : ""}
                />
              </div>

              {/* Info */}
              <div className="flex flex-col gap-y-1.5 w-full">
                <div className="flex items-center justify-between">
                  <p className="text-slate-700 text-sm font-semibold">
                    {quest.title}
                  </p>
                  <span className={`text-[11px] font-bold
                    ${isCompleted ? "text-blue-400" : "text-amber-400"}`}
                  >
                    {isCompleted ? "✓ Done" : `${Math.floor(progress)}%`}
                  </span>
                </div>
                <Progress
                  value={progress}
                  className={`h-2 rounded-full
                    ${isCompleted ? "[&>div]:bg-blue-400" : "[&>div]:bg-amber-400"}`}
                />
              </div>
            </div>
          );
        })}
      </ul>
    </div>
  );
};