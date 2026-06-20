import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { getCourses, getUserProgress } from "@/db/queries";
import { List } from "./list";
import { Sidebar } from "@/components/sidebar";
import { MobileNavbar } from "@/components/mobile-navbar";

const CoursesPage = async () => {
  const coursesData = getCourses();
  const userProgressData = getUserProgress();
  const userDataPromise = currentUser();

  const [courses, userProgress, user] = await Promise.all([
    coursesData,
    userProgressData,
    userDataPromise,
  ]);

  const firstName = user?.firstName?.toUpperCase() || "TOI";

  return (
    <div className="min-h-full bg-gray flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:block md:w-[80px] flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 pb-20 md:pb-0">
        <div className="px-6 py-6">
          <div className="text-center mb-2">
            <Image
              src="/mascot.svg"
              alt="Mascotte"
              width={88}
              height={88}
              className="mx-auto mb-4 drop-shadow-md"
            />

            <h1
              style={{ fontFamily: "'Outfit', sans-serif" }}
              className="opacity-0 animate-slide-down text-4xl font-extrabold tracking-tight text-gray-800 dark:text-white"
            >
              Salut{" "}
              <span
                style={{ fontFamily: "'Fredoka', sans-serif" }}
                className="text-sky-400 text-3xl ml-2"
              >
                {firstName}
              </span>
            </h1>

            <p
              style={{ fontFamily: "'Outfit', sans-serif" }}
              className="opacity-0 animate-slide-up text-xl text-gray-600 dark:text-white/70 mt-2"
            >
              Que veux-tu apprendre aujourd'hui ?
            </p>
          </div>

          <List
            courses={courses}
            activeCourseId={userProgress?.activeCourseId}
          />
        </div>
      </div>

      <MobileNavbar />
    </div>
  );
};

export default CoursesPage;