"use client";

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 text-center">
      <img
        src="/mascot.svg"
        alt="Learnly"
        className="w-32 h-32"
      />
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Pas de connexion
      </h1>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm">
        Vérifie ta connexion internet et réessaie.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
      >
        Réessayer
      </button>
    </div>
  );
}