import Image from "next/image";
import { getCourses, getUserProgress } from "@/db/queries";
import { List } from "./list";
import { Sidebar } from "@/components/sidebar";
import { MobileNavbar } from "@/components/mobile-navbar";

const CoursesPage = async () => {
  const coursesData = getCourses();
  const userProgressData = getUserProgress();

  const [courses, userProgress] = await Promise.all([
    coursesData,
    userProgressData,
  ]);

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
            <h1 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-3xl font-extrabold text-white-500 tracking-tight">
              Que veux-tu apprendre aujourd'hui ?
            </h1>
          </div>

          <List
            courses={courses}
            activeCourseId={userProgress?.activeCourseId}
          />
        </div>
      </div>

      {/* Mobile Bottom Navbar */}
      <MobileNavbar />
    </div>
  );
};

export default CoursesPage;