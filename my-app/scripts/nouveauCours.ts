import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema });

type ChallengeType = "SELECT" | "ASSIST" | "FILL_BLANK";

const addFootballCourse = async () => {
  try {
    console.log("🚀 Création du cours Football - Culture et Connaissances...\n");

    // 1. Créer le cours Football
    const [footballCourse] = await db.insert(schema.courses).values({
      title: "Football - Culture et Connaissances",
      imageSrc: "/football.svg"
    }).returning();

    const courseId = footballCourse.id;
    console.log(`✅ Cours créé: ${footballCourse.title} (ID: ${courseId})`);

    let unitOrder = 1;

    // ================================================
    // UNITÉ 1: Histoire du Football
    // ================================================
    console.log("\n📦 Création de l'unité 1: Histoire du Football");
    
    const [unit1] = await db.insert(schema.units).values({
      courseId: courseId,
      title: "Histoire du Football",
      description: "Découvrez les origines et l'évolution du football à travers le monde",
      order: unitOrder++
    }).returning();

    const lessons1 = await db.insert(schema.lessons).values([
      { unitId: unit1.id, order: 1, title: "Origines du football" },
      { unitId: unit1.id, order: 2, title: "Création de la FIFA" },
      { unitId: unit1.id, order: 3, title: "Histoire de la Coupe du Monde" },
      { unitId: unit1.id, order: 4, title: "Histoire de l'Euro" },
      { unitId: unit1.id, order: 5, title: "Histoire de la Ligue des Champions" },
      { unitId: unit1.id, order: 6, title: "Grandes dates du football" }
    ]).returning();

    const challenges1 = await db.insert(schema.challenges).values([
      // Leçon 1: Origines
      { lessonId: lessons1[0].id, type: "SELECT", order: 1, question: "Dans quel pays le football moderne est-il né ?" },
      { lessonId: lessons1[0].id, type: "SELECT", order: 2, question: "En quelle année les premières règles du football ont-elles été établies ?" },
      { lessonId: lessons1[0].id, type: "SELECT", order: 3, question: "Quel club est considéré comme le plus ancien club de football ?" },
      { lessonId: lessons1[0].id, type: "SELECT", order: 4, question: "Où a eu lieu le premier match international de football ?" },
      { lessonId: lessons1[0].id, type: "SELECT", order: 5, question: "Quelle fédération est la plus ancienne au monde ?" },
      // Leçon 2: FIFA
      { lessonId: lessons1[1].id, type: "SELECT", order: 1, question: "En quelle année la FIFA a-t-elle été fondée ?" },
      { lessonId: lessons1[1].id, type: "SELECT", order: 2, question: "Quel pays a accueilli le premier congrès de la FIFA ?" },
      { lessonId: lessons1[1].id, type: "SELECT", order: 3, question: "Qui a été le premier président de la FIFA ?" },
      { lessonId: lessons1[1].id, type: "SELECT", order: 4, question: "Combien de membres compte la FIFA actuellement ?" },
      { lessonId: lessons1[1].id, type: "SELECT", order: 5, question: "Où se trouve le siège de la FIFA ?" },
      // Leçon 3: Coupe du Monde
      { lessonId: lessons1[2].id, type: "SELECT", order: 1, question: "En quelle année a eu lieu la première Coupe du Monde ?" },
      { lessonId: lessons1[2].id, type: "SELECT", order: 2, question: "Quel pays a organisé la première Coupe du Monde ?" },
      { lessonId: lessons1[2].id, type: "SELECT", order: 3, question: "Quel pays a remporté la première Coupe du Monde ?" },
      { lessonId: lessons1[2].id, type: "SELECT", order: 4, question: "Quel pays a le plus de titres de champion du monde ?" },
      { lessonId: lessons1[2].id, type: "SELECT", order: 5, question: "Quelle est la plus large victoire en Coupe du Monde ?" },
      // Leçon 4: Euro
      { lessonId: lessons1[3].id, type: "SELECT", order: 1, question: "En quelle année a eu lieu le premier Championnat d'Europe ?" },
      { lessonId: lessons1[3].id, type: "SELECT", order: 2, question: "Quel pays a remporté le premier Euro ?" },
      { lessonId: lessons1[3].id, type: "SELECT", order: 3, question: "Quel pays a le plus de titres à l'Euro ?" },
      { lessonId: lessons1[3].id, type: "SELECT", order: 4, question: "Quel pays a organisé l'Euro 2016 ?" },
      { lessonId: lessons1[3].id, type: "SELECT", order: 5, question: "Qui a remporté l'Euro 2020 ?" },
      // Leçon 5: Ligue des Champions
      { lessonId: lessons1[4].id, type: "SELECT", order: 1, question: "En quelle année la Ligue des Champions a-t-elle été créée ?" },
      { lessonId: lessons1[4].id, type: "SELECT", order: 2, question: "Quel club a remporté la première Ligue des Champions ?" },
      { lessonId: lessons1[4].id, type: "SELECT", order: 3, question: "Quel club a le plus de titres en Ligue des Champions ?" },
      { lessonId: lessons1[4].id, type: "SELECT", order: 4, question: "Quel joueur a marqué le plus de buts en Ligue des Champions ?" },
      { lessonId: lessons1[4].id, type: "SELECT", order: 5, question: "Quelle finale a été la plus rapide ?" },
      // Leçon 6: Grandes dates
      { lessonId: lessons1[5].id, type: "SELECT", order: 1, question: "En quelle année le football est-il devenu sport olympique ?" },
      { lessonId: lessons1[5].id, type: "SELECT", order: 2, question: "Quand le hors-jeu a-t-il été modifié ?" },
      { lessonId: lessons1[5].id, type: "SELECT", order: 3, question: "Quand les cartons jaunes et rouges ont-ils été introduits ?" },
      { lessonId: lessons1[5].id, type: "SELECT", order: 4, question: "Quand la règle des 3 points pour une victoire a-t-elle été instaurée ?" },
      { lessonId: lessons1[5].id, type: "SELECT", order: 5, question: "Quand la technologie sur la ligne de but a-t-elle été autorisée ?" }
    ]).returning();

    console.log(`   ✅ Unité 1 créée avec ${challenges1.length} challenges`);

    // ================================================
    // UNITÉ 2: Grands Joueurs
    // ================================================
    console.log("\n📦 Création de l'unité 2: Grands Joueurs");
    
    const [unit2] = await db.insert(schema.units).values({
      courseId: courseId,
      title: "Grands Joueurs",
      description: "Les légendes qui ont marqué l'histoire du football",
      order: unitOrder++
    }).returning();

    const lessons2 = await db.insert(schema.lessons).values([
      { unitId: unit2.id, order: 1, title: "Les légendes du passé" },
      { unitId: unit2.id, order: 2, title: "Joueurs des années 90" },
      { unitId: unit2.id, order: 3, title: "La génération 2000" },
      { unitId: unit2.id, order: 4, title: "Les stars actuelles" },
      { unitId: unit2.id, order: 5, title: "Les meilleurs gardiens" },
      { unitId: unit2.id, order: 6, title: "Records individuels" }
    ]).returning();

    const challenges2 = await db.insert(schema.challenges).values([
      // Leçon 1: Légendes du passé
      { lessonId: lessons2[0].id, type: "SELECT", order: 1, question: "Qui est considéré comme le plus grand joueur brésilien de l'histoire ?" },
      { lessonId: lessons2[0].id, type: "SELECT", order: 2, question: "Quel joueur argentin a marqué le 'but du siècle' ?" },
      { lessonId: lessons2[0].id, type: "SELECT", order: 3, question: "Quel joueur allemand est surnommé 'le Kaiser' ?" },
      { lessonId: lessons2[0].id, type: "SELECT", order: 4, question: "Quel joueur hollandais est connu pour son maillot numéro 14 ?" },
      { lessonId: lessons2[0].id, type: "SELECT", order: 5, question: "Quel joueur français a marqué le premier but de l'histoire de l'Euro ?" },
      // Leçon 2: Années 90
      { lessonId: lessons2[1].id, type: "SELECT", order: 1, question: "Quel joueur brésilien a été élu meilleur joueur du monde 3 fois dans les années 90 ?" },
      { lessonId: lessons2[1].id, type: "SELECT", order: 2, question: "Quel attaquant italien a marqué le plus de buts en Serie A ?" },
      { lessonId: lessons2[1].id, type: "SELECT", order: 3, question: "Quel joueur français a marqué un triplé en finale de Coupe du Monde 1998 ?" },
      { lessonId: lessons2[1].id, type: "SELECT", order: 4, question: "Quel joueur croate a été Ballon d'Or en 1998 ?" },
      { lessonId: lessons2[1].id, type: "SELECT", order: 5, question: "Quel gardien paraguayen est célèbre pour son jeu à la tête ?" },
      // Leçon 3: Génération 2000
      { lessonId: lessons2[2].id, type: "SELECT", order: 1, question: "Quel joueur portugais a marqué 118 buts pour le Real Madrid ?" },
      { lessonId: lessons2[2].id, type: "SELECT", order: 2, question: "Quel milieu de terrain brésilien a joué au Barça et à l'Inter ?" },
      { lessonId: lessons2[2].id, type: "SELECT", order: 3, question: "Quel joueur ukrainien a marqué 4 buts lors d'un match de Ligue des Champions ?" },
      { lessonId: lessons2[2].id, type: "SELECT", order: 4, question: "Quel défenseur italien a remporté la Coupe du Monde 2006 ?" },
      { lessonId: lessons2[2].id, type: "SELECT", order: 5, question: "Quel attaquant anglais est connu pour sa célébration au dard ?" },
      // Leçon 4: Stars actuelles
      { lessonId: lessons2[3].id, type: "SELECT", order: 1, question: "Quel joueur argentin a remporté la Coupe du Monde 2022 ?" },
      { lessonId: lessons2[3].id, type: "SELECT", order: 2, question: "Quel joueur portugais a marqué plus de 800 buts dans sa carrière ?" },
      { lessonId: lessons2[3].id, type: "SELECT", order: 3, question: "Quel joueur français a marqué en finale de Coupe du Monde 2022 ?" },
      { lessonId: lessons2[3].id, type: "SELECT", order: 4, question: "Quel joueur norvégien est connu pour ses triplés en Premier League ?" },
      { lessonId: lessons2[3].id, type: "SELECT", order: 5, question: "Quel joueur belge est le meilleur buteur de l'histoire de la Premier League ?" },
      // Leçon 5: Meilleurs gardiens
      { lessonId: lessons2[4].id, type: "SELECT", order: 1, question: "Quel gardien italien a été élu meilleur joueur de l'Euro 2000 ?" },
      { lessonId: lessons2[4].id, type: "SELECT", order: 2, question: "Quel gardien allemand détient le record de clean sheets en Coupe du Monde ?" },
      { lessonId: lessons2[4].id, type: "SELECT", order: 3, question: "Quel gardien tchèque a joué pour Chelsea et l'AS Rome ?" },
      { lessonId: lessons2[4].id, type: "SELECT", order: 4, question: "Quel gardien espagnol a été champion du monde 2010 et champion d'Europe 2008,2012 ?" },
      { lessonId: lessons2[4].id, type: "SELECT", order: 5, question: "Quel gardien belge est considéré comme l'un des meilleurs de sa génération ?" },
      // Leçon 6: Records
      { lessonId: lessons2[5].id, type: "SELECT", order: 1, question: "Qui a marqué le plus de buts en une année civile ?" },
      { lessonId: lessons2[5].id, type: "SELECT", order: 2, question: "Qui a le plus de Ballons d'Or ?" },
      { lessonId: lessons2[5].id, type: "SELECT", order: 3, question: "Qui a marqué le plus de buts en Championnat d'Europe ?" },
      { lessonId: lessons2[5].id, type: "SELECT", order: 4, question: "Qui a marqué le plus de buts en Ligue des Champions sur une saison ?" },
      { lessonId: lessons2[5].id, type: "SELECT", order: 5, question: "Qui a le plus de sélections en équipe nationale ?" }
    ]).returning();

    console.log(`   ✅ Unité 2 créée avec ${challenges2.length} challenges`);

    // ================================================
    // UNITÉ 3: Clubs Légendaires
    // ================================================
    console.log("\n📦 Création de l'unité 3: Clubs Légendaires");
    
    const [unit3] = await db.insert(schema.units).values({
      courseId: courseId,
      title: "Clubs Légendaires",
      description: "Les plus grands clubs de football de l'histoire",
      order: unitOrder++
    }).returning();

    const lessons3 = await db.insert(schema.lessons).values([
      { unitId: unit3.id, order: 1, title: "Clubs espagnols" },
      { unitId: unit3.id, order: 2, title: "Clubs anglais" },
      { unitId: unit3.id, order: 3, title: "Clubs italiens" },
      { unitId: unit3.id, order: 4, title: "Clubs allemands" },
      { unitId: unit3.id, order: 5, title: "Clubs français" },
      { unitId: unit3.id, order: 6, title: "Clubs sud-américains" }
    ]).returning();

    const challenges3 = await db.insert(schema.challenges).values([
      // Leçon 1: Espagne
      { lessonId: lessons3[0].id, type: "SELECT", order: 1, question: "Quel club espagnol a remporté le plus de Ligas ?" },
      { lessonId: lessons3[0].id, type: "SELECT", order: 2, question: "Quel stade est le plus grand d'Espagne ?" },
      { lessonId: lessons3[0].id, type: "SELECT", order: 3, question: "Quel club est connu comme 'Los Blancos' ?" },
      { lessonId: lessons3[0].id, type: "SELECT", order: 4, question: "Quel club catalan a remporté le sextuplé en 2009 ?" },
      { lessonId: lessons3[0].id, type: "SELECT", order: 5, question: "Quel club basque n'a jamais été relégué de Liga ?" },
      // Leçon 2: Angleterre
      { lessonId: lessons3[1].id, type: "SELECT", order: 1, question: "Quel club anglais a le plus de titres de champion ?" },
      { lessonId: lessons3[1].id, type: "SELECT", order: 2, question: "Quel stade est le plus grand d'Angleterre ?" },
      { lessonId: lessons3[1].id, type: "SELECT", order: 3, question: "Quel club londonien a remporté la Ligue des Champions en 2012 ?" },
      { lessonId: lessons3[1].id, type: "SELECT", order: 4, question: "Quel club de Liverpool a remporté 6 Ligues des Champions ?" },
      { lessonId: lessons3[1].id, type: "SELECT", order: 5, question: "Quel club mancunien a remporté le triplé en 1999 ?" },
      // Leçon 3: Italie
      { lessonId: lessons3[2].id, type: "SELECT", order: 1, question: "Quel club italien a le plus de Scudetti ?" },
      { lessonId: lessons3[2].id, type: "SELECT", order: 2, question: "Quel club milanais a remporté 7 Ligues des Champions ?" },
      { lessonId: lessons3[2].id, type: "SELECT", order: 3, question: "Quel club turinois est surnommé 'La Vecchia Signora' ?" },
      { lessonId: lessons3[2].id, type: "SELECT", order: 4, question: "Quel club romain a remporté le Scudetto en 2001 ?" },
      { lessonId: lessons3[2].id, type: "SELECT", order: 5, question: "Quel club de Naples a été champion avec Maradona ?" },
      // Leçon 4: Allemagne
      { lessonId: lessons3[3].id, type: "SELECT", order: 1, question: "Quel club allemand a le plus de Bundesliga ?" },
      { lessonId: lessons3[3].id, type: "SELECT", order: 2, question: "Quel stade est le plus grand d'Allemagne ?" },
      { lessonId: lessons3[3].id, type: "SELECT", order: 3, question: "Quel club bavarois a remporté un sextuplé en 2020 ?" },
      { lessonId: lessons3[3].id, type: "SELECT", order: 4, question: "Quel club de la Ruhr est surnommé 'Die Schwarzgelben' ?" },
      { lessonId: lessons3[3].id, type: "SELECT", order: 5, question: "Quel club de Hambourg est le seul à n'avoir jamais été relégué ?" },
      // Leçon 5: France
      { lessonId: lessons3[4].id, type: "SELECT", order: 1, question: "Quel club français a le plus de titres de Ligue 1 ?" },
      { lessonId: lessons3[4].id, type: "SELECT", order: 2, question: "Quel club a remporté la Ligue des Champions en 1993 ?" },
      { lessonId: lessons3[4].id, type: "SELECT", order: 3, question: "Quel club de la capitale a remporté sa première Ligue des Champions en 2020 ?" },
      { lessonId: lessons3[4].id, type: "SELECT", order: 4, question: "Quel club lyonnais a remporté 7 titres consécutifs ?" },
      { lessonId: lessons3[4].id, type: "SELECT", order: 5, question: "Quel club monégasque a atteint la finale de la Ligue des Champions en 2004 ?" },
      // Leçon 6: Amérique du Sud
      { lessonId: lessons3[5].id, type: "SELECT", order: 1, question: "Quel club argentin est surnommé 'Los Millonarios' ?" },
      { lessonId: lessons3[5].id, type: "SELECT", order: 2, question: "Quel club brésilien a remporté le plus de Libertadores ?" },
      { lessonId: lessons3[5].id, type: "SELECT", order: 3, question: "Quel club uruguayen a remporté le plus de championnats ?" },
      { lessonId: lessons3[5].id, type: "SELECT", order: 4, question: "Quel club colombien a révélé Radamel Falcao ?" },
      { lessonId: lessons3[5].id, type: "SELECT", order: 5, question: "Quel club chilien est le plus titré du pays ?" }
    ]).returning();

    console.log(`   ✅ Unité 3 créée avec ${challenges3.length} challenges`);

    // ================================================
    // UNITÉ 4: Règles du Football
    // ================================================
    console.log("\n📦 Création de l'unité 4: Règles du Football");
    
    const [unit4] = await db.insert(schema.units).values({
      courseId: courseId,
      title: "Règles du Football",
      description: "Maîtrisez toutes les règles du football",
      order: unitOrder++
    }).returning();

    const lessons4 = await db.insert(schema.lessons).values([
      { unitId: unit4.id, order: 1, title: "Règles de base" },
      { unitId: unit4.id, order: 2, title: "Le hors-jeu" },
      { unitId: unit4.id, order: 3, title: "Fautes et sanctions" },
      { unitId: unit4.id, order: 4, title: "Les arrêts de jeu" },
      { unitId: unit4.id, order: 5, title: "Les compétitions" },
      { unitId: unit4.id, order: 6, title: "Les gestes techniques" }
    ]).returning();

    const challenges4 = await db.insert(schema.challenges).values([
      // Leçon 1: Règles de base
      { lessonId: lessons4[0].id, type: "SELECT", order: 1, question: "Combien de joueurs compose une équipe sur le terrain ?" },
      { lessonId: lessons4[0].id, type: "SELECT", order: 2, question: "Quelle est la durée réglementaire d'un match ?" },
      { lessonId: lessons4[0].id, type: "SELECT", order: 3, question: "Quelle est la taille réglementaire d'un but ?" },
      { lessonId: lessons4[0].id, type: "SELECT", order: 4, question: "Quel est le poids réglementaire d'un ballon ?" },
      { lessonId: lessons4[0].id, type: "SELECT", order: 5, question: "Quelle est la circonférence réglementaire d'un ballon ?" },
      // Leçon 2: Hors-jeu
      { lessonId: lessons4[1].id, type: "SELECT", order: 1, question: "Un joueur est-il hors-jeu sur un coup de pied de but ?" },
      { lessonId: lessons4[1].id, type: "SELECT", order: 2, question: "Combien de défenseurs doivent être entre l'attaquant et le but ?" },
      { lessonId: lessons4[1].id, type: "SELECT", order: 3, question: "Le hors-jeu est-il sifflé si le joueur est sur sa moitié de terrain ?" },
      { lessonId: lessons4[1].id, type: "SELECT", order: 4, question: "Un joueur peut-il être hors-jeu sur une touche ?" },
      { lessonId: lessons4[1].id, type: "SELECT", order: 5, question: "La VAR peut-elle annuler un but pour hors-jeu ?" },
      // Leçon 3: Fautes
      { lessonId: lessons4[2].id, type: "SELECT", order: 1, question: "Quelle faute est sanctionnée par un carton rouge direct ?" },
      { lessonId: lessons4[2].id, type: "SELECT", order: 2, question: "Combien de cartons jaunes entraînent un carton rouge ?" },
      { lessonId: lessons4[2].id, type: "SELECT", order: 3, question: "Un penalty est-il direct ou indirect ?" },
      { lessonId: lessons4[2].id, type: "SELECT", order: 4, question: "Quelle surface délimite la zone de penalty ?" },
      { lessonId: lessons4[2].id, type: "SELECT", order: 5, question: "Peut-on marquer directement sur un coup franc indirect ?" },
      // Leçon 4: Arrêts de jeu
      { lessonId: lessons4[3].id, type: "SELECT", order: 1, question: "Combien de remplacements sont autorisés en match officiel ?" },
      { lessonId: lessons4[3].id, type: "SELECT", order: 2, question: "Un joueur expulsé peut-il être remplacé ?" },
      { lessonId: lessons4[3].id, type: "SELECT", order: 3, question: "Quelle est la procédure pour une prolongation ?" },
      { lessonId: lessons4[3].id, type: "SELECT", order: 4, question: "Quand utilise-t-on la règle des buts à l'extérieur ?" },
      { lessonId: lessons4[3].id, type: "SELECT", order: 5, question: "Combien de tirs au but par équipe en début de séance ?" },
      // Leçon 5: Compétitions
      { lessonId: lessons4[4].id, type: "SELECT", order: 1, question: "Combien d'équipes participent à la Coupe du Monde ?" },
      { lessonId: lessons4[4].id, type: "SELECT", order: 2, question: "Combien d'équipes participent à l'Euro ?" },
      { lessonId: lessons4[4].id, type: "SELECT", order: 3, question: "Combien de matchs faut-il gagner pour remporter la Ligue des Champions ?" },
      { lessonId: lessons4[4].id, type: "SELECT", order: 4, question: "Combien de descentes en Ligue 1 ?" },
      { lessonId: lessons4[4].id, type: "SELECT", order: 5, question: "Qu'est-ce que la règle du fair-play financier ?" },
      // Leçon 6: Gestes techniques
      { lessonId: lessons4[5].id, type: "SELECT", order: 1, question: "Quelle technique permet d'éliminer un adversaire en une touche ?" },
      { lessonId: lessons4[5].id, type: "SELECT", order: 2, question: "Quel geste permet de frapper la balle avec l'extérieur du pied ?" },
      { lessonId: lessons4[5].id, type: "SELECT", order: 3, question: "Qu'est-ce qu'un 'coup du sombrero' ?" },
      { lessonId: lessons4[5].id, type: "SELECT", order: 4, question: "Quelle est la technique de Zidane ?" },
      { lessonId: lessons4[5].id, type: "SELECT", order: 5, question: "Qu'est-ce qu'un 'rabona' ?" }
    ]).returning();

    console.log(`   ✅ Unité 4 créée avec ${challenges4.length} challenges`);

    // ================================================
    // UNITÉ 5: Compétitions Internationales
    // ================================================
    console.log("\n📦 Création de l'unité 5: Compétitions Internationales");
    
    const [unit5] = await db.insert(schema.units).values({
      courseId: courseId,
      title: "Compétitions Internationales",
      description: "Les grandes compétitions qui font vibrer le monde",
      order: unitOrder++
    }).returning();

    const lessons5 = await db.insert(schema.lessons).values([
      { unitId: unit5.id, order: 1, title: "Coupe du Monde" },
      { unitId: unit5.id, order: 2, title: "Championnat d'Europe" },
      { unitId: unit5.id, order: 3, title: "Copa América" },
      { unitId: unit5.id, order: 4, title: "Coupe d'Afrique des Nations" },
      { unitId: unit5.id, order: 5, title: "Ligue des Nations" },
      { unitId: unit5.id, order: 6, title: "Coupe du Monde des Clubs" }
    ]).returning();

    const challenges5 = await db.insert(schema.challenges).values([
      // Leçon 1: Coupe du Monde
      { lessonId: lessons5[0].id, type: "SELECT", order: 1, question: "Quel pays a disputé le plus de finales de Coupe du Monde ?" },
      { lessonId: lessons5[0].id, type: "SELECT", order: 2, question: "Quel pays a été champion du monde à domicile ?" },
      { lessonId: lessons5[0].id, type: "SELECT", order: 3, question: "Quel pays a remporté la Coupe du Monde en 2018 ?" },
      { lessonId: lessons5[0].id, type: "SELECT", order: 4, question: "Quel pays a remporté la Coupe du Monde en 2022 ?" },
      { lessonId: lessons5[0].id, type: "SELECT", order: 5, question: "Quel pays organisera la Coupe du Monde 2026 ?" },
      // Leçon 2: Euro
      { lessonId: lessons5[1].id, type: "SELECT", order: 1, question: "Quel pays a remporté l'Euro 2016 ?" },
      { lessonId: lessons5[1].id, type: "SELECT", order: 2, question: "Quel pays a remporté l'Euro 2020 ?" },
      { lessonId: lessons5[1].id, type: "SELECT", order: 3, question: "Quel pays a le plus de titres à l'Euro ?" },
      { lessonId: lessons5[1].id, type: "SELECT", order: 4, question: "Quel pays a atteint 3 finales consécutives ?" },
      { lessonId: lessons5[1].id, type: "SELECT", order: 5, question: "Où se déroulera l'Euro 2024 ?" },
      // Leçon 3: Copa América
      { lessonId: lessons5[2].id, type: "SELECT", order: 1, question: "Quel pays a le plus de Copa América ?" },
      { lessonId: lessons5[2].id, type: "SELECT", order: 2, question: "Quel pays a remporté la Copa América 2021 ?" },
      { lessonId: lessons5[2].id, type: "SELECT", order: 3, question: "Quand a eu lieu la première Copa América ?" },
      { lessonId: lessons5[2].id, type: "SELECT", order: 4, question: "Combien de pays participent à la Copa América ?" },
      { lessonId: lessons5[2].id, type: "SELECT", order: 5, question: "Quel pays a invité des équipes d'autres confédérations ?" },
      // Leçon 4: CAN
      { lessonId: lessons5[3].id, type: "SELECT", order: 1, question: "Quel pays a le plus de CAN ?" },
      { lessonId: lessons5[3].id, type: "SELECT", order: 2, question: "Quel pays a remporté la CAN 2021 ?" },
      { lessonId: lessons5[3].id, type: "SELECT", order: 3, question: "Quand a eu lieu la première CAN ?" },
      { lessonId: lessons5[3].id, type: "SELECT", order: 4, question: "Combien d'équipes participent à la CAN ?" },
      { lessonId: lessons5[3].id, type: "SELECT", order: 5, question: "Quel pays organisera la CAN 2023 ?" },
      // Leçon 5: Ligue des Nations
      { lessonId: lessons5[4].id, type: "SELECT", order: 1, question: "Quand a été créée la Ligue des Nations ?" },
      { lessonId: lessons5[4].id, type: "SELECT", order: 2, question: "Quel pays a remporté la première Ligue des Nations ?" },
      { lessonId: lessons5[4].id, type: "SELECT", order: 3, question: "Quel pays a remporté la Ligue des Nations 2021 ?" },
      { lessonId: lessons5[4].id, type: "SELECT", order: 4, question: "Combien de divisions compte la Ligue des Nations ?" },
      { lessonId: lessons5[4].id, type: "SELECT", order: 5, question: "La Ligue des Nations offre-t-elle un billet pour l'Euro ?" },
      // Leçon 6: Coupe du Monde des Clubs
      { lessonId: lessons5[5].id, type: "SELECT", order: 1, question: "Quand a été créée la Coupe du Monde des Clubs ?" },
      { lessonId: lessons5[5].id, type: "SELECT", order: 2, question: "Quel club a le plus de titres ?" },
      { lessonId: lessons5[5].id, type: "SELECT", order: 3, question: "Quel club a remporté l'édition 2022 ?" },
      { lessonId: lessons5[5].id, type: "SELECT", order: 4, question: "Combien de clubs participent au tournoi ?" },
      { lessonId: lessons5[5].id, type: "SELECT", order: 5, question: "Quel continent envoie le plus de représentants ?" }
    ]).returning();

    console.log(`   ✅ Unité 5 créée avec ${challenges5.length} challenges`);

    // ================================================
    // CRÉATION DES OPTIONS (5 options par challenge)
    // ================================================
    
    console.log("\n🔧 Création des options pour tous les challenges...");
    
    const allOptions: {
      challengeId: number;
      correct: boolean;
      text: string;
      blank?: number | null;
      order?: number | null;
    }[] = [];

    const addOptions5 = (challenges: any[], optionsList: { text: string; correct: boolean; blank?: number; order?: number }[][]) => {
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

    // Options pour Unité 1
    const unit1Options = [
      // Leçon 1 - 5 challenges
      [
        { text: "Angleterre", correct: true }, { text: "Brésil", correct: false }, { text: "France", correct: false }, { text: "Allemagne", correct: false }, { text: "Italie", correct: false }
      ],
      [
        { text: "1863", correct: true }, { text: "1848", correct: false }, { text: "1872", correct: false }, { text: "1855", correct: false }, { text: "1880", correct: false }
      ],
      [
        { text: "Sheffield FC", correct: true }, { text: "Manchester United", correct: false }, { text: "Real Madrid", correct: false }, { text: "Barcelona", correct: false }, { text: "Arsenal", correct: false }
      ],
      [
        { text: "Angleterre - Écosse (1872)", correct: true }, { text: "France - Allemagne", correct: false }, { text: "Brésil - Argentine", correct: false }, { text: "Italie - France", correct: false }, { text: "Espagne - Portugal", correct: false }
      ],
      [
        { text: "La FA (Angleterre)", correct: true }, { text: "La FIFA", correct: false }, { text: "L'UEFA", correct: false }, { text: "La FFF", correct: false }, { text: "La CONMEBOL", correct: false }
      ],
      // Leçon 2 - 5 challenges
      [
        { text: "1904", correct: true }, { text: "1900", correct: false }, { text: "1908", correct: false }, { text: "1910", correct: false }, { text: "1896", correct: false }
      ],
      [
        { text: "France (Paris)", correct: true }, { text: "Angleterre", correct: false }, { text: "Suisse", correct: false }, { text: "Belgique", correct: false }, { text: "Pays-Bas", correct: false }
      ],
      [
        { text: "Robert Guérin", correct: true }, { text: "Jules Rimet", correct: false }, { text: "Sepp Blatter", correct: false }, { text: "Gianni Infantino", correct: false }, { text: "João Havelange", correct: false }
      ],
      [
        { text: "211", correct: true }, { text: "200", correct: false }, { text: "220", correct: false }, { text: "195", correct: false }, { text: "205", correct: false }
      ],
      [
        { text: "Zurich (Suisse)", correct: true }, { text: "Paris", correct: false }, { text: "Londres", correct: false }, { text: "Genève", correct: false }, { text: "Berlin", correct: false }
      ],
      // Leçon 3 - 5 challenges
      [
        { text: "1930", correct: true }, { text: "1934", correct: false }, { text: "1928", correct: false }, { text: "1932", correct: false }, { text: "1936", correct: false }
      ],
      [
        { text: "Uruguay", correct: true }, { text: "Argentine", correct: false }, { text: "Brésil", correct: false }, { text: "France", correct: false }, { text: "Italie", correct: false }
      ],
      [
        { text: "Uruguay", correct: true }, { text: "Argentine", correct: false }, { text: "Brésil", correct: false }, { text: "Italie", correct: false }, { text: "France", correct: false }
      ],
      [
        { text: "Brésil (5 titres)", correct: true }, { text: "Allemagne (4)", correct: false }, { text: "Italie (4)", correct: false }, { text: "Argentine (3)", correct: false }, { text: "France (2)", correct: false }
      ],
      [
        { text: "Hongrie 9-0 Corée du Sud (1954)", correct: true }, { text: "Brésil 7-1 Allemagne", correct: false }, { text: "Yougoslavie 9-0 Zaïre", correct: false }, { text: "Allemagne 8-0 Arabie Saoudite", correct: false }, { text: "Portugal 7-0 Corée du Nord", correct: false }
      ],
      // Leçon 4 - 5 challenges
      [
        { text: "1960", correct: true }, { text: "1958", correct: false }, { text: "1962", correct: false }, { text: "1964", correct: false }, { text: "1956", correct: false }
      ],
      [
        { text: "URSS", correct: true }, { text: "Yougoslavie", correct: false }, { text: "France", correct: false }, { text: "Allemagne", correct: false }, { text: "Italie", correct: false }
      ],
      [
        { text: "Allemagne (3 titres)", correct: true }, { text: "Espagne (3)", correct: false }, { text: "France (2)", correct: false }, { text: "Italie (2)", correct: false }, { text: "URSS (1)", correct: false }
      ],
      [
        { text: "France", correct: true }, { text: "Allemagne", correct: false }, { text: "Angleterre", correct: false }, { text: "Espagne", correct: false }, { text: "Italie", correct: false }
      ],
      [
        { text: "Italie", correct: true }, { text: "Angleterre", correct: false }, { text: "Espagne", correct: false }, { text: "France", correct: false }, { text: "Belgique", correct: false }
      ],
      // Leçon 5 - 5 challenges
      [
        { text: "1955", correct: true }, { text: "1950", correct: false }, { text: "1960", correct: false }, { text: "1945", correct: false }, { text: "1965", correct: false }
      ],
      [
        { text: "Real Madrid", correct: true }, { text: "AC Milan", correct: false }, { text: "Bayern Munich", correct: false }, { text: "Barcelona", correct: false }, { text: "Liverpool", correct: false }
      ],
      [
        { text: "Real Madrid (14 titres)", correct: true }, { text: "AC Milan (7)", correct: false }, { text: "Bayern Munich (6)", correct: false }, { text: "Liverpool (6)", correct: false }, { text: "Barcelona (5)", correct: false }
      ],
      [
        { text: "Cristiano Ronaldo (140)", correct: true }, { text: "Lionel Messi (129)", correct: false }, { text: "Robert Lewandowski", correct: false }, { text: "Karim Benzema", correct: false }, { text: "Raúl", correct: false }
      ],
      [
        { text: "Real Madrid 2-0 Liverpool (2022)", correct: true }, { text: "Bayern 1-0 PSG", correct: false }, { text: "Real 1-0 Atlético", correct: false }, { text: "Barcelona 2-0 Manchester", correct: false }, { text: "Liverpool 2-0 Tottenham", correct: false }
      ],
      // Leçon 6 - 5 challenges
      [
        { text: "1908", correct: true }, { text: "1900", correct: false }, { text: "1912", correct: false }, { text: "1896", correct: false }, { text: "1920", correct: false }
      ],
      [
        { text: "1925", correct: true }, { text: "1900", correct: false }, { text: "1910", correct: false }, { text: "1930", correct: false }, { text: "1940", correct: false }
      ],
      [
        { text: "1970", correct: true }, { text: "1966", correct: false }, { text: "1974", correct: false }, { text: "1958", correct: false }, { text: "1982", correct: false }
      ],
      [
        { text: "1994", correct: true }, { text: "1988", correct: false }, { text: "1990", correct: false }, { text: "1996", correct: false }, { text: "1992", correct: false }
      ],
      [
        { text: "2012", correct: true }, { text: "2010", correct: false }, { text: "2014", correct: false }, { text: "2008", correct: false }, { text: "2016", correct: false }
      ]
    ];

    addOptions5(challenges1, unit1Options);

    // Options pour Unité 2
    const unit2Options = [
      // Leçon 1 - 5 challenges
      [
        { text: "Pelé", correct: true }, { text: "Maradona", correct: false }, { text: "Zico", correct: false }, { text: "Ronaldo", correct: false }, { text: "Romário", correct: false }
      ],
      [
        { text: "Maradona", correct: true }, { text: "Messi", correct: false }, { text: "Pelé", correct: false }, { text: "Ronaldo", correct: false }, { text: "Cruyff", correct: false }
      ],
      [
        { text: "Beckenbauer", correct: true }, { text: "Müller", correct: false }, { text: "Rummenigge", correct: false }, { text: "Matthäus", correct: false }, { text: "Breitner", correct: false }
      ],
      [
        { text: "Cruyff", correct: true }, { text: "Van Basten", correct: false }, { text: "Gullit", correct: false }, { text: "Bergkamp", correct: false }, { text: "Robben", correct: false }
      ],
      [
        { text: "François M'Pelé", correct: true }, { text: "Platini", correct: false }, { text: "Zidane", correct: false }, { text: "Henry", correct: false }, { text: "Giresse", correct: false }
      ],
      // Leçon 2 - 5 challenges
      [
        { text: "Ronaldo", correct: true }, { text: "Romário", correct: false }, { text: "Rivaldo", correct: false }, { text: "Ronaldinho", correct: false }, { text: "Kaká", correct: false }
      ],
      [
        { text: "Roberto Baggio", correct: true }, { text: "Del Piero", correct: false }, { text: "Totti", correct: false }, { text: "Vieri", correct: false }, { text: "Inzaghi", correct: false }
      ],
      [
        { text: "Zidane", correct: true }, { text: "Henry", correct: false }, { text: "Trezeguet", correct: false }, { text: "Djorkaeff", correct: false }, { text: "Petit", correct: false }
      ],
      [
        { text: "Davor Šuker", correct: true }, { text: "Boban", correct: false }, { text: "Prosinečki", correct: false }, { text: "Jarni", correct: false }, { text: "Stanić", correct: false }
      ],
      [
        { text: "Chilavert", correct: true }, { text: "Campos", correct: false }, { text: "Higuita", correct: false }, { text: "Barthez", correct: false }, { text: "Kahn", correct: false }
      ],
      // Leçon 3 - 5 challenges
      [
        { text: "Figo", correct: true }, { text: "Rui Costa", correct: false }, { text: "Deco", correct: false }, { text: "Simão", correct: false }, { text: "Carvalho", correct: false }
      ],
      [
        { text: "Ronaldinho", correct: true }, { text: "Kaká", correct: false }, { text: "Rivaldo", correct: false }, { text: "Roberto Carlos", correct: false }, { text: "Ronaldo", correct: false }
      ],
      [
        { text: "Shevchenko", correct: true }, { text: "Rebrov", correct: false }, { text: "Tymoshchuk", correct: false }, { text: "Luzhny", correct: false }, { text: "Voronin", correct: false }
      ],
      [
        { text: "Cannavaro", correct: true }, { text: "Nesta", correct: false }, { text: "Maldini", correct: false }, { text: "Grosso", correct: false }, { text: "Materazzi", correct: false }
      ],
      [
        { text: "Alan Shearer", correct: true }, { text: "Owen", correct: false }, { text: "Rooney", correct: false }, { text: "Lineker", correct: false }, { text: "Fowler", correct: false }
      ],
      // Leçon 4 - 5 challenges
      [
        { text: "Lionel Messi", correct: true }, { text: "Di María", correct: false }, { text: "Álvarez", correct: false }, { text: "Fernández", correct: false }, { text: "Martínez", correct: false }
      ],
      [
        { text: "Cristiano Ronaldo", correct: true }, { text: "Eusébio", correct: false }, { text: "Figo", correct: false }, { text: "Rui Costa", correct: false }, { text: "Pauleta", correct: false }
      ],
      [
        { text: "Kylian Mbappé", correct: true }, { text: "Griezmann", correct: false }, { text: "Giroud", correct: false }, { text: "Dembélé", correct: false }, { text: "Coman", correct: false }
      ],
      [
        { text: "Erling Haaland", correct: true }, { text: "Ødegaard", correct: false }, { text: "Sørloth", correct: false }, { text: "King", correct: false }, { text: "Elyounoussi", correct: false }
      ],
      [
        { text: "Harry Kane", correct: true }, { text: "Rooney", correct: false }, { text: "Shearer", correct: false }, { text: "Lineker", correct: false }, { text: "Owen", correct: false }
      ],
      // Leçon 5 - 5 challenges
      [
        { text: "Buffon", correct: true }, { text: "Toldo", correct: false }, { text: "Pagliuca", correct: false }, { text: "Peruzzi", correct: false }, { text: "Zoff", correct: false }
      ],
      [
        { text: "Neuer", correct: true }, { text: "Kahn", correct: false }, { text: "Lehmann", correct: false }, { text: "Maier", correct: false }, { text: "Schumacher", correct: false }
      ],
      [
        { text: "Čech", correct: true }, { text: "Schmeichel", correct: false }, { text: "Courtois", correct: false }, { text: "Van der Sar", correct: false }, { text: "Cech", correct: false }
      ],
      [
        { text: "Casillas", correct: true }, { text: "De Gea", correct: false }, { text: "Valdés", correct: false }, { text: "Reina", correct: false }, { text: "Arrizabalaga", correct: false }
      ],
      [
        { text: "Courtois", correct: true }, { text: "Mignolet", correct: false }, { text: "Casteels", correct: false }, { text: "Kamplinski", correct: false }, { text: "Sels", correct: false }
      ],
      // Leçon 6 - 5 challenges
      [
        { text: "Lionel Messi (91)", correct: true }, { text: "Cristiano Ronaldo (69)", correct: false }, { text: "Lewandowski", correct: false }, { text: "Müller", correct: false }, { text: "Pelé", correct: false }
      ],
      [
        { text: "Lionel Messi (7)", correct: true }, { text: "Cristiano Ronaldo (5)", correct: false }, { text: "Platini (3)", correct: false }, { text: "Van Basten (3)", correct: false }, { text: "Cruyff (3)", correct: false }
      ],
      [
        { text: "Cristiano Ronaldo (14)", correct: true }, { text: "Platini (9)", correct: false }, { text: "Shearer (7)", correct: false }, { text: "Van Nistelrooy (6)", correct: false }, { text: "Kane (5)", correct: false }
      ],
      [
        { text: "Haaland (12)", correct: true }, { text: "Lewandowski (10)", correct: false }, { text: "Cristiano Ronaldo (11)", correct: false }, { text: "Messi (8)", correct: false }, { text: "Benzema (9)", correct: false }
      ],
      [
        { text: "Cristiano Ronaldo (196)", correct: true }, { text: "Messi (175)", correct: false }, { text: "Ramos (180)", correct: false }, { text: "Carvajal", correct: false }, { text: "Xavi", correct: false }
      ]
    ];

    addOptions5(challenges2, unit2Options);

    // Options pour Unité 3
    const unit3Options = [
      // Leçon 1 - 5 challenges
      [
        { text: "Real Madrid (35)", correct: true }, { text: "Barcelona (27)", correct: false }, { text: "Atlético Madrid (11)", correct: false }, { text: "Athletic Bilbao (8)", correct: false }, { text: "Valence (6)", correct: false }
      ],
      [
        { text: "Camp Nou (99 354)", correct: true }, { text: "Santiago Bernabéu", correct: false }, { text: "Metropolitano", correct: false }, { text: "Mestalla", correct: false }, { text: "San Mamés", correct: false }
      ],
      [
        { text: "Real Madrid", correct: true }, { text: "Atlético Madrid", correct: false }, { text: "Barcelona", correct: false }, { text: "Valence", correct: false }, { text: "Sevilla", correct: false }
      ],
      [
        { text: "Barcelona", correct: true }, { text: "Real Madrid", correct: false }, { text: "Atlético Madrid", correct: false }, { text: "Valence", correct: false }, { text: "Sevilla", correct: false }
      ],
      [
        { text: "Athletic Bilbao", correct: true }, { text: "Real Madrid", correct: false }, { text: "Barcelona", correct: false }, { text: "Atlético Madrid", correct: false }, { text: "Real Sociedad", correct: false }
      ],
      // Leçon 2 - 5 challenges
      [
        { text: "Manchester United (20)", correct: true }, { text: "Liverpool (19)", correct: false }, { text: "Arsenal (13)", correct: false }, { text: "Manchester City (8)", correct: false }, { text: "Chelsea (6)", correct: false }
      ],
      [
        { text: "Wembley (90 000)", correct: true }, { text: "Old Trafford", correct: false }, { text: "Emirates", correct: false }, { text: "Etihad", correct: false }, { text: "Anfield", correct: false }
      ],
      [
        { text: "Chelsea", correct: true }, { text: "Arsenal", correct: false }, { text: "Tottenham", correct: false }, { text: "Manchester United", correct: false }, { text: "Liverpool", correct: false }
      ],
      [
        { text: "Liverpool", correct: true }, { text: "Manchester United", correct: false }, { text: "Chelsea", correct: false }, { text: "Manchester City", correct: false }, { text: "Arsenal", correct: false }
      ],
      [
        { text: "Manchester United", correct: true }, { text: "Liverpool", correct: false }, { text: "Arsenal", correct: false }, { text: "Chelsea", correct: false }, { text: "Manchester City", correct: false }
      ],
      // Leçon 3 - 5 challenges
      [
        { text: "Juventus (36)", correct: true }, { text: "AC Milan (19)", correct: false }, { text: "Inter Milan (19)", correct: false }, { text: "Roma (3)", correct: false }, { text: "Naples (3)", correct: false }
      ],
      [
        { text: "AC Milan (7)", correct: true }, { text: "Inter Milan (3)", correct: false }, { text: "Juventus (2)", correct: false }, { text: "Roma (0)", correct: false }, { text: "Naples (0)", correct: false }
      ],
      [
        { text: "Juventus", correct: true }, { text: "Milan", correct: false }, { text: "Inter", correct: false }, { text: "Roma", correct: false }, { text: "Naples", correct: false }
      ],
      [
        { text: "AS Roma", correct: true }, { text: "Lazio", correct: false }, { text: "Juventus", correct: false }, { text: "Milan", correct: false }, { text: "Inter", correct: false }
      ],
      [
        { text: "Naples", correct: true }, { text: "Juventus", correct: false }, { text: "Milan", correct: false }, { text: "Inter", correct: false }, { text: "Roma", correct: false }
      ],
      // Leçon 4 - 5 challenges
      [
        { text: "Bayern Munich (32)", correct: true }, { text: "Borussia Dortmund (8)", correct: false }, { text: "Werder Brême (4)", correct: false }, { text: "Hambourg (3)", correct: false }, { text: "Stuttgart (3)", correct: false }
      ],
      [
        { text: "Signal Iduna Park (81 365)", correct: true }, { text: "Allianz Arena", correct: false }, { text: "Olympiastadion", correct: false }, { text: "Volksparkstadion", correct: false }, { text: "Veltins-Arena", correct: false }
      ],
      [
        { text: "Bayern Munich", correct: true }, { text: "Dortmund", correct: false }, { text: "RB Leipzig", correct: false }, { text: "Bayer Leverkusen", correct: false }, { text: "Wolfsburg", correct: false }
      ],
      [
        { text: "Borussia Dortmund", correct: true }, { text: "Bayern Munich", correct: false }, { text: "Schalke 04", correct: false }, { text: "Mönchengladbach", correct: false }, { text: "Bayer Leverkusen", correct: false }
      ],
      [
        { text: "Hambourg SV", correct: true }, { text: "Bayern Munich", correct: false }, { text: "Dortmund", correct: false }, { text: "Werder Brême", correct: false }, { text: "Mönchengladbach", correct: false }
      ],
      // Leçon 5 - 5 challenges
      [
        { text: "Saint-Étienne (10)", correct: true }, { text: "PSG (10)", correct: false }, { text: "Marseille (9)", correct: false }, { text: "Monaco (8)", correct: false }, { text: "Nantes (8)", correct: false }
      ],
      [
        { text: "Olympique de Marseille", correct: true }, { text: "PSG", correct: false }, { text: "Monaco", correct: false }, { text: "Lyon", correct: false }, { text: "Saint-Étienne", correct: false }
      ],
      [
        { text: "PSG", correct: true }, { text: "Lyon", correct: false }, { text: "Monaco", correct: false }, { text: "Marseille", correct: false }, { text: "Lille", correct: false }
      ],
      [
        { text: "Lyon", correct: true }, { text: "PSG", correct: false }, { text: "Monaco", correct: false }, { text: "Saint-Étienne", correct: false }, { text: "Marseille", correct: false }
      ],
      [
        { text: "Monaco", correct: true }, { text: "PSG", correct: false }, { text: "Lyon", correct: false }, { text: "Marseille", correct: false }, { text: "Bordeaux", correct: false }
      ],
      // Leçon 6 - 5 challenges
      [
        { text: "River Plate", correct: true }, { text: "Boca Juniors", correct: false }, { text: "Independiente", correct: false }, { text: "Racing", correct: false }, { text: "San Lorenzo", correct: false }
      ],
      [
        { text: "Independiente (7)", correct: true }, { text: "Boca Juniors (6)", correct: false }, { text: "River Plate (4)", correct: false }, { text: "Peñarol (5)", correct: false }, { text: "Santos (3)", correct: false }
      ],
      [
        { text: "Peñarol (51)", correct: true }, { text: "Nacional (49)", correct: false }, { text: "Montevideo Wanderers", correct: false }, { text: "Danubio", correct: false }, { text: "River Plate Uruguay", correct: false }
      ],
      [
        { text: "Atlético Nacional", correct: true }, { text: "Millonarios", correct: false }, { text: "Junior", correct: false }, { text: "Independiente Medellín", correct: false }, { text: "América de Cali", correct: false }
      ],
      [
        { text: "Colo-Colo (33)", correct: true }, { text: "Universidad de Chile", correct: false }, { text: "Universidad Católica", correct: false }, { text: "Palestino", correct: false }, { text: "Unión Española", correct: false }
      ]
    ];

    addOptions5(challenges3, unit3Options);

    // Options pour Unité 4
    const unit4Options = [
      // Leçon 1 - 5 challenges
      [
        { text: "11", correct: true }, { text: "10", correct: false }, { text: "12", correct: false }, { text: "9", correct: false }, { text: "13", correct: false }
      ],
      [
        { text: "90 minutes", correct: true }, { text: "80 minutes", correct: false }, { text: "100 minutes", correct: false }, { text: "85 minutes", correct: false }, { text: "95 minutes", correct: false }
      ],
      [
        { text: "7,32 m × 2,44 m", correct: true }, { text: "7 m × 2,30 m", correct: false }, { text: "7,50 m × 2,50 m", correct: false }, { text: "8 m × 2,50 m", correct: false }, { text: "7 m × 2,40 m", correct: false }
      ],
      [
        { text: "410-450 g", correct: true }, { text: "350-400 g", correct: false }, { text: "450-500 g", correct: false }, { text: "400-430 g", correct: false }, { text: "380-420 g", correct: false }
      ],
      [
        { text: "68-70 cm", correct: true }, { text: "60-65 cm", correct: false }, { text: "70-72 cm", correct: false }, { text: "65-68 cm", correct: false }, { text: "72-75 cm", correct: false }
      ],
      // Leçon 2 - 5 challenges
      [
        { text: "Non", correct: true }, { text: "Oui", correct: false }, { text: "Parfois", correct: false }, { text: "Uniquement si le ballon est touché", correct: false }, { text: "Selon l'arbitre", correct: false }
      ],
      [
        { text: "2 défenseurs", correct: true }, { text: "1 défenseur", correct: false }, { text: "3 défenseurs", correct: false }, { text: "4 défenseurs", correct: false }, { text: "Aucun", correct: false }
      ],
      [
        { text: "Non", correct: true }, { text: "Oui", correct: false }, { text: "Parfois", correct: false }, { text: "Uniquement sur coup franc", correct: false }, { text: "Selon l'arbitre", correct: false }
      ],
      [
        { text: "Non", correct: true }, { text: "Oui", correct: false }, { text: "Parfois", correct: false }, { text: "Uniquement si le ballon est joué vers l'avant", correct: false }, { text: "Selon l'arbitre", correct: false }
      ],
      [
        { text: "Oui", correct: true }, { text: "Non", correct: false }, { text: "Parfois", correct: false }, { text: "Uniquement pour les buts litigieux", correct: false }, { text: "Seulement sur demande des joueurs", correct: false }
      ],
      // Leçon 3 - 5 challenges
      [
        { text: "C'est un carton rouge direct", correct: true }, { text: "Un carton jaune", correct: false }, { text: "Un simple avertissement", correct: false }, { text: "Un penalty", correct: false }, { text: "Un coup franc", correct: false }
      ],
      [
        { text: "2 cartons jaunes", correct: true }, { text: "3 cartons jaunes", correct: false }, { text: "1 carton jaune", correct: false }, { text: "4 cartons jaunes", correct: false }, { text: "5 cartons jaunes", correct: false }
      ],
      [
        { text: "Direct", correct: true }, { text: "Indirect", correct: false }, { text: "Les deux", correct: false }, { text: "Ni l'un ni l'autre", correct: false }, { text: "Cela dépend de la faute", correct: false }
      ],
      [
        { text: "16,5 m", correct: true }, { text: "18 m", correct: false }, { text: "15 m", correct: false }, { text: "17 m", correct: false }, { text: "14 m", correct: false }
      ],
      [
        { text: "Non", correct: true }, { text: "Oui", correct: false }, { text: "Parfois", correct: false }, { text: "Si le ballon entre dans le but", correct: false }, { text: "Après un rebond", correct: false }
      ],
      // Leçon 4 - 5 challenges
      [
        { text: "5 remplacements", correct: true }, { text: "3 remplacements", correct: false }, { text: "4 remplacements", correct: false }, { text: "6 remplacements", correct: false }, { text: "7 remplacements", correct: false }
      ],
      [
        { text: "Non", correct: true }, { text: "Oui", correct: false }, { text: "Parfois", correct: false }, { text: "Uniquement si le match est amical", correct: false }, { text: "Dans les 10 premières minutes", correct: false }
      ],
      [
        { text: "2 fois 15 minutes", correct: true }, { text: "2 fois 10 minutes", correct: false }, { text: "2 fois 20 minutes", correct: false }, { text: "Une seule fois 30 minutes", correct: false }, { text: "Mort subite", correct: false }
      ],
      [
        { text: "En match aller-retour", correct: true }, { text: "En match unique", correct: false }, { text: "En finale", correct: false }, { text: "En phase de groupes", correct: false }, { text: "En quarts de finale", correct: false }
      ],
      [
        { text: "5 tirs par équipe", correct: true }, { text: "3 tirs", correct: false }, { text: "7 tirs", correct: false }, { text: "4 tirs", correct: false }, { text: "6 tirs", correct: false }
      ],
      // Leçon 5 - 5 challenges
      [
        { text: "32 équipes", correct: true }, { text: "24 équipes", correct: false }, { text: "48 équipes (dès 2026)", correct: false }, { text: "28 équipes", correct: false }, { text: "36 équipes", correct: false }
      ],
      [
        { text: "24 équipes", correct: true }, { text: "32 équipes", correct: false }, { text: "16 équipes", correct: false }, { text: "20 équipes", correct: false }, { text: "28 équipes", correct: false }
      ],
      [
        { text: "13 matchs", correct: true }, { text: "12 matchs", correct: false }, { text: "11 matchs", correct: false }, { text: "10 matchs", correct: false }, { text: "14 matchs", correct: false }
      ],
      [
        { text: "4 descentes en Ligue 2", correct: true }, { text: "3 descentes", correct: false }, { text: "2 descentes", correct: false }, { text: "5 descentes", correct: false }, { text: "6 descentes", correct: false }
      ],
      [
        { text: "Une règle limitant les pertes des clubs", correct: true }, { text: "Une règle sur les paris", correct: false }, { text: "Une règle sur les transferts", correct: false }, { text: "Une règle sur la formation", correct: false }, { text: "Une règle sur les salaires", correct: false }
      ],
      // Leçon 6 - 5 challenges
      [
        { text: "La roulette", correct: true }, { text: "Le sombrero", correct: false }, { text: "La rabona", correct: false }, { text: "L'elastico", correct: false }, { text: "La bicyclette", correct: false }
      ],
      [
        { text: "La trivela", correct: true }, { text: "La roulette", correct: false }, { text: "Le sombrero", correct: false }, { text: "La rabona", correct: false }, { text: "L'elastico", correct: false }
      ],
      [
        { text: "Faire passer le ballon au-dessus de la tête d'un adversaire", correct: true }, { text: "Frapper en pleine lucarne", correct: false }, { text: "Dribbler en feinte de corps", correct: false }, { text: "Faire un crochet", correct: false }, { text: "Une talonnade", correct: false }
      ],
      [
        { text: "La roulette marseillaise", correct: true }, { text: "La trivela", correct: false }, { text: "Le sombrero", correct: false }, { text: "La rabona", correct: false }, { text: "L'elastico", correct: false }
      ],
      [
        { text: "Croiser les jambes derrière le ballon pour frapper", correct: true }, { text: "Passer le ballon entre les jambes", correct: false }, { text: "Frapper en ciseaux", correct: false }, { text: "Faire une passe aveugle", correct: false }, { text: "Contrôler de la poitrine", correct: false }
      ]
    ];

    addOptions5(challenges4, unit4Options);

    // Options pour Unité 5
    const unit5Options = [
      // Leçon 1 - 5 challenges
      [
        { text: "Allemagne (8)", correct: true }, { text: "Brésil (7)", correct: false }, { text: "Italie (6)", correct: false }, { text: "Argentine (6)", correct: false }, { text: "France (4)", correct: false }
      ],
      [
        { text: "Uruguay (1930)", correct: true }, { text: "Italie (1934)", correct: false }, { text: "Angleterre (1966)", correct: false }, { text: "France (1998)", correct: false }, { text: "Argentine (1978)", correct: false }
      ],
      [
        { text: "France", correct: true }, { text: "Croatie", correct: false }, { text: "Belgique", correct: false }, { text: "Angleterre", correct: false }, { text: "Brésil", correct: false }
      ],
      [
        { text: "Argentine", correct: true }, { text: "France", correct: false }, { text: "Croatie", correct: false }, { text: "Maroc", correct: false }, { text: "Brésil", correct: false }
      ],
      [
        { text: "États-Unis, Canada, Mexique", correct: true }, { text: "Espagne, Portugal, Maroc", correct: false }, { text: "Angleterre, Irlande, Écosse", correct: false }, { text: "Argentine, Uruguay, Paraguay", correct: false }, { text: "Arabie Saoudite, Égypte, Grèce", correct: false }
      ],
      // Leçon 2 - 5 challenges
      [
        { text: "Portugal", correct: true }, { text: "France", correct: false }, { text: "Allemagne", correct: false }, { text: "Espagne", correct: false }, { text: "Italie", correct: false }
      ],
      [
        { text: "Italie", correct: true }, { text: "Angleterre", correct: false }, { text: "Espagne", correct: false }, { text: "France", correct: false }, { text: "Allemagne", correct: false }
      ],
      [
        { text: "Allemagne (3 titres)", correct: true }, { text: "Espagne (3)", correct: false }, { text: "France (2)", correct: false }, { text: "Italie (2)", correct: false }, { text: "URSS (1)", correct: false }
      ],
      [
        { text: "URSS (1960,1964,1968,1972,1988)", correct: true }, { text: "Allemagne", correct: false }, { text: "Espagne", correct: false }, { text: "France", correct: false }, { text: "Italie", correct: false }
      ],
      [
        { text: "Allemagne", correct: true }, { text: "France", correct: false }, { text: "Angleterre", correct: false }, { text: "Espagne", correct: false }, { text: "Italie", correct: false }
      ],
      // Leçon 3 - 5 challenges
      [
        { text: "Uruguay (15 titres)", correct: true }, { text: "Argentine (15)", correct: false }, { text: "Brésil (9)", correct: false }, { text: "Paraguay (2)", correct: false }, { text: "Chili (2)", correct: false }
      ],
      [
        { text: "Argentine", correct: true }, { text: "Brésil", correct: false }, { text: "Uruguay", correct: false }, { text: "Chili", correct: false }, { text: "Colombie", correct: false }
      ],
      [
        { text: "1916", correct: true }, { text: "1920", correct: false }, { text: "1930", correct: false }, { text: "1910", correct: false }, { text: "1918", correct: false }
      ],
      [
        { text: "10 pays", correct: true }, { text: "12 pays", correct: false }, { text: "8 pays", correct: false }, { text: "16 pays", correct: false }, { text: "14 pays", correct: false }
      ],
      [
        { text: "Japon et Qatar", correct: true }, { text: "États-Unis et Canada", correct: false }, { text: "Australie et Chine", correct: false }, { text: "Maroc et Tunisie", correct: false }, { text: "Corée et Australie", correct: false }
      ],
      // Leçon 4 - 5 challenges
      [
        { text: "Égypte (7 titres)", correct: true }, { text: "Cameroun (5)", correct: false }, { text: "Ghana (4)", correct: false }, { text: "Nigeria (3)", correct: false }, { text: "Côte d'Ivoire (2)", correct: false }
      ],
      [
        { text: "Sénégal", correct: true }, { text: "Égypte", correct: false }, { text: "Cameroun", correct: false }, { text: "Maroc", correct: false }, { text: "Algérie", correct: false }
      ],
      [
        { text: "1957", correct: true }, { text: "1960", correct: false }, { text: "1950", correct: false }, { text: "1965", correct: false }, { text: "1955", correct: false }
      ],
      [
        { text: "24 équipes", correct: true }, { text: "16 équipes", correct: false }, { text: "32 équipes", correct: false }, { text: "20 équipes", correct: false }, { text: "28 équipes", correct: false }
      ],
      [
        { text: "Côte d'Ivoire", correct: true }, { text: "Maroc", correct: false }, { text: "Nigeria", correct: false }, { text: "Sénégal", correct: false }, { text: "Cameroun", correct: false }
      ],
      // Leçon 5 - 5 challenges
      [
        { text: "2018", correct: true }, { text: "2016", correct: false }, { text: "2017", correct: false }, { text: "2019", correct: false }, { text: "2020", correct: false }
      ],
      [
        { text: "Portugal", correct: true }, { text: "France", correct: false }, { text: "Allemagne", correct: false }, { text: "Espagne", correct: false }, { text: "Italie", correct: false }
      ],
      [
        { text: "France", correct: true }, { text: "Espagne", correct: false }, { text: "Italie", correct: false }, { text: "Belgique", correct: false }, { text: "Allemagne", correct: false }
      ],
      [
        { text: "4 divisions", correct: true }, { text: "3 divisions", correct: false }, { text: "5 divisions", correct: false }, { text: "2 divisions", correct: false }, { text: "6 divisions", correct: false }
      ],
      [
        { text: "Oui", correct: true }, { text: "Non", correct: false }, { text: "Uniquement pour le vainqueur", correct: false }, { text: "Uniquement pour les finalistes", correct: false }, { text: "Cela dépend des nations", correct: false }
      ],
      // Leçon 6 - 5 challenges
      [
        { text: "2000", correct: true }, { text: "1998", correct: false }, { text: "2002", correct: false }, { text: "1995", correct: false }, { text: "2005", correct: false }
      ],
      [
        { text: "Real Madrid (5)", correct: true }, { text: "Barcelona (3)", correct: false }, { text: "Bayern Munich (2)", correct: false }, { text: "Liverpool (1)", correct: false }, { text: "Milan (1)", correct: false }
      ],
      [
        { text: "Real Madrid", correct: true }, { text: "Flamengo", correct: false }, { text: "Al-Hilal", correct: false }, { text: "Al-Ahly", correct: false }, { text: "Chelsea", correct: false }
      ],
      [
        { text: "7 clubs", correct: true }, { text: "8 clubs", correct: false }, { text: "6 clubs", correct: false }, { text: "10 clubs", correct: false }, { text: "5 clubs", correct: false }
      ],
      [
        { text: "Europe (4 clubs)", correct: true }, { text: "Amérique du Sud (2)", correct: false }, { text: "Asie (1)", correct: false }, { text: "Afrique (1)", correct: false }, { text: "Océanie (1)", correct: false }
      ]
    ];

    addOptions5(challenges5, unit5Options);

    // Insertion de toutes les options
    if (allOptions.length > 0) {
      await db.insert(schema.challengeOptions).values(allOptions);
      console.log(`✅ ${allOptions.length} options créées`);
    }

    // ================================================
    // RÉSUMÉ FINAL
    // ================================================
    console.log("\n" + "=".repeat(70));
    console.log("📊 RÉSUMÉ DE LA CRÉATION DU COURS FOOTBALL:");
    console.log("=".repeat(70));
    
    const allUnits = [unit1, unit2, unit3, unit4, unit5];
    const allLessons = [...lessons1, ...lessons2, ...lessons3, ...lessons4, ...lessons5];
    const allChallenges = [...challenges1, ...challenges2, ...challenges3, ...challenges4, ...challenges5];
    
    console.log(`\n📚 Cours créé: ${footballCourse.title} (ID: ${courseId})`);
    console.log(`\n📖 Unités: ${allUnits.length}`);
    allUnits.forEach((unit, idx) => {
      const lessonCount = allLessons.filter(l => l.unitId === unit.id).length;
      const challengeCount = allChallenges.filter(c => {
        const lesson = allLessons.find(l => l.id === c.lessonId);
        return lesson?.unitId === unit.id;
      }).length;
      console.log(`   ${idx + 1}. ${unit.title} - ${lessonCount} leçons, ${challengeCount} challenges`);
    });
    
    console.log(`\n🎯 Total de leçons: ${allLessons.length}`);
    console.log(`🎯 Total de challenges: ${allChallenges.length}`);
    console.log(`🔢 Total d'options: ${allOptions.length} (5 options par challenge)`);
    
    console.log("\n📋 CONTENU DU COURS:");
    console.log("   ✅ Unité 1: Histoire du Football (origines, FIFA, Coupe du Monde, Euro, LDC, grandes dates)");
    console.log("   ✅ Unité 2: Grands Joueurs (légendes, années 90, génération 2000, stars actuelles, gardiens, records)");
    console.log("   ✅ Unité 3: Clubs Légendaires (Espagne, Angleterre, Italie, Allemagne, France, Amérique du Sud)");
    console.log("   ✅ Unité 4: Règles du Football (base, hors-jeu, fautes, arrêts, compétitions, gestes techniques)");
    console.log("   ✅ Unité 5: Compétitions Internationales (CDM, Euro, Copa América, CAN, Ligue des Nations, Mondial des Clubs)");
    
    console.log("\n✅ Cours Football créé avec succès !");

  } catch (error) {
    console.error("❌ Erreur lors de la création:", error);
    throw new Error("Échec de la création du cours Football");
  }
};

// Exécuter la fonction
addFootballCourse();