"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ClerkLoading,
  ClerkLoaded,
  UserButton,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { useState, useMemo } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarItem } from "./sidebar-item";

type Props = {
  className?: string;
};

const fredoka = { fontFamily: "'Fredoka', sans-serif" } as const;

const buttonStyles = {
  primary: "bg-sky-400 text-white hover:bg-sky-400/90 border-sky-500 border-b-4 active:border-b-0",
  danger: "bg-rose-500 text-white hover:bg-rose-500/90 border-rose-600 border-b-4 active:border-b-0",
};

const courseColors = [
  "bg-sky-400 text-white border-sky-500 border-b-4 hover:bg-sky-400/90 active:border-b-0",
  "bg-yellow-400 text-gray-900 border-yellow-500 border-b-4 hover:bg-yellow-400/90 active:border-b-0",
  "bg-violet-500 text-white border-violet-600 border-b-4 hover:bg-violet-500/90 active:border-b-0",
  "bg-emerald-500 text-white border-emerald-600 border-b-4 hover:bg-emerald-500/90 active:border-b-0",
  "bg-orange-400 text-white border-orange-500 border-b-4 hover:bg-orange-400/90 active:border-b-0",
  "bg-fuchsia-500 text-white border-fuchsia-600 border-b-4 hover:bg-fuchsia-500/90 active:border-b-0",
  "bg-rose-400 text-white border-rose-500 border-b-4 hover:bg-rose-400/90 active:border-b-0",
  "bg-teal-400 text-gray-900 border-teal-500 border-b-4 hover:bg-teal-400/90 active:border-b-0",
  "bg-lime-400 text-gray-900 border-lime-500 border-b-4 hover:bg-lime-400/90 active:border-b-0",
  "bg-indigo-500 text-white border-indigo-600 border-b-4 hover:bg-indigo-500/90 active:border-b-0",
  "bg-amber-400 text-gray-900 border-amber-500 border-b-4 hover:bg-amber-400/90 active:border-b-0",
  "bg-cyan-400 text-gray-900 border-cyan-500 border-b-4 hover:bg-cyan-400/90 active:border-b-0",
];

const courses = [
  {
    title: "Écriture du A en cursive (a)",
    href: "https://youtu.be/UhdIYcwkEsI?si=sqZUPJ1Z4VpG5F8_",
    videoId: "UhdIYcwkEsI",
    isPreview: true,
  },
  {
    title: "Atome",
    href: "https://youtu.be/TV-leAqi8ps?si=8BvCnHwH-W1K2WJv",
    videoId: "TV-leAqi8ps",
    isPreview: true,
  },
  {
    title: "Résoudre une équation",
    href: "https://youtu.be/ezGlju-nR6s?si=fcSSX7JfG-W1N9sL",
    videoId: "ezGlju-nR6s",
    isPreview: true,
  },
  {
    title: "Résoudre une équation 4ème (1)",
    href: "https://youtu.be/uV_EmbYu9_E?si=vIzRzw8YLFFVkWEK",
    videoId: "uV_EmbYu9_E",
    isPreview: true,
  },
  {
    title: "La photosynthèse",
    href: "https://youtu.be/dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ",
    isPreview: true,
  },
  {
    title: "Conjugaison : le passé composé",
    href: "https://youtu.be/dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ",
    isPreview: true,
  },
  {
    title: "La respiration cellulaire",
    href: "https://youtu.be/dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ",
    isPreview: true,
  },
  {
    title: "La règle de trois",
    href: "https://youtu.be/dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ",
    isPreview: true,
  },
  {
    title: "Les figures géométriques",
    href: "https://youtu.be/dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ",
    isPreview: true,
  },
  {
    title: "La chaîne alimentaire",
    href: "https://youtu.be/dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ",
    isPreview: true,
  },
  {
    title: "Les nombres décimaux",
    href: "https://youtu.be/dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ",
    isPreview: true,
  },
  {
    title: "La Révolution française",
    href: "https://youtu.be/dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ",
    isPreview: true,
  },
];

export const Sidebar = ({ className }: Props) => {
  const [open, setOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredCourses = useMemo(
    () => courses.filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase())
    ),
    [search]
  );

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
            <Image src="/mascot.svg" height={44} width={44} alt="Mascot" />
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
            onClick={() => { setOpen(true); setSearch(""); }}
            className="flex items-center justify-center h-12 w-12 rounded-xl transition-all duration-200 text-gray-400 hover:text-gray-200 hover:bg-card"
            title="Maitre Lucas"
          >
            <Image src="/study.svg" height={24} width={24} alt="Maitre Lucas" />
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

      {/* Modal cours */}
      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all duration-500 data-closed:scale-95 data-closed:opacity-0 data-enter:duration-500 data-enter:ease-out data-leave:duration-300 data-leave:ease-in w-full max-w-md border border-gray-200 flex flex-col z-50"
            style={{ maxHeight: "85vh" }}
          >
            {/* Header */}
            <div className="px-6 py-6 flex flex-col items-center justify-center border-b border-gray-200 flex-shrink-0">
              <div className="mb-4">
                <Image src="/mascot.svg" alt="Mascotte" height={64} width={64} className="w-16 h-16" />
              </div>
              <DialogTitle as="h2" className="text-center font-bold text-2xl text-blue-400 mb-1" style={fredoka}>
                Cours – Maître Lucas
              </DialogTitle>
              <p className="text-center text-gray-500 text-sm" style={fredoka}>
                Choisis un cours pour commencer
              </p>
            </div>

            {/* Barre de recherche */}
            <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0 bg-white sticky top-0 z-10">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un cours…"
                  style={fredoka}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Liste scrollable */}
            <div className="px-4 py-4 overflow-y-auto flex-grow">
              {filteredCourses.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-8" style={fredoka}>
                  Aucun cours trouvé pour &ldquo;{search}&rdquo;
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredCourses.map((course, index) => (
                    <button
                      key={index}
                      style={fredoka}
                      onClick={() => {
                        if (course.isPreview && course.videoId) {
                          setSelectedVideo(course.videoId);
                          setVideoOpen(true);
                          setOpen(false);
                        } else {
                          window.open(course.href, "_blank");
                          setOpen(false);
                        }
                      }}
                      className={cn(
                        "w-full px-5 py-3 rounded-lg font-semibold transition-all duration-200 transform active:scale-95 text-sm text-left",
                        courseColors[index % courseColors.length]
                      )}
                    >
                      {course.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-4 py-4 flex-shrink-0">
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={fredoka}
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

      {/* Modal vidéo YouTube */}
      <Dialog open={videoOpen} onClose={() => {}} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all duration-500 data-closed:scale-95 data-closed:opacity-0 data-enter:duration-500 data-enter:ease-out data-leave:duration-300 data-leave:ease-in w-full max-w-2xl border border-gray-200 flex flex-col z-50"
          >
            <div className="relative w-full bg-black" style={{ paddingBottom: "56.25%" }}>
              {selectedVideo && (
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedVideo}`}
                  title="Vidéo YouTube"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
            <div className="border-t border-gray-200 px-6 py-4 flex-shrink-0">
              <button
                type="button"
                style={fredoka}
                onClick={() => {
                  setVideoOpen(false);
                  setOpen(true);
                }}
                className={cn(
                  "w-full px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform active:scale-95 text-sm",
                  buttonStyles.danger
                )}
              >
                 Retour aux cours
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};