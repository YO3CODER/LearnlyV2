import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    await db.delete(schema.userProgress);
    await db.delete(schema.challengeProgress);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challenges);
    await db.delete(schema.lessons);
    await db.delete(schema.units);
    await db.delete(schema.courses);
    await db.delete(schema.userSubscription);

    await db.insert(schema.courses).values([
      { id: 1, title: "Mathematics", imageSrc: "/math.svg" },
      { id: 2, title: "Spanish", imageSrc: "/es.svg" },
      { id: 3, title: "Italian", imageSrc: "/it.svg" },
      { id: 4, title: "French", imageSrc: "/fr.svg" },
      { id: 5, title: "Croatian", imageSrc: "/hr.svg" },
      { id: 6, title: "Culture Générale", imageSrc: "/culture.svg" },
    ]);

    // ================================================
    // 1. MATHÉMATIQUES
    // ================================================

    await db.insert(schema.units).values([
      { id: 1, courseId: 1, title: "Équations", description: "Équations du 1er et 2ème degré", order: 1 },
      { id: 2, courseId: 1, title: "Fractions & Proportions", description: "Maîtrise les fractions et les proportions", order: 2 },
      { id: 3, courseId: 1, title: "Géométrie", description: "Aires, périmètres et théorèmes", order: 3 },
      { id: 4, courseId: 1, title: "Statistiques", description: "Moyenne, médiane et probabilités", order: 4 },
      { id: 11, courseId: 1, title: "Dérivées & Intégrales", description: "Calcul différentiel et intégral", order: 5 },
      { id: 12, courseId: 1, title: "Trigonométrie Avancée", description: "Identités et équations trigonométriques", order: 6 },
      { id: 13, courseId: 1, title: "Nombres Complexes", description: "Algèbre et géométrie des complexes", order: 7 },
      { id: 14, courseId: 1, title: "Algèbre Linéaire", description: "Matrices et systèmes linéaires avancés", order: 8 },
      { id: 100, courseId: 1, title: "Logarithmes", description: "Propriétés et équations logarithmiques", order: 9 },
      { id: 101, courseId: 1, title: "Suites et Séries", description: "Suites arithmétiques, géométriques et convergence", order: 10 },
    ]);

    await db.insert(schema.lessons).values([
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
      { id: 25, unitId: 11, order: 1, title: "Dérivées de fonctions simples" },
      { id: 26, unitId: 11, order: 2, title: "Règle de la chaîne" },
      { id: 27, unitId: 11, order: 3, title: "Intégrales définies" },
      { id: 28, unitId: 11, order: 4, title: "Primitives et intégrales indéfinies" },
      { id: 29, unitId: 12, order: 1, title: "Identités trigonométriques" },
      { id: 30, unitId: 12, order: 2, title: "Équations trigonométriques" },
      { id: 31, unitId: 12, order: 3, title: "Formules d'addition" },
      { id: 32, unitId: 13, order: 1, title: "Forme algébrique" },
      { id: 33, unitId: 13, order: 2, title: "Module et argument" },
      { id: 34, unitId: 13, order: 3, title: "Forme trigonométrique" },
      { id: 35, unitId: 14, order: 1, title: "Opérations sur les matrices" },
      { id: 36, unitId: 14, order: 2, title: "Déterminant et inverse" },
      { id: 37, unitId: 14, order: 3, title: "Systèmes linéaires (méthode de Gauss)" },
      { id: 500, unitId: 100, order: 1, title: "Propriétés des logarithmes" },
      { id: 501, unitId: 100, order: 2, title: "Équations logarithmiques" },
      { id: 502, unitId: 101, order: 1, title: "Suites arithmétiques" },
      { id: 503, unitId: 101, order: 2, title: "Suites géométriques" },
    ]);

    await db.insert(schema.challenges).values([
      // Équations
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

      // Fractions
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

      // Géométrie
      { id: 25, lessonId: 7, type: "SELECT", order: 1, question: "Quelle est l'aire d'un rectangle de 6cm × 4cm ?" },
      { id: 26, lessonId: 7, type: "SELECT", order: 2, question: "Quel est le périmètre d'un carré de côté 5cm ?" },
      { id: 27, lessonId: 7, type: "SELECT", order: 3, question: "Quelle est l'aire d'un triangle de base 8cm et hauteur 5cm ?" },
      { id: 28, lessonId: 7, type: "SELECT", order: 4, question: "Quelle est l'aire d'un cercle de rayon 7cm ? (π ≈ 3.14)" },
      { id: 29, lessonId: 8, type: "SELECT", order: 1, question: "Triangle rectangle : a=3, b=4. Quelle est la valeur de c ?" },
      { id: 30, lessonId: 8, type: "SELECT", order: 2, question: "Triangle rectangle : a=5, b=12. Quelle est la valeur de c ?" },
      { id: 31, lessonId: 8, type: "SELECT", order: 3, question: "Triangle rectangle : c=10, a=6. Quelle est la valeur de b ?" },
      { id: 32, lessonId: 9, type: "SELECT", order: 1, question: "Si AB=6, AC=9 et AD=4, quelle est la longueur AE ?" },
      { id: 33, lessonId: 9, type: "SELECT", order: 2, question: "Si AB=8, DE=4 et AD=3, quelle est la longueur BC ?" },

      // Statistiques
      { id: 34, lessonId: 10, type: "SELECT", order: 1, question: "Quelle est la moyenne de : 4, 8, 6, 10, 2 ?" },
      { id: 35, lessonId: 10, type: "SELECT", order: 2, question: "Quelle est la médiane de : 3, 7, 1, 9, 5 ?" },
      { id: 36, lessonId: 10, type: "SELECT", order: 3, question: "Quelle est la moyenne de : 12, 15, 18, 9, 6 ?" },
      { id: 37, lessonId: 11, type: "SELECT", order: 1, question: "On lance un dé. Quelle est la probabilité d'obtenir 6 ?" },
      { id: 38, lessonId: 11, type: "SELECT", order: 2, question: "On tire une carte dans un jeu de 52. Probabilité d'un as ?" },
      { id: 39, lessonId: 11, type: "SELECT", order: 3, question: "On lance une pièce 2 fois. Probabilité d'obtenir 2 faces ?" },

      // Dérivées
      { id: 60, lessonId: 25, type: "SELECT", order: 1, question: "Quelle est la dérivée de f(x) = x³ + 2x² - 5x + 3 ?" },
      { id: 61, lessonId: 25, type: "SELECT", order: 2, question: "Quelle est la dérivée de f(x) = sin(x) + cos(x) ?" },
      { id: 62, lessonId: 25, type: "SELECT", order: 3, question: "Quelle est la dérivée de f(x) = eˣ · x² ?" },
      { id: 63, lessonId: 25, type: "SELECT", order: 4, question: "Quelle est la dérivée de f(x) = ln(x) / x ?" },
      { id: 64, lessonId: 26, type: "SELECT", order: 1, question: "Dérive f(x) = (3x² + 1)⁴" },
      { id: 65, lessonId: 26, type: "SELECT", order: 2, question: "Dérive f(x) = sin(2x + 1)" },
      { id: 66, lessonId: 26, type: "SELECT", order: 3, question: "Dérive f(x) = e^(x² - 1)" },
      { id: 67, lessonId: 26, type: "SELECT", order: 4, question: "Dérive f(x) = ln(cos(x))" },

      // Intégrales
      { id: 68, lessonId: 27, type: "SELECT", order: 1, question: "Calcule ∫₀² x² dx" },
      { id: 69, lessonId: 27, type: "SELECT", order: 2, question: "Calcule ∫₁³ (2x + 1) dx" },
      { id: 70, lessonId: 27, type: "SELECT", order: 3, question: "Calcule ∫₀^π sin(x) dx" },
      { id: 71, lessonId: 27, type: "SELECT", order: 4, question: "Calcule ∫₁^e (1/x) dx" },
      { id: 72, lessonId: 28, type: "SELECT", order: 1, question: "Quelle est une primitive de f(x) = 3x² + 2x ?" },
      { id: 73, lessonId: 28, type: "SELECT", order: 2, question: "Quelle est une primitive de f(x) = cos(x) ?" },
      { id: 74, lessonId: 28, type: "SELECT", order: 3, question: "Quelle est une primitive de f(x) = 1/(x+1) ?" },

      // Trigonométrie
      { id: 75, lessonId: 29, type: "SELECT", order: 1, question: "Simplifie : sin²(x) + cos²(x)" },
      { id: 76, lessonId: 29, type: "SELECT", order: 2, question: "Quelle est la valeur de cos(2x) en termes de sin(x) ?" },
      { id: 77, lessonId: 29, type: "SELECT", order: 3, question: "Simplifie : (1 - cos²(x)) / sin(x)" },
      { id: 78, lessonId: 29, type: "SELECT", order: 4, question: "Quelle est la valeur de tan²(x) + 1 ?" },
      { id: 79, lessonId: 30, type: "SELECT", order: 1, question: "Résous : sin(x) = 1/2 sur [0, 2π]" },
      { id: 80, lessonId: 30, type: "SELECT", order: 2, question: "Résous : cos(x) = -1 sur [0, 2π]" },
      { id: 81, lessonId: 30, type: "SELECT", order: 3, question: "Résous : tan(x) = 1 sur [0, π]" },
      { id: 82, lessonId: 31, type: "SELECT", order: 1, question: "Développe : sin(a + b)" },
      { id: 83, lessonId: 31, type: "SELECT", order: 2, question: "Développe : cos(a - b)" },
      { id: 84, lessonId: 31, type: "SELECT", order: 3, question: "Calcule sin(75°) en utilisant sin(45° + 30°)" },

      // Nombres complexes
      { id: 85, lessonId: 32, type: "SELECT", order: 1, question: "Calcule (2 + 3i) + (1 - 5i)" },
      { id: 86, lessonId: 32, type: "SELECT", order: 2, question: "Calcule (1 + 2i)(3 - i)" },
      { id: 87, lessonId: 32, type: "SELECT", order: 3, question: "Calcule (2 + i) / (1 - i)" },
      { id: 88, lessonId: 32, type: "SELECT", order: 4, question: "Quel est le conjugué de z = 4 - 7i ?" },
      { id: 89, lessonId: 33, type: "SELECT", order: 1, question: "Quel est le module de z = 3 + 4i ?" },
      { id: 90, lessonId: 33, type: "SELECT", order: 2, question: "Quel est le module de z = -5 + 12i ?" },
      { id: 91, lessonId: 33, type: "SELECT", order: 3, question: "Quel est l'argument de z = 1 + i ?" },
      { id: 92, lessonId: 34, type: "SELECT", order: 1, question: "Écris z = 1 + i sous forme trigonométrique" },
      { id: 93, lessonId: 34, type: "SELECT", order: 2, question: "Calcule z³ pour z = √2 · e^(iπ/4)" },

      // Matrices
      { id: 94, lessonId: 35, type: "SELECT", order: 1, question: "A = [[1,2],[3,4]], B = [[5,6],[7,8]]. Calcule A + B." },
      { id: 95, lessonId: 35, type: "SELECT", order: 2, question: "A = [[1,2],[3,4]], B = [[2,0],[1,3]]. Calcule A × B." },
      { id: 96, lessonId: 35, type: "SELECT", order: 3, question: "Calcule 2 × [[1,3],[2,5]]" },
      { id: 97, lessonId: 36, type: "SELECT", order: 1, question: "Calcule det([[2,3],[1,4]])" },
      { id: 98, lessonId: 36, type: "SELECT", order: 2, question: "Calcule det([[1,2],[3,4]])" },
      { id: 99, lessonId: 36, type: "SELECT", order: 3, question: "Quelle est l'inverse de A = [[4,7],[2,6]] ?" },
      { id: 100, lessonId: 37, type: "SELECT", order: 1, question: "Résous par Gauss : x + y + z = 6, 2x - y + z = 3, x + 2y - z = 2" },
      { id: 101, lessonId: 37, type: "SELECT", order: 2, question: "Résous par Gauss : x + 2y = 5, 3x - y = 1" },

      // Logarithmes
      { id: 1000, lessonId: 500, type: "SELECT", order: 1, question: "Que vaut log₂(8) ?" },
      { id: 1001, lessonId: 500, type: "SELECT", order: 2, question: "Que vaut ln(e³) ?" },
      { id: 1002, lessonId: 500, type: "SELECT", order: 3, question: "Simplifie : log₃(27)" },
      { id: 1003, lessonId: 500, type: "SELECT", order: 4, question: "logₐ(1) = ?" },
      { id: 1004, lessonId: 500, type: "SELECT", order: 5, question: "logₐ(a) = ?" },
      { id: 1005, lessonId: 501, type: "ASSIST", order: 1, question: "Résous : log₂(x) = 3" },
      { id: 1006, lessonId: 501, type: "ASSIST", order: 2, question: "Résous : ln(x) = 2" },
      { id: 1007, lessonId: 501, type: "ASSIST", order: 3, question: "Résous : log(x) + log(2) = 1" },

      // Suites
      { id: 1008, lessonId: 502, type: "SELECT", order: 1, question: "Trouve le 5ème terme de la suite : 2, 5, 8, 11, ..." },
      { id: 1009, lessonId: 502, type: "SELECT", order: 2, question: "Calcule la somme des 10 premiers termes : 3, 7, 11, 15, ..." },
      { id: 1010, lessonId: 502, type: "FILL_BLANK", order: 3, question: "Le 10ème terme de la suite arithmétique de premier terme 5 et raison 3 est ___" },
      { id: 1011, lessonId: 503, type: "SELECT", order: 1, question: "Trouve le 4ème terme de la suite : 3, 6, 12, ..." },
      { id: 1012, lessonId: 503, type: "SELECT", order: 2, question: "Calcule la somme infinie : 1 + 1/2 + 1/4 + 1/8 + ..." },

      // FILL_BLANK
      { id: 200, lessonId: 1, type: "FILL_BLANK", order: 5, question: "Si 3x + 7 = 2x + 15, alors x = ___" },
      { id: 201, lessonId: 1, type: "FILL_BLANK", order: 6, question: "Si 5x - 3 = 2x + 9, alors x = ___" },
      { id: 202, lessonId: 1, type: "FILL_BLANK", order: 7, question: "Si 4(x + 2) = 24, alors x = ___" },
      { id: 203, lessonId: 2, type: "FILL_BLANK", order: 6, question: "Si x² = 25, alors x = ___ ou x = ___" },
      { id: 204, lessonId: 2, type: "FILL_BLANK", order: 7, question: "Si x² - 7x + 12 = 0, alors x = ___ ou x = ___" },
      { id: 205, lessonId: 4, type: "FILL_BLANK", order: 5, question: "12/18 simplifié donne ___" },
      { id: 206, lessonId: 4, type: "FILL_BLANK", order: 6, question: "15/45 simplifié donne ___ et 24/36 donne ___" },
      { id: 207, lessonId: 5, type: "FILL_BLANK", order: 5, question: "1/2 + 1/3 = ___" },
      { id: 208, lessonId: 5, type: "FILL_BLANK", order: 6, question: "2/3 × 3/4 = ___ et 5/6 ÷ 5/3 = ___" },
      { id: 209, lessonId: 7, type: "FILL_BLANK", order: 5, question: "L'aire d'un rectangle de 6cm × 4cm est ___ cm²" },
      { id: 210, lessonId: 7, type: "FILL_BLANK", order: 6, question: "Le périmètre d'un carré de côté 5cm est ___ cm" },
      { id: 211, lessonId: 8, type: "FILL_BLANK", order: 4, question: "Si a = 3 et b = 4, alors c = ___" },
      { id: 212, lessonId: 8, type: "FILL_BLANK", order: 5, question: "Si a = 5 et b = 12, alors c = ___" },
      { id: 213, lessonId: 10, type: "FILL_BLANK", order: 4, question: "La moyenne de 4, 8, 6, 10, 2 est ___" },
      { id: 214, lessonId: 10, type: "FILL_BLANK", order: 5, question: "La médiane de 3, 7, 1, 9, 5 est ___" },
      { id: 215, lessonId: 25, type: "FILL_BLANK", order: 5, question: "La dérivée de x³ est ___ et la dérivée de x⁴ est ___" },
      { id: 216, lessonId: 25, type: "FILL_BLANK", order: 6, question: "La dérivée de sin(x) est ___ et la dérivée de cos(x) est ___" },
      { id: 217, lessonId: 29, type: "FILL_BLANK", order: 5, question: "sin²(x) + cos²(x) = ___" },
      { id: 218, lessonId: 29, type: "FILL_BLANK", order: 6, question: "tan²(x) + 1 = ___" },
    ]);

    await db.insert(schema.challengeOptions).values([
      // Équations
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
      { challengeId: 5, correct: false, text: "x = 6 ou x = -6" },
      { challengeId: 5, correct: false, text: "x = 9 ou x = -9" },
      { challengeId: 5, correct: true, text: "x = 3 ou x = -3" },
      { challengeId: 6, correct: true, text: "x = 3 ou x = -3" },
      { challengeId: 6, correct: false, text: "x = 9 ou x = -9" },
      { challengeId: 7, correct: false, text: "x = -4 ou x = 3" },
      { challengeId: 7, correct: true, text: "x = 4 ou x = -3" },
      { challengeId: 8, correct: false, text: "x = 7 ou x = -11" },
      { challengeId: 8, correct: true, text: "x = 5 ou x = -9" },
      { challengeId: 9, correct: true, text: "x = 2 ou x = 3" },
      { challengeId: 9, correct: false, text: "x = 1 ou x = 4" },
      { challengeId: 10, correct: false, text: "x = 8, y = 2" },
      { challengeId: 10, correct: true, text: "x = 7, y = 3" },
      { challengeId: 11, correct: false, text: "x = 2, y = 4" },
      { challengeId: 11, correct: true, text: "x = 3, y = 1" },
      { challengeId: 12, correct: true, text: "x = 2, y = 3" },
      { challengeId: 12, correct: false, text: "x = 1, y = 4" },
      { challengeId: 13, correct: false, text: "x = 3, y = 2" },
      { challengeId: 13, correct: true, text: "x = 2, y = 3" },

      // Fractions
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

      // Géométrie
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

      // Statistiques
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

      // Dérivées
      { challengeId: 60, correct: false, text: "3x² + 4x + 5" },
      { challengeId: 60, correct: true, text: "3x² + 4x - 5" },
      { challengeId: 60, correct: false, text: "x² + 4x - 5" },
      { challengeId: 61, correct: false, text: "-cos(x) + sin(x)" },
      { challengeId: 61, correct: true, text: "cos(x) - sin(x)" },
      { challengeId: 61, correct: false, text: "cos(x) + sin(x)" },
      { challengeId: 62, correct: false, text: "2x · eˣ" },
      { challengeId: 62, correct: true, text: "eˣ(x² + 2x)" },
      { challengeId: 62, correct: false, text: "eˣ · x²" },
      { challengeId: 63, correct: false, text: "1/x²" },
      { challengeId: 63, correct: true, text: "(1 - ln(x)) / x²" },
      { challengeId: 63, correct: false, text: "(1 + ln(x)) / x²" },
      { challengeId: 64, correct: false, text: "4(3x²+1)³" },
      { challengeId: 64, correct: true, text: "24x(3x²+1)³" },
      { challengeId: 64, correct: false, text: "12x(3x²+1)³" },
      { challengeId: 65, correct: false, text: "cos(2x+1)" },
      { challengeId: 65, correct: true, text: "2cos(2x+1)" },
      { challengeId: 65, correct: false, text: "-2sin(2x+1)" },
      { challengeId: 66, correct: false, text: "e^(x²-1)" },
      { challengeId: 66, correct: true, text: "2x · e^(x²-1)" },
      { challengeId: 66, correct: false, text: "x² · e^(x²-1)" },
      { challengeId: 67, correct: false, text: "1/cos(x)" },
      { challengeId: 67, correct: true, text: "-tan(x)" },
      { challengeId: 67, correct: false, text: "tan(x)" },

      // Intégrales
      { challengeId: 68, correct: false, text: "4/3" },
      { challengeId: 68, correct: true, text: "8/3" },
      { challengeId: 68, correct: false, text: "3" },
      { challengeId: 69, correct: false, text: "10" },
      { challengeId: 69, correct: true, text: "12" },
      { challengeId: 69, correct: false, text: "14" },
      { challengeId: 70, correct: false, text: "0" },
      { challengeId: 70, correct: true, text: "2" },
      { challengeId: 70, correct: false, text: "π" },
      { challengeId: 71, correct: false, text: "0" },
      { challengeId: 71, correct: true, text: "1" },
      { challengeId: 71, correct: false, text: "e" },
      { challengeId: 72, correct: false, text: "6x + 2" },
      { challengeId: 72, correct: true, text: "x³ + x²" },
      { challengeId: 72, correct: false, text: "3x³ + 2x²" },
      { challengeId: 73, correct: false, text: "-sin(x)" },
      { challengeId: 73, correct: true, text: "sin(x)" },
      { challengeId: 73, correct: false, text: "cos(x)" },
      { challengeId: 74, correct: false, text: "-1/(x+1)²" },
      { challengeId: 74, correct: true, text: "ln|x+1|" },
      { challengeId: 74, correct: false, text: "1/(x+1)²" },

      // Trigonométrie
      { challengeId: 75, correct: false, text: "0" },
      { challengeId: 75, correct: true, text: "1" },
      { challengeId: 75, correct: false, text: "2" },
      { challengeId: 76, correct: false, text: "1 + 2sin²(x)" },
      { challengeId: 76, correct: true, text: "1 - 2sin²(x)" },
      { challengeId: 76, correct: false, text: "2sin²(x)" },
      { challengeId: 77, correct: false, text: "cos(x)" },
      { challengeId: 77, correct: true, text: "sin(x)" },
      { challengeId: 77, correct: false, text: "tan(x)" },
      { challengeId: 78, correct: false, text: "cos²(x)" },
      { challengeId: 78, correct: true, text: "1/cos²(x)" },
      { challengeId: 78, correct: false, text: "sin²(x)" },
      { challengeId: 79, correct: false, text: "x = π/6 uniquement" },
      { challengeId: 79, correct: true, text: "x = π/6 et x = 5π/6" },
      { challengeId: 79, correct: false, text: "x = π/3 et x = 2π/3" },
      { challengeId: 80, correct: false, text: "x = π/2" },
      { challengeId: 80, correct: true, text: "x = π" },
      { challengeId: 80, correct: false, text: "x = 3π/2" },
      { challengeId: 81, correct: false, text: "x = π/3" },
      { challengeId: 81, correct: true, text: "x = π/4" },
      { challengeId: 81, correct: false, text: "x = π/6" },
      { challengeId: 82, correct: false, text: "sin(a)sin(b) + cos(a)cos(b)" },
      { challengeId: 82, correct: true, text: "sin(a)cos(b) + cos(a)sin(b)" },
      { challengeId: 82, correct: false, text: "sin(a)cos(b) - cos(a)sin(b)" },
      { challengeId: 83, correct: false, text: "cos(a)cos(b) - sin(a)sin(b)" },
      { challengeId: 83, correct: true, text: "cos(a)cos(b) + sin(a)sin(b)" },
      { challengeId: 83, correct: false, text: "sin(a)sin(b) - cos(a)cos(b)" },
      { challengeId: 84, correct: false, text: "(√6 - √2) / 4" },
      { challengeId: 84, correct: true, text: "(√6 + √2) / 4" },
      { challengeId: 84, correct: false, text: "(√3 + 1) / 4" },

      // Nombres complexes
      { challengeId: 85, correct: false, text: "3 + 8i" },
      { challengeId: 85, correct: true, text: "3 - 2i" },
      { challengeId: 85, correct: false, text: "1 - 2i" },
      { challengeId: 86, correct: false, text: "3 - 2i" },
      { challengeId: 86, correct: true, text: "5 + 5i" },
      { challengeId: 86, correct: false, text: "3 + 5i" },
      { challengeId: 87, correct: false, text: "1 + i" },
      { challengeId: 87, correct: true, text: "1/2 + 3i/2" },
      { challengeId: 87, correct: false, text: "2 - i" },
      { challengeId: 88, correct: false, text: "-4 + 7i" },
      { challengeId: 88, correct: true, text: "4 + 7i" },
      { challengeId: 88, correct: false, text: "-4 - 7i" },
      { challengeId: 89, correct: false, text: "7" },
      { challengeId: 89, correct: true, text: "5" },
      { challengeId: 89, correct: false, text: "√7" },
      { challengeId: 90, correct: false, text: "7" },
      { challengeId: 90, correct: true, text: "13" },
      { challengeId: 90, correct: false, text: "17" },
      { challengeId: 91, correct: false, text: "π/6" },
      { challengeId: 91, correct: true, text: "π/4" },
      { challengeId: 91, correct: false, text: "π/3" },
      { challengeId: 92, correct: false, text: "√2 · e^(iπ/6)" },
      { challengeId: 92, correct: true, text: "√2 · e^(iπ/4)" },
      { challengeId: 92, correct: false, text: "2 · e^(iπ/4)" },
      { challengeId: 93, correct: false, text: "2√2 · e^(iπ/4)" },
      { challengeId: 93, correct: true, text: "2√2 · e^(i3π/4)" },
      { challengeId: 93, correct: false, text: "√2 · e^(i3π/4)" },

      // Matrices
      { challengeId: 94, correct: false, text: "[[5,8],[10,12]]" },
      { challengeId: 94, correct: true, text: "[[6,8],[10,12]]" },
      { challengeId: 94, correct: false, text: "[[6,8],[9,12]]" },
      { challengeId: 95, correct: false, text: "[[3,6],[13,12]]" },
      { challengeId: 95, correct: true, text: "[[4,6],[14,12]]" },
      { challengeId: 95, correct: false, text: "[[4,6],[13,12]]" },
      { challengeId: 96, correct: false, text: "[[1,3],[2,5]]" },
      { challengeId: 96, correct: true, text: "[[2,6],[4,10]]" },
      { challengeId: 96, correct: false, text: "[[2,6],[4,5]]" },
      { challengeId: 97, correct: false, text: "11" },
      { challengeId: 97, correct: true, text: "5" },
      { challengeId: 97, correct: false, text: "8" },
      { challengeId: 98, correct: false, text: "2" },
      { challengeId: 98, correct: true, text: "-2" },
      { challengeId: 98, correct: false, text: "10" },
      { challengeId: 99, correct: true, text: "[[6,-7],[-2,4]] / 10" },
      { challengeId: 99, correct: false, text: "[[4,-3],[-2,6]] / 10" },
      { challengeId: 99, correct: false, text: "[[6,7],[2,4]] / 10" },
      { challengeId: 100, correct: true, text: "x=1, y=2, z=3" },
      { challengeId: 100, correct: false, text: "x=2, y=1, z=3" },
      { challengeId: 100, correct: false, text: "x=3, y=1, z=2" },
      { challengeId: 101, correct: true, text: "x=1, y=2" },
      { challengeId: 101, correct: false, text: "x=0, y=2" },
      { challengeId: 101, correct: false, text: "x=2, y=1" },

      // Logarithmes
      { challengeId: 1000, correct: true, text: "3" },
      { challengeId: 1000, correct: false, text: "2" },
      { challengeId: 1000, correct: false, text: "4" },
      { challengeId: 1001, correct: true, text: "3" },
      { challengeId: 1001, correct: false, text: "1" },
      { challengeId: 1001, correct: false, text: "e³" },
      { challengeId: 1002, correct: true, text: "3" },
      { challengeId: 1002, correct: false, text: "9" },
      { challengeId: 1002, correct: false, text: "27" },
      { challengeId: 1003, correct: true, text: "0" },
      { challengeId: 1003, correct: false, text: "1" },
      { challengeId: 1003, correct: false, text: "a" },
      { challengeId: 1004, correct: true, text: "1" },
      { challengeId: 1004, correct: false, text: "0" },
      { challengeId: 1004, correct: false, text: "a" },
      { challengeId: 1005, correct: true, text: "x = 8" },
      { challengeId: 1005, correct: false, text: "x = 3" },
      { challengeId: 1005, correct: false, text: "x = 6" },
      { challengeId: 1006, correct: true, text: "x = e²" },
      { challengeId: 1006, correct: false, text: "x = 2" },
      { challengeId: 1006, correct: false, text: "x = ln(2)" },
      { challengeId: 1007, correct: true, text: "x = 5" },
      { challengeId: 1007, correct: false, text: "x = 2" },
      { challengeId: 1007, correct: false, text: "x = 10" },

      // Suites
      { challengeId: 1008, correct: true, text: "14" },
      { challengeId: 1008, correct: false, text: "17" },
      { challengeId: 1008, correct: false, text: "20" },
      { challengeId: 1009, correct: true, text: "210" },
      { challengeId: 1009, correct: false, text: "200" },
      { challengeId: 1009, correct: false, text: "220" },
      { challengeId: 1010, correct: true, text: "32", blank: 0 },
      { challengeId: 1011, correct: true, text: "24" },
      { challengeId: 1011, correct: false, text: "48" },
      { challengeId: 1011, correct: false, text: "12" },
      { challengeId: 1012, correct: true, text: "2" },
      { challengeId: 1012, correct: false, text: "1" },
      { challengeId: 1012, correct: false, text: "3" },

      // FILL_BLANK
      { challengeId: 200, correct: true, text: "8", blank: 0 },
      { challengeId: 200, correct: false, text: "6", blank: 0 },
      { challengeId: 200, correct: false, text: "10", blank: 0 },
      { challengeId: 201, correct: true, text: "4", blank: 0 },
      { challengeId: 201, correct: false, text: "3", blank: 0 },
      { challengeId: 201, correct: false, text: "6", blank: 0 },
      { challengeId: 202, correct: true, text: "4", blank: 0 },
      { challengeId: 202, correct: false, text: "6", blank: 0 },
      { challengeId: 202, correct: false, text: "2", blank: 0 },
      { challengeId: 203, correct: true, text: "5", blank: 0 },
      { challengeId: 203, correct: true, text: "-5", blank: 1 },
      { challengeId: 203, correct: false, text: "3", blank: 0 },
      { challengeId: 204, correct: true, text: "3", blank: 0 },
      { challengeId: 204, correct: true, text: "4", blank: 1 },
      { challengeId: 205, correct: true, text: "2/3", blank: 0 },
      { challengeId: 205, correct: false, text: "1/2", blank: 0 },
      { challengeId: 206, correct: true, text: "1/3", blank: 0 },
      { challengeId: 206, correct: true, text: "2/3", blank: 1 },
      { challengeId: 207, correct: true, text: "5/6", blank: 0 },
      { challengeId: 207, correct: false, text: "2/5", blank: 0 },
      { challengeId: 208, correct: true, text: "1/2", blank: 0 },
      { challengeId: 208, correct: true, text: "1/2", blank: 1 },
      { challengeId: 209, correct: true, text: "24", blank: 0 },
      { challengeId: 210, correct: true, text: "20", blank: 0 },
      { challengeId: 211, correct: true, text: "5", blank: 0 },
      { challengeId: 212, correct: true, text: "13", blank: 0 },
      { challengeId: 213, correct: true, text: "6", blank: 0 },
      { challengeId: 214, correct: true, text: "5", blank: 0 },
      { challengeId: 215, correct: true, text: "3x²", blank: 0 },
      { challengeId: 215, correct: true, text: "4x³", blank: 1 },
      { challengeId: 216, correct: true, text: "cos(x)", blank: 0 },
      { challengeId: 216, correct: true, text: "-sin(x)", blank: 1 },
      { challengeId: 217, correct: true, text: "1", blank: 0 },
      { challengeId: 218, correct: true, text: "1/cos²(x)", blank: 0 },
    ]);

    // ================================================
    // 2. ESPAGNOL
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
      { challengeId: 40, correct: true, text: "el hombre", imageSrc: "/man.svg", audioSrc: "/es_man.mp3" },
      { challengeId: 40, correct: false, text: "la mujer", imageSrc: "/woman.svg", audioSrc: "/es_woman.mp3" },
      { challengeId: 40, correct: false, text: "el niño", imageSrc: "/boy.svg", audioSrc: "/es_boy.mp3" },
      { challengeId: 41, correct: true, text: "el hombre", imageSrc: "/man.svg", audioSrc: "/es_man.mp3" },
      { challengeId: 41, correct: false, text: "la mujer", imageSrc: "/woman.svg", audioSrc: "/es_woman.mp3" },
      { challengeId: 41, correct: false, text: "el niño", imageSrc: "/boy.svg", audioSrc: "/es_boy.mp3" },
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
    // 3. ITALIEN
    // ================================================

    await db.insert(schema.units).values([
      { id: 8, courseId: 3, title: "Introduzione", description: "Learn the basics of Italian", order: 1 },
    ]);

    await db.insert(schema.lessons).values([
      { id: 19, unitId: 8, order: 1, title: "Nouns" },
      { id: 20, unitId: 8, order: 2, title: "Greetings" },
    ]);

    await db.insert(schema.challenges).values([
      { id: 120, lessonId: 19, type: "SELECT", order: 1, question: 'Which one is "the cat"?' },
      { id: 121, lessonId: 19, type: "SELECT", order: 2, question: 'Which one is "the dog"?' },
      { id: 123, lessonId: 20, type: "SELECT", order: 1, question: 'How do you say "Good morning"?' },
    ]);

    await db.insert(schema.challengeOptions).values([
      { challengeId: 120, correct: true, text: "il gatto", imageSrc: "/cat.svg" },
      { challengeId: 120, correct: false, text: "il cane", imageSrc: "/dog.svg" },
      { challengeId: 120, correct: false, text: "il topo", imageSrc: "/mouse.svg" },
      { challengeId: 121, correct: true, text: "il cane", imageSrc: "/dog.svg" },
      { challengeId: 121, correct: false, text: "il gatto", imageSrc: "/cat.svg" },
      { challengeId: 121, correct: false, text: "l'uccello", imageSrc: "/bird.svg" },
      { challengeId: 123, correct: true, text: "Buongiorno" },
      { challengeId: 123, correct: false, text: "Buonasera" },
      { challengeId: 123, correct: false, text: "Buonanotte" },
    ]);

    // ================================================
    // 4. FRANÇAIS
    // ================================================

    await db.insert(schema.units).values([
      { id: 9, courseId: 4, title: "Introduction", description: "Learn the basics of French", order: 1 },
      { id: 21, courseId: 4, title: "La Vie Quotidienne", description: "La vie de tous les jours", order: 2 },
    ]);

    await db.insert(schema.lessons).values([
      { id: 21, unitId: 9, order: 1, title: "Nouns" },
      { id: 22, unitId: 9, order: 2, title: "Greetings" },
      { id: 62, unitId: 21, order: 1, title: "Les Animaux" },
      { id: 63, unitId: 21, order: 2, title: "La Famille" },
      { id: 64, unitId: 21, order: 3, title: "Les Couleurs" },
    ]);

    await db.insert(schema.challenges).values([
      { id: 130, lessonId: 21, type: "SELECT", order: 1, question: 'Which one is "the book"?' },
      { id: 131, lessonId: 21, type: "SELECT", order: 2, question: 'Which one is "the table"?' },
      { id: 133, lessonId: 22, type: "SELECT", order: 1, question: 'How do you say "Good evening"?' },
      { id: 136, lessonId: 62, type: "SELECT", order: 1, question: 'Which one is "the cat"?' },
      { id: 137, lessonId: 62, type: "SELECT", order: 2, question: 'Which one is "the dog"?' },
      { id: 140, lessonId: 63, type: "SELECT", order: 1, question: 'Which one is "the father"?' },
      { id: 143, lessonId: 64, type: "SELECT", order: 1, question: 'Which one means "red"?' },
    ]);

    await db.insert(schema.challengeOptions).values([
      { challengeId: 130, correct: true, text: "le livre", imageSrc: "/book.svg" },
      { challengeId: 130, correct: false, text: "la chaise", imageSrc: "/chair.svg" },
      { challengeId: 130, correct: false, text: "la fenêtre", imageSrc: "/window.svg" },
      { challengeId: 131, correct: true, text: "la table", imageSrc: "/table.svg" },
      { challengeId: 131, correct: false, text: "le livre", imageSrc: "/book.svg" },
      { challengeId: 131, correct: false, text: "la chaise", imageSrc: "/chair.svg" },
      { challengeId: 133, correct: true, text: "Bonsoir" },
      { challengeId: 133, correct: false, text: "Bonjour" },
      { challengeId: 133, correct: false, text: "Bonne nuit" },
      { challengeId: 136, correct: true, text: "le chat", imageSrc: "/cat.svg" },
      { challengeId: 136, correct: false, text: "le chien", imageSrc: "/dog.svg" },
      { challengeId: 136, correct: false, text: "le lapin", imageSrc: "/rabbit.svg" },
      { challengeId: 137, correct: true, text: "le chien", imageSrc: "/dog.svg" },
      { challengeId: 137, correct: false, text: "le chat", imageSrc: "/cat.svg" },
      { challengeId: 137, correct: false, text: "l'oiseau", imageSrc: "/bird.svg" },
      { challengeId: 140, correct: true, text: "le père", imageSrc: "/father.svg" },
      { challengeId: 140, correct: false, text: "la mère", imageSrc: "/mother.svg" },
      { challengeId: 140, correct: false, text: "le frère", imageSrc: "/brother.svg" },
      { challengeId: 143, correct: true, text: "rouge" },
      { challengeId: 143, correct: false, text: "bleu" },
      { challengeId: 143, correct: false, text: "vert" },
    ]);

    // ================================================
    // 5. CROATE
    // ================================================

    await db.insert(schema.units).values([
      { id: 10, courseId: 5, title: "Uvod", description: "Learn the basics of Croatian", order: 1 },
    ]);

    await db.insert(schema.lessons).values([
      { id: 23, unitId: 10, order: 1, title: "Nouns" },
      { id: 24, unitId: 10, order: 2, title: "Greetings" },
    ]);

    await db.insert(schema.challenges).values([
      { id: 150, lessonId: 23, type: "SELECT", order: 1, question: 'Which one is "the house"?' },
      { id: 152, lessonId: 24, type: "SELECT", order: 1, question: 'How do you say "Thank you"?' },
    ]);

    await db.insert(schema.challengeOptions).values([
      { challengeId: 150, correct: true, text: "kuća", imageSrc: "/house.svg" },
      { challengeId: 150, correct: false, text: "auto", imageSrc: "/car.svg" },
      { challengeId: 150, correct: false, text: "pas", imageSrc: "/dog.svg" },
      { challengeId: 152, correct: true, text: "Hvala" },
      { challengeId: 152, correct: false, text: "Molim" },
      { challengeId: 152, correct: false, text: "Dobar dan" },
    ]);

    // ================================================
    // 6. CULTURE GÉNÉRALE (MASSIF)
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
      { id: 38, unitId: 15, order: 1, title: "Capitales du Monde" },
      { id: 39, unitId: 15, order: 2, title: "Les Grands Fleuves" },
      { id: 40, unitId: 15, order: 3, title: "Les Plus Hauts Sommets" },
      { id: 41, unitId: 15, order: 4, title: "Déserts et Mers" },
      { id: 42, unitId: 16, order: 1, title: "Grandes Civilisations" },
      { id: 43, unitId: 16, order: 2, title: "Personnages Historiques" },
      { id: 44, unitId: 16, order: 3, title: "Dates Clés" },
      { id: 45, unitId: 16, order: 4, title: "Inventions et Découvertes" },
      { id: 46, unitId: 17, order: 1, title: "Peintres Célèbres" },
      { id: 47, unitId: 17, order: 2, title: "Écrivains et Œuvres" },
      { id: 48, unitId: 17, order: 3, title: "Musique Classique" },
      { id: 49, unitId: 17, order: 4, title: "Cinéma et Théâtre" },
      { id: 50, unitId: 18, order: 1, title: "Physique et Chimie" },
      { id: 51, unitId: 18, order: 2, title: "Biologie et Médecine" },
      { id: 52, unitId: 18, order: 3, title: "Astronomie" },
      { id: 53, unitId: 18, order: 4, title: "Grands Scientifiques" },
      { id: 54, unitId: 19, order: 1, title: "Symboles et Institutions" },
      { id: 55, unitId: 19, order: 2, title: "Droits et Libertés" },
      { id: 56, unitId: 19, order: 3, title: "Organisations Internationales" },
      { id: 57, unitId: 19, order: 4, title: "Grands Discours" },
      { id: 58, unitId: 20, order: 1, title: "Mythologie Grecque" },
      { id: 59, unitId: 20, order: 2, title: "Mythologie Nordique" },
    ]);

    await db.insert(schema.challenges).values([
      // Géographie - Capitales
      { id: 160, lessonId: 38, type: "SELECT", order: 1, question: "Quelle est la capitale de la France ?" },
      { id: 161, lessonId: 38, type: "SELECT", order: 2, question: "Quelle est la capitale du Japon ?" },
      { id: 162, lessonId: 38, type: "SELECT", order: 3, question: "Quelle est la capitale du Brésil ?" },
      { id: 163, lessonId: 38, type: "SELECT", order: 4, question: "Quelle est la capitale de l'Inde ?" },
      { id: 164, lessonId: 38, type: "SELECT", order: 5, question: "Quelle est la capitale de l'Australie ?" },
      { id: 165, lessonId: 38, type: "SELECT", order: 6, question: "Quelle est la capitale de l'Égypte ?" },
      { id: 166, lessonId: 38, type: "SELECT", order: 7, question: "Quelle est la capitale de l'Argentine ?" },
      { id: 167, lessonId: 38, type: "SELECT", order: 8, question: "Quelle est la capitale du Canada ?" },
      { id: 168, lessonId: 38, type: "SELECT", order: 9, question: "Quelle est la capitale de l'Italie ?" },
      { id: 169, lessonId: 38, type: "SELECT", order: 10, question: "Quelle est la capitale de l'Allemagne ?" },

      // Géographie - Fleuves
      { id: 170, lessonId: 39, type: "SELECT", order: 1, question: "Quel est le plus long fleuve du monde ?" },
      { id: 171, lessonId: 39, type: "SELECT", order: 2, question: "Quel fleuve traverse l'Égypte ?" },
      { id: 172, lessonId: 39, type: "SELECT", order: 3, question: "Quel est le plus long fleuve d'Europe ?" },
      { id: 173, lessonId: 39, type: "SELECT", order: 4, question: "Quel fleuve traverse Paris ?" },
      { id: 174, lessonId: 39, type: "FILL_BLANK", order: 5, question: "Le fleuve qui traverse Londres est la ___" },

      // Géographie - Montagnes
      { id: 175, lessonId: 40, type: "SELECT", order: 1, question: "Quel est le plus haut sommet du monde ?" },
      { id: 176, lessonId: 40, type: "SELECT", order: 2, question: "Quel est le plus haut sommet d'Afrique ?" },
      { id: 177, lessonId: 40, type: "SELECT", order: 3, question: "Quelle est la plus haute montagne des Alpes ?" },

      // Géographie - Déserts
      { id: 178, lessonId: 41, type: "SELECT", order: 1, question: "Quel est le plus grand désert du monde ?" },
      { id: 179, lessonId: 41, type: "SELECT", order: 2, question: "Où se trouve le désert de Gobi ?" },

      // Histoire - Civilisations
      { id: 180, lessonId: 42, type: "SELECT", order: 1, question: "Quelle civilisation a construit les pyramides ?" },
      { id: 181, lessonId: 42, type: "SELECT", order: 2, question: "Qui était le premier empereur romain ?" },
      { id: 182, lessonId: 42, type: "SELECT", order: 3, question: "Quelle civilisation a construit le Parthénon ?" },
      { id: 183, lessonId: 42, type: "SELECT", order: 4, question: "Qui a conquis la Gaule ?" },
      { id: 184, lessonId: 42, type: "SELECT", order: 5, question: "Qui était le roi de Macédoine qui a conquis l'immense empire ?" },

      // Histoire - Personnages
      { id: 185, lessonId: 43, type: "SELECT", order: 1, question: "Qui a peint la Joconde ?" },
      { id: 186, lessonId: 43, type: "SELECT", order: 2, question: "Qui a découvert la pénicilline ?" },
      { id: 187, lessonId: 43, type: "SELECT", order: 3, question: "Qui a prononcé le discours 'I have a dream' ?" },
      { id: 188, lessonId: 43, type: "SELECT", order: 4, question: "Qui était le roi d'Angleterre en 1066 ?" },
      { id: 189, lessonId: 43, type: "SELECT", order: 5, question: "Qui a écrit La Divine Comédie ?" },

      // Histoire - Dates
      { id: 190, lessonId: 44, type: "SELECT", order: 1, question: "En quelle année a eu lieu la Révolution française ?" },
      { id: 191, lessonId: 44, type: "SELECT", order: 2, question: "En quelle année a commencé la Première Guerre mondiale ?" },
      { id: 192, lessonId: 44, type: "SELECT", order: 3, question: "En quelle année l'homme a-t-il marché sur la Lune ?" },
      { id: 193, lessonId: 44, type: "SELECT", order: 4, question: "Quelle année marque la chute du mur de Berlin ?" },

      // Inventions
      { id: 194, lessonId: 45, type: "SELECT", order: 1, question: "Qui a inventé le téléphone ?" },
      { id: 195, lessonId: 45, type: "SELECT", order: 2, question: "Qui a inventé l'imprimerie ?" },
      { id: 196, lessonId: 45, type: "SELECT", order: 3, question: "Qui a inventé l'ampoule électrique ?" },

      // Arts - Peintres
      { id: 197, lessonId: 46, type: "SELECT", order: 1, question: "Qui a peint La Nuit étoilée ?" },
      { id: 198, lessonId: 46, type: "SELECT", order: 2, question: "Quel peintre espagnol a peint Guernica ?" },
      { id: 199, lessonId: 46, type: "SELECT", order: 3, question: "Qui a peint Les Nymphéas ?" },

      // Littérature
      { id: 300, lessonId: 47, type: "SELECT", order: 1, question: "Qui a écrit Les Misérables ?" },
      { id: 301, lessonId: 47, type: "SELECT", order: 2, question: "Qui a écrit Guerre et Paix ?" },
      { id: 302, lessonId: 47, type: "SELECT", order: 3, question: "Qui a écrit Le Petit Prince ?" },
      { id: 303, lessonId: 47, type: "SELECT", order: 4, question: "Qui a écrit Don Quichotte ?" },
      { id: 304, lessonId: 47, type: "SELECT", order: 5, question: "Qui a écrit Hamlet ?" },

      // Musique
      { id: 305, lessonId: 48, type: "SELECT", order: 1, question: "Qui a composé la 5e Symphonie ?" },
      { id: 306, lessonId: 48, type: "SELECT", order: 2, question: "Quel compositeur est devenu sourd ?" },
      { id: 307, lessonId: 48, type: "SELECT", order: 3, question: "Qui est connu comme le roi du rock ?" },
      { id: 308, lessonId: 48, type: "SELECT", order: 4, question: "Quel groupe a chanté 'Bohemian Rhapsody' ?" },

      // Sciences - Physique/Chimie
      { id: 309, lessonId: 50, type: "SELECT", order: 1, question: "Quelle est la formule de l'eau ?" },
      { id: 310, lessonId: 50, type: "SELECT", order: 2, question: "Quelle est la formule d'Einstein ?" },
      { id: 311, lessonId: 50, type: "SELECT", order: 3, question: "Qui a découvert la gravité ?" },
      { id: 312, lessonId: 50, type: "SELECT", order: 4, question: "Qui a découvert le radium ?" },

      // Biologie
      { id: 313, lessonId: 51, type: "SELECT", order: 1, question: "Qui a proposé la théorie de l'évolution ?" },
      { id: 314, lessonId: 51, type: "SELECT", order: 2, question: "Quel est le plus grand organe du corps humain ?" },
      { id: 315, lessonId: 51, type: "SELECT", order: 3, question: "Combien de chromosomes possède un humain ?" },

      // Astronomie
      { id: 316, lessonId: 52, type: "SELECT", order: 1, question: "Quelle planète est la plus proche du Soleil ?" },
      { id: 317, lessonId: 52, type: "SELECT", order: 2, question: "Quelle est la plus grande planète du système solaire ?" },
      { id: 318, lessonId: 52, type: "SELECT", order: 3, question: "Quelle planète est surnommée la planète rouge ?" },
      { id: 319, lessonId: 52, type: "SELECT", order: 4, question: "Combien de planètes compte notre système solaire ?" },

      // Mythologie Grecque
      { id: 320, lessonId: 58, type: "SELECT", order: 1, question: "Qui est le dieu grec de la mer ?" },
      { id: 321, lessonId: 58, type: "SELECT", order: 2, question: "Qui est le dieu grec du ciel et roi des dieux ?" },
      { id: 322, lessonId: 58, type: "SELECT", order: 3, question: "Qui est la déesse grecque de la sagesse ?" },
      { id: 323, lessonId: 58, type: "SELECT", order: 4, question: "Qui a volé le feu aux dieux ?" },
      { id: 324, lessonId: 58, type: "SELECT", order: 5, question: "Qui a tué le Minotaure ?" },
      { id: 325, lessonId: 58, type: "FILL_BLANK", order: 6, question: "Le dieu grec du vin et des festivités est ___" },

      // Mythologie Nordique
      { id: 326, lessonId: 59, type: "SELECT", order: 1, question: "Qui est le dieu du tonnerre dans la mythologie nordique ?" },
      { id: 327, lessonId: 59, type: "SELECT", order: 2, question: "Quel est le nom de la fin du monde dans la mythologie nordique ?" },
    ]);

    await db.insert(schema.challengeOptions).values([
      // Capitales
      { challengeId: 160, correct: true, text: "Paris" },
      { challengeId: 160, correct: false, text: "Lyon" },
      { challengeId: 160, correct: false, text: "Marseille" },
      { challengeId: 161, correct: true, text: "Tokyo" },
      { challengeId: 161, correct: false, text: "Osaka" },
      { challengeId: 161, correct: false, text: "Kyoto" },
      { challengeId: 162, correct: true, text: "Brasília" },
      { challengeId: 162, correct: false, text: "Rio de Janeiro" },
      { challengeId: 162, correct: false, text: "São Paulo" },
      { challengeId: 163, correct: true, text: "New Delhi" },
      { challengeId: 163, correct: false, text: "Mumbai" },
      { challengeId: 163, correct: false, text: "Calcutta" },
      { challengeId: 164, correct: true, text: "Canberra" },
      { challengeId: 164, correct: false, text: "Sydney" },
      { challengeId: 164, correct: false, text: "Melbourne" },
      { challengeId: 165, correct: true, text: "Le Caire" },
      { challengeId: 165, correct: false, text: "Alexandrie" },
      { challengeId: 165, correct: false, text: "Gizeh" },
      { challengeId: 166, correct: true, text: "Buenos Aires" },
      { challengeId: 166, correct: false, text: "Santiago" },
      { challengeId: 166, correct: false, text: "Montevideo" },
      { challengeId: 167, correct: true, text: "Ottawa" },
      { challengeId: 167, correct: false, text: "Toronto" },
      { challengeId: 167, correct: false, text: "Montréal" },
      { challengeId: 168, correct: true, text: "Rome" },
      { challengeId: 168, correct: false, text: "Florence" },
      { challengeId: 168, correct: false, text: "Naples" },
      { challengeId: 169, correct: true, text: "Berlin" },
      { challengeId: 169, correct: false, text: "Munich" },
      { challengeId: 169, correct: false, text: "Hambourg" },

      // Fleuves
      { challengeId: 170, correct: true, text: "Le Nil" },
      { challengeId: 170, correct: false, text: "L'Amazone" },
      { challengeId: 170, correct: false, text: "Le Yangtsé" },
      { challengeId: 171, correct: true, text: "Le Nil" },
      { challengeId: 171, correct: false, text: "Le Congo" },
      { challengeId: 171, correct: false, text: "Le Niger" },
      { challengeId: 172, correct: true, text: "La Volga" },
      { challengeId: 172, correct: false, text: "Le Danube" },
      { challengeId: 172, correct: false, text: "Le Rhin" },
      { challengeId: 173, correct: true, text: "La Seine" },
      { challengeId: 173, correct: false, text: "La Loire" },
      { challengeId: 173, correct: false, text: "Le Rhône" },
      { challengeId: 174, correct: true, text: "Tamise", blank: 0 },

      // Montagnes
      { challengeId: 175, correct: true, text: "L'Everest" },
      { challengeId: 175, correct: false, text: "Le K2" },
      { challengeId: 175, correct: false, text: "Le Mont-Blanc" },
      { challengeId: 176, correct: true, text: "Le Kilimandjaro" },
      { challengeId: 176, correct: false, text: "Le Mont Kenya" },
      { challengeId: 176, correct: false, text: "Le Ras Dashen" },
      { challengeId: 177, correct: true, text: "Le Mont-Blanc" },
      { challengeId: 177, correct: false, text: "La Jungfrau" },
      { challengeId: 177, correct: false, text: "Le Cervin" },

      // Déserts
      { challengeId: 178, correct: true, text: "Le Sahara" },
      { challengeId: 178, correct: false, text: "Le désert d'Arabie" },
      { challengeId: 178, correct: false, text: "Le désert de Gobi" },
      { challengeId: 179, correct: true, text: "Asie" },
      { challengeId: 179, correct: false, text: "Afrique" },
      { challengeId: 179, correct: false, text: "Europe" },

      // Civilisations
      { challengeId: 180, correct: true, text: "Les Égyptiens" },
      { challengeId: 180, correct: false, text: "Les Grecs" },
      { challengeId: 180, correct: false, text: "Les Romains" },
      { challengeId: 181, correct: true, text: "Auguste" },
      { challengeId: 181, correct: false, text: "Jules César" },
      { challengeId: 181, correct: false, text: "Néron" },
      { challengeId: 182, correct: true, text: "Les Grecs" },
      { challengeId: 182, correct: false, text: "Les Romains" },
      { challengeId: 182, correct: false, text: "Les Égyptiens" },
      { challengeId: 183, correct: true, text: "Jules César" },
      { challengeId: 183, correct: false, text: "Auguste" },
      { challengeId: 183, correct: false, text: "Vercingétorix" },
      { challengeId: 184, correct: true, text: "Alexandre le Grand" },
      { challengeId: 184, correct: false, text: "Philippe II" },
      { challengeId: 184, correct: false, text: "Périclès" },

      // Personnages
      { challengeId: 185, correct: true, text: "Léonard de Vinci" },
      { challengeId: 185, correct: false, text: "Michel-Ange" },
      { challengeId: 185, correct: false, text: "Raphaël" },
      { challengeId: 186, correct: true, text: "Alexander Fleming" },
      { challengeId: 186, correct: false, text: "Louis Pasteur" },
      { challengeId: 186, correct: false, text: "Marie Curie" },
      { challengeId: 187, correct: true, text: "Martin Luther King" },
      { challengeId: 187, correct: false, text: "Malcolm X" },
      { challengeId: 187, correct: false, text: "Kennedy" },
      { challengeId: 188, correct: true, text: "Guillaume le Conquérant" },
      { challengeId: 188, correct: false, text: "Richard Cœur de Lion" },
      { challengeId: 188, correct: false, text: "Henri VIII" },
      { challengeId: 189, correct: true, text: "Dante Alighieri" },
      { challengeId: 189, correct: false, text: "Pétrarque" },
      { challengeId: 189, correct: false, text: "Boccace" },

      // Dates
      { challengeId: 190, correct: true, text: "1789" },
      { challengeId: 190, correct: false, text: "1776" },
      { challengeId: 190, correct: false, text: "1804" },
      { challengeId: 191, correct: true, text: "1914" },
      { challengeId: 191, correct: false, text: "1912" },
      { challengeId: 191, correct: false, text: "1918" },
      { challengeId: 192, correct: true, text: "1969" },
      { challengeId: 192, correct: false, text: "1965" },
      { challengeId: 192, correct: false, text: "1972" },
      { challengeId: 193, correct: true, text: "1989" },
      { challengeId: 193, correct: false, text: "1987" },
      { challengeId: 193, correct: false, text: "1991" },

      // Inventions
      { challengeId: 194, correct: true, text: "Alexander Graham Bell" },
      { challengeId: 194, correct: false, text: "Thomas Edison" },
      { challengeId: 194, correct: false, text: "Nikola Tesla" },
      { challengeId: 195, correct: true, text: "Gutenberg" },
      { challengeId: 195, correct: false, text: "Caxton" },
      { challengeId: 195, correct: false, text: "Fust" },
      { challengeId: 196, correct: true, text: "Thomas Edison" },
      { challengeId: 196, correct: false, text: "Nikola Tesla" },
      { challengeId: 196, correct: false, text: "Alexander Graham Bell" },

      // Peintres
      { challengeId: 197, correct: true, text: "Van Gogh" },
      { challengeId: 197, correct: false, text: "Monet" },
      { challengeId: 197, correct: false, text: "Cézanne" },
      { challengeId: 198, correct: true, text: "Picasso" },
      { challengeId: 198, correct: false, text: "Dalí" },
      { challengeId: 198, correct: false, text: "Miró" },
      { challengeId: 199, correct: true, text: "Monet" },
      { challengeId: 199, correct: false, text: "Renoir" },
      { challengeId: 199, correct: false, text: "Manet" },

      // Auteurs
      { challengeId: 300, correct: true, text: "Victor Hugo" },
      { challengeId: 300, correct: false, text: "Émile Zola" },
      { challengeId: 300, correct: false, text: "Honoré de Balzac" },
      { challengeId: 301, correct: true, text: "Tolstoï" },
      { challengeId: 301, correct: false, text: "Dostoïevski" },
      { challengeId: 301, correct: false, text: "Pouchkine" },
      { challengeId: 302, correct: true, text: "Saint-Exupéry" },
      { challengeId: 302, correct: false, text: "Jules Verne" },
      { challengeId: 302, correct: false, text: "Alexandre Dumas" },
      { challengeId: 303, correct: true, text: "Cervantes" },
      { challengeId: 303, correct: false, text: "Lope de Vega" },
      { challengeId: 303, correct: false, text: "Calderón" },
      { challengeId: 304, correct: true, text: "Shakespeare" },
      { challengeId: 304, correct: false, text: "Marlowe" },
      { challengeId: 304, correct: false, text: "Jonson" },

      // Musique
      { challengeId: 305, correct: true, text: "Beethoven" },
      { challengeId: 305, correct: false, text: "Mozart" },
      { challengeId: 305, correct: false, text: "Bach" },
      { challengeId: 306, correct: true, text: "Beethoven" },
      { challengeId: 306, correct: false, text: "Mozart" },
      { challengeId: 306, correct: false, text: "Bach" },
      { challengeId: 307, correct: true, text: "Elvis Presley" },
      { challengeId: 307, correct: false, text: "Chuck Berry" },
      { challengeId: 307, correct: false, text: "Little Richard" },
      { challengeId: 308, correct: true, text: "Queen" },
      { challengeId: 308, correct: false, text: "The Beatles" },
      { challengeId: 308, correct: false, text: "Led Zeppelin" },

      // Sciences
      { challengeId: 309, correct: true, text: "H₂O" },
      { challengeId: 309, correct: false, text: "CO₂" },
      { challengeId: 309, correct: false, text: "NaCl" },
      { challengeId: 310, correct: true, text: "E=mc²" },
      { challengeId: 310, correct: false, text: "F=ma" },
      { challengeId: 310, correct: false, text: "V=IR" },
      { challengeId: 311, correct: true, text: "Newton" },
      { challengeId: 311, correct: false, text: "Einstein" },
      { challengeId: 311, correct: false, text: "Galilée" },
      { challengeId: 312, correct: true, text: "Marie Curie" },
      { challengeId: 312, correct: false, text: "Pierre Curie" },
      { challengeId: 312, correct: false, text: "Becquerel" },

      // Biologie
      { challengeId: 313, correct: true, text: "Darwin" },
      { challengeId: 313, correct: false, text: "Lamarck" },
      { challengeId: 313, correct: false, text: "Mendel" },
      { challengeId: 314, correct: true, text: "La peau" },
      { challengeId: 314, correct: false, text: "Le foie" },
      { challengeId: 314, correct: false, text: "Le cœur" },
      { challengeId: 315, correct: true, text: "46" },
      { challengeId: 315, correct: false, text: "48" },
      { challengeId: 315, correct: false, text: "44" },

      // Astronomie
      { challengeId: 316, correct: true, text: "Mercure" },
      { challengeId: 316, correct: false, text: "Vénus" },
      { challengeId: 316, correct: false, text: "Mars" },
      { challengeId: 317, correct: true, text: "Jupiter" },
      { challengeId: 317, correct: false, text: "Saturne" },
      { challengeId: 317, correct: false, text: "Neptune" },
      { challengeId: 318, correct: true, text: "Mars" },
      { challengeId: 318, correct: false, text: "Vénus" },
      { challengeId: 318, correct: false, text: "Mercure" },
      { challengeId: 319, correct: true, text: "8" },
      { challengeId: 319, correct: false, text: "9" },
      { challengeId: 319, correct: false, text: "7" },

      // Mythologie Grecque
      { challengeId: 320, correct: true, text: "Poséidon" },
      { challengeId: 320, correct: false, text: "Zeus" },
      { challengeId: 320, correct: false, text: "Hadès" },
      { challengeId: 321, correct: true, text: "Zeus" },
      { challengeId: 321, correct: false, text: "Poséidon" },
      { challengeId: 321, correct: false, text: "Hadès" },
      { challengeId: 322, correct: true, text: "Athéna" },
      { challengeId: 322, correct: false, text: "Artémis" },
      { challengeId: 322, correct: false, text: "Héra" },
      { challengeId: 323, correct: true, text: "Prométhée" },
      { challengeId: 323, correct: false, text: "Épiméthée" },
      { challengeId: 323, correct: false, text: "Atlas" },
      { challengeId: 324, correct: true, text: "Thésée" },
      { challengeId: 324, correct: false, text: "Persée" },
      { challengeId: 324, correct: false, text: "Hercule" },
      { challengeId: 325, correct: true, text: "Dionysos", blank: 0 },

      // Mythologie Nordique
      { challengeId: 326, correct: true, text: "Thor" },
      { challengeId: 326, correct: false, text: "Odin" },
      { challengeId: 326, correct: false, text: "Loki" },
      { challengeId: 327, correct: true, text: "Ragnarök" },
      { challengeId: 327, correct: false, text: "Valhalla" },
      { challengeId: 327, correct: false, text: "Asgard" },
    ]);

    // ================================================
    // RÉINITIALISER TOUTES LES SÉQUENCES
    // ================================================
    console.log("🔄 Resetting sequences...");
    
    await sql`SELECT setval('courses_id_seq', (SELECT COALESCE(MAX(id), 0) FROM courses))`;
    await sql`SELECT setval('units_id_seq', (SELECT COALESCE(MAX(id), 0) FROM units))`;
    await sql`SELECT setval('lessons_id_seq', (SELECT COALESCE(MAX(id), 0) FROM lessons))`;
    await sql`SELECT setval('challenges_id_seq', (SELECT COALESCE(MAX(id), 0) FROM challenges))`;
    await sql`SELECT setval('challenge_options_id_seq', (SELECT COALESCE(MAX(id), 0) FROM challenge_options))`;

    console.log("✅ Seeding finished successfully!");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw new Error("Failed to seed the database");
  }
};

main();