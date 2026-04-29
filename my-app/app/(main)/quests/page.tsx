import Image from "next/image";
import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { Promo } from "@/components/promo";
import { quests } from "@/constants";
import {
  BoltIcon, CheckCircleIcon, FireIcon,
  StarIcon, TrophyIcon, SparklesIcon,
  BookOpenIcon, ShieldCheckIcon,
} from "@heroicons/react/24/solid";

const getQuestIcon = (type: string, value: number) => {
  if (type === "streak")     return { Icon: FireIcon,        color: "text-red-500",    bg: "bg-red-50 dark:bg-red-950/30",       border: "border-red-200 dark:border-red-800" };
  if (type === "lessons")    return { Icon: BookOpenIcon,    color: "text-blue-500",   bg: "bg-blue-50 dark:bg-blue-950/30",     border: "border-blue-200 dark:border-blue-800" };
  if (type === "challenges") return { Icon: ShieldCheckIcon, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/30", border: "border-purple-200 dark:border-purple-800" };
  if (value >= 1000) return { Icon: SparklesIcon, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-950/30", border: "border-yellow-200 dark:border-yellow-800" };
  if (value >= 500)  return { Icon: TrophyIcon,   color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-200 dark:border-orange-800" };
  if (value >= 100)  return { Icon: StarIcon,      color: "text-blue-500",   bg: "bg-blue-50 dark:bg-blue-950/30",     border: "border-blue-200 dark:border-blue-800" };
  return                    { Icon: BoltIcon,      color: "text-green-500",  bg: "bg-green-50 dark:bg-green-950/30",   border: "border-green-200 dark:border-green-800" };
};

const getUserValue = (
  type: string,
  points: number,
  streak: number,
  lessonsCompleted: number,
  challengesCompleted: number
) => {
  if (type === "xp") return points;
  if (type === "streak") return streak;
  if (type === "lessons") return lessonsCompleted;
  if (type === "challenges") return challengesCompleted;
  return 0;
};

const questCategories = [
  { key: "xp",         label: "Points XP", Icon: BoltIcon,        color: "text-green-500" },
  { key: "lessons",    label: "Leçons",     Icon: BookOpenIcon,    color: "text-blue-500" },
  { key: "streak",     label: "Streak",     Icon: FireIcon,        color: "text-red-500" },
  { key: "challenges", label: "Défis",      Icon: ShieldCheckIcon, color: "text-purple-500" },
];

const QuestsPage = async () => {
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();

  const [userProgress, userSubscription] = await Promise.all([
    userProgressData,
    userSubscriptionData,
  ]);

  if (!userProgress || !userProgress.activeCourse) redirect("/courses");

  const isPro = !!userSubscription?.isActive;
  const streak = userProgress.streak ?? 0;
  const lessonsCompleted = userProgress.lessonsCompleted ?? 0;
  const challengesCompleted = userProgress.challengesCompleted ?? 0;

  const completedCount = quests.filter((q) => {
    const val = getUserValue(q.type, userProgress.points, streak, lessonsCompleted, challengesCompleted);
    return val >= q.value;
  }).length;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
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

          {/* Header */}
          <div className="relative mb-2">
            <div className="absolute inset-0 bg-orange-200/30 dark:bg-orange-800/20 rounded-full blur-xl scale-150" />
            <Image src="/question.svg" alt="Quests" height={90} width={90} className="relative drop-shadow-md" />
          </div>
          <p className="text-xs font-semibold tracking-widest uppercase text-orange-400 mb-1">Défis</p>
          <h1 className="font-extrabold text-foreground text-3xl tracking-tight mb-1">Quêtes</h1>
          <p className="text-muted-foreground text-center text-sm mb-4 max-w-sm">
            Complétez des quêtes en apprenant chaque jour.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mb-6">
            <div className="flex flex-col items-center p-3 rounded-2xl bg-green-50 dark:bg-green-950/30 border-2 border-b-4 border-green-200 dark:border-green-800">
              <BoltIcon className="h-5 w-5 text-green-500 mb-1" />
              <p className="font-extrabold text-green-700 dark:text-green-400 text-lg">{userProgress.points}</p>
              <p className="text-xs text-green-600 dark:text-green-500">XP Total</p>
            </div>
            <div className="flex flex-col items-center p-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border-2 border-b-4 border-red-200 dark:border-red-800">
              <FireIcon className="h-5 w-5 text-red-500 mb-1" />
              <p className="font-extrabold text-red-700 dark:text-red-400 text-lg">{streak}</p>
              <p className="text-xs text-red-600 dark:text-red-500">Jours streak</p>
            </div>
            <div className="flex flex-col items-center p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border-2 border-b-4 border-blue-200 dark:border-blue-800">
              <BookOpenIcon className="h-5 w-5 text-blue-500 mb-1" />
              <p className="font-extrabold text-blue-700 dark:text-blue-400 text-lg">{lessonsCompleted}</p>
              <p className="text-xs text-blue-600 dark:text-blue-500">Leçons</p>
            </div>
            <div className="flex flex-col items-center p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border-2 border-b-4 border-purple-200 dark:border-purple-800">
              <ShieldCheckIcon className="h-5 w-5 text-purple-500 mb-1" />
              <p className="font-extrabold text-purple-700 dark:text-purple-400 text-lg">{challengesCompleted}</p>
              <p className="text-xs text-purple-600 dark:text-purple-500">Défis</p>
            </div>
          </div>

          {/* Progress global */}
          <div className="flex items-center gap-2 mb-6 px-4 py-2 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border-2 border-b-4 border-orange-200 dark:border-orange-800 w-full justify-center">
            <TrophyIcon className="h-5 w-5 text-orange-500" />
            <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
              {completedCount} / {quests.length} quêtes complétées
            </p>
          </div>

          <div className="h-px w-full bg-border mb-6 rounded-full" />

          {/* Quests par catégorie */}
          {questCategories.map(({ key, label, Icon, color }) => {
            const categoryQuests = quests.filter((q) => q.type === key);

            return (
              <div key={key} className="w-full mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`h-5 w-5 ${color}`} />
                  <h2 className="font-extrabold text-foreground text-lg">{label}</h2>
                </div>
                <ul className="space-y-3">
                  {categoryQuests.map((quest) => {
                    const userVal = getUserValue(key, userProgress.points, streak, lessonsCompleted, challengesCompleted);
                    const progress = Math.min((userVal / quest.value) * 100, 100);
                    const completed = userVal >= quest.value;
                    const { Icon: QIcon, color: qColor, bg, border } = getQuestIcon(key, quest.value);

                    return (
                      <li
                        key={quest.title}
                        className={`flex items-center w-full p-4 gap-x-4 rounded-2xl border-2 border-b-4 transition-all duration-200
                          ${completed
                            ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                            : "bg-background border-border hover:border-border hover:shadow-sm"
                          }`}
                      >
                        <div className={`p-3 rounded-xl border-2 border-b-4 shrink-0 ${completed ? "bg-green-100 dark:bg-green-900/40 border-green-200 dark:border-green-800" : `${bg} ${border}`}`}>
                          {completed
                            ? <CheckCircleIcon className="h-6 w-6 text-green-500" />
                            : <QIcon className={`h-6 w-6 ${qColor}`} />
                          }
                        </div>
                        <div className="flex flex-col gap-y-2 w-full">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className={`text-sm font-bold ${completed ? "text-green-700 dark:text-green-400" : "text-foreground"}`}>
                                {quest.title}
                              </p>
                              <p className="text-xs text-muted-foreground">{quest.description}</p>
                            </div>
                            {completed ? (
                              <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-full shrink-0">
                                Complétée !
                              </span>
                            ) : (
                              <span className="text-xs font-bold text-muted-foreground shrink-0">
                                {Math.min(userVal, quest.value)} / {quest.value}
                              </span>
                            )}
                          </div>
                          <div className="w-full h-2.5 bg-background rounded-full overflow-hidden border border-border">
                            <div
                              className={`h-full rounded-full transition-all duration-700
                                ${completed
                                  ? "bg-gradient-to-r from-green-400 to-emerald-400"
                                  : key === "streak"     ? "bg-gradient-to-r from-red-400 to-orange-400"
                                  : key === "lessons"    ? "bg-gradient-to-r from-blue-400 to-indigo-400"
                                  : key === "challenges" ? "bg-gradient-to-r from-purple-400 to-pink-400"
                                  : "bg-gradient-to-r from-orange-400 to-yellow-400"
                                }`}
                              style={{ width: `${progress}%` }}
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