import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    // Clean existing data
    await db.delete(schema.userProgress);
    await db.delete(schema.challengeProgress);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challenges);
    await db.delete(schema.lessons);
    await db.delete(schema.units);
    await db.delete(schema.courses);
    await db.delete(schema.userSubscription);

    // ────────────────────────────────────────────────
    // COURS
    // ────────────────────────────────────────────────
    await db.insert(schema.courses).values([
      { id: 1, title: "Mathematics", imageSrc: "/math.svg" },
      { id: 2, title: "Spanish", imageSrc: "/es.svg" },
      { id: 3, title: "Italian", imageSrc: "/it.svg" },
      { id: 4, title: "French", imageSrc: "/fr.svg" },
      { id: 5, title: "Croatian", imageSrc: "/hr.svg" },
      { id: 6, title: "Culture Générale", imageSrc: "/culture.svg" },
    ]);

    // ================================================
    // 1. MATHÉMATIQUES (Course ID: 1)
    // ================================================

    await db.insert(schema.units).values([
      { id: 1, courseId: 1, title: "Équations", description: "Équations du 1er et 2ème degré", order: 1 },
      { id: 2, courseId: 1, title: "Fractions & Proportions", description: "Maîtrise les fractions et les proportions", order: 2 },
      { id: 3, courseId: 1, title: "Géométrie", description: "Aires, périmètres et théorèmes", order: 3 },
      { id: 4, courseId: 1, title: "Statistiques", description: "Moyenne, médiane et probabilités", order: 4 },
      // ── NOUVELLES UNITÉS DIFFICILES ──
      { id: 11, courseId: 1, title: "Dérivées & Intégrales", description: "Calcul différentiel et intégral", order: 5 },
      { id: 12, courseId: 1, title: "Trigonométrie Avancée", description: "Identités et équations trigonométriques", order: 6 },
      { id: 13, courseId: 1, title: "Nombres Complexes", description: "Algèbre et géométrie des complexes", order: 7 },
      { id: 14, courseId: 1, title: "Algèbre Linéaire", description: "Matrices et systèmes linéaires avancés", order: 8 },
    ]);

    await db.insert(schema.lessons).values([
      // Unités existantes
      { id: 1, unitId: 1, order: 1, title: "Équations du 1er degré" },
      { id: 2, unitId: 1, order: 2, title: "Équations du 2ème degré" },
      { id: 3, unitId: 1, order: 3, title: "Systèmes d'équations" },
      { id: 4, unitId: 2, order: 1, title: "Simplification de fractions" },
      { id: 5, unitId: 2, order: 2, title: "Opérations sur les fractions" },
      { id: 6, unitId: 2, order: 3, title: "Proportions & règle de trois" },
      { id: 7, unitId: 3, order: 1, title: "Aires et périmètres" },
      { id: 8, unitId: 3, order: 2, title: "Théorème de Pythagore" },
      { id: 9, unitId: 3, order: 3, title: "Théorème de Thalès" },
      { id: 10, unitId: 4, order: 1, title: "Moyenne et médiane" },
      { id: 11, unitId: 4, order: 2, title: "Probabilités de base" },
      // ── NOUVELLES LEÇONS DIFFICILES ──
      // Unité 11 - Dérivées & Intégrales
      { id: 25, unitId: 11, order: 1, title: "Dérivées de fonctions simples" },
      { id: 26, unitId: 11, order: 2, title: "Règle de la chaîne" },
      { id: 27, unitId: 11, order: 3, title: "Intégrales définies" },
      { id: 28, unitId: 11, order: 4, title: "Primitives et intégrales indéfinies" },
      // Unité 12 - Trigonométrie
      { id: 29, unitId: 12, order: 1, title: "Identités trigonométriques" },
      { id: 30, unitId: 12, order: 2, title: "Équations trigonométriques" },
      { id: 31, unitId: 12, order: 3, title: "Formules d'addition" },
      // Unité 13 - Complexes
      { id: 32, unitId: 13, order: 1, title: "Forme algébrique" },
      { id: 33, unitId: 13, order: 2, title: "Module et argument" },
      { id: 34, unitId: 13, order: 3, title: "Forme trigonométrique" },
      // Unité 14 - Algèbre Linéaire
      { id: 35, unitId: 14, order: 1, title: "Opérations sur les matrices" },
      { id: 36, unitId: 14, order: 2, title: "Déterminant et inverse" },
      { id: 37, unitId: 14, order: 3, title: "Systèmes linéaires (méthode de Gauss)" },
    ]);

    await db.insert(schema.challenges).values([
      // ── Leçons existantes ──
      { id: 1, lessonId: 1, type: "ASSIST", order: 1, question: "Résous : 3x + 7 = 2x + 15" },
      { id: 2, lessonId: 1, type: "ASSIST", order: 2, question: "Résous : 5(x - 2) = 3(x + 4)" },
      { id: 3, lessonId: 1, type: "ASSIST", order: 3, question: "Résous : 7x - 9 = 5x + 15" },
      { id: 4, lessonId: 1, type: "ASSIST", order: 4, question: "Résous : 4(2x - 1) = 6x + 10" },
      { id: 5, lessonId: 2, type: "ASSIST", order: 1, question: "Résous : x² - 9 = 0" },
      { id: 6, lessonId: 2, type: "ASSIST", order: 2, question: "Résous : 2x² - 18 = 0" },
      { id: 7, lessonId: 2, type: "ASSIST", order: 3, question: "Résous : (x - 4)(2x + 6) = 0" },
      { id: 8, lessonId: 2, type: "ASSIST", order: 4, question: "Résous : (x + 2)² = 49" },
      { id: 9, lessonId: 2, type: "ASSIST", order: 5, question: "Résous : x² - 5x + 6 = 0" },
      { id: 10, lessonId: 3, type: "ASSIST", order: 1, question: "Résous : x + y = 10 et x - y = 4" },
      { id: 11, lessonId: 3, type: "ASSIST", order: 2, question: "Résous : 2x + y = 7 et x - y = 2" },
      { id: 12, lessonId: 3, type: "ASSIST", order: 3, question: "Résous : 3x + 2y = 12 et x + y = 5" },
      { id: 13, lessonId: 3, type: "ASSIST", order: 4, question: "Résous : x + 2y = 8 et 2x - y = 1" },
      { id: 14, lessonId: 4, type: "SELECT", order: 1, question: "Simplifie : 12/18" },
      { id: 15, lessonId: 4, type: "SELECT", order: 2, question: "Simplifie : 24/36" },
      { id: 16, lessonId: 4, type: "SELECT", order: 3, question: "Simplifie : 15/45" },
      { id: 17, lessonId: 4, type: "SELECT", order: 4, question: "Simplifie : 28/42" },
      { id: 18, lessonId: 5, type: "SELECT", order: 1, question: "Calcule : 1/2 + 1/3" },
      { id: 19, lessonId: 5, type: "SELECT", order: 2, question: "Calcule : 3/4 - 1/6" },
      { id: 20, lessonId: 5, type: "SELECT", order: 3, question: "Calcule : 2/3 × 3/4" },
      { id: 21, lessonId: 5, type: "SELECT", order: 4, question: "Calcule : 5/6 ÷ 5/3" },
      { id: 22, lessonId: 6, type: "SELECT", order: 1, question: "Si 3 stylos coûtent 6€, combien coûtent 7 stylos ?" },
      { id: 23, lessonId: 6, type: "SELECT", order: 2, question: "Une voiture roule 150 km en 2h. Quelle distance en 5h ?" },
      { id: 24, lessonId: 6, type: "SELECT", order: 3, question: "4 ouvriers font un travail en 6 jours. Combien faut-il d'ouvriers pour 3 jours ?" },
      { id: 25, lessonId: 7, type: "SELECT", order: 1, question: "Quelle est l'aire d'un rectangle de 6cm × 4cm ?" },
      { id: 26, lessonId: 7, type: "SELECT", order: 2, question: "Quel est le périmètre d'un carré de côté 5cm ?" },
      { id: 27, lessonId: 7, type: "SELECT", order: 3, question: "Quelle est l'aire d'un triangle de base 8cm et hauteur 5cm ?" },
      { id: 28, lessonId: 7, type: "SELECT", order: 4, question: "Quelle est l'aire d'un cercle de rayon 7cm ? (π ≈ 3.14)" },
      { id: 29, lessonId: 8, type: "SELECT", order: 1, question: "Triangle rectangle : a=3, b=4. Quelle est la valeur de c ?" },
      { id: 30, lessonId: 8, type: "SELECT", order: 2, question: "Triangle rectangle : a=5, b=12. Quelle est la valeur de c ?" },
      { id: 31, lessonId: 8, type: "SELECT", order: 3, question: "Triangle rectangle : c=10, a=6. Quelle est la valeur de b ?" },
      { id: 32, lessonId: 9, type: "SELECT", order: 1, question: "Si AB=6, AC=9 et AD=4, quelle est la longueur AE ?" },
      { id: 33, lessonId: 9, type: "SELECT", order: 2, question: "Si AB=8, DE=4 et AD=3, quelle est la longueur BC ?" },
      { id: 34, lessonId: 10, type: "SELECT", order: 1, question: "Quelle est la moyenne de : 4, 8, 6, 10, 2 ?" },
      { id: 35, lessonId: 10, type: "SELECT", order: 2, question: "Quelle est la médiane de : 3, 7, 1, 9, 5 ?" },
      { id: 36, lessonId: 10, type: "SELECT", order: 3, question: "Quelle est la moyenne de : 12, 15, 18, 9, 6 ?" },
      { id: 37, lessonId: 11, type: "SELECT", order: 1, question: "On lance un dé. Quelle est la probabilité d'obtenir 6 ?" },
      { id: 38, lessonId: 11, type: "SELECT", order: 2, question: "On tire une carte dans un jeu de 52. Probabilité d'un as ?" },
      { id: 39, lessonId: 11, type: "SELECT", order: 3, question: "On lance une pièce 2 fois. Probabilité d'obtenir 2 faces ?" },

      // ── NOUVEAUX CHALLENGES DIFFICILES ──

      // Leçon 25 - Dérivées simples
      { id: 60, lessonId: 25, type: "SELECT", order: 1, question: "Quelle est la dérivée de f(x) = x³ + 2x² - 5x + 3 ?" },
      { id: 61, lessonId: 25, type: "SELECT", order: 2, question: "Quelle est la dérivée de f(x) = sin(x) + cos(x) ?" },
      { id: 62, lessonId: 25, type: "SELECT", order: 3, question: "Quelle est la dérivée de f(x) = eˣ · x² ?" },
      { id: 63, lessonId: 25, type: "SELECT", order: 4, question: "Quelle est la dérivée de f(x) = ln(x) / x ?" },

      // Leçon 26 - Règle de la chaîne
      { id: 64, lessonId: 26, type: "SELECT", order: 1, question: "Dérive f(x) = (3x² + 1)⁴" },
      { id: 65, lessonId: 26, type: "SELECT", order: 2, question: "Dérive f(x) = sin(2x + 1)" },
      { id: 66, lessonId: 26, type: "SELECT", order: 3, question: "Dérive f(x) = e^(x² - 1)" },
      { id: 67, lessonId: 26, type: "SELECT", order: 4, question: "Dérive f(x) = ln(cos(x))" },

      // Leçon 27 - Intégrales définies
      { id: 68, lessonId: 27, type: "SELECT", order: 1, question: "Calcule ∫₀² x² dx" },
      { id: 69, lessonId: 27, type: "SELECT", order: 2, question: "Calcule ∫₁³ (2x + 1) dx" },
      { id: 70, lessonId: 27, type: "SELECT", order: 3, question: "Calcule ∫₀^π sin(x) dx" },
      { id: 71, lessonId: 27, type: "SELECT", order: 4, question: "Calcule ∫₁^e (1/x) dx" },

      // Leçon 28 - Primitives
      { id: 72, lessonId: 28, type: "SELECT", order: 1, question: "Quelle est une primitive de f(x) = 3x² + 2x ?" },
      { id: 73, lessonId: 28, type: "SELECT", order: 2, question: "Quelle est une primitive de f(x) = cos(x) ?" },
      { id: 74, lessonId: 28, type: "SELECT", order: 3, question: "Quelle est une primitive de f(x) = 1/(x+1) ?" },

      // Leçon 29 - Identités trigonométriques
      { id: 75, lessonId: 29, type: "SELECT", order: 1, question: "Simplifie : sin²(x) + cos²(x)" },
      { id: 76, lessonId: 29, type: "SELECT", order: 2, question: "Quelle est la valeur de cos(2x) en termes de sin(x) ?" },
      { id: 77, lessonId: 29, type: "SELECT", order: 3, question: "Simplifie : (1 - cos²(x)) / sin(x)" },
      { id: 78, lessonId: 29, type: "SELECT", order: 4, question: "Quelle est la valeur de tan²(x) + 1 ?" },

      // Leçon 30 - Équations trigonométriques
      { id: 79, lessonId: 30, type: "SELECT", order: 1, question: "Résous : sin(x) = 1/2 sur [0, 2π]" },
      { id: 80, lessonId: 30, type: "SELECT", order: 2, question: "Résous : cos(x) = -1 sur [0, 2π]" },
      { id: 81, lessonId: 30, type: "SELECT", order: 3, question: "Résous : tan(x) = 1 sur [0, π]" },

      // Leçon 31 - Formules d'addition
      { id: 82, lessonId: 31, type: "SELECT", order: 1, question: "Développe : sin(a + b)" },
      { id: 83, lessonId: 31, type: "SELECT", order: 2, question: "Développe : cos(a - b)" },
      { id: 84, lessonId: 31, type: "SELECT", order: 3, question: "Calcule sin(75°) en utilisant sin(45° + 30°)" },

      // Leçon 32 - Forme algébrique complexes
      { id: 85, lessonId: 32, type: "SELECT", order: 1, question: "Calcule (2 + 3i) + (1 - 5i)" },
      { id: 86, lessonId: 32, type: "SELECT", order: 2, question: "Calcule (1 + 2i)(3 - i)" },
      { id: 87, lessonId: 32, type: "SELECT", order: 3, question: "Calcule (2 + i) / (1 - i)" },
      { id: 88, lessonId: 32, type: "SELECT", order: 4, question: "Quel est le conjugué de z = 4 - 7i ?" },

      // Leçon 33 - Module et argument
      { id: 89, lessonId: 33, type: "SELECT", order: 1, question: "Quel est le module de z = 3 + 4i ?" },
      { id: 90, lessonId: 33, type: "SELECT", order: 2, question: "Quel est le module de z = -5 + 12i ?" },
      { id: 91, lessonId: 33, type: "SELECT", order: 3, question: "Quel est l'argument de z = 1 + i ?" },

      // Leçon 34 - Forme trigonométrique
      { id: 92, lessonId: 34, type: "SELECT", order: 1, question: "Écris z = 1 + i sous forme trigonométrique" },
      { id: 93, lessonId: 34, type: "SELECT", order: 2, question: "Calcule z³ pour z = √2 · e^(iπ/4)" },

      // Leçon 35 - Matrices
      { id: 94, lessonId: 35, type: "SELECT", order: 1, question: "A = [[1,2],[3,4]], B = [[5,6],[7,8]]. Calcule A + B." },
      { id: 95, lessonId: 35, type: "SELECT", order: 2, question: "A = [[1,2],[3,4]], B = [[2,0],[1,3]]. Calcule A × B." },
      { id: 96, lessonId: 35, type: "SELECT", order: 3, question: "Calcule 2 × [[1,3],[2,5]]" },

      // Leçon 36 - Déterminant et inverse
      { id: 97, lessonId: 36, type: "SELECT", order: 1, question: "Calcule det([[2,3],[1,4]])" },
      { id: 98, lessonId: 36, type: "SELECT", order: 2, question: "Calcule det([[1,2],[3,4]])" },
      { id: 99, lessonId: 36, type: "SELECT", order: 3, question: "Quelle est l'inverse de A = [[4,7],[2,6]] ?" },

      // Leçon 37 - Méthode de Gauss
      { id: 100, lessonId: 37, type: "SELECT", order: 1, question: "Résous par Gauss : x + y + z = 6, 2x - y + z = 3, x + 2y - z = 2" },
      { id: 101, lessonId: 37, type: "SELECT", order: 2, question: "Résous par Gauss : x + 2y = 5, 3x - y = 1" },
    ]);

    // ────────────────────────────────────────────────
    // CHALLENGE OPTIONS
    // ────────────────────────────────────────────────
    await db.insert(schema.challengeOptions).values([
      // ── Options existantes ──
      { challengeId: 1, correct: false, text: "x = 6", audioSrc: "/6.mp3" },
      { challengeId: 1, correct: true, text: "x = 8", audioSrc: "/8.mp3" },
      { challengeId: 1, correct: false, text: "x = 10", audioSrc: "/10.mp3" },
      { challengeId: 2, correct: false, text: "x = 9", audioSrc: "/9.mp3" },
      { challengeId: 2, correct: false, text: "x = 13", audioSrc: "/13.mp3" },
      { challengeId: 2, correct: true, text: "x = 11", audioSrc: "/11.mp3" },
      { challengeId: 3, correct: true, text: "x = 12", audioSrc: "/12.mp3" },
      { challengeId: 3, correct: false, text: "x = 8", audioSrc: "/8.mp3" },
      { challengeId: 3, correct: false, text: "x = 14", audioSrc: "/14.mp3" },
      { challengeId: 4, correct: false, text: "x = 5", audioSrc: "/5.mp3" },
      { challengeId: 4, correct: true, text: "x = 7", audioSrc: "/7.mp3" },
      { challengeId: 4, correct: false, text: "x = 9", audioSrc: "/9.mp3" },
      { challengeId: 5, correct: false, text: "x = 6 ou x = -6", audioSrc: "/6.mp3" },
      { challengeId: 5, correct: false, text: "x = 9 ou x = -9", audioSrc: "/9.mp3" },
      { challengeId: 5, correct: true, text: "x = 3 ou x = -3", audioSrc: "/3.mp3" },
      { challengeId: 6, correct: true, text: "x = 3 ou x = -3", audioSrc: "/3.mp3" },
      { challengeId: 6, correct: false, text: "x = 9 ou x = -9", audioSrc: "/9.mp3" },
      { challengeId: 7, correct: false, text: "x = -4 ou x = 3", audioSrc: "/4.mp3" },
      { challengeId: 7, correct: true, text: "x = 4 ou x = -3", audioSrc: "/4.mp3" },
      { challengeId: 8, correct: false, text: "x = 7 ou x = -11", audioSrc: "/7.mp3" },
      { challengeId: 8, correct: true, text: "x = 5 ou x = -9", audioSrc: "/5.mp3" },
      { challengeId: 9, correct: true, text: "x = 2 ou x = 3", audioSrc: "/2.mp3" },
      { challengeId: 9, correct: false, text: "x = 1 ou x = 4", audioSrc: "/1.mp3" },
      { challengeId: 10, correct: false, text: "x = 8, y = 2", audioSrc: "/8.mp3" },
      { challengeId: 10, correct: true, text: "x = 7, y = 3", audioSrc: "/7.mp3" },
      { challengeId: 11, correct: false, text: "x = 2, y = 4", audioSrc: "/2.mp3" },
      { challengeId: 11, correct: true, text: "x = 3, y = 1", audioSrc: "/3.mp3" },
      { challengeId: 12, correct: true, text: "x = 2, y = 3", audioSrc: "/2.mp3" },
      { challengeId: 12, correct: false, text: "x = 1, y = 4", audioSrc: "/1.mp3" },
      { challengeId: 13, correct: false, text: "x = 3, y = 2", audioSrc: "/3.mp3" },
      { challengeId: 13, correct: true, text: "x = 2, y = 3", audioSrc: "/2.mp3" },
      { challengeId: 14, correct: false, text: "1/2" },
      { challengeId: 14, correct: true, text: "2/3" },
      { challengeId: 14, correct: false, text: "3/4" },
      { challengeId: 15, correct: false, text: "1/2" },
      { challengeId: 15, correct: false, text: "3/5" },
      { challengeId: 15, correct: true, text: "2/3" },
      { challengeId: 16, correct: false, text: "1/4" },
      { challengeId: 16, correct: true, text: "1/3" },
      { challengeId: 16, correct: false, text: "2/5" },
      { challengeId: 17, correct: false, text: "1/2" },
      { challengeId: 17, correct: false, text: "3/7" },
      { challengeId: 17, correct: true, text: "2/3" },
      { challengeId: 18, correct: false, text: "2/5" },
      { challengeId: 18, correct: true, text: "5/6" },
      { challengeId: 18, correct: false, text: "1/6" },
      { challengeId: 19, correct: false, text: "1/4" },
      { challengeId: 19, correct: false, text: "2/3" },
      { challengeId: 19, correct: true, text: "7/12" },
      { challengeId: 20, correct: false, text: "5/12" },
      { challengeId: 20, correct: true, text: "1/2" },
      { challengeId: 20, correct: false, text: "3/4" },
      { challengeId: 21, correct: false, text: "25/18" },
      { challengeId: 21, correct: false, text: "5/9" },
      { challengeId: 21, correct: true, text: "1/2" },
      { challengeId: 22, correct: false, text: "12€" },
      { challengeId: 22, correct: false, text: "16€" },
      { challengeId: 22, correct: true, text: "14€" },
      { challengeId: 23, correct: false, text: "300 km" },
      { challengeId: 23, correct: true, text: "375 km" },
      { challengeId: 23, correct: false, text: "400 km" },
      { challengeId: 24, correct: false, text: "6 ouvriers" },
      { challengeId: 24, correct: true, text: "8 ouvriers" },
      { challengeId: 24, correct: false, text: "10 ouvriers" },
      { challengeId: 25, correct: false, text: "20 cm²" },
      { challengeId: 25, correct: true, text: "24 cm²" },
      { challengeId: 25, correct: false, text: "28 cm²" },
      { challengeId: 26, correct: false, text: "15 cm" },
      { challengeId: 26, correct: true, text: "20 cm" },
      { challengeId: 26, correct: false, text: "25 cm" },
      { challengeId: 27, correct: false, text: "16 cm²" },
      { challengeId: 27, correct: true, text: "20 cm²" },
      { challengeId: 27, correct: false, text: "24 cm²" },
      { challengeId: 28, correct: false, text: "143.07 cm²" },
      { challengeId: 28, correct: true, text: "153.86 cm²" },
      { challengeId: 28, correct: false, text: "163.28 cm²" },
      { challengeId: 29, correct: false, text: "c = 6" },
      { challengeId: 29, correct: true, text: "c = 5" },
      { challengeId: 29, correct: false, text: "c = 7" },
      { challengeId: 30, correct: false, text: "c = 11" },
      { challengeId: 30, correct: true, text: "c = 13" },
      { challengeId: 30, correct: false, text: "c = 15" },
      { challengeId: 31, correct: false, text: "b = 6" },
      { challengeId: 31, correct: true, text: "b = 8" },
      { challengeId: 31, correct: false, text: "b = 10" },
      { challengeId: 32, correct: false, text: "AE = 5" },
      { challengeId: 32, correct: true, text: "AE = 6" },
      { challengeId: 32, correct: false, text: "AE = 7" },
      { challengeId: 33, correct: true, text: "BC = 6" },
      { challengeId: 33, correct: false, text: "BC = 8" },
      { challengeId: 34, correct: false, text: "5" },
      { challengeId: 34, correct: true, text: "6" },
      { challengeId: 34, correct: false, text: "7" },
      { challengeId: 35, correct: false, text: "3" },
      { challengeId: 35, correct: true, text: "5" },
      { challengeId: 35, correct: false, text: "7" },
      { challengeId: 36, correct: false, text: "10" },
      { challengeId: 36, correct: true, text: "12" },
      { challengeId: 36, correct: false, text: "14" },
      { challengeId: 37, correct: false, text: "1/3" },
      { challengeId: 37, correct: true, text: "1/6" },
      { challengeId: 37, correct: false, text: "1/12" },
      { challengeId: 38, correct: true, text: "1/13" },
      { challengeId: 38, correct: false, text: "4/52" },
      { challengeId: 39, correct: false, text: "1/2" },
      { challengeId: 39, correct: true, text: "1/4" },
      { challengeId: 39, correct: false, text: "1/3" },

      // ── NOUVELLES OPTIONS - MATHS DIFFICILES ──

      // Challenge 60 - Dérivée de x³ + 2x² - 5x + 3
      { challengeId: 60, correct: false, text: "3x² + 4x + 5" },
      { challengeId: 60, correct: true, text: "3x² + 4x - 5" },
      { challengeId: 60, correct: false, text: "x² + 4x - 5" },

      // Challenge 61 - Dérivée de sin(x) + cos(x)
      { challengeId: 61, correct: false, text: "-cos(x) + sin(x)" },
      { challengeId: 61, correct: true, text: "cos(x) - sin(x)" },
      { challengeId: 61, correct: false, text: "cos(x) + sin(x)" },

      // Challenge 62 - Dérivée de eˣ · x²
      { challengeId: 62, correct: false, text: "2x · eˣ" },
      { challengeId: 62, correct: true, text: "eˣ(x² + 2x)" },
      { challengeId: 62, correct: false, text: "eˣ · x²" },

      // Challenge 63 - Dérivée de ln(x)/x
      { challengeId: 63, correct: false, text: "1/x²" },
      { challengeId: 63, correct: true, text: "(1 - ln(x)) / x²" },
      { challengeId: 63, correct: false, text: "(1 + ln(x)) / x²" },

      // Challenge 64 - Règle chaîne (3x²+1)⁴
      { challengeId: 64, correct: false, text: "4(3x²+1)³" },
      { challengeId: 64, correct: true, text: "24x(3x²+1)³" },
      { challengeId: 64, correct: false, text: "12x(3x²+1)³" },

      // Challenge 65 - sin(2x+1)
      { challengeId: 65, correct: false, text: "cos(2x+1)" },
      { challengeId: 65, correct: true, text: "2cos(2x+1)" },
      { challengeId: 65, correct: false, text: "-2sin(2x+1)" },

      // Challenge 66 - e^(x²-1)
      { challengeId: 66, correct: false, text: "e^(x²-1)" },
      { challengeId: 66, correct: true, text: "2x · e^(x²-1)" },
      { challengeId: 66, correct: false, text: "x² · e^(x²-1)" },

      // Challenge 67 - ln(cos(x))
      { challengeId: 67, correct: false, text: "1/cos(x)" },
      { challengeId: 67, correct: true, text: "-tan(x)" },
      { challengeId: 67, correct: false, text: "tan(x)" },

      // Challenge 68 - ∫₀² x² dx
      { challengeId: 68, correct: false, text: "4/3" },
      { challengeId: 68, correct: true, text: "8/3" },
      { challengeId: 68, correct: false, text: "3" },

      // Challenge 69 - ∫₁³ (2x+1) dx
      { challengeId: 69, correct: false, text: "10" },
      { challengeId: 69, correct: true, text: "12" },
      { challengeId: 69, correct: false, text: "14" },

      // Challenge 70 - ∫₀^π sin(x) dx
      { challengeId: 70, correct: false, text: "0" },
      { challengeId: 70, correct: true, text: "2" },
      { challengeId: 70, correct: false, text: "π" },

      // Challenge 71 - ∫₁^e (1/x) dx
      { challengeId: 71, correct: false, text: "0" },
      { challengeId: 71, correct: true, text: "1" },
      { challengeId: 71, correct: false, text: "e" },

      // Challenge 72 - Primitive de 3x²+2x
      { challengeId: 72, correct: false, text: "6x + 2" },
      { challengeId: 72, correct: true, text: "x³ + x²" },
      { challengeId: 72, correct: false, text: "3x³ + 2x²" },

      // Challenge 73 - Primitive de cos(x)
      { challengeId: 73, correct: false, text: "-sin(x)" },
      { challengeId: 73, correct: true, text: "sin(x)" },
      { challengeId: 73, correct: false, text: "cos(x)" },

      // Challenge 74 - Primitive de 1/(x+1)
      { challengeId: 74, correct: false, text: "-1/(x+1)²" },
      { challengeId: 74, correct: true, text: "ln|x+1|" },
      { challengeId: 74, correct: false, text: "1/(x+1)²" },

      // Challenge 75 - sin²(x) + cos²(x)
      { challengeId: 75, correct: false, text: "0" },
      { challengeId: 75, correct: true, text: "1" },
      { challengeId: 75, correct: false, text: "2" },

      // Challenge 76 - cos(2x) en termes de sin(x)
      { challengeId: 76, correct: false, text: "1 + 2sin²(x)" },
      { challengeId: 76, correct: true, text: "1 - 2sin²(x)" },
      { challengeId: 76, correct: false, text: "2sin²(x)" },

      // Challenge 77 - (1-cos²(x))/sin(x)
      { challengeId: 77, correct: false, text: "cos(x)" },
      { challengeId: 77, correct: true, text: "sin(x)" },
      { challengeId: 77, correct: false, text: "tan(x)" },

      // Challenge 78 - tan²(x) + 1
      { challengeId: 78, correct: false, text: "cos²(x)" },
      { challengeId: 78, correct: true, text: "1/cos²(x)" },
      { challengeId: 78, correct: false, text: "sin²(x)" },

      // Challenge 79 - sin(x) = 1/2
      { challengeId: 79, correct: false, text: "x = π/6 uniquement" },
      { challengeId: 79, correct: true, text: "x = π/6 et x = 5π/6" },
      { challengeId: 79, correct: false, text: "x = π/3 et x = 2π/3" },

      // Challenge 80 - cos(x) = -1
      { challengeId: 80, correct: false, text: "x = π/2" },
      { challengeId: 80, correct: true, text: "x = π" },
      { challengeId: 80, correct: false, text: "x = 3π/2" },

      // Challenge 81 - tan(x) = 1 sur [0,π]
      { challengeId: 81, correct: false, text: "x = π/3" },
      { challengeId: 81, correct: true, text: "x = π/4" },
      { challengeId: 81, correct: false, text: "x = π/6" },

      // Challenge 82 - sin(a+b)
      { challengeId: 82, correct: false, text: "sin(a)sin(b) + cos(a)cos(b)" },
      { challengeId: 82, correct: true, text: "sin(a)cos(b) + cos(a)sin(b)" },
      { challengeId: 82, correct: false, text: "sin(a)cos(b) - cos(a)sin(b)" },

      // Challenge 83 - cos(a-b)
      { challengeId: 83, correct: false, text: "cos(a)cos(b) - sin(a)sin(b)" },
      { challengeId: 83, correct: true, text: "cos(a)cos(b) + sin(a)sin(b)" },
      { challengeId: 83, correct: false, text: "sin(a)sin(b) - cos(a)cos(b)" },

      // Challenge 84 - sin(75°)
      { challengeId: 84, correct: false, text: "(√6 - √2) / 4" },
      { challengeId: 84, correct: true, text: "(√6 + √2) / 4" },
      { challengeId: 84, correct: false, text: "(√3 + 1) / 4" },

      // Challenge 85 - (2+3i)+(1-5i)
      { challengeId: 85, correct: false, text: "3 + 8i" },
      { challengeId: 85, correct: true, text: "3 - 2i" },
      { challengeId: 85, correct: false, text: "1 - 2i" },

      // Challenge 86 - (1+2i)(3-i)
      { challengeId: 86, correct: false, text: "3 - 2i" },
      { challengeId: 86, correct: true, text: "5 + 5i" },
      { challengeId: 86, correct: false, text: "3 + 5i" },

      // Challenge 87 - (2+i)/(1-i)
      { challengeId: 87, correct: false, text: "1 + i" },
      { challengeId: 87, correct: true, text: "1/2 + 3i/2" },
      { challengeId: 87, correct: false, text: "2 - i" },

      // Challenge 88 - Conjugué de 4-7i
      { challengeId: 88, correct: false, text: "-4 + 7i" },
      { challengeId: 88, correct: true, text: "4 + 7i" },
      { challengeId: 88, correct: false, text: "-4 - 7i" },

      // Challenge 89 - Module de 3+4i
      { challengeId: 89, correct: false, text: "7" },
      { challengeId: 89, correct: true, text: "5" },
      { challengeId: 89, correct: false, text: "√7" },

      // Challenge 90 - Module de -5+12i
      { challengeId: 90, correct: false, text: "7" },
      { challengeId: 90, correct: true, text: "13" },
      { challengeId: 90, correct: false, text: "17" },

      // Challenge 91 - Argument de 1+i
      { challengeId: 91, correct: false, text: "π/6" },
      { challengeId: 91, correct: true, text: "π/4" },
      { challengeId: 91, correct: false, text: "π/3" },

      // Challenge 92 - Forme trig de 1+i
      { challengeId: 92, correct: false, text: "√2 · e^(iπ/6)" },
      { challengeId: 92, correct: true, text: "√2 · e^(iπ/4)" },
      { challengeId: 92, correct: false, text: "2 · e^(iπ/4)" },

      // Challenge 93 - z³ pour √2 · e^(iπ/4)
      { challengeId: 93, correct: false, text: "2√2 · e^(iπ/4)" },
      { challengeId: 93, correct: true, text: "2√2 · e^(i3π/4)" },
      { challengeId: 93, correct: false, text: "√2 · e^(i3π/4)" },

      // Challenge 94 - A + B matrices
      { challengeId: 94, correct: false, text: "[[5,8],[10,12]]" },
      { challengeId: 94, correct: true, text: "[[6,8],[10,12]]" },
      { challengeId: 94, correct: false, text: "[[6,8],[9,12]]" },

      // Challenge 95 - A × B matrices
      { challengeId: 95, correct: false, text: "[[3,6],[13,12]]" },
      { challengeId: 95, correct: true, text: "[[4,6],[14,12]]" },
      { challengeId: 95, correct: false, text: "[[4,6],[13,12]]" },

      // Challenge 96 - 2 × matrice
      { challengeId: 96, correct: false, text: "[[1,3],[2,5]]" },
      { challengeId: 96, correct: true, text: "[[2,6],[4,10]]" },
      { challengeId: 96, correct: false, text: "[[2,6],[4,5]]" },

      // Challenge 97 - det([[2,3],[1,4]])
      { challengeId: 97, correct: false, text: "11" },
      { challengeId: 97, correct: true, text: "5" },
      { challengeId: 97, correct: false, text: "8" },

      // Challenge 98 - det([[1,2],[3,4]])
      { challengeId: 98, correct: false, text: "2" },
      { challengeId: 98, correct: true, text: "-2" },
      { challengeId: 98, correct: false, text: "10" },

      // Challenge 99 - Inverse de A
      { challengeId: 99, correct: false, text: "[[6,-7],[-2,4]] / 10" },
      { challengeId: 99, correct: true, text: "[[6,-7],[-2,4]] / 10" },
      { challengeId: 99, correct: false, text: "[[4,-3],[-2,6]] / 10" },

      // Challenge 100 - Gauss 3 inconnues
      { challengeId: 100, correct: false, text: "x=1, y=2, z=3" },
      { challengeId: 100, correct: true, text: "x=1, y=2, z=3" },
      { challengeId: 100, correct: false, text: "x=2, y=1, z=3" },

      // Challenge 101 - Gauss 2 inconnues
      { challengeId: 101, correct: false, text: "x=0, y=2" },
      { challengeId: 101, correct: true, text: "x=1, y=2" },
      { challengeId: 101, correct: false, text: "x=2, y=1" },
    ]);

    // ================================================
    // 2. ESPAGNOL (Course ID: 2)
    // ================================================

    await db.insert(schema.units).values([
      { id: 5, courseId: 2, title: "Introducción", description: "Learn the basics of Spanish", order: 1 },
      { id: 6, courseId: 2, title: "Familia y Amigos", description: "Talk about family and friends", order: 2 },
      { id: 7, courseId: 2, title: "Comida y Bebida", description: "Food and drinks vocabulary", order: 3 },
    ]);

    await db.insert(schema.lessons).values([
      { id: 12, unitId: 5, order: 1, title: "Nouns & Articles" },
      { id: 13, unitId: 5, order: 2, title: "Basic Verbs" },
      { id: 14, unitId: 5, order: 3, title: "Greetings" },
      { id: 15, unitId: 6, order: 1, title: "Family Members" },
      { id: 16, unitId: 6, order: 2, title: "Adjectives" },
      { id: 17, unitId: 7, order: 1, title: "Food" },
      { id: 18, unitId: 7, order: 2, title: "Drinks" },
    ]);

    await db.insert(schema.challenges).values([
      { id: 40, lessonId: 12, type: "SELECT", order: 1, question: 'Which one is "the man"?' },
      { id: 41, lessonId: 12, type: "ASSIST", order: 2, question: '"the man"' },
      { id: 42, lessonId: 12, type: "SELECT", order: 3, question: 'Which one is "the woman"?' },
      { id: 43, lessonId: 13, type: "ASSIST", order: 1, question: '"to speak"' },
      { id: 44, lessonId: 13, type: "ASSIST", order: 2, question: '"to eat"' },
      { id: 45, lessonId: 14, type: "SELECT", order: 1, question: 'How do you say "Hello"?' },
      { id: 46, lessonId: 15, type: "SELECT", order: 1, question: 'Which one is "mother"?' },
      { id: 47, lessonId: 16, type: "SELECT", order: 1, question: 'Which one means "big"?' },
      { id: 48, lessonId: 17, type: "SELECT", order: 1, question: 'Which one is "bread"?' },
      { id: 49, lessonId: 18, type: "SELECT", order: 1, question: 'Which one is "water"?' },
    ]);

    await db.insert(schema.challengeOptions).values([
      { challengeId: 40, correct: true, text: "el hombre", imageSrc: "/man.svg" , audioSrc:"/es_man.mp3" },
      { challengeId: 40, correct: false, text: "la mujer", imageSrc: "/woman.svg" , audioSrc:"es_woman.mp3" },
      { challengeId: 40, correct: false, text: "el niño", imageSrc: "/boy.svg" , audioSrc:"es_boy.mp3" },
       { challengeId: 41, correct: true, text: "el hombre", imageSrc: "/man.svg" , audioSrc:"/es_man.mp3" },
      { challengeId: 41, correct: false, text: "la mujer", imageSrc: "/woman.svg" , audioSrc:"es_woman.mp3" },
      { challengeId: 41, correct: false, text: "el niño", imageSrc: "/boy.svg" , audioSrc:"es_boy.mp3" },
      { challengeId: 42, correct: true, text: "la mujer", imageSrc: "/woman.svg" },
      { challengeId: 42, correct: false, text: "el hombre", imageSrc: "/man.svg" },
      { challengeId: 42, correct: false, text: "la niña", imageSrc: "/girl.svg" },
      { challengeId: 43, correct: true, text: "hablar" },
      { challengeId: 43, correct: false, text: "comer" },
      { challengeId: 43, correct: false, text: "beber" },
      { challengeId: 44, correct: true, text: "comer" },
      { challengeId: 44, correct: false, text: "hablar" },
      { challengeId: 44, correct: false, text: "vivir" },
      { challengeId: 45, correct: true, text: "Hola" },
      { challengeId: 45, correct: false, text: "Adiós" },
      { challengeId: 45, correct: false, text: "Gracias" },
      { challengeId: 46, correct: true, text: "la madre", imageSrc: "/mother.svg" },
      { challengeId: 46, correct: false, text: "el padre", imageSrc: "/father.svg" },
      { challengeId: 46, correct: false, text: "el hermano", imageSrc: "/brother.svg" },
      { challengeId: 47, correct: true, text: "grande" },
      { challengeId: 47, correct: false, text: "pequeño" },
      { challengeId: 47, correct: false, text: "rápido" },
      { challengeId: 48, correct: true, text: "el pan", imageSrc: "/bread.svg" },
      { challengeId: 48, correct: false, text: "el queso", imageSrc: "/cheese.svg" },
      { challengeId: 48, correct: false, text: "la carne", imageSrc: "/meat.svg" },
      { challengeId: 49, correct: true, text: "el agua", imageSrc: "/water.svg" },
      { challengeId: 49, correct: false, text: "el vino", imageSrc: "/wine.svg" },
      { challengeId: 49, correct: false, text: "la cerveza", imageSrc: "/beer.svg" },
    ]);

    // ================================================
    // 3. ITALIEN (Course ID: 3) - SANS CHALLENGES
    // ================================================

    await db.insert(schema.units).values([
      { id: 8, courseId: 3, title: "Introduzione", description: "Learn the basics of Italian", order: 1 },
    ]);

    await db.insert(schema.lessons).values([
      { id: 19, unitId: 8, order: 1, title: "Nouns" },
      { id: 20, unitId: 8, order: 2, title: "Greetings" },
    ]);

    // ================================================
    // 4. FRANÇAIS (Course ID: 4) - SANS CHALLENGES
    // ================================================

    await db.insert(schema.units).values([
      { id: 9, courseId: 4, title: "Introduction", description: "Learn the basics of French", order: 1 },
    ]);

    await db.insert(schema.lessons).values([
      { id: 21, unitId: 9, order: 1, title: "Nouns" },
      { id: 22, unitId: 9, order: 2, title: "Greetings" },
    ]);

    // ================================================
    // 5. CROATE (Course ID: 5) - SANS CHALLENGES
    // ================================================

    await db.insert(schema.units).values([
      { id: 10, courseId: 5, title: "Uvod", description: "Learn the basics of Croatian", order: 1 },
    ]);

    await db.insert(schema.lessons).values([
      { id: 23, unitId: 10, order: 1, title: "Nouns" },
      { id: 24, unitId: 10, order: 2, title: "Greetings" },
    ]);

    // ================================================
    // 6. CULTURE GÉNÉRALE (Course ID: 6) - SANS CHALLENGES
    // ================================================

    await db.insert(schema.units).values([
      { id: 15, courseId: 6, title: "Géographie", description: "Découvre les merveilles du monde", order: 1 },
      { id: 16, courseId: 6, title: "Histoire", description: "Les grands événements qui ont façonné notre monde", order: 2 },
      { id: 17, courseId: 6, title: "Arts & Littérature", description: "Les chefs-d'œuvre de l'humanité", order: 3 },
      { id: 18, courseId: 6, title: "Sciences & Découvertes", description: "Les avancées qui ont changé notre vie", order: 4 },
      { id: 19, courseId: 6, title: "Politique & Société", description: "Comprendre le monde d'aujourd'hui", order: 5 },
      { id: 20, courseId: 6, title: "Mythes & Légendes", description: "Les histoires qui ont traversé les âges", order: 6 },
    ]);

    await db.insert(schema.lessons).values([
      // Unité 15 - Géographie
      { id: 38, unitId: 15, order: 1, title: "Capitales du Monde" },
      { id: 39, unitId: 15, order: 2, title: "Les Grands Fleuves" },
      { id: 40, unitId: 15, order: 3, title: "Les Plus Hauts Sommets" },
      { id: 41, unitId: 15, order: 4, title: "Déserts et Mers" },
      
      // Unité 16 - Histoire
      { id: 42, unitId: 16, order: 1, title: "Grandes Civilisations" },
      { id: 43, unitId: 16, order: 2, title: "Personnages Historiques" },
      { id: 44, unitId: 16, order: 3, title: "Dates Clés" },
      { id: 45, unitId: 16, order: 4, title: "Inventions et Découvertes" },
      
      // Unité 17 - Arts & Littérature
      { id: 46, unitId: 17, order: 1, title: "Peintres Célèbres" },
      { id: 47, unitId: 17, order: 2, title: "Écrivains et Œuvres" },
      { id: 48, unitId: 17, order: 3, title: "Musique Classique" },
      { id: 49, unitId: 17, order: 4, title: "Cinéma et Théâtre" },
      
      // Unité 18 - Sciences
      { id: 50, unitId: 18, order: 1, title: "Physique et Chimie" },
      { id: 51, unitId: 18, order: 2, title: "Biologie et Médecine" },
      { id: 52, unitId: 18, order: 3, title: "Astronomie" },
      { id: 53, unitId: 18, order: 4, title: "Grands Scientifiques" },
      
      // Unité 19 - Politique & Société
      { id: 54, unitId: 19, order: 1, title: "Symboles et Institutions" },
      { id: 55, unitId: 19, order: 2, title: "Droits et Libertés" },
      { id: 56, unitId: 19, order: 3, title: "Organisations Internationales" },
      { id: 57, unitId: 19, order: 4, title: "Grands Discours" },
      
      // Unité 20 - Mythes & Légendes
      { id: 58, unitId: 20, order: 1, title: "Mythologie Grecque" },
      { id: 59, unitId: 20, order: 2, title: "Mythologie Nordique" },
      { id: 60, unitId: 20, order: 3, title: "Légendes Médiévales" },
      { id: 61, unitId: 20, order: 4, title: "Folklore et Traditions" },
    ]);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw new Error("Failed to seed the database");
  }
};

main();