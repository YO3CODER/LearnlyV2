"use client";

import { useScoreCard } from "../app/hooks/use-score-card";
import { Button } from "@/components/ui/button";
import { Share2, Download, Loader2 } from "lucide-react";
import { useState } from "react";

export function ShareScoreCard() {
  const { share, download, loading, error } = useScoreCard();
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    await share();
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const canShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="primary"
        size="lg"
        onClick={handleShare}
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : shared ? (
          "✓ Partagé !"
        ) : (
          <>
            <Share2 className="w-4 h-4 mr-2" />
            {canShare ? "Partager ma progression" : "Télécharger ma carte"}
          </>
        )}
      </Button>

      {canShare && (
        <Button
          variant="primaryOutline"
          size="lg"
          onClick={download}
          disabled={loading}
          className="w-full"
        >
          <Download className="w-4 h-4 mr-2" />
          Télécharger en PNG
        </Button>
      )}

      {error && (
        <p className="text-xs text-rose-400 text-center">{error}</p>
      )}
    </div>
  );
}

export function ShareScoreCardIcon() {
  const { share, loading } = useScoreCard();

  return (
    <Button
      variant="primaryOutline"
      size="icon"
      onClick={share}
      disabled={loading}
      title="Partager ma progression"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Share2 className="w-4 h-4" />
      )}
    </Button>
  );
}