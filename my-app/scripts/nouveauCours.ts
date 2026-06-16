import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema });

const fixToSelectChallenge = async () => {
  try {
    console.log("🔧 TRANSFORMATION DU CHALLENGE EN SELECT (choix multiples)...\n");
    console.log("=".repeat(70));

    // 1. Trouver le challenge
    const targetQuestion = "10⁵ = 1 suivi de ___ zéros";
    
    const challenge = await db.query.challenges.findFirst({
      where: (challenges, { eq }) => eq(challenges.question, targetQuestion)
    });

    if (!challenge) {
      console.log(`❌ Challenge non trouvé: "${targetQuestion}"`);
      return;
    }

    console.log(`📚 Challenge trouvé: ID ${challenge.id}`);
    console.log(`   Type actuel: ${challenge.type}`);
    console.log(`   Question: ${challenge.question}`);

    // 2. Modifier le type de FILL_BLANK à SELECT
    await db.update(schema.challenges)
      .set({ type: "SELECT" })
      .where(eq(schema.challenges.id, challenge.id));

    console.log(`\n✅ Type modifié: FILL_BLANK → SELECT`);

    // 3. Supprimer les anciennes options
    await db.delete(schema.challengeOptions).where(eq(schema.challengeOptions.challengeId, challenge.id));
    console.log(`   Anciennes options supprimées`);

    // 4. Créer 6 options (1 bonne + 5 mauvaises)
    const correctAnswer = "5";
    const wrongAnswers = ["3", "4", "6", "7", "8"];
    const allOptions = [correctAnswer, ...wrongAnswers];
    
    // 5. Mélanger les options pour que la bonne réponse ne soit pas toujours à la même place
    for (let i = allOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
    }
    
    // 6. Insérer les nouvelles options
    for (let i = 0; i < allOptions.length; i++) {
      await db.insert(schema.challengeOptions).values({
        challengeId: challenge.id,
        text: allOptions[i],
        correct: allOptions[i] === correctAnswer,
        order: i
      });
    }

    console.log(`   Nouvelles options ajoutées:`);
    for (const opt of allOptions) {
      console.log(`      ${opt === correctAnswer ? "✅" : "❌"} ${opt}`);
    }

    // 7. Vérifier
    const options = await db.query.challengeOptions.findMany({
      where: (options, { eq }) => eq(options.challengeId, challenge.id)
    });

    console.log("\n📊 VÉRIFICATION FINALE:");
    console.log(`   Type du challenge: SELECT`);
    console.log(`   Nombre d'options: ${options.length}`);
    console.log(`   Bonne réponse: ${options.find(o => o.correct)?.text}`);

    console.log("\n" + "=".repeat(70));
    console.log("🎉 Challenge transformé en SELECT avec 6 options !");
    console.log("   L'utilisateur peut maintenant choisir la bonne réponse parmi 6 propositions.");

  } catch (error) {
    console.error("❌ Erreur:", error);
  }
};

// Exécuter
fixToSelectChallenge();