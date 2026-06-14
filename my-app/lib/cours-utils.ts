export type Categorie = string;

/** Catégories par défaut (utilisées en cas d'échec de récupération depuis l'API) */
export const CATEGORIES: Categorie[] = ["Maths", "Français", "Sciences", "Histoire"];

export type Cours = {
  id: number;
  titre: string;
  lien: string;
  videoId: string;
  categorie: Categorie;
  pdfCours?: string | null;
  pdfFiche?: string | null;
  pdfCorrige?: string | null;
};

/**
 * Récupère la liste des catégories depuis l'API (table `categories` en BD).
 * Retourne CATEGORIES en cas d'erreur ou de liste vide.
 */
export async function fetchCategories(): Promise<Categorie[]> {
  try {
    const res = await fetch("/api/admin2/categories");
    if (!res.ok) return CATEGORIES;
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : CATEGORIES;
  } catch {
    return CATEGORIES;
  }
}

/**
 * Extrait l'identifiant vidéo depuis une URL YouTube
 */
export function extraireYoutubeId(url: string): string | null {
  const motifs = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const motif of motifs) {
    const m = url.match(motif);
    if (m) return m[1];
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim();
  return null;
}

/** Convertit une ligne de la base (snake_case) en objet Cours */
export function mapLigneVersCours(ligne: any): Cours {
  return {
    id: ligne.id,
    titre: ligne.titre,
    lien: ligne.lien,
    videoId: ligne.video_id,
    categorie: ligne.categorie,
    pdfCours: ligne.pdf_cours,
    pdfFiche: ligne.pdf_fiche,
    pdfCorrige: ligne.pdf_corrige,
  };
} 