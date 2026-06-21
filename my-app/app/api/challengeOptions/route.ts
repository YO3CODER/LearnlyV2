import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { isAdmin } from "@/lib/admin";
import { challengeOptions } from "@/db/schema";

export const GET = async () => {
  try {
    if (!await isAdmin()) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await db.query.challengeOptions.findMany({
      with: {
        challenge: {
          columns: {
            question: true,
          },
        },
      },
    });

    const result = data.map((option) => ({
      ...option,
      challengeQuestion: option.challenge?.question ?? "—",
    }));

    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Range': `challengeOptions 0-${result.length - 1}/${result.length}`,
        'Access-Control-Expose-Headers': 'Content-Range',
      },
    });
  } catch (error) {
    console.error("Error in GET /api/challengeOptions:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    if (!await isAdmin()) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    console.log("BODY REÇU:", JSON.stringify(body, null, 2));
    delete body.id;

    const data = await db.insert(challengeOptions).values(body).returning();
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error in POST /api/challengeOptions:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};