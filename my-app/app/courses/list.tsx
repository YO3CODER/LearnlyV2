"use client";

import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { courses, userProgress } from "@/db/schema";
import { upsertUserProgress } from "@/actions/user-progress";

import { Card } from "./card";

type Props = {
  courses: typeof courses.$inferSelect[];
  activeCourseId?: typeof userProgress.$inferSelect.activeCourseId;
};

export const List = ({ courses, activeCourseId }: Props) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onClick = (id: number) => {
    if (pending) return;

    if (id === activeCourseId) {
      return router.push("/learn");
    }

    startTransition(() => {
      upsertUserProgress(id)
        .catch(() => toast.error("Something went wrong."));
    });
  };

  return (
    <div className="pt-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {courses.map((course, index) => (
        <div
          key={course.id}
          className="opacity-0 animate-fade-in-up"
          style={{
            animationDelay: `${index * 80}ms`,
            animationFillMode: "forwards",
          }}
        >
          <Card
            id={course.id}
            title={course.title}
            imageSrc={course.imageSrc || "/placeholder.svg"}
            onClick={onClick}
            disabled={pending}
            active={course.id === activeCourseId}
          />
        </div>
      ))}
    </div>
  );
};