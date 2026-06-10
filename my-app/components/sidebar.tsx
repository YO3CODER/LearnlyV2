"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ClerkLoading,
  ClerkLoaded,
  UserButton,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarItem } from "./sidebar-item";

type Props = {
  className?: string;
};

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
  pdfCours?: string;    // ex: "/fiches/atome-cours.pdf"
  pdfFiche?: string;    // ex: "/fiches/atome.pdf"
  pdfCorrige?: string;  // ex: "/fiches/atome-corrige.pdf"
};

const courses: Course[] = [
  { title: "Écriture du A en cursive (a)",  href: "https://youtu.be/UhdIYcwkEsI", videoId: "UhdIYcwkEsI", isPreview: true, category: "Français",
    // pdfCours: "/fiches/ecriture-a-cours.pdf",
    // pdfFiche: "/fiches/ecriture-a.pdf",
    // pdfCorrige: "/fiches/ecriture-a-corrige.pdf",
  },
  { title: "Atome",                          href: "https://youtu.be/TV-leAqi8ps", videoId: "TV-leAqi8ps", isPreview: true, category: "Sciences",
    // pdfCours: "/fiches/atome-cours.pdf",
    // pdfFiche: "/fiches/atome.pdf",
    // pdfCorrige: "/fiches/atome-corrige.pdf",
  },
  { title: "Résoudre une équation",          href: "https://youtu.be/ezGlju-nR6s", videoId: "ezGlju-nR6s", isPreview: true, category: "Maths",
    // pdfCours: "/fiches/equation-cours.pdf",
    // pdfFiche: "/fiches/equation.pdf",
    // pdfCorrige: "/fiches/equation-corrige.pdf",
  },
  { title: "Résoudre une équation 4ème (1)", href: "https://youtu.be/uV_EmbYu9_E", videoId: "uV_EmbYu9_E", isPreview: true, category: "Maths",
    // pdfCours: "/fiches/equation-4eme-cours.pdf",
    // pdfFiche: "/fiches/equation-4eme.pdf",
    // pdfCorrige: "/fiches/equation-4eme-corrige.pdf",
  },
  { title: "La photosynthèse",               href: "https://youtu.be/dQw4w9WgXcQ", videoId: "dQw4w9WgXcQ", isPreview: true, category: "Sciences",
    // pdfCours: "/fiches/photosynthese-cours.pdf",
    // pdfFiche: "/fiches/photosynthese.pdf",
    // pdfCorrige: "/fiches/photosynthese-corrige.pdf",
  },
  { title: "Conjugaison : le passé composé", href: "https://youtu.be/dQw4w9WgXcQ", videoId: "dQw4w9WgXcQ", isPreview: true, category: "Français",
    // pdfCours: "/fiches/passe-compose-cours.pdf",
    // pdfFiche: "/fiches/passe-compose.pdf",
    // pdfCorrige: "/fiches/passe-compose-corrige.pdf",
  },
  { title: "La respiration cellulaire",      href: "https://youtu.be/dQw4w9WgXcQ", videoId: "dQw4w9WgXcQ", isPreview: true, category: "Sciences",
    // pdfCours: "/fiches/respiration-cellulaire-cours.pdf",
    // pdfFiche: "/fiches/respiration-cellulaire.pdf",
    // pdfCorrige: "/fiches/respiration-cellulaire-corrige.pdf",
  },
  { title: "La règle de trois",              href: "https://youtu.be/dQw4w9WgXcQ", videoId: "dQw4w9WgXcQ", isPreview: true, category: "Maths",
    // pdfCours: "/fiches/regle-de-trois-cours.pdf",
    // pdfFiche: "/fiches/regle-de-trois.pdf",
    // pdfCorrige: "/fiches/regle-de-trois-corrige.pdf",
  },
  { title: "Les figures géométriques",       href: "https://youtu.be/dQw4w9WgXcQ", videoId: "dQw4w9WgXcQ", isPreview: true, category: "Maths",
    // pdfCours: "/fiches/figures-geometriques-cours.pdf",
    // pdfFiche: "/fiches/figures-geometriques.pdf",
    // pdfCorrige: "/fiches/figures-geometriques-corrige.pdf",
  },
  { title: "La chaîne alimentaire",          href: "https://youtu.be/dQw4w9WgXcQ", videoId: "dQw4w9WgXcQ", isPreview: true, category: "Sciences",
    // pdfCours: "/fiches/chaine-alimentaire-cours.pdf",
    // pdfFiche: "/fiches/chaine-alimentaire.pdf",
    // pdfCorrige: "/fiches/chaine-alimentaire-corrige.pdf",
  },
  { title: "Les nombres décimaux",           href: "https://youtu.be/dQw4w9WgXcQ", videoId: "dQw4w9WgXcQ", isPreview: true, category: "Maths",
    // pdfCours: "/fiches/nombres-decimaux-cours.pdf",
    // pdfFiche: "/fiches/nombres-decimaux.pdf",
    // pdfCorrige: "/fiches/nombres-decimaux-corrige.pdf",
  },
  { title: "La Révolution française",        href: "https://youtu.be/dQw4w9WgXcQ", videoId: "dQw4w9WgXcQ", isPreview: true, category: "Histoire",
    // pdfCours: "/fiches/revolution-francaise-cours.pdf",
    // pdfFiche: "/fiches/revolution-francaise.pdf",
    // pdfCorrige: "/fiches/revolution-francaise-corrige.pdf",
  },
];

const RECENT_KEY    = "courses_recent";
const COMPLETED_KEY = "courses_completed";
const MAX_RECENT    = 3;

// ─── Icônes SVG ─────────────────────────────────────────────────────────────

const IconBook = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

const IconFile = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);

const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// ─── Bouton PDF réutilisable ─────────────────────────────────────────────────

type PdfButtonProps = {
  href?: string;
  label: string;
  icon: React.ReactNode;
  activeClass: string;
};

const PdfButton = ({ href, label, icon, activeClass }: PdfButtonProps) => {
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={fredoka}
        className={cn(
          "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-sm border-b-4 hover:opacity-90 active:border-b-0 transition-all duration-200 active:scale-95 transform",
          activeClass
        )}
      >
        {icon}
        {label}
      </a>
    );
  }
  return (
    <span
      style={fredoka}
      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-sm bg-gray-100 text-gray-400 border-gray-200 border-b-4 cursor-not-allowed select-none"
    >
      {icon}
      {label}
    </span>
  );
};

// ─── Composant principal ─────────────────────────────────────────────────────

export const Sidebar = ({ className }: Props) => {
  const [open, setOpen]                             = useState(false);
  const [videoOpen, setVideoOpen]                   = useState(false);
  const [selectedVideo, setSelectedVideo]           = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle]           = useState("");
  const [selectedVideoId, setSelectedVideoId]       = useState("");
  const [selectedPdfCours, setSelectedPdfCours]     = useState<string | undefined>();
  const [selectedPdfFiche, setSelectedPdfFiche]     = useState<string | undefined>();
  const [selectedPdfCorrige, setSelectedPdfCorrige] = useState<string | undefined>();
  const [search, setSearch]                         = useState("");
  const [category, setCategory]                     = useState<Category>("Tout");
  const [recentIds, setRecentIds]                   = useState<string[]>([]);
  const [completedIds, setCompletedIds]             = useState<string[]>([]);

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
    setSelectedPdfCours(course.pdfCours);
    setSelectedPdfFiche(course.pdfFiche);
    setSelectedPdfCorrige(course.pdfCorrige);
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

        <div className="w-10 h-px bg-border mb-4" />

        {/* NAVIGATION */}
        <div className="flex flex-col gap-y-1 flex-1 w-full px-2">
          <SidebarItem href="/learn"       iconSrc="/learn.svg" />
          <SidebarItem href="/leaderboard" iconSrc="/leaderboard.svg" />
          <SidebarItem href="/quests"      iconSrc="/quest.svg" />
          <SidebarItem href="/shop"        iconSrc="/shop.svg" />
          <button
            onClick={() => { setOpen(true); setSearch(""); setCategory("Tout"); }}
            className="flex items-center justify-center h-12 w-12 rounded-xl transition-all duration-200 text-gray-400 hover:text-gray-200 hover:bg-card"
            title="Study"
          >
            <Image src="/study.svg" height={24} width={24} alt="Study" />
          </button>
        </div>

        <div className="mb-3">
          <ThemeToggle />
        </div>

        <div className="w-10 h-px bg-border mb-3" />

        <div className="mb-4 p-2 rounded-2xl bg-card border border-border flex items-center justify-center">
          <ClerkLoading>
            <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
          </ClerkLoading>
          <ClerkLoaded>
            <UserButton />
          </ClerkLoaded>
        </div>
      </div>

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

            {/* ── Boutons PDF ── */}
            <div className="px-5 py-2.5 flex gap-2 border-b border-gray-100 flex-shrink-0">
              <PdfButton
                href={selectedPdfCours}
                label="Cours PDF"
                icon={<IconBook />}
                activeClass="bg-amber-400 text-gray-900 border-amber-500"
              />
              <PdfButton
                href={selectedPdfFiche}
                label="Fiche PDF"
                icon={<IconFile />}
                activeClass="bg-sky-500 text-white border-sky-600"
              />
              <PdfButton
                href={selectedPdfCorrige}
                label="Corrigé PDF"
                icon={<IconCheck />}
                activeClass="bg-violet-500 text-white border-violet-600"
              />
            </div>

            {/* Footer vidéo — deux boutons */}
            <div className="border-t border-gray-200 px-5 py-3 flex-shrink-0 flex gap-2">
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