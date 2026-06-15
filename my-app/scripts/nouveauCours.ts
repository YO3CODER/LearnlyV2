import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema });

const fixMissingOptions = async () => {
  try {
    console.log("🔧 Correction des options manquantes pour les challenges SELECT...\n");

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

    // 4. Récupérer tous les challenges SELECT de cette leçon qui n'ont pas d'options
    const challenges = await db.query.challenges.findMany({
      where: (challenges, { eq }) => eq(challenges.lessonId, lesson.id)
    });

    console.log(`📚 ${challenges.length} challenges trouvés dans la leçon\n`);

    // 5. Pour chaque challenge, vérifier s'il a des options
    for (const challenge of challenges) {
      const existingOptions = await db.query.challengeOptions.findMany({
        where: (options, { eq }) => eq(options.challengeId, challenge.id)
      });

      if (existingOptions.length === 0) {
        console.log(`⚠️ Challenge ${challenge.id} - "${challenge.question}" n'a pas d'options. Ajout...`);

        // Générer les options basées sur la question
        let options: string[] = [];
        let correctAnswer = "";

        // Extraire le verbe et la personne de la question
        const question = challenge.question;
        
        // Déterminer la bonne réponse et les mauvaises options
        if (question.includes("parler") && question.includes("(je)")) {
          correctAnswer = "je parle";
          options = ["je parle", "je parles", "je parlent", "nous parlons", "vous parlez", "ils parlent"];
        }
        else if (question.includes("parler") && question.includes("(tu)")) {
          correctAnswer = "tu parles";
          options = ["tu parles", "tu parle", "tu parlent", "nous parlons", "vous parlez", "ils parlent"];
        }
        else if (question.includes("parler") && question.includes("(il)")) {
          correctAnswer = "il parle";
          options = ["il parle", "il parles", "il parlent", "nous parlons", "vous parlez", "ils parlent"];
        }
        else if (question.includes("parler") && question.includes("(nous)")) {
          correctAnswer = "nous parlons";
          options = ["nous parlons", "je parle", "tu parles", "il parle", "vous parlez", "ils parlent"];
        }
        else if (question.includes("parler") && question.includes("(vous)")) {
          correctAnswer = "vous parlez";
          options = ["vous parlez", "je parle", "tu parles", "il parle", "nous parlons", "ils parlent"];
        }
        else if (question.includes("parler") && question.includes("(ils)")) {
          correctAnswer = "ils parlent";
          options = ["ils parlent", "je parle", "tu parles", "il parle", "nous parlons", "vous parlez"];
        }
        // MANGER
        else if (question.includes("manger") && question.includes("(je)")) {
          correctAnswer = "je mange";
          options = ["je mange", "je manges", "je mangent", "nous mangeons", "vous mangez", "ils mangent"];
        }
        else if (question.includes("manger") && question.includes("(tu)")) {
          correctAnswer = "tu manges";
          options = ["tu manges", "tu mange", "tu mangent", "nous mangeons", "vous mangez", "ils mangent"];
        }
        else if (question.includes("manger") && question.includes("(il)")) {
          correctAnswer = "il mange";
          options = ["il mange", "il manges", "il mangent", "nous mangeons", "vous mangez", "ils mangent"];
        }
        else if (question.includes("manger") && question.includes("(nous)")) {
          correctAnswer = "nous mangeons";
          options = ["nous mangeons", "je mange", "tu manges", "il mange", "vous mangez", "ils mangent"];
        }
        else if (question.includes("manger") && question.includes("(vous)")) {
          correctAnswer = "vous mangez";
          options = ["vous mangez", "je mange", "tu manges", "il mange", "nous mangeons", "ils mangent"];
        }
        else if (question.includes("manger") && question.includes("(ils)")) {
          correctAnswer = "ils mangent";
          options = ["ils mangent", "je mange", "tu manges", "il mange", "nous mangeons", "vous mangez"];
        }
        // CHANTER
        else if (question.includes("chanter") && question.includes("(je)")) {
          correctAnswer = "je chante";
          options = ["je chante", "je chantes", "je chantent", "nous chantons", "vous chantez", "ils chantent"];
        }
        else if (question.includes("chanter") && question.includes("(tu)")) {
          correctAnswer = "tu chantes";
          options = ["tu chantes", "tu chante", "tu chantent", "nous chantons", "vous chantez", "ils chantent"];
        }
        else if (question.includes("chanter") && question.includes("(il)")) {
          correctAnswer = "il chante";
          options = ["il chante", "il chantes", "il chantent", "nous chantons", "vous chantez", "ils chantent"];
        }
        else if (question.includes("chanter") && question.includes("(nous)")) {
          correctAnswer = "nous chantons";
          options = ["nous chantons", "je chante", "tu chantes", "il chante", "vous chantez", "ils chantent"];
        }
        else if (question.includes("chanter") && question.includes("(vous)")) {
          correctAnswer = "vous chantez";
          options = ["vous chantez", "je chante", "tu chantes", "il chante", "nous chantons", "ils chantent"];
        }
        else if (question.includes("chanter") && question.includes("(ils)")) {
          correctAnswer = "ils chantent";
          options = ["ils chantent", "je chante", "tu chantes", "il chante", "nous chantons", "vous chantez"];
        }
        // DANSER
        else if (question.includes("danser") && question.includes("(je)")) {
          correctAnswer = "je danse";
          options = ["je danse", "je danses", "je dansent", "nous dansons", "vous dansez", "ils dansent"];
        }
        else if (question.includes("danser") && question.includes("(tu)")) {
          correctAnswer = "tu danses";
          options = ["tu danses", "tu danse", "tu dansent", "nous dansons", "vous dansez", "ils dansent"];
        }
        else if (question.includes("danser") && question.includes("(il)")) {
          correctAnswer = "il danse";
          options = ["il danse", "il danses", "il dansent", "nous dansons", "vous dansez", "ils dansent"];
        }
        else if (question.includes("danser") && question.includes("(nous)")) {
          correctAnswer = "nous dansons";
          options = ["nous dansons", "je danse", "tu danses", "il danse", "vous dansez", "ils dansent"];
        }
        else if (question.includes("danser") && question.includes("(vous)")) {
          correctAnswer = "vous dansez";
          options = ["vous dansez", "je danse", "tu danses", "il danse", "nous dansons", "ils dansent"];
        }
        else if (question.includes("danser") && question.includes("(ils)")) {
          correctAnswer = "ils dansent";
          options = ["ils dansent", "je danse", "tu danses", "il danse", "nous dansons", "vous dansez"];
        }
        // Cas par défaut
        else {
          console.log(`   ⚠️ Challenge ${challenge.id}: "${question}" - À traiter manuellement`);
          continue;
        }

        // Insérer les options
        for (const opt of options) {
          await db.insert(schema.challengeOptions).values({
            challengeId: challenge.id,
            text: opt,
            correct: opt === correctAnswer
          });
        }
        console.log(`   ✅ ${options.length} options ajoutées pour le challenge ${challenge.id}`);
      } else {
        console.log(`✅ Challenge ${challenge.id} a déjà ${existingOptions.length} options`);
      }
    }

    console.log("\n✅ Correction terminée !");

  } catch (error) {
    console.error("❌ Erreur:", error);
  }
};

// Exécuter
fixMissingOptions();