import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { mapLigneVersCours, extraireYoutubeId, CATEGORIES } from "@/lib/cours-utils";

export async function GET() {
  const lignes = await sql`
    SELECT id, titre, lien, video_id, categorie, pdf_cours, pdf_fiche, pdf_corrige
    FROM cours
    ORDER BY cree_le DESC
  `;
  return NextResponse.json(lignes.map(mapLigneVersCours));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { titre, urlYoutube, categorie, pdfCours, pdfFiche, pdfCorrige } = body;

    if (!titre?.trim()) {
      return NextResponse.json({ error: "Le titre est requis" }, { status: 400 });
    }
    if (!CATEGORIES.includes(categorie)) {
      return NextResponse.json({ error: "Catégorie invalide" }, { status: 400 });
    }

    const videoId = extraireYoutubeId(urlYoutube ?? "");
    if (!videoId) {
      return NextResponse.json({ error: "URL YouTube invalide" }, { status: 400 });
    }

    const lien = `https://youtu.be/${videoId}`;

    const [ligne] = await sql`
      INSERT INTO cours (titre, lien, video_id, categorie, pdf_cours, pdf_fiche, pdf_corrige)
      VALUES (${titre.trim()}, ${lien}, ${videoId}, ${categorie}, ${pdfCours || null}, ${pdfFiche || null}, ${pdfCorrige || null})
      RETURNING id, titre, lien, video_id, categorie, pdf_cours, pdf_fiche, pdf_corrige
    `;

    return NextResponse.json(mapLigneVersCours(ligne), { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}