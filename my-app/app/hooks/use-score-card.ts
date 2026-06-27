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

// Palettes soft — [centre, milieu, bord]
const PALETTES = [
  ["#ede9fe", "#f5f3ff", "#ffffff"], // violet
  ["#fce7f3", "#fdf2f8", "#ffffff"], // rose
  ["#d1fae5", "#ecfdf5", "#ffffff"], // emerald
  ["#dbeafe", "#eff6ff", "#ffffff"], // blue
  ["#fef3c7", "#fffbeb", "#ffffff"], // amber
  ["#e0f2fe", "#f0f9ff", "#ffffff"], // sky
  ["#f3e8ff", "#faf5ff", "#ffffff"], // purple
  ["#ffedd5", "#fff7ed", "#ffffff"], // orange
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

async function loadFredoka(): Promise<void> {
  try {
    const fredoka = new FontFace(
      "Fredoka",
      "url(https://fonts.gstatic.com/s/fredoka/v14/X7nP4b87HvSqjb_WIi2yDCRwoQ.woff2)",
    );
    await fredoka.load();
    document.fonts.add(fredoka);
  } catch (_) { /* fallback sans-serif */ }
}

async function drawCard(data: ScoreCardData): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Charger Fredoka avant de dessiner
  await loadFredoka();

  // ── Fond dégradé soft aléatoire ─────────────────────────────────────
  const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
  const bg = ctx.createRadialGradient(W / 2, H * 0.3, 0, W / 2, H / 2, W * 0.8);
  bg.addColorStop(0,   palette[0]);
  bg.addColorStop(0.6, palette[1]);
  bg.addColorStop(1,   palette[2]);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // ── Mascotte aléatoire ───────────────────────────────────────────────
  const mascotSrc = MASCOTS[Math.floor(Math.random() * MASCOTS.length)];
  const mascotImg = await loadImage(mascotSrc);
  const mascotSize = 420;
  const mascotX = W / 2 - mascotSize / 2;
  const mascotY = 80;
  if (mascotImg.complete && mascotImg.naturalWidth > 0) {
    ctx.drawImage(mascotImg, mascotX, mascotY, mascotSize, mascotSize);
  }

  // ── XP : taille adaptive selon longueur ─────────────────────────────
  const xpText = data.points.toLocaleString();
  const boltSize = 110;
  const xpGap = 20;

  // Calcule la taille de police pour que le bloc [bolt + chiffre] tienne en W - 120px
  let xpFontSize = 160;
  ctx.font = `bold ${xpFontSize}px Fredoka, sans-serif`;
  while (
    boltSize + xpGap + ctx.measureText(xpText).width > W - 120 &&
    xpFontSize > 60
  ) {
    xpFontSize -= 8;
    ctx.font = `bold ${xpFontSize}px Fredoka, sans-serif`;
  }

  const xpTextW  = ctx.measureText(xpText).width;
  const xpTotalW = boltSize + xpGap + xpTextW;
  const xpStartX = W / 2 - xpTotalW / 2;
  const xpBaseY  = mascotY + mascotSize + xpFontSize + 10;

  // Icône bolt
  const boltImg = await loadImage("/xp-bolt.svg");
  if (boltImg.complete && boltImg.naturalWidth > 0) {
    ctx.drawImage(boltImg, xpStartX, xpBaseY - boltSize + 12, boltSize, boltSize);
  }

  // Chiffre XP (contour + fill blanc)
  ctx.textAlign = "left";
  ctx.lineJoin   = "round";
  ctx.lineWidth  = 14;
  ctx.strokeStyle = "#7c3aed";
  ctx.strokeText(xpText, xpStartX + boltSize + xpGap, xpBaseY);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(xpText, xpStartX + boltSize + xpGap, xpBaseY);

  // ── Streak avec icône flamme + Fredoka ──────────────────────────────
  const streakY    = xpBaseY + 90;
  const streakText = `${data.streak} jours de streak`;
  ctx.font = `700 52px Fredoka, sans-serif`;
  const streakTextW  = ctx.measureText(streakText).width;
  const flameSize    = 56;
  const flameGap     = 14;
  const streakTotalW = flameSize + flameGap + streakTextW;
  const streakStartX = W / 2 - streakTotalW / 2;

  const flameImg = await loadImage("/flamme.svg");
  if (flameImg.complete && flameImg.naturalWidth > 0) {
    ctx.drawImage(flameImg, streakStartX, streakY - flameSize + 8, flameSize, flameSize);
  }

  ctx.fillStyle = "#3b3054";
  ctx.lineWidth = 0;
  ctx.fillText(streakText, streakStartX + flameSize + flameGap, streakY);

  // ── Langue (si dispo) ────────────────────────────────────────────────
  ctx.textAlign = "center";
  if (data.courseTitle) {
    ctx.font      = "500 36px Fredoka, sans-serif";
    ctx.fillStyle = "#9d8fc2";
    ctx.fillText(data.courseTitle, W / 2, streakY + 80);
  }

  // ── Branding Learnly ─────────────────────────────────────────────────
  ctx.font      = "700 72px Fredoka, sans-serif";
  ctx.fillStyle = "#38bdf8";
  ctx.fillText("Learnly", W / 2, H - 60);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/png");
  });
}

export function useScoreCard() {
  const [loading, setLoading] = useState(false);
  const [error,   setError  ] = useState<string | null>(null);

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
    const a   = document.createElement("a");
    a.href     = url;
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
        text:  "Regarde ma progression sur Learnly !",
      });
      return;
    }

    download();
  }, [generate, download]);

  return { share, download, loading, error };
}