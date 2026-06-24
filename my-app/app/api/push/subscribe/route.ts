import db from "@/db/drizzle";
import { pushSubscriptions } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { endpoint, keys } = await req.json();

  await db
    .insert(pushSubscriptions)
    .values({
      userId,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    })
    .onConflictDoUpdate({
      target: pushSubscriptions.endpoint, // ← clé unique par appareil
      set: {
        p256dh: keys.p256dh,
        auth: keys.auth,
        userId,
      },
    });

  return NextResponse.json({ success: true });
}