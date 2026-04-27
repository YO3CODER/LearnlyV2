import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { isAdmin } from "@/lib/admin";
import { challenges } from "@/db/schema";

export const GET = async () => {
  try {
    if (!await isAdmin()) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await db.query.challenges.findMany();

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Range': `challenges 0-${data.length - 1}/${data.length}`,
        'Access-Control-Expose-Headers': 'Content-Range',
      },
    });
  } catch (error) {
    console.error("Error in GET /api/challenges:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    if (!await isAdmin()) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    
    // SUPPRIMER L'ID - CRUCIAL !
    delete body.id;
    
    const data = await db.insert(challenges).values(body).returning();

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error in POST /api/challenges:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};