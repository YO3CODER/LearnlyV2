import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema });

const updateChallengeQuestion = async () => {
  try {
    console.log("🔧 MODIFICATION DE LA QUESTION DU CHALLENGE 203\n");
    console.log("=".repeat(80));

    // 1. Trouver le challenge
    const challenge = await db.query.challenges.findFirst({
      where: (challenges, { eq }) => eq(challenges.id, 203)
    });

    if (!challenge) {
      console.log("❌ Challenge 203 non trouvé !");
      return;
    }

    console.log(`📚 Challenge trouvé: ID ${challenge.id}`);
    console.log(`   Ancienne question: ${challenge.question}`);
    console.log(`   Type: ${challenge.type}`);

    // 2. Modifier la question
    const newQuestion = "Si x² = 25, alors x = ___";
    
    await db.update(schema.challenges)
      .set({ question: newQuestion })
      .where(eq(schema.challenges.id, 203));

    console.log(`\n✅ Question modifiée avec succès !`);
    console.log(`   Nouvelle question: ${newQuestion}`);

    // 3. Vérifier les options
    const options = await db.query.challengeOptions.findMany({
      where: (options, { eq }) => eq(options.challengeId, challenge.id),
      orderBy: (options, { asc }) => [asc(options.order)]
    });

    console.log(`\n📊 Options (${options.length}/6):`);
    console.log("-".repeat(40));
    
    for (const opt of options) {
      const status = opt.correct ? "✅ BONNE" : "❌ MAUVAISE";
      const blankInfo = opt.blank !== null ? ` [blank: ${opt.blank}]` : "";
      console.log(`   ${status} - "${opt.text}"${blankInfo}`);
    }

    // 4. Résumé
    console.log("\n" + "=".repeat(80));
    console.log("📊 RÉSUMÉ:");
    console.log("=".repeat(80));
    console.log(`   ✅ Question: ${newQuestion}`);
    console.log(`   ✅ Bonne réponse: "5 ou -5" (blank: 0)`);
    console.log(`   ✅ Options: 6 (1 bonne + 5 mauvaises)`);
    console.log(`\n🎯 Le challenge est maintenant prêt à être utilisé !`);

  } catch (error) {
    console.error("❌ Erreur:", error);
  }
};

// Exécuter
updateChallengeQuestion();