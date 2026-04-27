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
      blue: "shadow-blue-300/50",
      purple: "shadow-purple-300/50",
      green: "shadow-green-300/50",
      red: "shadow-red-300/50",
      orange: "shadow-orange-300/50",
      pink: "shadow-pink-300/50",
      indigo: "shadow-indigo-300/50",
      teal: "shadow-teal-300/50",
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
      {/* Decorative circles */}
      <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10 blur-sm" />
      <div className="absolute -bottom-8 right-24 w-24 h-24 rounded-full bg-white/10 blur-sm" />

      {/* Text */}
      <div className="relative z-10 space-y-0.5">
        <h3 className="text-xl font-extrabold text-white tracking-tight drop-shadow-sm">
          {title}
        </h3>
        {/* Description visible uniquement en grand écran */}
        <p className="hidden lg:block text-white/80 text-sm font-medium">
          {description}
        </p>
      </div>

      {/* Séparateur vertical */}
      <div className="w-px h-8 bg-white/30 mx-4 relative z-10 shrink-0" />

      {/* CTA */}
      <Link href="/lesson" className="relative z-10">
        <Button
          size="default"
          variant="secondary"
          className="flex items-center justify-center
            bg-white hover:bg-white/90
            text-slate-700
            border-2 border-b-4 border-slate-200
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