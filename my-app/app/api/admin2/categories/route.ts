// app/api/admin2/categories/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const rows = await sql`SELECT nom FROM categories ORDER BY nom ASC`;
    return NextResponse.json(rows.map((r: any) => r.nom));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { nom } = await request.json();

    if (!nom?.trim()) {
      return NextResponse.json({ error: "Nom requis" }, { status: 400 });
    }

    const trimmed = nom.trim();

    const existing = await sql`SELECT nom FROM categories WHERE nom = ${trimmed}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: "Catégorie déjà existante" }, { status: 409 });
    }

    await sql`INSERT INTO categories (nom) VALUES (${trimmed})`;

    return NextResponse.json({ nom: trimmed });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { nom } = await request.json();

    if (!nom?.trim()) {
      return NextResponse.json({ error: "Nom requis" }, { status: 400 });
    }

    // Empêcher la suppression si des cours utilisent cette catégorie
    const used = await sql`SELECT id FROM cours WHERE categorie = ${nom} LIMIT 1`;
    if (used.length > 0) {
      return NextResponse.json(
        { error: "Catégorie utilisée par des cours, suppression impossible" },
        { status: 409 }
      );
    }

    await sql`DELETE FROM categories WHERE nom = ${nom}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}