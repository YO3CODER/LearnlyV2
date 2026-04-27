import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { courses } from "@/db/schema";
import { isAdmin } from "@/lib/admin";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) => {
  try {
    if (!await isAdmin()) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { courseId: courseIdStr } = await params;
    const courseId = parseInt(courseIdStr);
    
    const data = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
    });

    if (!data) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const PUT = async (
  req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) => {
  try {
    if (!await isAdmin()) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { courseId: courseIdStr } = await params;
    const courseId = parseInt(courseIdStr);
    const body = await req.json();
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
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) => {
  try {
    if (!await isAdmin()) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { courseId: courseIdStr } = await params;
    const courseId = parseInt(courseIdStr);
    
    const result = await db.delete(courses)
      .where(eq(courses.id, courseId))
      .returning();

    if (!result.length) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};