'use client';

import { useRive } from '@rive-app/react-canvas';
import Image from 'next/image';
import { Sidebar } from '@/components/sidebar';
import { MobileNavbar } from '@/components/mobile-navbar';

const fredoka = { fontFamily: "'Fredoka', sans-serif" } as const;

const gifs = [
  { src: '/1.gif', label: 'Action 1' },
  { src: '/2.gif', label: 'Action 2' },
  { src: '/3.gif', label: 'Action 3' },
  { src: '/4.gif', label: 'Action 4' },
];

export default function RiverPage() {
  const { RiveComponent: GridComponent } = useRive({
    src: '/expression.riv',
    stateMachines: 'Grid',
    autoplay: true,
  });

  const { RiveComponent: GamificationComponent } = useRive({
    src: '/gamification.riv',
    stateMachines: 'State Machine 1',
    autoplay: true,
  });

  const { RiveComponent: PianoComponent } = useRive({
    src: '/piano.riv',
    stateMachines: 'MAIN-sm',
    autoplay: true,
  });

  return (
    <>
      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
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
          100% { background-position: 200% center; }
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
                      Explore les animations Rive, le piano interactif et les effets visuels de Learnly.
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30" style={fredoka}>
                        <div className="text-2xl font-bold">3</div>
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
                      <Image src="/mascot.svg" alt="Mascotte" width={200} height={200} className="drop-shadow-2xl" priority />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">

            {/* Piano */}
            <section>
              <h2 className="text-base font-semibold text-muted-foreground uppercase tracking-wider mb-6" style={fredoka}>
                Piano interactif
              </h2>
              <div className="card-in bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border-l-4 border-l-red-400">
                <div className="px-5 pt-5 pb-2">
                  <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 mb-2" style={fredoka}>
                    Piano
                  </span>
                  <p className="text-sm font-semibold text-foreground mb-4" style={fredoka}>
                    Joue du piano avec la mascotte
                  </p>
                </div>
                <div className="flex justify-center px-4 pb-5">
                  <PianoComponent style={{ width: '100%', maxWidth: 600, height: 340 }} />
                </div>
              </div>
            </section>

            {/* Animations Rive */}
            <section>
              <h2 className="text-base font-semibold text-muted-foreground uppercase tracking-wider mb-6" style={fredoka}>
                Animations Rive
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="card-in bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden border-l-4 border-l-violet-400">
                  <div className="px-5 pt-5 pb-2">
                    <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 mb-2" style={fredoka}>
                      Expressions
                    </span>
                    <p className="text-sm font-semibold text-foreground" style={fredoka}>
                      Grille d'expressions animee
                    </p>
                  </div>
                  <div className="flex justify-center px-4 pb-5">
                    <GridComponent style={{ width: 280, height: 280 }} />
                  </div>
                </div>

                <div className="card-in bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden border-l-4 border-l-pink-400">
                  <div className="px-5 pt-5 pb-2">
                    <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300 mb-2" style={fredoka}>
                      Gamification
                    </span>
                    <p className="text-sm font-semibold text-foreground" style={fredoka}>
                      Mascotte gamification
                    </p>
                  </div>
                  <div className="flex justify-center px-4 pb-5">
                    <GamificationComponent style={{ width: 280, height: 280 }} />
                  </div>
                </div>
              </div>
            </section>

            {/* GIFs */}
            <section>
              <h2 className="text-base font-semibold text-muted-foreground uppercase tracking-wider mb-6" style={fredoka}>
                Effets visuels
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {gifs.map((gif, index) => (
                  <div key={gif.src} style={{ animationDelay: `${index * 60}ms` }}
                    className="card-in bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 p-5 flex flex-col items-center gap-3 cursor-pointer">
                    <img src={gif.src} alt={gif.label} className="w-20 h-20 object-contain" />
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