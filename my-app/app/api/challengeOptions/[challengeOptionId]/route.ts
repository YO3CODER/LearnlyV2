import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { challengeOptions } from "@/db/schema";
import { isAdmin } from "@/lib/admin";

export const GET = async (
  req: Request,
  { params }: { params: { challengeOptionId: string } }, // ← string, pas number
) => {
  try {
    if (!await isAdmin()) { // ← await
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const challengeOptionId = parseInt(params.challengeOptionId); // ← convertir
    
    const data = await db.query.challengeOptions.findFirst({
      where: eq(challengeOptions.id, challengeOptionId),
    });

    if (!data) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in GET /api/challengeOptions/[challengeOptionId]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const PUT = async (
  req: Request,
  { params }: { params: { challengeOptionId: string } }, // ← string
) => {
  try {
    if (!await isAdmin()) { // ← await
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const challengeOptionId = parseInt(params.challengeOptionId); // ← convertir
    const body = await req.json();
    
    // Supprimer l'id du body pour PUT aussi
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
    console.error("Error in PUT /api/challengeOptions/[challengeOptionId]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { challengeOptionId: string } }, // ← string
) => {
  try {
    if (!await isAdmin()) { // ← await
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const challengeOptionId = parseInt(params.challengeOptionId); // ← convertir
    
    const data = await db.delete(challengeOptions)
      .where(eq(challengeOptions.id, challengeOptionId))
      .returning();

    if (!data.length) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error in DELETE /api/challengeOptions/[challengeOptionId]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};