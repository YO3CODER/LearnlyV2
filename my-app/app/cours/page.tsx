"use client";

import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Cours } from "@/lib/cours-utils";
import { Loader } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { MobileNavbar } from "@/components/mobile-navbar";

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

const RECENT_KEY = "courses_recent";
const COMPLETED_KEY = "courses_completed";
const MAX_RECENT = 3;

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

const IconExternalLink = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const IconStar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const Loading = () => (
  <div className="h-full w-full flex items-center justify-center">
    <Loader className="h-6 w-6 text-blue-400 animate-spin" />
  </div>
);

type PdfButtonProps = {
  href?: string | null;
  label: string;
  icon: React.ReactNode;
  activeClass: string;
  description?: string;
};

const PdfButton = ({ href, label, icon, activeClass, description }: PdfButtonProps) => {
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={fredoka}
        className={cn(
          "flex-1 flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-xl font-semibold text-sm border-b-4 hover:opacity-90 active:border-b-0 transition-all duration-200 active:scale-95 transform group",
          activeClass
        )}
      >
        <span className="flex items-center gap-1.5">
          {icon}{label}
          <span className="opacity-60 group-hover:opacity-100 transition-opacity"><IconExternalLink /></span>
        </span>
        {description && <span className="text-xs font-normal opacity-75">{description}</span>}
      </a>
    );
  }
  return (
    <span style={fredoka} className="flex-1 flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-xl font-semibold text-sm bg-muted text-muted-foreground border-border border-b-4 cursor-not-allowed select-none">
      <span className="flex items-center gap-1.5">{icon}{label}</span>
      {description && <span className="text-xs font-normal">Non disponible</span>}
    </span>
  );
};

type CourseCardProps = {
  course: Cours;
  isCompleted: boolean;
  isRecent: boolean;
  onPlay: (course: Cours) => void;
  index: number;
};

const CourseCard = ({ course, isCompleted, isRecent, onPlay, index }: CourseCardProps) => {
  const style = getCategoryStyle(course.categorie);

  return (
    <div
      style={{ animationDelay: `${index * 40}ms` }}
      className={cn(
        "bg-card rounded-xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden opacity-0 animate-[fadeSlideIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)_forwards] border-l-4",
        style.accent
      )}
    >
      <div className="relative w-full bg-muted overflow-hidden group" style={{ paddingBottom: "56.25%" }}>
        <img
          src={`https://img.youtube.com/vi/${course.videoId}/mqdefault.jpg`}
          alt={course.titre}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {isCompleted && (
          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
        {isRecent && !isCompleted && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-orange-400 text-white text-xs font-semibold shadow-md" style={fredoka}>
            Récent
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-grow gap-2">
        <span style={fredoka} className={cn("self-start text-xs font-semibold px-2 py-0.5 rounded-full", style.badge)}>
          {course.categorie}
        </span>
        <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2 flex-grow" style={fredoka}>
          {course.titre}
        </p>
        <button
          onClick={() => onPlay(course)}
          style={fredoka}
          className={cn(
            "w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 transform active:scale-95 hover:shadow-md",
            style.button
          )}
        >
          <IconPlay />
          {isCompleted ? "Revoir" : "Commencer"}
        </button>
      </div>
    </div>
  );
};

export default function CoursPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("Tout");
  const [videoOpen, setVideoOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedVideoId, setSelectedVideoId] = useState("");
  const [selectedCategorie, setSelectedCategorie] = useState("");
  const [selectedPdfCours, setSelectedPdfCours] = useState<string | null | undefined>();
  const [selectedPdfFiche, setSelectedPdfFiche] = useState<string | null | undefined>();
  const [selectedPdfCorrige, setSelectedPdfCorrige] = useState<string | null | undefined>();
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [courses, setCourses] = useState<Cours[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/cours")
      .then((res) => res.json())
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setCoursesLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/admin2/categories")
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    try {
      const r = localStorage.getItem(RECENT_KEY);
      const c = localStorage.getItem(COMPLETED_KEY);
      if (r) setRecentIds(JSON.parse(r));
      if (c) setCompletedIds(JSON.parse(c));
    } catch { }
  }, []);

  const ALL_CATEGORIES = useMemo(() => ["Tout", ...categories], [categories]);

  const filteredCourses = useMemo(() =>
    courses.filter((c) => {
      const matchSearch = c.titre.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "Tout" || c.categorie === category;
      return matchSearch && matchCategory;
    }),
    [search, category, courses]
  );

  const recentCourses = useMemo(() =>
    recentIds.map((id) => courses.find((c) => c.videoId === id)).filter(Boolean) as Cours[],
    [recentIds, courses]
  );

  const totalCompleted = completedIds.filter((id) => courses.some((c) => c.videoId === id)).length;

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes statPop {
          0%   { opacity: 0; transform: scale(0.8) translateY(8px); }
          70%  { transform: scale(1.05) translateY(-2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .hero-float { animation: heroFloat 4s ease-in-out infinite; }
        .hero-text-in { animation: heroFadeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .stat-pop { animation: statPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .stat-pop-delay { animation: statPop 0.5s 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        .shimmer-text {
          background: linear-gradient(90deg, #fff 0%, #bfdbfe 40%, #fff 60%, #bfdbfe 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      <div className="min-h-screen bg-background flex">

        {/* Desktop Sidebar */}
        <div className="hidden md:block md:w-[80px] flex-shrink-0">
          <Sidebar />
        </div>

        <div className="flex-1 pb-20 md:pb-0">

          {/* ── HERO BANNER ── */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 text-white">
            <div className="absolute inset-0 pointer-events-none select-none">
              <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/10 rounded-full" />
              <div className="absolute -bottom-10 left-10 w-48 h-48 bg-white/5 rounded-full" />
              <div className="absolute top-4 right-1/3 w-6 h-6 bg-white/20 rounded-full" />
              <div className="absolute bottom-8 right-16 w-3 h-3 bg-cyan-200/40 rounded-full" />
            </div>
            <div className="relative px-4 sm:px-6 py-8 sm:py-10">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="z-10 hero-text-in">
                    <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1" style={fredoka}>
                      Prêt à tout déchirer ?
                    </p>
                    <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-2" style={fredoka}>
                      <span className="shimmer-text">Apprendre</span>
                      <br />
                      <span className="text-white">sans se noyer</span>
                    </h1>
                    <p className="text-blue-100 text-sm mb-4 leading-relaxed max-w-sm" style={fredoka}>
                      Des cours clairs, des vidéos qui vont droit au but — et si tu bloques, la réponse est à deux clics.
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      <div className="stat-pop bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30" style={fredoka}>
                        <div className="text-2xl font-bold">{courses.length}</div>
                        <div className="text-xs text-blue-100">Cours disponibles</div>
                      </div>
                      {totalCompleted > 0 && (
                        <div className="stat-pop-delay bg-emerald-500/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-emerald-600/30 flex items-center gap-2" style={fredoka}>
                          <span className="text-yellow-300"><IconStar /></span>
                          <div>
                            <div className="text-2xl font-bold leading-none">{totalCompleted}</div>
                            <div className="text-xs text-emerald-100">Terminés</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-center md:justify-end">
                    <div className="hero-float">
                      <Image src="/hero.svg" alt="Apprendre" width={220} height={220} className="drop-shadow-2xl" priority />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RECHERCHE ET FILTRES ── */}
          <div className="bg-background border-b border-border px-4 sm:px-6 py-5 sticky top-0 z-40 shadow-sm">
            <div className="max-w-6xl mx-auto">
              <div className="relative max-w-lg mb-3">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <IconSearch />
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un cours…"
                  style={fredoka}
                  className="w-full pl-10 pr-8 py-3 rounded-xl border border-border bg-muted text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all shadow-sm"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs transition-colors">
                    ✕
                  </button>
                )}
              </div>

              {/* Filtres catégories - responsive: horizontal sur desktop, grille sur mobile */}
              <div className="hidden sm:flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {ALL_CATEGORIES.map((cat) => {
                  const catStyle = getCategoryStyle(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      style={fredoka}
                      className={cn(
                        "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all duration-150 hover:shadow-md",
                        category === cat ? catStyle.filterActive : catStyle.filterInactive
                      )}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Version mobile: grille 3 colonnes */}
              <div className="sm:hidden">
                <div className="grid grid-cols-3 gap-2">
                  {ALL_CATEGORIES.map((cat) => {
                    const catStyle = getCategoryStyle(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        style={fredoka}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all duration-150 hover:shadow-md text-center truncate",
                          category === cat ? catStyle.filterActive : catStyle.filterInactive
                        )}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {(search || category !== "Tout") && (
                <p className="text-xs text-muted-foreground mt-2" style={fredoka}>
                  {filteredCourses.length} cours trouvé{filteredCourses.length !== 1 ? "s" : ""}
                  {category !== "Tout" && ` en ${category}`}
                  {search && ` pour « ${search} »`}
                </p>
              )}
            </div>
          </div>

          {/* ── CONTENU PRINCIPAL ── */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">

            {recentCourses.length > 0 && !search && category === "Tout" && (
              <section>
                <h2 className="text-base font-semibold text-muted-foreground uppercase tracking-wider mb-6" style={fredoka}>
                  Récemment regardés
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {recentCourses.map((course, index) => (
                    <CourseCard key={"recent-" + course.id} course={course} isCompleted={completedIds.includes(course.videoId)} isRecent={true} onPlay={playVideo} index={index} />
                  ))}
                </div>
                <div className="mt-10 border-t border-border" />
              </section>
            )}

            {filteredCourses.length > 0 && (
              <section className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-8 border border-purple-500/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-3" style={fredoka}>Rejoins la Ligue</h2>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Complète tes cours, déverrouille des badges et grimpe les classements avec tes camarades
                    </p>
                    <Link href="/leaderboard" style={fredoka} className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold border-b-4 border-purple-700 hover:shadow-lg active:border-b-0 transition-all">
                      Découvrir
                    </Link>
                  </div>
                  <div className="flex justify-center">
                    <Image src="/ligue.svg" alt="Ligue" width={300} height={300} className="drop-shadow-xl" />
                  </div>
                </div>
              </section>
            )}

            {filteredCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-muted-foreground font-semibold text-lg" style={fredoka}>Aucun cours trouvé</p>
                <p className="text-muted-foreground/70 text-sm mt-2 mb-6" style={fredoka}>Essaie un autre mot-clé ou une autre catégorie</p>
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
                  <h2 className="text-base font-semibold text-muted-foreground uppercase tracking-wider mb-6" style={fredoka}>
                    Tous les cours
                  </h2>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredCourses.map((course, index) => (
                    <CourseCard key={course.id} course={course} isCompleted={completedIds.includes(course.videoId)} isRecent={recentIds.includes(course.videoId)} onPlay={playVideo} index={index} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        <MobileNavbar />
      </div>

      {/* ── Modal vidéo ── */}
      <Dialog open={videoOpen} onClose={() => { }} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/75 backdrop-blur-md" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-2xl bg-card shadow-2xl transition-all duration-500 data-closed:scale-95 data-closed:opacity-0 data-enter:duration-500 data-enter:ease-out data-leave:duration-300 data-leave:ease-in w-full max-w-2xl border border-border flex flex-col"
          >
            <div className={cn("h-1 w-full bg-gradient-to-r flex-shrink-0", getCategoryStyle(selectedCategorie).modal)} />

            <div className="px-5 py-3 border-b border-border flex-shrink-0 flex items-center justify-between gap-3 bg-card">
              <div className="min-w-0">
                <span style={fredoka} className={cn("inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1", getCategoryStyle(selectedCategorie).badge)}>
                  {selectedCategorie}
                </span>
                <p className="text-sm font-semibold text-foreground truncate leading-snug" style={fredoka}>{selectedTitle}</p>
              </div>
              <button
                type="button"
                style={fredoka}
                onClick={() => setVideoOpen(false)}
                className="flex-shrink-0 w-8 h-8 rounded-full bg-muted hover:bg-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors text-sm font-bold"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            <div className="relative w-full bg-black" style={{ paddingBottom: "56.25%" }}>
              {selectedVideo && (
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&rel=0`}
                  title={selectedTitle}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>

            <div className="px-5 pt-4 pb-2 flex-shrink-0 bg-card">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5" style={fredoka}>
                Ressources du cours
              </p>
              <div className="flex gap-2">
                <PdfButton href={selectedPdfCours} label="Cours" icon={<IconBook />} activeClass="bg-amber-400 text-gray-900 border-amber-500 hover:shadow-md" description="Leçon complète" />
                <PdfButton href={selectedPdfFiche} label="Fiche" icon={<IconFile />} activeClass="bg-sky-500 text-white border-sky-600 hover:shadow-md" description="Résumé rapide" />
                <PdfButton href={selectedPdfCorrige} label="Corrigé" icon={<IconCheck />} activeClass="bg-violet-500 text-white border-violet-600 hover:shadow-md" description="Exercices résolus" />
              </div>
            </div>

            <div className="border-t border-border px-5 py-3 flex-shrink-0 flex gap-2 bg-muted/50">
              <button
                type="button"
                style={fredoka}
                onClick={() => toggleCompleted(selectedVideoId)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 transform active:scale-95 text-sm border-b-4 active:border-b-0 hover:shadow-md",
                  isCurrentCompleted
                    ? "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                    : "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-500/90"
                )}
              >
                {isCurrentCompleted ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    Marquer non terminé
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    Cours terminé
                  </>
                )}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}