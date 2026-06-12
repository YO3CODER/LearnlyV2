import Image from "next/image";
import { InfinityIcon, X } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { useExitModal } from "@/store/use-exit-modal";

type Props = {
  hearts: number;
  percentage: number;
  hasActiveSubscription: boolean;
  current?: number;
  total?: number;
};

export const Header = ({
  hearts,
  percentage,
  hasActiveSubscription,
  current,
  total,
}: Props) => {
  const { open } = useExitModal();

  return (
    <header className="lg:pt-[40px] pt-[16px] px-6 lg:px-10 flex gap-x-4 lg:gap-x-6 items-center justify-between max-w-[1140px] mx-auto w-full">

      {/* Exit */}
      <button
        onClick={open}
        className="flex items-center justify-center w-9 h-9 rounded-xl
          text-muted-foreground hover:text-rose-400 hover:bg-rose-50
          dark:hover:bg-rose-950/50 transition-all duration-200 cursor-pointer shrink-0 group"
      >
        <X className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" />
      </button>

      {/* Barre + compteur */}
      <div className="flex-1 flex flex-col gap-y-1">
        <Progress
          value={percentage}
          className="h-3.5 rounded-full bg-muted shadow-inner"
        />
        {current !== undefined && total !== undefined && (
          <p className="text-[11px] font-bold text-muted-foreground text-right tabular-nums">
            {current} / {total}
          </p>
        )}
      </div>

      {/* Hearts */}
      <div className="flex items-center gap-x-1.5 shrink-0
        bg-rose-50 dark:bg-rose-950/50
        border border-rose-100 dark:border-rose-900
        rounded-xl px-3 py-1.5 shadow-sm"
      >
        <Image src="/heart.svg" height={20} width={20} alt="Heart" className="drop-shadow-sm" />
        <span className="text-rose-500 font-extrabold text-sm min-w-[16px] text-center">
          {hasActiveSubscription
            ? <InfinityIcon className="h-4 w-4 stroke-[3] shrink-0" />
            : hearts}
        </span>
      </div>

    </header>
  );
};