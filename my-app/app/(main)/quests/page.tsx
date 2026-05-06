import Image from "next/image";
import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { Promo } from "@/components/promo";
import { quests } from "@/constants";

const questImages = [
  "/quete1.svg", "/quete2.svg", "/quete3.svg", "/quete4.svg",
  "/quete5.svg", "/quete6.svg", "/quete7.svg", "/quete8.svg",
];

const questColors = {
  streak:     { bg: "bg-red-50 dark:bg-red-950/30",       border: "border-red-200 dark:border-red-800",       bar: ["#f87171","#fb923c"], glow: "rgba(251,146,60,0.45)"  },
  lessons:    { bg: "bg-blue-50 dark:bg-blue-950/30",     border: "border-blue-200 dark:border-blue-800",     bar: ["#60a5fa","#818cf8"], glow: "rgba(96,165,250,0.45)"  },
  challenges: { bg: "bg-purple-50 dark:bg-purple-950/30", border: "border-purple-200 dark:border-purple-800", bar: ["#c084fc","#f472b6"], glow: "rgba(192,132,252,0.45)" },
  xp:         { bg: "bg-yellow-50 dark:bg-yellow-950/30", border: "border-yellow-200 dark:border-yellow-800", bar: ["#fbbf24","#fb923c"], glow: "rgba(251,191,36,0.45)"  },
};

const getQuestStyle = (type: string) =>
  questColors[type as keyof typeof questColors] ?? questColors.xp;

const getUserValue = (
  type: string, points: number, streak: number,
  lessonsCompleted: number, challengesCompleted: number
) => {
  if (type === "xp")         return points;
  if (type === "streak")     return streak;
  if (type === "lessons")    return lessonsCompleted;
  if (type === "challenges") return challengesCompleted;
  return 0;
};

const questCategories = [
  { key: "xp",         label: "Points XP", icon: "/xp-bolt.svg"    },
  { key: "lessons",    label: "Leçons",     icon: "/book.svg"       },
  { key: "streak",     label: "Streak",     icon: "/streak.svg"     },
  { key: "challenges", label: "Défis",      icon: "/challenge.svg"  },
];

const animStyles = `
  /* ── Entrée ── */
  @keyframes popIn {
    0%   { opacity:0; transform: scale(0.72) translateY(18px); }
    65%  { opacity:1; transform: scale(1.06) translateY(-4px);  }
    100% {            transform: scale(1)    translateY(0);      }
  }
  @keyframes slideUp {
    from { opacity:0; transform: translateY(28px); }
    to   { opacity:1; transform: translateY(0);    }
  }

  /* ── Barre de progression ── */
  @keyframes fillBar {
    from { width: 0%; }
  }
  @keyframes shimBar {
    0%   { background-position: 200% center; }
    100% { background-position:-200% center; }
  }

  /* ── Rebond infini (badge Start, trophée) ── */
  @keyframes floatBounce {
    0%,100% { transform: translateY(0);    }
    50%      { transform: translateY(-5px); }
  }

  /* ── Étoile pop sur badge complété ── */
  @keyframes starPop {
    0%   { transform: scale(0) rotate(-30deg); opacity:0; }
    60%  { transform: scale(1.3) rotate(8deg);  opacity:1; }
    100% { transform: scale(1)   rotate(0deg);  opacity:1; }
  }
  /* Halo pulse sur badge complété */
  @keyframes haloPulse {
    0%,100% { box-shadow: 0 0 0 0   rgba(234,179,8,0.4); }
    50%      { box-shadow: 0 0 0 8px rgba(234,179,8,0);   }
  }

  /* ── Rotation du halo héros ── */
  @keyframes haloSpin {
    to { transform: rotate(360deg); }
  }

  /* ── Wobble au tap/hover (icône quête) ── */
  @keyframes wobble {
    0%,100% { transform: rotate(0deg);    }
    20%      { transform: rotate(-12deg);  }
    40%      { transform: rotate(10deg);   }
    60%      { transform: rotate(-6deg);   }
    80%      { transform: rotate(4deg);    }
  }

  /* ── Confetti burst (pseudo-elements) ── */
  @keyframes confettiDrop {
    0%   { transform: translateY(-10px) rotate(0deg);   opacity:1; }
    100% { transform: translateY(48px)  rotate(720deg); opacity:0; }
  }

  /* ── Ligne de séparation animée ── */
  @keyframes lineGrow {
    from { width:0; opacity:0; }
    to   { width:100%; opacity:1; }
  }

  /* Classes utilitaires */
  .quest-card {
    animation: popIn 0.52s cubic-bezier(0.34,1.28,0.64,1) both;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
  }
  .quest-card:hover  { transform: translateY(-3px) scale(1.015); }
  .quest-card:active { transform: scale(0.96); }

  .quest-icon { transition: transform 0.15s ease; }
  .quest-card:hover .quest-icon { animation: wobble 0.55s ease both; }

  .progress-bar {
    background-size: 200% auto;
    animation: fillBar 1.1s cubic-bezier(0.4,0,0.2,1) both,
               shimBar 2.8s linear infinite;
  }

  .completed-badge {
    animation: starPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both,
               haloPulse 2.2s ease-in-out infinite;
  }

  .trophy { animation: floatBounce 2s ease-in-out infinite; }
  .hero-halo { animation: haloSpin 9s linear infinite; }

  .stat-card {
    animation: popIn 0.45s cubic-bezier(0.34,1.28,0.64,1) both;
    transition: transform 0.18s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .stat-card:hover  { transform: translateY(-4px) scale(1.05); }
  .stat-card:active { transform: scale(0.96); }

  /* Confetti spots decoratifs sur cartes complétées */
  .confetti-dot {
    position: absolute;
    width: 6px; height: 6px;
    border-radius: 50%;
    pointer-events: none;
    animation: confettiDrop 0.9s ease-out both;
  }

  .divider-line { animation: lineGrow 0.6s ease both; }
  .cat-header { animation: slideUp 0.4s cubic-bezier(0.4,0,0.2,1) both; }
`;

const QuestsPage = async () => {
  const [userProgress, userSubscription] = await Promise.all([
    getUserProgress(),
    getUserSubscription(),
  ]);

  if (!userProgress || !userProgress.activeCourse) redirect("/courses");

  const isPro               = !!userSubscription?.isActive;
  const streak              = userProgress.streak             ?? 0;
  const lessonsCompleted    = userProgress.lessonsCompleted   ?? 0;
  const challengesCompleted = userProgress.challengesCompleted ?? 0;

  const completedCount = quests.filter((q) => {
    const val = getUserValue(q.type, userProgress.points, streak, lessonsCompleted, challengesCompleted);
    return val >= q.value;
  }).length;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <style dangerouslySetInnerHTML={{ __html: animStyles }} />

      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={isPro}
          streak={userProgress.streak ?? 0}
        />
        {!isPro && <Promo />}
      </StickyWrapper>

      <FeedWrapper>
        <div className="w-full flex flex-col items-center">

          {/* ── Héro ─────────────────────────────────────────────────────── */}
          <div
            className="relative flex items-center justify-center mb-2"
            style={{ width: 120, height: 120 }}
          >
            <div
              className="hero-halo absolute inset-0 rounded-full opacity-60"
              style={{
                background: "conic-gradient(#fb923c55 0%, #fbbf2455 25%, transparent 50%, #fb923c33 75%, #fbbf2455 100%)",
                filter: "blur(6px)",
              }}
            />
            <Image
              src="/question.svg"
              alt="Quêtes"
              height={90}
              width={90}
              className="relative drop-shadow-lg"
              style={{ animation: "popIn 0.6s 0.1s cubic-bezier(0.34,1.28,0.64,1) both" }}
            />
          </div>

          <p className="text-xs font-semibold tracking-widest uppercase text-orange-400 mb-1"
             style={{ animation: "slideUp 0.4s 0.15s both" }}>
            Défis
          </p>
          <h1 className="font-extrabold text-foreground text-3xl tracking-tight mb-1"
              style={{ animation: "slideUp 0.4s 0.2s both" }}>
            Quêtes
          </h1>
          <p className="text-muted-foreground text-center text-sm mb-5 max-w-sm"
             style={{ animation: "slideUp 0.4s 0.25s both" }}>
            Complétez des quêtes en apprenant chaque jour.
          </p>

          {/* ── Stats ─────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mb-6">
            {[
              { src: "/xp-bolt.svg",   alt: "XP",     val: userProgress.points, label: "XP Total",    bg: "bg-yellow-50 dark:bg-yellow-950/30", border: "border-yellow-200 dark:border-yellow-800", text: "text-yellow-500 dark:text-yellow-300", sub: "text-yellow-400 dark:text-yellow-400", delay: "0.28s" },
              { src: "/streak.svg",    alt: "Streak",  val: streak,              label: "Jours streak", bg: "bg-red-50 dark:bg-red-950/30",       border: "border-red-200 dark:border-red-800",       text: "text-red-600 dark:text-red-400",       sub: "text-red-500 dark:text-red-500",       delay: "0.33s" },
              { src: "/book.svg",      alt: "Leçons",  val: lessonsCompleted,    label: "Leçons",       bg: "bg-blue-50 dark:bg-blue-950/30",      border: "border-blue-200 dark:border-blue-800",     text: "text-blue-600 dark:text-blue-400",     sub: "text-blue-500 dark:text-blue-500",     delay: "0.38s" },
              { src: "/challenge.svg", alt: "Défis",   val: challengesCompleted, label: "Défis",        bg: "bg-purple-50 dark:bg-purple-950/30",  border: "border-purple-200 dark:border-purple-800", text: "text-purple-600 dark:text-purple-400", sub: "text-purple-500 dark:text-purple-500", delay: "0.43s" },
            ].map(({ src, alt, val, label, bg, border, text, sub, delay }) => (
              <div
                key={label}
                className={`stat-card flex flex-col items-center p-3 rounded-2xl ${bg} border-2 border-b-4 ${border}`}
                style={{ animationDelay: delay }}
              >
                <Image src={src} alt={alt} width={22} height={22} className="mb-1" />
                <p className={`font-extrabold ${text} text-xl leading-none`}>{val}</p>
                <p className={`text-xs mt-0.5 ${sub}`}>{label}</p>
              </div>
            ))}
          </div>

          {/* ── Progression globale ───────────────────────────────────────── */}
          <div
            className="flex items-center gap-3 mb-6 px-5 py-3 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border-2 border-b-4 border-orange-200 dark:border-orange-800 w-full justify-center"
            style={{ animation: "popIn 0.45s 0.48s cubic-bezier(0.34,1.28,0.64,1) both" }}
          >
            <span className="trophy">
              <Image src="/trophy.svg" alt="Trophée" width={22} height={22} />
            </span>
            <div className="flex flex-col flex-1">
              <p className="text-sm font-extrabold text-orange-600 dark:text-orange-400">
                {completedCount} / {quests.length} quêtes complétées
              </p>
              <div className="w-full h-2 bg-orange-100 dark:bg-orange-900/40 rounded-full overflow-hidden mt-1 border border-orange-200 dark:border-orange-800">
                <div
                  className="h-full rounded-full progress-bar"
                  style={{
                    width: `${(completedCount / quests.length) * 100}%`,
                    backgroundImage: "linear-gradient(90deg,#fb923c,#fbbf24,#fb923c)",
                    animationDelay: "0.55s",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div
            className="divider-line h-px bg-border mb-6 rounded-full"
            style={{ animationDelay: "0.55s" }}
          />

          {/* ── Quêtes par catégorie ──────────────────────────────────────── */}
          {questCategories.map(({ key, label, icon }, catIdx) => {
            const categoryQuests = quests.filter((q) => q.type === key);
            const style          = getQuestStyle(key);

            return (
              <div key={key} className="w-full mb-8">

                {/* En-tête catégorie */}
                <div
                  className="cat-header flex items-center gap-2 mb-3"
                  style={{ animationDelay: `${0.58 + catIdx * 0.07}s` }}
                >
                  <div className={`p-1.5 rounded-lg ${style.bg} ${style.border} border-2`}>
                    <Image src={icon} alt={label} width={18} height={18} />
                  </div>
                  <h2 className="font-extrabold text-foreground text-lg">{label}</h2>
                </div>

                <ul className="space-y-3">
                  {categoryQuests.map((quest, idx) => {
                    const userVal    = getUserValue(key, userProgress.points, streak, lessonsCompleted, challengesCompleted);
                    const progress   = Math.min((userVal / quest.value) * 100, 100);
                    const completed  = userVal >= quest.value;
                    const questIndex = quests.findIndex(q => q.title === quest.title);
                    const imageSrc   = questImages[questIndex % questImages.length];
                    const cardDelay  = `${0.62 + catIdx * 0.08 + idx * 0.07}s`;

                    return (
                      <li
                        key={quest.title}
                        className={`quest-card relative flex items-center w-full p-4 gap-x-4 rounded-2xl border-2 border-b-4 overflow-hidden
                          ${completed
                            ? "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800"
                            : "bg-background border-border"
                          }`}
                        style={{ animationDelay: cardDelay }}
                      >
                        {/* Confetti spots (quêtes complétées uniquement) */}
                        {completed && (
                          <>
                            <span className="confetti-dot bg-yellow-400"  style={{ top: 8,  left: "20%", animationDelay: cardDelay }} />
                            <span className="confetti-dot bg-orange-400"  style={{ top: 4,  left: "50%", animationDelay: `calc(${cardDelay} + 0.08s)` }} />
                            <span className="confetti-dot bg-amber-300"   style={{ top: 10, left: "75%", animationDelay: `calc(${cardDelay} + 0.16s)` }} />
                            <span className="confetti-dot bg-yellow-300"  style={{ top: 2,  left: "35%", animationDelay: `calc(${cardDelay} + 0.24s)` }} />
                          </>
                        )}

                        {/* Icône */}
                        <div
                          className={`quest-icon p-2 rounded-xl border-2 border-b-4 shrink-0
                            ${completed
                              ? "bg-yellow-100 dark:bg-yellow-900/40 border-yellow-200 dark:border-yellow-800"
                              : `${style.bg} ${style.border}`
                            }`}
                        >
                          {completed ? (
                            <div className="completed-badge" style={{ animationDelay: cardDelay }}>
                              <Image src="/check.svg" alt="Complété" width={24} height={24} />
                            </div>
                          ) : (
                            <Image src={imageSrc} alt={quest.title} width={24} height={24} />
                          )}
                        </div>

                        {/* Contenu */}
                        <div className="flex flex-col gap-y-2 w-full min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className={`text-sm font-extrabold truncate ${completed ? "text-yellow-700 dark:text-yellow-400" : "text-foreground"}`}>
                                {quest.title}
                              </p>
                              <p className="text-xs text-muted-foreground leading-tight">{quest.description}</p>
                            </div>
                            {completed ? (
                              <span
                                className="completed-badge shrink-0 text-xs font-extrabold text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/40 px-2 py-0.5 rounded-full border border-yellow-200 dark:border-yellow-700 whitespace-nowrap"
                                style={{ animationDelay: `calc(${cardDelay} + 0.1s)` }}
                              >
                                ✨ Complétée
                              </span>
                            ) : (
                              <span className="shrink-0 text-xs font-bold text-muted-foreground tabular-nums">
                                {Math.min(userVal, quest.value)}/{quest.value}
                              </span>
                            )}
                          </div>

                          {/* Barre */}
                          <div className="w-full h-3 bg-muted rounded-full overflow-hidden border border-border">
                            <div
                              className="progress-bar h-full rounded-full"
                              style={{
                                width: `${progress}%`,
                                backgroundImage: completed
                                  ? "linear-gradient(90deg,#fbbf24,#f59e0b,#fbbf24)"
                                  : `linear-gradient(90deg,${style.bar[0]},${style.bar[1]},${style.bar[0]})`,
                                animationDelay: cardDelay,
                                boxShadow: progress > 5
                                  ? `0 0 8px ${style.glow ?? "rgba(251,191,36,0.4)"}`
                                  : "none",
                              }}
                            />
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}

        </div>
      </FeedWrapper>
    </div>
  );
};

export default QuestsPage;