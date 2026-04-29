import { useKey, useMedia } from "react-use";
import { CheckCircle, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  onCheck: () => void;
  status: "correct" | "wrong" | "none" | "completed";
  disabled?: boolean;
  lessonId?: number;
  label?: string;
};

export const Footer = ({
  onCheck,
  status,
  disabled,
  lessonId,
  label,
}: Props) => {
  useKey("Enter", onCheck, {}, [onCheck]);
  const isMobile = useMedia("(max-width: 1024px)");

  const buttonLabel = () => {
    if (label) return label;
    if (status === "none") return "Check";
    if (status === "correct") return "Next →";
    if (status === "wrong") return "Retry";
    if (status === "completed") return "Continue";
  };

  return (
    <footer
      className={cn(
        "lg:h-[140px] h-[100px] transition-colors duration-300 border-t-2",
        status === "none" && "bg-background border-border",
        status === "correct" && "bg-[#1f2b1f] border-[#2e5a2e]",
        status === "wrong" && "bg-[#2a1f1f] border-[#5a2e2e]",
        status === "completed" && "bg-background border-border"
      )}
    >
      <div className="max-w-[1140px] h-full mx-auto flex items-center justify-between px-6 lg:px-10">

        {/* Correct */}
        {status === "correct" && (
          <div className="flex items-center gap-x-3">
            <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-2xl bg-[#2e5a2e] flex items-center justify-center shrink-0">
              <CheckCircle className="h-5 w-5 lg:h-7 lg:w-7 text-green-500 stroke-[2.5]" />
            </div>
            <div>
              <p className="font-extrabold text-base lg:text-xl text-green-500 tracking-tight">
                Nicely done!
              </p>
              <p className="text-xs lg:text-sm font-medium text-green-400">
                Keep it up 🔥
              </p>
            </div>
          </div>
        )}

        {/* Wrong */}
        {status === "wrong" && (
          <div className="flex items-center gap-x-3">
            <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-2xl bg-[#5a2e2e] flex items-center justify-center shrink-0">
              <XCircle className="h-5 w-5 lg:h-7 lg:w-7 text-red-400 stroke-[2.5]" />
            </div>
            <div>
              <p className="font-extrabold text-base lg:text-xl text-red-400 tracking-tight">
                Try again.
              </p>
              <p className="text-xs lg:text-sm font-medium text-red-300">
                {label ?? "You can do it! 💪"}
              </p>
            </div>
          </div>
        )}

        {/* Completed */}
        {status === "completed" && (
          <Button
            variant="default"
            size={isMobile ? "sm" : "lg"}
            onClick={() => (window.location.href = `/lesson/${lessonId}`)}
            className="rounded-xl font-bold border-2 border-b-4 border-slate-600 bg-card hover:bg-border text-white"
          >
            Practice again
          </Button>
        )}

        {/* Main button */}
        <Button
          disabled={disabled}
          onClick={onCheck}
          size={isMobile ? "sm" : "lg"}
          variant="secondary"
          className={cn(
            "ml-auto rounded-xl font-bold tracking-wide transition-all duration-200 border-2 border-b-4",
            status === "none" && "bg-green-500 hover:bg-green-600 text-white border-green-600",
            status === "correct" && "bg-green-500 hover:bg-green-600 text-white border-green-600",
            status === "wrong" && "bg-red-500 hover:bg-red-600 text-white opacity-70 border-red-600",
            status === "completed" && "bg-green-500 hover:bg-green-600 text-white border-green-600"
          )}
        >
          {buttonLabel()}
        </Button>
      </div>
    </footer>
  );
};