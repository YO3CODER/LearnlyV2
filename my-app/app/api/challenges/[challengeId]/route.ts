import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { challenges } from "@/db/schema";
import { isAdmin } from "@/lib/admin";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ challengeId: string }> },
) => {
  try {
    if (!await isAdmin()) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { challengeId: challengeIdStr } = await params;
    const challengeId = parseInt(challengeIdStr);
    
    const data = await db.query.challenges.findFirst({
      where: eq(challenges.id, challengeId),
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
  { params }: { params: Promise<{ challengeId: string }> },
) => {
  try {
    if (!await isAdmin()) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { challengeId: challengeIdStr } = await params;
    const challengeId = parseInt(challengeIdStr);
    const body = await req.json();
    delete body.id;
    
    const data = await db.update(challenges)
      .set(body)
      .where(eq(challenges.id, challengeId))
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
  { params }: { params: Promise<{ challengeId: string }> },
) => {
  try {
    if (!await isAdmin()) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { challengeId: challengeIdStr } = await params;
    const challengeId = parseInt(challengeIdStr);
    
    const data = await db.delete(challenges)
      .where(eq(challenges.id, challengeId))
      .returning();

    if (!data.length) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};