"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ClerkLoading,
  ClerkLoaded,
  UserButton,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarItem } from "./sidebar-item";

type Props = {
  className?: string;
};

const buttonStyles = {
  primary: "bg-sky-400 text-white hover:bg-sky-400/90 border-sky-500 border-b-4 active:border-b-0",
  danger: "bg-rose-500 text-white hover:bg-rose-500/90 border-rose-600 border-b-4 active:border-b-0",
};

const courses = [
  {
    title: "Cours 1",
    href: "https://maitrelucas.fr/cours1",
    description: "Description du cours 1"
  },
  {
    title: "Cours 2",
    href: "https://maitrelucas.fr/cours2",
    description: "Description du cours 2"
  }
];

export const Sidebar = ({ className }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          "flex h-full w-[80px] fixed left-0 top-0 flex-col items-center",
          "bg-background",
          "border-r border-border",
          "shadow-sm",
          className
        )}
      >
        {/* LOGO */}
        <Link href="/">
          <div className="h-[72px] flex items-center justify-center group cursor-pointer">
            <Image
              src="/mascot.svg"
              height={44}
              width={44}
              alt="Mascot"
              className="relative"
            />
          </div>
        </Link>

        {/* Divider */}
        <div className="w-10 h-px bg-border mb-4" />

        {/* NAVIGATION */}
        <div className="flex flex-col gap-y-1 flex-1 w-full px-2">
          <SidebarItem href="/learn"       iconSrc="/learn.svg" />
          <SidebarItem href="/leaderboard" iconSrc="/leaderboard.svg" />
          <SidebarItem href="/quests"      iconSrc="/quest.svg" />
          <SidebarItem href="/shop"        iconSrc="/shop.svg" />
          <button
            onClick={() => setOpen(true)}
            className="flex items-center justify-center h-12 w-12 rounded-xl transition-all duration-200 text-gray-400 hover:text-gray-200 hover:bg-card"
            title="Maitre Lucas"
          >
            <Image
              src="/study.svg"
              height={24}
              width={24}
              alt="Maitre Lucas"
            />
          </button>
        </div>

        {/* THEME */}
        <div className="mb-3">
          <ThemeToggle />
        </div>

        {/* Divider */}
        <div className="w-10 h-px bg-border mb-3" />

        {/* USER */}
        <div className="mb-4 p-2 rounded-2xl bg-card border border-border flex items-center justify-center">
          <ClerkLoading>
            <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
          </ClerkLoading>
          <ClerkLoaded>
            <UserButton />
          </ClerkLoaded>
        </div>
      </div>

      {/* Modal avec Headless UI */}
      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all duration-500 data-closed:scale-95 data-closed:opacity-0 data-enter:duration-500 data-enter:ease-out data-leave:duration-300 data-leave:ease-in w-full max-w-md border border-gray-200 flex flex-col z-50"
          >
            {/* Header avec image et titre */}
            <div className="px-6 py-8 flex flex-col items-center justify-center border-b border-gray-200">
              <div className="mb-6">
                <Image
                  src="/mascot.svg"
                  alt="Mascotte"
                  height={80}
                  width={80}
                  className="w-20 h-20"
                />
              </div>
              <DialogTitle as="h2" className="text-center font-bold text-2xl text-gray-900 mb-2">
                Cours - Maitre Lucas
              </DialogTitle>
              <p className="text-center text-gray-600 text-sm">
                Choisis un cours pour commencer
              </p>
            </div>

            {/* Contenu - Boutons des cours */}
            <div className="px-6 py-6 flex-grow overflow-y-auto max-h-[400px]">
              <div className="space-y-3">
                {courses.map((course, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      window.open(course.href, "_blank");
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform active:scale-95 text-sm",
                      index === 0 ? buttonStyles.primary : "bg-yellow-400 text-gray-900 hover:bg-yellow-400/90 border-yellow-500 border-b-4 active:border-b-0"
                    )}
                  >
                    {course.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer avec bouton fermer */}
            <div className="border-t border-gray-200 px-6 py-4 flex-shrink-0">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={cn(
                  "w-full px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform active:scale-95 text-sm",
                  buttonStyles.danger
                )}
              >
                Fermer
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};