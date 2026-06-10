import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { mapLigneVersCours, extraireYoutubeId, CATEGORIES } from "@/lib/cours-utils";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
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
      UPDATE cours
      SET titre = ${titre.trim()},
          lien = ${lien},
          video_id = ${videoId},
          categorie = ${categorie},
          pdf_cours = ${pdfCours || null},
          pdf_fiche = ${pdfFiche || null},
          pdf_corrige = ${pdfCorrige || null}
      WHERE id = ${id}
      RETURNING id, titre, lien, video_id, categorie, pdf_cours, pdf_fiche, pdf_corrige
    `;

    if (!ligne) {
      return NextResponse.json({ error: "Cours introuvable" }, { status: 404 });
    }

    return NextResponse.json(mapLigneVersCours(ligne));
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    await sql`DELETE FROM cours WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}