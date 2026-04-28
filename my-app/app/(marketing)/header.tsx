"use client";

import Image from "next/image";
import { Loader } from "lucide-react";
import { ClerkLoaded, ClerkLoading, SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const { isSignedIn } = useAuth();

  return (
    <header className="h-20 w-full px-4
      bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm
      border-b border-slate-200/80 dark:border-slate-700/80
      sticky top-0 z-50"
    >
      <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full">

        {/* Logo */}
        <div className="flex items-center gap-x-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-200/40 rounded-full blur-md scale-125
              opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Image
              src="/mascot.svg"
              height={38}
              width={38}
              alt="Mascot"
              className="relative drop-shadow-sm"
            />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight
            text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-500"
          >
            Learnly
          </h1>
        </div>

        {/* Auth */}
        <ClerkLoading>
          <Loader className="h-5 w-5 text-blue-300 animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          {isSignedIn ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <Button
                size="lg"
                variant="ghost"
                className="rounded-xl font-semibold text-slate-500 dark:text-slate-400
                  hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30
                  transition-all duration-200"
              >
                Login
              </Button>
            </SignInButton>
          )}
        </ClerkLoaded>

      </div>
    </header>
  );
};