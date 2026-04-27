import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, inArray } from "drizzle-orm";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema });

async function upsertCourse(data: typeof schema.courses.$inferInsert) {
  const existing = await db.select().from(schema.courses).where(eq(schema.courses.id, data.id!));
  if (existing.length === 0) {
    await db.insert(schema.courses).values(data);
    console.log(`✅ Cours ajouté : ${data.title}`);
  } else {
    console.log(`⏭️  Cours déjà existant (id=${data.id}) : ${data.title}`);
  }
}

async function upsertUnit(data: typeof schema.units.$inferInsert) {
  const existing = await db.select().from(schema.units).where(eq(schema.units.id, data.id!));
  if (existing.length === 0) {
    await db.insert(schema.units).values(data);
    console.log(`  ✅ Unité ajoutée : ${data.title}`);
  } else {
    console.log(`  ⏭️  Unité déjà existante (id=${data.id}) : ${data.title}`);
  }
}

async function upsertLesson(data: typeof schema.lessons.$inferInsert) {
  const existing = await db.select().from(schema.lessons).where(eq(schema.lessons.id, data.id!));
  if (existing.length === 0) {
    await db.insert(schema.lessons).values(data);
    console.log(`    ✅ Leçon ajoutée : ${data.title}`);
  } else {
    console.log(`    ⏭️  Leçon déjà existante (id=${data.id}) : ${data.title}`);
  }
}

async function upsertChallengeWithOptions(
  challengeData: typeof schema.challenges.$inferInsert,
  options: (typeof schema.challengeOptions.$inferInsert)[]
) {
  await db.insert(schema.challenges).values(challengeData);
  await db.insert(schema.challengeOptions).values(options);
  console.log(`      ✅ Challenge + options ajoutés (id=${challengeData.id})`);
}

const main = async () => {
  try {
    console.log("🚀 Démarrage de la mise à jour…\n");

    // ══════════════════════════════════════════════════════════════════════════
    // 🗑️ SUPPRESSION des anciens challenges et leurs options
    // ══════════════════════════════════════════════════════════════════════════

    const oldChallengeIds = [
      300, 301, 302, 303, 304, 305, 306, 307, 308, 309,
      310, 311, 312, 313, 314, 315, 316, 317, 318, 319,
      320, 321, 322, 323, 324, 325, 326, 327, 328, 329,
      330, 331, 332, 333, 334, 335, 336, 337, 338, 339,
      340, 341, 342, 343, 344, 345, 346, 347, 348, 349,
      350, 351, 352, 353, 354, 355, 356, 357, 358, 359,
      360, 361, 362, 363, 364, 365, 366, 367, 368, 369,
      370, 371, 372, 373, 374, 375, 376, 377, 378, 379,
      380, 381, 382, 383, 384, 385, 386, 387, 388, 389,
      390, 391, 392, 393, 394, 395, 396, 397, 398, 399,
    ];

    console.log("🗑️  Suppression des anciens challenges...");
    await db.delete(schema.challengeOptions).where(inArray(schema.challengeOptions.challengeId, oldChallengeIds));
    await db.delete(schema.challenges).where(inArray(schema.challenges.id, oldChallengeIds));
    console.log("✅ Anciens challenges supprimés\n");

    // ══════════════════════════════════════════════════════════════════════════
    // COURS : Hans (Course ID: 7)
    // ══════════════════════════════════════════════════════════════════════════

    console.log("📚 Cours : Hans");
    await upsertCourse({ id: 7, title: "Hans", imageSrc: "/hans.svg" });

    // ── Unités ──
    await upsertUnit({ id: 30, courseId: 7, title: "Mode d'une série statistique", description: "Identifier la modalité la plus fréquente d'une série", order: 1 });
    await upsertUnit({ id: 31, courseId: 7, title: "Moyenne d'une série statistique", description: "Calculer la moyenne simple et pondérée", order: 2 });
    await upsertUnit({ id: 32, courseId: 7, title: "Diagramme semi-circulaire", description: "Construire et lire un diagramme semi-circulaire", order: 3 });

    // ── Leçons ──
    await upsertLesson({ id: 60, unitId: 30, order: 1, title: "Définition du mode" });
    await upsertLesson({ id: 61, unitId: 30, order: 2, title: "Mode sur tableau d'effectifs" });
    await upsertLesson({ id: 62, unitId: 30, order: 3, title: "Séries à plusieurs modes" });
    await upsertLesson({ id: 63, unitId: 31, order: 1, title: "Moyenne d'une série brute" });
    await upsertLesson({ id: 64, unitId: 31, order: 2, title: "Moyenne avec tableau d'effectifs" });
    await upsertLesson({ id: 65, unitId: 31, order: 3, title: "Application : notes de classe" });
    await upsertLesson({ id: 66, unitId: 32, order: 1, title: "Calcul de la mesure d'angle" });
    await upsertLesson({ id: 67, unitId: 32, order: 2, title: "Construction du diagramme" });
    await upsertLesson({ id: 68, unitId: 32, order: 3, title: "Lire un diagramme : effectifs et fréquences" });

    // ══════════════════════════════════════════════════════════════════════════
    // CHALLENGES — LEÇON 60 : Définition du mode
    // ══════════════════════════════════════════════════════════════════════════

    await upsertChallengeWithOptions(
      { id: 300, lessonId: 60, type: "SELECT", order: 1, question: "Qu'est-ce que le mode d'une série statistique ?" },
      [
        { challengeId: 300, correct: false, text: "La moyenne de toutes les valeurs" },
        { challengeId: 300, correct: true,  text: "La modalité qui a le plus grand effectif" },
        { challengeId: 300, correct: false, text: "La valeur du milieu de la série" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 301, lessonId: 60, type: "SELECT", order: 2, question: "Effectifs : 5→4, 10→27, 15→11, 20→12, 25→20, 30→4. Quel est le mode ?" },
      [
        { challengeId: 301, correct: false, text: "25" },
        { challengeId: 301, correct: false, text: "20" },
        { challengeId: 301, correct: true,  text: "10" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 302, lessonId: 60, type: "ASSIST", order: 3, question: "Le mode est la valeur qui a le plus grand…" },
      [
        { challengeId: 302, correct: true,  text: "Effectif" },
        { challengeId: 302, correct: false, text: "Écart" },
        { challengeId: 302, correct: false, text: "Quotient" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 303, lessonId: 60, type: "SELECT", order: 4, question: "Série : 3, 7, 3, 9, 3, 7, 5. Quel est le mode ?" },
      [
        { challengeId: 303, correct: false, text: "7" },
        { challengeId: 303, correct: true,  text: "3" },
        { challengeId: 303, correct: false, text: "9" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 304, lessonId: 60, type: "SELECT", order: 5, question: "Série : 8, 12, 8, 15, 12, 8, 15. Quel est le mode ?" },
      [
        { challengeId: 304, correct: true,  text: "8" },
        { challengeId: 304, correct: false, text: "12" },
        { challengeId: 304, correct: false, text: "15" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 305, lessonId: 60, type: "ASSIST", order: 6, question: "Le mode peut aussi s'appeler la valeur la plus…" },
      [
        { challengeId: 305, correct: false, text: "Grande" },
        { challengeId: 305, correct: true,  text: "Fréquente" },
        { challengeId: 305, correct: false, text: "Petite" },
      ]
    );

    // ══════════════════════════════════════════════════════════════════════════
    // CHALLENGES — LEÇON 61 : Mode sur tableau d'effectifs
    // ══════════════════════════════════════════════════════════════════════════

    await upsertChallengeWithOptions(
      { id: 306, lessonId: 61, type: "SELECT", order: 1, question: "Football:25, Handball:30, Volley:15, Natation:30. Quel(s) est/sont le(s) mode(s) ?" },
      [
        { challengeId: 306, correct: false, text: "Football" },
        { challengeId: 306, correct: true,  text: "Handball et Natation" },
        { challengeId: 306, correct: false, text: "Volley-ball" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 307, lessonId: 61, type: "SELECT", order: 2, question: "Notes : 3(×2), 5(×1), 6(×4), 7(×1), 7,5(×2), 8(×3), 9(×2). Quel est le mode ?" },
      [
        { challengeId: 307, correct: false, text: "8" },
        { challengeId: 307, correct: true,  text: "6" },
        { challengeId: 307, correct: false, text: "9" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 308, lessonId: 61, type: "SELECT", order: 3, question: "Tableau : A→12, B→8, C→12, D→5. Quel(s) est/sont le(s) mode(s) ?" },
      [
        { challengeId: 308, correct: false, text: "B uniquement" },
        { challengeId: 308, correct: true,  text: "A et C" },
        { challengeId: 308, correct: false, text: "D uniquement" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 309, lessonId: 61, type: "ASSIST", order: 4, question: "Ages : 12→7, 13→8, 14→10, 15→20, 16→12, 17→5, 18→3. Quel est le mode ?" },
      [
        { challengeId: 309, correct: false, text: "14" },
        { challengeId: 309, correct: true,  text: "15" },
        { challengeId: 309, correct: false, text: "16" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 310, lessonId: 61, type: "SELECT", order: 5, question: "Notes de Tayé : 13, 15, 14, 14, 13, 12. Quel est le mode ?" },
      [
        { challengeId: 310, correct: false, text: "13" },
        { challengeId: 310, correct: true,  text: "14" },
        { challengeId: 310, correct: false, text: "15" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 311, lessonId: 61, type: "SELECT", order: 6, question: "Notes de N'golo : 14, 16, 12, 14, 13, 14. Quel est le mode ?" },
      [
        { challengeId: 311, correct: false, text: "12" },
        { challengeId: 311, correct: false, text: "16" },
        { challengeId: 311, correct: true,  text: "14" },
      ]
    );

    // ══════════════════════════════════════════════════════════════════════════
    // CHALLENGES — LEÇON 62 : Séries à plusieurs modes
    // ══════════════════════════════════════════════════════════════════════════

    await upsertChallengeWithOptions(
      { id: 312, lessonId: 62, type: "SELECT", order: 1, question: "Une série statistique peut avoir combien de modes ?" },
      [
        { challengeId: 312, correct: false, text: "Exactement un seul" },
        { challengeId: 312, correct: true,  text: "Un ou plusieurs" },
        { challengeId: 312, correct: false, text: "Toujours deux" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 313, lessonId: 62, type: "SELECT", order: 2, question: "Série : 7, 9, 7, 5, 9, 3. Quels sont les modes ?" },
      [
        { challengeId: 313, correct: false, text: "3 et 5" },
        { challengeId: 313, correct: true,  text: "7 et 9" },
        { challengeId: 313, correct: false, text: "5 et 7" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 314, lessonId: 62, type: "ASSIST", order: 3, question: "Handball:30, Natation:30, Football:25. Cette série a…" },
      [
        { challengeId: 314, correct: false, text: "Un seul mode" },
        { challengeId: 314, correct: true,  text: "Deux modes" },
        { challengeId: 314, correct: false, text: "Aucun mode" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 315, lessonId: 62, type: "SELECT", order: 4, question: "Série : 4, 4, 6, 6, 8, 10. Combien de modes ?" },
      [
        { challengeId: 315, correct: false, text: "Aucun" },
        { challengeId: 315, correct: true,  text: "Deux : 4 et 6" },
        { challengeId: 315, correct: false, text: "Un seul : 8" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 316, lessonId: 62, type: "SELECT", order: 5, question: "Artistes : L→11, M→16, G→8, A→17, B→18. Quel est le mode (artiste préféré) ?" },
      [
        { challengeId: 316, correct: false, text: "Matty Dollar (M)" },
        { challengeId: 316, correct: false, text: "Antoinette Konan (A)" },
        { challengeId: 316, correct: true,  text: "Billy Billy (B)" },
      ]
    );

    // ══════════════════════════════════════════════════════════════════════════
    // CHALLENGES — LEÇON 63 : Moyenne d'une série brute
    // ══════════════════════════════════════════════════════════════════════════

    await upsertChallengeWithOptions(
      { id: 317, lessonId: 63, type: "SELECT", order: 1, question: "Calcule la moyenne de : 12 ; 6 ; 20 ; 12 ; 15" },
      [
        { challengeId: 317, correct: false, text: "12" },
        { challengeId: 317, correct: true,  text: "13" },
        { challengeId: 317, correct: false, text: "15" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 318, lessonId: 63, type: "SELECT", order: 2, question: "Calcule la moyenne de : 12 ; 9 ; 11,5 ; 13 ; 8,5 ; 14 ; 15" },
      [
        { challengeId: 318, correct: false, text: "12,00" },
        { challengeId: 318, correct: true,  text: "11,86" },
        { challengeId: 318, correct: false, text: "13,00" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 319, lessonId: 63, type: "ASSIST", order: 3, question: "Pour calculer la moyenne, on divise la somme des valeurs par…" },
      [
        { challengeId: 319, correct: false, text: "Le mode" },
        { challengeId: 319, correct: true,  text: "L'effectif total" },
        { challengeId: 319, correct: false, text: "La valeur maximale" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 320, lessonId: 63, type: "SELECT", order: 4, question: "Notes de Yapi : 15, 14, 11, 16, 12, 12. Quelle est sa moyenne ?" },
      [
        { challengeId: 320, correct: false, text: "13,5" },
        { challengeId: 320, correct: true,  text: "13,33" },
        { challengeId: 320, correct: false, text: "14" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 321, lessonId: 63, type: "SELECT", order: 5, question: "Notes de Tapé : 16, 12, 10, 14, 12, 14. Quelle est sa moyenne ?" },
      [
        { challengeId: 321, correct: false, text: "14" },
        { challengeId: 321, correct: true,  text: "13" },
        { challengeId: 321, correct: false, text: "12" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 322, lessonId: 63, type: "SELECT", order: 6, question: "Notes de N'golo : 14, 16, 12, 14, 13, 14. Quelle est sa moyenne ?" },
      [
        { challengeId: 322, correct: false, text: "13,5" },
        { challengeId: 322, correct: true,  text: "13,83" },
        { challengeId: 322, correct: false, text: "14" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 323, lessonId: 63, type: "ASSIST", order: 7, question: "Moyenne de : 95 ; 105 ; 100 ; 90 ; 95 ; 105 ; 95 ; 105 ; 100 ; 95 ; 100 ; 100" },
      [
        { challengeId: 323, correct: false, text: "100" },
        { challengeId: 323, correct: true,  text: "98,75" },
        { challengeId: 323, correct: false, text: "97,5" },
      ]
    );

    // ══════════════════════════════════════════════════════════════════════════
    // CHALLENGES — LEÇON 64 : Moyenne avec tableau d'effectifs
    // ══════════════════════════════════════════════════════════════════════════

    await upsertChallengeWithOptions(
      { id: 324, lessonId: 64, type: "SELECT", order: 1, question: "Modalités : 2(×8), 5(×5), 6(×9), 8(×2), 12(×9), 15(×7). Quelle est la moyenne ?" },
      [
        { challengeId: 324, correct: false, text: "7,5" },
        { challengeId: 324, correct: true,  text: "8,1" },
        { challengeId: 324, correct: false, text: "9,2" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 325, lessonId: 64, type: "SELECT", order: 2, question: "Âges : 12(×7), 13(×8), 14(×10), 15(×20), 16(×12), 17(×5), 18(×3). Quelle est la moyenne d'âge ?" },
      [
        { challengeId: 325, correct: false, text: "14,25" },
        { challengeId: 325, correct: true,  text: "14,75" },
        { challengeId: 325, correct: false, text: "15,10" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 326, lessonId: 64, type: "ASSIST", order: 3, question: "Dans la méthode avec tableau, on multiplie chaque modalité par son…" },
      [
        { challengeId: 326, correct: false, text: "Mode" },
        { challengeId: 326, correct: true,  text: "Effectif" },
        { challengeId: 326, correct: false, text: "Fréquence" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 327, lessonId: 64, type: "SELECT", order: 4, question: "Notes : 7(×4), 8(×6), 9(×5), 10(×1), 11(×1), 12(×3), 13(×2), 14(×2), 15(×1). Quelle est la moyenne ?" },
      [
        { challengeId: 327, correct: false, text: "9,50" },
        { challengeId: 327, correct: true,  text: "9,88" },
        { challengeId: 327, correct: false, text: "10,20" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 328, lessonId: 64, type: "SELECT", order: 5, question: "Effectif total d'une série : 2+1+4+1+2+3+2 = ?" },
      [
        { challengeId: 328, correct: false, text: "14" },
        { challengeId: 328, correct: true,  text: "15" },
        { challengeId: 328, correct: false, text: "16" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 329, lessonId: 64, type: "ASSIST", order: 6, question: "Moyenne = somme des (modalité × effectif) divisée par…" },
      [
        { challengeId: 329, correct: false, text: "Le nombre de modalités" },
        { challengeId: 329, correct: true,  text: "L'effectif total" },
        { challengeId: 329, correct: false, text: "Le mode" },
      ]
    );

    // ══════════════════════════════════════════════════════════════════════════
    // CHALLENGES — LEÇON 65 : Application notes de classe
    // ══════════════════════════════════════════════════════════════════════════

    await upsertChallengeWithOptions(
      { id: 330, lessonId: 65, type: "SELECT", order: 1, question: "Notes : 3(×2), 5(×5), 6(×4), 7(×1), 7,5(×2), 8(×3), 9(×2), 10(×1). Moyenne sur 20 élèves ?" },
      [
        { challengeId: 330, correct: false, text: "6,20" },
        { challengeId: 330, correct: true,  text: "6,45" },
        { challengeId: 330, correct: false, text: "7,00" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 331, lessonId: 65, type: "SELECT", order: 2, question: "Notes de Tayé : 13, 15, 14, 14, 13, 12. Quelle est sa moyenne ?" },
      [
        { challengeId: 331, correct: false, text: "13" },
        { challengeId: 331, correct: true,  text: "13,5" },
        { challengeId: 331, correct: false, text: "14" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 332, lessonId: 65, type: "SELECT", order: 3, question: "Kouamé a les mêmes notes que Tayé : 13, 15, 14, 14, 13, 12. Quelle est sa moyenne ?" },
      [
        { challengeId: 332, correct: false, text: "13" },
        { challengeId: 332, correct: true,  text: "13,5" },
        { challengeId: 332, correct: false, text: "14" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 333, lessonId: 65, type: "ASSIST", order: 4, question: "Tapé a une moyenne de 13. N'golo a une moyenne de 13,83. Qui a la meilleure moyenne ?" },
      [
        { challengeId: 333, correct: false, text: "Tapé" },
        { challengeId: 333, correct: true,  text: "N'golo" },
        { challengeId: 333, correct: false, text: "Ils sont égaux" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 334, lessonId: 65, type: "SELECT", order: 5, question: "Les 3 meilleurs stagiaires parmi N'golo(13,83), Tapé(13), Yapi(13,33), Tayé(13,5), Kouamé(13,5). Tapé est-il embauché ?" },
      [
        { challengeId: 334, correct: false, text: "Oui, il est dans le top 3" },
        { challengeId: 334, correct: true,  text: "Non, il a la plus faible moyenne" },
        { challengeId: 334, correct: false, text: "On ne peut pas savoir" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 335, lessonId: 65, type: "SELECT", order: 6, question: "Classement : N'golo(13,83), Tayé(13,5), Kouamé(13,5), Yapi(13,33), Tapé(13). Qui sont les 3 meilleurs ?" },
      [
        { challengeId: 335, correct: false, text: "N'golo, Yapi, Tapé" },
        { challengeId: 335, correct: true,  text: "N'golo, Tayé, Kouamé" },
        { challengeId: 335, correct: false, text: "Tapé, Yapi, Tayé" },
      ]
    );

    // ══════════════════════════════════════════════════════════════════════════
    // CHALLENGES — LEÇON 66 : Calcul de la mesure d'angle
    // ══════════════════════════════════════════════════════════════════════════

    await upsertChallengeWithOptions(
      { id: 336, lessonId: 66, type: "SELECT", order: 1, question: "Formule de la mesure d'angle d'un secteur dans un diagramme semi-circulaire ?" },
      [
        { challengeId: 336, correct: false, text: "360° × effectif ÷ effectif total" },
        { challengeId: 336, correct: true,  text: "180° × effectif ÷ effectif total" },
        { challengeId: 336, correct: false, text: "90° × effectif ÷ effectif total" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 337, lessonId: 66, type: "SELECT", order: 2, question: "Effectif total = 60. Âge 14 ans, effectif 30. Quelle est la mesure du secteur ?" },
      [
        { challengeId: 337, correct: false, text: "60°" },
        { challengeId: 337, correct: true,  text: "90°" },
        { challengeId: 337, correct: false, text: "120°" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 338, lessonId: 66, type: "ASSIST", order: 3, question: "La somme de tous les secteurs d'un diagramme semi-circulaire est de…" },
      [
        { challengeId: 338, correct: false, text: "360°" },
        { challengeId: 338, correct: true,  text: "180°" },
        { challengeId: 338, correct: false, text: "90°" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 339, lessonId: 66, type: "SELECT", order: 4, question: "Effectif total = 60. Âge 12 ans, effectif 10. Quelle est la mesure du secteur ?" },
      [
        { challengeId: 339, correct: true,  text: "30°" },
        { challengeId: 339, correct: false, text: "45°" },
        { challengeId: 339, correct: false, text: "60°" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 340, lessonId: 66, type: "SELECT", order: 5, question: "Effectif total = 60. Âge 15 ans, effectif 20. Quelle est la mesure du secteur ?" },
      [
        { challengeId: 340, correct: false, text: "45°" },
        { challengeId: 340, correct: true,  text: "60°" },
        { challengeId: 340, correct: false, text: "75°" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 341, lessonId: 66, type: "ASSIST", order: 6, question: "Un secteur représente 1/6 de l'effectif total. Quelle est sa mesure en degrés ?" },
      [
        { challengeId: 341, correct: false, text: "20°" },
        { challengeId: 341, correct: true,  text: "30°" },
        { challengeId: 341, correct: false, text: "60°" },
      ]
    );

    // ══════════════════════════════════════════════════════════════════════════
    // CHALLENGES — LEÇON 67 : Construction du diagramme
    // ══════════════════════════════════════════════════════════════════════════

    await upsertChallengeWithOptions(
      { id: 342, lessonId: 67, type: "SELECT", order: 1, question: "Bananes:36, Mangues:19, Oranges:25, Papaye:10 (total 90). Angle pour les Bananes ?" },
      [
        { challengeId: 342, correct: false, text: "60°" },
        { challengeId: 342, correct: true,  text: "72°" },
        { challengeId: 342, correct: false, text: "80°" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 343, lessonId: 67, type: "SELECT", order: 2, question: "Même série (total 90). Angle pour les Oranges (effectif 25) ?" },
      [
        { challengeId: 343, correct: false, text: "45°" },
        { challengeId: 343, correct: true,  text: "50°" },
        { challengeId: 343, correct: false, text: "55°" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 344, lessonId: 67, type: "ASSIST", order: 3, question: "Même série (total 90). Angle pour la Papaye (effectif 10) ?" },
      [
        { challengeId: 344, correct: false, text: "15°" },
        { challengeId: 344, correct: true,  text: "20°" },
        { challengeId: 344, correct: false, text: "25°" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 345, lessonId: 67, type: "SELECT", order: 4, question: "Même série (total 90). Angle pour les Mangues (effectif 19) ?" },
      [
        { challengeId: 345, correct: false, text: "30°" },
        { challengeId: 345, correct: true,  text: "38°" },
        { challengeId: 345, correct: false, text: "42°" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 346, lessonId: 67, type: "SELECT", order: 5, question: "Artistes : L→11, M→16, G→8, A→17, B→18 (total 70). Angle pour Billy Billy (B) ?" },
      [
        { challengeId: 346, correct: false, text: "40°" },
        { challengeId: 346, correct: true,  text: "46°" },
        { challengeId: 346, correct: false, text: "52°" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 347, lessonId: 67, type: "SELECT", order: 6, question: "Artistes (total 70). Angle pour Garagistes (G, effectif 8) ?" },
      [
        { challengeId: 347, correct: false, text: "16°" },
        { challengeId: 347, correct: true,  text: "21°" },
        { challengeId: 347, correct: false, text: "28°" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 348, lessonId: 67, type: "ASSIST", order: 7, question: "Artistes (total 70). Angle pour Antoinette Konan (A, effectif 17) ?" },
      [
        { challengeId: 348, correct: false, text: "38°" },
        { challengeId: 348, correct: true,  text: "44°" },
        { challengeId: 348, correct: false, text: "50°" },
      ]
    );

    // ══════════════════════════════════════════════════════════════════════════
    // CHALLENGES — LEÇON 68 : Lire un diagramme
    // ══════════════════════════════════════════════════════════════════════════

    await upsertChallengeWithOptions(
      { id: 349, lessonId: 68, type: "SELECT", order: 1, question: "Total = 50 articles. Secteur Chaussures = 72°. Quel est l'effectif des chaussures ?" },
      [
        { challengeId: 349, correct: false, text: "15" },
        { challengeId: 349, correct: true,  text: "20" },
        { challengeId: 349, correct: false, text: "25" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 350, lessonId: 68, type: "SELECT", order: 2, question: "Total = 50 articles. Secteur Pantalons = 36°. Quel est l'effectif des pantalons ?" },
      [
        { challengeId: 350, correct: false, text: "8" },
        { challengeId: 350, correct: true,  text: "10" },
        { challengeId: 350, correct: false, text: "12" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 351, lessonId: 68, type: "SELECT", order: 3, question: "Total = 50 articles. Secteur Vestes = 28,8°. Quel est l'effectif des vestes ?" },
      [
        { challengeId: 351, correct: false, text: "6" },
        { challengeId: 351, correct: true,  text: "8" },
        { challengeId: 351, correct: false, text: "10" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 352, lessonId: 68, type: "SELECT", order: 4, question: "Compagnies A:36°, B:54°, C:72°, D:18° (total 1000 abonnés). Quel est l'effectif de C ?" },
      [
        { challengeId: 352, correct: false, text: "300" },
        { challengeId: 352, correct: true,  text: "400" },
        { challengeId: 352, correct: false, text: "500" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 353, lessonId: 68, type: "SELECT", order: 5, question: "Compagnies (total 1000). Secteur A = 36°. Quel est l'effectif de A ?" },
      [
        { challengeId: 353, correct: false, text: "150" },
        { challengeId: 353, correct: true,  text: "200" },
        { challengeId: 353, correct: false, text: "250" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 354, lessonId: 68, type: "ASSIST", order: 6, question: "Secteur = 72° sur 180°. Quelle est la fréquence de cette modalité ?" },
      [
        { challengeId: 354, correct: false, text: "0,30" },
        { challengeId: 354, correct: true,  text: "0,40" },
        { challengeId: 354, correct: false, text: "0,50" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 355, lessonId: 68, type: "SELECT", order: 7, question: "Secteur = 36° sur 180°. Quelle est la fréquence en pourcentage ?" },
      [
        { challengeId: 355, correct: false, text: "15%" },
        { challengeId: 355, correct: true,  text: "20%" },
        { challengeId: 355, correct: false, text: "25%" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 356, lessonId: 68, type: "SELECT", order: 8, question: "Compagnies (total 1000). Quel est le mode (compagnie la plus choisie) si C a 400 abonnés ?" },
      [
        { challengeId: 356, correct: false, text: "Compagnie A" },
        { challengeId: 356, correct: false, text: "Compagnie B" },
        { challengeId: 356, correct: true,  text: "Compagnie C" },
      ]
    );
    await upsertChallengeWithOptions(
      { id: 357, lessonId: 68, type: "ASSIST", order: 9, question: "Pour obtenir l'effectif depuis un diagramme semi-circulaire, on multiplie l'angle par effectif_total divisé par…" },
      [
        { challengeId: 357, correct: false, text: "360" },
        { challengeId: 357, correct: true,  text: "180" },
        { challengeId: 357, correct: false, text: "90" },
      ]
    );

    console.log("\n🎉 Mise à jour terminée avec succès !");
    console.log("📊 Cours Hans — Leçon 10 Statistique 4ème");
    console.log("   - 3 unités : Mode, Moyenne, Diagramme semi-circulaire");
    console.log("   - 9 leçons");
    console.log("   - 58 challenges tirés du cours");
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour :", error);
    throw new Error("Failed to update the database");
  }
};

main();