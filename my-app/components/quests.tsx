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
    <div
      className="
        rounded-2xl p-5 space-y-5
        bg-card
        border-2 border-b-4 border-border
        shadow-sm
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">
            Daily
          </p>

          <h3 className="font-extrabold text-lg text-foreground tracking-tight">
            Quests
          </h3>
        </div>

        <Link href="/quests">
          <Button
            size="sm"
            variant="primaryOutline"
            className="
              rounded-xl text-xs font-bold
              border-border
              text-foreground
              bg-background
              hover:bg-accent
            "
          >
            View all
          </Button>
        </Link>
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* List */}
      <ul className="w-full space-y-4">
        {quests.map((quest) => {
          const progress = Math.min((points / quest.value) * 100, 100);
          const isCompleted = progress >= 100;

          return (
            <li
              key={quest.title}
              className="flex items-center gap-x-3 w-full"
            >
              {/* Icon */}
              <div
                className={`
                  shrink-0 w-10 h-10 rounded-xl
                  flex items-center justify-center
                  border-2 border-b-4 border-border
                  ${
                    isCompleted
                      ? "bg-muted"
                      : "bg-background"
                  }
                `}
              >
                <Image
                  src="/xp-bolt.svg"
                  alt="Points"
                  width={24}
                  height={24}
                  className="opacity-90"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-y-1.5 w-full">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">
                    {quest.title}
                  </p>

                  <span
                    className={`text-[11px] font-bold ${
                      isCompleted
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {isCompleted
                      ? "✓ Done"
                      : `${Math.floor(progress)}%`}
                  </span>
                </div>

                <Progress
                  value={progress}
                  className={`
                    h-2 rounded-full bg-muted
                    ${
                      isCompleted
                        ? "[&>div]:bg-primary"
                        : "[&>div]:bg-muted-foreground"
                    }
                  `}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};