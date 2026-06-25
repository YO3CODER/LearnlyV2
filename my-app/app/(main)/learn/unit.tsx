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

const GIFS = ["/1.gif", "/2.gif", "/3.gif", "/4.gif", "/5.gif", "/6.gif"];
const XP_PER_CHALLENGE = 10;

const getCycleIndentation = (lessonIndex: number): number => {
  const cycleLength = 8;
  const cycleIndex = lessonIndex % cycleLength;
  let indentationLevel: number;
  if (cycleIndex <= 2) indentationLevel = cycleIndex;
  else if (cycleIndex <= 4) indentationLevel = 4 - cycleIndex;
  else if (cycleIndex <= 6) indentationLevel = 4 - cycleIndex;
  else indentationLevel = cycleIndex - 8;
  return indentationLevel * 40;
};

const findGifPositions = (lessonCount: number) => {
  const positions: { lessonIndex: number; side: "left" | "right"; topOffset: number }[] = [];

  const BUTTON_HEIGHT = 104;
  const FIRST_MARGIN = 60;

  const getTopOffset = (i: number) => {
    if (i === 0) return FIRST_MARGIN + 40;
    return FIRST_MARGIN + 40 + i * BUTTON_HEIGHT;
  };

  for (let i = 0; i < lessonCount; i++) {
    const curr = getCycleIndentation(i);
    const prev = i > 0 ? getCycleIndentation(i - 1) : curr;
    const next = i < lessonCount - 1 ? getCycleIndentation(i + 1) : curr;

    if (curr >= prev && curr >= next && curr > 0) {
      positions.push({
        lessonIndex: i,
        side: "left",
        topOffset: getTopOffset(i),
      });
    }
    if (curr <= prev && curr <= next && curr < 0) {
      positions.push({
        lessonIndex: i,
        side: "right",
        topOffset: getTopOffset(i),
      });
    }
  }

  if (positions.length === 0 && lessonCount > 0) {
    positions.push({ lessonIndex: 0, side: "right", topOffset: getTopOffset(0) });
  }

  return positions;
};

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

  const unitTotalXP = lessons.reduce(
    (sum, lesson) => sum + (lesson.challengeCount ?? 5) * XP_PER_CHALLENGE,
    0
  );

  const allLessonsCompleted = lessons.every(lesson => lesson.completed);

  const gifPositions = findGifPositions(lessons.length);

  return (
    <div id={`unit-${index}`} style={{ position: "relative", overflow: "visible" }}>

      {gifPositions.map((pos, gifIdx) => {
        const gifSrc = GIFS[(id + gifIdx) % GIFS.length];
        return (
          <div
            key={`gif-${gifIdx}`}
            className="absolute pointer-events-none animate-[mascot-float_3s_ease-in-out_infinite]"
            style={{
              top: `${pos.topOffset}px`,
              ...(pos.side === "right"
                ? { right: "-10px" }
                : { left: "-10px" }
              ),
              transform: "translateY(-50%)",
              animationDelay: `${(index * 300) + (gifIdx * 500)}ms`,
              zIndex: 0,
            }}
          >
            <Image
              src={gifSrc}
              alt="Mascot"
              width={100}
              height={100}
              unoptimized
              className="drop-shadow-lg"
            />
          </div>
        );
      })}

      <div
        className="flex items-center flex-col relative"
        style={{ overflow: "visible", zIndex: 1 }}
      >
        {lessons.map((lesson, lessonIndex) => {
          const isCurrent = lesson.id === activeLesson?.id;
          const isLocked = !lesson.completed && !isCurrent;
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
              isChest={false}
              unitId={id}
              title={lesson.title}
              lessonChallengeCount={lesson.challengeCount ?? 5}
              unitTotalXP={unitTotalXP}
            />
          );
        })}

        <LessonButton
          key={`chest-${id}`}
          id={id * 1000}
          index={lessons.length}
          totalCount={lessons.length}
          current={false}
          locked={!allLessonsCompleted}
          percentage={0}
          unitColor={unitColor}
          isLastLesson={false}
          isChest={true}
          unitId={id}
          title="Coffre au trésor"
          lessonChallengeCount={0}
          unitTotalXP={unitTotalXP}
        />
      </div>
    </div>
  );
};