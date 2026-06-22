import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema });

const viewLastQuestion = async () => {
  try {
    console.log("🔍 AFFICHAGE DE LA DERNIÈRE QUESTION - LEÇON ÉQUATIONS DU 2ÈME DEGRÉ\n");
    console.log("=".repeat(80));

    // 1. Trouver la leçon
    const lesson = await db.query.lessons.findFirst({
      where: (lessons, { eq }) => eq(lessons.title, "Équations du 2ème degré")
    });

    if (!lesson) {
      console.log("❌ Leçon 'Équations du 2ème degré' non trouvée !");
      return;
    }

    console.log(`📚 Leçon: ${lesson.title} (ID: ${lesson.id})`);
    console.log(`   Unité: Équations`);

    // 2. Récupérer tous les challenges de la leçon
    const challenges = await db.query.challenges.findMany({
      where: (challenges, { eq }) => eq(challenges.lessonId, lesson.id),
      orderBy: (challenges, { asc }) => [asc(challenges.order)]
    });

    console.log(`\n📊 Total challenges: ${challenges.length}`);

    if (challenges.length === 0) {
      console.log("   ⚠️ Aucun challenge dans cette leçon");
      return;
    }

    // 3. Prendre le dernier challenge
    const lastChallenge = challenges[challenges.length - 1];
    
    console.log(`\n📌 DERNIER CHALLENGE (N°${challenges.length}):`);
    console.log("-".repeat(40));
    console.log(`   ID: ${lastChallenge.id}`);
    console.log(`   Type: ${lastChallenge.type}`);
    console.log(`   Order: ${lastChallenge.order}`);
    console.log(`   Question: ${lastChallenge.question}`);

    // 4. Récupérer les options du dernier challenge
    const options = await db.query.challengeOptions.findMany({
      where: (options, { eq }) => eq(options.challengeId, lastChallenge.id),
      orderBy: (options, { asc }) => [asc(options.order)]
    });

    console.log(`\n   Options (${options.length}/6):`);
    if (options.length === 0) {
      console.log("      ⚠️ AUCUNE OPTION !");
    } else {
      for (const opt of options) {
        const status = opt.correct ? "✅ BONNE" : "❌ MAUVAISE";
        const blankInfo = opt.blank !== null ? ` [blank: ${opt.blank}]` : "";
        console.log(`      ${status} - "${opt.text}"${blankInfo}`);
      }
    }

    // 5. Vérifier si la bonne réponse est présente
    const hasCorrect = options.some(opt => opt.correct === true);
    console.log(`\n   Bonne réponse présente: ${hasCorrect ? "✅ Oui" : "❌ Non"}`);

    // 6. Afficher le résumé de la leçon
    console.log("\n" + "=".repeat(80));
    console.log("📊 RÉSUMÉ DE LA LEÇON:");
    console.log("=".repeat(80));
    
    // Compter les types
    const types = challenges.reduce((acc, c) => {
      acc[c.type] = (acc[c.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log(`   📝 Types de challenges:`);
    for (const [type, count] of Object.entries(types)) {
      console.log(`      - ${type}: ${count}`);
    }

    // Compter les challenges avec 6 options
    let with6Options = 0;
    let withLessOptions = 0;
    let withNoOptions = 0;
    
    for (const challenge of challenges) {
      const opts = await db.query.challengeOptions.findMany({
        where: (options, { eq }) => eq(options.challengeId, challenge.id)
      });
      if (opts.length === 6) with6Options++;
      else if (opts.length > 0 && opts.length < 6) withLessOptions++;
      else withNoOptions++;
    }
    
    console.log(`\n   ✅ Challenges avec 6 options: ${with6Options}`);
    console.log(`   ⚠️ Challenges avec moins de 6 options: ${withLessOptions}`);
    console.log(`   ❌ Challenges sans options: ${withNoOptions}`);

    // 7. Afficher toutes les questions de la leçon
    console.log("\n" + "=".repeat(80));
    console.log("📋 LISTE DE TOUTES LES QUESTIONS:");
    console.log("=".repeat(80));
    
    for (let i = 0; i < challenges.length; i++) {
      const c = challenges[i];
      const opts = await db.query.challengeOptions.findMany({
        where: (options, { eq }) => eq(options.challengeId, c.id)
      });
      console.log(`   ${i+1}. ${c.question.substring(0, 70)}${c.question.length > 70 ? "..." : ""} (${opts.length}/6 options)`);
    }

  } catch (error) {
    console.error("❌ Erreur:", error);
  }
};

// Exécuter
viewLastQuestion();