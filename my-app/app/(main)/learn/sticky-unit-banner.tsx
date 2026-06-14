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

export const StickyUnitBanner = ({ units }: Props) => {
  const [activeUnitIndex, setActiveUnitIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [bannerHeight, setBannerHeight] = useState(0);
  const bannerRef = useRef<HTMLDivElement>(null);
  const observersRef = useRef<IntersectionObserver[]>([]);

  useEffect(() => {
    if (bannerRef.current) {
      setBannerHeight(bannerRef.current.offsetHeight);
    }
  }, [isVisible]);

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
        { threshold: 0.3, rootMargin: "-56px 0px -40% 0px" }
      );

      observer.observe(el);
      observersRef.current.push(observer);
    });

    return () => observersRef.current.forEach(obs => obs.disconnect());
  }, [units]);

  if (!isVisible) return null;

  const activeUnit = units[activeUnitIndex];

  return (
    <>
      {/* Mobile : fixed sous le MobileHeader (56px) */}
      <div
        ref={bannerRef}
        className="
          fixed left-0 right-0 z-40
          top-[56px]
          px-4 py-2
          lg:hidden
          transition-all duration-300 animate-in slide-in-from-top
        "
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

      {/* Desktop : sticky normal (pas fixed, le header desktop gère déjà le top) */}
      <div className="
        hidden lg:block
        sticky top-[88px] z-40
        mb-6
        transition-all duration-300 animate-in slide-in-from-top
      ">
        <UnitBanner
          key={activeUnit.id}
          title={activeUnit.title}
          description={activeUnit.description}
          color={activeUnit.color}
          order={activeUnit.order}
          index={activeUnit.index}
        />
      </div>

      {/* Spacer mobile uniquement */}
      <div
        className="lg:hidden"
        style={{ height: bannerHeight + 8 }}
      />
    </>
  );
};