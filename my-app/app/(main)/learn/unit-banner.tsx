import Link from "next/link";
import { BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  description: string;
  color?: string;
  accentColor?: string;
};

export const UnitBanner = ({
  title,
  description,
  color = "blue",
  accentColor = "blue",
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

  const getBorderColor = () => {
    const borders: Record<string, string> = {
      blue: "border-blue-700",
      purple: "border-purple-700",
      green: "border-green-700",
      red: "border-red-700",
      orange: "border-orange-700",
      pink: "border-pink-700",
      indigo: "border-indigo-700",
      teal: "border-teal-700",
    };
    return borders[color] || borders.blue;
  };

  return (
    <div
      className={`w-full rounded-2xl px-5 py-4 lg:py-5 flex items-center justify-between
      ${getBgColor()}
      border-2 border-b-4 ${getBorderColor()}
      relative overflow-hidden`}
    >
      {/* Text */}
      <div className="relative z-10 space-y-0.5">
        <h3 className="text-xl font-extrabold text-white tracking-tight">
          {title}
        </h3>
        <p className="hidden lg:block text-white/80 text-sm font-medium">
          {description}
        </p>
      </div>

      {/* Séparateur vertical */}
      <div className="relative z-10 shrink-0 mx-4 flex flex-col">
        <div className="w-[2px] h-10 bg-white/60 rounded-full" />
        <div className="w-[2px] h-[4px] bg-black/20 rounded-full" />
      </div>

      {/* CTA */}
      <Link href="/lesson" className="relative z-10">
        <Button
          size="default"
          variant="secondary"
          className="flex items-center justify-center
            bg-background hover:bg-background/90
            dark:bg-background/15 dark:hover:bg-background/25
            text-muted-foreground-700 dark:text-gray
            border-2 border-b-4 border-border-200 dark:border-white/20
            rounded-xl
            transition-all duration-200
            shadow-md active:scale-95 active:border-b-2
            w-10 h-10 p-0"
        >
          <BookOpen className="h-5 w-5" />
        </Button>
      </Link>
    </div>
  );
};