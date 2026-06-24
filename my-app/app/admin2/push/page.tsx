"use client";

import { useState } from "react";

export default function PushAdminPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: number; failed: number } | null>(null);

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

  return (
    <div className="max-w-xl mx-auto p-8 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Envoyer une notification</h1>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm">Titre</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Rappel du jour"
          className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ex: Tu n'as pas encore fait ta leçon aujourd'hui !"
          rows={4}
          className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      <button
        onClick={send}
        disabled={loading || !title || !message}
        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {loading ? "Envoi en cours..." : "Envoyer"}
      </button>

      {result && (
        <div className="p-4 rounded-xl bg-gray-100 text-sm">
          <p className="text-green-600 font-medium">{result.success} envoyé(s) avec succès</p>
          {result.failed > 0 && (
            <p className="text-red-500">{result.failed} échoué(s)</p>
          )}
        </div>
      )}
    </div>
  );
}