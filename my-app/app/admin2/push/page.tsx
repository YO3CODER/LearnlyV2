"use client";

import { useState } from "react";
import { Check, Send, RotateCcw, Zap, Crown, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const TEMPLATES = [
  {
    id: "daily",
    label: "Rappel du jour",
    title: "Rappel du jour",
    message: "Tu n'as pas encore fait ta leçon aujourd'hui !",
    image: "/quete3.svg",
    color: "from-sky-400 to-blue-500",
    bgGradient: "from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20",
    borderColor: "border-sky-200 dark:border-sky-700",
  },
  {
    id: "new-lesson",
    label: "Nouvelle leçon",
    title: "Nouvelle leçon disponible",
    message: "Une nouvelle leçon t'attend sur Learnly. Apprends dès maintenant !",
    image: "/courses.svg",
    color: "from-emerald-400 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
    borderColor: "border-emerald-200 dark:border-emerald-700",
  },
  {
    id: "streak-danger",
    label: "Serie en danger",
    title: "Ta serie est en danger",
    message: "Tu risques de perdre ta serie. Fais une leçon maintenant pour la conserver !",
    image: "/mascot.svg",
    color: "from-rose-400 to-pink-500",
    bgGradient: "from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20",
    borderColor: "border-rose-200 dark:border-rose-700",
  },
];

export default function PushAdminPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: number; failed: number } | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const send = async () => {
    if (!title || !message) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setTitle("");
    setMessage("");
    setResult(null);
    setSelectedTemplate(null);
  };

  const selectTemplate = (template: typeof TEMPLATES[0]) => {
    setTitle(template.title);
    setMessage(template.message);
    setResult(null);
    setSelectedTemplate(template.id);
  };

  const charCount = message.length;
  const charLimit = 150;
  const charPercentage = Math.min((charCount / charLimit) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900/30 dark:to-indigo-900/30 p-4 sm:p-6">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header avec mascotte */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
            {/* Logo et titre */}
            <div className="flex items-start gap-4 flex-1">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl blur-lg opacity-50" />
                <div className="relative w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-9 h-9 sm:w-11 sm:h-11 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
              </div>
              <div className="pt-1">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Notifi<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">cations</span>
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Reste connecte avec tes utilisateurs</p>
              </div>
            </div>

            {/* Images decoratives */}
            <div className="hidden lg:flex items-end justify-end gap-4">
              <img
                src="/quete3.svg"
                alt="Quete"
                className="w-20 h-20 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
              />
              <img
                src="/courses.svg"
                alt="Courses"
                className="w-20 h-20 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
              />
              <img
                src="/mascot.svg"
                alt="Mascot"
                className="w-24 h-24 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-3 border border-white/40 dark:border-slate-700/40">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Statut</p>
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">Actif</p>
            </div>
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-3 border border-white/40 dark:border-slate-700/40">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Caracteres</p>
              <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">{charCount}/{charLimit}</p>
            </div>
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-3 border border-white/40 dark:border-slate-700/40 col-span-2 sm:col-span-1">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Mode</p>
              <p className="text-lg font-black text-purple-600 dark:text-purple-400">Admin</p>
            </div>
          </div>
        </div>

        {/* Templates rapides avec cartes ameliorees */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            Modeles rapides
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => selectTemplate(template)}
                onMouseEnter={() => setHoveredTemplate(template.id)}
                onMouseLeave={() => setHoveredTemplate(null)}
                className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-lg"
              >
                {/* Background avec gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${template.bgGradient} border ${template.borderColor}`} />

                {/* Gradient anime au hover */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  style={{
                    background: `linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)`,
                  }}
                />

                {/* Contenu */}
                <div className="relative p-4 sm:p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex flex-col items-start gap-2">
                      {template.image && (
                        <img
                          src={template.image}
                          alt={template.label}
                          className="w-12 h-12 object-contain opacity-80"
                        />
                      )}
                    </div>
                    {selectedTemplate === template.id && (
                      <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white text-left mb-1">
                    {template.label}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 text-left line-clamp-2">
                    {template.title}
                  </p>
                </div>

                {/* Border gradient animation */}
                <div
                  className={`absolute inset-0 pointer-events-none transition-all duration-500 ${
                    hoveredTemplate === template.id
                      ? `shadow-[inset_0_0_20px_rgba(59,130,246,0.2)]`
                      : ""
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Formulaire principal */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8 flex flex-col gap-6">
            {/* Input Titre */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Target className="w-3.5 h-3.5" />
                Titre
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Rappel du jour"
                  maxLength={60}
                  className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-white text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all placeholder:text-slate-400"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                  {title.length}/60
                </span>
              </div>
            </div>

            {/* Input Message */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Crown className="w-3.5 h-3.5" />
                Message
              </label>
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ex: Tu n'as pas encore fait ta lecon aujourd'hui !"
                  rows={5}
                  maxLength={charLimit}
                  className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-white text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all placeholder:text-slate-400 resize-none"
                />
                <div className="absolute bottom-3 right-4 flex items-center gap-2">
                  {charCount > charLimit * 0.8 && (
                    <span className={`text-xs font-semibold ${charCount > charLimit * 0.9 ? "text-rose-500" : "text-amber-500"}`}>
                      {charCount}/{charLimit}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-200 rounded-full ${
                    charPercentage > 90
                      ? "bg-gradient-to-r from-rose-400 to-rose-500"
                      : charPercentage > 70
                      ? "bg-gradient-to-r from-amber-400 to-amber-500"
                      : "bg-gradient-to-r from-emerald-400 to-emerald-500"
                  }`}
                  style={{ width: `${charPercentage}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 text-right">
                {charLimit - charCount} caracteres restants
              </p>
            </div>

            {/* Apercu de notification */}
            {(title || message) && (
              <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 p-5 flex gap-4 items-start overflow-hidden relative group">
                {/* Gradient background au hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />

                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div className="relative flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {title || "Titre de la notification"}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {message || "Contenu du message..."}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">Learnly · a l'instant</p>
                </div>
              </div>
            )}

            {/* Resultat succes/erreur */}
            {result && (
              <div
                className={`rounded-2xl p-5 border-2 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300 ${
                  result.failed === 0
                    ? "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-700"
                    : "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-700"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    result.failed === 0
                      ? "bg-emerald-100 dark:bg-emerald-800"
                      : "bg-amber-100 dark:bg-amber-800"
                  }`}
                >
                  {result.failed === 0 ? (
                    <Check className={`w-5 h-5 text-emerald-600 dark:text-emerald-300`} />
                  ) : (
                    <svg className="w-5 h-5 text-amber-600 dark:text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm font-bold ${
                      result.failed === 0
                        ? "text-emerald-700 dark:text-emerald-300"
                        : "text-amber-700 dark:text-amber-300"
                    }`}
                  >
                    {result.success} notification{result.success > 1 ? "s" : ""} envoyee{result.success > 1 ? "s" : ""} avec succes
                  </p>
                  {result.failed > 0 && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                      {result.failed} echouee{result.failed > 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={reset}
                disabled={loading}
                variant="primary"
                className="px-5 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reinitialiser
              </Button>
              <Button
                onClick={send}
                disabled={loading || !title || !message}
                variant="primary"
                className="flex-1 px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Envoyer</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Footer minimaliste */}
        <div className="mt-12 text-center text-xs text-slate-500 dark:text-slate-400">
          <p>Conseil : Les notifications courtes et pertinentes ont un taux d'engagement plus eleve</p>
        </div>
      </div>

      {/* Style pour les animations */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}