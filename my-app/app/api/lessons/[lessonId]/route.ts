import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { lessons } from "@/db/schema";
import { isAdmin } from "@/lib/admin";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ lessonId: string }> },
) => {
  try {
    if (!await isAdmin()) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { lessonId: lessonIdStr } = await params;
    const lessonId = parseInt(lessonIdStr);
    
    const data = await db.query.lessons.findFirst({
      where: eq(lessons.id, lessonId),
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
  { params }: { params: Promise<{ lessonId: string }> },
) => {
  try {
    if (!await isAdmin()) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { lessonId: lessonIdStr } = await params;
    const lessonId = parseInt(lessonIdStr);
    const body = await req.json();
    const { id, ...cleanBody } = body;
    
    const data = await db.update(lessons)
      .set(cleanBody)
      .where(eq(lessons.id, lessonId))
      .returning();

    if (!data.length) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ lessonId: string }> },
) => {
  try {
    if (!await isAdmin()) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { lessonId: lessonIdStr } = await params;
    const lessonId = parseInt(lessonIdStr);
    
    const data = await db.delete(lessons)
      .where(eq(lessons.id, lessonId))
      .returning();

    if (!data.length) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};