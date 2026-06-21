import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { isAdmin } from "@/lib/admin";
import { units } from "@/db/schema";

export const GET = async () => {
  try {
    if (!await isAdmin()) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await db.query.units.findMany({
      with: {
        course: {
          columns: {
            title: true,
          },
        },
      },
    });

    const result = data.map((unit) => ({
      ...unit,
      courseTitle: unit.course?.title ?? "—",
    }));

    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Range': `units 0-${result.length - 1}/${result.length}`,
        'Access-Control-Expose-Headers': 'Content-Range',
      },
    });
  } catch (error) {
    console.error("Error in GET /api/units:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    if (!await isAdmin()) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { id, ...cleanBody } = body;

    const data = await db.insert(units).values(cleanBody).returning();

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error in POST /api/units:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};