import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!); 
// @ts-ignore
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("🔄 Resetting the database");

    // ================================================
    // RESET AVEC TRUNCATE + RESTART IDENTITY
    // ================================================
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

    console.log("✅ Database reset successfully!");

    // ================================================
    // INSÉRER TES DONNÉES ICI
    // ================================================
    console.log("📚 Inserting data...");

    // Example: Insert a course
    const courses = await db
      .insert(schema.courses)
      .values([
        { title: "Spanish", imageSrc: "/es.svg" },
      ])
      .returning();

    console.log("✅ Data inserted successfully!");

  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed the database");
  }
};

main();