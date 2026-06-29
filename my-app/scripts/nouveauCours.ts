import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema });

const fixThamesQuestion = async () => {
  try {
    console.log("🔧 CORRECTION DE LA QUESTION SUR LE FLEUVE DE LONDRES\n");
    console.log("=".repeat(80));

    // 1. Trouver le challenge par son ID (174)
    const challenge = await db.query.challenges.findFirst({
      where: (challenges, { eq }) => eq(challenges.id, 174)
    });

    if (!challenge) {
      console.log("❌ Challenge 174 non trouvé !");
      return;
    }

    console.log(`✅ Challenge trouvé: ID ${challenge.id}`);
    console.log(`   Question: ${challenge.question}`);
    console.log(`   Type: ${challenge.type}`);
    console.log(`   Lesson ID: ${challenge.lessonId}`);

    // 2. Voir les options actuelles
    const existingOptions = await db.query.challengeOptions.findMany({
      where: (options, { eq }) => eq(options.challengeId, challenge.id),
      orderBy: (options, { asc }) => [asc(options.order)]
    });

    console.log(`\n📊 Options actuelles (${existingOptions.length}):`);
    for (const opt of existingOptions) {
      const status = opt.correct ? "✅ BONNE" : "❌ MAUVAISE";
      console.log(`   ${status} - "${opt.text}"`);
    }

    // 3. Supprimer les anciennes options
    console.log(`\n🗑️ Suppression des anciennes options...`);
    await db.delete(schema.challengeOptions).where(eq(schema.challengeOptions.challengeId, challenge.id));

    // 4. Créer les nouvelles options avec de vraies réponses
    const correctAnswer = "Tamise";
    const wrongAnswers = [
      "Seine",
      "Danube",
      "Rhin",
      "Volga",
      "Thames"
    ];

    const allOptions = [correctAnswer, ...wrongAnswers];
    
    // Mélanger les options
    for (let i = allOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
    }

    console.log(`\n📝 Nouvelles options:`);
    for (let i = 0; i < allOptions.length; i++) {
      await db.insert(schema.challengeOptions).values({
        challengeId: challenge.id,
        text: allOptions[i],
        correct: allOptions[i] === correctAnswer,
        order: i,
        blank: allOptions[i] === correctAnswer ? 0 : null
      });
      const status = allOptions[i] === correctAnswer ? "✅ BONNE" : "❌ MAUVAISE";
      console.log(`   ${status} - "${allOptions[i]}"`);
    }

    // 5. Vérification finale
    console.log("\n" + "=".repeat(80));
    console.log("📊 VÉRIFICATION FINALE:");
    console.log("=".repeat(80));

    const finalOptions = await db.query.challengeOptions.findMany({
      where: (options, { eq }) => eq(options.challengeId, challenge.id),
      orderBy: (options, { asc }) => [asc(options.order)]
    });

    console.log(`\n📌 Challenge ${challenge.id}:`);
    console.log(`   Question: ${challenge.question}`);
    console.log(`   Type: ${challenge.type}`);
    console.log(`   Options: ${finalOptions.length}/6`);
    console.log(`\n   Détail des options:`);
    for (const opt of finalOptions) {
      const status = opt.correct ? "✅ BONNE" : "❌ MAUVAISE";
      const blankInfo = opt.blank !== null ? ` [blank: ${opt.blank}]` : "";
      console.log(`      ${status} - "${opt.text}"${blankInfo}`);
    }

    console.log("\n" + "=".repeat(80));
    console.log("🎯 RÉSULTAT:");
    console.log("=".repeat(80));
    console.log(`   ✅ Question: ${challenge.question}`);
    console.log(`   ✅ Bonne réponse: "${correctAnswer}"`);
    console.log(`   ✅ Mauvaises réponses: ${wrongAnswers.join(", ")}`);
    console.log(`   ✅ Plus de "réponse incorrecte"`);

  } catch (error) {
    console.error("❌ Erreur:", error);
  }
};

// Exécuter
fixThamesQuestion();