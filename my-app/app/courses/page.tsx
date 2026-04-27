import { getCourses, getUserProgress } from "@/db/queries";

import { List } from "./list";

const CoursesPage = async () => {
  const coursesData = getCourses();
  const userProgressData = getUserProgress();

  const [
    courses,
    userProgress,
  ] = await Promise.all([
    coursesData,
    userProgressData,
  ]);

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-[912px] mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-blue-400 mb-2">
            Explore
          </p>
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight leading-none">
            All{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-500">
              Courses
            </span>
          </h1>
          <p className="mt-2 text-sm text-slate-400 font-medium">
            Choose a subject and start learning at your own pace.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-blue-100 via-blue-100 to-transparent mb-10" />

        <List
          courses={courses}
          activeCourseId={userProgress?.activeCourseId}
        />
      </div>
    </div>
  );
};

export default CoursesPage;