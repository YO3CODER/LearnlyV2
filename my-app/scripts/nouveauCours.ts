import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("🔄 Réinitialisation de la base...");

    await sql`
      TRUNCATE TABLE 
        user_progress,
        challenge_progress,
        challenge_options,
        challenges,
        lessons,
        units,
        courses,
        user_subscription
      RESTART IDENTITY CASCADE
    `;

    console.log("✅ Base réinitialisée, IDs remis à 0.");

    // ================================================
    // COURSE
    // ================================================
    console.log("📚 Insertion du cours...");
    await db.insert(schema.courses).values([
      { id: 1, title: "Mathématiques - Niveau 1", imageSrc: "/math.svg" },
    ]);

    // ================================================
    // UNITS
    // ================================================
    console.log("📦 Insertion des unités...");
    await db.insert(schema.units).values([
      { id: 1, courseId: 1, title: "Compter jusqu'à 10",  description: "Apprends à compter de 1 à 10",   order: 1 },
      { id: 2, courseId: 1, title: "Compter jusqu'à 100", description: "Dizaines et unités",              order: 2 },
      { id: 3, courseId: 1, title: "Additions simples",   description: "Additionner des petits nombres",  order: 3 },
      { id: 4, courseId: 1, title: "Soustractions",       description: "Soustraire des petits nombres",   order: 4 },
      { id: 5, courseId: 1, title: "Formes & Mesures",    description: "Reconnais les formes et mesure",  order: 5 },
    ]);

    // ================================================
    // LESSONS
    // ================================================
    console.log("📖 Insertion des leçons...");
    await db.insert(schema.lessons).values([
      { id: 1,  unitId: 1, order: 1, title: "Les chiffres 1 à 5" },
      { id: 2,  unitId: 1, order: 2, title: "Les chiffres 6 à 10" },
      { id: 3,  unitId: 1, order: 3, title: "Avant et après" },
      { id: 4,  unitId: 2, order: 1, title: "Les dizaines" },
      { id: 5,  unitId: 2, order: 2, title: "Dizaines + unités" },
      { id: 6,  unitId: 2, order: 3, title: "Comparer les nombres" },
      { id: 7,  unitId: 3, order: 1, title: "Additions jusqu'à 10" },
      { id: 8,  unitId: 3, order: 2, title: "Additions jusqu'à 20" },
      { id: 9,  unitId: 3, order: 3, title: "Additions à trous" },
      { id: 10, unitId: 4, order: 1, title: "Soustractions simples" },
      { id: 11, unitId: 4, order: 2, title: "Soustraire jusqu'à 20" },
      { id: 12, unitId: 4, order: 3, title: "Compléter la soustraction" },
      { id: 13, unitId: 5, order: 1, title: "Les formes géométriques" },
      { id: 14, unitId: 5, order: 2, title: "Plus grand, plus petit" },
      { id: 15, unitId: 5, order: 3, title: "Mesurer en cm" },
    ]);

    // ================================================
    // CHALLENGES
    // ================================================
    console.log("🎯 Insertion des challenges...");
    await db.insert(schema.challenges).values([

      // ── Lesson 1 — Les chiffres 1 à 5 ──
      { id: 1,  lessonId: 1, type: "SELECT",     order: 1, question: "Quel chiffre vient après 2 ?" },
      { id: 2,  lessonId: 1, type: "SELECT",     order: 2, question: "Combien y a-t-il de doigts sur une main ?" },
      { id: 3,  lessonId: 1, type: "ASSIST",     order: 3, question: '"trois"' },
      { id: 4,  lessonId: 1, type: "FILL_BLANK", order: 4, question: "1, 2, ___, 4, 5" },
      { id: 5,  lessonId: 1, type: "FILL_BLANK", order: 5, question: "Le chiffre avant 5 est ___ et le chiffre avant 3 est ___" },

      // ── Lesson 2 — Les chiffres 6 à 10 ──
      { id: 6,  lessonId: 2, type: "SELECT",     order: 1, question: "Quel chiffre vient après 7 ?" },
      { id: 7,  lessonId: 2, type: "SELECT",     order: 2, question: "Quel chiffre vient avant 10 ?" },
      { id: 8,  lessonId: 2, type: "ASSIST",     order: 3, question: '"neuf"' },
      { id: 9,  lessonId: 2, type: "FILL_BLANK", order: 4, question: "6, 7, ___, 9, 10" },
      { id: 10, lessonId: 2, type: "FILL_BLANK", order: 5, question: "Le chiffre après 6 est ___ et le chiffre après 8 est ___" },

      // ── Lesson 3 — Avant et après ──
      { id: 11, lessonId: 3, type: "SELECT",     order: 1, question: "Quel nombre vient juste avant 7 ?" },
      { id: 12, lessonId: 3, type: "SELECT",     order: 2, question: "Quel nombre vient juste après 4 ?" },
      { id: 13, lessonId: 3, type: "FILL_BLANK", order: 3, question: "___, 5, 6" },
      { id: 14, lessonId: 3, type: "FILL_BLANK", order: 4, question: "8, ___, 10" },
      { id: 15, lessonId: 3, type: "WORD_BANK",  order: 5, question: "Range dans l'ordre : 3, 1, 4, 2" },

      // ── Lesson 4 — Les dizaines ──
      { id: 16, lessonId: 4, type: "SELECT",     order: 1, question: "Combien vaut 2 dizaines ?" },
      { id: 17, lessonId: 4, type: "SELECT",     order: 2, question: "Combien vaut 5 dizaines ?" },
      { id: 18, lessonId: 4, type: "ASSIST",     order: 3, question: '"quarante"' },
      { id: 19, lessonId: 4, type: "FILL_BLANK", order: 4, question: "10, 20, ___, 40, 50" },
      { id: 20, lessonId: 4, type: "FILL_BLANK", order: 5, question: "3 dizaines = ___ et 7 dizaines = ___" },

      // ── Lesson 5 — Dizaines + unités ──
      { id: 21, lessonId: 5, type: "SELECT",     order: 1, question: "Combien font 2 dizaines et 3 unités ?" },
      { id: 22, lessonId: 5, type: "SELECT",     order: 2, question: "Quel chiffre est à la dizaine dans 47 ?" },
      { id: 23, lessonId: 5, type: "FILL_BLANK", order: 3, question: "35 = ___ dizaines et ___ unités" },
      { id: 24, lessonId: 5, type: "FILL_BLANK", order: 4, question: "6 dizaines et 8 unités = ___" },

      // ── Lesson 6 — Comparer les nombres ──
      { id: 25, lessonId: 6, type: "SELECT",     order: 1, question: "Quel nombre est le plus grand : 34 ou 43 ?" },
      { id: 26, lessonId: 6, type: "SELECT",     order: 2, question: "Quel nombre est le plus petit : 71 ou 17 ?" },
      { id: 27, lessonId: 6, type: "ASSIST",     order: 3, question: '"25 est plus petit que 52"' },
      { id: 28, lessonId: 6, type: "FILL_BLANK", order: 4, question: "Entre 60 et 90, le plus grand est ___" },

      // ── Lesson 7 — Additions jusqu'à 10 ──
      { id: 29, lessonId: 7, type: "SELECT",     order: 1, question: "Combien font 3 + 4 ?" },
      { id: 30, lessonId: 7, type: "SELECT",     order: 2, question: "Combien font 5 + 5 ?" },
      { id: 31, lessonId: 7, type: "ASSIST",     order: 3, question: '"2 + 6"' },
      { id: 32, lessonId: 7, type: "FILL_BLANK", order: 4, question: "4 + 3 = ___" },
      { id: 33, lessonId: 7, type: "FILL_BLANK", order: 5, question: "1 + ___ = 9" },

      // ── Lesson 8 — Additions jusqu'à 20 ──
      { id: 34, lessonId: 8, type: "SELECT",     order: 1, question: "Combien font 8 + 7 ?" },
      { id: 35, lessonId: 8, type: "SELECT",     order: 2, question: "Combien font 9 + 9 ?" },
      { id: 36, lessonId: 8, type: "FILL_BLANK", order: 3, question: "6 + 8 = ___" },
      { id: 37, lessonId: 8, type: "FILL_BLANK", order: 4, question: "___ + 5 = 13" },
      { id: 38, lessonId: 8, type: "FILL_BLANK", order: 5, question: "7 + ___ = 20 et 9 + ___ = 18" },

      // ── Lesson 9 — Additions à trous ──
      { id: 39, lessonId: 9, type: "SELECT",     order: 1, question: "? + 4 = 10. Quel est le nombre manquant ?" },
      { id: 40, lessonId: 9, type: "FILL_BLANK", order: 2, question: "___ + 3 = 7" },
      { id: 41, lessonId: 9, type: "FILL_BLANK", order: 3, question: "5 + ___ = 11" },
      { id: 42, lessonId: 9, type: "WORD_BANK",  order: 4, question: "Complète : 3 + 4 = ___" },

      // ── Lesson 10 — Soustractions simples ──
      { id: 43, lessonId: 10, type: "SELECT",     order: 1, question: "Combien font 8 - 3 ?" },
      { id: 44, lessonId: 10, type: "SELECT",     order: 2, question: "Combien font 7 - 7 ?" },
      { id: 45, lessonId: 10, type: "ASSIST",     order: 3, question: '"9 - 4"' },
      { id: 46, lessonId: 10, type: "FILL_BLANK", order: 4, question: "6 - 2 = ___" },
      { id: 47, lessonId: 10, type: "FILL_BLANK", order: 5, question: "10 - ___ = 4" },

      // ── Lesson 11 — Soustraire jusqu'à 20 ──
      { id: 48, lessonId: 11, type: "SELECT",     order: 1, question: "Combien font 15 - 6 ?" },
      { id: 49, lessonId: 11, type: "SELECT",     order: 2, question: "Combien font 20 - 13 ?" },
      { id: 50, lessonId: 11, type: "FILL_BLANK", order: 3, question: "18 - 9 = ___" },
      { id: 51, lessonId: 11, type: "FILL_BLANK", order: 4, question: "20 - ___ = 7 et 15 - ___ = 8" },

      // ── Lesson 12 — Compléter la soustraction ──
      { id: 52, lessonId: 12, type: "SELECT",     order: 1, question: "? - 5 = 8. Quel est le nombre manquant ?" },
      { id: 53, lessonId: 12, type: "FILL_BLANK", order: 2, question: "___ - 4 = 6" },
      { id: 54, lessonId: 12, type: "FILL_BLANK", order: 3, question: "12 - ___ = 5" },

      // ── Lesson 13 — Les formes géométriques ──
      { id: 55, lessonId: 13, type: "SELECT",     order: 1, question: "Combien de côtés a un triangle ?" },
      { id: 56, lessonId: 13, type: "SELECT",     order: 2, question: "Quelle forme a 4 côtés égaux ?" },
      { id: 57, lessonId: 13, type: "ASSIST",     order: 3, question: '"cercle"' },
      { id: 58, lessonId: 13, type: "FILL_BLANK", order: 4, question: "Un rectangle a ___ côtés" },
      { id: 59, lessonId: 13, type: "FILL_BLANK", order: 5, question: "Un triangle a ___ côtés et un carré a ___ côtés" },

      // ── Lesson 14 — Plus grand, plus petit ──
      { id: 60, lessonId: 14, type: "SELECT",     order: 1, question: "Quel symbole signifie 'plus grand que' ?" },
      { id: 61, lessonId: 14, type: "SELECT",     order: 2, question: "5 ___ 3 : quel symbole va ici ?" },
      { id: 62, lessonId: 14, type: "FILL_BLANK", order: 3, question: "12 est ___ grand que 8 (plus / moins)" },
      { id: 63, lessonId: 14, type: "FILL_BLANK", order: 4, question: "Le plus grand entre 45 et 54 est ___" },

      // ── Lesson 15 — Mesurer en cm ──
      { id: 64, lessonId: 15, type: "SELECT",     order: 1, question: "Combien de cm dans 1 mètre ?" },
      { id: 65, lessonId: 15, type: "SELECT",     order: 2, question: "Un crayon mesure 15 cm. Une règle mesure 30 cm. Quelle est la différence ?" },
      { id: 66, lessonId: 15, type: "FILL_BLANK", order: 3, question: "1 mètre = ___ cm" },
      { id: 67, lessonId: 15, type: "FILL_BLANK", order: 4, question: "50 cm + 50 cm = ___ cm = ___ mètre" },
    ]);

    // ================================================
    // CHALLENGE OPTIONS (sans id — auto-générés par RESTART IDENTITY)
    // ================================================
    console.log("🎲 Insertion des options...");
    await db.insert(schema.challengeOptions).values([

      // ── Challenge 1 — après 2 ──
      { challengeId: 1, correct: true,  text: "3" },
      { challengeId: 1, correct: false, text: "1" },
      { challengeId: 1, correct: false, text: "4" },

      // ── Challenge 2 — doigts main ──
      { challengeId: 2, correct: true,  text: "5" },
      { challengeId: 2, correct: false, text: "4" },
      { challengeId: 2, correct: false, text: "6" },

      // ── Challenge 3 — ASSIST trois ──
      { challengeId: 3, correct: true,  text: "3", imageSrc: "/3.svg" },
      { challengeId: 3, correct: false, text: "2", imageSrc: "/2.svg" },
      { challengeId: 3, correct: false, text: "4", imageSrc: "/4.svg" },

      // ── Challenge 4 — FILL_BLANK 1,2,___,4,5 ──
      { challengeId: 4, correct: true,  text: "3", blank: 0 },
      { challengeId: 4, correct: false, text: "6", blank: 0 },
      { challengeId: 4, correct: false, text: "1", blank: 0 },

      // ── Challenge 5 — FILL_BLANK double avant 5 / avant 3 ──
      { challengeId: 5, correct: true,  text: "4", blank: 0 },
      { challengeId: 5, correct: true,  text: "2", blank: 1 },
      { challengeId: 5, correct: false, text: "5", blank: 0 },
      { challengeId: 5, correct: false, text: "4", blank: 1 },
      { challengeId: 5, correct: false, text: "3", blank: 0 },

      // ── Challenge 6 — après 7 ──
      { challengeId: 6, correct: true,  text: "8" },
      { challengeId: 6, correct: false, text: "6" },
      { challengeId: 6, correct: false, text: "9" },

      // ── Challenge 7 — avant 10 ──
      { challengeId: 7, correct: true,  text: "9"  },
      { challengeId: 7, correct: false, text: "8"  },
      { challengeId: 7, correct: false, text: "10" },

      // ── Challenge 8 — ASSIST neuf ──
      { challengeId: 8, correct: true,  text: "9", imageSrc: "/9.svg" },
      { challengeId: 8, correct: false, text: "6", imageSrc: "/6.svg" },
      { challengeId: 8, correct: false, text: "8", imageSrc: "/8.svg" },

      // ── Challenge 9 — FILL_BLANK 6,7,___,9,10 ──
      { challengeId: 9, correct: true,  text: "8", blank: 0 },
      { challengeId: 9, correct: false, text: "5", blank: 0 },
      { challengeId: 9, correct: false, text: "6", blank: 0 },

      // ── Challenge 10 — FILL_BLANK double après 6 / après 8 ──
      { challengeId: 10, correct: true,  text: "7", blank: 0 },
      { challengeId: 10, correct: true,  text: "9", blank: 1 },
      { challengeId: 10, correct: false, text: "8", blank: 0 },
      { challengeId: 10, correct: false, text: "7", blank: 1 },
      { challengeId: 10, correct: false, text: "5", blank: 0 },

      // ── Challenge 11 — avant 7 ──
      { challengeId: 11, correct: true,  text: "6" },
      { challengeId: 11, correct: false, text: "5" },
      { challengeId: 11, correct: false, text: "8" },

      // ── Challenge 12 — après 4 ──
      { challengeId: 12, correct: true,  text: "5" },
      { challengeId: 12, correct: false, text: "3" },
      { challengeId: 12, correct: false, text: "6" },

      // ── Challenge 13 — FILL_BLANK ___,5,6 ──
      { challengeId: 13, correct: true,  text: "4", blank: 0 },
      { challengeId: 13, correct: false, text: "3", blank: 0 },
      { challengeId: 13, correct: false, text: "6", blank: 0 },

      // ── Challenge 14 — FILL_BLANK 8,___,10 ──
      { challengeId: 14, correct: true,  text: "9", blank: 0 },
      { challengeId: 14, correct: false, text: "7", blank: 0 },
      { challengeId: 14, correct: false, text: "8", blank: 0 },

      // ── Challenge 15 — WORD_BANK ordre 1,2,3,4 ──
      { challengeId: 15, correct: true,  text: "1", order: 1    },
      { challengeId: 15, correct: true,  text: "2", order: 2    },
      { challengeId: 15, correct: true,  text: "3", order: 3    },
      { challengeId: 15, correct: true,  text: "4", order: 4    },
      { challengeId: 15, correct: false, text: "5", order: null },
      { challengeId: 15, correct: false, text: "0", order: null },

      // ── Challenge 16 — 2 dizaines ──
      { challengeId: 16, correct: true,  text: "20" },
      { challengeId: 16, correct: false, text: "12" },
      { challengeId: 16, correct: false, text: "22" },

      // ── Challenge 17 — 5 dizaines ──
      { challengeId: 17, correct: true,  text: "50" },
      { challengeId: 17, correct: false, text: "15" },
      { challengeId: 17, correct: false, text: "55" },

      // ── Challenge 18 — ASSIST quarante ──
      { challengeId: 18, correct: true,  text: "40" },
      { challengeId: 18, correct: false, text: "14" },
      { challengeId: 18, correct: false, text: "44" },

      // ── Challenge 19 — FILL_BLANK 10,20,___,40,50 ──
      { challengeId: 19, correct: true,  text: "30", blank: 0 },
      { challengeId: 19, correct: false, text: "25", blank: 0 },
      { challengeId: 19, correct: false, text: "35", blank: 0 },

      // ── Challenge 20 — FILL_BLANK double 3d / 7d ──
      { challengeId: 20, correct: true,  text: "30", blank: 0 },
      { challengeId: 20, correct: true,  text: "70", blank: 1 },
      { challengeId: 20, correct: false, text: "13", blank: 0 },
      { challengeId: 20, correct: false, text: "17", blank: 1 },
      { challengeId: 20, correct: false, text: "33", blank: 0 },

      // ── Challenge 21 — 2d+3u ──
      { challengeId: 21, correct: true,  text: "23" },
      { challengeId: 21, correct: false, text: "32" },
      { challengeId: 21, correct: false, text: "25" },

      // ── Challenge 22 — dizaine dans 47 ──
      { challengeId: 22, correct: true,  text: "4"  },
      { challengeId: 22, correct: false, text: "7"  },
      { challengeId: 22, correct: false, text: "47" },

      // ── Challenge 23 — FILL_BLANK double 35=___d+___u ──
      { challengeId: 23, correct: true,  text: "3", blank: 0 },
      { challengeId: 23, correct: true,  text: "5", blank: 1 },
      { challengeId: 23, correct: false, text: "5", blank: 0 },
      { challengeId: 23, correct: false, text: "3", blank: 1 },
      { challengeId: 23, correct: false, text: "2", blank: 0 },

      // ── Challenge 24 — FILL_BLANK 6d+8u ──
      { challengeId: 24, correct: true,  text: "68", blank: 0 },
      { challengeId: 24, correct: false, text: "86", blank: 0 },
      { challengeId: 24, correct: false, text: "60", blank: 0 },

      // ── Challenge 25 — plus grand 34/43 ──
      { challengeId: 25, correct: true,  text: "43"    },
      { challengeId: 25, correct: false, text: "34"    },
      { challengeId: 25, correct: false, text: "Égaux" },

      // ── Challenge 26 — plus petit 71/17 ──
      { challengeId: 26, correct: true,  text: "17"    },
      { challengeId: 26, correct: false, text: "71"    },
      { challengeId: 26, correct: false, text: "Égaux" },

      // ── Challenge 27 — ASSIST 25<52 ──
      { challengeId: 27, correct: true,  text: "25 < 52" },
      { challengeId: 27, correct: false, text: "25 > 52" },
      { challengeId: 27, correct: false, text: "25 = 52" },

      // ── Challenge 28 — FILL_BLANK 60/90 ──
      { challengeId: 28, correct: true,  text: "90", blank: 0 },
      { challengeId: 28, correct: false, text: "60", blank: 0 },
      { challengeId: 28, correct: false, text: "75", blank: 0 },

      // ── Challenge 29 — 3+4 ──
      { challengeId: 29, correct: true,  text: "7" },
      { challengeId: 29, correct: false, text: "6" },
      { challengeId: 29, correct: false, text: "8" },

      // ── Challenge 30 — 5+5 ──
      { challengeId: 30, correct: true,  text: "10" },
      { challengeId: 30, correct: false, text: "9"  },
      { challengeId: 30, correct: false, text: "11" },

      // ── Challenge 31 — ASSIST 2+6 ──
      { challengeId: 31, correct: true,  text: "8" },
      { challengeId: 31, correct: false, text: "7" },
      { challengeId: 31, correct: false, text: "9" },

      // ── Challenge 32 — FILL_BLANK 4+3 ──
      { challengeId: 32, correct: true,  text: "7", blank: 0 },
      { challengeId: 32, correct: false, text: "6", blank: 0 },
      { challengeId: 32, correct: false, text: "8", blank: 0 },

      // ── Challenge 33 — FILL_BLANK 1+___=9 ──
      { challengeId: 33, correct: true,  text: "8", blank: 0 },
      { challengeId: 33, correct: false, text: "7", blank: 0 },
      { challengeId: 33, correct: false, text: "9", blank: 0 },

      // ── Challenge 34 — 8+7 ──
      { challengeId: 34, correct: true,  text: "15" },
      { challengeId: 34, correct: false, text: "14" },
      { challengeId: 34, correct: false, text: "16" },

      // ── Challenge 35 — 9+9 ──
      { challengeId: 35, correct: true,  text: "18" },
      { challengeId: 35, correct: false, text: "17" },
      { challengeId: 35, correct: false, text: "19" },

      // ── Challenge 36 — FILL_BLANK 6+8 ──
      { challengeId: 36, correct: true,  text: "14", blank: 0 },
      { challengeId: 36, correct: false, text: "13", blank: 0 },
      { challengeId: 36, correct: false, text: "15", blank: 0 },

      // ── Challenge 37 — FILL_BLANK ___+5=13 ──
      { challengeId: 37, correct: true,  text: "8", blank: 0 },
      { challengeId: 37, correct: false, text: "7", blank: 0 },
      { challengeId: 37, correct: false, text: "9", blank: 0 },

      // ── Challenge 38 — FILL_BLANK double 7+___=20 / 9+___=18 ──
      { challengeId: 38, correct: true,  text: "13", blank: 0 },
      { challengeId: 38, correct: true,  text: "9",  blank: 1 },
      { challengeId: 38, correct: false, text: "12", blank: 0 },
      { challengeId: 38, correct: false, text: "8",  blank: 1 },
      { challengeId: 38, correct: false, text: "14", blank: 0 },

      // ── Challenge 39 — ?+4=10 ──
      { challengeId: 39, correct: true,  text: "6" },
      { challengeId: 39, correct: false, text: "5" },
      { challengeId: 39, correct: false, text: "7" },

      // ── Challenge 40 — FILL_BLANK ___+3=7 ──
      { challengeId: 40, correct: true,  text: "4", blank: 0 },
      { challengeId: 40, correct: false, text: "3", blank: 0 },
      { challengeId: 40, correct: false, text: "5", blank: 0 },

      // ── Challenge 41 — FILL_BLANK 5+___=11 ──
      { challengeId: 41, correct: true,  text: "6", blank: 0 },
      { challengeId: 41, correct: false, text: "5", blank: 0 },
      { challengeId: 41, correct: false, text: "7", blank: 0 },

      // ── Challenge 42 — WORD_BANK 3+4=7 ──
      { challengeId: 42, correct: true,  text: "7", order: 1    },
      { challengeId: 42, correct: false, text: "6", order: null },
      { challengeId: 42, correct: false, text: "8", order: null },

      // ── Challenge 43 — 8-3 ──
      { challengeId: 43, correct: true,  text: "5" },
      { challengeId: 43, correct: false, text: "4" },
      { challengeId: 43, correct: false, text: "6" },

      // ── Challenge 44 — 7-7 ──
      { challengeId: 44, correct: true,  text: "0" },
      { challengeId: 44, correct: false, text: "1" },
      { challengeId: 44, correct: false, text: "7" },

      // ── Challenge 45 — ASSIST 9-4 ──
      { challengeId: 45, correct: true,  text: "5" },
      { challengeId: 45, correct: false, text: "4" },
      { challengeId: 45, correct: false, text: "6" },

      // ── Challenge 46 — FILL_BLANK 6-2 ──
      { challengeId: 46, correct: true,  text: "4", blank: 0 },
      { challengeId: 46, correct: false, text: "3", blank: 0 },
      { challengeId: 46, correct: false, text: "5", blank: 0 },

      // ── Challenge 47 — FILL_BLANK 10-___=4 ──
      { challengeId: 47, correct: true,  text: "6", blank: 0 },
      { challengeId: 47, correct: false, text: "5", blank: 0 },
      { challengeId: 47, correct: false, text: "7", blank: 0 },

      // ── Challenge 48 — 15-6 ──
      { challengeId: 48, correct: true,  text: "9"  },
      { challengeId: 48, correct: false, text: "8"  },
      { challengeId: 48, correct: false, text: "10" },

      // ── Challenge 49 — 20-13 ──
      { challengeId: 49, correct: true,  text: "7" },
      { challengeId: 49, correct: false, text: "6" },
      { challengeId: 49, correct: false, text: "8" },

      // ── Challenge 50 — FILL_BLANK 18-9 ──
      { challengeId: 50, correct: true,  text: "9",  blank: 0 },
      { challengeId: 50, correct: false, text: "8",  blank: 0 },
      { challengeId: 50, correct: false, text: "10", blank: 0 },

      // ── Challenge 51 — FILL_BLANK double 20-___=7 / 15-___=8 ──
      { challengeId: 51, correct: true,  text: "13", blank: 0 },
      { challengeId: 51, correct: true,  text: "7",  blank: 1 },
      { challengeId: 51, correct: false, text: "12", blank: 0 },
      { challengeId: 51, correct: false, text: "6",  blank: 1 },
      { challengeId: 51, correct: false, text: "14", blank: 0 },

      // ── Challenge 52 — ?-5=8 ──
      { challengeId: 52, correct: true,  text: "13" },
      { challengeId: 52, correct: false, text: "12" },
      { challengeId: 52, correct: false, text: "14" },

      // ── Challenge 53 — FILL_BLANK ___-4=6 ──
      { challengeId: 53, correct: true,  text: "10", blank: 0 },
      { challengeId: 53, correct: false, text: "9",  blank: 0 },
      { challengeId: 53, correct: false, text: "11", blank: 0 },

      // ── Challenge 54 — FILL_BLANK 12-___=5 ──
      { challengeId: 54, correct: true,  text: "7", blank: 0 },
      { challengeId: 54, correct: false, text: "6", blank: 0 },
      { challengeId: 54, correct: false, text: "8", blank: 0 },

      // ── Challenge 55 — côtés triangle ──
      { challengeId: 55, correct: true,  text: "3" },
      { challengeId: 55, correct: false, text: "4" },
      { challengeId: 55, correct: false, text: "2" },

      // ── Challenge 56 — 4 côtés égaux ──
      { challengeId: 56, correct: true,  text: "Carré"     },
      { challengeId: 56, correct: false, text: "Rectangle" },
      { challengeId: 56, correct: false, text: "Triangle"  },

      // ── Challenge 57 — ASSIST cercle ──
      { challengeId: 57, correct: true,  text: "cercle",   imageSrc: "/circle.svg"   },
      { challengeId: 57, correct: false, text: "carré",    imageSrc: "/square.svg"   },
      { challengeId: 57, correct: false, text: "triangle", imageSrc: "/triangle.svg" },

      // ── Challenge 58 — FILL_BLANK rectangle ___ côtés ──
      { challengeId: 58, correct: true,  text: "4", blank: 0 },
      { challengeId: 58, correct: false, text: "3", blank: 0 },
      { challengeId: 58, correct: false, text: "6", blank: 0 },

      // ── Challenge 59 — FILL_BLANK double triangle / carré ──
      { challengeId: 59, correct: true,  text: "3", blank: 0 },
      { challengeId: 59, correct: true,  text: "4", blank: 1 },
      { challengeId: 59, correct: false, text: "4", blank: 0 },
      { challengeId: 59, correct: false, text: "3", blank: 1 },
      { challengeId: 59, correct: false, text: "2", blank: 0 },

      // ── Challenge 60 — symbole > ──
      { challengeId: 60, correct: true,  text: ">" },
      { challengeId: 60, correct: false, text: "<" },
      { challengeId: 60, correct: false, text: "=" },

      // ── Challenge 61 — 5 ___ 3 ──
      { challengeId: 61, correct: true,  text: ">" },
      { challengeId: 61, correct: false, text: "<" },
      { challengeId: 61, correct: false, text: "=" },

      // ── Challenge 62 — FILL_BLANK plus/moins ──
      { challengeId: 62, correct: true,  text: "plus",  blank: 0 },
      { challengeId: 62, correct: false, text: "moins", blank: 0 },
      { challengeId: 62, correct: false, text: "aussi", blank: 0 },

      // ── Challenge 63 — FILL_BLANK 45/54 ──
      { challengeId: 63, correct: true,  text: "54", blank: 0 },
      { challengeId: 63, correct: false, text: "45", blank: 0 },
      { challengeId: 63, correct: false, text: "50", blank: 0 },

      // ── Challenge 64 — cm dans 1m ──
      { challengeId: 64, correct: true,  text: "100"  },
      { challengeId: 64, correct: false, text: "10"   },
      { challengeId: 64, correct: false, text: "1000" },

      // ── Challenge 65 — différence 15/30 ──
      { challengeId: 65, correct: true,  text: "15 cm" },
      { challengeId: 65, correct: false, text: "10 cm" },
      { challengeId: 65, correct: false, text: "20 cm" },

      // ── Challenge 66 — FILL_BLANK 1m=___cm ──
      { challengeId: 66, correct: true,  text: "100",  blank: 0 },
      { challengeId: 66, correct: false, text: "10",   blank: 0 },
      { challengeId: 66, correct: false, text: "1000", blank: 0 },

      // ── Challenge 67 — FILL_BLANK double 50+50=___cm=___m ──
      { challengeId: 67, correct: true,  text: "100", blank: 0 },
      { challengeId: 67, correct: true,  text: "1",   blank: 1 },
      { challengeId: 67, correct: false, text: "50",  blank: 0 },
      { challengeId: 67, correct: false, text: "2",   blank: 1 },
      { challengeId: 67, correct: false, text: "150", blank: 0 },
    ]);

    // ================================================
    // RÉINITIALISER TOUTES LES SÉQUENCES
    // ================================================
    console.log("🔄 Resetting sequences...");
    
    await sql`SELECT setval('courses_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM courses))`;
    await sql`SELECT setval('units_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM units))`;
    await sql`SELECT setval('lessons_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM lessons))`;
    await sql`SELECT setval('challenges_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM challenges))`;
    await sql`SELECT setval('challenge_options_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM challenge_options))`;
    await sql`SELECT setval('challenge_progress_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM challenge_progress))`;
    await sql`SELECT setval('user_subscription_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM user_subscription))`;

    console.log("✅ Seeding finished successfully!");

    console.log("✅ Seed Mathématiques Niveau 1 terminé !");

  } catch (error) {
    console.error("❌ Erreur lors du seeding :", error);
    throw new Error("Failed to seed the database");
  }
};

main();