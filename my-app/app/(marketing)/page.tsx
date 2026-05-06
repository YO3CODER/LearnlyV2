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
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden
      bg-gradient-to-br from-slate-50 via-white to-blue-50/40
      dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
    >
      {/* Decorative blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-[340px] h-[340px] rounded-full
        bg-blue-100/60 dark:bg-blue-900/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-60px] w-[280px] h-[280px] rounded-full
        bg-blue-100/50 dark:bg-blue-900/20 blur-3xl pointer-events-none" />

      <div className="relative max-w-[988px] mx-auto flex-1 w-full flex flex-col lg:flex-row
        items-center justify-center p-6 gap-8 lg:gap-16 z-10"
      >
        {/* Illustration hero */}
        <div className="relative w-[220px] h-[220px] lg:w-[420px] lg:h-[420px] mb-4 lg:mb-0 shrink-0">
          <div className="absolute inset-0 bg-blue-200/30 dark:bg-blue-800/20 rounded-full blur-2xl scale-110" />
          <Image src="/hero.svg" fill alt="Hero" className="relative drop-shadow-xl" />
        </div>

        {/* Contenu */}
        <div className="flex flex-col items-center lg:items-start gap-y-8">

          {/* Texte */}
          <div className="space-y-3 text-center lg:text-left">

            <p className="text-xs font-semibold tracking-widest uppercase text-blue-400">
              Bienvenue sur Learnly
            </p>

            <h1 className="text-3xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight max-w-[480px]">
              Apprends, pratique, et{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-500">
                maîtrise
              </span>{" "}
              de nouvelles compétences avec Learnly.
            </h1>

            <p className="text-slate-600 dark:text-slate-400 text-sm lg:text-base font-medium max-w-[380px]">
              Rejoins des milliers d&apos;apprenants et commence ton parcours aujourd&apos;hui — gratuitement.
            </p>

          </div>

          {/* Boutons */}
          <div className="flex flex-col items-center gap-y-3 w-full max-w-[330px]">

            <ClerkLoading>
              <Loader className="h-5 w-5 text-blue-300 animate-spin" />
            </ClerkLoading>

            <ClerkLoaded>
              {isSignedIn ? (
                <Button
                  size="lg"
                  className="w-full rounded-xl font-bold
                    bg-gradient-to-r from-blue-500 to-blue-500
                    hover:opacity-90 text-white shadow-md shadow-blue-200 dark:shadow-blue-900
                    transition-all duration-200"
                  asChild
                >
                  <Link href="/learn">Continuer l&apos;apprentissage →</Link>
                </Button>
              ) : (
                <>
                  <SignUpButton mode="modal">
                    <Button
                      size="lg"
                      className="w-full rounded-xl font-bold shadow-md shadow-blue-100 dark:shadow-blue-900
                        bg-gradient-to-r from-blue-500 to-blue-500
                        hover:opacity-90 text-white transition-all duration-200"
                    >
                      Commencer — c&apos;est gratuit
                    </Button>
                  </SignUpButton>

                  <SignInButton mode="modal">
                    <Button
                      size="lg"
                      variant="primary"
                      className="w-full rounded-xl font-semibold
                        border-border
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
  );
}