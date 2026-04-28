import Image from "next/image";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  title: string;
  id: number;
  imageSrc: string;
  onClick: (id: number) => void;
  disabled?: boolean;
  active?: boolean;
};

export const Card = ({
  title,
  id,
  imageSrc,
  disabled,
  onClick,
  active,
}: Props) => {
  return (
    <div
      onClick={() => onClick(id)}
      className={cn(
        "h-full border-2 dark:border-slate-700 rounded-xl border-b-4 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer active:border-b-2 flex flex-col items-center justify-between p-2 pb-4 min-h-[150px] min-w-0 dark:bg-slate-800/50",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      <div className="min-h-[20px] w-full flex items-center justify-end">
        {active && (
          <div className="rounded-md bg-green-600 flex items-center justify-center p-1">
            <Check className="text-white stroke-[4] h-3 w-3" />
          </div>
        )}
      </div>
      <Image
        src={imageSrc || "/placeholder.svg"}
        alt={title}
        height={50}
        width={60}
        className="rounded-lg drop-shadow-md border dark:border-slate-600 object-cover"
      />
      <p className="text-neutral-700 dark:text-slate-300 text-center font-bold mt-2 text-sm">
        {title}
      </p>
    </div>
  );
};