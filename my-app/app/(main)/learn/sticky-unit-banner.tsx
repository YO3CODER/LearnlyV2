"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
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
        { threshold: 0, rootMargin: "-56px 0px -80% 0px" }
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
  const [headerHeight, setHeaderHeight] = useState(56);

  useEffect(() => {
    const mobileHeader = document.querySelector("header");
    if (mobileHeader) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHeaderHeight(mobileHeader.offsetHeight);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div
        className="fixed left-0 right-0 z-40 px-4 py-2 bg-background lg:hidden"
        style={{ top: headerHeight }}
      >
        <UnitBanner
          title={activeUnit.title}
          description={activeUnit.description}
          color={activeUnit.color}
          order={activeUnit.order}
          index={activeUnit.index}
        />

        {/* Boutons Jeux et MaitreLucas — fixés juste en bas du banner */}
        <div className="flex justify-start gap-2 mt-2 pl-1">
          <Button
            asChild
            variant="primary"
            size="icon"
          >
            <a href="/river">
              <img src="/game.svg" alt="Jeux" width={22} height={22} />
            </a>
          </Button>

          <Button
            asChild
            variant="default"
            size="icon"
          >
            <a href="#">
              <img src="/maitrelucas.svg" alt="MaitreLucas" width={22} height={22} />
            </a>
          </Button>
        </div>
      </div>

      {/* Espace réservé pour compenser le bouton ajouté */}
      <div className="lg:hidden h-[110px]" />
    </>
  );
};