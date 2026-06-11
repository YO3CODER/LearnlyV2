import Image from "next/image";
import { lessons, units } from "@/db/schema"
import { LessonButton } from "./lesson-button";

type Props = {
  id: number;
  order: number;
  title: string;
  description: string;
  index: number;
  isLast?: boolean;
  lessons: (typeof lessons.$inferSelect & {
    completed: boolean;
    challengeCount?: number;
  })[];
  activeLesson: typeof lessons.$inferSelect & {
    unit: typeof units.$inferSelect;
  } | undefined;
  activeLessonPercentage: number;
};

const getUnitColor = (order: number) => {
  const colors = [
    "blue", "purple", "green", "orange",
    "pink", "indigo", "teal", "red",
  ];
  return colors[(order - 1) % colors.length];
};

const GIFS = ["/1.gif", "/2.gif", "/3.gif", "/4.gif"];
const XP_PER_CHALLENGE = 10;

export const Unit = ({
  id,
  order,
  title,
  description,
  lessons,
  activeLesson,
  activeLessonPercentage,
  index,
  isLast,
}: Props) => {
  const unitColor = getUnitColor(order);
  const unitGif = GIFS[(id - 1) % GIFS.length];

  // Calcul du XP total de l'unité (toutes les leçons)
  const unitTotalXP = lessons.reduce(
    (sum, lesson) => sum + (lesson.challengeCount ?? 5) * XP_PER_CHALLENGE,
    0
  );

  // Vérifier si toutes les leçons sont complétées
  const allLessonsCompleted = lessons.every(lesson => lesson.completed);

  return (
    <div id={`unit-${index}`} style={{ position: "relative", overflow: "visible" }}>

      {/* GIF mascotte — alterne droite/gauche selon l'index de l'unité */}
      <div
        className={`absolute top-20 z-10 animate-[mascot-float_3s_ease-in-out_infinite] ${
          index % 2 === 0 ? "right-0" : "left-0"
        }`}
        style={{ animationDelay: `${index * 300}ms` }}
      >
        <Image
          src={unitGif}
          alt="Mascot"
          width={120}
          height={120}
          unoptimized
          className="drop-shadow-lg"
        />
      </div>

      <div
        className="flex items-center flex-col relative"
        style={{ overflow: "visible", zIndex: 0 }}
      >
        {/* Afficher toutes les leçons */}
        {lessons.map((lesson, lessonIndex) => {
          const isCurrent = lesson.id === activeLesson?.id;
          const isLocked = !lesson.completed && !isCurrent;
          // La dernière leçon a une couronne, mais n'est PAS remplacée par le coffre
          const isLastLesson = lessonIndex === lessons.length - 1;

          return (
            <LessonButton
              key={lesson.id}
              id={lesson.id}
              index={lessonIndex}
              totalCount={lessons.length}
              current={isCurrent}
              locked={isLocked}
              percentage={activeLessonPercentage}
              unitColor={unitColor}
              isLastLesson={isLastLesson}
              isChest={false}  // ← Ce n'est PAS le coffre
              unitId={id}
              title={lesson.title}
              lessonChallengeCount={lesson.challengeCount ?? 5}
              unitTotalXP={unitTotalXP}
            />
          );
        })}

        {/* ── COFFRE : affiché APRÈS la dernière leçon ── */}
        <LessonButton
          key={`chest-${id}`}
          id={id * 1000} // ID unique pour le coffre
          index={lessons.length} // Position après la dernière leçon
          totalCount={lessons.length}
          current={false}
          locked={!allLessonsCompleted}
          percentage={0}
          unitColor={unitColor}
          isLastLesson={false}
          isChest={true}  // ← NOUVEAU : c'est le coffre !
          unitId={id}
          title="Coffre au trésor"
          lessonChallengeCount={0}
          unitTotalXP={unitTotalXP}
        />
      </div>
    </div>
  );
};