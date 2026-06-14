"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

const SUBJECTS = [
  { label: "Français",      color: "bg-blue-100 text-blue-700 border-blue-200" },
  { label: "Mathématiques", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { label: "Informatique",  color: "bg-green-100 text-green-700 border-green-200" },
  { label: "Physique",      color: "bg-orange-100 text-orange-700 border-orange-200" },
  { label: "Anglais",       color: "bg-rose-100 text-rose-700 border-rose-200" },
  { label: "SVT",           color: "bg-teal-100 text-teal-700 border-teal-200" },
];

export const PrivateCoursesBanner = () => {
  return (
    <div className="w-full mb-8">
      {/* CARTE PRINCIPALE */}
      <div
        className="
          relative w-full rounded-2xl overflow-hidden
          bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700
          shadow-lg
          animate-fade-in
        "
        style={{ animation: "fadeSlideIn 0.5s ease both" }}
      >
        <style>{`
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulseRing {
            0%, 100% { transform: scale(1); opacity: 0.15; }
            50%       { transform: scale(1.15); opacity: 0.25; }
          }
          @keyframes tagPop {
            from { opacity: 0; transform: scale(0.85) translateY(6px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
          .subject-tag {
            animation: tagPop 0.4s ease both;
          }
          .subject-tag:nth-child(1) { animation-delay: 0.1s; }
          .subject-tag:nth-child(2) { animation-delay: 0.18s; }
          .subject-tag:nth-child(3) { animation-delay: 0.26s; }
          .subject-tag:nth-child(4) { animation-delay: 0.34s; }
          .subject-tag:nth-child(5) { animation-delay: 0.42s; }
          .subject-tag:nth-child(6) { animation-delay: 0.50s; }

          .cta-btn {
            transition: transform 0.15s ease, box-shadow 0.15s ease;
          }
          .cta-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
          }
          .cta-btn:active {
            transform: translateY(0);
          }
        `}</style>

        {/* CERCLE DÉCORATIF */}
        <div
          className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white"
          style={{ animation: "pulseRing 3s ease-in-out infinite", opacity: 0.15 }}
        />
        <div
          className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white"
          style={{ animation: "pulseRing 3s ease-in-out infinite 1s", opacity: 0.1 }}
        />

        {/* CONTENU */}
        <div className="relative z-10 p-6 flex flex-col gap-5">

          {/* EN-TÊTE */}
          <div className="flex items-center gap-4">
            <div className="shrink-0 bg-white/20 rounded-xl p-2">
              <Image
                src="/courses.svg"
                alt="Cours privés"
                width={48}
                height={48}
              />
            </div>
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-0.5">
                Learnly
              </p>
              <h2 className="text-white font-bold text-xl leading-tight">
                Cours particuliers privés
              </h2>
              <p className="text-white/80 text-sm mt-0.5">
                Un formateur dédié, à ton rythme
              </p>
            </div>
          </div>

          {/* MATIÈRES */}
          <div className="flex flex-wrap gap-2">
            {SUBJECTS.map((s) => (
              <span
                key={s.label}
                className={`subject-tag px-3 py-1 rounded-full text-xs font-bold border bg-white ${s.color}`}
              >
                {s.label}
              </span>
            ))}
          </div>

          {/* BOUTON CTA */}
          <Button variant="secondary" asChild className="cta-btn self-start">
            <a
              href="https://wa.me/2250700601174"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-green-500"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.532 5.855L.057 23.882a.5.5 0 0 0 .61.61l6.087-1.461A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.845 9.845 0 0 1-5.031-1.381l-.36-.214-3.733.896.93-3.647-.235-.374A9.855 9.855 0 0 1 2.118 12C2.118 6.533 6.533 2.118 12 2.118S21.882 6.533 21.882 12 17.467 21.882 12 21.882z"/>
              </svg>
              Réserver une séance
            </a>
          </Button>

        </div>
      </div>
    </div>
  );
};