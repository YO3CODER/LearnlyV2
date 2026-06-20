import Image from "next/image";
import { InfinityIcon, X } from "lucide-react";

import { useExitModal } from "@/store/use-exit-modal";

type Props = {
  hearts: number;
  percentage: number;
  hasActiveSubscription: boolean;
  current?: number;
  total?: number;
};

// ── Couleur de la barre interpolée selon l'avancement (rouge → orange → vert) ──
const getProgressColor = (value: number) => {
  const clamped = Math.max(0, Math.min(100, value));

  let hue: number;
  if (clamped <= 50) {
    hue = (clamped / 50) * 35; // 0 → 35 (rouge → orange)
  } else {
    hue = 35 + ((clamped - 50) / 50) * (142 - 35); // 35 → 142 (orange → vert)
  }

  return `hsl(${hue}, 80%, 50%)`;
};

export const Header = ({
  hearts,
  percentage,
  hasActiveSubscription,
}: Props) => {
  const { open } = useExitModal();
  const barColor = getProgressColor(percentage);
  const clamped = Math.max(0, Math.min(100, percentage));

  return (
    <header className="lg:pt-[40px] pt-[16px] px-6 lg:px-10 flex gap-x-4 lg:gap-x-6 items-center justify-between max-w-[1140px] mx-auto w-full">

      {/* Animation shimmer définie une seule fois */}
      <style>{`
        @keyframes progress-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
      `}</style>

      {/* Exit */}
      <button
        onClick={open}
        className="flex items-center justify-center w-9 h-9 rounded-xl
          text-muted-foreground hover:text-rose-400 hover:bg-rose-50
          dark:hover:bg-rose-950/50 transition-all duration-200 cursor-pointer shrink-0 group"
      >
        <X className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" />
      </button>

      {/* Barre de progression à couleur dynamique + shimmer permanent */}
      <div className="flex-1">
        <div className="h-3.5 w-full rounded-full bg-muted shadow-inner overflow-hidden">
          <div
            className="relative h-full rounded-full overflow-hidden transition-[width,background-color] duration-500 ease-out"
            style={{
              width: `${clamped}%`,
              backgroundColor: barColor,
              boxShadow: `0 0 8px ${barColor}`,
            }}
          >
            {/* Reflet animé en boucle */}
            <div
              className="absolute inset-y-0 left-0 w-1/3"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
                animation: "progress-shimmer 1.8s ease-in-out infinite",
              }}
            />
          </div>
        </div>
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