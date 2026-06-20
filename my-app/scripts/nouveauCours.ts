import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema });

const cleanMimiUnit1Lesson1 = async () => {
  try {
    console.log("🧹 NETTOYAGE DE LA LEÇON 1 - MIMI UNITÉ 1\n");
    console.log("=".repeat(80));

    // 1. Trouver le cours Mimi
    const mimiCourse = await db.query.courses.findFirst({
      where: (courses, { eq }) => eq(courses.title, "Mimi - Conjugaison Française")
    });

    if (!mimiCourse) {
      console.log("❌ Cours 'Mimi - Conjugaison Française' non trouvé !");
      return;
    }

    // 2. Trouver l'unité 1
    const unit = await db.query.units.findFirst({
      where: (units, { eq }) => eq(units.title, "Les Verbes du 1er Groupe (-ER)")
    });

    if (!unit) {
      console.log("❌ Unité non trouvée !");
      return;
    }

    // 3. Trouver la leçon
    const lesson = await db.query.lessons.findFirst({
      where: (lessons, { eq }) => eq(lessons.title, "Présent - Verbes en -ER")
    });

    if (!lesson) {
      console.log("❌ Leçon non trouvée !");
      return;
    }

    console.log(`📚 Leçon: ${lesson.title} (ID: ${lesson.id})`);
    console.log(`   Challenges actuels: 237\n`);

    // 4. Définir les verbes à garder et leurs conjugaisons
    const verbs = [
      "parler",
      "manger",
      "chanter",
      "danser",
      "jouer",
      "travailler",
      "regarder",
      "écouter"
    ];

    const persons = ["je", "tu", "il", "nous", "vous", "ils"];
    const conjugations: { [key: string]: { [key: string]: string } } = {
      "parler": { "je": "je parle", "tu": "tu parles", "il": "il parle", "nous": "nous parlons", "vous": "vous parlez", "ils": "ils parlent" },
      "manger": { "je": "je mange", "tu": "tu manges", "il": "il mange", "nous": "nous mangeons", "vous": "vous mangez", "ils": "ils mangent" },
      "chanter": { "je": "je chante", "tu": "tu chantes", "il": "il chante", "nous": "nous chantons", "vous": "vous chantez", "ils": "ils chantent" },
      "danser": { "je": "je danse", "tu": "tu danses", "il": "il danse", "nous": "nous dansons", "vous": "vous dansez", "ils": "ils dansent" },
      "jouer": { "je": "je joue", "tu": "tu joues", "il": "il joue", "nous": "nous jouons", "vous": "vous jouez", "ils": "ils jouent" },
      "travailler": { "je": "je travaille", "tu": "tu travailles", "il": "il travaille", "nous": "nous travaillons", "vous": "vous travaillez", "ils": "ils travaillent" },
      "regarder": { "je": "je regarde", "tu": "tu regardes", "il": "il regarde", "nous": "nous regardons", "vous": "vous regardez", "ils": "ils regardent" },
      "écouter": { "je": "j'écoute", "tu": "tu écoutes", "il": "il écoute", "nous": "nous écoutons", "vous": "vous écoutez", "ils": "ils écoutent" }
    };

    // 5. Supprimer TOUS les challenges de la leçon
    // D'abord supprimer les options
    const allChallenges = await db.query.challenges.findMany({
      where: (challenges, { eq }) => eq(challenges.lessonId, lesson.id)
    });

    console.log(`🗑️ Suppression des ${allChallenges.length} challenges existants...`);

    for (const challenge of allChallenges) {
      await db.delete(schema.challengeOptions).where(eq(schema.challengeOptions.challengeId, challenge.id));
    }
    await db.delete(schema.challenges).where(eq(schema.challenges.lessonId, lesson.id));

    console.log(`   ✅ Tous les challenges supprimés\n`);

    // 6. Créer 48 nouveaux challenges (8 verbes × 6 personnes)
    console.log(`📝 Création de 48 nouveaux challenges...\n`);

    const newChallenges: { lessonId: number; type: "SELECT"; order: number; question: string }[] = [];
    const newOptions: { challengeId: number; text: string; correct: boolean; order: number }[] = [];

    let order = 1;

    for (const verb of verbs) {
      for (const person of persons) {
        const correctAnswer = conjugations[verb][person];
        const question = `Conjugue '${verb}' au présent (${person})`;
        
        // Générer 5 mauvaises réponses
        const wrongAnswers: string[] = [];
        const allForms = [
          conjugations[verb]["je"],
          conjugations[verb]["tu"],
          conjugations[verb]["il"],
          conjugations[verb]["nous"],
          conjugations[verb]["vous"],
          conjugations[verb]["ils"]
        ];
        
        for (const form of allForms) {
          if (form !== correctAnswer && !wrongAnswers.includes(form)) {
            wrongAnswers.push(form);
          }
        }
        
        // Compléter avec des mauvaises réponses
        while (wrongAnswers.length < 5) {
          const otherVerbs = verbs.filter(v => v !== verb);
          const randomVerb = otherVerbs[Math.floor(Math.random() * otherVerbs.length)];
          const randomForm = conjugations[randomVerb][person];
          if (!wrongAnswers.includes(randomForm) && randomForm !== correctAnswer) {
            wrongAnswers.push(randomForm);
          } else {
            wrongAnswers.push(`${person} faux`);
          }
        }

        // Créer le challenge
        const challengeData = {
          lessonId: lesson.id,
          type: "SELECT" as const,
          order: order++,
          question: question
        };
        newChallenges.push(challengeData);

        // Créer les options (1 bonne + 5 mauvaises)
        const allOptions = [correctAnswer, ...wrongAnswers.slice(0, 5)];
        
        // Mélanger les options
        for (let i = allOptions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
        }

        // Ajouter les options à la liste
        for (let i = 0; i < allOptions.length; i++) {
          newOptions.push({
            challengeId: 0, // sera mis à jour après insertion
            text: allOptions[i],
            correct: allOptions[i] === correctAnswer,
            order: i
          });
        }
      }
    }

    // 7. Insérer les challenges
    const insertedChallenges = await db.insert(schema.challenges).values(newChallenges).returning();

    console.log(`✅ ${insertedChallenges.length} challenges créés\n`);

    // 8. Mettre à jour les challengeId dans les options
    for (let i = 0; i < insertedChallenges.length; i++) {
      const challenge = insertedChallenges[i];
      const optionsForChallenge = newOptions.filter((_, idx) => {
        // Chaque challenge a 6 options
        const challengeIndex = Math.floor(idx / 6);
        return challengeIndex === i;
      });

      for (const opt of optionsForChallenge) {
        await db.insert(schema.challengeOptions).values({
          challengeId: challenge.id,
          text: opt.text,
          correct: opt.correct,
          order: opt.order
        });
      }
    }

    console.log(`✅ ${newOptions.length} options créées\n`);

    // 9. Résumé final
    console.log("=".repeat(80));
    console.log("📊 RÉSUMÉ DU NETTOYAGE:");
    console.log("=".repeat(80));
    console.log(`   📖 Leçon: ${lesson.title}`);
    console.log(`   🔄 Avant: 237 challenges`);
    console.log(`   🔄 Après: ${insertedChallenges.length} challenges`);
    console.log(`   ✅ Réduction: ${237 - insertedChallenges.length} challenges supprimés`);
    console.log(`   📝 Verbes gardés: ${verbs.join(", ")}`);
    console.log(`   👤 Personnes: ${persons.join(", ")}`);
    console.log(`   🔢 Total options: ${newOptions.length} (6 par challenge)`);
    console.log(`   🎯 Qualité: Tous les challenges ont 6 options cohérentes`);

    console.log("\n✅ Nettoyage terminé avec succès !");

  } catch (error) {
    console.error("❌ Erreur:", error);
  }
};

// Exécuter
cleanMimiUnit1Lesson1();