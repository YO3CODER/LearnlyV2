"use client";

import { toast } from "sonner";
import Image from "next/image";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect, useRef } from "react";
import { useAudio, useWindowSize, useMount } from "react-use";

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

  const [finishAudio, , finishControls] = useAudio({ src: "/finish.mp3", autoPlay: false });
  const [correctAudio, _c, correctControls] = useAudio({ src: "/correct.wav" });
  const [incorrectAudio, _i, incorrectControls] = useAudio({ src: "/incorrect.wav" });
  const [pending, startTransition] = useTransition();

  const [lessonId] = useState(initialLessonId);
  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(() =>
    initialPercentage === 100 ? 0 : initialPercentage,
  );

  const totalChallenges = initialLessonChallenges.length;

  const [challenges, setChallenges] = useState(initialLessonChallenges);
  const [failedChallenges, setFailedChallenges] = useState<typeof initialLessonChallenges>([]);
  const [isRetryRound, setIsRetryRound] = useState(false);

  const [activeIndex, setActiveIndex] = useState(() => {
    const i = challenges.findIndex((c) => !c.completed);
    return i === -1 ? 0 : i;
  });

  const [selectedOption, setSelectedOption] = useState<number>();
  const [wordBankSelectedIds, setWordBankSelectedIds] = useState<number[]>([]);
  const [fillBlankSelectedBlanks, setFillBlankSelectedBlanks] = useState<(number | null)[]>([]);
  const [translateValue, setTranslateValue] = useState("");
  const [matchPairs, setMatchPairs] = useState<[number, number][]>([]);
  const [listenValue, setListenValue] = useState("");
  const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");

  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [streak, setStreak] = useState(0);
  const [showStreak, setShowStreak] = useState(false);
  const streakTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [slideState, setSlideState] = useState<"idle" | "exit" | "enter">("idle");
  const slideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const challenge = challenges[activeIndex];
  const options = challenge?.challengeOptions ?? [];

  const isFinished = !challenges[activeIndex] && failedChallenges.length === 0;

  useEffect(() => {
    if (isFinished) {
      finishControls.play();
      startTransition(() => {
        completeLesson().catch(() => console.error("Failed to complete lesson"));
      });
    }
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
      if (slideTimeoutRef.current) clearTimeout(slideTimeoutRef.current);
      if (streakTimeoutRef.current) clearTimeout(streakTimeoutRef.current);
      if (countdownRef.current) clearTimeout(countdownRef.current);
    };
  }, []);

  const onSelect = (id: number) => {
    if (status !== "none") return;
    setSelectedOption(id);
  };

  const onWordBankSelect = (id: number) => {
    if (status !== "none") return;
    setWordBankSelectedIds((prev) => [...prev, id]);
  };

  const onWordBankRemove = (id: number) => {
    if (status !== "none") return;
    setWordBankSelectedIds((prev) => prev.filter((i) => i !== id));
  };

  const onFillBlankSelect = (blankIndex: number, optionId: number | null) => {
    if (status !== "none") return;
    setFillBlankSelectedBlanks((prev) => {
      const next = [...prev];
      next[blankIndex] = optionId;
      return next;
    });
  };

  const onMatch = (pairs: [number, number][]) => {
    if (status !== "none") return;
    setMatchPairs(pairs);
  };

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
    countdownRef.current = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => {
      if (countdownRef.current) clearTimeout(countdownRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  const triggerStreakToast = () => {
    setShowStreak(true);
    if (streakTimeoutRef.current) clearTimeout(streakTimeoutRef.current);
    streakTimeoutRef.current = setTimeout(() => setShowStreak(false), 2500);
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
            if (next >= 3) triggerStreakToast();
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

  const isWordBankCorrect = () => {
    const correctIds = [...options]
      .filter((o) => o.correct)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((o) => o.id);
    return (
      wordBankSelectedIds.length === correctIds.length &&
      wordBankSelectedIds.every((id, i) => id === correctIds[i])
    );
  };

  const isFillBlankCorrect = () => {
    const blankCount = (challenge.question.match(/___/g) ?? []).length;
    if (fillBlankSelectedBlanks.length !== blankCount) return false;
    if (fillBlankSelectedBlanks.some((b) => b === null)) return false;
    return fillBlankSelectedBlanks.every((selectedId, blankIndex) => {
      const option = options.find((o) => o.id === selectedId);
      return option?.correct && option?.blank === blankIndex;
    });
  };

  const normalize = (str: string) =>
    str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const isTranslateCorrect = () => {
    const correctOption = options.find((o) => o.correct);
    if (!correctOption) return false;
    const variants = correctOption.text.split("|").map(normalize);
    return variants.includes(normalize(translateValue));
  };

  const isListenCorrect = () => {
    const correctOption = options.find((o) => o.correct);
    if (!correctOption) return false;
    const variants = correctOption.text.split("|").map(normalize);
    return variants.includes(normalize(listenValue));
  };

  const isMatchCorrect = () => {
    const leftItems = options.filter((o) => !o.correct);
    if (matchPairs.length !== leftItems.length) return false;
    return matchPairs.every(([leftId, rightId]) => {
      const left = options.find((o) => o.id === leftId);
      const right = options.find((o) => o.id === rightId);
      if (!left || !right) return false;
      return left.audioSrc === right.audioSrc || left.text === right.audioSrc;
    });
  };

  const isMatchCorrectByOrder = () => {
    const leftItems = options.filter((o) => !o.correct);
    if (matchPairs.length !== leftItems.length) return false;
    return matchPairs.every(([leftId, rightId]) => {
      const left = options.find((o) => o.id === leftId);
      const right = options.find((o) => o.id === rightId);
      if (!left || !right) return false;
      return left.order === right.order;
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
      const allFilled = fillBlankSelectedBlanks.filter((b) => b !== null).length === blankCount;
      if (!allFilled) return;
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
      const leftItems = options.filter((o) => !o.correct);
      if (matchPairs.length !== leftItems.length) return;
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
        {finishAudio}
        {correctAudio}
        {incorrectAudio}
        <Confetti width={width} height={height} recycle={false} numberOfPieces={500} tweenDuration={10000} />
        <div className="flex flex-col gap-y-6 lg:gap-y-10 max-w-lg mx-auto text-center items-center justify-center h-full px-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-200/40 dark:bg-blue-800/20 rounded-full blur-2xl scale-150" />
            <Image src="/finish.svg" alt="Finish" className="hidden lg:block relative drop-shadow-lg" height={110} width={110} />
            <Image src="/finish.svg" alt="Finish" className="block lg:hidden relative drop-shadow-lg" height={60} width={60} />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-widest uppercase text-blue-400">Leçon terminée</p>
            <h1 className="text-2xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              Bravo ! 🎉<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-500">
                Tu as terminé la leçon.
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-x-4 w-full">
            <ResultCard variant="points" value={totalChallenges * 10} />
            <ResultCard variant="hearts" value={hearts} />
          </div>
        </div>
        <Footer lessonId={lessonId} status="completed" onCheck={() => router.push("/learn")} />
      </>
    );
  }

  const title =
    challenge.type === "ASSIST"
      ? "Sélectionne la bonne signification"
      : challenge.type === "FILL_BLANK"
        ? "Complète les espaces vides"
        : challenge.type === "TRANSLATE"
          ? "Traduis cette phrase"
          : challenge.type === "LISTEN"
            ? "Écris ce que tu entends"
            : challenge.type === "MATCH"
              ? "Associe les paires"
              : challenge.question;

  const isFillBlankDone = () => {
    const blankCount = (challenge.question.match(/___/g) ?? []).length;
    return fillBlankSelectedBlanks.filter((b) => b !== null).length === blankCount;
  };

  const isMatchDone = () => {
    const leftItems = options.filter((o) => !o.correct);
    return matchPairs.length === leftItems.length;
  };

  const isFooterDisabled =
    pending ||
    countdown !== null ||
    (challenge.type === "WORD_BANK"
      ? wordBankSelectedIds.length === 0
      : challenge.type === "FILL_BLANK"
        ? !isFillBlankDone()
        : challenge.type === "TRANSLATE"
          ? !translateValue.trim()
          : challenge.type === "LISTEN"
            ? !listenValue.trim()
            : challenge.type === "MATCH"
              ? !isMatchDone()
              : !selectedOption);

  const listenAudioSrc = options.find((o) => o.audioSrc)?.audioSrc ?? "";

  const footerLabel = countdown !== null ? `Prochain dans ${countdown}s…` : undefined;

  const slideClasses = [
    "transition-all duration-300 ease-in-out",
    slideState === "exit" && "opacity-0 -translate-x-8",
    slideState === "enter" && "opacity-0 translate-x-8",
    slideState === "idle" && "opacity-100 translate-x-0",
  ].filter(Boolean).join(" ");

  return (
    <>
      {incorrectAudio}
      {correctAudio}
      {finishAudio}
      <Header hearts={hearts} percentage={percentage} hasActiveSubscription={!!userSubscription?.isActive} />

      {/* Toast streak */}
      <div className={[
        "fixed top-6 left-1/2 -translate-x-1/2 z-50",
        "transition-all duration-500 ease-out",
        showStreak ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-3 pointer-events-none",
      ].join(" ")}>
        <div className="flex items-center gap-x-3 bg-orange-500 text-white px-5 py-3 rounded-2xl shadow-lg shadow-orange-200 dark:shadow-orange-900">
          <span className="text-xl leading-none">🔥</span>
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] font-bold uppercase tracking-widest text-orange-100">{streak} d&apos;affilée</span>
            <span className="text-base font-extrabold tracking-tight">En pleine forme !</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center py-8">
          <div className="lg:w-[600px] w-full px-6 lg:px-0 overflow-hidden">
            <div className={slideClasses}>
              <div className="flex flex-col gap-y-8">

                {isRetryRound && (
                  <div className="relative overflow-hidden rounded-2xl border border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 dark:from-amber-950/30 via-orange-50 dark:via-orange-950/20 to-amber-50 dark:to-amber-950/30 px-5 py-3.5">
                    <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-gradient-to-b from-amber-400 to-orange-400" />
                    <div className="flex flex-col gap-y-0.5 pl-2">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-amber-400">Tour de révision</p>
                      <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                        Les questions que tu as manquées — maîtrisons-les cette fois.
                      </p>
                    </div>
                  </div>
                )}

                <h1 className="text-lg lg:text-3xl text-center lg:text-start font-extrabold tracking-tight">
                  {title}
                </h1>

                <div>
                  {(challenge.type === "ASSIST" ||
                    challenge.type === "TRANSLATE" ||
                    challenge.type === "LISTEN") && (
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