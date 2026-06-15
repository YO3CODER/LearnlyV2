"use client";

import { useEffect, useRef, useState } from "react";
import { UnitBanner } from "@/app/(main)/learn/unit-banner";

type UnitInfo = {
  id: number;
  title: string;
  description: string;
  color: string;
  order: number;
  index: number;
};

type Props = {
  units: UnitInfo[];
};

const useActiveUnit = (units: UnitInfo[]) => {
  const [activeUnitIndex, setActiveUnitIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const observersRef = useRef<IntersectionObserver[]>([]);

  useEffect(() => {
    observersRef.current.forEach((obs) => obs.disconnect());
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
        { threshold: 0.3, rootMargin: "-56px 0px -40% 0px" }
      );

      observer.observe(el);
      observersRef.current.push(observer);
    });

    return () => observersRef.current.forEach((obs) => obs.disconnect());
  }, [units]);

  return { activeUnit: units[activeUnitIndex], isVisible };
};

export const StickyUnitBannerDesktop = ({ units }: Props) => {
  const { activeUnit, isVisible } = useActiveUnit(units);

  if (!isVisible) return null;

  return (
    <div className="hidden lg:block pt-3">
      <UnitBanner
        title={activeUnit.title}
        description={activeUnit.description}
        color={activeUnit.color}
        order={activeUnit.order}
        index={activeUnit.index}
      />
    </div>
  );
};

export const StickyUnitBannerMobile = ({ units }: Props) => {
  const { activeUnit, isVisible } = useActiveUnit(units);

  if (!isVisible) return null;

  return (
    <div className="lg:hidden sticky top-[57px] z-40 bg-background px-4 py-2">
      <UnitBanner
        title={activeUnit.title}
        description={activeUnit.description}
        color={activeUnit.color}
        order={activeUnit.order}
        index={activeUnit.index}
      />
    </div>
  );
};