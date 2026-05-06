"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { POINTS_TO_REFILL } from "@/constants";
import { refillHearts } from "@/actions/user-progress";

type Props = {
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
};

export const Items = ({
  hearts,
  points,
  hasActiveSubscription,
}: Props) => {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const onRefillHearts = () => {
    if (pending || hearts === 5 || points < POINTS_TO_REFILL) return;

    startTransition(() => {
      refillHearts()
        .then(() => {
          toast.success("Cœurs rechargés !");
          router.refresh();
        })
        .catch(() => toast.error("Une erreur est survenue"));
    });
  };

  const onUpgrade = () => {
    toast.info(
      "🔧 Paiement indisponible pour le moment. Cette fonctionnalité arrive bientôt !",
      {
        duration: 4000,
        icon: "💙",
      }
    );
  };

  return (
    <ul className="w-full">

      {/* RECHARGER LES CŒURS */}
      <li className="flex items-center w-full p-4 gap-x-4 border-t-2 border-border">

        <Image src="/heart.svg" alt="Cœur" height={60} width={60} />

        <div className="flex-1">
          <p className="text-slate-700 dark:text-foreground text-base lg:text-xl font-bold">
            Recharger les cœurs
          </p>
        </div>

        <Button
          onClick={onRefillHearts}
          disabled={pending || hearts === 5 || points < POINTS_TO_REFILL}
          variant="primary"
        >
          {hearts === 5 ? (
            "Complet"
          ) : (
            <div className="flex items-center gap-x-2">
              <Image src="/points.svg" alt="Points" height={20} width={20} />
              <p>{POINTS_TO_REFILL}</p>
            </div>
          )}
        </Button>
      </li>

      {/* CŒURS ILLIMITÉS */}
      <li className="flex items-center w-full p-4 pt-8 gap-x-4 border-t-2 border-border">

        <Image src="/heartInfin.svg" alt="Illimité" height={60} width={60} />

        <div className="flex-1">
          <p className="text-slate-700 dark:text-foreground text-base lg:text-xl font-bold">
            Cœurs illimités
          </p>

          <p className="text-sm text-slate-500 dark:text-muted-foreground">
            🔧 Bientôt disponible
          </p>
        </div>

        <Button
          onClick={onUpgrade}
          disabled={pending}
          variant="primary"
        >
          {hasActiveSubscription ? "Paramètres" : "Améliorer"}
        </Button>
      </li>

    </ul>
  );
};