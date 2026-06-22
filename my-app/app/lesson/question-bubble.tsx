import Image from "next/image";
import { Volume2 } from "lucide-react";
import { useRef, useState } from "react";

type Props = {
  question: string;
};

export const QuestionBubble = ({ question }: Props) => {
  const [playing, setPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handleSpeak = () => {
    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(question);
    utterance.lang = "fr-FR";
    utterance.rate = 0.9;
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    utteranceRef.current = utterance;
    setPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex items-center gap-x-4 mb-6">

      {/* Bouton lecture */}
      <button
        onClick={handleSpeak}
        className={`
          shrink-0 flex items-center justify-center
          w-10 h-10 lg:w-12 lg:h-12 rounded-full
          border-2 transition-all duration-200
          ${playing
            ? "border-sky-400 bg-sky-100 dark:bg-sky-900/30 text-sky-500 scale-95"
            : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-500 hover:border-sky-300 hover:text-sky-500 hover:scale-105"
          }
          shadow-sm active:scale-95
        `}
        aria-label="Lire la question"
      >
        <Volume2 className={`w-4 h-4 lg:w-5 lg:h-5 ${playing ? "animate-pulse" : ""}`} />
      </button>

      {/* Mascot */}
      <div className="relative shrink-0">
        <div className="absolute inset-0 bg-blue-200/40 dark:bg-blue-800/30 rounded-full blur-md scale-125" />
        <Image
          src="/mascot.svg"
          alt="Mascot"
          height={60}
          width={60}
          className="relative hidden lg:block drop-shadow-md"
        />
        <Image
          src="/mascot.svg"
          alt="Mascot"
          height={40}
          width={40}
          className="relative block lg:hidden drop-shadow-md"
        />
      </div>

      {/* Bubble */}
      <div className="relative py-3 px-5
        bg-background dark:bg-background-800
        border border-border-200 dark:border-border-700
        rounded-2xl shadow-sm
        text-sm lg:text-base font-medium text-muted-foreground-700 dark:text-muted-foreground-200
        max-w-lg"
      >
        {question}
        {/* Arrow */}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2
          w-3 h-3 bg-background dark:bg-background-800
          border-l border-b border-border-200 dark:border-border-700
          rotate-45"
        />
      </div>

    </div>
  );
};