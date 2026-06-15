import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema });

type ChallengeType = "SELECT" | "ASSIST" | "FILL_BLANK";

const addMoreAnglesContent = async () => {
  try {
    console.log("🚀 Ajout de contenu supplémentaire - Unité 2: Angles...\n");

    // 1. Vérifier que le cours Math 4ème existe
    let mathCourse = await db.query.courses.findFirst({
      where: (courses, { eq }) => eq(courses.title, "Math 4ème - Côte d'Ivoire")
    });

    if (!mathCourse) {
      const [newCourse] = await db.insert(schema.courses).values({
        title: "Math 4ème - Côte d'Ivoire",
        imageSrc: "/math4.svg"
      }).returning();
      mathCourse = newCourse;
      console.log(`✅ Cours créé: ${mathCourse.title} (ID: ${mathCourse.id})`);
    }

    const courseId = mathCourse.id;

    // 2. Vérifier si l'unité "Angles" existe
    let unit = await db.query.units.findFirst({
      where: (units, { eq }) => eq(units.title, "Angles")
    });

    if (!unit) {
      const existingUnits = await db.query.units.findMany({
        where: (units, { eq }) => eq(units.courseId, courseId)
      });
      
      const [newUnit] = await db.insert(schema.units).values({
        courseId: courseId,
        title: "Angles",
        description: "Angles alternes-internes, correspondants, angles au centre, arcs de cercle",
        order: existingUnits.length + 1
      }).returning();
      unit = newUnit;
      console.log(`✅ Unité créée: ${unit.title} (ID: ${unit.id})`);
    }

    // 3. Récupérer les leçons existantes
    const existingLessons = await db.query.lessons.findMany({
      where: (lessons, { eq }) => eq(lessons.unitId, unit.id)
    });
    let nextLessonOrder = existingLessons.length + 1;

    console.log(`   Leçons existantes: ${existingLessons.length}`);
    console.log(`   Prochain order: ${nextLessonOrder}\n`);

    // ================================================
    // LEÇON 6: ANGLES COMPLÉMENTAIRES ET SUPPLÉMENTAIRES
    // ================================================
    console.log("📖 Création de la leçon: Angles complémentaires et supplémentaires");
    
    const [lesson6] = await db.insert(schema.lessons).values({
      unitId: unit.id,
      order: nextLessonOrder++,
      title: "Angles complémentaires et supplémentaires"
    }).returning();

    const challenges6 = await db.insert(schema.challenges).values([
      { lessonId: lesson6.id, type: "SELECT", order: 1, question: "Deux angles complémentaires ont une somme de combien de degrés ?" },
      { lessonId: lesson6.id, type: "SELECT", order: 2, question: "Deux angles supplémentaires ont une somme de combien de degrés ?" },
      { lessonId: lesson6.id, type: "SELECT", order: 3, question: "Trouve le complément de 35°" },
      { lessonId: lesson6.id, type: "SELECT", order: 4, question: "Trouve le supplément de 110°" },
      { lessonId: lesson6.id, type: "SELECT", order: 5, question: "Trouve le complément de 48°" },
      { lessonId: lesson6.id, type: "SELECT", order: 6, question: "Trouve le supplément de 65°" },
      { lessonId: lesson6.id, type: "ASSIST", order: 7, question: "Un angle mesure 27°. Quelle est la mesure de son complément ?" },
      { lessonId: lesson6.id, type: "ASSIST", order: 8, question: "Un angle mesure 132°. Quelle est la mesure de son supplément ?" },
      { lessonId: lesson6.id, type: "ASSIST", order: 9, question: "Deux angles sont complémentaires. L'un mesure le double de l'autre. Trouve les mesures." },
      { lessonId: lesson6.id, type: "ASSIST", order: 10, question: "Deux angles sont supplémentaires. L'un mesure 30° de plus que l'autre. Trouve les mesures." },
      { lessonId: lesson6.id, type: "FILL_BLANK", order: 11, question: "La somme de deux angles complémentaires est ___°" },
      { lessonId: lesson6.id, type: "FILL_BLANK", order: 12, question: "La somme de deux angles supplémentaires est ___°" }
    ]).returning();

    // ================================================
    // LEÇON 7: ANGLES OPPOSÉS PAR LE SOMMET
    // ================================================
    console.log("\n📖 Création de la leçon: Angles opposés par le sommet");
    
    const [lesson7] = await db.insert(schema.lessons).values({
      unitId: unit.id,
      order: nextLessonOrder++,
      title: "Angles opposés par le sommet"
    }).returning();

    const challenges7 = await db.insert(schema.challenges).values([
      { lessonId: lesson7.id, type: "SELECT", order: 1, question: "Deux angles opposés par le sommet sont..." },
      { lessonId: lesson7.id, type: "SELECT", order: 2, question: "Si un angle mesure 50°, que vaut son opposé par le sommet ?" },
      { lessonId: lesson7.id, type: "SELECT", order: 3, question: "Deux angles opposés par le sommet sont formés par..." },
      { lessonId: lesson7.id, type: "ASSIST", order: 4, question: "Deux droites sécantes forment quatre angles. Deux angles opposés sont..." },
      { lessonId: lesson7.id, type: "ASSIST", order: 5, question: "Si l'angle A mesure 72°, calcule l'angle qui lui est opposé par le sommet" },
      { lessonId: lesson7.id, type: "ASSIST", order: 6, question: "Deux angles opposés par le sommet sont toujours..." },
      { lessonId: lesson7.id, type: "FILL_BLANK", order: 7, question: "Des angles opposés par le sommet ont leur sommet en ___" },
      { lessonId: lesson7.id, type: "FILL_BLANK", order: 8, question: "Deux angles opposés par le sommet sont toujours de même ___" }
    ]).returning();

    // ================================================
    // LEÇON 8: ANGLES D'UN TRIANGLE
    // ================================================
    console.log("\n📖 Création de la leçon: Angles d'un triangle");
    
    const [lesson8] = await db.insert(schema.lessons).values({
      unitId: unit.id,
      order: nextLessonOrder++,
      title: "Angles d'un triangle"
    }).returning();

    const challenges8 = await db.insert(schema.challenges).values([
      { lessonId: lesson8.id, type: "SELECT", order: 1, question: "La somme des angles d'un triangle est de combien de degrés ?" },
      { lessonId: lesson8.id, type: "SELECT", order: 2, question: "Un triangle a deux angles de 30° et 70°. Calcule le troisième angle" },
      { lessonId: lesson8.id, type: "SELECT", order: 3, question: "Un triangle isocèle a un angle de 40°. Quelles sont les mesures possibles des autres angles ?" },
      { lessonId: lesson8.id, type: "SELECT", order: 4, question: "Un triangle rectangle a un angle de 35°. Trouve les autres angles" },
      { lessonId: lesson8.id, type: "ASSIST", order: 5, question: "Un triangle a des angles dans le rapport 2:3:5. Calcule les mesures" },
      { lessonId: lesson8.id, type: "ASSIST", order: 6, question: "Un triangle équilatéral a tous ses angles égaux. Combien mesure chaque angle ?" },
      { lessonId: lesson8.id, type: "ASSIST", order: 7, question: "Un triangle isocèle rectangle. Trouve les mesures de ses angles" },
      { lessonId: lesson8.id, type: "ASSIST", order: 8, question: "Un angle extérieur d'un triangle est égal à la somme des deux angles intérieurs non adjacents. Vrai ou faux ?" },
      { lessonId: lesson8.id, type: "FILL_BLANK", order: 9, question: "La somme des angles d'un triangle est ___°" },
      { lessonId: lesson8.id, type: "FILL_BLANK", order: 10, question: "Un triangle rectangle a un angle droit et deux angles ___" }
    ]).returning();

    // ================================================
    // LEÇON 9: CALCUL D'ANGLES DANS LES FIGURES
    // ================================================
    console.log("\n📖 Création de la leçon: Calcul d'angles dans les figures");
    
    const [lesson9] = await db.insert(schema.lessons).values({
      unitId: unit.id,
      order: nextLessonOrder++,
      title: "Calcul d'angles dans les figures"
    }).returning();

    const challenges9 = await db.insert(schema.challenges).values([
      { lessonId: lesson9.id, type: "SELECT", order: 1, question: "Dans un parallélogramme, les angles opposés sont..." },
      { lessonId: lesson9.id, type: "SELECT", order: 2, question: "Dans un parallélogramme, les angles consécutifs sont..." },
      { lessonId: lesson9.id, type: "SELECT", order: 3, question: "Dans un rectangle, chaque angle mesure..." },
      { lessonId: lesson9.id, type: "SELECT", order: 4, question: "Dans un losange, les angles opposés sont..." },
      { lessonId: lesson9.id, type: "ASSIST", order: 5, question: "Un parallélogramme a un angle de 65°. Trouve les autres angles" },
      { lessonId: lesson9.id, type: "ASSIST", order: 6, question: "Dans un trapèze isocèle, que peut-on dire des angles à la base ?" },
      { lessonId: lesson9.id, type: "ASSIST", order: 7, question: "Un cerf-volant a un angle de 120° et un autre de 80°. Trouve les deux autres angles" },
      { lessonId: lesson9.id, type: "ASSIST", order: 8, question: "Dans un pentagone régulier, combien mesure chaque angle intérieur ?" },
      { lessonId: lesson9.id, type: "FILL_BLANK", order: 9, question: "Un parallélogramme a ses angles ___ deux à deux" },
      { lessonId: lesson9.id, type: "FILL_BLANK", order: 10, question: "La somme des angles d'un quadrilatère est ___°" }
    ]).returning();

    // ================================================
    // LEÇON 10: ANGLES INSCRITS ET ANGLE AU CENTRE
    // ================================================
    console.log("\n📖 Création de la leçon: Angles inscrits et angle au centre");
    
    const [lesson10] = await db.insert(schema.lessons).values({
      unitId: unit.id,
      order: nextLessonOrder++,
      title: "Angles inscrits et angle au centre"
    }).returning();

    const challenges10 = await db.insert(schema.challenges).values([
      { lessonId: lesson10.id, type: "SELECT", order: 1, question: "Qu'est-ce qu'un angle inscrit dans un cercle ?" },
      { lessonId: lesson10.id, type: "SELECT", order: 2, question: "Relation entre un angle au centre et un angle inscrit qui interceptent le même arc" },
      { lessonId: lesson10.id, type: "SELECT", order: 3, question: "Si un angle au centre mesure 80°, que vaut l'angle inscrit qui intercepte le même arc ?" },
      { lessonId: lesson10.id, type: "SELECT", order: 4, question: "Si un angle inscrit mesure 35°, que vaut l'angle au centre correspondant ?" },
      { lessonId: lesson10.id, type: "ASSIST", order: 5, question: "Un angle inscrit dans un demi-cercle est un angle..." },
      { lessonId: lesson10.id, type: "ASSIST", order: 6, question: "Deux angles inscrits qui interceptent le même arc sont..." },
      { lessonId: lesson10.id, type: "ASSIST", order: 7, question: "Calcule l'angle au centre qui intercepte un arc de 120°" },
      { lessonId: lesson10.id, type: "ASSIST", order: 8, question: "Un angle inscrit intercepte un arc de 100°. Quelle est sa mesure ?" },
      { lessonId: lesson10.id, type: "FILL_BLANK", order: 9, question: "Un angle inscrit a son sommet sur le ___" },
      { lessonId: lesson10.id, type: "FILL_BLANK", order: 10, question: "L'angle au centre est ___ fois plus grand que l'angle inscrit qui intercepte le même arc" }
    ]).returning();

    // ================================================
    // LEÇON 11: ANGLES ET PARALLÉLISME (APPROFONDISSEMENT)
    // ================================================
    console.log("\n📖 Création de la leçon: Angles et parallélisme (approfondissement)");
    
    const [lesson11] = await db.insert(schema.lessons).values({
      unitId: unit.id,
      order: nextLessonOrder++,
      title: "Angles et parallélisme (approfondissement)"
    }).returning();

    const challenges11 = await db.insert(schema.challenges).values([
      { lessonId: lesson11.id, type: "SELECT", order: 1, question: "Deux droites parallèles coupées par une sécante forment des angles alternes-internes..." },
      { lessonId: lesson11.id, type: "SELECT", order: 2, question: "Deux droites parallèles coupées par une sécante forment des angles correspondants..." },
      { lessonId: lesson11.id, type: "SELECT", order: 3, question: "Si deux angles alternes-internes sont égaux, alors les droites sont..." },
      { lessonId: lesson11.id, type: "SELECT", order: 4, question: "Si deux angles correspondants sont égaux, alors les droites sont..." },
      { lessonId: lesson11.id, type: "ASSIST", order: 5, question: "Deux droites parallèles sont coupées par une sécante. Un angle mesure 45°. Trouve la mesure de son correspondant" },
      { lessonId: lesson11.id, type: "ASSIST", order: 6, question: "Deux droites parallèles sont coupées par une sécante. Un angle mesure 120°. Trouve la mesure de son alterne-interne" },
      { lessonId: lesson11.id, type: "ASSIST", order: 7, question: "Deux droites parallèles sont coupées par une sécante. Un angle mesure 30°. Trouve la mesure de son angle opposé par le sommet" },
      { lessonId: lesson11.id, type: "ASSIST", order: 8, question: "Deux droites parallèles sont coupées par une sécante. La somme de deux angles correspondants est 140°. Que vaut chaque angle ?" },
      { lessonId: lesson11.id, type: "FILL_BLANK", order: 9, question: "Si deux droites sont parallèles, alors les angles alternes-internes sont ___" },
      { lessonId: lesson11.id, type: "FILL_BLANK", order: 10, question: "Si deux droites sont parallèles, alors les angles correspondants sont ___" }
    ]).returning();

    // ================================================
    // LEÇON 12: ANGLES D'UN POLYGONE RÉGULIER
    // ================================================
    console.log("\n📖 Création de la leçon: Angles d'un polygone régulier");
    
    const [lesson12] = await db.insert(schema.lessons).values({
      unitId: unit.id,
      order: nextLessonOrder++,
      title: "Angles d'un polygone régulier"
    }).returning();

    const challenges12 = await db.insert(schema.challenges).values([
      { lessonId: lesson12.id, type: "SELECT", order: 1, question: "Formule de la somme des angles intérieurs d'un polygone à n côtés" },
      { lessonId: lesson12.id, type: "SELECT", order: 2, question: "Calcule la somme des angles d'un hexagone" },
      { lessonId: lesson12.id, type: "SELECT", order: 3, question: "Calcule la mesure de chaque angle intérieur d'un pentagone régulier" },
      { lessonId: lesson12.id, type: "SELECT", order: 4, question: "Calcule la mesure de chaque angle intérieur d'un octogone régulier" },
      { lessonId: lesson12.id, type: "ASSIST", order: 5, question: "Un polygone régulier a des angles intérieurs de 140°. Combien de côtés a-t-il ?" },
      { lessonId: lesson12.id, type: "ASSIST", order: 6, question: "Calcule la somme des angles d'un décagone" },
      { lessonId: lesson12.id, type: "ASSIST", order: 7, question: "Un polygone régulier a 12 côtés. Calcule son angle intérieur" },
      { lessonId: lesson12.id, type: "ASSIST", order: 8, question: "Un polygone régulier a un angle extérieur de 30°. Combien de côtés a-t-il ?" },
      { lessonId: lesson12.id, type: "FILL_BLANK", order: 9, question: "La somme des angles d'un polygone à n côtés est (n-2) × ___" },
      { lessonId: lesson12.id, type: "FILL_BLANK", order: 10, question: "Un polygone régulier a tous ses côtés ___ et tous ses angles égaux" }
    ]).returning();

    // ================================================
    // LEÇON 13: ANGLES ET CERCLE (APPROFONDISSEMENT)
    // ================================================
    console.log("\n📖 Création de la leçon: Angles et cercle (approfondissement)");
    
    const [lesson13] = await db.insert(schema.lessons).values({
      unitId: unit.id,
      order: nextLessonOrder++,
      title: "Angles et cercle (approfondissement)"
    }).returning();

    const challenges13 = await db.insert(schema.challenges).values([
      { lessonId: lesson13.id, type: "SELECT", order: 1, question: "Un angle inscrit dans un cercle est égal à la moitié de l'angle au centre qui intercepte le même arc. Vrai ou faux ?" },
      { lessonId: lesson13.id, type: "SELECT", order: 2, question: "Deux angles inscrits qui interceptent le même arc sont..." },
      { lessonId: lesson13.id, type: "SELECT", order: 3, question: "Si un angle inscrit intercepte un demi-cercle, que vaut-il ?" },
      { lessonId: lesson13.id, type: "SELECT", order: 4, question: "Un angle au centre de 180° intercepte un..." },
      { lessonId: lesson13.id, type: "ASSIST", order: 5, question: "Un angle inscrit de 40° intercepte quel arc ?" },
      { lessonId: lesson13.id, type: "ASSIST", order: 6, question: "Un angle au centre de 150° intercepte un arc de combien de degrés ?" },
      { lessonId: lesson13.id, type: "ASSIST", order: 7, question: "Deux angles inscrits interceptent le même arc de 100°. Que valent-ils ?" },
      { lessonId: lesson13.id, type: "ASSIST", order: 8, question: "Un triangle inscrit dans un demi-cercle est toujours..." },
      { lessonId: lesson13.id, type: "FILL_BLANK", order: 9, question: "Un angle inscrit vaut la moitié de l'angle ___ qui intercepte le même arc" },
      { lessonId: lesson13.id, type: "FILL_BLANK", order: 10, question: "Un triangle rectangle peut être inscrit dans un ___" }
    ]).returning();

    // ================================================
    // LEÇON 14: PROBLÈMES D'ANGLES (MISE EN ÉQUATION)
    // ================================================
    console.log("\n📖 Création de la leçon: Problèmes d'angles (mise en équation)");
    
    const [lesson14] = await db.insert(schema.lessons).values({
      unitId: unit.id,
      order: nextLessonOrder++,
      title: "Problèmes d'angles (mise en équation)"
    }).returning();

    const challenges14 = await db.insert(schema.challenges).values([
      { lessonId: lesson14.id, type: "SELECT", order: 1, question: "Un angle et son complément sont dans le rapport 2:3. Trouve les angles" },
      { lessonId: lesson14.id, type: "SELECT", order: 2, question: "Un angle et son supplément sont dans le rapport 1:4. Trouve les angles" },
      { lessonId: lesson14.id, type: "SELECT", order: 3, question: "Deux angles complémentaires ont une différence de 20°. Trouve les angles" },
      { lessonId: lesson14.id, type: "SELECT", order: 4, question: "Deux angles supplémentaires ont une différence de 40°. Trouve les angles" },
      { lessonId: lesson14.id, type: "ASSIST", order: 5, question: "Le complément d'un angle est égal au double de l'angle. Trouve l'angle" },
      { lessonId: lesson14.id, type: "ASSIST", order: 6, question: "Le supplément d'un angle est égal au triple de l'angle. Trouve l'angle" },
      { lessonId: lesson14.id, type: "ASSIST", order: 7, question: "Un angle est tel que son complément est égal à son supplément. Trouve l'angle" },
      { lessonId: lesson14.id, type: "ASSIST", order: 8, question: "Deux angles sont complémentaires. L'un est le quadruple de l'autre. Trouve les angles" },
      { lessonId: lesson14.id, type: "FILL_BLANK", order: 9, question: "Si x est l'angle, son complément s'écrit ___ - x" },
      { lessonId: lesson14.id, type: "FILL_BLANK", order: 10, question: "Si x est l'angle, son supplément s'écrit ___ - x" }
    ]).returning();

    // ================================================
    // LEÇON 15: ANGLES ET BISSECTRICE
    // ================================================
    console.log("\n📖 Création de la leçon: Angles et bissectrice");
    
    const [lesson15] = await db.insert(schema.lessons).values({
      unitId: unit.id,
      order: nextLessonOrder++,
      title: "Angles et bissectrice"
    }).returning();

    const challenges15 = await db.insert(schema.challenges).values([
      { lessonId: lesson15.id, type: "SELECT", order: 1, question: "Qu'est-ce que la bissectrice d'un angle ?" },
      { lessonId: lesson15.id, type: "SELECT", order: 2, question: "Comment construit-on la bissectrice d'un angle au compas ?" },
      { lessonId: lesson15.id, type: "SELECT", order: 3, question: "Si un angle mesure 80°, que vaut la moitié formée par sa bissectrice ?" },
      { lessonId: lesson15.id, type: "ASSIST", order: 4, question: "Un angle est partagé par sa bissectrice en deux angles de 35°. Que vaut l'angle total ?" },
      { lessonId: lesson15.id, type: "ASSIST", order: 5, question: "La bissectrice d'un angle de 120° le partage en deux angles de combien ?" },
      { lessonId: lesson15.id, type: "ASSIST", order: 6, question: "Deux droites sont perpendiculaires. Leurs bissectrices forment un angle de combien ?" },
      { lessonId: lesson15.id, type: "ASSIST", order: 7, question: "Les bissectrices de deux angles supplémentaires sont perpendiculaires. Vrai ou faux ?" },
      { lessonId: lesson15.id, type: "FILL_BLANK", order: 8, question: "La bissectrice d'un angle est la demi-droite qui partage l'angle en deux angles ___" },
      { lessonId: lesson15.id, type: "FILL_BLANK", order: 9, question: "Tout point de la bissectrice d'un angle est équidistant des ___ de l'angle" }
    ]).returning();

    // ================================================
    // CRÉATION DES OPTIONS
    // ================================================
    
    console.log("\n🔧 Création des options pour tous les challenges...");
    
    const allOptions: {
      challengeId: number;
      correct: boolean;
      text: string;
      blank?: number | null;
      order?: number | null;
    }[] = [];

    const addOptions = (challenges: any[], optionsList: { text: string; correct: boolean; blank?: number; order?: number }[][]) => {
      challenges.forEach((challenge, idx) => {
        const options = optionsList[idx];
        if (options) {
          options.forEach(opt => {
            allOptions.push({
              challengeId: challenge.id,
              correct: opt.correct,
              text: opt.text,
              blank: opt.blank,
              order: opt.order
            });
          });
        }
      });
    };

    // Options pour Leçon 6 (Angles complémentaires/supplémentaires)
    const lesson6Options = [
      [{ text: "90°", correct: true }, { text: "180°", correct: false }, { text: "360°", correct: false }],
      [{ text: "180°", correct: true }, { text: "90°", correct: false }, { text: "360°", correct: false }],
      [{ text: "55°", correct: true }, { text: "145°", correct: false }, { text: "35°", correct: false }],
      [{ text: "70°", correct: true }, { text: "250°", correct: false }, { text: "110°", correct: false }],
      [{ text: "42°", correct: true }, { text: "52°", correct: false }, { text: "38°", correct: false }],
      [{ text: "115°", correct: true }, { text: "25°", correct: false }, { text: "125°", correct: false }],
      [{ text: "63°", correct: true }, { text: "153°", correct: false }, { text: "27°", correct: false }],
      [{ text: "48°", correct: true }, { text: "228°", correct: false }, { text: "132°", correct: false }],
      [{ text: "30° et 60°", correct: true }, { text: "20° et 40°", correct: false }, { text: "45° et 45°", correct: false }],
      [{ text: "75° et 105°", correct: true }, { text: "80° et 100°", correct: false }, { text: "70° et 110°", correct: false }],
      [{ text: "90", correct: true, blank: 0 }, { text: "90", correct: false, blank: 0 }],
      [{ text: "180", correct: true, blank: 0 }, { text: "180", correct: false, blank: 0 }]
    ];
    addOptions(challenges6, lesson6Options);

    // Options pour Leçon 7 (Angles opposés par le sommet)
    const lesson7Options = [
      [{ text: "Égaux", correct: true }, { text: "Supplémentaires", correct: false }, { text: "Complémentaires", correct: false }],
      [{ text: "50°", correct: true }, { text: "130°", correct: false }, { text: "40°", correct: false }],
      [{ text: "Deux droites sécantes", correct: true }, { text: "Deux droites parallèles", correct: false }, { text: "Un cercle", correct: false }],
      [{ text: "Égaux", correct: true }, { text: "Supplémentaires", correct: false }, { text: "Opposés", correct: false }],
      [{ text: "72°", correct: true }, { text: "18°", correct: false }, { text: "108°", correct: false }],
      [{ text: "Égaux", correct: true }, { text: "De même mesure", correct: false }, { text: "Opposés", correct: false }],
      [{ text: "commun", correct: true, blank: 0 }, { text: "commun", correct: false, blank: 0 }],
      [{ text: "mesure", correct: true, blank: 0 }, { text: "mesure", correct: false, blank: 0 }]
    ];
    addOptions(challenges7, lesson7Options);

    // Options pour Leçon 8 (Angles d'un triangle)
    const lesson8Options = [
      [{ text: "180°", correct: true }, { text: "90°", correct: false }, { text: "360°", correct: false }],
      [{ text: "80°", correct: true }, { text: "100°", correct: false }, { text: "70°", correct: false }],
      [{ text: "40° et 100° ou 70° et 70°", correct: true }, { text: "40° et 140°", correct: false }, { text: "80° et 80°", correct: false }],
      [{ text: "90° et 55°", correct: true }, { text: "90° et 45°", correct: false }, { text: "90° et 65°", correct: false }],
      [{ text: "36°, 54°, 90°", correct: true }, { text: "30°, 60°, 90°", correct: false }, { text: "40°, 60°, 80°", correct: false }],
      [{ text: "60°", correct: true }, { text: "90°", correct: false }, { text: "45°", correct: false }],
      [{ text: "45°, 45°, 90°", correct: true }, { text: "30°, 60°, 90°", correct: false }, { text: "40°, 50°, 90°", correct: false }],
      [{ text: "Vrai", correct: true }, { text: "Faux", correct: false }, { text: "Parfois", correct: false }],
      [{ text: "180", correct: true, blank: 0 }, { text: "180", correct: false, blank: 0 }],
      [{ text: "aigus", correct: true, blank: 0 }, { text: "complémentaires", correct: false, blank: 0 }]
    ];
    addOptions(challenges8, lesson8Options);

    // Options pour Leçon 9 (Calcul d'angles dans les figures)
    const lesson9Options = [
      [{ text: "Égaux", correct: true }, { text: "Supplémentaires", correct: false }, { text: "Complémentaires", correct: false }],
      [{ text: "Supplémentaires", correct: true }, { text: "Égaux", correct: false }, { text: "Opposés", correct: false }],
      [{ text: "90°", correct: true }, { text: "60°", correct: false }, { text: "45°", correct: false }],
      [{ text: "Égaux", correct: true }, { text: "Supplémentaires", correct: false }, { text: "Opposés", correct: false }],
      [{ text: "65°, 115°, 115°", correct: true }, { text: "65°, 65°, 115°", correct: false }, { text: "65°, 125°, 125°", correct: false }],
      [{ text: "Ils sont égaux", correct: true }, { text: "Ils sont supplémentaires", correct: false }, { text: "Ils sont opposés", correct: false }],
      [{ text: "60° et 100°", correct: true }, { text: "70° et 90°", correct: false }, { text: "50° et 110°", correct: false }],
      [{ text: "108°", correct: true }, { text: "120°", correct: false }, { text: "90°", correct: false }],
      [{ text: "égaux", correct: true, blank: 0 }, { text: "opposés", correct: false, blank: 0 }],
      [{ text: "360", correct: true, blank: 0 }, { text: "360", correct: false, blank: 0 }]
    ];
    addOptions(challenges9, lesson9Options);

    // Options pour Leçon 10 (Angles inscrits)
    const lesson10Options = [
      [{ text: "Un angle dont le sommet est sur le cercle", correct: true }, { text: "Un angle dont le sommet est au centre", correct: false }, { text: "Un angle droit", correct: false }],
      [{ text: "Angle au centre = 2 × angle inscrit", correct: true }, { text: "Angle inscrit = 2 × angle au centre", correct: false }, { text: "Ils sont égaux", correct: false }],
      [{ text: "40°", correct: true }, { text: "80°", correct: false }, { text: "160°", correct: false }],
      [{ text: "70°", correct: true }, { text: "35°", correct: false }, { text: "17,5°", correct: false }],
      [{ text: "Droit (90°)", correct: true }, { text: "Aigu", correct: false }, { text: "Obtus", correct: false }],
      [{ text: "Égaux", correct: true }, { text: "Supplémentaires", correct: false }, { text: "Opposés", correct: false }],
      [{ text: "240°", correct: true }, { text: "120°", correct: false }, { text: "60°", correct: false }],
      [{ text: "50°", correct: true }, { text: "100°", correct: false }, { text: "200°", correct: false }],
      [{ text: "cercle", correct: true, blank: 0 }, { text: "cercle", correct: false, blank: 0 }],
      [{ text: "2", correct: true, blank: 0 }, { text: "2", correct: false, blank: 0 }]
    ];
    addOptions(challenges10, lesson10Options);

    // Options pour Leçon 11 (Angles et parallélisme)
    const lesson11Options = [
      [{ text: "Égaux", correct: true }, { text: "Supplémentaires", correct: false }, { text: "Opposés", correct: false }],
      [{ text: "Égaux", correct: true }, { text: "Supplémentaires", correct: false }, { text: "Opposés", correct: false }],
      [{ text: "Parallèles", correct: true }, { text: "Perpendiculaires", correct: false }, { text: "Sécantes", correct: false }],
      [{ text: "Parallèles", correct: true }, { text: "Perpendiculaires", correct: false }, { text: "Sécantes", correct: false }],
      [{ text: "45°", correct: true }, { text: "135°", correct: false }, { text: "90°", correct: false }],
      [{ text: "120°", correct: true }, { text: "60°", correct: false }, { text: "30°", correct: false }],
      [{ text: "30°", correct: true }, { text: "150°", correct: false }, { text: "60°", correct: false }],
      [{ text: "70°", correct: true }, { text: "35°", correct: false }, { text: "140°", correct: false }],
      [{ text: "égaux", correct: true, blank: 0 }, { text: "supplémentaires", correct: false, blank: 0 }],
      [{ text: "égaux", correct: true, blank: 0 }, { text: "supplémentaires", correct: false, blank: 0 }]
    ];
    addOptions(challenges11, lesson11Options);

    // Options pour Leçon 12 (Polygones réguliers)
    const lesson12Options = [
      [{ text: "(n-2) × 180°", correct: true }, { text: "n × 180°", correct: false }, { text: "(n-2) × 90°", correct: false }],
      [{ text: "720°", correct: true }, { text: "540°", correct: false }, { text: "900°", correct: false }],
      [{ text: "108°", correct: true }, { text: "120°", correct: false }, { text: "90°", correct: false }],
      [{ text: "135°", correct: true }, { text: "120°", correct: false }, { text: "140°", correct: false }],
      [{ text: "9 côtés", correct: true }, { text: "8 côtés", correct: false }, { text: "10 côtés", correct: false }],
      [{ text: "1440°", correct: true }, { text: "1800°", correct: false }, { text: "1260°", correct: false }],
      [{ text: "150°", correct: true }, { text: "140°", correct: false }, { text: "160°", correct: false }],
      [{ text: "12 côtés", correct: true }, { text: "10 côtés", correct: false }, { text: "8 côtés", correct: false }],
      [{ text: "180", correct: true, blank: 0 }, { text: "180", correct: false, blank: 0 }],
      [{ text: "égaux", correct: true, blank: 0 }, { text: "égaux", correct: false, blank: 0 }]
    ];
    addOptions(challenges12, lesson12Options);

    // Options pour Leçon 13 (Angles et cercle)
    const lesson13Options = [
      [{ text: "Vrai", correct: true }, { text: "Faux", correct: false }, { text: "Parfois", correct: false }],
      [{ text: "Égaux", correct: true }, { text: "Supplémentaires", correct: false }, { text: "Opposés", correct: false }],
      [{ text: "90°", correct: true }, { text: "180°", correct: false }, { text: "45°", correct: false }],
      [{ text: "Demi-cercle", correct: true }, { text: "Cercle complet", correct: false }, { text: "Arc", correct: false }],
      [{ text: "80°", correct: true }, { text: "40°", correct: false }, { text: "160°", correct: false }],
      [{ text: "150°", correct: true }, { text: "75°", correct: false }, { text: "300°", correct: false }],
      [{ text: "50°", correct: true }, { text: "100°", correct: false }, { text: "25°", correct: false }],
      [{ text: "Rectangle", correct: true }, { text: "Isocèle", correct: false }, { text: "Équilatéral", correct: false }],
      [{ text: "au centre", correct: true, blank: 0 }, { text: "au centre", correct: false, blank: 0 }],
      [{ text: "demi-cercle", correct: true, blank: 0 }, { text: "demi-cercle", correct: false, blank: 0 }]
    ];
    addOptions(challenges13, lesson13Options);

    // Options pour Leçon 14 (Problèmes d'angles)
    const lesson14Options = [
      [{ text: "36° et 54°", correct: true }, { text: "30° et 60°", correct: false }, { text: "40° et 60°", correct: false }],
      [{ text: "36° et 144°", correct: true }, { text: "45° et 135°", correct: false }, { text: "30° et 120°", correct: false }],
      [{ text: "35° et 55°", correct: true }, { text: "40° et 60°", correct: false }, { text: "30° et 50°", correct: false }],
      [{ text: "70° et 110°", correct: true }, { text: "60° et 120°", correct: false }, { text: "80° et 100°", correct: false }],
      [{ text: "30°", correct: true }, { text: "45°", correct: false }, { text: "60°", correct: false }],
      [{ text: "45°", correct: true }, { text: "30°", correct: false }, { text: "60°", correct: false }],
      [{ text: "90°", correct: true }, { text: "45°", correct: false }, { text: "60°", correct: false }],
      [{ text: "18° et 72°", correct: true }, { text: "20° et 80°", correct: false }, { text: "15° et 75°", correct: false }],
      [{ text: "90", correct: true, blank: 0 }, { text: "90", correct: false, blank: 0 }],
      [{ text: "180", correct: true, blank: 0 }, { text: "180", correct: false, blank: 0 }]
    ];
    addOptions(challenges14, lesson14Options);

    // Options pour Leçon 15 (Angles et bissectrice)
    const lesson15Options = [
      [{ text: "La demi-droite qui partage l'angle en deux angles égaux", correct: true }, { text: "La droite perpendiculaire", correct: false }, { text: "La médiatrice", correct: false }],
      [{ text: "Avec un compas en traçant des arcs de cercle", correct: true }, { text: "Avec une règle seulement", correct: false }, { text: "Avec un rapporteur", correct: false }],
      [{ text: "40°", correct: true }, { text: "20°", correct: false }, { text: "80°", correct: false }],
      [{ text: "70°", correct: true }, { text: "35°", correct: false }, { text: "105°", correct: false }],
      [{ text: "60°", correct: true }, { text: "30°", correct: false }, { text: "120°", correct: false }],
      [{ text: "45°", correct: true }, { text: "90°", correct: false }, { text: "30°", correct: false }],
      [{ text: "Vrai", correct: true }, { text: "Faux", correct: false }, { text: "Parfois", correct: false }],
      [{ text: "égaux", correct: true, blank: 0 }, { text: "complémentaires", correct: false, blank: 0 }],
      [{ text: "côtés", correct: true, blank: 0 }, { text: "côtés", correct: false, blank: 0 }]
    ];
    addOptions(challenges15, lesson15Options);

    // Insertion de toutes les options
    if (allOptions.length > 0) {
      await db.insert(schema.challengeOptions).values(allOptions);
      console.log(`✅ ${allOptions.length} options créées`);
    }

    // ================================================
    // RÉSUMÉ FINAL
    // ================================================
    console.log("\n" + "=".repeat(70));
    console.log("📊 RÉSUMÉ DE L'AJOUT DE CONTENU - UNITÉ 2: ANGLES");
    console.log("=".repeat(70));
    
    const allChallenges = [...challenges6, ...challenges7, ...challenges8, ...challenges9, ...challenges10, ...challenges11, ...challenges12, ...challenges13, ...challenges14, ...challenges15];
    
    console.log(`\n📚 Unité: Angles`);
    console.log(`\n📖 Nouvelles leçons ajoutées: 10`);
    console.log(`   6. Angles complémentaires et supplémentaires - ${challenges6.length} challenges`);
    console.log(`   7. Angles opposés par le sommet - ${challenges7.length} challenges`);
    console.log(`   8. Angles d'un triangle - ${challenges8.length} challenges`);
    console.log(`   9. Calcul d'angles dans les figures - ${challenges9.length} challenges`);
    console.log(`   10. Angles inscrits et angle au centre - ${challenges10.length} challenges`);
    console.log(`   11. Angles et parallélisme (approfondissement) - ${challenges11.length} challenges`);
    console.log(`   12. Angles d'un polygone régulier - ${challenges12.length} challenges`);
    console.log(`   13. Angles et cercle (approfondissement) - ${challenges13.length} challenges`);
    console.log(`   14. Problèmes d'angles (mise en équation) - ${challenges14.length} challenges`);
    console.log(`   15. Angles et bissectrice - ${challenges15.length} challenges`);
    
    console.log(`\n🎯 Total de nouveaux challenges: ${allChallenges.length}`);
    console.log(`🔢 Total d'options: ${allOptions.length}`);
    
    const totalLessons = existingLessons.length + 10;
    console.log(`\n📚 L'unité compte maintenant ${totalLessons} leçons au total.`);
    
    console.log("\n✅ Ajout de contenu pour l'unité Angles terminé avec succès !");

  } catch (error) {
    console.error("❌ Erreur lors de l'ajout:", error);
    throw new Error("Échec de l'ajout de contenu");
  }
};

// Exécuter la fonction
addMoreAnglesContent();