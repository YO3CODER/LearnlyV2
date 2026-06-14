"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { Cours } from "@/lib/cours-utils";

const fredoka = { fontFamily: "'Fredoka', sans-serif" } as const;

// ─── Styles de catégories ────────────────────────────────────────────────────

type CategoryStyle = {
  filterInactive: string;
  filterActive: string;
  badge: string;
  button: string;
  accent: string;
  modal: string;
};

const TOUT_STYLE: CategoryStyle = {
  filterInactive: "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600",
  filterActive: "bg-gray-600 text-white border-gray-700",
  badge: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  button: "bg-gray-500 text-white border-gray-600 border-b-4 hover:bg-gray-500/90 active:border-b-0",
  accent: "border-gray-400",
  modal: "from-gray-400 to-gray-500",
};

/** Couleurs fixes pour les catégories d'origine (look inchangé) */
const KNOWN_STYLES: Record<string, CategoryStyle> = {
  Maths: {
    filterInactive: "bg-sky-100 text-sky-700 border-sky-300 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-700",
    filterActive: "bg-sky-500 text-white border-sky-600",
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    button: "bg-sky-400 text-white border-sky-500 border-b-4 hover:bg-sky-400/90 active:border-b-0",
    accent: "border-sky-400",
    modal: "from-sky-400 to-cyan-400",
  },
  "Français": {
    filterInactive: "bg-violet-100 text-violet-700 border-violet-300 dark:bg-violet-900/40 dark:text-violet-300 dark:border-violet-700",
    filterActive: "bg-violet-500 text-white border-violet-600",
    badge: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    button: "bg-violet-500 text-white border-violet-600 border-b-4 hover:bg-violet-500/90 active:border-b-0",
    accent: "border-violet-500",
    modal: "from-violet-500 to-purple-400",
  },
  Sciences: {
    filterInactive: "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700",
    filterActive: "bg-emerald-500 text-white border-emerald-600",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    button: "bg-emerald-500 text-white border-emerald-600 border-b-4 hover:bg-emerald-500/90 active:border-b-0",
    accent: "border-emerald-500",
    modal: "from-emerald-500 to-teal-400",
  },
  Histoire: {
    filterInactive: "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700",
    filterActive: "bg-amber-500 text-white border-amber-600",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    button: "bg-amber-400 text-gray-900 border-amber-500 border-b-4 hover:bg-amber-400/90 active:border-b-0",
    accent: "border-amber-400",
    modal: "from-amber-400 to-orange-400",
  },
};

/** Palette assignée automatiquement aux nouvelles catégories (toujours la même couleur pour un même nom) */
const EXTRA_PALETTE: CategoryStyle[] = [
  {
    filterInactive: "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-700",
    filterActive: "bg-rose-500 text-white border-rose-600",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    button: "bg-rose-400 text-white border-rose-500 border-b-4 hover:bg-rose-400/90 active:border-b-0",
    accent: "border-rose-400",
    modal: "from-rose-400 to-pink-400",
  },
  {
    filterInactive: "bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-700",
    filterActive: "bg-indigo-500 text-white border-indigo-600",
    badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
    button: "bg-indigo-500 text-white border-indigo-600 border-b-4 hover:bg-indigo-500/90 active:border-b-0",
    accent: "border-indigo-500",
    modal: "from-indigo-400 to-blue-400",
  },
  {
    filterInactive: "bg-teal-100 text-teal-700 border-teal-300 dark:bg-teal-900/40 dark:text-teal-300 dark:border-teal-700",
    filterActive: "bg-teal-500 text-white border-teal-600",
    badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
    button: "bg-teal-500 text-white border-teal-600 border-b-4 hover:bg-teal-500/90 active:border-b-0",
    accent: "border-teal-500",
    modal: "from-teal-400 to-cyan-400",
  },
  {
    filterInactive: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300 dark:bg-fuchsia-900/40 dark:text-fuchsia-300 dark:border-fuchsia-700",
    filterActive: "bg-fuchsia-500 text-white border-fuchsia-600",
    badge: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300",
    button: "bg-fuchsia-500 text-white border-fuchsia-600 border-b-4 hover:bg-fuchsia-500/90 active:border-b-0",
    accent: "border-fuchsia-500",
    modal: "from-fuchsia-400 to-pink-400",
  },
  {
    filterInactive: "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-700",
    filterActive: "bg-orange-500 text-white border-orange-600",
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    button: "bg-orange-400 text-white border-orange-500 border-b-4 hover:bg-orange-400/90 active:border-b-0",
    accent: "border-orange-400",
    modal: "from-orange-400 to-amber-400",
  },
  {
    filterInactive: "bg-cyan-100 text-cyan-700 border-cyan-300 dark:bg-cyan-900/40 dark:text-cyan-300 dark:border-cyan-700",
    filterActive: "bg-cyan-500 text-white border-cyan-600",
    badge: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
    button: "bg-cyan-500 text-white border-cyan-600 border-b-4 hover:bg-cyan-500/90 active:border-b-0",
    accent: "border-cyan-500",
    modal: "from-cyan-400 to-sky-400",
  },
  {
    filterInactive: "bg-lime-100 text-lime-700 border-lime-300 dark:bg-lime-900/40 dark:text-lime-300 dark:border-lime-700",
    filterActive: "bg-lime-500 text-white border-lime-600",
    badge: "bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300",
    button: "bg-lime-400 text-gray-900 border-lime-500 border-b-4 hover:bg-lime-400/90 active:border-b-0",
    accent: "border-lime-400",
    modal: "from-lime-400 to-emerald-400",
  },
  {
    filterInactive: "bg-pink-100 text-pink-700 border-pink-300 dark:bg-pink-900/40 dark:text-pink-300 dark:border-pink-700",
    filterActive: "bg-pink-500 text-white border-pink-600",
    badge: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
    button: "bg-pink-500 text-white border-pink-600 border-b-4 hover:bg-pink-500/90 active:border-b-0",
    accent: "border-pink-500",
    modal: "from-pink-400 to-rose-400",
  },
  {
    filterInactive: "bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-700",
    filterActive: "bg-purple-500 text-white border-purple-600",
    badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    button: "bg-purple-500 text-white border-purple-600 border-b-4 hover:bg-purple-500/90 active:border-b-0",
    accent: "border-purple-500",
    modal: "from-purple-400 to-violet-400",
  },
  {
    filterInactive: "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700",
    filterActive: "bg-red-500 text-white border-red-600",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    button: "bg-red-500 text-white border-red-600 border-b-4 hover:bg-red-500/90 active:border-b-0",
    accent: "border-red-500",
    modal: "from-red-400 to-rose-400",
  },
];

/** Style associé à une catégorie : couleurs fixes pour les 4 d'origine, sinon couleur stable assignée automatiquement */
function getCategoryStyle(categorie: string): CategoryStyle {
  if (categorie === "Tout") return TOUT_STYLE;
  if (KNOWN_STYLES[categorie]) return KNOWN_STYLES[categorie];
  let hash = 0;
  for (let i = 0; i < categorie.length; i++) {
    hash = (hash * 31 + categorie.charCodeAt(i)) >>> 0;
  }
  return EXTRA_PALETTE[hash % EXTRA_PALETTE.length];
}

const routes = [
  { label: "Learn",       href: "/learn",       iconSrc: "/learn.svg" },
  { label: "Leaderboard", href: "/leaderboard", iconSrc: "/leaderboard.svg" },
  { label: "Quests",      href: "/quests",      iconSrc: "/quest.svg" },
  { label: "Shop",        href: "/shop",        iconSrc: "/shop.svg" },
  { label: "study",       href: "#",            iconSrc: "/study.svg", isModal: true },
  { label: "study",       href: "/cours",       iconSrc: "/study1.svg" },
];

const RECENT_KEY    = "courses_recent";
const COMPLETED_KEY = "courses_completed";
const MAX_RECENT    = 3;

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

type PdfButtonProps = {
  href?: string | null;
  label: string;
  icon: React.ReactNode;
  activeClass: string;
};

const PdfButton = ({ href, label, icon, activeClass }: PdfButtonProps) => {
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={fredoka}
        className={cn("flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-sm border-b-4 hover:opacity-90 active:border-b-0 transition-all duration-200 active:scale-95 transform", activeClass)}>
        {icon}{label}
      </a>
    );
  }
  return (
    <span style={fredoka} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-sm bg-gray-100 text-gray-400 border-gray-200 border-b-4 cursor-not-allowed select-none">
      {icon}{label}
    </span>
  );
};

export const MobileNavbar = () => {
  const pathname = usePathname();

  const [courses, setCourses]                       = useState<Cours[]>([]);
  const [coursesLoading, setCoursesLoading]         = useState(false);
  const [open, setOpen]                             = useState(false);
  const [videoOpen, setVideoOpen]                   = useState(false);
  const [selectedVideo, setSelectedVideo]           = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle]           = useState("");
  const [selectedVideoId, setSelectedVideoId]       = useState("");
  const [selectedCategorie, setSelectedCategorie]   = useState("");
  const [selectedPdfCours, setSelectedPdfCours]     = useState<string | null | undefined>();
  const [selectedPdfFiche, setSelectedPdfFiche]     = useState<string | null | undefined>();
  const [selectedPdfCorrige, setSelectedPdfCorrige] = useState<string | null | undefined>();
  const [search, setSearch]                         = useState("");
  const [category, setCategory]                     = useState<string>("Tout");
  const [recentIds, setRecentIds]                   = useState<string[]>([]);
  const [completedIds, setCompletedIds]             = useState<string[]>([]);
  const [categories, setCategories]                 = useState<string[]>([]);

  const ALL_CATEGORIES = useMemo(() => ["Tout", ...categories], [categories]);

  // Récupération des catégories depuis l'API
  useEffect(() => {
    fetch("/api/admin2/categories")
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  const openModal = () => {
    setSearch("");
    setCategory("Tout");
    setOpen(true);
    if (courses.length === 0) {
      setCoursesLoading(true);
      fetch("/api/cours")
        .then((res) => res.json())
        .then(setCourses)
        .catch(() => setCourses([]))
        .finally(() => setCoursesLoading(false));
    }
  };

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
      const matchSearch   = c.titre.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "Tout" || c.categorie === category;
      return matchSearch && matchCategory;
    }),
    [search, category, courses]
  );

  const recentCourses = useMemo(() =>
    recentIds.map((id) => courses.find((c) => c.videoId === id)).filter(Boolean) as Cours[],
    [recentIds, courses]
  );

  const playVideo = (course: Cours) => {
    const nextRecent = [course.videoId, ...recentIds.filter((id) => id !== course.videoId)].slice(0, MAX_RECENT);
    setRecentIds(nextRecent);
    localStorage.setItem(RECENT_KEY, JSON.stringify(nextRecent));
    setSelectedVideo(course.videoId);
    setSelectedVideoId(course.videoId);
    setSelectedTitle(course.titre);
    setSelectedCategorie(course.categorie);
    setSelectedPdfCours(course.pdfCours);
    setSelectedPdfFiche(course.pdfFiche);
    setSelectedPdfCorrige(course.pdfCorrige);
    setVideoOpen(true);
    setOpen(false);
  };

  const toggleCompleted = (videoId: string) => {
    const next = completedIds.includes(videoId)
      ? completedIds.filter((id) => id !== videoId)
      : [...completedIds, videoId];
    setCompletedIds(next);
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(next));
  };

  const isCurrentCompleted = completedIds.includes(selectedVideoId);

  // Helper pour obtenir le style du bouton de cours
  const getCourseButtonClass = (categorie: string) => {
    const style = getCategoryStyle(categorie);
    return style.button;
  };

  // Helper pour obtenir le style du badge de catégorie
  const getCategoryBadgeClass = (categorie: string) => {
    const style = getCategoryStyle(categorie);
    return style.badge;
  };

  return (
    <>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* ── Barre de navigation ── */}
      <nav className="lg:hidden fixed bottom-0 w-full z-50 bg-background border-t-2 border-[#353535] shadow-[0_-1px_4px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-around h-[60px] px-2">
          {routes.map((route) => {
            const isActive = pathname === route.href;
            if (route.isModal) {
              return (
                <button key={route.label + "-modal"} onClick={openModal}
                  className="flex flex-col items-center px-3 py-1.5 rounded-xl transition-all duration-200 text-gray-400 hover:text-gray-200 hover:bg-card">
                  <Image src={route.iconSrc} alt={route.label} width={28} height={28} />
                </button>
              );
            }
            return (
              <Link key={route.href} href={route.href}
                className={cn("flex flex-col items-center px-3 py-1.5 rounded-xl transition-all duration-200",
                  isActive ? "text-lime-400" : "text-gray-400 hover:text-gray-200 hover:bg-card")}>
                <Image src={route.iconSrc} alt={route.label} width={28} height={28}
                  className={cn("transition-transform duration-200", isActive && "scale-110")} />
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── Modal cours ── */}
      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <DialogBackdrop transition
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <DialogPanel transition
            className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-500 data-closed:scale-95 data-closed:opacity-0 data-enter:duration-500 data-enter:ease-out data-leave:duration-300 data-leave:ease-in w-full max-w-md border border-gray-200 flex flex-col"
            style={{ maxHeight: "90vh" }}>

            {/* Header */}
            <div className="px-6 py-4 flex flex-col items-center border-b border-gray-200 flex-shrink-0">
              <Image src="/mascot.svg" alt="Mascotte" height={48} width={48} className="mb-2" />
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
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un cours…" style={fredoka}
                  className="w-full pl-9 pr-8 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all" />
                {search && (
                  <button onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">✕</button>
                )}
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {ALL_CATEGORIES.map((cat) => {
                  const catStyle = getCategoryStyle(cat);
                  return (
                    <button key={cat} onClick={() => setCategory(cat)} style={fredoka}
                      className={cn("flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150",
                        category === cat ? catStyle.filterActive : catStyle.filterInactive)}>
                      {cat}
                    </button>
                  );
                })}
              </div>

              {(search || category !== "Tout") && (
                <p className="text-xs text-gray-400 px-1" style={fredoka}>
                  {filteredCourses.length} cours trouvé{filteredCourses.length !== 1 ? "s" : ""}
                  {category !== "Tout" && ` en ${category}`}
                  {search && ` pour « ${search} »`}
                </p>
              )}
            </div>

            {/* Liste scrollable */}
            <div className="px-4 py-3 overflow-y-auto flex-grow space-y-4">

              {coursesLoading && (
                <div className="flex items-center justify-center py-16">
                  <p className="text-gray-400 text-sm" style={fredoka}>Chargement des cours…</p>
                </div>
              )}

              {!coursesLoading && (
                <>
                  {/* Récents */}
                  {recentCourses.length > 0 && !search && category === "Tout" && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1" style={fredoka}>
                        Récemment regardés
                      </p>
                      <div className="space-y-2">
                        {recentCourses.map((course, index) => {
                          const isCompleted = completedIds.includes(course.videoId);
                          return (
                            <button key={"recent-" + course.id} onClick={() => playVideo(course)}
                              style={{ ...fredoka, animationDelay: `${index * 60}ms` }}
                              className={cn(
                                "w-full px-4 py-2.5 rounded-lg font-semibold text-sm text-left flex items-center justify-between gap-2 transition-all duration-200 transform active:scale-95 opacity-0 animate-[fadeSlideIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)_forwards]",
                                getCourseButtonClass(course.categorie)
                              )}>
                              <div className="flex items-center gap-2 min-w-0">
                                <span className={cn("flex-shrink-0 text-xs px-1.5 py-0.5 rounded-full font-semibold bg-white/20", getCategoryBadgeClass(course.categorie))}>
                                  {course.categorie}
                                </span>
                                <span className="truncate">{course.titre}</span>
                              </div>
                              <span className={cn("text-xs flex-shrink-0 px-2 py-0.5 rounded-full font-semibold",
                                isCompleted ? "bg-white/30 text-white" : "bg-white/20 text-white/70")}>
                                {isCompleted ? "Terminé ✓" : "Récent"}
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
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="text-4xl mb-3">🔍</div>
                      <p className="text-gray-500 font-semibold" style={fredoka}>Aucun cours trouvé</p>
                      <p className="text-gray-400 text-sm mt-1" style={fredoka}>Essaie un autre mot-clé ou catégorie</p>
                      <button onClick={() => { setSearch(""); setCategory("Tout"); }} style={fredoka}
                        className="mt-3 px-4 py-2 rounded-lg bg-sky-500 text-white text-sm font-semibold border-b-4 border-sky-600 hover:bg-sky-500/90 active:border-b-0 transition-all">
                        Tout afficher
                      </button>
                    </div>
                  ) : (
                    <div>
                      {!search && category === "Tout" && (
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1" style={fredoka}>
                          Tous les cours
                        </p>
                      )}
                      <div className="space-y-2.5">
                        {filteredCourses.map((course, index) => {
                          const isCompleted = completedIds.includes(course.videoId);
                          return (
                            <button key={course.id} onClick={() => playVideo(course)}
                              style={{ ...fredoka, animationDelay: `${index * 40}ms` }}
                              className={cn(
                                "w-full px-4 py-3 rounded-lg font-semibold text-sm text-left flex items-center justify-between gap-2 transition-all duration-200 transform active:scale-95 opacity-0 animate-[fadeSlideIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)_forwards]",
                                getCourseButtonClass(course.categorie)
                              )}>
                              <div className="flex items-center gap-2 min-w-0">
                                <span className={cn("flex-shrink-0 text-xs px-1.5 py-0.5 rounded-full font-semibold bg-white/20", getCategoryBadgeClass(course.categorie))}>
                                  {course.categorie}
                                </span>
                                <span className="truncate">{course.titre}</span>
                              </div>
                              {isCompleted && (
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/30 flex items-center justify-center text-xs font-bold">✓</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-4 py-3 flex-shrink-0">
              <button type="button" onClick={() => setOpen(false)} style={fredoka}
                className="w-full px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform active:scale-95 text-sm bg-rose-500 text-white hover:bg-rose-500/90 border-rose-600 border-b-4 active:border-b-0">
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
          <DialogPanel transition
            className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-500 data-closed:scale-95 data-closed:opacity-0 data-enter:duration-500 data-enter:ease-out data-leave:duration-300 data-leave:ease-in w-full max-w-2xl border border-gray-200 flex flex-col">

            <div className={cn("h-1 w-full bg-gradient-to-r flex-shrink-0", getCategoryStyle(selectedCategorie).modal)} />

            <div className="px-5 py-3 border-b border-gray-100 flex-shrink-0">
              <span style={fredoka} className={cn("inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1", getCategoryBadgeClass(selectedCategorie))}>
                {selectedCategorie}
              </span>
              <p className="text-sm font-semibold text-gray-700 truncate leading-snug" style={fredoka}>{selectedTitle}</p>
            </div>

            <div className="relative w-full bg-black" style={{ paddingBottom: "56.25%" }}>
              {selectedVideo && (
                <iframe className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&rel=0`}
                  title={selectedTitle} frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen />
              )}
            </div>

            <div className="px-5 py-2.5 flex gap-2 border-b border-gray-100 flex-shrink-0">
              <PdfButton href={selectedPdfCours} label="Cours PDF" icon={<IconBook />} activeClass="bg-amber-400 text-gray-900 border-amber-500" />
              <PdfButton href={selectedPdfFiche} label="Fiche PDF" icon={<IconFile />} activeClass="bg-sky-500 text-white border-sky-600" />
              <PdfButton href={selectedPdfCorrige} label="Corrigé PDF" icon={<IconCheck />} activeClass="bg-violet-500 text-white border-violet-600" />
            </div>

            <div className="border-t border-gray-200 px-5 py-3 flex-shrink-0 flex gap-2">
              <button type="button" style={fredoka} onClick={() => toggleCompleted(selectedVideoId)}
                className={cn("flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform active:scale-95 text-sm border-b-4 active:border-b-0",
                  isCurrentCompleted
                    ? "bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-200/90"
                    : "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-500/90")}>
                {isCurrentCompleted ? "Marquer non terminé" : "Marquer comme terminé ✓"}
              </button>
              <button type="button" style={fredoka} onClick={() => { setVideoOpen(false); setOpen(true); }}
                className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform active:scale-95 text-sm bg-rose-500 text-white hover:bg-rose-500/90 border-rose-600 border-b-4 active:border-b-0">
                Retour aux cours
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};