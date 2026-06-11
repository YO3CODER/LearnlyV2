"use client";

import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Cours } from "@/lib/cours-utils";
import { Loader } from "lucide-react";

const fredoka = { fontFamily: "'Fredoka', sans-serif" } as const;

// ─── Types & Données ────────────────────────────────────────────────────────

type Category = "Tout" | "Maths" | "Français" | "Sciences" | "Histoire";

const ALL_CATEGORIES: Category[] = ["Tout", "Maths", "Français", "Sciences", "Histoire"];

const categoryColors: Record<Category, string> = {
  Tout: "bg-gray-100 text-gray-700 border-gray-300",
  Maths: "bg-sky-100 text-sky-700 border-sky-300",
  Français: "bg-violet-100 text-violet-700 border-violet-300",
  Sciences: "bg-emerald-100 text-emerald-700 border-emerald-300",
  Histoire: "bg-amber-100 text-amber-700 border-amber-300",
};

const categoryActiveColors: Record<Category, string> = {
  Tout: "bg-gray-600 text-white border-gray-700",
  Maths: "bg-sky-500 text-white border-sky-600",
  Français: "bg-violet-500 text-white border-violet-600",
  Sciences: "bg-emerald-500 text-white border-emerald-600",
  Histoire: "bg-amber-500 text-white border-amber-600",
};

const categoryBadgeColors: Record<string, string> = {
  Maths: "bg-sky-100 text-sky-700",
  Français: "bg-violet-100 text-violet-700",
  Sciences: "bg-emerald-100 text-emerald-700",
  Histoire: "bg-amber-100 text-amber-700",
};

const courseButtonColor: Record<string, string> = {
  Maths: "bg-sky-400 text-white border-sky-500 border-b-4 hover:bg-sky-400/90 active:border-b-0",
  Français: "bg-violet-500 text-white border-violet-600 border-b-4 hover:bg-violet-500/90 active:border-b-0",
  Sciences: "bg-emerald-500 text-white border-emerald-600 border-b-4 hover:bg-emerald-500/90 active:border-b-0",
  Histoire: "bg-amber-400 text-gray-900 border-amber-500 border-b-4 hover:bg-amber-400/90 active:border-b-0",
};

const cardAccentColor: Record<string, string> = {
  Maths: "border-sky-400",
  Français: "border-violet-500",
  Sciences: "border-emerald-500",
  Histoire: "border-amber-400",
};

const RECENT_KEY = "courses_recent";
const COMPLETED_KEY = "courses_completed";
const MAX_RECENT = 3;

// ─── Icônes SVG ─────────────────────────────────────────────────────────────

const IconBook = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const IconFile = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconPlay = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const IconSearch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);

// ─── Composant Loading ──────────────────────────────────────────────────────

const Loading = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Loader className="h-6 w-6 text-blue-400 animate-spin" />
    </div>
  );
};

// ─── Bouton PDF réutilisable ────────────────────────────────────────────────

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

// ─── Carte de cours ──────────────────────────────────────────────────────────

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
      "bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden opacity-0 animate-[fadeSlideIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)_forwards] border-l-4",
      cardAccentColor[course.categorie]
    )}
  >
    {/* Miniature YouTube */}
    <div className="relative w-full bg-gray-100 overflow-hidden group" style={{ paddingBottom: "56.25%" }}>
      <img
        src={`https://img.youtube.com/vi/${course.videoId}/mqdefault.jpg`}
        alt={course.titre}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      {/* Badge complété */}
      {isCompleted && (
        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}
      {/* Badge récent */}
      {isRecent && !isCompleted && (
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-orange-400 text-white text-xs font-semibold shadow-md" style={fredoka}>
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
          categoryBadgeColors[course.categorie]
        )}
      >
        {course.categorie}
      </span>

      {/* Titre */}
      <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 flex-grow" style={fredoka}>
        {course.titre}
      </p>

      {/* Bouton commencer */}
      <button
        onClick={() => onPlay(course)}
        style={fredoka}
        className={cn(
          "w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 transform active:scale-95 hover:shadow-md",
          courseButtonColor[course.categorie]
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
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("Tout");
  const [videoOpen, setVideoOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedVideoId, setSelectedVideoId] = useState("");
  const [selectedPdfCours, setSelectedPdfCours] = useState<string | null | undefined>();
  const [selectedPdfFiche, setSelectedPdfFiche] = useState<string | null | undefined>();
  const [selectedPdfCorrige, setSelectedPdfCorrige] = useState<string | null | undefined>();
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  const [courses, setCourses] = useState<Cours[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cours")
      .then((res) => res.json())
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setCoursesLoading(false));
  }, []);

  useEffect(() => {
    try {
      const r = localStorage.getItem(RECENT_KEY);
      const c = localStorage.getItem(COMPLETED_KEY);
      if (r) setRecentIds(JSON.parse(r));
      if (c) setCompletedIds(JSON.parse(c));
    } catch { }
  }, []);

  const filteredCourses = useMemo(() =>
    courses.filter((c) => {
      const matchSearch = c.titre.toLowerCase().includes(search.toLowerCase());
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

  const totalCompleted = completedIds.filter((id) =>
    courses.some((c) => c.videoId === id)
  ).length;

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
  };

  const toggleCompleted = (videoId: string) => {
    const next = completedIds.includes(videoId)
      ? completedIds.filter((id) => id !== videoId)
      : [...completedIds, videoId];
    setCompletedIds(next);
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(next));
  };

  const isCurrentCompleted = completedIds.includes(selectedVideoId);

  if (coursesLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ── HERO BANNER ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 text-white">
        {/* Décoration de fond */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-10 left-20 w-72 h-72 bg-white rounded-full -translate-x-1/2 translate-y-1/2 opacity-10"></div>
        </div>

        <div className="relative px-4 sm:px-6 py-20 sm:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Contenu texte */}
              <div className="z-10">
                <div className="mb-8">
                  <h1 className="text-5xl sm:text-6xl font-bold leading-tight" style={fredoka}>
                    Apprendre
                  </h1>
                </div>
                <p className="text-blue-50 text-lg mb-8 leading-relaxed" style={fredoka}>
                  Découvre nos cours complets et progressifs conçus pour te faire réussir
                </p>
                <div className="flex gap-4 flex-wrap">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-5 py-3 border border-white border-opacity-30" style={fredoka}>
                    <div className="text-3xl font-bold">{courses.length}</div>
                    <div className="text-sm text-blue-100">Cours disponibles</div>
                  </div>
                  {totalCompleted > 0 && (
                    <div className="bg-emerald-500 bg-opacity-80 backdrop-blur-sm rounded-lg px-5 py-3 border border-emerald-600 border-opacity-30" style={fredoka}>
                      <div className="text-3xl font-bold">{totalCompleted}</div>
                      <div className="text-sm text-emerald-100">Terminés</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Image Hero */}
              <div className="relative h-96 md:h-full flex items-center justify-center">
                <Image
                  src="/hero.svg"
                  alt="Apprendre"
                  width={400}
                  height={400}
                  className="drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RECHERCHE ET FILTRES ── */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto">
          {/* Barre de recherche */}
          <div className="relative max-w-lg mb-4">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <IconSearch />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un cours…"
              style={fredoka}
              className="w-full pl-10 pr-8 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filtres catégories */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={fredoka}
                className={cn(
                  "flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-150 hover:shadow-md",
                  category === cat ? categoryActiveColors[cat] : categoryColors[cat]
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Compteur résultats */}
          {(search || category !== "Tout") && (
            <p className="text-xs text-gray-400 mt-3" style={fredoka}>
              {filteredCourses.length} cours trouvé{filteredCourses.length !== 1 ? "s" : ""}
              {category !== "Tout" && ` en ${category}`}
              {search && ` pour « ${search} »`}
            </p>
          )}
        </div>
      </div>

      {/* ── CONTENU PRINCIPAL ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">

        {/* Section Récents */}
        {recentCourses.length > 0 && !search && category === "Tout" && (
          <section>
            <h2 className="text-base font-semibold text-gray-600 uppercase tracking-wider mb-6" style={fredoka}>
              Récemment regardés
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
            <div className="mt-10 border-t border-gray-200" />
          </section>
        )}

        {/* Section Ligue */}
        {filteredCourses.length > 0 && (
          <section className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3" style={fredoka}>
                  Rejoins la Ligue
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Complète tes cours, déverrouille des badges et grimpe les classements avec tes camarades
                </p>
                <button
                  onClick={() => { setSearch(""); setCategory("Tout"); }}
                  style={fredoka}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold border-b-4 border-purple-700 hover:shadow-lg active:border-b-0 transition-all"
                >
                  Découvrir
                </button>
              </div>
              <div className="flex justify-center">
                <Image
                  src="/ligue.svg"
                  alt="Ligue"
                  width={300}
                  height={300}
                  className="drop-shadow-xl"
                />
              </div>
            </div>
          </section>
        )}

        {/* Grille principale */}
        {filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 font-semibold text-lg" style={fredoka}>
              Aucun cours trouvé
            </p>
            <p className="text-gray-400 text-sm mt-2 mb-6" style={fredoka}>
              Essaie un autre mot-clé ou une autre catégorie
            </p>
            <button
              onClick={() => { setSearch(""); setCategory("Tout"); }}
              style={fredoka}
              className="px-6 py-3 rounded-lg bg-blue-500 text-white font-semibold border-b-4 border-blue-600 hover:bg-blue-500/90 active:border-b-0 transition-all hover:shadow-lg"
            >
              Afficher tous les cours
            </button>
          </div>
        ) : (
          <section>
            {(!search && category === "Tout") && (
              <h2 className="text-base font-semibold text-gray-600 uppercase tracking-wider mb-6" style={fredoka}>
                Tous les cours
              </h2>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
      </div>

      {/* ── Modal vidéo ── */}
      <Dialog open={videoOpen} onClose={() => { }} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-500 data-closed:scale-95 data-closed:opacity-0 data-enter:duration-500 data-enter:ease-out data-leave:duration-300 data-leave:ease-in w-full max-w-2xl border border-gray-200 flex flex-col"
          >
            {/* Titre */}
            <div className="px-5 py-3 border-b border-gray-100 flex-shrink-0 bg-gradient-to-r from-gray-50 to-white">
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
            <div className="px-5 py-2.5 flex gap-2 border-b border-gray-100 flex-shrink-0 bg-gray-50">
              <PdfButton
                href={selectedPdfCours}
                label="Cours PDF"
                icon={<IconBook />}
                activeClass="bg-amber-400 text-gray-900 border-amber-500 hover:shadow-md"
              />
              <PdfButton
                href={selectedPdfFiche}
                label="Fiche PDF"
                icon={<IconFile />}
                activeClass="bg-sky-500 text-white border-sky-600 hover:shadow-md"
              />
              <PdfButton
                href={selectedPdfCorrige}
                label="Corrigé PDF"
                icon={<IconCheck />}
                activeClass="bg-violet-500 text-white border-violet-600 hover:shadow-md"
              />
            </div>

            {/* Footer modal */}
            <div className="border-t border-gray-200 px-5 py-3 flex-shrink-0 flex gap-2">
              <button
                type="button"
                style={fredoka}
                onClick={() => toggleCompleted(selectedVideoId)}
                className={cn(
                  "flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform active:scale-95 text-sm border-b-4 active:border-b-0 hover:shadow-md",
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
                onClick={() => setVideoOpen(false)}
                className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform active:scale-95 text-sm bg-rose-500 text-white hover:bg-rose-500/90 border-rose-600 border-b-4 active:border-b-0 hover:shadow-md"
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