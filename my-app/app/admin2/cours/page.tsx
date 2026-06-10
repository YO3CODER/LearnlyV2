"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Cours, CATEGORIES, Categorie, extraireYoutubeId } from "@/lib/cours-utils";

const fredoka = { fontFamily: "'Fredoka', sans-serif" } as const;

type Formulaire = {
  id: number | null;
  titre: string;
  urlYoutube: string;
  categorie: Categorie;
  pdfCours: string;
  pdfFiche: string;
  pdfCorrige: string;
};

const FORMULAIRE_VIDE: Formulaire = {
  id: null,
  titre: "",
  urlYoutube: "",
  categorie: "Maths",
  pdfCours: "",
  pdfFiche: "",
  pdfCorrige: "",
};

const couleursCategorie: Record<Categorie, string> = {
  Maths: "bg-sky-100 text-sky-700",
  Français: "bg-violet-100 text-violet-700",
  Sciences: "bg-emerald-100 text-emerald-700",
  Histoire: "bg-amber-100 text-amber-700",
};

// ─── Champ d'envoi PDF ───────────────────────────────────────────────────────

type ChampPdfProps = {
  label: string;
  valeur: string;
  onChange: (url: string) => void;
};

const ChampPdf = ({ label, valeur, onChange }: ChampPdfProps) => {
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const envoyerFichier = async (fichier: File) => {
    setEnvoiEnCours(true);
    setErreur(null);
    try {
      const donnees = new FormData();
      donnees.append("fichier", fichier);
      const res = await fetch("/api/admin2/televerser", { method: "POST", body: donnees });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur d'envoi");
      onChange(data.url);
    } catch (err: any) {
      setErreur(err.message);
    } finally {
      setEnvoiEnCours(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-700" style={fredoka}>
        {label}
      </label>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          const fichier = e.target.files?.[0];
          if (fichier) envoyerFichier(fichier);
        }}
        className="text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-sky-100 file:text-sky-700 file:font-semibold file:cursor-pointer hover:file:bg-sky-200"
      />
      {envoiEnCours && (
        <p className="text-xs text-gray-400" style={fredoka}>Envoi en cours…</p>
      )}
      {erreur && (
        <p className="text-xs text-rose-500" style={fredoka}>{erreur}</p>
      )}
      {valeur && !envoiEnCours && (
        <a
          href={valeur}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-emerald-600 underline truncate"
          style={fredoka}
        >
          Fichier en ligne — voir
        </a>
      )}
      {valeur && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-xs text-rose-500 self-start"
          style={fredoka}
        >
          Retirer le fichier
        </button>
      )}
    </div>
  );
};

// ─── Page Admin ──────────────────────────────────────────────────────────────

export default function PageAdminCours() {
  const [coursListe, setCoursListe] = useState<Cours[]>([]);
  const [chargement, setChargement] = useState(true);
  const [formulaire, setFormulaire] = useState<Formulaire>(FORMULAIRE_VIDE);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [erreurFormulaire, setErreurFormulaire] = useState<string | null>(null);

  const chargerCours = async () => {
    setChargement(true);
    try {
      const res = await fetch("/api/admin2/cours");
      const data = await res.json();
      setCoursListe(data);
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerCours();
  }, []);

  const apercuVideoId = extraireYoutubeId(formulaire.urlYoutube);

  const reinitialiserFormulaire = () => {
    setFormulaire(FORMULAIRE_VIDE);
    setErreurFormulaire(null);
  };

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreurFormulaire(null);

    if (!formulaire.titre.trim()) {
      setErreurFormulaire("Le titre est requis");
      return;
    }
    if (!extraireYoutubeId(formulaire.urlYoutube)) {
      setErreurFormulaire("URL YouTube invalide");
      return;
    }

    setEnvoiEnCours(true);
    try {
      const payload = {
        titre: formulaire.titre,
        urlYoutube: formulaire.urlYoutube,
        categorie: formulaire.categorie,
        pdfCours: formulaire.pdfCours || null,
        pdfFiche: formulaire.pdfFiche || null,
        pdfCorrige: formulaire.pdfCorrige || null,
      };

      const res = await fetch(
        formulaire.id ? `/api/admin2/cours/${formulaire.id}` : "/api/admin2/cours",
        {
          method: formulaire.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");

      reinitialiserFormulaire();
      chargerCours();
    } catch (err: any) {
      setErreurFormulaire(err.message);
    } finally {
      setEnvoiEnCours(false);
    }
  };

  const modifier = (cours: Cours) => {
    setFormulaire({
      id: cours.id,
      titre: cours.titre,
      urlYoutube: cours.lien,
      categorie: cours.categorie,
      pdfCours: cours.pdfCours || "",
      pdfFiche: cours.pdfFiche || "",
      pdfCorrige: cours.pdfCorrige || "",
    });
    setErreurFormulaire(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const supprimer = async (id: number) => {
    if (!confirm("Supprimer ce cours ?")) return;
    await fetch(`/api/admin2/cours/${id}`, { method: "DELETE" });
    chargerCours();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800" style={fredoka}>
            Administration des cours
          </h1>
          <p className="text-sm text-gray-400" style={fredoka}>
            Ajouter, modifier ou supprimer des cours vidéo
          </p>
        </div>

        {/* Formulaire */}
        <form
          onSubmit={soumettre}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4"
        >
          <h2 className="text-base font-semibold text-gray-700" style={fredoka}>
            {formulaire.id ? "Modifier le cours" : "Ajouter un cours"}
          </h2>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700" style={fredoka}>
              Titre
            </label>
            <input
              type="text"
              value={formulaire.titre}
              onChange={(e) => setFormulaire((f) => ({ ...f, titre: e.target.value }))}
              style={fredoka}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
              placeholder="Ex : Résoudre une équation"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700" style={fredoka}>
              URL YouTube
            </label>
            <input
              type="text"
              value={formulaire.urlYoutube}
              onChange={(e) => setFormulaire((f) => ({ ...f, urlYoutube: e.target.value }))}
              style={fredoka}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
              placeholder="https://youtu.be/..."
            />
            {formulaire.urlYoutube && !apercuVideoId && (
              <p className="text-xs text-rose-500" style={fredoka}>
                URL non reconnue
              </p>
            )}
            {apercuVideoId && (
              <img
                src={`https://img.youtube.com/vi/${apercuVideoId}/mqdefault.jpg`}
                alt="Aperçu"
                className="w-40 rounded-lg border border-gray-200 mt-1"
              />
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700" style={fredoka}>
              Catégorie
            </label>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormulaire((f) => ({ ...f, categorie: cat }))}
                  style={fredoka}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-semibold border transition-all",
                    formulaire.categorie === cat
                      ? "bg-sky-500 text-white border-sky-600"
                      : couleursCategorie[cat] + " border-transparent"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ChampPdf
              label="Cours PDF"
              valeur={formulaire.pdfCours}
              onChange={(url) => setFormulaire((f) => ({ ...f, pdfCours: url }))}
            />
            <ChampPdf
              label="Fiche PDF"
              valeur={formulaire.pdfFiche}
              onChange={(url) => setFormulaire((f) => ({ ...f, pdfFiche: url }))}
            />
            <ChampPdf
              label="Corrigé PDF"
              valeur={formulaire.pdfCorrige}
              onChange={(url) => setFormulaire((f) => ({ ...f, pdfCorrige: url }))}
            />
          </div>

          {erreurFormulaire && (
            <p className="text-sm text-rose-500" style={fredoka}>{erreurFormulaire}</p>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={envoiEnCours}
              style={fredoka}
              className="px-4 py-2 rounded-lg font-semibold text-sm bg-sky-500 text-white border-b-4 border-sky-600 hover:bg-sky-500/90 active:border-b-0 transition-all disabled:opacity-50"
            >
              {envoiEnCours ? "Enregistrement…" : formulaire.id ? "Mettre à jour" : "Ajouter le cours"}
            </button>
            {formulaire.id && (
              <button
                type="button"
                onClick={reinitialiserFormulaire}
                style={fredoka}
                className="px-4 py-2 rounded-lg font-semibold text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
              >
                Annuler
              </button>
            )}
          </div>
        </form>

        {/* Liste des cours */}
        <div>
          <h2 className="text-base font-semibold text-gray-700 mb-3" style={fredoka}>
            Cours existants ({coursListe.length})
          </h2>
          {chargement ? (
            <p className="text-sm text-gray-400" style={fredoka}>Chargement…</p>
          ) : coursListe.length === 0 ? (
            <p className="text-sm text-gray-400" style={fredoka}>Aucun cours pour le moment</p>
          ) : (
            <div className="space-y-2">
              {coursListe.map((cours) => (
                <div
                  key={cours.id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex items-center gap-3"
                >
                  <img
                    src={`https://img.youtube.com/vi/${cours.videoId}/default.jpg`}
                    alt={cours.titre}
                    className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate" style={fredoka}>
                      {cours.titre}
                    </p>
                    <span
                      style={fredoka}
                      className={cn(
                        "inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1",
                        couleursCategorie[cours.categorie]
                      )}
                    >
                      {cours.categorie}
                    </span>
                  </div>
                  <button
                    onClick={() => modifier(cours)}
                    style={fredoka}
                    className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-sky-100 text-sky-700 hover:bg-sky-200 transition-all flex-shrink-0"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => supprimer(cours.id)}
                    style={fredoka}
                    className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-rose-100 text-rose-600 hover:bg-rose-200 transition-all flex-shrink-0"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}