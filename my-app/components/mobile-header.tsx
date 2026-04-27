import Link from "next/link";
import Image from "next/image";
import { courses } from "@/db/schema";
import { UserProgress } from "./user-progress";

type Props = {
  activeCourse: typeof courses.$inferSelect;
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
};

export const MobileHeader = ({
  activeCourse,
  hearts,
  points,
  hasActiveSubscription,
}: Props) => {
  return (
    <nav className="lg:hidden px-4 h-[56px] flex items-center fixed top-0 w-full z-50
      bg-white/90 backdrop-blur-md
      border-b border-slate-200 
      shadow-sm
      animate-in slide-in-from-top duration-300"
    >
      {/* Logo */}
      <Link 
        href="/" 
        className="flex items-center gap-x-1.5 mr-3 group transition-all duration-200"
      >
        <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
          <Image src="/mascot.svg" height={32} width={32} alt="Mascot" />
        </div>
        
      </Link>

      {/* Divider */}
      <div className="w-px h-6 bg-slate-200 mr-3" />

      {/* UserProgress */}
      <div className="flex-1 animate-in fade-in duration-500 delay-150">
        <UserProgress
          activeCourse={activeCourse}
          hearts={hearts}
          points={points}
          hasActiveSubscription={hasActiveSubscription}
        />
      </div>
    </nav>
  );
};