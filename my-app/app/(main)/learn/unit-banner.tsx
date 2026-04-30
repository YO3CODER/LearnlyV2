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
  const getGradientColors = () => {
    const colors: Record<string, string> = {
      blue: "from-blue-400 to-blue-600",
      purple: "from-purple-400 to-purple-600",
      green: "from-green-400 to-green-600",
      red: "from-red-400 to-red-600",
      orange: "from-orange-400 to-orange-600",
      pink: "from-pink-400 to-pink-600",
      indigo: "from-indigo-400 to-indigo-600",
      teal: "from-teal-400 to-teal-600",
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

  const getShadowColor = () => {
    const shadows: Record<string, string> = {
      blue: "shadow-blue-300/50 dark:shadow-blue-900/50",
      purple: "shadow-purple-300/50 dark:shadow-purple-900/50",
      green: "shadow-green-300/50 dark:shadow-green-900/50",
      red: "shadow-red-300/50 dark:shadow-red-900/50",
      orange: "shadow-orange-300/50 dark:shadow-orange-900/50",
      pink: "shadow-pink-300/50 dark:shadow-pink-900/50",
      indigo: "shadow-indigo-300/50 dark:shadow-indigo-900/50",
      teal: "shadow-teal-300/50 dark:shadow-teal-900/50",
    };
    return shadows[color] || shadows.blue;
  };

  return (
    <div
      className={`w-full rounded-2xl px-5 py-4 lg:py-5 flex items-center justify-between
      bg-gradient-to-r ${getGradientColors()}
      border-2 border-b-4 ${getBorderColor()}
      shadow-lg ${getShadowColor()}
      relative overflow-hidden`}
    >
      {/* Text */}
      <div className="relative z-10 space-y-0.5">
        <h3 className="text-xl font-extrabold text-white tracking-tight drop-shadow-sm">
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
            text-muted-foreground-700 dark:text-white
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