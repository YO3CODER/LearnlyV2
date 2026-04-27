import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { units } from "@/db/schema";
import { isAdmin } from "@/lib/admin";

export const GET = async (
  req: Request,
  { params }: { params: { unitId: string } }, // ← string, pas number
) => {
  try {
    if (!await isAdmin()) { // ← await
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const unitId = parseInt(params.unitId); // ← convertir en number
    
    const data = await db.query.units.findFirst({
      where: eq(units.id, unitId),
    });

    if (!data) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in GET /api/units/[unitId]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const PUT = async (
  req: Request,
  { params }: { params: { unitId: string } }, // ← string
) => {
  try {
    if (!await isAdmin()) { // ← await
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const unitId = parseInt(params.unitId); // ← convertir
    const body = await req.json();
    
    // Supprimer l'id du body
    const { id, ...cleanBody } = body;
    
    const data = await db.update(units)
      .set(cleanBody)
      .where(eq(units.id, unitId))
      .returning();

    if (!data.length) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error in PUT /api/units/[unitId]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { unitId: string } }, // ← string
) => {
  try {
    if (!await isAdmin()) { // ← await
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const unitId = parseInt(params.unitId); // ← convertir
    
    const data = await db.delete(units)
      .where(eq(units.id, unitId))
      .returning();

    if (!data.length) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error in DELETE /api/units/[unitId]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};