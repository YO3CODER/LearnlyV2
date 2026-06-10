"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";

const buttonStyles = {
  primary: "bg-sky-400 text-white hover:bg-sky-400/90 border-sky-500 border-b-4 active:border-b-0",
  primaryOutline: "bg-background dark:bg-background-800 text-sky-500 hover:bg-background-100 dark:hover:bg-background-700",
  secondary: "bg-green-500 text-white hover:bg-green-500/90 border-green-600 border-b-4 active:border-b-0",
  secondaryOutline: "bg-background dark:bg-background-800 text-green-500 hover:bg-background-100 dark:hover:bg-background-700",
  danger: "bg-rose-500 text-white hover:bg-rose-500/90 border-rose-600 border-b-4 active:border-b-0",
  dangerOutline: "bg-background dark:bg-background-800 text-rose-500 hover:bg-background-100 dark:hover:bg-background-700",
  super: "bg-blue-500 text-white hover:bg-blue-500/90 border-blue-600 border-b-4 active:border-b-0",
};

// Palette de couleurs variées pour les boutons
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

const routes = [
  { label: "Learn", href: "/learn", iconSrc: "/learn.svg" },
  { label: "Leaderboard", href: "/leaderboard", iconSrc: "/leaderboard.svg" },
  { label: "Quests", href: "/quests", iconSrc: "/quest.svg" },
  { label: "Shop", href: "/shop", iconSrc: "/shop.svg" },
  { label: "maitre lucas", href: "#", iconSrc: "/study.svg", isModal: true },
];

const courses = [
  {
    title: "Écriture du A en cursive (a)",
    href: "https://youtu.be/UhdIYcwkEsI?si=sqZUPJ1Z4VpG5F8_",
    videoId: "UhdIYcwkEsI",
    description: "Apprendre à écrire la lettre A en cursive",
    isPreview: true,
  },
  {
    title: "Atome",
    href: "https://youtu.be/TV-leAqi8ps?si=8BvCnHwH-W1K2WJv",
    videoId: "TV-leAqi8ps",
    description: "Introduction à la structure de l'atome",
    isPreview: true,
  },
  {
    title: "Résoudre une équation",
    href: "https://youtu.be/ezGlju-nR6s?si=fcSSX7JfG-W1N9sL",
    videoId: "ezGlju-nR6s",
    description: "Méthodes pour résoudre une équation",
    isPreview: true,
  },
  {
    title: "Résoudre une équation 4ème(1)",
    href: "https://youtu.be/uV_EmbYu9_E?si=vIzRzw8YLFFVkWEK",
    videoId: "uV_EmbYu9_E",
    description: "Résoudre une équation 4ème",
    isPreview: true,
  },
  {
    title: "La photosynthèse",
    href: "https://youtu.be/dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ",
    description: "Comment les plantes fabriquent leur nourriture",
    isPreview: true,
  },
  {
    title: "Conjugaison : le passé composé",
    href: "https://youtu.be/dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ",
    description: "Maîtriser le passé composé en français",
    isPreview: true,
  },
  {
    title: "La respiration cellulaire",
    href: "https://youtu.be/dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ",
    description: "Comprendre la respiration au niveau cellulaire",
    isPreview: true,
  },
  {
    title: "La règle de trois",
    href: "https://youtu.be/dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ",
    description: "Appliquer la proportionnalité",
    isPreview: true,
  },
  {
    title: "Les figures géométriques",
    href: "https://youtu.be/dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ",
    description: "Identifier et classer les figures géométriques",
    isPreview: true,
  },
  {
    title: "La chaîne alimentaire",
    href: "https://youtu.be/dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ",
    description: "Comprendre les relations entre les êtres vivants",
    isPreview: true,
  },
  {
    title: "Les nombres décimaux",
    href: "https://youtu.be/dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ",
    description: "Lire, écrire et comparer les décimaux",
    isPreview: true,
  },
  {
    title: "La Révolution française",
    href: "https://youtu.be/dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ",
    description: "Les grandes étapes de 1789",
    isPreview: true,
  },
];

export const MobileNavbar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredCourses = useMemo(
    () =>
      courses.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 w-full z-50 bg-background border-t-2 border-[#353535] shadow-[0_-1px_4px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-around h-[60px] px-2">
          {routes.map((route) => {
            const isActive = pathname === route.href;

            if (route.isModal) {
              return (
                <button
                  key={route.label}
                  onClick={() => { setOpen(true); setSearch(""); }}
                  className={cn(
                    "flex flex-col items-center px-3 py-1.5 rounded-xl transition-all duration-200",
                    "text-gray-400 hover:text-gray-200 hover:bg-card"
                  )}
                >
                  <Image src={route.iconSrc} alt={route.label} width={28} height={28} />
                </button>
              );
            }

            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex flex-col items-center px-3 py-1.5 rounded-xl transition-all duration-200",
                  isActive ? "text-lime-400" : "text-gray-400 hover:text-gray-200 hover:bg-card"
                )}
              >
                <Image
                  src={route.iconSrc}
                  alt={route.label}
                  width={28}
                  height={28}
                  className={cn("transition-transform duration-200", isActive && "scale-110")}
                />
              </Link>
            );
          })}
        </div>
      </nav>

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
              <DialogTitle as="h2" className="text-center font-bold text-2xl text-gray-900 mb-1">
                Cours – Maître Lucas
              </DialogTitle>
              <p className="text-center text-gray-500 text-sm">
                Choisis un cours pour commencer
              </p>
            </div>

            {/* Barre de recherche — sticky */}
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
                <p className="text-center text-gray-400 text-sm py-8">
                  Aucun cours trouvé pour &ldquo;{search}&rdquo;
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredCourses.map((course, index) => (
                    <button
                      key={index}
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
      <Dialog open={videoOpen} onClose={setVideoOpen} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />
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
                onClick={() => setVideoOpen(false)}
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