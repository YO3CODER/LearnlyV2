import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { mapLigneVersCours } from "@/lib/cours-utils"

export async function GET() {
  try {
    const lignes = await sql`
      SELECT id, titre, lien, video_id, categorie, pdf_cours, pdf_fiche, pdf_corrige
      FROM cours
      ORDER BY cree_le DESC
    `;
    return NextResponse.json(lignes.map(mapLigneVersCours));
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}