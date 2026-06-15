import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema });

const addMissingAimerOptions = async () => {
  try {
    console.log("🔧 Ajout des options manquantes pour 'aimer' et autres verbes...\n");

    // 1. Trouver le cours Mimi
    const mimiCourse = await db.query.courses.findFirst({
      where: (courses, { eq }) => eq(courses.title, "Mimi - Conjugaison Française")
    });

    if (!mimiCourse) {
      throw new Error("Cours Mimi non trouvé");
    }

    // 2. Trouver l'unité
    const unit = await db.query.units.findFirst({
      where: (units, { eq }) => eq(units.title, "Les Verbes du 1er Groupe (-ER)")
    });

    if (!unit) {
      throw new Error("Unité non trouvée");
    }

    // 3. Trouver la leçon
    const lesson = await db.query.lessons.findFirst({
      where: (lessons, { eq }) => eq(lessons.title, "Présent - Verbes en -ER")
    });

    if (!lesson) {
      throw new Error("Leçon non trouvée");
    }

    // 4. Récupérer tous les challenges de cette leçon
    const challenges = await db.query.challenges.findMany({
      where: (challenges, { eq }) => eq(challenges.lessonId, lesson.id)
    });

    console.log(`📚 ${challenges.length} challenges trouvés\n`);

    let addedCount = 0;

    // 5. Pour chaque challenge, vérifier et ajouter les options
    for (const challenge of challenges) {
      const existingOptions = await db.query.challengeOptions.findMany({
        where: (options, { eq }) => eq(options.challengeId, challenge.id)
      });

      if (existingOptions.length === 0) {
        const question = challenge.question;
        let options: string[] = [];
        let correctAnswer = "";

        // ============================================
        // VERBE AIMER
        // ============================================
        if (question === "Conjugue 'aimer' au présent (je)") {
          correctAnswer = "j'aime";
          options = ["j'aime", "j'aimes", "j'aiment", "nous aimons", "vous aimez", "ils aiment"];
        }
        else if (question === "Conjugue 'aimer' au présent (tu)") {
          correctAnswer = "tu aimes";
          options = ["tu aimes", "tu aime", "tu aiment", "nous aimons", "vous aimez", "ils aiment"];
        }
        else if (question === "Conjugue 'aimer' au présent (il)") {
          correctAnswer = "il aime";
          options = ["il aime", "il aimes", "il aiment", "nous aimons", "vous aimez", "ils aiment"];
        }
        else if (question === "Conjugue 'aimer' au présent (elle)") {
          correctAnswer = "elle aime";
          options = ["elle aime", "elle aimes", "elle aiment", "nous aimons", "vous aimez", "ils aiment"];
        }
        else if (question === "Conjugue 'aimer' au présent (nous)") {
          correctAnswer = "nous aimons";
          options = ["nous aimons", "j'aime", "tu aimes", "il aime", "vous aimez", "ils aiment"];
        }
        else if (question === "Conjugue 'aimer' au présent (vous)") {
          correctAnswer = "vous aimez";
          options = ["vous aimez", "j'aime", "tu aimes", "il aime", "nous aimons", "ils aiment"];
        }
        else if (question === "Conjugue 'aimer' au présent (ils)") {
          correctAnswer = "ils aiment";
          options = ["ils aiment", "j'aime", "tu aimes", "il aime", "nous aimons", "vous aimez"];
        }
        // ============================================
        // VERBE DÉTESTER
        // ============================================
        else if (question === "Conjugue 'détester' au présent (je)") {
          correctAnswer = "je déteste";
          options = ["je déteste", "je détestes", "je détestent", "nous détestons", "vous détestez", "ils détestent"];
        }
        else if (question === "Conjugue 'détester' au présent (tu)") {
          correctAnswer = "tu détestes";
          options = ["tu détestes", "tu déteste", "tu détestent", "nous détestons", "vous détestez", "ils détestent"];
        }
        else if (question === "Conjugue 'détester' au présent (il)") {
          correctAnswer = "il déteste";
          options = ["il déteste", "il détestes", "il détestent", "nous détestons", "vous détestez", "ils détestent"];
        }
        else if (question === "Conjugue 'détester' au présent (nous)") {
          correctAnswer = "nous détestons";
          options = ["nous détestons", "je déteste", "tu détestes", "il déteste", "vous détestez", "ils détestent"];
        }
        else if (question === "Conjugue 'détester' au présent (vous)") {
          correctAnswer = "vous détestez";
          options = ["vous détestez", "je déteste", "tu détestes", "il déteste", "nous détestons", "ils détestent"];
        }
        else if (question === "Conjugue 'détester' au présent (ils)") {
          correctAnswer = "ils détestent";
          options = ["ils détestent", "je déteste", "tu détestes", "il déteste", "nous détestons", "vous détestez"];
        }
        // ============================================
        // VERBE ADORER
        // ============================================
        else if (question === "Conjugue 'adorer' au présent (je)") {
          correctAnswer = "j'adore";
          options = ["j'adore", "j'adores", "j'adorent", "nous adorons", "vous adorez", "ils adorent"];
        }
        else if (question === "Conjugue 'adorer' au présent (tu)") {
          correctAnswer = "tu adores";
          options = ["tu adores", "tu adore", "tu adorent", "nous adorons", "vous adorez", "ils adorent"];
        }
        else if (question === "Conjugue 'adorer' au présent (il)") {
          correctAnswer = "il adore";
          options = ["il adore", "il adores", "il adorent", "nous adorons", "vous adorez", "ils adorent"];
        }
        else if (question === "Conjugue 'adorer' au présent (vous)") {
          correctAnswer = "vous adorez";
          options = ["vous adorez", "j'adore", "tu adores", "il adore", "nous adorons", "ils adorent"];
        }
        else if (question === "Conjugue 'adorer' au présent (ils)") {
          correctAnswer = "ils adorent";
          options = ["ils adorent", "j'adore", "tu adores", "il adore", "nous adorons", "vous adorez"];
        }
        // ============================================
        // VERBE PRÉFÉRER (verbe à é_è)
        // ============================================
        else if (question === "Conjugue 'préférer' au présent (je)") {
          correctAnswer = "je préfère";
          options = ["je préfère", "je préfères", "je préfèrent", "nous préférons", "vous préférez", "ils préfèrent"];
        }
        else if (question === "Conjugue 'préférer' au présent (tu)") {
          correctAnswer = "tu préfères";
          options = ["tu préfères", "tu préfère", "tu préfèrent", "nous préférons", "vous préférez", "ils préfèrent"];
        }
        else if (question === "Conjugue 'préférer' au présent (il)") {
          correctAnswer = "il préfère";
          options = ["il préfère", "il préfères", "il préfèrent", "nous préférons", "vous préférez", "ils préfèrent"];
        }
        else if (question === "Conjugue 'préférer' au présent (nous)") {
          correctAnswer = "nous préférons";
          options = ["nous préférons", "je préfère", "tu préfères", "il préfère", "vous préférez", "ils préfèrent"];
        }
        else if (question === "Conjugue 'préférer' au présent (vous)") {
          correctAnswer = "vous préférez";
          options = ["vous préférez", "je préfère", "tu préfères", "il préfère", "nous préférons", "ils préfèrent"];
        }
        else if (question === "Conjugue 'préférer' au présent (ils)") {
          correctAnswer = "ils préfèrent";
          options = ["ils préfèrent", "je préfère", "tu préfères", "il préfère", "nous préférons", "vous préférez"];
        }
        // ============================================
        // AUTRES VERBES à ajouter
        // ============================================
        else {
          // Ignorer les challenges non SELECT (ASSIST, FILL_BLANK)
          if (!question.includes("Conjugue")) {
            continue;
          }
          console.log(`   ⚠️ Challenge non traité: "${question}"`);
          continue;
        }

        // Insérer les options
        for (let i = 0; i < options.length; i++) {
          await db.insert(schema.challengeOptions).values({
            challengeId: challenge.id,
            text: options[i],
            correct: options[i] === correctAnswer,
            order: i
          });
        }
        console.log(`✅ Challenge ${challenge.id}: "${question}" - ${options.length} options ajoutées`);
        addedCount++;
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("📊 RÉSUMÉ:");
    console.log("=".repeat(60));
    console.log(`✅ Challenges corrigés: ${addedCount}`);

  } catch (error) {
    console.error("❌ Erreur:", error);
  }
};

// Exécuter
addMissingAimerOptions();