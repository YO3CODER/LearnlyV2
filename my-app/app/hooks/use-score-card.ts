// hooks/use-score-card.ts

import { useCallback, useState } from "react";

export type ScoreCardData = {
  userName: string;
  userImageSrc: string;
  points: number;
  streak: number;
  weeklyPoints: number;
  lessonsCompleted: number;
  challengesCompleted: number;
  hearts: number;
  courseTitle: string | null;
  courseImageSrc: string | null;
};

const W = 1080;
const H = 1080;

const MASCOTS = [
  "/quete3.svg",
  "/quete4.svg",
  "/quete5.svg",
  "/study1.svg",
  "/legendary.svg",
  "/ligue.svg",
];

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(img);
    img.src = src;
  });
}

async function drawCard(data: ScoreCardData): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // ── Fond dégradé clair (style Duolingo) ────────────────────────────
  const bg = ctx.createRadialGradient(W / 2, H * 0.3, 0, W / 2, H / 2, W * 0.8);
  bg.addColorStop(0, "#ede9fe");  // violet-100
  bg.addColorStop(0.6, "#f5f3ff"); // violet-50
  bg.addColorStop(1, "#ffffff");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // ── Mascotte aléatoire ──────────────────────────────────────────────
  const mascotSrc = MASCOTS[Math.floor(Math.random() * MASCOTS.length)];
  const mascotImg = await loadImage(mascotSrc);
  const mascotSize = 420;
  const mascotX = W / 2 - mascotSize / 2;
  const mascotY = 80;
  if (mascotImg.complete && mascotImg.naturalWidth > 0) {
    ctx.drawImage(mascotImg, mascotX, mascotY, mascotSize, mascotSize);
  }

  // ── XP total avec icône xp-bolt.svg ───────────────────────────────
  const numY = mascotY + mascotSize + 20;

  const xpText = data.points.toLocaleString();
  ctx.font = "bold 160px sans-serif";
  const xpTextW = ctx.measureText(xpText).width;
  const boltSize = 120;
  const xpGap = 24;
  const xpTotalW = boltSize + xpGap + xpTextW;
  const xpStartX = W / 2 - xpTotalW / 2;
  const xpBaseY = numY + 120;

  // Icône bolt
  const boltImg = await loadImage("/xp-bolt.svg");
  if (boltImg.complete && boltImg.naturalWidth > 0) {
    ctx.drawImage(boltImg, xpStartX, xpBaseY - boltSize + 10, boltSize, boltSize);
  }

  // Chiffre XP
  ctx.textAlign = "left";
  ctx.lineWidth = 16;
  ctx.strokeStyle = "#7c3aed";
  ctx.lineJoin = "round";
  ctx.strokeText(xpText, xpStartX + boltSize + xpGap, xpBaseY);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(xpText, xpStartX + boltSize + xpGap, xpBaseY);

  // ── Streak avec icône flamme.svg ────────────────────────────────────
  const line1Y = numY + 200;
  const streakText = `${data.streak} jours de streak`;
  ctx.font = "bold 52px sans-serif";
  const streakTextW = ctx.measureText(streakText).width;
  const flameSize = 56;
  const flameGap = 16;
  const streakTotalW = flameSize + flameGap + streakTextW;
  const streakStartX = W / 2 - streakTotalW / 2;

  const flameImg = await loadImage("/flamme.svg");
  if (flameImg.complete && flameImg.naturalWidth > 0) {
    ctx.drawImage(flameImg, streakStartX, line1Y - flameSize + 8, flameSize, flameSize);
  }

  ctx.fillStyle = "#3b3054";
  ctx.lineWidth = 0;
  ctx.fillText(streakText, streakStartX + flameSize + flameGap, line1Y);



  // ── Langue (si dispo) ───────────────────────────────────────────────
  ctx.textAlign = "center";
  if (data.courseTitle) {
    ctx.font = "500 36px sans-serif";
    ctx.fillStyle = "#9d8fc2";
    ctx.fillText(data.courseTitle, W / 2, line1Y + 120);
  }

  // ── Branding Learnly (Fredoka) ──────────────────────────────────────
  try {
    const fredoka = new FontFace(
      "Fredoka",
      "url(https://fonts.gstatic.com/s/fredoka/v14/X7nP4b87HvSqjb_WIi2yDCRwoQ.woff2)",
    );
    await fredoka.load();
    document.fonts.add(fredoka);
  } catch (_) { /* fallback sans-serif si offline */ }

  ctx.font = "700 72px Fredoka, sans-serif";
  ctx.fillStyle = "#38bdf8";
  ctx.fillText("Learnly", W / 2, H - 60);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/png");
  });
}

export function useScoreCard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (): Promise<Blob | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/score-card");
      if (!res.ok) throw new Error("Erreur lors du chargement des données");
      const data: ScoreCardData = await res.json();
      const blob = await drawCard(data);
      return blob;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const download = useCallback(async () => {
    const blob = await generate();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "learnly-score.png";
    a.click();
    URL.revokeObjectURL(url);
  }, [generate]);

  const share = useCallback(async () => {
    const blob = await generate();
    if (!blob) return;
    const file = new File([blob], "learnly-score.png", { type: "image/png" });

    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "Ma progression sur Learnly",
        text: `${(await fetch("/api/score-card").then(r => r.json())).points} XP sur Learnly !`,
      });
      return;
    }

    download();
  }, [generate, download]);

  return { share, download, loading, error };
}