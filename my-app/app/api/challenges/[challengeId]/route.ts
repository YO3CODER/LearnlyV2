import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { challenges } from "@/db/schema";
import { isAdmin } from "@/lib/admin";

export const GET = async (
  req: Request,
  { params }: { params: { challengeId: string } }, // ← string, pas number
) => {
  try {
    if (!await isAdmin()) { // ← await
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const challengeId = parseInt(params.challengeId); // ← convertir
    
    const data = await db.query.challenges.findFirst({
      where: eq(challenges.id, challengeId),
    });

    if (!data) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in GET /api/challenges/[challengeId]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const PUT = async (
  req: Request,
  { params }: { params: { challengeId: string } }, // ← string
) => {
  try {
    if (!await isAdmin()) { // ← await
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const challengeId = parseInt(params.challengeId); // ← convertir
    const body = await req.json();
    
    // Supprimer l'id du body pour PUT aussi
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
    console.error("Error in PUT /api/challenges/[challengeId]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { challengeId: string } }, // ← string
) => {
  try {
    if (!await isAdmin()) { // ← await
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const challengeId = parseInt(params.challengeId); // ← convertir
    
    const data = await db.delete(challenges)
      .where(eq(challenges.id, challengeId))
      .returning();

    if (!data.length) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error in DELETE /api/challenges/[challengeId]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};