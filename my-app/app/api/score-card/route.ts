// app/api/score-card/route.ts
// Retourne les données JSON pour la carte de score d'un utilisateur
// Utilisé par le composant ShareScoreCard pour générer l'image canvas

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
import { userProgress, courses } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const progress = await db
    .select({
      userName: userProgress.userName,
      userImageSrc: userProgress.userImageSrc,
      points: userProgress.points,
      streak: userProgress.streak,
      weeklyPoints: userProgress.weeklyPoints,
      lessonsCompleted: userProgress.lessonsCompleted,
      challengesCompleted: userProgress.challengesCompleted,
      hearts: userProgress.hearts,
      courseTitle: courses.title,
      courseImageSrc: courses.imageSrc,
    })
    .from(userProgress)
    .leftJoin(courses, eq(userProgress.activeCourseId, courses.id))
    .where(eq(userProgress.userId, userId))
    .limit(1);

  if (!progress.length) {
    return NextResponse.json({ error: "No progress found" }, { status: 404 });
  }

  return NextResponse.json(progress[0]);
}