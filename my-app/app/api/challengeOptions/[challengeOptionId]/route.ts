import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { challengeOptions } from "@/db/schema";
import { isAdmin } from "@/lib/admin";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ challengeOptionId: string }> },
) => {
  try {
    if (!await isAdmin()) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { challengeOptionId: challengeOptionIdStr } = await params;
    const challengeOptionId = parseInt(challengeOptionIdStr);
    
    const data = await db.query.challengeOptions.findFirst({
      where: eq(challengeOptions.id, challengeOptionId),
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
  { params }: { params: Promise<{ challengeOptionId: string }> },
) => {
  try {
    if (!await isAdmin()) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { challengeOptionId: challengeOptionIdStr } = await params;
    const challengeOptionId = parseInt(challengeOptionIdStr);
    const body = await req.json();
    delete body.id;
    
    const data = await db.update(challengeOptions)
      .set(body)
      .where(eq(challengeOptions.id, challengeOptionId))
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
  { params }: { params: Promise<{ challengeOptionId: string }> },
) => {
  try {
    if (!await isAdmin()) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { challengeOptionId: challengeOptionIdStr } = await params;
    const challengeOptionId = parseInt(challengeOptionIdStr);
    
    const data = await db.delete(challengeOptions)
      .where(eq(challengeOptions.id, challengeOptionId))
      .returning();

    if (!data.length) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};