import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

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
    <div className={`w-full rounded-2xl px-5 py-4 lg:py-5 flex items-center justify-between ${getBgColor()} relative overflow-hidden`}>

      {/* Gauche : flèche + label + titre */}
      <div className="relative z-10 flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <ArrowLeft className="h-3.5 w-3.5 text-white/90 font-bold" />
          <span className="text-gray-100 text-[11px] font-bold uppercase tracking-widest">
            Chapitre {index + 1}, Unité {order}
          </span>
        </div>
        <h3 className="text-lg font-bold text-white ">
          {title}
        </h3>
      </div>

      {/* Droite : bouton Guide */}
      <Link href="/lesson" className="relative z-10 shrink-0">
        <Button
          size="default"
          variant="secondary"
          className={`flex items-center gap-2 px-4 h-11
            ${getButtonColor()}
            text-white font-bold text-sm uppercase tracking-wide
            border-2 border-b-4
            rounded-xl
            transition-all duration-150
            shadow-md active:scale-95 active:border-b-2`}
        >
          <BookOpen className="h-5 w-5" />
          Guide
        </Button>
      </Link>
    </div>
  );
};