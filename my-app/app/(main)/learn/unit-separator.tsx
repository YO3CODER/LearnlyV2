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

  const scrollToUnit = () => {
    const unit = document.getElementById(`unit-${isAbove ? unitIndex + 1 : unitIndex}`);
    if (unit) unit.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={ref} className="flex items-center gap-x-4 my-10 px-2">
      {/* Trait gauche */}
      <div className="flex-1 h-px bg-slate-200" />

      {/* Texte au centre */}
      <span className="text-slate-400 font-bold text-sm tracking-wide whitespace-nowrap">
        {nextUnitTitle}
      </span>

      {/* Trait droit */}
      <div className="flex-1 h-px bg-slate-200" />

      {/* Bouton flèche */}
      <button
        onClick={scrollToUnit}
        className="flex items-center justify-center w-10 h-10 rounded-xl
          border-2 border-b-4 border-slate-200
          bg-white hover:bg-slate-50
          transition-all duration-200 active:border-b-2 active:translate-y-px
          shadow-sm"
      >
        {isAbove
          ? <ArrowDown className="h-5 w-5 text-blue-400" />
          : <ArrowUp className="h-5 w-5 text-blue-400" />
        }
      </button>
    </div>
  );
};