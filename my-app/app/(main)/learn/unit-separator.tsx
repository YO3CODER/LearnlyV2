"use client";

import { useRef, useState, useEffect } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

type Props = {
  nextUnitTitle: string;
  unitIndex: number;
};

export const UnitSeparator = ({ nextUnitTitle, unitIndex }: Props) => {
  const [isAbove, setIsAbove] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowMiddle = window.innerHeight / 2;
      setIsAbove(rect.top > windowMiddle);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getOffset = () => {
    const isMobile = window.innerWidth < 1024;

    if (isMobile) {
      const banner = document.getElementById("sticky-banner-mobile");
      const bannerHeight = banner ? banner.offsetHeight : 0;
      // header (56px) + banner + padding + banner encore pour dépasser
      return 56 + bannerHeight + 16 + bannerHeight;
    } else {
      return 88 + 16;
    }
  };

  const scrollToUnit = () => {
    if (isAbove) {
      const unit = document.getElementById(`unit-${unitIndex + 1}`);
      if (unit) unit.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      const unit = document.getElementById(`unit-${unitIndex}`);
      if (unit) {
        const offset = getOffset();
        const top = unit.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  return (
    <div ref={ref} className="flex items-center gap-x-4 my-10 px-2">
      {/* Trait gauche */}
      <div className="flex-1 h-[2px] rounded-full bg-border" style={{ borderBottom: "2px solid hsl(var(--border))" }} />

      {/* Texte au centre */}
      <span className="text-muted-foreground text-sm lg:text-xl tracking-wide whitespace-nowrap">
        {nextUnitTitle}
      </span>

      {/* Trait droit */}
      <div className="flex-1 h-[2px] rounded-full bg-border" style={{ borderBottom: "2px solid hsl(var(--border))" }} />

      {/* Bouton flèche */}
      <button
        onClick={scrollToUnit}
        className="flex items-center justify-center w-10 h-10 rounded-xl
          border-2 border-b-4 border-border
          bg-card hover:bg-muted
          transition-all duration-200 active:border-b-2 active:translate-y-px
          shadow-sm"
      >
        {isAbove
          ? <ArrowDown className="h-5 w-5 text-primary" />
          : <ArrowUp className="h-5 w-5 text-primary" />
        }
      </button>
    </div>
  );
};