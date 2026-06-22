import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema });

const fixMathProgressiveOptions = async () => {
  try {
    console.log("🔧 CORRECTION DES OPTIONS - MATH NIVEAUX PROGRESSIFS\n");
    console.log("=".repeat(80));

    // 1. Trouver le cours
    const course = await db.query.courses.findFirst({
      where: (courses, { eq }) => eq(courses.title, "Math - Niveaux Progressifs")
    });

    if (!course) {
      console.log("❌ Cours non trouvé !");
      return;
    }

    console.log(`📚 Cours: ${course.title}\n`);

    // 2. Récupérer toutes les unités
    const units = await db.query.units.findMany({
      where: (units, { eq }) => eq(units.courseId, course.id)
    });

    // 3. Définir les bonnes réponses et les vraies mauvaises réponses
    const answerData: { [key: string]: { correct: string | string[]; wrong: string[]; blanks?: number[] } } = {};

    // === UNITÉ 1: NIVEAU FACILE ===
    
    // Leçon 1: Nombres de 0 à 20
    answerData["Le nombre après 7 est ___"] = { 
      correct: "8", 
      wrong: ["5", "6", "7", "9", "10"] 
    };
    answerData["Le nombre avant 10 est ___"] = { 
      correct: "9", 
      wrong: ["7", "8", "10", "11", "12"] 
    };
    answerData["Le nombre entre 5 et 7 est ___"] = { 
      correct: "6", 
      wrong: ["4", "5", "7", "8", "9"] 
    };
    answerData["Double de 3 est ___"] = { 
      correct: "6", 
      wrong: ["4", "5", "7", "8", "9"] 
    };
    
    // Leçon 2: Addition facile
    answerData["2 + 3 = ___"] = { 
      correct: "5", 
      wrong: ["4", "6", "7", "8", "9"] 
    };
    answerData["4 + 1 = ___"] = { 
      correct: "5", 
      wrong: ["4", "6", "7", "8", "9"] 
    };
    answerData["5 + 2 = ___"] = { 
      correct: "7", 
      wrong: ["5", "6", "8", "9", "10"] 
    };
    answerData["3 + 3 = ___"] = { 
      correct: "6", 
      wrong: ["4", "5", "7", "8", "9"] 
    };
    
    // Leçon 3: Soustraction facile
    answerData["5 - 2 = ___"] = { 
      correct: "3", 
      wrong: ["2", "4", "5", "6", "7"] 
    };
    answerData["8 - 3 = ___"] = { 
      correct: "5", 
      wrong: ["3", "4", "6", "7", "8"] 
    };
    answerData["10 - 4 = ___"] = { 
      correct: "6", 
      wrong: ["4", "5", "7", "8", "9"] 
    };
    answerData["7 - 2 = ___"] = { 
      correct: "5", 
      wrong: ["3", "4", "6", "7", "8"] 
    };
    
    // Leçon 4: Doubles
    answerData["Le double de 2 est ___"] = { 
      correct: "4", 
      wrong: ["2", "3", "5", "6", "8"] 
    };
    answerData["Le double de 5 est ___"] = { 
      correct: "10", 
      wrong: ["5", "8", "9", "11", "12"] 
    };
    answerData["Le double de 4 est ___"] = { 
      correct: "8", 
      wrong: ["4", "6", "7", "9", "10"] 
    };
    answerData["2 × 3 = ___"] = { 
      correct: "6", 
      wrong: ["4", "5", "7", "8", "9"] 
    };
    
    // Leçon 5: Moitiés
    answerData["La moitié de 6 est ___"] = { 
      correct: "3", 
      wrong: ["2", "4", "5", "6", "7"] 
    };
    answerData["La moitié de 10 est ___"] = { 
      correct: "5", 
      wrong: ["3", "4", "6", "7", "8"] 
    };
    answerData["La moitié de 8 est ___"] = { 
      correct: "4", 
      wrong: ["2", "3", "5", "6", "7"] 
    };
    answerData["10 ÷ 2 = ___"] = { 
      correct: "5", 
      wrong: ["3", "4", "6", "7", "8"] 
    };
    
    // Leçon 6: Problèmes faciles
    answerData["J'ai 2 bonbons, j'en achète 3. J'ai ___ bonbons"] = { 
      correct: "5", 
      wrong: ["3", "4", "6", "7", "8"] 
    };
    answerData["Il y a 5 oiseaux, 2 s'envolent. Il reste ___ oiseaux"] = { 
      correct: "3", 
      wrong: ["2", "4", "5", "6", "7"] 
    };
    answerData["3 × 4 = ___"] = { 
      correct: "12", 
      wrong: ["8", "10", "11", "13", "14"] 
    };
    answerData["12 ÷ 3 = ___"] = { 
      correct: "4", 
      wrong: ["2", "3", "5", "6", "7"] 
    };

    // === UNITÉ 2: NIVEAU INTERMÉDIAIRE ===
    
    // Leçon 1: Fractions
    answerData["La moitié de 12 est ___"] = { 
      correct: "6", 
      wrong: ["4", "5", "7", "8", "10"] 
    };
    answerData["1/2 de 10 = ___"] = { 
      correct: "5", 
      wrong: ["3", "4", "6", "7", "8"] 
    };
    answerData["1/4 de 20 = ___"] = { 
      correct: "5", 
      wrong: ["3", "4", "6", "7", "8"] 
    };
    answerData["3/4 de 8 = ___"] = { 
      correct: "6", 
      wrong: ["4", "5", "7", "8", "10"] 
    };
    
    // Leçon 2: Pourcentages
    answerData["50% de 100 = ___"] = { 
      correct: "50", 
      wrong: ["40", "45", "55", "60", "70"] 
    };
    answerData["25% de 80 = ___"] = { 
      correct: "20", 
      wrong: ["15", "18", "22", "25", "30"] 
    };
    answerData["10% de 200 = ___"] = { 
      correct: "20", 
      wrong: ["15", "18", "22", "25", "30"] 
    };
    answerData["20% de 50 = ___"] = { 
      correct: "10", 
      wrong: ["5", "8", "12", "15", "20"] 
    };
    
    // Leçon 3: Équations
    answerData["Si x + 3 = 7, alors x = ___"] = { 
      correct: "4", 
      wrong: ["2", "3", "5", "6", "7"] 
    };
    answerData["Si 2x = 10, alors x = ___"] = { 
      correct: "5", 
      wrong: ["2", "3", "4", "6", "7"] 
    };
    answerData["Si x - 5 = 8, alors x = ___"] = { 
      correct: "13", 
      wrong: ["8", "10", "12", "14", "15"] 
    };
    answerData["Si 3x = 15, alors x = ___"] = { 
      correct: "5", 
      wrong: ["3", "4", "6", "7", "8"] 
    };
    
    // Leçon 4: Périmètre
    answerData["Périmètre d'un carré de côté 4 cm = ___ cm"] = { 
      correct: "16", 
      wrong: ["12", "14", "15", "18", "20"] 
    };
    answerData["Périmètre d'un rectangle de 5 cm sur 3 cm = ___ cm"] = { 
      correct: "16", 
      wrong: ["12", "14", "15", "18", "20"] 
    };
    answerData["Périmètre d'un triangle de côtés 3, 4 et 5 cm = ___ cm"] = { 
      correct: "12", 
      wrong: ["10", "11", "13", "14", "15"] 
    };
    
    // Leçon 5: Aire
    answerData["Aire d'un carré de côté 5 cm = ___ cm²"] = { 
      correct: "25", 
      wrong: ["20", "22", "24", "26", "30"] 
    };
    answerData["Aire d'un rectangle de 6 cm sur 4 cm = ___ cm²"] = { 
      correct: "24", 
      wrong: ["20", "22", "25", "26", "28"] 
    };
    answerData["Aire d'un carré de côté 3 cm = ___ cm²"] = { 
      correct: "9", 
      wrong: ["6", "8", "10", "12", "15"] 
    };
    
    // Leçon 6: Problèmes intermédiaires
    answerData["Un livre coûte 15€. Avec 50€, j'achète 2 livres. Il me reste ___ €"] = { 
      correct: "20", 
      wrong: ["15", "18", "22", "25", "30"] 
    };
    answerData["Un champ mesure 10m sur 8m. Son aire est ___ m²"] = { 
      correct: "80", 
      wrong: ["60", "70", "75", "85", "90"] 
    };
    answerData["Si 3 kg coûtent 12€, 1 kg coûte ___ €"] = { 
      correct: "4", 
      wrong: ["3", "5", "6", "7", "8"] 
    };
    answerData["Un train parcourt 240 km en 3h. Sa vitesse est ___ km/h"] = { 
      correct: "80", 
      wrong: ["60", "70", "75", "85", "90"] 
    };

    // === UNITÉ 3: NIVEAU DIFFICILE ===
    
    // Leçon 1: Équations 2nd degré
    answerData["x² = 36, donc x = ___ ou x = ___"] = { 
      correct: ["6", "-6"], 
      wrong: ["5", "-5", "7", "-7", "8", "-8", "9", "-9"],
      blanks: [0, 1]
    };
    answerData["x² - 16 = 0, donc x = ___ ou x = ___"] = { 
      correct: ["4", "-4"], 
      wrong: ["3", "-3", "5", "-5", "6", "-6", "8", "-8"],
      blanks: [0, 1]
    };
    answerData["x² + 4x + 4 = 0, donc x = ___"] = { 
      correct: "-2", 
      wrong: ["-4", "-3", "-1", "0", "2"] 
    };
    answerData["x² - 5x + 6 = 0, donc x = ___ ou x = ___"] = { 
      correct: ["2", "3"], 
      wrong: ["1", "4", "5", "6", "7", "8", "-2", "-3"],
      blanks: [0, 1]
    };
    
    // Leçon 2: Trigonométrie
    answerData["sin(30°) = ___"] = { 
      correct: "1/2", 
      wrong: ["1/3", "1/4", "√2/2", "√3/2", "1"] 
    };
    answerData["cos(60°) = ___"] = { 
      correct: "1/2", 
      wrong: ["1/3", "1/4", "√2/2", "√3/2", "1"] 
    };
    answerData["tan(45°) = ___"] = { 
      correct: "1", 
      wrong: ["0", "√2", "√3", "1/2", "2"] 
    };
    answerData["sin(90°) = ___"] = { 
      correct: "1", 
      wrong: ["0", "1/2", "√2/2", "√3/2", "2"] 
    };
    
    // Leçon 3: Statistiques
    answerData["Moyenne de 5, 7, 9, 11, 13 est ___"] = { 
      correct: "9", 
      wrong: ["7", "8", "10", "11", "12"] 
    };
    answerData["Médiane de 2, 4, 6, 8, 10 est ___"] = { 
      correct: "6", 
      wrong: ["4", "5", "7", "8", "9"] 
    };
    answerData["Écart-type de 2, 4, 6 est ___"] = { 
      correct: "2", 
      wrong: ["1", "1.5", "2.5", "3", "4"] 
    };
    
    // Leçon 4: Probabilités
    answerData["Probabilité d'obtenir 6 avec un dé est ___"] = { 
      correct: "1/6", 
      wrong: ["1/2", "1/3", "1/4", "1/5", "1/7"] 
    };
    answerData["Probabilité de tirer un as dans un jeu de 52 cartes est ___"] = { 
      correct: "1/13", 
      wrong: ["1/2", "1/4", "1/10", "1/12", "1/14"] 
    };
    answerData["Probabilité de 2 faces en lançant 2 pièces est ___"] = { 
      correct: "1/4", 
      wrong: ["1/2", "1/3", "1/5", "1/6", "1/8"] 
    };
    
    // Leçon 5: Fonctions
    answerData["f(x) = 2x + 3, f(4) = ___"] = { 
      correct: "11", 
      wrong: ["8", "9", "10", "12", "13"] 
    };
    answerData["f(x) = x², f(5) = ___"] = { 
      correct: "25", 
      wrong: ["20", "22", "24", "26", "30"] 
    };
    answerData["f(x) = 3x - 2, f(3) = ___"] = { 
      correct: "7", 
      wrong: ["4", "5", "6", "8", "9"] 
    };
    
    // Leçon 6: Problèmes difficiles
    answerData["Si x² - 7x + 12 = 0, x = ___ ou x = ___"] = { 
      correct: ["3", "4"], 
      wrong: ["1", "5", "6", "7", "8", "9", "-3", "-4"],
      blanks: [0, 1]
    };
    answerData["Moyenne de 10 notes dont la somme est 140 est ___"] = { 
      correct: "14", 
      wrong: ["12", "13", "15", "16", "17"] 
    };
    answerData["Probabilité de tirer une carte rouge dans un jeu de 52 est ___"] = { 
      correct: "1/2", 
      wrong: ["1/3", "1/4", "1/5", "2/3", "3/4"] 
    };
    answerData["f(x) = 2x² - 3x + 1, f(2) = ___"] = { 
      correct: "3", 
      wrong: ["1", "2", "4", "5", "6"] 
    };

    // 4. Parcourir tous les challenges
    let fixedCount = 0;
    let errorCount = 0;

    for (const unit of units) {
      const lessons = await db.query.lessons.findMany({
        where: (lessons, { eq }) => eq(lessons.unitId, unit.id)
      });

      for (const lesson of lessons) {
        const challenges = await db.query.challenges.findMany({
          where: (challenges, { eq }) => eq(challenges.lessonId, lesson.id)
        });

        for (const challenge of challenges) {
          const data = answerData[challenge.question];
          
          if (data) {
            // Supprimer les anciennes options
            await db.delete(schema.challengeOptions).where(eq(schema.challengeOptions.challengeId, challenge.id));

            // Si c'est un tableau (plusieurs blanks)
            if (Array.isArray(data.correct)) {
              // Ajouter les bonnes réponses
              const blanks = data.blanks || [0, 1];
              for (let i = 0; i < data.correct.length; i++) {
                await db.insert(schema.challengeOptions).values({
                  challengeId: challenge.id,
                  text: data.correct[i],
                  correct: true,
                  blank: blanks[i] || i
                });
              }

              // Ajouter les mauvaises réponses
              const wrongs = data.wrong.slice(0, 10);
              let blankIndex = 0;
              for (const wrong of wrongs) {
                await db.insert(schema.challengeOptions).values({
                  challengeId: challenge.id,
                  text: wrong,
                  correct: false,
                  blank: blanks[blankIndex % blanks.length] || blankIndex % 2
                });
                blankIndex++;
              }
            } else {
              // Une seule bonne réponse
              await db.insert(schema.challengeOptions).values({
                challengeId: challenge.id,
                text: data.correct,
                correct: true,
                blank: 0
              });

              // Ajouter 5 mauvaises réponses
              for (const wrong of data.wrong) {
                await db.insert(schema.challengeOptions).values({
                  challengeId: challenge.id,
                  text: wrong,
                  correct: false,
                  blank: null
                });
              }
            }

            console.log(`✅ "${challenge.question.substring(0, 40)}..." → ${Array.isArray(data.correct) ? data.correct.join(", ") : data.correct}`);
            fixedCount++;
          } else {
            console.log(`⚠️ Non reconnu: "${challenge.question}"`);
            errorCount++;
          }
        }
      }
    }

    console.log("\n" + "=".repeat(80));
    console.log("📊 RÉSULTAT:");
    console.log("=".repeat(80));
    console.log(`✅ Challenges corrigés: ${fixedCount}`);
    console.log(`⚠️ Challenges non reconnus: ${errorCount}`);
    console.log(`🎉 Toutes les options sont maintenant des vraies réponses !`);

  } catch (error) {
    console.error("❌ Erreur:", error);
  }
};

// Exécuter
fixMathProgressiveOptions();