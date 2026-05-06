import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Resetting the database...");

    await sql`
      TRUNCATE TABLE 
        user_progress,
        challenge_progress,
        challenge_options,
        challenges,
        lessons,
        units,
        courses,
        user_subscription
      RESTART IDENTITY CASCADE
    `;

    console.log("Inserting courses...");

    await db.insert(schema.courses).values([
      { id: 1, title: "Mathematics", imageSrc: "/math.svg" },
      { id: 2, title: "Spanish", imageSrc: "/es.svg" },
      { id: 3, title: "Italian", imageSrc: "/it.svg" },
      { id: 4, title: "French", imageSrc: "/fr.svg" },
      { id: 5, title: "Croatian", imageSrc: "/hr.svg" },
      { id: 6, title: "Culture Générale", imageSrc: "/culture.svg" },
    ]);

    console.log("✅ Done! Courses inserted with fresh IDs, no units/lessons/challenges.");
  } catch (error) {
    console.error("❌ Error:", error);
    throw new Error("Failed to reset the database");
  }
};

main();