import Link from "next/link";
import Image from "next/image";
import { courses } from "@/db/schema";
import { UserProgress } from "./user-progress";

type Props = {
  activeCourse: typeof courses.$inferSelect;
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
  streak?: number;
};

export const MobileHeader = ({
  activeCourse,
  hearts,
  points,
  hasActiveSubscription,
  streak = 0,
}: Props) => {
  return (
    <nav
      className="
        lg:hidden
        px-4 h-[56px]
        flex items-center
        fixed top-0 w-full z-50
        bg-background/95
        backdrop-blur-md
        border-b-2 border-border
        shadow-sm
        animate-in slide-in-from-top duration-300
      "
    >
      {/* Logo */}
      <Link
        href="/"
        className="
          flex items-center gap-x-1.5 mr-3 group
          transition-all duration-200
        "
      >
        <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
          <Image
            src="/mascot.svg"
            height={32}
            width={32}
            alt="Mascot"
          />
        </div>
      </Link>

      {/* Divider */}
      <div className="w-px h-6 bg-border mr-3" />

      {/* Progress */}
      <div className="flex-1 animate-in fade-in duration-500 delay-150">
        <UserProgress
          activeCourse={activeCourse}
          hearts={hearts}
          points={points}
          hasActiveSubscription={hasActiveSubscription}
          streak={streak}
        />
      </div>
    </nav>
  );
};