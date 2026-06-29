import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";

export const Promo = () => {
  return (
    <div className="border-2 rounded-xl p-4 space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-x-2">
          <Image
            src="/heartInfin.svg"
            alt="Pro"
            height={26}
            width={26}
          />
          <h3 className="font-bold text-lg">
            Passer à Pro
          </h3>
        </div>
        <p className="text-muted-foreground">
          Obtenez des cœurs illimités et plus !
        </p>
      </div>
      <Button
        asChild
        variant="super"
        className="w-full"
        size="lg"
      >
        <Link href="/shop">
          Mettre à niveau maintenant
        </Link>
      </Button>

      {/* Boutons Jeux et MaitreLucas */}
      <div className="flex justify-start gap-2 pt-2">
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
          <a href="https://maitrelucas.fr/" target="_blank" rel="noopener noreferrer">
            <img src="/maitrelucas1.svg" alt="MaitreLucas" width={22} height={22} />
          </a>
        </Button>
      </div>
    </div>
  );
};