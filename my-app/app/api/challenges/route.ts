import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { isAdmin } from "@/lib/admin";
import { challenges } from "@/db/schema";

export const GET = async () => {
  try {
    if (!await isAdmin()) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await db.query.challenges.findMany({
      with: {
        lesson: {
          columns: {
            title: true,
          },
        },
      },
    });

    // Aplatir : ajouter lessonTitle directement sur chaque challenge
    const result = data.map((challenge) => ({
      ...challenge,
      lessonTitle: challenge.lesson?.title ?? "—",
    }));

    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Range': `challenges 0-${result.length - 1}/${result.length}`,
        'Access-Control-Expose-Headers': 'Content-Range',
      },
    });
  } catch (error) {
    console.error("Error in GET /api/challenges:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    if (!await isAdmin()) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    
    delete body.id;
    
    const data = await db.insert(challenges).values(body).returning();

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error in POST /api/challenges:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};