import Image from "next/image";
import { InfinityIcon, X } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { useExitModal } from "@/store/use-exit-modal";

type Props = {
  hearts: number;
  percentage: number;
  hasActiveSubscription: boolean;
};

export const Header = ({
  hearts,
  percentage,
  hasActiveSubscription,
}: Props) => {
  const { open } = useExitModal();

  return (
    <header className="lg:pt-[50px] pt-[20px] px-6 lg:px-10 flex gap-x-4 lg:gap-x-7 items-center justify-between max-w-[1140px] mx-auto w-full">

      {/* Exit button */}
      <button
        onClick={open}
        className="flex items-center justify-center w-9 h-9 rounded-xl
          text-muted-foreground-300 dark:text-muted-foreground-600
          hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50
          transition-all duration-200 cursor-pointer shrink-0 group"
      >
        <X className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" />
      </button>

      {/* Progress bar */}
      <div className="flex-1 flex items-center gap-x-3">
        <Progress
          value={percentage}
          className="h-3 rounded-full bg-background-100 dark:bg-background-700 shadow-inner"
        />
      </div>

      {/* Hearts */}
      <div className="flex items-center gap-x-1.5 shrink-0
        bg-rose-50 dark:bg-rose-950/50
        border border-rose-100 dark:border-rose-900
        rounded-xl px-3 py-1.5
        shadow-sm shadow-rose-100/50"
      >
        <Image
          src="/heart.svg"
          height={20}
          width={20}
          alt="Heart"
          className="drop-shadow-sm"
        />
        <span className="text-rose-500 font-extrabold text-sm min-w-[16px] text-center">
          {hasActiveSubscription
            ? <InfinityIcon className="h-4 w-4 stroke-[3] shrink-0" />
            : hearts
          }
        </span>
      </div>

    </header>
  );
};