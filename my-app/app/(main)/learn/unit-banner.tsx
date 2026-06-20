import Link from "next/link";
import { ArrowLeft, MoveRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  description?: string; // Rendu optionnel
  color?: string;
  accentColor?: string;
  order?: number;
  index?: number;
};

export const UnitBanner = ({
  title,
  color = "blue",
  order = 1,
  index = 0,
}: Props) => {
 const getBgColor = () => {
  const colors: Record<string, string> = {
    blue: "bg-[#1CB0F6]",
    purple: "bg-violet-400",
    green: "bg-[#58CC02]",
    red: "bg-rose-400",
    orange: "bg-amber-400",
    pink: "bg-fuchsia-400",
    indigo: "bg-indigo-400",
    teal: "bg-teal-400",
  };
  return colors[color] || colors.blue;
};

const getBorderColor = () => {
  const colors: Record<string, string> = {
    blue: "border-[#1899D6]",
    purple: "border-violet-500",
    green: "border-[#58A700]",
    red: "border-rose-500",
    orange: "border-amber-500",
    pink: "border-fuchsia-500",
    indigo: "border-indigo-500",
    teal: "border-teal-500",
  };
  return colors[color] || colors.blue;
};

const getButtonColor = () => {
  const colors: Record<string, string> = {
    blue: "bg-[#1CB0F6] hover:bg-[#0E9FE3] border-[#1899D6]",
    purple: "bg-violet-500 hover:bg-violet-600 border-violet-600",
    green: "bg-[#58CC02] hover:bg-[#4CAF00] border-[#58A700]",
    red: "bg-rose-500 hover:bg-rose-600 border-rose-600",
    orange: "bg-amber-500 hover:bg-amber-600 border-amber-600",
    pink: "bg-fuchsia-500 hover:bg-fuchsia-600 border-fuchsia-600",
    indigo: "bg-indigo-500 hover:bg-indigo-600 border-indigo-600",
    teal: "bg-teal-500 hover:bg-teal-600 border-teal-600",
  };
  return colors[color] || colors.blue;
};
  return (
    <div className={`
      w-full min-w-0 overflow-hidden
      rounded-xl px-4 py-6 lg:rounded-lg lg:px-4 lg:py-4
      flex items-center justify-between
      ${getBgColor()} ${getBorderColor()}
      border-2 border-b-4 relative
    `}>

      {/* Gauche : flèche + label + titre */}
      <div className="relative z-10 flex flex-col gap-2 flex-1 min-w-0 overflow-hidden">
        <div className="flex items-center gap-2">
          <Link href="/courses" className="inline-flex shrink-0">
            <ArrowLeft className="h-4 w-4 lg:h-3 lg:w-3 text-white/80 hover:opacity-90 transition-opacity" />
          </Link>
          <span
            className="text-white/70 text-xs lg:text-[10px] font-bold tracking-wider truncate"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Unité {order}
          </span>
        </div>
        <div className="min-w-0">
          <h3
            className="text-lg lg:text-base font-extrabold text-white leading-tight truncate"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            {title}
          </h3>
        </div>
      </div>

      {/* Droite : bouton */}
      <Link href="/lesson" className="relative z-10 shrink-0 ml-4 lg:ml-3">
        <Button
          size="default"
          className={`
            flex items-center gap-2 px-4 lg:px-3 h-11 lg:h-9
            ${getButtonColor()}
            text-white font-extrabold text-sm lg:text-xs uppercase tracking-wide
            border-2 border-b-4 rounded-xl lg:rounded-lg
            transition-all duration-150
            shadow-lg active:scale-95 active:border-b-2 active:shadow-md
          `}
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          <MoveRight className="h-5 w-5 lg:h-4 lg:w-4" />
        </Button>
      </Link>
    </div>
  );
};