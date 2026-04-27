import { ExitModal } from "@/components/modals/exit-modal";
import { HeartsModal } from "@/components/modals/hearts-modal";

type Props = {
  children: React.ReactNode;
};

const LessonLayout = ({ children }: Props) => {
  return ( 
    <div className="flex flex-col h-full">
      <ExitModal />
      <HeartsModal />
      <div className="flex flex-col h-full w-full">
        {children}
      </div>
    </div>
  );
};
 
export default LessonLayout;