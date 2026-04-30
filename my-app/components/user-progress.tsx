"use client";

import Link from "next/link";
import Image from "next/image";
import { InfinityIcon, Flame } from "lucide-react";
import { useState } from "react";

import { courses } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  activeCourse: typeof courses.$inferSelect;
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
  streak?: number;
};

export const UserProgress = ({ 
  activeCourse, 
  points, 
  hearts, 
  hasActiveSubscription,
  streak = 0,
}: Props) => {
  const [heartBeating, setHeartBeating] = useState(false);

  if (!activeCourse) return null;

  const handleHeartClick = () => {
    setHeartBeating(true);
    setTimeout(() => setHeartBeating(false), 600);
  };

  return (
    <div className="flex items-center justify-end gap-x-1 w-full">

      {/* Cours actif */}
      <Link href="/courses">
        <Button variant="ghost" className="px-2">
          <Image
            src={activeCourse.imageSrc}
            alt={activeCourse.title}
            className="rounded-md border"
            width={28}
            height={28}
          />
        </Button>
      </Link>

      {/* Streak */}
      <Button variant="ghost" className="px-2 gap-x-1">
        <Flame className={cn(
          "h-5 w-5",
          streak > 0
            ? "text-orange-500 fill-orange-500"
            : "text-muted-foreground fill-muted-foreground"
        )} />
        <span className={cn(
          "font-extrabold text-sm",
          streak > 0 ? "text-orange-500" : "text-muted-foreground"
        )}>
          {streak}
        </span>
      </Button>

      {/* Points */}
      <Link href="/shop">
        <Button variant="ghost" className="px-2 gap-x-1">
          <Image src="/xp-bolt.svg" height={22} width={22} alt="Points" />
          <span className="font-extrabold text-sm text-yellow-300">{points}</span>
        </Button>
      </Link>

      {/* Hearts */}
      <Link href="/shop" onClick={handleHeartClick}>
        <Button variant="ghost" className="px-2 gap-x-1">
          <div className={cn(heartBeating && "animate-heartbeat")}>
            <Image src="/heart.svg" height={22} width={22} alt="Hearts" />
          </div>
          <span className="font-extrabold text-sm text-rose-500">
            {hasActiveSubscription 
              ? <InfinityIcon className="h-4 w-4 stroke-[3]" /> 
              : hearts
            }
          </span>
        </Button>
      </Link>

    </div>
  );
};