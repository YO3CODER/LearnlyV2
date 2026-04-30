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
        {lessons.map((lesson, index) => {
          const isCurrent = lesson.id === activeLesson?.id;
          const isLocked = !lesson.completed && !isCurrent;
          const isLastLesson = index === lessons.length - 1;

          return (
            <LessonButton
              key={lesson.id}
              id={lesson.id}
              index={index}
              totalCount={lessons.length}
              current={isCurrent}
              locked={isLocked}
              percentage={activeLessonPercentage}
              unitColor={unitColor}
              isLastLesson={isLastLesson}
              unitId={id}
              title={lesson.title}
            />
          );
        })}
      </div>
    </div>
  );
};