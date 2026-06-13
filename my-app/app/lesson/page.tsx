import { redirect } from "next/navigation";

import { getLesson, getUserProgress, getUserSubscription } from "@/db/queries";

import { Quiz } from "./quiz";

const LessonPage = async () => {
  const [lesson, userProgress, userSubscription] = await Promise.all([
    getLesson(),
    getUserProgress(),
    getUserSubscription(),
  ]);

  if (!lesson || !userProgress) {
    redirect("/learn");
  }

  const challengesCompleted = lesson.challenges.filter(
    (challenge) => challenge.completed
  ).length;

  const initialPercentage =
    lesson.challenges.length > 0
      ? (challengesCompleted / lesson.challenges.length) * 100
      : 0;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Quiz
        initialLessonId={lesson.id}
        initialLessonChallenges={lesson.challenges}
        initialHearts={userProgress.hearts}
        initialPercentage={initialPercentage}
        userSubscription={userSubscription}
      />
    </div>
  );
};

export default LessonPage;