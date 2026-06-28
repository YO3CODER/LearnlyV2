'use client';

import { useRive } from '@rive-app/react-canvas';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '@/components/sidebar';
import { MobileNavbar } from '@/components/mobile-navbar';

const fredoka = { fontFamily: "'Fredoka', sans-serif" } as const;

const gifs = [
  { src: '/1.gif', label: 'Action 1' },
  { src: '/2.gif', label: 'Action 2' },
  { src: '/3.gif', label: 'Action 3' },
  { src: '/4.gif', label: 'Action 4' },
];

type GameId = 'piano' | 'expression' | 'gamification' | 'souris' | 'memory' | 'monde';

// ─── Jeu de mémoire ──────────────────────────────────────────────────────────
const MEMORY_PAIRS = [
  { id: 'chat',    label: 'Chat',    emoji: '🐱' },
  { id: 'chien',   label: 'Chien',   emoji: '🐶' },
  { id: 'soleil',  label: 'Soleil',  emoji: '☀️' },
  { id: 'lune',    label: 'Lune',    emoji: '🌙' },
  { id: 'fleur',   label: 'Fleur',   emoji: '🌸' },
  { id: 'etoile',  label: 'Etoile',  emoji: '⭐' },
  { id: 'pomme',   label: 'Pomme',   emoji: '🍎' },
  { id: 'coeur',   label: 'Coeur',   emoji: '❤️' },
];

type MemoryCard = {
  uid: number;
  id: string;
  label: string;
  emoji: string;
  flipped: boolean;
  matched: boolean;
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildDeck(): MemoryCard[] {
  const pairs = [...MEMORY_PAIRS, ...MEMORY_PAIRS];
  return shuffle(pairs).map((p, i) => ({
    uid: i,
    ...p,
    flipped: false,
    matched: false,
  }));
}

function MemoryGame({ onClose }: { onClose: () => void }) {
  const [cards, setCards] = useState<MemoryCard[]>(buildDeck);
  const [selected, setSelected] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running || won) return;
    const t = setInterval(() => setTime(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [running, won]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const flip = useCallback((uid: number) => {
    if (locked) return;
    const card = cards[uid];
    if (card.flipped || card.matched) return;

    const next = cards.map(c => c.uid === uid ? { ...c, flipped: true } : c);
    const newSelected = [...selected, uid];
    setCards(next);
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);
      const [a, b] = newSelected.map(i => next[i]);
      if (a.id === b.id) {
        setTimeout(() => {
          setCards(c => c.map(card =>
            card.id === a.id ? { ...card, matched: true } : card
          ));
          setSelected([]);
          setLocked(false);
        }, 400);
      } else {
        setTimeout(() => {
          setCards(c => c.map(card =>
            newSelected.includes(card.uid) ? { ...card, flipped: false } : card
          ));
          setSelected([]);
          setLocked(false);
        }, 900);
      }
    }
  }, [cards, selected, locked]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.matched)) {
      setWon(true);
      setRunning(false);
    }
  }, [cards]);

  const restart = () => {
    setCards(buildDeck());
    setSelected([]);
    setLocked(false);
    setMoves(0);
    setWon(false);
    setTime(0);
    setRunning(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
      <div className="flex items-center justify-between px-4 sm:px-8 py-4">
        <div className="flex items-center gap-6">
          <div className="text-white/80 text-sm font-semibold" style={fredoka}>
            <span className="text-white text-lg">{moves}</span> coups
          </div>
          <div className="text-white/80 text-sm font-semibold" style={fredoka}>
            <span className="text-white text-lg">{formatTime(time)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={restart} style={fredoka}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm border border-white/20 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
            </svg>
            Rejouer
          </button>
          <button onClick={onClose} style={fredoka}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm border border-white/20 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Fermer
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-4">
        <div className="grid grid-cols-4 gap-3 sm:gap-4 w-full max-w-lg">
          {cards.map((card) => (
            <button key={card.uid} onClick={() => flip(card.uid)}
              className="relative aspect-square" style={{ perspective: '600px' }}>
              <div style={{
                transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
                transformStyle: 'preserve-3d',
                transform: card.flipped || card.matched ? 'rotateY(180deg)' : 'rotateY(0deg)',
                width: '100%', height: '100%', position: 'relative',
              }}>
                <div style={{ backfaceVisibility: 'hidden' }}
                  className="absolute inset-0 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-2xl select-none">?</span>
                </div>
                <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  className={`absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all ${
                    card.matched ? 'bg-emerald-500/30 border-emerald-400/50' : 'bg-white/20 border-white/30'
                  }`}>
                  <span className="text-3xl sm:text-4xl select-none">{card.emoji}</span>
                  <span className="text-white text-xs font-semibold select-none" style={fredoka}>{card.label}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {won && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white/10 border border-white/20 rounded-3xl p-8 flex flex-col items-center gap-4 text-white text-center backdrop-blur-md max-w-xs w-full mx-4">
            <div className="text-6xl">🎉</div>
            <h2 className="text-2xl font-bold" style={fredoka}>Bravo !</h2>
            <p className="text-white/80 text-sm" style={fredoka}>
              Tu as terminé en <strong>{moves} coups</strong> et <strong>{formatTime(time)}</strong>
            </p>
            <div className="flex gap-3 mt-2 w-full">
              <button onClick={restart} style={fredoka}
                className="flex-1 py-3 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-bold text-sm border-b-4 border-violet-700 active:border-b-0 transition-all">
                Rejouer
              </button>
              <button onClick={onClose} style={fredoka}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Jeu Monde (iframe GameMonetize) ─────────────────────────────────────────
function MondeGame({ onClose }: { onClose: () => void }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="absolute top-4 right-4 z-50">
        <button onClick={onClose} style={fredoka}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm border border-white/20 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Fermer
        </button>
      </div>

      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
          <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-white animate-spin" />
          <p className="text-white/60 text-sm" style={fredoka}>Chargement du jeu...</p>
        </div>
      )}

      <iframe
        src="https://html5.gamemonetize.co/tbq36l8p3xem75kh6n4fyua4yrajucnw/"
        className="flex-1 w-full border-0"
        allow="autoplay; fullscreen *; gamepad"
        allowFullScreen
        onLoad={() => setLoaded(true)}
        title="Jeu du Monde"
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
      />
    </div>
  );
}

// ─── Preview Monde ────────────────────────────────────────────────────────────
function MondePreview() {
  const continents = ['🌍', '🌎', '🌏', '🗺️'];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive(i => (i + 1) % continents.length), 700);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
      <div className="text-6xl transition-all duration-300" style={{ filter: 'drop-shadow(0 0 12px rgba(59,130,246,0.6))' }}>
        {continents[active]}
      </div>
      <div className="flex gap-2">
        {['🏔️', '🏝️', '🌋', '🏜️'].map((e, i) => (
          <span key={i} className="text-xl opacity-70">{e}</span>
        ))}
      </div>
      <p className="text-white/60 text-xs font-semibold tracking-wider uppercase" style={fredoka}>
        Exploration
      </p>
    </div>
  );
}

// ─── Composant Rive unique ────────────────────────────────────────────────────
function SingleRiveGame({ src, sm }: { src: string; sm: string }) {
  const { RiveComponent, rive } = useRive({ src, stateMachines: sm, autoplay: true });

  return (
    <div className="w-full h-full relative">
      {!rive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black">
          <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-white animate-spin" />
          <p className="text-white/60 text-sm" style={fredoka}>Chargement...</p>
        </div>
      )}
      <RiveComponent style={{
        width: '100%', height: '100vh',
        opacity: rive ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }} />
    </div>
  );
}

// ─── Fullscreen Rive ──────────────────────────────────────────────────────────
type RiveGameId = Exclude<GameId, 'memory' | 'monde'>;

function FullscreenGame({ gameId, onClose }: { gameId: RiveGameId; onClose: () => void }) {
  const gameMap: Record<RiveGameId, { src: string; sm: string }> = {
    piano:        { src: '/piano.riv',        sm: 'MAIN-sm'         },
    expression:   { src: '/expression.riv',   sm: 'Grid'            },
    gamification: { src: '/gamification.riv', sm: 'State Machine 1' },
    souris:       { src: '/souris.riv',       sm: 'State Machine 1' },
  };

  const { src, sm } = gameMap[gameId];

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="absolute top-4 right-4 z-50">
        <button onClick={onClose} style={fredoka}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm border border-white/20 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
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

// ─── Preview Rive lazy ────────────────────────────────────────────────────────
function RivePreview({ src, sm }: { src: string; sm?: string }) {
  const { RiveComponent, rive } = useRive({ src, stateMachines: sm, autoplay: true });

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

// ─── Preview Memory ───────────────────────────────────────────────────────────
function MemoryPreview() {
  const pairs = ['🐱', '🐶', '☀️', '🌙', '🌸', '⭐', '🍎', '❤️'];
  const [active, setActive] = useState<number[]>([0, 4]);

  useEffect(() => {
    const t = setInterval(() => {
      const a = Math.floor(Math.random() * 8);
      const b = Math.floor(Math.random() * 8);
      setActive([a, b]);
    }, 800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="grid grid-cols-4 gap-1.5">
        {pairs.map((emoji, i) => (
          <div key={i}
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all duration-300 ${
              active.includes(i) ? 'bg-violet-500/80 scale-105' : 'bg-white/10 border border-white/20'
            }`}>
            {active.includes(i) ? emoji : <span className="text-white/40 text-sm">?</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── GameCard ─────────────────────────────────────────────────────────────────
function GameCard({
  title, badge, badgeColor, borderColor, description,
  previewSrc, smName, staticPreview, customPreview, onPlay,
}: {
  title: string;
  badge: string;
  badgeColor: string;
  borderColor: string;
  description: string;
  previewSrc?: string;
  smName?: string;
  staticPreview?: string;
  customPreview?: React.ReactNode;
  onPlay: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`card-in bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border-l-4 ${borderColor} flex flex-col`}
      onMouseEnter={() => !staticPreview && !customPreview && setHovered(true)}
    >
      <div className="relative bg-muted overflow-hidden" style={{ height: 200 }}>

        {customPreview && (
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/80 via-purple-900/80 to-indigo-900/80">
            {customPreview}
          </div>
        )}

        {!customPreview && staticPreview && (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={staticPreview} alt={title}
              className="w-36 h-36 object-contain" loading="lazy" decoding="async" />
          </div>
        )}

        {!customPreview && !staticPreview && (
          <>
            {!hovered && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-muted-foreground/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    className="text-muted-foreground/40">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              </div>
            )}
            {hovered && previewSrc && <RivePreview src={previewSrc} sm={smName} />}
          </>
        )}

        <div onClick={onPlay}
          className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-200 flex items-center justify-center group cursor-pointer">
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200 shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#7c3aed">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 flex flex-col gap-3 flex-1">
        <div>
          <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1 ${badgeColor}`} style={fredoka}>
            {badge}
          </span>
          <p className="text-sm font-semibold text-foreground" style={fredoka}>{title}</p>
          <p className="text-xs text-muted-foreground mt-1" style={fredoka}>{description}</p>
        </div>
        <button onClick={onPlay} style={fredoka}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-violet-500 text-white border-b-4 border-violet-600 hover:bg-violet-500/90 active:border-b-0 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Jouer
        </button>
      </div>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function RiverPage() {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  const close = () => setActiveGame(null);

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

      {activeGame === 'memory' && <MemoryGame onClose={close} />}
      {activeGame === 'monde'  && <MondeGame  onClose={close} />}
      {activeGame !== null && activeGame !== 'memory' && activeGame !== 'monde' && (
        <FullscreenGame gameId={activeGame as RiveGameId} onClose={close} />
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
                        <div className="text-2xl font-bold">6</div>
                        <div className="text-xs text-purple-100">Jeux</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30" style={fredoka}>
                        <div className="text-2xl font-bold">4</div>
                        <div className="text-xs text-purple-100">GIFs</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center md:justify-end">
                    <div className="hero-float">
                      <Image src="/mascot.svg" alt="Mascotte" width={200} height={200} className="drop-shadow-2xl" priority />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">

            <section>
              <h2 className="text-base font-semibold text-muted-foreground uppercase tracking-wider mb-6" style={fredoka}>
                Jeux interactifs
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">

                <GameCard
                  title="Jeu de mémoire"
                  badge="Memory"
                  badgeColor="bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
                  borderColor="border-l-violet-400"
                  description="Retrouve les paires de cartes. Entraine ta memoire !"
                  customPreview={<MemoryPreview />}
                  onPlay={() => setActiveGame('memory')}
                />

                <GameCard
                  title="Jeu du Monde"
                  badge="Géographie"
                  badgeColor="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                  borderColor="border-l-blue-400"
                  description="Explore la carte du monde et teste tes connaissances !"
                  customPreview={<MondePreview />}
                  onPlay={() => setActiveGame('monde')}
                />

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

            <section>
              <h2 className="text-base font-semibold text-muted-foreground uppercase tracking-wider mb-6" style={fredoka}>
                Effets visuels
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {gifs.map((gif, index) => (
                  <div key={gif.src} style={{ animationDelay: `${index * 60}ms` }}
                    className="card-in bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 p-5 flex flex-col items-center gap-3 cursor-pointer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={gif.src} alt={gif.label} loading="lazy" decoding="async" className="w-20 h-20 object-contain" />
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