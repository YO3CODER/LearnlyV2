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

/**
 * Desktop : pas de position fixed.
 * Placé DANS le même bloc sticky que le header, juste après —
 * reste donc en haut au scroll, et change de couleur/titre/description
 * automatiquement selon l'unité active.
 */
export const StickyUnitBannerDesktop = ({ units }: Props) => {
  const { activeUnit, isVisible } = useActiveUnit(units);

  if (!isVisible) return null;

  return (
    <div
      key={activeUnit.id}
      className="hidden lg:block pt-3 animate-in slide-in-from-top duration-300"
    >
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

/**
 * Mobile : fixed sous le MobileHeader (56px), même logique dynamique.
 */
export const StickyUnitBannerMobile = ({ units }: Props) => {
  const { activeUnit, isVisible } = useActiveUnit(units);
  const [bannerHeight, setBannerHeight] = useState(0);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bannerRef.current) {
      setBannerHeight(bannerRef.current.offsetHeight);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <div
        ref={bannerRef}
        className="fixed left-0 right-0 z-40 top-[56px] px-4 py-2 lg:hidden transition-all duration-300 animate-in slide-in-from-top"
      >
        <UnitBanner
          key={activeUnit.id}
          title={activeUnit.title}
          description={activeUnit.description}
          color={activeUnit.color}
          order={activeUnit.order}
          index={activeUnit.index}
        />
      </div>
      <div className="lg:hidden" style={{ height: bannerHeight + 8 }} />
    </>
  );
};