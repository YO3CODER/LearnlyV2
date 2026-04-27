import { redirect } from "next/navigation";

import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { lessons, units as unitsSchema } from "@/db/schema";
import { 
  getCourseProgress, 
  getLessonPercentage, 
  getUnits, 
  getUserProgress,
  getUserSubscription
} from "@/db/queries";

import { Unit } from "./unit";
import { Header } from "./header";
import { StickyUnitBanner } from "./sticky-unit-banner";
import { UnitSeparator } from "./unit-separator";

const LearnPage = async () => {
  const userProgressData = getUserProgress();
  const courseProgressData = getCourseProgress();
  const lessonPercentageData = getLessonPercentage();
  const unitsData = getUnits();
  const userSubscriptionData = getUserSubscription();

  const [
    userProgress,
    units,
    courseProgress,
    lessonPercentage,
    userSubscription,
  ] = await Promise.all([
    userProgressData,
    unitsData,
    courseProgressData,
    lessonPercentageData,
    userSubscriptionData,
  ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  if (!courseProgress) {
    redirect("/courses");
  }

  const isPro = !!userSubscription?.isActive;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={isPro}
        />
        {!isPro && <Promo />}
        <Quests points={userProgress.points} />
      </StickyWrapper>
      <FeedWrapper>
        <Header title={userProgress.activeCourse.title} />

        <StickyUnitBanner
          units={units.map((unit, index) => ({
            id: unit.id,
            title: unit.title,
            description: unit.description,
            color: ["blue","purple","green","orange","pink","indigo","teal","red"][index % 8],
          }))}
        />

        {units.map((unit, index) => (
          <div key={unit.id}>
            <Unit
              id={unit.id}
              order={unit.order}
              description={unit.description}
              title={unit.title}
              lessons={unit.lessons}
              activeLesson={courseProgress.activeLesson as typeof lessons.$inferSelect & {
                unit: typeof unitsSchema.$inferSelect;
              } | undefined}
              activeLessonPercentage={lessonPercentage}
              index={index}
              isLast={index === units.length - 1}
            />

            {index !== units.length - 1 && (
              <UnitSeparator
                nextUnitTitle={units[index + 1]?.title}
                unitIndex={index}
              />
            )}
          </div>
        ))}
      </FeedWrapper>
    </div>
  );
};

export default LearnPage;