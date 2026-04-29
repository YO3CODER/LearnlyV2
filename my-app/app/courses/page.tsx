import Image from "next/image";
import { getCourses, getUserProgress } from "@/db/queries";

import { List } from "./list";

const CoursesPage = async () => {
  const coursesData = getCourses();
  const userProgressData = getUserProgress();

  const [courses, userProgress] = await Promise.all([
    coursesData,
    userProgressData,
  ]);

  return (
    <div className="min-h-full bg-background">
      <div className="max-w-[912px] mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10 flex items-center gap-6">
          <div className="flex-shrink-0">
            <Image
              src="/hero.svg"
              alt="Learnly Logo"
              width={72}
              height={72}
              className="drop-shadow-md"
            />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-blue-400 mb-1">
              Explore
            </p>
            <h1 className="text-4xl font-extrabold text-foreground tracking-tight leading-none">
              All{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">
                Courses
              </span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground font-medium">
              Choose a subject and start learning at your own pace.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-card rounded-2xl border-2 border-b-4 border-border shadow-sm p-4 flex flex-col items-center justify-center">
            <span className="text-2xl font-extrabold text-blue-500">
              {courses.length}
            </span>
            <span className="text-xs text-muted-foreground font-medium mt-1">
              Cours disponibles
            </span>
          </div>
          <div className="bg-card rounded-2xl border-2 border-b-4 border-border shadow-sm p-4 flex flex-col items-center justify-center">
            <span className="text-2xl font-extrabold text-indigo-500">
              {userProgress?.lessonsCompleted ?? 0}
            </span>
            <span className="text-xs text-muted-foreground font-medium mt-1">
              Leçons complétées
            </span>
          </div>
          <div className="bg-card rounded-2xl border-2 border-b-4 border-border shadow-sm p-4 flex flex-col items-center justify-center">
            <span className="text-2xl font-extrabold text-emerald-500">
              {userProgress?.streak ?? 0}
            </span>
            <span className="text-xs text-muted-foreground font-medium mt-1">
              Jours de streak
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border mb-10" />

        <List
          courses={courses}
          activeCourseId={userProgress?.activeCourseId}
        />
      </div>
    </div>
  );
};

export default CoursesPage;