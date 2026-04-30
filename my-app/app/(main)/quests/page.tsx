import Image from "next/image";
import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { Promo } from "@/components/promo";
import { quests } from "@/constants";

// Images pour les quêtes (de 1 à 8)
const questImages = [
  "/quete1.svg",
  "/quete2.svg",
  "/quete3.svg",
  "/quete4.svg",
  "/quete5.svg",
  "/quete6.svg",
  "/quete7.svg",
  "/quete8.svg",
];

// Couleurs par type de quête
const questColors = {
  streak: { color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800", bar: "from-red-400 to-orange-400" },
  lessons: { color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800", bar: "from-blue-400 to-indigo-400" },
  challenges: { color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/30", border: "border-purple-200 dark:border-purple-800", bar: "from-purple-400 to-pink-400" },
  xp: { color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-950/30", border: "border-yellow-200 dark:border-yellow-800", bar: "from-yellow-400 to-orange-400" },
};

const getQuestStyle = (type: string, value: number) => {
  if (type === "streak") return questColors.streak;
  if (type === "lessons") return questColors.lessons;
  if (type === "challenges") return questColors.challenges;
  return questColors.xp;
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
  { key: "xp", label: "Points XP" },
  { key: "lessons", label: "Leçons" },
  { key: "streak", label: "Streak" },
  { key: "challenges", label: "Défis" },
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

          {/* Stats avec images */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mb-6">
            <div className="flex flex-col items-center p-3 rounded-2xl bg-green-50 dark:bg-green-950/30 border-2 border-b-4 border-green-200 dark:border-green-800">
              <Image src="/xp-bolt.svg" alt="XP" width={20} height={20} className="mb-1" />
              <p className="font-extrabold text-green-700 dark:text-green-400 text-lg">{userProgress.points}</p>
              <p className="text-xs text-green-600 dark:text-green-500">XP Total</p>
            </div>
            <div className="flex flex-col items-center p-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border-2 border-b-4 border-red-200 dark:border-red-800">
              <Image src="/streak.svg" alt="Streak" width={20} height={20} className="mb-1" />
              <p className="font-extrabold text-red-700 dark:text-red-400 text-lg">{streak}</p>
              <p className="text-xs text-red-600 dark:text-red-500">Jours streak</p>
            </div>
            <div className="flex flex-col items-center p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border-2 border-b-4 border-blue-200 dark:border-blue-800">
              <Image src="/book.svg" alt="Leçons" width={20} height={20} className="mb-1" />
              <p className="font-extrabold text-blue-700 dark:text-blue-400 text-lg">{lessonsCompleted}</p>
              <p className="text-xs text-blue-600 dark:text-blue-500">Leçons</p>
            </div>
            <div className="flex flex-col items-center p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border-2 border-b-4 border-purple-200 dark:border-purple-800">
              <Image src="/challenge.svg" alt="Défis" width={20} height={20} className="mb-1" />
              <p className="font-extrabold text-purple-700 dark:text-purple-400 text-lg">{challengesCompleted}</p>
              <p className="text-xs text-purple-600 dark:text-purple-500">Défis</p>
            </div>
          </div>

          {/* Progress global */}
          <div className="flex items-center gap-2 mb-6 px-4 py-2 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border-2 border-b-4 border-orange-200 dark:border-orange-800 w-full justify-center">
            <Image src="/trophy.svg" alt="Trophée" width={20} height={20} />
            <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
              {completedCount} / {quests.length} quêtes complétées
            </p>
          </div>

          <div className="h-px w-full bg-border mb-6 rounded-full" />

          {/* Quests par catégorie avec images personnalisées */}
          {questCategories.map(({ key, label }) => {
            const categoryQuests = quests.filter((q) => q.type === key);
            const style = getQuestStyle(key, 0);

            return (
              <div key={key} className="w-full mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-1.5 rounded-lg ${style.bg} ${style.border} border-2`}>
                    <Image
                      src={key === "streak" ? "/streak.svg" : key === "lessons" ? "/book.svg" : key === "challenges" ? "/challenge.svg" : "/xp-bolt.svg"}
                      alt={label}
                      width={18}
                      height={18}
                    />
                  </div>
                  <h2 className="font-extrabold text-foreground text-lg">{label}</h2>
                </div>
                <ul className="space-y-3">
                  {categoryQuests.map((quest, idx) => {
                    const userVal = getUserValue(key, userProgress.points, streak, lessonsCompleted, challengesCompleted);
                    const progress = Math.min((userVal / quest.value) * 100, 100);
                    const completed = userVal >= quest.value;
                    const questIndex = quests.findIndex(q => q.title === quest.title);
                    const imageSrc = questImages[questIndex % questImages.length];
                    const questStyle = getQuestStyle(key, quest.value);

                    return (
                      <li
                        key={quest.title}
                        className={`flex items-center w-full p-4 gap-x-4 rounded-2xl border-2 border-b-4 transition-all duration-200
                          ${completed
                            ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                            : "bg-background border-border hover:border-border hover:shadow-sm"
                          }`}
                      >
                        <div className={`p-2 rounded-xl border-2 border-b-4 shrink-0 ${completed ? "bg-green-100 dark:bg-green-900/40 border-green-200 dark:border-green-800" : `${questStyle.bg} ${questStyle.border}`}`}>
                          {completed ? (
                            <Image src="/check.svg" alt="Complété" width={24} height={24} />
                          ) : (
                            <Image src={imageSrc} alt={quest.title} width={24} height={24} />
                          )}
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
                              className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${questStyle.bar}`}
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