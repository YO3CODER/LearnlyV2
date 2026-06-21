"use client";

import { toast } from "sonner";
import Image from "next/image";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect, useRef } from "react";
import { useAudio, useWindowSize, useMount } from "react-use";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

import { completeLesson, reduceHearts } from "@/actions/user-progress";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { challengeOptions, challenges, userSubscription } from "@/db/schema";
import { usePracticeModal } from "@/store/use-practice-modal";
import { upsertChallengeProgress } from "@/actions/challenge-progress";

import { Header } from "./header";
import { Footer } from "./footer";
import { Challenge } from "./challenge";
import { ResultCard } from "./result-card";
import { QuestionBubble } from "./question-bubble";

import { parseListenQuestion } from "@/lib/listen-question";

type Props = {
  initialPercentage: number;
  initialHearts: number;
  initialLessonId: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: typeof challengeOptions.$inferSelect[];
  })[];
  userSubscription:
    | (typeof userSubscription.$inferSelect & { isActive: boolean })
    | null;
};

const STREAK_TEXTS = [
  "d'affilée !!",
  "en continu !",
  "sans arrêt !",
  "d'enfer !",
  "impeccable !",
  "parfait !",
  "inarrêtable !",
  "magnifique !",
  "incroyable !",
  "foudroyant !",
];

export const Quiz = ({
  initialPercentage,
  initialHearts,
  initialLessonId,
  initialLessonChallenges,
  userSubscription,
}: Props) => {
  const { open: openHeartsModal } = useHeartsModal();
  const { open: openPracticeModal } = usePracticeModal();

  useMount(() => {
    if (initialPercentage === 100) openPracticeModal(initialLessonId);
  });

  const { width, height } = useWindowSize();
  const router = useRouter();

  const [finishAudio, , finishControls]         = useAudio({ src: "/finish.mp3",    autoPlay: false });
  const [correctAudio, _c, correctControls]     = useAudio({ src: "/correct.wav" });
  const [incorrectAudio, _i, incorrectControls] = useAudio({ src: "/incorrect.wav" });
  const [streakAudio, , streakControls]         = useAudio({ src: "/affile.mp3",    autoPlay: false });
  const [pending, startTransition] = useTransition();

  const [lessonId]      = useState(initialLessonId);
  const [hearts, setHearts]       = useState(initialHearts);
  const [percentage, setPercentage] = useState(() =>
    initialPercentage === 100 ? 0 : initialPercentage,
  );

  const totalChallenges = initialLessonChallenges.length;

  const [challenges, setChallenges]             = useState(initialLessonChallenges);
  const [failedChallenges, setFailedChallenges] = useState<typeof initialLessonChallenges>([]);
  const [isRetryRound, setIsRetryRound]         = useState(false);

  const [activeIndex, setActiveIndex] = useState(() => {
    const i = challenges.findIndex((c) => !c.completed);
    return i === -1 ? 0 : i;
  });

  const [selectedOption, setSelectedOption]                   = useState<number>();
  const [wordBankSelectedIds, setWordBankSelectedIds]         = useState<number[]>([]);
  const [fillBlankSelectedBlanks, setFillBlankSelectedBlanks] = useState<(number | null)[]>([]);
  const [translateValue, setTranslateValue]                   = useState("");
  const [matchPairs, setMatchPairs]                           = useState<[number, number][]>([]);
  const [listenValue, setListenValue]                         = useState("");
  const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");

  const [countdown, setCountdown]   = useState<number | null>(null);
  const countdownRef                = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [streak, setStreak]         = useState(0);
  const [showStreak, setShowStreak] = useState(false);
  const [streakGif, setStreakGif]   = useState("/1.gif");
  const [streakText, setStreakText] = useState("d'affilée !!");
  const streakTimeoutRef            = useRef<ReturnType<typeof setTimeout> | null>(null);

  const STREAK_GIFS = ["/1.gif", "/2.gif", "/3.gif"];

  const [slideState, setSlideState] = useState<"idle" | "exit" | "enter">("idle");
  const slideTimeoutRef             = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [animatedPoints, setAnimatedPoints] = useState(0);
  const [animatedHearts, setAnimatedHearts] = useState(0);
  const pointsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const heartsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const challenge = challenges[activeIndex];
  const options   = challenge?.challengeOptions ?? [];

  const isFinished = !challenges[activeIndex] && failedChallenges.length === 0;

  useEffect(() => {
    if (isFinished) {
      finishControls.play();
      startTransition(() => {
        completeLesson().catch(() => console.error("Failed to complete lesson"));
      });
    }
  }, [isFinished]);

  useEffect(() => {
    if (!isFinished) return;

    const totalPoints = totalChallenges * 10;

    setAnimatedPoints(0);
    setAnimatedHearts(0);

    let currentPoints = 0;
    pointsIntervalRef.current = setInterval(() => {
      currentPoints += 10;
      if (currentPoints >= totalPoints) {
        currentPoints = totalPoints;
        if (pointsIntervalRef.current) clearInterval(pointsIntervalRef.current);
      }
      setAnimatedPoints(currentPoints);
    }, 90);

    let currentHearts = 0;
    heartsIntervalRef.current = setInterval(() => {
      currentHearts += 1;
      if (currentHearts >= hearts) {
        currentHearts = hearts;
        if (heartsIntervalRef.current) clearInterval(heartsIntervalRef.current);
      }
      setAnimatedHearts(currentHearts);
    }, 220);

    return () => {
      if (pointsIntervalRef.current) clearInterval(pointsIntervalRef.current);
      if (heartsIntervalRef.current) clearInterval(heartsIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished]);

  const resetAnswerState = () => {
    setSelectedOption(undefined);
    setWordBankSelectedIds([]);
    setFillBlankSelectedBlanks([]);
    setTranslateValue("");
    setMatchPairs([]);
    setListenValue("");
  };

  const onNext = () => {
    setSlideState("exit");
    slideTimeoutRef.current = setTimeout(() => {
      setActiveIndex((current) => current + 1);
      resetAnswerState();
      setSlideState("enter");
      slideTimeoutRef.current = setTimeout(() => setSlideState("idle"), 50);
    }, 250);
  };

  useEffect(() => {
    return () => {
      if (slideTimeoutRef.current)  clearTimeout(slideTimeoutRef.current);
      if (streakTimeoutRef.current) clearTimeout(streakTimeoutRef.current);
      if (countdownRef.current)     clearTimeout(countdownRef.current);
      if (pointsIntervalRef.current) clearInterval(pointsIntervalRef.current);
      if (heartsIntervalRef.current) clearInterval(heartsIntervalRef.current);
    };
  }, []);

  const onSelect          = (id: number) => { if (status !== "none") return; setSelectedOption(id); };
  const onWordBankSelect  = (id: number) => { if (status !== "none") return; setWordBankSelectedIds((prev) => [...prev, id]); };
  const onWordBankRemove  = (id: number) => { if (status !== "none") return; setWordBankSelectedIds((prev) => prev.filter((i) => i !== id)); };
  const onFillBlankSelect = (blankIndex: number, optionId: number | null) => {
    if (status !== "none") return;
    setFillBlankSelectedBlanks((prev) => { const next = [...prev]; next[blankIndex] = optionId; return next; });
  };
  const onMatch = (pairs: [number, number][]) => { if (status !== "none") return; setMatchPairs(pairs); };

  const startWrongCountdown = () => setCountdown(3);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setFailedChallenges((prev) => {
        const alreadyFailed = prev.some((c) => c.id === challenge.id);
        return alreadyFailed ? prev : [...prev, challenge];
      });
      onNext();
      setStatus("none");
      resetAnswerState();
      setCountdown(null);
      return;
    }
    countdownRef.current = setTimeout(() => setCountdown((prev) => (prev !== null ? prev - 1 : null)), 1000);
    return () => { if (countdownRef.current) clearTimeout(countdownRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  const triggerStreakToast = () => {
    const randomGif  = STREAK_GIFS[Math.floor(Math.random() * STREAK_GIFS.length)];
    const randomText = STREAK_TEXTS[Math.floor(Math.random() * STREAK_TEXTS.length)];
    setStreakGif(randomGif);
    setStreakText(randomText);
    streakControls.play();
    setShowStreak(true);
    if (streakTimeoutRef.current) clearTimeout(streakTimeoutRef.current);
    streakTimeoutRef.current = setTimeout(() => setShowStreak(false), 3000);
  };

  const handleCorrect = () => {
    startTransition(() => {
      upsertChallengeProgress(challenge.id)
        .then((response) => {
          if (response?.error === "hearts") { openHeartsModal(); return; }
          correctControls.play();
          setStatus("correct");
          setPercentage((prev) => Math.min(prev + 100 / totalChallenges, 100));
          setStreak((prev) => {
            const next = prev + 1;
            if (next >= 3 && next % 2 === 1) triggerStreakToast();
            return next;
          });
          if (initialPercentage === 100) setHearts((prev) => Math.min(prev + 1, 5));
        })
        .catch(() => toast.error("Une erreur est survenue. Veuillez réessayer."));
    });
  };

  const handleWrong = () => {
    startTransition(() => {
      reduceHearts(challenge.id)
        .then((response) => {
          if (response?.error === "hearts") { openHeartsModal(); return; }
          incorrectControls.play();
          setStatus("wrong");
          setStreak(0);
          setShowStreak(false);
          if (!response?.error) setHearts((prev) => Math.max(prev - 1, 0));
          startWrongCountdown();
        })
        .catch(() => toast.error("Une erreur est survenue. Veuillez réessayer."));
    });
  };

  const normalize = (str: string) =>
    str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const isWordBankCorrect = () => {
    const correctIds = [...options].filter((o) => o.correct).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((o) => o.id);
    return wordBankSelectedIds.length === correctIds.length && wordBankSelectedIds.every((id, i) => id === correctIds[i]);
  };
  const isFillBlankCorrect = () => {
    const blankCount = (challenge.question.match(/___/g) ?? []).length;
    if (fillBlankSelectedBlanks.length !== blankCount || fillBlankSelectedBlanks.some((b) => b === null)) return false;
    return fillBlankSelectedBlanks.every((selectedId, blankIndex) => {
      const option = options.find((o) => o.id === selectedId);
      return option?.correct && option?.blank === blankIndex;
    });
  };
  const isTranslateCorrect = () => {
    const correctOption = options.find((o) => o.correct);
    if (!correctOption) return false;
    return correctOption.text.split("|").map(normalize).includes(normalize(translateValue));
  };
  const isListenCorrect = () => {
    const correctOption = options.find((o) => o.correct);
    if (!correctOption) return false;
    return correctOption.text.split("|").map(normalize).includes(normalize(listenValue));
  };
  const isMatchCorrectByOrder = () => {
    const leftItems = options.filter((o) => !o.correct);
    if (matchPairs.length !== leftItems.length) return false;
    return matchPairs.every(([leftId, rightId]) => {
      const left  = options.find((o) => o.id === leftId);
      const right = options.find((o) => o.id === rightId);
      return left && right && left.order === right.order;
    });
  };

  const onContinue = () => {
    if (countdown !== null) return;

    if (challenge.type === "WORD_BANK") {
      if (wordBankSelectedIds.length === 0) return;
      if (status === "correct") { onNext(); setStatus("none"); resetAnswerState(); return; }
      isWordBankCorrect() ? handleCorrect() : handleWrong();
      return;
    }
    if (challenge.type === "FILL_BLANK") {
      const blankCount = (challenge.question.match(/___/g) ?? []).length;
      if (fillBlankSelectedBlanks.filter((b) => b !== null).length !== blankCount) return;
      if (status === "correct") { onNext(); setStatus("none"); resetAnswerState(); return; }
      isFillBlankCorrect() ? handleCorrect() : handleWrong();
      return;
    }
    if (challenge.type === "TRANSLATE") {
      if (!translateValue.trim()) return;
      if (status === "correct") { onNext(); setStatus("none"); resetAnswerState(); return; }
      isTranslateCorrect() ? handleCorrect() : handleWrong();
      return;
    }
    if (challenge.type === "LISTEN") {
      if (!listenValue.trim()) return;
      if (status === "correct") { onNext(); setStatus("none"); resetAnswerState(); return; }
      isListenCorrect() ? handleCorrect() : handleWrong();
      return;
    }
    if (challenge.type === "MATCH") {
      if (matchPairs.length !== options.filter((o) => !o.correct).length) return;
      if (status === "correct") { onNext(); setStatus("none"); resetAnswerState(); return; }
      isMatchCorrectByOrder() ? handleCorrect() : handleWrong();
      return;
    }
    if (!selectedOption) return;
    if (status === "correct") { onNext(); setStatus("none"); setSelectedOption(undefined); return; }
    const correctOption = options.find((o) => o.correct);
    if (!correctOption) return;
    correctOption.id === selectedOption ? handleCorrect() : handleWrong();
  };

  if (!challenge && failedChallenges.length > 0) {
    setChallenges(failedChallenges);
    setFailedChallenges([]);
    setActiveIndex(0);
    setIsRetryRound(true);
    return null;
  }

  if (!challenge) {
    return (
      <>
        {finishAudio}{correctAudio}{incorrectAudio}
        <Confetti width={width} height={height} recycle={false} numberOfPieces={500} tweenDuration={10000} />
        <div className="flex flex-col gap-y-6 lg:gap-y-10 max-w-lg mx-auto text-center items-center justify-center h-full px-6">
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
          >
            <div className="absolute inset-0 bg-blue-200/40 dark:bg-blue-800/20 rounded-full blur-2xl scale-150" />
            <Image src="/finish.svg" alt="Finish" className="hidden lg:block relative drop-shadow-lg" height={110} width={110} />
            <Image src="/finish.svg" alt="Finish" className="block lg:hidden relative drop-shadow-lg" height={60} width={60} />
          </motion.div>
          <motion.div className="space-y-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <motion.p className="text-xs font-semibold tracking-widest uppercase text-blue-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              Leçon terminée
            </motion.p>
            <motion.h1
              className="text-2xl lg:text-4xl font-extrabold tracking-tight leading-tight"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: [0, 1.15, 0.95, 1.08, 1] }}
              transition={{ delay: 0.4, duration: 0.8, scale: { type: "spring", stiffness: 150, damping: 12 } }}
            >
              Bravo !<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-500">
                Tu as terminé la leçon.
              </span>
            </motion.h1>
          </motion.div>

          <motion.div
            className="flex items-center gap-x-4 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.3, x: -40, rotate: -15 }}
              animate={{
                opacity: 1,
                scale: [0.3, 1.25, 0.9, 1.1, 1],
                x: 0,
                rotate: [-15, 8, -4, 2, 0],
                y: [0, -10, 0, -4, 0],
              }}
              transition={{
                delay: 0.7,
                duration: 0.9,
                scale: { type: "spring", stiffness: 260, damping: 10 },
              }}
              whileHover={{ scale: 1.05, rotate: -2 }}
            >
              <ResultCard variant="points" value={animatedPoints} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.3, x: 40, rotate: 15 }}
              animate={{
                opacity: 1,
                scale: [0.3, 1.25, 0.9, 1.1, 1],
                x: 0,
                rotate: [15, -8, 4, -2, 0],
                y: [0, -10, 0, -4, 0],
              }}
              transition={{
                delay: 0.85,
                duration: 0.9,
                scale: { type: "spring", stiffness: 260, damping: 10 },
              }}
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              <ResultCard variant="hearts" value={animatedHearts} />
            </motion.div>
          </motion.div>
        </div>
        <Footer lessonId={lessonId} status="completed" onCheck={() => router.push("/learn")} />
      </>
    );
  }

  const title =
    challenge.type === "ASSIST"     ? "Sélectionne la bonne réponse" :
    challenge.type === "FILL_BLANK" ? "Complète les espaces vides"   :
    challenge.type === "TRANSLATE"  ? "Traduis cette phrase"          :
    challenge.type === "LISTEN"     ? "Écris ce que tu entends"       :
    challenge.type === "MATCH"      ? "Associe les paires"            :
    challenge.question;

  const isFillBlankDone = () => {
    const blankCount = (challenge.question.match(/___/g) ?? []).length;
    return fillBlankSelectedBlanks.filter((b) => b !== null).length === blankCount;
  };

  const isFooterDisabled =
    pending || countdown !== null || (
      challenge.type === "WORD_BANK"  ? wordBankSelectedIds.length === 0 :
      challenge.type === "FILL_BLANK" ? !isFillBlankDone() :
      challenge.type === "TRANSLATE"  ? !translateValue.trim() :
      challenge.type === "LISTEN"     ? !listenValue.trim() :
      challenge.type === "MATCH"      ? matchPairs.length !== options.filter((o) => !o.correct).length :
      !selectedOption
    );

  // ✅ CORRECTION : pour LISTEN, l'audio est dans challenge.question
  const listenAudioSrc = challenge.type === "LISTEN"
  ? parseListenQuestion(challenge.question).url
  : (options.find((o) => o.audioSrc)?.audioSrc ?? "");

  const footerLabel = countdown !== null ? `Prochain dans ${countdown}s…` : undefined;

  const slideClasses = [
    "transition-all duration-300 ease-in-out",
    slideState === "exit"  && "opacity-0 -translate-x-8",
    slideState === "enter" && "opacity-0 translate-x-8",
    slideState === "idle"  && "opacity-100 translate-x-0",
  ].filter(Boolean).join(" ");

  const questionNumber = Math.min(activeIndex + 1, totalChallenges);

  return (
    <>
      {incorrectAudio}{correctAudio}{finishAudio}{streakAudio}

      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
        current={questionNumber}
        total={totalChallenges}
      />

      {showStreak && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm"
          style={{ opacity: showStreak ? 1 : 0, transition: "opacity 0.3s ease" }}
        >
          <style>{`
            @keyframes streak-gradient-shift {
              0%   { background-position: 0% 50%; }
              50%  { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}</style>
          <div className="flex flex-col items-center gap-6">
            <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 12 }}>
              <Image src={streakGif} alt="Streak" width={200} height={200} className="drop-shadow-lg" unoptimized />
            </motion.div>
            <motion.p
              className="text-3xl lg:text-4xl font-extrabold text-center bg-clip-text text-transparent"
              style={{
                fontFamily: "'Fredoka', sans-serif",
                backgroundImage:
                  "linear-gradient(90deg, #f43f5e, #f59e0b, #eab308, #22c55e, #38bdf8, #a78bfa, #f43f5e)",
                backgroundSize: "300% 100%",
                animation: "streak-gradient-shift 1.6s linear infinite",
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: [0, 1.15, 0.95, 1.08, 1] }}
              transition={{ duration: 0.8, delay: 0.3, scale: { type: "spring", stiffness: 150, damping: 12 } }}
            >
              {streak} {streakText}
            </motion.p>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pb-[90px] lg:pb-[100px]">
        <div className="flex justify-center py-6">
          <div className="w-full max-w-[560px] px-6 lg:px-0 overflow-hidden">
            <div className={slideClasses}>
              <div className="flex flex-col gap-y-6">

                {isRetryRound && (
                  <div className="inline-flex self-start items-center gap-x-2">
                    <RefreshCw className="h-4 w-4 text-amber-400" strokeWidth={3} />
                    <p className="text-xs font-extrabold uppercase tracking-wide text-amber-400">
                      Ancienne erreur
                    </p>
                  </div>
                )}

                <h1 className="text-lg lg:text-2xl font-extrabold tracking-tight text-center lg:text-start">
                  {title}
                </h1>

                <div className="flex flex-col gap-y-4">
                  {/* ✅ CORRECTION : LISTEN retiré — pas de QuestionBubble pour LISTEN */}
                  {(challenge.type === "ASSIST" ||
                    challenge.type === "TRANSLATE") && (
                    <QuestionBubble question={challenge.question} />
                  )}
                  <Challenge
                    options={options}
                    onSelect={onSelect}
                    onWordBankSelect={onWordBankSelect}
                    onWordBankRemove={onWordBankRemove}
                    wordBankSelectedIds={wordBankSelectedIds}
                    onFillBlankSelect={onFillBlankSelect}
                    fillBlankSelectedBlanks={fillBlankSelectedBlanks}
                    translateValue={translateValue}
                    onTranslateChange={setTranslateValue}
                    onMatch={onMatch}
                    matchPairs={matchPairs}
                    listenValue={listenValue}
                    onListenChange={setListenValue}
                    listenAudioSrc={listenAudioSrc}
                    status={status}
                    selectedOption={selectedOption}
                    disabled={pending || countdown !== null}
                    type={challenge.type}
                    question={challenge.question}
                  />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer disabled={isFooterDisabled} status={status} onCheck={onContinue} label={footerLabel} />
    </>
  );
};