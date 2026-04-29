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
        "h-full border-2 border-border rounded-xl border-b-4 hover:bg-muted cursor-pointer active:border-b-2 flex flex-col items-center justify-between p-2 pb-4 min-h-[150px] min-w-0 bg-card",
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
        className="rounded-lg drop-shadow-md border border-border object-cover"
      />
      <p className="text-foreground text-center font-bold mt-2 text-sm">
        {title}
      </p>
    </div>
  );
};