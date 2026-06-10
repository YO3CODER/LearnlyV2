"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";

const fredoka = { fontFamily: "'Fredoka', sans-serif" } as const;

// ─── Données ────────────────────────────────────────────────────────────────

type Category = "Tout" | "Maths" | "Français" | "Sciences" | "Histoire";

const ALL_CATEGORIES: Category[] = ["Tout", "Maths", "Français", "Sciences", "Histoire"];

const categoryColors: Record<Category, string> = {
  Tout:     "bg-gray-100 text-gray-700 border-gray-300",
  Maths:    "bg-sky-100 text-sky-700 border-sky-300",
  Français: "bg-violet-100 text-violet-700 border-violet-300",
  Sciences: "bg-emerald-100 text-emerald-700 border-emerald-300",
  Histoire: "bg-amber-100 text-amber-700 border-amber-300",
};

const categoryActiveColors: Record<Category, string> = {
  Tout:     "bg-gray-600 text-white border-gray-700",
  Maths:    "bg-sky-500 text-white border-sky-600",
  Français: "bg-violet-500 text-white border-violet-600",
  Sciences: "bg-emerald-500 text-white border-emerald-600",
  Histoire: "bg-amber-500 text-white border-amber-600",
};

const courseButtonColor: Record<string, string> = {
  Maths:    "bg-sky-400 text-white border-sky-500 border-b-4 hover:bg-sky-400/90 active:border-b-0",
  Français: "bg-violet-500 text-white border-violet-600 border-b-4 hover:bg-violet-500/90 active:border-b-0",
  Sciences: "bg-emerald-500 text-white border-emerald-600 border-b-4 hover:bg-emerald-500/90 active:border-b-0",
  Histoire: "bg-amber-400 text-gray-900 border-amber-500 border-b-4 hover:bg-amber-400/90 active:border-b-0",
};

type Course = {
  title: string;
  href: string;
  videoId: string;
  isPreview: boolean;
  category: keyof typeof courseButtonColor;
};

const courses: Course[] = [
  { title: "Écriture du A en cursive (a)",  href: "https://youtu.be/UhdIYcwkEsI", videoId: "UhdIYcwkEsI", isPreview: true, category: "Français" },
  { title: "Atome",                          href: "https://youtu.be/TV-leAqi8ps", videoId: "TV-leAqi8ps", isPreview: true, category: "Sciences" },
  { title: "Résoudre une équation",          href: "https://youtu.be/ezGlju-nR6s", videoId: "ezGlju-nR6s", isPreview: true, category: "Maths"    },
  { title: "Résoudre une équation 4ème (1)", href: "https://youtu.be/uV_EmbYu9_E", videoId: "uV_EmbYu9_E", isPreview: true, category: "Maths"    },
  { title: "La photosynthèse",               href: "https://youtu.be/dQw4w9WgXcQ", videoId: "dQw4w9WgXcQ", isPreview: true, category: "Sciences" },
  { title: "Conjugaison : le passé composé", href: "https://youtu.be/dQw4w9WgXcQ", videoId: "dQw4w9WgXcQ", isPreview: true, category: "Français" },
  { title: "La respiration cellulaire",      href: "https://youtu.be/dQw4w9WgXcQ", videoId: "dQw4w9WgXcQ", isPreview: true, category: "Sciences" },
  { title: "La règle de trois",              href: "https://youtu.be/dQw4w9WgXcQ", videoId: "dQw4w9WgXcQ", isPreview: true, category: "Maths"    },
  { title: "Les figures géométriques",       href: "https://youtu.be/dQw4w9WgXcQ", videoId: "dQw4w9WgXcQ", isPreview: true, category: "Maths"    },
  { title: "La chaîne alimentaire",          href: "https://youtu.be/dQw4w9WgXcQ", videoId: "dQw4w9WgXcQ", isPreview: true, category: "Sciences" },
  { title: "Les nombres décimaux",           href: "https://youtu.be/dQw4w9WgXcQ", videoId: "dQw4w9WgXcQ", isPreview: true, category: "Maths"    },
  { title: "La Révolution française",        href: "https://youtu.be/dQw4w9WgXcQ", videoId: "dQw4w9WgXcQ", isPreview: true, category: "Histoire" },
];

const routes = [
  { label: "Learn",        href: "/learn",       iconSrc: "/learn.svg" },
  { label: "Leaderboard",  href: "/leaderboard",  iconSrc: "/leaderboard.svg" },
  { label: "Quests",       href: "/quests",       iconSrc: "/quest.svg" },
  { label: "Shop",         href: "/shop",         iconSrc: "/shop.svg" },
  { label: "study", href: "#",             iconSrc: "/study.svg", isModal: true },
];

const RECENT_KEY    = "courses_recent";
const COMPLETED_KEY = "courses_completed"; // ← manuel uniquement
const MAX_RECENT    = 3;

// ─── Composant ──────────────────────────────────────────────────────────────

export const MobileNavbar = () => {
  const pathname = usePathname();

  const [open, setOpen]                   = useState(false);
  const [videoOpen, setVideoOpen]         = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedVideoId, setSelectedVideoId] = useState("");
  const [search, setSearch]               = useState("");
  const [category, setCategory]           = useState<Category>("Tout");
  const [recentIds, setRecentIds]         = useState<string[]>([]);
  const [completedIds, setCompletedIds]   = useState<string[]>([]);

  useEffect(() => {
    try {
      const r = localStorage.getItem(RECENT_KEY);
      const c = localStorage.getItem(COMPLETED_KEY);
      if (r) setRecentIds(JSON.parse(r));
      if (c) setCompletedIds(JSON.parse(c));
    } catch {}
  }, []);

  const filteredCourses = useMemo(() =>
    courses.filter((c) => {
      const matchSearch   = c.title.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "Tout" || c.category === category;
      return matchSearch && matchCategory;
    }),
    [search, category]
  );

  const recentCourses = useMemo(() =>
    recentIds
      .map((id) => courses.find((c) => c.videoId === id))
      .filter(Boolean) as Course[],
    [recentIds]
  );

  const playVideo = (course: Course) => {
    const nextRecent = [
      course.videoId,
      ...recentIds.filter((id) => id !== course.videoId),
    ].slice(0, MAX_RECENT);
    setRecentIds(nextRecent);
    localStorage.setItem(RECENT_KEY, JSON.stringify(nextRecent));

    setSelectedVideo(course.videoId);
    setSelectedVideoId(course.videoId);
    setSelectedTitle(course.title);
    setVideoOpen(true);
    setOpen(false);
  };

  const toggleCompleted = (videoId: string) => {
    const isCompleted = completedIds.includes(videoId);
    const next = isCompleted
      ? completedIds.filter((id) => id !== videoId)
      : [...completedIds, videoId];
    setCompletedIds(next);
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(next));
  };

  const isCurrentCompleted = completedIds.includes(selectedVideoId);

  return (
    <>
      {/* ── Barre de navigation ── */}
      <nav className="lg:hidden fixed bottom-0 w-full z-50 bg-background border-t-2 border-[#353535] shadow-[0_-1px_4px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-around h-[60px] px-2">
          {routes.map((route) => {
            const isActive = pathname === route.href;
            if (route.isModal) {
              return (
                <button
                  key={route.label}
                  onClick={() => { setOpen(true); setSearch(""); setCategory("Tout"); }}
                  className="flex flex-col items-center px-3 py-1.5 rounded-xl transition-all duration-200 text-gray-400 hover:text-gray-200 hover:bg-card"
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

      {/* ── Modal cours ── */}
      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-500 data-closed:scale-95 data-closed:opacity-0 data-enter:duration-500 data-enter:ease-out data-leave:duration-300 data-leave:ease-in w-full max-w-md border border-gray-200 flex flex-col"
            style={{ maxHeight: "85vh" }}
          >
            {/* Header */}
            <div className="px-6 py-5 flex flex-col items-center border-b border-gray-200 flex-shrink-0">
              <Image src="/mascot.svg" alt="Mascotte" height={56} width={56} className="mb-3" />
              <DialogTitle as="h2" className="text-center font-bold text-2xl text-blue-400 mb-0.5" style={fredoka}>
                Cours 
              </DialogTitle>
              <p className="text-center text-gray-400 text-sm" style={fredoka}>
                Choisis un cours pour commencer
              </p>
            </div>

            {/* Recherche + filtres */}
            <div className="px-4 pt-3 pb-2 border-b border-gray-100 flex-shrink-0 bg-white space-y-2">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un cours…"
                  style={fredoka}
                  className="w-full pl-9 pr-8 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Filtres catégories */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {ALL_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    style={fredoka}
                    className={cn(
                      "flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150",
                      category === cat ? categoryActiveColors[cat] : categoryColors[cat]
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Compteur */}
              {(search || category !== "Tout") && (
                <p className="text-xs text-gray-400 px-1" style={fredoka}>
                  {filteredCourses.length} cours trouvé{filteredCourses.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>

            {/* Liste scrollable */}
            <div className="px-4 py-3 overflow-y-auto flex-grow">

              {/* Récents */}
              {recentCourses.length > 0 && !search && category === "Tout" && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1" style={fredoka}>
                    Récemment regardés
                  </p>
                  <div className="space-y-2">
                    {recentCourses.map((course, index) => {
                      const isCompleted = completedIds.includes(course.videoId);
                      return (
                        <button
                          key={"recent-" + index}
                          onClick={() => playVideo(course)}
                          style={{ ...fredoka, animationDelay: `${index * 60}ms` }}
                          className={cn(
                            "w-full px-4 py-2.5 rounded-lg font-semibold text-sm text-left flex items-center justify-between gap-2 transition-all duration-200 transform active:scale-95 opacity-0 animate-[fadeSlideIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)_forwards]",
                            courseButtonColor[course.category]
                          )}
                        >
                          <span>{course.title}</span>
                          <span className={cn(
                            "text-xs flex-shrink-0 px-2 py-0.5 rounded-full font-semibold",
                            isCompleted
                              ? "bg-white/30 text-white"
                              : "bg-white/20 text-white/70"
                          )}>
                            {isCompleted ? "Terminé" : "Récent"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-3 mb-1 border-t border-gray-100" />
                </div>
              )}

              {/* Liste principale */}
              {filteredCourses.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-8" style={fredoka}>
                  Aucun cours trouvé pour &ldquo;{search}&rdquo;
                </p>
              ) : (
                <div className="space-y-2.5">
                  {filteredCourses.map((course, index) => {
                    const isCompleted = completedIds.includes(course.videoId);
                    return (
                      <button
                        key={index}
                        onClick={() => playVideo(course)}
                        style={{ ...fredoka, animationDelay: `${index * 40}ms` }}
                        className={cn(
                          "w-full px-4 py-3 rounded-lg font-semibold text-sm text-left flex items-center justify-between gap-2 transition-all duration-200 transform active:scale-95 opacity-0 animate-[fadeSlideIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)_forwards]",
                          courseButtonColor[course.category]
                        )}
                      >
                        <span>{course.title}</span>
                        {isCompleted && (
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/30 flex items-center justify-center text-xs font-bold">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-4 py-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={fredoka}
                className="w-full px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform active:scale-95 text-sm bg-rose-500 text-white hover:bg-rose-500/90 border-rose-600 border-b-4 active:border-b-0"
              >
                Fermer
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* ── Modal vidéo ── */}
      <Dialog open={videoOpen} onClose={() => {}} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-500 data-closed:scale-95 data-closed:opacity-0 data-enter:duration-500 data-enter:ease-out data-leave:duration-300 data-leave:ease-in w-full max-w-2xl border border-gray-200 flex flex-col"
          >
            {/* Titre */}
            <div className="px-5 py-3 border-b border-gray-100 flex-shrink-0">
              <p className="text-sm font-semibold text-gray-700 truncate" style={fredoka}>
                {selectedTitle}
              </p>
            </div>

            {/* iFrame */}
            <div className="relative w-full bg-black" style={{ paddingBottom: "56.25%" }}>
              {selectedVideo && (
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedVideo}`}
                  title={selectedTitle}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>

            {/* Footer vidéo — deux boutons */}
            <div className="border-t border-gray-200 px-5 py-3 flex-shrink-0 flex gap-2">
              {/* Bouton terminer / décocher */}
              <button
                type="button"
                style={fredoka}
                onClick={() => toggleCompleted(selectedVideoId)}
                className={cn(
                  "flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform active:scale-95 text-sm border-b-4 active:border-b-0",
                  isCurrentCompleted
                    ? "bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-200/90"
                    : "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-500/90"
                )}
              >
                {isCurrentCompleted ? "Marquer non terminé" : "Marquer comme terminé"}
              </button>

              {/* Retour */}
              <button
                type="button"
                style={fredoka}
                onClick={() => { setVideoOpen(false); setOpen(true); }}
                className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform active:scale-95 text-sm bg-rose-500 text-white hover:bg-rose-500/90 border-rose-600 border-b-4 active:border-b-0"
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