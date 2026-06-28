import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema });

type ChallengeType = "SELECT" | "ASSIST" | "FILL_BLANK";

const addLessonsToCultureUnit6 = async () => {
  try {
    console.log("🚀 AJOUT DE 3 LEÇONS À L'UNITÉ 6 - MYTHES & LÉGENDES\n");
    console.log("=".repeat(80));

    // 1. Trouver le cours Culture Générale
    const cultureCourse = await db.query.courses.findFirst({
      where: (courses, { eq }) => eq(courses.id, 6)
    });

    if (!cultureCourse) {
      console.log("❌ Cours 'Culture Générale' non trouvé !");
      return;
    }

    console.log(`📚 Cours: ${cultureCourse.title} (ID: ${cultureCourse.id})`);

    // 2. Trouver l'unité 6
    const unit = await db.query.units.findFirst({
      where: (units, { eq }) => eq(units.id, 20)
    });

    if (!unit) {
      console.log("❌ Unité 6 (Mythes & Légendes) non trouvée !");
      return;
    }

    console.log(`📁 Unité: ${unit.title} (ID: ${unit.id})`);

    // 3. Trouver le prochain order pour les leçons
    const existingLessons = await db.query.lessons.findMany({
      where: (lessons, { eq }) => eq(lessons.unitId, unit.id),
      orderBy: (lessons, { asc }) => [asc(lessons.order)]
    });

    const nextOrder = existingLessons.length + 1;
    console.log(`\n📖 Leçons existantes: ${existingLessons.length}`);
    console.log(`   Prochain order: ${nextOrder}`);

    // 4. Afficher les leçons existantes
    console.log("\n📋 Leçons actuelles:");
    for (const lesson of existingLessons) {
      const challenges = await db.query.challenges.findMany({
        where: (challenges, { eq }) => eq(challenges.lessonId, lesson.id)
      });
      console.log(`   ${lesson.order}. ${lesson.title} - ${challenges.length} challenges`);
    }

    // 5. Créer les 3 nouvelles leçons
    console.log("\n📝 Création des 3 nouvelles leçons...");
    console.log("-".repeat(40));

    const newLessons = await db.insert(schema.lessons).values([
      { 
        unitId: unit.id, 
        order: nextOrder, 
        title: "Les Légendes Médiévales" 
      },
      { 
        unitId: unit.id, 
        order: nextOrder + 1, 
        title: "Les Contes et Fables" 
      },
      { 
        unitId: unit.id, 
        order: nextOrder + 2, 
        title: "Les Mythes du Monde" 
      }
    ]).returning();

    console.log(`\n✅ 3 nouvelles leçons créées:`);
    for (const lesson of newLessons) {
      console.log(`   ${lesson.order}. ${lesson.title} (ID: ${lesson.id})`);
    }

    // 6. Créer les challenges pour la nouvelle leçon 1
    console.log("\n📝 Création des challenges pour 'Les Légendes Médiévales'...");

    const challenges1 = await db.insert(schema.challenges).values([
      // SELECT
      { lessonId: newLessons[0].id, type: "SELECT", order: 1, question: "Qui est le roi Arthur ?" },
      { lessonId: newLessons[0].id, type: "SELECT", order: 2, question: "Quelle est la célèbre épée du roi Arthur ?" },
      { lessonId: newLessons[0].id, type: "SELECT", order: 3, question: "Qui était Merlin l'enchanteur ?" },
      { lessonId: newLessons[0].id, type: "SELECT", order: 4, question: "Quel est le nom du château du roi Arthur ?" },
      // ASSIST
      { lessonId: newLessons[0].id, type: "ASSIST", order: 5, question: "Les Chevaliers de la Table ___ sont les compagnons du roi Arthur" },
      { lessonId: newLessons[0].id, type: "ASSIST", order: 6, question: "La légende de ___ raconte l'histoire d'une femme qui se transforme en sirène" },
      // FILL_BLANK
      { lessonId: newLessons[0].id, type: "FILL_BLANK", order: 7, question: "La légende du Graal raconte la recherche du ___" },
      { lessonId: newLessons[0].id, type: "FILL_BLANK", order: 8, question: "Le roi Arthur a régné sur la ___" }
    ]).returning();

    console.log(`   ✅ ${challenges1.length} challenges créés`);

    // 7. Créer les challenges pour la nouvelle leçon 2
    console.log("\n📝 Création des challenges pour 'Les Contes et Fables'...");

    const challenges2 = await db.insert(schema.challenges).values([
      // SELECT
      { lessonId: newLessons[1].id, type: "SELECT", order: 1, question: "Qui a écrit les fables de La Fontaine ?" },
      { lessonId: newLessons[1].id, type: "SELECT", order: 2, question: "Dans quelle fable, la morale est 'Rien ne sert de courir, il faut partir à point' ?" },
      { lessonId: newLessons[1].id, type: "SELECT", order: 3, question: "Quelle est la fable la plus célèbre de La Fontaine ?" },
      { lessonId: newLessons[1].id, type: "SELECT", order: 4, question: "Qui a écrit Le Petit Chaperon Rouge ?" },
      // ASSIST
      { lessonId: newLessons[1].id, type: "ASSIST", order: 5, question: "Le Petit ___ est un conte de Charles Perrault" },
      { lessonId: newLessons[1].id, type: "ASSIST", order: 6, question: "Les frères ___ sont célèbres pour leurs contes" },
      // FILL_BLANK
      { lessonId: newLessons[1].id, type: "FILL_BLANK", order: 7, question: "La Belle au bois dormant a dormi ___ ans" },
      { lessonId: newLessons[1].id, type: "FILL_BLANK", order: 8, question: "Le Petit Chaperon ___ est un célèbre conte" }
    ]).returning();

    console.log(`   ✅ ${challenges2.length} challenges créés`);

    // 8. Créer les challenges pour la nouvelle leçon 3
    console.log("\n📝 Création des challenges pour 'Les Mythes du Monde'...");

    const challenges3 = await db.insert(schema.challenges).values([
      // SELECT
      { lessonId: newLessons[2].id, type: "SELECT", order: 1, question: "Quel est le mythe de la création dans la mythologie nordique ?" },
      { lessonId: newLessons[2].id, type: "SELECT", order: 2, question: "Qui est le dieu du soleil dans la mythologie égyptienne ?" },
      { lessonId: newLessons[2].id, type: "SELECT", order: 3, question: "Quelle est la légende de la fondation de Rome ?" },
      { lessonId: newLessons[2].id, type: "SELECT", order: 4, question: "Qui a construit le labyrinthe en Crète ?" },
      // ASSIST
      { lessonId: newLessons[2].id, type: "ASSIST", order: 5, question: "Le mythe de ___ raconte l'histoire d'un homme qui construit un labyrinthe" },
      { lessonId: newLessons[2].id, type: "ASSIST", order: 6, question: "La légende de ___ raconte l'histoire d'un cheval de bois" },
      // FILL_BLANK
      { lessonId: newLessons[2].id, type: "FILL_BLANK", order: 7, question: "Le dieu égyptien des morts s'appelle ___" },
      { lessonId: newLessons[2].id, type: "FILL_BLANK", order: 8, question: "La mythologie grecque raconte que Zeus est le roi de l'___" }
    ]).returning();

    console.log(`   ✅ ${challenges3.length} challenges créés`);

    // 9. Créer les options pour les challenges
    console.log("\n🔧 Création des options...");

    const allOptions: {
      challengeId: number;
      correct: boolean;
      text: string;
      order?: number | null;
    }[] = [];

    // Options pour la leçon 1
    const options1 = [
      // Challenge 1
      [
        { text: "Un roi légendaire de Bretagne", correct: true },
        { text: "Un roi de France", correct: false },
        { text: "Un roi d'Angleterre", correct: false },
        { text: "Un empereur romain", correct: false },
        { text: "Un chef viking", correct: false },
        { text: "Un roi des Francs", correct: false }
      ],
      // Challenge 2
      [
        { text: "Excalibur", correct: true },
        { text: "Durandal", correct: false },
        { text: "Joyeuse", correct: false },
        { text: "Curtana", correct: false },
        { text: "Gram", correct: false },
        { text: "Caliburn", correct: false }
      ],
      // Challenge 3
      [
        { text: "Un magicien et conseiller", correct: true },
        { text: "Un chevalier", correct: false },
        { text: "Un roi", correct: false },
        { text: "Un dieu", correct: false },
        { text: "Un dragon", correct: false },
        { text: "Un enchanteur", correct: false }
      ],
      // Challenge 4
      [
        { text: "Camelot", correct: true },
        { text: "Avalon", correct: false },
        { text: "Tintagel", correct: false },
        { text: "Londres", correct: false },
        { text: "Winchester", correct: false },
        { text: "York", correct: false }
      ],
      // Challenge 5 (ASSIST)
      [
        { text: "Ronde", correct: true },
        { text: "Carrée", correct: false },
        { text: "Ovale", correct: false },
        { text: "Triangulaire", correct: false },
        { text: "Hexagonale", correct: false },
        { text: "Octogonale", correct: false }
      ],
      // Challenge 6 (ASSIST)
      [
        { text: "Mélusine", correct: true },
        { text: "Viviane", correct: false },
        { text: "Guinevere", correct: false },
        { text: "Morgane", correct: false },
        { text: "Iseult", correct: false },
        { text: "Ariane", correct: false }
      ],
      // Challenge 7 (FILL_BLANK)
      [
        { text: "Saint Graal", correct: true },
        { text: "Calice", correct: false },
        { text: "Coupe", correct: false },
        { text: "Vase", correct: false },
        { text: "Ciboire", correct: false },
        { text: "Patène", correct: false }
      ],
      // Challenge 8 (FILL_BLANK)
      [
        { text: "Bretagne", correct: true },
        { text: "Angleterre", correct: false },
        { text: "France", correct: false },
        { text: "Écosse", correct: false },
        { text: "Irlande", correct: false },
        { text: "Galles", correct: false }
      ]
    ];

    // Options pour la leçon 2
    const options2 = [
      // Challenge 1
      [
        { text: "Jean de La Fontaine", correct: true },
        { text: "Charles Perrault", correct: false },
        { text: "Victor Hugo", correct: false },
        { text: "Molière", correct: false },
        { text: "Racine", correct: false },
        { text: "Corneille", correct: false }
      ],
      // Challenge 2
      [
        { text: "Le Lièvre et la Tortue", correct: true },
        { text: "Le Corbeau et le Renard", correct: false },
        { text: "La Cigale et la Fourmi", correct: false },
        { text: "Le Loup et l'Agneau", correct: false },
        { text: "Le Lion et le Rat", correct: false },
        { text: "Le Renard et la Cigogne", correct: false }
      ],
      // Challenge 3
      [
        { text: "Le Corbeau et le Renard", correct: true },
        { text: "Le Lièvre et la Tortue", correct: false },
        { text: "La Cigale et la Fourmi", correct: false },
        { text: "Le Loup et l'Agneau", correct: false },
        { text: "Le Lion et le Rat", correct: false },
        { text: "Le Renard et la Cigogne", correct: false }
      ],
      // Challenge 4
      [
        { text: "Charles Perrault", correct: true },
        { text: "Jean de La Fontaine", correct: false },
        { text: "Victor Hugo", correct: false },
        { text: "Molière", correct: false },
        { text: "Racine", correct: false },
        { text: "Corneille", correct: false }
      ],
      // Challenge 5 (ASSIST)
      [
        { text: "Chaperon Rouge", correct: true },
        { text: "Prince Charmant", correct: false },
        { text: "Poucet", correct: false },
        { text: "Chat Botté", correct: false },
        { text: "Cendrillon", correct: false },
        { text: "Barbe Bleue", correct: false }
      ],
      // Challenge 6 (ASSIST)
      [
        { text: "Grimm", correct: true },
        { text: "Perrault", correct: false },
        { text: "Andersen", correct: false },
        { text: "La Fontaine", correct: false },
        { text: "Poe", correct: false },
        { text: "Carroll", correct: false }
      ],
      // Challenge 7 (FILL_BLANK)
      [
        { text: "100", correct: true },
        { text: "50", correct: false },
        { text: "200", correct: false },
        { text: "75", correct: false },
        { text: "150", correct: false },
        { text: "25", correct: false }
      ],
      // Challenge 8 (FILL_BLANK)
      [
        { text: "Rouge", correct: true },
        { text: "Bleu", correct: false },
        { text: "Vert", correct: false },
        { text: "Jaune", correct: false },
        { text: "Noir", correct: false },
        { text: "Blanc", correct: false }
      ]
    ];

    // Options pour la leçon 3
    const options3 = [
      // Challenge 1
      [
        { text: "Yggdrasil", correct: true },
        { text: "Midgard", correct: false },
        { text: "Asgard", correct: false },
        { text: "Valhalla", correct: false },
        { text: "Jötunheimr", correct: false },
        { text: "Niflheim", correct: false }
      ],
      // Challenge 2
      [
        { text: "Râ", correct: true },
        { text: "Osiris", correct: false },
        { text: "Horus", correct: false },
        { text: "Anubis", correct: false },
        { text: "Seth", correct: false },
        { text: "Thot", correct: false }
      ],
      // Challenge 3
      [
        { text: "Romulus et Rémus", correct: true },
        { text: "Énée", correct: false },
        { text: "Jules César", correct: false },
        { text: "Auguste", correct: false },
        { text: "Brutus", correct: false },
        { text: "Cicéron", correct: false }
      ],
      // Challenge 4
      [
        { text: "Dédale", correct: true },
        { text: "Icare", correct: false },
        { text: "Minos", correct: false },
        { text: "Thésée", correct: false },
        { text: "Persée", correct: false },
        { text: "Hercule", correct: false }
      ],
      // Challenge 5 (ASSIST)
      [
        { text: "Dédale", correct: true },
        { text: "Icare", correct: false },
        { text: "Minos", correct: false },
        { text: "Thésée", correct: false },
        { text: "Persée", correct: false },
        { text: "Hercule", correct: false }
      ],
      // Challenge 6 (ASSIST)
      [
        { text: "Troie", correct: true },
        { text: "Sparte", correct: false },
        { text: "Athènes", correct: false },
        { text: "Rome", correct: false },
        { text: "Carthage", correct: false },
        { text: "Thèbes", correct: false }
      ],
      // Challenge 7 (FILL_BLANK)
      [
        { text: "Osiris", correct: true },
        { text: "Anubis", correct: false },
        { text: "Horus", correct: false },
        { text: "Seth", correct: false },
        { text: "Râ", correct: false },
        { text: "Thot", correct: false }
      ],
      // Challenge 8 (FILL_BLANK)
      [
        { text: "Olympe", correct: true },
        { text: "Zénith", correct: false },
        { text: "Panthéon", correct: false },
        { text: "Acropole", correct: false },
        { text: "Delphes", correct: false },
        { text: "Atlas", correct: false }
      ]
    ];

    // Ajouter les options pour la leçon 1
    for (let i = 0; i < challenges1.length; i++) {
      const challenge = challenges1[i];
      const options = options1[i] || [];
      for (const opt of options) {
        allOptions.push({
          challengeId: challenge.id,
          correct: opt.correct,
          text: opt.text
        });
      }
    }

    // Ajouter les options pour la leçon 2
    for (let i = 0; i < challenges2.length; i++) {
      const challenge = challenges2[i];
      const options = options2[i] || [];
      for (const opt of options) {
        allOptions.push({
          challengeId: challenge.id,
          correct: opt.correct,
          text: opt.text
        });
      }
    }

    // Ajouter les options pour la leçon 3
    for (let i = 0; i < challenges3.length; i++) {
      const challenge = challenges3[i];
      const options = options3[i] || [];
      for (const opt of options) {
        allOptions.push({
          challengeId: challenge.id,
          correct: opt.correct,
          text: opt.text
        });
      }
    }

    // Insérer les options
    if (allOptions.length > 0) {
      await db.insert(schema.challengeOptions).values(allOptions);
      console.log(`✅ ${allOptions.length} options créées`);
    }

    // 10. Résumé final
    console.log("\n" + "=".repeat(80));
    console.log("📊 RÉSUMÉ FINAL - UNITÉ 6:");
    console.log("=".repeat(80));

    const finalLessons = await db.query.lessons.findMany({
      where: (lessons, { eq }) => eq(lessons.unitId, unit.id),
      orderBy: (lessons, { asc }) => [asc(lessons.order)]
    });

    console.log(`\n📖 Unité: ${unit.title}`);
    console.log(`📖 Leçons: ${finalLessons.length}`);
    console.log("-".repeat(40));

    let totalChallenges = 0;
    for (const lesson of finalLessons) {
      const challenges = await db.query.challenges.findMany({
        where: (challenges, { eq }) => eq(challenges.lessonId, lesson.id)
      });
      totalChallenges += challenges.length;
      console.log(`   ${lesson.order}. ${lesson.title} - ${challenges.length} challenges`);
    }

    console.log(`\n📊 STATISTIQUES:`);
    console.log(`   📚 Total leçons: ${finalLessons.length}`);
    console.log(`   🎯 Total challenges: ${totalChallenges}`);
    console.log(`   🔢 Total options: ${allOptions.length}`);

    console.log("\n✅ 3 nouvelles leçons ajoutées à l'unité 6 avec succès !");

  } catch (error) {
    console.error("❌ Erreur:", error);
  }
};

// Exécuter
addLessonsToCultureUnit6();