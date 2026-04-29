import { Sidebar } from "@/components/sidebar";
import { MobileHeader } from "@/components/mobile-header";
import { MobileNavbar } from "@/components/mobile-navbar";
import { HeartsModal } from "@/components/modals/hearts-modal";
import { PracticeModal } from "@/components/modals/practice-modal";
import { getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

const MainLayout = async ({ children }: Props) => {
  const userProgress = await getUserProgress();

  if (!userProgress?.activeCourse) {
    redirect("/courses");
  }

  return (
    <>
      <HeartsModal />
      <PracticeModal />
      <MobileHeader
        activeCourse={userProgress.activeCourse}
        hearts={userProgress.hearts}
        points={userProgress.points}
        hasActiveSubscription={false}
        streak={userProgress.streak ?? 0}
      />
      <Sidebar className="hidden lg:flex" />
      <main className="lg:pl-[80px] h-full pt-[56px] pb-[60px] lg:pt-0 lg:pb-0">
        <div className="max-w-[1056px] mx-auto pt-6 h-full">
          {children}
        </div>
      </main>
      <MobileNavbar />
    </>
  );
};

export default MainLayout;