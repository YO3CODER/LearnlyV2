import Link from "next/link";
import { ArrowLeft, BookOpen, MoveRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  description: string;
  color?: string;
  accentColor?: string;
  order?: number;
  index?: number;
};

export const UnitBanner = ({
  title,
  description,
  color = "blue",
  order = 1,
  index = 0,
}: Props) => {
  const getBgColor = () => {
    const colors: Record<string, string> = {
      blue: "bg-blue-500",
      purple: "bg-purple-500",
      green: "bg-green-500",
      red: "bg-red-500",
      orange: "bg-orange-500",
      pink: "bg-pink-500",
      indigo: "bg-indigo-500",
      teal: "bg-teal-500",
    };
    return colors[color] || colors.blue;
  };

  const getButtonColor = () => {
    const colors: Record<string, string> = {
      blue: "bg-blue-600 hover:bg-blue-700 border-blue-800",
      purple: "bg-purple-600 hover:bg-purple-700 border-purple-800",
      green: "bg-green-600 hover:bg-green-700 border-green-800",
      red: "bg-red-600 hover:bg-red-700 border-red-800",
      orange: "bg-orange-600 hover:bg-orange-700 border-orange-800",
      pink: "bg-pink-600 hover:bg-pink-700 border-pink-800",
      indigo: "bg-indigo-600 hover:bg-indigo-700 border-indigo-800",
      teal: "bg-teal-600 hover:bg-teal-700 border-teal-800",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className={`w-full rounded-2xl px-6 py-6 lg:py-8 flex items-center justify-between ${getBgColor()} relative overflow-hidden`}>

      {/* Gauche : flèche + label + titre */}
      <div className="relative z-10 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2">
          <Link href="/courses" className="inline-flex">
  <ArrowLeft className="h-4 w-4 text-white/80 flex-shrink-0 hover:opacity-90 transition-opacity" />
</Link>
          <span className="text-white/70 text-xs font-bold  tracking-wider" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Unité {order}
          </span>
        </div>
        <h3 className="text-xl lg:text-xl font-extrabold text-white leading-tight" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          {title}
          <h4 className="text-sm text-white/80" >{description}</h4>
        </h3>
      </div>

      {/* Droite : bouton Guide */}
      <Link href="/lesson" className="relative z-10 shrink-0 ml-4">
        <Button
          size="default"
          className={`flex items-center gap-2 px-5 h-12 lg:h-14
            ${getButtonColor()}
            text-white font-extrabold text-sm lg:text-base uppercase tracking-wide
            border-2 border-b-4
            rounded-2xl
            transition-all duration-150
            shadow-lg active:scale-95 active:border-b-2 active:shadow-md`}
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          <MoveRight className="h-5 w-5 lg:h-6 lg:w-6" />
        </Button>
      </Link>
    </div>
  );
};