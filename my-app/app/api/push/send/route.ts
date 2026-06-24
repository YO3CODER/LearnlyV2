import db from "@/db/drizzle";
import { pushSubscriptions } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import webpush from "web-push";
import { inArray } from "drizzle-orm";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { title, message, userIds } = await req.json();

  // Si userIds est fourni et non vide → filtre, sinon broadcast à tous
  const subscriptions = userIds?.length
    ? await db
        .select()
        .from(pushSubscriptions)
        .where(inArray(pushSubscriptions.userId, userIds))
    : await db.select().from(pushSubscriptions);

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        JSON.stringify({ title, message })
      )
    )
  );

  const success = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  return NextResponse.json({ success, failed });
}