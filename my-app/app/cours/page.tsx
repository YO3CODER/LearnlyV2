"use client";

import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { cn } from "@/lib/utils";

const fredoka = { fontFamily: "'Fredoka', sans-serif" } as const;

// ─── Types & Données ────────────────────────────────────────────────────────

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

// Couleurs de fond pour les badges de catégorie sur les cartes
const categoryBadgeColors: Record<string, string> = {
  Maths:    "bg-sky-100 text-sky-700",
  Français: "bg-violet-100 text-violet-700",
  Sciences: "bg-emerald-100 text-emerald-700",
  Histoire: "bg-amber-100 text-amber-700",
};

// Couleurs du bouton "Commencer" par catégorie
const courseButtonColor: Record<string, string> = {
  Maths:    "bg-sky-400 text-white border-sky-500 border-b-4 hover:bg-sky-400/90 active:border-b-0",
  Français: "bg-violet-500 text-white border-violet-600 border-b-4 hover:bg-violet-500/90 active:border-b-0",
  Sciences: "bg-emerald-500 text-white border-emerald-600 border-b-4 hover:bg-emerald-500/90 active:border-b-0",
  Histoire: "bg-amber-400 text-gray-900 border-amber-500 border-b-4 hover:bg-amber-400/90 active:border-b-0",
};

// Couleur de la bordure gauche des cartes
const cardAccentColor: Record<string, string> = {
  Maths:    "border-sky-400",
  Français: "border-violet-500",
  Sciences: "border-emerald-500",
  Histoire: "border-amber-400",
};

type Course = {
  title: string;
  href: string;
  videoId: string;
  isPreview: boolean;
  category: keyof typeof courseButtonColor;
  pdfCours?: string;
  pdfFiche?: string;
  pdfCorrige?: string;
};

const courses: Course[] = [
  {
    title: "Écriture du A en cursive (a)",
    href: "https://youtu.be/UhdIYcwkEsI",
    videoId: "UhdIYcwkEsI",
    isPreview: true,
    category: "Français",
  },
  {
    title: "Atome",
    href: "https://youtu.be/TV-leAqi8ps",
    videoId: "TV-leAqi8ps",
    isPreview: true,
    category: "Sciences",
  },
  {
    title: "Résoudre une équation",
    href: "https://youtu.be/ezGlju-nR6s",
    videoId: "ezGlju-nR6s",
    isPreview: true,
    category: "Maths",
  },
  {
    title: "Résoudre une équation 4ème (1)",
    href: "https://youtu.be/uV_EmbYu9_E",
    videoId: "uV_EmbYu9_E",
    isPreview: true,
    category: "Maths",
  },
  {
    title: "La photosynthèse",
    href: "https://youtu.be/dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ",
    isPreview: true,
    category: "Sciences",
  },
  {
    title: "Conjugaison : le passé composé",
    href: "https://youtu.be/dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ2",
    isPreview: true,
    category: "Français",
  },
  {
    title: "La respiration cellulaire",
    href: "https://youtu.be/dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ3",
    isPreview: true,
    category: "Sciences",
  },
  {
    title: "La règle de trois",
    href: "https://youtu.be/dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ4",
    isPreview: true,
    category: "Maths",
  },
  {
    title: "Les figures géométriques",
    href: "https://youtu.be/dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ5",
    isPreview: true,
    category: "Maths",
  },
  {
    title: "La chaîne alimentaire",
    href: "https://youtu.be/dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ6",
    isPreview: true,
    category: "Sciences",
  },
  {
    title: "Les nombres décimaux",
    href: "https://youtu.be/dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ7",
    isPreview: true,
    category: "Maths",
  },
  {
    title: "La Révolution française",
    href: "https://youtu.be/dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ8",
    isPreview: true,
    category: "Histoire",
  },
  {
    title: "La conjugaison des verbes en -er au présent CE1 - CE2 - Cycle 2 - Français",
    href: "https://youtu.be/luyObngrtJg",
    videoId: "luyObngrtJg",
    isPreview: true,
    category: "Français",
  },
  {
    title: "Apprendre TOUTE la CONJUGAISON du CE1 !",
    href: "https://youtu.be/GFJmHJEqt0w",
    videoId: "GFJmHJEqt0w",
    isPreview: true,
    category: "Français",
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

const IconPlay = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

const IconSearch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

// ─── Bouton PDF réutilisable ────────────────────────────────────────────────

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

// ─── Carte de cours ──────────────────────────────────────────────────────────

type CourseCardProps = {
  course: Course;
  isCompleted: boolean;
  isRecent: boolean;
  onPlay: (course: Course) => void;
  index: number;
};

const CourseCard = ({ course, isCompleted, isRecent, onPlay, index }: CourseCardProps) => (
  <div
    style={{ animationDelay: `${index * 40}ms` }}
    className={cn(
      "bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden opacity-0 animate-[fadeSlideIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)_forwards] border-l-4",
      cardAccentColor[course.category]
    )}
  >
    {/* Miniature YouTube */}
    <div className="relative w-full bg-gray-100" style={{ paddingBottom: "56.25%" }}>
      <img
        src={`https://img.youtube.com/vi/${course.videoId}/mqdefault.jpg`}
        alt={course.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Badge complété */}
      {isCompleted && (
        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      )}
      {/* Badge récent */}
      {isRecent && !isCompleted && (
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-orange-400 text-white text-xs font-semibold shadow" style={fredoka}>
          Récent
        </div>
      )}
    </div>

    {/* Contenu */}
    <div className="p-3 flex flex-col flex-grow gap-2">
      {/* Catégorie */}
      <span
        style={fredoka}
        className={cn(
          "self-start text-xs font-semibold px-2 py-0.5 rounded-full",
          categoryBadgeColors[course.category]
        )}
      >
        {course.category}
      </span>

      {/* Titre */}
      <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 flex-grow" style={fredoka}>
        {course.title}
      </p>

      {/* Bouton commencer */}
      <button
        onClick={() => onPlay(course)}
        style={fredoka}
        className={cn(
          "w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 transform active:scale-95",
          courseButtonColor[course.category]
        )}
      >
        <IconPlay />
        {isCompleted ? "Revoir" : "Commencer"}
      </button>
    </div>
  </div>
);

// ─── Page principale ──────────────────────────────────────────────────────────

export default function CoursPage() {
  const [search, setSearch]                         = useState("");
  const [category, setCategory]                     = useState<Category>("Tout");
  const [videoOpen, setVideoOpen]                   = useState(false);
  const [selectedVideo, setSelectedVideo]           = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle]           = useState("");
  const [selectedVideoId, setSelectedVideoId]       = useState("");
  const [selectedPdfCours, setSelectedPdfCours]     = useState<string | undefined>();
  const [selectedPdfFiche, setSelectedPdfFiche]     = useState<string | undefined>();
  const [selectedPdfCorrige, setSelectedPdfCorrige] = useState<string | undefined>();
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

  // Statistiques
  const totalCompleted = completedIds.filter((id) =>
    courses.some((c) => c.videoId === id)
  ).length;

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
    <div className="min-h-screen bg-gray-50">
      {/* ── En-tête de page ── */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Image src="/mascot.svg" alt="Mascotte" width={52} height={52} />
            <div>
              <h1 className="text-3xl font-bold text-blue-400" style={fredoka}>
                Cours
              </h1>
              <p className="text-gray-400 text-sm" style={fredoka}>
                Choisis un cours pour commencer à apprendre
              </p>
            </div>
            {/* Stat complétés */}
            {totalCompleted > 0 && (
              <div className="ml-auto flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <span className="text-emerald-700 font-semibold text-sm" style={fredoka}>
                  {totalCompleted} terminé{totalCompleted > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          {/* Barre de recherche */}
          <div className="relative max-w-lg">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <IconSearch />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un cours…"
              style={fredoka}
              className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all"
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
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={fredoka}
                className={cn(
                  "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-150",
                  category === cat ? categoryActiveColors[cat] : categoryColors[cat]
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Compteur résultats filtrés */}
          {(search || category !== "Tout") && (
            <p className="text-xs text-gray-400 mt-2" style={fredoka}>
              {filteredCourses.length} cours trouvé{filteredCourses.length !== 1 ? "s" : ""}
              {category !== "Tout" && ` en ${category}`}
              {search && ` pour « ${search} »`}
            </p>
          )}
        </div>
      </div>

      {/* ── Contenu principal ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8">

        {/* Section Récents */}
        {recentCourses.length > 0 && !search && category === "Tout" && (
          <section>
            <h2 className="text-base font-semibold text-gray-400 uppercase tracking-wide mb-3" style={fredoka}>
              Récemment regardés
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {recentCourses.map((course, index) => (
                <CourseCard
                  key={"recent-" + course.videoId}
                  course={course}
                  isCompleted={completedIds.includes(course.videoId)}
                  isRecent={true}
                  onPlay={playVideo}
                  index={index}
                />
              ))}
            </div>
            <div className="mt-6 border-t border-gray-200" />
          </section>
        )}

        {/* Grille principale */}
        {filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 font-semibold text-lg" style={fredoka}>
              Aucun cours trouvé
            </p>
            <p className="text-gray-400 text-sm mt-1" style={fredoka}>
              Essaie un autre mot-clé ou une autre catégorie
            </p>
            <button
              onClick={() => { setSearch(""); setCategory("Tout"); }}
              style={fredoka}
              className="mt-4 px-4 py-2 rounded-lg bg-sky-500 text-white text-sm font-semibold border-b-4 border-sky-600 hover:bg-sky-500/90 active:border-b-0 transition-all"
            >
              Tout afficher
            </button>
          </div>
        ) : (
          <section>
            {(!search && category === "Tout") && (
              <h2 className="text-base font-semibold text-gray-400 uppercase tracking-wide mb-3" style={fredoka}>
                Tous les cours
              </h2>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredCourses.map((course, index) => (
                <CourseCard
                  key={course.videoId}
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
      </div>

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

            {/* iFrame YouTube */}
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

            {/* Boutons PDF */}
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

            {/* Footer modal */}
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
                onClick={() => setVideoOpen(false)}
                className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform active:scale-95 text-sm bg-rose-500 text-white hover:bg-rose-500/90 border-rose-600 border-b-4 active:border-b-0"
              >
                Fermer
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}