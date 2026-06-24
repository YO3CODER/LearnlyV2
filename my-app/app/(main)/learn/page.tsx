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
import { PushSubscribeButton } from "@/components/PushSubscribeButton";

import { Unit } from "./unit";
import { Header } from "./header";
import { StickyUnitBannerDesktop, StickyUnitBannerMobile } from "./sticky-unit-banner";
import { UnitSeparator } from "./unit-separator";

export default async function LearnPage() {
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

  const mappedUnits = units.map((unit, index) => ({
    id: unit.id,
    title: unit.title,
    description: unit.description,
    color: ["blue", "purple", "green", "orange", "pink", "indigo", "teal", "red"][index % 8],
    order: unit.order,
    index: index,
  }));

  return (
    <div className="flex items-start gap-[48px] px-6 w-full max-w-full">
      <FeedWrapper>
        {/* Header sticky desktop uniquement */}
        <div className="hidden lg:block sticky top-0 z-50 bg-background">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <Header title={userProgress.activeCourse.title} />
            <UserProgress
              activeCourse={userProgress.activeCourse}
              hearts={userProgress.hearts}
              points={userProgress.points}
              hasActiveSubscription={isPro}
              streak={userProgress.streak ?? 0}
            />
          </div>
          <StickyUnitBannerDesktop units={mappedUnits} />
        </div>

        {/* Banner mobile uniquement */}
        <StickyUnitBannerMobile units={mappedUnits} />

        {/* Bouton notifications */}
        <div className="flex justify-center py-4">
          <PushSubscribeButton />
        </div>

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

      <StickyWrapper>
        {!isPro && <Promo />}
        <Quests
          points={userProgress.points}
          streak={userProgress.streak ?? 0}
          lessonsCompleted={userProgress.lessonsCompleted ?? 0}
          challengesCompleted={userProgress.challengesCompleted ?? 0}
        />
      </StickyWrapper>
    </div>
  );
}