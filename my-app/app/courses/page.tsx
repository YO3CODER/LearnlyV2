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
    <div className="min-h-full bg-white">
      <div className="max-w-[912px] mx-auto px-6 py-16">

        {/* Header centré style Duolingo */}
        <div className="text-center mb-14">
          <Image
            src="/mascot.svg"
            alt="Mascotte"
            width={88}
            height={88}
            className="mx-auto mb-6 drop-shadow-md"
          />
          <h1 className="text-3xl font-extrabold text-gray-600 tracking-tight">
            Que veux-tu apprendre aujourd'hui ?
          </h1>
        </div>

        {/* Liste des cours */}
        <List
          courses={courses}
          activeCourseId={userProgress?.activeCourseId}
        />
      </div>
    </div>
  );
};

export default CoursesPage;