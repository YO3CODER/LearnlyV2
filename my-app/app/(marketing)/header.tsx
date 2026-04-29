"use client";

import Image from "next/image";
import { Loader } from "lucide-react";
import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  UserButton,
  useAuth,
} from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export const Header = () => {
  const { isSignedIn } = useAuth();

  return (
    <header
      className="
        h-20 w-full px-4
        bg-background/95
        backdrop-blur-sm
        border-b-2 border-border
        sticky top-0 z-50
      "
    >
      <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full">

        {/* Logo */}
        <div className="flex items-center gap-x-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-md scale-125 opacity-0 group-hover:opacity-100 transition duration-300" />
            <Image
              src="/mascot.svg"
              height={38}
              width={38}
              alt="Mascot"
              className="relative"
            />
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-blue-400">
            Learnly
          </h1>
        </div>

        {/* Auth */}
        <ClerkLoading>
          <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
        </ClerkLoading>

        <ClerkLoaded>
          {isSignedIn ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <Button
                size="lg"
                variant="ghost"
                className="
                  rounded-xl font-semibold
                  text-muted-foreground
                  hover:text-foreground
                  hover:bg-accent
                  transition-all duration-200
                "
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