import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { courses } from "@/db/schema";
import { isAdmin } from "@/lib/admin";

export const GET = async (
  req: Request,
  { params }: { params: { courseId: string } },  // string, pas number
) => {
  try {
    if (!await isAdmin()) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const courseId = parseInt(params.courseId);
    
    const data = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
    });

    if (!data) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in GET /api/courses/[courseId]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const PUT = async (
  req: Request,
  { params }: { params: { courseId: string } },
) => {
  try {
    if (!await isAdmin()) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const courseId = parseInt(params.courseId);
    const body = await req.json();
    
    // Enlever l'ID si présent dans le body
    const { id, ...data } = body;
    
    const result = await db.update(courses)
      .set(data)
      .where(eq(courses.id, courseId))
      .returning();

    if (!result.length) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error in PUT /api/courses/[courseId]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { courseId: string } },
) => {
  try {
    if (!await isAdmin()) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const courseId = parseInt(params.courseId);
    
    const result = await db.delete(courses)
      .where(eq(courses.id, courseId))
      .returning();

    if (!result.length) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error in DELETE /api/courses/[courseId]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};