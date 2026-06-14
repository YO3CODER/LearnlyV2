import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema });

type ChallengeType = "SELECT" | "ASSIST" | "FILL_BLANK";

const addMimiFrenchConjugationCourse = async () => {
  try {
    console.log("🚀 Création du cours Mimi - Conjugaison Française...\n");

    // 1. Créer le cours Mimi
    const [mimiCourse] = await db.insert(schema.courses).values({
      title: "Mimi - Conjugaison Française",
      imageSrc: "/mimi.svg"
    }).returning();

    const courseId = mimiCourse.id;
    console.log(`✅ Cours créé: ${mimiCourse.title} (ID: ${courseId})`);

    // 2. Variables pour l'ordre
    let unitOrder = 1;

    // ================================================
    // UNITÉ 1: Les Verbes du 1er Groupe (-ER)
    // ================================================
    console.log("\n📦 Création de l'unité 1: Les Verbes du 1er Groupe (-ER)");
    
    const [unit1] = await db.insert(schema.units).values({
      courseId: courseId,
      title: "Les Verbes du 1er Groupe (-ER)",
      description: "Apprenez à conjuguer les verbes en -ER au présent, passé composé, imparfait et futur",
      order: unitOrder++
    }).returning();

    const lessons1 = await db.insert(schema.lessons).values([
      { unitId: unit1.id, order: 1, title: "Présent - Verbes en -ER" },
      { unitId: unit1.id, order: 2, title: "Passé Composé - Verbes en -ER" },
      { unitId: unit1.id, order: 3, title: "Imparfait - Verbes en -ER" },
      { unitId: unit1.id, order: 4, title: "Futur Simple - Verbes en -ER" },
      { unitId: unit1.id, order: 5, title: "Exercices Mixtes - 1er Groupe" }
    ]).returning();

    const challenges1 = await db.insert(schema.challenges).values([
      // Présent
      { lessonId: lessons1[0].id, type: "SELECT", order: 1, question: "Conjugue 'parler' au présent (je)" },
      { lessonId: lessons1[0].id, type: "SELECT", order: 2, question: "Conjugue 'manger' au présent (tu)" },
      { lessonId: lessons1[0].id, type: "SELECT", order: 3, question: "Conjugue 'chanter' au présent (il)" },
      { lessonId: lessons1[0].id, type: "SELECT", order: 4, question: "Conjugue 'danser' au présent (nous)" },
      { lessonId: lessons1[0].id, type: "ASSIST", order: 5, question: "Conjugue 'jouer' au présent (vous)" },
      { lessonId: lessons1[0].id, type: "ASSIST", order: 6, question: "Conjugue 'travailler' au présent (ils)" },
      { lessonId: lessons1[0].id, type: "FILL_BLANK", order: 7, question: "Je ___ (manger) une pomme." },
      { lessonId: lessons1[0].id, type: "FILL_BLANK", order: 8, question: "Tu ___ (chanter) très bien." },
      { lessonId: lessons1[0].id, type: "FILL_BLANK", order: 9, question: "Nous ___ (danser) ensemble." },
      
      // Passé Composé
      { lessonId: lessons1[1].id, type: "SELECT", order: 1, question: "Passé composé de 'parler' (j')" },
      { lessonId: lessons1[1].id, type: "SELECT", order: 2, question: "Passé composé de 'manger' (tu)" },
      { lessonId: lessons1[1].id, type: "SELECT", order: 3, question: "Passé composé de 'chanter' (il)" },
      { lessonId: lessons1[1].id, type: "ASSIST", order: 4, question: "Passé composé de 'danser' (nous)" },
      { lessonId: lessons1[1].id, type: "ASSIST", order: 5, question: "Passé composé de 'jouer' (vous)" },
      { lessonId: lessons1[1].id, type: "FILL_BLANK", order: 6, question: "J'___ (manger) une tarte hier." },
      { lessonId: lessons1[1].id, type: "FILL_BLANK", order: 7, question: "Elles ___ (chanter) toute la soirée." },
      
      // Imparfait
      { lessonId: lessons1[2].id, type: "SELECT", order: 1, question: "Imparfait de 'parler' (je)" },
      { lessonId: lessons1[2].id, type: "SELECT", order: 2, question: "Imparfait de 'manger' (tu)" },
      { lessonId: lessons1[2].id, type: "SELECT", order: 3, question: "Imparfait de 'chanter' (il)" },
      { lessonId: lessons1[2].id, type: "ASSIST", order: 4, question: "Imparfait de 'danser' (nous)" },
      { lessonId: lessons1[2].id, type: "ASSIST", order: 5, question: "Imparfait de 'jouer' (vous)" },
      { lessonId: lessons1[2].id, type: "FILL_BLANK", order: 6, question: "Quand j'étais petit, je ___ (jouer) beaucoup." },
      { lessonId: lessons1[2].id, type: "FILL_BLANK", order: 7, question: "Chaque matin, tu ___ (manger) des céréales." },
      
      // Futur Simple
      { lessonId: lessons1[3].id, type: "SELECT", order: 1, question: "Futur de 'parler' (je)" },
      { lessonId: lessons1[3].id, type: "SELECT", order: 2, question: "Futur de 'manger' (tu)" },
      { lessonId: lessons1[3].id, type: "SELECT", order: 3, question: "Futur de 'chanter' (il)" },
      { lessonId: lessons1[3].id, type: "ASSIST", order: 4, question: "Futur de 'danser' (nous)" },
      { lessonId: lessons1[3].id, type: "ASSIST", order: 5, question: "Futur de 'jouer' (vous)" },
      { lessonId: lessons1[3].id, type: "FILL_BLANK", order: 6, question: "Demain, je ___ (travailler) toute la journée." },
      { lessonId: lessons1[3].id, type: "FILL_BLANK", order: 7, question: "La semaine prochaine, nous ___ (visiter) Paris." },
      
      // Exercices Mixtes
      { lessonId: lessons1[4].id, type: "SELECT", order: 1, question: "Complète: Hier, je ___ (manger) au restaurant." },
      { lessonId: lessons1[4].id, type: "SELECT", order: 2, question: "Complète: Quand j'étais jeune, je ___ (habiter) à Lyon." },
      { lessonId: lessons1[4].id, type: "SELECT", order: 3, question: "Complète: Demain, tu ___ (finir) ton travail." },
      { lessonId: lessons1[4].id, type: "ASSIST", order: 4, question: "Complète: Chaque jour, ils ___ (marcher) 5 km." },
      { lessonId: lessons1[4].id, type: "ASSIST", order: 5, question: "Complète: Nous ___ (regarder) un film hier soir." },
      { lessonId: lessons1[4].id, type: "FILL_BLANK", order: 6, question: "En ce moment, je ___ (écouter) de la musique." },
      { lessonId: lessons1[4].id, type: "FILL_BLANK", order: 7, question: "La semaine dernière, elles ___ (voyager) en Italie." }
    ]).returning();

    console.log(`   ✅ Unité 1 créée avec ${challenges1.length} challenges`);

    // ================================================
    // UNITÉ 2: Les Verbes du 2ème Groupe (-IR)
    // ================================================
    console.log("\n📦 Création de l'unité 2: Les Verbes du 2ème Groupe (-IR)");
    
    const [unit2] = await db.insert(schema.units).values({
      courseId: courseId,
      title: "Les Verbes du 2ème Groupe (-IR)",
      description: "Maîtrisez la conjugaison des verbes en -IR (finir, choisir, réussir, etc.)",
      order: unitOrder++
    }).returning();

    const lessons2 = await db.insert(schema.lessons).values([
      { unitId: unit2.id, order: 1, title: "Présent - Verbes en -IR" },
      { unitId: unit2.id, order: 2, title: "Passé Composé - Verbes en -IR" },
      { unitId: unit2.id, order: 3, title: "Imparfait - Verbes en -IR" },
      { unitId: unit2.id, order: 4, title: "Futur Simple - Verbes en -IR" },
      { unitId: unit2.id, order: 5, title: "Exercices Mixtes - 2ème Groupe" }
    ]).returning();

    const challenges2 = await db.insert(schema.challenges).values([
      // Présent
      { lessonId: lessons2[0].id, type: "SELECT", order: 1, question: "Conjugue 'finir' au présent (je)" },
      { lessonId: lessons2[0].id, type: "SELECT", order: 2, question: "Conjugue 'choisir' au présent (tu)" },
      { lessonId: lessons2[0].id, type: "SELECT", order: 3, question: "Conjugue 'réussir' au présent (il)" },
      { lessonId: lessons2[0].id, type: "SELECT", order: 4, question: "Conjugue 'grandir' au présent (nous)" },
      { lessonId: lessons2[0].id, type: "ASSIST", order: 5, question: "Conjugue 'rougir' au présent (vous)" },
      { lessonId: lessons2[0].id, type: "ASSIST", order: 6, question: "Conjugue 'bâtir' au présent (ils)" },
      { lessonId: lessons2[0].id, type: "FILL_BLANK", order: 7, question: "Je ___ (finir) mes devoirs." },
      { lessonId: lessons2[0].id, type: "FILL_BLANK", order: 8, question: "Tu ___ (choisir) un cadeau." },
      { lessonId: lessons2[0].id, type: "FILL_BLANK", order: 9, question: "Nous ___ (réussir) notre examen." },
      
      // Passé Composé
      { lessonId: lessons2[1].id, type: "SELECT", order: 1, question: "Passé composé de 'finir' (j')" },
      { lessonId: lessons2[1].id, type: "SELECT", order: 2, question: "Passé composé de 'choisir' (tu)" },
      { lessonId: lessons2[1].id, type: "SELECT", order: 3, question: "Passé composé de 'réussir' (il)" },
      { lessonId: lessons2[1].id, type: "ASSIST", order: 4, question: "Passé composé de 'grandir' (nous)" },
      { lessonId: lessons2[1].id, type: "ASSIST", order: 5, question: "Passé composé de 'rougir' (vous)" },
      { lessonId: lessons2[1].id, type: "FILL_BLANK", order: 6, question: "J'___ (finir) mon travail à 18h." },
      { lessonId: lessons2[1].id, type: "FILL_BLANK", order: 7, question: "Elles ___ (choisir) la bonne réponse." },
      
      // Imparfait
      { lessonId: lessons2[2].id, type: "SELECT", order: 1, question: "Imparfait de 'finir' (je)" },
      { lessonId: lessons2[2].id, type: "SELECT", order: 2, question: "Imparfait de 'choisir' (tu)" },
      { lessonId: lessons2[2].id, type: "SELECT", order: 3, question: "Imparfait de 'réussir' (il)" },
      { lessonId: lessons2[2].id, type: "ASSIST", order: 4, question: "Imparfait de 'grandir' (nous)" },
      { lessonId: lessons2[2].id, type: "ASSIST", order: 5, question: "Imparfait de 'rougir' (vous)" },
      { lessonId: lessons2[2].id, type: "FILL_BLANK", order: 6, question: "Quand j'étais petit, je ___ (grandir) vite." },
      { lessonId: lessons2[2].id, type: "FILL_BLANK", order: 7, question: "Chaque jour, tu ___ (finir) à 17h." },
      
      // Futur Simple
      { lessonId: lessons2[3].id, type: "SELECT", order: 1, question: "Futur de 'finir' (je)" },
      { lessonId: lessons2[3].id, type: "SELECT", order: 2, question: "Futur de 'choisir' (tu)" },
      { lessonId: lessons2[3].id, type: "SELECT", order: 3, question: "Futur de 'réussir' (il)" },
      { lessonId: lessons2[3].id, type: "ASSIST", order: 4, question: "Futur de 'grandir' (nous)" },
      { lessonId: lessons2[3].id, type: "ASSIST", order: 5, question: "Futur de 'rougir' (vous)" },
      { lessonId: lessons2[3].id, type: "FILL_BLANK", order: 6, question: "Demain, je ___ (finir) ce projet." },
      { lessonId: lessons2[3].id, type: "FILL_BLANK", order: 7, question: "La semaine prochaine, nous ___ (réussir) sûrement." },
      
      // Exercices Mixtes
      { lessonId: lessons2[4].id, type: "SELECT", order: 1, question: "Complète: Hier, j'___ (finir) mon livre." },
      { lessonId: lessons2[4].id, type: "SELECT", order: 2, question: "Complète: Chaque été, nous ___ (grandir) beaucoup." },
      { lessonId: lessons2[4].id, type: "SELECT", order: 3, question: "Complète: Demain, tu ___ (choisir) ton cadeau." },
      { lessonId: lessons2[4].id, type: "ASSIST", order: 4, question: "Complète: Quand elle était petite, elle ___ (rougir) facilement." },
      { lessonId: lessons2[4].id, type: "ASSIST", order: 5, question: "Complète: La semaine dernière, ils ___ (réussir) leur examen." },
      { lessonId: lessons2[4].id, type: "FILL_BLANK", order: 6, question: "En ce moment, je ___ (finir) mon repas." },
      { lessonId: lessons2[4].id, type: "FILL_BLANK", order: 7, question: "L'année prochaine, elles ___ (grandir) encore." }
    ]).returning();

    console.log(`   ✅ Unité 2 créée avec ${challenges2.length} challenges`);

    // ================================================
    // UNITÉ 3: Les Verbes du 3ème Groupe (Irréguliers)
    // ================================================
    console.log("\n📦 Création de l'unité 3: Les Verbes du 3ème Groupe (Irréguliers)");
    
    const [unit3] = await db.insert(schema.units).values({
      courseId: courseId,
      title: "Les Verbes du 3ème Groupe (Irréguliers)",
      description: "Apprenez les verbes irréguliers essentiels: être, avoir, aller, faire, etc.",
      order: unitOrder++
    }).returning();

    const lessons3 = await db.insert(schema.lessons).values([
      { unitId: unit3.id, order: 1, title: "Les Verbes ÊTRE et AVOIR" },
      { unitId: unit3.id, order: 2, title: "Les Verbes ALLER et VENIR" },
      { unitId: unit3.id, order: 3, title: "Les Verbes FAIRE et DIRE" },
      { unitId: unit3.id, order: 4, title: "Les Verbes PRENDRE et METTRE" },
      { unitId: unit3.id, order: 5, title: "Exercices Mixtes - 3ème Groupe" }
    ]).returning();

    const challenges3 = await db.insert(schema.challenges).values([
      // ÊTRE et AVOIR
      { lessonId: lessons3[0].id, type: "SELECT", order: 1, question: "Conjugue 'être' au présent (je)" },
      { lessonId: lessons3[0].id, type: "SELECT", order: 2, question: "Conjugue 'avoir' au présent (tu)" },
      { lessonId: lessons3[0].id, type: "SELECT", order: 3, question: "Conjugue 'être' au passé composé (il)" },
      { lessonId: lessons3[0].id, type: "SELECT", order: 4, question: "Conjugue 'avoir' à l'imparfait (nous)" },
      { lessonId: lessons3[0].id, type: "ASSIST", order: 5, question: "Conjugue 'être' au futur (vous)" },
      { lessonId: lessons3[0].id, type: "ASSIST", order: 6, question: "Conjugue 'avoir' au présent (ils)" },
      { lessonId: lessons3[0].id, type: "FILL_BLANK", order: 7, question: "Je ___ (être) fatigué aujourd'hui." },
      { lessonId: lessons3[0].id, type: "FILL_BLANK", order: 8, question: "Tu ___ (avoir) raison." },
      { lessonId: lessons3[0].id, type: "FILL_BLANK", order: 9, question: "Nous ___ (être) en retard hier." },
      
      // ALLER et VENIR
      { lessonId: lessons3[1].id, type: "SELECT", order: 1, question: "Conjugue 'aller' au présent (je)" },
      { lessonId: lessons3[1].id, type: "SELECT", order: 2, question: "Conjugue 'venir' au présent (tu)" },
      { lessonId: lessons3[1].id, type: "SELECT", order: 3, question: "Conjugue 'aller' au passé composé (il)" },
      { lessonId: lessons3[1].id, type: "SELECT", order: 4, question: "Conjugue 'venir' à l'imparfait (nous)" },
      { lessonId: lessons3[1].id, type: "ASSIST", order: 5, question: "Conjugue 'aller' au futur (vous)" },
      { lessonId: lessons3[1].id, type: "ASSIST", order: 6, question: "Conjugue 'venir' au présent (ils)" },
      { lessonId: lessons3[1].id, type: "FILL_BLANK", order: 7, question: "Demain, je ___ (aller) au cinéma." },
      { lessonId: lessons3[1].id, type: "FILL_BLANK", order: 8, question: "Ils ___ (venir) de Paris." },
      
      // FAIRE et DIRE
      { lessonId: lessons3[2].id, type: "SELECT", order: 1, question: "Conjugue 'faire' au présent (je)" },
      { lessonId: lessons3[2].id, type: "SELECT", order: 2, question: "Conjugue 'dire' au présent (tu)" },
      { lessonId: lessons3[2].id, type: "SELECT", order: 3, question: "Conjugue 'faire' au passé composé (il)" },
      { lessonId: lessons3[2].id, type: "SELECT", order: 4, question: "Conjugue 'dire' à l'imparfait (nous)" },
      { lessonId: lessons3[2].id, type: "ASSIST", order: 5, question: "Conjugue 'faire' au futur (vous)" },
      { lessonId: lessons3[2].id, type: "ASSIST", order: 6, question: "Conjugue 'dire' au présent (ils)" },
      { lessonId: lessons3[2].id, type: "FILL_BLANK", order: 7, question: "Je ___ (faire) mes devoirs chaque soir." },
      { lessonId: lessons3[2].id, type: "FILL_BLANK", order: 8, question: "Tu ___ (dire) toujours la vérité." },
      
      // PRENDRE et METTRE
      { lessonId: lessons3[3].id, type: "SELECT", order: 1, question: "Conjugue 'prendre' au présent (je)" },
      { lessonId: lessons3[3].id, type: "SELECT", order: 2, question: "Conjugue 'mettre' au présent (tu)" },
      { lessonId: lessons3[3].id, type: "SELECT", order: 3, question: "Conjugue 'prendre' au passé composé (il)" },
      { lessonId: lessons3[3].id, type: "SELECT", order: 4, question: "Conjugue 'mettre' à l'imparfait (nous)" },
      { lessonId: lessons3[3].id, type: "ASSIST", order: 5, question: "Conjugue 'prendre' au futur (vous)" },
      { lessonId: lessons3[3].id, type: "ASSIST", order: 6, question: "Conjugue 'mettre' au présent (ils)" },
      { lessonId: lessons3[3].id, type: "FILL_BLANK", order: 7, question: "Je ___ (prendre) le train ce matin." },
      { lessonId: lessons3[3].id, type: "FILL_BLANK", order: 8, question: "Elle ___ (mettre) sa robe préférée." },
      
      // Exercices Mixtes
      { lessonId: lessons3[4].id, type: "SELECT", order: 1, question: "Complète: Je ___ (être) content de te voir." },
      { lessonId: lessons3[4].id, type: "SELECT", order: 2, question: "Complète: Tu ___ (avoir) beaucoup de chance." },
      { lessonId: lessons3[4].id, type: "SELECT", order: 3, question: "Complète: Nous ___ (aller) au parc demain." },
      { lessonId: lessons3[4].id, type: "ASSIST", order: 4, question: "Complète: Elles ___ (venir) avec nous." },
      { lessonId: lessons3[4].id, type: "ASSIST", order: 5, question: "Complète: Il ___ (faire) beau aujourd'hui." },
      { lessonId: lessons3[4].id, type: "ASSIST", order: 6, question: "Complète: Je vous ___ (dire) la vérité." },
      { lessonId: lessons3[4].id, type: "FILL_BLANK", order: 7, question: "Nous ___ (prendre) le petit-déjeuner." },
      { lessonId: lessons3[4].id, type: "FILL_BLANK", order: 8, question: "Ils ___ (mettre) la table." }
    ]).returning();

    console.log(`   ✅ Unité 3 créée avec ${challenges3.length} challenges`);

    // ================================================
    // UNITÉ 4: Les Temps Composés (Tous Groupes)
    // ================================================
    console.log("\n📦 Création de l'unité 4: Les Temps Composés (Tous Groupes)");
    
    const [unit4] = await db.insert(schema.units).values({
      courseId: courseId,
      title: "Les Temps Composés",
      description: "Passé composé, plus-que-parfait, futur antérieur, conditionnel passé",
      order: unitOrder++
    }).returning();

    const lessons4 = await db.insert(schema.lessons).values([
      { unitId: unit4.id, order: 1, title: "Passé Composé (tous groupes)" },
      { unitId: unit4.id, order: 2, title: "Plus-Que-Parfait" },
      { unitId: unit4.id, order: 3, title: "Futur Antérieur" },
      { unitId: unit4.id, order: 4, title: "Conditionnel Passé" },
      { unitId: unit4.id, order: 5, title: "Exercices Mixtes" }
    ]).returning();

    const challenges4 = await db.insert(schema.challenges).values([
      // Passé Composé
      { lessonId: lessons4[0].id, type: "SELECT", order: 1, question: "Passé composé de 'manger' (je)" },
      { lessonId: lessons4[0].id, type: "SELECT", order: 2, question: "Passé composé de 'finir' (tu)" },
      { lessonId: lessons4[0].id, type: "SELECT", order: 3, question: "Passé composé d' 'être' (il)" },
      { lessonId: lessons4[0].id, type: "ASSIST", order: 4, question: "Passé composé de 'aller' (nous)" },
      { lessonId: lessons4[0].id, type: "ASSIST", order: 5, question: "Passé composé de 'faire' (vous)" },
      { lessonId: lessons4[0].id, type: "FILL_BLANK", order: 6, question: "J'___ (manger) une pizza hier." },
      { lessonId: lessons4[0].id, type: "FILL_BLANK", order: 7, question: "Nous ___ (aller) au cinéma." },
      
      // Plus-Que-Parfait
      { lessonId: lessons4[1].id, type: "SELECT", order: 1, question: "Plus-que-parfait de 'parler' (j')" },
      { lessonId: lessons4[1].id, type: "SELECT", order: 2, question: "Plus-que-parfait de 'finir' (tu)" },
      { lessonId: lessons4[1].id, type: "SELECT", order: 3, question: "Plus-que-parfait d' 'être' (il)" },
      { lessonId: lessons4[1].id, type: "ASSIST", order: 4, question: "Plus-que-parfait de 'avoir' (nous)" },
      { lessonId: lessons4[1].id, type: "FILL_BLANK", order: 5, question: "Quand tu es arrivé, j'___ (déjà/manger)." },
      { lessonId: lessons4[1].id, type: "FILL_BLANK", order: 6, question: "Elle ___ (finir) son travail avant midi." },
      
      // Futur Antérieur
      { lessonId: lessons4[2].id, type: "SELECT", order: 1, question: "Futur antérieur de 'parler' (j')" },
      { lessonId: lessons4[2].id, type: "SELECT", order: 2, question: "Futur antérieur de 'finir' (tu)" },
      { lessonId: lessons4[2].id, type: "SELECT", order: 3, question: "Futur antérieur d' 'aller' (il)" },
      { lessonId: lessons4[2].id, type: "ASSIST", order: 4, question: "Futur antérieur de 'faire' (nous)" },
      { lessonId: lessons4[2].id, type: "FILL_BLANK", order: 5, question: "Quand tu arriveras, j'___ (déjà/partir)." },
      { lessonId: lessons4[2].id, type: "FILL_BLANK", order: 6, question: "Ils ___ (finir) avant ce soir." },
      
      // Conditionnel Passé
      { lessonId: lessons4[3].id, type: "SELECT", order: 1, question: "Conditionnel passé de 'parler' (j')" },
      { lessonId: lessons4[3].id, type: "SELECT", order: 2, question: "Conditionnel passé de 'finir' (tu)" },
      { lessonId: lessons4[3].id, type: "SELECT", order: 3, question: "Conditionnel passé d' 'être' (il)" },
      { lessonId: lessons4[3].id, type: "ASSIST", order: 4, question: "Conditionnel passé de 'avoir' (nous)" },
      { lessonId: lessons4[3].id, type: "FILL_BLANK", order: 5, question: "J'___ (aimé) venir, mais je ne peux pas." },
      { lessonId: lessons4[3].id, type: "FILL_BLANK", order: 6, question: "Elle ___ (réussi) si elle avait travaillé." },
      
      // Exercices Mixtes
      { lessonId: lessons4[4].id, type: "SELECT", order: 1, question: "Complète: Quand je suis arrivé, il ___ (déjà/partir)." },
      { lessonId: lessons4[4].id, type: "SELECT", order: 2, question: "Complète: Demain, j'___ (finir) ce travail." },
      { lessonId: lessons4[4].id, type: "SELECT", order: 3, question: "Complète: J'___ (aimé) être à ta place." },
      { lessonId: lessons4[4].id, type: "ASSIST", order: 4, question: "Complète: Nous ___ (manger) quand tu as appelé." },
      { lessonId: lessons4[4].id, type: "ASSIST", order: 5, question: "Complète: Tu ___ (réussir) si tu avais essayé." },
      { lessonId: lessons4[4].id, type: "FILL_BLANK", order: 6, question: "Quand vous viendrez, nous ___ (déjà/dîner)." }
    ]).returning();

    console.log(`   ✅ Unité 4 créée avec ${challenges4.length} challenges`);

    // ================================================
    // UNITÉ 5: Les Modes (Subjonctif et Conditionnel)
    // ================================================
    console.log("\n📦 Création de l'unité 5: Les Modes (Subjonctif et Conditionnel)");
    
    const [unit5] = await db.insert(schema.units).values({
      courseId: courseId,
      title: "Les Modes (Subjonctif et Conditionnel)",
      description: "Subjonctif présent, conditionnel présent, emplois et conjugaisons",
      order: unitOrder++
    }).returning();

    const lessons5 = await db.insert(schema.lessons).values([
      { unitId: unit5.id, order: 1, title: "Subjonctif Présent - 1er Groupe" },
      { unitId: unit5.id, order: 2, title: "Subjonctif Présent - 2ème et 3ème" },
      { unitId: unit5.id, order: 3, title: "Conditionnel Présent" },
      { unitId: unit5.id, order: 4, title: "Emploi du Subjonctif" },
      { unitId: unit5.id, order: 5, title: "Exercices Mixtes" }
    ]).returning();

    const challenges5 = await db.insert(schema.challenges).values([
      // Subjonctif Présent - 1er Groupe
      { lessonId: lessons5[0].id, type: "SELECT", order: 1, question: "Subjonctif de 'parler' (que je)" },
      { lessonId: lessons5[0].id, type: "SELECT", order: 2, question: "Subjonctif de 'manger' (que tu)" },
      { lessonId: lessons5[0].id, type: "SELECT", order: 3, question: "Subjonctif de 'chanter' (qu'il)" },
      { lessonId: lessons5[0].id, type: "ASSIST", order: 4, question: "Subjonctif de 'danser' (que nous)" },
      { lessonId: lessons5[0].id, type: "ASSIST", order: 5, question: "Subjonctif de 'jouer' (que vous)" },
      { lessonId: lessons5[0].id, type: "FILL_BLANK", order: 6, question: "Il faut que je ___ (parler) français." },
      { lessonId: lessons5[0].id, type: "FILL_BLANK", order: 7, question: "Je veux que tu ___ (manger) ta soupe." },
      
      // Subjonctif - 2ème et 3ème
      { lessonId: lessons5[1].id, type: "SELECT", order: 1, question: "Subjonctif de 'finir' (que je)" },
      { lessonId: lessons5[1].id, type: "SELECT", order: 2, question: "Subjonctif d' 'être' (que tu)" },
      { lessonId: lessons5[1].id, type: "SELECT", order: 3, question: "Subjonctif d' 'avoir' (qu'il)" },
      { lessonId: lessons5[1].id, type: "ASSIST", order: 4, question: "Subjonctif d' 'aller' (que nous)" },
      { lessonId: lessons5[1].id, type: "ASSIST", order: 5, question: "Subjonctif de 'faire' (que vous)" },
      { lessonId: lessons5[1].id, type: "FILL_BLANK", order: 6, question: "Il faut que tu ___ (être) à l'heure." },
      { lessonId: lessons5[1].id, type: "FILL_BLANK", order: 7, question: "Je doute qu'il ___ (avoir) raison." },
      
      // Conditionnel Présent
      { lessonId: lessons5[2].id, type: "SELECT", order: 1, question: "Conditionnel de 'parler' (je)" },
      { lessonId: lessons5[2].id, type: "SELECT", order: 2, question: "Conditionnel de 'finir' (tu)" },
      { lessonId: lessons5[2].id, type: "SELECT", order: 3, question: "Conditionnel d' 'être' (il)" },
      { lessonId: lessons5[2].id, type: "ASSIST", order: 4, question: "Conditionnel de 'avoir' (nous)" },
      { lessonId: lessons5[2].id, type: "ASSIST", order: 5, question: "Conditionnel de 'aller' (vous)" },
      { lessonId: lessons5[2].id, type: "FILL_BLANK", order: 6, question: "J'___ (aimer) voyager en Italie." },
      { lessonId: lessons5[2].id, type: "FILL_BLANK", order: 7, question: "Tu ___ (devoir) travailler plus." },
      
      // Emploi du Subjonctif
      { lessonId: lessons5[3].id, type: "SELECT", order: 1, question: "Complète: Il faut que nous ___ (partir) tôt." },
      { lessonId: lessons5[3].id, type: "SELECT", order: 2, question: "Complète: Je suis content que tu ___ (être) là." },
      { lessonId: lessons5[3].id, type: "SELECT", order: 3, question: "Complète: Bien qu'il ___ (pleuvoir), nous sortons." },
      { lessonId: lessons5[3].id, type: "ASSIST", order: 4, question: "Complète: Je cherche un livre qui ___ (être) intéressant." },
      { lessonId: lessons5[3].id, type: "ASSIST", order: 5, question: "Complète: Pourvu qu'il ___ (faire) beau !" },
      { lessonId: lessons5[3].id, type: "FILL_BLANK", order: 6, question: "Il est important que vous ___ (venir) à l'heure." },
      
      // Exercices Mixtes
      { lessonId: lessons5[4].id, type: "SELECT", order: 1, question: "Complète: Si j'étais riche, je ___ (voyager) beaucoup." },
      { lessonId: lessons5[4].id, type: "SELECT", order: 2, question: "Complète: Il faut que je ___ (finir) ce travail." },
      { lessonId: lessons5[4].id, type: "SELECT", order: 3, question: "Complète: Je voudrais que tu ___ (être) plus calme." },
      { lessonId: lessons5[4].id, type: "ASSIST", order: 4, question: "Complète: Tu ___ (devoir) être plus prudent." },
      { lessonId: lessons5[4].id, type: "ASSIST", order: 5, question: "Complète: Il est impossible qu'il ___ (dire) cela." },
      { lessonId: lessons5[4].id, type: "FILL_BLANK", order: 6, question: "Pourvu que nous ___ (arriver) à temps !" }
    ]).returning();

    console.log(`   ✅ Unité 5 créée avec ${challenges5.length} challenges`);

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

    const addOptionsBatch = (challenges: any[], optionsList: { text: string; correct: boolean; blank?: number; order?: number }[][]) => {
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

    // Options pour Unité 1 (1er groupe)
    const unit1Options = [
      [{ text: "je parle", correct: true }, { text: "je parles", correct: false }, { text: "je parlent", correct: false }],
      [{ text: "tu manges", correct: true }, { text: "tu mange", correct: false }, { text: "tu mangent", correct: false }],
      [{ text: "il chante", correct: true }, { text: "il chantes", correct: false }, { text: "il chantent", correct: false }],
      [{ text: "nous dansons", correct: true }, { text: "nous dansont", correct: false }, { text: "nous dansons", correct: false }],
      [{ text: "vous jouez", correct: true }, { text: "vous jouez", correct: false }, { text: "vous jouent", correct: false }],
      [{ text: "ils travaillent", correct: true }, { text: "ils travaille", correct: false }, { text: "ils travaillons", correct: false }],
      [{ text: "mange", correct: true, blank: 0 }, { text: "manges", correct: false, blank: 0 }],
      [{ text: "chantes", correct: true, blank: 0 }, { text: "chante", correct: false, blank: 0 }],
      [{ text: "dansons", correct: true, blank: 0 }, { text: "danse", correct: false, blank: 0 }],
      [{ text: "j'ai parlé", correct: true }, { text: "je suis parlé", correct: false }, { text: "j'avais parlé", correct: false }],
      [{ text: "tu as mangé", correct: true }, { text: "tu es mangé", correct: false }, { text: "tu avais mangé", correct: false }],
      [{ text: "il a chanté", correct: true }, { text: "il est chanté", correct: false }, { text: "il avait chanté", correct: false }],
      [{ text: "nous avons dansé", correct: true }, { text: "nous sommes dansé", correct: false }, { text: "nous avions dansé", correct: false }],
      [{ text: "vous avez joué", correct: true }, { text: "vous êtes joué", correct: false }, { text: "vous aviez joué", correct: false }],
      [{ text: "ai mangé", correct: true, blank: 0 }, { text: "ai mangé", correct: false, blank: 0 }],
      [{ text: "ont chanté", correct: true, blank: 0 }, { text: "ont chanté", correct: false, blank: 0 }],
      [{ text: "je parlais", correct: true }, { text: "je parle", correct: false }, { text: "j'ai parlé", correct: false }],
      [{ text: "tu mangeais", correct: true }, { text: "tu manges", correct: false }, { text: "tu as mangé", correct: false }],
      [{ text: "il chantait", correct: true }, { text: "il chante", correct: false }, { text: "il a chanté", correct: false }],
      [{ text: "nous dansions", correct: true }, { text: "nous dansons", correct: false }, { text: "nous avons dansé", correct: false }],
      [{ text: "vous jouiez", correct: true }, { text: "vous jouez", correct: false }, { text: "vous avez joué", correct: false }],
      [{ text: "jouais", correct: true, blank: 0 }, { text: "jouais", correct: false, blank: 0 }],
      [{ text: "mangeais", correct: true, blank: 0 }, { text: "mangeais", correct: false, blank: 0 }],
      [{ text: "je parlerai", correct: true }, { text: "je parle", correct: false }, { text: "j'ai parlé", correct: false }],
      [{ text: "tu mangeras", correct: true }, { text: "tu manges", correct: false }, { text: "tu as mangé", correct: false }],
      [{ text: "il chantera", correct: true }, { text: "il chante", correct: false }, { text: "il a chanté", correct: false }],
      [{ text: "nous danserons", correct: true }, { text: "nous dansons", correct: false }, { text: "nous avons dansé", correct: false }],
      [{ text: "vous jouerez", correct: true }, { text: "vous jouez", correct: false }, { text: "vous avez joué", correct: false }],
      [{ text: "travaillerai", correct: true, blank: 0 }, { text: "travaillerai", correct: false, blank: 0 }],
      [{ text: "visiterons", correct: true, blank: 0 }, { text: "visiterons", correct: false, blank: 0 }],
      [{ text: "j'ai mangé", correct: true }, { text: "je mangeais", correct: false }, { text: "je mangerai", correct: false }],
      [{ text: "j'habitais", correct: true }, { text: "j'habite", correct: false }, { text: "j'habiterai", correct: false }],
      [{ text: "tu finiras", correct: true }, { text: "tu finis", correct: false }, { text: "tu as fini", correct: false }],
      [{ text: "marchent", correct: true }, { text: "marchaient", correct: false }, { text: "marcheront", correct: false }],
      [{ text: "avons regardé", correct: true }, { text: "regardions", correct: false }, { text: "regarderons", correct: false }],
      [{ text: "écoute", correct: true, blank: 0 }, { text: "écoutais", correct: false, blank: 0 }],
      [{ text: "ont voyagé", correct: true, blank: 0 }, { text: "voyageaient", correct: false, blank: 0 }]
    ];

    addOptionsBatch(challenges1, unit1Options);

    // Options pour Unité 2 (2ème groupe)
    const unit2Options = Array(challenges2.length).fill(null).map(() => [
      { text: "Bonne réponse", correct: true },
      { text: "Mauvaise réponse 1", correct: false },
      { text: "Mauvaise réponse 2", correct: false }
    ]);

    // Remplir avec les bonnes réponses pour l'unité 2
    const unit2CorrectAnswers = [
      "je finis", "tu choisis", "il réussit", "nous grandissons", "vous rougissez", "ils bâtissent",
      "finis", "choisis", "grandissons",
      "j'ai fini", "tu as choisi", "il a réussi", "nous avons grandi", "vous avez rougi",
      "ai fini", "ont choisi",
      "je finissais", "tu choisissais", "il réussissait", "nous grandissions", "vous rougissiez",
      "grandissais", "finissais",
      "je finirai", "tu choisiras", "il réussira", "nous grandirons", "vous rougirez",
      "finirai", "réussirons",
      "ai fini", "grandissions", "choisiras", "rougissait", "ont réussi", "finis", "grandiront"
    ];

    for (let i = 0; i < challenges2.length && i < unit2CorrectAnswers.length; i++) {
      unit2Options[i] = [
        { text: unit2CorrectAnswers[i], correct: true },
        { text: "fausse réponse 1", correct: false },
        { text: "fausse réponse 2", correct: false }
      ];
    }

    addOptionsBatch(challenges2, unit2Options);

    // Options pour Unité 3 (3ème groupe)
    const unit3Options = Array(challenges3.length).fill(null).map(() => [
      { text: "Bonne réponse", correct: true },
      { text: "Mauvaise réponse 1", correct: false },
      { text: "Mauvaise réponse 2", correct: false }
    ]);

    const unit3CorrectAnswers = [
      "je suis", "tu as", "il a été", "nous avions", "vous serez", "ils ont",
      "suis", "as", "avons été",
      "je vais", "tu viens", "il est allé", "nous venions", "vous irez", "ils viennent",
      "irai", "viennent",
      "je fais", "tu dis", "il a fait", "nous disions", "vous ferez", "ils disent",
      "fais", "dis",
      "je prends", "tu mets", "il a pris", "nous mettions", "vous prendrez", "ils mettent",
      "prends", "met",
      "suis", "as", "irons", "viennent", "fait", "dis", "prenons", "mettent"
    ];

    for (let i = 0; i < challenges3.length && i < unit3CorrectAnswers.length; i++) {
      unit3Options[i] = [
        { text: unit3CorrectAnswers[i], correct: true },
        { text: "fausse réponse 1", correct: false },
        { text: "fausse réponse 2", correct: false }
      ];
    }

    addOptionsBatch(challenges3, unit3Options);

    // Options pour Unité 4 (Temps composés)
    const unit4Options = Array(challenges4.length).fill(null).map(() => [
      { text: "Bonne réponse", correct: true },
      { text: "Mauvaise réponse 1", correct: false },
      { text: "Mauvaise réponse 2", correct: false }
    ]);

    const unit4CorrectAnswers = [
      "j'ai mangé", "tu as fini", "il a été", "nous sommes allés", "vous avez fait",
      "ai mangé", "sommes allés",
      "j'avais parlé", "tu avais fini", "il avait été", "nous avions eu",
      "avais déjà mangé", "avait fini",
      "j'aurai parlé", "tu auras fini", "il sera allé", "nous aurons fait",
      "serai déjà parti", "auront fini",
      "j'aurais parlé", "tu aurais fini", "il aurait été", "nous aurions eu",
      "aurais aimé", "aurait réussi",
      "était déjà parti", "aurai fini", "aurais aimé", "mangions", "aurais réussi", "aurons déjà dîné"
    ];

    for (let i = 0; i < challenges4.length && i < unit4CorrectAnswers.length; i++) {
      unit4Options[i] = [
        { text: unit4CorrectAnswers[i], correct: true },
        { text: "fausse réponse 1", correct: false },
        { text: "fausse réponse 2", correct: false }
      ];
    }

    addOptionsBatch(challenges4, unit4Options);

    // Options pour Unité 5 (Subjonctif et Conditionnel)
    const unit5Options = Array(challenges5.length).fill(null).map(() => [
      { text: "Bonne réponse", correct: true },
      { text: "Mauvaise réponse 1", correct: false },
      { text: "Mauvaise réponse 2", correct: false }
    ]);

    const unit5CorrectAnswers = [
      "je parle", "tu manges", "il chante", "nous dansions", "vous jouiez",
      "parle", "manges",
      "je finisse", "tu sois", "il ait", "nous allions", "vous fassiez",
      "sois", "ait",
      "je parlerais", "tu finirais", "il serait", "nous aurions", "vous iriez",
      "aimerais", "devrais",
      "partions", "sois", "pleuve", "soit", "fasse", "veniez",
      "voyagerais", "finisse", "sois", "devrais", "ait", "arrivions"
    ];

    for (let i = 0; i < challenges5.length && i < unit5CorrectAnswers.length; i++) {
      unit5Options[i] = [
        { text: unit5CorrectAnswers[i], correct: true },
        { text: "fausse réponse 1", correct: false },
        { text: "fausse réponse 2", correct: false }
      ];
    }

    addOptionsBatch(challenges5, unit5Options);

    // Insertion de toutes les options
    if (allOptions.length > 0) {
      await db.insert(schema.challengeOptions).values(allOptions);
      console.log(`✅ ${allOptions.length} options créées`);
    }

    // ================================================
    // RÉSUMÉ FINAL
    // ================================================
    console.log("\n" + "=".repeat(70));
    console.log("📊 RÉSUMÉ DE LA CRÉATION DU COURS MIMI - CONJUGAISON FRANÇAISE:");
    console.log("=".repeat(70));
    
    const allUnits = [unit1, unit2, unit3, unit4, unit5];
    const allLessons = [...lessons1, ...lessons2, ...lessons3, ...lessons4, ...lessons5];
    const allChallenges = [...challenges1, ...challenges2, ...challenges3, ...challenges4, ...challenges5];
    
    console.log(`\n📚 Cours créé: ${mimiCourse.title} (ID: ${courseId})`);
    console.log(`\n📖 Unités: ${allUnits.length}`);
    allUnits.forEach((unit, idx) => {
      console.log(`   ${idx + 1}. ${unit.title}`);
    });
    
    console.log(`\n🎯 Total de leçons: ${allLessons.length}`);
    console.log(`🎯 Total de challenges: ${allChallenges.length}`);
    console.log(`🔢 Total d'options: ${allOptions.length}`);
    
    console.log("\n📈 Détail par unité:");
    const unitChallenges = [
      challenges1.length, challenges2.length, challenges3.length, 
      challenges4.length, challenges5.length
    ];
    allUnits.forEach((unit, idx) => {
      console.log(`   ${idx + 1}. ${unit.title.substring(0, 40)}... - ${unitChallenges[idx]} challenges`);
    });
    
    console.log("\n📋 Contenu du cours:");
    console.log("   ✅ 1er Groupe (-ER) : présent, passé composé, imparfait, futur");
    console.log("   ✅ 2ème Groupe (-IR) : présent, passé composé, imparfait, futur");
    console.log("   ✅ 3ème Groupe (irréguliers) : être, avoir, aller, venir, faire, dire, prendre, mettre");
    console.log("   ✅ Temps composés : passé composé, plus-que-parfait, futur antérieur, conditionnel passé");
    console.log("   ✅ Modes : subjonctif présent, conditionnel présent");
    
    console.log("\n✅ Cours MIMI créé avec succès !");
    console.log(`\n🎓 Le cours est maintenant disponible avec ${allChallenges.length} exercices au total.`);

  } catch (error) {
    console.error("❌ Erreur lors de la création:", error);
    throw new Error("Échec de la création du cours Mimi");
  }
};

// Exécuter la fonction
addMimiFrenchConjugationCourse();