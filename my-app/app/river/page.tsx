'use client';

import { useRive } from '@rive-app/react-canvas';
import Image from 'next/image';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Sidebar } from '@/components/sidebar';
import { MobileNavbar } from '@/components/mobile-navbar';

const fredoka = { fontFamily: "'Fredoka', sans-serif" } as const;

const gifs = [
  { src: '/1.gif', label: 'Action 1' },
  { src: '/2.gif', label: 'Action 2' },
  { src: '/3.gif', label: 'Action 3' },
  { src: '/4.gif', label: 'Action 4' },
];

type GameId = 'piano' | 'expression' | 'gamification' | 'souris' | 'memory' | 'monde' | 'motdujour' | 'enigmes';

// ─── Énigmes ──────────────────────────────────────────────────────────────────
const ENIGMES = [
  { id: 1, texte: "En cuisine ou en médecine, elle trouve un usage. Graminée, elle délecte certains animaux. Édouard Manet l'a mise en scène dans un célèbre tableau. Qui est-elle ?", reponse: "ASPERGE", indice: "C'est un légume printanier vert." },
  { id: 2, texte: "Je suis toujours devant vous mais ne peut jamais être vu. Qu'est-ce que je suis ?", reponse: "FUTUR", indice: "C'est une notion temporelle." },
  { id: 3, texte: "Plus je sèche, plus je suis mouillée. Qu'est-ce que je suis ?", reponse: "SERVIETTE", indice: "On l'utilise après le bain." },
  { id: 4, texte: "J'ai des villes sans maisons, des forêts sans arbres, des eaux sans poissons. Qu'est-ce que je suis ?", reponse: "CARTE", indice: "On me consulte pour se repérer." },
  { id: 5, texte: "Je parle sans bouche, j'entends sans oreilles, je n'ai pas de corps mais prends vie avec le vent. Qu'est-ce que je suis ?", reponse: "ECO", indice: "Un phénomène sonore en montagne." },
  { id: 6, texte: "Plus je grandis, moins on me voit. Qu'est-ce que je suis ?", reponse: "NUIT", indice: "Elle succède au jour." },
  { id: 7, texte: "Je suis léger comme une plume, mais même l'homme le plus fort du monde ne peut me tenir plus de quelques minutes. Qu'est-ce que je suis ?", reponse: "SOUFFLE", indice: "On le retient sous l'eau." },
  { id: 8, texte: "J'ai une tête et une queue mais pas de corps. Qu'est-ce que je suis ?", reponse: "PIECE", indice: "On la lance pour trancher un choix." },
  { id: 9, texte: "Quel est le comble pour un électricien ?", reponse: "COURANT", indice: "Il est à la fois électrique et... actuel." },
  { id: 10, texte: "Je suis plein de trous mais je retiens l'eau. Qu'est-ce que je suis ?", reponse: "EPONGE", indice: "On me trouve dans la salle de bain." },
  { id: 11, texte: "Je cours tout le jour et je ne me fatigue pas. Je n'ai ni bras ni jambes. Qu'est-ce que je suis ?", reponse: "RIVIERE", indice: "L'eau y coule naturellement." },
  { id: 12, texte: "On me coupe mais on ne me mange pas. On me peigne mais je n'ai pas de dents. Qu'est-ce que je suis ?", reponse: "CHEVEUX", indice: "Ils poussent sur la tête." },
  { id: 13, texte: "Je suis à la fois blanc et noir, et je suis lu mais jamais dit. Qu'est-ce que je suis ?", reponse: "SILENCE", indice: "La musique en a besoin." },
  { id: 14, texte: "Plus on m'enlève, plus je suis grande. Qu'est-ce que je suis ?", reponse: "FOSSE", indice: "On creuse pour m'agrandir." },
  { id: 15, texte: "Je suis toujours en face de vous dans un miroir mais je ne suis pas vous. Qu'est-ce que je suis ?", reponse: "REFLET", indice: "Une image inversée." },
];

function getRandomEnigme() {
  return ENIGMES[Math.floor(Math.random() * ENIGMES.length)];
}

function EnigmesGame({ onClose }: { onClose: () => void }) {
  const [enigme, setEnigme] = useState(getRandomEnigme);
  const [reponse, setReponse] = useState('');
  const [statut, setStatut] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [showIndice, setShowIndice] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, [enigme]);

  const normalize = (s: string) =>
    s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim();

  const verifier = () => {
    if (!reponse.trim()) return;
    const correct = normalize(reponse) === normalize(enigme.reponse);
    setStatut(correct ? 'correct' : 'incorrect');
    setTotal(t => t + 1);
    if (correct) setScore(s => s + 1);
    else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const suivante = () => {
    setEnigme(getRandomEnigme());
    setReponse('');
    setStatut('idle');
    setShowIndice(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    if (e.key === 'Enter') statut === 'idle' ? verifier() : suivante();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#1a0a3c]" style={{
      backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(120,40,200,0.3) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(80,20,160,0.4) 0%, transparent 50%)',
    }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500 flex items-center justify-center text-lg">📖</div>
          <div>
            <p className="text-white font-bold text-sm leading-none" style={fredoka}>Livre des Énigmes</p>
            <p className="text-violet-300 text-xs mt-0.5" style={fredoka}>Enigme #{enigme.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Score */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            <span className="text-emerald-400 font-bold text-sm" style={fredoka}>{score}</span>
            <span className="text-white/40 text-xs">/</span>
            <span className="text-white/60 text-sm" style={fredoka}>{total}</span>
          </div>
          <button onClick={suivante} style={fredoka}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 text-xs font-semibold border border-white/10 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
            </svg>
            Nouvelle
          </button>
          <button onClick={onClose} style={fredoka}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/10 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Fermer
          </button>
        </div>
      </div>

      {/* Contenu */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg flex flex-col gap-6">

          {/* Carte énigme */}
          <div className="relative rounded-2xl bg-violet-800/40 border border-violet-500/30 p-8 backdrop-blur-sm">
            {/* Guillemets décoratifs */}
            <div className="absolute top-4 left-6 text-5xl text-violet-400/30 font-serif leading-none select-none">&quot;</div>
            <p className="text-white text-center text-lg leading-relaxed font-medium relative z-10 pt-4" style={fredoka}>
              {enigme.texte}
            </p>
          </div>

          {/* Résultat correct */}
          {statut === 'correct' && (
            <div className="rounded-2xl bg-emerald-500/20 border border-emerald-400/40 p-5 flex flex-col items-center gap-2 text-center">
              <div className="text-3xl">🎉</div>
              <p className="text-emerald-300 font-bold text-lg" style={fredoka}>Bravo ! C&apos;est correct !</p>
              <p className="text-emerald-200/70 text-sm" style={fredoka}>La réponse était : <strong className="text-white">{enigme.reponse}</strong></p>
              <button onClick={suivante} style={fredoka}
                className="mt-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm border-b-4 border-emerald-700 active:border-b-0 transition-all">
                Enigme suivante →
              </button>
            </div>
          )}

          {/* Résultat incorrect */}
          {statut === 'incorrect' && (
            <div className="rounded-2xl bg-red-500/20 border border-red-400/40 p-5 flex flex-col items-center gap-2 text-center">
              <div className="text-3xl">😅</div>
              <p className="text-red-300 font-bold text-lg" style={fredoka}>Pas tout à fait...</p>
              <p className="text-red-200/70 text-sm" style={fredoka}>La réponse était : <strong className="text-white">{enigme.reponse}</strong></p>
              <button onClick={suivante} style={fredoka}
                className="mt-2 px-6 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-bold text-sm border-b-4 border-violet-700 active:border-b-0 transition-all">
                Essayer une autre →
              </button>
            </div>
          )}

          {/* Champ de réponse */}
          {statut === 'idle' && (
            <div className={`flex flex-col gap-3 ${shake ? 'animate-[shake_0.4s_ease]' : ''}`}>
              <label className="text-white/60 text-sm text-center" style={fredoka}>Proposez un mot code :</label>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={reponse}
                  onChange={e => setReponse(e.target.value.toUpperCase())}
                  onKeyDown={handleKey}
                  placeholder="Votre réponse..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-center text-lg placeholder:text-white/20 focus:outline-none focus:border-violet-400 focus:bg-white/15 transition-all"
                  style={fredoka}
                />
                <button onClick={verifier} style={fredoka}
                  className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold border-b-4 border-red-700 active:border-b-0 transition-all">
                  OK
                </button>
              </div>

              {/* Indice */}
              <button onClick={() => setShowIndice(v => !v)} style={fredoka}
                className="text-violet-400 hover:text-violet-300 text-xs text-center underline underline-offset-2 transition-colors mt-1">
                {showIndice ? 'Masquer l\'indice' : 'Je donne ma langue au chat 💡'}
              </button>
              {showIndice && (
                <div className="rounded-xl bg-amber-500/10 border border-amber-400/20 px-4 py-3 text-amber-200 text-sm text-center" style={fredoka}>
                  💡 {enigme.indice}
                </div>
              )}
            </div>
          )}

          {/* Score mobile */}
          <div className="sm:hidden flex justify-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
              <span className="text-emerald-400 font-bold text-sm" style={fredoka}>{score} correct{score > 1 ? 's' : ''}</span>
              <span className="text-white/40 text-xs">sur</span>
              <span className="text-white/60 text-sm" style={fredoka}>{total} essai{total > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}

// ─── Mots du Jour ─────────────────────────────────────────────────────────────
const MOTS_5 = [
  'CHIEN','ARBRE','POMME','ROUGE','BLANC','NUAGE','PLAGE','LIVRE','FLEUR',
  'NUIT','JOUR','LUNDI','MARDI','SOLEIL','LUNE','ETOILE','PLUME',
  'TABLE','CHAISE','PORTE','PIANO','VERRE','LAMPE','FLUTE','COEUR',
  'TIGRE','LOUP','AIGLE','BISON','LAPIN','RENARD','HIBOU','LYNX','PANDA',
  'SUCRE','BEURRE','FARINE','MIEL','CAFE','PAIN','SOUPE','SALADE',
];

const MOTS_6 = [
  'JARDIN','SOLEIL','CHEMIN','MOULIN','BALCON','FLEUVE','VALLEE',
  'JAGUAR','REQUIN','CONDOR','TORTUE','GIRAFE','LOUTRE','CASTOR',
  'ORANGE','CITRON','CERISE','MANGUE','BANANE','MELON','POIRE',
  'GUITARE','VIOLON','CLOCHE','CYMBAL','ORGUE','HARPE','SITAR',
  'NUAGE','BRUME','ORAGE','ECLAIR','GIVRE','AURORE',
];

function getRandomMot(len: 5 | 6): string {
  const list = (len === 5 ? MOTS_5 : MOTS_6).filter(m => m.length === len);
  return list[Math.floor(Math.random() * list.length)].toUpperCase();
}

function normalizeStr(s: string) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
}

const KEYBOARD_ROWS = [
  ['A','Z','E','R','T','Y','U','I','O','P'],
  ['Q','S','D','F','G','H','J','K','L','M'],
  ['←','W','X','C','V','B','N','OK'],
];

type LetterState = 'correct' | 'present' | 'absent' | 'empty' | 'typing';

function getLetterColor(state: LetterState, forKey = false) {
  switch (state) {
    case 'correct': return 'bg-emerald-500 border-emerald-500 text-white';
    case 'present': return 'bg-amber-400 border-amber-400 text-white';
    case 'absent':  return forKey ? 'bg-zinc-600 border-zinc-600 text-white/50' : 'bg-zinc-700 border-zinc-700 text-white/60';
    case 'typing':  return 'bg-white/10 border-white text-white';
    default:        return 'bg-white/5 border-white/20 text-white/40';
  }
}

function MotDuJourGame({ onClose }: { onClose: () => void }) {
  const [wordLen, setWordLen] = useState<5 | 6 | null>(null);
  const [secret, setSecret] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [shake, setShake] = useState(false);
  const MAX_TRIES = 8;

  const startGame = (len: 5 | 6) => {
    setWordLen(len);
    setSecret(getRandomMot(len));
    setGuesses([]);
    setCurrent('');
    setWon(false);
    setLost(false);
  };

  const restart = () => { if (wordLen) startGame(wordLen); };

  const submit = useCallback(() => {
    if (!wordLen || current.length !== wordLen) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    const norm = normalizeStr(current);
    const newGuesses = [...guesses, norm];
    setGuesses(newGuesses);
    setCurrent('');
    if (norm === normalizeStr(secret)) setWon(true);
    else if (newGuesses.length >= MAX_TRIES) setLost(true);
  }, [current, guesses, secret, wordLen]);

  const pressKey = useCallback((key: string) => {
    if (won || lost || !wordLen) return;
    if (key === '←') setCurrent(c => c.slice(0, -1));
    else if (key === 'OK') submit();
    else if (current.length < wordLen) setCurrent(c => c + key);
  }, [won, lost, wordLen, current, submit]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const k = e.key.toUpperCase();
      if (k === 'BACKSPACE') pressKey('←');
      else if (k === 'ENTER') pressKey('OK');
      else if (/^[A-Z]$/.test(k)) pressKey(k);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [pressKey]);

  function evaluateGuess(guess: string, secret: string): LetterState[] {
    const norm = normalizeStr(secret);
    const result: LetterState[] = Array(guess.length).fill('absent') as LetterState[];
    const secretArr = norm.split('');
    const guessArr = normalizeStr(guess).split('');
    guessArr.forEach((l, i) => { if (l === secretArr[i]) { result[i] = 'correct'; secretArr[i] = ''; } });
    guessArr.forEach((l, i) => {
      if (result[i] === 'correct') return;
      const idx = secretArr.indexOf(l);
      if (idx !== -1) { result[i] = 'present'; secretArr[idx] = ''; }
    });
    return result;
  }

  const keyStates: Record<string, LetterState> = {};
  guesses.forEach(g => {
    const states = evaluateGuess(g, secret);
    g.split('').forEach((l, i) => {
      const prev = keyStates[l];
      const cur = states[i];
      if (prev === 'correct') return;
      if (prev === 'present' && cur === 'absent') return;
      keyStates[l] = cur;
    });
  });

  if (!wordLen) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 flex flex-col items-center justify-center gap-8">
        <button onClick={onClose} style={fredoka}
          className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm border border-white/20 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Fermer
        </button>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            {['M','O','T',' ','D','U',' ','J','O','U','R'].map((l, i) => (
              <div key={i} className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg ${
                l === ' ' ? 'bg-transparent' :
                i < 3 ? 'bg-emerald-500 text-white' :
                i > 3 && i < 5 ? 'bg-amber-400 text-white' :
                'bg-violet-500 text-white'
              }`} style={fredoka}>{l}</div>
            ))}
          </div>
          <p className="text-white/60 text-sm mt-3" style={fredoka}>Choisis la difficulté</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => startGame(5)} style={fredoka}
            className="flex flex-col items-center gap-2 px-8 py-5 rounded-2xl bg-violet-500/20 hover:bg-violet-500/40 border border-violet-400/40 text-white transition-all hover:scale-105">
            <span className="text-3xl font-bold">5</span>
            <span className="text-sm text-white/70">lettres</span>
            <span className="text-xs text-violet-300 mt-1">Facile</span>
          </button>
          <button onClick={() => startGame(6)} style={fredoka}
            className="flex flex-col items-center gap-2 px-8 py-5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/40 border border-amber-400/40 text-white transition-all hover:scale-105">
            <span className="text-3xl font-bold">6</span>
            <span className="text-sm text-white/70">lettres</span>
            <span className="text-xs text-amber-300 mt-1">Difficile</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 flex flex-col">
      <div className="flex items-center justify-between px-4 sm:px-8 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {['M','O','T'].map((l,i) => (
              <div key={i} className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold bg-emerald-500 text-white" style={fredoka}>{l}</div>
            ))}
          </div>
          <span className="text-white font-bold text-base" style={fredoka}>du Jour</span>
          <span className="text-white/40 text-xs" style={fredoka}>{wordLen} lettres · {MAX_TRIES} essais</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setWordLen(null)} style={fredoka}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 text-xs font-semibold border border-white/10 transition-all">
            Changer
          </button>
          <button onClick={restart} style={fredoka}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 text-xs font-semibold border border-white/10 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
            </svg>
            Nouveau
          </button>
          <button onClick={onClose} style={fredoka}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/10 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Fermer
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-2 overflow-auto">
        <div className="flex flex-col gap-1.5">
          {Array.from({ length: MAX_TRIES }).map((_, rowIdx) => {
            const isGuessed = rowIdx < guesses.length;
            const isCurrent = rowIdx === guesses.length;
            const guess = isGuessed ? guesses[rowIdx] : isCurrent ? current : '';
            const states = isGuessed ? evaluateGuess(guesses[rowIdx], secret) : null;
            return (
              <div key={rowIdx} className={`flex gap-1.5 ${isCurrent && shake ? 'animate-[shake_0.4s_ease]' : ''}`}>
                {Array.from({ length: wordLen }).map((_, colIdx) => {
                  const letter = guess[colIdx] || '';
                  const state: LetterState = isGuessed
                    ? (states![colIdx])
                    : isCurrent && letter ? 'typing' : 'empty';
                  return (
                    <div key={colIdx}
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg border-2 flex items-center justify-center font-bold text-xl sm:text-2xl transition-all duration-300 ${getLetterColor(state)}`}
                      style={{ ...fredoka, transitionDelay: isGuessed ? `${colIdx * 80}ms` : '0ms' }}>
                      {letter}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-2 pb-4 pt-2 flex flex-col gap-1.5 items-center">
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-1">
            {row.map(key => {
              const state = keyStates[key] || 'empty';
              const isSpecial = key === '←' || key === 'OK';
              return (
                <button key={key} onClick={() => pressKey(key)} style={fredoka}
                  className={`h-12 rounded-lg font-bold text-sm transition-all active:scale-95 ${
                    isSpecial
                      ? 'px-3 bg-white/15 border border-white/20 text-white hover:bg-white/25 min-w-[48px]'
                      : `w-9 border ${getLetterColor(state, true)} hover:brightness-110`
                  }`}>
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {(won || lost) && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 flex flex-col items-center gap-4 text-white text-center max-w-xs w-full mx-4">
            <div className="text-5xl">{won ? '🎉' : '😔'}</div>
            <h2 className="text-2xl font-bold" style={fredoka}>{won ? 'Bravo !' : 'Perdu !'}</h2>
            {won && <p className="text-white/70 text-sm" style={fredoka}>Trouvé en <strong>{guesses.length} essai{guesses.length > 1 ? 's' : ''}</strong> sur {MAX_TRIES} !</p>}
            {lost && (
              <div>
                <p className="text-white/70 text-sm mb-2" style={fredoka}>Le mot était :</p>
                <div className="flex gap-1 justify-center">
                  {secret.split('').map((l, i) => (
                    <div key={i} className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-lg" style={fredoka}>{l}</div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-3 mt-2 w-full">
              <button onClick={restart} style={fredoka} className="flex-1 py-3 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-bold text-sm border-b-4 border-violet-700 active:border-b-0 transition-all">Nouveau mot</button>
              <button onClick={() => setWordLen(null)} style={fredoka} className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all">Changer</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}

// ─── Jeu de mémoire ───────────────────────────────────────────────────────────
const MEMORY_PAIRS = [
  { id: 'chat',   label: 'Chat',   emoji: '🐱' },
  { id: 'chien',  label: 'Chien',  emoji: '🐶' },
  { id: 'soleil', label: 'Soleil', emoji: '☀️' },
  { id: 'lune',   label: 'Lune',   emoji: '🌙' },
  { id: 'fleur',  label: 'Fleur',  emoji: '🌸' },
  { id: 'etoile', label: 'Etoile', emoji: '⭐' },
  { id: 'pomme',  label: 'Pomme',  emoji: '🍎' },
  { id: 'coeur',  label: 'Coeur',  emoji: '❤️' },
];

type MemoryCard = { uid: number; id: string; label: string; emoji: string; flipped: boolean; matched: boolean; };

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function buildDeck(): MemoryCard[] {
  return shuffle([...MEMORY_PAIRS, ...MEMORY_PAIRS]).map((p, i) => ({ uid: i, ...p, flipped: false, matched: false }));
}

function MemoryGame({ onClose }: { onClose: () => void }) {
  const [cards, setCards] = useState<MemoryCard[]>(buildDeck);
  const [selected, setSelected] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running || won) return;
    const t = setInterval(() => setTime(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [running, won]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const flip = useCallback((uid: number) => {
    if (locked) return;
    const card = cards[uid];
    if (card.flipped || card.matched) return;
    const next = cards.map(c => c.uid === uid ? { ...c, flipped: true } : c);
    const newSelected = [...selected, uid];
    setCards(next);
    setSelected(newSelected);
    if (newSelected.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);
      const [a, b] = newSelected.map(i => next[i]);
      if (a.id === b.id) {
        setTimeout(() => { setCards(c => c.map(card => card.id === a.id ? { ...card, matched: true } : card)); setSelected([]); setLocked(false); }, 400);
      } else {
        setTimeout(() => { setCards(c => c.map(card => newSelected.includes(card.uid) ? { ...card, flipped: false } : card)); setSelected([]); setLocked(false); }, 900);
      }
    }
  }, [cards, selected, locked]);

  // Fix ESLint set-state-in-effect : setTimeout pour casser le cycle synchrone
  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.matched)) {
      const t = setTimeout(() => { setWon(true); setRunning(false); }, 0);
      return () => clearTimeout(t);
    }
  }, [cards]);

  const restart = () => { setCards(buildDeck()); setSelected([]); setLocked(false); setMoves(0); setWon(false); setTime(0); setRunning(true); };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
      <div className="flex items-center justify-between px-4 sm:px-8 py-4">
        <div className="flex items-center gap-6">
          <div className="text-white/80 text-sm font-semibold" style={fredoka}><span className="text-white text-lg">{moves}</span> coups</div>
          <div className="text-white/80 text-sm font-semibold" style={fredoka}><span className="text-white text-lg">{formatTime(time)}</span></div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={restart} style={fredoka} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm border border-white/20 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/></svg>
            Rejouer
          </button>
          <button onClick={onClose} style={fredoka} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm border border-white/20 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Fermer
          </button>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-4">
        <div className="grid grid-cols-4 gap-3 sm:gap-4 w-full max-w-lg">
          {cards.map((card) => (
            <button key={card.uid} onClick={() => flip(card.uid)} className="relative aspect-square" style={{ perspective: '600px' }}>
              <div style={{ transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)', transformStyle: 'preserve-3d', transform: card.flipped || card.matched ? 'rotateY(180deg)' : 'rotateY(0deg)', width: '100%', height: '100%', position: 'relative' }}>
                <div style={{ backfaceVisibility: 'hidden' }} className="absolute inset-0 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-2xl select-none">?</span>
                </div>
                <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }} className={`absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all ${card.matched ? 'bg-emerald-500/30 border-emerald-400/50' : 'bg-white/20 border-white/30'}`}>
                  <span className="text-3xl sm:text-4xl select-none">{card.emoji}</span>
                  <span className="text-white text-xs font-semibold select-none" style={fredoka}>{card.label}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {won && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white/10 border border-white/20 rounded-3xl p-8 flex flex-col items-center gap-4 text-white text-center backdrop-blur-md max-w-xs w-full mx-4">
            <div className="text-6xl">🎉</div>
            <h2 className="text-2xl font-bold" style={fredoka}>Bravo !</h2>
            <p className="text-white/80 text-sm" style={fredoka}>Tu as terminé en <strong>{moves} coups</strong> et <strong>{formatTime(time)}</strong></p>
            <div className="flex gap-3 mt-2 w-full">
              <button onClick={restart} style={fredoka} className="flex-1 py-3 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-bold text-sm border-b-4 border-violet-700 active:border-b-0 transition-all">Rejouer</button>
              <button onClick={onClose} style={fredoka} className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Jeu Monde (iframe) ───────────────────────────────────────────────────────
function MondeGame({ onClose }: { onClose: () => void }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="absolute top-4 right-4 z-50">
        <button onClick={onClose} style={fredoka} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm border border-white/20 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          Fermer
        </button>
      </div>
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
          <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-white animate-spin" />
          <p className="text-white/60 text-sm" style={fredoka}>Chargement du jeu...</p>
        </div>
      )}
      <iframe src="https://html5.gamemonetize.co/tbq36l8p3xem75kh6n4fyua4yrajucnw/"
        className="flex-1 w-full border-0" allow="autoplay; fullscreen *; gamepad" allowFullScreen
        onLoad={() => setLoaded(true)} title="Jeu du Monde"
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s ease' }} />
    </div>
  );
}

// ─── Composant Rive unique ────────────────────────────────────────────────────
function SingleRiveGame({ src, sm }: { src: string; sm: string }) {
  const { RiveComponent, rive } = useRive({ src, stateMachines: sm, autoplay: true });
  return (
    <div className="w-full h-full relative">
      {!rive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black">
          <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-white animate-spin" />
          <p className="text-white/60 text-sm" style={fredoka}>Chargement...</p>
        </div>
      )}
      <RiveComponent style={{ width: '100%', height: '100vh', opacity: rive ? 1 : 0, transition: 'opacity 0.3s ease' }} />
    </div>
  );
}

// ─── Fullscreen Rive ──────────────────────────────────────────────────────────
type RiveGameId = Exclude<GameId, 'memory' | 'monde' | 'motdujour' | 'enigmes'>;

function FullscreenGame({ gameId, onClose }: { gameId: RiveGameId; onClose: () => void }) {
  const gameMap: Record<RiveGameId, { src: string; sm: string }> = {
    piano:        { src: '/piano.riv',        sm: 'MAIN-sm'         },
    expression:   { src: '/expression.riv',   sm: 'Grid'            },
    gamification: { src: '/gamification.riv', sm: 'State Machine 1' },
    souris:       { src: '/souris.riv',       sm: 'State Machine 1' },
  };
  const { src, sm } = gameMap[gameId];
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="absolute top-4 right-4 z-50">
        <button onClick={onClose} style={fredoka} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm border border-white/20 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          Fermer
        </button>
      </div>
      <div className="flex-1"><SingleRiveGame src={src} sm={sm} /></div>
    </div>
  );
}

// ─── GameCard ─────────────────────────────────────────────────────────────────
function GameCard({ title, badge, badgeColor, borderColor, description, gradient, onPlay }: {
  title: string; badge: string; badgeColor: string; borderColor: string;
  description: string; gradient: string; onPlay: () => void;
}) {
  return (
    <div className={`card-in bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border-l-4 ${borderColor} flex flex-col`}>
      <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} flex flex-col items-center justify-center gap-2`} style={{ height: 160 }}>
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full" />
        <p className="relative z-10 text-white font-bold text-lg text-center px-3 leading-tight drop-shadow-md" style={fredoka}>{title}</p>
        <span className={`relative z-10 inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColor}`} style={fredoka}>{badge}</span>
        <div onClick={onPlay} className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all duration-200 flex items-center justify-center group cursor-pointer">
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200 shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#7c3aed"><polygon points="5 3 19 12 5 21 5 3" /></svg>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 flex flex-col gap-2 flex-1">
        <p className="text-xs text-muted-foreground leading-relaxed" style={fredoka}>{description}</p>
        <button onClick={onPlay} style={fredoka} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-violet-500 text-white border-b-4 border-violet-600 hover:bg-violet-500/90 active:border-b-0 transition-all mt-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
          Jouer
        </button>
      </div>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function RiverPage() {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const close = () => setActiveGame(null);
  const NON_RIVE = ['memory', 'monde', 'motdujour', 'enigmes'];

  return (
    <>
      <style>{`
        @keyframes heroFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes heroFadeIn { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(16px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        .hero-float   { animation: heroFloat 4s ease-in-out infinite; }
        .hero-text-in { animation: heroFadeIn 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .card-in      { animation: fadeSlideIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .shimmer-text {
          background: linear-gradient(90deg,#fff 0%,#bfdbfe 40%,#fff 60%,#bfdbfe 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; animation: shimmer 3s linear infinite;
        }
      `}</style>

      {activeGame === 'memory'    && <MemoryGame    onClose={close} />}
      {activeGame === 'monde'     && <MondeGame     onClose={close} />}
      {activeGame === 'motdujour' && <MotDuJourGame onClose={close} />}
      {activeGame === 'enigmes'   && <EnigmesGame   onClose={close} />}
      {activeGame !== null && !NON_RIVE.includes(activeGame) && (
        <FullscreenGame gameId={activeGame as RiveGameId} onClose={close} />
      )}

      <div className="min-h-screen bg-background flex">
        <div className="hidden md:block md:w-[80px] flex-shrink-0"><Sidebar /></div>
        <div className="flex-1 pb-20 md:pb-0">

          {/* Hero */}
          <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-500 to-pink-400 text-white">
            <div className="absolute inset-0 pointer-events-none select-none">
              <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/10 rounded-full" />
              <div className="absolute -bottom-10 left-10 w-48 h-48 bg-white/5 rounded-full" />
              <div className="absolute top-4 right-1/3 w-6 h-6 bg-white/20 rounded-full" />
              <div className="absolute bottom-8 right-16 w-3 h-3 bg-pink-200/40 rounded-full" />
            </div>
            <div className="relative px-4 sm:px-6 py-8 sm:py-10">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="z-10 hero-text-in">
                    <p className="text-purple-200 text-xs font-semibold uppercase tracking-widest mb-1" style={fredoka}>Animations interactives</p>
                    <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-2" style={fredoka}>
                      <span className="shimmer-text">Jeux</span><br />
                      <span className="text-white">et Animations</span>
                    </h1>
                    <p className="text-purple-100 text-sm mb-4 leading-relaxed max-w-sm" style={fredoka}>Clique sur un jeu pour le lancer en plein ecran.</p>
                    <div className="flex gap-3 flex-wrap">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30" style={fredoka}>
                        <div className="text-2xl font-bold">8</div>
                        <div className="text-xs text-purple-100">Jeux</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30" style={fredoka}>
                        <div className="text-2xl font-bold">4</div>
                        <div className="text-xs text-purple-100">GIFs</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center md:justify-end">
                    <div className="hero-float">
                      <Image src="/mascot.svg" alt="Mascotte" width={200} height={200} className="drop-shadow-2xl" priority />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">
            <section>
              <h2 className="text-base font-semibold text-muted-foreground uppercase tracking-wider mb-6" style={fredoka}>Jeux interactifs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                <GameCard
                  title="Livre des Énigmes"
                  badge="Énigmes"
                  badgeColor="bg-white/20 text-white"
                  borderColor="border-l-indigo-400"
                  description="Résous des énigmes et devinettes. Trouve le mot code !"
                  gradient="from-indigo-700 to-violet-900"
                  onPlay={() => setActiveGame('enigmes')}
                />

                <GameCard
                  title="Mot du Jour"
                  badge="Wordle FR"
                  badgeColor="bg-white/20 text-white"
                  borderColor="border-l-zinc-400"
                  description="Devine le mot secret en 8 essais. Choisis entre 5 ou 6 lettres !"
                  gradient="from-zinc-700 to-slate-800"
                  onPlay={() => setActiveGame('motdujour')}
                />

                <GameCard
                  title="Jeu de mémoire"
                  badge="Memory"
                  badgeColor="bg-white/20 text-white"
                  borderColor="border-l-violet-400"
                  description="Retrouve les paires de cartes. Entraine ta memoire !"
                  gradient="from-violet-500 to-indigo-600"
                  onPlay={() => setActiveGame('memory')}
                />

                <GameCard
                  title="Jeu du Monde"
                  badge="Géographie"
                  badgeColor="bg-white/20 text-white"
                  borderColor="border-l-blue-400"
                  description="Explore la carte du monde et teste tes connaissances !"
                  gradient="from-blue-500 to-cyan-600"
                  onPlay={() => setActiveGame('monde')}
                />

                <GameCard
                  title="Piano interactif"
                  badge="Piano"
                  badgeColor="bg-white/20 text-white"
                  borderColor="border-l-red-400"
                  description="Joue du piano avec la mascotte"
                  gradient="from-red-500 to-rose-600"
                  onPlay={() => setActiveGame('piano')}
                />

                <GameCard
                  title="Grille d'expressions"
                  badge="Expressions"
                  badgeColor="bg-white/20 text-white"
                  borderColor="border-l-fuchsia-400"
                  description="Explore les expressions animees"
                  gradient="from-purple-500 to-fuchsia-600"
                  onPlay={() => setActiveGame('expression')}
                />

                <GameCard
                  title="Mascotte gamification"
                  badge="Gamification"
                  badgeColor="bg-white/20 text-white"
                  borderColor="border-l-pink-400"
                  description="La mascotte des recompenses"
                  gradient="from-pink-500 to-rose-500"
                  onPlay={() => setActiveGame('gamification')}
                />

                <GameCard
                  title="Chauve-souris"
                  badge="Animation"
                  badgeColor="bg-white/20 text-white"
                  borderColor="border-l-emerald-400"
                  description="Animation de chauve-souris interactive"
                  gradient="from-emerald-500 to-teal-600"
                  onPlay={() => setActiveGame('souris')}
                />
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold text-muted-foreground uppercase tracking-wider mb-6" style={fredoka}>Effets visuels</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {gifs.map((gif, index) => (
                  <div key={gif.src} style={{ animationDelay: `${index * 60}ms` }}
                    className="card-in bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 p-5 flex flex-col items-center gap-3 cursor-pointer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={gif.src} alt={gif.label} loading="lazy" decoding="async" className="w-20 h-20 object-contain" />
                    <span className="text-sm font-semibold text-foreground text-center" style={fredoka}>{gif.label}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
        <MobileNavbar />
      </div>
    </>
  );
}