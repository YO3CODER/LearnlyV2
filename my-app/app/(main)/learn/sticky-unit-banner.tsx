"use client";

import { useEffect, useRef, useState } from "react";
import { UnitBanner } from "@/app/(main)/learn/unit-banner";

type UnitInfo = {
  id: number;
  title: string;
  description: string;
  color: string;
};

type Props = {
  units: UnitInfo[];
};

export const StickyUnitBanner = ({ units }: Props) => {
  const [activeUnitIndex, setActiveUnitIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const observersRef = useRef<IntersectionObserver[]>([]);

  useEffect(() => {
    observersRef.current.forEach(obs => obs.disconnect());
    observersRef.current = [];

    units.forEach((_, index) => {
      const el = document.getElementById(`unit-${index}`);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveUnitIndex(index);
            setIsVisible(true);
          }
        },
        { threshold: 0.1, rootMargin: "-80px 0px 0px 0px" }
      );

      observer.observe(el);
      observersRef.current.push(observer);
    });

    return () => observersRef.current.forEach(obs => obs.disconnect());
  }, [units]);

  if (!isVisible) return null;

  const activeUnit = units[activeUnitIndex];

  return (
    <div className="sticky top-[56px] lg:top-[88px] z-40 mb-6 transition-all duration-300 animate-in slide-in-from-top">
      <UnitBanner
        key={activeUnit.id}
        title={activeUnit.title}
        description={activeUnit.description}
        color={activeUnit.color}
        accentColor={activeUnit.color}
      />
    </div>
  );
};