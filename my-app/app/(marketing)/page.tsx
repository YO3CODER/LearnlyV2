"use client";

import Image from "next/image";
import { Loader } from "lucide-react";
import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignUpButton,
  useAuth,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const { isSignedIn } = useAuth();

  return (
    <>
      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.85); }
          70%  { transform: scale(1.04); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .hero-float   { animation: heroFloat 4s ease-in-out infinite; }
        .fade-up      { animation: fadeUp 0.55s cubic-bezier(0.34,1.56,0.64,1) both; }
        .fade-up-d1   { animation: fadeUp 0.55s 0.10s cubic-bezier(0.34,1.56,0.64,1) both; }
        .fade-up-d2   { animation: fadeUp 0.55s 0.20s cubic-bezier(0.34,1.56,0.64,1) both; }
        .pop-in       { animation: popIn  0.5s  0.30s cubic-bezier(0.34,1.56,0.64,1) both; }
        .shimmer-word {
          background: linear-gradient(90deg, #3b82f6 0%, #93c5fd 40%, #3b82f6 60%, #93c5fd 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden
        bg-gradient-to-br from-slate-50 via-white to-blue-50/40
        dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
      >
        {/* Blobs décoratifs */}
        <div className="absolute top-[-80px] left-[-80px] w-[340px] h-[340px] rounded-full
          bg-blue-100/60 dark:bg-blue-900/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-60px] right-[-60px] w-[280px] h-[280px] rounded-full
          bg-blue-100/50 dark:bg-blue-900/20 blur-3xl pointer-events-none" />

        <div className="relative max-w-[988px] mx-auto flex-1 w-full flex flex-col lg:flex-row
          items-center justify-center p-6 gap-8 lg:gap-16 z-10"
        >
          {/* Illustration hero — flottante et réduite */}
          <div className="relative w-[180px] h-[180px] lg:w-[280px] lg:h-[280px] mb-2 lg:mb-0 shrink-0 hero-float">
            <div className="absolute inset-0 bg-blue-200/30 dark:bg-blue-800/20 rounded-full blur-2xl scale-110" />
            <Image src="/hero.svg" fill alt="Hero" className="relative drop-shadow-xl" />
          </div>

          {/* Contenu */}
          <div className="flex flex-col items-center lg:items-start gap-y-7">

            {/* Texte */}
            <div className="space-y-3 text-center lg:text-left">
              <p className="fade-up text-xs font-semibold tracking-widest uppercase text-blue-400">
                Prêt à tout déchirer ?
              </p>

              <h1 className="fade-up-d1 text-3xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight max-w-[480px]">
                Apprends, progresse,{" "}
                <span className="shimmer-word">maîtrise</span>
                <br />
                <span className="text-slate-400 dark:text-slate-500 font-bold text-2xl lg:text-3xl">
                  — sans te noyer dans les notes.
                </span>
              </h1>

              <p className="fade-up-d2 text-slate-500 dark:text-slate-400 text-sm lg:text-base font-medium max-w-[380px]">
                Des cours clairs, des vidéos qui vont droit au but, et des exercices pour vraiment ancrer ce que tu apprends.
              </p>
            </div>

            {/* Boutons */}
            <div className="pop-in flex flex-col items-center gap-y-3 w-full max-w-[330px]">

              <ClerkLoading>
                <Loader className="h-5 w-5 text-blue-300 animate-spin" />
              </ClerkLoading>

              <ClerkLoaded>
                {isSignedIn ? (
                  <Button
                    size="lg"
                    className="w-full rounded-xl font-bold
                      bg-gradient-to-r from-blue-500 to-cyan-400
                      hover:opacity-90 text-white shadow-md shadow-blue-200 dark:shadow-blue-900
                      transition-all duration-200 border-b-4 border-blue-700 active:border-b-0 active:scale-95"
                    asChild
                  >
                    <Link href="/learn">Continuer l&apos;apprentissage</Link>
                  </Button>
                ) : (
                  <>
                    <SignUpButton mode="modal">
                      <Button
                        size="lg"
                        className="w-full rounded-xl font-bold shadow-md shadow-blue-100 dark:shadow-blue-900
                          bg-gradient-to-r from-blue-500 to-cyan-400
                          hover:opacity-90 text-white transition-all duration-200
                          border-b-4 border-blue-700 active:border-b-0 active:scale-95"
                      >
                        Commencer — c&apos;est gratuit
                      </Button>
                    </SignUpButton>

                    <SignInButton mode="modal">
                      <Button
                        size="lg"
                        variant="primary"
                        className="w-full rounded-xl font-semibold
                          border border-slate-200 dark:border-slate-700
                          text-slate-600 dark:text-slate-300
                          hover:bg-slate-100 dark:hover:bg-slate-800
                          transition-all duration-200"
                      >
                        J&apos;ai déjà un compte
                      </Button>
                    </SignInButton>
                  </>
                )}
              </ClerkLoaded>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}