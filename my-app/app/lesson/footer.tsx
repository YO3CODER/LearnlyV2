import { useKey, useMedia } from "react-use";
import { CheckCircle, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  onCheck: () => void;
  status: "correct" | "wrong" | "none" | "completed";
  disabled?: boolean;
  lessonId?: number;
  label?: string; // label optionnel pour afficher un texte custom sur le bouton (ex: "Next in 3s…")
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

  // Texte du bouton CTA
  const buttonLabel = () => {
    if (label) return label;          // priorité au label custom (countdown)
    if (status === "none") return "Check";
    if (status === "correct") return "Next →";
    if (status === "wrong") return "Retry";
    if (status === "completed") return "Continue";
  };

  return (
    <footer className={cn(
      "lg:h-[140px] h-[100px] transition-colors duration-300",
      status === "none" && "border-t border-slate-200 bg-white",
      status === "correct" && "bg-emerald-50 border-t-2 border-emerald-200",
      status === "wrong" && "bg-rose-50 border-t-2 border-rose-200",
      status === "completed" && "border-t border-slate-200 bg-white",
    )}>
      <div className="max-w-[1140px] h-full mx-auto flex items-center justify-between px-6 lg:px-10">

        {/* Correct feedback */}
        {status === "correct" && (
          <div className="flex items-center gap-x-3">
            <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle className="h-5 w-5 lg:h-7 lg:w-7 text-emerald-500 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-emerald-600 font-extrabold text-base lg:text-xl tracking-tight">
                Nicely done!
              </p>
              <p className="text-emerald-400 text-xs lg:text-sm font-medium">
                Keep it up 🔥
              </p>
            </div>
          </div>
        )}

        {/* Wrong feedback + countdown visuel */}
        {status === "wrong" && (
          <div className="flex items-center gap-x-3">
            <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
              <XCircle className="h-5 w-5 lg:h-7 lg:w-7 text-rose-500 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-rose-600 font-extrabold text-base lg:text-xl tracking-tight">
                Try again.
              </p>
              <p className="text-rose-400 text-xs lg:text-sm font-medium">
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
            onClick={() => window.location.href = `/lesson/${lessonId}`}
            className="rounded-xl font-bold"
          >
            Practice again
          </Button>
        )}

        {/* CTA button */}
        <Button
          disabled={disabled}
          className={cn(
            "ml-auto rounded-xl font-bold tracking-wide transition-all duration-200",
            status === "correct" && "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-200",
            status === "wrong" && "bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-200 opacity-60",
            status === "none" && "shadow-md",
            status === "completed" && "bg-gradient-to-r from-blue-500 to-blue-500 text-white shadow-md shadow-blue-200 hover:opacity-90",
          )}
          onClick={onCheck}
          size={isMobile ? "sm" : "lg"}
          variant={status === "wrong" ? "danger" : status === "completed" ? "default" : "secondary"}
        >
          {buttonLabel()}
        </Button>

      </div>
    </footer>
  );
};