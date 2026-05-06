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

    // ✅ Debug
    console.log("GET challengeOption ID reçu:", challengeOptionIdStr);

    const challengeOptionId = parseInt(challengeOptionIdStr);

    if (isNaN(challengeOptionId)) {
      console.log("ID invalide:", challengeOptionIdStr);
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const data = await db.query.challengeOptions.findFirst({
      where: eq(challengeOptions.id, challengeOptionId),
    });

    if (!data) {
      console.log("Aucune option trouvée pour ID:", challengeOptionId);
      return new NextResponse("Not Found", { status: 404 });
    }

    console.log("Option trouvée:", JSON.stringify(data));
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur GET challengeOption:", error);
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

    // ✅ Debug
    console.log("PUT challengeOption ID:", challengeOptionId);

    const body = await req.json();

    // ✅ Debug
    console.log("PUT BODY reçu:", JSON.stringify(body, null, 2));

    delete body.id;

    const data = await db.update(challengeOptions)
      .set(body)
      .where(eq(challengeOptions.id, challengeOptionId))
      .returning();

    if (!data.length) {
      return new NextResponse("Not Found", { status: 404 });
    }

    console.log("Option mise à jour:", JSON.stringify(data[0]));
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Erreur PUT challengeOption:", error);
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
    console.error("Erreur DELETE challengeOption:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};