import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { isAdmin } from "@/lib/admin";
import { courses } from "@/db/schema";

export const GET = async () => {
  try {
    if (!await isAdmin()) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await db.query.courses.findMany();
    
    // Ajouter le header Content-Range pour React Admin
    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Range': `courses 0-${data.length - 1}/${data.length}`,
        'Access-Control-Expose-Headers': 'Content-Range',
      },
    });
  } catch (error) {
    console.error("Error in GET /api/courses:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    if (!await isAdmin()) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    
    // Enlever l'ID s'il est présent (la DB le génère automatiquement)
    const { id, ...data } = body;
    
    const result = await db.insert(courses).values(data).returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error in POST /api/courses:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};