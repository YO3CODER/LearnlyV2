import { cache } from "react";
import { and, eq, sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { unstable_noStore as noStore } from "next/cache";
import { clerkClient } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
import { 
  challengeProgress,
  courses, 
  lessons, 
  units, 
  userProgress,
  userSubscription
} from "@/db/schema";

export const getUserProgress = async () => {
  noStore();

  const { userId } = await auth();

  if (!userId) return null;

  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
    with: {
      activeCourse: true,
    },
  });

  return data;
};

export const getUnits = cache(async () => {
  noStore();
  const { userId } = await auth();
  const userProgressData = await getUserProgress();

  if (!userId || !userProgressData?.activeCourseId) return [];

  const data = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    where: eq(units.courseId, userProgressData.activeCourseId),
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          challenges: {
            orderBy: (challenges, { asc }) => [asc(challenges.order)],
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userId),
              },
            },
          },
        },
      },
    },
  });

  const normalizedData = data.map((unit) => {
    const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
      if (lesson.challenges.length === 0) {
        return { ...lesson, completed: false, challengeCount: 0 };
      }

      const allCompletedChallenges = lesson.challenges.every((challenge) => {
        return challenge.challengeProgress
          && challenge.challengeProgress.length > 0
          && challenge.challengeProgress.every((progress) => progress.completed);
      });

      return {
        ...lesson,
        completed: allCompletedChallenges,
        challengeCount: lesson.challenges.length,
      };
    });

    return { ...unit, lessons: lessonsWithCompletedStatus };
  });

  return normalizedData;
});

export const getCourses = cache(async () => {
  const data = await db.query.courses.findMany();
  return data;
});

export const getCourseById = cache(async (courseId: number) => {
  const data = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
    with: {
      units: {
        orderBy: (units, { asc }) => [asc(units.order)],
        with: {
          lessons: {
            orderBy: (lessons, { asc }) => [asc(lessons.order)],
          },
        },
      },
    },
  });

  return data;
});

export const getCourseProgress = cache(async () => {
  noStore();
  const { userId } = await auth();
  const userProgressData = await getUserProgress();

  if (!userId || !userProgressData?.activeCourseId) return null;

  const unitsInActiveCourse = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    where: eq(units.courseId, userProgressData.activeCourseId),
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          unit: true,
          challenges: {
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userId),
              },
            },
          },
        },
      },
    },
  });

  const firstUncompletedLesson = unitsInActiveCourse
    .flatMap((unit) => unit.lessons)
    .find((lesson) => {
      return lesson.challenges.some((challenge) => {
        return !challenge.challengeProgress 
          || challenge.challengeProgress.length === 0 
          || challenge.challengeProgress.some((progress) => progress.completed === false);
      });
    });

  return {
    activeLesson: firstUncompletedLesson,
    activeLessonId: firstUncompletedLesson?.id,
  };
});

export const getLesson = cache(async (id?: number) => {
  noStore();
  const { userId } = await auth();

  if (!userId) return null;

  const courseProgress = await getCourseProgress();
  const lessonId = id || courseProgress?.activeLessonId;

  if (!lessonId) return null;

  const data = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
    with: {
      challenges: {
        orderBy: (challenges, { asc }) => [asc(challenges.order)],
        with: {
          challengeOptions: true,
          challengeProgress: {
            where: eq(challengeProgress.userId, userId),
          },
        },
      },
    },
  });

  if (!data || !data.challenges) return null;

  const normalizedChallenges = data.challenges.map((challenge) => {
    const completed = challenge.challengeProgress 
      && challenge.challengeProgress.length > 0
      && challenge.challengeProgress.every((progress) => progress.completed);

    return { ...challenge, completed };
  });

  return { ...data, challenges: normalizedChallenges };
});

export const getLessonPercentage = cache(async () => {
  noStore();
  const courseProgress = await getCourseProgress();

  if (!courseProgress?.activeLessonId) return 0;

  const lesson = await getLesson(courseProgress.activeLessonId);

  if (!lesson) return 0;

  const completedChallenges = lesson.challenges.filter((challenge) => challenge.completed);
  const percentage = Math.round(
    (completedChallenges.length / lesson.challenges.length) * 100,
  );

  return percentage;
});

const DAY_IN_MS = 86_400_000;
export const getUserSubscription = async () => {
  noStore();

  const { userId } = await auth();

  if (!userId) return null;

  const data = await db.query.userSubscription.findFirst({
    where: eq(userSubscription.userId, userId),
  });

  if (!data) return null;

  const isActive = 
    data.stripePriceId &&
    data.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

  return {
    ...data,
    isActive: !!isActive,
  };
};

// ── Helper : lundi courant en ISO date (YYYY-MM-DD) ───────────────────────────
const getCurrentMondayISO = (): string => {
  const now = new Date();
  const day = now.getDay(); // 0=dim, 1=lun...
  const diff = day === 0 ? -6 : 1 - day; // recule au lundi
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  return monday.toISOString().split("T")[0];
};

export const getTopTenUsers = async () => {
  noStore();

  const { userId } = await auth();
  if (!userId) return [];

  const currentMonday = getCurrentMondayISO();

  // ── Réinitialise weeklyPoints pour TOUS les utilisateurs en retard ───────────
  // Une seule requête SQL, indépendante de qui joue ou non.
  // Dès que le lundi arrive et que quelqu'un charge le leaderboard → tout le monde à 0.
  await db
    .update(userProgress)
    .set({ weeklyPoints: 0, weeklyResetDate: currentMonday })
    .where(
      sql`(${userProgress.weeklyResetDate} = '' OR ${userProgress.weeklyResetDate} != ${currentMonday})`
    );

  // ── Fetch le top 10 (données déjà à jour en base) ───────────────────────────
  const data = await db.query.userProgress.findMany({
    orderBy: (userProgress, { desc, asc }) => [
      desc(userProgress.points),
      asc(userProgress.userId),
    ],
    limit: 10,
    columns: {
      userId: true,
      userName: true,
      points: true,
      weeklyPoints: true,
      weeklyResetDate: true,
    },
  });

  // ── Enrichit avec les images Clerk ──────────────────────────────────────────
  const client = await clerkClient();
  const usersFromClerk = await Promise.all(
    data.map(async (entry) => {
      try {
        const clerkUser = await client.users.getUser(entry.userId!);
        return {
          userId: entry.userId,
          userName: entry.userName ?? "Anonymous",
          userImageSrc: clerkUser.imageUrl ?? "/default-avatar.png",
          points: entry.points ?? 0,
          weeklyPoints: entry.weeklyPoints ?? 0,
          weeklyResetDate: entry.weeklyResetDate ?? "",
        };
      } catch {
        return {
          userId: entry.userId,
          userName: entry.userName ?? "Anonymous",
          userImageSrc: "/default-avatar.png",
          points: entry.points ?? 0,
          weeklyPoints: entry.weeklyPoints ?? 0,
          weeklyResetDate: entry.weeklyResetDate ?? "",
        };
      }
    })
  );

  return usersFromClerk;
};

export const getAllUsers = async () => {
  noStore();

  const data = await db.query.userProgress.findMany({
    orderBy: (userProgress, { asc }) => [asc(userProgress.userName)],
    columns: {
      userId: true,
      userName: true,
    },
  });

  const client = await clerkClient();
  const users = await Promise.all(
    data.map(async (entry) => {
      try {
        const clerkUser = await client.users.getUser(entry.userId!);
        return {
          userId: entry.userId,
          userName: entry.userName ?? "Anonymous",
          userImageSrc: clerkUser.imageUrl ?? "/default-avatar.png",
        };
      } catch {
        return {
          userId: entry.userId,
          userName: entry.userName ?? "Anonymous",
          userImageSrc: "/default-avatar.png",
        };
      }
    })
  );

  return users;
};