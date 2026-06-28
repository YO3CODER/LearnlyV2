'use client';

import { useRive } from '@rive-app/react-canvas';
import Image from 'next/image';
import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { MobileNavbar } from '@/components/mobile-navbar';

const fredoka = { fontFamily: "'Fredoka', sans-serif" } as const;

const gifs = [
  { src: '/1.gif', label: 'Action 1' },
  { src: '/2.gif', label: 'Action 2' },
  { src: '/3.gif', label: 'Action 3' },
  { src: '/4.gif', label: 'Action 4' },
];

type GameId = 'piano' | 'expression' | 'gamification' | 'souris';

// ─── Composant Rive unique — 1 hook, 1 fichier ──────────────────────────────
function SingleRiveGame({ src, sm }: { src: string; sm: string }) {
  const { RiveComponent, rive } = useRive({
    src,
    stateMachines: sm,
    autoplay: true,
  });

  return (
    <div className="w-full h-full relative">
      {!rive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black">
          <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-white animate-spin" />
          <p className="text-white/60 text-sm" style={fredoka}>Chargement...</p>
        </div>
      )}
      <RiveComponent
        style={{
          width: '100%',
          height: '100vh',
          opacity: rive ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />
    </div>
  );
}

// ─── Fullscreen — monté uniquement quand activeGame !== null ─────────────────
function FullscreenGame({ gameId, onClose }: { gameId: GameId; onClose: () => void }) {
  const gameMap: Record<GameId, { src: string; sm: string }> = {
    piano:        { src: '/piano.riv',        sm: 'MAIN-sm'         },
    expression:   { src: '/expression.riv',   sm: 'Grid'            },
    gamification: { src: '/gamification.riv', sm: 'State Machine 1' },
    souris:       { src: '/souris.riv',       sm: 'State Machine 1' },
  };

  const { src, sm } = gameMap[gameId];

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={onClose}
          style={fredoka}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm border border-white/20 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          Fermer
        </button>
      </div>
      <div className="flex-1">
        <SingleRiveGame src={src} sm={sm} />
      </div>
    </div>
  );
}

// ─── Preview Rive lazy (chargée seulement au hover) ─────────────────────────
function RivePreview({ src, sm }: { src: string; sm?: string }) {
  const { RiveComponent, rive } = useRive({
    src,
    stateMachines: sm,
    autoplay: true,
  });

  return (
    <>
      {!rive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-muted-foreground/20 border-t-muted-foreground/60 animate-spin" />
        </div>
      )}
      <div className={rive ? 'absolute inset-0 flex items-center justify-center' : 'hidden'}>
        <RiveComponent style={{ width: 180, height: 180 }} />
      </div>
    </>
  );
}

// ─── GameCard ────────────────────────────────────────────────────────────────
function GameCard({
  title,
  badge,
  badgeColor,
  borderColor,
  description,
  previewSrc,
  smName,
  staticPreview,
  onPlay,
}: {
  title: string;
  badge: string;
  badgeColor: string;
  borderColor: string;
  description: string;
  previewSrc: string;
  smName?: string;
  staticPreview?: string; // image statique — aucun fetch Rive avant le clic
  onPlay: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`card-in bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border-l-4 ${borderColor} flex flex-col`}
      onMouseEnter={() => !staticPreview && setHovered(true)}
    >
      {/* Preview */}
      <div className="relative bg-muted overflow-hidden" style={{ height: 200 }}>

        {/* Cas 1 : preview statique (ex: piano.png) — jamais de fetch Rive */}
        {staticPreview && (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={staticPreview}
              alt={title}
              className="w-36 h-36 object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
        )}

        {/* Cas 2 : preview Rive chargée uniquement au hover */}
        {!staticPreview && (
          <>
            {/* Placeholder visible avant hover */}
            {!hovered && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-muted-foreground/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    className="text-muted-foreground/40"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              </div>
            )}
            {/* Rive monté seulement après hover */}
            {hovered && <RivePreview src={previewSrc} sm={smName} />}
          </>
        )}

        {/* Overlay play — toujours présent */}
        <div
          onClick={onPlay}
          className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-200 flex items-center justify-center group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200 shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
              viewBox="0 0 24 24" fill="#7c3aed">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Infos */}
      <div className="px-5 py-4 flex flex-col gap-3 flex-1">
        <div>
          <span
            className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1 ${badgeColor}`}
            style={fredoka}
          >
            {badge}
          </span>
          <p className="text-sm font-semibold text-foreground" style={fredoka}>{title}</p>
          <p className="text-xs text-muted-foreground mt-1" style={fredoka}>{description}</p>
        </div>
        <button
          onClick={onPlay}
          style={fredoka}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-violet-500 text-white border-b-4 border-violet-600 hover:bg-violet-500/90 active:border-b-0 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13"
            viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Jouer
        </button>
      </div>
    </div>
  );
}

// ─── Page principale ─────────────────────────────────────────────────────────
export default function RiverPage() {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  return (
    <>
      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .hero-float   { animation: heroFloat 4s ease-in-out infinite; }
        .hero-text-in { animation: heroFadeIn 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .card-in      { animation: fadeSlideIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .shimmer-text {
          background: linear-gradient(90deg,#fff 0%,#bfdbfe 40%,#fff 60%,#bfdbfe 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      {/* FullscreenGame : monté seulement au clic, démonté à la fermeture */}
      {activeGame !== null && (
        <FullscreenGame gameId={activeGame} onClose={() => setActiveGame(null)} />
      )}

      <div className="min-h-screen bg-background flex">
        <div className="hidden md:block md:w-[80px] flex-shrink-0">
          <Sidebar />
        </div>

        <div className="flex-1 pb-20 md:pb-0">

          {/* Hero */}
          <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-500 to-pink-400 text-white">
            <div className="absolute inset-0 pointer-events-none select-none">
              <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/10 rounded-full" />
              <div className="absolute -bottom-10 left-10 w-48 h-48 bg-white/5 rounded-full" />
              <div className="absolute top-4 right-1/3 w-6 h-6 bg-white/20 rounded-full" />
              <div className="absolute bottom-8 right-16 w-3 h-3 bg-pink-200/40 rounded-full" />
            </div>
            <div className="relative px-4 sm:px-6 py-8 sm:py-10">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="z-10 hero-text-in">
                    <p className="text-purple-200 text-xs font-semibold uppercase tracking-widest mb-1" style={fredoka}>
                      Animations interactives
                    </p>
                    <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-2" style={fredoka}>
                      <span className="shimmer-text">Jeux</span>
                      <br />
                      <span className="text-white">et Animations</span>
                    </h1>
                    <p className="text-purple-100 text-sm mb-4 leading-relaxed max-w-sm" style={fredoka}>
                      Clique sur un jeu pour le lancer en plein ecran.
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30" style={fredoka}>
                        <div className="text-2xl font-bold">4</div>
                        <div className="text-xs text-purple-100">Animations Rive</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30" style={fredoka}>
                        <div className="text-2xl font-bold">4</div>
                        <div className="text-xs text-purple-100">GIFs</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center md:justify-end">
                    <div className="hero-float">
                      <Image
                        src="/mascot.svg"
                        alt="Mascotte"
                        width={200}
                        height={200}
                        className="drop-shadow-2xl"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">

            {/* Jeux */}
            <section>
              <h2 className="text-base font-semibold text-muted-foreground uppercase tracking-wider mb-6" style={fredoka}>
                Jeux interactifs
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                {/* Piano : preview statique (piano.png) — piano.riv (24MB) jamais fetch avant clic */}
                <GameCard
                  title="Piano interactif"
                  badge="Piano"
                  badgeColor="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                  borderColor="border-l-red-400"
                  description="Joue du piano avec la mascotte"
                  previewSrc="/piano.riv"
                  smName="MAIN-sm"
                  staticPreview="/piano.png"
                  onPlay={() => setActiveGame('piano')}
                />

                {/* Les autres : preview Rive lazy au hover */}
                <GameCard
                  title="Grille d'expressions"
                  badge="Expressions"
                  badgeColor="bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
                  borderColor="border-l-violet-400"
                  description="Explore les expressions animees"
                  previewSrc="/expression.riv"
                  smName="Grid"
                  onPlay={() => setActiveGame('expression')}
                />
                <GameCard
                  title="Mascotte gamification"
                  badge="Gamification"
                  badgeColor="bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300"
                  borderColor="border-l-pink-400"
                  description="La mascotte des recompenses"
                  previewSrc="/gamification.riv"
                  smName="State Machine 1"
                  onPlay={() => setActiveGame('gamification')}
                />
                <GameCard
                  title="Chauve-souris"
                  badge="Chauve-souris"
                  badgeColor="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                  borderColor="border-l-emerald-400"
                  description="Animation de chauve-souris interactive"
                  previewSrc="/souris.riv"
                  smName="State Machine 1"
                  onPlay={() => setActiveGame('souris')}
                />
              </div>
            </section>

            {/* GIFs — lazy loading natif */}
            <section>
              <h2 className="text-base font-semibold text-muted-foreground uppercase tracking-wider mb-6" style={fredoka}>
                Effets visuels
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {gifs.map((gif, index) => (
                  <div
                    key={gif.src}
                    style={{ animationDelay: `${index * 60}ms` }}
                    className="card-in bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 p-5 flex flex-col items-center gap-3 cursor-pointer"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={gif.src}
                      alt={gif.label}
                      loading="lazy"
                      decoding="async"
                      className="w-20 h-20 object-contain"
                    />
                    <span className="text-sm font-semibold text-foreground text-center" style={fredoka}>
                      {gif.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>

        <MobileNavbar />
      </div>
    </>
  );
}