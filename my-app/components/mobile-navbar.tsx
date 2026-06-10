"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { Cours } from "@/lib/cours-utils";

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

const categoryBadgeColors: Record<string, string> = {
  Maths:    "bg-sky-100 text-sky-700",
  Français: "bg-violet-100 text-violet-700",
  Sciences: "bg-emerald-100 text-emerald-700",
  Histoire: "bg-amber-100 text-amber-700",
};

const courseButtonColor: Record<string, string> = {
  Maths:    "bg-sky-400 text-white border-sky-500 border-b-4 hover:bg-sky-400/90 active:border-b-0",
  Français: "bg-violet-500 text-white border-violet-600 border-b-4 hover:bg-violet-500/90 active:border-b-0",
  Sciences: "bg-emerald-500 text-white border-emerald-600 border-b-4 hover:bg-emerald-500/90 active:border-b-0",
  Histoire: "bg-amber-400 text-gray-900 border-amber-500 border-b-4 hover:bg-amber-400/90 active:border-b-0",
};

const cardAccentColor: Record<string, string> = {
  Maths:    "border-sky-400",
  Français: "border-violet-500",
  Sciences: "border-emerald-500",
  Histoire: "border-amber-400",
};

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

const IconPlay = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

// ─── Bouton PDF réutilisable ─────────────────────────────────────────────────

type PdfButtonProps = {
  href?: string | null;
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

// ─── Carte de cours (identique à CoursPage) ──────────────────────────────────

type CourseCardProps = {
  course: Cours;
  isCompleted: boolean;
  isRecent: boolean;
  onPlay: (course: Cours) => void;
  index: number;
};

const CourseCard = ({ course, isCompleted, isRecent, onPlay, index }: CourseCardProps) => (
  <div
    style={{ animationDelay: `${index * 40}ms` }}
    className={cn(
      "bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden opacity-0 animate-[fadeSlideIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)_forwards] border-l-4",
      cardAccentColor[course.categorie]
    )}
  >
    {/* Miniature YouTube */}
    <div className="relative w-full bg-gray-100" style={{ paddingBottom: "56.25%" }}>
      <img
        src={`https://img.youtube.com/vi/${course.videoId}/mqdefault.jpg`}
        alt={course.titre}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {isCompleted && (
        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}
      {isRecent && !isCompleted && (
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-orange-400 text-white text-xs font-semibold shadow" style={fredoka}>
          Récent
        </div>
      )}
    </div>

    {/* Contenu */}
    <div className="p-3 flex flex-col flex-grow gap-2">
      <span
        style={fredoka}
        className={cn("self-start text-xs font-semibold px-2 py-0.5 rounded-full", categoryBadgeColors[course.categorie])}
      >
        {course.categorie}
      </span>
      <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 flex-grow" style={fredoka}>
        {course.titre}
      </p>
      <button
        onClick={() => onPlay(course)}
        style={fredoka}
        className={cn(
          "w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 transform active:scale-95",
          courseButtonColor[course.categorie]
        )}
      >
        <IconPlay />
        {isCompleted ? "Revoir" : "Commencer"}
      </button>
    </div>
  </div>
);

// ─── Composant principal ─────────────────────────────────────────────────────

export const MobileNavbar = () => {
  const pathname = usePathname();

  const [courses, setCourses]                       = useState<Cours[]>([]);
  const [coursesLoading, setCoursesLoading]         = useState(false);
  const [open, setOpen]                             = useState(false);
  const [videoOpen, setVideoOpen]                   = useState(false);
  const [selectedVideo, setSelectedVideo]           = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle]           = useState("");
  const [selectedVideoId, setSelectedVideoId]       = useState("");
  const [selectedPdfCours, setSelectedPdfCours]     = useState<string | null | undefined>();
  const [selectedPdfFiche, setSelectedPdfFiche]     = useState<string | null | undefined>();
  const [selectedPdfCorrige, setSelectedPdfCorrige] = useState<string | null | undefined>();
  const [search, setSearch]                         = useState("");
  const [category, setCategory]                     = useState<Category>("Tout");
  const [recentIds, setRecentIds]                   = useState<string[]>([]);
  const [completedIds, setCompletedIds]             = useState<string[]>([]);

  // Chargement des cours au premier clic sur le bouton modal
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
    recentIds
      .map((id) => courses.find((c) => c.videoId === id))
      .filter(Boolean) as Cours[],
    [recentIds, courses]
  );

  const playVideo = (course: Cours) => {
    const nextRecent = [
      course.videoId,
      ...recentIds.filter((id) => id !== course.videoId),
    ].slice(0, MAX_RECENT);
    setRecentIds(nextRecent);
    localStorage.setItem(RECENT_KEY, JSON.stringify(nextRecent));

    setSelectedVideo(course.videoId);
    setSelectedVideoId(course.videoId);
    setSelectedTitle(course.titre);
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
                  key={route.label + "-modal"}
                  onClick={openModal}
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
            style={{ maxHeight: "90vh" }}
          >
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

              {(search || category !== "Tout") && (
                <p className="text-xs text-gray-400 px-1" style={fredoka}>
                  {filteredCourses.length} cours trouvé{filteredCourses.length !== 1 ? "s" : ""}
                  {category !== "Tout" && ` en ${category}`}
                  {search && ` pour « ${search} »`}
                </p>
              )}
            </div>

            {/* Contenu scrollable */}
            <div className="px-4 py-3 overflow-y-auto flex-grow space-y-4">

              {/* Chargement */}
              {coursesLoading && (
                <div className="flex items-center justify-center py-16">
                  <p className="text-gray-400 text-sm" style={fredoka}>Chargement des cours…</p>
                </div>
              )}

              {!coursesLoading && (
                <>
                  {/* Récents */}
                  {recentCourses.length > 0 && !search && category === "Tout" && (
                    <section>
                      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2" style={fredoka}>
                        Récemment regardés
                      </h2>
                      <div className="grid grid-cols-2 gap-3">
                        {recentCourses.map((course, index) => (
                          <CourseCard
                            key={"recent-" + course.id}
                            course={course}
                            isCompleted={completedIds.includes(course.videoId)}
                            isRecent={true}
                            onPlay={playVideo}
                            index={index}
                          />
                        ))}
                      </div>
                      <div className="mt-4 border-t border-gray-100" />
                    </section>
                  )}

                  {/* Grille principale */}
                  {filteredCourses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="text-4xl mb-3">🔍</div>
                      <p className="text-gray-500 font-semibold" style={fredoka}>Aucun cours trouvé</p>
                      <p className="text-gray-400 text-sm mt-1" style={fredoka}>Essaie un autre mot-clé ou catégorie</p>
                      <button
                        onClick={() => { setSearch(""); setCategory("Tout"); }}
                        style={fredoka}
                        className="mt-3 px-4 py-2 rounded-lg bg-sky-500 text-white text-sm font-semibold border-b-4 border-sky-600 hover:bg-sky-500/90 active:border-b-0 transition-all"
                      >
                        Tout afficher
                      </button>
                    </div>
                  ) : (
                    <section>
                      {!search && category === "Tout" && (
                        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2" style={fredoka}>
                          Tous les cours
                        </h2>
                      )}
                      <div className="grid grid-cols-2 gap-3">
                        {filteredCourses.map((course, index) => (
                          <CourseCard
                            key={course.id}
                            course={course}
                            isCompleted={completedIds.includes(course.videoId)}
                            isRecent={recentIds.includes(course.videoId)}
                            onPlay={playVideo}
                            index={index}
                          />
                        ))}
                      </div>
                    </section>
                  )}
                </>
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
            <div className="px-5 py-3 border-b border-gray-100 flex-shrink-0">
              <p className="text-sm font-semibold text-gray-700 truncate" style={fredoka}>
                {selectedTitle}
              </p>
            </div>

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

            <div className="px-5 py-2.5 flex gap-2 border-b border-gray-100 flex-shrink-0">
              <PdfButton href={selectedPdfCours} label="Cours PDF" icon={<IconBook />} activeClass="bg-amber-400 text-gray-900 border-amber-500" />
              <PdfButton href={selectedPdfFiche} label="Fiche PDF" icon={<IconFile />} activeClass="bg-sky-500 text-white border-sky-600" />
              <PdfButton href={selectedPdfCorrige} label="Corrigé PDF" icon={<IconCheck />} activeClass="bg-violet-500 text-white border-violet-600" />
            </div>

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
                {isCurrentCompleted ? "Marquer non terminé" : "Marquer comme terminé ✓"}
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