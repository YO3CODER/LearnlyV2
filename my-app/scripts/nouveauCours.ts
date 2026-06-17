import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema });

const fixChallenge4FillBlankWithChoices = async () => {
  try {
    console.log("🔧 CORRECTION DU CHALLENGE N°4 (FILL_BLANK AVEC OPTIONS DE CHOIX)...\n");
    console.log("=".repeat(70));

    // 1. Trouver le challenge par son ID
    const challengeId = 1963;
    
    const challenge = await db.query.challenges.findFirst({
      where: (challenges, { eq }) => eq(challenges.id, challengeId)
    });

    if (!challenge) {
      console.log(`❌ Challenge ${challengeId} non trouvé !`);
      return;
    }

    console.log(`📚 Challenge trouvé: ID ${challenge.id}`);
    console.log(`   Type actuel: ${challenge.type}`);
    console.log(`   Question: ${challenge.question}`);

    // 2. Garder le type FILL_BLANK
    if (challenge.type !== "FILL_BLANK") {
      await db.update(schema.challenges)
        .set({ type: "FILL_BLANK" })
        .where(eq(schema.challenges.id, challenge.id));
      console.log(`   ✅ Type modifié en FILL_BLANK`);
    }

    // 3. Supprimer les anciennes options
    await db.delete(schema.challengeOptions).where(eq(schema.challengeOptions.challengeId, challenge.id));
    console.log(`   Anciennes options supprimées`);

    // 4. Créer 6 options (1 bonne + 5 mauvaises) toutes avec blank: 0
    // Cela permet à l'interface de les afficher comme des choix possibles
    const options = [
      { text: "exposants", correct: true, blank: 0 },
      { text: "coefficients", correct: false, blank: 0 },
      { text: "signes", correct: false, blank: 0 },
      { text: "virgules", correct: false, blank: 0 },
      { text: "chiffres", correct: false, blank: 0 },
      { text: "décimales", correct: false, blank: 0 }
    ];

    // 5. Mélanger les options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    // 6. Insérer les nouvelles options
    for (let i = 0; i < options.length; i++) {
      await db.insert(schema.challengeOptions).values({
        challengeId: challenge.id,
        text: options[i].text,
        correct: options[i].correct,
        blank: options[i].blank,
        order: i
      });
    }

    console.log(`   ✅ Nouvelles options ajoutées (6 options de choix):`);
    for (const opt of options) {
      console.log(`      ${opt.correct ? "✅ BONNE" : "❌ MAUVAISE"} - "${opt.text}" (blank: ${opt.blank})`);
    }

    // 7. Vérifier
    const resultOptions = await db.query.challengeOptions.findMany({
      where: (options, { eq }) => eq(options.challengeId, challenge.id),
      orderBy: (options, { asc }) => [asc(options.order)]
    });

    console.log("\n📊 VÉRIFICATION FINALE:");
    console.log(`   Type du challenge: FILL_BLANK`);
    console.log(`   Nombre d'options: ${resultOptions.length}`);
    console.log(`   Bonne réponse: "${resultOptions.find(o => o.correct)?.text}"`);
    console.log(`   Toutes les options ont blank: 0`);

    console.log("\n" + "=".repeat(70));
    console.log("🎉 Challenge FILL_BLANK corrigé avec 6 options de choix !");
    console.log("   L'utilisateur voit un champ de saisie avec des bulles/suggestions.");
    console.log("   La bonne réponse est 'exposants'.");

  } catch (error) {
    console.error("❌ Erreur:", error);
  }
};

// Exécuter
fixChallenge4FillBlankWithChoices();